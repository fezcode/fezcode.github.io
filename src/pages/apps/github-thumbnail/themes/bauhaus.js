import { wrapText } from '../utils';

export const bauhaus = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars } = data;
    // BAUHAUS_GEO
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Geometric Composition
    ctx.fillStyle = '#D93025'; // Red
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.3, 150 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F4B400'; // Yellow
    ctx.fillRect(width * 0.6, height * 0.1, 400 * scale, 200 * scale);

    ctx.fillStyle = '#1A73E8'; // Blue
    ctx.beginPath();
    ctx.moveTo(width * 0.8, height);
    ctx.lineTo(width, height * 0.6);
    ctx.lineTo(width, height);
    ctx.fill();

    // Diagonal Black Bar
    ctx.fillStyle = '#000';
    ctx.save();
    ctx.translate(width/2, height/2);
    ctx.rotate(-Math.PI / 12);
    ctx.fillRect(-width, 0, width*2, 20 * scale);
    ctx.restore();

    const font = '"Futura", "Helvetica Neue", "Arial", sans-serif';

    // Typography
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.font = `900 ${120 * scale}px ${font}`;
    ctx.fillText(repoName, 60 * scale, height * 0.65);

    ctx.font = `bold ${40 * scale}px ${font}`;
    ctx.fillText(repoOwner.toUpperCase(), 60 * scale, height * 0.5);

    // Description in a block
    ctx.fillStyle = '#333';
    ctx.font = `normal ${30 * scale}px ${font}`;
    wrapText(ctx, description, 60 * scale, height * 0.75, width * 0.6, 40 * scale);

    // Side stats vertical
    ctx.save();
    ctx.translate(width - 60 * scale, 60 * scale);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'left';
    ctx.font = `bold ${24 * scale}px ${font}`;
    ctx.fillText(`${language.toUpperCase()}  //  STARS: ${stars || 0}`, 0, 0);
    ctx.restore();
};
