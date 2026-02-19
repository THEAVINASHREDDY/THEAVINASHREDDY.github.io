import React, { useEffect, useRef } from 'react';

const HypercubeBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Center origin
            ctx.translate(canvas.width / 2, canvas.height / 2);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // 4D Maths
        let angle = 0;
        const points = [];

        // Generate Tesseract Vertices (±1, ±1, ±1, ±1)
        // 16 points
        for (let i = 0; i < 16; i++) {
            points.push([
                (i & 1) ? 1 : -1,
                (i & 2) ? 1 : -1,
                (i & 4) ? 1 : -1,
                (i & 8) ? 1 : -1
            ]);
        }

        const connect = (i, j, points2d) => {
            const a = points2d[i];
            const b = points2d[j];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        };

        // Connect logic: if two points differ by exactly 1 coordinate bit, they are connected
        // It's easier to check powers of 2 difference in index? 
        // Logic: Iterate all pairs, if Hamming distance is 1 (differ by 1 coord), connect.
        const edges = [];
        for (let i = 0; i < 16; i++) {
            for (let j = i + 1; j < 16; j++) {
                // Check if they differ by exactly one coordinate
                let diff = 0;
                for (let k = 0; k < 4; k++) {
                    if (points[i][k] !== points[j][k]) diff++;
                }
                if (diff === 1) {
                    edges.push([i, j]);
                }
            }
        }

        const matMul = (v, m) => {
            // v is 1xN, m is NxN
            // Actually simpler: standard matrix vector mul
            // We use simple rotation matrices
            // Only implementing rotation for now
            return v; // placeholder
        };

        const rotate = (p, angle) => {
            // Copy point
            let n = [...p];

            // Rotate ZW
            // [ cos -sin ]
            // [ sin  cos ]
            // Only affecting indices 2 (z) and 3 (w)
            let z = n[2];
            let w = n[3];
            n[2] = z * Math.cos(angle) - w * Math.sin(angle);
            n[3] = z * Math.sin(angle) + w * Math.cos(angle);

            // Rotate XY
            let x = n[0];
            let y = n[1];
            n[0] = x * Math.cos(angle * 0.5) - y * Math.sin(angle * 0.5); // Slower
            n[1] = x * Math.sin(angle * 0.5) + y * Math.cos(angle * 0.5);

            return n;
        };

        const project = (p) => {
            // 4D -> 3D (perspective w)
            // Distance camera to 4D object
            const distance = 2.5;
            let w = 1 / (distance - p[3]);

            let proj3d = [
                p[0] * w,
                p[1] * w,
                p[2] * w
            ];

            // 3D -> 2D (perspective z)
            const distance2 = 2.5; // Scale/zoom
            let z = 1 / (distance2 - proj3d[2]);

            // Adjust scale for screen size
            const scale = Math.min(canvas.width, canvas.height) * 0.4; // 40% of screen size

            return {
                x: proj3d[0] * z * scale,
                y: proj3d[1] * z * scale
            };
        };

        const animate = () => {
            ctx.fillStyle = '#0f172a'; // Clear with background color to remove trails
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Use 0,0 because we didn't translate the fillRect, wait.
            // Oh, we translated context. So we need to fill from negative to positive.
            ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

            angle += 0.01;

            const projectedPoints = [];

            // Calculate projections
            points.forEach(p => {
                const rotated = rotate(p, angle);
                const projected = project(rotated);
                projectedPoints.push(projected);

                // Draw vertices
                ctx.fillStyle = '#22d3ee';
                ctx.beginPath();
                ctx.arc(projected.x, projected.y, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw edges
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 1.5;
            edges.forEach(edge => {
                const [i, j] = edge;
                const p1 = projectedPoints[i];
                const p2 = projectedPoints[j];

                // Basic stroke
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.globalAlpha = 0.5;
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            });

            // Connect "outer" and "inner" to aid 4D visualization depth?
            // The logic above connects standard edges.

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

export default HypercubeBackground;
