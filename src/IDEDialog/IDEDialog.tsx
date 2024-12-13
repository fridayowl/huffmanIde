import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { PanelLeft, PanelRight, FileText, TestTube, PlayCircle, BarChart } from 'lucide-react';
import TestingPanel from './TestingPanel';
import { RunPanel } from './RunButtonPanel';
import { DocumentationPanel } from './DocumentationPanel';
import MainEditor from './MainEditor';
import AnalyticsPanel from './AnalyticsPanel';

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

interface PanelControlProps {
    side: 'left' | 'right';
    isVisible: boolean;
    onToggle: () => void;
    icons: typeof FileText[];
    labels: string[];
    customization: IDEDialogProps['customization'];
    panelWidth: number;
}

const PanelControl: React.FC<PanelControlProps> = ({
    side,
    isVisible,
    onToggle,
    icons,
    labels,
    customization,
    panelWidth
}) => (
    <div
        className={`absolute ${side}-0 top-20 flex flex-col gap-2 z-50`}
        style={{
            transform: `translateX(${side === 'left' ? (isVisible ? panelWidth : 0) : (isVisible ? -panelWidth : 0)}px)`,
            transition: 'transform 0.3s ease'
        }}
    >
        {icons.map((Icon, index) => (
            <button
                key={index}
                onClick={onToggle}
                className="group relative flex items-center p-2 rounded-lg shadow-lg hover:opacity-90 transition-opacity"
                style={{
                    backgroundColor: customization.backgroundColor,
                    border: `1px solid ${customization.textColor}20`,
                    borderLeft: side === 'left' ? 'none' : undefined,
                    borderRight: side === 'right' ? 'none' : undefined,
                    borderRadius: side === 'left' ? '0 8px 8px 0' : '8px 0 0 8px'
                }}
            >
                <Icon size={16} style={{ color: customization.textColor }} />
                <span
                    className={`absolute ${side === 'left' ? 'left-full ml-2' : 'right-full mr-2'} 
                              whitespace-nowrap px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity`}
                    style={{
                        backgroundColor: customization.backgroundColor,
                        color: customization.textColor,
                        border: `1px solid ${customization.textColor}20`
                    }}
                >
                    Toggle {labels[index]}
                </span>
            </button>
        ))}
    </div>
);

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
    const [isFromIDE, setIsFromIDE] = useState(false);

    // Panel visibility state
    const [leftPanelVisible, setLeftPanelVisible] = useState(true);
    const [rightPanelVisible, setRightPanelVisible] = useState(true);

    // Layout constants
    const PANEL_WIDTH = 320; // Width of side panels in pixels
    const PANEL_GAP = 16; // Gap between panels in pixels

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

    const handleContentChange = useCallback((newContent: string) => {
        setContent(newContent);
        setHasUnsavedChanges(true);
    }, []);

    const handleSave = useCallback(async (): Promise<void> => {
        if (!hasUnsavedChanges) return;

        setIsSaving(true);
        try {
            if (onCodeChange) {
                await onCodeChange(content);
            }
            if (sourceType === 'block' && onBlockCodeChange) {
                const lines = content.split('\n');
                await onBlockCodeChange(blockId, lines, 0);
            }
            setHasUnsavedChanges(false);
            return Promise.resolve();
        } catch (error) {
            console.error('Error saving:', error);
            return Promise.reject(error);
        } finally {
            setIsSaving(false);
        }
    }, [content, hasUnsavedChanges, sourceType, blockId, onCodeChange, onBlockCodeChange]);

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

    const handleClose = useCallback(async (e?: React.MouseEvent) => {
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
                className="relative mx-auto"
                style={{
                    width: '95vw',
                    height: '90vh',
                    maxWidth: `calc(100vw - ${PANEL_GAP * 2}px)`,
                    margin: `${PANEL_GAP}px`
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Left Panel Controls */}
                <PanelControl
                    side="left"
                    isVisible={leftPanelVisible}
                    onToggle={() => setLeftPanelVisible(prev => !prev)}
                    icons={[FileText, TestTube]}
                    labels={['Documentation Panel', 'Testing Panel']}
                    customization={customization}
                    panelWidth={PANEL_WIDTH}
                />

                {/* Right Panel Controls */}
                <PanelControl
                    side="right"
                    isVisible={rightPanelVisible}
                    onToggle={() => setRightPanelVisible(prev => !prev)}
                    icons={[PlayCircle, BarChart]}
                    labels={['Execution Panel', 'Analytics Panel']}
                    customization={customization}
                    panelWidth={PANEL_WIDTH}
                />

                {/* Main Layout */}
                <div className="flex h-full">
                    {/* Left Panel */}
                    <div
                        className="flex flex-col gap-4 transition-all duration-300 ease-in-out overflow-hidden"
                        style={{
                            width: leftPanelVisible ? PANEL_WIDTH : 0,
                            opacity: leftPanelVisible ? 1 : 0,
                            marginRight: leftPanelVisible ? PANEL_GAP : 0,
                        }}
                    >
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

                    {/* Main Editor */}
                    <div className="flex-1 min-w-0">
                        <MainEditor
                            code={content}
                            fileName={fileName}
                            customization={customization}
                            onSave={handleSave}
                            onClose={handleClose}
                            onRun={handleRun}
                            onContentChange={handleContentChange}
                        />
                    </div>

                    {/* Right Panel */}
                    <div
                        className="flex flex-col gap-4 transition-all duration-300 ease-in-out overflow-hidden"
                        style={{
                            width: rightPanelVisible ? PANEL_WIDTH : 0,
                            opacity: rightPanelVisible ? 1 : 0,
                            marginLeft: rightPanelVisible ? PANEL_GAP : 0,
                        }}
                    >
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
                </div>
            </div>
        </div>,
        document.body
    );
};

export default IDEDialog;