import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  BatteryHighIcon,
  CaretRightIcon,
  CheckIcon,
  CpuIcon,
  GithubLogoIcon,
  MemoryIcon,
  PowerIcon,
  RobotIcon,
  SpeakerHighIcon,
  SunIcon,
  PlayIcon,
} from '@phosphor-icons/react';
import { useAppConfig, useThemeFonts, AppLoading, AppMissing, AppSeo } from './app-shell';

/* ============================================================
 * "flow" — a warm editorial product page.
 *
 * Modelled on the Wispr Flow landing page: cream paper, a garamond
 * display face with italic turns, a floating pill nav, text flowing
 * along curves into the product, dark and green bands with rounded
 * shoulders, a sticky scroll-told "how it works", a scattered wall of
 * coloured cards, a chat-style FAQ and a photographic closing band.
 *
 * The product is shown rather than pictured: a live top bar drawn
 * from the app's real theme tokens (cfg.flow.themes) sits in the
 * hero ribbon, the step cards and the theme switcher. Content lives
 * in /projects/<slug>/app.txt under the "flow" key.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Figtree:wght@400;500;600;700&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap';

const CREAM = '#FFFFEB';
const INK = '#1A1A1A';
const GREEN = '#034F46';
const NIGHT = '#1C1C1C';
const BEIGE = '#E4E2D0';
const LAVENDER = '#F0D7FF';
const ORANGE = '#FF6B3D';
const MUTE = '#5F5E55';

const SERIF = { fontFamily: "'EB Garamond', Georgia, serif" };
const SANS = { fontFamily: "'Figtree', system-ui, sans-serif" };

const CSS = `
.fl-root { --gut: max(16px, calc((100vw - 1240px) / 2)); }
.fl-wrap { padding-inline: var(--gut); }
.fl-sec { scroll-margin-top: 110px; }
.fl-bar { container-type: inline-size; }
@container (max-width: 760px) { .fl-bar .fl-w-md { display: none; } }
@container (max-width: 520px) { .fl-bar .fl-w-sm { display: none; } }
@keyframes fl-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes fl-peek { 0%, 12% { transform: translateY(-100%) } 22%, 70% { transform: translateY(0) } 80%, 100% { transform: translateY(-100%) } }
@keyframes fl-wave { 0%, 100% { transform: scaleY(0.35) } 50% { transform: scaleY(1) } }
@keyframes fl-pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.35 } }
`;

/* ---------- helpers ---------- */

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
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

const Eyebrow = ({ children, color = MUTE, className = '' }) => (
  <p className={`text-[13px] font-medium uppercase tracking-[0.14em] ${className}`} style={{ color }}>
    {children}
  </p>
);

const WinLogo = ({ size = 14, color = 'currentColor' }) => (
  <span className="inline-grid grid-cols-2 gap-[1.5px] shrink-0" style={{ width: size, height: size }} aria-hidden>
    {[0, 1, 2, 3].map((i) => (
      <span key={i} style={{ background: color, borderRadius: 0.5 }} />
    ))}
  </span>
);

const Cta = ({ href, children, className = '' }) => (
  <Go
    href={href}
    className={`inline-flex items-center gap-2.5 h-[52px] px-6 rounded-[10px] text-[15.5px] font-medium transition-transform hover:-translate-y-0.5 ${className}`}
    style={{ background: LAVENDER, color: INK, border: `2px solid ${INK}` }}
  >
    <WinLogo size={15} color={INK} />
    {children}
  </Go>
);

/* ---------- contrast maths, for the "can't go wrong" demo ---------- */

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const luminance = ([r, g, b]) => {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [l1, l2] = [luminance(hexToRgb(a)), luminance(hexToRgb(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const toHex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
/** Darken or lighten along the same hue until the pair clears 4.5:1 — what Hisashi does to every token. */
const nudge = (fg, bg) => {
  const darker = luminance(hexToRgb(bg)) > 0.4;
  let rgb = hexToRgb(fg);
  for (let i = 0; i < 60 && ratio(toHex(rgb), bg) < 4.5; i += 1) {
    rgb = rgb.map((v) => (darker ? v * 0.95 : v + (255 - v) * 0.08));
  }
  return toHex(rgb);
};

/* ---------- the bar itself, painted from real theme tokens ---------- */

const DOCK = ['io.timp.timp', 'io.tivi.tivi', 'com.fezcode.descry', 'com.fezcode.atelier', 'io.clockt.clockt', 'io.pidi.pidi'];

const HisashiBar = ({ theme, app = 'Timp', menus, openMenu, radius = 0, className = '' }) => {
  const t = theme;
  const font =
    t.font === 'Geist Mono'
      ? "'Geist Mono', monospace"
      : t.font === 'Inter'
        ? "'Inter', sans-serif"
        : t.font === 'Segoe UI'
          ? "'Segoe UI', system-ui, sans-serif"
          : t.font === 'Cambria' || t.font === 'Georgia'
            ? `${t.font}, Georgia, serif`
            : "'Geist', system-ui, sans-serif";
  const chip = t.chip ? { background: t.chip, borderRadius: Number(t.radius || 8) } : { borderRadius: 6 };
  const Widget = ({ children, cls = '', accent }) => (
    <span className={`inline-flex items-center gap-1.5 h-[26px] px-2 whitespace-nowrap ${cls}`} style={{ ...chip, color: accent ? t.accent : t.fg }}>
      {children}
    </span>
  );
  const Sep = ({ cls = '' }) => <span className={`w-px h-4 ${cls}`} style={{ background: t.sep }} />;
  return (
    <div className={`fl-bar w-full ${className}`}>
      <div
        className="flex items-center gap-2 h-[38px] px-2.5 text-[12.5px]"
        style={{ background: t.bg, color: t.fg, borderBottom: `1px solid ${t.border}`, fontFamily: font, borderRadius: radius, backdropFilter: 'blur(12px)' }}
      >
        <Widget>
          <WinLogo size={12} color={t.icon} />
        </Widget>
        <span className="font-semibold whitespace-nowrap">{app}</span>
        {menus ? (
          menus.map((m) => (
            <span
              key={m}
              className="relative px-1.5 h-[26px] inline-flex items-center rounded whitespace-nowrap fl-w-sm"
              style={openMenu === m ? { background: t.accent, color: t.dark ? '#111' : '#fff' } : undefined}
            >
              {m}
            </span>
          ))
        ) : (
          <span className="flex items-center gap-1 fl-w-sm">
            <Sep />
            {DOCK.map((id, i) => (
              <span key={id} className="relative w-[24px] h-[24px] flex items-center justify-center rounded" style={i === 0 ? { outline: '1.5px solid #D9453B', outlineOffset: -1 } : undefined}>
                <img src={`/images/projects/airlift/icons/${id}.webp`} alt="" className="w-[18px] h-[18px] rounded-[4px]" />
                {i < 3 && <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-2 h-[2px] rounded" style={{ background: '#3BB54A' }} />}
              </span>
            ))}
          </span>
        )}
        <span className="flex-1" />
        <span className="font-medium whitespace-nowrap fl-w-md" style={{ fontVariantNumeric: 'tabular-nums' }}>
          Thu 25 Sep&nbsp;&nbsp;14:32
        </span>
        <span className="flex-1 fl-w-md" />
        <Widget cls="fl-w-md" accent>
          <CpuIcon size={14} color={t.icon} /> 26%
        </Widget>
        <Widget cls="fl-w-md">
          <MemoryIcon size={14} color={t.icon} /> 52%
        </Widget>
        <Widget cls="fl-w-sm">
          <SunIcon size={14} weight="fill" color="#F5B83D" /> 17°C
        </Widget>
        <Widget cls="fl-w-md">
          <PlayIcon size={12} weight="fill" color={t.icon} />
          <span style={{ color: t.muted }}>Timp</span>
        </Widget>
        <Widget>
          <SpeakerHighIcon size={14} color={t.icon} /> 42%
        </Widget>
        <Widget cls="fl-w-sm">
          <BatteryHighIcon size={15} color={t.icon} />
        </Widget>
        <Widget>
          <PowerIcon size={14} color={t.icon} />
        </Widget>
      </div>
    </div>
  );
};

/* ---------- hero: messy thoughts flow into the bar and come out tidy ---------- */

const FlowingText = ({ id, d, text, speed, className, style, ribbon }) => {
  const textRef = useRef(null);
  const pathRef = useRef(null);
  useEffect(() => {
    const node = textRef.current?.querySelector('textPath');
    if (!node) return undefined;
    let frame = 0;
    let unit = 0;
    let start = 0;
    const measure = () => {
      // The text is repeated three times; one repetition is the loop distance.
      unit = (textRef.current.getComputedTextLength?.() || 3000) / 3;
    };
    measure();
    const tick = (now) => {
      if (!start) start = now;
      const shift = (((now - start) / 1000) * speed) % unit;
      node.setAttribute('startOffset', String(shift - unit));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [speed, text]);
  return (
    <>
      <path id={id} ref={pathRef} d={d} fill="none" {...(ribbon || {})} />
      <text ref={textRef} className={className} style={style}>
        <textPath href={`#${id}`}>{text.repeat(3)}</textPath>
      </text>
    </>
  );
};

const HeroFlow = ({ hero }) => (
  <div className="relative w-full" aria-hidden>
    <svg viewBox="0 0 1440 460" className="w-full h-auto block overflow-visible">
      <FlowingText
        id="fl-messy"
        d="M -60 290 C 160 320, 330 190, 270 110 C 210 30, 110 130, 170 220 C 250 340, 470 370, 648 370"
        text={hero.messy}
        speed={55}
        style={{ ...SANS, fontSize: 19, fill: '#A7A594', fontWeight: 500 }}
      />
      <FlowingText
        id="fl-clean"
        d="M 792 370 C 1000 370, 1230 320, 1520 190"
        text={hero.clean}
        speed={70}
        ribbon={{ stroke: INK, strokeWidth: 44, strokeLinecap: 'round' }}
        style={{ ...SANS, fontSize: 18, fill: CREAM, fontWeight: 600, dominantBaseline: 'central' }}
      />
      {/* the eaves: a tiny bar that swallows the mess */}
      <g transform="translate(646 338)">
        <rect width="148" height="64" rx="32" fill={CREAM} stroke={INK} strokeWidth="3" />
        <rect x="20" y="22" width="108" height="20" rx="6" fill={INK} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={28 + i * 7} y="29" width="4" height="6" rx="1" fill={CREAM} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={`w${i}`} x={68 + i * 11} y="29" width="7" height="6" rx="2" fill={i === 1 ? '#D7F59A' : CREAM} opacity={0.9} />
        ))}
      </g>
    </svg>
  </div>
);

/* ---------- how-it-works step cards ---------- */

const StepDemo = ({ step, theme }) => {
  const box = 'absolute inset-x-0 top-0';
  if (step.demo === 'peek')
    return (
      <>
        <div className={`${box} h-[10px]`} style={{ borderBottom: '1.5px dashed rgba(255,255,255,0.85)' }} />
        <span className="absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}>
          10 px peek zone
        </span>
        <div className={box} style={{ animation: 'fl-peek 5s ease-in-out infinite' }}>
          <HisashiBar theme={theme} />
        </div>
      </>
    );
  if (step.demo === 'zones')
    return (
      <>
        <div className={box}>
          <HisashiBar theme={theme} />
        </div>
        <div className="absolute inset-x-3 top-[48px] grid grid-cols-3 gap-2">
          {['Left', 'Center', 'Right'].map((z) => (
            <div key={z} className="h-[118px] rounded-[10px] p-2 flex flex-col gap-1.5" style={{ border: '1.5px dashed rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.25)' }}>
              <span className="text-[11px] font-semibold text-white">{z}</span>
              {(z === 'Left' ? ['Menubar', 'App Dock'] : z === 'Center' ? ['Clock'] : ['Stats', 'Weather', 'Volume']).map((w, i) => (
                <motion.span
                  key={w}
                  className="text-[10.5px] px-1.5 py-1 rounded-md text-white/90"
                  style={{ background: 'rgba(255,255,255,0.18)' }}
                  animate={{ x: [0, i === 0 ? 3 : 0, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                >
                  {w}
                </motion.span>
              ))}
            </div>
          ))}
        </div>
      </>
    );
  if (step.demo === 'menu')
    return (
      <>
        <div className={box}>
          <HisashiBar theme={theme} menus={['File', 'Playback', 'Audio', 'View', 'Help']} openMenu="Playback" />
        </div>
        <div className="absolute left-[108px] top-[40px] w-[168px] rounded-[10px] py-1.5 text-[12.5px]" style={{ background: theme.dark ? '#222433' : '#fff', color: theme.fg, boxShadow: '0 16px 40px rgba(0,0,0,0.45)', border: `1px solid ${theme.border}` }}>
          {[
            ['Shuffle', true],
            ['Repeat', true],
          ].map(([label, on]) => (
            <div key={label} className="flex items-center gap-2 px-3 py-1.5">
              <span className="w-3.5">{on && <CheckIcon size={13} weight="bold" color={theme.accent} />}</span>
              {label}
            </div>
          ))}
          <div className="mx-3 my-1 h-px" style={{ background: theme.sep }} />
          <div className="px-3 py-1.5 pl-[34px] opacity-60">published over hoswl</div>
        </div>
      </>
    );
  return (
    <>
      <div className={box}>
        <HisashiBar theme={theme} />
      </div>
      <motion.div
        className="absolute right-3 top-[48px] w-[230px] rounded-[12px] p-3 flex gap-3"
        style={{ background: theme.dark ? '#1F2131' : '#fff', color: theme.fg, boxShadow: '0 16px 40px rgba(0,0,0,0.4)', border: `1px solid ${theme.border}` }}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: [-12, 0, 0, -12], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.12, 0.8, 1] }}
      >
        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: theme.accent }}>
          <RobotIcon size={17} weight="fill" color={theme.dark ? '#111' : '#fff'} />
        </span>
        <span className="min-w-0">
          <span className="block text-[12.5px] font-semibold">AI Agent</span>
          <span className="block text-[12px] opacity-75">Your answer is ready. Click to open.</span>
        </span>
      </motion.div>
    </>
  );
};

const StepCard = ({ step, theme }) => (
  <div className="relative w-full aspect-[400/468] rounded-[18px] overflow-hidden" style={{ boxShadow: '0 30px 60px -30px rgba(26,26,26,0.45)' }}>
    <img src={step.image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'saturate(1.05)' }} />
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.35))' }} />
    <StepDemo step={step} theme={theme} />
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-end gap-[3px] h-7 px-3.5 py-1.5 rounded-full" style={{ background: INK, border: `2px solid ${CREAM}` }}>
      {[0.6, 1, 0.5, 0.9, 0.4, 0.8, 0.55, 1, 0.45, 0.7].map((h, i) => (
        <span key={i} className="w-[3px] h-full rounded-full origin-bottom" style={{ background: CREAM, transform: `scaleY(${h})`, animation: `fl-wave ${0.9 + (i % 4) * 0.2}s ease-in-out ${i * 0.07}s infinite` }} />
      ))}
    </div>
  </div>
);

const HowItWorks = ({ how, theme }) => {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.step));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const jump = (i) => refs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const step = how.steps[active];

  return (
    <section id="how" className="fl-sec pt-24 md:pt-32" style={{ background: CREAM }}>
      <Reveal className="fl-wrap text-center">
        <Eyebrow>{how.eyebrow}</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-[20ch] text-[40px] md:text-[64px] leading-[1.02] tracking-[-0.02em]" style={SERIF}>
          {how.title} <em>{how.italic}</em>
        </h2>
      </Reveal>

      {/* desktop: one sticky stage, steps advance with scroll */}
      <div className="hidden lg:block relative" style={{ height: `${how.steps.length * 80}vh` }}>
        <div className="sticky top-[110px] fl-wrap grid grid-cols-[1fr_400px_1fr] gap-12 items-center pt-16" style={{ height: 'calc(100vh - 110px)' }}>
          <ul className="self-start mt-6 space-y-3" style={{ borderLeft: `3px solid ${BEIGE}` }}>
            {how.steps.map((s, i) => (
              <li key={s.nav}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  className="-ml-[3px] pl-4 py-0.5 text-[20px] text-left transition-colors"
                  style={{ ...SERIF, borderLeft: `3px solid ${i === active ? ORANGE : 'transparent'}`, color: i === active ? INK : '#9C9A8C' }}
                >
                  {s.nav}
                </button>
              </li>
            ))}
          </ul>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.35 }}>
              <StepCard step={step} theme={theme} />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={active} className="max-w-[300px] justify-self-end" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <h3 className="text-[30px] leading-[1.1]" style={SERIF}>
                {step.title}
              </h3>
              <p className="mt-5 text-[15px] leading-[1.55]" style={{ color: INK }}>
                {step.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
          {how.steps.map((s, i) => (
            <div key={s.nav} ref={(el) => (refs.current[i] = el)} data-step={i} style={{ height: '80vh' }} />
          ))}
        </div>
      </div>

      {/* phones and tablets: the steps simply stack */}
      <div className="lg:hidden fl-wrap mt-12 pb-10 grid gap-14">
        {how.steps.map((s) => (
          <Reveal key={s.nav} className="grid gap-6 max-w-[440px] mx-auto">
            <StepCard step={s} theme={theme} />
            <div>
              <h3 className="text-[28px] leading-[1.1]" style={SERIF}>
                {s.title}
              </h3>
              <p className="mt-3 text-[15.5px] leading-[1.55]">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ---------- feature rows: the one in focus is inked, the rest wait ---------- */

const FocusRow = ({ children }) => {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '-35% 0px -35% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="transition-opacity duration-500" style={{ opacity: on ? 1 : 0.35 }}>
      {children}
    </div>
  );
};

const FeatureDemo = ({ f, themes, themeIdx, setThemeIdx, plugins }) => {
  if (f.demo === 'themes')
    return (
      <div className="grid grid-cols-2 gap-1.5 w-full">
        {themes.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setThemeIdx(i)}
            className="flex items-center gap-2 h-7 px-2 rounded-md text-[11px] font-medium text-left transition-transform hover:-translate-y-px"
            style={{ background: t.bg, color: t.fg, outline: i === themeIdx ? `2px solid ${INK}` : 'none', outlineOffset: 1, fontFamily: "'Geist', sans-serif" }}
            aria-pressed={i === themeIdx}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.accent }} />
            <span className="truncate">{t.name}</span>
          </button>
        ))}
      </div>
    );
  if (f.demo === 'contrast') {
    const bg = '#f5f5fb';
    const raw = '#a5b4ff';
    const fixed = nudge(raw, bg);
    return (
      <div className="w-full grid gap-3">
        {[
          ['Accent as drawn', raw],
          ['After the guard rail', fixed],
        ].map(([label, fg]) => {
          const r = ratio(fg, bg);
          return (
            <div key={label} className="flex items-center justify-between gap-3 rounded-[10px] px-4 h-12" style={{ background: bg, fontFamily: "'Geist', sans-serif" }}>
              <span className="text-[14px] font-semibold" style={{ color: fg }}>
                CPU 26% · {label}
              </span>
              <span className="text-[12px] font-bold px-2 py-0.5 rounded-full shrink-0" style={r >= 4.5 ? { background: '#0F766E', color: '#fff' } : { background: '#FDE2E2', color: '#B42318' }}>
                {r.toFixed(1)}:1
              </span>
            </div>
          );
        })}
        <p className="text-[12px]" style={{ color: MUTE }}>
          Pulse Dark's accent {raw} on Pulse Light's bar, nudged along its hue to {fixed}.
        </p>
      </div>
    );
  }
  if (f.demo === 'plugins')
    return (
      <div className="flex flex-wrap gap-1.5">
        {plugins.map((p, i) => (
          <span key={p} className="text-[12px] px-2.5 py-1 rounded-full" style={{ background: i % 5 === 0 ? INK : '#fff', color: i % 5 === 0 ? CREAM : INK }}>
            {p}
          </span>
        ))}
      </div>
    );
  return (
    <pre className="w-full text-[11.5px] leading-[1.6] rounded-[10px] p-4 overflow-x-auto" style={{ background: INK, color: '#E8E6D5', fontFamily: "'Geist Mono', monospace" }}>
      {`{
  "id": "io.hisashi.weather",
  "name": "Weather",
  "entry": "io.hisashi.weather.dll",
  "permissions": ["network", "storage"],
  "widgets": [{
    "id": "current",
    "defaultZone": "Right"
  }]
}`}
    </pre>
  );
};

/* ---------- wall of cards ---------- */

const WALL_TILT = [-3, 2.5, -2, 3, -2.5, 2];

const WallCard = ({ c, i }) => {
  const tilt = WALL_TILT[i % WALL_TILT.length];
  const dark = c.color === '#34D399' || c.color === '#FF7A50' || c.color === '#FFA940';
  const body = (
    <div className="p-6 md:p-7 flex flex-col justify-between gap-8 h-full">
      <div>
        {c.kind === 'feature' && (
          <p className="text-[26px] md:text-[30px] font-bold uppercase tracking-[-0.01em] leading-none" style={{ fontFamily: "'Figtree', sans-serif", color: INK }}>
            {c.name}
          </p>
        )}
        {c.kind === 'feature' && (
          <p className="mt-1 text-[14px]" style={{ color: 'rgba(26,26,26,0.7)' }}>
            {c.role}
          </p>
        )}
        <p className={`${c.kind === 'feature' ? 'mt-5' : ''} text-[24px] md:text-[27px] leading-[1.12] tracking-[-0.01em]`} style={{ ...SERIF, color: INK }}>
          “{c.quote}”
        </p>
      </div>
      {c.kind === 'quote' ? (
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-full flex items-center justify-center text-[20px]" style={{ background: INK, color: CREAM }}>
            庇
          </span>
          <span>
            <span className="block text-[14px] font-semibold" style={{ color: INK }}>
              {c.name}
            </span>
            <span className="block text-[13px]" style={{ color: MUTE }}>
              {c.role}
            </span>
          </span>
        </div>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-[14.5px] font-medium" style={{ color: INK }}>
          See {c.name} <CaretRightIcon size={13} weight="bold" />
        </span>
      )}
    </div>
  );
  return (
    <motion.div
      className="rounded-[34px] overflow-hidden"
      style={{ background: c.color, transformOrigin: 'center' }}
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={{ rotate: 0, scale: 1.01 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16 }}
    >
      <Go href={c.href} className={`grid ${c.image ? 'md:grid-cols-2' : ''} h-full`}>
        <div className={c.flip ? 'md:order-2' : ''}>{body}</div>
        {c.image && (
          <div className={`relative m-3 md:m-4 rounded-[26px] overflow-hidden min-h-[220px] ${c.flip ? 'md:order-1' : ''}`} style={{ background: dark ? 'rgba(0,0,0,0.2)' : INK }}>
            <img src={c.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            {c.stats && (
              <div className="absolute inset-x-0 bottom-0 p-5 flex gap-6" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.92) 45%)', paddingTop: 48 }}>
                {c.stats.map((s) => (
                  <span key={s.label} className="text-white">
                    <span className="block text-[40px] leading-none" style={SERIF}>
                      {s.value}
                    </span>
                    <span className="block mt-1 text-[12.5px] font-semibold max-w-[10ch] leading-tight">{s.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </Go>
    </motion.div>
  );
};

/* ---------- FAQ as a conversation ---------- */

const Faq = ({ faq }) => {
  const [idx, setIdx] = useState(0);
  const item = faq.items[idx];
  return (
    <section id="faq" className="fl-sec pt-24 md:pt-32 pb-24" style={{ background: CREAM }}>
      <Reveal className="fl-wrap text-center">
        <Eyebrow>{faq.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[48px] md:text-[80px] leading-none tracking-[-0.02em]" style={SERIF}>
          {faq.title} <em>{faq.italic}</em>
        </h2>
      </Reveal>
      <div className="fl-wrap mt-14">
        <div className="mx-auto max-w-[860px] rounded-[36px] p-3 md:p-4 grid md:grid-cols-2 gap-4" style={{ background: BEIGE }}>
          <div className="rounded-[24px] p-4 md:p-5 max-h-[460px] overflow-y-auto" style={{ background: GREEN, color: CREAM }}>
            <p className="px-3 pb-3 text-[22px]" style={SERIF}>
              Questions
            </p>
            {faq.items.map((f, i) => (
              <button
                key={f.q}
                type="button"
                onClick={() => setIdx(i)}
                className="block w-full text-left px-4 py-3 rounded-[12px] text-[14.5px] font-semibold leading-snug transition-colors"
                style={{ background: i === idx ? 'rgba(255,255,235,0.12)' : 'transparent', color: i === idx ? CREAM : 'rgba(255,255,235,0.8)' }}
                aria-pressed={i === idx}
              >
                {f.q}
              </button>
            ))}
          </div>
          <div className="p-4 md:p-5 flex flex-col" aria-live="polite">
            <p className="text-[22px] pb-4" style={SERIF}>
              Answer
            </p>
            <AnimatePresence mode="wait">
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                <p className="text-right text-[14px] ml-auto max-w-[85%]" style={{ color: MUTE }}>
                  {item.q}
                </p>
                <div className="mt-4 rounded-[16px] rounded-bl-[4px] p-4 text-[14.5px] leading-[1.55] bg-white/70" style={{ color: INK }}>
                  {item.a}
                </div>
                <span className="mt-3 w-8 h-8 rounded-full flex items-center justify-center text-[14px]" style={{ background: GREEN, color: CREAM }}>
                  庇
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================ */

const FlowProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'flow');
  const [themeIdx, setThemeIdx] = useState(0);
  const [group, setGroup] = useState(null);

  if (loading) return <AppLoading />;
  if (failed || !cfg?.flow) return <AppMissing background={CREAM} color={INK} />;

  const f = cfg.flow;
  const themes = f.themes;
  const theme = themes[themeIdx];
  const groups = [...new Set(themes.map((t) => t.group))];
  const activeGroup = group || theme.group;
  const demoTheme = themes.find((t) => t.id === 'pulse-dark') || themes[0];

  return (
    <div id="top" className="fl-root min-h-screen overflow-x-clip" style={{ background: CREAM, color: INK, ...SANS }}>
      <style>{CSS}</style>
      <AppSeo cfg={cfg} project={project} />

      {/* ============ announcement + floating nav ============ */}
      {f.announcement && (
        <Go href={f.announcement.href} className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-3.5 text-[14.5px] font-semibold text-center" style={{ background: GREEN, color: CREAM }}>
          <span>{f.announcement.text}</span>
          <span className="inline-flex items-center gap-1">
            {f.announcement.cta} <CaretRightIcon size={12} weight="bold" />
          </span>
        </Go>
      )}
      <header className="sticky top-4 z-40 px-4 mt-4">
        <nav className="mx-auto max-w-[912px] h-[68px] flex items-center gap-3 px-2.5 md:px-3 rounded-[14px]" style={{ background: CREAM, border: `2px solid ${BEIGE}` }}>
          <Link to="/projects" aria-label="Back to projects" className="w-8 h-8 flex items-center justify-center rounded-full opacity-60 hover:opacity-100">
            <ArrowLeftIcon size={15} weight="bold" />
          </Link>
          <a href="#top" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[17px]" style={{ background: INK, color: CREAM }}>
              {cfg.mark}
            </span>
            <span className="text-[20px] font-bold tracking-[-0.02em]">{cfg.name}</span>
          </a>
          <span className="hidden sm:flex ml-3 p-1 rounded-full" style={{ background: BEIGE }}>
            {f.nav.tabs.map((t, i) => (
              <a key={t.href} href={t.href} className="px-4 h-8 inline-flex items-center rounded-full text-[14.5px] font-medium" style={i === 0 ? { background: CREAM } : undefined}>
                {t.label}
              </a>
            ))}
          </span>
          <span className="ml-auto hidden md:flex items-center gap-4 text-[14.5px] font-medium" style={{ color: MUTE }}>
            {f.nav.links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-black">
                {l.label}
              </a>
            ))}
          </span>
          <Go
            href={cfg.download}
            className="ml-auto md:ml-2 inline-flex items-center gap-2 h-11 px-4 rounded-[10px] text-[14.5px] font-medium whitespace-nowrap"
            style={{ background: LAVENDER, border: `2px solid ${INK}` }}
          >
            <WinLogo size={14} color={INK} />
            <span className="hidden sm:inline">{f.ctaLabel}</span>
            <span className="sm:hidden">Get it</span>
          </Go>
        </nav>
      </header>

      {/* ============ hero ============ */}
      <section className="relative pt-20 md:pt-28 text-center">
        <Reveal className="fl-wrap">
          <Eyebrow>{f.hero.eyebrow}</Eyebrow>
          <h1 className="mt-6 text-[50px] sm:text-[84px] md:text-[104px] leading-[0.92] tracking-[-0.03em]" style={SERIF}>
            {f.hero.line1}
            <br />
            <em>{f.hero.line2}</em>
          </h1>
          <p className="mx-auto mt-7 max-w-[400px] text-[18px] leading-[1.45]">{f.hero.subtitle}</p>
          <div className="mt-7">
            <Cta href={cfg.download}>{f.ctaLabel}</Cta>
          </div>
          <p className="mt-5 text-[13.5px]" style={{ color: MUTE }}>
            {f.hero.note}
          </p>
        </Reveal>
        <div className="mt-2 -mb-6">
          <HeroFlow hero={f.hero} />
        </div>
      </section>

      {/* ============ built-with marquee ============ */}
      <section className="relative rounded-t-[56px] md:rounded-t-[80px] pt-20 pb-32" style={{ background: NIGHT, color: CREAM }}>
        <Eyebrow color={CREAM} className="text-center">
          {f.logos.label}
        </Eyebrow>
        <div className="mt-12 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}>
          <div className="flex w-max gap-20 pr-20" style={{ animation: 'fl-marquee 40s linear infinite' }}>
            {[...f.logos.items, ...f.logos.items].map((l, i) => (
              <span key={i} className="text-[28px] font-bold tracking-[-0.01em] whitespace-nowrap opacity-90">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ one bar on every screen ============ */}
      <section className="relative -mt-16 rounded-t-[56px] md:rounded-t-[80px] rounded-b-[56px] md:rounded-b-[80px] pt-24 md:pt-32 pb-24" style={{ background: GREEN, color: CREAM }}>
        <Reveal className="fl-wrap text-center">
          <h2 className="text-[48px] md:text-[84px] leading-[0.95] tracking-[-0.03em]" style={SERIF}>
            {f.speed.title} <em>{f.speed.italic}</em>
          </h2>
          <p className="mx-auto mt-6 max-w-[620px] text-[17px] md:text-[18.5px] leading-[1.45]">{f.speed.body}</p>
        </Reveal>
        <div className="fl-wrap mt-16">
          <div className="mx-auto max-w-[1160px] grid md:grid-cols-[170px_1fr] gap-4">
            <Reveal className="rounded-[36px] p-6 flex flex-col items-center text-center min-h-[200px] md:min-h-[500px] relative overflow-hidden" style={{ border: '2px solid rgba(255,255,235,0.22)' }}>
              <p className="text-[17px] font-medium">{f.speed.before.label}</p>
              <p className="mt-1 text-[40px] leading-none" style={SERIF}>
                {f.speed.before.value}
              </p>
              <span className="absolute inset-x-5 bottom-5 h-3 rounded-full" style={{ background: 'rgba(255,255,235,0.25)' }} />
            </Reveal>
            <Reveal delay={0.08} className="relative rounded-[36px] overflow-hidden min-h-[380px] md:min-h-[500px]">
              <img src={f.speed.image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(3px) saturate(1.1)', transform: 'scale(1.06)' }} />
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.12)' }} />
              <div className="absolute inset-x-0 top-0">
                <HisashiBar theme={demoTheme} />
              </div>
              <div className="relative pt-20 md:pt-24 text-center" style={{ color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
                <p className="text-[17px] font-medium">{f.speed.after.label}</p>
                <p className="mt-1 text-[48px] md:text-[64px] leading-none" style={SERIF}>
                  {f.speed.after.value}
                </p>
              </div>
              {/* three monitors, three bars */}
              <div className="absolute inset-x-0 bottom-10 flex justify-center items-end gap-3 md:gap-5 px-6">
                {['pulse-light', 'clay-dark', 'neon-tokyo'].map((id, i) => {
                  const t = themes.find((x) => x.id === id) || demoTheme;
                  return (
                    <div key={id} className="rounded-[10px] overflow-hidden" style={{ width: i === 1 ? '34%' : '26%', aspectRatio: '16 / 10', background: 'rgba(10,12,20,0.55)', border: '3px solid rgba(20,20,20,0.85)', boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
                      <div className="h-[10%] min-h-[6px]" style={{ background: t.bg, borderBottom: `1px solid ${t.border}` }}>
                        <span className="block h-full w-[18%] ml-[6%]" style={{ background: t.accent, opacity: 0.8, transform: 'scaleY(0.4)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <HowItWorks how={f.how} theme={demoTheme} />

      {/* ============ themes ============ */}
      <section id="themes" className="fl-sec pt-24 md:pt-32 pb-12" style={{ background: CREAM }}>
        <Reveal className="fl-wrap text-center">
          <Eyebrow>{f.themesSection.eyebrow}</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-[22ch] text-[40px] md:text-[68px] leading-[1.02] tracking-[-0.02em]" style={SERIF}>
            {f.themesSection.before}{' '}
            <em className="relative inline-block">
              {f.themesSection.italic}
              <svg viewBox="0 0 300 20" className="absolute left-0 -bottom-2 w-full h-4" preserveAspectRatio="none" aria-hidden>
                <path d="M 4 14 C 80 4, 200 4, 296 12" stroke={LAVENDER} strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </em>
            <br />
            {f.themesSection.after}
          </h2>
        </Reveal>

        <div className="fl-wrap mt-14">
          <div className="mx-auto max-w-[1000px]">
            <div className="flex flex-wrap justify-center gap-2">
              {groups.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  className="h-10 px-5 rounded-full text-[15px] font-medium transition-colors"
                  style={g === activeGroup ? { background: INK, color: CREAM } : { background: BEIGE, color: INK }}
                  aria-pressed={g === activeGroup}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {themes.map((t, i) =>
                t.group === activeGroup ? (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThemeIdx(i)}
                    className="h-9 px-3.5 rounded-[10px] text-[14px] inline-flex items-center gap-2 transition-colors"
                    style={{ border: `2px solid ${i === themeIdx ? INK : BEIGE}`, background: i === themeIdx ? '#fff' : 'transparent' }}
                    aria-pressed={i === themeIdx}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ background: t.bg, boxShadow: `inset 0 0 0 3px ${t.accent}` }} />
                    {t.name}
                  </button>
                ) : null,
              )}
            </div>
            <div className="relative mt-8 rounded-[24px] overflow-hidden aspect-[16/8] min-h-[260px]" style={{ boxShadow: '0 40px 80px -40px rgba(26,26,26,0.5)' }}>
              <img src={theme.dark ? '/images/bg/emre.jpg' : '/images/bg/tim_simon.jpg'} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" />
              <div className="absolute inset-x-0 top-0">
                <HisashiBar theme={theme} />
              </div>
              <div className="absolute left-5 bottom-5 px-4 py-2 rounded-full text-[14px] font-semibold" style={{ background: 'rgba(255,255,235,0.92)' }}>
                {theme.name} <span style={{ color: MUTE }}>· {theme.group}</span>
              </div>
            </div>
            <p className="mt-4 text-center text-[13px]" style={{ color: MUTE }}>
              {f.themesSection.note}
            </p>
          </div>
        </div>

        <div className="fl-wrap mt-24 grid gap-16 md:gap-24">
          {f.features.map((feat) => (
            <FocusRow key={feat.title}>
              <div className="mx-auto max-w-[1100px] grid md:grid-cols-[400px_1fr] gap-8 md:gap-24 items-center">
                <div className="rounded-[16px] p-6 min-h-[232px] flex items-center" style={{ background: BEIGE }}>
                  <FeatureDemo f={feat} themes={themes} themeIdx={themeIdx} setThemeIdx={setThemeIdx} plugins={f.plugins} />
                </div>
                <div>
                  <h3 className="text-[36px] md:text-[48px] leading-[1.02] tracking-[-0.02em]" style={SERIF}>
                    {feat.title}
                  </h3>
                  <p className="mt-5 max-w-[520px] text-[15.5px] leading-[1.55]">{feat.body}</p>
                </div>
              </div>
            </FocusRow>
          ))}
        </div>

        {/* privacy card */}
        <Reveal className="fl-wrap mt-28">
          <div className="mx-auto max-w-[1240px] rounded-[36px] p-8 md:p-12 grid lg:grid-cols-[1fr_1.1fr_auto] gap-8 items-center" style={{ background: BEIGE }}>
            <h2 className="text-[44px] md:text-[52px] leading-[0.98]" style={SERIF}>
              {f.privacy.title}
              <br />
              <em>{f.privacy.italic}</em>
            </h2>
            <div>
              <p className="text-[15.5px] leading-[1.55] max-w-[46ch]" style={{ color: '#3F3E37' }}>
                {f.privacy.body}
              </p>
              <Go href={f.privacy.link.href} className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold">
                {f.privacy.link.label} <CaretRightIcon size={13} weight="bold" />
              </Go>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {f.privacy.badges.map((b) => (
                <span key={b.bottom} className="w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] rounded-full flex flex-col items-center justify-center text-center" style={{ border: `1.5px solid ${GREEN}`, boxShadow: `inset 0 0 0 5px ${BEIGE}, inset 0 0 0 6px ${GREEN}55` }}>
                  <span className="text-[16px] font-bold leading-none">{b.top}</span>
                  <span className="mt-1 text-[11.5px]" style={{ color: MUTE }}>
                    {b.bottom}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ wall ============ */}
      <section id="apps" className="fl-sec mt-16 rounded-[56px] md:rounded-[80px] pt-24 md:pt-32 pb-28" style={{ background: NIGHT, color: CREAM }}>
        <Reveal className="fl-wrap text-center">
          <Eyebrow color={CREAM}>{f.wall.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-[48px] md:text-[80px] leading-[0.95] tracking-[-0.02em]" style={SERIF}>
            {f.wall.title}
            <br />
            <em>{f.wall.italic}</em>
          </h2>
        </Reveal>
        <div className="fl-wrap mt-20 grid md:grid-cols-12 gap-8 md:gap-y-14">
          {f.wall.cards.map((c, i) => {
            const spans = ['md:col-span-7 md:col-start-6', 'md:col-span-4 md:col-start-1 md:-mt-40', 'md:col-span-4 md:col-start-5', 'md:col-span-8 md:col-start-5', 'md:col-span-7 md:col-start-1', 'md:col-span-7 md:col-start-6'];
            return (
              <div key={c.name + c.quote} className={spans[i % spans.length]}>
                <WallCard c={c} i={i} />
              </div>
            );
          })}
        </div>
      </section>

      <Faq faq={f.faq} />

      {/* ============ closing band ============ */}
      <section className="relative mx-0 rounded-[56px] md:rounded-[80px] overflow-hidden text-center" style={{ color: CREAM }}>
        <img src={f.closing.image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(8px) saturate(1.1)', transform: 'scale(1.1)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.55))' }} />
        <div className="relative fl-wrap py-32 md:py-44">
          <Reveal>
            <h2 className="mx-auto max-w-[16ch] text-[48px] md:text-[96px] leading-[0.95] tracking-[-0.03em]" style={SERIF}>
              {f.closing.title} <em>{f.closing.italic}</em>
            </h2>
            <p className="mx-auto mt-7 max-w-[520px] text-[18px] leading-[1.45]">{f.closing.body}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Cta href={cfg.download}>{f.ctaLabel}</Cta>
              <Go href={cfg.repo} className="inline-flex items-center gap-2 h-[52px] px-6 rounded-[10px] text-[15.5px] font-medium" style={{ border: `2px solid ${CREAM}`, color: CREAM }}>
                <GithubLogoIcon size={17} /> Source
              </Go>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ footer ============ */}
      <footer className="fl-wrap pt-20 pb-10">
        <Eyebrow>Products</Eyebrow>
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          {f.footer.products.map((p) => (
            <Go key={p.name} href={p.href} className="group grid grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] gap-6 p-2.5 rounded-[16px] transition-colors" style={{ background: BEIGE }}>
              <span className="aspect-square rounded-[12px] flex items-center justify-center" style={{ background: p.art === 'bar' ? LAVENDER : GREEN }}>
                {p.art === 'bar' ? (
                  <span className="flex items-center gap-1.5 h-7 px-2.5 rounded-full" style={{ background: INK }}>
                    <WinLogo size={10} color={CREAM} />
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className="w-2.5 h-1.5 rounded-sm" style={{ background: i === 1 ? '#D7F59A' : CREAM }} />
                    ))}
                  </span>
                ) : (
                  <img src="/images/projects/airlift/logo.svg" alt="" className="w-14 h-14" />
                )}
              </span>
              <span className="py-3 pr-3">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[17px] font-medium">{p.name}</span>
                  {p.badge && (
                    <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: '#FFB35C' }}>
                      {p.badge}
                    </span>
                  )}
                </span>
                <span className="mt-2 block text-[15px] leading-[1.45]" style={{ color: MUTE }}>
                  {p.body}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[15.5px] font-medium">
                  {p.cta} <CaretRightIcon size={13} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Go>
          ))}
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          {f.footer.columns.map((col) => (
            <div key={col.title}>
              <Eyebrow>{col.title}</Eyebrow>
              <ul className="mt-4 space-y-2.5 text-[15px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Go href={l.href} className="hover:underline">
                      {l.label}
                    </Go>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <Eyebrow>{cfg.name}</Eyebrow>
            <p className="mt-4 text-[15px] leading-[1.5]" style={{ color: MUTE }}>
              v{cfg.version} · {(cfg.stack || []).join(' · ')}
            </p>
            <Link to="/projects" className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium hover:underline">
              <ArrowLeftIcon size={13} weight="bold" /> Back to projects
            </Link>
          </div>
        </div>
        <div className="mt-16 pt-6 flex flex-wrap justify-between gap-3 text-[13.5px]" style={{ borderTop: `1px solid ${BEIGE}`, color: MUTE }}>
          <span>© {new Date().getFullYear()} Fezcode · {cfg.name} is MIT licensed</span>
          <Go href={cfg.repo} className="inline-flex items-center gap-1.5 hover:text-black">
            <GithubLogoIcon size={15} /> fezcode/hisashi
          </Go>
        </div>
      </footer>
    </div>
  );
};

export default FlowProjectPage;
