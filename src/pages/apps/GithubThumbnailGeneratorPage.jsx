import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  GitBranchIcon,
  StarIcon,
  CodeIcon,
  PaintBrushIcon,
  LayoutIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import CustomDropdown from '../../components/CustomDropdown';
import CustomColorPicker from '../../components/CustomColorPicker';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const THEME_OPTIONS = [
  { value: 'modern', label: 'MODERN_STACK' },
  { value: 'brutalist', label: 'BRUTALIST_CLI' },
  { value: 'minimal', label: 'MINIMAL_GLASS' },
  { value: 'retro', label: 'RETRO_TERMINAL' },
  { value: 'blueprint', label: 'BLUEPRINT_CAD' },
  { value: 'neon', label: 'NEON_CYBER' },
  { value: 'swiss', label: 'SWISS_GRID' },
  { value: 'japanese', label: 'JAPANESE_POP' },
  { value: 'gameboy', label: 'RETRO_HANDHELD' },
  { value: 'vaporwave', label: 'VAPORWAVE_AESTHETIC' },
  { value: 'noir', label: 'NOIR_CINEMA' },
  { value: 'clay', label: 'PLAYFUL_CLAY' },
  { value: 'prismatic', label: 'PRISMATIC_HAZE' },
];

const GithubThumbnailGeneratorPage = () => {
  const appName = 'Github Thumbnail Generator';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Generate high-fidelity thumbnails and cover art for GitHub repositories.',
    keywords: ['github', 'thumbnail', 'generator', 'cover art', 'readme', 'social preview', 'fezcodex'],
  });

  const { addToast } = useToast();
  const canvasRef = useRef(null);

  // Repo Data State
  const [repoOwner, setRepoOwner] = useState('fezcodex');
  const [repoName, setRepoName] = useState('project-genesis');
  const [description, setDescription] = useState('A high-performance toolkit for procedural asset generation and digital synthesis.');
  const [language, setLanguage] = useState('TypeScript');
  const [stars, setStars] = useState('1.2k');
  const [forks, setForks] = useState('342');
  const [supportUrl, setSupportUrl] = useState('github.com/fezcodex');

  // Styling State
  const [theme, setTheme] = useState('modern');
  const [primaryColor, setPrimaryColor] = useState('#6366f1'); // Indigo
  const [secondaryColor, setSecondaryColor] = useState('#ec4899'); // Pink
  const [bgColor, setBgColor] = useState('#0f172a'); // Slate 900
  const [showPattern, setShowPattern] = useState(true);

  const drawThumbnail = useCallback((ctx, width, height) => {
    // Clear Canvas
    ctx.clearRect(0, 0, width, height);
    const scale = width / 1280; // Base scale on standard width

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw Pattern (if enabled)
    if (showPattern) {
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = '#ffffff';

      if (theme === 'brutalist') {
        // Grid Pattern
        const gridSize = 40 * scale;
        for (let x = 0; x < width; x += gridSize) {
          ctx.fillRect(x, 0, 1, height);
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.fillRect(0, y, width, 1);
        }
      } else {
        // Dot Pattern
        const dotSize = 2 * scale;
        const spacing = 30 * scale;
        for (let x = 0; x < width; x += spacing) {
          for (let y = 0; y < height; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();
    }

    // Theme Specific Rendering
    if (theme === 'modern') {
      // Background Gradient Orb
      ctx.save();
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(1, secondaryColor);

      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.arc(width * 0.8, height * 0.2, 400 * scale, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.filter = 'blur(100px)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width * 0.2, height * 0.8, 300 * scale, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();

      // Content Container
      const padding = 80 * scale;

      // Repo Owner/Name
      ctx.fillStyle = primaryColor;
      ctx.font = `bold ${30 * scale}px "JetBrains Mono"`;
      ctx.fillText(`${repoOwner} /`, padding, padding + 20 * scale);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${80 * scale}px "Inter", sans-serif`;
      ctx.fillText(repoName, padding, padding + 110 * scale);

      // Description
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = `${32 * scale}px "Inter", sans-serif`;
      const maxWidth = width - (padding * 2);
      wrapText(ctx, description, padding, padding + 180 * scale, maxWidth, 45 * scale);

            // Bottom Bar (Stats & Lang)

            const bottomY = height - padding;

            // Language Pill

            drawPill(ctx, padding, bottomY - 20 * scale, language, primaryColor, scale);

            // Support URL (Center-Left aligned relative to pills?) or just below desc?

            // Let's put Support URL in bottom center or right if no stats?

            // Actually, let's put Support URL on the far right, and stats to the left of it.

            ctx.textAlign = 'right';

            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

            ctx.font = `${20 * scale}px "JetBrains Mono"`;

            let currentX = width - padding;

            if (supportUrl) {
                ctx.fillText(supportUrl, currentX, bottomY);

                currentX -= (ctx.measureText(supportUrl).width + 40 * scale);
            }

            // Stats

            ctx.font = `bold ${24 * scale}px "JetBrains Mono"`;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

            const statGap = 40 * scale;

            // Forks

            if (forks) {
              ctx.fillText(`${forks} Forks`, currentX, bottomY);

              currentX -= (ctx.measureText(`${forks} Forks`).width + statGap);
            }

            // Stars

            if (stars) {
              ctx.fillText(`${stars} Stars`, currentX, bottomY);
            }
          } else if (theme === 'brutalist') {
      // Brutalist Header Bar
      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, 0, width, 20 * scale);

      const padding = 60 * scale;
      const borderW = 4 * scale;

      // Main Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = borderW;
      ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

      // Decorative Corners
      const cornerSize = 20 * scale;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(padding - borderW/2, padding - borderW/2, cornerSize, cornerSize); // TL
      ctx.fillRect(width - padding - cornerSize + borderW/2, padding - borderW/2, cornerSize, cornerSize); // TR
      ctx.fillRect(padding - borderW/2, height - padding - cornerSize + borderW/2, cornerSize, cornerSize); // BL
      ctx.fillRect(width - padding - cornerSize + borderW/2, height - padding - cornerSize + borderW/2, cornerSize, cornerSize); // BR

      // Content
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${40 * scale}px "Courier New", monospace`;
      ctx.fillText(`USER: ${repoOwner.toUpperCase()}`, padding + 40 * scale, padding + 80 * scale);

      ctx.fillStyle = primaryColor;
      ctx.font = `900 ${100 * scale}px "Impact", sans-serif`;
      ctx.fillText(repoName.toUpperCase(), padding + 35 * scale, padding + 200 * scale);

      ctx.fillStyle = '#ffffff';
      ctx.font = `${30 * scale}px "Courier New", monospace`;
      wrapText(ctx, description, padding + 40 * scale, padding + 300 * scale, width - padding * 3, 40 * scale);

            // Footer Info
            ctx.fillStyle = secondaryColor;
            ctx.fillRect(padding, height - padding - 80 * scale, width - padding * 2, 80 * scale);

            ctx.fillStyle = '#000000';
            ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left';
            ctx.fillText(`LANG: ${language.toUpperCase()}`, padding + 40 * scale, height - padding - 40 * scale);

            ctx.textAlign = 'right';
            let statsText = '';
            if (stars) statsText += `★ ${stars}  `;
            if (forks) statsText += `⑂ ${forks}`;

            const rightPadding = padding + 40 * scale;

            if (supportUrl) {
                ctx.font = `${24 * scale}px "Courier New", monospace`;
                ctx.fillText(supportUrl.toUpperCase(), width - rightPadding, height - padding - 40 * scale);

                // If support URL exists, push stats to left? Or just hide stats?
                // Let's put stats to the left of support URL
                const urlWidth = ctx.measureText(supportUrl.toUpperCase()).width;
                ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
                if (statsText) {
                   ctx.fillText(statsText, width - rightPadding - urlWidth - 60 * scale, height - padding - 40 * scale);
                }
            } else {
                ctx.fillText(statsText, width - rightPadding, height - padding - 40 * scale);
                  }
                } else if (theme === 'minimal') {
                  // Improved Minimal Glass

                  // Background with subtle gradient
                  const grad = ctx.createLinearGradient(0, 0, width, height);
                  grad.addColorStop(0, '#e2e8f0'); // slate-200
                  grad.addColorStop(1, '#f8fafc'); // slate-50
                  ctx.fillStyle = grad;
                  ctx.fillRect(0, 0, width, height);

                  // Abstract shapes for background depth
                  ctx.save();
                  ctx.globalAlpha = 0.6;
                  ctx.fillStyle = primaryColor;
                  ctx.beginPath();
                  ctx.arc(width * 0.2, height * 0.3, 400 * scale, 0, Math.PI * 2);
                  ctx.fill();

                  ctx.fillStyle = secondaryColor;
                  ctx.beginPath();
                  ctx.arc(width * 0.8, height * 0.7, 300 * scale, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.restore();

                  // Glass Card
                  const cardW = width * 0.85;
                  const cardH = height * 0.7;
                  const cardX = (width - cardW) / 2;
                  const cardY = (height - cardH) / 2;
                  const r = 30 * scale;

                  ctx.save();
                  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
                  ctx.shadowBlur = 60 * scale;
                  ctx.shadowOffsetY = 30 * scale;

                  ctx.beginPath();
                  ctx.roundRect(cardX, cardY, cardW, cardH, r);
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'; // More opaque, cleaner
                  ctx.fill();

                  // Border
                  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                  ctx.lineWidth = 2 * scale;
                  ctx.stroke();
                  ctx.restore();

                  // Content inside Card
                  const innerPad = 80 * scale;
                  const contentY = cardY + innerPad;

                  ctx.textAlign = 'left';

                  // Small Owner Label
                  ctx.fillStyle = '#64748b'; // slate-500
                  ctx.font = `600 ${24 * scale}px "Plus Jakarta Sans", "Inter", sans-serif`;
                  ctx.fillText(repoOwner.toUpperCase(), cardX + innerPad, contentY);

                  // Repo Name
                  ctx.fillStyle = '#0f172a'; // slate-900
                  ctx.font = `800 ${80 * scale}px "Plus Jakarta Sans", "Inter", sans-serif`;
                  ctx.fillText(repoName, cardX + innerPad, contentY + 100 * scale);

                  // Description
                  ctx.fillStyle = '#334155'; // slate-700
                  ctx.font = `500 ${32 * scale}px "Plus Jakarta Sans", "Inter", sans-serif`;
                  wrapText(ctx, description, cardX + innerPad, contentY + 180 * scale, cardW - (innerPad * 2), 48 * scale);

                  // Bottom Section inside card
                  const bottomInnerY = cardY + cardH - innerPad + 20 * scale;

                  // Stats Pills
                  let currentX = cardX + innerPad;
                  const pillH = 50 * scale;
                  const pillPad = 30 * scale;

                  const drawStatPill = (label, value, color) => {
                     ctx.font = `bold ${20 * scale}px "Plus Jakarta Sans", sans-serif`;
                     const text = `${value} ${label}`;
                     const w = ctx.measureText(text).width + (pillPad * 2);

                     ctx.fillStyle = color; // light bg
                     ctx.beginPath();
                     ctx.roundRect(currentX, bottomInnerY - pillH, w, pillH, pillH/2);
                     ctx.fill();

                     ctx.fillStyle = '#1e293b'; // Dark text
                     ctx.fillText(text, currentX + pillPad, bottomInnerY - pillH/2 + 8 * scale); // vertical center adjustment

                     currentX += w + 20 * scale;
                  };

                  // Language Pill (Special style)
                  drawStatPill('• ' + language, '', 'rgba(0,0,0,0.05)');

                  if (stars) drawStatPill('Stars', stars, 'rgba(255, 220, 0, 0.15)');
                  if (forks) drawStatPill('Forks', forks, 'rgba(0, 0, 0, 0.05)');

                  // URL
                  if (supportUrl) {
                      ctx.textAlign = 'right';
                      ctx.fillStyle = '#94a3b8'; // slate-400
                      ctx.font = `${20 * scale}px "Plus Jakarta Sans", sans-serif`;
                      ctx.fillText(supportUrl, cardX + cardW - innerPad, bottomInnerY - 10 * scale);
                  }
                } else if (theme === 'retro') {
                    // Retro Terminal Style (Unchanged from previous implementation)
                    ctx.fillStyle = '#0d1117';
                    ctx.fillRect(0, 0, width, height);

                    // Scanlines
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    for (let i = 0; i < height; i += 4 * scale) {
                        ctx.fillRect(0, i, width, 2 * scale);
                    }

                    // Glow effect
                    ctx.shadowBlur = 10 * scale;
                    ctx.shadowColor = primaryColor;

                    const padding = 80 * scale;

                    ctx.font = `${30 * scale}px "Courier New", monospace`;
                    ctx.fillStyle = primaryColor;
                    ctx.textAlign = 'left';
                    ctx.fillText(`> git clone https://github.com/${repoOwner}/${repoName}.git`, padding, padding);

                    ctx.font = `bold ${80 * scale}px "Courier New", monospace`;
                    ctx.fillStyle = primaryColor;
                    ctx.fillText(repoName, padding, padding + 120 * scale);

                    ctx.font = `${30 * scale}px "Courier New", monospace`;
                    ctx.fillStyle = primaryColor;
                    wrapText(ctx, description, padding, padding + 200 * scale, width - (padding * 2), 40 * scale);

                    const bottomY = height - padding;
                    ctx.textAlign = 'left';
                    ctx.font = `${24 * scale}px "Courier New", monospace`;

                    let statsText = '';
                    if (stars) statsText += `[ STARS: ${stars} ] `;
                    if (forks) statsText += `[ FORKS: ${forks} ] `;
                    statsText += `[ LANG: ${language.toUpperCase()} ]`;

                    ctx.fillText(statsText, padding, bottomY);
                    ctx.fillStyle = primaryColor;
                    ctx.fillRect(padding + ctx.measureText(statsText).width + 10 * scale, bottomY - 24 * scale, 15 * scale, 30 * scale);

                     if (supportUrl) {
                         ctx.textAlign = 'right';
                         ctx.fillText(supportUrl, width - padding, padding);
                     }
                } else if (theme === 'blueprint') {
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

                            // Tech Specs removed as requested
                } else if (theme === 'neon') {
                    // Neon Cyber Style (Unchanged)
                    ctx.fillStyle = '#050505';
                    ctx.fillRect(0, 0, width, height);

                    ctx.save();
                    ctx.strokeStyle = '#111';
                    ctx.lineWidth = 10 * scale;
                    ctx.beginPath();
                    for(let i = -height; i < width; i+= 40 * scale) {
                        ctx.moveTo(i, 0);
                        ctx.lineTo(i + height, height);
                    }
                    ctx.stroke();
                    ctx.restore();

                    const padding = 80 * scale;

                    ctx.shadowBlur = 20 * scale;
                    ctx.shadowColor = secondaryColor;
                    ctx.fillStyle = secondaryColor;

                    ctx.font = `900 ${100 * scale}px "Arial Black", sans-serif`;
                    ctx.textAlign = 'left';

                    ctx.fillStyle = 'red';
                    ctx.fillText(repoName.toUpperCase(), padding - 4 * scale, padding + 100 * scale);
                    ctx.fillStyle = 'cyan';
                    ctx.fillText(repoName.toUpperCase(), padding + 4 * scale, padding + 100 * scale);

                    ctx.fillStyle = 'white';
                    ctx.shadowBlur = 30 * scale;
                    ctx.shadowColor = primaryColor;
                    ctx.fillText(repoName.toUpperCase(), padding, padding + 100 * scale);

                    ctx.strokeStyle = primaryColor;
                    ctx.lineWidth = 4 * scale;
                    ctx.beginPath();
                    ctx.moveTo(padding, padding + 140 * scale);
                    ctx.lineTo(width - padding, padding + 140 * scale);
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.font = `${30 * scale}px "Courier New", monospace`;
                    wrapText(ctx, description, padding, padding + 220 * scale, width - (padding * 2), 40 * scale);

                    const bottomY = height - padding;

                    const drawNeonBox = (text, x, color) => {
                        ctx.shadowBlur = 10 * scale;
                        ctx.shadowColor = color;
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 2 * scale;

                        const w = ctx.measureText(text).width + 40 * scale;
                        const h = 50 * scale;

                        ctx.strokeRect(x, bottomY - h, w, h);

                        ctx.fillStyle = color;
                        ctx.fillText(text, x + 20 * scale, bottomY - 15 * scale);
                        return w + 20 * scale;
                    };

                    ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
                    let currentX = padding;

                    currentX += drawNeonBox(language.toUpperCase(), currentX, primaryColor);
                    if (stars) currentX += drawNeonBox(`${stars} ★`, currentX, secondaryColor);
                    if (forks) drawNeonBox(`${forks} ⑂`, currentX, secondaryColor);

                    if (supportUrl) {
                        ctx.textAlign = 'right';
                        ctx.fillStyle = 'white';
                        ctx.shadowBlur = 10 * scale;
                        ctx.shadowColor = 'white';
                        ctx.fillText(supportUrl, width - padding, bottomY - 15 * scale);
                    }
                } else if (theme === 'swiss') {
                    // SWISS GRID Style
                    ctx.fillStyle = '#f1f1f1'; // Off-white background
                    ctx.fillRect(0, 0, width, height);

                    // Bold Asymmetry
                    const col1 = width * 0.22;

                    // Left Column (Color Block)
                    ctx.fillStyle = primaryColor;
                    ctx.fillRect(0, 0, col1, height);

                    // Grid Lines
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2 * scale;
                    ctx.beginPath();
                    ctx.moveTo(col1, 0); ctx.lineTo(col1, height); // Vertical split

                    const row1 = height * 0.25;
                    const row2 = height * 0.75;

                    ctx.moveTo(col1, row1); ctx.lineTo(width, row1); // Top horizontal
                    ctx.moveTo(col1, row2); ctx.lineTo(width, row2); // Bottom horizontal
                    ctx.stroke();

                    // Typography - Helvetica style (Arial/Inter fallback)
                    const fontStack = '"Helvetica Neue", "Arial", sans-serif';
                    const padding = 40 * scale;

                    // 1. Top Right: Project Info
                    ctx.fillStyle = '#000';
                    ctx.font = `bold ${30 * scale}px ${fontStack}`;
                    ctx.textAlign = 'left';
                    ctx.fillText(repoOwner.toUpperCase(), col1 + padding, row1 - padding - 30 * scale);

                    // 2. Center Right: Description & Name
                    // Repo Name huge
                    ctx.fillStyle = '#000';
                    ctx.font = `900 ${100 * scale}px ${fontStack}`;
                    ctx.fillText(repoName, col1 + padding, row1 + 120 * scale);

                    // Description
                    ctx.font = `normal ${32 * scale}px ${fontStack}`;
                    wrapText(ctx, description, col1 + padding, row1 + 200 * scale, width - col1 - (padding * 2), 40 * scale);

                    // 3. Bottom Right: Stats
                    ctx.font = `bold ${24 * scale}px ${fontStack}`;
                    let statX = col1 + padding;
                    const statY = row2 + 60 * scale;

                    if (stars) {
                         ctx.fillText(`★ ${stars}`, statX, statY);
                         statX += 150 * scale;
                    }
                    if (forks) {
                        ctx.fillText(`⑂ ${forks}`, statX, statY);
                         statX += 150 * scale;
                    }
                    ctx.fillText(language.toUpperCase(), statX, statY);

                    // 4. Left Column: Vertical Text or Graphic
                    ctx.save();
                    ctx.translate(col1 / 2, height / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#fff';
                    ctx.font = `900 ${100 * scale}px ${fontStack}`;
                    ctx.fillText("GIT", 0, 35 * scale);
                    ctx.restore();

                    if (supportUrl) {
                        ctx.textAlign = 'right';
                        ctx.fillStyle = '#000';
                        ctx.font = `normal ${20 * scale}px ${fontStack}`;
                        ctx.fillText(supportUrl, width - padding, height - padding);
                    }
                    } else if (theme === 'japanese') {
                        // JAPANESE POP Style

                        // Dynamic background pattern (Halftone / Stripes)                    ctx.fillStyle = secondaryColor; // Bg base
                    ctx.fillRect(0, 0, width, height);

                    // Sunburst or Stripes
                    ctx.save();
                    ctx.translate(width/2, height/2);
                    ctx.fillStyle = primaryColor;
                    for (let i = 0; i < 12; i++) {
                         ctx.rotate(Math.PI / 6);
                         ctx.fillRect(0, 0, width, height);
                    }
                    ctx.restore();

                    // Center Circle (Sun)
                    ctx.beginPath();
                    ctx.arc(width/2, height/2, 300 * scale, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();

                    // Text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Repo Name (Bold, Stroke)
                    ctx.font = `900 ${120 * scale}px "Arial Black", sans-serif`;
                    ctx.fillStyle = '#000';
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 8 * scale;

                    ctx.strokeText(repoName.toUpperCase(), width/2, height/2);
                    ctx.fillText(repoName.toUpperCase(), width/2, height/2);

                    // Vertical Text (Decorations)
                    const fontStack = '"Arial", sans-serif';
                    ctx.fillStyle = '#fff';
                    ctx.font = `bold ${40 * scale}px ${fontStack}`;

                    const drawVert = (text, x, y) => {
                        ctx.save();
                        ctx.translate(x, y);
                        for (let i = 0; i < text.length; i++) {
                            ctx.fillText(text[i], 0, i * 40 * scale);
                        }
                        ctx.restore();
                    };

                    drawVert(repoOwner.toUpperCase(), 60 * scale, 60 * scale);
                    drawVert(language.toUpperCase(), width - 60 * scale, 60 * scale);

                    // Stats in Floating Bubbles
                    const drawBubble = (text, x, y, color) => {
                         ctx.beginPath();
                         ctx.arc(x, y, 60 * scale, 0, Math.PI * 2);
                         ctx.fillStyle = color;
                         ctx.strokeStyle = '#000';
                         ctx.lineWidth = 4 * scale;
                         ctx.fill();
                         ctx.stroke();

                         ctx.fillStyle = '#000';
                         ctx.font = `bold ${20 * scale}px ${fontStack}`;
                         ctx.fillText(text, x, y);
                    };

                    if (stars) drawBubble(`★ ${stars}`, width * 0.2, height * 0.8, '#ffe600');
                    if (forks) drawBubble(`⑂ ${forks}`, width * 0.8, height * 0.8, '#0099ff');

                    // Support URL (Sticker style)
                    if (supportUrl) {
                        ctx.save();
                        ctx.translate(width/2, height - 60 * scale);
                        ctx.rotate(-0.05);
                        ctx.fillStyle = '#000';
                        ctx.fillRect(-200 * scale, -30 * scale, 400 * scale, 60 * scale);
                        ctx.fillStyle = '#fff';
                        ctx.font = `bold ${24 * scale}px ${fontStack}`;
                        ctx.fillText(supportUrl, 0, 0);
                        ctx.restore();
                    }
    } else if (theme === 'gameboy') {
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
    } else if (theme === 'vaporwave') {
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
    } else if (theme === 'noir') {
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
    } else if (theme === 'clay') {
                // PLAYFUL CLAY Style
                ctx.fillStyle = '#f0f4f8'; // Light blue-ish grey
                ctx.fillRect(0, 0, width, height);

                const cardColor = '#ffffff';
                const padding = 60 * scale;
        // Main Container (Claymorphism: rounded, inner shadow, outer shadow)
        const drawClayRect = (x, y, w, h, radius) => {
            ctx.save();
            // Outer Shadow
            ctx.shadowColor = '#b8c2cc';
            ctx.shadowBlur = 30 * scale;
            ctx.shadowOffsetY = 20 * scale;
            ctx.fillStyle = cardColor;

            ctx.beginPath();
            ctx.roundRect(x, y, w, h, radius);
            ctx.fill();

            // Inner Highlight (simulated with clipping)
            ctx.shadowColor = 'transparent';
            ctx.clip();
            ctx.strokeStyle = 'rgba(255,255,255,0.8)';
            ctx.lineWidth = 10 * scale;
            ctx.stroke();
            ctx.restore();
        };

        // Large Card
        drawClayRect(padding, padding, width - padding*2, height - padding*2, 60 * scale);

        // Content
        ctx.textAlign = 'center';
        ctx.fillStyle = '#334e68'; // Dark blue-grey text

        // Round Font
        const roundFont = '"Nunito", "Quicksand", "Arial Rounded MT Bold", sans-serif';

        ctx.font = `800 ${90 * scale}px ${roundFont}`;
        ctx.fillText(repoName, width/2, height * 0.35);

        // Owner & URL Group
        const ownerText = `by ${repoOwner}`;
        ctx.font = `600 ${30 * scale}px ${roundFont}`;
        const ownerWidth = ctx.measureText(ownerText).width;

        let totalGroupWidth = ownerWidth;
        if (supportUrl) {
            ctx.font = `600 ${20 * scale}px ${roundFont}`;
            totalGroupWidth += ctx.measureText(supportUrl).width + 30 * scale;
        }

        const groupX = (width - totalGroupWidth) / 2;

        ctx.textAlign = 'left';
        ctx.fillStyle = '#829ab1';
        ctx.font = `600 ${30 * scale}px ${roundFont}`;
        ctx.fillText(ownerText, groupX, height * 0.45);

        if (supportUrl) {
            ctx.fillStyle = '#bcccdc';
            ctx.font = `600 ${20 * scale}px ${roundFont}`;
            ctx.fillText(supportUrl, groupX + ownerWidth + 30 * scale, height * 0.45);
        }

        // Description
        ctx.textAlign = 'center';
        ctx.fillStyle = '#486581';
        ctx.font = `500 ${32 * scale}px ${roundFont}`;
        wrapText(ctx, description, width/2, height * 0.55, width * 0.7, 45 * scale);

        // Floating Pills for stats
        const pillW = 200 * scale;
        const pillH = 80 * scale;
        const pillY = height * 0.75;

        const drawClayPill = (x, text, color) => {
             ctx.save();
             ctx.shadowColor = color + '66'; // semi transparent
             ctx.shadowBlur = 20 * scale;
             ctx.shadowOffsetY = 10 * scale;
             ctx.fillStyle = color;

             ctx.beginPath();
             ctx.roundRect(x - pillW/2, pillY, pillW, pillH, 40 * scale);
             ctx.fill();

             ctx.fillStyle = 'white';
             ctx.font = `bold ${24 * scale}px ${roundFont}`;
             ctx.fillText(text, x, pillY + pillH/2 + 8*scale);
             ctx.restore();
        };

        let pillX = width / 2;
        if (stars) {
            drawClayPill(pillX - 250*scale, `${stars} ★`, '#f6ad55'); // Orange
        }
        drawClayPill(pillX, language, '#63b3ed'); // Blue
        if (forks) {
            drawClayPill(pillX + 250*scale, `${forks} ⑂`, '#68d391'); // Green
        }
    } else if (theme === 'prismatic') {
        // PRISMATIC HAZE Style

        // Deep Dark Background
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        // 1. Vibrant Gradient Mesh / Orbs
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        const drawOrb = (x, y, r, color) => {
            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        };

        drawOrb(width * 0.2, height * 0.3, 600 * scale, primaryColor);
        drawOrb(width * 0.8, height * 0.7, 500 * scale, secondaryColor);
        drawOrb(width * 0.5, height * 0.5, 400 * scale, bgColor); // Center highlight

        ctx.restore();

        // 2. Fine Grain Noise
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        for(let i=0; i<8000; i++) {
             ctx.fillRect(Math.random()*width, Math.random()*height, 2*scale, 2*scale);
        }
        ctx.restore();

        // 3. Glass Card Container
        const cardW = width * 0.85;
        const cardH = height * 0.65;
        const cardX = (width - cardW) / 2;
        const cardY = (height - cardH) / 2;
        const r = 40 * scale;

        ctx.save();
        // Glass Fill
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, r);
        ctx.fill();

        // Glass Border
        const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
        borderGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
        borderGrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
        borderGrad.addColorStop(1, 'rgba(255,255,255,0.4)');

        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 2 * scale;
        ctx.stroke();

        // Inner Glow
        ctx.shadowColor = 'rgba(255,255,255,0.2)';
        ctx.shadowBlur = 30 * scale;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 4. Content
        const contentPad = 80 * scale;
        const contentY = cardY + contentPad;

        // Elegant Typography
        const elegantFont = '"Playfair Display", "Times New Roman", serif';
        const cleanFont = '"Inter", "Helvetica Neue", sans-serif';

        // Repo Name (Big & Elegant)
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = `italic 900 ${90 * scale}px ${elegantFont}`;
        ctx.fillText(repoName, width/2, height * 0.42);

        // Owner (Small & Clean)
        ctx.font = `300 ${24 * scale}px ${cleanFont}`;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.letterSpacing = '4px'; // Canvas doesn't support this directly easily without manual spacing, but standard fonts might handle it okay-ish or we ignore.
        ctx.fillText(`—  ${repoOwner.toUpperCase()}  —`, width/2, height * 0.52);

        // Description
        ctx.font = `400 ${28 * scale}px ${cleanFont}`;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        wrapText(ctx, description, width/2, height * 0.58, cardW - (contentPad*2), 40 * scale);

        // Bottom details
        const bottomY = cardY + cardH - 40 * scale;

        ctx.font = `600 ${20 * scale}px ${cleanFont}`;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';

        const details = [];
        if (language) details.push(language.toUpperCase());
        if (stars) details.push(`${stars} ★`);
        if (forks) details.push(`${forks} ⑂`);

        ctx.fillText(details.join('   •   '), width/2, bottomY - 30 * scale);

        if (supportUrl) {
             ctx.font = `italic 400 ${18 * scale}px ${elegantFont}`;
             ctx.fillStyle = 'rgba(255,255,255,0.4)';
             ctx.fillText(supportUrl, width/2, bottomY);
        }
    } else if (theme === 'gameboy') {
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
    } else if (theme === 'vaporwave') {
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
    }
              }, [repoOwner, repoName, description, language, stars, forks, supportUrl, theme, primaryColor, secondaryColor, bgColor, showPattern]);

  // Helper: Wrap Text
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  // Helper: Draw Pill
  const drawPill = (ctx, x, y, text, color, scale) => {
    ctx.font = `bold ${20 * scale}px "JetBrains Mono"`;
    const padding = 20 * scale;
    const textWidth = ctx.measureText(text).width;
    const height = 40 * scale;
    const width = textWidth + (padding * 2);

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.roundRect(x, y - height/1.5, width, height, height/2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = color;
    ctx.fillText(text, x + padding, y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Preview Resolution
    const logicalWidth = 1280;
    const logicalHeight = 640;

    canvas.width = rect.width * dpr;
    canvas.height = (rect.width * (logicalHeight / logicalWidth)) * dpr;
    ctx.scale(dpr * (rect.width / logicalWidth), dpr * (rect.width / logicalWidth));

    drawThumbnail(ctx, logicalWidth, logicalHeight);
  }, [drawThumbnail]);

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const W = 1280 * 2; // 2x scale for High Res
    const H = 640 * 2;
    canvas.width = W;
    canvas.height = H;

    drawThumbnail(ctx, W, H);

    const link = document.createElement('a');
    link.download = `github-${repoName}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    addToast({ title: 'EXPORT_SUCCESS', message: 'Thumbnail generated successfully.' });
  };

  const brutalInputClass = "bg-black border-2 border-white/20 p-3 font-mono text-sm text-white focus:border-indigo-400 outline-none transition-all w-full placeholder-white/20 rounded-none uppercase tracking-widest";
  const brutalCardClass = "bg-black border-2 border-white/10 p-6 space-y-6 rounded-none relative";
  const brutalLabelClass = "font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 border-b-2 border-white/10 pb-4 mb-4";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
       <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 relative z-10">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Github Thumbnail Gen" slug="ghtg" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed font-mono">
                Generate Professional Social Preview Images And Readme Headers For Your Projects.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-indigo-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-none shrink-0 border-2 border-white hover:border-indigo-400"
            >
              <DownloadSimpleIcon weight="bold" size={24} />
              <span>Export PNG</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Controls */}
          <div className="lg:col-span-3 space-y-8">

            {/* Project Details */}
            <div className={brutalCardClass}>
               {/* Decorative corner */}
               <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-500"></div>

               <h3 className={brutalLabelClass}>
                <GitBranchIcon weight="fill" />
                Repository_Data
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={repoOwner} onChange={(e) => setRepoOwner(e.target.value)} className={brutalInputClass} placeholder="Owner" />
                  <input type="text" value={repoName} onChange={(e) => setRepoName(e.target.value)} className={brutalInputClass} placeholder="Repo Name" />
                </div>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${brutalInputClass} resize-none`} placeholder="Description" />
                <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)} className={brutalInputClass} placeholder="Language" />
              </div>
            </div>

            {/* Stats */}
            <div className={brutalCardClass}>
               <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-500"></div>
               <h3 className={brutalLabelClass}>
                <StarIcon weight="fill" />
                Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={stars} onChange={(e) => setStars(e.target.value)} className={brutalInputClass} placeholder="Stars" />
                <input type="text" value={forks} onChange={(e) => setForks(e.target.value)} className={brutalInputClass} placeholder="Forks" />
              </div>
              <input type="text" value={supportUrl} onChange={(e) => setSupportUrl(e.target.value)} className={brutalInputClass} placeholder="Support URL" />
            </div>

            {/* Styling */}
             <div className={brutalCardClass}>
               <h3 className={brutalLabelClass}>
                <PaintBrushIcon weight="fill" />
                Visual_Style
              </h3>
              <div className="space-y-6">
                <CustomDropdown
                  label="Design Theme"
                  options={THEME_OPTIONS}
                  value={theme}
                  onChange={setTheme}
                  variant="brutalist"
                  fullWidth
                />

                <CustomColorPicker label="Primary Color" value={primaryColor} onChange={setPrimaryColor} />
                <CustomColorPicker label="Secondary Color" value={secondaryColor} onChange={setSecondaryColor} />
                <CustomColorPicker label="Background" value={bgColor} onChange={setBgColor} />

                 <button
                  onClick={() => setShowPattern(!showPattern)}
                  className={`w-full py-3 px-4 rounded-none border-2 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-between ${
                    showPattern
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200'
                      : 'bg-black border-white/20 text-white/40'
                  }`}
                >
                  <span>Bg Pattern</span>
                  <span className={showPattern ? 'text-indigo-400' : ''}>
                    {showPattern ? '[ ON ]' : '[ OFF ]'}
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* Preview */}
          <div className="lg:col-span-9">
            <div className="lg:sticky lg:top-24">
              <div className="relative border-2 border-white/10 bg-[#0a0a0a] rounded-none overflow-hidden flex items-center justify-center shadow-2xl group min-h-[400px]">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto shadow-2xl"
                />
                 <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setRepoOwner('fezcodex'); setRepoName('project-genesis'); setTheme('modern'); setSupportUrl('github.com/fezcodex'); }}
                    className="flex items-center gap-2 px-4 py-2 bg-black border border-white/20 text-[10px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-900/20 hover:border-red-500 transition-all rounded-none"
                  >
                    <TrashIcon weight="bold" /> Reset
                  </button>
                </div>
              </div>

              <div className="mt-8 flex gap-6 text-gray-500 font-mono text-xs uppercase tracking-widest">
                <div className="flex items-center gap-2">
                   <LayoutIcon />
                   <span>1280 x 640px (OG Standard)</span>
                </div>
                <div className="flex items-center gap-2">
                   <CodeIcon />
                   <span>Generated via Canvas API</span>
                </div>
              </div>

            </div>
          </div>

        </div>
       </div>
    </div>
  );
};

export default GithubThumbnailGeneratorPage;
