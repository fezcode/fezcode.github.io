import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';

const VARIANTS = {
  amber: {
    decoration: 'via-amber-500/[0.03]',
    glitchShadow1: '#f59e0b',
    glitchShadow2: '#ff0000',
    primary: '#f59e0b',
    tint: 'sepia(100%) hue-rotate(320deg) saturate(300%)', // Fallback filter for simple elements
  },
  green: {
    decoration: 'via-emerald-500/[0.03]',
    glitchShadow1: '#00ff00',
    glitchShadow2: '#ff0000',
    primary: '#10b981',
    tint: 'sepia(100%) hue-rotate(70deg) saturate(300%)', // Fallback filter
  },
};

const FalloutOverlay = () => {
  const {
    isFalloutOverlay,
    falloutVariant,
    isFalloutNoiseEnabled,
    isFalloutScanlinesEnabled,
    isFalloutVignetteEnabled,
  } = useVisualSettings();

  const currentTheme = VARIANTS[falloutVariant] || VARIANTS.amber;
  if (!isFalloutOverlay) return null;

  return (
    <>
      <style>{`
        /* Global CSS Overrides for Fallout Mode */
        body.fallout-mode {
           --fallout-primary: ${currentTheme.primary};
        }
        
        body.fallout-mode * {
           border-color: ${currentTheme.primary}20 !important; /* Low opacity border default */
        }
        
        body.fallout-mode h1, 
        body.fallout-mode h2, 
        body.fallout-mode h3, 
        body.fallout-mode h4,
        body.fallout-mode h5,
        body.fallout-mode h6,
        body.fallout-mode span,
        body.fallout-mode p, 
        body.fallout-mode a,
        body.fallout-mode button,
        body.fallout-mode svg {
           color: ${currentTheme.primary} !important;
           text-shadow: 0 0 2px ${currentTheme.primary}40;
        }

        /* Force transparency on sidebars */
        body.fallout-mode aside {
           background-color: rgba(0,0,0,0.2) !important;
           border-right: 1px solid ${currentTheme.primary}40 !important;
           backdrop-filter: blur(5px);
        }

        /* Ensure overlay is on top but clickable-through */
        .fallout-overlay {
           pointer-events: none;
           position: fixed;
           inset: 0;
           z-index: 9999;
        }

        @keyframes scanline {
            0% { background-position: 0 0; }
            100% { background-position: 0 100%; }
        }
        .animate-scanline {
            animation: scanline 8s linear infinite;
        }
      `}</style>

      {/* HUD Overlays */}

      <div className="fallout-overlay">
        {/* Noise */}

        {isFalloutNoiseEnabled && (
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        )}

        {/* Scanlines */}

        {isFalloutScanlinesEnabled && (
          <div
            className={`absolute inset-0 bg-gradient-to-b from-transparent ${currentTheme.decoration} to-transparent bg-[length:100%_4px] animate-scanline`}
          ></div>
        )}

        {/* Vignette */}

        {isFalloutVignetteEnabled && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>
        )}

        {/* CRT Tint (Subtle global tint if needed, though CSS color override handles most) */}

        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
      </div>
    </>
  );
};

export default FalloutOverlay;
