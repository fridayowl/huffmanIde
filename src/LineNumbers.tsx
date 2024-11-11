// LineNumbers.tsx
import React from 'react';

interface LineNumbersProps {
    content: string;
    lineHeight: number;
    style: React.CSSProperties;
}

export const LineNumbers: React.FC<LineNumbersProps> = ({ content, lineHeight, style }) => (
    <div className="p-1 text-right select-none" style={style}>
        {content.split('\n').map((_, index) => (
            <div
                key={index}
                style={{
                    height: `${lineHeight}px`,
                    fontSize: '10px',
                    lineHeight: `${lineHeight}px`
                }}
            >
                {index + 1}
            </div>
        ))}
    </div>
);
