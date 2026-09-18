import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import piml from 'piml';
import Seo from '../components/Seo';
import { version } from '../version';
import { vocabulary } from '../data/vocabulary';
import {
  fetchLogCategories,
  fetchLogsForCategories,
} from '../utils/logCategories';

// ---------------------------------------------------------------------------
// The colophon: the facts of the site's own making, set as a title sequence.
// No chrome of any kind — Escape leaves, and that is deliberately not printed.
//
// The type burns in, nothing else does. A hard-edged gradient sweeps across a
// mask and that *mask* is run through a turbulence displacement, so the reveal
// edge tears instead of fading. A second copy of the word masked to a narrow
// band riding the edge, blurred and filled warm, is the ember it leaves behind.
// The filters are word-sized and only run while a word is arriving; a
// full-screen version of the same effect had to be dropped, it could not hold
// a frame rate.
// Counts come from the same files the dashboard reads, so the two agree.
// ---------------------------------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

.clph {
  position: fixed; inset: 0; z-index: 10000;
  background: var(--bg);
  color: var(--ink);
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color .5s linear;
}

.clph__card { position: absolute; inset: 0; }

/* film grain, over everything */
.clph::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 3;
  opacity: 0.06;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.clph__word {
  font-family: 'Anton', 'Arial Narrow', sans-serif;
  font-weight: 400;
  letter-spacing: -0.012em;
}
`;

const WORD_DELAY = 0.4; // seconds between words
const BURN = 1.15; // how long one word takes to burn in
const HOLD = 2.2; // pause after the last word before the next card

// the card's own coordinate space; it is sliced to fill whatever the viewport is
const VW = 1600;
const VH = 900;
const MARGIN = 120;
const TEXT_WIDTH = 980; // stops short of the disc

const OPENING = ['AHMED', 'SAMIL', 'BULBUL'];

// Orange, red, blue in rotation — the reference's field colours. The ember stays
// warm on every one of them, because a burn edge reading cool looks wrong.
const PALETTES = [
  {
    bg: '#cf4a12',
    deep: '#5e1e04',
    ink: '#fdf6ec',
    ember: '#ffd98a',
    disc: '#eeb01f',
  },
  {
    bg: '#ad1a1f',
    deep: '#4a0609',
    ink: '#fdf1ec',
    ember: '#ffb173',
    disc: '#e8631f',
  },
  {
    bg: '#173464',
    deep: '#08142c',
    ink: '#f2f6ff',
    ember: '#ff9b47',
    disc: '#245490',
  },
];

/** Longest word decides the type size, so a card never runs into the disc. */
const sizeFor = (words) => {
  const longest = Math.max(...words.map((w) => w.length));
  return Math.min(230, Math.floor(TEXT_WIDTH / (longest * 0.47)));
};

/** Baselines for a block of words, centred in the card. */
const baselines = (words, size) => {
  const block = words.length * size * 0.86;
  const top = VH / 2 - block / 2;
  return words.map((_, i) => top + size * 0.78 + i * size * 0.86);
};

const Card = ({ words, pal, reduced }) => {
  const size = sizeFor(words);
  const ys = baselines(words, size);

  return (
    <motion.svg
      className="clph__card"
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio="xMidYMid slice"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <defs>
        {/* field lighting */}
        <radialGradient id="lift" cx="0.22" cy="0.28" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.17" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fall" cx="0.34" cy="0.48" r="0.78">
          <stop offset="0.4" stopColor={pal.deep} stopOpacity="0" />
          <stop offset="1" stopColor={pal.deep} stopOpacity="1" />
        </radialGradient>
        <radialGradient id="discLift" cx="0.34" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g>
        <rect width={VW} height={VH} fill={pal.bg} />
        <circle cx={VW - 270} cy={VH / 2} r={310} fill={pal.disc} />
        <circle cx={VW - 270} cy={VH / 2} r={310} fill="url(#discLift)" />
        <rect width={VW} height={VH} fill="url(#lift)" />
        <rect width={VW} height={VH} fill="url(#fall)" />

        {words.map((w, i) => (
          <Word
            key={`${w}-${i}`}
            text={w}
            index={i}
            size={size}
            y={ys[i]}
            pal={pal}
            reduced={reduced}
          />
        ))}
      </g>
    </motion.svg>
  );
};

const Word = ({ text, index, size, y, pal, reduced }) => {
  const id = `${index}-${text.replace(/\W/g, '')}`;
  const delay = index * WORD_DELAY;

  if (reduced) {
    return (
      <motion.text
        className="clph__word"
        x={MARGIN}
        y={y}
        fill={pal.ink}
        style={{ fontSize: size }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay }}
      >
        {text}
      </motion.text>
    );
  }

  return (
    <g>
      <defs>
        <linearGradient id={`sweep-${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0.48" stopColor="#fff" />
          <stop offset="0.52" stopColor="#000" />
        </linearGradient>
        <linearGradient id={`edge-${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0.455" stopColor="#000" />
          <stop offset="0.492" stopColor="#fff" />
          <stop offset="0.53" stopColor="#000" />
        </linearGradient>

        {/* displacing the MASK, not the text, is what tears the edge */}
        <filter id={`rough-${id}`} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.05"
            numOctaves="5"
            seed={index * 13 + text.length}
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale={size * 0.42}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id={`glow-${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={size * 0.045} />
        </filter>

        {/* the rect has to span the word for the whole sweep, or whatever falls
            outside it never gets revealed */}
        <mask id={`m-${id}`} maskUnits="userSpaceOnUse">
          <motion.rect
            x={MARGIN - 120}
            y={y - size * 3}
            width={TEXT_WIDTH + 260}
            height={size * 6}
            fill={`url(#sweep-${id})`}
            filter={`url(#rough-${id})`}
            initial={{ translateY: size * 0.65 }}
            animate={{ translateY: -size * 1.5 }}
            transition={{ duration: BURN, delay, ease: [0.32, 0, 0.24, 1] }}
          />
        </mask>
        <mask id={`me-${id}`} maskUnits="userSpaceOnUse">
          <motion.rect
            x={MARGIN - 120}
            y={y - size * 3}
            width={TEXT_WIDTH + 260}
            height={size * 6}
            fill={`url(#edge-${id})`}
            filter={`url(#rough-${id})`}
            initial={{ translateY: size * 0.65 }}
            animate={{ translateY: -size * 1.5 }}
            transition={{ duration: BURN, delay, ease: [0.32, 0, 0.24, 1] }}
          />
        </mask>
      </defs>

      {/* the hot line the burn leaves behind */}
      <motion.text
        className="clph__word"
        x={MARGIN}
        y={y}
        fill={pal.ember}
        style={{ fontSize: size }}
        mask={`url(#me-${id})`}
        filter={`url(#glow-${id})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: BURN + 0.3, delay, times: [0, 0.1, 0.82, 1] }}
      >
        {text}
      </motion.text>

      {/* the word itself */}
      <text
        className="clph__word"
        x={MARGIN}
        y={y}
        fill={pal.ink}
        style={{ fontSize: size }}
        mask={`url(#m-${id})`}
      >
        {text}
      </text>
    </g>
  );
};

const ColophonPage = () => {
  const [slide, setSlide] = useState(0);
  const [facts, setFacts] = useState([]);
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const timer = useRef(null);

  // Same files the dashboard reads, so the two never disagree.
  useEffect(() => {
    let cancelled = false;

    const read = async (url, pick) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return pick(await res.text());
      } catch {
        return null;
      }
    };

    (async () => {
      const [codename, posts, apps, projects] = await Promise.all([
        read(
          '/site-config.piml',
          (t) => piml.parse(t)?.config?.kernel?.codename,
        ),
        read('/posts/posts.json', (t) => JSON.parse(t).length),
        read(
          '/apps/apps.json',
          (t) =>
            Object.values(JSON.parse(t)).flatMap((c) => c.apps || []).length,
        ),
        read(
          '/projects/projects.piml',
          (t) => (piml.parse(t).projects || []).length,
        ),
      ]);

      // Categories come from a manifest the build writes off the filesystem,
      // so a new one is picked up without touching this file. The entries are
      // still read from the piml files themselves rather than counted in the
      // manifest — nothing here is a number somebody has to remember to update.
      const categories = await fetchLogCategories();
      const logs = (await fetchLogsForCategories(categories, piml.parse))
        .length;

      if (cancelled) return;

      setFacts(
        [
          ['THE', 'CODEX'],
          codename ? [String(codename).toUpperCase()] : null,
          [`V${version}`],
          logs ? [String(logs), 'LOGS'] : null,
          posts ? [String(posts), 'POSTS'] : null,
          apps ? [String(apps), 'APPS'] : null,
          projects ? [String(projects), 'PROJECTS'] : null,
          [String(Object.keys(vocabulary).length), 'VOCAB'],
          ['FEZCODE.COM'],
        ].filter(Boolean),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const slides = useMemo(() => [OPENING, ...facts], [facts]);
  const index = Math.min(slide, slides.length - 1);
  const words = slides[index];
  const pal = PALETTES[index % PALETTES.length];

  const advance = useCallback(
    (step = 1) => {
      setSlide((s) => (s + step + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (reduced) return undefined;
    const ms = (words.length * WORD_DELAY + BURN + HOLD) * 1000;
    timer.current = setTimeout(() => advance(1), ms);
    return () => clearTimeout(timer.current);
  }, [slide, words.length, advance, reduced]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        navigate('/');
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        advance(1);
      }
      if (e.key === 'ArrowLeft') advance(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, navigate]);

  return (
    <div
      className="clph"
      onClick={() => advance(1)}
      role="presentation"
      style={{ '--bg': pal.bg, '--ink': pal.ink }}
    >
      <style>{CSS}</style>
      <Seo
        title="Colophon — Fezcodex"
        description="The facts of this site's making."
        keywords={['Ahmed Samil Bulbul', 'fezcode', 'fezcodex', 'colophon']}
      />

      <Card key={index} words={words} pal={pal} reduced={reduced} />
    </div>
  );
};

export default ColophonPage;
