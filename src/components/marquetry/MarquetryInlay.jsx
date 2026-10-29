import React, { useId } from 'react';
import { WOOD, VENEERS, seedNumber } from './wood';
import useMarquetryTextures from './useMarquetryTextures';

// Each fitted piece gets its own grain direction, as a cabinetmaker cuts it.
export const VeneerDefs = ({ id, textures }) => (
  <defs>
    {VENEERS.map((name, index) => (
      <pattern
        key={name}
        id={`${id}-${name}`}
        width="256"
        height="128"
        patternUnits="userSpaceOnUse"
        patternTransform={`rotate(${index % 2 ? 90 : 30 + index * 19})`}
      >
        <rect width="256" height="128" fill={WOOD[name]} />
        {textures[name] && (
          <image
            href={textures[name]}
            width="256"
            height="128"
            preserveAspectRatio="none"
          />
        )}
      </pattern>
    ))}
  </defs>
);

const rim = [
  [100, 4],
  [168, 32],
  [196, 100],
  [168, 168],
  [100, 196],
  [32, 168],
  [4, 100],
  [32, 32],
];
export default function MarquetryInlay({
  seed = 'fezcodex',
  size = 200,
  className = '',
  variant,
}) {
  const id = `mqt${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const textures = useMarquetryTextures();
  const hash = seedNumber(seed);
  const offset = hash % VENEERS.length;
  const kind =
    variant ||
    (seed === 'fezcodex'
      ? 'pinwheel'
      : ['pinwheel', 'diamond', 'chevron'][hash % 3]);
  let pieces;
  if (kind === 'chevron') {
    pieces = Array.from({ length: 7 }, (_, i) => ({
      points: `26,${36 + i * 20} 100,${i * 20} 174,${36 + i * 20} 174,${58 + i * 20} 100,${22 + i * 20} 26,${58 + i * 20}`,
      material: VENEERS[(i + offset) % VENEERS.length],
    }));
  } else if (kind === 'diamond') {
    pieces = Array.from({ length: 4 }, (_, i) => ({
      points: '100,8 192,100 100,100',
      transform: `rotate(${i * 90} 100 100)`,
      material: VENEERS[(i + offset) % VENEERS.length],
    })).concat(
      Array.from({ length: 4 }, (_, i) => ({
        points: '100,8 100,100 8,100',
        transform: `rotate(${i * 90} 100 100)`,
        material: VENEERS[(i + offset + 2) % VENEERS.length],
      })),
    );
  } else {
    pieces = rim.map((point, i) => ({
      points: `100,100 ${point.join(',')} ${rim[(i + 1) % rim.length].join(',')}`,
      material: VENEERS[(i + offset) % VENEERS.length],
    }));
  }
  return (
    <svg
      className={`mqt-inlay ${className}`}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <VeneerDefs id={id} textures={textures} />
      {pieces.map((piece, i) => (
        <polygon
          key={i}
          points={piece.points}
          transform={piece.transform}
          fill={`url(#${id}-${piece.material})`}
          stroke="#2d2118"
          strokeOpacity=".4"
          strokeWidth=".65"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export function MarquetryHen({ size = 100, className = '', thinking = false }) {
  const id = `hen${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const textures = useMarquetryTextures();
  const parts = [
    ['maple', '36,92 94,110 134,76 108,39 76,59'],
    ['walnut', '36,92 76,59 50,32 23,58'],
    ['teal', '23,58 22,13 50,32'],
    ['cherry', '22,13 13,58 23,58'],
    ['birch', '36,92 94,110 68,122'],
    ['bark', '76,59 108,39 88,92 36,92'],
    ['maple', '108,39 116,19 134,23 143,42 134,76'],
    ['cherry', '116,19 116,9 124,15 129,9 134,23'],
    ['birch', '134,23 150,36 143,42'],
    ['cherry', '143,42 139,54 134,46'],
  ];
  return (
    <svg
      className={`mqt-hen ${thinking ? 'mqt-hen-thinking' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 164 148"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <VeneerDefs id={id} textures={textures} />
      {parts.map(([name, points], i) => (
        <polygon
          key={i}
          points={points}
          fill={`url(#${id}-${name})`}
          stroke="#2d2118"
          strokeOpacity=".45"
          strokeWidth=".7"
        />
      ))}
      <circle cx="131" cy="31" r="2.4" fill={thinking ? WOOD.gold : WOOD.ink} />
      <path
        d="M72 121v14m-8 3 8-3 9 3m20-32v29m-8 3 8-3 9 3"
        stroke={WOOD.gold}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
