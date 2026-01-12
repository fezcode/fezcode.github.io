import { wrapText } from '../utils';

export const swiss = (ctx, width, height, scale, data) => {
    const { primaryColor, repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // SWISS GRID Style
    ctx.fillStyle = '#f1f1f1'; // Off-white background
    ctx.fillRect(0, 0, width, height);

    // Bold Asymmetry
    const col1 = width * 0.22;

    // Left Column (Color Block)
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, col1, height);

    // Grid Lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(col1, 0); ctx.lineTo(col1, height); // Vertical split

    const row1 = height * 0.25;
    const row2 = height * 0.75;

    ctx.moveTo(col1, row1); ctx.lineTo(width, row1); // Top horizontal
    ctx.moveTo(col1, row2); ctx.lineTo(width, row2); // Bottom horizontal
    ctx.stroke();

    // Typography - Helvetica style (Arial/Inter fallback)
    const fontStack = '"Helvetica Neue", "Arial", sans-serif';
    const padding = 40 * scale;

    // 1. Top Right: Project Info
    ctx.fillStyle = '#000';
    ctx.font = `bold ${30 * scale}px ${fontStack}`;
    ctx.textAlign = 'left';
    ctx.fillText(repoOwner.toUpperCase(), col1 + padding, row1 - padding - 30 * scale);

    // 2. Center Right: Description & Name
    // Repo Name huge
    ctx.fillStyle = '#000';
    ctx.font = `900 ${100 * scale}px ${fontStack}`;
    ctx.fillText(repoName, col1 + padding, row1 + 120 * scale);

    // Description
    ctx.font = `normal ${32 * scale}px ${fontStack}`;
    wrapText(ctx, description, col1 + padding, row1 + 200 * scale, width - col1 - (padding * 2), 40 * scale);

    // 3. Bottom Right: Stats
    ctx.font = `bold ${24 * scale}px ${fontStack}`;
    let statX = col1 + padding;
    const statY = row2 + 60 * scale;

    if (stars) {
            ctx.fillText(`★ ${stars}`, statX, statY);
            statX += 150 * scale;
    }
    if (forks) {
        ctx.fillText(`⑂ ${forks}`, statX, statY);
            statX += 150 * scale;
    }
    ctx.fillText(language.toUpperCase(), statX, statY);

    // 4. Left Column: Vertical Text or Graphic
    ctx.save();
    ctx.translate(col1 / 2, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = `900 ${100 * scale}px ${fontStack}`;
    ctx.fillText("GIT", 0, 35 * scale);
    ctx.restore();

    if (supportUrl) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = `normal ${20 * scale}px ${fontStack}`;
        ctx.fillText(supportUrl, width - padding, height - padding);
    }
};
