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
import { StudioFolio, StudioRule, StudioStamp } from '../../components/studio';
import '../../styles/Studio.css';

const StudioToggle = ({ id, checked, onChange, label }) => (
  <button
    type="button"
    id={id}
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange()}
    className={`std-chip ${checked ? 'is-active' : ''}`}
  >
    {checked ? 'On' : 'Off'}
  </button>
);

const StudioChipGroup = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className="std-chip"
        aria-pressed={value === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const StudioSelect = ({ id, options, value, onChange, ariaLabel }) => (
  <select
    id={id}
    className="std-input"
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
  <li className="py-4" style={{ borderBottom: '1px solid var(--std-sunken)' }}>
    {stacked ? (
      <>
        <div className="std-leader-row">
          <span className="std-rank">{number}</span>
          <span
            className="uppercase font-bold"
            style={{
              fontSize: '0.85rem',
              letterSpacing: '1px',
              color: 'var(--std-highlight)',
            }}
          >
            {heading}
          </span>
          <span className="std-leader" aria-hidden="true" />
        </div>
        <div className="mt-3" style={{ paddingLeft: '3.2ch' }}>
          {control}
        </div>
      </>
    ) : (
      <div className="std-leader-row">
        <span className="std-rank">{number}</span>
        <span
          className="uppercase font-bold"
          style={{
            fontSize: '0.85rem',
            letterSpacing: '1px',
            color: 'var(--std-highlight)',
          }}
        >
          {heading}
        </span>
        <span className="std-leader" aria-hidden="true" />
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
          color: 'var(--std-muted)',
        }}
      >
        {description}
      </p>
    )}
  </li>
);

const SectionHead = ({ label, blurb }) => (
  <>
    <StudioRule label={label} className="mt-10" />
    {blurb && (
      <p
        className="mt-2 mb-2"
        style={{
          maxWidth: '68ch',
          fontSize: '0.8rem',
          color: 'var(--std-muted)',
        }}
      >
        {blurb}
      </p>
    )}
  </>
);

const StudioSettingsPage = () => {
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
    discoveryViewMode,
    toggleDiscoveryViewMode,
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
      title: 'Sidebar reset',
      message: 'DEFAULTS RESTORED. REFRESHING…',
      duration: 2000,
    });
    setTimeout(() => window.location.reload(), 1800);
  };

  const handleResetAppsState = () => {
    removeLocalStorageItem(KEY_APPS_COLLAPSED_CATEGORIES);
    addToast({
      title: 'Categories reopened',
      message: 'All app drawers restored to open.',
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
          <TrophyIcon weight="duotone" style={{ color: 'var(--std-accent)' }} />
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
        label: 'Invert colors',
        checked: isInverted,
        onChange: toggleInvert,
      },
      {
        id: 'fx-retro',
        label: 'Retro crt',
        checked: isRetro,
        onChange: toggleRetro,
      },
      {
        id: 'fx-party',
        label: 'Party mode',
        checked: isParty,
        onChange: toggleParty,
      },
      {
        id: 'fx-mirror',
        label: 'Mirror world',
        checked: isMirror,
        onChange: toggleMirror,
      },
      {
        id: 'fx-noir',
        label: 'Film noir',
        checked: isNoir,
        onChange: toggleNoir,
      },
      {
        id: 'fx-terminal',
        label: 'Emerald terminal',
        checked: isTerminal,
        onChange: toggleTerminal,
      },
      {
        id: 'fx-blueprint',
        label: 'Blueprint',
        checked: isBlueprint,
        onChange: toggleBlueprint,
      },
      {
        id: 'fx-sepia',
        label: 'Vintage sepia',
        checked: isSepia,
        onChange: toggleSepia,
      },
      {
        id: 'fx-vaporwave',
        label: 'Vaporwave',
        checked: isVaporwave,
        onChange: toggleVaporwave,
      },
      {
        id: 'fx-cyberpunk',
        label: 'Cyberpunk',
        checked: isCyberpunk,
        onChange: toggleCyberpunk,
      },
      {
        id: 'fx-gameboy',
        label: 'Legacy handheld',
        checked: isGameboy,
        onChange: toggleGameboy,
      },
      {
        id: 'fx-comic',
        label: 'Comic array',
        checked: isComic,
        onChange: toggleComic,
      },
      {
        id: 'fx-sketchbook',
        label: 'Graphite map',
        checked: isSketchbook,
        onChange: toggleSketchbook,
      },
      {
        id: 'fx-hellenic',
        label: 'Classical agora',
        checked: isHellenic,
        onChange: toggleHellenic,
      },
      {
        id: 'fx-glitch',
        label: 'Data corruption',
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
    <div className="std-root std-settings">
      <Seo
        title="Settings | Fezcodex"
        description="Make Studio your own: appearance, reading, companions, motion, and saved preferences."
      />
      <div className="std-page">
        <StudioFolio
          folio="FOLIO NO. 00"
          title="Settings"
          sub="Make this corner your own"
          aside={<StudioStamp>Local only</StudioStamp>}
        >
          <p className="std-stats mt-4">
            <span>
              PERSISTENCE <strong>This device</strong>
            </span>
            <span>
              SCOPE <strong>Visual only</strong>
            </span>
            <span>
              THEME <strong>{fezcodexTheme.toUpperCase()}</strong>
            </span>
          </p>
        </StudioFolio>

        <p className="std-intro mb-2">
          Your preferences are saved in <strong>local storage</strong> on this
          device.
        </p>

        {/* ── DESIGN LANGUAGE ─────────────────────────────────────────── */}
        <section id="interface">
          <SectionHead
            label="Design language"
            blurb="The visual foundation of the whole codex."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="Fezcodex theme"
              description="Choose a visual foundation for the whole codex."
              stacked
              control={
                <StudioChipGroup
                  options={[
                    { label: 'Brutalist', value: 'brutalist' },
                    { label: 'Luxe', value: 'luxe' },
                    { label: 'Terracotta', value: 'terracotta' },
                    { label: 'Mist', value: 'mist' },
                    { label: 'Ledger', value: 'ledger' },
                    { label: 'Orbit', value: 'orbit' },
                    { label: 'Knit', value: 'knit' },
                    { label: 'Kilim', value: 'kilim' },
                    { label: 'Bliss', value: 'bliss' },
                    { label: 'Studio', value: 'studio' },
                  ]}
                  value={fezcodexTheme}
                  onChange={setFezcodexTheme}
                />
              }
            />
          </ol>
        </section>

        {/* ── REGISTER ────────────────────────────────────────────────── */}

        {/* ── TYPE ────────────────────────────────────────────────────── */}
        <section id="typography">
          <SectionHead
            label="Type"
            blurb="Studio uses Bricolage Grotesque and Inter. These saved font choices apply when you use Brutalist."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="Header font"
              description="Blog-post headings and titles in reader views."
              control={
                <StudioSelect
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
              heading="Body font"
              description="Running text in reader views."
              control={
                <StudioSelect
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
            label="Reader"
            blurb="Choose how articles look and which section appears first on the homepage."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="Long-form reader"
              description="Default rendering style for blog posts and field notes."
              stacked
              control={
                <StudioChipGroup
                  options={[
                    { label: 'Default', value: 'standard' },
                    { label: 'Brutalist', value: 'brutalist' },
                    { label: 'Editorial', value: 'editorial' },
                    { label: 'Classic', value: 'old' },
                    { label: 'Dossier', value: 'dossier' },
                    { label: 'Dokument', value: 'dokument' },
                    { label: 'Terminal·amber', value: 'terminal' },
                    { label: 'Terminal·emerald', value: 'terminal-green' },
                    { label: 'Luxe', value: 'luxe' },
                    { label: 'Terracotta', value: 'terracotta' },
                    { label: 'Galley', value: 'galley' },
                    { label: 'Orbit', value: 'orbit' },
                    { label: 'Knit', value: 'knit' },
                    { label: 'Kilim', value: 'kilim' },
                    { label: 'Bliss', value: 'bliss' },
                    { label: 'Studio', value: 'studio' },
                  ]}
                  value={blogPostViewMode}
                  onChange={setBlogPostViewMode}
                />
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Discovery logs viewer"
              description="Toggle between the 3D collector's shelf (new) and the classic archive view (old) when opening /logs."
              control={
                <div className="flex items-baseline gap-3">
                  <span className="std-label">
                    {discoveryViewMode === 'shelf'
                      ? '3D SHELF · NEW'
                      : 'CLASSIC · OLD'}
                  </span>
                  <StudioToggle
                    id="discovery-view-mode"
                    label="3D shelf viewer (new)"
                    checked={discoveryViewMode === 'shelf'}
                    onChange={toggleDiscoveryViewMode}
                  />
                </div>
              }
            />
            <SettingRow
              number={nextNo()}
              heading="Dashboard order"
              description="Show recent writing before selected projects on the homepage."
              control={
                <div className="flex items-baseline gap-3">
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
                    className="std-btn"
                  >
                    RESET
                  </button>
                  <StudioToggle
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
            label="Companions"
            blurb="Motion, marginalia, and the sprite that reads over your shoulder."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="Reduce motion"
              description="Reduce decorative movement and transitions. Device motion preferences are also respected."
              control={
                <StudioToggle
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
                <StudioToggle
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
                <StudioToggle
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
                <StudioToggle
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
                <StudioToggle
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
            label="Modes"
            blurb="Experimental overlays — set one or two; leave the rest unfiled."
          />
          <ol className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {fxToggles.map((t) => (
              <SettingRow
                key={t.id}
                number={nextNo()}
                heading={t.label}
                control={
                  <StudioToggle
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
            label="Atmosphere"
            blurb="Weather over the archive, and the wasteland receiver."
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="Flora protocol"
              description="Digital flowers along the margins."
              control={
                <StudioToggle
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
                <StudioToggle
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
                <StudioToggle
                  id="fx-rain"
                  label="Hydraulic filter"
                  checked={isRain}
                  onChange={toggleRain}
                />
              }
            />
          </ol>

          <div className="std-card mt-6 p-4 md:p-5">
            <div className="std-leader-row">
              <span className="std-eyebrow">Fallout overlay</span>
              <span className="std-leader" aria-hidden="true" />
              <StudioToggle
                id="fx-fallout"
                label="Fallout overlay"
                checked={isFalloutOverlay}
                onChange={toggleFalloutOverlay}
              />
            </div>
            {isFalloutOverlay && (
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="std-label">Variant</span>
                  <StudioChipGroup
                    options={[
                      { label: 'New vegas · amber', value: 'amber' },
                      { label: 'FALLOUT 3 · GREEN', value: 'green' },
                    ]}
                    value={falloutVariant}
                    onChange={setFalloutVariant}
                  />
                </div>
                <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
                  <span className="flex items-baseline gap-3">
                    <span className="std-label">Signal noise</span>
                    <StudioToggle
                      id="fallout-noise"
                      label="Signal noise"
                      checked={isFalloutNoiseEnabled}
                      onChange={toggleFalloutNoise}
                    />
                  </span>
                  <span className="flex items-baseline gap-3">
                    <span className="std-label">Crt scanlines</span>
                    <StudioToggle
                      id="fallout-scanlines"
                      label="CRT scanlines"
                      checked={isFalloutScanlinesEnabled}
                      onChange={toggleFalloutScanlines}
                    />
                  </span>
                  <span className="flex items-baseline gap-3">
                    <span className="std-label">Screen vignette</span>
                    <StudioToggle
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
            label="Serfs & frauds"
            blurb='Immersive effects for the "from serfs and frauds" d&d archive.'
          />
          <ol className="list-none m-0 p-0">
            <SettingRow
              number={nextNo()}
              heading="Lightning strikes"
              description="Occasional flashes across the story sheet."
              control={
                <StudioToggle
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
                <StudioToggle
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
                <StudioToggle
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
                <StudioToggle
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
                <StudioToggle
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
            label="Proofs"
            blurb="File one of each toast variant to verify delivery."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: 'success', label: 'Confirmed', copy: 'ENTRY SAVED.' },
              { type: 'error', label: 'Error', copy: 'ENTRY REFUSED.' },
              { type: 'gold', label: 'Honor', copy: 'A MARK WAS RECORDED.' },
              { type: 'techno', label: 'Signal', copy: 'CHANNEL CONNECTED.' },
            ].map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() =>
                  addToast({ title: t.label, message: t.copy, type: t.type })
                }
                className="std-card std-card-link text-left"
              >
                <span className="std-label block">{t.type.toUpperCase()}</span>
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
            label="Data"
            blurb="Restore sub-systems without striking the whole book."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleResetSidebarState}
              className="std-card std-card-link text-left"
            >
              <span className="std-label block">Sidebar</span>
              <span
                className="uppercase font-bold block mt-1"
                style={{ fontSize: '0.9rem', letterSpacing: '1px' }}
              >
                RESET SECTION STATE
              </span>
              <span
                className="std-muted block mt-1"
                style={{ fontSize: '0.76rem' }}
              >
                Restore every drawer to its default open/closed state.
              </span>
            </button>
            <button
              type="button"
              onClick={handleResetAppsState}
              className="std-card std-card-link text-left"
            >
              <span className="std-label block">App categories</span>
              <span
                className="uppercase font-bold block mt-1"
                style={{ fontSize: '0.9rem', letterSpacing: '1px' }}
              >
                REOPEN EVERY DRAWER
              </span>
              <span
                className="std-muted block mt-1"
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
              border: '1px solid var(--std-accent)',
              borderRadius: 2,
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="flex-1 min-w-0">
                <p className="std-eyebrow mb-1">Reset preferences</p>
                <h3
                  className="uppercase font-bold m-0"
                  style={{
                    fontSize: '1.1rem',
                    letterSpacing: '1.5px',
                    color: 'var(--std-highlight)',
                  }}
                >
                  Start fresh
                </h3>
                <p
                  className="mt-2 mb-0"
                  style={{
                    maxWidth: '56ch',
                    fontSize: '0.78rem',
                    color: 'var(--std-muted)',
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
                className="std-btn std-btn-accent shrink-0"
              >
                CLEAR ALL DATA
              </button>
            </div>
          </div>
        </section>

        {/* ── CLOSING LINE ────────────────────────────────────────────── */}
        <div className="mt-12">
          <StudioRule />
          <div className="pt-4 flex flex-col md:flex-row items-start md:items-baseline justify-between gap-2">
            <Link
              to="/"
              className="std-label no-underline hover:text-[var(--std-accent)]"
            >
              ← BACK TO THE INDEX
            </Link>
            <span className="std-label">
              SETTINGS · {String(entryCount).padStart(2, '0')} ENTRIES · LOCAL ·
              ON THIS DEVICE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioSettingsPage;
