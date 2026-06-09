import React from 'react';
import MistHorizon from './MistHorizon';

/**
 * 4-column whisper footer — type / palette / atmosphere / motion.
 * The closing breath of every Mist page.
 */
const DEFAULT_COLUMNS = [
  {
    heading: 'type',
    body: (
      <>
        display / instrument serif
        <br />
        body / outfit
        <br />
        mono / ibm plex mono
        <br />
        <span className="opacity-60">lowercase always — mist whispers</span>
      </>
    ),
  },
  {
    heading: 'palette',
    body: (
      <>
        fog · ink · eucalyptus · drift
        <div className="flex gap-1.5 flex-wrap mt-1.5">
          {['#EEF2F1', '#3C4845', '#5F837B', '#8FA8BC', '#D2DBD8'].map((c) => (
            <i
              key={c}
              aria-label={c}
              className="block rounded-full"
              style={{
                width: 22,
                height: 22,
                background: c,
                display: 'block',
                boxShadow: 'inset 0 0 0 1px rgba(60,72,69,0.14)',
              }}
            />
          ))}
        </div>
      </>
    ),
  },
  {
    heading: 'atmosphere',
    body: (
      <>
        veils · 26–34s drift
        <br />
        rules fade at both ends
        <br />
        no hard edges — ever.
      </>
    ),
  },
  {
    heading: 'motion',
    body: (
      <>
        orb breath · 7s ease-in-out
        <br />
        reveals · blur 6px → 0
        <br />
        hover · 250ms dissolve
      </>
    ),
  },
];

const MistColophon = ({ columns = DEFAULT_COLUMNS, signature, className = '' }) => (
  <footer className={`mt-[120px] ${className}`}>
    <MistHorizon />
    <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-10 font-ibm-plex-mono text-[10.5px] leading-[1.9] tracking-[0.08em] lowercase text-[#5C6B67]">
      {columns.map((c) => (
        <div key={c.heading}>
          <h5 className="font-ibm-plex-mono text-[9.5px] tracking-[0.26em] lowercase text-[#5F837B] mb-3">
            {c.heading}
          </h5>
          <div>{c.body}</div>
        </div>
      ))}
    </div>
    {signature && (
      <div className="mt-10">
        <MistHorizon tint="rgba(60,72,69,0.18)" />
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-ibm-plex-mono text-[10px] tracking-[0.2em] lowercase text-[#8A9894]">
          {signature}
        </div>
      </div>
    )}
  </footer>
);

export default MistColophon;
