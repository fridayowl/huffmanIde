import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, Settings, Download, Copy, Loader2, ChevronDown, Play } from 'lucide-react';
import { createPortal } from 'react-dom';
import { EditorView, basicSetup } from 'codemirror';
import { Extension, EditorState, Compartment } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { tags } from '@lezer/highlight';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';

import TestingPanel from '../TestingPanel';
import { RunPanel } from '../RunButtonPanel';
import { AnalyticsPanel } from '../AnalyticsPanel';
import { DocumentationPanel } from '../DocumentationPanel';
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

// Define custom syntax highlighting
const syntaxHighlightingStyle = HighlightStyle.define([
    { tag: tags.keyword, color: "#FF79C6", fontWeight: "bold" },
    { tag: tags.operator, color: "#FF79C6" },
    { tag: tags.special(tags.variableName), color: "#50FA7B" },
    { tag: tags.string, color: "#F1FA8C" },
    { tag: tags.comment, color: "#6272A4", fontStyle: "italic" },
    { tag: tags.function(tags.variableName), color: "#50FA7B" },
    { tag: tags.function(tags.propertyName), color: "#50FA7B" },
    { tag: tags.bool, color: "#BD93F9" },
    { tag: tags.number, color: "#BD93F9" },
    { tag: tags.className, color: "#8BE9FD", fontWeight: "bold" },
    { tag: tags.definition(tags.propertyName), color: "#50FA7B" },
    { tag: tags.angleBracket, color: "#FF79C6" },
    { tag: tags.typeName, color: "#8BE9FD" },
    { tag: tags.tagName, color: "#FF79C6" },
    { tag: tags.attributeName, color: "#50FA7B" }
]);

// Create compartments for dynamic configuration
const fontSizeCompartment = new Compartment();
const tabSizeCompartment = new Compartment();

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
    // State
    const [content, setContent] = useState(code || '');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [tabSize, setTabSize] = useState(4);
    const [panelsVisible, setPanelsVisible] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [isFromIDE, setIsFromIDE] = useState(false)
    const [blockid, setBlockid] = useState(blockId)
    useEffect(() => {
        if (sourceType === 'ide') {
            setIsFromIDE(true);

        }
    }, [sourceType]);
    // Refs
    const editorRef = useRef<HTMLDivElement | null>(null);
    const editorViewRef = useRef<EditorView | null>(null);



    // Save functionality with success callback
    const handleSave = useCallback(async (): Promise<boolean> => {
        if (!hasUnsavedChanges) return true;

        setIsSaving(true);
        try {
            if (onCodeChange) {
                await onCodeChange(content);

            }
            setHasUnsavedChanges(false);
            return true;
        } catch (error) {
            console.error('Error saving:', error);
            return false;
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    }, [content, hasUnsavedChanges, sourceType, blockId, onCodeChange, onBlockCodeChange]);

    // Run handler with auto-save
    const handleRun = useCallback(async () => {
        setIsRunning(true);
        try {
            // Always attempt to save before running
            let saveSuccess = true;
            if (hasUnsavedChanges) {
                saveSuccess = await handleSave();
                if (!saveSuccess) {
                    const proceed = window.confirm('Failed to save changes. Run anyway?');
                    if (!proceed) {
                        return;
                    }
                }
            }

            // Only execute if either save was successful or user confirmed to proceed
            if (saveSuccess && onRun) {
                onRun();
            }
        } finally {
            setIsRunning(false);
        }
    }, [hasUnsavedChanges, handleSave, onRun]);

    // Enhanced close handler with save
    const handleClose = useCallback(async () => {
        const saveSuccess = await handleSave();
        if (hasUnsavedChanges) {
            const shouldSave = window.confirm('Do you want to save your changes before closing?');
            if (shouldSave) {
                const saveSuccess = await handleSave();
                if (!saveSuccess) {
                    const forcedClose = window.confirm('Failed to save changes. Close anyway?');
                    if (!forcedClose) return;
                }
            }
        }
        onClose();
    }, []);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(content);
    }, [content]);

    // Setup CodeMirror editor
    useEffect(() => {
        if (!editorRef.current || editorViewRef.current) return;

        const customTheme = EditorView.theme({
            '&': {
                backgroundColor: customization.backgroundColor,
                color: customization.textColor,
                height: '100%',
            },
            '.cm-content': {
                caretColor: customization.textColor,
                fontFamily: 'JetBrains Mono, monospace',
                padding: '1rem',
            },
            '.cm-gutters': {
                backgroundColor: `${customization.highlightColor}20`,
                color: customization.lineNumbersColor,
                border: 'none',
                paddingRight: '1rem',
            },
            '.cm-activeLineGutter': {
                backgroundColor: 'transparent',
                color: customization.textColor,
            },
            '.cm-activeLine': {
                backgroundColor: `${customization.highlightColor}10`,
            },
            '.cm-matchingBracket': {
                backgroundColor: `${customization.highlightColor}30`,
                outline: 'none',
            },
            '.cm-selectionMatch': {
                backgroundColor: `${customization.highlightColor}30`,
            },
            '.cm-cursor': {
                borderLeftColor: customization.textColor,
            },
            '.cm-lineNumbers': {
                minWidth: '3em',
            },
        });

        const initEditor = () => {
            const state = EditorState.create({
                doc: content,
                extensions: [
                    basicSetup,
                    python(),
                    customTheme,
                    syntaxHighlighting(syntaxHighlightingStyle),
                    EditorView.lineWrapping,
                    fontSizeCompartment.of(EditorView.theme({
                        '.cm-content': { fontSize: `${fontSize}px` },
                        '.cm-gutters': { fontSize: `${fontSize - 2}px` },
                    })),
                    tabSizeCompartment.of(EditorState.tabSize.of(tabSize)),
                    keymap.of([indentWithTab]),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            const newContent = update.state.doc.toString();
                            setContent(newContent);
                            setHasUnsavedChanges(true);
                        }
                    }),
                ],
            });

            const view = new EditorView({
                state,
                parent: editorRef.current!,
            });

            editorViewRef.current = view;
        };

        initEditor();

        return () => {
            if (editorViewRef.current) {
                editorViewRef.current.destroy();
                editorViewRef.current = null;
            }
        };
    }, []);

    // Update editor configuration when settings change
    useEffect(() => {
        if (!editorViewRef.current) return;

        editorViewRef.current.dispatch({
            effects: [
                tabSizeCompartment.reconfigure(EditorState.tabSize.of(tabSize)),
                fontSizeCompartment.reconfigure(EditorView.theme({
                    '.cm-content': { fontSize: `${fontSize}px` },
                    '.cm-gutters': { fontSize: `${fontSize - 2}px` },
                }))
            ]
        });
    }, [fontSize, tabSize]);

    const handleTabSizeChange = (newSize: number) => {
        if (newSize >= 2 && newSize <= 8) {
            setTabSize(newSize);
        }
    };

    const handleFontSizeChange = (newSize: number) => {
        if (newSize >= 10 && newSize <= 24) {
            setFontSize(newSize);
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]"
            onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className="flex gap-4 items-stretch z-[102]" style={{ width: '95vw', height: '90vh' }}>
                {/* Left side panels */}
                {panelsVisible && (
                    <div className="w-80 flex flex-col gap-4">
                        <DocumentationPanel
                            customization={customization}
                            fileName={fileName}
                            isFromIDE={true}
                            blockId={blockid}
                        />
                        <TestingPanel customization={customization} code={content} fileName={fileName}
                            isFromIDE={true}
                            blockId={blockid} />
                    </div>
                )}

                {/* Main editor */}
                <MainEditor
                    code={content}
                    fileName={fileName}
                    customization={customization}
                    onSave={async (newContent) => {
                        if (onCodeChange) {
                            await onCodeChange(newContent);
                        }
                    }}
                    onClose={handleClose}
                    onCopy={handleCopy}
                    onRun={onRun}
                />
                {/* Right side panels */}
                {panelsVisible && (
                    <div className="w-80 flex flex-col gap-4">
                        <RunPanel
                            customization={customization}
                            code={content}
                            onBeforeRun={handleSave}
                        />
                        <AnalyticsPanel customization={customization} code={content} />
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};


export default IDEDialog;