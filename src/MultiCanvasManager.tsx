import React, { useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { X, Layout } from 'lucide-react';
import DesignCanvas from './DesignCanvas';
import { DesignCanvasManagerProps, useDesignCanvasManager } from './DesignCanvasManager';

interface CanvasInstance {
    id: string;
    fileName: string;
    fileContent: string;
}

interface MultiCanvasManagerProps {
    onCodeChange: (fileId: string, newContent: string) => void;
}

export interface MultiCanvasManagerHandle {
    addCanvas: (fileName: string, fileContent: string) => void;
}

const MultiCanvasManager = forwardRef<MultiCanvasManagerHandle, MultiCanvasManagerProps>(
    ({ onCodeChange }, ref) => {
        const [canvases, setCanvases] = useState<CanvasInstance[]>([]);
        const [activeCanvasId, setActiveCanvasId] = useState<string | 'workspace'>('workspace');

        const addCanvas = useCallback((fileName: string, fileContent: string) => {
            setCanvases(prev => {
                const existingCanvas = prev.find(canvas => canvas.fileName === fileName);
                if (existingCanvas) {
                    setActiveCanvasId(existingCanvas.id);
                    return prev.map(canvas =>
                        canvas.fileName === fileName
                            ? { ...canvas, fileContent }
                            : canvas
                    );
                } else {
                    const newId = `canvas-${Date.now()}`;
                    setActiveCanvasId(newId);
                    return [...prev, {
                        id: newId,
                        fileName,
                        fileContent
                    }];
                }
            });
        }, []);

        useImperativeHandle(ref, () => ({
            addCanvas
        }), [addCanvas]);

        const removeCanvas = useCallback((canvasId: string) => {
            setCanvases(prev => prev.filter(canvas => canvas.id !== canvasId));
            if (activeCanvasId === canvasId) {
                setActiveCanvasId('workspace');
            }
        }, [activeCanvasId]);

        return (
            <div className="flex flex-col h-full">
                {/* Tabs Bar - Now always visible */}
                <div className="flex items-center h-10 bg-gray-800 px-2 overflow-x-auto">
                    <div
                        className={`
                            flex items-center px-4 py-1 mr-1 rounded-t-lg cursor-pointer
                            transition-all duration-200
                            ${activeCanvasId === 'workspace'
                                ? 'bg-gray-700 text-white shadow-lg border-t-2 border-indigo-500'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700/50'}
                        `}
                        onClick={() => setActiveCanvasId('workspace')}
                    >
                        <Layout
                            size={14}
                            className={`mr-2 ${activeCanvasId === 'workspace'
                                ? 'text-indigo-400'
                                : 'text-gray-400'
                                }`}
                        />
                        <span className={`text-sm font-medium ${activeCanvasId === 'workspace'
                            ? 'text-white'
                            : 'text-gray-400'
                            }`}>
                            Workspace
                            {canvases.length > 0 && ` (${canvases.length})`}
                        </span>
                    </div>

                    {/* Individual Canvas Tabs - Always visible */}
                    {canvases.map(canvas => (
                        <div
                            key={canvas.id}
                            className={`
                                flex items-center px-4 py-1 mr-1 rounded-t-lg cursor-pointer
                                transition-all duration-200
                                ${canvas.id === activeCanvasId
                                    ? 'bg-gray-700 text-white shadow-lg border-t-2 border-indigo-500'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700/50'}
                            `}
                            onClick={() => setActiveCanvasId(canvas.id)}
                        >
                            <div className="flex items-center max-w-xs overflow-hidden">
                                <span className={`text-sm font-medium truncate ${canvas.id === activeCanvasId
                                    ? 'text-white'
                                    : 'text-gray-400'
                                    }`}>
                                    {canvas.fileName}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeCanvas(canvas.id);
                                }}
                                className={`
                                    ml-2 p-1 rounded-full 
                                    hover:bg-gray-600/50 
                                    transition-colors
                                    ${canvas.id === activeCanvasId
                                        ? 'text-white hover:text-red-400'
                                        : 'text-gray-400 hover:text-red-400'
                                    }
                                `}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Canvas Content Area */}
                <div className="flex-1 relative bg-gray-900">
                    {activeCanvasId === 'workspace' ? (
                        <div key={'workspace'} className="absolute inset-0">
                        <WorkspaceCanvas
                            canvases={canvases}
                            onCodeChange={onCodeChange}
                        />
                        </div>
                    ) : (
                        canvases.map(canvas => (
                            canvas.id === activeCanvasId && (
                                <div key={canvas.id} className="absolute inset-0">
                                    <SingleCanvas
                                        canvas={canvas}
                                        onCodeChange={onCodeChange}
                                    />
                                </div>
                            )
                        ))
                    )}
                </div>
            </div>
        );
    }
);

const WorkspaceCanvas: React.FC<{
    canvases: CanvasInstance[];
    onCodeChange: (fileId: string, newContent: string) => void;
}> = ({ canvases, onCodeChange }) => {
    const manager = useDesignCanvasManager({
        selectedFile: canvases.map(c => c.fileContent).join('\n'),
        selectedFileName: 'workspace',
        onCodeChange: (newContent: string) => {
            console.log('Workspace changes:', newContent);
        }
    });

    return (
        <div className="w-full h-full">
            <DesignCanvas
                {...manager}
                canvases={canvases}
                selectedFile={canvases.map(c => c.fileContent).join('\n')}
                selectedFileName="workspace"
                onCodeChange={newContent => {
                    console.log('Workspace changes:', newContent);
                }}
            />
        </div>
    );
};

const SingleCanvas: React.FC<{
    canvas: CanvasInstance;
    onCodeChange: (fileId: string, newContent: string) => void;
}> = ({ canvas, onCodeChange }) => {
    const manager = useDesignCanvasManager({
        selectedFile: canvas.fileContent,
        selectedFileName: canvas.fileName,
        onCodeChange: (newContent: string) => onCodeChange(canvas.fileName, newContent)
    });

    return (
        <div className="w-full h-full">
            <DesignCanvas
                {...manager}
                canvases={canvas}
                selectedFile={canvas.fileContent}
                selectedFileName={canvas.fileName}
                onCodeChange={(newContent) => onCodeChange(canvas.fileName, newContent)}
            />
        </div>
    );
};

export default MultiCanvasManager;