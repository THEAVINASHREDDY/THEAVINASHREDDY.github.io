import React, { useEffect, useRef } from 'react';

const RetroGridBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Configuration
        const gridColor = '#22d3ee'; // Cyan-500
        const horizonColor = '#a855f7'; // Purple-500
        const skyColor = '#0f172a'; // Slate-900 (Background)
        const speed = 2;
        let offset = 0;

        const animate = () => {
            const width = canvas.width;
            const height = canvas.height;
            const horizonY = height * 0.5; // Horizon at 50% (Center)
            const gridHeight = height - horizonY;

            // 1. Unified Background (Sky + Ground) - No seams
            // We create a gradient that covers the whole screen
            const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
            bgGradient.addColorStop(0, '#0f172a'); // Top (Slate-900)
            bgGradient.addColorStop(0.5, '#1e1b4b'); // Horizon (Indigo-950) - Explicit center point
            bgGradient.addColorStop(1, '#0f172a'); // Bottom (Slate-900)
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // 2. Draw Sun/Core Glow - Additive Blending for smooth integration
            ctx.save();
            ctx.globalCompositeOperation = 'lighter'; // Additive blending makes it glow without hard edges
            const sunGradient = ctx.createRadialGradient(
                width / 2, horizonY, 0,
                width / 2, horizonY, 300
            );
            sunGradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)'); // Purple
            sunGradient.addColorStop(1, 'rgba(168, 85, 247, 0)'); // Transparent

            ctx.fillStyle = sunGradient;
            ctx.fillRect(0, horizonY - 300, width, 600);
            ctx.restore();

            // --- Draw Grid ---
            // Gradient Stroke to mask horizon
            const gridGradient = ctx.createLinearGradient(0, horizonY, 0, height);
            // Start fully transparent
            gridGradient.addColorStop(0, 'rgba(34, 211, 238, 0)');
            gridGradient.addColorStop(0.2, 'rgba(34, 211, 238, 0)');
            gridGradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.5)');
            gridGradient.addColorStop(1, '#22d3ee');

            ctx.strokeStyle = gridGradient;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 10; // Neon Glow
            ctx.shadowColor = '#22d3ee';

            // Vertical Lines
            const centerX = width / 2;
            const verticalLines = 40;
            const spacing = width * 1.5 / verticalLines;

            ctx.beginPath();
            for (let i = -20; i <= 20; i++) {
                let x = centerX + i * spacing * 2;
                ctx.moveTo(centerX, horizonY);
                ctx.lineTo(x, height);
            }
            ctx.stroke();

            // Horizontal Lines
            offset = (offset + speed) % 100;

            ctx.beginPath();
            for (let i = 0; i < 20; i++) {
                let progress = (i * 50 + offset) % 1000;
                let perspectiveY = horizonY + (gridHeight * 100) / (progress + 10);

                if (perspectiveY >= horizonY && perspectiveY < height) {
                    ctx.moveTo(0, perspectiveY);
                    ctx.lineTo(width, perspectiveY);
                }
            }
            ctx.stroke();

            // 3. Horizon Fog Mask - Subtle fade at the horizon line itself
            const fogGradient = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY + 50);
            fogGradient.addColorStop(0, 'rgba(30, 27, 75, 0)');
            fogGradient.addColorStop(0.5, '#1e1b4b'); // Solid color at horizon matching background
            fogGradient.addColorStop(1, 'rgba(30, 27, 75, 0)');

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default RetroGridBackground;
