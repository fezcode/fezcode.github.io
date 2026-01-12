import { wrapText } from '../utils';

export const rich = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars } = data;
    // RICH / LUXURY GOLD Style

    // Marble/Paper Background
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, width, height);

    // Gold Gradient
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, '#bf953f');
    goldGrad.addColorStop(0.25, '#fcf6ba');
    goldGrad.addColorStop(0.5, '#b38728');
    goldGrad.addColorStop(0.75, '#fbf5b7');
    goldGrad.addColorStop(1, '#aa771c');

    // Border Frame
    const padding = 50 * scale;
    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 10 * scale;
    ctx.strokeRect(padding, padding, width - padding*2, height - padding*2);

    // Inner thin line
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(padding + 15*scale, padding + 15*scale, width - padding*2 - 30*scale, height - padding*2 - 30*scale);

    // Decorative Flourish (Simple lines for now)
    ctx.beginPath();
    ctx.moveTo(width/2 - 100*scale, height * 0.35);
    ctx.lineTo(width/2 + 100*scale, height * 0.35);
    ctx.stroke();

    // Typography
    const serifFont = '"Playfair Display", "Times New Roman", serif';

    // Title
    ctx.fillStyle = '#1a1a1a'; // Dark Charcoal
    ctx.font = `italic 900 ${100 * scale}px ${serifFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(repoName, width/2, height * 0.3);

    // Owner (The Brand)
    ctx.font = `bold ${30 * scale}px ${serifFont}`;
    ctx.letterSpacing = '5px';
    ctx.fillStyle = '#aa771c'; // Gold text
    ctx.fillText(repoOwner.toUpperCase(), width/2, height * 0.15);

    // Description
    ctx.fillStyle = '#333';
    ctx.font = `normal ${32 * scale}px ${serifFont}`;
    wrapText(ctx, description, width/2, height * 0.5, width * 0.6, 45 * scale);

    // "Seal" of Quality (Stats)
    const sealX = width - padding - 100 * scale;
    const sealY = height - padding - 100 * scale;
    const sealR = 80 * scale;

    ctx.beginPath();
    ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
    ctx.fillStyle = goldGrad;
    ctx.fill();

    // Seal text
    ctx.fillStyle = '#000';
    ctx.font = `bold ${24 * scale}px ${serifFont}`;
    ctx.fillText(stars || '0', sealX, sealY);
    ctx.font = `normal ${16 * scale}px ${serifFont}`;
    ctx.fillText("STARS", sealX, sealY + 20 * scale);

    // Lang at bottom center
    ctx.fillStyle = '#666';
    ctx.font = `italic ${24 * scale}px ${serifFont}`;
    ctx.fillText(`~ ${language} ~`, width/2, height - padding - 30 * scale);
};
