import React from 'react';
import MistHorizon from './MistHorizon';

/**
 * Meta strip — the topmost band on every Mist page.
 * Three columns of lowercase mono whisper-text, a breathing dot at left,
 * closed underneath by a fading horizon instead of a border.
 *
 *   [◦ left slot]          [center slot]          [right slot]
 */
const MistStrip = ({ left, center, right, className = '' }) => (
  <div className={className}>
    <style>{`
      @keyframes mist-dot-breathe {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
    `}</style>
    <div className="grid grid-cols-[1fr_auto_1fr] items-center font-ibm-plex-mono text-[10.5px] tracking-[0.18em] lowercase text-[#5C6B67] py-[14px] pb-[18px]">
      <span className="inline-flex items-center min-w-0 truncate">
        <span
          aria-hidden="true"
          className="inline-block w-[7px] h-[7px] rounded-full mr-2.5 shrink-0"
          style={{
            background:
              'radial-gradient(circle at 40% 35%, #FFFFFF 0%, #AFC0BB 100%)',
            boxShadow: '0 0 8px 2px rgba(143,168,188,0.45)',
            animation: 'mist-dot-breathe 5s ease-in-out infinite',
          }}
        />
        <span className="truncate">{left}</span>
      </span>
      <span className="text-center truncate px-4">{center}</span>
      <span className="text-right truncate">{right}</span>
    </div>
    <MistHorizon />
  </div>
);

export default MistStrip;
