import React, { forwardRef } from 'react';

interface CanvasContainerProps {
    children: React.ReactNode;
    customization: any;
    zoomLevel: number;
}

const CanvasContainer = forwardRef<HTMLDivElement, CanvasContainerProps>(
    ({ children, customization, zoomLevel }, ref) => {
        const dotSize = 1;
        const gridSize = customization.canvas.gridSpacing;

        return (
            <div
                ref={ref}
                className="relative overflow-auto flex-grow"
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
                <div className="relative min-h-full">
                    {children}
                </div>
            </div>
        );
    }
);
CanvasContainer.displayName = 'CanvasContainer';

export default CanvasContainer;