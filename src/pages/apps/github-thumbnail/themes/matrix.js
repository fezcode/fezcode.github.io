import { wrapText } from '../utils';

export const matrix = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, forks } = data;
    // THE MATRIX / DIGITAL RAIN Style

    // Black Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Digital Rain Effect (Simulated)
    ctx.font = `bold ${20 * scale}px "Courier New", monospace`;
    const cols = Math.floor(width / (20 * scale));

    // We'll use a deterministic random for preview stability or just random
        for(let i=0; i<cols; i++) {
            // Random column length
            const len = Math.floor(Math.random() * 20) + 5;

            for(let j=0; j<len; j++) {            // Fade out towards top
            const alpha = 1 - (j / len);
            ctx.fillStyle = `rgba(0, 255, 70, ${alpha * 0.5})`; // Matrix Green

            // Random katakana or numbers
            const char = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.fillText(char, i * 20 * scale, (j * 20 * scale + (Math.random()*height)) % height);
        }
    }

    // Overlay Box
    const boxW = width * 0.8;
    const boxH = height * 0.6;
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.strokeStyle = '#00ff41'; // Matrix Green
    ctx.lineWidth = 2 * scale;

    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Terminal Content
    const padding = 60 * scale;
    let textY = boxY + padding;

    ctx.fillStyle = '#00ff41';
    ctx.textAlign = 'left';

    // Header
    ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
    ctx.fillText(`root@matrix:~# analyze --target "${repoOwner}/${repoName}"`, boxX + padding, textY);
    textY += 50 * scale;

    ctx.fillStyle = '#ffffff';
    ctx.fillText(`> TARGET IDENTIFIED:`, boxX + padding, textY);
    textY += 40 * scale;

    // Title
    ctx.font = `900 ${80 * scale}px "Courier New", monospace`;
    ctx.fillStyle = '#00ff41';
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur = 10 * scale;
    ctx.fillText(repoName, boxX + padding, textY + 50*scale);
    ctx.shadowBlur = 0;
    textY += 120 * scale;

    // Description
    ctx.fillStyle = '#cccccc';
    ctx.font = `normal ${28 * scale}px "Courier New", monospace`;
    wrapText(ctx, description, boxX + padding, textY, boxW - padding*2, 35 * scale);

    // Bottom Stats
    const bottomY = boxY + boxH - padding;
    ctx.fillStyle = '#00ff41';
    ctx.font = `bold ${24 * scale}px "Courier New", monospace`;

    let stats = `[ LANG: ${language} ]`;
    if (stars) stats += ` [ STARS: ${stars} ]`;
    if (forks) stats += ` [ FORKS: ${forks} ]`;

    ctx.fillText(stats, boxX + padding, bottomY);

    // Blinking Cursor
    const textWidth = ctx.measureText(stats).width;
    ctx.fillRect(boxX + padding + textWidth + 10*scale, bottomY - 20*scale, 15*scale, 25*scale);
};
