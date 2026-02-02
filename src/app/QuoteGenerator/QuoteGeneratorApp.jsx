import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import CanvasPreview from './components/CanvasPreview';
import ControlPanel from './components/ControlPanel';
import { DownloadSimpleIcon } from '@phosphor-icons/react';

const QuoteGeneratorApp = () => {
  const { addToast } = useToast();

  // State
  const [state, setState] = useState({
    text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
    author: "Albert Camus",
    width: 1080,
    height: 1080, // Square by default, maybe customizable later
    backgroundColor: '#ffffff',
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

  const [triggerDownload, setTriggerDownload] = useState(false);

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
      'UnifrakturMaguntia'
    ];

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fonts.join('&')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleDownload = (dataUrl) => {
    const link = document.createElement('a');
    link.download = `quote-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    setTriggerDownload(false);

    addToast({
      title: 'Quote Downloaded',
      message: 'Your quote has been saved successfully.',
      type: 'success'
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

        <div className="flex justify-end">
          <button
            onClick={() => setTriggerDownload(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-primary-500 hover:text-white transition-all font-mono uppercase tracking-widest text-xs font-bold rounded-sm"
          >
            <DownloadSimpleIcon weight="bold" size={18} />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteGeneratorApp;