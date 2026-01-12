import { wrapText } from '../utils';

export const gameboy = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // RETRO HANDHELD (Game Boy)
    const gbGreens = ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'];
    ctx.fillStyle = gbGreens[3]; // Lightest green bg
    ctx.fillRect(0, 0, width, height);

    // Pixel Grid effect
    ctx.fillStyle = 'rgba(15, 56, 15, 0.1)';
    for(let x=0; x<width; x+=4*scale) {
            ctx.fillRect(x, 0, 1, height);
    }
    for(let y=0; y<height; y+=4*scale) {
            ctx.fillRect(0, y, width, 1);
    }

    const padding = 60 * scale;

    // Top Header
    ctx.fillStyle = gbGreens[0]; // Darkest green
    ctx.fillRect(0, 0, width, 50 * scale);

    ctx.fillStyle = gbGreens[3];
    ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
    ctx.textAlign = 'left';
    ctx.fillText("NINTENDO-ISH // GITHUB CART", padding, 35 * scale);

    ctx.textAlign = 'right';
    ctx.fillText("BATTERY [||||]", width - padding, 35 * scale);

    // Content
    ctx.textAlign = 'center';
    ctx.fillStyle = gbGreens[0];

    // 8-bit Font emulation using standard bold serif or courier
    ctx.font = `900 ${80 * scale}px "Courier New", monospace`;
    ctx.fillText(repoName.toUpperCase(), width/2, height/3);

    ctx.fillStyle = gbGreens[1];
    ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
    ctx.fillText(repoOwner.toUpperCase(), width/2, height/3 - 80 * scale);

    // Description Box
    ctx.fillStyle = gbGreens[2];
    ctx.fillRect(padding, height/2 - 20 * scale, width - (padding*2), 150 * scale);

    ctx.fillStyle = gbGreens[0];
    ctx.textAlign = 'center';
    ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
    wrapText(ctx, description.toUpperCase(), width/2, height/2 + 20 * scale, width - (padding*3), 30 * scale);

    // Bottom Stats
    ctx.fillStyle = gbGreens[0];
    ctx.textAlign = 'left';

    const bottomY = height - 60 * scale;
    let statsStr = `LANG: ${language.toUpperCase()}`;
    if (stars) statsStr += `  STARS: ${stars}`;
    if (forks) statsStr += `  FORKS: ${forks}`;

    ctx.fillText(statsStr, padding, bottomY);

    if (supportUrl) {
        ctx.textAlign = 'right';
        ctx.fillText(supportUrl.toUpperCase(), width - padding, bottomY);
    }
};
