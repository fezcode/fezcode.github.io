import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  TrophyIcon,
  LayoutIcon,
  DatabaseIcon,
  FilmStripIcon,
  WarningIcon,
  TrashIcon,
  ArrowCounterClockwiseIcon,
  MagicWandIcon,
  ArticleIcon,
  BrainIcon,
} from '@phosphor-icons/react';
import { useAnimation } from '../../context/AnimationContext';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import { useAchievements } from '../../context/AchievementContext';
import { DndContext } from '../../context/DndContext';
import CustomToggle from '../../components/CustomToggle';
import CustomDropdown from '../../components/CustomDropdown';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import { useHomepageOrder } from '../../context/HomepageOrderContext';
import GenerativeArt from '../../components/GenerativeArt';
import {
  KEY_SIDEBAR_STATE,
  KEY_APPS_COLLAPSED_CATEGORIES,
  remove as removeLocalStorageItem,
} from '../../utils/LocalStorageManager';

const Section = ({ title, icon, children, delay = 0, id }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-[#F3ECE0] border border-[#1A161320] p-8 shadow-[0_20px_40px_-25px_#1A161330] relative group overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C96442]/50 via-transparent to-[#B88532]/30" />

    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none text-[#1A1613]">
      {React.cloneElement(icon, { size: 160, weight: 'fill' })}
    </div>

    <div className="flex items-center gap-4 mb-10 relative z-10">
      <div className="p-3 bg-[#C96442]/10 border border-[#C96442]/30 text-[#9E4A2F]">
        {React.cloneElement(icon, { size: 24, weight: 'bold' })}
      </div>
      <h2 className="text-3xl text-[#1A1613] font-fraunces italic tracking-tight">{title}</h2>
    </div>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const TerracottaSettingsPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  const { unlockAchievement, showAchievementToast, toggleAchievementToast } = useAchievements();

  useEffect(() => {
    unlockAchievement('power_user');
  }, [unlockAchievement]);

  const { reduceMotion, toggleReduceMotion } = useAnimation();

  const {
    isInverted, toggleInvert, isRetro, toggleRetro, isParty, toggleParty, isMirror, toggleMirror,
    isNoir, toggleNoir, isTerminal, toggleTerminal, isBlueprint, toggleBlueprint, isSepia, toggleSepia,
    isVaporwave, toggleVaporwave, isCyberpunk, toggleCyberpunk, isGameboy, toggleGameboy, isComic, toggleComic,
    isSketchbook, toggleSketchbook, isHellenic, toggleHellenic, isGlitch, toggleGlitch, isGarden, toggleGarden,
    isAutumn, toggleAutumn, isRain, toggleRain, isSplashTextEnabled, toggleSplashText,
    isAppFullscreen, toggleAppFullscreen, isSyntaxSpriteEnabled, toggleSyntaxSprite,
    fezcodexTheme, setFezcodexTheme, blogPostViewMode, setBlogPostViewMode,
    headerFont, setHeaderFont, bodyFont, setBodyFont, availableFonts,
    isFalloutOverlay, toggleFalloutOverlay, falloutVariant, setFalloutVariant,
    isFalloutNoiseEnabled, toggleFalloutNoise, isFalloutScanlinesEnabled, toggleFalloutScanlines,
    isFalloutVignetteEnabled, toggleFalloutVignette,
  } = useVisualSettings();

  const {
    isLightningEnabled, toggleLightning, isLootDiscoveryEnabled, toggleLootDiscovery,
    isFireOverlayEnabled, toggleFireOverlay, isFireParticlesEnabled, toggleFireParticles,
    isViewportFrameEnabled, toggleViewportFrame,
  } = React.useContext(DndContext);

  const { addToast } = useToast();
  const { sectionOrder, toggleSectionOrder, resetSectionOrder } = useHomepageOrder();

  const handleResetSidebarState = () => {
    removeLocalStorageItem(KEY_SIDEBAR_STATE);
    addToast({ title: 'Success', message: 'Sidebar state reset. Refreshing...', duration: 2000 });
    setTimeout(() => window.location.reload(), 2000);
  };

  const handleResetAppsState = () => {
    removeLocalStorageItem(KEY_APPS_COLLAPSED_CATEGORIES);
    addToast({ title: 'Success', message: 'App categories reset. Refreshing...', duration: 2000 });
    setTimeout(() => window.location.reload(), 2000);
  };

  const handleClearStorage = () => {
    localStorage.clear();
    addToast({
      title: 'Success',
      message: 'All local data cleared. Restarting engine...',
      duration: 3000,
    });

    setTimeout(() => {
      const now = new Date().toISOString();
      const cleanSlateData = { clean_slate: { unlocked: true, unlockedAt: now } };
      localStorage.setItem('unlocked-achievements', JSON.stringify(cleanSlateData));

      addToast({
        title: 'Achievement Unlocked!',
        message: 'Clean Slate',
        duration: 4000,
        icon: <TrophyIcon weight="duotone" className="text-[#B88532]" />,
        type: 'gold',
      });
    }, 500);

    setTimeout(() => window.location.reload(), 3000);
  };

  const panelCell = 'p-6 border border-[#1A161320] bg-[#E8DECE]/40 space-y-6';

  return (
    <div className="min-h-screen bg-[#F3ECE0] py-24 px-6 md:px-12 selection:bg-[#C96442]/25 font-mono relative overflow-x-hidden text-[#1A1613]">
      <Seo title="Settings | Fezcodex" description="Customize your experience." />

      <div className="fixed inset-0 opacity-[0.04] pointer-events-none">
        <GenerativeArt seed="Ahmed Samil Bulbul" className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        <header className="mb-24">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-[#2E2620]/60 hover:text-[#1A1613] transition-colors mb-12 font-mono text-xs uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-fraunces italic tracking-tight text-[#1A1613] leading-none">
                Settings
              </h1>
              <p className="text-xl text-[#2E2620] max-w-2xl leading-relaxed">
                Customize visuals, manage preferences, and configure your site settings.
              </p>
            </div>

            <div className="hidden xl:flex items-center gap-3 px-6 py-3 border border-[#1A161320] bg-[#E8DECE]/50 font-mono text-[10px] text-[#2E2620]/60 uppercase tracking-widest">
              <DatabaseIcon size={16} />
              <span>Local Storage Only</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12">
          <Section id="interface" title="Interface Layout" icon={<LayoutIcon />} delay={0.0}>
            <div className="space-y-8">
              <div className={`${panelCell} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1613] mb-1">Section Priority</h3>
                  <p className="text-sm text-[#2E2620]/70">
                    Choose which content appears first on your dashboard.
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-4">
                  <button
                    onClick={() => {
                      resetSectionOrder();
                      addToast({ title: 'Order Reset', message: 'Homepage order restored.', duration: 2000 });
                    }}
                    className="text-[10px] font-mono uppercase tracking-widest text-[#2E2620]/60 hover:text-[#9E4A2F] transition-colors flex items-center gap-2"
                  >
                    <ArrowCounterClockwiseIcon size={14} /> Reset
                  </button>
                  <CustomToggle
                    id="homepage-section-order"
                    label="Blogposts First"
                    checked={sectionOrder[0] === 'blogposts'}
                    onChange={toggleSectionOrder}
                    fontClass="font-outfit"
                  />
                </div>
              </div>

              <div className={`${panelCell} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1613] mb-1">App Experience</h3>
                  <p className="text-sm text-[#2E2620]/70">Control how applications are displayed.</p>
                </div>
                <div className="flex items-center gap-4">
                  <CustomToggle
                    id="app-fullscreen"
                    label="Fullscreen Apps"
                    checked={isAppFullscreen}
                    onChange={toggleAppFullscreen}
                    fontClass="font-outfit"
                  />
                </div>
              </div>

              <div className={`${panelCell} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1613] mb-1">Fezcodex Theme</h3>
                  <p className="text-sm text-[#2E2620]/70">
                    Choose between brutalist, luxe, or terracotta.
                  </p>
                </div>
                <CustomDropdown
                  variant="brutalist"
                  label="Select Theme"
                  options={[
                    { label: 'Brutalist (Dark)', value: 'brutalist' },
                    { label: 'Luxe (Refined)', value: 'luxe' },
                    { label: 'Terracotta (Warm)', value: 'terracotta' },
                  ]}
                  value={fezcodexTheme}
                  onChange={setFezcodexTheme}
                  icon={LayoutIcon}
                />
              </div>
            </div>
          </Section>

          <Section id="reader" title="Reader Experience" icon={<ArticleIcon />} delay={0.05}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={panelCell}>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1613] mb-1">Visual Mode</h3>
                  <p className="text-sm text-[#2E2620]/70">Default rendering style for long-form content.</p>
                </div>
                <CustomDropdown
                  variant="brutalist"
                  label="Select View"
                  options={[
                    { label: 'Default', value: 'standard' },
                    { label: 'Brutalist', value: 'brutalist' },
                    { label: 'Editorial', value: 'editorial' },
                    { label: 'Classic', value: 'old' },
                    { label: 'Dossier', value: 'dossier' },
                    { label: 'Dokument', value: 'dokument' },
                    { label: 'Terminal (Amber)', value: 'terminal' },
                    { label: 'Terminal (Emerald)', value: 'terminal-green' },
                    { label: 'Luxe', value: 'luxe' },
                  ]}
                  value={blogPostViewMode}
                  onChange={setBlogPostViewMode}
                  icon={ArticleIcon}
                />
              </div>
            </div>
          </Section>

          <Section id="typography" title="Discovery Log Typography" icon={<LayoutIcon />} delay={0.07}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={panelCell}>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1613] mb-1">Header Font</h3>
                  <p className="text-sm text-[#2E2620]/70">Font for log headings and titles.</p>
                </div>
                <CustomDropdown
                  variant="brutalist"
                  label="Select Header Font"
                  options={availableFonts.map((f) => ({ label: f.name, value: f.id }))}
                  value={headerFont}
                  onChange={setHeaderFont}
                  fullWidth={true}
                />
              </div>

              <div className={panelCell}>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1613] mb-1">Body Font</h3>
                  <p className="text-sm text-[#2E2620]/70">Primary typeface for body text.</p>
                </div>
                <CustomDropdown
                  variant="brutalist"
                  label="Select Body Font"
                  options={availableFonts.map((f) => ({ label: f.name, value: f.id }))}
                  value={bodyFont}
                  onChange={setBodyFont}
                  fullWidth={true}
                />
              </div>
            </div>
          </Section>

          <Section id="motion" title="Motion & Performance" icon={<FilmStripIcon />} delay={0.1}>
            <div className="space-y-8">
              <div className={panelCell}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1613] mb-1">Reduce Motion</h3>
                    <p className="text-sm text-[#2E2620]/70 max-w-md">
                      Disables all Framer Motion animations across the application.
                    </p>
                  </div>
                  <CustomToggle
                    id="reduce-motion"
                    label={reduceMotion ? 'Enabled' : 'Disabled'}
                    checked={reduceMotion}
                    onChange={toggleReduceMotion}
                    fontClass="font-outfit"
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section id="achievements" title="Achievement System" icon={<TrophyIcon />} delay={0.2}>
            <div className={`${panelCell} flex items-center justify-between gap-6`}>
              <div>
                <h3 className="text-lg font-bold text-[#1A1613] mb-1">Achievement Toasts</h3>
                <p className="text-sm text-[#2E2620]/70">
                  Show a notification when you unlock a new achievement.
                </p>
              </div>
              <CustomToggle
                id="enable-achievement-toasts"
                label={showAchievementToast ? 'Active' : 'Silent'}
                checked={showAchievementToast}
                onChange={toggleAchievementToast}
                fontClass="font-outfit"
              />
            </div>
          </Section>

          <Section id="companion" title="Companion Protocol" icon={<BrainIcon />} delay={0.25}>
            <div className={`${panelCell} flex items-center justify-between gap-6`}>
              <div>
                <h3 className="text-lg font-bold text-[#1A1613] mb-1">Syntax, the Codex Companion</h3>
                <p className="text-sm text-[#2E2620]/70">
                  Enable the autonomous digital entity that lives at the bottom of your screen.
                </p>
              </div>
              <CustomToggle
                id="enable-syntax-sprite"
                label={isSyntaxSpriteEnabled ? 'Active' : 'Stowed'}
                checked={isSyntaxSpriteEnabled}
                onChange={toggleSyntaxSprite}
                fontClass="font-outfit"
              />
            </div>
          </Section>

          <Section id="visual-matrix" title="Visual Matrix" icon={<MagicWandIcon />} delay={0.3}>
            <p className="mb-10 text-[#2E2620]/60 font-mono text-[10px] uppercase tracking-[0.2em]">
              Apply experimental filters to the entire application. Combine with caution.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <CustomToggle id="fx-invert" colorTheme="rose" label="Invert Colors" checked={isInverted} onChange={toggleInvert} fontClass="font-outfit" />
              <CustomToggle id="fx-retro" colorTheme="blue" label="Retro CRT" checked={isRetro} onChange={toggleRetro} fontClass="font-outfit" />
              <CustomToggle id="fx-party" colorTheme="green" label="Party Mode" checked={isParty} onChange={toggleParty} fontClass="font-outfit" />
              <CustomToggle id="fx-mirror" colorTheme="amber" label="Mirror World" checked={isMirror} onChange={toggleMirror} fontClass="font-outfit" />
              <CustomToggle id="fx-noir" colorTheme="purple" label="Film Noir" checked={isNoir} onChange={toggleNoir} fontClass="font-outfit" />
              <CustomToggle id="fx-terminal" colorTheme="cyan" label="Emerald Term" checked={isTerminal} onChange={toggleTerminal} fontClass="font-outfit" />
              <CustomToggle id="fx-blueprint" colorTheme="indigo" label="Blueprint" checked={isBlueprint} onChange={toggleBlueprint} fontClass="font-outfit" />
              <CustomToggle id="fx-sepia" colorTheme="rose" label="Vintage Sepia" checked={isSepia} onChange={toggleSepia} fontClass="font-outfit" />
              <CustomToggle id="fx-vaporwave" colorTheme="blue" label="Vaporwave" checked={isVaporwave} onChange={toggleVaporwave} fontClass="font-outfit" />
              <CustomToggle id="fx-cyberpunk" colorTheme="green" label="Cyberpunk" checked={isCyberpunk} onChange={toggleCyberpunk} fontClass="font-outfit" />
              <CustomToggle id="fx-gameboy" colorTheme="amber" label="Legacy Handheld" checked={isGameboy} onChange={toggleGameboy} fontClass="font-outfit" />
              <CustomToggle id="fx-comic" colorTheme="purple" label="Comic Array" checked={isComic} onChange={toggleComic} fontClass="font-outfit" />
              <CustomToggle id="fx-sketchbook" colorTheme="cyan" label="Graphite Map" checked={isSketchbook} onChange={toggleSketchbook} fontClass="font-outfit" />
              <CustomToggle id="fx-hellenic" colorTheme="indigo" label="Classical Agora" checked={isHellenic} onChange={toggleHellenic} fontClass="font-outfit" />
              <CustomToggle id="fx-glitch" colorTheme="rose" label="Data Corruption" checked={isGlitch} onChange={toggleGlitch} fontClass="font-outfit" />
              <CustomToggle id="fx-garden" colorTheme="blue" label="Flora Protocol" checked={isGarden} onChange={toggleGarden} fontClass="font-outfit" />
              <CustomToggle id="fx-autumn" colorTheme="green" label="Seasonal Decay" checked={isAutumn} onChange={toggleAutumn} fontClass="font-outfit" />
              <CustomToggle id="fx-rain" colorTheme="amber" label="Hydraulic Filter" checked={isRain} onChange={toggleRain} fontClass="font-outfit" />
              <CustomToggle id="fx-fallout" colorTheme="purple" label="Fallout Overlay" checked={isFalloutOverlay} onChange={toggleFalloutOverlay} fontClass="font-outfit" />
              {isFalloutOverlay && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4 p-6 border border-[#1A161320] bg-[#E8DECE]/50 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#2E2620]">
                      Overlay Variant:
                    </span>
                    <CustomDropdown
                      variant="brutalist"
                      label="Variant"
                      options={[
                        { label: 'New Vegas (Amber)', value: 'amber' },
                        { label: 'Fallout 3 (Green)', value: 'green' },
                      ]}
                      value={falloutVariant}
                      onChange={setFalloutVariant}
                      fullWidth={false}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#1A161320]">
                    <CustomToggle id="fallout-noise" label="Signal Noise" checked={isFalloutNoiseEnabled} onChange={toggleFalloutNoise} fontClass="font-outfit" />
                    <CustomToggle id="fallout-scanlines" label="CRT Scanlines" checked={isFalloutScanlinesEnabled} onChange={toggleFalloutScanlines} fontClass="font-outfit" />
                    <CustomToggle id="fallout-vignette" label="Screen Vignette" checked={isFalloutVignetteEnabled} onChange={toggleFalloutVignette} fontClass="font-outfit" />
                  </div>
                </div>
              )}
              <CustomToggle id="fx-splash" label="Splash Text" checked={isSplashTextEnabled} onChange={toggleSplashText} fontClass="font-outfit" />
            </div>
          </Section>

          <Section id="dnd" title="DND Experience" icon={<FilmStripIcon />} delay={0.32}>
            <p className="mb-10 text-[#2E2620]/60 font-mono text-[10px] uppercase tracking-[0.2em]">
              Fine-tune the immersive effects of the "From Serfs and Frauds" archives.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <CustomToggle id="dnd-lightning" label="Lightning Strikes" checked={isLightningEnabled} onChange={toggleLightning} fontClass="font-outfit" />
              <CustomToggle id="dnd-loot" label="Loot Discovery" checked={isLootDiscoveryEnabled} onChange={toggleLootDiscovery} fontClass="font-outfit" />
              <CustomToggle id="dnd-fire-overlay" label="Fire Overlay" checked={isFireOverlayEnabled} onChange={toggleFireOverlay} fontClass="font-outfit" />
              <CustomToggle id="dnd-fire-particles" label="Fire Particles" checked={isFireParticlesEnabled} onChange={toggleFireParticles} fontClass="font-outfit" />
              <CustomToggle id="dnd-frame" label="Viewport Frame" checked={isViewportFrameEnabled} onChange={toggleViewportFrame} fontClass="font-outfit" />
            </div>
          </Section>

          <Section id="feedback" title="System Feedback" icon={<ArticleIcon />} delay={0.35}>
            <p className="mb-10 text-[#2E2620]/60 font-mono text-[10px] uppercase tracking-[0.2em]">
              Verify notification delivery.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => addToast({ title: 'Success', message: 'Operation succeeded.', type: 'success' })}
                className="py-4 border border-[#6B8E23]/40 bg-[#6B8E23]/10 text-[#6B8E23] font-mono text-[10px] uppercase tracking-widest hover:bg-[#6B8E23] hover:text-[#F3ECE0] transition-all"
              >
                Test Success
              </button>
              <button
                onClick={() => addToast({ title: 'System Error', message: 'Corruption detected.', type: 'error' })}
                className="py-4 border border-[#9E4A2F]/40 bg-[#9E4A2F]/10 text-[#9E4A2F] font-mono text-[10px] uppercase tracking-widest hover:bg-[#9E4A2F] hover:text-[#F3ECE0] transition-all"
              >
                Test Error
              </button>
              <button
                onClick={() => addToast({ title: 'Legacy Mapped', message: 'Classical structure integrated.', type: 'gold' })}
                className="py-4 border border-[#B88532]/40 bg-[#B88532]/10 text-[#B88532] font-mono text-[10px] uppercase tracking-widest hover:bg-[#B88532] hover:text-[#F3ECE0] transition-all"
              >
                Test Gold
              </button>
              <button
                onClick={() => addToast({ title: 'Terminal Access', message: 'Remote connection established.', type: 'techno' })}
                className="py-4 border border-[#C96442]/40 bg-[#C96442]/10 text-[#C96442] font-mono text-[10px] uppercase tracking-widest hover:bg-[#C96442] hover:text-[#F3ECE0] transition-all"
              >
                Test Techno
              </button>
            </div>
          </Section>

          <Section id="advanced" title="Advanced Settings" icon={<DatabaseIcon />} delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className={`${panelCell} flex flex-col justify-between gap-6`}>
                <div>
                  <h3 className="text-base font-bold text-[#1A1613] mb-1 uppercase tracking-wider">Sidebar State</h3>
                  <p className="text-[10px] font-mono text-[#2E2620]/60 uppercase tracking-widest">
                    Reset the sidebar to its default state.
                  </p>
                </div>
                <button
                  onClick={handleResetSidebarState}
                  className="w-full py-3 px-4 border border-[#1A161320] hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-all font-mono text-[10px] uppercase tracking-widest text-[#1A1613]"
                >
                  Reset Sidebar
                </button>
              </div>

              <div className={`${panelCell} flex flex-col justify-between gap-6`}>
                <div>
                  <h3 className="text-base font-bold text-[#1A1613] mb-1 uppercase tracking-wider">App Categories</h3>
                  <p className="text-[10px] font-mono text-[#2E2620]/60 uppercase tracking-widest">
                    Reset app categories to their default visibility.
                  </p>
                </div>
                <button
                  onClick={handleResetAppsState}
                  className="w-full py-3 px-4 border border-[#1A161320] hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-all font-mono text-[10px] uppercase tracking-widest text-[#1A1613]"
                >
                  Reset Apps
                </button>
              </div>
            </div>
          </Section>

          <Section id="danger-zone" title="Reset All Data" icon={<TrashIcon />} delay={0.5}>
            <div className="border-4 border-[#9E4A2F]/30 bg-[#9E4A2F]/5 p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="p-4 bg-[#9E4A2F] text-[#F3ECE0] shrink-0">
                  <WarningIcon size={32} weight="bold" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl text-[#1A1613] font-fraunces italic mb-2">
                    Factory Reset
                  </h3>
                  <p className="text-[#2E2620] max-w-xl">
                    This will clear all your preferences and achievements. This cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleClearStorage}
                  className="w-full md:w-auto px-8 py-4 bg-[#9E4A2F] text-[#F3ECE0] hover:bg-[#C96442] transition-colors uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(158,74,47,0.25)]"
                >
                  Reset Everything
                </button>
              </div>
            </div>
          </Section>
        </div>

        <footer className="mt-32 pt-12 border-t border-[#1A161320] flex flex-col md:flex-row justify-between items-center gap-6 text-[#2E2620]/50 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex Settings v2.1</span>
          <span className="text-[#2E2620]/30">Connected</span>
        </footer>
      </div>
    </div>
  );
};

export default TerracottaSettingsPage;
