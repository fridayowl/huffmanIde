import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Edit, Save, Info, FileText, TestTube, AlertTriangle, Copy, Wand2, ScrollText, Play } from 'lucide-react';
import { EditorView, ViewUpdate, keymap } from '@codemirror/view';
import { Extension, EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { indentWithTab } from '@codemirror/commands';
import { checkPythonSyntax, SyntaxError } from './pythonsyntaxChecker';
import ComingSoon from './ComingSoon';
import BlockExecutionPanel from './BlockExecutionPannel';
import DocumentationDialog from './DocumentationDialog';
import FocusedTestPanel from './FocusedTestPanel';
import IDEDialog from './IDEDialog/IDEDialog';
import { BlockHeader } from './BlockHeader';
import { getCustomThemeCodeHighlighter } from './customThemeHighlighter';

// Keep your existing interfaces
interface BlockProps {
    id: string;
    type: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function';
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    lineNumber?: number;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    onBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => void;
    customization: any;
    isConnectorVisible?: boolean;
    parentClass?: string;
    initialWidth: number;
    onWidthChange: (width: number) => void;
    onSelect: () => void;
    isSelected: boolean;
    fileName: string;
    isExecutionVisible?: boolean;
    height?: number;
    onHeightChange?: (height: number) => void;
    onTestingPanelChange: (blockId: string, isOpen: boolean) => void;
    isTestingPanelOpen?: boolean;
}

const createSyntaxHighlighting = (customization: any) => {
    // Get the theme name from customization or default to "VSCode Dark+"
    const themeName = customization?.themeName || "VSCode Dark+";
    const themeColors = getCustomThemeCodeHighlighter(themeName);

    return HighlightStyle.define([
        { tag: tags.keyword, color: themeColors.keyword, fontWeight: "bold" },
        { tag: tags.operator, color: themeColors.operator },
        { tag: tags.special(tags.variableName), color: themeColors.variable },
        { tag: tags.string, color: themeColors.string },
        { tag: tags.comment, color: themeColors.comment, fontStyle: "italic" },
        { tag: tags.function(tags.variableName), color: themeColors.function },
        { tag: tags.function(tags.propertyName), color: themeColors.function },
        { tag: tags.bool, color: themeColors.number },
        { tag: tags.number, color: themeColors.number },
        { tag: tags.className, color: themeColors.class, fontWeight: "bold" },
        { tag: tags.definition(tags.propertyName), color: themeColors.property },
        { tag: tags.angleBracket, color: themeColors.operator },
        { tag: tags.typeName, color: themeColors.class },
        { tag: tags.tagName, color: themeColors.tag },
        { tag: tags.attributeName, color: themeColors.attribute }
    ]);
};

 
// Enhanced CodeMirror Editor Component
const CodeMirrorEditor: React.FC<{
    code: string;
    customization: any;
    readOnly?: boolean;
    onChange?: (value: string) => void;
    lineNumbers?: boolean;
}> = ({ code, customization, readOnly = true, onChange, lineNumbers = true }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const editorViewRef = useRef<EditorView | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        // Configure editor theme
        const editorTheme = EditorView.theme({
            '&': {
                backgroundColor: customization.ide?.backgroundColor || '#1E1E1E',
                color: customization.ide?.textColor || '#D4D4D4',
                height: '100%',
            },
            '.cm-content': {
                caretColor: customization.ide?.textColor || '#D4D4D4',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px',
                padding: '0.5rem',
            },
            '.cm-gutters': {
                backgroundColor: `${customization.ide?.backgroundColor || '#1E1E1E'}`,
                color: customization.ide?.lineNumbersColor || '#858585',
                border: 'none',
                paddingRight: '0.5rem',
            },
            '.cm-activeLineGutter': {
                backgroundColor: 'transparent',
                color: customization.ide?.textColor || '#D4D4D4',
            },
            '.cm-activeLine': {
                backgroundColor: `${customization.ide?.highlightColor || '#264F78'}20`,
            },
            '.cm-matchingBracket': {
                backgroundColor: `${customization.ide?.highlightColor || '#264F78'}30`,
                outline: 'none',
            },
            '.cm-selectionMatch': {
                backgroundColor: `${customization.ide?.highlightColor || '#264F78'}30`,
            },
            '.cm-cursor': {
                borderLeftColor: customization.ide?.textColor || '#D4D4D4',
            },
            '.cm-lineNumbers': {
                minWidth: '3em',
            },
        });
        const syntaxHighlightingStyle = createSyntaxHighlighting(customization);

        // Configure extensions
        const extensions: Extension[] = [
            python(),
            editorTheme,
            syntaxHighlighting(syntaxHighlightingStyle),
            EditorView.lineWrapping,
            keymap.of([indentWithTab]),
            EditorView.editable.of(!readOnly),
            EditorState.readOnly.of(readOnly)
        ];

        // Add update listener for changes
        if (!readOnly && onChange) {
            extensions.push(
                EditorView.updateListener.of((update: ViewUpdate) => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                })
            );
        }

        // Create editor state
        const state = EditorState.create({
            doc: code,
            extensions
        });

        // Create and mount editor view
        const view = new EditorView({
            state,
            parent: editorRef.current
        });

        editorViewRef.current = view;

        // Cleanup
        return () => {
            view.destroy();
            editorViewRef.current = null;
        };
    }, [code, customization, readOnly, onChange]);

    return <div ref={editorRef} className="w-full h-full" />;
};

// Default block styles
const defaultBlockStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    textColor: '#000000',
    headerColor: '#f0f0f0'
};

// Main Block Component
const Block: React.FC<BlockProps> = ({
    id,
    type,
    name,
    location,
    author,
    fileType,
    code,
    lineNumber,
    onVisibilityChange,
    onBlockCodeChange,
    customization,
    isConnectorVisible = true,
    parentClass,
    initialWidth,
    onWidthChange,
    onSelect,
    isSelected,
    fileName,
    height,
    onHeightChange,
    onTestingPanelChange,
    isTestingPanelOpen = false,
}) => {
    // State management
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [isDocumentationVisible, setIsDocumentationVisible] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);
    const [calculatedWidth, setCalculatedWidth] = useState(initialWidth);
    const [syntaxErrors, setSyntaxErrors] = useState<SyntaxError[]>([]);
    const [hasSyntaxError, setHasSyntaxError] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [isExecutionVisible, setIsExecutionVisible] = useState(false);
    const [blockHeight, setBlockHeight] = useState(height || 150);
    const [isTestingVisible, setIsTestingVisible] = useState(isTestingPanelOpen);
    const [showIDEDialog, setShowIDEDialog] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const codeRef = useRef<HTMLPreElement>(null);

    // Style
    const blockStyle = customization?.blocks?.[type] || defaultBlockStyle;

    // Handlers
    const handleCodeChange = useCallback((newCode: string) => {
        setCurrentCode(newCode);
        const errors = checkPythonSyntax(newCode);
        const adjustedErrors = errors.map(error => ({
            ...error,
            line: error.line + (lineNumber || 1) - 1
        }));
        setSyntaxErrors(adjustedErrors.filter(error => error.line > 0));
        setHasSyntaxError(adjustedErrors.length > 0);
        onBlockCodeChange(id, newCode.split('\n'), lineNumber || 1);
    }, [id, lineNumber, onBlockCodeChange]);

    // Calculate block height
    const calculateBlockHeight = useCallback(() => {
        let newHeight = 60; // Header height
        const lineCount = currentCode.split('\n').length;
        newHeight += lineCount * 20 + 40;

        if (isDetailsVisible) newHeight += 120;
        if (isDocumentationVisible) newHeight += 300;
        if (isTestingVisible) newHeight += 400;
        if (isExecutionVisible) newHeight += 300;
        if (syntaxErrors.length > 0) {
            newHeight += syntaxErrors.length * 24 + 40;
        }

        return newHeight;
    }, [
        currentCode,
        isDetailsVisible,
        isDocumentationVisible,
        isTestingVisible,
        isExecutionVisible,
        syntaxErrors.length
    ]);

    // Effects
    useEffect(() => {
        setIsTestingVisible(isTestingPanelOpen);
    }, [isTestingPanelOpen]);

    useEffect(() => {
        const newHeight = calculateBlockHeight();
        if (newHeight !== blockHeight) {
            setBlockHeight(newHeight);
            if (onHeightChange) {
                onHeightChange(newHeight);
            }
        }
    }, [calculateBlockHeight, blockHeight, onHeightChange]);

    if (!isConnectorVisible) return null;

    return (
        <div
            ref={containerRef}
            className={`w-full max-w-3xl rounded-lg shadow-md overflow-hidden ${isSelected ? 'ring-4 ring-green-500 shadow-xl shadow-blue-500/50' : ''}`}
            style={{
                backgroundColor: blockStyle.backgroundColor,
                borderColor: hasSyntaxError ? 'red' : blockStyle.borderColor,
                color: blockStyle.textColor,
                borderWidth: '2px',
                borderStyle: 'solid',
                paddingLeft: '20px',
                width: `850px`,
                cursor: 'pointer',
                height: `${blockHeight}px`,
                transition: 'height 0.3s ease-in-out',
                overflow: 'hidden'
            }}
            onClick={onSelect}
        >
            <BlockHeader
                name={name}
                customization={blockStyle}
                onHeaderClick={() => setShowIDEDialog(true)}
            />

            {isDetailsVisible && (
                <div className="px-4 py-2 bg-gray-100" style={{ paddingLeft: '20px' }}>
                    <p className="text-sm">Type: {type}</p>
                    <p className="text-sm">File: {fileType}</p>
                    <p className="text-sm">Location: {location}</p>
                    <p className="text-sm">Author: {author}</p>
                    {lineNumber && <p className="text-sm">Line Number: {lineNumber}</p>}
                    {parentClass && <p className="text-sm">Parent Class: {parentClass}</p>}
                </div>
            )}

            {isVisible && (
                <div className="p-4" style={{ paddingLeft: '20px' }}>
                    <div
                        className="w-full border rounded overflow-hidden"
                        style={{
                            backgroundColor: customization.ide?.backgroundColor || '#f0f0f0',
                        }}
                    >
                        <CodeMirrorEditor
                            code={currentCode}
                            customization={customization}
                            readOnly={!isEditing}
                            onChange={handleCodeChange}
                            lineNumbers={true}
                        />
                    </div>

                    {syntaxErrors.length > 0 && (
                        <div className="mt-4 p-2 bg-red-100 border border-red-400 rounded">
                            <h4 className="font-semibold flex items-center">
                                <AlertTriangle size={16} className="mr-2 text-red-500" />
                                Syntax Errors:
                            </h4>
                            <ul className="list-disc list-inside">
                                {syntaxErrors.map((error, index) => (
                                    <li key={index} className="text-sm text-red-700">
                                        Line {error.line}: {error.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Panels and Dialogs */}
            {isDocumentationVisible && (
                <DocumentationDialog
                    isOpen={isDocumentationVisible}
                    onClose={() => setIsDocumentationVisible(false)}
                    blockId={id}
                    fileName={fileName}
                    customization={customization}
                />
            )}

            {isTestingVisible && (
                <FocusedTestPanel
                    code={currentCode}
                    onClose={() => setIsTestingVisible(false)}
                    customization={customization}
                />
            )}

            {isExecutionVisible && (
                <BlockExecutionPanel
                    code={currentCode}
                    customization={customization}
                    isVisible={isExecutionVisible}
                    onClose={() => setIsExecutionVisible(false)}
                />
            )}

            {showComingSoon && (
                <ComingSoon
                    feature="AI-powered code fixing"
                    onClose={() => setShowComingSoon(false)}
                />
            )}

            {showIDEDialog && (
                <IDEDialog
                    code={currentCode}
                    fileName={`${name} (${fileName})`}
                    onClose={() => setShowIDEDialog(false)}
                    customization={customization.ide}
                    onCodeChange={handleCodeChange}
                    sourceType="block"
                    blockId={id}
                />
            )}
        </div>
    );
};

// Block variants exports
// Block variants exports
export const ClassBlock: React.FC<BlockProps> = (props) => (
    <Block {...props} type="class" />
);

export const FunctionBlock: React.FC<BlockProps> = (props) => (
    <Block {...props} type="class_function" />
);

export const ClassStandaloneBlock: React.FC<BlockProps> = (props) => (
    <Block {...props} type="class_standalone" />
);

export const CodeBlock: React.FC<BlockProps> = (props) => (
    <Block {...props} type="code" />
);

export const StandaloneFunctionBlock: React.FC<BlockProps> = (props) => (
    <Block {...props} type="standalone_function" />
);

export interface BlockInterface {
    ClassBlock: React.FC<BlockProps>;
    FunctionBlock: React.FC<BlockProps>;
    ClassStandaloneBlock: React.FC<BlockProps>;
    CodeBlock: React.FC<BlockProps>;
    StandaloneFunctionBlock: React.FC<BlockProps>;
}

const Blocks: BlockInterface = {
    ClassBlock,
    FunctionBlock,
    ClassStandaloneBlock,
    CodeBlock,
    StandaloneFunctionBlock
};

export default Blocks;