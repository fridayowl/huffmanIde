import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    X, Save, Settings, Download, Copy,
    Loader2, ChevronDown, Play, Wand2
} from 'lucide-react';
import { EditorView, basicSetup } from 'codemirror';
import { Extension, EditorState, Compartment } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { tags } from '@lezer/highlight';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import CodeGenerationPanel from './CodeGenerationPanel';

interface MainEditorProps {
    code?: string | null;
    fileName?: string;
    customization: {
        backgroundColor: string;
        textColor: string;
        highlightColor: string;
        lineNumbersColor: string;
    };
    onSave: (content: string) => Promise<void>;
    onClose: () => void;
    onCopy?: () => void;
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

const MainEditor: React.FC<MainEditorProps> = ({
    code = '',
    fileName = 'Untitled',
    customization,
    onSave,
    onClose,
    onCopy,
    onRun
}) => {
    // Core state
    const [content, setContent] = useState(code || '');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    // UI state
    const [showSettings, setShowSettings] = useState(false);
    const [showGeneratePanel, setShowGeneratePanel] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [tabSize, setTabSize] = useState(4);

    // Refs
    const editorRef = useRef<HTMLDivElement | null>(null);
    const editorViewRef = useRef<EditorView | null>(null);

    // Handle generated code
    const handleCodeGenerated = useCallback((generatedCode: string) => {
        if (!editorViewRef.current) return;

        const doc = editorViewRef.current.state.doc;
        const transaction = editorViewRef.current.state.update({
            changes: {
                from: doc.length,
                to: doc.length,
                insert: (doc.length > 0 ? '\n\n' : '') + generatedCode
            }
        });

        editorViewRef.current.dispatch(transaction);
        setHasUnsavedChanges(true);
        setShowGeneratePanel(false);
    }, []);

    // Save functionality
    const handleSave = useCallback(async () => {
        if (!hasUnsavedChanges) return;

        setIsSaving(true);
        try {
            await onSave(content);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    }, [content, hasUnsavedChanges, onSave]);

    // Run handler with auto-save
    const handleRun = useCallback(async () => {
        if (!onRun) return;

        setIsRunning(true);
        try {
            if (hasUnsavedChanges) {
                await handleSave();
            }
            await onRun();
        } finally {
            setIsRunning(false);
        }
    }, [hasUnsavedChanges, handleSave, onRun]);

    // Copy handler
    const handleCopy = useCallback(() => {
        if (onCopy) {
            onCopy();
        } else {
            navigator.clipboard.writeText(content);
        }
    }, [content, onCopy]);

    // Handle close with unsaved changes
    const handleClose = useCallback(async () => {
        if (hasUnsavedChanges) {
            const shouldSave = window.confirm('Do you want to save your changes before closing?');
            if (shouldSave) {
                await handleSave();
            }
        }
        onClose();
    }, [hasUnsavedChanges, handleSave, onClose]);

    // CodeMirror setup
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

    return (
        <div className="flex-1 rounded-lg shadow-2xl overflow-hidden transform transition-all"
            style={{
                backgroundColor: customization.backgroundColor,
                border: `1px solid ${customization.highlightColor}20`
            }}>
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b"
                style={{
                    backgroundColor: `${customization.highlightColor}10`,
                    borderColor: `${customization.textColor}10`
                }}>
                <div className="flex items-center gap-3">
                    <span className="font-medium" style={{ color: customization.textColor }}>
                        {fileName}
                    </span>
                    {hasUnsavedChanges && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">
                            Unsaved changes
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {onRun && (
                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="p-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
                            style={{
                                color: customization.textColor,
                                opacity: isRunning ? 0.5 : 1
                            }}>
                            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                            <span className="text-sm">{isRunning ? 'Running...' : 'Run'}</span>
                        </button>
                    )}
                    <button
                        onClick={() => setShowGeneratePanel(true)}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
                        style={{ color: customization.textColor }}
                    >
                        <Wand2 size={16} />
                        <span className="text-sm">Generate</span>
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
                        style={{ color: customization.textColor }}>
                        <Copy size={16} />
                        <span className="text-sm">Copy</span>
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        style={{ color: customization.textColor }}>
                        <Settings size={16} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasUnsavedChanges}
                        className="px-3 py-1.5 rounded flex items-center gap-2"
                        style={{
                            backgroundColor: customization.highlightColor,
                            color: 'white',
                            opacity: (!hasUnsavedChanges || isSaving) ? 0.5 : 1
                        }}>
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded hover:bg-white/5"
                        style={{ color: customization.textColor }}>
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="p-4 border-b"
                    style={{
                        backgroundColor: `${customization.highlightColor}05`,
                        borderColor: `${customization.textColor}10`
                    }}>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <label className="text-sm" style={{ color: customization.textColor }}>
                                Font Size:
                            </label>
                            <input
                                type="number"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                className="w-16 px-2 py-1 rounded bg-black/20 border border-white/10"
                                style={{ color: customization.textColor }}
                                min={10}
                                max={24}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm" style={{ color: customization.textColor }}>
                                Tab Size:
                            </label>
                            <input
                                type="number"
                                value={tabSize}
                                onChange={(e) => setTabSize(Number(e.target.value))}
                                className="w-16 px-2 py-1 rounded bg-black/20 border border-white/10"
                                style={{ color: customization.textColor }}
                                min={2}
                                max={8}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Code Generation Panel */}
            {showGeneratePanel && (
                <CodeGenerationPanel
                    customization={customization}
                    onClose={() => setShowGeneratePanel(false)}
                    onCodeGenerated={handleCodeGenerated}
                />
            )}

            {/* Editor Content */}
            <div className="relative" style={{ height: 'calc(90vh - 56px)' }}>
                <div ref={editorRef} className="h-full w-full" />
            </div>
        </div>
    );
};

export default MainEditor;