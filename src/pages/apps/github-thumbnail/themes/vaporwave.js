export const vaporwave = (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description } = data;
    // VAPORWAVE AESTHETIC
    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#ff71ce'); // Neon Pink
    grad.addColorStop(0.5, '#01cdfe'); // Neon Blue
    grad.addColorStop(1, '#05ffa1'); // Neon Green
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Grid Floor
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2 * scale;

    const horizon = height * 0.6;
    const centerX = width / 2;

    // Perspective Lines
    for(let i=-20; i<=20; i++) {
        ctx.moveTo(centerX + (i * 100 * scale), height);
        ctx.lineTo(centerX, horizon);
    }

    // Horizontal Lines
    for(let i=0; i<10; i++) {
        const y = horizon + (Math.pow(i, 2) * 5 * scale);
        if (y > height) break;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Sun
    ctx.fillStyle = '#ffb900';
    ctx.beginPath();
    ctx.arc(centerX, horizon - 100 * scale, 150 * scale, 0, Math.PI, true);
    ctx.fill();

    // Sun stripes
    ctx.fillStyle = '#ff71ce'; // Match top bg roughly or pink
    for(let i=0; i<5; i++) {
            ctx.fillRect(centerX - 160*scale, horizon - 100*scale - (i*20*scale), 320*scale, 5*scale);
    }
    ctx.restore();

    // Text
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 5 * scale;
    ctx.shadowOffsetY = 5 * scale;

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    // Wide Text function
    const toFullWidth = (str) => str.split('').join(' ');

    ctx.font = `900 ${80 * scale}px "Times New Roman", serif`;
    ctx.fillText(toFullWidth(repoName.toUpperCase()), width/2, height * 0.4);

    ctx.font = `italic 400 ${30 * scale}px "Times New Roman", serif`;
    ctx.fillText(toFullWidth(repoOwner.toUpperCase()), width/2, height * 0.25);

    // Japanese Text Embellishment
    ctx.fillStyle = '#01cdfe';
    ctx.font = `bold ${60 * scale}px "Arial", sans-serif`;
    ctx.fillText("リサフランク420", width * 0.15, height * 0.8);
    ctx.fillText("現代のコンピューティング", width * 0.85, height * 0.8);

    // Description Box
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(width * 0.2, height * 0.85, width * 0.6, 80 * scale);

    ctx.fillStyle = 'white';
    ctx.font = `${20 * scale}px "Courier New", monospace`;
    ctx.fillText(description.substring(0, 60).toUpperCase(), width/2, height * 0.9);
  };
