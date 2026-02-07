import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyedropperIcon, XIcon } from '@phosphor-icons/react';

const PRESET_COLORS = [
  { name: 'Pure Void', hex: '#050505' },
  { name: 'Paper White', hex: '#F5F5F5' },
  { name: 'Emerald Flux', hex: '#10b981' },
  { name: 'Salmon Signal', hex: '#FA8072' },
  { name: 'Cyber Cyan', hex: '#00FFFF' },
  { name: 'Neon Violet', hex: '#a855f7' },
  { name: 'Amber Warning', hex: '#f59e0b' },
  { name: 'Royal Gold', hex: '#D4AF37' },
  { name: 'Crimson Data', hex: '#ef4444' },
  { name: 'Cobalt Core', hex: '#3b82f6' },
  { name: 'Deep Slate', hex: '#1e293b' },
  { name: 'Ghost Gray', hex: '#94a3b8' },
];

const hexToHsv = (hex) => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return { h, s, v };
};

const hsvToHex = (h, s, v) => {
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
    default:
      break;
  }
  const toHex = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const CustomColorPicker = ({ value, onChange, label, variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hsv, setHsv] = useState({ h: 0, s: 0, v: 0 });
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef(null);
  const satRef = useRef(null);
  const hueRef = useRef(null);

  const isBrutalist = variant === 'brutalist';

  useEffect(() => {
    try {
      setHsv(hexToHsv(value));
      setInputValue(value);
    } catch (e) {
      setHsv({ h: 0, s: 0, v: 0 });
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSatMouseDown = (e) => {
    const handleMouseMove = (moveEvent) => {
      const rect = satRef.current.getBoundingClientRect();
      let s = (moveEvent.clientX - rect.left) / rect.width;
      let v = 1 - (moveEvent.clientY - rect.top) / rect.height;
      s = Math.max(0, Math.min(1, s));
      v = Math.max(0, Math.min(1, v));
      onChange(hsvToHex(hsv.h, s, v));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    handleMouseMove(e);
  };

  const handleHueMouseDown = (e) => {
    const handleMouseMove = (moveEvent) => {
      const rect = hueRef.current.getBoundingClientRect();
      let h = (moveEvent.clientX - rect.left) / rect.width;
      h = Math.max(0, Math.min(1, h));
      onChange(hsvToHex(h, hsv.s, hsv.v));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    handleMouseMove(e);
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <label className="block font-mono text-[9px] uppercase text-gray-600 tracking-widest">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 p-2 bg-black/40 border transition-all rounded-sm group ${
            isBrutalist
              ? 'border-white/20 hover:border-emerald-500/50'
              : 'border-white/10 hover:border-white/30'
          }`}
        >
          <div
            className="w-6 h-6 rounded-sm border border-white/20 shadow-inner shrink-0"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
            {value.toUpperCase()}
          </span>
          <EyedropperIcon
            className="ml-auto text-gray-600 group-hover:text-emerald-500 transition-colors"
            size={14}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute z-50 top-full mt-2 w-64 bg-[#0a0a0a] border border-white/20 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-sm"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                <span className="font-mono text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                  Color_Matrix
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-white"
                >
                  <XIcon size={12} />
                </button>
              </div>

              {/* Saturation / Value Picker */}
              <div
                ref={satRef}
                onMouseDown={handleSatMouseDown}
                className="relative w-full aspect-video mb-4 cursor-crosshair rounded-sm overflow-hidden border border-white/10"
                style={{ backgroundColor: hsvToHex(hsv.h, 1, 1) }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div
                  className="absolute w-3 h-3 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_5px_rgba(0,0,0,0.5)] pointer-events-none"
                  style={{
                    left: `${hsv.s * 100}%`,
                    top: `${(1 - hsv.v) * 100}%`,
                  }}
                />
              </div>

              {/* Hue Slider */}
              <div
                ref={hueRef}
                onMouseDown={handleHueMouseDown}
                className="relative w-full h-4 mb-6 cursor-pointer rounded-sm border border-white/10"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
              >
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-white border border-black/40 -translate-x-1/2 shadow-md pointer-events-none"
                  style={{ left: `${hsv.h * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-6 gap-1.5 mb-4">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      onChange(c.hex);
                    }}
                    className={`w-full aspect-square rounded-sm border transition-all ${
                      value.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-emerald-500 scale-110 z-10'
                        : 'border-white/10 hover:border-white/40'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full bg-black/40 border border-white/10 rounded-sm overflow-hidden flex items-center px-3 h-8">
                  <input
                    type="text"
                    value={inputValue.toUpperCase()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInputValue(val);

                      let hex = val;
                      if (!hex.startsWith('#') && hex.length > 0)
                        hex = '#' + hex;

                      // Validate 3, 4, 6, or 8 digit hex
                      if (
                        /^#([0-9A-F]{3}){1,2}$/i.test(hex) ||
                        /^#([0-9A-F]{4}){1,2}$/i.test(hex)
                      ) {
                        onChange(hex);
                      }
                    }}
                    onBlur={() => setInputValue(value)}
                    className="w-full bg-transparent font-mono text-[10px] text-white outline-none uppercase tracking-widest"
                  />
                  <div
                    className="w-4 h-4 rounded-sm border border-white/10 shrink-0"
                    style={{ backgroundColor: value }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomColorPicker;
