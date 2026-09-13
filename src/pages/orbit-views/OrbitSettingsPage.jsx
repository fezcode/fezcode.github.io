import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrophyIcon } from '@phosphor-icons/react';
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
  OrbitFolio,
  OrbitRule,
  OrbitStamp,
  ORBIT_REGISTERS,
  useOrbitPalette,
} from '../../components/orbit';
import '../../styles/Orbit.css';

const OrbitToggle = ({ id, checked, onChange, label }) => (
  <button
    type="button"
    id={id}
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange()}
    className={`orb-chip ${checked ? 'is-active' : ''}`}
  >
    {checked ? 'ON' : 'OFF'}
  </button>
);

const OrbitChipGroup = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className="orb-chip"
        aria-pressed={value === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const OrbitSelect = ({ id, options, value, onChange, ariaLabel }) => (
  <select
    id={id}
    className="orb-input"
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
  <li className="py-4" style={{ borderBottom: '1px solid var(--orb-sunken)' }}>
    {stacked ? (
      <>
        <div className="orb-leader-row">
          <span className="orb-rank">{number}</span>
          <span
            className="uppercase font-bold"
            style={{
              fontSize: '0.85rem',
              letterSpacing: '1px',
              color: 'var(--orb-highlight)',
            }}
          >
            {heading}
          </span>
          <span className="orb-leader" aria-hidden="true" />
        </div>
        <div className="mt-3" style={{ paddingLeft: '3.2ch' }}>
          {control}
        </div>
      </>
    ) : (
      <div className="orb-leader-row">
        <span className="orb-rank">{number}</span>
        <span
          className="uppercase font-bold"
          style={{
            fontSize: '0.85rem',
            letterSpacing: '1px',
            color: 'var(--orb-highlight)',
          }}
        >
          {heading}
        </span>
        <span className="orb-leader" aria-hidden="true" />
        <span className="shrink-0">{control}</span>
      </div>
    )}
    {description && (
      <p
        className="mt-1 mb-0"
        style={{
          paddingLeft: '3.2ch',
          maxWidth: '64ch',
          fontSize: '0.78rem',
          color: 'var(--orb-muted)',
        }}
      >
        {description}
      </p>
    )}
  </li>
);

const SectionHead = ({ label, blurb }) => (
  <>
    <OrbitRule label={label} className="mt-10" />
    {blurb && (
      <p
        className="mt-2 mb-2"
        style={{
          maxWidth: '68ch',
          fontSize: '0.8rem',
          color: 'var(--orb-muted)',
        }}
      >
        {blurb}
      </p>
    )}
  </>
);

const OrbitSettingsPage = () => {
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
  const { register, setRegister } = useOrbitPalette();

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
        icon: (
          <TrophyIcon weight="duotone" style={{ color: 'var(--orb-accent)' }} />
        ),
        type: 'gold',
      });
    }, 400);
    setTimeout(() => window.location.reload(), 3000);
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

  let entryCount = 0;
  const nextNo = () => String(++entryCount).padStart(2, '0');

  return (
    <div className="orb-root">
      <Seo
        title="Settings | Fezcodex"
        description="Make Orbit your own: appearance, reading, companions, motion, and saved preferences."
      />
      <div className="orb-page">
        <OrbitFolio
          folio="FOLIO NO. 00"
          title="SETTINGS"
          sub="Make this corner your own"
          aside={<OrbitStamp>LOCAL ONLY</OrbitStamp>}
        >
          <p className="orb-stats mt-4">
            <span>
              PERSISTENCE <strong>THIS DEVICE</strong>
            </span>
            <span>
              SCOPE <strong>VISUAL ONLY</strong>
            </span>
            <span>
              THEME <strong>{fezcodexTheme.toUpperCase()}</strong>
            </span>
          </p>
        </OrbitFolio>

        <p className="orb-intro mb-2">
          Your preferences are saved in <strong>local storage</strong> on this
          device.
        </p>

        {/* ── DESIGN LANGUAGE ─────────────────────────────────────────── */}
        <section id="interface">
          <SectionHead
            label="DESIGN LANGUAGE"
            blurb="The visual foundation of the whole codex."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="FEZCODEX THEME"
              description="Choose a visual foundation for the whole codex."
              stacked
              control={
                <OrbitChipGroup
                  options={[
                    { label: 'BRUTALIST', value: 'brutalist' },
                    { label: 'LUXE', value: 'luxe' },
                    { label: 'TERRACOTTA', value: 'terracotta' },
                    { label: 'MIST', value: 'mist' },
                    { label: 'LEDGER', value: 'ledger' },
                    { label: 'ORBIT', value: 'orbit' },
                  ]}
                  value={fezcodexTheme}
                  onChange={setFezcodexTheme}
                />
              }
            />
          </ol>
        </section>

        {/* ── REGISTER ────────────────────────────────────────────────── */}
        <section id="register">
          <SectionHead
            label="APPEARANCE"
            blurb="Warm paper by day, graphite by night. Your choice follows you across Orbit."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="APPEARANCE"
              description="Also available in the sidebar and navigation bar."
              stacked
              control={
                <OrbitChipGroup
                  options={ORBIT_REGISTERS.map((entry) => ({
                    label: entry.label,
                    value: entry.id,
                  }))}
                  value={register}
                  onChange={setRegister}
                />
              }
            />
          </ol>
        </section>

        {/* ── TYPE ────────────────────────────────────────────────────── */}
        <section id="typography">
          <SectionHead
            label="TYPE"
            blurb="Font choices for long-form reading. Only the brutalist theme answers these picks — luxe, terracotta, mist, ledger and orbit keep their set faces. The selection still saves for when you switch."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="HEADER FONT"
              description="Blog-post headings and titles in reader views."
              control={
                <OrbitSelect
                  id="header-font"
                  ariaLabel="Header font"
                  options={availableFonts.map((f) => ({
                    label: f.name,
                    value: f.id,
                  }))}
                  value={headerFont}
                  onChange={setHeaderFont}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="BODY FONT"
              description="Running text in reader views."
              control={
                <OrbitSelect
                  id="body-font"
                  ariaLabel="Body font"
                  options={availableFonts.map((f) => ({
                    label: f.name,
                    value: f.id,
                  }))}
                  value={bodyFont}
                  onChange={setBodyFont}
                />
              }
            />
          </ol>
        </section>

        {/* ── READER ──────────────────────────────────────────────────── */}
        <section id="reader">
          <SectionHead
            label="READER"
            blurb="Choose how articles look and which section appears first on the homepage."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="LONG-FORM READER"
              description="Default rendering style for blog posts and field notes."
              stacked
              control={
                <OrbitChipGroup
                  options={[
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
                    { label: 'Orbit', value: 'orbit' },
                  ]}
                  value={blogPostViewMode}
                  onChange={setBlogPostViewMode}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="DASHBOARD ORDER"
              description="Show recent writing before selected projects on the homepage."
              control={
                <div className="flex items-baseline gap-3">
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
                    className="orb-btn"
                  >
                    RESET
                  </button>
                  <OrbitToggle
                    id="homepage-section-order"
                    label="Notes before archive"
                    checked={sectionOrder[0] === 'blogposts'}
                    onChange={toggleSectionOrder}
                  />
                </div>
              }
            />
          </ol>
        </section>

        {/* ── COMPANIONS ──────────────────────────────────────────────── */}
        <section id="motion">
          <SectionHead
            label="COMPANIONS"
            blurb="Motion, marginalia, and the sprite that reads over your shoulder."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="REDUCE MOTION"
              description="Reduce decorative movement and transitions. Device motion preferences are also respected."
              control={
                <OrbitToggle
                  id="reduce-motion"
                  label="Reduce motion"
                  checked={reduceMotion}
                  onChange={toggleReduceMotion}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="SPLASH QUOTATIONS"
              description="Save the rotating homepage tagline preference for themes that support it."
              control={
                <OrbitToggle
                  id="fx-splash"
                  label="Splash quotations"
                  checked={isSplashTextEnabled}
                  onChange={toggleSplashText}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="SYNTAX · THE COMPANION"
              description="A small sprite that walks the bottom rule and leaves marginal notes."
              control={
                <OrbitToggle
                  id="enable-syntax-sprite"
                  label="Syntax sprite"
                  checked={isSyntaxSpriteEnabled}
                  onChange={toggleSyntaxSprite}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="HONOR NOTICES"
              description="File a toast each time an achievement is recorded."
              control={
                <OrbitToggle
                  id="enable-achievement-toasts"
                  label="Achievement toasts"
                  checked={showAchievementToast}
                  onChange={toggleAchievementToast}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="APP FULLSCREEN"
              description="Let the chrome withdraw when an instrument is running."
              control={
                <OrbitToggle
                  id="app-fullscreen"
                  label="App fullscreen"
                  checked={isAppFullscreen}
                  onChange={toggleAppFullscreen}
                />
              }
            />
          </ol>
        </section>

        {/* ── MODES ───────────────────────────────────────────────────── */}
        <section id="visual-matrix">
          <SectionHead
            label="MODES"
            blurb="Experimental overlays — set one or two; leave the rest unfiled."
          />
          <ol className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {fxToggles.map((t) => (
              <SettingRow
                key={t.id}
                number={nextNo()}
                heading={t.label}
                control={
                  <OrbitToggle
                    id={t.id}
                    label={t.label}
                    checked={t.checked}
                    onChange={t.onChange}
                  />
                }
              />
            ))}
          </ol>
        </section>

        {/* ── ATMOSPHERE ──────────────────────────────────────────────── */}
        <section id="atmosphere">
          <SectionHead
            label="ATMOSPHERE"
            blurb="Weather over the archive, and the wasteland receiver."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="FLORA PROTOCOL"
              description="Digital flowers along the margins."
              control={
                <OrbitToggle
                  id="fx-garden"
                  label="Flora protocol"
                  checked={isGarden}
                  onChange={toggleGarden}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="SEASONAL DECAY"
              description="Falling leaves across the page."
              control={
                <OrbitToggle
                  id="fx-autumn"
                  label="Seasonal decay"
                  checked={isAutumn}
                  onChange={toggleAutumn}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="HYDRAULIC FILTER"
              description="Rain over the ruling."
              control={
                <OrbitToggle
                  id="fx-rain"
                  label="Hydraulic filter"
                  checked={isRain}
                  onChange={toggleRain}
                />
              }
            />
          </ol>

          <div className="orb-card mt-6 p-4 md:p-5">
            <div className="orb-leader-row">
              <span className="orb-eyebrow">FALLOUT OVERLAY</span>
              <span className="orb-leader" aria-hidden="true" />
              <OrbitToggle
                id="fx-fallout"
                label="Fallout overlay"
                checked={isFalloutOverlay}
                onChange={toggleFalloutOverlay}
              />
            </div>
            {isFalloutOverlay && (
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="orb-label">VARIANT</span>
                  <OrbitChipGroup
                    options={[
                      { label: 'NEW VEGAS · AMBER', value: 'amber' },
                      { label: 'FALLOUT 3 · GREEN', value: 'green' },
                    ]}
                    value={falloutVariant}
                    onChange={setFalloutVariant}
                  />
                </div>
                <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
                  <span className="flex items-baseline gap-3">
                    <span className="orb-label">SIGNAL NOISE</span>
                    <OrbitToggle
                      id="fallout-noise"
                      label="Signal noise"
                      checked={isFalloutNoiseEnabled}
                      onChange={toggleFalloutNoise}
                    />
                  </span>
                  <span className="flex items-baseline gap-3">
                    <span className="orb-label">CRT SCANLINES</span>
                    <OrbitToggle
                      id="fallout-scanlines"
                      label="CRT scanlines"
                      checked={isFalloutScanlinesEnabled}
                      onChange={toggleFalloutScanlines}
                    />
                  </span>
                  <span className="flex items-baseline gap-3">
                    <span className="orb-label">SCREEN VIGNETTE</span>
                    <OrbitToggle
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
        </section>

        {/* ── SERFS & FRAUDS ──────────────────────────────────────────── */}
        <section id="dnd">
          <SectionHead
            label="SERFS & FRAUDS"
            blurb='Immersive effects for the "from serfs and frauds" d&d archive.'
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="LIGHTNING STRIKES"
              description="Occasional flashes across the story sheet."
              control={
                <OrbitToggle
                  id="dnd-lightning"
                  label="Lightning strikes"
                  checked={isLightningEnabled}
                  onChange={toggleLightning}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="LOOT DISCOVERY"
              description="Found objects announce themselves when passed."
              control={
                <OrbitToggle
                  id="dnd-loot"
                  label="Loot discovery"
                  checked={isLootDiscoveryEnabled}
                  onChange={toggleLootDiscovery}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="FIRE OVERLAY"
              description="A slow ember halo along the page edges."
              control={
                <OrbitToggle
                  id="dnd-fire-overlay"
                  label="Fire overlay"
                  checked={isFireOverlayEnabled}
                  onChange={toggleFireOverlay}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="FIRE PARTICLES"
              description="Rising embers, drifting across the reading area."
              control={
                <OrbitToggle
                  id="dnd-fire-particles"
                  label="Fire particles"
                  checked={isFireParticlesEnabled}
                  onChange={toggleFireParticles}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="VIEWPORT FRAME"
              description="A parchment-style border around the whole page."
              control={
                <OrbitToggle
                  id="dnd-frame"
                  label="Viewport frame"
                  checked={isViewportFrameEnabled}
                  onChange={toggleViewportFrame}
                />
              }
            />
          </ol>
        </section>

        {/* ── PROOFS ──────────────────────────────────────────────────── */}
        <section id="feedback">
          <SectionHead
            label="PROOFS"
            blurb="File one of each toast variant to verify delivery."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: 'success', label: 'CONFIRMED', copy: 'ENTRY SAVED.' },
              { type: 'error', label: 'ERROR', copy: 'ENTRY REFUSED.' },
              { type: 'gold', label: 'HONOR', copy: 'A MARK WAS RECORDED.' },
              { type: 'techno', label: 'SIGNAL', copy: 'CHANNEL CONNECTED.' },
            ].map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() =>
                  addToast({ title: t.label, message: t.copy, type: t.type })
                }
                className="orb-card orb-card-link text-left"
              >
                <span className="orb-label block">{t.type.toUpperCase()}</span>
                <span
                  className="uppercase font-bold block mt-1"
                  style={{ fontSize: '0.85rem', letterSpacing: '1px' }}
                >
                  {t.label} →
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── DATA ────────────────────────────────────────────────────── */}
        <section id="advanced">
          <SectionHead
            label="DATA"
            blurb="Restore sub-systems without striking the whole book."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleResetSidebarState}
              className="orb-card orb-card-link text-left"
            >
              <span className="orb-label block">SIDEBAR</span>
              <span
                className="uppercase font-bold block mt-1"
                style={{ fontSize: '0.9rem', letterSpacing: '1px' }}
              >
                RESET SECTION STATE
              </span>
              <span
                className="orb-muted block mt-1"
                style={{ fontSize: '0.76rem' }}
              >
                Restore every drawer to its default open/closed state.
              </span>
            </button>
            <button
              type="button"
              onClick={handleResetAppsState}
              className="orb-card orb-card-link text-left"
            >
              <span className="orb-label block">APP CATEGORIES</span>
              <span
                className="uppercase font-bold block mt-1"
                style={{ fontSize: '0.9rem', letterSpacing: '1px' }}
              >
                REOPEN EVERY DRAWER
              </span>
              <span
                className="orb-muted block mt-1"
                style={{ fontSize: '0.76rem' }}
              >
                Reset the app-center category collapse state.
              </span>
            </button>
          </div>

          <div
            id="danger-zone"
            className="mt-6 p-5 md:p-6"
            style={{
              border: '1px solid var(--orb-accent)',
              borderRadius: 2,
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="flex-1 min-w-0">
                <p className="orb-eyebrow mb-1">RESET PREFERENCES</p>
                <h3
                  className="uppercase font-bold m-0"
                  style={{
                    fontSize: '1.1rem',
                    letterSpacing: '1.5px',
                    color: 'var(--orb-highlight)',
                  }}
                >
                  Start fresh
                </h3>
                <p
                  className="mt-2 mb-0"
                  style={{
                    maxWidth: '56ch',
                    fontSize: '0.78rem',
                    color: 'var(--orb-muted)',
                  }}
                >
                  Clears every preference in local storage — theme, fonts,
                  honors, dashboard order. This cannot be undone; the codex
                  reopens with its default preferences.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearStorage}
                className="orb-btn orb-btn-accent shrink-0"
              >
                CLEAR ALL DATA
              </button>
            </div>
          </div>
        </section>

        {/* ── CLOSING LINE ────────────────────────────────────────────── */}
        <div className="mt-12">
          <OrbitRule />
          <div className="pt-4 flex flex-col md:flex-row items-start md:items-baseline justify-between gap-2">
            <Link
              to="/"
              className="orb-label no-underline hover:text-[var(--orb-accent)]"
            >
              ← BACK TO THE INDEX
            </Link>
            <span className="orb-label">
              SETTINGS · {String(entryCount).padStart(2, '0')} ENTRIES · LOCAL ·
              ON THIS DEVICE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrbitSettingsPage;
