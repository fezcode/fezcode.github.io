import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CodeIcon,
  GithubLogoIcon,
  HouseIcon,
  LockSimpleIcon,
  SealCheckIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react';
import {
  useAppConfig,
  useThemeFonts,
  AppLoading,
  AppMissing,
  AppSeo,
} from './app-shell';

/* ============================================================
 * "bentos" — a product launch page.
 *
 * Modelled on the long-form OS landing pages that alternate light
 * and dark bands: a soft pastel hero with a device frame, a dark
 * bento grid of mixed tiles, category tabs over a sliding card
 * track, snap carousels of screenshots, comparison cards, a
 * masonry wall and a coloured footer. Every word and picture comes
 * from /projects/<slug>/app.txt; this file only lays it out.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Style+Script&family=Instrument+Serif:ital@0;1&display=swap';

const INK = '#0E120B';
const PAPER = '#F6F7F2';
const MUTE = '#5C6457';
const LINE = 'rgba(14,18,11,0.10)';
const NIGHT = '#030403';

const SANS = { fontFamily: "'Manrope', system-ui, sans-serif" };
const SCRIPT = { fontFamily: "'Style Script', cursive" };
const SERIF = { fontFamily: "'Instrument Serif', Georgia, serif" };

const CSS = `
.bt-root { --gut: max(16px, calc((100vw - 1232px) / 2)); }
.bt-wrap { padding-inline: var(--gut); }
.bt-rail { scrollbar-width: none; scroll-padding-inline: var(--gut); padding-inline: var(--gut); }
.bt-rail::-webkit-scrollbar { display: none; }
.bt-sec { scroll-margin-top: 96px; }
.bt-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 150px; grid-auto-flow: dense; gap: 14px; }
.bt-tile { grid-column: span var(--cm); grid-row: span var(--r); }
@media (min-width: 960px) {
  .bt-grid { grid-template-columns: repeat(12, minmax(0, 1fr)); grid-auto-rows: 166px; gap: 24px; }
  .bt-tile { grid-column: span var(--c); }
}
@keyframes bt-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes bt-blink { 0%,100% { opacity: var(--o) } 50% { opacity: calc(var(--o) * 0.25) } }
@keyframes bt-caret { 50% { opacity: 0 } }
`;

/* ---------- small helpers ---------- */

const isInternal = (href = '') => href.startsWith('/') && !href.startsWith('//');

const Go = ({ href, children, className = '', style, ...rest }) => {
  if (!href) return <span className={className} style={style}>{children}</span>;
  if (isInternal(href))
    return (
      <Link to={href} className={className} style={style} {...rest}>
        {children}
      </Link>
    );
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={className}
      style={style}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
};

const Reveal = ({ children, className = '', delay = 0, style }) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

const Eyebrow = ({ children, color, className = '' }) => (
  <p className={`text-[15px] font-semibold ${className}`} style={{ color }}>
    {children}
  </p>
);

const Pill = ({ href, children, tone = 'dark', size = 'md', className = '' }) => {
  const tones = {
    dark: { background: '#20291C', color: '#D7F59A', boxShadow: '0 10px 30px -10px rgba(32,41,28,0.7)' },
    light: { background: '#ECEDE8', color: INK, border: `1px solid ${LINE}` },
    white: { background: '#FFFFFF', color: INK },
    ghost: { background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.16)' },
    lime: { background: '#D7F59A', color: '#25311C' },
  };
  const sizes = { sm: 'h-9 px-4 text-[13.5px]', md: 'h-11 px-5 text-[14.5px]', lg: 'h-[52px] px-6 text-[15.5px]' };
  return (
    <Go
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-transform hover:-translate-y-0.5 ${sizes[size]} ${className}`}
      style={tones[tone]}
    >
      {children}
    </Go>
  );
};

/* ---------- horizontal snap rail with dots + arrows ---------- */

const Rail = ({ items, render, dark = false, pill = false, gap = 20 }) => {
  const ref = useRef(null);
  const lock = useRef(null);
  const [stops, setStops] = useState([0]);
  const [active, setActive] = useState(0);

  /* The places the rail can actually come to rest. The last few cards can
   * never scroll to the left edge, so their offsets collapse onto the
   * maximum scroll; stops closer than a third of a card are merged, keeping
   * the later one, so every dot and arrow press visibly moves the rail. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      if (!el.children.length) return;
      const first = el.children[0].offsetLeft;
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      const min = el.children[0].offsetWidth / 3;
      const next = [];
      [...el.children].forEach((kid) => {
        const at = Math.min(kid.offsetLeft - first, max);
        if (next.length && at - next[next.length - 1] < min) next[next.length - 1] = at;
        else next.push(at);
      });
      if (next.length > 1 && next[0] !== 0) next[0] = 0;
      setStops(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  const nearest = (left) => {
    const el = ref.current;
    if (el && left >= el.scrollWidth - el.clientWidth - 2) return stops.length - 1;
    let best = 0;
    stops.forEach((at, i) => {
      if (Math.abs(at - left) < Math.abs(stops[best] - left)) best = i;
    });
    return best;
  };

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    // While an arrow/dot animation runs, keep the dot on its destination so a
    // second quick press advances from there instead of from the midpoint.
    if (lock.current !== null) {
      if (Math.abs(el.scrollLeft - stops[lock.current]) > 2) return;
      lock.current = null;
    }
    setActive(nearest(el.scrollLeft));
  };

  const go = (n) => {
    const el = ref.current;
    if (!el) return;
    const i = Math.max(0, Math.min(stops.length - 1, n));
    lock.current = i;
    setActive(i);
    el.scrollTo({ left: stops[i], behavior: 'smooth' });
    // Release the lock even if the browser lands a pixel off the target.
    window.setTimeout(() => {
      if (lock.current === i) {
        lock.current = null;
        setActive(nearest(el.scrollLeft));
      }
    }, 900);
  };

  const fg = dark ? '#FFFFFF' : INK;
  const off = dark ? 'rgba(255,255,255,0.3)' : 'rgba(14,18,11,0.2)';
  const current = Math.min(active, stops.length - 1);

  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="bt-rail flex overflow-x-auto snap-x snap-mandatory"
        style={{ gap }}
      >
        {items.map((item, i) => (
          <div key={i} className="snap-start shrink-0">
            {render(item, i)}
          </div>
        ))}
      </div>
      {stops.length > 1 && (
        <div className="bt-wrap mt-8 flex items-center justify-between">
          <div
            className={`flex items-center gap-2 ${pill ? 'rounded-full px-4 h-10' : ''}`}
            style={pill ? { border: `1px solid ${off}`, background: dark ? 'rgba(255,255,255,0.06)' : '#fff' } : undefined}
          >
            {stops.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === current}
                onClick={() => go(i)}
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: i === current ? (pill ? 40 : 22) : 8, background: i === current ? fg : off }}
              />
            ))}
          </div>
          <div className="flex gap-3">
            {[
              [CaretLeftIcon, current - 1, 'Previous', current === 0],
              [CaretRightIcon, current + 1, 'Next', current === stops.length - 1],
            ].map(([Icon, n, label, disabled]) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                disabled={disabled}
                onClick={() => go(n)}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-opacity disabled:cursor-default"
                style={{ border: `1px solid ${off}`, color: fg, opacity: disabled ? 0.3 : 1 }}
              >
                <Icon size={16} weight="bold" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- header: announcement + sub-nav that follows the band tone ---------- */

const Header = ({ cfg, tone }) => {
  const dark = tone === 'dark';
  const fg = dark ? '#F3F5EF' : INK;
  const bar = dark ? 'rgba(3,4,3,0.72)' : 'rgba(246,247,242,0.78)';
  const edge = dark ? 'rgba(255,255,255,0.10)' : LINE;
  return (
    <header className="sticky top-0 z-40" style={{ ...SANS }}>
      {cfg.announcement && (
        <Go
          href={cfg.announcement.href}
          className="flex items-center justify-center gap-3 px-4 h-10 text-[13px] transition-colors"
          style={{ background: bar, color: fg, borderBottom: `1px solid ${edge}`, backdropFilter: 'blur(14px)' }}
        >
          <span
            className="px-2.5 py-0.5 rounded-full text-[11.5px] font-bold whitespace-nowrap"
            style={{ background: '#D7F59A', color: '#25311C' }}
          >
            {cfg.announcement.badge}
          </span>
          <span className="truncate">{cfg.announcement.text}</span>
        </Go>
      )}
      <div
        className="bt-wrap flex items-center gap-4 h-14 transition-colors"
        style={{ background: bar, borderBottom: `1px solid ${edge}`, backdropFilter: 'blur(14px)' }}
      >
        <Link
          to="/projects"
          aria-label="Back to projects"
          className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center opacity-60 hover:opacity-100"
          style={{ color: fg }}
        >
          <ArrowLeftIcon size={16} weight="bold" />
        </Link>
        <a href="#top" className="flex items-center gap-2.5">
          <img src={cfg.logo} alt="" className="w-8 h-8" />
          <span className="text-[21px] font-semibold tracking-[-0.02em]" style={{ color: fg }}>
            {cfg.name}
          </span>
        </a>
        <nav className="ml-auto hidden md:flex items-center gap-7 text-[14px]" style={{ color: fg }}>
          {(cfg.nav || []).map((n) => (
            <a key={n.href} href={n.href} className="opacity-75 hover:opacity-100">
              {n.label}
            </a>
          ))}
        </nav>
        <Go
          href={cfg.repo}
          className="ml-auto md:ml-2 hidden sm:inline-flex items-center gap-2 h-9 px-3.5 rounded-full text-[13px]"
          style={{ border: `1px solid ${edge}`, color: fg }}
        >
          <GithubLogoIcon size={16} />
          <span className="opacity-80">v{cfg.version}</span>
        </Go>
        <Go
          href={cfg.download}
          className="ml-auto sm:ml-0 inline-flex items-center h-9 px-4 rounded-full text-[13.5px] font-bold transition-colors"
          style={dark ? { background: '#fff', color: INK } : { background: '#20291C', color: '#D7F59A' }}
        >
          {cfg.downloadLabel || 'Download'}
        </Go>
      </div>
    </header>
  );
};

/* ---------- hero ---------- */

const Orbit = ({ logo, icons, caption }) => {
  const spots = [
    [16, 22], [84, 22], [90, 54], [10, 54], [33, 12], [67, 12], [21, 82], [79, 82],
  ];
  return (
    <div
      className="relative w-full max-w-[560px] mx-auto aspect-[16/9] rounded-[28px] overflow-hidden"
      style={{
        background: 'radial-gradient(120% 90% at 50% 40%, #2C3A20 0%, #1A2214 55%, #0F140C 100%)',
        boxShadow: '0 40px 80px -30px rgba(32,41,28,0.55), inset 0 0 0 1px rgba(215,245,154,0.12)',
      }}
    >
      {[34, 54, 76].map((s) => (
        <div
          key={s}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: `${s}%`,
            aspectRatio: '1',
            transform: 'translate(-50%,-50%)',
            border: '1px solid rgba(215,245,154,0.14)',
          }}
        />
      ))}
      <img
        src={logo}
        alt=""
        className="absolute left-1/2 top-1/2 w-[22%]"
        style={{ transform: 'translate(-50%,-50%)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
      />
      {icons.slice(0, spots.length).map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute w-[10%] rounded-[22%]"
          style={{
            left: `${spots[i][0]}%`,
            top: `${spots[i][1]}%`,
            transform: 'translate(-50%,-50%)',
            animation: `bt-float ${5 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
            boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
          }}
        />
      ))}
      {caption && (
        <div
          className="absolute left-1/2 bottom-[9%] -translate-x-1/2 flex items-center gap-2 h-10 px-4 rounded-full text-[13.5px] font-semibold whitespace-nowrap"
          style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: '#D7F59A' }} />
          {caption}
        </div>
      )}
    </div>
  );
};

const Showcase = ({ showcase }) => {
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = showcase.themes[themeIdx];
  return (
    <div className="relative mt-14 md:mt-20">
      {/* side peeks, like the neighbouring pages of a carousel */}
      {[
        [showcase.left, 'left-0 -translate-x-[62%]'],
        [showcase.right, 'right-0 translate-x-[62%]'],
      ].map(([src, pos]) =>
        src ? (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden
            className={`hidden lg:block absolute top-[8%] w-[46%] rounded-[24px] ${pos}`}
            style={{ opacity: 0.55, filter: 'blur(2px) saturate(0.9)' }}
          />
        ) : null,
      )}
      <div
        className="relative mx-auto max-w-[1180px] rounded-[30px] p-2 md:p-2.5"
        style={{
          background: '#141712',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.7), 0 50px 100px -30px rgba(20,28,14,0.55), 0 0 0 10px rgba(255,255,255,0.55)',
        }}
      >
        <div className="flex items-center gap-3 px-3 h-9">
          <span className="flex gap-1.5">
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
          </span>
          <span
            className="mx-auto h-6 px-6 rounded-md text-[11.5px] flex items-center"
            style={{ background: '#20241D', color: '#AEB5A6' }}
          >
            <LockSimpleIcon size={11} className="mr-1.5" />
            {showcase.address}
          </span>
          <span className="w-[54px]" />
        </div>
        <div className="relative overflow-hidden rounded-[22px]" style={{ aspectRatio: '1330 / 920' }}>
          {showcase.themes.map((t, i) => (
            <img
              key={t.id}
              src={t.image}
              alt={`${t.label} theme`}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: i === themeIdx ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
      <div className="mt-7 flex justify-center">
        <div className="inline-flex p-1 rounded-full" style={{ background: '#fff', border: `1px solid ${LINE}` }}>
          {showcase.themes.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setThemeIdx(i)}
              className="flex items-center gap-2 h-9 px-4 rounded-full text-[13.5px] font-semibold transition-colors"
              style={i === themeIdx ? { background: '#20291C', color: '#fff' } : { color: MUTE }}
              aria-pressed={i === themeIdx}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: t.swatch }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        Showing the {theme.label} theme
      </p>
    </div>
  );
};

/* ---------- bento tiles ---------- */

const tileBase = 'relative h-full w-full rounded-[26px] overflow-hidden';

const Tile = ({ t }) => {
  switch (t.type) {
    case 'shot':
      return (
        <div className="relative h-full">
          <div className={tileBase} style={{ background: 'linear-gradient(160deg,#2B3326,#141812)' }}>
            <h3 className="relative z-10 px-6 md:px-8 pt-6 md:pt-8 text-[22px] md:text-[30px] font-semibold tracking-[-0.02em] text-white max-w-[20ch] leading-[1.1]">
              {t.title}
            </h3>
            <img
              src={t.image}
              alt=""
              className="absolute left-[9%] top-[40%] w-[100%] rounded-tl-[18px] object-cover"
              style={{ height: '75%', objectPosition: t.focus || '0 0', boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}
            />
          </div>
          {t.icon && (
            <img
              src={t.icon}
              alt=""
              className="absolute -top-4 -left-3 w-14 md:w-[72px] rounded-[20px]"
              style={{ boxShadow: '0 14px 30px rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)' }}
            />
          )}
        </div>
      );
    case 'photo':
      return (
        <div className={`${tileBase} flex items-center justify-center text-center`}>
          <img src={t.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: t.tint || 'rgba(0,0,0,0.3)' }} />
          <p
            className="relative px-6 text-[28px] md:text-[42px] font-bold leading-[1.08] tracking-[-0.02em]"
            style={{ color: t.ink || '#fff', textShadow: t.ink ? 'none' : '0 4px 30px rgba(0,0,0,0.45)' }}
          >
            {t.title}
            <br />
            <span style={{ color: t.highlightColor || '#D7F59A' }}>{t.highlight}</span>
          </p>
        </div>
      );
    case 'toggle':
      return (
        <div
          className={`${tileBase} flex flex-col items-center justify-center`}
          style={{ background: 'radial-gradient(120% 120% at 30% 20%, #F4FFD9 0%, #C8EF7E 45%, #7FBF2E 100%)' }}
        >
          <span className="text-[34px] md:text-[44px] font-extrabold leading-none tracking-[-0.03em]" style={{ color: '#1C2A0E' }}>
            {t.word}
          </span>
          <span className="mt-2 flex items-center gap-2">
            <span className="relative w-[70px] h-[38px] rounded-full" style={{ background: '#2F6A12' }}>
              <span className="absolute right-1 top-1 w-[30px] h-[30px] rounded-full bg-white shadow" />
            </span>
            <span className="text-[34px] md:text-[42px] font-extrabold leading-none" style={{ color: '#2F6A12' }}>
              ON
            </span>
          </span>
          <span className="sr-only">{t.label}</span>
        </div>
      );
    case 'metal':
      return (
        <div
          className={`${tileBase} flex flex-col items-center justify-center`}
          style={{ background: 'linear-gradient(180deg,#8A8F86 0%,#565A53 100%)' }}
        >
          <span
            className="text-[34px] md:text-[48px] font-extrabold leading-none tracking-[-0.02em]"
            style={{
              background: 'linear-gradient(180deg,#FFFFFF 0%,#C9CEC4 45%,#7E847A 55%,#E6EAE2 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(40,44,38,0.5)',
            }}
          >
            {t.word}
          </span>
          <span className="mt-2 text-[17px] md:text-[22px] font-bold" style={{ color: '#2B2E29', opacity: 0.8 }}>
            {t.label}
          </span>
        </div>
      );
    case 'icons':
      return (
        <div className={`${tileBase} flex flex-col items-center justify-end pb-6 md:pb-8`}>
          <img src={t.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.45))' }} />
          <div className="relative flex -space-x-4 mb-4">
            {t.icons.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="w-16 md:w-20 rounded-full"
                style={{ border: '4px solid rgba(255,255,255,0.85)', background: '#1b1f18', boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}
              />
            ))}
          </div>
          <p className="relative text-[24px] md:text-[34px] font-bold text-white tracking-[-0.02em]">{t.title}</p>
        </div>
      );
    case 'big':
      return (
        <div className={`${tileBase} flex flex-col items-center justify-center`}>
          <img src={t.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.18)' }} />
          <span
            className="relative text-[52px] md:text-[84px] font-extrabold leading-[0.8] tracking-[-0.04em]"
            style={{ color: 'rgba(255,255,255,0.88)', mixBlendMode: 'overlay' }}
          >
            {t.word}
          </span>
          <span
            className="relative text-[96px] md:text-[176px] font-extrabold leading-[0.85] tracking-[-0.05em]"
            style={{ color: 'rgba(255,255,255,0.1)', WebkitTextStroke: '2px rgba(255,255,255,0.75)', textShadow: '0 10px 60px rgba(0,0,0,0.35)' }}
          >
            {t.number}
          </span>
        </div>
      );
    case 'chat':
      return (
        <div
          className={`${tileBase} flex flex-col justify-between p-5 md:p-6`}
          style={{ background: 'radial-gradient(120% 100% at 20% 100%, #4F8DF7 0%, #1D4ED8 40%, #0B2A7A 100%)' }}
        >
          <div className="self-end max-w-[92%] px-4 py-2.5 rounded-[18px] rounded-br-md text-[13px] md:text-[14px] font-semibold text-white break-all" style={{ background: '#2563EB', boxShadow: '0 8px 20px rgba(0,0,0,0.25)', fontFamily: 'ui-monospace, Menlo, monospace' }}>
            {t.ask}
          </div>
          <div className="self-start px-4 py-2 rounded-[18px] rounded-bl-md text-[17px] md:text-[20px] font-bold flex items-center gap-2" style={{ background: '#fff', color: INK }}>
            {t.reply} <SealCheckIcon size={20} weight="fill" color="#65A30D" />
          </div>
          <span className="self-end text-[26px] md:text-[34px] font-extrabold text-white/90 tracking-[-0.02em]">{t.label}</span>
        </div>
      );
    case 'keys':
      return (
        <div
          className={`${tileBase} flex flex-col items-center justify-center gap-6 p-6 text-center`}
          style={{ background: 'radial-gradient(120% 100% at 50% 0%, #8B5CF6 0%, #5B21B6 55%, #2E1065 100%)' }}
        >
          <div className="flex gap-3">
            {t.keys.map((k) => (
              <span
                key={k}
                className="min-w-[64px] md:min-w-[76px] h-16 md:h-[76px] px-4 rounded-[18px] flex items-center justify-center text-[20px] md:text-[26px] font-bold"
                style={{ background: 'linear-gradient(180deg,#FFFFFF,#E4E0F0)', color: '#2E1065', boxShadow: '0 6px 0 #B9B0D6, 0 16px 30px rgba(0,0,0,0.35)' }}
              >
                {k}
              </span>
            ))}
          </div>
          <p className="text-[20px] md:text-[26px] font-bold text-white leading-[1.15] tracking-[-0.01em]">{t.title}</p>
        </div>
      );
    case 'note':
      return (
        <div
          className={`${tileBase} flex flex-col justify-end p-5 md:p-6`}
          style={{ background: 'linear-gradient(180deg,#171915,#0B0C0A)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="absolute top-6 left-1/2 -translate-x-1/2 w-[3px] h-[40%] rounded-full" style={{ background: 'linear-gradient(180deg,rgba(215,245,154,0),#D7F59A)' }} />
          <p className="text-[22px] md:text-[26px] font-bold text-white leading-[1.1] tracking-[-0.02em]">{t.title}</p>
          <p className="mt-2 text-[13.5px] leading-[1.5]" style={{ color: '#E5A15B' }}>
            {t.body}
          </p>
        </div>
      );
    case 'frame':
      return (
        <div
          className={`${tileBase} flex flex-col items-center pt-7 md:pt-9`}
          style={{ background: 'linear-gradient(180deg,#141612 0%,#050605 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-[22px] md:text-[28px] font-bold text-white tracking-[-0.02em] text-center px-4">{t.title}</p>
          <p className="text-[14px] md:text-[17px] text-white/80 mt-1">{t.body}</p>
          <div className="absolute bottom-0 left-[10%] right-[10%] h-[46%] rounded-t-[16px] overflow-hidden" style={{ background: '#101211', border: '1px solid #30362C', borderBottom: 'none' }}>
            <div className="flex items-center justify-end h-10 px-2" style={{ borderBottom: '1px solid #30362C' }}>
              {['—', '☐', '✕'].map((g, i) => (
                <span key={g} className="w-11 h-10 flex items-center justify-center text-[14px]" style={i === 2 ? { background: '#C0392B', color: '#fff' } : { color: '#AEB5A6' }}>
                  {g}
                </span>
              ))}
            </div>
            <div className="p-3 flex gap-2">
              <span className="w-8 h-8 rounded-lg" style={{ background: '#20291C' }} />
              <span className="flex-1 space-y-1.5 pt-1">
                <span className="block h-2 rounded w-2/3" style={{ background: '#30362C' }} />
                <span className="block h-2 rounded w-1/3" style={{ background: '#D7F59A', opacity: 0.6 }} />
              </span>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

/* ---------- catalog: tabs over a sliding card track ---------- */

const Catalog = ({ catalog }) => {
  const [idx, setIdx] = useState(0);
  const groups = catalog.groups;
  const ACCENT = '#4D7C0F';
  return (
    <section
      id="catalog"
      data-tone="light"
      className="bt-sec relative overflow-hidden pt-24 md:pt-32 pb-20"
      style={{
        background:
          'radial-gradient(45% 50% at 20% 20%, rgba(215,245,154,0.35), transparent 70%), radial-gradient(40% 50% at 85% 30%, rgba(191,219,254,0.5), transparent 70%), #F4F6F0',
      }}
    >
      <Reveal className="bt-wrap text-center">
        <Eyebrow color={ACCENT}>{catalog.eyebrow}</Eyebrow>
        <h2 className="mt-5 text-[44px] md:text-[72px] font-semibold leading-[1.02] tracking-[-0.035em]" style={{ color: INK }}>
          {catalog.title.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </h2>
        <p className="mx-auto mt-6 max-w-[620px] text-[18px] md:text-[20px] leading-[1.45]" style={{ color: MUTE }}>
          {catalog.subtitle}
        </p>
      </Reveal>

      <div className="bt-wrap mt-10 flex flex-wrap justify-center gap-3" role="tablist">
        {groups.map((g, i) => {
          const on = i === idx;
          return (
            <button
              key={g.label}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setIdx(i)}
              className="w-[104px] md:w-[112px] h-[92px] rounded-[18px] flex flex-col items-center justify-center gap-2 transition-all"
              style={{
                background: on ? '#fff' : 'rgba(255,255,255,0.6)',
                border: `1.5px solid ${on ? ACCENT : 'rgba(14,18,11,0.06)'}`,
                color: on ? ACCENT : MUTE,
                boxShadow: on ? '0 12px 30px -12px rgba(77,124,15,0.45)' : 'none',
              }}
            >
              <img src={g.icon} alt="" className="w-8 h-8 rounded-[9px]" />
              <span className="text-[13.5px] font-semibold leading-tight text-center px-1">{g.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-12" style={{ '--cw': 'min(1020px, calc(100vw - 40px))' }}>
        <div
          className="flex gap-6 transition-transform duration-700"
          style={{
            paddingLeft: 'calc(50% - var(--cw) / 2)',
            transform: `translateX(calc(-${idx} * (var(--cw) + 24px)))`,
            transitionTimingFunction: 'cubic-bezier(0.2,0.7,0.2,1)',
          }}
        >
          {groups.map((g, i) => {
            const on = i === idx;
            return (
              <div
                key={g.label}
                onClick={on ? undefined : () => setIdx(i)}
                className={`shrink-0 grid md:grid-cols-2 rounded-[28px] overflow-hidden transition-opacity duration-500 ${on ? '' : 'cursor-pointer'}`}
                style={{
                  width: 'var(--cw)',
                  opacity: on ? 1 : 0.45,
                  background: '#fff',
                  boxShadow: '0 30px 60px -40px rgba(14,18,11,0.35)',
                }}
                aria-hidden={!on}
              >
                <div className="p-8 md:p-10 flex flex-col justify-between gap-10 md:min-h-[380px]">
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: ACCENT }}>
                      {g.label}
                    </p>
                    <h3 className="mt-4 text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.025em]" style={{ color: INK }}>
                      {g.heading}
                    </h3>
                  </div>
                  <p className="text-[18px] md:text-[20px] leading-[1.45]" style={{ color: MUTE }}>
                    {g.body}
                  </p>
                </div>
                <div
                  className="p-5 md:p-8 flex flex-col justify-center gap-3"
                  style={{
                    background: '#EEF3E6',
                    backgroundImage: 'radial-gradient(rgba(14,18,11,0.10) 1px, transparent 1.2px)',
                    backgroundSize: '16px 16px',
                  }}
                >
                  {g.apps.map((a) => (
                    <Go
                      key={a.name}
                      href={on ? a.href : undefined}
                      className="flex items-center gap-4 p-4 rounded-[16px] bg-white transition-transform hover:-translate-y-0.5"
                      style={{ boxShadow: '0 1px 0 rgba(14,18,11,0.04)' }}
                      tabIndex={on ? 0 : -1}
                    >
                      <img src={a.icon} alt="" className="w-11 h-11 rounded-[12px]" />
                      <span className="min-w-0">
                        <span className="block text-[16px] font-semibold truncate" style={{ color: INK }}>
                          {a.line}
                        </span>
                        <span className="block text-[14px]" style={{ color: MUTE }}>
                          {a.name}
                        </span>
                      </span>
                      <ArrowUpRightIcon size={16} className="ml-auto shrink-0" color={MUTE} />
                    </Go>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {catalog.cta && (
        <div className="mt-12 flex justify-center">
          <Go
            href={catalog.cta.href}
            className="inline-flex items-center gap-3 h-11 pl-2 pr-5 rounded-full text-[14.5px] font-medium"
            style={{ background: '#fff', border: `1px solid ${LINE}`, color: INK }}
          >
            <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#20291C' }}>
              <GithubLogoIcon size={15} weight="bold" color="#D7F59A" />
            </span>
            {catalog.cta.label}
          </Go>
        </div>
      )}
    </section>
  );
};

/* ---------- ways-to-run art ---------- */

const WayArt = ({ art, file }) => {
  const label = (
    <span className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md text-[12px] whitespace-nowrap" style={{ background: 'rgba(255,255,255,0.08)', color: '#C9D1C1', fontFamily: 'ui-monospace, Menlo, monospace' }}>
      {file}
    </span>
  );
  if (art === 'installer')
    return (
      <>
        <div className="w-[70%] rounded-[16px] p-5" style={{ background: '#101211', border: '1px solid #30362C', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: '#20291C' }}>
              <span className="w-4 h-4" style={{ background: '#D7F59A', clipPath: 'polygon(0 100%, 45% 0, 60% 0, 100% 100%)' }} />
            </span>
            <span>
              <span className="block text-[14px] font-bold text-white">Airlift Setup</span>
              <span className="block text-[11.5px]" style={{ color: '#92988D' }}>Installing · step 5 of 6</span>
            </span>
          </div>
          <div className="mt-5 h-2 rounded-full" style={{ background: '#242923' }}>
            <div className="h-full w-[76%] rounded-full" style={{ background: '#D7F59A' }} />
          </div>
          <div className="mt-4 flex gap-1.5">
            {[1, 1, 1, 1, 0.6, 0.2].map((o, i) => (
              <span key={i} className="flex-1 h-1 rounded-full" style={{ background: '#D7F59A', opacity: o }} />
            ))}
          </div>
        </div>
        {label}
      </>
    );
  if (art === 'folder')
    return (
      <>
        <div className="relative w-[46%] aspect-[5/4]">
          <div className="absolute left-0 top-0 w-[44%] h-[22%] rounded-t-[12px]" style={{ background: '#9DBE73' }} />
          <div className="absolute inset-x-0 bottom-0 top-[12%] rounded-[14px] rounded-tl-none" style={{ background: 'linear-gradient(180deg,#D7F59A,#9DBE73)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }} />
          <span className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 text-[13px] font-bold" style={{ color: '#25311C' }}>
            Airlift.exe
          </span>
        </div>
        {label}
      </>
    );
  return (
    <>
      <div className="w-[72%] rounded-[14px] overflow-hidden" style={{ background: '#0A0B09', border: '1px solid #30362C', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', fontFamily: 'ui-monospace, Menlo, monospace' }}>
        <div className="h-7 flex items-center gap-1.5 px-3" style={{ background: '#151715' }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: '#30362C' }} />
          ))}
        </div>
        <div className="p-4 text-[12.5px] leading-[1.8]">
          <div style={{ color: '#92988D' }}>PS&gt; <span style={{ color: '#D7F59A' }}>airlift-cli refresh</span></div>
          <div style={{ color: '#92988D' }}>PS&gt; <span style={{ color: '#D7F59A' }}>airlift-cli install Timp</span></div>
          <div style={{ color: '#92988D' }}>
            PS&gt; <span className="inline-block w-2 h-3.5 align-middle" style={{ background: '#D7F59A', animation: 'bt-caret 1s steps(1) infinite' }} />
          </div>
        </div>
      </div>
      {label}
    </>
  );
};

/* ---------- dot matrix for "built in the open" ---------- */

const DotMatrix = () => {
  const cols = 40;
  const rows = 9;
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const seed = Math.abs(Math.sin(r * 91.7 + c * 12.9) * 43758.5453) % 1;
      const depth = (r + 1) / rows;
      const o = seed < 0.35 + depth * 0.45 ? (0.12 + seed * 0.7) * depth : 0.03;
      cells.push(
        <span
          key={`${r}-${c}`}
          className="block aspect-square rounded-[2px]"
          style={{ background: '#A3E635', '--o': o, opacity: o, animation: seed > 0.8 ? `bt-blink ${2 + seed * 3}s ease-in-out ${seed * 4}s infinite` : undefined }}
        />,
      );
    }
  }
  return (
    <div className="absolute inset-x-6 bottom-6 grid gap-[5px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }} aria-hidden>
      {cells}
    </div>
  );
};

/* ============================================================ */

const BentosProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'bentos');
  const [tone, setTone] = useState('light');

  useEffect(() => {
    if (!cfg) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const probe = 100;
      let next = 'light';
      document.querySelectorAll('[data-tone]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) next = el.dataset.tone;
      });
      setTone(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    // The site scrolls <body>, not the window, and scroll events do not
    // bubble, so listen in the capture phase to hear whichever element moves.
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true });
      if (frame) cancelAnimationFrame(frame);
    };
  }, [cfg]);

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={PAPER} color={INK} />;

  const { hero, showcase, whatsNew, pocket, catalog, features, rails, ways, craft, trust, changelog, closing, footer } = cfg;
  const allIcons = (catalog?.groups || []).flatMap((g) => g.apps.map((a) => a.icon));

  return (
    <div id="top" className="bt-root min-h-screen overflow-x-clip" style={{ background: PAPER, color: INK, ...SANS }}>
      <style>{CSS}</style>
      <AppSeo cfg={cfg} project={project} />
      <Header cfg={cfg} tone={tone} />

      {/* ============ HERO ============ */}
      <section
        data-tone="light"
        className="relative pt-14 md:pt-20 pb-20 md:pb-28 overflow-hidden"
        style={{
          background:
            'radial-gradient(40% 45% at 12% 55%, rgba(187,247,208,0.55), transparent 70%), radial-gradient(38% 45% at 88% 60%, rgba(251,207,232,0.5), transparent 70%), radial-gradient(50% 35% at 50% 0%, rgba(215,245,154,0.45), transparent 70%), #F7F8F4',
        }}
      >
        <div className="bt-wrap text-center">
          <Reveal>
            <h1 className="text-[42px] sm:text-[58px] md:text-[80px] font-semibold leading-[1.02] tracking-[-0.04em]">
              {hero.lines[0]}
              <br />
              {hero.lines[1]}{' '}
              <span className="font-normal tracking-normal text-[1.12em] pr-1" style={{ ...SCRIPT, color: '#3F6212' }}>
                {hero.script}
              </span>
              .
            </h1>
            <p className="mx-auto mt-7 max-w-[680px] text-[17px] md:text-[21px] leading-[1.45]" style={{ color: MUTE }}>
              {hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 px-2">
            <Orbit logo={cfg.logo} icons={allIcons} caption={hero.caption} />
          </Reveal>
          <Reveal delay={0.15} className="mt-9 flex flex-wrap justify-center gap-3">
            <Pill href={hero.primary.href} size="lg">
              {hero.primary.label}
            </Pill>
            <Pill href={hero.secondary.href} tone="light" size="lg">
              <GithubLogoIcon size={18} weight="bold" /> {hero.secondary.label}
            </Pill>
          </Reveal>
          {showcase && <Showcase showcase={showcase} />}
        </div>
      </section>

      {/* ============ WHAT'S NEW: bento grid ============ */}
      {whatsNew && (
        <section id="whats-new" data-tone="dark" className="bt-sec pt-24 md:pt-32 pb-24" style={{ background: '#000', color: '#fff' }}>
          <Reveal className="bt-wrap text-center">
            <Eyebrow color="#fff">{whatsNew.eyebrow}</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[14ch] text-[44px] md:text-[72px] font-semibold leading-[1.04] tracking-[-0.035em]">
              {whatsNew.title}
            </h2>
          </Reveal>
          <div className="bt-wrap mt-16">
            <div className="bt-grid">
              {whatsNew.tiles.map((t, i) => (
                <Reveal
                  key={i}
                  delay={(i % 4) * 0.06}
                  className="bt-tile"
                  style={{ '--c': t.col, '--cm': t.col >= 4 ? 2 : 1, '--r': t.row }}
                >
                  <Tile t={t} />
                </Reveal>
              ))}
            </div>
          </div>

          {whatsNew.stories?.length > 0 && (
            <div className="mt-24">
              <Rail
                dark
                items={whatsNew.stories}
                gap={28}
                render={(s, i) => (
                  <article
                    className="relative w-[88vw] md:w-[760px] h-[520px] md:h-[600px] rounded-[30px] overflow-hidden"
                    style={{
                      background: [
                        'radial-gradient(120% 90% at 20% 0%, #5B4A2E 0%, #1B150D 70%)',
                        'radial-gradient(120% 90% at 80% 0%, #1F4A55 0%, #0B1719 70%)',
                        'radial-gradient(120% 90% at 30% 0%, #3E2C52 0%, #120D18 70%)',
                        'radial-gradient(120% 90% at 70% 0%, #33501F 0%, #0E150A 70%)',
                      ][i % 4],
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <img
                      src={s.image}
                      alt=""
                      className="absolute left-[9%] top-[9%] w-[104%] max-w-none rounded-[20px]"
                      style={{ transform: 'perspective(1800px) rotateX(8deg) rotateY(-10deg)', transformOrigin: 'left top', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.92) 82%)' }} />
                    <div className="absolute left-0 right-0 bottom-0 p-7 md:p-9">
                      <h3 className="text-[26px] md:text-[32px] font-semibold tracking-[-0.02em]">{s.title}</h3>
                      <p className="mt-3 max-w-[52ch] text-[15.5px] md:text-[17px] leading-[1.5] text-white/75">{s.body}</p>
                    </div>
                  </article>
                )}
              />
            </div>
          )}
        </section>
      )}

      {/* ============ POCKET: companion card ============ */}
      {pocket && (
        <section data-tone="dark" className="pt-24 md:pt-32 pb-28" style={{ background: 'linear-gradient(180deg,#000 0%,#0B1208 40%,#0C1109 100%)', color: '#fff' }}>
          <div className="bt-wrap">
            <Reveal>
              <div
                className="relative rounded-[36px] overflow-hidden grid lg:grid-cols-[1.05fr_1fr]"
                style={{ background: 'linear-gradient(135deg,#1C2A12 0%,#0E150A 60%,#0A0F07 100%)', border: '1px solid rgba(215,245,154,0.14)' }}
              >
                <div className="absolute -top-[30%] left-[25%] w-[70%] h-[80%] rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(163,230,53,0.28), transparent)' }} />
                <div className="relative p-8 md:p-14">
                  <img src={cfg.logo} alt="" className="w-14 h-14" />
                  <p className="mt-6 flex items-center gap-2 text-[16px] font-semibold">
                    <span style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{pocket.eyebrow}</span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold" style={{ background: '#D7F59A', color: '#25311C' }}>
                      {pocket.badge}
                    </span>
                  </p>
                  <h2 className="mt-4 text-[44px] md:text-[64px] font-semibold leading-[1.04] tracking-[-0.035em]">{pocket.title}</h2>
                  <p className="mt-6 max-w-[48ch] text-[17px] md:text-[20px] leading-[1.45] text-white/80">{pocket.body}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {pocket.buttons.map((b) => (
                      <Pill key={b.label} href={b.href} tone="white">
                        {b.label} <ArrowUpRightIcon size={15} weight="bold" />
                      </Pill>
                    ))}
                  </div>
                  <p className="mt-6 text-[14px] text-white/55">{pocket.note}</p>
                </div>
                <div className="relative px-6 pb-8 lg:px-0 lg:pb-12 lg:pt-10 flex flex-col">
                  {/* status panel */}
                  <div
                    className="relative lg:ml-auto lg:w-[84%] rounded-[28px] lg:rounded-r-none p-7 lg:pb-40"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRight: 'none', backdropFilter: 'blur(10px)' }}
                  >
                    <div className="flex items-start gap-5">
                      <img src={cfg.logo} alt="" className="w-16 h-16" />
                      <div>
                        <p className="text-[26px] font-semibold tracking-[-0.02em]">
                          {pocket.panel.title} <span className="text-white/45">{pocket.panel.subtitle}</span>
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-[15px]">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#4ADE80', boxShadow: '0 0 10px #4ADE80' }} />
                          {pocket.panel.status}
                          <span className="text-white/45">· {pocket.panel.detail}</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 rounded-[16px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                      {pocket.panel.rows.map((r, i) => (
                        <div key={r.label} className="flex justify-between gap-4 px-4 py-3.5 text-[14.5px]" style={{ borderTop: i ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                          <span className="text-white/55">{r.label}</span>
                          <span className="font-semibold text-right">{r.value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 text-[15px] font-semibold">{pocket.panel.footTitle}</p>
                    <p className="mt-1 text-[14px] text-white/55 max-w-[40ch]">{pocket.panel.foot}</p>
                  </div>
                  {/* terminal */}
                  <div
                    className="relative mt-6 lg:-mt-32 lg:-ml-[6%] lg:w-[78%] rounded-[22px] overflow-hidden"
                    style={{ background: '#070806', border: '1px solid rgba(215,245,154,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', fontFamily: 'ui-monospace, Menlo, monospace' }}
                  >
                    <div className="h-9 flex items-center gap-1.5 px-4" style={{ background: '#11140F' }}>
                      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                        <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      ))}
                      <span className="ml-3 text-[11.5px] text-white/40">PowerShell</span>
                    </div>
                    <div className="p-5 text-[12.5px] md:text-[13px] leading-[1.9]">
                      {pocket.commands.map((c) => (
                        <div key={c.cmd} className="flex flex-wrap gap-x-3">
                          <span>
                            <span className="text-white/35">PS&gt; </span>
                            <span style={{ color: '#D7F59A' }}>{c.cmd}</span>
                          </span>
                          <span className="text-white/35"># {c.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {catalog && <Catalog catalog={catalog} />}

      {/* ============ FEATURES: wide dark slides ============ */}
      {features && (
        <section
          id="features"
          data-tone="dark"
          className="bt-sec pt-24 md:pt-32 pb-24"
          style={{ background: 'linear-gradient(180deg,#2A2C28 0%,#0A0B09 45%,#000 100%)', color: '#fff' }}
        >
          <Reveal className="bt-wrap text-center">
            <Eyebrow color="#fff">{features.eyebrow}</Eyebrow>
            <h2 className="mt-5 text-[42px] md:text-[76px] font-semibold leading-[1.02] tracking-[-0.035em]">{features.title}</h2>
            <p className="mx-auto mt-6 max-w-[700px] text-[17px] md:text-[20px] leading-[1.45] text-white/70">{features.subtitle}</p>
          </Reveal>
          <div className="mt-16">
            <Rail
              dark
              pill
              items={features.slides}
              gap={28}
              render={(s) => (
                <article
                  className="relative w-[90vw] lg:w-[1120px] h-[460px] md:h-[620px] rounded-[32px] overflow-hidden flex flex-col items-center pt-8 md:pt-10"
                  style={{ background: 'radial-gradient(100% 70% at 50% 100%, rgba(77,124,15,0.35), transparent 70%), #070806', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <p className="text-[14px] font-semibold text-white/50">{s.eyebrow}</p>
                  <h3 className="mt-3 px-6 max-w-[30ch] text-center text-[22px] md:text-[36px] font-medium leading-[1.2] tracking-[-0.02em]">
                    {s.title && <span className="block">{s.title}</span>}
                    <span style={{ color: '#D7F59A' }}>{s.highlight}</span> {s.after}
                  </h3>
                  <div className="absolute left-[7%] right-[7%] bottom-0 top-[34%] md:top-[30%] rounded-t-[22px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.14)', borderBottom: 'none', boxShadow: '0 -20px 80px rgba(0,0,0,0.6)' }}>
                    <img src={s.image} alt="" className="w-full h-full object-cover object-top" />
                  </div>
                </article>
              )}
            />
          </div>
        </section>
      )}

      {/* ============ RAILS: light screenshot carousels ============ */}
      {(rails || []).map((rail) => (
        <section key={rail.id} data-tone="light" className="pt-24 md:pt-28 pb-12" style={{ background: '#fff' }}>
          <Reveal className="bt-wrap">
            <Eyebrow color="#4D7C0F">{rail.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-[36px] md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.05]">{rail.title}</h2>
          </Reveal>
          <div className="mt-10">
            <Rail
              items={rail.cards}
              render={(c) => (
                <article className="w-[84vw] md:w-[620px]">
                  <div
                    className="relative aspect-[620/440] rounded-[26px] overflow-hidden flex items-center justify-center p-6"
                    style={{ background: 'radial-gradient(100% 100% at 50% 0%, #2A3321 0%, #0F120D 80%)' }}
                  >
                    <img src={c.image} alt="" className="max-w-full max-h-full rounded-[14px] object-contain" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.55)' }} />
                  </div>
                  <h3 className="mt-6 text-[24px] md:text-[28px] font-semibold tracking-[-0.02em]">{c.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-[16px] leading-[1.6]" style={{ color: MUTE }}>
                    {c.body}
                  </p>
                </article>
              )}
            />
          </div>
        </section>
      ))}

      {/* ============ WAYS TO RUN ============ */}
      {ways && (
        <section id="ways" data-tone="dark" className="bt-sec pt-24 md:pt-32 pb-24" style={{ background: '#000', color: '#fff' }}>
          <Reveal className="bt-wrap text-center">
            <Eyebrow color="#fff">{ways.eyebrow}</Eyebrow>
            <h2 className="mt-5 text-[44px] md:text-[76px] font-semibold tracking-[-0.035em] leading-[1.02]">{ways.title}</h2>
          </Reveal>
          <div className="bt-wrap mt-14 grid md:grid-cols-3 gap-5">
            {ways.options.map((o, i) => (
              <Reveal key={o.name} delay={i * 0.08}>
                <article className="h-full rounded-[28px] overflow-hidden flex flex-col" style={{ border: '1px solid rgba(255,255,255,0.14)', background: '#181917' }}>
                  <div
                    className="relative h-[300px] md:h-[340px] flex items-center justify-center"
                    style={{ background: 'radial-gradient(70% 60% at 60% 30%, #2B2E28 0%, #070707 75%)' }}
                  >
                    {o.badge && (
                      <span className="absolute top-6 left-7 text-[14px] font-semibold" style={{ color: '#D7F59A' }}>
                        {o.badge}
                      </span>
                    )}
                    <WayArt art={o.art} file={o.file} />
                  </div>
                  <div className="p-7 flex-1 flex flex-col">
                    <h3 className="text-[30px] md:text-[34px] font-semibold tracking-[-0.02em]">{o.name}</h3>
                    <div className="mt-4">
                      <Pill href={o.cta.href} tone="white">
                        {o.cta.label}
                      </Pill>
                    </div>
                    <div className="mt-6">
                      {o.ratings.map((r) => (
                        <div key={r.label} className="flex items-center justify-between py-3.5 text-[15.5px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <span className="font-semibold">{r.label}</span>
                          {r.text ? (
                            <span className="text-[14px] text-white/70">{r.text}</span>
                          ) : (
                            <span className="flex gap-1.5" aria-label={`${r.value} of 5`}>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <span key={n} className="w-2.5 h-2.5 rounded-full" style={{ background: n <= r.value ? '#fff' : 'rgba(255,255,255,0.22)' }} />
                              ))}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 text-[15.5px] leading-[1.6] text-white/70">
                      <strong className="text-white">Best for</strong> {o.bestFor}
                    </p>
                    <p className="mt-4 text-[15.5px] leading-[1.6] text-white/70">
                      <strong className="text-white">You get</strong> {o.youGet}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============ CRAFT: tilted cards ============ */}
      {craft && (
        <section
          data-tone="dark"
          className="pt-20 md:pt-28 pb-28 overflow-hidden"
          style={{ background: 'radial-gradient(50% 50% at 25% 90%, rgba(91,33,182,0.35), transparent 70%), #000', color: '#fff' }}
        >
          <Reveal className="bt-wrap">
            <Eyebrow color="#fff">{craft.eyebrow}</Eyebrow>
            <h2 className="mt-5 text-[44px] md:text-[76px] font-semibold tracking-[-0.035em] leading-[1.02]">{craft.title}</h2>
            <p className="mt-6 max-w-[640px] text-[17px] md:text-[20px] leading-[1.45] text-white/60">{craft.body}</p>
          </Reveal>
          <div className="bt-rail mt-16 flex gap-6 overflow-x-auto py-10" style={{ perspective: '1600px' }}>
            {craft.cards.map((c, i) => {
              const tilt = [-7, 5, -3, 6, -5][i % 5];
              return (
                <motion.article
                  key={c.highlight}
                  className="relative shrink-0 w-[290px] md:w-[330px] h-[420px] md:h-[460px] rounded-[26px] overflow-hidden"
                  style={{
                    background: `linear-gradient(180deg, ${c.tone} 0%, #0B0B0B 90%)`,
                    border: '1px solid rgba(255,255,255,0.12)',
                    rotate: tilt * 0.5,
                    rotateY: tilt,
                    y: i % 2 ? 24 : 0,
                  }}
                  whileHover={{ rotate: 0, rotateY: 0, y: -6 }}
                  transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                >
                  <h3 className="relative z-10 px-7 pt-8 text-center text-[32px] md:text-[36px] leading-[1.05]" style={SERIF}>
                    {c.before} <em className="whitespace-nowrap" style={{ color: '#fff', opacity: 0.7 }}>{c.highlight}</em>
                  </h3>
                  <img
                    src={c.image}
                    alt=""
                    className="absolute left-[8%] top-[42%] w-[190%] max-w-none rounded-[14px]"
                    style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
                  />
                </motion.article>
              );
            })}
          </div>
        </section>
      )}

      {/* ============ TRUST ============ */}
      {trust && (
        <section data-tone="light" className="pt-24 md:pt-32 pb-24" style={{ background: PAPER }}>
          <Reveal className="bt-wrap text-center">
            <Eyebrow color="#4D7C0F">{trust.eyebrow}</Eyebrow>
            <h2 className="mt-5 text-[44px] md:text-[72px] font-semibold tracking-[-0.035em] leading-[1.02]">{trust.title}</h2>
            <p className="mx-auto mt-6 max-w-[640px] text-[17px] md:text-[20px] leading-[1.45]" style={{ color: MUTE }}>
              {trust.body}
            </p>
          </Reveal>
          <div className="bt-wrap mt-14 grid lg:grid-cols-[1.6fr_1fr] gap-5">
            <Reveal>
              <article className="relative h-full min-h-[520px] md:min-h-[660px] rounded-[32px] overflow-hidden p-9 md:p-10" style={{ background: '#050605', color: '#fff' }}>
                <CodeIcon size={56} weight="bold" color="#A3E635" />
                <h3 className="mt-10 text-[36px] md:text-[44px] font-semibold tracking-[-0.03em]">{trust.big.title}</h3>
                <p className="mt-4 text-[17px] text-white/70">{trust.big.body}</p>
                <div className="mt-8">
                  <Pill href={trust.big.cta.href} tone="lime">
                    <GithubLogoIcon size={17} weight="bold" /> {trust.big.cta.label}
                  </Pill>
                </div>
                <DotMatrix />
              </article>
            </Reveal>
            <div className="grid gap-5">
              {trust.small.map((s, i) => {
                const Icon = s.icon === 'shield' ? ShieldCheckIcon : HouseIcon;
                return (
                  <Reveal key={s.title} delay={0.08 * (i + 1)}>
                    <article className="h-full rounded-[32px] p-8 md:p-9 bg-white" style={{ border: `1px solid ${LINE}` }}>
                      <Icon size={48} weight="duotone" color="#4D7C0F" />
                      <h3 className="mt-6 text-[26px] md:text-[28px] font-semibold tracking-[-0.02em]">{s.title}</h3>
                      <p className="mt-3 text-[15px] leading-[1.65]" style={{ color: MUTE }}>
                        {s.body}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 h-9 px-4 rounded-full text-[14px]" style={{ border: `1px solid ${LINE}`, color: MUTE }}>
                        <LockSimpleIcon size={14} /> {s.chip}
                      </span>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ CHANGELOG: masonry wall ============ */}
      {changelog && (
        <section data-tone="light" className="pt-20 md:pt-28 pb-28" style={{ background: '#EFF0EC' }}>
          <Reveal className="bt-wrap text-center">
            <Eyebrow color="#4D7C0F">{changelog.eyebrow}</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[16ch] text-[40px] md:text-[64px] font-semibold tracking-[-0.035em] leading-[1.04]">{changelog.title}</h2>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] md:text-[19px]" style={{ color: MUTE }}>
              {changelog.body}
            </p>
          </Reveal>
          <div className="bt-wrap mt-16">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {changelog.entries.map((e, i) => (
                <Go
                  key={e.version}
                  href={`${cfg.repo}/releases/tag/v${e.version}`}
                  className="block mb-6 break-inside-avoid rounded-[24px] overflow-hidden bg-white transition-transform hover:-translate-y-1"
                  style={{ boxShadow: '0 20px 50px -30px rgba(14,18,11,0.35)', transform: `rotate(${[-1, 0.8, -0.6, 1.1, -0.9][i % 5]}deg)` }}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <img src={cfg.logo} alt="" className="w-11 h-11 rounded-full" />
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-[15.5px] font-bold">
                          {cfg.name} {e.version}
                          <SealCheckIcon size={17} weight="fill" color="#65A30D" />
                        </p>
                        <p className="text-[13px]" style={{ color: MUTE }}>
                          @{cfg.repoLabel} · {e.date}
                        </p>
                      </div>
                      <GithubLogoIcon size={20} className="ml-auto shrink-0" color="#B3B8AE" />
                    </div>
                    <p className="mt-4 text-[16px] leading-[1.6]" style={{ color: '#1F241C' }}>
                      {e.body}
                    </p>
                  </div>
                  {e.image && <img src={e.image} alt="" className="w-full aspect-[16/10] object-cover object-top" />}
                </Go>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ CLOSING + FOOTER ============ */}
      <div style={{ background: '#D7F59A' }}>
        {closing && (
          <section data-tone="dark" className="pt-24 pb-28 rounded-b-[44px] md:rounded-b-[64px]" style={{ background: NIGHT, color: '#fff' }}>
            <div className="bt-wrap">
              <Reveal>
                <div className="rounded-[32px] overflow-hidden grid lg:grid-cols-2" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div className="p-9 md:p-12" style={{ background: 'radial-gradient(90% 90% at 0% 100%, rgba(77,124,15,0.5), transparent 70%), #0B1109' }}>
                    <h2 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.035em] leading-[1.04]">{closing.title}</h2>
                    <p className="mt-5 max-w-[42ch] text-[17px] md:text-[19px] leading-[1.5] text-white/70">{closing.body}</p>
                    <div className="mt-9 flex flex-wrap gap-3">
                      <Pill href={closing.primary.href} tone="white">
                        {closing.primary.label} <ArrowRightIcon size={15} weight="bold" />
                      </Pill>
                      <Pill href={closing.secondary.href} tone="ghost">
                        {closing.secondary.label}
                      </Pill>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 grid gap-3" style={{ background: '#0A0B09' }}>
                    {closing.links.map((l) => (
                      <Go
                        key={l.title}
                        href={l.href}
                        className="group flex items-center gap-4 p-4 rounded-[18px] transition-colors hover:bg-white/5"
                        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <span className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: '#1A1D17' }}>
                          <ArrowUpRightIcon size={18} color="#D7F59A" />
                        </span>
                        <span>
                          <span className="block text-[16px] font-semibold">{l.title}</span>
                          <span className="block text-[14px] text-white/55">{l.body}</span>
                        </span>
                        <CaretRightIcon size={16} className="ml-auto opacity-40 group-hover:opacity-100" />
                      </Go>
                    ))}
                  </div>
                </div>
              </Reveal>
              <p className="mt-20 text-center text-[26px] md:text-[40px] font-semibold tracking-[-0.03em] text-white/85 max-w-[24ch] mx-auto leading-[1.15]">
                {closing.tagline}
              </p>
            </div>
          </section>
        )}

        {footer && (
          <footer data-tone="light" className="bt-wrap pt-24 md:pt-32 pb-10" style={{ color: '#1B2512' }}>
            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
              <div>
                <p className="text-[16px] font-bold">{footer.title}</p>
                <p className="mt-3 max-w-[40ch] text-[15px] leading-[1.6] opacity-75">{footer.body}</p>
                <Link to="/projects" className="mt-6 inline-flex items-center gap-2 h-10 px-4 rounded-full text-[14px] font-semibold" style={{ background: '#1B2512', color: '#D7F59A' }}>
                  <ArrowLeftIcon size={14} weight="bold" /> Back to projects
                </Link>
              </div>
              {footer.columns.map((col) => (
                <div key={col.title}>
                  <p className="text-[16px] font-bold">{col.title}</p>
                  <ul className="mt-4 space-y-3 text-[15px]">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Go href={l.href} className="opacity-75 hover:opacity-100">
                          {l.label}
                        </Go>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-16 pt-8 flex flex-wrap items-center justify-between gap-4 text-[13.5px]" style={{ borderTop: '1px solid rgba(27,37,18,0.18)' }}>
              <span className="opacity-75">
                © {new Date().getFullYear()} Fezcode. {cfg.name} v{cfg.version} · {(cfg.stack || []).join(' · ')}
              </span>
              <Go href={cfg.repo} aria-label="GitHub" className="opacity-75 hover:opacity-100">
                <GithubLogoIcon size={20} />
              </Go>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default BentosProjectPage;
