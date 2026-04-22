import React, { useMemo, useRef } from 'react';
import { DownloadSimpleIcon, ArrowsClockwiseIcon } from '@phosphor-icons/react';

/*
 * TerracottaGenerativeArt
 *
 * A Plumb-palette generative piece: bone paper, terra ink, brass & sage accents.
 * Three seeded compositions drawn like a 19th-century broadside / chart plate.
 *
 *   0 — "broadside"   big Fraunces letterform + fleurons + hatch bands
 *   1 — "plate"       woodcut concentric arcs, dotted rings, pie wedges
 *   2 — "chart"       topographic contour lines + compass + tick rule
 *
 * Everything is deterministic on the seed. Palette is fixed — no neon HSL.
 */

const BONE = '#F3ECE0';
const BONE_DEEP = '#E8DECE';
const INK = '#1A1613';
const INK_SOFT = '#2E2620';
const TERRA = '#C96442';
const TERRA_DEEP = '#9E4A2F';
const BRASS = '#B88532';
const SAGE = '#6B8E23';

const TerracottaGenerativeArt = ({
  seed = 'fezcodex',
  className = '',
  showDownload = false,
  downloadResolution = 1024,
  onRegenerate,
}) => {
  const svgRef = useRef(null);

  const safeId = useMemo(
    () => (seed || 'x').replace(/[^a-z0-9]/gi, '-').toLowerCase(),
    [seed],
  );

  const composition = useMemo(() => {
    let h = 0xc9_64_42_f0;
    const safeSeed = seed || 'fezcodex';
    for (let i = 0; i < safeSeed.length; i++) {
      h = Math.imul(h ^ safeSeed.charCodeAt(i), 2654435761);
    }
    const rng = () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };

    const variant = Math.floor(rng() * 3);
    const letter = (safeSeed.replace(/[^a-z]/gi, '')[0] || 'F').toUpperCase();
    const accent = [TERRA, TERRA_DEEP, BRASS, SAGE][Math.floor(rng() * 4)];
    const rolls = Array.from({ length: 64 }, () => rng());

    return { variant, letter, accent, rolls };
  }, [seed]);

  const { variant, letter, accent, rolls } = composition;

  /* ============================================================
   * Shared paper background + crosshair corners
   * ============================================================ */
  const Corners = () => (
    <g opacity="0.5">
      {[
        [6, 6],
        [94, 6],
        [6, 94],
        [94, 94],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx}, ${cy})`}>
          <circle r="1.6" fill="none" stroke={INK} strokeWidth="0.16" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke={INK} strokeWidth="0.14" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke={INK} strokeWidth="0.14" />
        </g>
      ))}
    </g>
  );

  const EdgeRule = () => (
    <>
      <line x1="12" y1="12" x2="88" y2="12" stroke={INK} strokeWidth="0.22" />
      <line x1="12" y1="88" x2="88" y2="88" stroke={INK} strokeWidth="0.22" />
      <line x1="12" y1="14" x2="88" y2="14" stroke={INK} strokeWidth="0.08" />
      <line x1="12" y1="86" x2="88" y2="86" stroke={INK} strokeWidth="0.08" />
    </>
  );

  /* ============================================================
   * VARIANT 0 — broadside letterform
   * ============================================================ */
  const Broadside = () => {
    const hatchCount = 18;
    const hatches = Array.from({ length: hatchCount }, (_, i) => {
      const t = i / (hatchCount - 1);
      return 18 + t * 64;
    });
    const fleurons = [25, 50, 75];
    return (
      <g>
        {/* upper hatch band */}
        {hatches.map((x, i) => (
          <line
            key={`uh-${i}`}
            x1={x}
            y1={18}
            x2={x - 3}
            y2={28}
            stroke={INK}
            strokeWidth={i % 3 === 0 ? 0.35 : 0.18}
            opacity={0.5 + rolls[i % rolls.length] * 0.4}
          />
        ))}

        {/* title block */}
        <rect x="18" y="30" width="64" height="40" fill={BONE_DEEP} opacity="0.55" />
        <rect x="18" y="30" width="64" height="40" fill="none" stroke={INK} strokeWidth="0.3" />
        <line x1="18" y1="34" x2="82" y2="34" stroke={INK} strokeWidth="0.14" />
        <line x1="18" y1="66" x2="82" y2="66" stroke={INK} strokeWidth="0.14" />

        {/* the letterform */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontFamily="Fraunces, 'Times New Roman', serif"
          fontSize="38"
          fontStyle="italic"
          fontWeight="500"
          fill={accent}
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1, "wght" 500' }}
        >
          {letter}
        </text>
        <circle cx="64" cy="62" r="1.1" fill={accent} />

        {/* fleurons */}
        {fleurons.map((fx, i) => (
          <g key={`fl-${i}`} transform={`translate(${fx}, 76)`}>
            <circle r="0.6" fill={INK} />
            <line x1="-4" y1="0" x2="-1.2" y2="0" stroke={INK} strokeWidth="0.18" />
            <line x1="1.2" y1="0" x2="4" y2="0" stroke={INK} strokeWidth="0.18" />
          </g>
        ))}

        {/* lower hatch band */}
        {hatches.map((x, i) => (
          <line
            key={`lh-${i}`}
            x1={x}
            y1={82}
            x2={x + 3}
            y2={72}
            stroke={INK}
            strokeWidth={i % 4 === 0 ? 0.35 : 0.18}
            opacity={0.5 + rolls[(i * 3) % rolls.length] * 0.4}
          />
        ))}
      </g>
    );
  };

  /* ============================================================
   * VARIANT 1 — woodcut plate
   * ============================================================ */
  const Plate = () => {
    const rings = 6;
    const cx = 50;
    const cy = 50;
    const wedgeCount = 3 + Math.floor(rolls[0] * 4);
    const wedgeStart = Math.floor(rolls[1] * 360);
    return (
      <g>
        {/* concentric rings */}
        {Array.from({ length: rings }).map((_, i) => {
          const r = 6 + i * 5.2;
          const dash = i % 2 === 0 ? '1.2 1.2' : '0.4 1.4';
          return (
            <circle
              key={`r-${i}`}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={i === rings - 1 ? accent : INK}
              strokeWidth={i === 0 ? 0.45 : 0.2}
              strokeDasharray={dash}
              opacity={0.9 - i * 0.08}
            />
          );
        })}
        {/* pie wedges */}
        {Array.from({ length: wedgeCount }).map((_, i) => {
          const a1 = ((wedgeStart + i * (360 / wedgeCount)) * Math.PI) / 180;
          const a2 = a1 + ((360 / wedgeCount) * Math.PI) / 180 / 3;
          const rr = 26;
          const x1 = cx + Math.cos(a1) * rr;
          const y1 = cy + Math.sin(a1) * rr;
          const x2 = cx + Math.cos(a2) * rr;
          const y2 = cy + Math.sin(a2) * rr;
          return (
            <path
              key={`w-${i}`}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${rr} ${rr} 0 0 1 ${x2} ${y2} Z`}
              fill={i === 0 ? accent : INK}
              opacity={i === 0 ? 0.78 : 0.12}
            />
          );
        })}
        {/* crosshatch square — top-left */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`ch-${i}`}
            x1={14}
            y1={14 + i * 1.4}
            x2={24}
            y2={14 + i * 1.4}
            stroke={INK}
            strokeWidth="0.18"
            opacity="0.8"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`cv-${i}`}
            x1={14 + i * 1.1}
            y1={14}
            x2={14 + i * 1.1}
            y2={26}
            stroke={INK}
            strokeWidth="0.14"
            opacity="0.55"
          />
        ))}
        {/* dotted frame */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <circle
              key={`d-${i}`}
              cx={cx + Math.cos(a) * 38}
              cy={cy + Math.sin(a) * 38}
              r={i % 6 === 0 ? 0.75 : 0.32}
              fill={INK}
            />
          );
        })}
        {/* signature mark bottom-right */}
        <text
          x="82"
          y="86"
          textAnchor="end"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="2.4"
          letterSpacing="0.4"
          fill={INK_SOFT}
        >
          PL·{letter}
        </text>
      </g>
    );
  };

  /* ============================================================
   * VARIANT 2 — topographic chart
   * ============================================================ */
  const Chart = () => {
    const lines = 7;
    // generate deterministic wobbly contours
    const contour = (idx) => {
      const amp = 2 + rolls[idx % rolls.length] * 3;
      const freq = 0.08 + rolls[(idx + 2) % rolls.length] * 0.1;
      const base = 22 + idx * 8;
      const pts = [];
      for (let x = 14; x <= 86; x += 2) {
        const y =
          base +
          Math.sin(x * freq + idx * 0.7) * amp +
          Math.cos(x * freq * 0.4 + idx) * amp * 0.3;
        pts.push(`${x},${y}`);
      }
      return pts.join(' ');
    };
    return (
      <g>
        {/* contour lines */}
        {Array.from({ length: lines }).map((_, i) => (
          <polyline
            key={`c-${i}`}
            points={contour(i)}
            fill="none"
            stroke={i === 3 ? accent : INK}
            strokeWidth={i === 3 ? 0.4 : 0.22}
            opacity={i === 3 ? 0.9 : 0.55 + (i / lines) * 0.25}
          />
        ))}

        {/* elevation dots along middle contour */}
        {[22, 38, 54, 70].map((x, i) => (
          <g key={`e-${i}`} transform={`translate(${x}, 46)`}>
            <circle r="0.9" fill={accent} />
            <circle r="1.8" fill="none" stroke={accent} strokeWidth="0.15" />
            <text
              x="2.6"
              y="0.5"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="1.8"
              fill={INK_SOFT}
              letterSpacing="0.1"
            >
              {String(i + 1).padStart(2, '0')}
            </text>
          </g>
        ))}

        {/* tick rule down left edge */}
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={`t-${i}`}
            x1="10"
            y1={16 + i * 4.2}
            x2={i % 4 === 0 ? 13.5 : 11.6}
            y2={16 + i * 4.2}
            stroke={INK}
            strokeWidth={i % 4 === 0 ? 0.22 : 0.12}
          />
        ))}

        {/* compass rose — bottom right */}
        <g transform="translate(78, 78)">
          <circle r="6" fill="none" stroke={INK} strokeWidth="0.2" />
          <circle r="3.2" fill="none" stroke={INK} strokeWidth="0.14" />
          <path d="M 0 -5.6 L 1.1 0 L 0 5.6 L -1.1 0 Z" fill={INK} />
          <path d="M -5.6 0 L 0 1.1 L 5.6 0 L 0 -1.1 Z" fill={accent} />
          <circle r="0.5" fill={BONE} />
          <text
            x="0"
            y="-7.5"
            textAnchor="middle"
            fontFamily="IBM Plex Mono, monospace"
            fontSize="1.6"
            letterSpacing="0.1"
            fill={INK_SOFT}
          >
            N
          </text>
        </g>

        {/* chart title */}
        <text
          x="14"
          y="88"
          fontFamily="Fraunces, 'Times New Roman', serif"
          fontStyle="italic"
          fontSize="4"
          fill={INK}
        >
          fig. {letter.toLowerCase()}
        </text>
      </g>
    );
  };

  /* ============================================================
   * Render
   * ============================================================ */
  const handleDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const size = downloadResolution;
    canvas.width = size;
    canvas.height = size;
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.fillStyle = BONE;
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `fezcodex-plumb-${safeId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor: BONE }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
      >
        <defs>
          <filter id={`grain-${safeId}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.92"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix values="0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0 0.05 0 0 0 0.32 0" />
          </filter>
          <pattern
            id={`dots-${safeId}`}
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="0.4" cy="0.4" r="0.18" fill={INK} opacity="0.08" />
          </pattern>
        </defs>

        {/* paper */}
        <rect width="100" height="100" fill={BONE} />
        <rect width="100" height="100" fill={`url(#dots-${safeId})`} />

        {/* composition */}
        <EdgeRule />
        <Corners />
        {variant === 0 && <Broadside />}
        {variant === 1 && <Plate />}
        {variant === 2 && <Chart />}

        {/* grain overlay */}
        <rect
          width="100"
          height="100"
          filter={`url(#grain-${safeId})`}
          style={{ mixBlendMode: 'multiply' }}
          opacity="0.35"
        />
      </svg>

      {(showDownload || onRegenerate) && (
        <div className="absolute bottom-3 right-3 flex gap-2 items-center">
          {onRegenerate && (
            <>
              <div className="px-2.5 py-2 bg-[#F3ECE0]/90 text-[#1A1613] border border-[#1A161340] font-ibm-plex-mono text-[10px] tracking-[0.18em] uppercase backdrop-blur-md select-all">
                {seed}
              </div>
              <button
                onClick={onRegenerate}
                className="p-2.5 bg-[#F3ECE0]/90 hover:bg-[#1A1613] text-[#1A1613] hover:text-[#F3ECE0] transition-colors border border-[#1A161340] group/regen backdrop-blur-md"
                title="Regenerate plate"
                type="button"
              >
                <ArrowsClockwiseIcon
                  size={16}
                  weight="bold"
                  className="group-hover/regen:rotate-180 transition-transform duration-500"
                />
              </button>
            </>
          )}
          {showDownload && (
            <button
              onClick={handleDownload}
              className="p-2.5 bg-[#F3ECE0]/90 hover:bg-[#C96442] text-[#1A1613] hover:text-[#F3ECE0] transition-colors border border-[#1A161340] backdrop-blur-md"
              title="Download PNG"
              type="button"
            >
              <DownloadSimpleIcon size={16} weight="bold" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TerracottaGenerativeArt;
