import React from 'react';
import { CopySimpleIcon } from '@phosphor-icons/react';

/**
 * A brutalist-styled card for displaying output data with a title, description, and copy functionality.
 * Designed to fit the Fezcodex aesthetic with hover glows and mono typography.
 */
const BrutalistOutputCard = ({ title, description, value, onCopy }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-white/10 bg-white/[0.01] rounded-sm group relative overflow-hidden transition-all duration-300 hover:bg-white/[0.02] hover:border-white/20">
      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/0 group-hover:bg-emerald-500/30 transition-all" />

      {/* Bottom Gradient Glow */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
            {title}
          </span>
          {description && (
            <span className="text-[9px] font-mono text-gray-600 tracking-tight">
              {description}
            </span>
          )}
        </div>
        {onCopy && (
          <button
            onClick={() => onCopy(value)}
            className="text-gray-600 hover:text-emerald-400 transition-colors"
            title="Copy Output"
          >
            <CopySimpleIcon size={14} weight="bold" />
          </button>
        )}
      </div>

      <div className="font-mono text-sm text-gray-300 break-all line-clamp-2 min-h-[2.5rem] relative z-10">
        {value || <span className="opacity-10">---</span>}
      </div>
    </div>
  );
};

export default BrutalistOutputCard;
