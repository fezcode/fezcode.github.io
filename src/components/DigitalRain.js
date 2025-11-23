import React, { useRef, useEffect, memo } from 'react';

const DigitalRain = memo(({ isActive }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボпоヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops = Array.from({ length: Math.ceil(columns) }).map(() => 1);
        let frameCount = 0;
        const slowdownFactor = 5;

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 200, 0, 1.0)';
            ctx.font = `${fontSize}px monospace`;

            frameCount++;
            if (frameCount % slowdownFactor === 0) {
                for (let i = 0; i < rainDrops.length; i++) {
                    const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                    ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                    if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        rainDrops[i] = 0;
                    }
                    rainDrops[i]++;
                }
            }

            // Add notification text in the bottom left
            const notificationText = "Alt+K to bring command palette";
            const fezcode = "fezcode.com";
            ctx.font = "16px monospace";
            ctx.fillStyle = "rgba(0, 255, 0, 0.05)";
            ctx.textAlign = "left";
            ctx.fillText(notificationText, 20, canvas.height - 20);
            ctx.textAlign = "right";
            ctx.fillText(fezcode, canvas.width - 20,  canvas.height - 20);

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [isActive]);

    if (!isActive) return null;

    const canvasStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
    };

    return <canvas ref={canvasRef} style={canvasStyle}></canvas>;
});

export default DigitalRain;
