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
import useSeo from '../../../hooks/useSeo';
import { useToast } from '../../../hooks/useToast';
import CustomDropdown from '../../../components/CustomDropdown';
import CustomColorPicker from '../../../components/CustomColorPicker';
import BreadcrumbTitle from '../../../components/BreadcrumbTitle';
import { themeRenderers } from './themes';

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
  { value: 'cyberpunk', label: 'CYBERPUNK_2077' },
  { value: 'sketch', label: 'HAND_DRAWN' },
  { value: 'bauhaus', label: 'BAUHAUS_GEO' },
  { value: 'popart', label: 'POP_ART_COMIC' },
  { value: 'cod', label: 'TACTICAL_OPS' },
  { value: 'crtAmber', label: 'RETRO_AMBER_CRT' },
  { value: 'gta', label: 'GRAND_THEFT_AUTO' },
  { value: 'rich', label: 'LUXURY_GOLD' },
  { value: 'abstract', label: 'ABSTRACT_SHAPES' },
  { value: 'matrix', label: 'THE_MATRIX' },
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
    const renderer = themeRenderers[theme];
    if (renderer) {
        renderer(ctx, width, height, scale, {
            repoOwner,
            repoName,
            description,
            language,
            stars,
            forks,
            supportUrl,
            primaryColor,
            secondaryColor,
            bgColor
        });
    }
  }, [repoOwner, repoName, description, language, stars, forks, supportUrl, theme, primaryColor, secondaryColor, bgColor, showPattern]);

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
