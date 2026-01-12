import { wrapText } from '../utils';

export const cod = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, forks } = data;
    // CALL OF DUTY / TACTICAL OPS Style

    // Background: Dark Camo / Night Vision Green tint
    ctx.fillStyle = '#0a0f0a'; // Very dark green/black
    ctx.fillRect(0, 0, width, height);

    // Grid Overlay (Tactical Map)
    ctx.strokeStyle = 'rgba(100, 255, 100, 0.1)';
    ctx.lineWidth = 1 * scale;
    const gridSize = 50 * scale;
    ctx.beginPath();
    for(let x=0; x<width; x+=gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
    }
    for(let y=0; y<height; y+=gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(width, y);
    }
    ctx.stroke();

    const padding = 60 * scale;
    const primaryColor = '#7fff00'; // Radar Green
    const secondaryColor = '#ffffff';

    // Top Left: Mission Info
    ctx.fillStyle = primaryColor;
    ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
    ctx.fillText(`OPERATOR: ${repoOwner.toUpperCase()}`, padding, padding);
    ctx.fillText(`MISSION: ${repoName.toUpperCase()}`, padding, padding + 30 * scale);

    // Top Right: Coordinates / Time
    ctx.textAlign = 'right';
    ctx.fillText(`LOC: ${stars || '0'}°N ${forks || '0'}°E`, width - padding, padding);
    ctx.fillText(`LANG: ${language.toUpperCase()}`, width - padding, padding + 30 * scale);

    // Center: Main Title with Glitch/Scan effect
    ctx.textAlign = 'center';
    ctx.font = `900 ${100 * scale}px "Impact", sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillText(repoName.toUpperCase(), width/2 + 5*scale, height/2 + 5*scale); // Shadow

    ctx.fillStyle = secondaryColor;
    ctx.fillText(repoName.toUpperCase(), width/2, height/2);

    // Crosshair in center
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2 * scale;
    const chSize = 40 * scale;
    ctx.beginPath();
    ctx.moveTo(width/2 - chSize, height/2); ctx.lineTo(width/2 + chSize, height/2);
    ctx.moveTo(width/2, height/2 - chSize); ctx.lineTo(width/2, height/2 + chSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width/2, height/2, 200 * scale, 0, Math.PI * 2); // Large circle
    ctx.setLineDash([10 * scale, 15 * scale]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Description Box (Tactical Intel)
    const descY = height * 0.65;
    ctx.fillStyle = 'rgba(0, 50, 0, 0.5)';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2 * scale;
    ctx.fillRect(width * 0.15, descY, width * 0.7, 120 * scale);
    ctx.strokeRect(width * 0.15, descY, width * 0.7, 120 * scale);

    ctx.fillStyle = primaryColor;
    ctx.font = `normal ${28 * scale}px "Courier New", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText("/// BRIEFING ///", width/2, descY - 10 * scale);

    ctx.fillStyle = secondaryColor;
    wrapText(ctx, description.toUpperCase(), width/2, descY + 40 * scale, width * 0.65, 35 * scale);

    // Bottom Corners: Tech Decoration
    ctx.fillStyle = primaryColor;
    ctx.fillRect(padding, height - padding, 100 * scale, 10 * scale);
    ctx.fillRect(padding, height - padding - 50 * scale, 10 * scale, 60 * scale);

    ctx.fillRect(width - padding - 100 * scale, height - padding, 100 * scale, 10 * scale);
    ctx.fillRect(width - padding, height - padding - 50 * scale, 10 * scale, 60 * scale);
};
