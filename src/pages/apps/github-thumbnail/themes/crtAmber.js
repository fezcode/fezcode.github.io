import { wrapText } from '../utils';

export const crtAmber = (ctx, width, height, scale, data) => {
  const { repoOwner, repoName, description, language, stars, forks } = data;
  // RETRO AMBER CRT Style

  const amber = '#ffb000';

  // Background: Deep Black
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, width, height);

  // Scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  for (let i = 0; i < height; i += 4 * scale) {
    ctx.fillRect(0, i, width, 2 * scale);
  }

  // Vignette (Simulate curved screen corners darkening)
  const grad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.3,
    width / 2,
    height / 2,
    width * 0.8,
  );
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.8)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Glow Effect
  ctx.shadowBlur = 10 * scale;
  ctx.shadowColor = amber;

  const padding = 80 * scale;

  // Header
  ctx.fillStyle = amber;
  ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(`> SYSTEM.LOGIN: ${repoOwner}`, padding, padding);
  ctx.fillText(
    `> MOUNTING REPO: ${repoName}... OK`,
    padding,
    padding + 40 * scale,
  );

  // Main Title (ASCII Art style simulation or just big blocky text)
  ctx.font = `900 ${100 * scale}px "Courier New", monospace`;
  ctx.fillText(repoName.toUpperCase(), padding, height * 0.4);

  // Line
  ctx.strokeStyle = amber;
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(padding, height * 0.45);
  ctx.lineTo(width - padding, height * 0.45);
  ctx.stroke();

  // Description
  ctx.font = `normal ${30 * scale}px "Courier New", monospace`;
  wrapText(
    ctx,
    description,
    padding,
    height * 0.55,
    width - padding * 2,
    40 * scale,
  );

  // Stats as System Stats
  const bottomY = height - padding;
  ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
  let stats = `[ MEMORY: ${stars || 0} KB ]`; // Stars as memory
  stats += `  [ PROCS: ${forks || 0} ]`; // Forks as processes
  stats += `  [ LANG: ${language.toUpperCase()} ]`;

  ctx.fillText(stats, padding, bottomY);

  // Blinking Cursor
  ctx.fillRect(
    padding + ctx.measureText(stats).width + 10 * scale,
    bottomY - 25 * scale,
    15 * scale,
    30 * scale,
  );
};
