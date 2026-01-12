import { wrapText } from '../utils';

export const sketch = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, forks } = data;
    // HAND_DRAWN Sketch
    ctx.fillStyle = '#fffdf0'; // Cream paper
    ctx.fillRect(0, 0, width, height);

    // Paper Texture (Noise)
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#000';
    for(let i=0; i<width; i+=4*scale) {
            for(let j=0; j<height; j+=4*scale) {
                if (Math.random() > 0.5) ctx.fillRect(i, j, 2*scale, 2*scale);
            }
    }
    ctx.restore();

    const padding = 80 * scale;

    // Scribble Border
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Rough rectangle
    const roughRect = (x, y, w, h) => {
        ctx.moveTo(x + Math.random()*10, y + Math.random()*10);
        ctx.lineTo(x + w - Math.random()*10, y - Math.random()*5);
        ctx.lineTo(x + w + Math.random()*5, y + h - Math.random()*10);
        ctx.lineTo(x - Math.random()*5, y + h + Math.random()*5);
        ctx.closePath();
    };
    roughRect(padding, padding, width - padding*2, height - padding*2);
    ctx.stroke();

    // Second pass for "sketchy" look
    ctx.strokeStyle = '#444';
    ctx.beginPath();
    roughRect(padding + 2*scale, padding + 2*scale, width - padding*2 - 5*scale, height - padding*2 - 5*scale);
    ctx.stroke();

    // Title
    ctx.fillStyle = '#222';
    ctx.font = `900 ${90 * scale}px "Segoe Print", "Comic Sans MS", "Chalkboard SE", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(repoName, width/2, height * 0.4);

    // Underline scribble
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.42);
    ctx.bezierCurveTo(width*0.4, height*0.44, width*0.6, height*0.41, width*0.7, height*0.43);
    ctx.stroke();

    // Owner
    ctx.font = `bold ${30 * scale}px "Segoe Print", "Comic Sans MS", "Chalkboard SE", sans-serif`;
    ctx.fillText(`by ${repoOwner}`, width/2, height * 0.25);

    // Description
    ctx.font = `normal ${30 * scale}px "Segoe Print", "Comic Sans MS", "Chalkboard SE", sans-serif`;
    wrapText(ctx, description, width/2, height * 0.55, width * 0.7, 45 * scale);

    // Stick figure stats? Or just text
    ctx.font = `bold ${24 * scale}px "Segoe Print", "Comic Sans MS", "Chalkboard SE", sans-serif`;
    let statsStr = language;
    if (stars) statsStr += `  |  * ${stars}`;
    if (forks) statsStr += `  |  Y ${forks}`;
    ctx.fillText(statsStr, width/2, height - padding - 20 * scale);
};
