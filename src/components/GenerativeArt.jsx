import React, { useMemo, useRef } from 'react';
import { DownloadSimpleIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react';

const GenerativeArt = ({
  seed = 'fezcodex',
  className,
  showDownload = false,
  downloadResolution = 1024,
  onRegenerate,
}) => {
  const svgRef = useRef(null);
  // Sanitize seed for use in SVG IDs
  const safeId = useMemo(
    () => seed.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
    [seed],
  );

  const shapes = useMemo(() => {
    // Seeded RNG
    let h = 0xdeadbeef;
    const safeSeed = seed || 'fezcodex';
    for (let i = 0; i < safeSeed.length; i++) {
      h = Math.imul(h ^ safeSeed.charCodeAt(i), 2654435761);
    }
    const rng = () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };

    const hue = Math.floor(rng() * 360);
    const primaryColor = `hsl(${hue}, 70%, 60%)`;
    const secondaryColor = `hsl(${(hue + 180) % 360}, 60%, 50%)`;
    const accentColor = `hsl(${(hue + 90) % 360}, 80%, 60%)`;

    const type = Math.floor(rng() * 3);
    const shapes = [];

    if (type === 0) {
      // Bauhaus Grid
      const gridSize = 5;
      const cellSize = 100 / gridSize;
      let count = 0;

      const addShape = (x, y) => {
        const shapeType = Math.floor(rng() * 4);
        const rotation = Math.floor(rng() * 4) * 90;
        const colorRoll = rng();
        let color = primaryColor;
        if (colorRoll > 0.6) color = secondaryColor;
        if (colorRoll > 0.9) color = accentColor;
        if (colorRoll < 0.1) color = '#ffffff';
        shapes.push({
          mode: 'grid',
          x: x * cellSize,
          y: y * cellSize,
          size: cellSize,
          shapeType,
          rotation,
          color,
          isOutline: rng() > 0.6,
        });
        count++;
      };

      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          if (rng() > 0.5) addShape(x, y);
        }
      }
      // Guarantee at least 5 shapes
      if (count < 5) {
        for (let i = 0; i < 5; i++)
          addShape(Math.floor(rng() * gridSize), Math.floor(rng() * gridSize));
      }
    } else if (type === 1) {
      // Tech Circuit
      const count = 15;
      for (let i = 0; i < count; i++) {
        const isVertical = rng() > 0.5;
        const x = Math.floor(rng() * 10) * 10;
        const y = Math.floor(rng() * 10) * 10;
        const thickness = 0.5 + rng() * 1.5;
        shapes.push({
          mode: 'tech',
          x,
          y,
          isVertical,
          length: 20 + rng() * 60,
          thickness,
          color: rng() > 0.8 ? '#ffffff' : primaryColor,
          opacity: 0.4 + rng() * 0.6,
        });
        if (rng() > 0.4)
          shapes.push({
            mode: 'node',
            cx: x,
            cy: y,
            r: thickness * 2,
            color: accentColor,
          });
      }
    } else {
      // Geometric Flow
      for (let i = 0; i < 8; i++) {
        shapes.push({
          mode: 'flow',
          cx: rng() * 100,
          cy: rng() * 100,
          r: 10 + rng() * 40,
          color: i % 2 === 0 ? primaryColor : secondaryColor,
          opacity: 0.3 + rng() * 0.3,
        });
      }
    }

    return shapes;
  }, [seed]);

  const handleDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Higher resolution for download
    const size = downloadResolution;
    canvas.width = size;
    canvas.height = size;

    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Fill background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `fezcodex-art-${safeId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div
      className={`w-full h-full bg-neutral-950 overflow-hidden relative ${className}`}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <pattern
            id={`bg-grid-${safeId}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.5" fill="white" opacity="0.05" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#bg-grid-${safeId})`} />
        {shapes.map((s, i) => {
          if (s.mode === 'grid') {
            const center = s.size / 2;
            const p = s.size * 0.1;
            const is = s.size - p * 2;
            return (
              <g
                key={i}
                transform={`translate(${s.x}, ${s.y}) rotate(${s.rotation}, ${center}, ${center})`}
              >
                {s.shapeType === 0 && (
                  <rect
                    x={p}
                    y={p}
                    width={is}
                    height={is}
                    fill={s.isOutline ? 'none' : s.color}
                    stroke={s.color}
                    strokeWidth={s.isOutline ? 1.5 : 0}
                    opacity="0.9"
                    rx="1"
                  />
                )}
                {s.shapeType === 1 && (
                  <circle
                    cx={center}
                    cy={center}
                    r={is / 2}
                    fill={s.isOutline ? 'none' : s.color}
                    stroke={s.color}
                    strokeWidth={s.isOutline ? 1.5 : 0}
                    opacity="0.9"
                  />
                )}
                {s.shapeType === 2 && (
                  <path
                    d={`M ${p} ${p} L ${s.size - p} ${p} A ${is} ${is} 0 0 1 ${p} ${s.size - p} Z`}
                    fill={s.color}
                    opacity="0.9"
                  />
                )}
                {s.shapeType === 3 && (
                  <polygon
                    points={`${p},${s.size - p} ${s.size / 2},${p} ${s.size - p},${s.size - p}`}
                    fill={s.isOutline ? 'none' : s.color}
                    stroke={s.color}
                    strokeWidth={s.isOutline ? 1.5 : 0}
                    opacity="0.9"
                  />
                )}
              </g>
            );
          }
          if (s.mode === 'tech')
            return (
              <rect
                key={i}
                x={s.x}
                y={s.y}
                width={s.isVertical ? s.thickness : s.length}
                height={s.isVertical ? s.length : s.thickness}
                fill={s.color}
                opacity={s.opacity}
              />
            );
          if (s.mode === 'node')
            return (
              <circle
                key={i}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill={s.color}
                opacity="0.8"
              />
            );
          if (s.mode === 'flow')
            return (
              <circle
                key={i}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill={s.color}
                opacity={s.opacity}
                style={{ mixBlendMode: 'screen' }}
              />
            );
          return null;
        })}
      </svg>
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute bottom-4 right-4 flex gap-2">
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="p-3 bg-white/10 hover:bg-emerald-500 text-white hover:text-black transition-all border border-white/10 rounded-sm group/regen backdrop-blur-md"
            title="Regenerate Art"
          >
            <ArrowsClockwiseIcon size={20} weight="bold" className="group-hover/regen:rotate-180 transition-transform duration-500" />
          </button>
        )}
        {showDownload && (
          <button
            onClick={handleDownload}
            className="p-3 bg-white/10 hover:bg-emerald-500 text-white hover:text-black transition-all border border-white/10 rounded-sm group/dl backdrop-blur-md"
            title="Download PNG (4K)"
          >
            <DownloadSimpleIcon size={20} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GenerativeArt;
