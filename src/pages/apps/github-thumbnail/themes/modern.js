import { wrapText, drawPill } from '../utils';

export const modern = (ctx, width, height, scale, data) => {
    const { primaryColor, secondaryColor, repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // Background Gradient Orb
    ctx.save();
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, secondaryColor);

    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 400 * scale, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.filter = 'blur(100px)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.8, 300 * scale, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();

    // Content Container
    const padding = 80 * scale;

    // Repo Owner/Name
    ctx.fillStyle = primaryColor;
    ctx.font = `bold ${30 * scale}px "JetBrains Mono"`;
    ctx.fillText(`${repoOwner} /`, padding, padding + 20 * scale);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${80 * scale}px "Inter", sans-serif`;
    ctx.fillText(repoName, padding, padding + 110 * scale);

    // Description
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `${32 * scale}px "Inter", sans-serif`;
    const maxWidth = width - (padding * 2);
    wrapText(ctx, description, padding, padding + 180 * scale, maxWidth, 45 * scale);

    // Bottom Bar (Stats & Lang)
    const bottomY = height - padding;

    // Language Pill
    drawPill(ctx, padding, bottomY - 20 * scale, language, primaryColor, scale);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = `${20 * scale}px "JetBrains Mono"`;
    let currentX = width - padding;

    if (supportUrl) {
        ctx.fillText(supportUrl, currentX, bottomY);
        currentX -= (ctx.measureText(supportUrl).width + 40 * scale);
    }

    // Stats
    ctx.font = `bold ${24 * scale}px "JetBrains Mono"`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const statGap = 40 * scale;

    if (forks) {
        ctx.fillText(`${forks} Forks`, currentX, bottomY);
        currentX -= (ctx.measureText(`${forks} Forks`).width + statGap);
    }

    if (stars) {
        ctx.fillText(`${stars} Stars`, currentX, bottomY);
    }
};
