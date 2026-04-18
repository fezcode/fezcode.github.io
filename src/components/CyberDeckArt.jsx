import React, { useMemo } from 'react';

const CyberDeckArt = ({ seed = 'cyberdeck', className = '' }) => {
  const shapes = useMemo(() => {
    // Basic seeded RNG
    let h = 0xdeadbeef;
    const safeSeed = seed || 'cyberdeck';
    for (let i = 0; i < safeSeed.length; i++) {
      h = Math.imul(h ^ safeSeed.charCodeAt(i), 2654435761);
    }
    const rng = () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };

    // Color palette generation (Cyberpunk themed)
    const baseHue = Math.floor(rng() * 360);
    // Force colors into synthwave spectrum (cyan, magenta, yellow, neon green)
    const hue = (baseHue % 100) + (rng() > 0.5 ? 160 : 300); // 160-260 (cyans/blues), 300-400 (magentas/reds)

    const primary = `hsl(${hue}, 100%, 50%)`;
    const secondary = `hsl(${(hue + 60) % 360}, 100%, 60%)`;
    const darkAccent = `hsl(${hue}, 80%, 15%)`;

    const nodes = [];
    const lines = [];
    const datablocks = [];

    // Generate tech grid / data blocks
    const blockCount = 8 + Math.floor(rng() * 12);
    for (let i = 0; i < blockCount; i++) {
      datablocks.push({
        x: rng() * 100,
        y: rng() * 100,
        w: 5 + rng() * 25,
        h: 2 + rng() * 8,
        color: rng() > 0.7 ? primary : darkAccent,
        opacity: rng() > 0.5 ? 0.8 : 0.3,
        delay: rng() * 2
      });
    }

    // Generate circuit lines
    const lineCount = 5 + Math.floor(rng() * 8);
    for (let i = 0; i < lineCount; i++) {
      const startX = rng() * 100;
      const startY = rng() * 100;
      const length = 20 + rng() * 40;
      const isHorizontal = rng() > 0.5;

      lines.push({
        x1: startX,
        y1: startY,
        x2: isHorizontal ? startX + length : startX,
        y2: isHorizontal ? startY : startY + length,
        color: rng() > 0.5 ? primary : secondary,
        strokeWidth: 0.5 + rng() * 1.5,
        dash: rng() > 0.5 ? '4 2' : 'none'
      });

      // Add nodes at line ends
      if (rng() > 0.3) {
        nodes.push({ cx: startX, cy: startY, r: 1.5, color: secondary });
        nodes.push({
          cx: isHorizontal ? startX + length : startX,
          cy: isHorizontal ? startY : startY + length,
          r: 2,
          color: primary,
          glow: true
        });
      }
    }

    // Data streams (vertical matrix-like blocks)
    const streamCount = 4 + Math.floor(rng() * 6);
    for (let i = 0; i < streamCount; i++) {
      datablocks.push({
        x: rng() * 100,
        y: rng() * 100,
        w: 1 + rng() * 2,
        h: 20 + rng() * 40,
        color: secondary,
        opacity: 0.15 + rng() * 0.2,
      });
    }

    return { datablocks, lines, nodes, primary, darkAccent };
  }, [seed]);

  return (
    <div className={`w-full h-full bg-[#030303] overflow-hidden relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <pattern id={`hex-grid-${seed}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </pattern>
          <filter id={`glow-${seed}`}>
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill={`url(#hex-grid-${seed})`} />

        {/* Data blocks */}
        {shapes.datablocks.map((b, i) => (
          <rect
            key={`block-${i}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill={b.color}
            opacity={b.opacity}
            rx="0.5"
          >
             <animate attributeName="opacity" values={`${b.opacity}; ${b.opacity * 0.2}; ${b.opacity}`} dur={`${2 + b.delay}s`} repeatCount="indefinite" />
          </rect>
        ))}

        {/* Circuit lines */}
        {shapes.lines.map((l, i) => (
          <line
            key={`line-${i}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={l.color}
            strokeWidth={l.strokeWidth}
            strokeDasharray={l.dash}
            opacity="0.6"
          />
        ))}

        {/* Connection nodes */}
        {shapes.nodes.map((n, i) => (
          <circle
            key={`node-${i}`}
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill={n.color}
            filter={n.glow ? `url(#glow-${seed})` : 'none'}
            opacity="0.9"
          />
        ))}
      </svg>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }} />
    </div>
  );
};

export default CyberDeckArt;