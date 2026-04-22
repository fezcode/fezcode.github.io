import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrophyIcon,
  WarningIcon,
  ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import TerracottaToggle from '../../components/TerracottaToggle';
import CustomDropdown from '../../components/CustomDropdown';
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
  TerracottaStrip,
  TerracottaChapter,
  ChapterEm,
  TerracottaMark,
  TerracottaColophon,
  TerracottaSpec,
} from '../../components/terracotta';

const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;
const PAPER_GRADIENT =
  'radial-gradient(1100px 600px at 85% -10%, #E8DECE 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #EDE3D3 0%, transparent 50%)';

const SettingRow = ({ number, heading, description, control }) => (
  <li
    className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-10 items-center py-6 pl-[46px] border-b border-dashed border-[#1A161320]"
  >
    <span
      aria-hidden="true"
      className="absolute left-0 top-6 font-ibm-plex-mono text-[11px] tracking-[0.08em] text-[#9E4A2F] font-medium"
    >
      {String(number).padStart(2, '0')}
    </span>
    <div>
      <h4
        className="font-fraunces text-[17px] md:text-[19px] tracking-[-0.01em] text-[#1A1613]"
        style={{
          fontVariationSettings:
            '"opsz" 22, "SOFT" 50, "WONK" 1, "wght" 440',
        }}
      >
        {heading}
      </h4>
      {description && (
        <p
          className="mt-1 font-fraunces italic text-[14.5px] leading-[1.45] text-[#2E2620] max-w-[64ch]"
          style={{
            fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 360',
          }}
        >
          {description}
        </p>
      )}
    </div>
    <div className="justify-self-start md:justify-self-end">{control}</div>
  </li>
);

const TerracottaSettingsPage = () => {
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
      title: 'Sidebar returned to plumb',
      message: 'Defaults restored. Refreshing…',
      duration: 2000,
    });
    setTimeout(() => window.location.reload(), 1800);
  };

  const handleResetAppsState = () => {
    removeLocalStorageItem(KEY_APPS_COLLAPSED_CATEGORIES);
    addToast({
      title: 'Instrument shelves reset',
      message: 'All app categories reopened.',
      duration: 2000,
    });
    setTimeout(() => window.location.reload(), 1800);
  };

  const handleClearStorage = () => {
    localStorage.clear();
    addToast({
      title: 'Slate wiped clean',
      message: 'Every preference reset. The codex will restart.',
      duration: 2500,
    });
    setTimeout(() => {
      const now = new Date().toISOString();
      localStorage.setItem(
        'unlocked-achievements',
        JSON.stringify({ clean_slate: { unlocked: true, unlockedAt: now } }),
      );
      addToast({
        title: 'Honor held · Clean Slate',
        message: 'A fresh page for the codex.',
        duration: 3200,
        icon: <TrophyIcon weight="duotone" style={{ color: '#B88532' }} />,
        type: 'gold',
      });
    }, 400);
    setTimeout(() => window.location.reload(), 3000);
  };

  const fxToggles = useMemo(
    () => [
      { id: 'fx-invert',     label: 'Invert Colors',     checked: isInverted,     onChange: toggleInvert },
      { id: 'fx-retro',      label: 'Retro CRT',         checked: isRetro,        onChange: toggleRetro },
      { id: 'fx-party',      label: 'Party Mode',        checked: isParty,        onChange: toggleParty },
      { id: 'fx-mirror',     label: 'Mirror World',      checked: isMirror,       onChange: toggleMirror },
      { id: 'fx-noir',       label: 'Film Noir',         checked: isNoir,         onChange: toggleNoir },
      { id: 'fx-terminal',   label: 'Emerald Terminal',  checked: isTerminal,     onChange: toggleTerminal },
      { id: 'fx-blueprint',  label: 'Blueprint',         checked: isBlueprint,    onChange: toggleBlueprint },
      { id: 'fx-sepia',      label: 'Vintage Sepia',     checked: isSepia,        onChange: toggleSepia },
      { id: 'fx-vaporwave',  label: 'Vaporwave',         checked: isVaporwave,    onChange: toggleVaporwave },
      { id: 'fx-cyberpunk',  label: 'Cyberpunk',         checked: isCyberpunk,    onChange: toggleCyberpunk },
      { id: 'fx-gameboy',    label: 'Legacy Handheld',   checked: isGameboy,      onChange: toggleGameboy },
      { id: 'fx-comic',      label: 'Comic Array',       checked: isComic,        onChange: toggleComic },
      { id: 'fx-sketchbook', label: 'Graphite Map',      checked: isSketchbook,   onChange: toggleSketchbook },
      { id: 'fx-hellenic',   label: 'Classical Agora',   checked: isHellenic,     onChange: toggleHellenic },
      { id: 'fx-glitch',     label: 'Data Corruption',   checked: isGlitch,       onChange: toggleGlitch },
      { id: 'fx-garden',     label: 'Flora Protocol',    checked: isGarden,       onChange: toggleGarden },
      { id: 'fx-autumn',     label: 'Seasonal Decay',    checked: isAutumn,       onChange: toggleAutumn },
      { id: 'fx-rain',       label: 'Hydraulic Filter',  checked: isRain,         onChange: toggleRain },
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
      className="min-h-screen relative text-[#1A1613] font-fraunces selection:bg-[#C96442]/25"
      style={{
        background: '#F3ECE0',
        backgroundImage: PAPER_GRADIENT,
        fontFeatureSettings: '"ss01", "ss02", "kern"',
      }}
    >
      <Seo
        title="Settings | Fezcodex"
        description="The calibration sheet — switches, dropdowns, every preference the codex remembers."
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1080px] px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left="Folio XI · calibration"
          center="Hold to the line. Adjust as needed."
          right="Local only"
        />

        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
                <span>Codex entry · §</span>
                <span aria-hidden="true" className="h-px flex-1 max-w-[60px] bg-[#9E4A2F]/50" />
                <span>XI</span>
              </div>
              <h1
                className="font-fraunces text-[72px] md:text-[128px] leading-[0.86] tracking-[-0.035em] text-[#1A1613]"
                style={{
                  fontVariationSettings:
                    '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
                }}
              >
                The<br />
                <ChapterEm>calibration</ChapterEm>
                <span
                  aria-hidden="true"
                  className="text-[#C96442]"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  .
                </span>
              </h1>
            </div>
            <aside className="flex flex-col gap-5 lg:border-l border-[#1A161320] lg:pl-10">
              <p
                className="font-fraunces italic text-[19px] leading-[1.4] text-[#1A1613] max-w-[36ch]"
                style={{
                  fontVariationSettings:
                    '"opsz" 48, "SOFT" 100, "WONK" 0, "wght" 380',
                }}
              >
                Every setting on this sheet is held in{' '}
                <span
                  className="not-italic text-[#9E4A2F]"
                  style={{
                    fontStyle: 'normal',
                    fontVariationSettings: '"wght" 560',
                  }}
                >
                  local storage
                </span>
                . Nothing travels. Nothing is logged.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
                <TerracottaSpec label="Persistence" value="This device" />
                <TerracottaSpec label="Scope" value="Visual only" />
                <TerracottaSpec label="Undo" value="Reset below" />
                <TerracottaSpec label="Theme" value={fezcodexTheme} />
              </div>
            </aside>
          </div>
        </section>

        <section id="interface" className="pt-16 border-t border-[#1A161320]">
          <TerracottaChapter
            numeral="I"
            label="Interface"
            title={<>How the <ChapterEm>page is held.</ChapterEm></>}
            blurb="Theme, reading mode, dashboard priority."
          />
          <ol className="border-t border-[#1A161320]">
            <SettingRow
              number={1}
              heading="Fezcodex theme"
              description="The visual foundation — dark/neon brutalist, light/refined luxe, or this one."
              control={
                <CustomDropdown
                  variant="terracotta"
                  label="Select theme"
                  options={[
                    { label: 'Brutalist (Dark)',  value: 'brutalist' },
                    { label: 'Luxe (Refined)',     value: 'luxe' },
                    { label: 'Terracotta (Warm)',  value: 'terracotta' },
                  ]}
                  value={fezcodexTheme}
                  onChange={setFezcodexTheme}
                />
              }
            />
            <SettingRow
              number={2}
              heading="Long-form reader"
              description="Default rendering style for blog posts and field notes."
              control={
                <CustomDropdown
                  variant="terracotta"
                  label="Select view"
                  options={[
                    { label: 'Default',             value: 'standard' },
                    { label: 'Brutalist',           value: 'brutalist' },
                    { label: 'Editorial',           value: 'editorial' },
                    { label: 'Classic',             value: 'old' },
                    { label: 'Dossier',             value: 'dossier' },
                    { label: 'Dokument',            value: 'dokument' },
                    { label: 'Terminal (Amber)',    value: 'terminal' },
                    { label: 'Terminal (Emerald)',  value: 'terminal-green' },
                    { label: 'Luxe',                value: 'luxe' },
                    { label: 'Terracotta',          value: 'terracotta' },
                    { label: 'Galley Proof',        value: 'galley' },
                  ]}
                  value={blogPostViewMode}
                  onChange={setBlogPostViewMode}
                />
              }
            />
            <SettingRow
              number={3}
              heading="Dashboard order"
              description="Which chapter opens first on the home page — archive or field notes."
              control={
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetSectionOrder();
                      addToast({
                        title: 'Order restored',
                        message: 'Dashboard reset to defaults.',
                        duration: 1800,
                      });
                    }}
                    className="font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase text-[#2E2620]/70 hover:text-[#9E4A2F] transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowCounterClockwiseIcon size={11} /> Reset
                  </button>
                  <TerracottaToggle
                    id="homepage-section-order"
                    label="Notes before archive"
                    checked={sectionOrder[0] === 'blogposts'}
                    onChange={toggleSectionOrder}
                  />
                </div>
              }
            />
            <SettingRow
              number={4}
              heading="App fullscreen"
              description="Hide the chrome when running an instrument."
              control={
                <TerracottaToggle
                  id="app-fullscreen"
                  label="Fullscreen apps"
                  checked={isAppFullscreen}
                  onChange={toggleAppFullscreen}
                />
              }
            />
          </ol>
        </section>

        <section id="typography" className="pt-20">
          <TerracottaChapter
            numeral="II"
            label="Typography"
            title={<>How the <ChapterEm>ink lies.</ChapterEm></>}
            blurb="Font choices for long-form reading."
          />
          <ol className="border-t border-[#1A161320]">
            <SettingRow
              number={5}
              heading="Header font"
              description="Used for blog-post headings and titles in reader views."
              control={
                <CustomDropdown
                  variant="terracotta"
                  label="Select face"
                  options={availableFonts.map((f) => ({ label: f.name, value: f.id }))}
                  value={headerFont}
                  onChange={setHeaderFont}
                />
              }
            />
            <SettingRow
              number={6}
              heading="Body font"
              description="Running text in reader views."
              control={
                <CustomDropdown
                  variant="terracotta"
                  label="Select face"
                  options={availableFonts.map((f) => ({ label: f.name, value: f.id }))}
                  value={bodyFont}
                  onChange={setBodyFont}
                />
              }
            />
          </ol>
        </section>

        <section id="motion" className="pt-20">
          <TerracottaChapter
            numeral="III"
            label="Motion & Companion"
            title={<>What <ChapterEm>moves</ChapterEm>, what stays still.</>}
            blurb="Animation, splash text, and the companion who reads over your shoulder."
          />
          <ol className="border-t border-[#1A161320]">
            <SettingRow
              number={7}
              heading="Reduce motion"
              description="Honour device-level motion sensitivity; disable framer animations."
              control={
                <TerracottaToggle
                  id="reduce-motion"
                  label={reduceMotion ? 'Enabled' : 'Disabled'}
                  checked={reduceMotion}
                  onChange={toggleReduceMotion}
                />
              }
            />
            <SettingRow
              number={8}
              heading="Splash quotations"
              description="A rotating line beneath the hero on the home page."
              control={
                <TerracottaToggle
                  id="fx-splash"
                  label="Splash"
                  checked={isSplashTextEnabled}
                  onChange={toggleSplashText}
                />
              }
            />
            <SettingRow
              number={9}
              heading="Syntax · the companion"
              description="A small plumb-bob that walks along the bottom and leaves marginal notes."
              control={
                <TerracottaToggle
                  id="enable-syntax-sprite"
                  label={isSyntaxSpriteEnabled ? 'Present' : 'Stowed'}
                  checked={isSyntaxSpriteEnabled}
                  onChange={toggleSyntaxSprite}
                />
              }
            />
            <SettingRow
              number={10}
              heading="Honor notices"
              description="Surface a margin-note toast each time an achievement is held."
              control={
                <TerracottaToggle
                  id="enable-achievement-toasts"
                  label={showAchievementToast ? 'On' : 'Silent'}
                  checked={showAchievementToast}
                  onChange={toggleAchievementToast}
                />
              }
            />
          </ol>
        </section>

        <section id="visual-matrix" className="pt-20">
          <TerracottaChapter
            numeral="IV"
            label="Visual matrix"
            title={<>Filters, <ChapterEm>with caution.</ChapterEm></>}
            blurb="Experimental overlays — combine one or two; reserve the rest."
          />
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 border-t border-[#1A161320]">
            {fxToggles.map((t, i) => (
              <SettingRow
                key={t.id}
                number={11 + i}
                heading={t.label}
                control={
                  <TerracottaToggle
                    id={t.id}
                    label=""
                    checked={t.checked}
                    onChange={t.onChange}
                  />
                }
              />
            ))}
          </ol>

          <div className="mt-10 border border-[#1A161320] p-6 md:p-8 bg-[#E8DECE]/30">
            <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#1A161320] mb-6">
              <div className="flex items-baseline gap-3 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase">
                <span className="text-[#9E4A2F]">§ 29</span>
                <span className="text-[#1A1613]">Fallout overlay</span>
              </div>
              <TerracottaToggle
                id="fx-fallout"
                label={isFalloutOverlay ? 'Active' : 'Off'}
                checked={isFalloutOverlay}
                onChange={toggleFalloutOverlay}
              />
            </div>
            {isFalloutOverlay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="flex items-center gap-4">
                  <span className="font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#2E2620]/80">
                    Variant
                  </span>
                  <CustomDropdown
                    variant="terracotta"
                    label="Variant"
                    options={[
                      { label: 'New Vegas (Amber)', value: 'amber' },
                      { label: 'Fallout 3 (Green)', value: 'green' },
                    ]}
                    value={falloutVariant}
                    onChange={setFalloutVariant}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 pt-5 border-t border-dashed border-[#1A161320]">
                  <TerracottaToggle
                    id="fallout-noise"
                    label="Signal noise"
                    checked={isFalloutNoiseEnabled}
                    onChange={toggleFalloutNoise}
                  />
                  <TerracottaToggle
                    id="fallout-scanlines"
                    label="CRT scanlines"
                    checked={isFalloutScanlinesEnabled}
                    onChange={toggleFalloutScanlines}
                  />
                  <TerracottaToggle
                    id="fallout-vignette"
                    label="Screen vignette"
                    checked={isFalloutVignetteEnabled}
                    onChange={toggleFalloutVignette}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="dnd" className="pt-20">
          <TerracottaChapter
            numeral="V"
            label="Serfs & Frauds"
            title={<>The <ChapterEm>hearth-fire</ChapterEm> of the archive.</>}
            blurb={'Immersive effects for the "From Serfs and Frauds" D&D archive.'}
          />
          <ol className="border-t border-[#1A161320]">
            <SettingRow
              number={32}
              heading="Lightning strikes"
              description="Occasional flashes across the story sheet."
              control={
                <TerracottaToggle
                  id="dnd-lightning"
                  label="Lightning"
                  checked={isLightningEnabled}
                  onChange={toggleLightning}
                />
              }
            />
            <SettingRow
              number={33}
              heading="Loot discovery"
              description="Found objects announce themselves when passed."
              control={
                <TerracottaToggle
                  id="dnd-loot"
                  label="Loot"
                  checked={isLootDiscoveryEnabled}
                  onChange={toggleLootDiscovery}
                />
              }
            />
            <SettingRow
              number={34}
              heading="Fire overlay"
              description="A slow ember halo along the page edges."
              control={
                <TerracottaToggle
                  id="dnd-fire-overlay"
                  label="Fire"
                  checked={isFireOverlayEnabled}
                  onChange={toggleFireOverlay}
                />
              }
            />
            <SettingRow
              number={35}
              heading="Fire particles"
              description="Rising embers, drifting across the reading area."
              control={
                <TerracottaToggle
                  id="dnd-fire-particles"
                  label="Embers"
                  checked={isFireParticlesEnabled}
                  onChange={toggleFireParticles}
                />
              }
            />
            <SettingRow
              number={36}
              heading="Viewport frame"
              description="A parchment-style border around the whole page."
              control={
                <TerracottaToggle
                  id="dnd-frame"
                  label="Frame"
                  checked={isViewportFrameEnabled}
                  onChange={toggleViewportFrame}
                />
              }
            />
          </ol>
        </section>

        <section id="feedback" className="pt-20">
          <TerracottaChapter
            numeral="VI"
            label="Feedback proofs"
            title={<>Test a <ChapterEm>margin note.</ChapterEm></>}
            blurb="Surface one of each toast variant to verify delivery."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: 'success', label: 'Confirmed', copy: 'Held true.' },
              { type: 'error',   label: 'Error',     copy: 'Misalignment found.' },
              { type: 'gold',    label: 'Honor',     copy: 'A mark was held.' },
              { type: 'techno',  label: 'Signal',    copy: 'Channel connected.' },
            ].map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() =>
                  addToast({
                    title: t.label,
                    message: t.copy,
                    type: t.type,
                  })
                }
                className="p-4 border border-[#1A161320] hover:border-[#1A1613] hover:bg-[#E8DECE]/50 transition-colors text-left"
              >
                <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#9E4A2F]">
                  {t.type}
                </div>
                <div
                  className="mt-1 font-fraunces italic text-[16px] text-[#1A1613]"
                  style={{
                    fontVariationSettings:
                      '"opsz" 18, "SOFT" 100, "wght" 400',
                  }}
                >
                  {t.label} →
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="advanced" className="pt-20">
          <TerracottaChapter
            numeral="VII"
            label="Data administration"
            title={<>Reset <ChapterEm>small things.</ChapterEm></>}
            blurb="Restore sub-systems without losing the archive."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleResetSidebarState}
              className="group text-left border border-[#1A161320] hover:border-[#1A1613] hover:bg-[#E8DECE]/40 transition-colors p-6"
            >
              <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#9E4A2F] mb-2">
                Sidebar
              </div>
              <div
                className="font-fraunces text-[22px] italic text-[#1A1613]"
                style={{
                  fontVariationSettings:
                    '"opsz" 28, "SOFT" 100, "WONK" 1, "wght" 420',
                }}
              >
                Return to plumb.
              </div>
              <p className="mt-1 font-ibm-plex-mono text-[11px] text-[#2E2620]/80">
                Restore every section to its default open/closed state.
              </p>
            </button>
            <button
              type="button"
              onClick={handleResetAppsState}
              className="group text-left border border-[#1A161320] hover:border-[#1A1613] hover:bg-[#E8DECE]/40 transition-colors p-6"
            >
              <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#9E4A2F] mb-2">
                App categories
              </div>
              <div
                className="font-fraunces text-[22px] italic text-[#1A1613]"
                style={{
                  fontVariationSettings:
                    '"opsz" 28, "SOFT" 100, "WONK" 1, "wght" 420',
                }}
              >
                Reopen all shelves.
              </div>
              <p className="mt-1 font-ibm-plex-mono text-[11px] text-[#2E2620]/80">
                Reset the app-center category collapse state.
              </p>
            </button>
          </div>
        </section>

        <section id="danger-zone" className="pt-20">
          <TerracottaChapter
            numeral="VIII"
            label="Clean slate"
            title={<>Start the <ChapterEm>sheet afresh.</ChapterEm></>}
            blurb="The only irreversible action on this page."
          />
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative border border-[#9E4A2F]/45 bg-[#9E4A2F]/[0.06] p-8 md:p-10"
          >
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[3px] bg-[#9E4A2F]"
            />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="p-4 bg-[#9E4A2F] text-[#F3ECE0] shrink-0">
                <WarningIcon size={28} weight="regular" />
              </div>
              <div className="flex-1">
                <h3
                  className="font-fraunces italic text-[32px] md:text-[40px] leading-[1] tracking-[-0.025em] text-[#1A1613]"
                  style={{
                    fontVariationSettings:
                      '"opsz" 48, "SOFT" 100, "WONK" 1, "wght" 400',
                  }}
                >
                  Factory reset.
                </h3>
                <p className="mt-2 font-ibm-plex-mono text-[11.5px] leading-[1.6] text-[#2E2620] max-w-[50ch]">
                  Clears every preference in local storage — theme, fonts,
                  achievements, dashboard order. This cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearStorage}
                className="bg-[#9E4A2F] text-[#F3ECE0] hover:bg-[#C96442] transition-colors px-7 py-3 font-ibm-plex-mono text-[10px] tracking-[0.24em] uppercase"
              >
                Wipe the slate
              </button>
            </div>
          </motion.div>
        </section>

        <div className="pt-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-[#1A161320] mt-16">
          <Link
            to="/"
            className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#9E4A2F] hover:text-[#C96442] transition-colors"
          >
            ← Return to the codex
          </Link>
          <span className="font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#2E2620]/60">
            Connected · local · plumb
          </span>
        </div>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>Settings · terracotta calibration</span>
            </>
          }
        />

        <div className="fixed bottom-6 right-6 opacity-40 pointer-events-none z-20 hidden md:block">
          <TerracottaMark size={18} color="#C96442" />
        </div>
      </div>
    </div>
  );
};

export default TerracottaSettingsPage;
