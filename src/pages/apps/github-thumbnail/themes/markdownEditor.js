// Markdown Editor — a dark VS Code-style IDE with README.md open.
// The repo metadata is authored AS a markdown document: line-numbered,
// syntax-highlighted source on the left, the rendered preview on the right,
// an activity bar, a file tab, and an accent-colored status bar.
//
// User controls map to meaningful roles:
//   primaryColor   → signal accent: status bar, active-tab underline, the
//                    `#` heading text, the block caret, the preview h1 rule.
//   secondaryColor → markdown markers: `>`, `-`, code fences, fence language.
//   bgColor        → tints the editor canvas but is forced dark so the IDE
//                    look survives any picked color.

export const markdownEditor = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    bgColor,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
  } = data;

  const primary = primaryColor || '#519AFF';
  const secondary = secondaryColor || '#C586C0';
  const base = forceDark(bgColor || '#1E1E24');

  // Presence checks — empty strings count as "not provided" so we don't
  // render bare ★/⑂ markers or empty pills when a field is cleared.
  const has = (v) => v !== undefined && v !== null && String(v).trim() !== '';
  const hasStars = has(stars);
  const hasForks = has(forks);
  const hasLang = has(language);

  // ─── derived surfaces ────────────────────────────────────────────────────
  const editorBg = base;
  const previewBg = mix(base, '#ffffff', 0.024);
  const activityBg = mix(base, '#000000', 0.40);
  const tabBg = mix(base, '#000000', 0.24);
  const border = mix(base, '#ffffff', 0.11);
  const borderSoft = mix(base, '#ffffff', 0.07);

  const textMain = '#D4D4D4';
  const textSoft = '#8A8F98';
  const gutterDim = '#5C636E';
  const quote = '#9AA0A6';

  // VS Code "Dark+" token palette (fixed — reads as real code)
  const kw = '#569CD6';
  const str = '#CE9178';
  const op = '#D4D4D4';
  const varTok = '#9CDCFE';
  const num = '#B5CEA8';

  // fonts
  const mono = '"JetBrains Mono", "Geist Mono", ui-monospace, monospace';
  const sans = 'system-ui, -apple-system, "Segoe UI", sans-serif';

  // ─── region geometry ─────────────────────────────────────────────────────
  const acts = 60 * scale; // activity bar
  const tabH = 48 * scale;
  const statusH = 32 * scale;
  const contentTop = tabH;
  const contentBottom = height - statusH;
  const splitX = acts + (width - acts) * 0.54;

  ctx.textBaseline = 'alphabetic';

  // ─── 1. base fills ───────────────────────────────────────────────────────
  ctx.fillStyle = editorBg;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = previewBg;
  ctx.fillRect(splitX, contentTop, width - splitX, contentBottom - contentTop);

  // divider between editor + preview
  ctx.fillStyle = border;
  ctx.fillRect(splitX, contentTop, 1 * scale, contentBottom - contentTop);

  // ─── 2. activity bar ─────────────────────────────────────────────────────
  ctx.fillStyle = activityBg;
  ctx.fillRect(0, 0, acts, height);
  ctx.fillStyle = border;
  ctx.fillRect(acts - 1 * scale, 0, 1 * scale, height);

  const aCx = acts / 2;
  const aS = 22 * scale;
  // active item (files) accent
  ctx.fillStyle = primary;
  ctx.fillRect(0, 78 * scale - aS, 3 * scale, aS * 2);
  drawActIcon(ctx, 'files', aCx, 78 * scale, aS, '#E8E8E8', scale);
  drawActIcon(ctx, 'search', aCx, 138 * scale, aS, '#7A7F87', scale);
  drawActIcon(ctx, 'git', aCx, 198 * scale, aS, '#7A7F87', scale);
  drawActIcon(ctx, 'debug', aCx, 258 * scale, aS, '#7A7F87', scale);
  drawActIcon(ctx, 'ext', aCx, 318 * scale, aS, '#7A7F87', scale);
  drawActIcon(ctx, 'account', aCx, contentBottom - 92 * scale, aS, '#7A7F87', scale);
  drawActIcon(ctx, 'gear', aCx, contentBottom - 38 * scale, aS, '#7A7F87', scale);

  // ─── 3. tab bar ──────────────────────────────────────────────────────────
  ctx.fillStyle = tabBg;
  ctx.fillRect(acts, 0, width - acts, tabH);
  ctx.fillStyle = borderSoft;
  ctx.fillRect(acts, tabH - 1 * scale, width - acts, 1 * scale);

  // active tab "README.md ●"
  ctx.font = `500 ${18 * scale}px ${sans}`;
  const tabLabel = 'README.md';
  const tabTextW = ctx.measureText(tabLabel).width;
  const tabPad = 18 * scale;
  const tabW = tabTextW + tabPad * 2 + 40 * scale; // room for md glyph + dot
  const tabX = acts;
  ctx.fillStyle = editorBg;
  ctx.fillRect(tabX, 0, tabW, tabH);
  ctx.fillStyle = primary; // active underline
  ctx.fillRect(tabX, 0, tabW, 2 * scale);
  ctx.fillStyle = borderSoft;
  ctx.fillRect(tabX + tabW, 0, 1 * scale, tabH);

  // tiny "M↓" markdown badge
  const badgeX = tabX + tabPad;
  ctx.fillStyle = mix(primary, '#ffffff', 0.1);
  roundRectPath(ctx, badgeX, tabH / 2 - 11 * scale, 26 * scale, 22 * scale, 4 * scale);
  ctx.fill();
  ctx.fillStyle = readableOn(primary);
  ctx.font = `700 ${12 * scale}px ${mono}`;
  ctx.textAlign = 'center';
  ctx.fillText('M↓', badgeX + 13 * scale, tabH / 2 + 4 * scale);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#E6E6E6';
  ctx.font = `500 ${18 * scale}px ${sans}`;
  const labelX = badgeX + 34 * scale;
  ctx.fillText(tabLabel, labelX, tabH / 2 + 6 * scale);
  // unsaved dot
  ctx.fillStyle = '#D4D4D4';
  ctx.beginPath();
  ctx.arc(labelX + tabTextW + 14 * scale, tabH / 2, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // dimmed neighbor tab
  ctx.fillStyle = '#6B7079';
  ctx.font = `400 ${17 * scale}px ${sans}`;
  ctx.fillText('package.json', tabX + tabW + 22 * scale, tabH / 2 + 6 * scale);

  // right-side "preview" split affordance
  const pvX = width - 150 * scale;
  ctx.strokeStyle = '#6B7079';
  ctx.lineWidth = 1.6 * scale;
  roundRectPath(ctx, pvX, tabH / 2 - 9 * scale, 26 * scale, 18 * scale, 3 * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pvX + 13 * scale, tabH / 2 - 9 * scale);
  ctx.lineTo(pvX + 13 * scale, tabH / 2 + 9 * scale);
  ctx.stroke();
  ctx.fillStyle = '#7A7F87';
  ctx.font = `500 ${15 * scale}px ${sans}`;
  ctx.fillText('Preview', pvX + 34 * scale, tabH / 2 + 5 * scale);

  // ─── 4. editor pane — markdown source ────────────────────────────────────
  const gutterW = 56 * scale;
  const textX = acts + gutterW + 14 * scale;
  const srcSize = 27 * scale;
  const lineH = 44 * scale;
  const srcFont = `500 ${srcSize}px ${mono}`;
  const srcBold = `700 ${srcSize}px ${mono}`;
  const srcItalic = `italic 500 ${srcSize}px ${mono}`;
  const srcMaxW = splitX - textX - 30 * scale;

  let lineNo = 0;
  let y = contentTop + 56 * scale;

  const drawGutter = (n, baseY, active) => {
    ctx.font = `500 ${19 * scale}px ${mono}`;
    ctx.fillStyle = active ? '#C6C6C6' : gutterDim;
    ctx.textAlign = 'right';
    ctx.fillText(String(n), acts + gutterW - 14 * scale, baseY);
    ctx.textAlign = 'left';
  };

  // tokens: [{ text, color, weight }]  weight: 'b'|'i'|undefined
  const emit = (tokens, active) => {
    lineNo += 1;
    if (active) {
      ctx.fillStyle = hexA('#ffffff', 0.05);
      ctx.fillRect(acts, y - srcSize, splitX - acts, lineH);
      ctx.fillStyle = hexA(primary, 0.55);
      ctx.fillRect(acts, y - srcSize, 2 * scale, lineH);
    }
    drawGutter(lineNo, y, active);
    let cx = textX;
    ctx.textAlign = 'left';
    for (const t of tokens) {
      ctx.font = t.weight === 'b' ? srcBold : t.weight === 'i' ? srcItalic : srcFont;
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, cx, y);
      cx += ctx.measureText(t.text).width;
    }
    const endX = cx;
    const baseY = y;
    y += lineH;
    return { endX, baseY };
  };

  // line 1 — # heading (active, with caret)
  const headingName = truncate(ctx, repoName || 'repository', srcMaxW - 60 * scale, srcBold);
  const h1 = emit(
    [
      { text: '# ', color: secondary },
      { text: headingName, color: primary, weight: 'b' },
    ],
    true,
  );
  // block caret
  ctx.fillStyle = hexA(primary, 0.92);
  ctx.fillRect(h1.endX + 5 * scale, h1.baseY - srcSize * 0.82, srcSize * 0.52, srcSize * 0.98);

  emit([]); // blank

  // blockquote description (up to 2 lines)
  const descLines = wrapLines(ctx, description || '', srcMaxW - 28 * scale, srcItalic, 2);
  if (descLines.length) {
    descLines.forEach((ln) =>
      emit([
        { text: '> ', color: secondary },
        { text: ln, color: quote, weight: 'i' },
      ]),
    );
    emit([]); // blank
  }

  // list item — stars / forks (omit entirely when neither is provided)
  if (hasStars || hasForks) {
    const listTokens = [{ text: '- ', color: secondary }];
    if (hasStars) {
      listTokens.push({ text: '★ ', color: primary });
      listTokens.push({ text: `${stars}`, color: textMain });
    }
    if (hasStars && hasForks) listTokens.push({ text: '   ', color: textMain });
    if (hasForks) {
      listTokens.push({ text: '⑂ ', color: secondary });
      listTokens.push({ text: `${forks}`, color: textMain });
    }
    emit(listTokens);
    emit([]); // blank
  }

  // fenced code block
  const lang = (language || 'ts').toLowerCase();
  emit([
    { text: '```', color: secondary },
    { text: lang, color: varTok },
  ]);
  const vName = toVar(repoName);
  // Measure the actual `const <name> = ` prefix so the string truncates
  // exactly within the editor column instead of bleeding into the preview.
  ctx.font = srcFont;
  const codePrefixW = ctx.measureText(`const ${vName} = `).width;
  const codeStr = truncate(
    ctx,
    `"${repoOwner || 'fezcodex'}/${repoName || 'repo'}"`,
    srcMaxW - codePrefixW,
    srcFont,
  );
  emit([
    { text: 'const ', color: kw },
    { text: `${vName} `, color: varTok },
    { text: '= ', color: op },
    { text: codeStr, color: str },
  ]);
  emit([{ text: '```', color: secondary }]);

  // editor scrollbar hint
  ctx.fillStyle = hexA('#ffffff', 0.13);
  roundRectPath(ctx, splitX - 9 * scale, contentTop + 18 * scale, 4 * scale, 130 * scale, 2 * scale);
  ctx.fill();

  // ─── 5. preview pane — rendered markdown ─────────────────────────────────
  const px = splitX + 44 * scale;
  const pw = width - 40 * scale - px;
  let py = contentTop + 92 * scale;

  // h1
  let h1Size = 46 * scale;
  let h1Font = `700 ${h1Size}px ${sans}`;
  ctx.font = h1Font;
  const previewName = repoName || 'repository';
  if (ctx.measureText(previewName).width > pw) {
    h1Size = 38 * scale;
    h1Font = `700 ${h1Size}px ${sans}`;
  }
  ctx.font = h1Font;
  ctx.fillStyle = '#F3F4F6';
  ctx.textAlign = 'left';
  ctx.fillText(truncate(ctx, previewName, pw, h1Font), px, py);

  // GitHub-style h1 bottom rule + primary accent segment
  const ruleY = py + 22 * scale;
  ctx.fillStyle = border;
  ctx.fillRect(px, ruleY, pw, 1.5 * scale);
  ctx.fillStyle = primary;
  ctx.fillRect(px, ruleY - 1 * scale, 64 * scale, 3 * scale);

  // owner subline
  py = ruleY + 40 * scale;
  ctx.fillStyle = textSoft;
  ctx.font = `400 ${19 * scale}px ${sans}`;
  ctx.fillText(`@${(repoOwner || 'fezcodex').toLowerCase()}`, px, py);

  // body
  py += 42 * scale;
  ctx.fillStyle = '#AEB4BE';
  const bodyFont = `400 ${22 * scale}px ${sans}`;
  const bodyLines = wrapLines(ctx, description || '', pw, bodyFont, 3);
  ctx.font = bodyFont;
  bodyLines.forEach((ln, i) => ctx.fillText(ln, px, py + i * 33 * scale));
  py += bodyLines.length * 33 * scale + 26 * scale;

  // meta pills
  const pillH = 40 * scale;
  let pillX = px;
  const drawPill = (text, accent, langDot) => {
    ctx.font = `600 ${17 * scale}px ${sans}`;
    const tw = ctx.measureText(text).width;
    const w = tw + (langDot ? 44 * scale : 30 * scale);
    roundRectPath(ctx, pillX, py, w, pillH, 8 * scale);
    ctx.fillStyle = hexA(accent, 0.16);
    ctx.fill();
    ctx.lineWidth = 1.2 * scale;
    ctx.strokeStyle = hexA(accent, 0.5);
    ctx.stroke();
    let tx = pillX + 15 * scale;
    if (langDot) {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(pillX + 16 * scale, py + pillH / 2, 6 * scale, 0, Math.PI * 2);
      ctx.fill();
      tx = pillX + 30 * scale;
    }
    ctx.fillStyle = langDot ? '#C8CDD4' : accent;
    ctx.fillText(text, tx, py + pillH / 2 + 6 * scale);
    pillX += w + 12 * scale;
  };
  if (hasStars) drawPill(`★ ${stars}`, primary, false);
  if (hasForks) drawPill(`⑂ ${forks}`, secondary, false);
  if (hasLang) drawPill(language, langColor(language), true);

  // rendered code block card
  const cardH = 116 * scale;
  const cardY = contentBottom - cardH - 30 * scale;
  if (cardY > py + 20 * scale) {
    roundRectPath(ctx, px, cardY, pw, cardH, 10 * scale);
    ctx.fillStyle = '#0D1117';
    ctx.fill();
    ctx.lineWidth = 1 * scale;
    ctx.strokeStyle = border;
    ctx.stroke();

    // lang label top-right
    ctx.fillStyle = textSoft;
    ctx.font = `500 ${14 * scale}px ${mono}`;
    ctx.textAlign = 'right';
    ctx.fillText(lang, px + pw - 16 * scale, cardY + 24 * scale);
    ctx.textAlign = 'left';

    // two faux code lines
    const codeFont = `500 ${18 * scale}px ${mono}`;
    const cyl = cardY + 44 * scale;
    let ccx = px + 18 * scale;
    const codeTok = (text, color) => {
      ctx.font = codeFont;
      ctx.fillStyle = color;
      ctx.fillText(text, ccx, cyl);
      ccx += ctx.measureText(text).width;
    };
    codeTok('import ', kw);
    codeTok('{ build } ', varTok);
    codeTok('from ', kw);
    codeTok(truncate(ctx, `"${repoName || 'repo'}"`, pw - 220 * scale, codeFont), str);

    ccx = px + 18 * scale;
    const cyl2 = cardY + 76 * scale;
    const codeTok2 = (text, color) => {
      ctx.font = codeFont;
      ctx.fillStyle = color;
      ctx.fillText(text, ccx, cyl2);
      ccx += ctx.measureText(text).width;
    };
    codeTok2('build', varTok);
    if (hasStars) {
      codeTok2('({ ', op);
      codeTok2('stars', varTok);
      codeTok2(': ', op);
      codeTok2(String(stars).replace(/[^\d.]/g, '') || '0', num);
      codeTok2(' })', op);
    } else {
      codeTok2('()', op);
    }
  }

  // ─── 6. status bar ───────────────────────────────────────────────────────
  ctx.fillStyle = primary;
  ctx.fillRect(0, contentBottom, width, statusH);
  const sbText = readableOn(primary);
  const sbY = contentBottom + statusH / 2 + 5 * scale;
  ctx.font = `600 ${14 * scale}px ${mono}`;
  ctx.textAlign = 'left';

  // left cluster: branch + diagnostics
  let sx = 14 * scale;
  // git-branch glyph
  ctx.strokeStyle = sbText;
  ctx.lineWidth = 1.6 * scale;
  const gby = contentBottom + statusH / 2;
  ctx.beginPath();
  ctx.arc(sx + 3 * scale, gby - 6 * scale, 2.6 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sx + 3 * scale, gby + 6 * scale, 2.6 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sx + 13 * scale, gby - 2 * scale, 2.6 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx + 3 * scale, gby - 3.4 * scale);
  ctx.lineTo(sx + 3 * scale, gby + 3.4 * scale);
  ctx.moveTo(sx + 3 * scale, gby + 1 * scale);
  ctx.lineTo(sx + 11 * scale, gby - 1 * scale);
  ctx.stroke();
  ctx.fillStyle = sbText;
  ctx.fillText('main', sx + 22 * scale, sbY);
  sx += 22 * scale + ctx.measureText('main').width + 20 * scale;
  ctx.fillText('✕ 0   ⚠ 0', sx, sbY);

  // right cluster
  ctx.textAlign = 'right';
  const colN = (headingName.length + 2).toString();
  const rightStr = `Ln 1, Col ${colN}    Spaces: 2    UTF-8    Markdown`;
  let rx = width - 14 * scale;
  if (supportUrl) {
    ctx.fillStyle = hexA(sbText, 0.85);
    ctx.fillText(supportUrl, rx, sbY);
    rx -= ctx.measureText(supportUrl).width + 22 * scale;
  }
  ctx.fillStyle = sbText;
  ctx.fillText(rightStr, rx, sbY);
  ctx.textAlign = 'left';
};

// ─── activity-bar icons ──────────────────────────────────────────────────────
function drawActIcon(ctx, kind, cx, cy, s, color, scale) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2 * scale;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const circle = (x, y, r) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
  };
  if (kind === 'files') {
    const w = s * 0.74;
    const h = s;
    const x = cx - w / 2;
    const y = cy - h / 2;
    const f = s * 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - f, y);
    ctx.lineTo(x + w, y + f);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w - f, y);
    ctx.lineTo(x + w - f, y + f);
    ctx.lineTo(x + w, y + f);
    ctx.stroke();
  } else if (kind === 'search') {
    const r = s * 0.3;
    circle(cx - s * 0.1, cy - s * 0.1, r);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.1 + r * 0.72, cy - s * 0.1 + r * 0.72);
    ctx.lineTo(cx + s * 0.36, cy + s * 0.36);
    ctx.stroke();
  } else if (kind === 'git') {
    const r = s * 0.13;
    circle(cx - s * 0.22, cy - s * 0.34, r);
    ctx.stroke();
    circle(cx - s * 0.22, cy + s * 0.34, r);
    ctx.stroke();
    circle(cx + s * 0.26, cy - s * 0.04, r);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.22, cy - s * 0.34 + r);
    ctx.lineTo(cx - s * 0.22, cy + s * 0.34 - r);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.26, cy - s * 0.04 + r);
    ctx.quadraticCurveTo(cx + s * 0.26, cy + s * 0.2, cx - s * 0.22, cy + s * 0.2);
    ctx.stroke();
  } else if (kind === 'debug') {
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.26, cy - s * 0.34);
    ctx.lineTo(cx - s * 0.26, cy + s * 0.34);
    ctx.lineTo(cx + s * 0.34, cy);
    ctx.closePath();
    ctx.stroke();
  } else if (kind === 'ext') {
    const q = s * 0.32;
    const g = s * 0.12;
    ctx.strokeRect(cx - q - g / 2, cy - q - g / 2, q, q);
    ctx.strokeRect(cx + g / 2, cy - q - g / 2, q, q);
    ctx.strokeRect(cx - q - g / 2, cy + g / 2, q, q);
    ctx.strokeRect(cx + g / 2 + s * 0.06, cy + g / 2 + s * 0.06, q, q);
  } else if (kind === 'account') {
    circle(cx, cy, s * 0.42);
    ctx.stroke();
    circle(cx, cy - s * 0.1, s * 0.16);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + s * 0.34, s * 0.26, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  } else if (kind === 'gear') {
    circle(cx, cy, s * 0.18);
    ctx.stroke();
    circle(cx, cy, s * 0.4);
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * s * 0.4, cy + Math.sin(a) * s * 0.4);
      ctx.lineTo(cx + Math.cos(a) * s * 0.5, cy + Math.sin(a) * s * 0.5);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function wrapLines(ctx, text, maxW, font, maxLines) {
  ctx.font = font;
  const words = (text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  if (maxLines && lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = truncate(
      ctx,
      `${kept[maxLines - 1]} ${lines.slice(maxLines).join(' ')}`,
      maxW,
      font,
    );
    return kept;
  }
  return lines;
}

function truncate(ctx, text, maxW, font) {
  ctx.font = font;
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t}…`;
}

function toVar(name) {
  const parts = (name || 'repo')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  if (!parts.length) return 'repo';
  return parts
    .map((p, i) => (i === 0 ? p.toLowerCase() : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()))
    .join('');
}

function langColor(language) {
  const map = {
    typescript: '#3178C6',
    javascript: '#F1E05A',
    python: '#3572A5',
    rust: '#DEA584',
    go: '#00ADD8',
    java: '#B07219',
    'c++': '#F34B7D',
    c: '#555555',
    ruby: '#701516',
    php: '#4F5D95',
    swift: '#F05138',
    kotlin: '#A97BFF',
    html: '#E34C26',
    css: '#563D7C',
    shell: '#89E051',
  };
  return map[(language || '').toLowerCase()] || '#9AA0AA';
}

function parseHex(hex) {
  const h = (hex || '#000').replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0,
  };
}

function rgbToHex(r, g, b) {
  const h = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

function mix(a, b, t) {
  const ca = parseHex(a);
  const cb = parseHex(b);
  return rgbToHex(ca.r + (cb.r - ca.r) * t, ca.g + (cb.g - ca.g) * t, ca.b + (cb.b - ca.b) * t);
}

function hexA(hex, alpha) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function forceDark(hex) {
  const { r, g, b } = parseHex(hex);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lum < 70) return hex;
  return mix(hex, '#1E1E24', 0.82);
}

function readableOn(hex) {
  const { r, g, b } = parseHex(hex);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 150 ? '#0B0B0B' : '#FFFFFF';
}
