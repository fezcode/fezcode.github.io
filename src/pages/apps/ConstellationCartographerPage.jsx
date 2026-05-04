import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';

const CANVAS_W = 880;
const CANVAS_H = 620;
const FIELD_PADDING = 70;

const CONSTELLATIONS = [
  {
    id: 'ursa-major',
    name: 'Ursa Major',
    subtitle: 'The Great Bear · Septem Triones',
    epigraph:
      '"Septem stellae, currus caelestis quae circum polum aeternum vertuntur."',
    lore:
      'Seven stars that wheel forever about the pole. Sailors have long steered by Dubhe and Merak, the two pointers that aim toward Polaris. Mizar and its companion Alcor were once a test of eyesight for Roman legionaries.',
    starNames: [
      'Alkaid',
      'Mizar',
      'Alioth',
      'Megrez',
      'Phecda',
      'Merak',
      'Dubhe',
    ],
    stars: [
      { x: -0.95, y: 0.32 },
      { x: -0.55, y: 0.18 },
      { x: -0.18, y: 0.06 },
      { x: 0.08, y: -0.05 },
      { x: 0.36, y: 0.22 },
      { x: 0.42, y: -0.32 },
      { x: 0.85, y: -0.5 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 5],
      [5, 6],
      [3, 4],
      [4, 5],
    ],
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    subtitle: 'The Vain Queen',
    epigraph: '"Solium reginae vana superbia damnatae."',
    lore:
      'A queen of Aethiopia, bound by Poseidon to her throne and condemned to circle the pole forever as punishment for vanity. Her five brightest stars trace a great W against the polar dark.',
    starNames: ['Caph', 'Schedar', 'Gamma Cas.', 'Ruchbah', 'Segin'],
    stars: [
      { x: -0.9, y: 0.35 },
      { x: -0.4, y: -0.12 },
      { x: 0.0, y: 0.42 },
      { x: 0.45, y: -0.05 },
      { x: 0.9, y: 0.38 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    id: 'orion',
    name: 'Orion',
    subtitle: 'The Hunter · Bellator Caelestis',
    epigraph: '"Cingulum trium stellarum aequatorem dividit."',
    lore:
      'The hunter of the heavens, eternally pursued by the scorpion. His belt of three stars — Mintaka, Alnilam, and Alnitak — marks the celestial equator and guides ships in both hemispheres.',
    starNames: [
      'Betelgeuse',
      'Bellatrix',
      'Mintaka',
      'Alnilam',
      'Alnitak',
      'Saiph',
      'Rigel',
    ],
    stars: [
      { x: -0.55, y: -0.78 },
      { x: 0.5, y: -0.72 },
      { x: -0.32, y: 0.0 },
      { x: 0.0, y: 0.05 },
      { x: 0.32, y: 0.1 },
      { x: -0.7, y: 0.7 },
      { x: 0.72, y: 0.78 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
    ],
  },
  {
    id: 'lyra',
    name: 'Lyra',
    subtitle: 'The Lyre of Orpheus',
    epigraph: '"Cithara Orphei a Iove inter astra collocata."',
    lore:
      'The lyre of Orpheus, lifted into the heavens by Apollo after the bard\'s death. Vega — the brightest of its strings — is one of the closest bright stars to Earth, blazing fierce and blue.',
    starNames: ['Vega', 'Sheliak', 'Zeta Lyrae', 'Sulafat', 'Delta Lyrae'],
    stars: [
      { x: 0.0, y: -0.7 },
      { x: -0.5, y: -0.1 },
      { x: 0.5, y: -0.1 },
      { x: -0.5, y: 0.62 },
      { x: 0.5, y: 0.62 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
    ],
  },
  {
    id: 'cygnus',
    name: 'Cygnus',
    subtitle: 'The Swan · Crux Septentrionalis',
    epigraph: '"Cycnus per Viam Lacteam volans."',
    lore:
      'A swan in flight along the Milky Way, also known as the Northern Cross. Deneb, brightest of its tail, is among the most luminous stars visible from Earth — a supergiant some sixty thousand times brighter than the Sun.',
    starNames: ['Deneb', 'Sadr', 'Gienah', 'Delta Cyg.', 'Albireo'],
    stars: [
      { x: 0.0, y: -0.82 },
      { x: 0.0, y: -0.1 },
      { x: -0.72, y: 0.02 },
      { x: 0.72, y: 0.1 },
      { x: 0.0, y: 0.78 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
  },
];

const NUM_NOISE_STARS = 65;

const PHASE = {
  IDLE: 'idle',
  PLAYING: 'playing',
  COMPLETE: 'complete',
};

const SCALE_X = (CANVAS_W - FIELD_PADDING * 2) / 2;
const SCALE_Y = (CANVAS_H - FIELD_PADDING * 2) / 2;

const placeStar = (s) => ({
  x: CANVAS_W / 2 + s.x * SCALE_X,
  y: CANVAS_H / 2 + s.y * SCALE_Y,
});

const edgeKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);

const seededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const generateNoiseStars = (constellation, seed) => {
  const rand = seededRandom(seed);
  const noise = [];
  const constellationPositions = constellation.stars.map(placeStar);
  const minDistance = 26;
  let attempts = 0;
  while (noise.length < NUM_NOISE_STARS && attempts < 1500) {
    attempts += 1;
    const x = FIELD_PADDING + rand() * (CANVAS_W - FIELD_PADDING * 2);
    const y = FIELD_PADDING + rand() * (CANVAS_H - FIELD_PADDING * 2);
    const tooClose = [
      ...constellationPositions,
      ...noise.map((n) => ({ x: n.x, y: n.y })),
    ].some((p) => Math.hypot(p.x - x, p.y - y) < minDistance);
    if (tooClose) continue;
    noise.push({
      x,
      y,
      brightness: 0.25 + rand() * 0.55,
      twinkleOffset: rand() * Math.PI * 2,
      twinkleSpeed: 0.5 + rand() * 1.6,
      size: 0.6 + rand() * 1.1,
    });
  }
  return noise;
};

const formatRA = (x) => {
  const totalSeconds = (x / CANVAS_W) * 24 * 60 * 60;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
};

const formatDec = (y) => {
  const deg = ((y / CANVAS_H) * -180 + 90).toFixed(1);
  return `${deg >= 0 ? '+' : ''}${deg}°`;
};

const CompassRose = ({ size = 88, className = '' }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="cr-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(212, 175, 55, 0.18)" />
        <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#cr-grad)" />
    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
    <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      const x1 = 50 + Math.cos(rad) * 8;
      const y1 = 50 + Math.sin(rad) * 8;
      const x2 = 50 + Math.cos(rad) * 44;
      const y2 = 50 + Math.sin(rad) * 44;
      return (
        <line
          key={deg}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth={deg % 90 === 0 ? '0.8' : '0.35'}
          opacity={deg % 90 === 0 ? 0.85 : 0.4}
        />
      );
    })}
    {/* North fleur */}
    <path
      d="M50 6 L46 28 L50 24 L54 28 Z"
      fill="currentColor"
      opacity="0.9"
    />
    <text
      x="50"
      y="14"
      textAnchor="middle"
      fontSize="6"
      fontFamily="Cardo, serif"
      fill="currentColor"
      opacity="0.85"
    >
      N
    </text>
    <text x="92" y="52" textAnchor="middle" fontSize="5" fontFamily="Cardo, serif" fill="currentColor" opacity="0.65">E</text>
    <text x="50" y="96" textAnchor="middle" fontSize="5" fontFamily="Cardo, serif" fill="currentColor" opacity="0.65">S</text>
    <text x="8" y="52" textAnchor="middle" fontSize="5" fontFamily="Cardo, serif" fill="currentColor" opacity="0.65">W</text>
    <circle cx="50" cy="50" r="2" fill="currentColor" />
  </svg>
);

const SextantArc = ({ className = '' }) => (
  <svg viewBox="0 0 200 80" className={className} fill="none" aria-hidden="true">
    <path
      d="M10 70 A 90 90 0 0 1 190 70"
      stroke="currentColor"
      strokeWidth="0.6"
      opacity="0.5"
    />
    <path
      d="M20 70 A 80 80 0 0 1 180 70"
      stroke="currentColor"
      strokeWidth="0.4"
      opacity="0.35"
    />
    {Array.from({ length: 19 }).map((_, i) => {
      const angle = Math.PI - (i / 18) * Math.PI;
      const r1 = 80;
      const r2 = i % 3 === 0 ? 90 : 84;
      const cx = 100;
      const cy = 70;
      const x1 = cx + Math.cos(angle) * r1;
      const y1 = cy - Math.sin(angle) * r1;
      const x2 = cx + Math.cos(angle) * r2;
      const y2 = cy - Math.sin(angle) * r2;
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth={i % 3 === 0 ? '0.55' : '0.3'}
          opacity={i % 3 === 0 ? 0.7 : 0.4}
        />
      );
    })}
  </svg>
);

const MiniConstellation = ({ stars, edges, size = 96 }) => {
  const minX = Math.min(...stars.map((s) => s.x));
  const maxX = Math.max(...stars.map((s) => s.x));
  const minY = Math.min(...stars.map((s) => s.y));
  const maxY = Math.max(...stars.map((s) => s.y));
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const pad = 0.18;
  const points = stars.map((s) => ({
    x: ((s.x - minX) / w) * (1 - pad * 2) + pad,
    y: ((s.y - minY) / h) * (1 - pad * 2) + pad,
  }));
  return (
    <svg
      viewBox="0 0 1 1"
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a].x}
          y1={points[a].y}
          x2={points[b].x}
          y2={points[b].y}
          stroke="rgba(212, 175, 55, 0.55)"
          strokeWidth="0.012"
          strokeLinecap="round"
        />
      ))}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="0.025"
          fill="#fff8d5"
        />
      ))}
    </svg>
  );
};

const ConstellationCartographerPage = () => {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedEdges, setCompletedEdges] = useState(new Set());
  const [completedConstellations, setCompletedConstellations] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [hintActive, setHintActive] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [errorEdge, setErrorEdge] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000));

  const constellation = CONSTELLATIONS[currentIdx];

  const noiseStars = useMemo(
    () => generateNoiseStars(constellation, seed + currentIdx * 137),
    [constellation, seed, currentIdx],
  );

  const constellationStars = useMemo(
    () => constellation.stars.map(placeStar),
    [constellation],
  );

  const allStars = useMemo(
    () => [
      ...constellationStars.map((p, i) => ({
        ...p,
        constIdx: i,
        size: 1.6,
      })),
      ...noiseStars.map((s) => ({ ...s, constIdx: null })),
    ],
    [constellationStars, noiseStars],
  );

  const requiredEdgeKeys = useMemo(
    () => new Set(constellation.edges.map(([a, b]) => edgeKey(a, b))),
    [constellation],
  );

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let frame;
    let start = performance.now();

    const draw = (now) => {
      const t = (now - start) / 1000;

      // Background gradient
      const bg = ctx.createRadialGradient(
        CANVAS_W / 2,
        CANVAS_H / 2,
        100,
        CANVAS_W / 2,
        CANVAS_H / 2,
        Math.max(CANVAS_W, CANVAS_H) * 0.7,
      );
      bg.addColorStop(0, '#142035');
      bg.addColorStop(0.6, '#0c1729');
      bg.addColorStop(1, '#070d1c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Faint nebula wash
      const wash = ctx.createRadialGradient(
        CANVAS_W * 0.25,
        CANVAS_H * 0.7,
        20,
        CANVAS_W * 0.25,
        CANVAS_H * 0.7,
        420,
      );
      wash.addColorStop(0, 'rgba(120, 90, 180, 0.10)');
      wash.addColorStop(1, 'rgba(120, 90, 180, 0)');
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const wash2 = ctx.createRadialGradient(
        CANVAS_W * 0.78,
        CANVAS_H * 0.25,
        20,
        CANVAS_W * 0.78,
        CANVAS_H * 0.25,
        380,
      );
      wash2.addColorStop(0, 'rgba(190, 120, 80, 0.08)');
      wash2.addColorStop(1, 'rgba(190, 120, 80, 0)');
      ctx.fillStyle = wash2;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Border ornament
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 8, CANVAS_W - 16, CANVAS_H - 16);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
      ctx.strokeRect(18, 18, CANVAS_W - 36, CANVAS_H - 36);

      // Hint outline (faint, when hint is active)
      if (hintActive && phase === PHASE.PLAYING) {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        constellation.edges.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(constellationStars[a].x, constellationStars[a].y);
          ctx.lineTo(constellationStars[b].x, constellationStars[b].y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
      }

      // Completed edges (gold)
      const allEdgesDone =
        completedEdges.size === requiredEdgeKeys.size &&
        requiredEdgeKeys.size > 0;
      constellation.edges.forEach(([a, b]) => {
        const key = edgeKey(a, b);
        if (!completedEdges.has(key)) return;
        const p1 = constellationStars[a];
        const p2 = constellationStars[b];
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, 'rgba(212, 175, 55, 0.95)');
        grad.addColorStop(0.5, 'rgba(255, 232, 150, 1)');
        grad.addColorStop(1, 'rgba(212, 175, 55, 0.95)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = allEdgesDone ? 2 : 1.6;
        ctx.shadowColor = 'rgba(255, 215, 100, 0.85)';
        ctx.shadowBlur = allEdgesDone ? 14 : 8;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Error edge (red flash)
      if (errorEdge) {
        const age = (now - errorEdge.time) / 600;
        if (age < 1) {
          const p1 = allStars[errorEdge.a];
          const p2 = allStars[errorEdge.b];
          ctx.strokeStyle = `rgba(196, 69, 42, ${1 - age})`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Pending line from selected star to cursor
      if (selectedStar != null && phase === PHASE.PLAYING) {
        const p1 = allStars[selectedStar];
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(hoverPos.x, hoverPos.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Stars
      allStars.forEach((s, i) => {
        const twinkle =
          0.7 +
          0.3 *
            Math.sin(
              t * (s.twinkleSpeed || 1) + (s.twinkleOffset || i * 0.4),
            );
        const isConst = s.constIdx != null;
        const baseSize = isConst ? 2.2 : (s.size || 1) * 1.2;
        const size = baseSize * (0.85 + 0.25 * twinkle);
        const isSelected = selectedStar === i;
        const isInCompletedEdge =
          isConst &&
          [...completedEdges].some((k) =>
            k.split('-').includes(String(s.constIdx)),
          );

        // Glow halo for constellation stars when complete
        if (isConst && (isInCompletedEdge || allEdgesDone)) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 18);
          glow.addColorStop(0, 'rgba(255, 232, 150, 0.55)');
          glow.addColorStop(0.5, 'rgba(212, 175, 55, 0.18)');
          glow.addColorStop(1, 'rgba(212, 175, 55, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star body
        const baseColor = isInCompletedEdge || allEdgesDone
          ? '#fff0b8'
          : isConst
            ? '#fff8d5'
            : '#e6dfbe';
        ctx.fillStyle = baseColor;
        const haloAlpha = isConst ? 0.5 : 0.25;
        ctx.shadowColor = `rgba(255, 240, 200, ${haloAlpha * twinkle})`;
        ctx.shadowBlur = isConst ? 6 : 3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Selected ring
        if (isSelected) {
          const pulse = 0.6 + 0.4 * Math.sin(t * 6);
          ctx.strokeStyle = `rgba(255, 215, 100, ${0.5 + 0.5 * pulse})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(s.x, s.y, size + 5 + pulse * 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Star labels for completed constellation
        if (revealed && isConst && constellation.starNames[s.constIdx]) {
          ctx.fillStyle = 'rgba(212, 175, 55, 0.75)';
          ctx.font = 'italic 10px Cardo, serif';
          ctx.textAlign = 'left';
          ctx.fillText(constellation.starNames[s.constIdx], s.x + 8, s.y - 6);
        }
      });

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [
    constellation,
    constellationStars,
    allStars,
    completedEdges,
    requiredEdgeKeys,
    selectedStar,
    hoverPos,
    hintActive,
    errorEdge,
    phase,
    revealed,
  ]);

  const findNearestStar = (x, y) => {
    let nearest = -1;
    let nearestDist = Infinity;
    allStars.forEach((s, i) => {
      const d = Math.hypot(s.x - x, s.y - y);
      if (d < nearestDist && d < 16) {
        nearest = i;
        nearestDist = d;
      }
    });
    return nearest === -1 ? null : nearest;
  };

  const canvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerMove = (e) => {
    const c = canvasCoords(e);
    setHoverPos(c);
  };

  const handleClick = (e) => {
    if (phase !== PHASE.PLAYING) return;
    const c = canvasCoords(e);
    const idx = findNearestStar(c.x, c.y);
    if (idx == null) {
      setSelectedStar(null);
      return;
    }
    if (selectedStar == null) {
      setSelectedStar(idx);
      return;
    }
    if (selectedStar === idx) {
      setSelectedStar(null);
      return;
    }
    setAttempts((a) => a + 1);
    const a = allStars[selectedStar];
    const b = allStars[idx];
    if (a.constIdx == null || b.constIdx == null) {
      setErrorEdge({ a: selectedStar, b: idx, time: performance.now() });
      setErrors((e2) => e2 + 1);
      setSelectedStar(null);
      return;
    }
    const key = edgeKey(a.constIdx, b.constIdx);
    if (requiredEdgeKeys.has(key) && !completedEdges.has(key)) {
      const next = new Set(completedEdges);
      next.add(key);
      setCompletedEdges(next);
      setSelectedStar(idx);
      if (next.size === requiredEdgeKeys.size) {
        setRevealed(true);
        setSelectedStar(null);
      }
    } else {
      setErrorEdge({ a: selectedStar, b: idx, time: performance.now() });
      setErrors((e2) => e2 + 1);
      setSelectedStar(null);
    }
  };

  const startGame = useCallback(() => {
    setPhase(PHASE.PLAYING);
    setCurrentIdx(0);
    setCompletedEdges(new Set());
    setCompletedConstellations([]);
    setSelectedStar(null);
    setHintActive(false);
    setRevealed(false);
    setErrors(0);
    setAttempts(0);
    setSeed(Math.floor(Math.random() * 100000));
  }, []);

  const advanceConstellation = useCallback(() => {
    const summary = {
      id: constellation.id,
      name: constellation.name,
      attempts,
      errors,
    };
    setCompletedConstellations((prev) => [...prev, summary]);
    if (currentIdx + 1 >= CONSTELLATIONS.length) {
      setPhase(PHASE.COMPLETE);
    } else {
      setCurrentIdx((i) => i + 1);
      setCompletedEdges(new Set());
      setSelectedStar(null);
      setHintActive(false);
      setRevealed(false);
      setAttempts(0);
      setErrors(0);
    }
  }, [constellation, attempts, errors, currentIdx]);

  // Google fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Italiana&family=Cardo:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const progress = completedEdges.size;
  const total = requiredEdgeKeys.size;
  const folioOrdinal = ['I', 'II', 'III', 'IV', 'V'][currentIdx];

  return (
    <div className="cartographer-root relative min-h-screen text-[#e6dfbe] overflow-hidden">
      <Seo
        title="Constellation Cartographer | Fezcodex"
        description="An atlas of celestial mechanics. Trace constellations on the night sky in the manner of the 1660 Cellarius Harmonia Macrocosmica."
        keywords={[
          'constellation',
          'cartographer',
          'astronomy',
          'star chart',
          'puzzle',
          'celestial atlas',
          'cellarius',
        ]}
      />

      <style>{`
        .cartographer-root {
          background:
            radial-gradient(ellipse at 14% 10%, rgba(212, 175, 55, 0.06), transparent 35%),
            radial-gradient(ellipse at 88% 90%, rgba(120, 90, 180, 0.08), transparent 40%),
            #060c1a;
          font-family: 'Cardo', 'EB Garamond', Georgia, serif;
        }
        .stars-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            radial-gradient(1px 1px at 14% 22%, rgba(255, 248, 213, 0.85), transparent 50%),
            radial-gradient(1px 1px at 28% 67%, rgba(255, 248, 213, 0.7), transparent 50%),
            radial-gradient(1.5px 1.5px at 47% 32%, rgba(255, 240, 184, 0.9), transparent 50%),
            radial-gradient(1px 1px at 64% 78%, rgba(255, 248, 213, 0.6), transparent 50%),
            radial-gradient(1px 1px at 82% 18%, rgba(255, 248, 213, 0.85), transparent 50%),
            radial-gradient(1px 1px at 92% 52%, rgba(255, 248, 213, 0.5), transparent 50%),
            radial-gradient(1px 1px at 8% 84%, rgba(255, 248, 213, 0.7), transparent 50%),
            radial-gradient(1.5px 1.5px at 36% 6%, rgba(255, 240, 184, 0.6), transparent 50%);
        }
        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.85 0 0 0 0 0.7 0 0 0 0 0.4 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          opacity: 0.045;
          mix-blend-mode: overlay;
        }
        @keyframes shooting-star {
          0% { transform: translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translate(-280px, 140px); opacity: 0; }
        }
        .shooting-star {
          position: fixed; pointer-events: none; z-index: 0;
          width: 2px; height: 2px;
          background: #fff8d5;
          border-radius: 50%;
          box-shadow: 0 0 8px 1px #fff8d5, 0 0 24px 6px rgba(255, 248, 213, 0.6);
          animation: shooting-star 6s ease-in-out infinite;
        }
        .shooting-star::after {
          content: ''; position: absolute; right: 100%; top: 50%;
          width: 80px; height: 1px;
          background: linear-gradient(to left, rgba(255, 248, 213, 0.7), transparent);
          transform: translateY(-50%);
        }

        .display-font {
          font-family: 'Italiana', 'Cardo', serif;
          letter-spacing: 0.005em;
        }
        .body-font { font-family: 'Cardo', 'EB Garamond', Georgia, serif; }
        .mono-font {
          font-family: 'DM Mono', 'JetBrains Mono', monospace;
          letter-spacing: 0.28em;
        }

        .gold-text {
          background: linear-gradient(180deg, #f3dc8f 0%, #c9a35e 55%, #8a6534 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .running-header {
          position: fixed; top: 1.1rem; left: 50%; transform: translateX(-50%);
          z-index: 5;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.42em;
          color: rgba(212, 175, 55, 0.55);
          text-transform: uppercase;
        }
        .folio-mark-l {
          position: fixed; top: 1.1rem; left: 1.5rem;
          z-index: 5;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.32em;
          color: rgba(212, 175, 55, 0.55);
          text-transform: uppercase;
        }
        .corner-glyph {
          position: fixed; top: 1rem; right: 1.5rem;
          z-index: 5;
          color: rgba(212, 175, 55, 0.7);
        }

        .gold-rule {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5) 20%, rgba(212, 175, 55, 0.7) 50%, rgba(212, 175, 55, 0.5) 80%, transparent);
        }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: reveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) backwards; }

        .atlas-frame {
          position: relative;
          padding: 14px;
          background: rgba(7, 13, 28, 0.6);
          border: 1px solid rgba(212, 175, 55, 0.35);
          box-shadow:
            inset 0 0 0 1px rgba(212, 175, 55, 0.08),
            0 30px 60px -20px rgba(0, 0, 0, 0.7);
        }
        .atlas-frame::before, .atlas-frame::after,
        .atlas-frame > .af-tr, .atlas-frame > .af-br {
          content: ''; position: absolute; width: 24px; height: 24px;
          border: 1px solid rgba(212, 175, 55, 0.6);
          pointer-events: none;
        }
        .atlas-frame::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
        .atlas-frame::after { bottom: -1px; left: -1px; border-right: 0; border-top: 0; }
        .atlas-frame > .af-tr { top: -1px; right: -1px; border-left: 0; border-bottom: 0; }
        .atlas-frame > .af-br { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

        .progress-pip {
          width: 10px; height: 10px;
          transform: rotate(45deg);
          background: transparent;
          border: 1px solid rgba(212, 175, 55, 0.5);
          transition: all 0.3s ease;
        }
        .progress-pip.filled {
          background: #d4af37;
          box-shadow: 0 0 10px rgba(255, 215, 100, 0.6);
        }
        .progress-pip.current {
          border-color: #ffd866;
          background: rgba(255, 215, 100, 0.2);
        }

        .start-cta, .next-cta {
          position: relative;
          display: inline-flex; align-items: center; gap: 1rem;
          padding: 1.1rem 2.2rem;
          background: linear-gradient(180deg, rgba(20, 16, 8, 0.7), rgba(7, 13, 28, 0.7));
          border: 1px solid rgba(212, 175, 55, 0.6);
          color: #f3dc8f;
          font-family: 'Italiana', serif;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.4s ease;
        }
        .start-cta:hover, .next-cta:hover {
          color: #fff5cc;
          border-color: rgba(255, 215, 100, 0.9);
          background: linear-gradient(180deg, rgba(40, 30, 12, 0.8), rgba(20, 16, 8, 0.8));
          box-shadow: 0 0 32px rgba(255, 215, 100, 0.18);
        }

        .ghost-btn {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.65);
          padding: 0.5rem 1rem;
          border: 1px dashed rgba(212, 175, 55, 0.35);
          background: transparent;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .ghost-btn:hover {
          color: #ffd866;
          border-color: rgba(212, 175, 55, 0.7);
          border-style: solid;
          background: rgba(212, 175, 55, 0.05);
        }

        .lore-card {
          background:
            radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.05), transparent 60%),
            rgba(243, 231, 200, 0.04);
          border: 1px solid rgba(212, 175, 55, 0.4);
          padding: 1.5rem 1.75rem;
          position: relative;
        }

        .stat-num {
          font-family: 'Italiana', serif;
          font-size: 2.4rem;
          line-height: 1;
          color: #f3dc8f;
        }

        canvas { cursor: crosshair; touch-action: none; }
      `}</style>

      <div className="stars-bg" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div
        className="shooting-star"
        style={{ top: '15%', left: '85%', animationDelay: '0s' }}
      />
      <div
        className="shooting-star"
        style={{ top: '45%', left: '95%', animationDelay: '3.2s' }}
      />
      <div
        className="shooting-star"
        style={{ top: '72%', left: '88%', animationDelay: '6.5s' }}
      />

      <div className="folio-mark-l">FOL. {folioOrdinal} · CAELORUM</div>
      <div className="running-header">
        ⁘ Atlas Coelestis Stellatorum ⁘
      </div>
      <div className="corner-glyph">
        <CompassRose size={40} className="text-[#d4af37]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-24 pb-16 md:px-12">
        <Link
          to="/apps"
          className="inline-flex items-center gap-2 mb-10 mono-font text-[10px] text-[#d4af37]/70 hover:text-[#ffd866] transition-colors uppercase"
        >
          <ArrowLeftIcon weight="bold" size={11} />
          <span>Return to Apps</span>
        </Link>

        <header className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 items-end">
            <div className="lg:col-span-8 space-y-5">
              <div
                className="reveal mono-font text-[10px] text-[#d4af37]/80"
                style={{ animationDelay: '0.05s' }}
              >
                Tabula I · Harmonia Macrocosmica · Anno MMXXVI
              </div>
              <h1
                className="display-font reveal leading-[0.92]"
                style={{ animationDelay: '0.15s' }}
              >
                <span className="block text-[clamp(3rem,7vw,6.5rem)] gold-text italic">
                  Constellation
                </span>
                <span className="block text-[clamp(3rem,7vw,6.5rem)] text-[#e6dfbe] -mt-1">
                  Cartographer
                </span>
              </h1>
              <p
                className="reveal body-font italic text-lg md:text-xl text-[#e6dfbe]/75 max-w-2xl leading-relaxed"
                style={{ animationDelay: '0.3s' }}
              >
                An atlas of celestial mechanics. Find each constellation hidden
                amongst the stars and trace its lines in gold leaf, in the
                manner of Cellarius and his Harmonia Macrocosmica.
              </p>
              <div
                className="reveal flex items-center gap-4 max-w-md"
                style={{ animationDelay: '0.4s' }}
              >
                <span className="mono-font text-[9px] text-[#d4af37]/70 whitespace-nowrap">
                  V folios · gold leaf on midnight
                </span>
                <span className="flex-1 gold-rule" />
              </div>
            </div>

            <div
              className="lg:col-span-4 reveal flex justify-start lg:justify-end"
              style={{ animationDelay: '0.5s' }}
            >
              <SextantArc className="w-64 h-24 text-[#d4af37]" />
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10">
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-4">
                <span className="mono-font text-[10px] text-[#d4af37]/70">
                  FOLIO {folioOrdinal} OF V
                </span>
                <span className="display-font italic text-2xl text-[#f3dc8f]">
                  {phase === PHASE.IDLE ? 'Awaiting opening of the atlas' : constellation.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {CONSTELLATIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`progress-pip ${i < currentIdx ? 'filled' : ''} ${i === currentIdx && phase !== PHASE.IDLE ? 'current' : ''}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>

            <div className="atlas-frame">
              <span className="af-tr" />
              <span className="af-br" />
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  onClick={handleClick}
                  onPointerMove={handlePointerMove}
                  className="block w-full h-auto"
                  style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
                />

                <div className="absolute top-4 left-4 mono-font text-[9px] text-[#d4af37]/50 pointer-events-none">
                  RA {formatRA(hoverPos.x)} · DEC {formatDec(hoverPos.y)}
                </div>
                <div className="absolute top-4 right-4 mono-font text-[9px] text-[#d4af37]/50 pointer-events-none text-right">
                  EDGES {progress.toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}
                </div>

                <AnimatePresence>
                  {phase === PHASE.IDLE && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, rgba(7, 13, 28, 0.7), rgba(7, 13, 28, 0.92))',
                      }}
                    >
                      <div className="text-center space-y-7 px-6 max-w-lg">
                        <div className="mono-font text-[10px] text-[#d4af37]/70 tracking-[0.5em]">
                          ⁘ TABULA STELLARUM ⁘
                        </div>
                        <div className="display-font italic text-4xl md:text-5xl gold-text leading-tight">
                          Open the Atlas
                        </div>
                        <div className="body-font italic text-base text-[#e6dfbe]/70 max-w-md mx-auto">
                          Five folios await charting. Click two stars to draw a
                          line between them. Lines that follow the canonical
                          pattern lock in gold; errant strokes fade.
                        </div>
                        <button
                          type="button"
                          onClick={startGame}
                          className="start-cta"
                        >
                          <span>Begin the Charting</span>
                          <span style={{ fontSize: '1rem' }}>✦</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {phase === PHASE.PLAYING && revealed && (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
                    >
                      <button
                        type="button"
                        onClick={advanceConstellation}
                        className="next-cta"
                      >
                        <span>
                          {currentIdx + 1 >= CONSTELLATIONS.length
                            ? 'Close the Atlas'
                            : 'Continue to next folio'}
                        </span>
                        <span>→</span>
                      </button>
                    </motion.div>
                  )}

                  {phase === PHASE.COMPLETE && (
                    <motion.div
                      key="complete"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center p-6"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, rgba(7, 13, 28, 0.85), rgba(7, 13, 28, 0.97))',
                      }}
                    >
                      <div className="lore-card max-w-xl text-center space-y-5">
                        <div className="mono-font text-[10px] text-[#d4af37]/70 tracking-[0.5em]">
                          ⁘ ATLAS COMPLETUS ⁘
                        </div>
                        <div className="display-font italic text-4xl gold-text">
                          The heavens are charted.
                        </div>
                        <div className="body-font italic text-base text-[#e6dfbe]/75">
                          Five folios completed. The night sky surrenders its
                          secrets to the patient cartographer.
                        </div>
                        <div className="gold-rule" />
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div>
                            <div className="mono-font text-[9px] text-[#d4af37]/60">FOLIOS</div>
                            <div className="stat-num">V</div>
                          </div>
                          <div>
                            <div className="mono-font text-[9px] text-[#d4af37]/60">EDGES</div>
                            <div className="stat-num">
                              {CONSTELLATIONS.reduce(
                                (n, c) => n + c.edges.length,
                                0,
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="mono-font text-[9px] text-[#d4af37]/60">ERRORS</div>
                            <div className="stat-num">
                              {completedConstellations.reduce(
                                (n, c) => n + c.errors,
                                0,
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={startGame}
                          className="start-cta mt-3"
                        >
                          <span>Open Anew</span>
                          <span>✦</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="ghost-btn"
                  disabled={phase !== PHASE.PLAYING}
                  onClick={() => setHintActive((h) => !h)}
                  style={{ opacity: phase !== PHASE.PLAYING ? 0.3 : 1 }}
                >
                  {hintActive ? '⌁ Conceal Pattern' : '⌁ Reveal Pattern'}
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  disabled={phase !== PHASE.PLAYING}
                  onClick={() => {
                    setCompletedEdges(new Set());
                    setSelectedStar(null);
                    setRevealed(false);
                    setAttempts(0);
                    setErrors(0);
                  }}
                  style={{ opacity: phase !== PHASE.PLAYING ? 0.3 : 1 }}
                >
                  ⟲ Erase Strokes
                </button>
              </div>
              <div className="mono-font text-[9px] text-[#d4af37]/50">
                Click two stars to draw an edge.
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-6">
            <div className="lore-card space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mono-font text-[9px] text-[#d4af37]/60">
                    HOC FOLIO
                  </div>
                  <div className="display-font italic text-3xl gold-text leading-tight">
                    {constellation.name}
                  </div>
                  <div className="body-font italic text-sm text-[#e6dfbe]/70 mt-1">
                    {constellation.subtitle}
                  </div>
                </div>
                <div className="shrink-0 text-[#d4af37]">
                  <MiniConstellation
                    stars={constellation.stars}
                    edges={constellation.edges}
                    size={84}
                  />
                </div>
              </div>

              <div className="gold-rule opacity-60" />

              <p className="body-font italic text-sm text-[#e6dfbe]/65 leading-relaxed">
                {constellation.epigraph}
              </p>

              {revealed ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-3 pt-1"
                >
                  <div className="mono-font text-[9px] text-[#d4af37]/70">
                    ⁘ LORE UNCHAINED ⁘
                  </div>
                  <p className="body-font text-sm text-[#e6dfbe]/85 leading-relaxed">
                    {constellation.lore}
                  </p>
                </motion.div>
              ) : (
                <p className="body-font italic text-sm text-[#e6dfbe]/40 leading-relaxed">
                  Lore concealed until the pattern is traced in full.
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="mono-font text-[9px] text-[#d4af37]/60">EDGES</div>
                <div className="stat-num">
                  {progress}<span className="text-[#d4af37]/40">/{total}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="mono-font text-[9px] text-[#d4af37]/60">STROKES</div>
                <div className="stat-num">{attempts}</div>
              </div>
              <div className="text-center">
                <div className="mono-font text-[9px] text-[#d4af37]/60">ERRANT</div>
                <div className="stat-num" style={{ color: errors > 0 ? '#c4452a' : undefined }}>
                  {errors}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h3 className="display-font italic text-xl text-[#e6dfbe]">Folios Charted</h3>
                <span className="mono-font text-[9px] text-[#d4af37]/60">
                  {completedConstellations.length} / {CONSTELLATIONS.length}
                </span>
              </div>
              <div className="gold-rule opacity-60" />
              <div className="space-y-2 pt-1">
                {CONSTELLATIONS.map((c, i) => {
                  const done = completedConstellations.find((cc) => cc.id === c.id);
                  const isCurrent = i === currentIdx && phase === PHASE.PLAYING;
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`mono-font text-[10px] ${
                            done
                              ? 'text-[#d4af37]'
                              : isCurrent
                                ? 'text-[#ffd866]'
                                : 'text-[#d4af37]/30'
                          }`}
                        >
                          {['I', 'II', 'III', 'IV', 'V'][i]}
                        </span>
                        <span
                          className={`body-font italic ${
                            done
                              ? 'text-[#e6dfbe]/85'
                              : isCurrent
                                ? 'text-[#ffd866]'
                                : 'text-[#e6dfbe]/35'
                          }`}
                        >
                          {c.name}
                        </span>
                      </div>
                      {done && (
                        <span className="mono-font text-[9px] text-[#d4af37]/60">
                          {done.errors === 0 ? 'PERFECT' : `${done.errors} errant`}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </main>

        <footer className="mt-24 pt-8 border-t border-[#d4af37]/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="mono-font text-[9px] text-[#d4af37]/55">
            ⁘ Tabulae caelestes · Lordran-on-Sea · MMXXVI ⁘
          </div>
          <div className="mono-font text-[9px] text-[#d4af37]/50">
            After Andreas Cellarius, 1660
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ConstellationCartographerPage;
