import { wrapText } from '../utils';

export const abstractNonsense = (ctx, width, height, scale, data) => {
  const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description } = data;

  ctx.save();

  // Crazy random shapes
  for(let i=0; i<50; i++) {
    const type = Math.floor(Math.random() * 3);
    ctx.fillStyle = i % 3 === 0 ? primaryColor : (i % 3 === 1 ? secondaryColor : bgColor);
    ctx.globalAlpha = Math.random() * 0.8 + 0.2;

    ctx.beginPath();
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 200 * scale;

    if (type === 0) {
      ctx.arc(x, y, size, 0, Math.PI * 2);
    } else if (type === 1) {
      ctx.rect(x, y, size, size);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y + size/2);
      ctx.lineTo(x, y + size);
    }
    ctx.fill();
  }

  // Overlay gradient to make text readable
  const grd = ctx.createLinearGradient(0, 0, 0, height);
  grd.addColorStop(0, 'rgba(0,0,0,0.4)');
  grd.addColorStop(1, 'rgba(0,0,0,0.8)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();

  const padding = 80 * scale;

  // Text with a slight skew
  ctx.save();
  ctx.translate(padding, padding + 110 * scale);
  ctx.rotate(-0.05);

  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${30 * scale}px "Impact", "Arial Black", sans-serif`;
  ctx.fillText(`${repoOwner} /`, 0, -90 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${90 * scale}px "Impact", "Arial Black", sans-serif`;
  ctx.fillText(repoName, 0, 0);
  ctx.restore();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `${32 * scale}px "Impact", "Arial Black", sans-serif`;
  wrapText(ctx, description, padding, padding + 220 * scale, width - padding * 2, 45 * scale);
};