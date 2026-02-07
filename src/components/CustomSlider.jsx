import React from 'react';

const CustomSlider = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className = '',
  variant = 'default', // 'default' | 'brutalist' | 'cyberpunk'
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  if (variant === 'cyberpunk') {
    return (
      <div className={`flex flex-col gap-2 w-full ${className}`}>
        {label && (
          <div className="flex justify-between items-end">
            <label className="font-mono text-[10px] uppercase tracking-widest text-cyan-700 font-bold">
              {label}
            </label>
            <span className="font-mono text-xs text-cyan-400 font-bold">
              {value}
            </span>
          </div>
        )}
        <div className="relative w-full h-4 flex items-center group">
          {/* Track Background */}
          <div className="absolute w-full h-1 bg-cyan-900/30 border border-cyan-900 overflow-hidden">
            {/* Filled Track */}
            <div
              className="h-full bg-cyan-500 shadow-[0_0_10px_#0ff]"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {/* Input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Custom Thumb */}
          <div
            className="absolute h-4 w-2 bg-black border border-cyan-500 pointer-events-none transition-all duration-75 ease-out group-hover:bg-cyan-500"
            style={{
              left: `calc(${percentage}% - 4px)`,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-end">
          <label className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            {label}
          </label>
          <span className="font-mono text-xs text-emerald-500 font-bold">
            {value}
          </span>
        </div>
      )}

      <div className="relative w-full h-6 flex items-center group">
        {/* Track Background */}
        <div className="absolute w-full h-1 bg-white/10 rounded-sm overflow-hidden">
          {/* Filled Track */}
          <div
            className="h-full bg-emerald-500 transition-all duration-75 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Custom Thumb (Visual only, follows percentage) */}
        <div
          className="absolute h-4 w-4 bg-[#050505] border-2 border-emerald-500 rounded-sm pointer-events-none transition-all duration-75 ease-out group-hover:scale-110 group-active:scale-95"
          style={{
            left: `calc(${percentage}% - 8px)`,
          }}
        >
          {/* Inner dot */}
          <div className="absolute inset-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};

export default CustomSlider;
