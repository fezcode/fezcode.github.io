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
    className="bg-white/[0.02] border border-white/10 rounded-sm p-8 shadow-2xl relative group overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none grayscale">
      {React.cloneElement(icon, { size: 160, weight: 'fill' })}
    </div>

    <div className="flex items-center gap-4 mb-10 relative z-10">
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-sm text-emerald-500">
        {React.cloneElement(icon, { size: 24, weight: 'bold' })}
      </div>
      <h2 className="text-3xl text-white uppercase tracking-tighter">
        {title}
      </h2>
    </div>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const SettingsPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  const { unlockAchievement, showAchievementToast, toggleAchievementToast } = useAchievements();

  useEffect(() => {
    unlockAchievement('power_user');
  }, [unlockAchievement]);

  const {
    reduceMotion,
    toggleReduceMotion,
  } = useAnimation();

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
      title: 'Success',
      message: 'Sidebar state reset. Refreshing...',
      duration: 2000,
    });
    setTimeout(() => window.location.reload(), 2000);
  };

  const handleResetAppsState = () => {
    removeLocalStorageItem(KEY_APPS_COLLAPSED_CATEGORIES);
    addToast({
      title: 'Success',
      message: 'App categories reset. Refreshing...',
      duration: 2000,
    });
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
      const cleanSlateData = {
        clean_slate: { unlocked: true, unlockedAt: now },
      };
      localStorage.setItem(
        'unlocked-achievements',
        JSON.stringify(cleanSlateData),
      );

      addToast({
        title: 'Achievement Unlocked!',
        message: 'Clean Slate',
        duration: 4000,
        icon: <TrophyIcon weight="duotone" className="text-amber-400" />,
        type: 'gold',
      });
    }, 500);

    setTimeout(() => window.location.reload(), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] py-24 px-6 md:px-12 selection:bg-emerald-500/30 font-mono relative overflow-x-hidden">
      <Seo
        title="Settings | Fezcodex"
        description="Customize your experience and configure site settings."
        keywords={['Fezcodex', 'settings', 'preferences', 'configuration']}
      />
      {/* Decorative Art Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none grayscale">
        <GenerativeArt seed="Ahmed Samil Bulbul" className="w-full h-full" />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <header className="mb-24">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 font-mono text-xs uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon
              weight="bold"
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Back to Home</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl tracking-tighter text-white leading-none uppercase">
                Settings
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Customize visuals, manage preferences, and configure your site
                settings.
              </p>
            </div>

            <div className="hidden xl:flex items-center gap-3 px-6 py-3 border border-white/10 bg-white/5 font-mono text-[10px] text-gray-500 uppercase tracking-widest rounded-sm">
              <DatabaseIcon size={16} />
              <span>Local Storage Only</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {/* Layout Configuration */}
          <Section title="Interface Layout" icon={<LayoutIcon />} delay={0.0}>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Section Priority
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose which content appears first on your dashboard.
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-4">
                  <button
                    onClick={() => {
                      resetSectionOrder();
                      addToast({
                        title: 'Order Reset',
                        message: 'Homepage order restored to default.',
                        duration: 2000,
                      });
                    }}
                    className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-2"
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

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    App Experience
                  </h3>
                  <p className="text-sm text-gray-500">
                    Control how applications are displayed.
                  </p>
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

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Fezcodex Theme
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose between the high-contrast brutalist vault or the sophisticated luxe interface.
                  </p>
                </div>
                <CustomDropdown
                  variant="brutalist"
                  label="Select Theme"
                  options={[
                    { label: 'Brutalist (Dark)', value: 'brutalist' },
                    { label: 'Luxe (Refined)', value: 'luxe' },
                  ]}
                  value={fezcodexTheme}
                  onChange={setFezcodexTheme}
                  icon={LayoutIcon}
                />
              </div>
            </div>
          </Section>

          {/* Reading Experience */}
          <Section
            title="Reader Experience"
            icon={<ArticleIcon />}
            delay={0.05}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Visual Mode
                  </h3>
                  <p className="text-sm text-gray-500">
                    Default rendering style for long-form content.
                  </p>
                </div>
                <CustomDropdown
                  variant="brutalist"
                  label="Select View"
                  options={[
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

          {/* Typography Configuration */}
          <Section title="Discovery Log Typography" icon={<LayoutIcon />} delay={0.07}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Header Font
                  </h3>
                  <p className="text-sm text-gray-500">
                    Neural font selection for log headings and titles.
                  </p>
                </div>
                <CustomDropdown
                  variant="brutalist"
                  label="Select Header Font"
                  options={availableFonts.map(f => ({ label: f.name, value: f.id }))}
                  value={headerFont}
                  onChange={setHeaderFont}
                  fullWidth={true}
                />
              </div>

              <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Body Font
                  </h3>
                  <p className="text-sm text-gray-500">
                    Primary typeface for log reader content and detailed text.
                  </p>
                </div>
                <CustomDropdown
                  variant="brutalist"
                  label="Select Body Font"
                  options={availableFonts.map(f => ({ label: f.name, value: f.id }))}
                  value={bodyFont}
                  onChange={setBodyFont}
                  fullWidth={true}
                />
              </div>
            </div>
          </Section>

          {/* Performance & Animation */}
          <Section
            title="Motion & Performance"
            icon={<FilmStripIcon />}
            delay={0.1}
          >
            <div className="space-y-8">
              <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Reduce Motion
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      Disables all Framer Motion animations across the application for a faster, more stable experience.
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

          {/* Gamification */}
          <Section id="achievements" title="Achievement System" icon={<TrophyIcon />} delay={0.2}>
            <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm flex items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Achievement Toasts
                </h3>
                <p className="text-sm text-gray-500">
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

          {/* Visual Effects Grid */}
          <Section id="visual-matrix" title="Visual Matrix" icon={<MagicWandIcon />} delay={0.3}>
            <p className="mb-10 text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">
              Apply experimental filters to the entire application. Combine with caution.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <CustomToggle id="fx-invert"      colorTheme="rose"    label="Invert Colors"     checked={isInverted}        onChange={toggleInvert}            fontClass="font-outfit" />
              <CustomToggle id="fx-retro"       colorTheme="blue"    label="Retro CRT"         checked={isRetro}           onChange={toggleRetro}             fontClass="font-outfit" />
              <CustomToggle id="fx-party"       colorTheme="green"   label="Party Mode"        checked={isParty}           onChange={toggleParty}             fontClass="font-outfit" />
              <CustomToggle id="fx-mirror"      colorTheme="amber"   label="Mirror World"      checked={isMirror}          onChange={toggleMirror}            fontClass="font-outfit" />
              <CustomToggle id="fx-noir"        colorTheme="purple"  label="Film Noir"         checked={isNoir}            onChange={toggleNoir}              fontClass="font-outfit" />
              <CustomToggle id="fx-terminal"    colorTheme="cyan"    label="Emerald Term"      checked={isTerminal}        onChange={toggleTerminal}          fontClass="font-outfit" />
              <CustomToggle id="fx-blueprint"   colorTheme="indigo"  label="Blueprint"         checked={isBlueprint}       onChange={toggleBlueprint}         fontClass="font-outfit" />
              <CustomToggle id="fx-sepia"       colorTheme="rose"    label="Vintage Sepia"     checked={isSepia}           onChange={toggleSepia}             fontClass="font-outfit" />
              <CustomToggle id="fx-vaporwave"   colorTheme="blue"    label="Vaporwave"         checked={isVaporwave}       onChange={toggleVaporwave}         fontClass="font-outfit" />
              <CustomToggle id="fx-cyberpunk"   colorTheme="green"   label="Cyberpunk"         checked={isCyberpunk}       onChange={toggleCyberpunk}         fontClass="font-outfit" />
              <CustomToggle id="fx-gameboy"     colorTheme="amber"   label="Legacy Handheld"   checked={isGameboy}         onChange={toggleGameboy}           fontClass="font-outfit" />
              <CustomToggle id="fx-comic"       colorTheme="purple"  label="Comic Array"       checked={isComic}           onChange={toggleComic}             fontClass="font-outfit" />
              <CustomToggle id="fx-sketchbook"  colorTheme="cyan"    label="Graphite Map"      checked={isSketchbook}      onChange={toggleSketchbook}        fontClass="font-outfit" />
              <CustomToggle id="fx-hellenic"    colorTheme="indigo"  label="Classical Agora"   checked={isHellenic}        onChange={toggleHellenic}          fontClass="font-outfit" />
              <CustomToggle id="fx-glitch"      colorTheme="rose"    label="Data Corruption"   checked={isGlitch}          onChange={toggleGlitch}            fontClass="font-outfit" />
              <CustomToggle id="fx-garden"      colorTheme="blue"    label="Flora Protocol"    checked={isGarden}          onChange={toggleGarden}            fontClass="font-outfit" />
              <CustomToggle id="fx-autumn"      colorTheme="green"   label="Seasonal Decay"    checked={isAutumn}          onChange={toggleAutumn}            fontClass="font-outfit" />
              <CustomToggle id="fx-rain"        colorTheme="amber"   label="Hydraulic Filter"  checked={isRain}            onChange={toggleRain}              fontClass="font-outfit" />
              <CustomToggle id="fx-fallout"     colorTheme="purple"  label="Fallout Overlay"   checked={isFalloutOverlay}  onChange={toggleFalloutOverlay}    fontClass="font-outfit" />
              {isFalloutOverlay && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4 p-6 border border-white/10 bg-white/5 rounded-sm space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Overlay Variant:</span>
                    <CustomDropdown
                        variant="brutalist"
                        label="Variant"
                        options={[
                            { label: 'New Vegas (Amber)', value: 'amber' },
                            { label: 'Fallout 3 (Green)', value: 'green' }
                        ]}
                        value={falloutVariant}
                        onChange={setFalloutVariant}
                        fullWidth={false}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                    <CustomToggle
                      id="fallout-noise"
                      label="Signal Noise"
                      checked={isFalloutNoiseEnabled}
                      onChange={toggleFalloutNoise}
                      fontClass="font-outfit"
                    />
                    <CustomToggle
                      id="fallout-scanlines"
                      label="CRT Scanlines"
                      checked={isFalloutScanlinesEnabled}
                      onChange={toggleFalloutScanlines}
                      fontClass="font-outfit"
                    />
                    <CustomToggle
                      id="fallout-vignette"
                      label="Screen Vignette"
                      checked={isFalloutVignetteEnabled}
                      onChange={toggleFalloutVignette}
                      fontClass="font-outfit"
                    />
                  </div>
                </div>
              )}
              <CustomToggle id="fx-splash" label="Splash Text" checked={isSplashTextEnabled} onChange={toggleSplashText} fontClass="font-outfit" />
            </div>
          </Section>

          {/* DND Experience Settings */}
          <Section title="DND Experience" icon={<FilmStripIcon />} delay={0.32}>
            <p className="mb-10 text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">
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

          {/* Toast Verification */}
          <Section title="System Feedback" icon={<ArticleIcon />} delay={0.35}>
            <p className="mb-10 text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">
              Verify notification delivery and visual signatures for different system alerts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => addToast({ title: 'Success', message: 'Primary system sequence executed successfully.', type: 'success' })}
                className="py-4 border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
              >
                Test Success
              </button>
              <button
                onClick={() => addToast({ title: 'System Error', message: 'Critical corruption detected in neural module.', type: 'error' })}
                className="py-4 border border-red-500/20 bg-red-500/5 text-red-500 font-mono text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all"
              >
                Test Error
              </button>
              <button
                onClick={() => addToast({ title: 'Legacy Mapped', message: 'Classical data structure integrated into the archive.', type: 'gold' })}
                className="py-4 border border-amber-500/20 bg-amber-500/5 text-amber-500 font-mono text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all"
              >
                Test Gold
              </button>
              <button
                onClick={() => addToast({ title: 'Terminal Access', message: 'Remote connection established via protocol SSH_V2.', type: 'techno' })}
                className="py-4 border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 font-mono text-[10px] uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all"
              >
                Test Techno
              </button>
            </div>
          </Section>

          {/* Advanced Settings */}
          <Section
            title="Advanced Settings"
            icon={<DatabaseIcon />}
            delay={0.4}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm flex flex-col justify-between gap-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-1 uppercase tracking-wider">
                    Sidebar State
                  </h3>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Reset the sidebar to its default state.
                  </p>
                </div>
                <button
                  onClick={handleResetSidebarState}
                  className="w-full py-3 px-4 border border-white/10 hover:bg-white hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest text-white"
                >
                  Reset Sidebar
                </button>
              </div>

              <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm flex flex-col justify-between gap-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-1 uppercase tracking-wider">
                    App Categories
                  </h3>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Reset app categories to their default visibility.
                  </p>
                </div>
                <button
                  onClick={handleResetAppsState}
                  className="w-full py-3 px-4 border border-white/10 hover:bg-white hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest text-white"
                >
                  Reset Apps
                </button>
              </div>
            </div>
          </Section>

          {/* Danger Zone */}
          <Section title="Reset All Data" icon={<TrashIcon />} delay={0.5}>
            <div className="border-4 border-red-500/20 bg-red-500/5 p-8 rounded-sm">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="p-4 bg-red-500 text-black rounded-sm shrink-0">
                  <WarningIcon size={32} weight="bold" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl text-white uppercase tracking-tighter mb-2">
                    Factory Reset
                  </h3>
                  <p className="text-gray-400 font-light max-w-xl">
                    This will clear all your preferences and achievements. This
                    cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleClearStorage}
                  className="w-full md:w-auto px-8 py-4 bg-red-500 text-black hover:bg-red-400 transition-colors uppercase tracking-widest text-sm rounded-sm shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                >
                  Reset Everything
                </button>
              </div>
            </div>
          </Section>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex Settings v2.1</span>
          <span className="text-gray-800">Connected</span>
        </footer>
      </div>
    </div>
  );
};

export default SettingsPage;
