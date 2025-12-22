import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  ArrowsClockwiseIcon,
  TextTIcon,
  MagicWandIcon,
  ImageSquareIcon
} from '@phosphor-icons/react';
import html2canvas from 'html2canvas';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const OgImageGeneratorPage = () => {
  const appName = 'OG Image Generator';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Generate beautiful Open Graph images for your website using generative art backgrounds.',
    keywords: ['og image', 'open graph', 'generator', 'social media', 'preview', 'fezcodex'],
  });

    const { addToast } = useToast();
    const [title, setTitle] = useState('My Awesome Post');
    const [description, setDescription] = useState('A short description about the content goes here. Make it catchy!');
    const [seed, setSeed] = useState('fezcodex');
    const [format, setFormat] = useState('png');
    const [isGenerating, setIsGenerating] = useState(false);

    const previewRef = useRef(null);

    const handleDownload = async () => {
      if (!previewRef.current) return;
      setIsGenerating(true);

      try {
        // 1200x630 is the standard OG image size
        const canvas = await html2canvas(previewRef.current, {
          width: 1200,
          height: 630,
          scale: 1, // Start with scale 1 to match exact dimensions if container is sized correctly
          useCORS: true,
          backgroundColor: '#000000',
          logging: false,
          onclone: (clonedDoc) => {
              // Ensure the cloned element has the exact dimensions we want
              const element = clonedDoc.querySelector('[data-og-preview]');
              if (element) {
                  element.style.width = '1200px';
                  element.style.height = '630px';
                  element.style.transform = 'none'; // Remove scaling used for preview
                  element.style.position = 'absolute';
                  element.style.top = '0';
                  element.style.left = '0';
              }
          }
        });

        const mimeType = format === 'webp' ? 'image/webp' : 'image/png';
        const dataUrl = canvas.toDataURL(mimeType, 0.9); // 0.9 quality for webp
        const link = document.createElement('a');
        link.download = `og-image-${seed}-${Date.now()}.${format}`;
        link.href = dataUrl;
        link.click();

        addToast({ title: 'Success', message: `OG Image generated as ${format.toUpperCase()}.` });
      } catch (error) {
        console.error('Generation failed:', error);
        addToast({ title: 'Error', message: 'Failed to generate image.', type: 'error' });
      } finally {
        setIsGenerating(false);
      }
    };

    const randomizeSeed = () => {
      setSeed(Math.random().toString(36).substring(7));
    };

    return (
      <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

                  <header className="mb-24">
                    <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
                      <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
                      <span>Applications</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                      <div className="space-y-4">
                        <BreadcrumbTitle title="OG Image Gen" slug="og-gen" variant="brutalist" />
                        <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                          Create stunning Open Graph images with generative backgrounds.
                        </p>
                      </div>
                    </div>
                  </header>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Controls Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-8">
                <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <TextTIcon weight="fill" />
                  Content
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-3 font-sans text-lg font-bold text-white focus:border-emerald-500/50 outline-none transition-colors"
                      placeholder="Enter title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-3 font-sans text-sm text-gray-300 focus:border-emerald-500/50 outline-none transition-colors resize-none"
                      placeholder="Enter description..."
                    />
                  </div>
                </div>
              </div>

              <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <MagicWandIcon weight="fill" />
                      Background
                  </h3>
                  <button
                      onClick={randomizeSeed}
                      className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-emerald-400 transition-colors"
                      title="Randomize Seed"
                  >
                      <ArrowsClockwiseIcon size={16} weight="bold" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                      <label className="text-[9px] font-mono text-gray-600 uppercase">Seed String</label>
                      <div className="flex gap-2">
                          <input
                              type="text"
                              value={seed}
                              onChange={(e) => setSeed(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-sm p-3 font-mono text-sm text-emerald-500 focus:border-emerald-500/50 outline-none transition-colors"
                          />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-[9px] font-mono text-gray-600 uppercase">Output Format</label>
                      <div className="grid grid-cols-2 gap-2">
                          <button
                              onClick={() => setFormat('png')}
                              className={`p-3 rounded-sm border font-mono text-xs uppercase tracking-wider transition-all ${
                                  format === 'png'
                                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                  : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'
                              }`}
                          >
                              PNG
                          </button>
                          <button
                              onClick={() => setFormat('webp')}
                              className={`p-3 rounded-sm border font-mono text-xs uppercase tracking-wider transition-all ${
                                  format === 'webp'
                                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                  : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'
                              }`}
                          >
                              WEBP
                          </button>
                      </div>
                  </div>
                </div>
              </div>

              <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="w-full py-4 bg-white text-black hover:bg-emerald-400 transition-all font-mono text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isGenerating ? (
                      <>
                          <ArrowsClockwiseIcon className="animate-spin" size={20} weight="bold"/>
                          <span>Generating...</span>
                      </>
                  ) : (
                      <>
                          <DownloadSimpleIcon size={20} weight="bold"/>
                          <span>Download {format.toUpperCase()}</span>
                      </>
                  )}
              </button>
            </div>
          {/* Preview Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
                 <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <ImageSquareIcon weight="fill" />
                    Preview
                </h3>
                <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">1200 x 630 px</span>
            </div>

            <div className="w-full overflow-hidden border border-white/10 bg-[#050505] rounded-sm">
                {/*
                   Wrapper to maintain aspect ratio 1200/630 ~= 1.905
                   We'll use a fixed width container for the capture to ensure consistency
                   and scale it down for visual preview using CSS transform
                */}
                <div className="relative w-full pb-[52.5%]"> {/* Aspect Ratio Wrapper */}
                     <div
                        className="absolute inset-0 flex items-center justify-center overflow-hidden"
                     >
                        {/*
                            This is the element we will capture.
                            It needs to be rendered at 1200x630px logic size, then scaled down for preview.
                        */}
                         <div
                            style={{
                                width: 1200,
                                height: 630,
                                transform: 'scale(var(--scale-factor))',
                                transformOrigin: 'top left',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            }}
                            ref={(el) => {
                                previewRef.current = el;
                                if (el && el.parentElement) {
                                    // Calculate scale factor dynamically
                                    const updateScale = () => {
                                        const parentWidth = el.parentElement.offsetWidth;
                                        const scale = parentWidth / 1200;
                                        el.style.setProperty('--scale-factor', scale);
                                    };
                                    updateScale();
                                    window.addEventListener('resize', updateScale);
                                }
                            }}
                            data-og-preview="true"
                            className="bg-black relative overflow-hidden"
                         >
                             {/* Background */}
                             <div className="absolute inset-0 z-0">
                                 <GenerativeArt seed={seed} className="w-full h-full opacity-60" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                                 <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80" />
                             </div>

                             {/* Content Overlay */}
                             <div className="absolute inset-0 z-10 flex flex-col justify-end p-24">
                                 <div className="max-w-4xl space-y-6">
                                     {/* Brand / Logo placeholder */}
                                     <div className="flex items-center gap-3 mb-8 opacity-70">
                                         <div className="w-8 h-8 bg-emerald-500 rounded-sm" />
                                         <span className="font-mono text-xl tracking-[0.2em] uppercase text-emerald-500 font-bold">Fezcodex</span>
                                     </div>

                                     <h1 className="text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-xl" style={{textWrap: 'balance'}}>
                                         {title}
                                     </h1>

                                     <p className="text-3xl text-gray-300 font-light leading-normal max-w-3xl drop-shadow-lg text-balance">
                                         {description}
                                     </p>
                                 </div>
                             </div>

                             {/* Decorative Elements */}
                             <div className="absolute top-12 right-12 flex gap-4 opacity-30">
                                 <div className="w-2 h-2 bg-white rounded-full" />
                                 <div className="w-2 h-2 bg-white rounded-full" />
                                 <div className="w-2 h-2 bg-white rounded-full" />
                             </div>

                             <div className="absolute bottom-12 right-12 opacity-30 font-mono text-lg tracking-widest text-white/50">
                                 {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                             </div>

                         </div>
                     </div>
                </div>
            </div>

            <p className="text-center font-mono text-[10px] text-gray-600 uppercase tracking-widest">
                The preview above is scaled down. The generated image will be 1200x630 pixels.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OgImageGeneratorPage;
