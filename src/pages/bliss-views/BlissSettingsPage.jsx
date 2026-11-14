import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  BroadcastIcon,
  CheckCircleIcon,
  CloudRainIcon,
  DatabaseIcon,
  GearSixIcon,
  MagicWandIcon,
  PaletteIcon,
  ShieldWarningIcon,
  SidebarSimpleIcon,
  SparkleIcon,
  SquaresFourIcon,
  SwordIcon,
  TextAaIcon,
  TrashIcon,
  TrophyIcon,
  XCircleIcon,
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
import { BlissWindow, BlissIcon } from '../../components/bliss';
import '../../styles/Bliss.css';

const THEME_OPTIONS = [
  { label: 'BRUTALIST', value: 'brutalist' },
  { label: 'LUXE', value: 'luxe' },
  { label: 'TERRACOTTA', value: 'terracotta' },
  { label: 'MIST', value: 'mist' },
  { label: 'LEDGER', value: 'ledger' },
  { label: 'ORBIT', value: 'orbit' },
  { label: 'KNIT', value: 'knit' },
  { label: 'BLISS', value: 'bliss' },
];

const READER_OPTIONS = [
  { label: 'DEFAULT', value: 'standard' },
  { label: 'BRUTALIST', value: 'brutalist' },
  { label: 'EDITORIAL', value: 'editorial' },
  { label: 'CLASSIC', value: 'old' },
  { label: 'DOSSIER', value: 'dossier' },
  { label: 'DOKUMENT', value: 'dokument' },
  { label: 'TERMINAL·AMBER', value: 'terminal' },
  { label: 'TERMINAL·EMERALD', value: 'terminal-green' },
  { label: 'LUXE', value: 'luxe' },
  { label: 'TERRACOTTA', value: 'terracotta' },
  { label: 'GALLEY', value: 'galley' },
  { label: 'ORBIT', value: 'orbit' },
  { label: 'KNIT', value: 'knit' },
  { label: 'BLISS', value: 'bliss' },
];

const FALLOUT_VARIANTS = [
  { label: 'NEW VEGAS · AMBER', value: 'amber' },
  { label: 'FALLOUT 3 · GREEN', value: 'green' },
];

const SECTIONS = [
  { id: 'interface', label: 'Design language' },
  { id: 'typography', label: 'Type' },
  { id: 'reader', label: 'Reader' },
  { id: 'motion', label: 'Companions' },
  { id: 'visual-matrix', label: 'Modes' },
  { id: 'atmosphere', label: 'Atmosphere' },
  { id: 'dnd', label: 'Serfs & frauds' },
  { id: 'feedback', label: 'Proofs' },
  { id: 'advanced', label: 'Data' },
];

const BlissSwitch = ({ id, checked, onChange, label }) => (
  <span className="inline-flex items-center gap-2">
    <span className="bl-meta w-7 text-right" aria-hidden="true">
      {checked ? 'On' : 'Off'}
    </span>
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange()}
      className="bl-switch"
    />
  </span>
);

const BlissRadioGroup = ({ name, label, options, value, onChange }) => (
  <div
    role="radiogroup"
    aria-label={label}
    className="grid gap-x-4 gap-y-2"
    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}
  >
    {options.map((option) => (
      <label
        key={option.value}
        className="flex items-center gap-2 cursor-pointer"
        style={{ minHeight: 32 }}
      >
        <input
          type="radio"
          className="bl-check"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
        />
        <span className={value === option.value ? 'font-bold' : ''}>
          {option.label}
        </span>
      </label>
    ))}
  </div>
);

const BlissSelect = ({ id, options, value, onChange, ariaLabel }) => (
  <select
    id={id}
    className="bl-select"
    style={{ width: 'auto', minWidth: '20ch' }}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    aria-label={ariaLabel}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const SettingRow = ({ number, heading, description, control, stacked }) => (
  <li className="bl-row !items-start">
    <span
      className="bl-meta shrink-0 tabular-nums pt-[2px]"
      aria-hidden="true"
    >
      {number}
    </span>
    <div
      className={`bl-row-body ${
        stacked ? '' : 'sm:flex-row sm:items-center sm:gap-4'
      }`}
    >
      <div className="flex-1 min-w-0">
        <span className="bl-row-title block">{heading}</span>
        {description && (
          <p className="bl-meta m-0 mt-[2px] max-w-[68ch]">{description}</p>
        )}
      </div>
      <div className={stacked ? 'mt-3' : 'shrink-0 mt-2 sm:mt-0'}>
        {control}
      </div>
    </div>
  </li>
);

const GroupIntro = ({ icon, tone, children }) => (
  <div className="flex items-start gap-3 mb-3">
    <BlissIcon icon={icon} tone={tone} size={40} />
    <p className="m-0 bl-muted max-w-[68ch] self-center">{children}</p>
  </div>
);

const RowList = ({ children, className = '' }) => (
  <ol
    className={`list-none m-0 p-0 bg-white border border-[#c9c4ad] ${className}`}
  >
    {children}
  </ol>
);

const BlissSettingsPage = () => {
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

  const { unlockAchievement, showAchievementToast, toggleAchievementToast } =
    useAchievements();

  useEffect(() => {
    unlockAchievement('power_user');
  }, [unlockAchievement]);

  const { reduceMotion, toggleReduceMotion } = useAnimation();

  const {
    isInverted,
    toggleInvert,
    isRetro,
    toggleRetro,
    isParty,
    toggleParty,
    isMirror,
    toggleMirror,
    isNoir,
    toggleNoir,
    isTerminal,
    toggleTerminal,
    isBlueprint,
    toggleBlueprint,
    isSepia,
    toggleSepia,
    isVaporwave,
    toggleVaporwave,
    isCyberpunk,
    toggleCyberpunk,
    isGameboy,
    toggleGameboy,
    isComic,
    toggleComic,
    isSketchbook,
    toggleSketchbook,
    isHellenic,
    toggleHellenic,
    isGlitch,
    toggleGlitch,
    isGarden,
    toggleGarden,
    isAutumn,
    toggleAutumn,
    isRain,
    toggleRain,
    isSplashTextEnabled,
    toggleSplashText,
    isAppFullscreen,
    toggleAppFullscreen,
    isSyntaxSpriteEnabled,
    toggleSyntaxSprite,
    fezcodexTheme,
    setFezcodexTheme,
    blogPostViewMode,
    setBlogPostViewMode,
    headerFont,
    setHeaderFont,
    bodyFont,
    setBodyFont,
    availableFonts,
    isFalloutOverlay,
    toggleFalloutOverlay,
    falloutVariant,
    setFalloutVariant,
    isFalloutNoiseEnabled,
    toggleFalloutNoise,
    isFalloutScanlinesEnabled,
    toggleFalloutScanlines,
    isFalloutVignetteEnabled,
    toggleFalloutVignette,
  } = useVisualSettings();

  const {
    isLightningEnabled,
    toggleLightning,
    isLootDiscoveryEnabled,
    toggleLootDiscovery,
    isFireOverlayEnabled,
    toggleFireOverlay,
    isFireParticlesEnabled,
    toggleFireParticles,
    isViewportFrameEnabled,
    toggleViewportFrame,
  } = React.useContext(DndContext);

  const { addToast } = useToast();
  const { sectionOrder, toggleSectionOrder, resetSectionOrder } =
    useHomepageOrder();

  const handleResetSidebarState = () => {
    removeLocalStorageItem(KEY_SIDEBAR_STATE);
    addToast({
      title: 'SIDEBAR RESET',
      message: 'DEFAULTS RESTORED. REFRESHING…',
      duration: 2000,
    });
    setTimeout(() => window.location.reload(), 1800);
  };

  const handleResetAppsState = () => {
    removeLocalStorageItem(KEY_APPS_COLLAPSED_CATEGORIES);
    addToast({
      title: 'CATEGORIES REOPENED',
      message: 'ALL APP DRAWERS RESTORED TO OPEN.',
      duration: 2000,
    });
    setTimeout(() => window.location.reload(), 1800);
  };

  const handleClearStorage = () => {
    localStorage.clear();
    addToast({
      title: 'Preferences cleared',
      message: 'Your saved preferences have been reset. Reloading…',
      duration: 2500,
    });
    setTimeout(() => {
      const now = new Date().toISOString();
      localStorage.setItem(
        'unlocked-achievements',
        JSON.stringify({ clean_slate: { unlocked: true, unlockedAt: now } }),
      );
      addToast({
        title: 'Achievement unlocked · Clean slate',
        message: 'A fresh start for your codex.',
        duration: 3200,
        icon: <TrophyIcon weight="duotone" style={{ color: '#d99a0b' }} />,
        type: 'gold',
      });
    }, 400);
    setTimeout(() => window.location.reload(), 3000);
  };

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const fxToggles = useMemo(
    () => [
      {
        id: 'fx-invert',
        label: 'INVERT COLORS',
        checked: isInverted,
        onChange: toggleInvert,
      },
      {
        id: 'fx-retro',
        label: 'RETRO CRT',
        checked: isRetro,
        onChange: toggleRetro,
      },
      {
        id: 'fx-party',
        label: 'PARTY MODE',
        checked: isParty,
        onChange: toggleParty,
      },
      {
        id: 'fx-mirror',
        label: 'MIRROR WORLD',
        checked: isMirror,
        onChange: toggleMirror,
      },
      {
        id: 'fx-noir',
        label: 'FILM NOIR',
        checked: isNoir,
        onChange: toggleNoir,
      },
      {
        id: 'fx-terminal',
        label: 'EMERALD TERMINAL',
        checked: isTerminal,
        onChange: toggleTerminal,
      },
      {
        id: 'fx-blueprint',
        label: 'BLUEPRINT',
        checked: isBlueprint,
        onChange: toggleBlueprint,
      },
      {
        id: 'fx-sepia',
        label: 'VINTAGE SEPIA',
        checked: isSepia,
        onChange: toggleSepia,
      },
      {
        id: 'fx-vaporwave',
        label: 'VAPORWAVE',
        checked: isVaporwave,
        onChange: toggleVaporwave,
      },
      {
        id: 'fx-cyberpunk',
        label: 'CYBERPUNK',
        checked: isCyberpunk,
        onChange: toggleCyberpunk,
      },
      {
        id: 'fx-gameboy',
        label: 'LEGACY HANDHELD',
        checked: isGameboy,
        onChange: toggleGameboy,
      },
      {
        id: 'fx-comic',
        label: 'COMIC ARRAY',
        checked: isComic,
        onChange: toggleComic,
      },
      {
        id: 'fx-sketchbook',
        label: 'GRAPHITE MAP',
        checked: isSketchbook,
        onChange: toggleSketchbook,
      },
      {
        id: 'fx-hellenic',
        label: 'CLASSICAL AGORA',
        checked: isHellenic,
        onChange: toggleHellenic,
      },
      {
        id: 'fx-glitch',
        label: 'DATA CORRUPTION',
        checked: isGlitch,
        onChange: toggleGlitch,
      },
    ],
    [
      isInverted,
      isRetro,
      isParty,
      isMirror,
      isNoir,
      isTerminal,
      isBlueprint,
      isSepia,
      isVaporwave,
      isCyberpunk,
      isGameboy,
      isComic,
      isSketchbook,
      isHellenic,
      isGlitch,
      toggleInvert,
      toggleRetro,
      toggleParty,
      toggleMirror,
      toggleNoir,
      toggleTerminal,
      toggleBlueprint,
      toggleSepia,
      toggleVaporwave,
      toggleCyberpunk,
      toggleGameboy,
      toggleComic,
      toggleSketchbook,
      toggleHellenic,
      toggleGlitch,
    ],
  );

  const fontOptions = availableFonts.map((f) => ({
    label: f.name,
    value: f.id,
  }));

  let entryCount = 0;
  const nextNo = () => String(++entryCount).padStart(2, '0');

  return (
    <div className="bl-root">
      <Seo
        title="Settings | Fezcodex"
        description="Make Bliss your own: appearance, reading, companions, motion, and saved preferences."
      />
      <div className="bl-page">
        {/* ── TITLE ───────────────────────────────────────────────────── */}
        <BlissWindow
          title="Settings"
          icon={GearSixIcon}
          tone="blue"
          headingLevel={1}
          titleId="bl-settings-title"
          status={
            <>
              <span>This device · visual only</span>
              <span>Theme: {fezcodexTheme}</span>
            </>
          }
        >
          <div className="flex items-start gap-4">
            <BlissIcon icon={GearSixIcon} tone="blue" size={56} />
            <div className="min-w-0">
              <p className="bl-eyebrow m-0">Control panel</p>
              <p className="bl-display mt-1 mb-2" aria-hidden="true">
                Settings
              </p>
              <p className="m-0 max-w-[68ch]">
                Make this corner your own. Your preferences are saved in local
                storage on this device.
              </p>
            </div>
          </div>
          <nav aria-label="Settings sections" className="mt-4">
            <p className="bl-label m-0 mb-2">Pick a category</p>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className="bl-tag"
                  onClick={() => jumpTo(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </nav>
        </BlissWindow>

        {/* ── DESIGN LANGUAGE ─────────────────────────────────────────── */}
        <BlissWindow
          id="interface"
          title="Design language"
          icon={PaletteIcon}
          tone="purple"
          titleId="bl-settings-interface"
          className="scroll-mt-20"
        >
          <GroupIntro icon={PaletteIcon} tone="purple">
            The visual foundation of the whole codex.
          </GroupIntro>
          <RowList>
            <SettingRow
              number={nextNo()}
              heading="Fezcodex theme"
              description="Choose a visual foundation for the whole codex."
              stacked
              control={
                <BlissRadioGroup
                  name="fezcodex-theme"
                  label="Fezcodex theme"
                  options={THEME_OPTIONS}
                  value={fezcodexTheme}
                  onChange={setFezcodexTheme}
                />
              }
            />
          </RowList>
        </BlissWindow>

        {/* ── TYPE ────────────────────────────────────────────────────── */}
        <BlissWindow
          id="typography"
          title="Type"
          icon={TextAaIcon}
          tone="orange"
          titleId="bl-settings-typography"
          className="scroll-mt-20"
        >
          <GroupIntro icon={TextAaIcon} tone="orange">
            Font choices for long-form reading. Only the brutalist theme
            answers these picks — luxe, terracotta, mist, ledger, orbit, knit
            and bliss keep their set faces. The selection still saves for when
            you switch.
          </GroupIntro>
          <RowList>
            <SettingRow
              number={nextNo()}
              heading="Header font"
              description="Blog-post headings and titles in reader views."
              control={
                <BlissSelect
                  id="header-font"
                  ariaLabel="Header font"
                  options={fontOptions}
                  value={headerFont}
                  onChange={setHeaderFont}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Body font"
              description="Running text in reader views."
              control={
                <BlissSelect
                  id="body-font"
                  ariaLabel="Body font"
                  options={fontOptions}
                  value={bodyFont}
                  onChange={setBodyFont}
                />
              }
            />
          </RowList>
        </BlissWindow>

        {/* ── READER ──────────────────────────────────────────────────── */}
        <BlissWindow
          id="reader"
          title="Reader"
          icon={BookOpenIcon}
          tone="teal"
          titleId="bl-settings-reader"
          className="scroll-mt-20"
        >
          <GroupIntro icon={BookOpenIcon} tone="teal">
            Choose how articles look and which section appears first on the
            homepage.
          </GroupIntro>
          <RowList>
            <SettingRow
              number={nextNo()}
              heading="Long-form reader"
              description="Default rendering style for blog posts and field notes."
              stacked
              control={
                <BlissRadioGroup
                  name="blog-reader-mode"
                  label="Long-form reader"
                  options={READER_OPTIONS}
                  value={blogPostViewMode}
                  onChange={setBlogPostViewMode}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Dashboard order"
              description="Show recent writing before selected projects on the homepage."
              control={
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetSectionOrder();
                      addToast({
                        title: 'ORDER RESTORED',
                        message: 'DASHBOARD RESET TO DEFAULTS.',
                        duration: 1800,
                      });
                    }}
                    className="bl-btn bl-btn-sm"
                  >
                    <ArrowCounterClockwiseIcon
                      size={14}
                      weight="bold"
                      aria-hidden="true"
                    />
                    Reset
                  </button>
                  <BlissSwitch
                    id="homepage-section-order"
                    label="Notes before archive"
                    checked={sectionOrder[0] === 'blogposts'}
                    onChange={toggleSectionOrder}
                  />
                </div>
              }
            />
          </RowList>
        </BlissWindow>

        {/* ── COMPANIONS ──────────────────────────────────────────────── */}
        <BlissWindow
          id="motion"
          title="Companions"
          icon={SparkleIcon}
          tone="green"
          titleId="bl-settings-motion"
          className="scroll-mt-20"
        >
          <GroupIntro icon={SparkleIcon} tone="green">
            Motion, marginalia, and the sprite that reads over your shoulder.
          </GroupIntro>
          <RowList>
            <SettingRow
              number={nextNo()}
              heading="Reduce motion"
              description="Reduce decorative movement and transitions. Device motion preferences are also respected."
              control={
                <BlissSwitch
                  id="reduce-motion"
                  label="Reduce motion"
                  checked={reduceMotion}
                  onChange={toggleReduceMotion}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Splash quotations"
              description="Save the rotating homepage tagline preference for themes that support it."
              control={
                <BlissSwitch
                  id="fx-splash"
                  label="Splash quotations"
                  checked={isSplashTextEnabled}
                  onChange={toggleSplashText}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Syntax · the companion"
              description="A small sprite that walks the bottom rule and leaves marginal notes."
              control={
                <BlissSwitch
                  id="enable-syntax-sprite"
                  label="Syntax sprite"
                  checked={isSyntaxSpriteEnabled}
                  onChange={toggleSyntaxSprite}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Honor notices"
              description="File a toast each time an achievement is recorded."
              control={
                <BlissSwitch
                  id="enable-achievement-toasts"
                  label="Achievement toasts"
                  checked={showAchievementToast}
                  onChange={toggleAchievementToast}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="App fullscreen"
              description="Let the chrome withdraw when an instrument is running."
              control={
                <BlissSwitch
                  id="app-fullscreen"
                  label="App fullscreen"
                  checked={isAppFullscreen}
                  onChange={toggleAppFullscreen}
                />
              }
            />
          </RowList>
        </BlissWindow>

        {/* ── MODES ───────────────────────────────────────────────────── */}
        <BlissWindow
          id="visual-matrix"
          title="Modes"
          icon={MagicWandIcon}
          tone="pink"
          titleId="bl-settings-modes"
          className="scroll-mt-20"
          status={
            <>
              <span>{fxToggles.length} modes</span>
              <span>{fxToggles.filter((t) => t.checked).length} active</span>
            </>
          }
        >
          <GroupIntro icon={MagicWandIcon} tone="pink">
            Experimental overlays — set one or two; leave the rest unfiled.
          </GroupIntro>
          <RowList className="grid grid-cols-1 md:grid-cols-2">
            {fxToggles.map((t) => (
              <SettingRow
                key={t.id}
                number={nextNo()}
                heading={t.label}
                control={
                  <BlissSwitch
                    id={t.id}
                    label={t.label}
                    checked={t.checked}
                    onChange={t.onChange}
                  />
                }
              />
            ))}
          </RowList>
        </BlissWindow>

        {/* ── ATMOSPHERE ──────────────────────────────────────────────── */}
        <BlissWindow
          id="atmosphere"
          title="Atmosphere"
          icon={CloudRainIcon}
          tone="blue"
          titleId="bl-settings-atmosphere"
          className="scroll-mt-20"
        >
          <GroupIntro icon={CloudRainIcon} tone="blue">
            Weather over the archive, and the wasteland receiver.
          </GroupIntro>
          <RowList>
            <SettingRow
              number={nextNo()}
              heading="Flora protocol"
              description="Digital flowers along the margins."
              control={
                <BlissSwitch
                  id="fx-garden"
                  label="Flora protocol"
                  checked={isGarden}
                  onChange={toggleGarden}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Seasonal decay"
              description="Falling leaves across the page."
              control={
                <BlissSwitch
                  id="fx-autumn"
                  label="Seasonal decay"
                  checked={isAutumn}
                  onChange={toggleAutumn}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Hydraulic filter"
              description="Rain over the ruling."
              control={
                <BlissSwitch
                  id="fx-rain"
                  label="Hydraulic filter"
                  checked={isRain}
                  onChange={toggleRain}
                />
              }
            />
          </RowList>

          <div className="bl-groupbox mt-6">
            <span className="bl-groupbox-label">Fallout overlay</span>
            <div className="flex items-center gap-3">
              <BlissIcon icon={BroadcastIcon} tone="yellow" size={32} />
              <span className="bl-h3 flex-1">Wasteland receiver</span>
              <BlissSwitch
                id="fx-fallout"
                label="Fallout overlay"
                checked={isFalloutOverlay}
                onChange={toggleFalloutOverlay}
              />
            </div>
            {isFalloutOverlay && (
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <p className="bl-label m-0 mb-2">Variant</p>
                  <BlissRadioGroup
                    name="fallout-variant"
                    label="Fallout variant"
                    options={FALLOUT_VARIANTS}
                    value={falloutVariant}
                    onChange={setFalloutVariant}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                  <span className="flex items-center gap-3">
                    <span className="bl-label">Signal noise</span>
                    <BlissSwitch
                      id="fallout-noise"
                      label="Signal noise"
                      checked={isFalloutNoiseEnabled}
                      onChange={toggleFalloutNoise}
                    />
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="bl-label">CRT scanlines</span>
                    <BlissSwitch
                      id="fallout-scanlines"
                      label="CRT scanlines"
                      checked={isFalloutScanlinesEnabled}
                      onChange={toggleFalloutScanlines}
                    />
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="bl-label">Screen vignette</span>
                    <BlissSwitch
                      id="fallout-vignette"
                      label="Screen vignette"
                      checked={isFalloutVignetteEnabled}
                      onChange={toggleFalloutVignette}
                    />
                  </span>
                </div>
              </div>
            )}
          </div>
        </BlissWindow>

        {/* ── SERFS & FRAUDS ──────────────────────────────────────────── */}
        <BlissWindow
          id="dnd"
          title="Serfs & frauds"
          icon={SwordIcon}
          tone="red"
          titleId="bl-settings-dnd"
          className="scroll-mt-20"
        >
          <GroupIntro icon={SwordIcon} tone="red">
            Immersive effects for the &ldquo;from serfs and frauds&rdquo; d&amp;d
            archive.
          </GroupIntro>
          <RowList>
            <SettingRow
              number={nextNo()}
              heading="Lightning strikes"
              description="Occasional flashes across the story sheet."
              control={
                <BlissSwitch
                  id="dnd-lightning"
                  label="Lightning strikes"
                  checked={isLightningEnabled}
                  onChange={toggleLightning}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Loot discovery"
              description="Found objects announce themselves when passed."
              control={
                <BlissSwitch
                  id="dnd-loot"
                  label="Loot discovery"
                  checked={isLootDiscoveryEnabled}
                  onChange={toggleLootDiscovery}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Fire overlay"
              description="A slow ember halo along the page edges."
              control={
                <BlissSwitch
                  id="dnd-fire-overlay"
                  label="Fire overlay"
                  checked={isFireOverlayEnabled}
                  onChange={toggleFireOverlay}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Fire particles"
              description="Rising embers, drifting across the reading area."
              control={
                <BlissSwitch
                  id="dnd-fire-particles"
                  label="Fire particles"
                  checked={isFireParticlesEnabled}
                  onChange={toggleFireParticles}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Viewport frame"
              description="A parchment-style border around the whole page."
              control={
                <BlissSwitch
                  id="dnd-frame"
                  label="Viewport frame"
                  checked={isViewportFrameEnabled}
                  onChange={toggleViewportFrame}
                />
              }
            />
          </RowList>
        </BlissWindow>

        {/* ── PROOFS ──────────────────────────────────────────────────── */}
        <BlissWindow
          id="feedback"
          title="Proofs"
          icon={TrophyIcon}
          tone="yellow"
          titleId="bl-settings-feedback"
          className="scroll-mt-20"
        >
          <GroupIntro icon={TrophyIcon} tone="yellow">
            File one of each toast variant to verify delivery.
          </GroupIntro>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                type: 'success',
                label: 'CONFIRMED',
                copy: 'ENTRY SAVED.',
                icon: CheckCircleIcon,
                tone: 'green',
              },
              {
                type: 'error',
                label: 'ERROR',
                copy: 'ENTRY REFUSED.',
                icon: XCircleIcon,
                tone: 'red',
              },
              {
                type: 'gold',
                label: 'HONOR',
                copy: 'A MARK WAS RECORDED.',
                icon: TrophyIcon,
                tone: 'yellow',
              },
              {
                type: 'techno',
                label: 'SIGNAL',
                copy: 'CHANNEL CONNECTED.',
                icon: BroadcastIcon,
                tone: 'teal',
              },
            ].map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() =>
                  addToast({ title: t.label, message: t.copy, type: t.type })
                }
                className="bl-card text-left cursor-pointer"
                style={{ font: 'inherit' }}
              >
                <span className="flex items-center gap-2">
                  <BlissIcon icon={t.icon} tone={t.tone} size={28} />
                  <span className="bl-label">{t.type}</span>
                </span>
                <span className="bl-card-title">{t.label} →</span>
              </button>
            ))}
          </div>
        </BlissWindow>

        {/* ── DATA ────────────────────────────────────────────────────── */}
        <BlissWindow
          id="advanced"
          title="Data"
          icon={DatabaseIcon}
          tone="graphite"
          titleId="bl-settings-advanced"
          className="scroll-mt-20"
          status={
            <>
              <Link to="/" className="bl-link">
                <ArrowLeftIcon size={13} weight="bold" aria-hidden="true" />
                Back to the index
              </Link>
              <span>
                Settings · {entryCount} entries · local · on this device
              </span>
            </>
          }
        >
          <GroupIntro icon={DatabaseIcon} tone="graphite">
            Restore sub-systems without striking the whole book.
          </GroupIntro>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleResetSidebarState}
              className="bl-card text-left cursor-pointer"
              style={{ font: 'inherit' }}
            >
              <span className="flex items-center gap-3">
                <BlissIcon icon={SidebarSimpleIcon} tone="blue" size={36} />
                <span className="min-w-0">
                  <span className="bl-label block">Sidebar</span>
                  <span className="bl-card-title block">
                    Reset section state
                  </span>
                </span>
              </span>
              <span className="bl-meta">
                Restore every drawer to its default open/closed state.
              </span>
            </button>
            <button
              type="button"
              onClick={handleResetAppsState}
              className="bl-card text-left cursor-pointer"
              style={{ font: 'inherit' }}
            >
              <span className="flex items-center gap-3">
                <BlissIcon icon={SquaresFourIcon} tone="teal" size={36} />
                <span className="min-w-0">
                  <span className="bl-label block">App categories</span>
                  <span className="bl-card-title block">
                    Reopen every drawer
                  </span>
                </span>
              </span>
              <span className="bl-meta">
                Reset the app-center category collapse state.
              </span>
            </button>
          </div>

          <div
            id="danger-zone"
            className="bl-groupbox mt-6"
            style={{ borderColor: '#e0502c' }}
          >
            <span className="bl-groupbox-label" style={{ color: '#c23b18' }}>
              Reset preferences
            </span>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <BlissIcon icon={ShieldWarningIcon} tone="red" size={44} />
              <div className="flex-1 min-w-0">
                <h3 className="bl-h3 m-0">Start fresh</h3>
                <p className="bl-meta mt-1 mb-0 max-w-[56ch]">
                  Clears every preference in local storage — theme, fonts,
                  honors, dashboard order. This cannot be undone; the codex
                  reopens with its default preferences.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearStorage}
                className="bl-btn bl-btn-primary shrink-0"
              >
                <TrashIcon size={16} weight="bold" aria-hidden="true" />
                Clear all data
              </button>
            </div>
          </div>
        </BlissWindow>
      </div>
    </div>
  );
};

export default BlissSettingsPage;
