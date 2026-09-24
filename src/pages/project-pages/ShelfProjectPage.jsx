import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeftIcon, ArrowUpRightIcon, CheckIcon, CopyIcon, GithubLogoIcon, LockKeyIcon, PlayIcon } from '@phosphor-icons/react';
import { useAppConfig, useThemeFonts, AppLoading, AppMissing, AppSeo } from './app-shell';

/* ============================================================
 * "shelf" — Cogas, the library behind the tape.
 *
 * Built from screenshots of Cogas running, not from guesses. What
 * makes Cogas Cogas: a saturated sidebar with a serif COGAS and a
 * cog-shaped C; a pale canvas one step lighter; cover tiles that
 * games you own but have not installed wear yellow caution tape
 * across, which lifts off when you point at them; score badges and
 * a green READY glow; and nine palettes that recolour the lot.
 *
 * So: the hero is a wall of taped-off covers drifting past, and the
 * tape really falls away under your pointer. The whole page is a
 * chameleon — pick a palette and every surface takes its real
 * tokens while the screenshot swaps to the app in that palette.
 * Covers on the wall are generated; the screenshots are real.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,500;1,700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';

const SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };
const SANS = { fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" };
const MONO = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

// Straight from Cogas's App.axaml.
const TAPE = '#F5C400';
const TAPE_CROSS = '#D9A800';
const TAPE_INK = '#12100B';
const SCRIM = 'rgba(136,141,134,0.55)';
const READY = '#22C55E';

const light = (hex) => {
  const h = (hex || '#000').replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150;
};

const Rise = ({ children, className = '', delay = 0 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
};

/* ---------- the cog-C, from Assets/cog-c.svg, tinted ---------- */

const CogMark = ({ color, size = 28 }) => (
  <span
    aria-hidden
    className="inline-block shrink-0"
    style={{
      width: size,
      height: size,
      background: color,
      WebkitMask: 'url(/images/projects/cogas/cog-c.svg) center / contain no-repeat',
      mask: 'url(/images/projects/cogas/cog-c.svg) center / contain no-repeat',
    }}
  />
);

const Wordmark = ({ P, size = 22 }) => (
  <span className="inline-flex items-center gap-2.5">
    <CogMark color={P.hi} size={size * 1.25} />
    <span className="font-bold" style={{ ...SERIF, fontSize: size, letterSpacing: '0.18em', color: light(P.sidebar) ? '#132018' : '#FFFFFF' }}>
      COGAS
    </span>
  </span>
);

/* ---------- a cover tile, dressed exactly as the app dresses it ---------- */

const GAMES = [
  ['HOLLOW PINES', 150, 88, 'Metacritic', true],
  ['SIGNAL FIRE', 18, 81, 'OpenCritic', false],
  ['PAPER ATLAS', 44, 90, 'Metacritic', true],
  ['NIGHT FERRY', 222, 77, 'OpenCritic', false],
  ['IRON ORCHARD', 350, 72, 'Metacritic', false],
  ['TIDEWRIGHT', 190, 86, 'Metacritic', true],
  ['MOONLIT RELAY', 280, 69, 'OpenCritic', false],
  ['LANTERN KEEP', 32, 92, 'Metacritic', false],
  ['FROSTLINE', 205, 84, 'OpenCritic', true],
  ['QUIET HARBOR', 170, 83, 'Metacritic', false],
  ['BRASS MERIDIAN', 38, 79, 'OpenCritic', false],
  ['STATIC BLOOM', 310, 88, 'Metacritic', true],
  ['SALT & EMBER', 12, 75, 'OpenCritic', false],
  ['GLASS ORBIT', 260, 91, 'Metacritic', false],
  ['UNDERTOW', 200, 66, 'OpenCritic', false],
  ['KITE WARS', 90, 80, 'Metacritic', true],
];

const DEMO = GAMES.slice(0, 8);

const scoreInk = (n) => (n >= 85 ? '#22C55E' : n >= 75 ? '#84CC16' : n >= 60 ? '#F59E0B' : '#EF4444');

const Tape = ({ gone, reduce }) => (
  <AnimatePresence>
    {!gone && (
      <motion.div key="tape" className="absolute inset-0 pointer-events-none overflow-hidden rounded-[8px]" exit={reduce ? { opacity: 0 } : { y: 70, rotate: 14, opacity: 0 }} transition={{ duration: 0.45, ease: [0.5, 0, 0.8, 0.4] }}>
        <div className="absolute inset-0" style={{ background: SCRIM }} />
        <div className="absolute left-1/2 top-[34%] -translate-x-1/2 w-[170%] h-[8%]" style={{ background: TAPE_CROSS, borderTop: `2px solid ${TAPE_INK}`, borderBottom: `2px solid ${TAPE_INK}`, transform: 'translateX(-50%) rotate(19deg)', boxShadow: '0 2px 6px rgba(0,0,0,0.55)' }} />
        <div className="absolute left-1/2 top-[52%] w-[170%] h-[10.5%] flex items-center justify-center overflow-hidden" style={{ background: TAPE, borderTop: `2px solid ${TAPE_INK}`, borderBottom: `2px solid ${TAPE_INK}`, transform: 'translateX(-50%) rotate(-9deg)', boxShadow: '0 3px 8px rgba(0,0,0,0.65)' }}>
          <span className="whitespace-nowrap font-bold text-[clamp(7px,0.9cqw+4px,11px)]" style={{ ...SANS, color: TAPE_INK, letterSpacing: '0.12em' }}>
            NOT INSTALLED • NOT INSTALLED • NOT INSTALLED
          </span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const CoverTile = ({ game, P, forceOpen, onOpen }) => {
  const [title, hue, score, critic, installed] = game;
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const open = installed || hover || forceOpen;
  return (
    <div
      className="relative aspect-[2/3] rounded-[10px] overflow-hidden transition-shadow"
      style={{ containerType: 'inline-size', border: `3px solid ${open && !installed ? READY : '#1B2231'}`, boxShadow: open && !installed ? `0 0 16px ${READY}66` : '0 14px 28px -12px rgba(0,0,0,0.55)', background: '#1B2231' }}
      onPointerEnter={() => {
        setHover(true);
        onOpen?.();
      }}
      onPointerLeave={() => setHover(false)}
    >
      <div className="absolute inset-0" style={{ background: `linear-gradient(165deg, hsl(${hue} 62% 56%), hsl(${(hue + 30) % 360} 55% 30%) 55%, hsl(${(hue + 50) % 360} 60% 12%))` }} />
      <svg viewBox="0 0 100 150" className="absolute inset-0 w-full h-full" aria-hidden preserveAspectRatio="none">
        <circle cx={28 + (hue % 44)} cy={44} r={22} fill={`hsl(${(hue + 190) % 360} 80% 78%)`} opacity="0.45" />
        <path d={`M0 ${100 - (hue % 16)} Q 50 ${76 + (hue % 22)} 100 ${96 - (hue % 10)} L100 150 L0 150 Z`} fill={`hsl(${hue} 45% 10%)`} opacity="0.75" />
      </svg>
      <p className="absolute inset-x-0 bottom-[16%] px-[8%] text-center font-extrabold leading-[0.95] text-white" style={{ ...SERIF, fontSize: 'clamp(10px, 9cqw, 22px)', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
        {title}
      </p>
      <span className="absolute top-[5%] left-[5%] flex items-center rounded-[4px] overflow-hidden text-[clamp(6px,5cqw,10px)] font-bold" style={{ background: 'rgba(24,34,29,0.9)', border: `1px solid ${scoreInk(score)}` }}>
        <span className="px-[0.5em] py-[0.2em]" style={{ background: scoreInk(score), color: '#0B130F' }}>
          {score}
        </span>
        <span className="px-[0.5em] text-white">{critic}</span>
      </span>
      {open && (
        <span className="absolute top-[5%] right-[5%] px-[0.6em] py-[0.2em] rounded-[4px] text-[clamp(6px,5cqw,10px)] font-bold" style={{ background: 'rgba(12,24,16,0.9)', color: READY, border: `1px solid ${READY}` }}>
          ● READY
        </span>
      )}
      <span className="absolute left-[5%] bottom-[4%] px-[0.6em] py-[0.15em] rounded-[4px] text-[clamp(6px,5cqw,10px)] font-bold" style={{ background: '#66C0F4', color: '#0B1B2A' }}>
        Steam
      </span>
      <Tape gone={open} reduce={reduce} />
      {P && null}
    </div>
  );
};

/* ---------- hero wall: three columns drifting at different speeds ---------- */

const TileWall = ({ P }) => {
  const reduce = useReducedMotion();
  const cols = [0, 1, 2, 3];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden style={{ perspective: 1400 }}>
      <div className="absolute inset-[-20%_-10%_-20%_32%] flex gap-4 md:gap-5" style={{ transform: 'rotateX(18deg) rotateZ(-12deg) rotateY(-10deg)', transformOrigin: 'center' }}>
        {cols.map((c) => {
          const list = [...GAMES.slice(c * 4), ...GAMES.slice(0, c * 4)];
          return (
            <motion.div key={c} className="flex flex-col gap-4 md:gap-5 w-[150px] md:w-[190px] shrink-0" animate={reduce ? undefined : { y: c % 2 ? ['-50%', '0%'] : ['0%', '-50%'] }} transition={{ duration: 60 + c * 12, repeat: Infinity, ease: 'linear' }}>
              {[...list, ...list].map((g, i) => (
                <div key={i} className="pointer-events-auto">
                  <CoverTile game={g} P={P} />
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- the palette ripple: new colours bloom from the click ---------- */

const Ripple = ({ ripple }) => (
  <AnimatePresence>
    {ripple && (
      <motion.div
        key={ripple.id}
        className="fixed inset-0 z-[60] pointer-events-none"
        style={{ background: ripple.color }}
        initial={{ clipPath: `circle(0px at ${ripple.x}px ${ripple.y}px)`, opacity: 0.95 }}
        animate={{ clipPath: `circle(150vmax at ${ripple.x}px ${ripple.y}px)`, opacity: [0.95, 0.95, 0] }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], opacity: { times: [0, 0.55, 1], duration: 0.9 } }}
      />
    )}
  </AnimatePresence>
);

/* ---------- small parts ---------- */

const CopyChip = ({ text, P }) => {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(text).then(() => {
          setOk(true);
          window.setTimeout(() => setOk(false), 1200);
        })
      }
      className="shrink-0 w-8 h-8 rounded-[6px] flex items-center justify-center"
      style={{ border: `1px solid ${P.line}`, color: ok ? READY : P.muted }}
      aria-label={`Copy ${text}`}
    >
      {ok ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
    </button>
  );
};

const Eyebrow = ({ children, P }) => (
  <p className="text-[11.5px] font-bold tracking-[0.14em] uppercase" style={{ ...SANS, color: P.hi }}>
    {children}
  </p>
);

/* ============================================================ */

const ShelfProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'shelf');
  const [key, setKey] = useState('orchid-dusk');
  const [ripple, setRipple] = useState(null);
  const [shot, setShot] = useState(0);
  const [peeled, setPeeled] = useState(() => new Set());
  const [installing, setInstalling] = useState(false);
  const rippleTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(rippleTimer.current), []);

  if (loading) return <AppLoading />;
  if (failed || !cfg?.palettes) return <AppMissing background="#F7F0F8" color="#241F3D" />;

  const P = cfg.palettes.find((p) => p.key === key) || cfg.palettes[0];
  const sideInk = light(P.sidebar) ? '#132018' : '#FFFFFF';
  const sideDim = light(P.sidebar) ? 'rgba(19,32,24,0.65)' : 'rgba(255,255,255,0.68)';
  const onHi = light(P.hi) ? '#14140F' : '#FFFFFF';
  const card = { background: P.surface, border: `1px solid ${P.line}` };
  const pick = (p, e) => {
    if (p.key === key) return;
    const r = e.currentTarget.getBoundingClientRect();
    setRipple({ id: Date.now(), color: p.sidebar, x: r.left + r.width / 2, y: r.top + r.height / 2 });
    window.setTimeout(() => setKey(p.key), 380);
    window.clearTimeout(rippleTimer.current);
    rippleTimer.current = window.setTimeout(() => setRipple(null), 1000);
  };
  const tone = 'transition-colors duration-500';

  return (
    <div className={`min-h-screen overflow-x-clip ${tone}`} style={{ background: P.bg, color: P.text, ...SANS }}>
      <AppSeo cfg={cfg} project={project} />
      <Ripple ripple={ripple} />

      {/* ---------- header, as the app's sidebar ---------- */}
      <header className={`sticky top-0 z-40 ${tone}`} style={{ background: P.sidebar }}>
        <div className="mx-auto max-w-[1320px] h-16 px-4 sm:px-8 flex items-center gap-5">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: sideDim }}>
            <ArrowLeftIcon size={14} />
            <span className="hidden sm:inline">Projects</span>
          </Link>
          <Wordmark P={P} size={19} />
          <span className="hidden md:inline text-[10px] font-bold tracking-[0.2em]" style={{ color: sideDim }}>
            UNIFIED LAUNCHER
          </span>
          <nav className="ml-auto hidden lg:flex gap-6 text-[13.5px] font-semibold" style={{ color: sideDim }}>
            {[
              ['#tape', 'The tape'],
              ['#palettes', 'Palettes'],
              ['#stores', 'Stores'],
              ['#setup', 'Setup'],
            ].map(([h, l]) => (
              <a key={h} href={h} className="hover:opacity-100" style={{ color: sideInk, opacity: 0.8 }}>
                {l}
              </a>
            ))}
          </nav>
          <a href={cfg.download} target="_blank" rel="noopener noreferrer" className="ml-auto lg:ml-2 h-10 px-4 rounded-[8px] inline-flex items-center text-[13.5px] font-bold" style={{ background: P.hi, color: onHi }}>
            Download
          </a>
        </div>
      </header>

      {/* ---------- hero: the wall behind the tape ---------- */}
      <section className={`relative overflow-hidden ${tone}`} style={{ background: P.sidebar, color: sideInk }}>
        <TileWall P={P} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(90deg, ${P.sidebar} 0%, ${P.sidebar} 34%, ${P.sidebar}CC 48%, ${P.sidebar}00 72%)` }} />
        <div className="absolute inset-0 pointer-events-none md:hidden" style={{ background: `${P.sidebar}C7` }} />
        <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none" style={{ background: `linear-gradient(180deg, ${P.sidebar}00, ${P.sidebar})` }} />
        <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8 pt-20 md:pt-28 pb-28 md:pb-40 pointer-events-none">
          <Rise className="max-w-[560px]">
            <span className="inline-flex items-center gap-2 h-8 px-3 rounded-full text-[12px] font-bold" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: sideInk }}>
              <span className="w-2 h-2 rounded-full" style={{ background: READY }} /> v{cfg.version} · launches without freezing
            </span>
            <h1 className="mt-7 font-bold leading-[0.95] tracking-[-0.02em]" style={{ ...SERIF, fontSize: 'clamp(50px, 7.4vw, 104px)' }}>
              Every game
              <br />
              you own.
              <br />
              <em style={{ color: P.hi }}>One shelf.</em>
            </h1>
            <p className="mt-7 text-[17px] md:text-[19px] leading-[1.55]" style={{ color: sideDim }}>
              Cogas reads what Steam, Epic, GOG, Ubisoft, Battle.net, EA and the Microsoft Store already wrote to disk and puts it all in one cover grid. The ones you own but haven’t installed get taped off — point at one.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 pointer-events-auto">
              <a href={cfg.download} target="_blank" rel="noopener noreferrer" className="h-12 px-6 rounded-[8px] inline-flex items-center gap-2 text-[14.5px] font-bold transition-transform hover:-translate-y-0.5" style={{ background: P.hi, color: onHi }}>
                <PlayIcon size={15} weight="fill" /> {cfg.downloadLabel}
              </a>
              <a href={cfg.repo} target="_blank" rel="noopener noreferrer" className="h-12 px-6 rounded-[8px] inline-flex items-center gap-2 text-[14.5px] font-semibold" style={{ border: '1px solid rgba(255,255,255,0.35)', color: sideInk, background: 'rgba(0,0,0,0.12)' }}>
                <GithubLogoIcon size={16} /> Source
              </a>
            </div>
          </Rise>
        </div>
      </section>

      {/* ---------- the real app, big ---------- */}
      <section className="relative -mt-16 md:-mt-24 px-4 sm:px-8">
        <Rise className="mx-auto max-w-[1180px]">
          <div className="relative rounded-[18px] overflow-hidden" style={{ boxShadow: '0 60px 120px -40px rgba(0,0,0,0.55)', border: `1px solid ${P.line}` }}>
            {cfg.shots.map((s, i) => (
              <img key={s.src} src={s.src} alt={`Cogas — ${s.cap}`} loading={i ? 'lazy' : 'eager'} className={`w-full h-auto block transition-opacity duration-700 ${i === 0 ? 'relative' : 'absolute inset-0'}`} style={{ opacity: i === shot ? 1 : 0 }} />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {cfg.shots.map((s, i) => (
              <button key={s.src} type="button" onClick={() => setShot(i)} aria-pressed={i === shot} className="h-9 px-4 rounded-[8px] text-[13px] font-semibold transition-colors" style={i === shot ? { background: P.accent, color: P.onAccent } : { ...card, color: P.muted }}>
                {s.cap}
              </button>
            ))}
          </div>
          <p className="mt-3 text-center text-[12.5px]" style={{ color: P.muted }}>
            Screenshots of Cogas {cfg.version} on Windows 11, in Orchid Dusk. Personal details removed.
          </p>
        </Rise>
      </section>

      {/* ---------- numbers ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 sm:px-8 pt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          ['928', 'games in one grid'],
          ['84', 'of them installed'],
          ['7', 'storefronts read from disk'],
          ['0', 'accounts needed to start'],
        ].map(([v, l], i) => (
          <Rise key={l} delay={i * 0.06}>
            <p className="font-bold leading-none" style={{ ...SERIF, fontSize: 'clamp(56px, 7vw, 92px)', color: i === 0 ? P.hi : P.text }}>
              {v}
            </p>
            <p className="mt-3 text-[14px] font-semibold" style={{ color: P.muted }}>
              {l}
            </p>
          </Rise>
        ))}
      </section>

      {/* ---------- the tape ---------- */}
      <section id="tape" className="mx-auto max-w-[1180px] px-4 sm:px-8 pt-28 md:pt-36 scroll-mt-20">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center [&>*]:min-w-0">
          <Rise>
            <Eyebrow P={P}>Owned versus installed</Eyebrow>
            <h2 className="mt-4 font-bold leading-[1.02] tracking-[-0.02em]" style={{ ...SERIF, fontSize: 'clamp(38px, 5vw, 64px)' }}>
              Taped off, <em>not forgotten.</em>
            </h2>
            <p className="mt-6 text-[16.5px] leading-[1.7]" style={{ color: P.muted }}>
              Connect Steam, GOG and Epic and the games you own but haven’t installed join the grid under a grey veil and a strip of caution tape — wider than the tile on purpose, so its ends run off the edge the way real tape runs off a doorframe. Point at one and the tape comes away.
            </p>
            <p className="mt-4 text-[14px] leading-[1.6]" style={{ ...MONO, color: P.muted }}>
              {peeled.size} of {DEMO.filter((g) => !g[4]).length} tapes lifted
            </p>
            <button
              type="button"
              onClick={() => {
                setInstalling(true);
                window.setTimeout(() => setInstalling(false), 2600);
              }}
              className="mt-6 h-11 px-5 rounded-[8px] inline-flex items-center gap-2 text-[14px] font-bold"
              style={{ background: P.accent, color: P.onAccent }}
            >
              <PlayIcon size={14} weight="fill" /> {installing ? 'Installing…' : 'Install everything'}
            </button>
          </Rise>
          <Rise delay={0.08}>
            <div className="grid grid-cols-4 gap-3 md:gap-4 p-4 md:p-6 rounded-[18px]" style={{ ...card }}>
              {DEMO.map((g) => (
                <CoverTile key={g[0]} game={g} P={P} forceOpen={installing} onOpen={() => !g[4] && setPeeled((prev) => new Set(prev).add(g[0]))} />
              ))}
            </div>
          </Rise>
        </div>
      </section>

      {/* ---------- palettes: the page is a chameleon ---------- */}
      <section id="palettes" className="mx-auto max-w-[1180px] px-4 sm:px-8 pt-28 md:pt-36 scroll-mt-20">
        <Rise className="max-w-[760px]">
          <Eyebrow P={P}>Settings › Appearance &amp; Palettes</Eyebrow>
          <h2 className="mt-4 font-bold leading-[1.02] tracking-[-0.02em]" style={{ ...SERIF, fontSize: 'clamp(38px, 5vw, 64px)' }}>
            Nine palettes. <em>Pick one — this page will change.</em>
          </h2>
          <p className="mt-6 text-[16.5px] leading-[1.7]" style={{ color: P.muted }}>
            Each pairs a saturated sidebar with a canvas a clear step lighter. These cards are the app’s own, colours and words included, and the screenshot beside them is Cogas really wearing each one.
          </p>
        </Rise>
        <div className="mt-12 grid lg:grid-cols-[1fr_1.25fr] gap-6 items-start [&>*]:min-w-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {cfg.palettes.map((p) => {
              const on = p.key === key;
              return (
                <button key={p.key} type="button" onClick={(e) => pick(p, e)} aria-pressed={on} className="text-left rounded-[12px] p-4 transition-all hover:-translate-y-0.5" style={{ background: on ? P.surface : `${P.surface}B3`, border: `1.5px solid ${on ? P.hi : P.line}`, boxShadow: on ? `0 12px 30px -16px ${P.hi}` : 'none' }}>
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-[10.5px] font-bold tracking-[0.06em] px-2 py-0.5 rounded-[5px]" style={{ background: P.bg, border: `1px solid ${P.line}`, color: P.text }}>
                      {p.label}
                    </span>
                    <span className="flex gap-1.5">
                      {[p.sidebar, p.hi, p.bg].map((c, i) => (
                        <span key={i} className="w-4 h-4 rounded-full" style={{ background: c, boxShadow: `inset 0 0 0 1px ${P.line}` }} />
                      ))}
                    </span>
                  </span>
                  <span className="mt-3 block text-[15px] font-bold">{p.name}</span>
                  <span className="mt-1 block text-[12.5px] leading-[1.5]" style={{ color: P.muted }}>
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="lg:sticky lg:top-24">
            <div className="relative rounded-[16px] overflow-hidden" style={{ boxShadow: '0 50px 100px -40px rgba(0,0,0,0.5)', border: `1px solid ${P.line}` }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img key={P.shot} src={P.shot} alt={`Cogas settings in ${P.name}`} className="w-full h-auto block" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
              </AnimatePresence>
            </div>
            <p className="mt-3 text-[12.5px] text-center" style={{ color: P.muted }}>
              Cogas in {P.name}
              {P.dark ? ' — one of the two dark palettes' : ''}.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- stores ---------- */}
      <section id="stores" className={`mt-28 md:mt-36 py-24 md:py-32 scroll-mt-16 ${tone}`} style={{ background: P.sidebar, color: sideInk }}>
        <div className="mx-auto max-w-[1180px] px-4 sm:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 [&>*]:min-w-0">
          <Rise>
            <p className="text-[11.5px] font-bold tracking-[0.14em] uppercase" style={{ color: P.hi }}>
              How it finds them
            </p>
            <h2 className="mt-4 font-bold leading-[1.02] tracking-[-0.02em]" style={{ ...SERIF, fontSize: 'clamp(38px, 5vw, 64px)' }}>
              It never asks a launcher <em>what you own.</em>
            </h2>
            <p className="mt-6 text-[16.5px] leading-[1.7]" style={{ color: sideDim }}>
              {cfg.summary[0]}
            </p>
            <p className="mt-6 text-[14.5px] leading-[1.6]" style={{ color: sideDim }}>
              Each game launches through its own platform, so overlays, achievements and cloud saves keep working. Store colours are identity, not theme — they never change with the palette.
            </p>
          </Rise>
          <div className="grid gap-2.5">
            {cfg.platforms.map((p, i) => (
              <Rise key={p.key} delay={i * 0.04}>
                <div className="rounded-[12px] p-4 grid sm:grid-cols-[120px_1fr] gap-3 items-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <span className="h-8 px-3 rounded-[6px] inline-flex items-center gap-2 text-[13px] font-bold w-fit" style={{ background: p.ink, color: light(p.ink) ? '#0B1B2A' : '#fff' }}>
                    {p.name}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] leading-[1.5]" style={{ color: sideInk }}>
                      {p.reads}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="flex-1 min-w-0 truncate text-[11.5px] h-8 px-3 rounded-[6px] inline-flex items-center" style={{ ...MONO, background: 'rgba(0,0,0,0.25)', color: sideDim }}>
                        {p.launch}
                      </code>
                      <CopyChip text={p.launch} P={{ line: 'rgba(255,255,255,0.18)', muted: sideDim }} />
                    </div>
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- what it does ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 sm:px-8 pt-28 grid md:grid-cols-3 gap-4">
        {cfg.panels.map((p, i) => (
          <Rise key={p.title} delay={(i % 3) * 0.05} className={i === 0 || i === 4 ? 'md:col-span-2' : ''}>
            <div className="h-full rounded-[16px] p-7" style={card}>
              <span className="text-[12px] font-bold" style={{ ...MONO, color: P.hi }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-[26px] font-bold leading-[1.1]" style={SERIF}>
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: P.muted }}>
                {p.body}
              </p>
            </div>
          </Rise>
        ))}
      </section>

      {/* ---------- 0.17 launch ---------- */}
      {cfg.startup && (
        <section className="mx-auto max-w-[1180px] px-4 sm:px-8 pt-28 md:pt-36">
          <div className="rounded-[22px] p-7 md:p-12 grid lg:grid-cols-[1fr_1.2fr] gap-10 [&>*]:min-w-0" style={card}>
            <Rise>
              <Eyebrow P={P}>{cfg.startup.eyebrow}</Eyebrow>
              <h2 className="mt-4 font-bold leading-[1.05]" style={{ ...SERIF, fontSize: 'clamp(32px, 4vw, 50px)' }}>
                {cfg.startup.title}
              </h2>
              <p className="mt-5 text-[15.5px] leading-[1.7]" style={{ color: P.muted }}>
                {cfg.startup.body}
              </p>
            </Rise>
            <Rise delay={0.08}>
              {[
                ['Before', cfg.startup.before, 'window after ~1.7 s, then 0.5 s frozen'],
                ['0.17.0', cfg.startup.after, 'window paints at once'],
              ].map(([label, list, note]) => {
                const total = 2200;
                return (
                  <div key={label} className="mb-7">
                    <div className="flex justify-between text-[13px] font-semibold">
                      <span>{label}</span>
                      <span style={{ color: P.muted }}>{note}</span>
                    </div>
                    <div className="mt-2 flex h-11 rounded-[10px] overflow-hidden" style={{ background: P.bg, border: `1px solid ${P.line}` }}>
                      {list.map((seg, i) => (
                        <motion.div key={seg.label} className="h-full flex items-center px-2 text-[11px] font-semibold overflow-hidden whitespace-nowrap" style={{ background: seg.frozen ? '#BE123C' : seg.bg ? `${P.hi}33` : i === 0 && label !== 'Before' ? READY : P.sidebar, color: seg.bg ? P.text : '#fff', borderRight: `2px solid ${P.bg}` }} initial={{ width: 0 }} whileInView={{ width: `${(seg.ms / total) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.25 }} title={`${seg.label} — ${seg.ms} ms`}>
                          {seg.label}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <ul className="grid gap-2">
                {cfg.startup.notes.map((n) => (
                  <li key={n} className="flex gap-2.5 text-[14px]">
                    <CheckIcon size={15} weight="bold" color={P.hi} className="shrink-0 mt-0.5" /> {n}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </section>
      )}

      {/* ---------- setup ---------- */}
      {cfg.setup && (
        <section id="setup" className="mx-auto max-w-[1180px] px-4 sm:px-8 pt-28 md:pt-36 scroll-mt-20">
          <Rise>
            <Eyebrow P={P}>Setting it up</Eyebrow>
            <h2 className="mt-4 font-bold leading-[1.02]" style={{ ...SERIF, fontSize: 'clamp(38px, 5vw, 64px)' }}>
              Launch it. <em>That’s the setup.</em>
            </h2>
          </Rise>
          <ol className="mt-12 grid md:grid-cols-5 gap-3">
            {cfg.setup.map((s, i) => (
              <Rise key={s.step} delay={i * 0.05}>
                <li className="h-full rounded-[14px] p-5 flex flex-col" style={i === 0 ? { background: P.sidebar, color: sideInk } : card}>
                  <span className="text-[28px] font-bold" style={{ ...SERIF, color: P.hi }}>
                    {i + 1}
                  </span>
                  <p className="mt-3 text-[15.5px] font-bold leading-tight">{s.step}</p>
                  <p className="mt-2 text-[13.5px] leading-[1.55] flex-1" style={{ color: i === 0 ? sideDim : P.muted }}>
                    {s.body}
                  </p>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold">
                      {s.need} <ArrowUpRightIcon size={12} />
                    </a>
                  ) : (
                    <span className="mt-4 text-[13px] font-bold">{s.need}</span>
                  )}
                </li>
              </Rise>
            ))}
          </ol>
        </section>
      )}

      {/* ---------- privacy + build ---------- */}
      <section className="mx-auto max-w-[1180px] px-4 sm:px-8 pt-6 pb-28 grid lg:grid-cols-2 gap-4 [&>*]:min-w-0">
        <Rise>
          <div className="h-full rounded-[16px] p-8" style={card}>
            <LockKeyIcon size={34} weight="duotone" color={P.hi} />
            <h3 className="mt-5 text-[28px] font-bold" style={SERIF}>
              Private by design.
            </h3>
            <p className="mt-3 text-[15px] leading-[1.65]" style={{ color: P.muted }}>
              {cfg.summary[1]}
            </p>
          </div>
        </Rise>
        {cfg.terminal && (
          <Rise delay={0.06}>
            <div className="h-full rounded-[16px] overflow-hidden" style={{ background: '#14140F', color: '#F2ECE0' }}>
              <div className="h-11 px-5 flex items-center text-[12px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(242,236,224,0.6)' }}>
                {cfg.terminal.caption} — build it yourself
              </div>
              <pre className="m-0 p-6 overflow-x-auto text-[13px] leading-[2]" style={MONO}>
                {cfg.terminal.lines.map((l) => {
                  const [c, n] = l.split(/\s{2,}#\s?/);
                  return (
                    <div key={l}>
                      <span style={{ color: P.hi }}>PS&gt;</span> {c}
                      {n && <span style={{ color: 'rgba(242,236,224,0.45)' }}> # {n}</span>}
                    </div>
                  );
                })}
              </pre>
            </div>
          </Rise>
        )}
      </section>

      {/* ---------- footer ---------- */}
      <footer className={tone} style={{ background: P.sidebar, color: sideInk }}>
        <div className="mx-auto max-w-[1180px] px-4 sm:px-8 py-16">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Wordmark P={P} size={40} />
              <p className="mt-5 max-w-[46ch] text-[15.5px]" style={{ color: sideDim }}>
                {cfg.tagline} Seven storefronts, one grid, every game launched through its own platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={cfg.download} target="_blank" rel="noopener noreferrer" className="h-12 px-6 rounded-[8px] inline-flex items-center text-[14.5px] font-bold" style={{ background: P.hi, color: onHi }}>
                {cfg.downloadLabel}
              </a>
              <Link to="/projects/airlift" className="h-12 px-6 rounded-[8px] inline-flex items-center text-[14.5px] font-semibold" style={{ border: '1px solid rgba(255,255,255,0.35)', color: sideInk }}>
                Also in Airlift
              </Link>
            </div>
          </div>
          <dl className="mt-12 pt-8 grid grid-cols-2 md:grid-cols-6 gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.16)' }}>
            {cfg.colophon.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10.5px] font-bold tracking-[0.12em] uppercase" style={{ color: sideDim }}>
                  {k}
                </dt>
                <dd className="mt-1.5 text-[13.5px] break-words">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap justify-between gap-3 text-[12.5px]" style={{ color: sideDim }}>
            <span>
              {cfg.name} v{cfg.version} · MIT · © Fezcode
            </span>
            <Link to="/projects" className="inline-flex items-center gap-1.5">
              <ArrowLeftIcon size={12} /> Back to projects
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShelfProjectPage;
