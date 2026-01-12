import { wrapText } from '../utils';

export const abstract = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, forks } = data;
    // ABSTRACT SHAPES (Memphis-ish)

    // Background: Soft Off-White
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, width, height);

    // Random Shapes Background
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7d794', '#1a535c'];

    // Helper to draw random shapes
    for(let i=0; i<15; i++) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.save();
        ctx.globalAlpha = 0.2;
        const type = Math.random();
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = (50 + Math.random() * 150) * scale;

        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI * 2);

        ctx.beginPath();
        if (type < 0.33) {
            // Circle
            ctx.arc(0, 0, size/2, 0, Math.PI*2);
        } else if (type < 0.66) {
            // Rect
            ctx.rect(-size/2, -size/2, size, size);
        } else {
            // Triangle
            ctx.moveTo(0, -size/2);
            ctx.lineTo(size/2, size/2);
            ctx.lineTo(-size/2, size/2);
        }
        ctx.fill();
        ctx.restore();
    }

    // Main Card (Floating)
    const cardW = width * 0.7;
    const cardH = height * 0.6;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;

    // Shadow
    ctx.fillStyle = '#000'; // Hard shadow
    ctx.fillRect(cardX + 20*scale, cardY + 20*scale, cardW, cardH);

    // Card Body
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4 * scale;
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Header Decoration inside card
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(cardX, cardY, cardW, 20 * scale);
    ctx.strokeRect(cardX, cardY, cardW, 20 * scale);

    // Content
    const padding = 60 * scale;
    const contentY = cardY + padding + 20*scale;

    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';

    // Title
    ctx.font = `900 ${70 * scale}px "Arial Black", sans-serif`;
    ctx.fillText(repoName, width/2, contentY + 40*scale);

    // Owner
    ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
    ctx.fillText(repoOwner.toUpperCase(), width/2, contentY - 20*scale);

    // Description
    ctx.font = `normal ${28 * scale}px "Arial", sans-serif`;
    wrapText(ctx, description, width/2, contentY + 120*scale, cardW - padding*2, 40*scale);

    // Stats Bubbles (Bottom of card)
    const statY = cardY + cardH - 60 * scale;

    const drawStat = (text, x, color) => {
        ctx.fillStyle = color;
        const w = ctx.measureText(text).width + 40*scale;
        ctx.beginPath();
        ctx.roundRect(x - w/2, statY - 25*scale, w, 50*scale, 25*scale);
        ctx.fill();
        ctx.stroke(); // Outline

        ctx.fillStyle = '#000';
        ctx.font = `bold ${20 * scale}px "Arial", sans-serif`;
        ctx.fillText(text, x, statY + 8*scale);
    };

    let cx = width/2;
    // Spread based on content
    if (stars && forks) {
        drawStat(`★ ${stars}`, cx - 120*scale, '#f7d794');
        drawStat(language, cx, '#4ecdc4');
        drawStat(`⑂ ${forks}`, cx + 120*scale, '#45b7d1');
    } else {
        drawStat(language, cx, '#4ecdc4');
    }
};
