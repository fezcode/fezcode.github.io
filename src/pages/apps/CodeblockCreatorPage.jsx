import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  CodeIcon,
  PaletteIcon,
  FileCodeIcon,
} from '@phosphor-icons/react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // HTML

import {
  atomDark,
  dracula,
  vscDarkPlus,
  materialDark,
  nord,
  oneDark,
  synthwave84
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import CustomDropdown from '../../components/CustomDropdown';
import CustomSlider from '../../components/CustomSlider';

const themes = {
  'Atom Dark': atomDark,
  'Dracula': dracula,
  'VS Code Dark': vscDarkPlus,
  'Material Dark': materialDark,
  'Nord': nord,
  'One Dark': oneDark,
  'Synthwave 84': synthwave84
};

const languages = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'html',
  'css',
  'rust',
  'go',
  'json',
  'bash',
  'sql',
  'java',
  'csharp',
  'cpp',
];

const backgrounds = [
  { name: 'Midnight', value: ['#312e81', '#111827', '#000000'] }, // indigo-900, gray-900, black
  { name: 'Emerald', value: ['#064e3b', '#134e4a', '#000000'] }, // emerald-900, teal-900, black
  { name: 'Rose', value: ['#881337', '#831843', '#000000'] }, // rose-900, pink-900, black
  { name: 'Cyber', value: ['#06b6d4', '#3b82f6', '#6366f1'] }, // cyan-500, blue-500, indigo-500
  { name: 'Sunset', value: ['#fb923c', '#ec4899', '#9333ea'] }, // orange-400, pink-500, purple-600
  { name: 'Solid Black', value: ['#050505', '#050505', '#050505'] },
];

const fonts = [
  'JetBrains Mono',
  'Fira Code',
  'Source Code Pro',
  'Consolas',
  'Monaco',
  'Ubuntu Mono',
  'Courier New',
];

const CodeblockCreatorPage = () => {
  const { addToast } = useToast();
  const canvasRef = useRef(null);

  // State
  const [code, setCode] = useState(`const greeting = "Hello, Fezcodex!";\n\nfunction welcome() {\n  console.log(greeting);\n  return true;\n}`);
  const [language, setLanguage] = useState('javascript');
  const [themeName, setThemeName] = useState('Atom Dark');
  const [fontFamily, setFontFamily] = useState('JetBrains Mono');
  const [fileName, setFileName] = useState('script.js');
  const [background, setBackground] = useState(backgrounds[0]);
  const [paddingX, setPaddingX] = useState(64);
  const [paddingY, setPaddingY] = useState(64);
  const [borderRadius, setBorderRadius] = useState(12);
  const [showWindowControls, setShowWindowControls] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  // Constants
  const fontScale = 2; // Internal scaling for sharpness
  const baseFontSize = 14;
  const lineHeight = 1.5;

  const getThemeBackground = useCallback((name) => {
    const theme = themes[name];
    const bg = theme['pre[class*="language-"]']?.background ||
               theme['code[class*="language-"]']?.background;
    if (bg && bg !== 'inherit') return bg;

    // Explicit fallbacks for known themes if detection fails or returns 'inherit'
    switch(name) {
        case 'Dracula': return '#282a36';
        case 'Nord': return '#2e3440';
        case 'Synthwave 84': return '#262335';
        case 'Atom Dark': return '#1d1f21';
        case 'One Dark': return '#282c34';
        case 'Material Dark': return '#2f2f2f';
        default: return '#1e1e1e';
    }
  }, []);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 1. Calculate Content Dimensions
    const activeTheme = themes[themeName];
    let grammar = Prism.languages[language] || Prism.languages.javascript;
    if (language === 'html') grammar = Prism.languages.markup;

    const tokens = Prism.tokenize(code, grammar);

    // Set font for measurement
    const currentFont = `"${fontFamily}", monospace`;
    ctx.font = `${baseFontSize * fontScale}px ${currentFont}`;

    // Line Numbers Logic
    const lines = code.split('\n');
    const lineCount = lines.length;
    // Calculate gutter width based on max digits
    const gutterWidth = showLineNumbers
        ? ctx.measureText(lineCount.toString()).width + (40 * fontScale) // Extra padding for visual separation
        : 0;

    const metrics = measureTokens(ctx, tokens, baseFontSize * fontScale, lineHeight);

    const contentWidth = Math.max(600 * fontScale, metrics.width + gutterWidth + (paddingX * fontScale * 2));
    const contentHeight = metrics.height + (paddingY * fontScale * 2) + (40 * fontScale); // + header height

    // Canvas Size
    const outerPaddingX = showBackground ? paddingX * fontScale : 0;
    const outerPaddingY = showBackground ? paddingY * fontScale : 0;
    const totalWidth = contentWidth + (outerPaddingX * 2);
    const totalHeight = contentHeight + (outerPaddingY * 2);

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Clear
    ctx.clearRect(0, 0, totalWidth, totalHeight);

    // 2. Draw Background
    if (showBackground) {
        const bgGrad = ctx.createLinearGradient(0, 0, totalWidth, totalHeight);
        bgGrad.addColorStop(0, background.value[0]);
        bgGrad.addColorStop(0.5, background.value[1]);
        bgGrad.addColorStop(1, background.value[2]);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, totalWidth, totalHeight);
    }

    // 3. Draw Window
    const windowX = outerPaddingX;
    const windowY = outerPaddingY;
    const windowW = contentWidth;
    const windowH = contentHeight;
    const radius = borderRadius * fontScale;

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 40 * fontScale;
    ctx.shadowOffsetY = 20 * fontScale;

    // Background
    ctx.fillStyle = getThemeBackground(themeName);
    roundRect(ctx, windowX, windowY, windowW, windowH, radius);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Clip
    ctx.save();
    roundRect(ctx, windowX, windowY, windowW, windowH, radius);
    ctx.clip();

    // 4. Draw Header
    const headerH = 40 * fontScale;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(windowX, windowY, windowW, headerH);

    // Border bottom
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1 * fontScale;
    ctx.beginPath();
    ctx.moveTo(windowX, windowY + headerH);
    ctx.lineTo(windowX + windowW, windowY + headerH);
    ctx.stroke();

    // Controls
    if (showWindowControls) {
        const dotY = windowY + (headerH / 2);
        const dotStart = windowX + (20 * fontScale);
        const dotGap = 20 * fontScale;
        const dotRadius = 6 * fontScale;

        drawCircle(ctx, dotStart, dotY, dotRadius, '#ff5f56'); // Red
        drawCircle(ctx, dotStart + dotGap, dotY, dotRadius, '#ffbd2e'); // Yellow
        drawCircle(ctx, dotStart + (dotGap * 2), dotY, dotRadius, '#27c93f'); // Green
    }

    // Filename
    if (fileName) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = `${12 * fontScale}px ${currentFont}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fileName, windowX + (windowW / 2), windowY + (headerH / 2));
    }

    // 5. Draw Content (Line Numbers + Code)
    const startY = windowY + headerH + (paddingY * fontScale);

    // Draw Line Numbers
    if (showLineNumbers) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.font = `${baseFontSize * fontScale}px ${currentFont}`;

        let numY = startY;
        const numX = windowX + (paddingX * fontScale) + gutterWidth - (20 * fontScale); // Right align with some padding

        for (let i = 1; i <= lineCount; i++) {
            ctx.fillText(i.toString(), numX, numY);
            numY += baseFontSize * fontScale * lineHeight;
        }
    }

    // Draw Code
    ctx.translate(windowX + (paddingX * fontScale) + gutterWidth, startY);

    ctx.font = `${baseFontSize * fontScale}px ${currentFont}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    drawTokens(ctx, tokens, activeTheme, baseFontSize * fontScale, lineHeight);

    ctx.restore();
  }, [code, language, themeName, fileName, background, paddingX, paddingY, showWindowControls, showBackground, showLineNumbers, fontFamily, borderRadius, getThemeBackground]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `codeblock-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    addToast({ title: 'Success', message: 'Canvas snapshot exported.' });
  };

  const glassInputClass = "w-full bg-black/40 border border-white/10 rounded-sm p-3 font-mono text-sm text-gray-300 focus:border-emerald-500/50 outline-none transition-colors";

  const languageOptions = languages.map(lang => ({ label: lang.toUpperCase(), value: lang }));
  const themeOptions = Object.keys(themes).map(t => ({ label: t, value: t }));
  const backgroundOptions = backgrounds.map(bg => ({ label: bg.name, value: bg.name }));
  const fontOptions = fonts.map(f => ({ label: f, value: f }));

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Codeblock Creator | Fezcodex"
        description="Create aesthetic code snapshots for social media and documentation."
        keywords={['codeblock', 'snapshot', 'code image', 'developer tools', 'fezcodex']}
      />
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Codeblock Creator" slug="code" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Render syntax-highlighted code into high-fidelity canvas artifacts.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Controls Sidebar */}
          <div className="lg:col-span-3 space-y-6">

            <div className="border border-white/10 bg-white/[0.02] p-6 space-y-6 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <CodeIcon weight="fill" />
                Code_Input
              </h3>
              <div className="space-y-4">
                 <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={8}
                  className={`${glassInputClass} resize-y`}
                  placeholder="// Paste your code here..."
                />
                 <div className="space-y-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase">Language</label>
                    <CustomDropdown
                        fullWidth
                        options={languageOptions}
                        value={language}
                        onChange={setLanguage}
                        variant="brutalist"
                    />
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-6 space-y-6 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <PaletteIcon weight="fill" />
                Visual_Style
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase">Theme</label>
                    <CustomDropdown
                        fullWidth
                        options={themeOptions}
                        value={themeName}
                        onChange={setThemeName}
                        variant="brutalist"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase">Font Family</label>
                    <CustomDropdown
                        fullWidth
                        options={fontOptions}
                        value={fontFamily}
                        onChange={setFontFamily}
                        variant="brutalist"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase">Background</label>
                    <CustomDropdown
                        fullWidth
                        options={backgroundOptions}
                        value={background.name}
                        onChange={(val) => setBackground(backgrounds.find(b => b.name === val))}
                        variant="brutalist"
                    />
                     <button
                        onClick={() => setShowBackground(!showBackground)}
                        className={`w-full mt-2 py-2 px-3 rounded-sm border transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-between ${showBackground
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-black/20 border-white/10 text-gray-500'
                        }`}
                    >
                        <span>Show Background</span>
                        <span>{showBackground ? '[ ON ]' : '[ OFF ]'}</span>
                    </button>
                </div>
              </div>
            </div>

             <div className="border border-white/10 bg-white/[0.02] p-6 space-y-6 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <FileCodeIcon weight="fill" />
                Window_Props
              </h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase">Filename</label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className={glassInputClass}
                      placeholder="filename.ext"
                    />
                  </div>
                   <div className="space-y-2">
                       <CustomSlider
                           label="Border Radius"
                           value={borderRadius}
                           min={0}
                           max={32}
                           onChange={setBorderRadius}
                           variant="brutalist"
                       />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <CustomSlider
                           label="Padding X"
                           value={paddingX}
                           min={32}
                           max={128}
                           step={8}
                           onChange={setPaddingX}
                           variant="brutalist"
                       />
                       <CustomSlider
                           label="Padding Y"
                           value={paddingY}
                           min={32}
                           max={128}
                           step={8}
                           onChange={setPaddingY}
                           variant="brutalist"
                       />
                   </div>
                  <button
                    onClick={() => setShowLineNumbers(!showLineNumbers)}
                    className={`w-full py-3 px-4 rounded-sm border transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-between ${showLineNumbers
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-black/20 border-white/10 text-gray-500'
                    }`}
                    >
                    <span>Line Numbers</span>
                    <span>{showLineNumbers ? '[ ON ]' : '[ OFF ]'}</span>
                 </button>
                  <button
                    onClick={() => setShowWindowControls(!showWindowControls)}
                    className={`w-full py-3 px-4 rounded-sm border transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-between ${showWindowControls
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-black/20 border-white/10 text-gray-500'
                    }`}
                    >
                    <span>Window Controls</span>
                    <span>{showWindowControls ? '[ ON ]' : '[ OFF ]'}</span>
                 </button>
              </div>
            </div>

            <button
                onClick={handleDownload}
                className="w-full py-4 bg-white text-black hover:bg-emerald-400 transition-all font-mono text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 rounded-sm shadow-lg hover:shadow-emerald-500/20"
            >
                <DownloadSimpleIcon size={20} weight="bold"/>
                <span>Export Canvas PNG</span>
            </button>

          </div>

          {/* Preview Area */}
          <div className="lg:col-span-9 flex flex-col items-center">
              <div className="w-full overflow-hidden border border-white/10 bg-[#111] rounded-sm flex items-center justify-center min-h-[600px] p-12 overflow-x-auto relative">
                 <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl" />
              </div>
              <p className="text-center font-mono text-[10px] text-gray-600 uppercase tracking-widest mt-4">
                Native Canvas Rendering.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Helpers ---

const roundRect = (ctx, x, y, w, h, r) => {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const drawCircle = (ctx, x, y, r, color) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
};

const measureTokens = (ctx, tokens, fontSize, lineHeight) => {
    let width = 0;
    let height = fontSize * lineHeight;
    let currentLineW = 0;

    const traverse = (toks) => {
        toks.forEach(token => {
            if (typeof token === 'string') {
                const lines = token.split('\n');
                lines.forEach((line, i) => {
                    if (i > 0) {
                        width = Math.max(width, currentLineW);
                        currentLineW = 0;
                        height += fontSize * lineHeight;
                    }
                    currentLineW += ctx.measureText(line).width;
                });
            } else if (Array.isArray(token.content)) {
                traverse(token.content);
            } else {
                // Token object with string content
                const lines = token.content.toString().split('\n');
                lines.forEach((line, i) => {
                     if (i > 0) {
                        width = Math.max(width, currentLineW);
                        currentLineW = 0;
                        height += fontSize * lineHeight;
                    }
                    currentLineW += ctx.measureText(line).width;
                });
            }
        });
    };

    if (Array.isArray(tokens)) {
         traverse(tokens);
    } else {
        traverse([tokens]);
    }

    width = Math.max(width, currentLineW);
    return { width, height };
};

const drawTokens = (ctx, tokens, theme, fontSize, lineHeight) => {
    let x = 0;
    let y = 0;

    // Helper to get color from theme
    const getColor = (type) => {
        if (!type) return theme['code[class*="language-"]']?.color || '#abb2bf';
        // Check exact match
        if (theme[type]) return theme[type].color;
        // Check partials (Prism often uses 'keyword', 'string', etc.)
        // react-syntax-highlighter themes use selectors like 'comment', 'string'
        return theme[type]?.color || theme['code[class*="language-"]']?.color || '#abb2bf';
    };

    const drawText = (text, color) => {
         const lines = text.split('\n');
         lines.forEach((line, i) => {
            if (i > 0) {
                x = 0;
                y += fontSize * lineHeight;
            }
            if (line) {
                 ctx.fillStyle = color;
                 ctx.fillText(line, x, y);
                 x += ctx.measureText(line).width;
            }
         });
    };

    const traverse = (toks, parentType) => {
         toks.forEach(token => {
            if (typeof token === 'string') {
                drawText(token, getColor(parentType));
            } else {
                 const type = token.type;
                 // If nested content
                 if (Array.isArray(token.content)) {
                     traverse(token.content, type);
                 } else {
                     drawText(token.content.toString(), getColor(type));
                 }
            }
         });
    };

    if (Array.isArray(tokens)) {
         traverse(tokens);
    } else {
         traverse([tokens]);
    }
};

export default CodeblockCreatorPage;
