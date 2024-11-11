import React, { useRef } from 'react';
import DraggableWrapper from './DraggableWrapper';
import Connections from './Connections';
import { ClassBlock, FunctionBlock, ClassStandaloneBlock, CodeBlock, StandaloneFunctionBlock } from './Blocks'; 
import { ExtendedBlockData, Connection } from './types'; // Changed from DesignCanvas to types
import PythonIDE from './PythonIDE';
import { PythonIDEHandle } from './types';
import CanvasWrapper from './CanvasWrapper';
import { BlockIDESyncHandle, BlockIDESyncHandler } from './BlockIDESyncHandler';

interface CanvasGridProps {
    pythonIDERef: React.RefObject<PythonIDEHandle>;
    blocks: ExtendedBlockData[];
    connections: Connection[];
    isFlowVisible: boolean;
    onPositionChange: (id: string, x: number, y: number) => void;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    onCodeChange: (newCode: string) => void;
    onBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => void;
    getVisibleBlocks: () => ExtendedBlockData[];
    getVisibleConnections: () => Connection[];
    fileContent: string | null;
    fileName: string;
    onFlowVisibilityChange: (isVisible: boolean) => void;
    zoomLevel: number;
    idePosition: { x: number; y: number };
    customization: any;
    onConnectionVisibilityChange: (connectionId: string, isVisible: boolean, connectionType: string) => void;
    onBlockWidthChange: (id: string, newWidth: number) => void;
    onBlockSelect: (id: string) => void;
    selectedBlockId: string | null;
    currentIndex: number;
    currentType: string | null;
    onIDEClose: () => void;
    activeTestingPanel: string | null;
    onTestingPanelChange: (blockId: string, isOpen: boolean) => void;
    onEditingStateChange?: (isEditing: boolean) => void;
    
}
const CanvasGrid: React.FC<CanvasGridProps> = ({
    blocks,
    connections,
    isFlowVisible,
    onPositionChange,
    onVisibilityChange,
    onCodeChange,
    onBlockCodeChange,
    getVisibleBlocks,
    getVisibleConnections,
    fileContent,
    fileName,
    onFlowVisibilityChange,
    zoomLevel,
    idePosition,
    customization,
    onConnectionVisibilityChange,
    onBlockWidthChange,
    onBlockSelect,
    selectedBlockId,
    pythonIDERef,
    currentIndex,
    currentType,
    onIDEClose,
    activeTestingPanel,
    onTestingPanelChange,
    onEditingStateChange
}) => {
    const HEADER_HEIGHT = 40;
    const CONNECTOR_OFFSET_X = 5;

    const getBlockPosition = (id: string) => {
        if (id === 'python-ide') {
            return {
                x: idePosition.x * zoomLevel,
                y: idePosition.y * zoomLevel,
                width: 600 * zoomLevel,
                height: 400 * zoomLevel
            };
        }
        const block = blocks.find(b => b.id === id);
        if (!block) return { x: 0, y: 0, width: 0, height: 0 };
        return {
            x: block.x * zoomLevel,
            y: block.y * zoomLevel,
            width: block.width * zoomLevel,
            height: 150 * zoomLevel
        };
    };

    const getBlockType = (id: string) => {
        if (id === 'python-ide') return 'ide';
        const block = blocks.find(b => b.id === id);
        return block ? block.type : 'unknown';
    };
    const syncHandlerRef = useRef<BlockIDESyncHandle>(null);

    const handleClassNameClick = (className: string, lineNumber: number) => {
        console.log(`Class ${className} clicked at line ${lineNumber}`);
        // Handle the class name click, e.g., navigate to class definition
    };
    const renderBlock = (item: ExtendedBlockData) => {
        const isCurrentBlock = (currentType === null || item.type === currentType) &&
            getVisibleBlocks().filter(block => currentType === null || block.type === currentType).indexOf(item) === currentIndex;

        const commonProps = {
            id: item.id,
            name: item.name,
            location: item.location,
            author: item.author,
            fileType: item.fileType,
            code: item.code,
            lineNumber: item.lineNumber,
            onVisibilityChange,
            onCodeChange,
            onBlockCodeChange,
            customization,
            fileName,
            isVisible: item.isVisible !== false,
            parentClass: item.parentClass,
            onWidthChange: (newWidth: number) => onBlockWidthChange(item.id, newWidth),
            initialWidth: item.width,
            onSelect: () => onBlockSelect(item.id),
            isSelected: item.id === selectedBlockId || isCurrentBlock,
            isTestingPanelOpen: item.id === activeTestingPanel,
            onTestingPanelChange
        };

        switch (item.type) {
            case 'class':
                return <ClassBlock {...commonProps} type="class" />;
            case 'class_function':
                return <FunctionBlock {...commonProps} type="class_function" />;
            case 'class_standalone':
                return <ClassStandaloneBlock {...commonProps} type="class_standalone" />;
            case 'code':
                return <CodeBlock {...commonProps} type="code" />;
            case 'standalone_function':
                return <StandaloneFunctionBlock {...commonProps} type="standalone_function" />;
            default:
                return null;
        }
    };

    return (
        <div>
            <BlockIDESyncHandler
                ref={syncHandlerRef}
                onCodeChange={onCodeChange}
                onBlockCodeChange={onBlockCodeChange}
                pythonIDERef={pythonIDERef}
            />
            <CanvasWrapper
                zoomLevel={zoomLevel}
                blocks={blocks}
                idePosition={idePosition}
                customization={customization}
            >
                <div className="relative w-full h-full">
                    {isFlowVisible && getVisibleBlocks().map((item) => (
                        <DraggableWrapper
                            key={item.id}
                            id={item.id}
                            initialX={item.x}
                            initialY={item.y}
                            onPositionChange={onPositionChange}
                            zoomLevel={zoomLevel}
                        >
                            {renderBlock(item)}
                        </DraggableWrapper>
                    ))}

                    <DraggableWrapper
                        id="python-ide"
                        initialX={idePosition.x}
                        initialY={idePosition.y}
                        onPositionChange={onPositionChange}
                        zoomLevel={zoomLevel}
                    >
                        <PythonIDE
                            ref={pythonIDERef}
                            fileContent={fileContent}
                            onCodeChange={onCodeChange}
                            onClassNameClick={handleClassNameClick}
                            onBlockCodeChange={onBlockCodeChange}
                            fileName={fileName}
                            onFlowVisibilityChange={onFlowVisibilityChange}
                            customization={customization.ide}
                            onClose={onIDEClose}
                            onEditingStateChange={onEditingStateChange}
                        />
                    </DraggableWrapper>

                    {isFlowVisible && (

                        <Connections
                            connections={getVisibleConnections()}
                            zoomLevel={zoomLevel}
                            getBlockPosition={getBlockPosition}
                            getBlockType={getBlockType}
                            customization={customization.connections}
                            onConnectionVisibilityChange={onConnectionVisibilityChange}
                        />

                    )}
                </div>
                
            </CanvasWrapper>
            
            
        </div>
        
    );
};

export default CanvasGrid;