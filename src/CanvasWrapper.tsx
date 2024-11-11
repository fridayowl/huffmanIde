import React, { useState, useRef, MouseEvent, ReactNode, useEffect, useCallback } from 'react';
import { Move } from 'lucide-react';
import { ExtendedBlockData } from './types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';


interface CanvasWrapperProps {
    children: ReactNode;
    zoomLevel: number;
    blocks: ExtendedBlockData[];
    idePosition: {
        x: number;
        y: number;
    };
    customization: {
        canvas: {
            backgroundColor: string;
            gridColor: string;
            gridSpacing: number;
        };
        connections: {
            [key: string]: {
                lineColor: string;
            } | undefined;
        };
    };
}

const CanvasWrapper: React.FC<CanvasWrapperProps> = ({
    children,
    zoomLevel,
    blocks,
    idePosition,
    customization
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 3000, height: 2000 });

    // Constants for margins
    const DEFAULT_MARGIN = 20;
    const NAVBAR_HEIGHT = 20;

    // Use refs to store drag state to avoid stale closures
    const dragState = useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        transformX: DEFAULT_MARGIN, // Initialize with default margin
        transformY: NAVBAR_HEIGHT + DEFAULT_MARGIN // Initialize with navbar height + margin
    });

    useEffect(() => {
        const calculateDimensions = () => {
            const IDE_WIDTH = 600;
            const IDE_HEIGHT = 400;
            let maxX = idePosition.x + IDE_WIDTH;
            let maxY = idePosition.y + IDE_HEIGHT;

            blocks.forEach(block => {
                const blockHeight = 150;
                const blockRight = block.x + block.width;
                const blockBottom = block.y + blockHeight;
                maxX = Math.max(maxX, blockRight);
                maxY = Math.max(maxY, blockBottom);
            });

            setDimensions({
                width: Math.max(maxX + 300, 3000),
                height: Math.max(maxY + 200, 2000)
            });
        };

        calculateDimensions();
    }, [blocks, idePosition]);

    const getBorderColor = () => {
        const connections = customization.connections;
        const firstConnection = Object.values(connections)[0];
        return firstConnection?.lineColor || customization.canvas.gridColor;
    };

    const handleMouseDown = useCallback((e: MouseEvent) => {
        if (e.target === wrapperRef.current || (e.target as HTMLElement).closest('.canvas-drag-handle')) {
            e.preventDefault();
            setIsDragging(true);

            // Get current transform values
            const transform = window.getComputedStyle(wrapperRef.current!).transform;
            let matrix = new DOMMatrix(transform);

            dragState.current = {
                startX: e.clientX,
                startY: e.clientY,
                lastX: e.clientX,
                lastY: e.clientY,
                transformX: matrix.m41,
                transformY: matrix.m42
            };

            document.body.style.cursor = 'grabbing';
            document.documentElement.style.userSelect = 'none';
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: globalThis.MouseEvent) => {
            if (!isDragging || !wrapperRef.current) return;

            const dx = e.clientX - dragState.current.lastX;
            const dy = e.clientY - dragState.current.lastY;

            dragState.current.lastX = e.clientX;
            dragState.current.lastY = e.clientY;

            // Calculate new position
            let newX = dragState.current.transformX + dx;
            let newY = dragState.current.transformY + dy;

            // Enforce boundaries
            const minY = NAVBAR_HEIGHT + DEFAULT_MARGIN; // Top boundary with margin
            const minX = DEFAULT_MARGIN; // Left boundary with margin

            // Apply boundaries
            newX = Math.max(minX, newX); // Prevent dragging beyond left margin
            newY = Math.max(minY, newY); // Prevent dragging beyond top margin

            // Apply the bounded transformation
            dragState.current.transformX = newX;
            dragState.current.transformY = newY;

            wrapperRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        };

        const handleMouseUp = () => {
            if (!isDragging) return;
            setIsDragging(false);
            document.body.style.cursor = '';
            document.documentElement.style.userSelect = '';
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove, { capture: true });
            window.addEventListener('mouseup', handleMouseUp, { capture: true });
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove, { capture: true });
            window.removeEventListener('mouseup', handleMouseUp, { capture: true });
        };
    }, [isDragging]);

    // Set initial position on mount
    useEffect(() => {
        if (wrapperRef.current) {
            wrapperRef.current.style.transform = `translate(${DEFAULT_MARGIN}px, ${NAVBAR_HEIGHT + DEFAULT_MARGIN}px)`;
        }
    }, []);

    return (
        // <TransformWrapper
        //     initialScale={2} // Initial zoom level
        //     minScale={0.2} // Minimum zoom level
        //     maxScale={3} // Maximum zoom level
        // >
        //     <TransformComponent>
        <div
            ref={wrapperRef}
            className="relative overflow-auto will-change-transform"
            style={{
                width: `${dimensions.width * zoomLevel}px`,
                height: `${dimensions.height * zoomLevel}px`,
                cursor: isDragging ? 'grabbing' : 'default',
                backgroundColor: 'transparent',
                outline: `5px solid ${getBorderColor()}`,
                borderRadius: '10px',
                touchAction: 'none',
                margin: `${DEFAULT_MARGIN}px`, // Add margin to the wrapper
            }}
            onMouseDown={handleMouseDown}
        >
            <div
                className="canvas-drag-handle absolute top-4 right-4 p-2 rounded-lg cursor-grab active:cursor-grabbing z-50 flex items-center gap-2 opacity-40 hover:opacity-100 shadow-lg transition-opacity duration-200"
                style={{
                    backgroundColor: getBorderColor(),
                }}
            >
                <span className="text-sm font-medium text-white">Drag Canvas</span>
                <Move size={16} className="text-white" />
            </div>
            <div
                className="relative"
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                {children}
            </div>
        </div>
        // </TransformComponent  >
        // </TransformWrapper>
    );
};

export default CanvasWrapper;