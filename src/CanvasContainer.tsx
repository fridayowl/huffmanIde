import React, { forwardRef, useState, useEffect, useCallback } from 'react';

const CanvasContainer = forwardRef<HTMLDivElement, CanvasContainerProps>(
    ({ children, customization, zoomLevel: initialZoomLevel }, ref) => {
        const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);
        const [initialDistance, setInitialDistance] = useState<number | null>(null);
        const [initialZoom, setInitialZoom] = useState<number>(1);
        const dotSize = 1;
        const gridSize = customization.canvas.gridSpacing;

        // Constants for zoom constraints
        const MIN_ZOOM = 0.5;
        const MAX_ZOOM = 3;

        // Calculate distance between two touch points
        const getDistance = useCallback((touches: TouchList) => {
            if (touches.length < 2) return 0;
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }, []);

        // Handle touch start
        const handleTouchStart = useCallback((e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                setInitialDistance(getDistance(e.touches));
                setInitialZoom(zoomLevel);
            }
        }, [getDistance, zoomLevel]);

        // Handle touch move
        const handleTouchMove = useCallback((e: TouchEvent) => {
            if (e.touches.length === 2 && initialDistance !== null) {
                e.preventDefault();
                const currentDistance = getDistance(e.touches);
                const scale = currentDistance / initialDistance;
                const newZoom = Math.min(Math.max(initialZoom * scale, MIN_ZOOM), MAX_ZOOM);
                setZoomLevel(newZoom);
            }
        }, [getDistance, initialDistance, initialZoom]);

        // Handle touch end
        const handleTouchEnd = useCallback(() => {
            setInitialDistance(null);
        }, []);

        // Handle wheel zoom
        const handleWheel = useCallback((e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = -e.deltaY;
                const zoomFactor = 1.1;
                const scale = delta > 0 ? zoomFactor : 1 / zoomFactor;
                const newZoom = Math.min(Math.max(zoomLevel * scale, MIN_ZOOM), MAX_ZOOM);
                setZoomLevel(newZoom);
            }
        }, [zoomLevel]);

        // Set up event listeners
        useEffect(() => {
            const element = ref as React.MutableRefObject<HTMLDivElement>;
            if (element?.current) {
                element.current.addEventListener('touchstart', handleTouchStart);
                element.current.addEventListener('touchmove', handleTouchMove);
                element.current.addEventListener('touchend', handleTouchEnd);
                element.current.addEventListener('wheel', handleWheel, { passive: false });

                return () => {
                    element.current?.removeEventListener('touchstart', handleTouchStart);
                    element.current?.removeEventListener('touchmove', handleTouchMove);
                    element.current?.removeEventListener('touchend', handleTouchEnd);
                    element.current?.removeEventListener('wheel', handleWheel);
                };
            }
        }, [ref, handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel]);

        return (
            <div
                ref={ref}
                className="relative overflow-auto flex-grow touch-none"
                style={{
                    height: 'calc(100vh - 150px)',
                    backgroundImage: `
                        radial-gradient(circle at center,
                            ${customization.canvas.gridColor} ${dotSize}px,
                            transparent ${dotSize}px
                        )
                    `,
                    backgroundSize: `${gridSize * zoomLevel}px ${gridSize * zoomLevel}px`,
                    backgroundColor: customization.canvas.backgroundColor,
                }}
            >
                <div
                    className="relative min-h-full"
                    style={{
                        transform: `scale(${zoomLevel})`,
                        transformOrigin: 'top left',
                        transition: 'transform 0.05s ease-out'
                    }}
                >
                    {children}
                </div>
            </div>
        );
    }
);

CanvasContainer.displayName = 'CanvasContainer';

interface CanvasContainerProps {
    children: React.ReactNode;
    customization: {
        canvas: {
            gridSpacing: number;
            gridColor: string;
            backgroundColor: string;
        };
    };
    zoomLevel: number;
}

export default CanvasContainer;