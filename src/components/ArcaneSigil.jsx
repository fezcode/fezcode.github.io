import React, { useMemo } from 'react';

const ArcaneSigil = ({ seed = 'sigil', className = '', color = 'currentColor' }) => {
  const elements = useMemo(() => {
    let h = 0xdeadbeef;
    const safeSeed = seed || 'sigil';
    for (let i = 0; i < safeSeed.length; i++) {
      h = Math.imul(h ^ safeSeed.charCodeAt(i), 2654435761);
    }
    const rng = () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };

    const polygons = [];
    const circles = [];
    const lines = [];

    // Generate rings
    const numRings = 3 + Math.floor(rng() * 4);
    for(let i=0; i<numRings; i++) {
       const r = 15 + rng() * 32;
       circles.push({
         r,
         dash: rng() > 0.4 ? `${1 + rng()*8}, ${1 + rng()*8}` : 'none',
         width: 0.1 + rng() * 0.4,
         rotSpeed: (rng() - 0.5) * 40,
         opacity: 0.4 + rng() * 0.6
       });
    }

    // Generate inner polygons (Sacred Geometry)
    const numPolys = 1 + Math.floor(rng() * 3);
    for(let i=0; i<numPolys; i++) {
       const sides = 3 + Math.floor(rng() * 5); // 3 to 7 sides
       const radius = 10 + rng() * 25;
       const points = [];
       for(let j=0; j<sides; j++) {
          const angle = (j / sides) * Math.PI * 2 - (Math.PI / 2); // Start at top
          points.push(`${50 + Math.cos(angle)*radius},${50 + Math.sin(angle)*radius}`);
       }
       polygons.push({
         points: points.join(' '),
         width: 0.2 + rng() * 0.5,
         rotSpeed: (rng() - 0.5) * 20,
         opacity: 0.5 + rng() * 0.5
       });
    }

    // Generate connecting orbital lines (star chart feel)
    const numLines = Math.floor(rng() * 6);
    for(let i=0; i<numLines; i++) {
      const angle = rng() * Math.PI * 2;
      const r1 = 5 + rng() * 15;
      const r2 = 25 + rng() * 20;
      lines.push({
        x1: 50 + Math.cos(angle) * r1,
        y1: 50 + Math.sin(angle) * r1,
        x2: 50 + Math.cos(angle) * r2,
        y2: 50 + Math.sin(angle) * r2,
        width: 0.1 + rng() * 0.2,
        opacity: 0.3 + rng() * 0.4
      });
    }

    return { circles, polygons, lines };
  }, [seed]);

  const safeId = seed.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  return (
    <svg viewBox="0 0 100 100" className={className} style={{ color }}>
      <defs>
        <radialGradient id={`glow-${safeId}`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.05" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <filter id={`blur-${safeId}`}>
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      {/* Ambient background glow */}
      <circle cx="50" cy="50" r="45" fill={`url(#glow-${safeId})`} />

      {/* Outer boundary ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" opacity="0.3" />
      <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 2" opacity="0.5" />

      {/* Rotating Group */}
      <g stroke="currentColor" fill="none" style={{ transformOrigin: '50px 50px' }}>
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="120s" repeatCount="indefinite" />

        {elements.lines.map((l, i) => (
          <line key={`l-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} strokeWidth={l.width} opacity={l.opacity} />
        ))}

        {elements.circles.map((c, i) => (
          <g key={`cg-${i}`} style={{ transformOrigin: '50px 50px' }}>
             <animateTransform attributeName="transform" type="rotate" from="0 50 50" to={`${c.rotSpeed > 0 ? 360 : -360} 50 50`} dur={`${Math.max(10, Math.abs(200/c.rotSpeed))}s`} repeatCount="indefinite" />
             <circle cx="50" cy="50" r={c.r} strokeWidth={c.width} strokeDasharray={c.dash} opacity={c.opacity} filter={`url(#blur-${safeId})`} />
             <circle cx="50" cy="50" r={c.r} strokeWidth={c.width * 0.5} strokeDasharray={c.dash} opacity={c.opacity} />
          </g>
        ))}

        {elements.polygons.map((p, i) => (
          <g key={`pg-${i}`} style={{ transformOrigin: '50px 50px' }}>
             <animateTransform attributeName="transform" type="rotate" from="0 50 50" to={`${p.rotSpeed > 0 ? 360 : -360} 50 50`} dur={`${Math.max(15, Math.abs(200/p.rotSpeed))}s`} repeatCount="indefinite" />
             <polygon points={p.points} strokeWidth={p.width} opacity={p.opacity} filter={`url(#blur-${safeId})`} />
             <polygon points={p.points} strokeWidth={p.width * 0.5} opacity={p.opacity} />
             {/* Small node at vertices */}
             {p.points.split(' ').map((pt, j) => {
               const [px, py] = pt.split(',');
               return <circle key={`pt-${j}`} cx={px} cy={py} r={0.5} fill="currentColor" opacity="0.8" />
             })}
          </g>
        ))}

        {/* Core focal point */}
        <circle cx="50" cy="50" r="1" fill="currentColor" opacity="0.9" />
        <circle cx="50" cy="50" r="2" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.8" />
      </g>
    </svg>
  );
};

export default ArcaneSigil;