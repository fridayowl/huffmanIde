import React, { useEffect, useRef } from 'react';

interface DigitalBrainVisualizationProps {
    selectedModel: string;
    isInstalled: boolean;
    isPulling: boolean;
    pullProgress: number;
    isGenerating: boolean;
    status: string | null | undefined;
}

interface Particle {
    x: number;
    y: number;
    z: number;
    size: number;
    alpha: number;
    speed: number;
}

const DigitalBrainVisualization: React.FC<DigitalBrainVisualizationProps> = ({
    selectedModel,
    isInstalled,
    isPulling,
    pullProgress,
    isGenerating,
    status,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const modelScales = {
        'gemma:2b': 0.6,
        'gemma:7b': 0.8,
        'gemma:8x7b': 1.0,
        'qwenqwen2.5-coder': 0.6,
    };
    const scale = modelScales[selectedModel as keyof typeof modelScales] || 1.0;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);

        let animationFrameId: number;
        let particles: Particle[] = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const createParticles = () => {
            particles = Array.from({ length: 100 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * 100 - 50,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.5,
                speed: Math.random() * 0.5 + 0.2,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Outer glowing sphere
            const gradient = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, canvas.width / 2);
            gradient.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Particles
            particles.forEach((particle) => {
                particle.z -= particle.speed;
                if (particle.z < -50) particle.z = 50;

                const particleScale = Math.abs(particle.z) / 50;
                const x = centerX + (particle.x - centerX) * particleScale;
                const y = centerY + (particle.y - centerY) * particleScale;
                const size = particle.size * particleScale;

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56, 189, 248, ${particle.alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(56, 189, 248, 1)';
                ctx.fill();
            });

            // Core glow
            ctx.beginPath();
            ctx.arc(centerX, centerY, 30 * scale, 0, Math.PI * 2);
            ctx.fillStyle = isInstalled ? 'rgba(56, 189, 248, 1)' : 'rgba(239, 68, 68, 1)';
            ctx.shadowBlur = 50;
            ctx.shadowColor = isInstalled ? '#38BDF8' : '#EF4444';
            ctx.fill();

            animationFrameId = requestAnimationFrame(draw);
        };

        createParticles();
        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [selectedModel, isInstalled, scale]);

    return (
        <div
            className="relative mx-auto"
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                maxWidth: '500px',
                maxHeight: '500px',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#000',
                }}
            />
        </div>
    );
};

export default DigitalBrainVisualization;
