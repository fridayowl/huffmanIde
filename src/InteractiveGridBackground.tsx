import React, { useEffect, useRef } from 'react';

const InteractiveGridBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match document size (not just viewport)
        const resizeCanvas = () => {
            const docHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            canvas.width = window.innerWidth;
            canvas.height = docHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Grid properties
        const spacing = 24;
        const dotSize = 1;
        const glowRadius = 100;
        const dots: { x: number; y: number }[] = [];

        // Create dot positions
        for (let x = spacing; x < canvas.width; x += spacing) {
            for (let y = spacing; y < canvas.height; y += spacing) {
                dots.push({ x, y });
            }
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Get current scroll position
            scrollRef.current = {
                x: window.pageXOffset,
                y: window.pageYOffset
            };

            // Calculate mouse position relative to document
            const mouseX = mouseRef.current.x + scrollRef.current.x;
            const mouseY = mouseRef.current.y + scrollRef.current.y;

            // Get viewport boundaries
            const viewportTop = scrollRef.current.y;
            const viewportBottom = viewportTop + window.innerHeight;
            const viewportLeft = scrollRef.current.x;
            const viewportRight = viewportLeft + window.innerWidth;

            dots.forEach(dot => {
                // Only process dots near the viewport
                if (dot.y < viewportTop - spacing ||
                    dot.y > viewportBottom + spacing ||
                    dot.x < viewportLeft - spacing ||
                    dot.x > viewportRight + spacing) {
                    return;
                }

                // Calculate distance from mouse
                const dx = dot.x - mouseX;
                const dy = dot.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Calculate glow intensity based on distance
                const intensity = Math.max(0, 1 - distance / glowRadius);

                // Draw dot
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dotSize * (1 + intensity), 0, Math.PI * 2);

                // Set color with glow effect
                const alpha = 0.05 + intensity * 0.6;
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

                // Draw glow
                if (intensity > 0) {
                    ctx.shadowBlur = 10 * intensity;
                    ctx.shadowColor = 'rgba(148, 163, 184, 0.5)';
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        // Track mouse movement
        const handleMouseMove = (e: MouseEvent) => {
            // Store mouse position relative to the viewport
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };

        // Handle scroll events
        const handleScroll = () => {
            // Update scroll position
            scrollRef.current = {
                x: window.pageXOffset,
                y: window.pageYOffset
            };
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', resizeCanvas);

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                background: 'transparent',
                zIndex: 0
            }}
        />
    );
};

export default InteractiveGridBackground;