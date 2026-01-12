import { wrapText } from '../utils';

export const popart = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, stars } = data;
    // POP_ART_COMIC
    ctx.fillStyle = '#FFE600'; // Bright Yellow
    ctx.fillRect(0, 0, width, height);

    // Halftone Pattern (Red dots)
    ctx.fillStyle = '#FF0000';
    const dotSize = 4 * scale;
    const spacing = 12 * scale;
    for(let x=0; x<width; x+=spacing) {
            for(let y=0; y<height; y+=spacing) {
                ctx.beginPath();
                ctx.arc(x, y, dotSize, 0, Math.PI*2);
                ctx.fill();
            }
    }

    // Burst Background
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    const cx = width * 0.7;
    const cy = height * 0.4;
    const outerR = 500 * scale;
    const innerR = 300 * scale;
    const spikes = 20;
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerR);
    for(let i=0; i<spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.lineWidth = 10 * scale;
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.fill();

    // Text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#000';
    ctx.font = `900 ${100 * scale}px "Comic Sans MS", "Impact", sans-serif`;

    // Shadow effect
    ctx.fillStyle = '#000';
    ctx.fillText(repoName.toUpperCase(), 80 * scale, height - 120 * scale);
    ctx.fillStyle = '#0099ff';
    ctx.fillText(repoName.toUpperCase(), 70 * scale, height - 130 * scale);

    // Speech Bubble for description
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    const bx = 100 * scale;
    const by = 100 * scale;
    const bw = 500 * scale;
    const bh = 200 * scale;
    ctx.roundRect(bx, by, bw, bh, 20 * scale);
    ctx.fill();
    ctx.stroke();

    // Triangle tail
    ctx.beginPath();
    ctx.moveTo(bx + 100 * scale, by + bh);
    ctx.lineTo(bx + 120 * scale, by + bh + 40 * scale);
    ctx.lineTo(bx + 180 * scale, by + bh);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = `bold ${24 * scale}px "Comic Sans MS", sans-serif`;
    wrapText(ctx, description.toUpperCase(), bx + 20 * scale, by + 50 * scale, bw - 40 * scale, 30 * scale);

    // Corner label
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 200 * scale, 60 * scale);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${30 * scale}px sans-serif`;
    ctx.fillText(repoOwner.toUpperCase(), 20 * scale, 40 * scale);

    // Stats Box
    ctx.fillStyle = '#000';
    ctx.fillRect(width - 300 * scale, height - 80 * scale, 300 * scale, 80 * scale);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = `bold ${30 * scale}px sans-serif`;
    ctx.fillText(`${stars || '0'} STARS!`, width - 150 * scale, height - 30 * scale);
  };
