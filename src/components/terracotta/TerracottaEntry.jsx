import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Dictionary-entry layout — the signature Plumb "Why" construct.
 *
 *   plumb ¹             /plʌm/
 *   ─────────────────────────────
 *   adjective
 *   1. Exactly vertical; true to the line of gravity.
 *   2. (of work) Honest, upright, without evasion.
 *   ─────────────────────────────
 *   verb
 *   1. To measure, test, or examine.
 *   …
 */

const TerracottaEntry = ({
  headword,
  superscript,
  pronunciation,
  also,
  children,
}) => (
  <div className="font-fraunces">
    <div className="inline-flex items-baseline gap-3.5 flex-wrap">
      <span
        className="text-[72px] md:text-[100px] leading-none tracking-[-0.035em] text-[#1A1613]"
        style={{
          fontVariationSettings: '"opsz" 144, "SOFT" 40, "WONK" 1, "wght" 440',
        }}
      >
        {headword}
      </span>
      {superscript && (
        <sup
          className="font-ibm-plex-mono text-[14px] md:text-[16px] font-normal text-[#9E4A2F] tracking-[0.1em] uppercase"
          style={{ transform: 'translateY(-10px)' }}
        >
          {superscript}
        </sup>
      )}
    </div>
    {pronunciation && (
      <div
        className="font-fraunces italic text-[18px] md:text-[22px] text-[#2E2620] mt-2.5"
        style={{ fontVariationSettings: '"opsz" 24, "SOFT" 100, "wght" 360' }}
      >
        {pronunciation}
      </div>
    )}
    {also && (
      <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.18em] uppercase text-[#2E2620] mt-4 opacity-80">
        also: {also}
      </div>
    )}
    {children}
  </div>
);

export const EntryPos = ({ label, note, children }) => (
  <section className="mt-8">
    <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] uppercase text-[#9E4A2F] pb-2.5 border-b border-[#1A161320] flex items-baseline gap-3">
      <span>{label}</span>
      {note && <span className="opacity-50 normal-case tracking-[0.12em]">· {note}</span>}
    </div>
    <ol className="mt-5 p-0 list-none" style={{ counterReset: 'defs' }}>
      {children}
    </ol>
  </section>
);

export const EntryItem = ({ children, to, href, onClick, suffix }) => {
  const content = (
    <div className="block relative">
      {children}
      {suffix && (
        <span className="ml-3 font-ibm-plex-mono text-[10.5px] tracking-[0.14em] uppercase text-[#9E4A2F]">
          {suffix}
        </span>
      )}
    </div>
  );

  const liClass =
    'pl-[46px] py-3.5 relative text-[16px] md:text-[18px] leading-[1.45] text-[#1A1613] border-b border-dashed border-[#1A161320]';

  const counterSpan = (
    <span
      aria-hidden="true"
      className="absolute left-0 top-4 w-7 font-ibm-plex-mono text-[11px] text-[#9E4A2F] tracking-[0.08em] font-medium"
      style={{ counterIncrement: 'defs' }}
    >
      {/* populated via CSS counter when possible; fallback handled by list order */}
    </span>
  );

  const style = {
    counterIncrement: 'defs',
    fontVariationSettings: '"opsz" 18, "wght" 400',
  };

  if (to) {
    return (
      <li className={liClass} style={style}>
        <NumberedMarker />
        <Link
          to={to}
          className="block hover:text-[#9E4A2F] transition-colors"
        >
          {content}
        </Link>
        {counterSpan}
      </li>
    );
  }
  if (href) {
    return (
      <li className={liClass} style={style}>
        <NumberedMarker />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:text-[#9E4A2F] transition-colors"
        >
          {content}
        </a>
      </li>
    );
  }
  if (onClick) {
    return (
      <li className={liClass} style={style}>
        <NumberedMarker />
        <button
          type="button"
          onClick={onClick}
          className="block w-full text-left hover:text-[#9E4A2F] transition-colors"
        >
          {content}
        </button>
      </li>
    );
  }
  return (
    <li className={liClass} style={style}>
      <NumberedMarker />
      {content}
    </li>
  );
};

// CSS counter numeral shown as `::before`-equivalent by using the style tag approach.
// We ship a small Entry-level <style> block so counters work without Tailwind plugins.
const NumberedMarker = () => (
  <span
    aria-hidden="true"
    className="terracotta-entry-num absolute left-0 top-4 w-7 font-ibm-plex-mono text-[11px] text-[#9E4A2F] tracking-[0.08em] font-medium"
  />
);

/** Utility element: drop once per <Entry> tree to enable numbered markers. */
export const EntryCounterStyle = () => (
  <style>{`
    .terracotta-entry-num::before {
      content: counter(defs);
    }
  `}</style>
);

export default TerracottaEntry;
