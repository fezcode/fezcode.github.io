import React, { useMemo } from 'react';

const LiquidPrismArt = ({ seed = 'prism', className = '' }) => {
  const shapes = useMemo(() => {
    let h = 0xdeadbeef;
    const safeSeed = seed || 'prism';
    for (let i = 0; i < safeSeed.length; i++) {
      h = Math.imul(h ^ safeSeed.charCodeAt(i), 2654435761);
    }
    const rng = () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };

    const baseHue = Math.floor(rng() * 360);
    // Vibrant, complementary colors
    const colors = [
      `hsl(${baseHue}, 100%, 65%)`,
      `hsl(${(baseHue + 60) % 360}, 100%, 60%)`,
      `hsl(${(baseHue + 150) % 360}, 100%, 70%)`,
      `hsl(${(baseHue + 240) % 360}, 100%, 65%)`,
    ];

    const blobs = [];
    for (let i = 0; i < 4; i++) {
      blobs.push({
        cx: 20 + rng() * 60,
        cy: 20 + rng() * 60,
        r: 35 + rng() * 40,
        color: colors[i],
        dur: 15 + rng() * 15,
        tx: (rng() - 0.5) * 60,
        ty: (rng() - 0.5) * 60,
      });
    }
    return { blobs, mainColor: colors[0] };
  }, [seed]);

  return (
    <div className={`w-full h-full overflow-hidden relative bg-[#0a0a0a] ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full scale-[1.5] filter blur-[18px]">
        {shapes.blobs.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.color} opacity="0.85" style={{ mixBlendMode: 'screen' }}>
            <animate attributeName="cx" values={`${b.cx}; ${b.cx + b.tx}; ${b.cx}`} dur={`${b.dur}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${b.cy}; ${b.cy + b.ty}; ${b.cy}`} dur={`${b.dur * 1.2}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
      {/* Noise overlay for organic texture */}
      <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
    </div>
  );
};

export default LiquidPrismArt;
