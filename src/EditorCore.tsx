import React from 'react';
import { LineNumbers } from './LineNumbers';
import { PythonIDECustomization } from './types';
import PythonSyntaxHighlighter from './PythonSyntaxHighlighter';

interface EditorCoreProps {
    editorRef: React.RefObject<HTMLDivElement>;
    content: string;
    lineHeight: number;
    contentHeight: number;
    headerHeight: number;
    customization: PythonIDECustomization;
}

export const EditorCore: React.FC<EditorCoreProps> = ({
    editorRef,
    content,
    lineHeight,
    contentHeight,
    headerHeight,
    customization
}) => {
    return (
        <div className="flex flex-grow overflow-auto">
            <LineNumbers
                content={content}
                lineHeight={lineHeight}
                style={{
                    width: '30px',
                    backgroundColor: customization.lineNumbersColor,
                    color: customization.textColor
                }}
            />
            <div
                ref={editorRef}
                className="flex-grow p-4 overflow-auto"
                style={{
                    height: `${contentHeight - headerHeight}px`,
                    backgroundColor: customization.backgroundColor,
                }}
            >
                <PythonSyntaxHighlighter
                    code={content}
                    customization={{
                        backgroundColor: 'transparent',
                        textColor: customization.textColor
                    }}
                />
            </div>
        </div>
    );
};