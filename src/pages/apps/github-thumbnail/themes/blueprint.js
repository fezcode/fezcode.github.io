import { wrapText } from '../utils';

export const blueprint = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, stars, supportUrl } = data;
    // Improved Blueprint CAD Style
    const blueBg = '#004ecb'; // Deeper, more authentic blueprint blue
    ctx.fillStyle = blueBg;
    ctx.fillRect(0, 0, width, height);

    const padding = 60 * scale;

    // Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1 * scale;
    const gridSize = 40 * scale;

    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) ctx.rect(x, 0, 1, height);
    for (let y = 0; y < height; y += gridSize) ctx.rect(0, y, width, 1);
    ctx.stroke();

    // Major Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize * 4) ctx.rect(x, 0, 1, height);
    for (let y = 0; y < height; y += gridSize * 4) ctx.rect(0, y, width, 1);
    ctx.stroke();

    // Main Frame
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 6 * scale;
    ctx.strokeRect(padding, padding, width - (padding * 2), height - (padding * 2));

    // Title Block (Bottom Left)
    const blockW = 500 * scale;
    const blockH = 180 * scale;
    const blockX = padding; // Move to left
    const blockY = height - padding - blockH;

    ctx.lineWidth = 3 * scale;
    ctx.fillStyle = 'white';
    ctx.strokeRect(blockX, blockY, blockW, blockH);

    // Internal lines of Title Block
    const rowH = blockH / 4;
    ctx.beginPath();
    for(let i=1; i<4; i++) {
        ctx.moveTo(blockX, blockY + (i*rowH));
        ctx.lineTo(blockX + blockW, blockY + (i*rowH));
    }
    ctx.moveTo(blockX + (blockW * 0.3), blockY);
    ctx.lineTo(blockX + (blockW * 0.3), blockY + blockH);
    ctx.stroke();

    // Text in Block
    ctx.font = `bold ${14 * scale}px "Courier New", monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const labels = ['PROJECT', 'AUTHOR', 'URL', 'STARS'];
    const values = [repoName.substring(0, 20).toUpperCase(), repoOwner.toUpperCase(), (supportUrl || '').toUpperCase(), stars || '0'];

    labels.forEach((label, i) => {
        ctx.fillText(label, blockX + 10 * scale, blockY + (i * rowH) + (rowH/2));
        ctx.fillText(values[i], blockX + (blockW * 0.3) + 10 * scale, blockY + (i * rowH) + (rowH/2));
    });

    // Main Drawing Area Content
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Center Lines
    ctx.setLineDash([20 * scale, 10 * scale, 5 * scale, 10 * scale]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(width/2, padding); ctx.lineTo(width/2, height - padding); // Vert
    ctx.moveTo(padding, height/2); ctx.lineTo(width - padding, height/2); // Horiz
    ctx.stroke();
    ctx.setLineDash([]);

    // Project Name (Main) - Moved Up
    ctx.font = `bold ${100 * scale}px "Courier New", monospace`;
    ctx.fillStyle = 'white';
    ctx.fillText(repoName.toUpperCase(), width/2, height/2 - 80 * scale);

    // Measurement Lines
    const textW = ctx.measureText(repoName.toUpperCase()).width;
    const lineY = height/2; // adjusted

    ctx.beginPath();
    ctx.moveTo(width/2 - textW/2, lineY);
    ctx.lineTo(width/2 + textW/2, lineY);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Arrows
    ctx.beginPath();
    ctx.moveTo(width/2 - textW/2 + 20*scale, lineY - 10*scale); ctx.lineTo(width/2 - textW/2, lineY); ctx.lineTo(width/2 - textW/2 + 20*scale, lineY + 10*scale);
    ctx.moveTo(width/2 + textW/2 - 20*scale, lineY - 10*scale); ctx.lineTo(width/2 + textW/2, lineY); ctx.lineTo(width/2 + textW/2 - 20*scale, lineY + 10*scale);
    ctx.fill();

    // Description - Bottom Right
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `${24 * scale}px "Courier New", monospace`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

    const descX = width/2 + 40 * scale;
    const descY = height/2 + 40 * scale;
    const descW = width/2 - padding - 80 * scale;

    // Label for description
    ctx.fillText("NOTES:", descX, descY);

    // Wrap text below "NOTES:"
    wrapText(ctx, description.toUpperCase(), descX, descY + 40 * scale, descW, 35 * scale);
};
