import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Settings as SettingsIcon, X, Info, Layers, Keyboard, LogsIcon, Share2 } from 'lucide-react';
import { useDesignCanvasManager } from './DesignCanvasManager';
import CanvasGrid from './CanvasGrid';
import SettingsPanel from './Settings';
import BlocksListPanel from './BlocksListPanel';
import KeyboardShortcutsPanel from './KeyboardShortcutsPannel';
import ShareFlow from './ShareFlow';
import ComingSoon from './ComingSoon';
import ShowIDEBlock from './ShowIDeComponent';
import defaultCustomization from './customization.json';
import { Connection, ExtendedBlockData, PythonIDEHandle, Template } from './types';
import { useKeyboardNavigation } from './KeyboardNavigation';
import CanvasInfoPanel from './CanvasInfoPanel';
import customTemplates from './customTemplates';
import CanvasContainer from './CanvasContainer';
import { listen } from '@tauri-apps/api/event';
import { window as tauriWindow } from '@tauri-apps/api';
import OllamaStatusButton from './ai_integration/OllamaStatusButton';


interface CanvasData {
    id: string;
    fileContent: string;
    fileName: string;
}

interface CanvasManagerState {
    [key: string]: {
        blocks: ExtendedBlockData[];
        connections: Connection[];
        isFlowVisible: boolean;
        zoomLevel: number;
        canvasSize: { width: number; height: number };
        idePosition: { x: number; y: number };
        ideContent: string;
        pythonIDERef: React.RefObject<PythonIDEHandle>;
        refreshKey: number;
        selectedBlockId: string | null;
        activeTestingPanel: string | null;
        handlePositionChange: (id: string, x: number, y: number) => void;
        handleConnectionVisibilityChange: (connectionId: string, isVisible: boolean, connectionType: string) => void;
        handleCodeChange: (newContent: string) => void;
        handleBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => void;
        handleBlockSelect: (blockId: string) => void;
        handleBlockVisibilityToggle: (id: string) => void;
        handleBlockWidthChange: (id: string, newWidth: number) => void;
        getVisibleBlocks: () => ExtendedBlockData[];
        getVisibleConnections: () => Connection[]; 
        setIsFlowVisible: (visible: boolean) => void;
        handleTestingPanelChange: (blockId: string, isOpen: boolean) => void;
    };
}


interface DesignCanvasProps {
    canvases: CanvasData | CanvasData[];
    selectedFile: string | null;
    selectedFileName: string | null;
    onCodeChange: (newContent: string) => void;
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({ selectedFile, selectedFileName, onCodeChange, canvases }) => {
    // Get canvas manager functionality

    const baseManager = useDesignCanvasManager({
        selectedFile: Array.isArray(canvases) ? canvases[0]?.fileContent : canvases?.fileContent,
        selectedFileName: Array.isArray(canvases) ? canvases[0]?.fileName : canvases?.fileName,
        onCodeChange,
    });
    
    const canvasManagers = useMemo(() => {
        const managers: CanvasManagerState = {};

        if (!baseManager?.getVisibleBlocks || !baseManager?.getVisibleConnections) {
            return managers;
        }

        if (Array.isArray(canvases)) {
            canvases.forEach((canvas) => {
                const key = canvas.fileName || `canvas-${canvas.id}`;
                managers[key] = {
                    ...baseManager,
                    blocks: [],
                    connections: [],
                    pythonIDERef: React.createRef<PythonIDEHandle>(),
                    refreshKey: 0,
                    ideContent: canvas.fileContent,
                    getVisibleBlocks: baseManager.getVisibleBlocks.bind(baseManager),
                    getVisibleConnections: baseManager.getVisibleConnections.bind(baseManager),
                };
            });
        } else if (canvases) {
            const key = canvases.fileName || 'single-canvas';
            managers[key] = {
                ...baseManager,
                ideContent: canvases.fileContent,
                getVisibleBlocks: baseManager.getVisibleBlocks.bind(baseManager),
                getVisibleConnections: baseManager.getVisibleConnections.bind(baseManager),
            };
        }

        return managers;
    }, [baseManager, canvases]); // Dependencies for useMemo


    const {
        blocks,
        connections,
        isFlowVisible,
        zoomLevel,
        canvasSize,
        idePosition,
        autoZoom,
        ideContent,
        pythonIDERef,
        refreshKey,
        selectedBlockId,
        activeTestingPanel,  // Now using activeTestingPanel instead of testingPanels
        handlePositionChange,
        handleConnectionVisibilityChange,
        handleCodeChange,
        handleBlockCodeChange,
        handleBlockSelect: managerHandleBlockSelect,
        handleBlockVisibilityToggle,
        handleBlockWidthChange,
        getVisibleBlocks,
        getVisibleConnections,
        setZoomLevel,
        setIsFlowVisible,
        toggleAutoZoom,
        handleTestingPanelChange,
    } = useDesignCanvasManager({ selectedFile, selectedFileName, onCodeChange });

    // Local state
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
    const [isTemplatesPanelOpen, setIsTemplatesPanelOpen] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [isBlocksListOpen, setIsBlocksListOpen] = useState(false);
    const [isKeyboardShortcutsPanelOpen, setIsKeyboardShortcutsPanelOpen] = useState(false);
    const [isLogsListOpen, setIsLogsListOpen] = useState(false);
    const [isIDEVisible, setIsIDEVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const previousZoomRef = useRef(zoomLevel);

    const [customization, setCustomization] = useState(() => {
        const savedCustomization = localStorage.getItem('customization');
        return savedCustomization ? JSON.parse(savedCustomization) : defaultCustomization;
    });
    const [pendingScroll, setPendingScroll] = useState<{ x: number; y: number } | null>(null);

    const canvasRef = useRef<HTMLDivElement>(null);


    console.log("canvases", canvases)
    // Effect for handling scrolling
    useEffect(() => {
        if (pendingScroll && canvasRef.current) {
            canvasRef.current.scrollTo({
                left: pendingScroll.x,
                top: pendingScroll.y,
                behavior: 'smooth'
            });
            setPendingScroll(null);
        }
    }, [pendingScroll]);

    // Panel handlers
    const handleCustomizationChange = (newCustomization: any) => {
        setCustomization(newCustomization);
        localStorage.setItem('customization', JSON.stringify(newCustomization));
    };

    const handleTemplateChange = (template: Template) => {
        setCustomization(template);
        localStorage.setItem('customization', JSON.stringify(template));
        setIsTemplatesPanelOpen(false);
    };

    // Zoom handlers
    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.2));
    const handleZoomReset = () => setZoomLevel(0.5);


    // Block selection handler
    const handleBlockSelect = (blockId: string) => {
        const result = managerHandleBlockSelect(blockId);
        if (result) {
            const { newZoom, scrollPosition } = result;
            setZoomLevel(newZoom);
            setPendingScroll(scrollPosition);
        }
    };

    // IDE visibility handler
    const handleIDEClose = () => setIsIDEVisible(false);

    // Pan handler for keyboard navigation
    const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (canvasRef.current) {
            const scrollAmount = 100;
            switch (direction) {
                case 'up':
                    canvasRef.current.scrollTop -= scrollAmount;
                    break;
                case 'down':
                    canvasRef.current.scrollTop += scrollAmount;
                    break;
                case 'left':
                    canvasRef.current.scrollLeft -= scrollAmount;
                    break;
                case 'right':
                    canvasRef.current.scrollLeft += scrollAmount;
                    break;
            }
        }
    };
    const handleEditingStateChange = useCallback((editing: boolean) => {
        setIsEditing(editing);
        if (editing) {
            console.log("called")
            setZoomLevel(1)
        }
    }, [zoomLevel]);
    useEffect(() => {
        if (isEditing) {
            setZoomLevel(previousZoomRef.current);
        }
    }, [isEditing]);


    // Keyboard navigation
    const { currentIndex, currentType } = useKeyboardNavigation({
        blocks,
        onBlockSelect: handleBlockSelect,
        onBlockVisibilityToggle: handleBlockVisibilityToggle,
        onZoomIn: handleZoomIn,
        onZoomOut: handleZoomOut,
        onResetZoom: handleZoomReset,
        onPan: handlePan,
        onToggleSettingsPanel: () => setIsSettingsPanelOpen(prev => !prev)
    });
    


    // Template card component
    const TemplateCard: React.FC<{ template: Template; onSelect: (template: Template) => void }> = ({ template, onSelect }) => (
        <div
            className="w-30 h-40 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSelect(template)}
        >
            <div className="h-2/3 p-2 flex flex-col justify-between" style={{ backgroundColor: template.canvas?.backgroundColor || '#ffffff' }}>
                <div className="flex justify-between">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: template.blocks?.class?.backgroundColor || '#cccccc' }} />
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: template.blocks?.class_function?.backgroundColor || '#aaaaaa' }} />
                </div>
                <div className="w-full h-1 rounded-full" style={{ backgroundColor: template.connections?.inherits?.lineColor || '#000000' }} />
            </div>
            <div className="h-1/3 p-2 flex flex-col justify-between bg-white">
                <h3 className="font-bold text-xs">{template.name}</h3>
                <p className="text-xs text-gray-600">Click to apply</p>
            </div>
        </div>
    );

    return (
        <div className="w-full h-screen bg-[#1a1f2d] p-4">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4 bg-[#1a1f2d] p-4 border border-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomIn}
                        className="group relative p-2 bg-[#2b3240] text-gray-400 rounded-lg overflow-hidden hover:-translate-y-0.5 hover:text-indigo-400 transition-all duration-300"
                        title="Zoom In"
                    >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-lg bg-indigo-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <ZoomIn size={20} className="relative z-10" />
                    </button>

                    <button
                        onClick={handleZoomOut}
                        className="group relative p-2 bg-[#2b3240] text-gray-400 rounded-lg overflow-hidden hover:-translate-y-0.5 hover:text-indigo-400 transition-all duration-300"
                        title="Zoom Out"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 rounded-lg bg-indigo-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <ZoomOut size={20} className="relative z-10" />
                    </button>

                    <button
                        onClick={handleZoomReset}
                        className="group relative p-2 bg-[#2b3240] text-gray-400 rounded-lg overflow-hidden hover:-translate-y-0.5 hover:text-indigo-400 transition-all duration-300"
                        title="Reset Zoom"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 rounded-lg bg-indigo-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <RotateCcw size={20} className="relative z-10" />
                    </button>

                    <button
                        onClick={toggleAutoZoom}
                        className={`group relative p-2 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-0.5
                ${autoZoom
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-[#2b3240] text-gray-400 hover:text-indigo-400'
                            }`}
                        title={autoZoom ? "Disable Auto-Zoom" : "Enable Auto-Zoom"}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 rounded-lg bg-indigo-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10">Auto</span>
                    </button>

                    <span className="ml-4 text-gray-400">Zoom: {Math.round(zoomLevel * 100)}%</span>
                </div>
 


                <div className="flex items-center gap-2">

                    <OllamaStatusButton/>
                    <ShareFlow canvasRef={canvasRef} />

                    {/* Primary blue buttons - using the same blue shade as in the UI */}
                    <button
                        onClick={() => setIsLogsListOpen(true)}
                        className="group relative px-4 py-2 bg-blue-600 text-white rounded-lg overflow-hidden hover:-translate-y-0.5 transition-all duration-300"
                        title="Logs"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 rounded-lg bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex items-center">
                            <LogsIcon size={16} className="mr-2" />
                            <span className="text-sm">Logs</span>
                        </div>
                    </button>

                    <button
                        onClick={() => setIsBlocksListOpen(true)}
                        className="group relative px-4 py-2 bg-blue-600 text-white rounded-lg overflow-hidden hover:-translate-y-0.5 transition-all duration-300"
                        title="Show Blocks List"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 rounded-lg bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex items-center">
                            <Layers size={16} className="mr-2" />
                            <span className="text-sm">Blocks</span>
                        </div>
                    </button>

                    {/* Dark background buttons - using more accurate dark shades */}
                    <button
                        onClick={() => setIsKeyboardShortcutsPanelOpen(true)}
                        className="group relative p-2 bg-[#1e1e2d] text-gray-400 rounded-lg overflow-hidden hover:-translate-y-0.5 hover:text-blue-400 transition-all duration-300"
                        title="Keyboard Shortcuts"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 rounded-lg bg-blue-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <Keyboard size={20} />
                        </div>
                    </button>

                    <button
                        onClick={() => setIsTemplatesPanelOpen(true)}
                        className="group relative px-4 py-2 bg-[#1e1e2d] text-gray-400 rounded-lg overflow-hidden hover:-translate-y-0.5 hover:text-blue-400 transition-all duration-300"
                        title="Themes"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 rounded-lg bg-blue-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <span className="text-sm">Themes</span>
                        </div>
                    </button>

                    <button
                        onClick={() => setIsSettingsPanelOpen(true)}
                        className="group relative p-2 bg-[#1e1e2d] text-gray-400 rounded-lg overflow-hidden hover:-translate-y-0.5 hover:text-blue-400 transition-all duration-300"
                        title="Open Settings"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 rounded-lg bg-blue-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <SettingsIcon size={20} />
                        </div>
                    </button>

                    <button
                        onClick={() => setIsInfoPanelOpen(true)}
                        className="group relative p-2 bg-[#1e1e2d] text-gray-400 rounded-lg overflow-hidden hover:-translate-y-0.5 hover:text-blue-400 transition-all duration-300"
                        title="Open Canvas Info"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 rounded-lg bg-blue-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <Info size={20} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Canvas area */}
            <div className="flex"> 
                 <CanvasContainer
                    ref={canvasRef}
                    customization={customization}
                    zoomLevel={zoomLevel}
                >
                    {isIDEVisible ? (
                        <div style={{
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: 'top left',
                            transition: 'transform 0.3s ease-in-out',
                            width: `${canvasSize.width}px`,
                            height: `${canvasSize.height}px`,
                        }}>
                            {Object.entries(canvasManagers).map(([key, manager]) => (
                                <CanvasGrid
                                    key={key}
                                    zoomLevel={zoomLevel}
                                    customization={customization}
                                    pythonIDERef={manager.pythonIDERef}
                                    blocks={manager.blocks}
                                    connections={manager.getVisibleConnections()}
                                    isFlowVisible={manager.isFlowVisible}
                                    onPositionChange={manager.handlePositionChange}
                                    onVisibilityChange={manager.handleBlockVisibilityToggle}
                                    getVisibleBlocks={manager.getVisibleBlocks}
                                    getVisibleConnections={manager.getVisibleConnections}
                                    fileContent={manager.ideContent}
                                    fileName={key}
                                    onCodeChange={manager.handleCodeChange}
                                    onBlockCodeChange={manager.handleBlockCodeChange}
                                    onFlowVisibilityChange={manager.setIsFlowVisible}
                                    idePosition={manager.idePosition}
                                    onConnectionVisibilityChange={manager.handleConnectionVisibilityChange}
                                    onBlockWidthChange={manager.handleBlockWidthChange}
                                    onBlockSelect={manager.handleBlockSelect}
                                    selectedBlockId={manager.selectedBlockId}
                                    currentIndex={currentIndex}
                                    currentType={currentType}
                                    onIDEClose={handleIDEClose}
                                    activeTestingPanel={manager.activeTestingPanel}
                                    onTestingPanelChange={manager.handleTestingPanelChange}
                                    onEditingStateChange={handleEditingStateChange}
                                />
                            ))}
                           
                        </div>
                    ) : (
                        <ShowIDEBlock
                            fileName={selectedFileName || 'Untitled'}
                            onShow={() => setIsIDEVisible(true)}
                            customization={customization}
                        />
                    )}
                </CanvasContainer>
                


            </div>

            {/* Panels */}
            <BlocksListPanel
                isOpen={isBlocksListOpen}
                onClose={() => setIsBlocksListOpen(false)}
                blocks={blocks}
                onBlockSelect={handleBlockSelect}
                customization={customization}
            />

            <SettingsPanel
                isOpen={isSettingsPanelOpen}
                onClose={() => setIsSettingsPanelOpen(false)}
                customization={customization}
                onCustomizationChange={handleCustomizationChange}
            />

            <CanvasInfoPanel
                isOpen={isInfoPanelOpen}
                onClose={() => setIsInfoPanelOpen(false)}
                blocks={blocks}
                onBlockSelect={handleBlockSelect}
            />

            <KeyboardShortcutsPanel
                isOpen={isKeyboardShortcutsPanelOpen}
                onClose={() => setIsKeyboardShortcutsPanelOpen(false)}
            />

            {/* Templates Panel */}
            {isTemplatesPanelOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Choose a Theme</h2>
                            <button onClick={() => setIsTemplatesPanelOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {customTemplates.map((template, index) => (
                                <TemplateCard key={index} template={template} onSelect={handleTemplateChange} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Logs Modal */}
            {/* Logs Modal */}
            {isLogsListOpen && (
                <ComingSoon
                    feature="Logs"
                    onClose={() => setIsLogsListOpen(false)}
                />
            )}

            {/* Template Selection Modal */}
            {isTemplatesPanelOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Choose a Theme</h2>
                            <button onClick={() => setIsTemplatesPanelOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {customTemplates.map((template, index) => (
                                <TemplateCard key={index} template={template} onSelect={handleTemplateChange} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Panel */}
            <SettingsPanel
                isOpen={isSettingsPanelOpen}
                onClose={() => setIsSettingsPanelOpen(false)}
                customization={customization}
                onCustomizationChange={handleCustomizationChange}
            />

            {/* Canvas Info Panel */}
            <CanvasInfoPanel
                isOpen={isInfoPanelOpen}
                onClose={() => setIsInfoPanelOpen(false)}
                blocks={blocks}
                onBlockSelect={handleBlockSelect}
            />

            {/* Keyboard Shortcuts Panel */}
            <KeyboardShortcutsPanel
                isOpen={isKeyboardShortcutsPanelOpen}
                onClose={() => setIsKeyboardShortcutsPanelOpen(false)}
            />

            {/* Blocks List Panel */}
            {/* <BlocksListPanel
                isOpen={isBlocksListOpen}
                onClose={() => setIsBlocksListOpen(false)}
                blocks={blocks}
                onBlockSelect={handleBlockSelect}
                customization={customization}
            /> */}
        </div>
    );
};

export default DesignCanvas;