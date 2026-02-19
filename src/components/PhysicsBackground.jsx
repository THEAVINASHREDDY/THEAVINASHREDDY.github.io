import React, { useEffect, useRef } from 'react';

const PhysicsBackground = () => {
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

        // Physics constants
        const particles = [];
        const particleCount = 100;
        const connectionDistance = 150;
        const mouseValues = { x: null, y: null, radius: 200 };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 3 + 1.5; // Larger particles
                this.color = '#22d3ee'; // Cyan-500
            }

            update() {
                // Basic movement
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse interaction (Gravity/Attraction)
                if (mouseValues.x != null) {
                    const dx = mouseValues.x - this.x;
                    const dy = mouseValues.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseValues.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseValues.radius - distance) / mouseValues.radius;
                        const directionX = forceDirectionX * force * 0.5; // Strength
                        const directionY = forceDirectionY * force * 0.5;

                        this.vx += directionX;
                        this.vy += directionY;

                        // Limit speed
                        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                        if (speed > 3) {
                            this.vx = (this.vx / speed) * 3;
                            this.vy = (this.vy / speed) * 3;
                        }
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw gradient background slightly to create trails? No, sticking to clean.
            // ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            connectParticles();

            animationFrameId = requestAnimationFrame(animate);
        };

        const connectParticles = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = 1 - distance / connectionDistance;
                        ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.2})`; // Cyan with opacity
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const handleMouseMove = (e) => {
            mouseValues.x = e.x;
            mouseValues.y = e.y;
        };

        const handleMouseLeave = () => {
            mouseValues.x = null;
            mouseValues.y = null;
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default PhysicsBackground;
