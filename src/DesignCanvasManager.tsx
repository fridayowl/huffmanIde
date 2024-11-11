import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ExtendedBlockData, Connection, ConnectionData ,BlockData} from './types';
import { generateJsonFromPythonFile } from './fileProcessor';
import { PythonIDEHandle } from './types';
import defaultCustomization from './customization.json';

export interface DesignCanvasManagerProps {
    selectedFile: string | null;
    selectedFileName: string | null;
    onCodeChange: (newContent: string) => void;
}

export const useDesignCanvasManager = ({
    selectedFile,
    selectedFileName,
    onCodeChange
}: DesignCanvasManagerProps) => {
    // Core state
    
    const [blocks, setBlocks] = useState<ExtendedBlockData[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isFlowVisible, setIsFlowVisible] = useState(true);
    const [classVisibility, setClassVisibility] = useState<Record<string, boolean>>({});
    const [zoomLevel, setZoomLevel] = useState(0.5);
    const [canvasSize, setCanvasSize] = useState({ width: 3000, height: 2000 });
    const [idePosition, setIdePosition] = useState({ x: 20, y: 20 });
    const [refreshKey, setRefreshKey] = useState(0);
    const [autoZoom, setAutoZoom] = useState(false);
    const [isAutoZoomLocked, setIsAutoZoomLocked] = useState(false);
    const [hiddenSubConnections, setHiddenSubConnections] = useState<string[]>([]);
    const [hiddenSubBlocks, setHiddenSubBlocks] = useState<string[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [ideContent, setIdeContent] = useState<string | null>(null);
    const pythonIDERef = useRef<PythonIDEHandle>(null);
    const [activeTestingPanel, setActiveTestingPanel] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    // Canvas calculations
    const calculateBoundingBox = useCallback(() => {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        blocks.forEach(block => {
            minX = Math.min(minX, block.x);
            minY = Math.min(minY, block.y);
            maxX = Math.max(maxX, block.x + block.width);
            maxY = Math.max(maxY, block.y + 100);
        });
        return { minX, minY, maxX, maxY };
    }, [blocks]);

    const adjustZoom = useCallback(() => {
        if (!autoZoom) return;

        const { minX, minY, maxX, maxY } = calculateBoundingBox();
        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;

        const horizontalScale = window.innerWidth / contentWidth;
        const verticalScale = window.innerHeight / contentHeight;

        const newZoom = Math.min(horizontalScale, verticalScale, 1) * 0.9;

        setZoomLevel(newZoom);
        setCanvasSize({
            width: Math.max(contentWidth / newZoom, window.innerWidth / newZoom),
            height: Math.max(contentHeight / newZoom, window.innerHeight / newZoom)
        });
    }, [autoZoom, calculateBoundingBox]);

    // Auto-zoom effect
    useEffect(() => {
        adjustZoom();
    }, [blocks, adjustZoom]);
    
    
   

    // Block processing
    const estimateInitialWidth = (code: string): number => {
        const lines = code.split('\n');
        const maxLineLength = Math.max(...lines.map(line => line.length));
        const CHAR_WIDTH = 8;
        const PADDING = 40;
        return Math.max(200, maxLineLength * CHAR_WIDTH + PADDING);
    };

    const processFile = useCallback(async (content: string, fileName: string) => {
        if (content === ideContent && blocks.length > 0) return;

        setIsProcessing(true);
        try {
            const jsonData = await generateJsonFromPythonFile(content, fileName);

            const UNIFORM_SPACING = 40;
            const COLUMN_WIDTH = 350;
            const IDE_WIDTH = 600;
            const X_OFFSET = IDE_WIDTH + 250;

            // Calculate default height if not provided
            const getDefaultBlockHeight = (block: BlockData) => {
                const lineCount = block.code.split('\n').length;
                return Math.max(120, lineCount * 20 + 60) + 20;
            };

            // Use existing height or calculate default
            const getBlockHeight = (block: BlockData) => {
                return block.height || getDefaultBlockHeight(block);
            };
            
            // Categorize blocks
            const classes = jsonData.filter(block => block.type === 'class');
            const standaloneCodes = jsonData.filter(block => block.type === 'code');
            const standaloneFunctions = jsonData.filter(block => block.type === 'standalone_function');
            const classFunctions = jsonData.filter(block => block.type === 'class_function');
            const classStandalones = jsonData.filter(block => block.type === 'class_standalone');

            // Process main blocks
            let currentY = 100;
            const modifiedBlocks = [...classes, ...standaloneCodes, ...standaloneFunctions]
                .sort((a, b) => a.lineNumber - b.lineNumber)
                .map(block => {
                    const height = getBlockHeight(block);
                    // Explicitly create ExtendedBlockData by adding width
                    const newBlock: ExtendedBlockData = {
                        ...block,
                        width: estimateInitialWidth(block.code),
                        x: X_OFFSET,
                        y: currentY,
                        height,
                    };
                    currentY += height + UNIFORM_SPACING;
                    return newBlock;
                });

            // Process class-related blocks
            let methodY = 100;
            const classFunctionBlocks = classFunctions.map(block => {
                const height = getBlockHeight(block);
                // Explicitly create ExtendedBlockData
                const newBlock: ExtendedBlockData = {
                    ...block,
                    width: estimateInitialWidth(block.code),
                    x: X_OFFSET + 3 * COLUMN_WIDTH,
                    y: methodY,
                    height,
                };
                methodY += height + UNIFORM_SPACING;
                return newBlock;
            });

            let standaloneY = methodY;
            const classStandaloneBlocks = classStandalones.map(block => {
                const height = getBlockHeight(block);
                // Explicitly create ExtendedBlockData
                const newBlock: ExtendedBlockData = {
                    ...block,
                    width: estimateInitialWidth(block.code),
                    x: X_OFFSET + 3 * COLUMN_WIDTH,
                    y: standaloneY,
                    height,
                };
                standaloneY += height + UNIFORM_SPACING;
                return newBlock;
            });

            const allBlocks = [...modifiedBlocks, ...classFunctionBlocks, ...classStandaloneBlocks];
            setBlocks(allBlocks);
            setIdeContent(content);
            setRefreshKey(prev => prev + 1);

        } catch (error) {
            console.error('Error processing file:', error);
            setIsProcessing(false);
        }
        console.log("called")
    }, []);
    useEffect(() => {
        if (!selectedFileName || !selectedFile || isProcessing) return;

        const storedContent = localStorage.getItem(`file_${selectedFileName}`);
        const contentToProcess = storedContent || selectedFile;

        processFile(contentToProcess, selectedFileName);
    }, [selectedFile, selectedFileName, processFile, isProcessing]);

    // Connection management
    const handleConnectionVisibilityChange = useCallback((connectionId: string, isVisible: boolean, connectionType: string) => {
        let connectionIdsFormatted: string[] = [];

        if (connectionType === "idecontainsclass") {
            setConnections(prevConnections =>
                prevConnections.map(conn => {
                    const formateConnectionId = `${connectionId}-${connectionId}.`;
                    if (conn.id.includes(formateConnectionId) || conn.start === connectionId.split('-')[0]) {
                        connectionIdsFormatted.push(conn.id);
                        return { ...conn, isVisible };
                    }
                    return conn;
                })
            );
        }

        const connection = connections.find(conn => conn.id === connectionId);
        if (connection) {
            setBlocks(prevBlocks =>
                prevBlocks.map(block => {
                    if (block.id === connection.end || block.parentClass === connection.end) {
                        return { ...block, isVisible };
                    }
                    return block;
                })
            );

            setHiddenSubConnections(prev => {
                if (isVisible) {
                    return prev.filter(id => !connectionIdsFormatted.includes(id));
                } else {
                    return [...new Set([...prev, ...connectionIdsFormatted])];
                }
            });
        }
    }, [connections]);

    const getConnectionPoints = useCallback((startBlock: ExtendedBlockData, endBlock: ExtendedBlockData) => {
        const CONNECTOR_OFFSET = 20;

        if (startBlock.type === 'class' && (endBlock.type === 'class_function' || endBlock.type === 'class_standalone')) {
            const classLines = startBlock.code.split('\n');
            const functionStartLine = classLines.findIndex(line =>
                line.includes(`def ${endBlock.name}(`) || line.includes(endBlock.code.split('\n')[0])
            );

            if (functionStartLine !== -1) {
                const startY = startBlock.y + (functionStartLine + 1) * 20;
                return {
                    startPoint: { x: startBlock.x + 750, y: startY + 40 },
                    endPoint: { x: endBlock.x, y: endBlock.y + 25 }
                };
            }
        }

        return {
            startPoint: { x: startBlock.x + startBlock.width - CONNECTOR_OFFSET, y: startBlock.y + 50 },
            endPoint: { x: endBlock.x, y: endBlock.y + 25 }
        };
    }, []);

    const updateConnections = useCallback(() => {
        const newConnections: Connection[] = [];

        // Connect blocks to IDE
        const getIDEConnectionStartPoint = (blockLineNumber: number) => ({
            x: idePosition.x + 600,
            y: idePosition.y + ((blockLineNumber - 1) * 20) + 40
        });

        blocks.filter(block => ['class', 'code', 'standalone_function'].includes(block.type))
            .forEach(block => {
                const startPoint = getIDEConnectionStartPoint(block.lineNumber);
                const endPoint = { x: block.x, y: block.y + 25 };
                const cleanBlockId = block.id.endsWith(':') ? block.id.slice(0, -1) : block.id;

                newConnections.push({
                    id: cleanBlockId,
                    start: 'python-ide',
                    end: cleanBlockId,
                    startPoint,
                    endPoint,
                    type: block.type === 'class' ? 'idecontainsclass' : 'idecontainsstandalonecode',
                    fromConnector: "python-ide",
                    toConnector: cleanBlockId.split('.').pop() || '',
                    startBlockType: 'code',
                    endBlockType: block.type
                });
            });

        // Connect class-related blocks
        blocks.forEach(block => {
            if (block.type === 'class') {
                // Connect class functions
                blocks.filter(b => b.type === 'class_function' && b.parentClass === block.id)
                    .forEach(functionBlock => {
                        const { startPoint, endPoint } = getConnectionPoints(block, functionBlock);
                        newConnections.push({
                            id: `${block.id}-${functionBlock.id}`,
                            start: block.id,
                            end: functionBlock.id,
                            startPoint,
                            endPoint,
                            type: 'class_contains_functions',
                            fromConnector: block.id.split('.').pop() || '',
                            toConnector: functionBlock.id.split('.').pop() || '',
                            startBlockType: 'class',
                            endBlockType: 'class_function'
                        });
                    });

                // Connect class standalones
                blocks.filter(b => b.type === 'class_standalone' && b.parentClass === block.id)
                    .forEach(standaloneBlock => {
                        const { startPoint, endPoint } = getConnectionPoints(block, standaloneBlock);
                        newConnections.push({
                            id: `${block.id}-${standaloneBlock.id}`,
                            start: block.id,
                            end: standaloneBlock.id,
                            startPoint,
                            endPoint,
                            type: 'class_contains_standalone',
                            fromConnector: block.id.split('.').pop() || '',
                            toConnector: standaloneBlock.id.split('.').pop() || '',
                            startBlockType: 'class',
                            endBlockType: 'class_standalone'
                        });
                    });
            }
        });

        setConnections(prevConnections =>
            newConnections.map(newConn => {
                const existingConn = prevConnections.find(conn => conn.id === newConn.id);
                return existingConn ? { ...newConn, isVisible: existingConn.isVisible } : newConn;
            })
        );
    }, [blocks, idePosition, getConnectionPoints]);

    // Position management
    const handlePositionChange = useCallback((id: string, x: number, y: number) => {
        if (id === 'python-ide') {
            setIdePosition({ x, y });
        } else {
            setBlocks(prevBlocks =>
                prevBlocks.map(block =>
                    block.id === id ? { ...block, x, y } : block
                )
            );
        }
        updateConnections();
    }, [updateConnections]);

    // Visibility management
    const getVisibleBlocks = useCallback(() => {
        return blocks.filter(block => {
            if (block.isVisible === false) return false;
            if (hiddenSubBlocks.includes(block.id)) return false;
            if (block.type === 'class' || block.type === 'code' || block.type === 'class_standalone' || block.type === 'standalone_function') return true;
            const parentClass = blocks.find(b => b.type === 'class' && block.id.startsWith(`${b.name}_`));
            return parentClass ? classVisibility[parentClass.id] !== false : true;
        });
    }, [blocks, classVisibility, hiddenSubBlocks]);

    const getVisibleConnections = useCallback(() => {
        return connections
            .filter(conn => !hiddenSubConnections.includes(conn.id))
            .map(conn => ({
                ...conn,
                isVisible: conn.isVisible !== false
            }));
    }, [connections, hiddenSubConnections]);

    // Code management
    const handleCodeChange = useCallback((newCode: string) => {
        setIdeContent(newCode);
        if (selectedFileName) {
            localStorage.setItem(`file_${selectedFileName}`, newCode);
            processFile(newCode, selectedFileName);
        }
    }, [selectedFileName, processFile]);

    const handleBlockCodeChange = useCallback((id: string, newCode: string[], lineNumber: number) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === id ? { ...block, code: newCode.join('\n') } : block
            )
        );

        if (pythonIDERef.current) {
            pythonIDERef.current.handleBlockCodeChange(id, newCode, lineNumber);
        }
    }, []);

    // Initialize from file
    useEffect(() => {
        if (selectedFileName) {
            const storedContent = localStorage.getItem(`file_${selectedFileName}`);

            if (storedContent) {
                setIdeContent(storedContent);
                processFile(storedContent, selectedFileName);
            } else if (selectedFile) {
                setIdeContent(selectedFile);
                processFile(selectedFile, selectedFileName);
                localStorage.setItem(`file_${selectedFileName}`, selectedFile);
            }
        }
    }, [selectedFile, selectedFileName, processFile]);

    // Block selection and zooming
    const calculateZoomAndScrollForBlock = useCallback((block: ExtendedBlockData) => {
        // Calculate optimal zoom level
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight - 150; // Account for header and padding
        const blockWidth = block.width || 600; // Default width if not specified
        const blockHeight = 150; // Standard block height

        // Calculate zoom levels that would fit the block with padding
        const horizontalZoom = (viewportWidth * 0.7) / blockWidth;
        const verticalZoom = (viewportHeight * 0.7) / blockHeight;

        // Use the smaller zoom level to ensure the block fits in both dimensions
        const newZoom = Math.min(
            Math.min(horizontalZoom, verticalZoom),
            0.7 // Cap maximum zoom at 1.0
        );

        // Calculate scroll position to center the block
        const blockCenterX = block.x + (blockWidth / 2);
        const blockCenterY = block.y + (blockHeight / 2);

        const scrollX = (blockCenterX * newZoom) - (viewportWidth / 2);
        const scrollY = (blockCenterY * newZoom) - (viewportHeight / 2);

        return {
            newZoom,
            scrollPosition: {
                x: Math.max(0, scrollX),
                y: Math.max(0, scrollY)
            }
        };
    }, []);
    const calculateScrollPositionForBlock = useCallback((block: ExtendedBlockData, newZoom: number) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        return {
            x: (block.x * newZoom) - (viewportWidth / 2) + (block.width * newZoom / 2),
            y: (block.y * newZoom) - (viewportHeight / 2) + (75 * newZoom)
        };
    }, []);

    // Update the handleBlockSelect function
    const handleBlockSelect = useCallback((blockId: string) => {
        const selectedBlock = blocks.find(block => block.id === blockId);
        if (selectedBlock) {
            setSelectedBlockId(blockId);

            // Calculate new zoom and scroll position
            const { newZoom, scrollPosition } = calculateZoomAndScrollForBlock(selectedBlock);

            // Return the values to be used by the DesignCanvas component
            return {
                newZoom,
                scrollPosition,
            };
        }
        return null;
    }, [blocks, calculateZoomAndScrollForBlock]);  const handleBlockVisibilityToggle = useCallback((id: string) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === id ? { ...block, isVisible: !block.isVisible } : block
            )
        );
    }, []);

    // Width management
    const handleBlockWidthChange = useCallback((id: string, newWidth: number) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === id ? { ...block, width: newWidth } : block
            )
        );
    }, []);

    // Auto-zoom controls
    const toggleAutoZoom = useCallback(() => {
        if (!isAutoZoomLocked) {
            setAutoZoom(prev => !prev);
        }
    }, [isAutoZoomLocked]);

    const toggleAutoZoomLock = useCallback(() => {
        setIsAutoZoomLocked(prev => {
            const newLocked = !prev;
            if (newLocked) {
                setAutoZoom(false);
            }
            return newLocked;
        });
    }, []);

    // Update connections when blocks or IDE position changes
    useEffect(() => {
        updateConnections();
    }, [blocks, idePosition, updateConnections]);
    const reportHeightChange = (id: string, newHeight: number) => {
         
        console.log(`Height of block with ID ${id} changed to ${newHeight}px`);

        // Add any decision-making logic here based on new heights
    };
    const updateProcess = useCallback(async (content: string, fileName: string, blockId: string, isOpen: boolean) => {
        try {
            const jsonData = await generateJsonFromPythonFile(content, fileName);

            const UNIFORM_SPACING = 40;
            const COLUMN_WIDTH = 350;
            const IDE_WIDTH = 600;
            const X_OFFSET = IDE_WIDTH + 250;

            // Calculate default height if not provided
            const getDefaultBlockHeight = (block: BlockData) => {
                const lineCount = block.code.split('\n').length;
                // Add extra height if testing panel is open for this block
                const testingPanelHeight = block.id === blockId && isOpen ? 450 : 0;
                return Math.max(120, lineCount * 20 + 60) + 20 + testingPanelHeight;
            };

            // Use existing height or calculate default
            const getBlockHeight = (block: BlockData) => {
                if (block.id === blockId && isOpen) {
                    // If this is the block with open testing panel, ensure minimum height for testing panel
                    return Math.max(block.height || getDefaultBlockHeight(block), 520); // 120 base + 400 testing panel
                }
                return block.height || getDefaultBlockHeight(block);
            };

            // Categorize blocks
            const classes = jsonData.filter(block => block.type === 'class');
            const standaloneCodes = jsonData.filter(block => block.type === 'code');
            const standaloneFunctions = jsonData.filter(block => block.type === 'standalone_function');
            const classFunctions = jsonData.filter(block => block.type === 'class_function');
            const classStandalones = jsonData.filter(block => block.type === 'class_standalone');

            // Process main blocks with adjusted heights
            let currentY = 100;
            const modifiedBlocks = [...classes, ...standaloneCodes, ...standaloneFunctions]
                .sort((a, b) => a.lineNumber - b.lineNumber)
                .map(block => {
                    const height = getBlockHeight(block);
                    const newBlock: ExtendedBlockData = {
                        ...block,
                        width: estimateInitialWidth(block.code),
                        x: X_OFFSET,
                        y: currentY,
                        height,
                        isTestingOpen: block.id === blockId ? isOpen : false
                    };
                    currentY += height + UNIFORM_SPACING;
                    return newBlock;
                });

            // Process class-related blocks
            let methodY = 100;
            const classFunctionBlocks = classFunctions.map(block => {
                const height = getBlockHeight(block);
                const newBlock: ExtendedBlockData = {
                    ...block,
                    width: estimateInitialWidth(block.code),
                    x: X_OFFSET + 3 * COLUMN_WIDTH,
                    y: methodY,
                    height,
                    isTestingOpen: block.id === blockId ? isOpen : false
                };
                methodY += height + UNIFORM_SPACING;
                return newBlock;
            });

            let standaloneY = methodY;
            const classStandaloneBlocks = classStandalones.map(block => {
                const height = getBlockHeight(block);
                const newBlock: ExtendedBlockData = {
                    ...block,
                    width: estimateInitialWidth(block.code),
                    x: X_OFFSET + 3 * COLUMN_WIDTH,
                    y: standaloneY,
                    height,
                    isTestingOpen: block.id === blockId ? isOpen : false
                };
                standaloneY += height + UNIFORM_SPACING;
                return newBlock;
            });

            const allBlocks = [...modifiedBlocks, ...classFunctionBlocks, ...classStandaloneBlocks];

            // Update blocks state and active testing panel
            setBlocks(allBlocks);
            setActiveTestingPanel(isOpen ? blockId : null);  // Set to blockId if opening, null if closing
            setIdeContent(content);
            setRefreshKey(prev => prev + 1);

            // Log for debugging
            console.log(`Updated blocks with testing panel ${isOpen ? 'open' : 'closed'} for block: ${blockId}`);

        } catch (error) {
            console.error('Error processing file:', error);
        }
    }, [setBlocks, setActiveTestingPanel, estimateInitialWidth]);

    const handleTestingPanelChange = useCallback((blockId: string, isOpen: boolean) => {
        // If trying to open a new panel, close the currently open one (if any)
        if (isOpen) {
            // If there's already an open panel and it's different from the current one
            if (activeTestingPanel && activeTestingPanel !== blockId) {
                // Close the currently open panel
                const currentlyOpenBlock = blocks.find(block => block.id === activeTestingPanel);
                if (currentlyOpenBlock) {
                    // Update the block's height to remove testing panel space
                    setBlocks(prevBlocks =>
                        prevBlocks.map(block =>
                            block.id === activeTestingPanel
                                ? { ...block, isTestingOpen: false }
                                : block
                        )
                    );
                }
            }
            // Set the new active panel
            setActiveTestingPanel(blockId);
        } else {
            // If closing the panel
            if (activeTestingPanel === blockId) {
                setActiveTestingPanel(null);
            }
        }

        // Update the block's testing panel state
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === blockId
                    ? { ...block, isTestingOpen: isOpen }
                    : block
            )
        );

        // Recalculate positions if needed
        if (selectedFile && selectedFileName) {
            updateProcess(selectedFile, selectedFileName, blockId, isOpen);
        }
    }, [blocks, selectedFile, selectedFileName, updateProcess, activeTestingPanel]);



    // Return all needed values and functions
    return {
        // State
        blocks,
        connections,
        isFlowVisible,
        classVisibility,
        zoomLevel,
        canvasSize,
        idePosition,
        autoZoom,
        isAutoZoomLocked,
        selectedBlockId,
        ideContent,
        pythonIDERef,

        // Core functions
        processFile,
        updateConnections,
        getVisibleBlocks,
        getVisibleConnections,

        // Event handlers
        handlePositionChange,
        handleConnectionVisibilityChange,
        handleCodeChange,
        handleBlockCodeChange,
        handleBlockSelect,
        handleBlockVisibilityToggle,
        handleBlockWidthChange,

        // Zoom controls
        toggleAutoZoom,
        toggleAutoZoomLock,
        setZoomLevel,

        // Visibility controls
        setIsFlowVisible: setIsFlowVisible,
        setClassVisibility: setClassVisibility,

        // Position controls
        setIdePosition,

        // Helper functions
        calculateBoundingBox,
        estimateInitialWidth,

        // Canvas management
        refreshKey,
        adjustZoom,

        // Utility functions 
        calculateScrollPositionForBlock,
        activeTestingPanel,
        handleTestingPanelChange

    };
};

export default useDesignCanvasManager;