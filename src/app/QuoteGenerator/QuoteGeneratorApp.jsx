import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import CanvasPreview from './components/CanvasPreview';
import ControlPanel from './components/ControlPanel';
import { DownloadSimpleIcon } from '@phosphor-icons/react';

const QuoteGeneratorApp = () => {
  const { addToast } = useToast();

  const [state, setState] = useState({
    text: 'The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.',
    author: 'Albert Camus',
    width: 1080,
    height: 1080,
    backgroundType: 'solid',
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
    themeType: 'standard',
  });

  const [triggerDownload, setTriggerDownload] = useState(null);

  const updateState = (newState) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

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
      message: `Saved as ${format?.toUpperCase() || 'PNG'}.`,
      type: 'success',
    });
  };

  const charCount = state.text.length;
  const wordCount = state.text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* ── PREVIEW · sticky on lg, larger column ── */}
      <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-1">
        <div className="lg:sticky lg:top-20 space-y-4">
          {/* meta row above canvas */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-4 qg-mono" style={{ letterSpacing: '0.08em' }}>
              <span className="qg-label">preview</span>
              <span className="qg-dim">·</span>
              <span className="qg-dim">{state.width} × {state.height}</span>
            </div>
            <div className="flex items-center gap-3 qg-mono" style={{ letterSpacing: '0.08em' }}>
              <span className="qg-dim">{wordCount} words</span>
              <span className="qg-dim">·</span>
              <span className="qg-dim">{charCount} chars</span>
            </div>
          </div>

          <CanvasPreview
            {...state}
            onDownload={handleDownload}
            triggerDownload={triggerDownload}
          />

          {/* download row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="qg-mono text-[10px]" style={{ letterSpacing: '0.1em', color: 'var(--wb-ink-soft, #6B6A65)' }}>
              export as
            </div>
            <div className="flex items-center gap-2">
              {['png', 'jpeg', 'webp'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setTriggerDownload(fmt)}
                  className="wb-dl-btn"
                >
                  <DownloadSimpleIcon weight="regular" size={13} />
                  <span>{fmt.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROLS · scrollable right column ── */}
      <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-2">
        <ControlPanel state={state} updateState={updateState} />
      </div>

      {/* Host-page can restyle labels via these classes */}
      <style>{`
        .qg-mono { font-family: 'JetBrains Mono', 'Space Mono', monospace; }
        .qg-label { color: var(--wb-ink-soft, #6B6A65); text-transform: lowercase; }
        .qg-dim { color: var(--wb-ink-dim, #A8A49B); text-transform: lowercase; }
        .wb-dl-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: 0.08em;
          background: var(--wb-surface, #FFFFFF);
          color: var(--wb-ink, #1A1918);
          border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
          border-radius: 8px;
          cursor: pointer;
          transition: all .15s ease;
        }
        .wb-dl-btn:hover {
          background: var(--wb-accent, #C4643A);
          color: var(--wb-bg, #FAF7F0);
          border-color: var(--wb-accent, #C4643A);
        }
      `}</style>
    </div>
  );
};

export default QuoteGeneratorApp;
