import React from 'react';

/**
 * 4-column mono footer — Type / Palette / Grid / Motion.
 * Lifted directly from the Plumb brand colophon.
 */
const DEFAULT_COLUMNS = [
  {
    heading: 'Type',
    body: (
      <>
        Display / Fraunces variable
        <br />
        Mono / IBM Plex Mono
        <br />
        <span className="opacity-60">opsz 9–144 · SOFT 0–100 · WONK 0/1</span>
      </>
    ),
  },
  {
    heading: 'Palette',
    body: (
      <>
        Bone · Ink · Terra · Brass · Sage
        <div className="flex gap-1.5 flex-wrap mt-1.5">
          {['#F3ECE0', '#1A1613', '#C96442', '#B88532', '#6B8E23'].map((c) => (
            <i
              key={c}
              aria-label={c}
              className="block rounded-[3px] border border-[#1A161320]"
              style={{
                width: 24,
                height: 24,
                background: c,
                display: 'block',
              }}
            />
          ))}
        </div>
      </>
    ),
  },
  {
    heading: 'Grid',
    body: (
      <>
        4px base · 12-col editorial
        <br />
        Rule weight 1px · opacity 12%
        <br />
        Hairline only — never bold.
      </>
    ),
  },
  {
    heading: 'Motion',
    body: (
      <>
        Cord sway · 6s ease-in-out
        <br />
        Page load · 400ms stagger
        <br />
        Hover · 180ms spring
      </>
    ),
  },
];

const TerracottaColophon = ({
  columns = DEFAULT_COLUMNS,
  signature,
  className = '',
}) => (
  <footer
    className={`mt-[120px] pt-10 border-t border-[#1A161320] ${className}`}
  >
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 font-ibm-plex-mono text-[10.5px] leading-[1.8] tracking-[0.08em] text-[#2E2620]">
      {columns.map((c) => (
        <div key={c.heading}>
          <h5 className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] uppercase text-[#9E4A2F] mb-3">
            {c.heading}
          </h5>
          <div>{c.body}</div>
        </div>
      ))}
    </div>
    {signature && (
      <div className="mt-10 pt-6 border-t border-[#1A161320] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase text-[#2E2620]/70">
        {signature}
      </div>
    )}
  </footer>
);

export default TerracottaColophon;
