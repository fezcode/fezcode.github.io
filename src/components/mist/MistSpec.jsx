import React from 'react';

/**
 * Key-value spec — lowercase mono whisper label, Instrument Serif value.
 * Mist's version of metadata: read like a half-recalled detail.
 *
 *   pronunciation
 *   /ˈfɛz.koʊ.dɛks/
 */
const MistSpec = ({ label, value, children, inline = false, className = '' }) => {
  if (inline) {
    return (
      <div
        className={`flex items-baseline gap-3 font-ibm-plex-mono text-[10.5px] tracking-[0.16em] lowercase text-[#5C6B67] ${className}`}
      >
        <span className="text-[#8A9894]">{label}</span>
        <span className="font-instr-serif text-[15px] normal-case tracking-[0.01em] text-[#3C4845]">
          {value || children}
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.16em] lowercase text-[#8A9894]">
        {label}
      </div>
      <div className="font-instr-serif text-[15px] text-[#3C4845] tracking-[0.01em] mt-0.5">
        {value || children}
      </div>
    </div>
  );
};

export default MistSpec;
