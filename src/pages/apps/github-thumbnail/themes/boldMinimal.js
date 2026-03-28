export const boldMinimal = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
    bgColor,
    showPattern,
  } = data;

  // === PAPER BACKGROUND ===
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Aged paper texture
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 500; i++) {
      const x = ((i * 151 + 19) % 1280) * (width / 1280);
      const y = ((i * 83 + 41) % 640) * (height / 640);
      ctx.fillStyle = i % 2 === 0 ? '#c8b89a' : '#a09078';
      ctx.fillRect(x, y, (1 + (i % 3)) * scale, scale);
    }
    ctx.restore();

    // Coffee stain ring — top right
    ctx.save();
    ctx.globalAlpha = 0.035;
    ctx.strokeStyle = '#8b7355';
    ctx.lineWidth = 8 * scale;
    ctx.beginPath();
    ctx.arc(width * 0.82, height * 0.18, 55 * scale, 0.3, Math.PI * 1.7);
    ctx.stroke();
    ctx.restore();
  }

  // Fold crease — faint vertical line
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = '#8b7355';
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(width * 0.5, 0);
  ctx.lineTo(width * 0.5, height);
  ctx.stroke();
  ctx.restore();

  const pad = 70 * scale;
  const contentW = width - pad * 2;

  // === HEADER: Classification banner ===
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, 44 * scale);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${18 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CLASSIFIED — CONFIDENTIAL — AUTHORIZED PERSONNEL ONLY', width / 2, 22 * scale);

  // Bottom banner mirror
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, height - 44 * scale, width, 44 * scale);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${18 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'center';
  ctx.fillText('CLASSIFIED — CONFIDENTIAL — AUTHORIZED PERSONNEL ONLY', width / 2, height - 22 * scale);

  // === DOCUMENT BODY ===
  let curY = 44 * scale + pad * 0.6;

  // Document header
  ctx.fillStyle = '#2a2a2a';
  ctx.font = `${18 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('DEPARTMENT OF OPEN SOURCE INTELLIGENCE', pad, curY);
  curY += 26 * scale;
  ctx.fillStyle = '#888';
  ctx.font = `${15 * scale}px "JetBrains Mono"`;
  ctx.fillText(`CASE FILE: ${repoOwner.toUpperCase()}-${repoName.toUpperCase().substring(0, 8)}-001`, pad, curY);
  curY += 34 * scale;

  // Thin rule
  ctx.fillStyle = '#ccc';
  ctx.fillRect(pad, curY, contentW, 1 * scale);
  curY += 20 * scale;

  // Field: SUBJECT
  ctx.fillStyle = '#888';
  ctx.font = `${15 * scale}px "JetBrains Mono"`;
  ctx.fillText('SUBJECT:', pad, curY);

  // Repo name — large typewriter style
  curY += 24 * scale;
  ctx.fillStyle = '#1a1a1a';
  let nameSize = 90 * scale;
  ctx.font = `bold ${nameSize}px "Courier New", monospace`;
  while (ctx.measureText(repoName).width > contentW && nameSize > 30 * scale) {
    nameSize -= 4 * scale;
    ctx.font = `bold ${nameSize}px "Courier New", monospace`;
  }
  ctx.fillText(repoName, pad, curY);
  curY += nameSize + 12 * scale;

  // Field: ORIGINATOR
  ctx.fillStyle = '#888';
  ctx.font = `${15 * scale}px "JetBrains Mono"`;
  ctx.fillText('ORIGINATOR:', pad, curY);
  ctx.fillStyle = '#2a2a2a';
  ctx.font = `${20 * scale}px "Courier New", monospace`;
  ctx.fillText(repoOwner, pad + 140 * scale, curY);
  curY += 34 * scale;

  // Field: DETAILS — with partial redaction
  ctx.fillStyle = '#888';
  ctx.font = `${15 * scale}px "JetBrains Mono"`;
  ctx.fillText('DETAILS:', pad, curY);
  curY += 24 * scale;

  ctx.fillStyle = '#333';
  ctx.font = `${24 * scale}px "Courier New", monospace`;
  const words = description.split(' ');
  let line = '';
  const descLines = [];
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > contentW && i > 0) {
      descLines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = test;
    }
  }
  descLines.push(line.trim());

  descLines.forEach((dl, idx) => {
    ctx.fillStyle = '#333';
    ctx.font = `${24 * scale}px "Courier New", monospace`;
    ctx.fillText(dl, pad, curY);

    // Redact random words (deterministic based on index)
    if (idx < descLines.length - 1) {
      const dlWords = dl.split(' ');
      let wx = pad;
      dlWords.forEach((w, wi) => {
        const ww = ctx.measureText(w + ' ').width;
        if ((wi + idx * 3) % 5 === 2 && w.length > 3) {
          // Redaction bar with inverted text
          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(wx - 2 * scale, curY - 2 * scale, ww - 4 * scale, 28 * scale);
          ctx.fillStyle = bgColor;
          ctx.fillText(w, wx, curY);
        }
        wx += ww;
      });
    }

    curY += 32 * scale;
  });

  curY += 10 * scale;

  // Field row: LANG / STARS / FORKS
  ctx.fillStyle = '#ccc';
  ctx.fillRect(pad, curY, contentW, 1 * scale);
  curY += 16 * scale;

  ctx.font = `${15 * scale}px "JetBrains Mono"`;
  ctx.textBaseline = 'top';

  // Language
  ctx.fillStyle = '#888';
  ctx.fillText('LANG:', pad, curY);
  ctx.fillStyle = '#2a2a2a';
  ctx.font = `bold ${20 * scale}px "Courier New", monospace`;
  ctx.fillText(language, pad + 70 * scale, curY);

  // Stars
  if (stars) {
    ctx.fillStyle = '#888';
    ctx.font = `${15 * scale}px "JetBrains Mono"`;
    ctx.fillText('STARS:', pad + 280 * scale, curY);
    ctx.fillStyle = '#2a2a2a';
    ctx.font = `bold ${20 * scale}px "Courier New", monospace`;
    ctx.fillText(String(stars), pad + 355 * scale, curY);
  }

  // Forks
  if (forks) {
    ctx.fillStyle = '#888';
    ctx.font = `${15 * scale}px "JetBrains Mono"`;
    ctx.fillText('FORKS:', pad + 480 * scale, curY);
    ctx.fillStyle = '#2a2a2a';
    ctx.font = `bold ${20 * scale}px "Courier New", monospace`;
    ctx.fillText(String(forks), pad + 555 * scale, curY);
  }

  // === CLASSIFIED STAMP — large, rotated ===
  ctx.save();
  ctx.translate(width * 0.72, height * 0.45);
  ctx.rotate(-0.18);
  ctx.globalAlpha = 0.2;

  // Stamp border
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 4 * scale;
  const stampW = 340 * scale;
  const stampH = 110 * scale;
  ctx.strokeRect(-stampW / 2, -stampH / 2, stampW, stampH);

  // Double border
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(-stampW / 2 + 6 * scale, -stampH / 2 + 6 * scale, stampW - 12 * scale, stampH - 12 * scale);

  // Stamp text
  ctx.fillStyle = secondaryColor;
  ctx.font = `bold ${58 * scale}px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CLASSIFIED', 0, 0);
  ctx.restore();

  // === APPROVAL STAMP — smaller, different angle ===
  ctx.save();
  ctx.translate(width * 0.2, height * 0.7);
  ctx.rotate(0.12);
  ctx.globalAlpha = 0.15;

  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.arc(0, 0, 58 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 50 * scale, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${20 * scale}px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('APPROVED', 0, -8 * scale);
  ctx.font = `${13 * scale}px "Courier New", monospace`;
  ctx.fillText('OPEN SOURCE', 0, 14 * scale);
  ctx.restore();

  // === Support URL as file reference ===
  if (supportUrl) {
    ctx.fillStyle = '#aaa';
    ctx.font = `${14 * scale}px "JetBrains Mono"`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`REF: ${supportUrl}`, width - pad, height - 44 * scale - 12 * scale);
  }
};
