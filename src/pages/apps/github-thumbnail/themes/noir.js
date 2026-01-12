import { wrapText } from '../utils';

export const noir = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, supportUrl } = data;
    // NOIR CINEMA Style

    // Grainy B&W Background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    // Spotlight effect
    const grad = ctx.createRadialGradient(width*0.3, height*0.3, 100*scale, width*0.5, height*0.5, 800*scale);
    grad.addColorStop(0, '#444');
    grad.addColorStop(1, '#000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Noise
    // (Simulated with simple dots for performance)
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for(let i=0; i<5000; i++) {
        ctx.fillRect(Math.random()*width, Math.random()*height, 2*scale, 2*scale);
    }

    const padding = 100 * scale;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#eee';

    // Serif Typography
    const serifFont = '"Georgia", "Times New Roman", serif';

    ctx.font = `italic 400 ${40 * scale}px ${serifFont}`;
    ctx.fillText('The ' + repoOwner + ' Files', padding, padding);

    ctx.font = `900 ${120 * scale}px ${serifFont}`;
    ctx.shadowColor = 'rgba(255,255,255,0.2)';
    ctx.shadowBlur = 20 * scale;
    ctx.fillText(repoName, padding, height/2 - 20 * scale);
    ctx.shadowBlur = 0;

    // Line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(padding, height/2 + 20 * scale);
    ctx.lineTo(width - padding, height/2 + 20 * scale);
    ctx.stroke();

    ctx.font = `400 ${32 * scale}px ${serifFont}`;
    wrapText(ctx, description, padding, height/2 + 80 * scale, width * 0.6, 45 * scale);

    // Stamp style stats
    ctx.save();
    ctx.translate(width - 200 * scale, height - 200 * scale);
    ctx.rotate(-0.2);
    ctx.strokeStyle = '#d4d4d4';
    ctx.lineWidth = 5 * scale;
    ctx.strokeRect(-150 * scale, -80 * scale, 300 * scale, 160 * scale);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#d4d4d4';
    ctx.font = `900 ${40 * scale}px "Courier New", monospace`;
    ctx.fillText("CLASSIFIED", 0, -20 * scale);

    ctx.font = `bold ${20 * scale}px "Courier New", monospace`;
    ctx.fillText(`STARS: ${stars || '0'}`, 0, 20 * scale);
    ctx.fillText(`LANG: ${language.toUpperCase()}`, 0, 50 * scale);
    ctx.restore();

    if (supportUrl) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#666';
        ctx.font = `italic ${20 * scale}px ${serifFont}`;
        ctx.fillText(supportUrl, padding, height - padding/2);
    }
};
