import React, { useRef, useEffect } from 'react';

const DigitalRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas to full width and height of its container
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops = Array.from({ length: columns }).map(() => 1);

        let animationFrameId;
        let frameCount = 0;
        const slowdownFactor = 3; // Higher number = slower rain

        const draw = () => {
            ctx.fillStyle = 'rgba(21, 21, 21, 0.05)'; // Semi-transparent black for fading effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = `${fontSize}px monospace`;

            frameCount++;

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (frameCount % slowdownFactor === 0) {
                    if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        rainDrops[i] = 0;
                    }
                    rainDrops[i]++;
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Style for the canvas to fill the modal body
    const canvasStyle = {
        display: 'block',
        width: '100%',
        height: '60vh', // Make it tall inside the modal
    };

    return (
        <canvas ref={canvasRef} style={canvasStyle}></canvas>
    );
};

export default DigitalRain;
