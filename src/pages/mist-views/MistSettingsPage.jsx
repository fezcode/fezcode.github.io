import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrophyIcon,
  ArrowCounterClockwiseIcon,
  CaretDownIcon,
  CheckIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useAnimation } from '../../context/AnimationContext';
import { useAchievements } from '../../context/AchievementContext';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import { useToast } from '../../hooks/useToast';
import { useHomepageOrder } from '../../context/HomepageOrderContext';
import { DndContext } from '../../context/DndContext';
import {
  KEY_SIDEBAR_STATE,
  KEY_APPS_COLLAPSED_CATEGORIES,
  remove as removeLocalStorageItem,
} from '../../utils/LocalStorageManager';
import {
  MistVeil,
  MistOrb,
  MistHorizon,
  MistStrip,
  MistChapter,
  ChapterEm,
  MistSpec,
  MistColophon,
} from '../../components/mist';

const FOG_GRADIENT =
  'radial-gradient(1100px 600px at 80% -10%, #FFFFFF 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #D2DBD8 0%, transparent 50%), radial-gradient(700px 500px at 95% 90%, #E5EBE9 0%, transparent 45%)';

/* =========================================================================
   MistToggle — an orb drifting along a fog track. No hard edges; the knob
   is a small moon that glows drift-blue when the setting is awake.
   ========================================================================= */
const MistToggle = ({ id, checked, onChange, label }) => (
  <div
    className="flex items-center gap-4 cursor-pointer select-none group"
    onClick={() => onChange({ target: { checked: !checked } })}
  >
    {label && (
      <label
        htmlFor={id}
        className="font-ibm-plex-mono text-[10px] tracking-[0.16em] lowercase text-[#5C6B67] group-hover:text-[#5F837B] transition-colors duration-250 cursor-pointer pointer-events-none"
      >
        {label}
      </label>
    )}
    <span
      role="switch"
      aria-checked={checked}
      className="relative inline-block shrink-0 rounded-full transition-colors duration-250"
      style={{
        width: 46,
        height: 24,
        background: checked
          ? 'linear-gradient(90deg, rgba(95,131,123,0.35), rgba(143,168,188,0.45))'
          : 'rgba(60,72,69,0.10)',
        boxShadow: 'inset 0 0 0 1px rgba(60,72,69,0.10)',
      }}
    >
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <motion.span
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          top: 3,
          left: 3,
          width: 18,
          height: 18,
          background:
            'radial-gradient(circle at 38% 32%, #FDFEFE 0%, #E9EFED 55%, #C9D5D2 100%)',
          boxShadow: checked
            ? '0 0 10px 2px rgba(143,168,188,0.55)'
            : '0 2px 6px rgba(60,72,69,0.18)',
        }}
        animate={{ x: checked ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    </span>
  </div>
);

/* =========================================================================
   MistDropdown — a veil that parts beneath the button. Options surface
   from blur; the chosen one carries a drift-blue wash.
   ========================================================================= */
const MistDropdown = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between gap-3 px-5 py-2 rounded-full bg-white/40 backdrop-blur-sm ring-1 ring-[#3C4845]/10 hover:bg-white/60 transition-colors duration-250"
      >
        <span className="font-instr-serif text-[16px] text-[#3C4845]">
          {selected ? selected.label : label}
        </span>
        <CaretDownIcon
          size={12}
          weight="light"
          className={`text-[#5F837B] transition-transform duration-250 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
            transition={{ duration: 0.25 }}
            className="absolute right-0 mt-2 z-50 min-w-[230px] max-h-80 overflow-y-auto rounded-2xl bg-white/70 backdrop-blur-md shadow-[0_18px_50px_rgba(60,72,69,0.18)] p-1.5"
          >
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-2 text-left rounded-xl font-instr-serif text-[15px] transition-colors duration-250 ${
                    isSelected
                      ? 'bg-[#8FA8BC]/15 text-[#5F837B] italic'
                      : 'text-[#3C4845] hover:bg-white/80 hover:text-[#5F837B]'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <CheckIcon size={12} className="text-[#5F837B]" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingRow = ({ number, heading, description, control }) => (
  <li className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-10 items-center py-6 pl-[46px] border-b border-[#3C4845]/10">
    <span
      aria-hidden="true"
      className="absolute left-0 top-6 font-ibm-plex-mono text-[10.5px] tracking-[0.08em] lowercase text-[#5F837B]"
    >
      {String(number).padStart(2, '0')}
    </span>
    <div>
      <h4 className="font-instr-serif text-[18px] md:text-[20px] text-[#3C4845] font-normal">
        {heading}
      </h4>
      {description && (
        <p className="mt-1 font-outfit font-light text-[14px] leading-[1.55] text-[#5C6B67] max-w-[64ch]">
          {description}
        </p>
      )}
    </div>
    <div className="justify-self-start md:justify-self-end">{control}</div>
  </li>
);

const MistSettingsPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [location.hash]);

  const {
    unlockAchievement,
    showAchievementToast,
    toggleAchievementToast,
  } = useAchievements();

  useEffect(() => {
    unlockAchievement('power_user');
  }, [unlockAchievement]);

  const { reduceMotion, toggleReduceMotion } = useAnimation();

  const {
    isInverted, toggleInvert,
    isRetro, toggleRetro,
    isParty, toggleParty,
    isMirror, toggleMirror,
    isNoir, toggleNoir,
    isTerminal, toggleTerminal,
    isBlueprint, toggleBlueprint,
    isSepia, toggleSepia,
    isVaporwave, toggleVaporwave,
    isCyberpunk, toggleCyberpunk,
    isGameboy, toggleGameboy,
    isComic, toggleComic,
    isSketchbook, toggleSketchbook,
    isHellenic, toggleHellenic,
    isGlitch, toggleGlitch,
    isGarden, toggleGarden,
    isAutumn, toggleAutumn,
    isRain, toggleRain,
    isSplashTextEnabled, toggleSplashText,
    isAppFullscreen, toggleAppFullscreen,
    isSyntaxSpriteEnabled, toggleSyntaxSprite,
    fezcodexTheme, setFezcodexTheme,
    blogPostViewMode, setBlogPostViewMode,
    headerFont, setHeaderFont,
    bodyFont, setBodyFont,
    availableFonts,
    isFalloutOverlay, toggleFalloutOverlay,
    falloutVariant, setFalloutVariant,
    isFalloutNoiseEnabled, toggleFalloutNoise,
    isFalloutScanlinesEnabled, toggleFalloutScanlines,
    isFalloutVignetteEnabled, toggleFalloutVignette,
  } = useVisualSettings();

  const {
    isLightningEnabled, toggleLightning,
    isLootDiscoveryEnabled, toggleLootDiscovery,
    isFireOverlayEnabled, toggleFireOverlay,
    isFireParticlesEnabled, toggleFireParticles,
    isViewportFrameEnabled, toggleViewportFrame,
  } = React.useContext(DndContext);

  const { addToast } = useToast();
  const { sectionOrder, toggleSectionOrder, resetSectionOrder } =
    useHomepageOrder();

  const handleResetSidebarState = () => {
    removeLocalStorageItem(KEY_SIDEBAR_STATE);
    addToast({
      title: 'sidebar, settled',
      message: 'defaults restored. refreshing…',
      duration: 2000,
    });
    setTimeout(() => window.location.reload(), 1800);
  };

  const handleResetAppsState = () => {
    removeLocalStorageItem(KEY_APPS_COLLAPSED_CATEGORIES);
    addToast({
      title: 'every veil parted',
      message: 'all app categories reopened.',
      duration: 2000,
    });
    setTimeout(() => window.location.reload(), 1800);
  };

  const handleClearStorage = () => {
    localStorage.clear();
    addToast({
      title: 'the fog took everything',
      message: 'every preference dissolved. the codex will wake again.',
      duration: 2500,
    });
    setTimeout(() => {
      const now = new Date().toISOString();
      localStorage.setItem(
        'unlocked-achievements',
        JSON.stringify({ clean_slate: { unlocked: true, unlockedAt: now } }),
      );
      addToast({
        title: 'honor held · clean slate',
        message: 'a blank dawn for the codex.',
        duration: 3200,
        icon: <TrophyIcon weight="duotone" style={{ color: '#B88532' }} />,
        type: 'gold',
      });
    }, 400);
    setTimeout(() => window.location.reload(), 3000);
  };

  const fxToggles = useMemo(
    () => [
      { id: 'fx-invert',     label: 'invert colors',     checked: isInverted,     onChange: toggleInvert },
      { id: 'fx-retro',      label: 'retro crt',         checked: isRetro,        onChange: toggleRetro },
      { id: 'fx-party',      label: 'party mode',        checked: isParty,        onChange: toggleParty },
      { id: 'fx-mirror',     label: 'mirror world',      checked: isMirror,       onChange: toggleMirror },
      { id: 'fx-noir',       label: 'film noir',         checked: isNoir,         onChange: toggleNoir },
      { id: 'fx-terminal',   label: 'emerald terminal',  checked: isTerminal,     onChange: toggleTerminal },
      { id: 'fx-blueprint',  label: 'blueprint',         checked: isBlueprint,    onChange: toggleBlueprint },
      { id: 'fx-sepia',      label: 'vintage sepia',     checked: isSepia,        onChange: toggleSepia },
      { id: 'fx-vaporwave',  label: 'vaporwave',         checked: isVaporwave,    onChange: toggleVaporwave },
      { id: 'fx-cyberpunk',  label: 'cyberpunk',         checked: isCyberpunk,    onChange: toggleCyberpunk },
      { id: 'fx-gameboy',    label: 'legacy handheld',   checked: isGameboy,      onChange: toggleGameboy },
      { id: 'fx-comic',      label: 'comic array',       checked: isComic,        onChange: toggleComic },
      { id: 'fx-sketchbook', label: 'graphite map',      checked: isSketchbook,   onChange: toggleSketchbook },
      { id: 'fx-hellenic',   label: 'classical agora',   checked: isHellenic,     onChange: toggleHellenic },
      { id: 'fx-glitch',     label: 'data corruption',   checked: isGlitch,       onChange: toggleGlitch },
      { id: 'fx-garden',     label: 'flora protocol',    checked: isGarden,       onChange: toggleGarden },
      { id: 'fx-autumn',     label: 'seasonal decay',    checked: isAutumn,       onChange: toggleAutumn },
      { id: 'fx-rain',       label: 'hydraulic filter',  checked: isRain,         onChange: toggleRain },
    ],
    [
      isInverted, isRetro, isParty, isMirror, isNoir, isTerminal, isBlueprint,
      isSepia, isVaporwave, isCyberpunk, isGameboy, isComic, isSketchbook,
      isHellenic, isGlitch, isGarden, isAutumn, isRain,
      toggleInvert, toggleRetro, toggleParty, toggleMirror, toggleNoir,
      toggleTerminal, toggleBlueprint, toggleSepia, toggleVaporwave,
      toggleCyberpunk, toggleGameboy, toggleComic, toggleSketchbook,
      toggleHellenic, toggleGlitch, toggleGarden, toggleAutumn, toggleRain,
    ],
  );

  return (
    <div
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Settings | Fezcodex"
        description="The drift ledger — every preference the codex keeps while waking, adjusted gently."
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1080px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift xi · calibration"
          center="adjust gently — the fog remembers"
          right="local only"
        />

        <section className="pt-20 md:pt-28 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end"
          >
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] lowercase text-[#5F837B] mb-6 flex items-center gap-3">
                <span>codex entry</span>
                <MistHorizon className="flex-1 max-w-[60px]" tint="rgba(95,131,123,0.5)" />
                <span>drift xi</span>
              </div>
              <h1
                className="font-instr-serif text-[64px] md:text-[120px] leading-[0.9] tracking-[-0.025em] text-[#3C4845] font-normal"
              >
                the<br />
                <ChapterEm>calibration</ChapterEm>
                <em aria-hidden="true" className="text-[#5F837B] not-italic">
                  .
                </em>
              </h1>
            </div>
            <aside className="flex flex-col gap-5">
              <p className="font-instr-serif text-[20px] leading-[1.45] text-[#3C4845] max-w-[36ch]">
                every setting on this sheet is kept in{' '}
                <em className="italic text-[#5F837B]">local storage</em>,
                half-asleep on this device. nothing travels. nothing is logged.
              </p>
              <div>
                <MistHorizon />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <MistSpec label="persistence" value="this device" />
                  <MistSpec label="scope" value="visual only" />
                  <MistSpec label="undo" value="reset below" />
                  <MistSpec label="theme" value={fezcodexTheme} />
                </div>
              </div>
            </aside>
          </motion.div>
        </section>

        <section id="interface" className="pt-16">
          <MistHorizon className="mb-16" />
          <MistChapter
            numeral="i"
            label="interface"
            title={<>how the <ChapterEm>page is held.</ChapterEm></>}
            blurb="theme, reading mode, dashboard priority."
          />
          <ol>
            <MistHorizon tint="rgba(60,72,69,0.18)" />
            <SettingRow
              number={1}
              heading="fezcodex theme"
              description="the visual foundation — dark/neon brutalist, light/refined luxe, warm terracotta, or this fog."
              control={
                <MistDropdown
                  label="select theme"
                  options={[
                    { label: 'brutalist (dark)', value: 'brutalist' },
                    { label: 'luxe (refined)', value: 'luxe' },
                    { label: 'terracotta (warm)', value: 'terracotta' },
                    { label: 'mist (this fog)', value: 'mist' },
                  ]}
                  value={fezcodexTheme}
                  onChange={setFezcodexTheme}
                />
              }
            />
            <SettingRow
              number={2}
              heading="long-form reader"
              description="default rendering style for blog posts and field notes."
              control={
                <MistDropdown
                  label="select view"
                  options={[
                    { label: 'default', value: 'standard' },
                    { label: 'brutalist', value: 'brutalist' },
                    { label: 'editorial', value: 'editorial' },
                    { label: 'classic', value: 'old' },
                    { label: 'dossier', value: 'dossier' },
                    { label: 'dokument', value: 'dokument' },
                    { label: 'terminal (amber)', value: 'terminal' },
                    { label: 'terminal (emerald)', value: 'terminal-green' },
                    { label: 'luxe', value: 'luxe' },
                    { label: 'terracotta', value: 'terracotta' },
                    { label: 'galley proof', value: 'galley' },
                  ]}
                  value={blogPostViewMode}
                  onChange={setBlogPostViewMode}
                />
              }
            />
            <SettingRow
              number={3}
              heading="dashboard order"
              description="which chapter surfaces first on the home page — archive or field notes."
              control={
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => {
                      resetSectionOrder();
                      addToast({
                        title: 'order restored',
                        message: 'dashboard reset to defaults.',
                        duration: 1800,
                      });
                    }}
                    className="font-ibm-plex-mono text-[10px] tracking-[0.2em] lowercase text-[#5C6B67] hover:text-[#5F837B] transition-colors duration-250 inline-flex items-center gap-1.5"
                  >
                    <ArrowCounterClockwiseIcon size={11} /> reset
                  </button>
                  <MistToggle
                    id="homepage-section-order"
                    label="notes before archive"
                    checked={sectionOrder[0] === 'blogposts'}
                    onChange={toggleSectionOrder}
                  />
                </div>
              }
            />
            <SettingRow
              number={4}
              heading="app fullscreen"
              description="let the chrome dissolve when running an instrument."
              control={
                <MistToggle
                  id="app-fullscreen"
                  label="fullscreen apps"
                  checked={isAppFullscreen}
                  onChange={toggleAppFullscreen}
                />
              }
            />
          </ol>
        </section>

        <section id="typography" className="pt-20">
          <MistChapter
            numeral="ii"
            label="typography"
            title={<>how the <ChapterEm>ink settles.</ChapterEm></>}
            blurb="font choices for long-form reading."
          />
          <div className="mt-4 mb-2 px-5 py-4 rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] flex items-start gap-3">
            <span aria-hidden="true" className="text-[#8FA8BC]">◦</span>
            <span className="font-outfit font-light text-[13px] text-[#5C6B67] leading-relaxed">
              note — only the brutalist theme answers these font picks. luxe,
              terracotta and mist keep their set typography so each identity
              holds. the selection still saves, half-remembered, for when you
              switch themes.
            </span>
          </div>
          <ol>
            <MistHorizon tint="rgba(60,72,69,0.18)" />
            <SettingRow
              number={5}
              heading="header font"
              description="used for blog-post headings and titles in reader views."
              control={
                <MistDropdown
                  label="select face"
                  options={availableFonts.map((f) => ({ label: f.name, value: f.id }))}
                  value={headerFont}
                  onChange={setHeaderFont}
                />
              }
            />
            <SettingRow
              number={6}
              heading="body font"
              description="running text in reader views."
              control={
                <MistDropdown
                  label="select face"
                  options={availableFonts.map((f) => ({ label: f.name, value: f.id }))}
                  value={bodyFont}
                  onChange={setBodyFont}
                />
              }
            />
          </ol>
        </section>

        <section id="motion" className="pt-20">
          <MistChapter
            numeral="iii"
            label="motion & companion"
            title={<>what <ChapterEm>drifts</ChapterEm>, what stays still.</>}
            blurb="animation, splash text, and the companion who reads over your shoulder."
          />
          <ol>
            <MistHorizon tint="rgba(60,72,69,0.18)" />
            <SettingRow
              number={7}
              heading="reduce motion"
              description="honour device-level motion sensitivity; let the framer animations rest."
              control={
                <MistToggle
                  id="reduce-motion"
                  label={reduceMotion ? 'resting' : 'drifting'}
                  checked={reduceMotion}
                  onChange={toggleReduceMotion}
                />
              }
            />
            <SettingRow
              number={8}
              heading="splash quotations"
              description="a rotating line beneath the hero on the home page."
              control={
                <MistToggle
                  id="fx-splash"
                  label="splash"
                  checked={isSplashTextEnabled}
                  onChange={toggleSplashText}
                />
              }
            />
            <SettingRow
              number={9}
              heading="syntax · the companion"
              description="a small sprite that walks along the bottom and leaves marginal notes."
              control={
                <MistToggle
                  id="enable-syntax-sprite"
                  label={isSyntaxSpriteEnabled ? 'present' : 'asleep'}
                  checked={isSyntaxSpriteEnabled}
                  onChange={toggleSyntaxSprite}
                />
              }
            />
            <SettingRow
              number={10}
              heading="honor notices"
              description="surface a whisper-toast each time an achievement is held."
              control={
                <MistToggle
                  id="enable-achievement-toasts"
                  label={showAchievementToast ? 'on' : 'silent'}
                  checked={showAchievementToast}
                  onChange={toggleAchievementToast}
                />
              }
            />
          </ol>
        </section>

        <section id="visual-matrix" className="pt-20">
          <MistChapter
            numeral="iv"
            label="visual matrix"
            title={<>filters, <ChapterEm>half-dreamt.</ChapterEm></>}
            blurb="experimental overlays — wake one or two; let the rest sleep."
          />
          <MistHorizon tint="rgba(60,72,69,0.18)" />
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {fxToggles.map((t, i) => (
              <SettingRow
                key={t.id}
                number={11 + i}
                heading={t.label}
                control={
                  <MistToggle
                    id={t.id}
                    label=""
                    checked={t.checked}
                    onChange={t.onChange}
                  />
                }
              />
            ))}
          </ol>

          <div className="mt-10 rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 mb-6">
              <div className="flex items-baseline gap-3 font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase">
                <span className="text-[#5F837B]">veil 29</span>
                <span className="text-[#3C4845]">fallout overlay</span>
              </div>
              <MistToggle
                id="fx-fallout"
                label={isFalloutOverlay ? 'awake' : 'asleep'}
                checked={isFalloutOverlay}
                onChange={toggleFalloutOverlay}
              />
            </div>
            <MistHorizon />
            {isFalloutOverlay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center pt-6">
                <div className="flex items-center gap-4">
                  <span className="font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5C6B67]">
                    variant
                  </span>
                  <MistDropdown
                    label="variant"
                    options={[
                      { label: 'new vegas (amber)', value: 'amber' },
                      { label: 'fallout 3 (green)', value: 'green' },
                    ]}
                    value={falloutVariant}
                    onChange={setFalloutVariant}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 pt-5">
                  <MistToggle
                    id="fallout-noise"
                    label="signal noise"
                    checked={isFalloutNoiseEnabled}
                    onChange={toggleFalloutNoise}
                  />
                  <MistToggle
                    id="fallout-scanlines"
                    label="crt scanlines"
                    checked={isFalloutScanlinesEnabled}
                    onChange={toggleFalloutScanlines}
                  />
                  <MistToggle
                    id="fallout-vignette"
                    label="screen vignette"
                    checked={isFalloutVignetteEnabled}
                    onChange={toggleFalloutVignette}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="dnd" className="pt-20">
          <MistChapter
            numeral="v"
            label="serfs & frauds"
            title={<>the <ChapterEm>hearth-fire</ChapterEm>, seen through fog.</>}
            blurb={'immersive effects for the "from serfs and frauds" d&d archive.'}
          />
          <ol>
            <MistHorizon tint="rgba(60,72,69,0.18)" />
            <SettingRow
              number={32}
              heading="lightning strikes"
              description="occasional flashes across the story sheet."
              control={
                <MistToggle
                  id="dnd-lightning"
                  label="lightning"
                  checked={isLightningEnabled}
                  onChange={toggleLightning}
                />
              }
            />
            <SettingRow
              number={33}
              heading="loot discovery"
              description="found objects announce themselves when passed."
              control={
                <MistToggle
                  id="dnd-loot"
                  label="loot"
                  checked={isLootDiscoveryEnabled}
                  onChange={toggleLootDiscovery}
                />
              }
            />
            <SettingRow
              number={34}
              heading="fire overlay"
              description="a slow ember halo along the page edges."
              control={
                <MistToggle
                  id="dnd-fire-overlay"
                  label="fire"
                  checked={isFireOverlayEnabled}
                  onChange={toggleFireOverlay}
                />
              }
            />
            <SettingRow
              number={35}
              heading="fire particles"
              description="rising embers, drifting across the reading area."
              control={
                <MistToggle
                  id="dnd-fire-particles"
                  label="embers"
                  checked={isFireParticlesEnabled}
                  onChange={toggleFireParticles}
                />
              }
            />
            <SettingRow
              number={36}
              heading="viewport frame"
              description="a parchment-style border around the whole page."
              control={
                <MistToggle
                  id="dnd-frame"
                  label="frame"
                  checked={isViewportFrameEnabled}
                  onChange={toggleViewportFrame}
                />
              }
            />
          </ol>
        </section>

        <section id="feedback" className="pt-20">
          <MistChapter
            numeral="vi"
            label="feedback proofs"
            title={<>test a <ChapterEm>whisper.</ChapterEm></>}
            blurb="surface one of each toast variant to verify delivery."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: 'success', label: 'confirmed', copy: 'kept while waking.' },
              { type: 'error',   label: 'error',     copy: 'something slipped.' },
              { type: 'gold',    label: 'honor',     copy: 'a mark was held.' },
              { type: 'techno',  label: 'signal',    copy: 'channel connected.' },
            ].map((t, i) => (
              <motion.button
                key={t.type}
                type="button"
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                onClick={() =>
                  addToast({
                    title: t.label,
                    message: t.copy,
                    type: t.type,
                  })
                }
                className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] hover:bg-white/60 transition-colors duration-250 text-left"
              >
                <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase text-[#5F837B]">
                  {t.type}
                </div>
                <div className="mt-1 font-instr-serif italic text-[16px] text-[#3C4845]">
                  {t.label} →
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section id="advanced" className="pt-20">
          <MistChapter
            numeral="vii"
            label="data administration"
            title={<>reset <ChapterEm>small things.</ChapterEm></>}
            blurb="restore sub-systems without losing the archive."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleResetSidebarState}
              className="group text-left rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] hover:bg-white/60 transition-colors duration-250 p-6"
            >
              <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase text-[#5F837B] mb-2">
                sidebar
              </div>
              <div className="font-instr-serif italic text-[22px] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-250">
                let it settle.
              </div>
              <p className="mt-1 font-ibm-plex-mono text-[10.5px] lowercase text-[#8A9894]">
                restore every section to its default open/closed state.
              </p>
            </button>
            <button
              type="button"
              onClick={handleResetAppsState}
              className="group text-left rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] hover:bg-white/60 transition-colors duration-250 p-6"
            >
              <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase text-[#5F837B] mb-2">
                app categories
              </div>
              <div className="font-instr-serif italic text-[22px] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-250">
                part every veil.
              </div>
              <p className="mt-1 font-ibm-plex-mono text-[10.5px] lowercase text-[#8A9894]">
                reset the app-center category collapse state.
              </p>
            </button>
          </div>
        </section>

        <section id="danger-zone" className="pt-20">
          <MistChapter
            numeral="viii"
            label="clean slate"
            title={<>begin again, <ChapterEm>blank as dawn.</ChapterEm></>}
            blurb="the only irreversible action on this page."
          />
          <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9 }}
            className="relative rounded-2xl bg-white/50 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] p-8 md:p-10"
          >
            <MistHorizon
              className="absolute top-0 left-0 right-0"
              tint="rgba(95,131,123,0.6)"
            />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="shrink-0">
                <MistOrb size={56} />
              </div>
              <div className="flex-1">
                <h3 className="font-instr-serif italic text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.02em] text-[#3C4845] font-normal">
                  the fog takes everything.
                </h3>
                <p className="mt-2 font-ibm-plex-mono text-[11px] leading-[1.7] lowercase text-[#5C6B67] max-w-[50ch]">
                  clears every preference in local storage — theme, fonts,
                  honors, dashboard order. this cannot be undone; nothing is
                  kept while waking.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearStorage}
                className="rounded-full bg-[#5F837B] text-[#EEF2F1] hover:bg-[#3C4845] transition-colors duration-250 px-7 py-3 font-ibm-plex-mono text-[10px] tracking-[0.24em] lowercase"
              >
                let it dissolve
              </button>
            </div>
          </motion.div>
        </section>

        <div className="pt-14 mt-16">
          <MistHorizon className="mb-8" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <Link
              to="/"
              className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-250"
            >
              ← drift back to the codex
            </Link>
            <span className="font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#8A9894]">
              connected · local · adrift
            </span>
          </div>
        </div>

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode</span>
              <span>settings · mist calibration · kept while waking</span>
            </>
          }
        />

        <div className="fixed bottom-6 right-6 opacity-50 pointer-events-none z-20 hidden md:block">
          <MistOrb size={22} />
        </div>
      </div>
    </div>
  );
};

export default MistSettingsPage;
