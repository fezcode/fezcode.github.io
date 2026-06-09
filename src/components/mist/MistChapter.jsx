import React from 'react';

/**
 * Chapter head — the Mist section opener.
 * Three columns: [180px drift label] [Instrument Serif title] [right-aligned whisper blurb]
 *
 *   drift i — selected works     half-built, fully meant.        kept while waking; read gently.
 *
 * Labels are lowercase always — mist whispers, it never announces.
 */
const MistChapter = ({ numeral, label, title, blurb, id, children }) => {
  const driftLabel =
    label && numeral
      ? `drift ${numeral} — ${label}`
      : label || (numeral ? `drift ${numeral}` : '');

  return (
    <header
      id={id}
      className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-6 md:gap-10 items-baseline pb-[60px]"
    >
      <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B]">
        {driftLabel}
      </div>
      <h2 className="font-instr-serif text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.015em] text-[#3C4845] font-normal">
        {title || children}
      </h2>
      {blurb && (
        <p className="font-ibm-plex-mono text-[11px] leading-[1.8] lowercase text-[#8A9894] max-w-[28ch] md:text-right">
          {blurb}
        </p>
      )}
    </header>
  );
};

/**
 * Italic eucalyptus accent used inside chapter titles:
 *   <MistChapter title={<>half-remembered, <ChapterEm>half-imagined.</ChapterEm></>} />
 */
export const ChapterEm = ({ children }) => (
  <em className="italic text-[#5F837B]">{children}</em>
);

export default MistChapter;
