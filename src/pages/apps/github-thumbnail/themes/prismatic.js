import { wrapText } from '../utils';

export const prismatic = (ctx, width, height, scale, data) => {
    const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // PRISMATIC HAZE Style

    // Deep Dark Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // 1. Vibrant Gradient Mesh / Orbs
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const drawOrb = (x, y, r, color) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    };

    drawOrb(width * 0.2, height * 0.3, 600 * scale, primaryColor);
    drawOrb(width * 0.8, height * 0.7, 500 * scale, secondaryColor);
    drawOrb(width * 0.5, height * 0.5, 400 * scale, bgColor); // Center highlight

    ctx.restore();

    // 2. Fine Grain Noise
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    for(let i=0; i<8000; i++) {
            ctx.fillRect(Math.random()*width, Math.random()*height, 2*scale, 2*scale);
    }
    ctx.restore();

    // 3. Glass Card Container
    const cardW = width * 0.85;
    const cardH = height * 0.65;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;
    const r = 40 * scale;

    ctx.save();
    // Glass Fill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, r);
    ctx.fill();

    // Glass Border
    const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
    borderGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
    borderGrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    borderGrad.addColorStop(1, 'rgba(255,255,255,0.4)');

    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Inner Glow
    ctx.shadowColor = 'rgba(255,255,255,0.2)';
    ctx.shadowBlur = 30 * scale;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // 4. Content
    const contentPad = 80 * scale;

    // Elegant Typography
    const elegantFont = '"Playfair Display", "Times New Roman", serif';
    const cleanFont = '"Inter", "Helvetica Neue", sans-serif';

    // Repo Name (Big & Elegant)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = `italic 900 ${90 * scale}px ${elegantFont}`;
    ctx.fillText(repoName, width/2, height * 0.42);

    // Owner (Small & Clean)
    ctx.font = `300 ${24 * scale}px ${cleanFont}`;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.letterSpacing = '4px'; // Canvas doesn't support this directly easily without manual spacing, but standard fonts might handle it okay-ish or we ignore.
    ctx.fillText(`—  ${repoOwner.toUpperCase()}  —`, width/2, height * 0.52);

    // Description
    ctx.font = `400 ${28 * scale}px ${cleanFont}`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    wrapText(ctx, description, width/2, height * 0.58, cardW - (contentPad*2), 40 * scale);

    // Bottom details
    const bottomY = cardY + cardH - 40 * scale;

    ctx.font = `600 ${20 * scale}px ${cleanFont}`;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';

    const details = [];
    if (language) details.push(language.toUpperCase());
    if (stars) details.push(`${stars} ★`);
    if (forks) details.push(`${forks} ⑂`);

    ctx.fillText(details.join('   •   '), width/2, bottomY - 30 * scale);

    if (supportUrl) {
            ctx.font = `italic 400 ${18 * scale}px ${elegantFont}`;
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillText(supportUrl, width/2, bottomY);
    }
};
