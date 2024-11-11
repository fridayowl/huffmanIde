import React, { useEffect, useRef } from 'react';

interface Node {
    x: number;
    y: number;
    type: 'dot' | 'codeBlock';
    symbol?: string;
    connections: number[];
    phase: number;
}

const InteractiveGridBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef({ x: 0, y: 0 });
    const frameRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match document size
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
        const spacing = 40;
        const dotSize = 1;
        const glowRadius = 150;
        const nodes: Node[] = [];

        // Code symbols
        const codeSymbols = ['{', '}', '(', ')', '<', '>', '//', '[]', '=>', '&&', '||'];

        // Create grid of nodes
        for (let x = spacing; x < canvas.width; x += spacing) {
            for (let y = spacing; y < canvas.height; y += spacing) {
                const isCodeBlock = Math.random() < 0.15; // 15% chance of being a code block
                nodes.push({
                    x,
                    y,
                    type: isCodeBlock ? 'codeBlock' : 'dot',
                    symbol: isCodeBlock ? codeSymbols[Math.floor(Math.random() * codeSymbols.length)] : undefined,
                    connections: [],
                    phase: Math.random() * Math.PI * 2 // Random starting phase for animations
                });
            }
        }

        // Connect nearby code blocks
        nodes.forEach((node, index) => {
            if (node.type === 'codeBlock') {
                // Find nearby code blocks to connect to
                nodes.forEach((otherNode, otherIndex) => {
                    if (otherNode.type === 'codeBlock' && index !== otherIndex) {
                        const dx = otherNode.x - node.x;
                        const dy = otherNode.y - node.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < spacing * 3) { // Connect if within 3 spaces
                            node.connections.push(otherIndex);
                        }
                    }
                });
            }
        });

        // Animation loop
        const animate = () => {
            frameRef.current++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update scroll position
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

            // Draw connections first (below nodes)
            nodes.forEach((node, index) => {
                if (!isNodeInViewport(node, viewportTop, viewportBottom, viewportLeft, viewportRight, spacing)) {
                    return;
                }

                if (node.type === 'codeBlock') {
                    node.connections.forEach(targetIndex => {
                        const targetNode = nodes[targetIndex];
                        if (!isNodeInViewport(targetNode, viewportTop, viewportBottom, viewportLeft, viewportRight, spacing)) {
                            return;
                        }

                        drawConnection(ctx, node, targetNode, mouseX, mouseY, frameRef.current);
                    });
                }
            });

            // Draw nodes
            nodes.forEach(node => {
                if (!isNodeInViewport(node, viewportTop, viewportBottom, viewportLeft, viewportRight, spacing)) {
                    return;
                }

                const dx = node.x - mouseX;
                const dy = node.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const intensity = Math.max(0, 1 - distance / glowRadius);

                if (node.type === 'codeBlock') {
                    drawCodeBlock(ctx, node, intensity, frameRef.current);
                } else {
                    drawDot(ctx, node, intensity);
                }
            });

            requestAnimationFrame(animate);
        };

        // Helper function to check if node is in viewport
        const isNodeInViewport = (
            node: Node,
            viewportTop: number,
            viewportBottom: number,
            viewportLeft: number,
            viewportRight: number,
            margin: number
        ) => {
            return !(node.y < viewportTop - margin ||
                node.y > viewportBottom + margin ||
                node.x < viewportLeft - margin ||
                node.x > viewportRight + margin);
        };

        // Draw a connection line between nodes
        const drawConnection = (
            ctx: CanvasRenderingContext2D,
            node1: Node,
            node2: Node,
            mouseX: number,
            mouseY: number,
            frame: number
        ) => {
            const dx = node2.x - node1.x;
            const dy = node2.y - node1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate mouse proximity effect
            const mouseDx = (node1.x + node2.x) / 2 - mouseX;
            const mouseDy = (node1.y + node2.y) / 2 - mouseY;
            const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
            const mouseIntensity = Math.max(0, 1 - mouseDistance / glowRadius);

            // Create flowing effect
            const flow = (Math.sin(frame * 0.02 + node1.phase) + 1) / 2;

            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);

            // Create a curved line with control points
            const controlPoint1 = {
                x: node1.x + dx * 0.3 + Math.sin(frame * 0.02 + node1.phase) * 20,
                y: node1.y + dy * 0.3 + Math.cos(frame * 0.02 + node1.phase) * 20
            };
            const controlPoint2 = {
                x: node1.x + dx * 0.7 + Math.sin(frame * 0.02 + node2.phase) * 20,
                y: node1.y + dy * 0.7 + Math.cos(frame * 0.02 + node2.phase) * 20
            };

            ctx.bezierCurveTo(
                controlPoint1.x, controlPoint1.y,
                controlPoint2.x, controlPoint2.y,
                node2.x, node2.y
            );

            // Set line style
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 + mouseIntensity * 0.4})`;
            ctx.lineWidth = 1 + mouseIntensity * 2;
            ctx.shadowBlur = mouseIntensity * 10;
            ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';

            // Draw flowing particles along the line
            const particleCount = Math.floor(distance / 30);
            for (let i = 0; i < particleCount; i++) {
                const t = (flow + i / particleCount) % 1;
                const x = cubicBezier(node1.x, controlPoint1.x, controlPoint2.x, node2.x, t);
                const y = cubicBezier(node1.y, controlPoint1.y, controlPoint2.y, node2.y, t);

                ctx.beginPath();
                ctx.arc(x, y, 1.5 + mouseIntensity * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${0.3 + mouseIntensity * 0.7})`;
                ctx.fill();
            }

            ctx.stroke();
        };

        // Cubic bezier interpolation
        const cubicBezier = (p0: number, p1: number, p2: number, p3: number, t: number) => {
            const mt = 1 - t;
            return (
                mt * mt * mt * p0 +
                3 * mt * mt * t * p1 +
                3 * mt * t * t * p2 +
                t * t * t * p3
            );
        };

        // Draw a code block node
        const drawCodeBlock = (ctx: CanvasRenderingContext2D, node: Node, intensity: number, frame: number) => {
            const wobble = Math.sin(frame * 0.05 + node.phase) * 2;

            ctx.save();
            ctx.translate(node.x, node.y);
            ctx.rotate(wobble * 0.05);

            // Draw glow
            if (intensity > 0) {
                ctx.shadowBlur = 15 * intensity;
                ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
            }

            // Draw symbol
            ctx.font = `${12 + intensity * 4}px "Fira Code", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + intensity * 0.6})`;
            ctx.fillText(node.symbol || '', 0, 0);

            ctx.restore();
        };

        // Draw a regular dot
        const drawDot = (ctx: CanvasRenderingContext2D, node: Node, intensity: number) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, dotSize * (1 + intensity), 0, Math.PI * 2);

            const alpha = 0.05 + intensity * 0.3;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

            if (intensity > 0) {
                ctx.shadowBlur = 5 * intensity;
                ctx.shadowColor = 'rgba(148, 163, 184, 0.5)';
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fill();
        };

        // Event listeners
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };

        const handleScroll = () => {
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