import React from 'react';

/**
 * Chapter head — the signature Plumb section opener.
 * Three columns: [180px numeral col] [title with italic serif accent] [right-aligned mono blurb]
 *
 *   § I — SELECTED WORKS     A weighted archive.              Built to measure, not just to move.
 */
const TerracottaChapter = ({
  numeral,
  label,
  title,
  blurb,
  id,
  children,
}) => {
  const romanLabel =
    label && numeral ? `§ ${numeral} — ${label}` : label || (numeral ? `§ ${numeral}` : '');

  return (
    <header
      id={id}
      className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-6 md:gap-10 items-baseline pb-[60px]"
    >
      <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F]">
        {romanLabel}
      </div>
      <h2
        className="font-fraunces text-[44px] md:text-[64px] leading-[0.95] tracking-[-0.025em] text-[#1A1613]"
        style={{
          fontVariationSettings: '"opsz" 80, "SOFT" 60, "WONK" 1, "wght" 420',
        }}
      >
        {title || children}
      </h2>
      {blurb && (
        <p className="font-ibm-plex-mono text-[11.5px] leading-[1.7] text-[#2E2620] max-w-[28ch] md:text-right">
          {blurb}
        </p>
      )}
    </header>
  );
};

/**
 * Italic terra accent used inside chapter titles:
 *   <TerracottaChapter title={<>A weighted <ChapterEm>archive</ChapterEm>.</>} />
 */
export const ChapterEm = ({ children }) => (
  <em
    className="text-[#9E4A2F]"
    style={{
      fontStyle: 'italic',
      fontVariationSettings: '"opsz" 80, "SOFT" 100, "WONK" 1, "wght" 360',
    }}
  >
    {children}
  </em>
);

export default TerracottaChapter;
