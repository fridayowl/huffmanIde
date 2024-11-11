import React from 'react';
import { Play, Eye, EyeOff, X, Maximize2, Code } from 'lucide-react';

interface EditorHeaderProps {
    fileName: string;
    isRunning: boolean;
    isFlowVisible: boolean;
    onRun: () => void;
    onToggleFlow: () => void;
    onClose: () => void;
    style: React.CSSProperties;
    onHeaderClick?: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
    fileName,
    isRunning,
    isFlowVisible,
    onRun,
    onToggleFlow,
    onClose,
    style,
    onHeaderClick
}) => {
    return (
        <div
            className="py-2 px-4 font-semibold flex justify-between items-center relative"
            style={style}
        >
            {/* Clickable filename section with hover effects */}
            <div
                onClick={onHeaderClick}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer 
                         hover:bg-white/10 transition-all duration-300 group"
                role="button"
                aria-label="Click to open in IDE"
            >
                <Code size={16} className="text-blue-400" />
                <span>{fileName}</span>

                {/* Expand indicator that shows on hover */}
                <div className="flex items-center gap-1.5 ml-2 opacity-0 group-hover:opacity-100 
                              transition-all duration-300 bg-blue-500/20 px-2 py-0.5 rounded-full">
                    <Maximize2 size={14} className="text-blue-400" />
                    <span className="text-xs text-blue-400 whitespace-nowrap">Open in IDE</span>
                </div>

                {/* Pulsing dot indicator */}
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 
                              transition-all duration-300 animate-pulse"/>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
                {/* Run Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onRun(); }}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors relative group"
                    disabled={isRunning}
                    title="Run code"
                >
                    <Play
                        size={16}
                        className={`${isRunning ? 'animate-pulse' : ''} 
                                  text-green-400 group-hover:scale-110 transition-transform`}
                    />
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                   text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                        Run code
                    </span>
                </button>

                {/* Toggle Flow Visibility Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFlow(); }}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors relative group"
                    title={isFlowVisible ? "Hide flow" : "Show flow"}
                >
                    {isFlowVisible ? (
                        <Eye size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    ) : (
                        <EyeOff size={16} className="text-gray-400 group-hover:scale-110 transition-transform" />
                    )}
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                   text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                        {isFlowVisible ? "Hide flow" : "Show flow"}
                    </span>
                </button>

                {/* Close Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="p-1.5 rounded hover:bg-red-500/20 transition-colors relative group"
                    title="Close"
                >
                    <X
                        size={16}
                        className="text-red-400 group-hover:scale-110 transition-transform"
                    />
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                   text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                        Close
                    </span>
                </button>
            </div>

            {/* Optional: Add a subtle instruction tooltip */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 
                          text-xs text-gray-400 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 pointer-events-none">
                Click the filename to open in full IDE
            </div>
        </div>
    );
};