import { wrapText } from '../utils';

export const basketball = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, stars, forks } = data;
    // BASKETBALL / COURT SIDE Style

    // Wood Floor Background
    ctx.fillStyle = '#e8b576'; // Light wood
    ctx.fillRect(0, 0, width, height);

    // Wood Planks
    ctx.strokeStyle = '#d49b5e';
    ctx.lineWidth = 2 * scale;
    for(let x=0; x<width; x+=60*scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
        ctx.stroke();
    }

    // Court Lines (White & Black)
    ctx.lineWidth = 10 * scale;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    // Center Circle
    ctx.arc(width/2, height/2, 250 * scale, 0, Math.PI * 2);
    ctx.stroke();
    // Mid court line
    ctx.beginPath();
    ctx.moveTo(width/2, 0); ctx.lineTo(width/2, height);
    ctx.stroke();

    // Key Area (Left side decoration)
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(0, height * 0.3, 200 * scale, height * 0.4);

    const primaryColor = '#ff6b00'; // Basketball Orange
    const black = '#111';

    // Main Title: Varsity Style
    ctx.fillStyle = primaryColor;
    ctx.font = `900 ${120 * scale}px "Arial Black", "Impact", sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 8 * scale;
    ctx.strokeStyle = black; // Outline

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10 * scale;
    ctx.strokeText(repoName.toUpperCase(), width/2, height * 0.45);
    ctx.fillText(repoName.toUpperCase(), width/2, height * 0.45);
    ctx.shadowBlur = 0;

    // "VS" or "BY"
    ctx.fillStyle = black;
    ctx.font = `bold ${40 * scale}px "Arial", sans-serif`;
    ctx.fillText(`COACH: ${repoOwner.toUpperCase()}`, width/2, height * 0.25);

    // Scoreboard (Stats)
    const boardW = 600 * scale;
    const boardH = 150 * scale;
    const boardX = (width - boardW) / 2;
    const boardY = height * 0.7;

    ctx.fillStyle = '#222';
    ctx.fillRect(boardX, boardY, boardW, boardH);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 5 * scale;
    ctx.strokeRect(boardX, boardY, boardW, boardH);

    // LED Digits
    ctx.font = `bold ${50 * scale}px "Courier New", monospace`;
    ctx.textAlign = 'center';

    // Home (Stars)
    ctx.fillStyle = '#f00'; // LED Red
    ctx.fillText(stars || '0', boardX + boardW * 0.25, boardY + boardH * 0.6);
    ctx.font = `bold ${20 * scale}px "Arial", sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.fillText("STARS", boardX + boardW * 0.25, boardY + boardH * 0.85);

    // Away (Forks)
    ctx.font = `bold ${50 * scale}px "Courier New", monospace`;
    ctx.fillStyle = '#f00';
    ctx.fillText(forks || '0', boardX + boardW * 0.75, boardY + boardH * 0.6);
    ctx.font = `bold ${20 * scale}px "Arial", sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.fillText("FORKS", boardX + boardW * 0.75, boardY + boardH * 0.85);

    // Description text (Playbook)
    ctx.fillStyle = '#000';
    ctx.font = `italic bold ${24 * scale}px "Arial", sans-serif`;
    wrapText(ctx, description, width/2, height * 0.55, width * 0.8, 30 * scale);
};
