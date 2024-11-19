import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    X, Save, Settings, Download, Copy,
    Loader2, ChevronDown, Play, Wand2
} from 'lucide-react';
import { EditorView, basicSetup } from 'codemirror';
import { Extension, EditorState, Compartment, StateField } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { tags } from '@lezer/highlight';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { Diagnostic } from '@codemirror/lint';
import CodeGenerationPanel from './CodeGenerationPanel';
import { TimeMetricsTracker } from '../health_analytics/timeMetricsTracker';
import { CodingMentalHealthTracker } from '../health_analytics/codingMentalHealthTracker';

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
    onRun?: () => void;
    onContentChange?: (newContent: string) => void;
}

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

const fontSizeCompartment = new Compartment();
const tabSizeCompartment = new Compartment();

// Define diagnostic field for error tracking
const diagnosticField = StateField.define<Diagnostic[]>({
    create() { return []; },
    update(diagnostics, tr) {
        return diagnostics;
    }
});

const MainEditor: React.FC<MainEditorProps> = ({
    code = '',
    fileName = 'Untitled',
    customization,
    onSave,
    onClose,
    onRun,
    onContentChange
}) => {
    const [content, setContent] = useState<string>(code ?? '');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showGeneratePanel, setShowGeneratePanel] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [tabSize, setTabSize] = useState(4);
    const [saveError, setSaveError] = useState<string | null>(null);

    const editorRef = useRef<HTMLDivElement | null>(null);
    const editorViewRef = useRef<EditorView | null>(null);
    const timeTrackerRef = useRef<TimeMetricsTracker | null>(null);
    const mentalHealthTrackerRef = useRef<CodingMentalHealthTracker | null>(null);

    // Update content when prop changes
    useEffect(() => {
        const newContent = code || '';
        if (newContent !== content && editorViewRef.current) {
            const transaction = editorViewRef.current.state.update({
                changes: {
                    from: 0,
                    to: editorViewRef.current.state.doc.length,
                    insert: newContent
                }
            });
            editorViewRef.current.dispatch(transaction);
            setContent(newContent);
        }
    }, [code]);

    // Initialize CodeMirror editor
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

        const state = EditorState.create({
            doc: content || undefined,
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
                diagnosticField,
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        // Handle content changes
                        const newContent = update.state.doc.toString();
                        setContent(newContent);
                        onContentChange?.(newContent);
                        setHasUnsavedChanges(true);

                        // Update metrics
                        timeTrackerRef.current?.recordKeystroke();
                        if (mentalHealthTrackerRef.current) {
                            mentalHealthTrackerRef.current.handleEditorUpdate(update);
                        }
                    }
                }),
            ],
        });

        const view = new EditorView({
            state,
            parent: editorRef.current,
        });

        editorViewRef.current = view;

        // Initialize trackers
        const trackerFileName = fileName || 'untitled';
        timeTrackerRef.current = new TimeMetricsTracker(trackerFileName);
        mentalHealthTrackerRef.current = new CodingMentalHealthTracker(view, trackerFileName);

        return () => {
            timeTrackerRef.current?.endSession();
            mentalHealthTrackerRef.current?.cleanup();
            view.destroy();
            editorViewRef.current = null;
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

    // Track window-level activity
    useEffect(() => {
        const handleActivity = () => {
            timeTrackerRef.current?.recordActivity();
            mentalHealthTrackerRef.current?.recordActivity();
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('mousedown', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('mousedown', handleActivity);
        };
    }, []);

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
        const newContent = editorViewRef.current.state.doc.toString();
        setContent(newContent);
        onContentChange?.(newContent);
        setHasUnsavedChanges(true);
        setShowGeneratePanel(false);
    }, [onContentChange]);

    const handleSave = useCallback(async () => {
        if (!hasUnsavedChanges) return;

        setIsSaving(true);
        setSaveError(null);

        try {
            await onSave(content);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Error saving:', error);
            setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
            throw error;
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    }, [content, hasUnsavedChanges, onSave]);

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

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(content);
    }, [content]);

    const handleClose = useCallback(async () => {
        if (hasUnsavedChanges) {
            const shouldSave = window.confirm('Do you want to save your changes before closing?');
            if (shouldSave) {
                try {
                    await handleSave();
                } catch (error) {
                    const forcedClose = window.confirm('Failed to save changes. Close anyway?');
                    if (!forcedClose) return;
                }
            }
        }
        onClose();
    }, [hasUnsavedChanges, handleSave, onClose]);

    return (
        <div
            className="flex-1 rounded-lg shadow-2xl overflow-hidden transform transition-all"
            style={{
                backgroundColor: customization.backgroundColor,
                border: `1px solid ${customization.highlightColor}20`
            }}>
            {/* Header */}
            <div
                className="flex justify-between items-center px-4 py-3 border-b"
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
                <div
                    className="p-4 border-b"
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

            {/* Error Message */}
            {saveError && (
                <div
                    className="absolute bottom-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg"
                    style={{ zIndex: 50 }}
                >
                    {saveError}
                </div>
            )}

            {/* Activity Status Indicator */}
            <div
                className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                    backgroundColor: `${customization.highlightColor}10`,
                    color: customization.textColor,
                    zIndex: 50
                }}
            >
                {timeTrackerRef.current && (
                    <div className="flex items-center gap-1 text-xs">
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: customization.highlightColor }}
                        />
                        <span>Recording activity</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// Add PropTypes validation if needed
MainEditor.defaultProps = {
    code: '',
    fileName: 'Untitled',
    onRun: undefined,
    onContentChange: undefined,
};

export default MainEditor;