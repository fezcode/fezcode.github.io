import React from 'react';

/**
 * Editorial header strip — a three-column mono-ruled band with a terra dot.
 * Used as the topmost page chrome on every Terracotta page.
 *
 *   [● LEFT SLOT]         [CENTER SLOT]          [RIGHT SLOT]
 */
const TerracottaStrip = ({ left, center, right, className = '' }) => (
  <div
    className={`grid grid-cols-[1fr_auto_1fr] items-center font-ibm-plex-mono text-[10.5px] tracking-[0.14em] uppercase text-[#2E2620] py-[14px] pb-[18px] border-b border-[#1A161320] ${className}`}
  >
    <span className="inline-flex items-center min-w-0 truncate">
      <span
        aria-hidden="true"
        className="inline-block w-[6px] h-[6px] bg-[#C96442] rounded-full mr-2 shrink-0"
        style={{ transform: 'translateY(-1px)' }}
      />
      <span className="truncate">{left}</span>
    </span>
    <span className="text-center truncate px-4">{center}</span>
    <span className="text-right truncate">{right}</span>
  </div>
);

export default TerracottaStrip;
