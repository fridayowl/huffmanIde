import { useCallback } from 'react';

export const useCursorManagement = (editorRef: React.RefObject<HTMLDivElement>) => {
    const getCursorPosition = useCallback(() => {
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount || !editorRef.current) return null;

        const range = selection.getRangeAt(0);
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(editorRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);

        const text = preSelectionRange.toString();
        const lines = text.split('\n');
        const currentLine = lines[lines.length - 1] || '';
        const indentation = currentLine.match(/^\s*/)?.[0]?.length || 0;

        return {
            position: text.length,
            selection: {
                start: text.length,
                end: text.length + range.toString().length
            },
            lineNumber: lines.length,
            column: currentLine.length,
            indentation
        };
    }, [editorRef]);

    const setCursorPosition = useCallback((position: number, selectionEnd?: number) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        const range = document.createRange();
        let currentPos = 0;
        let startNode: Node | null = null;
        let startOffset = 0;
        let endNode: Node | null = null;
        let endOffset = 0;

        function traverseNodes(node: Node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const length = node.textContent?.length || 0;

                if (currentPos <= position && position <= currentPos + length) {
                    startNode = node;
                    startOffset = position - currentPos;
                }

                if (selectionEnd !== undefined && currentPos <= selectionEnd && selectionEnd <= currentPos + length) {
                    endNode = node;
                    endOffset = selectionEnd - currentPos;
                }

                currentPos += length;
            } else {
                for (const child of Array.from(node.childNodes)) {
                    traverseNodes(child);
                }
            }
        }

        traverseNodes(editorRef.current);

        if (startNode && selection) {
            range.setStart(startNode, startOffset);
            if (selectionEnd !== undefined && endNode) {
                range.setEnd(endNode, endOffset);
            } else {
                range.setEnd(startNode, startOffset);
            }
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, [editorRef]);

    return { getCursorPosition, setCursorPosition };
};