import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeftIcon, ArrowUpRightIcon, GithubLogoIcon } from '@phosphor-icons/react';
import { useAppConfig, useThemeFonts, AppLoading, AppMissing, AppSeo } from './app-shell';

/* ============================================================
 * "gallery" — Atelier, in the dark room.
 *
 * Atelier is a black window that lets the picture have the whole
 * screen, so this page is a dark room with the lights off. Your
 * pointer is the lamp: the hero hides a wall of pictures you light
 * by moving. Below it everything is Atelier as it actually looks —
 * taken from screenshots of the running app, not imagined: the
 * letter-spaced ATELIER title bar, the − ◀ 76% ▶ + pills, the path
 * bar with the pixel size at its end, Exo throughout.
 *
 *  - the replica window walks a folder, zooms, rotates, hides its
 *    controls when you stop moving, and turns into a Picture Frame;
 *  - scrolling zooms a real SVG ten thousand percent beside a bitmap
 *    of the same picture, so vector sharpness is seen, not claimed;
 *  - a sideways phone photo stands itself up as it scrolls in;
 *  - "Set as wallpaper" dresses this page's own wall in the picture.
 * ============================================================ */

const FONTS = 'https://fonts.googleapis.com/css2?family=Exo:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300&display=swap';

const INK = '#0A0A0A';
const BAR = '#060606';
const LINE = '#1A1A1A';
const PILL = '#181818';
const PILL_EDGE = '#262626';
const TEXT = '#EDEDED';
const DIM = '#8A8A8A';
const FAINT = '#555555';
// From the icon: the frame's sky gradient.
const SKY_A = '#6DACE7';

const EXO = { fontFamily: "'Exo', 'Segoe UI', sans-serif" };

const ROLL = [
  { src: '/images/bg/3.webp', name: 'storm-over-the-citadel.webp', w: 1920, h: 1080 },
  { src: '/images/bg/emre.jpg', name: 'leaves.jpg', w: 2400, h: 1600 },
  { src: '/images/bg/tim_simon.jpg', name: 'above-the-clouds.jpg', w: 2400, h: 1600 },
  { src: '/images/bg/1.webp', name: 'second-light.webp', w: 1920, h: 1080 },
  { src: '/images/bg/nik.jpg', name: 'palm-light.jpg', w: 2400, h: 1597 },
  { src: '/images/bg/7.webp', name: 'long-exposure.webp', w: 1920, h: 1080 },
  { src: '/images/bg/4.webp', name: 'blue-hour.webp', w: 1920, h: 1080 },
  { src: '/images/bg/0.webp', name: 'first-frame.webp', w: 1920, h: 1080 },
];

const isInternal = (href = '') => href.startsWith('/') && !href.startsWith('//');
const Go = ({ href, children, className = '', style }) =>
  isInternal(href) ? (
    <Link to={href} className={className} style={style}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {children}
    </a>
  );

const Rise = ({ children, className = '', delay = 0 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 30, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

/** The app's own title: tiny, extra-bold, spaced wide. */
const Spaced = ({ children, className = '', color = TEXT }) => (
  <span className={`text-[11px] font-extrabold ${className}`} style={{ ...EXO, letterSpacing: '0.28em', color }}>
    {children}
  </span>
);

const Chapter = ({ no, title, children }) => (
  <Rise className="mx-auto max-w-[820px] text-center">
    <Spaced color={SKY_A}>{no}</Spaced>
    <h2 className="mt-6 text-[40px] md:text-[64px] font-extralight leading-[1.02] tracking-[-0.02em]" style={EXO}>
      {title}
    </h2>
    {children && (
      <p className="mt-6 text-[16.5px] md:text-[18px] leading-[1.7] font-light" style={{ color: DIM }}>
        {children}
      </p>
    )}
  </Rise>
);

const Kbd = ({ children }) => (
  <kbd className="h-7 min-w-[28px] px-2 rounded-[4px] inline-flex items-center justify-center text-[11.5px]" style={{ ...EXO, background: PILL, border: `1px solid ${PILL_EDGE}`, color: TEXT }}>
    {children}
  </kbd>
);

/* The site scrolls <body> rather than the window, so scroll-linked effects
 * have to name it as their container or they never move. */
const scrollRoot = () => {
  if (typeof document === 'undefined') return undefined;
  const b = document.body;
  return /(auto|scroll)/.test(getComputedStyle(b).overflowY) ? { current: b } : undefined;
};

/* ---------- 1. the lamp: pointer lights a hidden wall of pictures ---------- */

const DarkRoom = ({ children }) => {
  const room = useRef(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = room.current;
    if (!el) return undefined;
    let frame = 0;
    let t = 0;
    let idle = true;
    let timer = 0;
    // With no pointer (touch, or before you move), the lamp wanders on its own.
    const wander = () => {
      t += 0.006;
      if (idle) {
        el.style.setProperty('--mx', `${50 + Math.sin(t * 1.3) * 34}%`);
        el.style.setProperty('--my', `${50 + Math.sin(t * 0.9 + 1) * 26}%`);
      }
      frame = requestAnimationFrame(wander);
    };
    if (!reduce) frame = requestAnimationFrame(wander);
    const move = (e) => {
      const r = el.getBoundingClientRect();
      idle = false;
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        idle = true;
      }, 2600);
    };
    el.addEventListener('pointermove', move);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      el.removeEventListener('pointermove', move);
    };
  }, [reduce]);

  const tiles = [...ROLL, ...ROLL.slice(0, 4)];
  const wall = (lit) => (
    <div className="absolute inset-[-4%] grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-5 p-3 md:p-5 rotate-[-4deg]">
      {tiles.map((p, i) => (
        <div key={i} className="relative rounded-[4px] overflow-hidden" style={{ boxShadow: lit ? '0 30px 60px rgba(0,0,0,0.8)' : 'none', outline: `1px solid ${lit ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}` }}>
          <img src={p.src} alt="" loading={i < 4 ? 'eager' : 'lazy'} className="w-full h-full object-cover aspect-[4/3]" style={{ filter: lit ? 'none' : 'grayscale(1) brightness(0.16)' }} />
        </div>
      ))}
    </div>
  );
  const mask = 'radial-gradient(circle min(34vw, 340px) at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.55) 45%, transparent 72%)';

  return (
    <section ref={room} className="relative h-[100svh] min-h-[620px] overflow-hidden" style={{ background: INK, '--mx': '50%', '--my': '45%' }}>
      <div className="absolute inset-0" aria-hidden>
        {wall(false)}
      </div>
      <div className="absolute inset-0" aria-hidden style={{ WebkitMaskImage: mask, maskImage: mask }}>
        {wall(true)}
      </div>
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ background: 'radial-gradient(circle 520px at var(--mx) var(--my), rgba(109,172,231,0.10), transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0) 22%, rgba(10,10,10,0) 70%, #0A0A0A 100%)' }} />
      {children}
    </section>
  );
};

/* ---------- 2. the window, as Atelier draws it ---------- */

const PillBtn = ({ children, onClick, label, wide }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`h-10 ${wide ? 'w-[100px]' : 'w-10'} rounded-[4px] flex items-center justify-center text-[13px] transition-colors hover:bg-[#222]`}
    style={{ ...EXO, background: PILL, border: `1px solid ${PILL_EDGE}`, color: TEXT }}
  >
    {children}
  </button>
);

const AtelierWindow = () => {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [turn, setTurn] = useState(0);
  const [controls, setControls] = useState(true);
  const [frame, setFrame] = useState(false);
  const [hint, setHint] = useState(false);
  const [fit, setFit] = useState(0.5);
  const stage = useRef(null);
  const idleTimer = useRef(0);
  const hintTimer = useRef(0);
  const pic = ROLL[idx];

  // Atelier reports zoom against the real pixels, so "fit" reads as 51% or 76%, not 100%.
  const measure = useCallback(() => {
    const el = stage.current;
    if (!el) return;
    const odd = turn % 2 !== 0;
    const w = odd ? pic.h : pic.w;
    const h = odd ? pic.w : pic.h;
    setFit(Math.min((el.clientWidth - 20) / w, (el.clientHeight - 20) / h));
  }, [pic, turn]);
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    return () => ro.disconnect();
  }, [measure]);

  const go = (n) => {
    setIdx(((n % ROLL.length) + ROLL.length) % ROLL.length);
    setZoom(1);
    setTurn(0);
  };
  const wake = () => {
    setControls(true);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setControls(false), 3200);
  };
  const enterFrame = (on) => {
    setFrame(on);
    setHint(on);
    window.clearTimeout(hintTimer.current);
    if (on) hintTimer.current = window.setTimeout(() => setHint(false), 5000);
  };
  useEffect(
    () => () => {
      window.clearTimeout(idleTimer.current);
      window.clearTimeout(hintTimer.current);
    },
    [],
  );

  const onKey = (e) => {
    const k = e.key;
    let used = true;
    if (k === 'ArrowRight') go(idx + 1);
    else if (k === 'ArrowLeft') go(idx - 1);
    else if (k === '+' || k === '=') setZoom((z) => Math.min(8, z * 1.25));
    else if (k === '-') setZoom((z) => Math.max(0.25, z / 1.25));
    else if (k === 'r') setTurn((t) => t + 1);
    else if (k === 'R') setTurn((t) => t - 1);
    else if (k === 'Escape' && frame) enterFrame(false);
    else used = false;
    if (used) {
      e.preventDefault();
      wake();
    }
  };

  const odd = turn % 2 !== 0;
  const turnFit = odd ? Math.min(1, pic.h / pic.w) : 1;
  const percent = Math.round(fit * zoom * 100);

  return (
    <div className="relative">
      <div
        tabIndex={0}
        onKeyDown={onKey}
        onPointerMove={wake}
        aria-label="A working copy of Atelier's window. Arrow keys walk the folder, plus and minus zoom, R rotates, Escape leaves Picture Frame."
        className="relative mx-auto outline-none transition-all duration-700"
        style={{
          ...EXO,
          maxWidth: frame ? 820 : 1160,
          background: INK,
          border: frame ? '14px solid #F4F1EA' : `1px solid ${LINE}`,
          borderRadius: frame ? 2 : 10,
          boxShadow: frame ? '0 60px 90px -30px rgba(0,0,0,0.95), 0 0 0 1px #CFC9BB' : '0 80px 140px -60px rgba(0,0,0,1), 0 0 0 1px #000',
        }}
      >
        {!frame && (
          <div className="relative flex items-center justify-center h-10" style={{ background: BAR, borderBottom: `1px solid ${LINE}` }}>
            <Spaced>ATELIER</Spaced>
            <span className="absolute right-0 top-0 flex" aria-hidden>
              {['—', '☐', '✕'].map((g) => (
                <span key={g} className="w-12 h-10 flex items-center justify-center text-[12px]" style={{ color: TEXT }}>
                  {g}
                </span>
              ))}
            </span>
          </div>
        )}

        <div
          ref={stage}
          className="relative overflow-hidden flex items-center justify-center"
          style={{ height: frame ? 'clamp(260px, 52vh, 540px)' : 'clamp(300px, 58vh, 640px)', background: INK }}
          onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 1 / fit))}
          onPointerEnter={() => frame && setHint(true)}
        >
          <img
            key={pic.src}
            src={pic.src}
            alt={pic.name}
            className="max-w-[calc(100%-20px)] max-h-[calc(100%-20px)] object-contain select-none"
            draggable={false}
            style={{ transform: `scale(${zoom * turnFit}) rotate(${turn * 90}deg)`, transition: 'transform 320ms cubic-bezier(0.2,0.7,0.2,1)' }}
          />
          {frame && (
            <button
              type="button"
              onClick={() => enterFrame(false)}
              className="absolute top-3 left-1/2 -translate-x-1/2 h-8 px-4 rounded-[4px] text-[11px] font-extrabold transition-opacity duration-500"
              style={{ ...EXO, letterSpacing: '0.2em', background: 'rgba(6,6,6,0.85)', color: TEXT, border: `1px solid ${PILL_EDGE}`, opacity: hint ? 1 : 0 }}
            >
              EXIT FRAME
            </button>
          )}
        </div>

        {!frame && (
          <div className="overflow-hidden transition-[max-height] duration-500" style={{ maxHeight: controls ? 140 : 18, background: INK, borderTop: `1px solid ${LINE}` }}>
            <button type="button" onClick={() => setControls((c) => !c)} className="block mx-auto mt-1 w-8 h-3" aria-label={controls ? 'Hide controls' : 'Show controls'}>
              <svg viewBox="0 0 10 6" className="w-2.5 h-2 mx-auto transition-transform" style={{ transform: controls ? 'none' : 'rotate(180deg)' }}>
                <path d="M0 0h10L5 6z" fill={FAINT} />
              </svg>
            </button>
            <div className="flex items-center justify-center gap-2.5 mt-1.5">
              <PillBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(0.25, z / 1.25))}>
                −
              </PillBtn>
              <PillBtn label="Previous" onClick={() => go(idx - 1)}>
                ◀
              </PillBtn>
              <PillBtn wide label={`Zoom ${percent}%, click to fit`} onClick={() => setZoom(1)}>
                {percent}%
              </PillBtn>
              <PillBtn label="Next" onClick={() => go(idx + 1)}>
                ▶
              </PillBtn>
              <PillBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(8, z * 1.25))}>
                +
              </PillBtn>
            </div>
            <div className="mx-3 mt-3 mb-3 h-8 px-4 rounded-[6px] flex items-center justify-between gap-4 text-[12px]" style={{ background: '#111', border: `1px solid ${LINE}`, color: TEXT }}>
              <span className="truncate">D:\Pictures\{pic.name}</span>
              <span className="shrink-0 tabular-nums">
                {odd ? pic.h : pic.w} <span style={{ color: FAINT }}>×</span> {odd ? pic.w : pic.h}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={() => enterFrame(!frame)} className="h-10 px-5 rounded-full text-[13px] font-semibold transition-colors" style={{ ...EXO, background: frame ? TEXT : 'transparent', color: frame ? INK : TEXT, border: `1px solid ${frame ? TEXT : '#333'}` }} aria-pressed={frame}>
          {frame ? 'Take it off the wall' : 'View › Picture Frame'}
        </button>
        <button type="button" onClick={() => setTurn((t) => t + 1)} className="h-10 px-5 rounded-full text-[13px] font-semibold" style={{ ...EXO, color: TEXT, border: '1px solid #333' }}>
          Rotate · R
        </button>
        <span className="text-[12.5px]" style={{ ...EXO, color: FAINT }}>
          ← → walk the folder · the controls hide when you stop moving
        </span>
      </div>
    </div>
  );
};

/* ---------- 3. scroll to zoom: vector against bitmap ---------- */

// The dot of the last "i" in Hisashi's wordmark, as a fraction of the 1280×400 banner.
const FX = 491 / 1280;
const FY = 152 / 400;
const AR = 400 / 1280;

const ZoomPane = ({ src, pixel, label, verdict, width, left, top }) => (
  <figure className="relative flex-1 min-w-0">
    <div className="relative overflow-hidden rounded-[6px] aspect-[16/10]" style={{ background: '#0f1216', border: `1px solid ${LINE}`, containerType: 'inline-size' }}>
      <motion.img src={src} alt="" className="absolute max-w-none" style={{ width, left, top, imageRendering: pixel ? 'pixelated' : 'auto' }} draggable={false} />
      <span className="absolute left-3 top-3 h-7 px-3 rounded-[4px] flex items-center text-[11px] font-extrabold" style={{ ...EXO, letterSpacing: '0.16em', background: 'rgba(6,6,6,0.8)', color: TEXT, border: `1px solid ${PILL_EDGE}` }}>
        {label}
      </span>
    </div>
    <figcaption className="mt-3 text-[13px] text-center" style={{ ...EXO, color: pixel ? '#F59E6B' : '#7FD1A7' }}>
      {verdict}
    </figcaption>
  </figure>
);

const InfiniteZoom = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [root] = useState(scrollRoot);
  const { scrollYProgress } = useScroll({ target: ref, container: root, offset: ['start start', 'end end'] });
  const MAX = 100; // ×100 = 10,000 %
  const scale = useTransform(scrollYProgress, (p) => (reduce ? 12 : MAX ** Math.min(1, Math.max(0, p))));
  const width = useTransform(scale, (s) => `${s * 100}%`);
  const left = useTransform(scale, (s) => `calc(50% - ${FX * s * 100}%)`);
  const top = useTransform(scale, (s) => `calc(50% - ${FY * AR * s * 100}cqw)`);
  const [pct, setPct] = useState(reduce ? 1200 : 100);
  useMotionValueEvent(scale, 'change', (s) => setPct(Math.round(s * 100)));

  return (
    <section ref={ref} className="relative" style={{ height: reduce ? 'auto' : '320vh' }}>
      <div className={`${reduce ? '' : 'sticky top-0'} min-h-[100svh] flex flex-col justify-center py-16`}>
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8">
          <Chapter
            no="II · SVG, NATIVELY"
            title={
              <>
                Keep scrolling. <em className="font-extralight">It stays sharp.</em>
              </>
            }
          >
            The same banner twice: on the left the SVG itself, redrawn at every zoom as Atelier does; on the right a 320-pixel bitmap of it. Scroll, and ride into the dot of the last “i”.
          </Chapter>
          <div className="mt-12 flex flex-col md:flex-row gap-5">
            <ZoomPane src="/images/projects/atelier/real/banner-vector.svg" label="SVG · VECTOR" verdict="the edge is exact at any zoom" width={width} left={left} top={top} />
            <ZoomPane src="/images/projects/atelier/real/banner-raster-320.png" pixel label="PNG · 320 PX" verdict="you arrive at the pixels" width={width} left={left} top={top} />
          </div>
          <div className="mt-8 flex justify-center">
            <span className="h-10 w-[140px] rounded-[4px] flex items-center justify-center text-[14px] tabular-nums" style={{ ...EXO, background: PILL, border: `1px solid ${PILL_EDGE}`, color: TEXT }} aria-live="off">
              {pct.toLocaleString('en-US')}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- 4. the sideways photo stands up ---------- */

const StandUp = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [root] = useState(scrollRoot);
  const { scrollYProgress } = useScroll({ target: ref, container: root, offset: ['start 85%', 'center 50%'] });
  const rot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-90, 0]);
  const [upright, setUpright] = useState(!!reduce);
  useMotionValueEvent(rot, 'change', (v) => setUpright(v > -8));
  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-10 items-center">
      <div className="relative aspect-square max-w-[460px] w-full mx-auto rounded-[8px] flex items-center justify-center" style={{ background: INK, border: `1px solid ${LINE}` }}>
        <motion.div className="relative w-[54%] aspect-[3/4] rounded-[3px] overflow-hidden" style={{ rotate: rot, boxShadow: '0 40px 70px rgba(0,0,0,0.9)' }}>
          <img src="/images/bg/nik.jpg" alt="IMG_2291.jpg, shot in portrait" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '62% 50%' }} />
        </motion.div>
        <span className="absolute left-4 bottom-4 h-7 px-3 rounded-[4px] flex items-center text-[11px] tabular-nums" style={{ ...EXO, background: '#111', border: `1px solid ${LINE}`, color: upright ? '#7FD1A7' : '#F59E6B' }}>
          EXIF Orientation {upright ? '1 · upright' : '6 · rotate 90°'}
        </span>
      </div>
      <div>
        <Spaced color={SKY_A}>III · NEW IN 0.4.0</Spaced>
        <h3 className="mt-5 text-[34px] md:text-[48px] font-extralight leading-[1.05]" style={EXO}>
          Photos stand up straight now.
        </h3>
        <p className="mt-5 text-[16px] leading-[1.75] font-light" style={{ color: DIM }}>
          Avalonia’s decoder ignores the EXIF orientation tag, so a portrait phone photo always opened on its side. Atelier 0.4.0 models all eight EXIF values and every rotate and flip as one value; the tag is only where it starts. Saving bakes the turn into the pixels and clears the tag.
        </p>
      </div>
    </div>
  );
};

/* ---------- 5. set this page as wallpaper ---------- */

const MODES = ['Fill', 'Fit', 'Stretch', 'Center', 'Tile', 'Span'];
const wallStyle = (mode, src) => {
  const b = { backgroundImage: `url(${src})`, backgroundColor: '#050505' };
  switch (mode) {
    case 'Fill':
      return { ...b, backgroundSize: 'cover', backgroundPosition: 'center' };
    case 'Fit':
      return { ...b, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' };
    case 'Stretch':
      return { ...b, backgroundSize: '100% 100%' };
    case 'Center':
      return { ...b, backgroundSize: 'min(640px, 70%) auto', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' };
    case 'Tile':
      return { ...b, backgroundSize: 'min(320px, 40%) auto', backgroundRepeat: 'repeat' };
    default:
      return { ...b, backgroundSize: '200% auto', backgroundPosition: 'left center', backgroundRepeat: 'no-repeat' };
  }
};

const Wallpaper = ({ summary }) => {
  const [mode, setMode] = useState(null);
  const [pick, setPick] = useState(0);
  const src = ROLL[pick].src;
  return (
    <section className="relative" style={mode ? wallStyle(mode, src) : { background: INK }}>
      {mode === 'Span' && <div className="absolute inset-y-0 left-1/2 w-[10px] -translate-x-1/2 pointer-events-none" style={{ background: '#000', boxShadow: '0 0 30px rgba(0,0,0,0.8)' }} aria-hidden />}
      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-8 py-28 md:py-40">
        <div className="mx-auto max-w-[760px] rounded-[10px] p-7 md:p-10 text-center backdrop-blur-xl" style={{ background: 'rgba(10,10,10,0.72)', border: `1px solid ${LINE}` }}>
          <Spaced color={SKY_A}>IV · FILE › SET AS WALLPAPER</Spaced>
          <h2 className="mt-6 text-[36px] md:text-[56px] font-extralight leading-[1.02]" style={EXO}>
            {mode ? (
              <>
                This wall is now in <em>{mode}</em>.
              </>
            ) : (
              'Put it on the wall.'
            )}
          </h2>
          <p className="mt-5 text-[15.5px] leading-[1.7] font-light" style={{ color: DIM }}>
            {summary}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Wallpaper mode">
            {MODES.map((m) => (
              <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(mode === m ? null : m)} className="h-10 min-w-[84px] px-4 rounded-[4px] text-[13px] transition-colors" style={{ ...EXO, background: mode === m ? TEXT : PILL, color: mode === m ? INK : TEXT, border: `1px solid ${mode === m ? TEXT : PILL_EDGE}` }}>
                {m}
              </button>
            ))}
          </div>
          <div className="mt-5 flex justify-center gap-1.5">
            {ROLL.slice(0, 6).map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => {
                  setPick(i);
                  if (!mode) setMode('Fill');
                }}
                aria-label={`Use ${p.name}`}
                className="w-12 h-8 rounded-[3px] overflow-hidden transition-opacity"
                style={{ outline: i === pick ? `2px solid ${SKY_A}` : 'none', outlineOffset: 2, opacity: i === pick ? 1 : 0.5 }}
              >
                <img src={p.src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          {mode && (
            <button type="button" onClick={() => setMode(null)} className="mt-6 text-[12.5px] underline underline-offset-4" style={{ ...EXO, color: DIM }}>
              Take the wallpaper down
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

/* ---------- 6. a ring of formats ---------- */

const FormatRing = ({ formats }) => {
  const reduce = useReducedMotion();
  const n = formats.length;
  if (reduce)
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {formats.map((f) => (
          <span key={f.name} className="px-5 py-3 rounded-[8px] text-[22px] font-light" style={{ ...EXO, border: '1px solid rgba(109,172,231,0.28)' }}>
            {f.name}
          </span>
        ))}
      </div>
    );
  return (
    <div className="relative h-[300px] md:h-[360px] flex items-center justify-center overflow-hidden" style={{ perspective: 1100 }} role="img" aria-label={`Formats: ${formats.map((f) => f.name).join(', ')}`}>
      <motion.div className="relative w-[160px] h-[110px]" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: 360 }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}>
        {formats.map((f, i) => (
          <div key={f.name} className="absolute inset-0 rounded-[8px] flex flex-col items-center justify-center" style={{ transform: `rotateY(${(360 / n) * i}deg) translateZ(clamp(220px, 32vw, 380px))`, background: 'linear-gradient(180deg, rgba(109,172,231,0.14), rgba(57,84,165,0.06))', border: '1px solid rgba(109,172,231,0.28)', backfaceVisibility: 'hidden' }}>
            <span className="text-[34px] font-light" style={{ ...EXO, color: TEXT }}>
              {f.name}
            </span>
            <span className="mt-1 text-[11px] tracking-[0.1em]" style={{ ...EXO, color: DIM }}>
              {f.via}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ============================================================ */

const SHOTS = [
  { src: '/images/projects/atelier/real/open.webp', cap: 'A 1920 × 1080 WebP at 76%' },
  { src: '/images/projects/atelier/real/controls.webp', cap: 'A 2400 × 1600 JPEG at 51%' },
  { src: '/images/projects/atelier/real/svg.webp', cap: 'An SVG, fitted' },
  { src: '/images/projects/atelier/real/svg-zoom.webp', cap: 'The same SVG at 256%' },
];

const GalleryProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'gallery');
  const [shot, setShot] = useState(0);

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={INK} color={TEXT} />;

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: INK, color: TEXT, ...EXO }}>
      <AppSeo cfg={cfg} project={project} />

      <header className="fixed top-0 inset-x-0 z-40 h-12 flex items-center px-4 sm:px-6" style={{ background: 'linear-gradient(180deg, rgba(6,6,6,0.92), rgba(6,6,6,0))' }}>
        <Link to="/projects" className="inline-flex items-center gap-2 text-[12px]" style={{ color: DIM }}>
          <ArrowLeftIcon size={13} /> Projects
        </Link>
        <span className="absolute left-1/2 -translate-x-1/2">
          <Spaced>ATELIER</Spaced>
        </span>
        <a href={cfg.download} target="_blank" rel="noopener noreferrer" className="ml-auto h-8 px-4 rounded-[4px] inline-flex items-center text-[12px] font-semibold" style={{ background: TEXT, color: INK }}>
          Download
        </a>
      </header>

      {/* ---------- dark room ---------- */}
      <DarkRoom>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5 pointer-events-none">
          <motion.img src="/images/projects/atelier/atelier-icon.svg" alt="" className="w-16 h-16 md:w-20 md:h-20" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ filter: 'drop-shadow(0 20px 40px rgba(57,84,165,0.6))' }} />
          <motion.h1 className="mt-8 text-[46px] sm:text-[72px] md:text-[104px] font-extralight leading-[0.96] tracking-[-0.03em]" initial={{ opacity: 0, filter: 'blur(12px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1.4, delay: 0.2 }} style={{ textShadow: '0 4px 40px rgba(0,0,0,0.9)' }}>
            Nothing between
            <br />
            you and{' '}
            <em className="font-extralight" style={{ background: `linear-gradient(90deg, ${SKY_A}, #B9D8F5)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              the picture.
            </em>
          </motion.h1>
          <motion.p className="mt-7 max-w-[520px] text-[16px] md:text-[18px] font-light leading-[1.6]" style={{ color: '#B5B5B5', textShadow: '0 2px 20px #000' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
            An image and SVG viewer for Windows that turns the lights down and hands the whole screen to the picture.
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap justify-center gap-3 pointer-events-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
            <a href={cfg.download} target="_blank" rel="noopener noreferrer" className="h-12 px-7 rounded-[4px] inline-flex items-center text-[14px] font-semibold" style={{ background: TEXT, color: INK }}>
              Download v{cfg.version}
            </a>
            <a href={cfg.repo} target="_blank" rel="noopener noreferrer" className="h-12 px-7 rounded-[4px] inline-flex items-center gap-2 text-[14px]" style={{ border: '1px solid #3A3A3A', color: TEXT, background: 'rgba(10,10,10,0.6)' }}>
              <GithubLogoIcon size={16} /> Source
            </a>
          </motion.div>
          <span className="absolute bottom-8">
            <Spaced color={FAINT}>MOVE THE LAMP · SCROLL</Spaced>
          </span>
        </div>
      </DarkRoom>

      {/* ---------- the window ---------- */}
      <section className="px-4 sm:px-8 pt-20 md:pt-28 pb-24">
        <Chapter
          no="I · THE WINDOW"
          title={
            <>
              It looks like this. <em>Really.</em>
            </>
          }
        >
          Black glass, a spaced-out title, five pills and a path. Everything else is the picture. This copy works — click it, then walk the folder, zoom and rotate. Stop moving and the controls get out of the way.
        </Chapter>
        <Rise className="mt-14">
          <AtelierWindow />
        </Rise>
      </section>

      {/* ---------- real screenshots ---------- */}
      <section className="px-4 sm:px-8 pb-28">
        <Rise className="mx-auto max-w-[1160px]">
          <div className="relative rounded-[10px] overflow-hidden" style={{ border: `1px solid ${LINE}`, boxShadow: '0 60px 120px -50px #000' }}>
            {SHOTS.map((s, i) => (
              <img key={s.src} src={s.src} alt={s.cap} loading="lazy" className={`w-full h-auto block transition-opacity duration-700 ${i === 0 ? 'relative' : 'absolute inset-0'}`} style={{ opacity: i === shot ? 1 : 0 }} />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {SHOTS.map((s, i) => (
              <button key={s.src} type="button" onClick={() => setShot(i)} aria-pressed={i === shot} className="h-9 px-4 rounded-[4px] text-[12.5px] transition-colors" style={{ ...EXO, background: i === shot ? TEXT : PILL, color: i === shot ? INK : DIM, border: `1px solid ${i === shot ? TEXT : PILL_EDGE}` }}>
                {s.cap}
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-[12px]" style={{ color: FAINT }}>
            Screenshots of Atelier {cfg.version} running on Windows 11.
          </p>
        </Rise>
      </section>

      <InfiniteZoom />

      {/* ---------- EXIF + what's new ---------- */}
      <section className="px-4 sm:px-8 py-28 md:py-36">
        <div className="mx-auto max-w-[1160px]">
          <StandUp />
          {cfg.whatsNew && (
            <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-[8px] overflow-hidden" style={{ background: LINE }}>
              {cfg.whatsNew.items.map((it, i) => (
                <Rise key={it.title} delay={(i % 4) * 0.06} className="h-full">
                  <div className="h-full p-6 transition-colors hover:bg-[#101010]" style={{ background: INK }}>
                    <span className="inline-flex gap-1">
                      {it.key.split(' ').map((k) => (
                        <Kbd key={k}>{k}</Kbd>
                      ))}
                    </span>
                    <p className="mt-5 text-[18px] font-medium">{it.title}</p>
                    <p className="mt-2 text-[13.5px] leading-[1.65] font-light" style={{ color: DIM }}>
                      {it.body}
                    </p>
                  </div>
                </Rise>
              ))}
            </div>
          )}
        </div>
      </section>

      <Wallpaper summary={cfg.summary?.[1]} />

      {cfg.formats && (
        <section className="px-4 sm:px-8 pt-28 pb-16">
          <Chapter
            no="V · FORMATS"
            title={
              <>
                Whatever the folder <em>throws at it.</em>
              </>
            }
          >
            {cfg.summary?.[0]}
          </Chapter>
          <Rise className="mt-6">
            <FormatRing formats={cfg.formats} />
          </Rise>
        </section>
      )}

      {/* ---------- Hisashi ---------- */}
      <section className="px-4 sm:px-8 py-24">
        <Rise className="mx-auto max-w-[960px] rounded-[10px] overflow-hidden grid md:grid-cols-[1.1fr_1fr]" style={{ border: `1px solid ${LINE}`, background: '#0D0D0D' }}>
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <Spaced color={SKY_A}>VI · VIEW › HISASHI</Spaced>
            <h3 className="mt-5 text-[30px] md:text-[40px] font-extralight leading-[1.08]">The menus can leave the window.</h3>
            <p className="mt-4 text-[15px] leading-[1.7] font-light" style={{ color: DIM }}>
              Connect to Hisashi and File, View, Edit and Help move up into its bar at the top of the screen. Atelier’s own strip hides itself, so the picture gets even more of the room.
            </p>
            <Link to="/projects/hisashi" className="mt-6 inline-flex items-center gap-1.5 text-[14px]" style={{ color: SKY_A }}>
              Meet Hisashi <ArrowUpRightIcon size={14} />
            </Link>
          </div>
          <div className="relative min-h-[220px] flex items-center justify-center p-6" style={{ background: 'radial-gradient(circle at 50% 30%, #1B2436, #0A0A0A 70%)' }}>
            <div className="w-full rounded-[6px] overflow-hidden" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.8)', border: '1px solid #2A2A2A' }}>
              <img src="/images/projects/atelier/real/hisashi-menubar.webp" alt="Hisashi's bar showing Atelier, File, View, Edit and Help" className="w-full h-auto block" />
              <div className="h-28" style={{ background: 'linear-gradient(180deg,#0A0A0A,#111)' }}>
                <div className="h-6 flex items-center justify-center" style={{ background: BAR, borderBottom: `1px solid ${LINE}` }}>
                  <span className="text-[8px] font-extrabold" style={{ ...EXO, letterSpacing: '0.28em' }}>
                    ATELIER
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Rise>
      </section>

      {/* ---------- keys ---------- */}
      {(cfg.keys || []).length > 0 && (
        <section className="px-4 sm:px-8 pb-28">
          <Chapter no="VII · KEYS" title="Your hands never leave the picture." />
          <Rise className="mx-auto mt-12 max-w-[1000px] grid sm:grid-cols-2 gap-x-12">
            {cfg.keys.map((k) => (
              <div key={k.a} className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: `1px solid ${LINE}` }}>
                <span className="text-[14px] font-light" style={{ color: '#C8C8C8' }}>
                  {k.a}
                </span>
                <span className="flex gap-1 shrink-0">
                  {k.k.map((c) => (
                    <Kbd key={c}>{c}</Kbd>
                  ))}
                </span>
              </div>
            ))}
          </Rise>
        </section>
      )}

      {/* ---------- lights up ---------- */}
      <section className="relative overflow-hidden">
        <img src="/images/bg/tim_simon.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.35) 35%, rgba(10,10,10,0.55) 100%)' }} />
        <div className="relative px-4 sm:px-8 py-40 md:py-56 text-center">
          <Rise>
            <h2 className="text-[48px] md:text-[96px] font-extralight leading-[0.95] tracking-[-0.03em]" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
              Lights down.
              <br />
              <em>Picture up.</em>
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href={cfg.download} target="_blank" rel="noopener noreferrer" className="h-12 px-7 rounded-[4px] inline-flex items-center text-[14px] font-semibold" style={{ background: TEXT, color: INK }}>
                {cfg.downloadLabel} · v{cfg.version}
              </a>
              <Go href="/projects/airlift" className="h-12 px-7 rounded-[4px] inline-flex items-center text-[14px]" style={{ background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,255,255,0.3)', color: TEXT }}>
                Or install it with Airlift
              </Go>
            </div>
          </Rise>
        </div>
      </section>

      <footer className="px-4 sm:px-8 py-10 flex flex-wrap items-center justify-between gap-4 text-[12px]" style={{ borderTop: `1px solid ${LINE}`, color: FAINT }}>
        <Spaced color={FAINT}>ATELIER {cfg.version}</Spaced>
        <span className="flex flex-wrap gap-x-6 gap-y-2">
          {(cfg.colophon || []).slice(0, 4).map(([k, v]) => (
            <span key={k}>
              {k}: <span style={{ color: DIM }}>{v}</span>
            </span>
          ))}
        </span>
        <Link to="/projects" className="inline-flex items-center gap-1.5 hover:text-white">
          <ArrowLeftIcon size={12} /> Back to projects
        </Link>
      </footer>
    </div>
  );
};

export default GalleryProjectPage;
