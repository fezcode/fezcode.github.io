import React from 'react';
import { CopySimpleIcon } from '@phosphor-icons/react';

const TerracottaOutputCard = ({ title, description, value, onCopy }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-[#1A161320] bg-[#E8DECE]/40 group relative overflow-hidden transition-all duration-300 hover:bg-[#E8DECE]/70 hover:border-[#C96442]/40">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C96442]/0 via-[#C96442]/0 to-transparent group-hover:from-[#C96442]/60 group-hover:via-[#C96442]/30 transition-all duration-500" />
      <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#C96442]/60 group-hover:h-full transition-all duration-500" />
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#C96442]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold text-[#2E2620]/70 uppercase tracking-widest">
            {title}
          </span>
          {description && (
            <span className="text-[9px] font-mono text-[#2E2620]/50 tracking-tight">
              {description}
            </span>
          )}
        </div>
        {onCopy && (
          <button
            onClick={() => onCopy(value)}
            className="text-[#2E2620]/50 hover:text-[#9E4A2F] transition-colors"
            title="Copy Output"
          >
            <CopySimpleIcon size={14} weight="bold" />
          </button>
        )}
      </div>

      <div className="font-mono text-sm text-[#1A1613] break-all line-clamp-2 min-h-[2.5rem] relative z-10">
        {value || <span className="opacity-20">---</span>}
      </div>
    </div>
  );
};

export default TerracottaOutputCard;
