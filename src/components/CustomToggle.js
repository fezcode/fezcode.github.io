import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from '@phosphor-icons/react';

const CustomToggle = ({
  id,
  checked,
  onChange,
  label,
  disabled,
  colorTheme = 'rose',
}) => {
  const themes = {
    rose: {
      track:
        'bg-rose-500/20 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]',
      knob: 'bg-rose-500 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
    },
    blue: {
      track:
        'bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
      knob: 'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.4)]',
    },
    green: {
      track:
        'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      knob: 'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]',
    },
    amber: {
      track:
        'bg-amber-500/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
      knob: 'bg-amber-500 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]',
    },
    purple: {
      track:
        'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
      knob: 'bg-purple-500 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]',
    },
    cyan: {
      track:
        'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
      knob: 'bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]',
    },
    indigo: {
      track:
        'bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]',
      knob: 'bg-indigo-500 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.4)]',
    },
  };

  const activeTheme = themes[colorTheme] || themes.rose;

  return (
    <div
      className={`flex items-center justify-between w-full group py-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onChange({ target: { checked: !checked } })}
    >
      <label
        htmlFor={id}
        className="text-base sm:text-lg text-gray-300 font-medium cursor-pointer select-none group-hover:text-white transition-colors duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent double toggle if label is clicked directly (though container click handles it)
      >
        {label}
      </label>

      <div className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />

        {/* Track */}
        <div
          className={`
            w-14 h-8 rounded-full transition-all duration-300 ease-out
            border border-transparent shadow-inner relative overflow-hidden
            ${
              checked
                ? activeTheme.track
                : 'bg-gray-900/50 border-white/10 hover:border-white/20'
            }
          `}
        >
          {/* Background sheen effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] transition-transform duration-1000 ${checked ? 'group-hover:translate-x-[100%]' : ''}`}
          />
        </div>

        {/* Knob */}
        <motion.div
          className={`
            absolute top-1 left-1 w-6 h-6 rounded-full shadow-lg
            flex items-center justify-center
            backdrop-blur-sm border
            ${checked ? activeTheme.knob : 'bg-gray-700 border-gray-600'}
          `}
          animate={{
            x: checked ? 24 : 0,
            rotate: checked ? 360 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {checked ? (
            <Check size={12} weight="bold" className="text-white" />
          ) : (
            <X size={12} weight="bold" className="text-gray-400" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CustomToggle;
