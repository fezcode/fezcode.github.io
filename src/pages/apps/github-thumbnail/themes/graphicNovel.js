import { wrapText } from '../utils';

export const graphicNovel = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars } = data;
    // GRAPHIC NOVEL (Sin City Style) - High Contrast Noir

    // 1. Background: Pure Black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // 2. High Contrast "Light" (Rain/Silhouettes)
    ctx.fillStyle = '#ffffff';

    // Rain/Slashes
    ctx.save();
    ctx.rotate(Math.PI / 8);
    for(let i=0; i<100; i++) {
        const x = Math.random() * width * 1.5 - width * 0.5;
        const y = Math.random() * height * 1.5 - height * 0.5;
        const w = (Math.random() * 5 + 2) * scale;
        const h = (Math.random() * 100 + 50) * scale;
        ctx.fillRect(x, y, w, h);
    }
    ctx.restore();

    // 3. Silhouette Cityscape (Bottom)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, height);
    let currentH = height * 0.7;
    for(let x=0; x<=width; x+=50*scale) {
        ctx.lineTo(x, currentH);
        currentH = height * (0.6 + Math.random() * 0.3);
        ctx.lineTo(x + 50*scale, currentH);
    }
    ctx.lineTo(width, height);
    ctx.fill();

    // Windows in silhouette (Black)
    ctx.fillStyle = '#000000';
    for(let i=0; i<20; i++) {
        const x = Math.random() * width;
        const y = height * 0.7 + Math.random() * height * 0.2;
        const size = (Math.random() * 10 + 5) * scale;
        ctx.fillRect(x, y, size, size * 1.5);
    }

    const padding = 60 * scale;

    // 4. Text - Comic Book Style
    // Main Title: Red Splash
    ctx.fillStyle = '#ff0000'; // Blood Red
    ctx.font = `900 ${110 * scale}px "Impact", "Arial Black", sans-serif`;
    ctx.textAlign = 'left';

    // Rough Shadow
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 4 * scale;
    ctx.shadowOffsetY = 4 * scale;
    ctx.fillText(repoName.toUpperCase(), padding, height * 0.4);

    // Reset Shadow
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Repo Owner - White blocky
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${40 * scale}px "Arial Narrow", sans-serif`;
    ctx.fillText(repoOwner.toUpperCase(), padding, height * 0.25);

    // Description - White Serif (Typewriter style)
    ctx.fillStyle = '#ff0000';
    ctx.font = `normal ${30 * scale}px "Space Mono", monospace`;
    wrapText(ctx, description, padding, height * 0.55, width * 0.6, 40 * scale);

    // 5. Speech Bubble for Stats
    const bubbleX = width * 0.75;
    const bubbleY = height * 0.2;
    const bubbleR = 120 * scale;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bubbleX, bubbleY, bubbleR, 0, Math.PI * 2);
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(bubbleX - 50*scale, bubbleY + 80*scale);
    ctx.lineTo(bubbleX - 80*scale, bubbleY + 150*scale); // Pointing down/left
    ctx.lineTo(bubbleX, bubbleY + 100*scale);
    ctx.fill();

    // Stats Text (Black inside bubble)
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.font = `bold ${30 * scale}px "Comic Sans MS", "Arial", sans-serif`;
    ctx.fillText("STATS:", bubbleX, bubbleY - 20 * scale);
    ctx.font = `bold ${24 * scale}px "Comic Sans MS", "Arial", sans-serif`;

    let statText = language;
    if (language.length > 10) statText = language.substring(0, 8) + '..';

    ctx.fillText(statText, bubbleX, bubbleY + 20 * scale);
    ctx.fillText(`${stars || 0} ★`, bubbleX, bubbleY + 60 * scale);

    // 6. Accent Splatter (Red)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
    for(let i=0; i<10; i++) {
        const r = Math.random() * 20 * scale;
        ctx.beginPath();
        ctx.arc(width - padding - Math.random()*100*scale, height - padding - Math.random()*100*scale, r, 0, Math.PI*2);
        ctx.fill();
    }
};
