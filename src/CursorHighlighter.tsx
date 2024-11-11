import React, { useEffect, useState, useRef } from 'react';

interface CursorHighlighterProps {
    editorRef: React.RefObject<HTMLDivElement>;
    lineHeight: number;
    textColor: string;
}

const CursorHighlighter = ({ editorRef, lineHeight, textColor }: CursorHighlighterProps) => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(true);
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        const updateCursorPosition = () => {
            const selection = window.getSelection();
            if (!selection || !selection.rangeCount || !editorRef.current) return;

            const range = selection.getRangeAt(0);
            const editorRect = editorRef.current.getBoundingClientRect();

            // Create a new range for measurement
            const preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(editorRef.current);
            preSelectionRange.setEnd(range.endContainer, range.endOffset);

            // Get the fragment and create a dummy element to measure
            const fragment = preSelectionRange.cloneContents();
            const dummy = document.createElement('div');
            dummy.appendChild(fragment);
            dummy.style.position = 'absolute';
            dummy.style.visibility = 'hidden';
            dummy.style.whiteSpace = 'pre';
            dummy.style.font = window.getComputedStyle(editorRef.current).font;
            document.body.appendChild(dummy);

            // Calculate position
            const textBeforeCursor = dummy.innerText;
            const lines = textBeforeCursor.split('\n');
            const currentLine = lines[lines.length - 1];

            // Clean up
            document.body.removeChild(dummy);

            // Calculate coordinates relative to editor
            const x = currentLine.length * 7.2; // Approximate character width for monospace
            const y = (lines.length - 1) * lineHeight;

            setCursorPosition({
                x: editorRect.left + x + 16, // 16 for padding
                y: editorRect.top + y + 4 // 4 for fine-tuning
            });
        };

        // Blink animation setup
        const blinkInterval = setInterval(() => {
            setIsVisible(prev => !prev);
        }, 530);

        // Event listeners
        const events = ['keyup', 'click', 'mousemove', 'selectionchange', 'input'];
        events.forEach(event =>
            editorRef.current?.addEventListener(event, updateCursorPosition)
        );

        // Initial position
        updateCursorPosition();

        return () => {
            clearInterval(blinkInterval);
            events.forEach(event =>
                editorRef.current?.removeEventListener(event, updateCursorPosition)
            );
        };
    }, [editorRef, lineHeight]);

    return (
        <div
            ref={cursorRef}
            className="pointer-events-none fixed transition-opacity duration-75"
            style={{
                left: `${cursorPosition.x}px`,
                top: `${cursorPosition.y}px`,
                width: '2px',
                height: `${lineHeight - 4}px`,
                backgroundColor: textColor,
                boxShadow: `
          0 0 4px ${textColor}66,
          0 0 8px ${textColor}44,
          0 0 12px ${textColor}33
        `,
                opacity: isVisible ? 1 : 0,
                transform: 'translateX(-1px)',
                zIndex: 50
            }}
        />
    );
};

export default CursorHighlighter;