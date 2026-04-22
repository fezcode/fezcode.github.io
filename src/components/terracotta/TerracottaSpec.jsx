import React from 'react';

/**
 * Key-value spec row — mono uppercase label, Fraunces value beneath.
 * Used inside sidebars, dossiers, hero meta-grids, anywhere metadata wants
 * the brand-consistent two-level treatment.
 *
 *   PRONUNCIATION
 *   /ˈfɛz.koʊ.dɛks/
 */
const TerracottaSpec = ({
  label,
  value,
  children,
  inline = false,
  className = '',
}) => {
  if (inline) {
    return (
      <div
        className={`flex items-baseline gap-3 font-ibm-plex-mono text-[10.5px] tracking-[0.14em] uppercase text-[#2E2620] ${className}`}
      >
        <span className="text-[#2E2620]/60">{label}</span>
        <span
          className="font-fraunces text-[14px] normal-case tracking-[0.02em] text-[#1A1613]"
          style={{ fontVariationSettings: '"wght" 520, "opsz" 14' }}
        >
          {value || children}
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.14em] uppercase text-[#2E2620]/80">
        {label}
      </div>
      <div
        className="font-fraunces text-[14px] text-[#1A1613] tracking-[0.02em] mt-0.5"
        style={{ fontVariationSettings: '"wght" 520, "opsz" 14' }}
      >
        {value || children}
      </div>
    </div>
  );
};

export default TerracottaSpec;
