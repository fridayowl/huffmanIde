import React from 'react';

interface CircularTimerProps {
    progress: number;
    size?: number;
    color: string;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
    progress,
    size = 60,
    color
}) => (
    <svg className="transform -rotate-90" width={size} height={size}>
        <circle
            cx={size / 2}
            cy={size / 2}
            r={(size / 2) - 4}
            fill="none"
            stroke="#1f2937"
            strokeWidth="4"
        />
        <circle
            cx={size / 2}
            cy={size / 2}
            r={(size / 2) - 4}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={`${progress * 2 * Math.PI * ((size / 2) - 4)} ${2 * Math.PI * ((size / 2) - 4)}`}
            className="transition-all duration-1000"
        />
    </svg>
);
