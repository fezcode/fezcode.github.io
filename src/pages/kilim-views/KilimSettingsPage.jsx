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
  KilimText,
  KilimRug,
  KilimBand,
  KilimBadge,
  WOOL,
} from '../../components/kilim';
import '../../styles/Kilim.css';
import './kilim-utility.css';

/*
 * Settings as a loom's stack of care tags. Each group is a stitched ivory
 * tag sewn to an indigo woven header; every setting is one numbered line on
 * the tag, with its control at the end of the line, as a care label lists
 * its instructions.
 */

const TAG_INDEX = [
  { id: 'interface', label: 'Design' },
  { id: 'typography', label: 'Type' },
  { id: 'reader', label: 'Reader' },
  { id: 'motion', label: 'Companions' },
  { id: 'atmosphere', label: 'Atmosphere' },
  { id: 'visual-matrix', label: 'Modes' },
  { id: 'dnd', label: 'Serfs & Frauds' },
  { id: 'feedback', label: 'Proofs' },
  { id: 'advanced', label: 'Data' },
];

const KilimSwitch = ({ id, checked, onChange, label }) => (
  <button
    type="button"
    id={id}
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange()}
    className="klm-settings-switch"
  >
    <span className="klm-settings-switch-knob" aria-hidden="true" />
    <span className="klm-settings-switch-text">{checked ? 'On' : 'Off'}</span>
  </button>
);

const KilimChipGroup = ({ options, value, onChange, label }) => (
  <div className="klm-settings-chips" role="group" aria-label={label}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className="klm-chip"
        aria-pressed={value === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const KilimSelect = ({ id, options, value, onChange, ariaLabel }) => (
  <select
    id={id}
    className="klm-select klm-settings-select"
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

/** One instruction line on a care tag. */
const SettingRow = ({ number, heading, description, control, stacked }) => (
  <li className={`klm-settings-row ${stacked ? 'is-stacked' : ''}`}>
    <div className="klm-settings-line">
      <span className="klm-settings-no" aria-hidden="true">
        No.{number}
      </span>
      <h3 className="klm-settings-name">{heading}</h3>
      {!stacked && <div className="klm-settings-control">{control}</div>}
    </div>
    {description && <p className="klm-settings-desc">{description}</p>}
    {stacked && <div className="klm-settings-stack">{control}</div>}
  </li>
);

/** A care tag: woven indigo header with the group title, stitched ivory body. */
const CareTag = ({ id, code, label, blurb, wide = false, tone, children }) => (
  <section
    id={id}
    className={`klm-settings-tag ${wide ? 'is-wide' : ''} ${
      tone ? `is-${tone}` : ''
    }`}
  >
    <header className="klm-settings-head klm-wool-indigo">
      <div className="klm-settings-code">
        <span>Tag {code}</span>
        <KilimBadge seed={`settings-${id}`} size={9} />
      </div>
      <KilimText as="h2" text={label} fg={WOOL.saffron} />
    </header>
    <div className="klm-settings-body">
      {blurb && <p className="klm-settings-blurb">{blurb}</p>}
      {children}
    </div>
  </section>
);

const KilimSettingsPage = () => {
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
          <TrophyIcon
            weight="duotone"
            style={{ color: 'var(--klm-saffron)' }}
          />
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

  const fontOptions = availableFonts.map((f) => ({
    label: f.name,
    value: f.id,
  }));

  return (
    <div className="klm-root">
      <Seo
        title="Settings | Fezcodex"
        description="Make Kilim your own: appearance, reading, companions, motion, and saved preferences."
      />
      <div className="klm-page">
        <KilimRug
          eyebrow={`This device · visual only · theme ${fezcodexTheme}`}
          title="Settings"
          intro="Make this corner your own. Every tag below is a set of care instructions, saved in local storage on this device."
          seed="kilim-settings"
          minRows={44}
        >
          <nav className="klm-settings-index" aria-label="Settings groups">
            {TAG_INDEX.map((tag, i) => (
              <a key={tag.id} href={`#${tag.id}`} className="klm-chip">
                <span className="klm-settings-index-no" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {tag.label}
              </a>
            ))}
          </nav>
        </KilimRug>

        <div className="klm-settings-sheet">
          {/* ── DESIGN LANGUAGE ─────────────────────────────────────── */}
          <CareTag
            id="interface"
            code="01"
            label="DESIGN LANGUAGE"
            blurb="The visual foundation of the whole codex."
            wide
          >
            <ol className="klm-settings-list">
              <SettingRow
                number={nextNo()}
                heading="Fezcodex theme"
                description="Choose a visual foundation for the whole codex."
                stacked
                control={
                  <KilimChipGroup
                    label="Fezcodex theme"
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
                    ]}
                    value={fezcodexTheme}
                    onChange={setFezcodexTheme}
                  />
                }
              />
            </ol>
          </CareTag>

          {/* ── TYPE ────────────────────────────────────────────────── */}
          <CareTag
            id="typography"
            code="02"
            label="TYPE"
            blurb="Font choices for long-form reading. Only the brutalist theme answers these picks; luxe, terracotta, mist, ledger, orbit, knit and kilim keep their set faces. The selection still saves for when you switch."
          >
            <ol className="klm-settings-list">
              <SettingRow
                number={nextNo()}
                heading="Header font"
                description="Blog-post headings and titles in reader views."
                stacked
                control={
                  <KilimSelect
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
                stacked
                control={
                  <KilimSelect
                    id="body-font"
                    ariaLabel="Body font"
                    options={fontOptions}
                    value={bodyFont}
                    onChange={setBodyFont}
                  />
                }
              />
            </ol>
          </CareTag>

          {/* ── READER ──────────────────────────────────────────────── */}
          <CareTag
            id="reader"
            code="03"
            label="READER"
            blurb="Choose how articles look and which section appears first on the homepage."
          >
            <ol className="klm-settings-list">
              <SettingRow
                number={nextNo()}
                heading="Long-form reader"
                description="Default rendering style for blog posts and field notes."
                stacked
                control={
                  <KilimChipGroup
                    label="Long-form reader"
                    options={[
                      { label: 'Default', value: 'standard' },
                      { label: 'Brutalist', value: 'brutalist' },
                      { label: 'Editorial', value: 'editorial' },
                      { label: 'Classic', value: 'old' },
                      { label: 'Dossier', value: 'dossier' },
                      { label: 'Dokument', value: 'dokument' },
                      { label: 'Terminal · amber', value: 'terminal' },
                      { label: 'Terminal · emerald', value: 'terminal-green' },
                      { label: 'Luxe', value: 'luxe' },
                      { label: 'Terracotta', value: 'terracotta' },
                      { label: 'Galley', value: 'galley' },
                      { label: 'Orbit', value: 'orbit' },
                      { label: 'Knit', value: 'knit' },
                      { label: 'Kilim', value: 'kilim' },
                      { label: 'Bliss', value: 'bliss' },
                    ]}
                    value={blogPostViewMode}
                    onChange={setBlogPostViewMode}
                  />
                }
              />
              <SettingRow
                number={nextNo()}
                heading="Discovery logs viewer"
                description="Toggle between the 3D collector's shelf (new) and the classic woven archive (old) when opening /logs."
                control={
                  <div className="klm-settings-pair">
                    <span>
                      {discoveryViewMode === 'shelf'
                        ? '3D Shelf (New)'
                        : 'Classic (Old)'}
                    </span>
                    <KilimSwitch
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
                  <div className="klm-settings-pair">
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
                      className="klm-btn klm-btn-small klm-btn-indigo"
                    >
                      Reset
                    </button>
                    <KilimSwitch
                      id="homepage-section-order"
                      label="Notes before archive"
                      checked={sectionOrder[0] === 'blogposts'}
                      onChange={toggleSectionOrder}
                    />
                  </div>
                }
              />
            </ol>
          </CareTag>

          {/* ── COMPANIONS ──────────────────────────────────────────── */}
          <CareTag
            id="motion"
            code="04"
            label="COMPANIONS"
            blurb="Motion, marginalia, and the sprite that reads over your shoulder."
          >
            <ol className="klm-settings-list">
              <SettingRow
                number={nextNo()}
                heading="Reduce motion"
                description="Reduce decorative movement and transitions. Device motion preferences are also respected."
                control={
                  <KilimSwitch
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
                  <KilimSwitch
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
                  <KilimSwitch
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
                  <KilimSwitch
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
                  <KilimSwitch
                    id="app-fullscreen"
                    label="App fullscreen"
                    checked={isAppFullscreen}
                    onChange={toggleAppFullscreen}
                  />
                }
              />
            </ol>
          </CareTag>

          {/* ── ATMOSPHERE ──────────────────────────────────────────── */}
          <CareTag
            id="atmosphere"
            code="05"
            label="ATMOSPHERE"
            blurb="Weather over the archive, and the wasteland receiver."
          >
            <ol className="klm-settings-list">
              <SettingRow
                number={nextNo()}
                heading="Flora protocol"
                description="Digital flowers along the margins."
                control={
                  <KilimSwitch
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
                  <KilimSwitch
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
                  <KilimSwitch
                    id="fx-rain"
                    label="Hydraulic filter"
                    checked={isRain}
                    onChange={toggleRain}
                  />
                }
              />
            </ol>

            <div className="klm-settings-inset klm-wool-walnut">
              <div className="klm-settings-line">
                <span className="klm-label klm-settings-inset-title">
                  Fallout overlay
                </span>
                <KilimSwitch
                  id="fx-fallout"
                  label="Fallout overlay"
                  checked={isFalloutOverlay}
                  onChange={toggleFalloutOverlay}
                />
              </div>
              {isFalloutOverlay && (
                <div className="klm-settings-inset-body">
                  <div className="klm-settings-inset-row">
                    <span className="klm-label">Variant</span>
                    <KilimChipGroup
                      label="Fallout variant"
                      options={[
                        { label: 'New Vegas · amber', value: 'amber' },
                        { label: 'Fallout 3 · green', value: 'green' },
                      ]}
                      value={falloutVariant}
                      onChange={setFalloutVariant}
                    />
                  </div>
                  <div className="klm-settings-inset-row">
                    <span className="klm-settings-inset-pair">
                      <span className="klm-label">Signal noise</span>
                      <KilimSwitch
                        id="fallout-noise"
                        label="Signal noise"
                        checked={isFalloutNoiseEnabled}
                        onChange={toggleFalloutNoise}
                      />
                    </span>
                    <span className="klm-settings-inset-pair">
                      <span className="klm-label">CRT scanlines</span>
                      <KilimSwitch
                        id="fallout-scanlines"
                        label="CRT scanlines"
                        checked={isFalloutScanlinesEnabled}
                        onChange={toggleFalloutScanlines}
                      />
                    </span>
                    <span className="klm-settings-inset-pair">
                      <span className="klm-label">Screen vignette</span>
                      <KilimSwitch
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
          </CareTag>

          {/* ── MODES ───────────────────────────────────────────────── */}
          <CareTag
            id="visual-matrix"
            code="06"
            label="MODES"
            blurb="Experimental overlays. Set one or two; leave the rest unfiled."
            wide
          >
            <ol className="klm-settings-list klm-settings-list-grid">
              {fxToggles.map((t) => (
                <SettingRow
                  key={t.id}
                  number={nextNo()}
                  heading={t.label}
                  control={
                    <KilimSwitch
                      id={t.id}
                      label={t.label}
                      checked={t.checked}
                      onChange={t.onChange}
                    />
                  }
                />
              ))}
            </ol>
          </CareTag>

          {/* ── SERFS & FRAUDS ──────────────────────────────────────── */}
          <CareTag
            id="dnd"
            code="07"
            label="SERFS & FRAUDS"
            blurb='Immersive effects for the "from serfs and frauds" d&d archive.'
          >
            <ol className="klm-settings-list">
              <SettingRow
                number={nextNo()}
                heading="Lightning strikes"
                description="Occasional flashes across the story sheet."
                control={
                  <KilimSwitch
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
                  <KilimSwitch
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
                  <KilimSwitch
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
                  <KilimSwitch
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
                  <KilimSwitch
                    id="dnd-frame"
                    label="Viewport frame"
                    checked={isViewportFrameEnabled}
                    onChange={toggleViewportFrame}
                  />
                }
              />
            </ol>
          </CareTag>

          {/* ── PROOFS ──────────────────────────────────────────────── */}
          <CareTag
            id="feedback"
            code="08"
            label="PROOFS"
            blurb="File one of each toast variant to verify delivery."
          >
            <div className="klm-settings-proofs">
              {[
                { type: 'success', label: 'CONFIRMED', copy: 'ENTRY SAVED.' },
                { type: 'error', label: 'ERROR', copy: 'ENTRY REFUSED.' },
                { type: 'gold', label: 'HONOR', copy: 'A MARK WAS RECORDED.' },
                {
                  type: 'techno',
                  label: 'SIGNAL',
                  copy: 'CHANNEL CONNECTED.',
                },
              ].map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() =>
                    addToast({ title: t.label, message: t.copy, type: t.type })
                  }
                  className={`klm-settings-swatch is-${t.type}`}
                >
                  <span className="klm-settings-swatch-kind">{t.type}</span>
                  <span className="klm-settings-swatch-title">
                    {t.label} →
                  </span>
                </button>
              ))}
            </div>
          </CareTag>

          {/* ── DATA ────────────────────────────────────────────────── */}
          <CareTag
            id="advanced"
            code="09"
            label="DATA"
            blurb="Restore sub-systems without unpicking the whole rug."
            wide
          >
            <div className="klm-settings-resets">
              <button
                type="button"
                onClick={handleResetSidebarState}
                className="klm-settings-swatch"
              >
                <span className="klm-settings-swatch-kind">Sidebar</span>
                <span className="klm-settings-swatch-title">
                  Reset section state
                </span>
                <span className="klm-settings-swatch-copy">
                  Restore every drawer to its default open/closed state.
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetAppsState}
                className="klm-settings-swatch"
              >
                <span className="klm-settings-swatch-kind">App categories</span>
                <span className="klm-settings-swatch-title">
                  Reopen every drawer
                </span>
                <span className="klm-settings-swatch-copy">
                  Reset the app-center category collapse state.
                </span>
              </button>
            </div>

            <div id="danger-zone" className="klm-settings-danger">
              <div className="klm-settings-danger-copy">
                <p className="klm-settings-danger-kind">Reset preferences</p>
                <h3 className="klm-settings-danger-title">Start fresh</h3>
                <p className="klm-settings-danger-text">
                  Clears every preference in local storage: theme, fonts,
                  honors, dashboard order. This cannot be undone; the codex
                  reopens with its default preferences.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearStorage}
                className="klm-btn"
              >
                Clear all data
              </button>
            </div>
          </CareTag>
        </div>

        <div className="klm-settings-foot">
          <Link to="/" className="klm-link">
            ← Back to the index
          </Link>
          <span className="klm-label">
            Settings · {entryCount} entries · local · on this device
          </span>
        </div>
      </div>
      <KilimBand pattern={['stripe', 'chain', 'stripe']} />
    </div>
  );
};

export default KilimSettingsPage;
