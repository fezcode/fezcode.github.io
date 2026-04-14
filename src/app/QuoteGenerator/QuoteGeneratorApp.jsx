import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import CanvasPreview from './components/CanvasPreview';
import ControlPanel from './components/ControlPanel';
import { DownloadSimpleIcon } from '@phosphor-icons/react';

const QuoteGeneratorApp = () => {
  const { addToast } = useToast();

  // State
  const [state, setState] = useState({
    text: 'The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.',
    author: 'Albert Camus',
    width: 1080,
    height: 1080, // Square by default, maybe customizable later
    backgroundType: 'solid', // 'solid', 'linear', 'radial'
    backgroundColor: '#ffffff',
    gradientColor1: '#ff0000',
    gradientColor2: '#0000ff',
    gradientAngle: 135,
    textColor: '#000000',
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: 800,
    textAlign: 'left',
    padding: 80,
    lineHeight: 1.2,
    backgroundImage: null,
    overlayOpacity: 0,
    overlayColor: '#000000',
    themeType: 'standard', // 'standard', 'wordbox', 'typewriter'
  });

  const [triggerDownload, setTriggerDownload] = useState(null);

  const updateState = (newState) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  // Font Loading
  useEffect(() => {
    const fonts = [
      'Inter:wght@400;700;900',
      'Playfair+Display:ital,wght@0,400;0,700;1,400',
      'Cinzel:wght@400;700',
      'Caveat:wght@400;700',
      'Oswald:wght@400;700',
      'Lora:ital,wght@0,400;0,700;1,400',
      'Montserrat:wght@400;700;900',
      'Space+Mono:ital,wght@0,400;0,700;1,400',
      'UnifrakturMaguntia',
    ];

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fonts.join('&')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleDownload = (dataUrl, format) => {
    const link = document.createElement('a');
    link.download = `quote-${Date.now()}.${format || 'png'}`;
    link.href = dataUrl;
    link.click();
    setTriggerDownload(null);

    addToast({
      title: 'Quote Downloaded',
      message: `Your quote has been saved successfully as ${format?.toUpperCase() || 'PNG'}.`,
      type: 'success',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls */}
      <div className="lg:col-span-4 h-fit lg:sticky lg:top-8">
        <ControlPanel state={state} updateState={updateState} />
      </div>

      {/* Preview */}
      <div className="lg:col-span-8 space-y-4">
        <CanvasPreview
          {...state}
          onDownload={handleDownload}
          triggerDownload={triggerDownload}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setTriggerDownload('png')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white hover:text-black transition-all font-mono uppercase tracking-widest text-xs font-bold rounded-sm border border-white/20"
          >
            <DownloadSimpleIcon weight="bold" size={16} />
            <span>PNG</span>
          </button>
          <button
            onClick={() => setTriggerDownload('jpeg')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white hover:text-black transition-all font-mono uppercase tracking-widest text-xs font-bold rounded-sm border border-white/20"
          >
            <DownloadSimpleIcon weight="bold" size={16} />
            <span>JPEG</span>
          </button>
          <button
            onClick={() => setTriggerDownload('webp')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white hover:text-black transition-all font-mono uppercase tracking-widest text-xs font-bold rounded-sm border border-white/20"
          >
            <DownloadSimpleIcon weight="bold" size={16} />
            <span>WebP</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteGeneratorApp;
