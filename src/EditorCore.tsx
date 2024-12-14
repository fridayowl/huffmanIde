import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, Extension } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { PythonIDECustomization } from './types';
import { getCustomThemeCodeHighlighter } from './customThemeHighlighter';
import { lineNumbers } from '@codemirror/view';

interface EditorCoreProps {
    editorRef: React.RefObject<HTMLDivElement>;
    content: string;
    lineHeight: number;
    contentHeight: number;
    headerHeight: number;
    customization: PythonIDECustomization;
    readOnly?: boolean;
    onChange?: (value: string) => void;
}

export const EditorCore: React.FC<EditorCoreProps> = ({
    editorRef,
    content,
    lineHeight,
    contentHeight,
    headerHeight,
    customization,
    readOnly = true,
    onChange
}) => {
    const editorViewRef = useRef<EditorView | null>(null);

    // Create a CodeMirror syntax highlighting theme based on customization
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

    // Initialize CodeMirror editor
    useEffect(() => {
        if (!editorRef.current || editorViewRef.current) return;

        // Configure editor theme with enhanced line number styling
        const editorTheme = EditorView.theme({
            '&': {
                backgroundColor: customization.backgroundColor,
                color: customization.textColor,
                height: '100%',
            },
            '.cm-content': {
                caretColor: customization.textColor,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px',
                lineHeight: `${lineHeight}px`,
                padding: '1rem',
            },
            '.cm-gutters': {
                backgroundColor: customization.backgroundColor,
                color: customization.textColor,
                border: 'none',
                borderRight: `1px solid ${customization.textColor}20`,
                minWidth: '40px',
                display: 'flex',
                justifyContent: 'flex-end',
            },
            '.cm-lineNumbers .cm-gutterElement': {
                padding: '0 8px',
                textAlign: 'right',
                color: `${customization.textColor}80`,
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                userSelect: 'none',
            },
            '.cm-activeLineGutter': {
                backgroundColor: `${customization.highlightColor}10`,
                color: customization.textColor,
            },
            '.cm-activeLine': {
                backgroundColor: `${customization.highlightColor}10`,
            },
            '.cm-selectionMatch': {
                backgroundColor: `${customization.highlightColor}30`,
            },
            '.cm-matchingBracket': {
                backgroundColor: `${customization.highlightColor}30`,
                outline: 'none',
            },
            '.cm-cursor': {
                borderLeftColor: customization.textColor,
            },
            '&.cm-focused': {
                outline: 'none',
            },
            '.cm-line': {
                padding: '0 4px',
            },
            '.cm-scroller': {
                fontFamily: 'JetBrains Mono, monospace',
            },
            '.cm-tooltip': {
                backgroundColor: customization.backgroundColor,
                border: `1px solid ${customization.textColor}20`,
                borderRadius: '4px',
            },
            '.cm-tooltip-autocomplete': {
                '& > ul > li': {
                    padding: '4px 8px',
                },
                '& > ul > li[aria-selected]': {
                    backgroundColor: `${customization.highlightColor}30`,
                },
            },
        });

        const syntaxHighlightingStyle = createSyntaxHighlighting(customization);

        // Configure extensions
        const extensions: Extension[] = [
            basicSetup,
            python(),
            editorTheme,
            syntaxHighlighting(syntaxHighlightingStyle),
            EditorView.lineWrapping,
            lineNumbers(),
            EditorState.readOnly.of(readOnly)
        ];

        // Add update listener for changes
        if (!readOnly && onChange) {
            extensions.push(
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                })
            );
        }

        // Create editor state
        const state = EditorState.create({
            doc: content,
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
    }, [content, customization, lineHeight, readOnly, onChange]);

    return (
        <div className="flex flex-grow overflow-auto">
            <div
                ref={editorRef}
                className="flex-grow p-4 overflow-auto"
                style={{
                    height: `${contentHeight - headerHeight}px`,
                    backgroundColor: customization.backgroundColor,
                }}
            />
        </div>
    );
};