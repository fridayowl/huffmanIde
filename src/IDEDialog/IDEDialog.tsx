// IDEDialog.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import TestingPanel from './TestingPanel';
import { RunPanel } from './RunButtonPanel';
import { AnalyticsPanel } from './AnalyticsPanel';
import { DocumentationPanel } from './DocumentationPanel';
import MainEditor from './MainEditor';

interface IDEDialogProps {
    code?: string | null;
    fileName?: string;
    onClose: () => void;
    customization: {
        backgroundColor: string;
        textColor: string;
        highlightColor: string;
        lineNumbersColor: string;
    };
    onCodeChange?: (newCode: string) => void;
    sourceType?: 'ide' | 'block';
    blockId: string;
    onBlockCodeChange?: (id: string, newCode: string[], lineNumber: number) => void;
    onRun?: () => void;
}

const IDEDialog: React.FC<IDEDialogProps> = ({
    code = '',
    fileName = 'Untitled',
    onClose,
    customization,
    onCodeChange,
    sourceType,
    blockId,
    onBlockCodeChange,
    onRun
}) => {
    // Core state
    const [content, setContent] = useState<string>(code ?? '');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [panelsVisible, setPanelsVisible] = useState(true);
    const [isFromIDE, setIsFromIDE] = useState(false);

    // Effect to set IDE source type
    useEffect(() => {
        if (sourceType === 'ide') {
            setIsFromIDE(true);
        }
    }, [sourceType]);

    // Effect to sync with code prop changes
    useEffect(() => {
        const newContent = code ?? '';
        if (newContent !== content) {
            setContent(newContent);
            setHasUnsavedChanges(false);
        }
    }, [code]);

    // Content change handler
    const handleContentChange = useCallback((newContent: string) => {
        setContent(newContent);
        setHasUnsavedChanges(true);
    }, []);

    // Save functionality
    const handleSave = useCallback(async (): Promise<void> => {
        if (!hasUnsavedChanges) return;

        setIsSaving(true);
        try {
            if (onCodeChange) {
                await onCodeChange(content);  // Wait for this to complete
            }
            if (sourceType === 'block' && onBlockCodeChange) {
                const lines = content.split('\n');
                await onBlockCodeChange(blockId, lines, 0);  // Wait for this to complete
            }
            setHasUnsavedChanges(false);
            return Promise.resolve();  // Explicitly return resolved promise
        } catch (error) {
            console.error('Error saving:', error);
            return Promise.reject(error);  // Properly reject the promise
        } finally {
            setIsSaving(false);
        }
    }, [content, hasUnsavedChanges, sourceType, blockId, onCodeChange, onBlockCodeChange]);

    // Run handler
    const handleRun = useCallback(async () => {
        if (!onRun) return;

        setIsRunning(true);
        try {
            await handleSave();
            await onRun();
        } catch (error) {
            console.error('Error during run:', error);
            const proceed = window.confirm('Failed to save changes. Run anyway?');
            if (proceed) {
                await onRun();
            }
        } finally {
            setIsRunning(false);
        }
    }, [handleSave, onRun]);

    // Dialog close handler
    const handleClose = useCallback(async (e?: React.MouseEvent) => {
        // If event exists, only close if clicking the backdrop
        if (e && e.target !== e.currentTarget) return;

        if (hasUnsavedChanges) {
            const shouldSave = window.confirm('Do you want to save your changes before closing?');
            if (shouldSave) {
                try {
                    await handleSave();
                } catch (error) {
                    console.error('Error saving before close:', error);
                    const forcedClose = window.confirm('Failed to save changes. Close anyway?');
                    if (!forcedClose) return;
                }
            }
        }
        onClose();
    }, [hasUnsavedChanges, handleSave, onClose]);

    return createPortal(
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]"
            onClick={handleClose}
        >
            <div
                className="flex gap-4 items-stretch z-[102]"
                style={{ width: '95vw', height: '90vh' }}
                onClick={e => e.stopPropagation()} // Prevent clicks inside from closing
            >
                {/* Left side panels */}
                {panelsVisible && (
                    <div className="w-80 flex flex-col gap-4">
                        <DocumentationPanel
                            code={content}
                            customization={customization}
                            fileName={fileName}
                            isFromIDE={true}
                            blockId={blockId}
                        />
                        <TestingPanel
                            customization={customization}
                            code={content}
                            fileName={fileName}
                            isFromIDE={true}
                            blockId={blockId}
                        />
                    </div>
                )}

                {/* Main editor */}
                <MainEditor
                    code={content}
                    fileName={fileName}
                    customization={customization}
                    onSave={handleSave}
                    onClose={handleClose}
                    onRun={handleRun}
                    onContentChange={handleContentChange}
                />

                {/* Right side panels */}
                {panelsVisible && (
                    <div className="w-80 flex flex-col gap-4">
                        <RunPanel
                            customization={customization}
                            code={content}
                            
                            isRunning={isRunning}
                            setIsRunning={setIsRunning}
                        />
                        <AnalyticsPanel
                            customization={customization}
                            code={content}
                        />
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default IDEDialog;