import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { PythonIDEHandle } from './types';

interface BlockIDESyncHandlerProps {
    onCodeChange: (newCode: string) => void;
    onBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => void;
    pythonIDERef: React.RefObject<PythonIDEHandle>;
}

export interface BlockIDESyncHandle {
    updateBlockCode: (blockId: string, newCode: string[], lineNumber: number) => void;
    updateIDECode: (code: string) => void;
}

export const BlockIDESyncHandler = forwardRef<BlockIDESyncHandle, BlockIDESyncHandlerProps>(({
    onCodeChange,
    onBlockCodeChange,
    pythonIDERef
}, ref) => {
    const codeMapRef = useRef<{ [blockId: string]: string }>({});
    const subBlockMapRef = useRef<{ [parentId: string]: string[] }>({});

    useImperativeHandle(ref, () => ({
        updateBlockCode: (blockId: string, newCode: string[], lineNumber: number) => {
            // Store the new code for this block
            codeMapRef.current[blockId] = newCode.join('\n');

            // Update sub-blocks if this is a parent block
            const subBlocks = findSubBlocks(blockId, newCode.join('\n'));
            if (subBlocks.length > 0) {
                subBlockMapRef.current[blockId] = subBlocks;
            }

            // Update the IDE with both the block and its sub-blocks
            if (pythonIDERef.current) {
                // First update the main block
                pythonIDERef.current.handleBlockCodeChange(blockId, newCode, lineNumber);

                // Then update any sub-blocks
                subBlocks.forEach(subBlock => {
                    const { code, line } = extractSubBlockCode(newCode.join('\n'), subBlock);
                    if (code) {
                        pythonIDERef.current?.handleBlockCodeChange(
                            `${blockId}.${subBlock}`,
                            code.split('\n'),
                            lineNumber + line
                        );
                    }
                });
            }

            // Combine all block codes and update the main IDE
            const combinedCode = Object.values(codeMapRef.current).join('\n\n');
            onCodeChange(combinedCode);
        },

        updateIDECode: (code: string) => {
            // Reset the code map when IDE content changes directly
            codeMapRef.current = {};
            subBlockMapRef.current = {};
            onCodeChange(code);
        }
    }));

    // Helper function to find sub-blocks in a parent block's code
    const findSubBlocks = (parentId: string, code: string): string[] => {
        const subBlocks: string[] = [];
        const lines = code.split('\n');
        let currentIndentation = -1;

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            const indentation = line.length - trimmedLine.length;

            // Set initial indentation for the parent block
            if (currentIndentation === -1 && (trimmedLine.startsWith('class ') || trimmedLine.startsWith('def '))) {
                currentIndentation = indentation;
                return;
            }

            // Look for sub-block definitions
            if (indentation > currentIndentation) {
                if (trimmedLine.startsWith('def ')) {
                    const functionName = trimmedLine.split('def ')[1].split('(')[0].trim();
                    subBlocks.push(functionName);
                } else if (!trimmedLine.startsWith('def ') && trimmedLine.length > 0) {
                    subBlocks.push(`standalone_${index}`);
                }
            }
        });

        return subBlocks;
    };

    // Helper function to extract sub-block code
    const extractSubBlockCode = (parentCode: string, subBlockName: string): { code: string; line: number } => {
        const lines = parentCode.split('\n');
        let extractedLines: string[] = [];
        let startLine = 0;
        let isCapturing = false;
        let indentationLevel = -1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            const indentation = line.length - trimmedLine.length;

            if (!isCapturing) {
                if (subBlockName.startsWith('standalone_')) {
                    const blockIndex = parseInt(subBlockName.split('_')[1]);
                    if (i === blockIndex) {
                        isCapturing = true;
                        indentationLevel = indentation;
                        startLine = i;
                        extractedLines.push(line);
                    }
                } else if (trimmedLine.startsWith(`def ${subBlockName}`)) {
                    isCapturing = true;
                    indentationLevel = indentation;
                    startLine = i;
                    extractedLines.push(line);
                }
            } else {
                if (trimmedLine.length === 0) {
                    extractedLines.push(line);
                } else if (indentation > indentationLevel) {
                    extractedLines.push(line);
                } else {
                    break;
                }
            }
        }

        return {
            code: extractedLines.join('\n'),
            line: startLine
        };
    };

    return null;
});
