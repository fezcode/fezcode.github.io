import React, { useMemo } from 'react';

const LuxeArt = ({ seed = 'luxe', className, transparent = false }) => {
  // LCG Random Generator
  const rng = useMemo(() => {
    let h = 0xdeadbeef;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }, [seed]);

  const shapes = useMemo(() => {
    const r = rng; // concise alias
    const items = [];

    // Palette Generation
    const baseHue = Math.floor(r() * 360);
    // const saturation = 20 + r() * 20; // Low saturation for Luxe feel
    // const lightness = 80 + r() * 10;  // High lightness

    // Generate organic curves (Silk/Marble effect)
    const curveCount = 8 + Math.floor(r() * 5);

    for (let i = 0; i < curveCount; i++) {
      const points = [];
      const segments = 4;
      const startY = r() * 100;

      points.push({ x: 0, y: startY });

      for (let j = 1; j <= segments; j++) {
        points.push({
          x: (j / segments) * 100,
          y: startY + (r() - 0.5) * 50 // Variation
        });
      }

      // Create smooth bezier path
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let j = 0; j < points.length - 1; j++) {
        const p0 = points[j];
        const p1 = points[j + 1];
        // Simple catmull-rom or quadratic approx?
        // Let's use simple cubic bezier for smoothness
        const cp1x = p0.x + (p1.x - p0.x) / 2;
        const cp1y = p0.y;
        const cp2x = p0.x + (p1.x - p0.x) / 2;
        const cp2y = p1.y;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
      }

      // Close the shape to bottom/corners to form a fillable area
      d += ` L 100 100 L 0 100 Z`;

      const opacity = (0.05 + r() * 0.15) * (transparent ? 2 : 1);
      // const color = `hsla(${baseHue + (r() - 0.5) * 40}, ${saturation}%, ${lightness - i * 5}%, ${opacity})`;
      // Force grayscale/gold/bronze tones for "Luxe"
      const isGold = r() > 0.8;
      const hue = isGold ? 45 : baseHue; // 45 is roughly gold
      const sat = isGold ? 60 : 0; // Grayscale or Gold
      const lit = isGold ? 60 : 90 - i * 5;

      items.push({
        d,
        fill: `hsla(${hue}, ${sat}%, ${lit}%, ${opacity})`,
        stroke: `hsla(${hue}, ${sat}%, ${lit - 20}%, ${opacity * 2})`
      });
    }

    // Add some noise texture specks
    const specks = [];
    for(let k=0; k<50; k++) {
        specks.push({
            cx: r() * 100,
            cy: r() * 100,
            r: r() * 0.3,
            fill: transparent ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'
        });
    }

    return { curves: items, specks };
  }, [rng, transparent]);

  return (
    <div className={`w-full h-full overflow-hidden relative ${!transparent && 'bg-[#EBEBEB]'} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {shapes.curves.map((shape, i) => (
          <path
            key={`curve-${i}`}
            d={shape.d}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth="0.1"
            style={{ mixBlendMode: 'multiply' }}
          />
        ))}
        {shapes.specks.map((s, i) => (
           <circle key={`speck-${i}`} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} />
        ))}
      </svg>
    </div>
  );
};

export default LuxeArt;
