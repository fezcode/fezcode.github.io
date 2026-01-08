import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  SidebarIcon,
  ArticleIcon,
} from '@phosphor-icons/react';
import { useAnimation } from '../context/AnimationContext';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { useAchievements } from '../context/AchievementContext';
import { DndContext } from '../context/DndContext';
import CustomToggle from '../components/CustomToggle';
import CustomDropdown from '../components/CustomDropdown';
import useSeo from '../hooks/useSeo';
import { useToast } from '../hooks/useToast';
import { useHomepageOrder } from '../context/HomepageOrderContext';
import GenerativeArt from '../components/GenerativeArt';
import {
  KEY_SIDEBAR_STATE,
  KEY_APPS_COLLAPSED_CATEGORIES,
  remove as removeLocalStorageItem,
} from '../utils/LocalStorageManager';

const Section = ({ title, icon, children, delay = 0 }) => (
  <motion.div
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
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
        {title}
      </h2>
    </div>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const SettingsPage = () => {
  useSeo({
    title: 'Settings | Fezcodex',
    description: 'Customize your experience and configure site settings.',
    keywords: ['Fezcodex', 'settings', 'preferences', 'configuration'],
  });

  const { unlockAchievement, showAchievementToast, toggleAchievementToast } =
    useAchievements();

  useEffect(() => {
    unlockAchievement('power_user');
  }, [unlockAchievement]);

  const {
    isAnimationEnabled,
    toggleAnimation,
    showAnimationsHomepage,
    toggleShowAnimationsHomepage,
    showAnimationsInnerPages,
    toggleShowAnimationsInnerPages,
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
    blogPostViewMode,
    setBlogPostViewMode,
    sidebarMode,
    setSidebarMode,
    sidebarColor,
    setSidebarColor,
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
    <div className="min-h-screen bg-[#050505] py-24 px-6 md:px-12 selection:bg-emerald-500/30 font-sans relative overflow-x-hidden">
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
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
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
                  />
                </div>
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
                    { label: 'Standard', value: 'standard' },
                    { label: 'Classic', value: 'old' },
                    { label: 'Dossier', value: 'dossier' },
                    { label: 'Dokument', value: 'dokument' },
                    { label: 'Terminal (Amber)', value: 'terminal' },
                    { label: 'Terminal (Emerald)', value: 'terminal-green' },
                  ]}
                  value={blogPostViewMode}
                  onChange={setBlogPostViewMode}
                  icon={ArticleIcon}
                />
              </div>

              <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Sidebar Aesthetics
                  </h3>
                  <p className="text-sm text-gray-500">
                    Switch between the modern Brutalist look or the original
                    Classic design.
                  </p>
                </div>
                <CustomDropdown
                  variant="brutalist"
                  label="Select Style"
                  options={[
                    { label: 'Brutalist', value: 'brutalist' },
                    { label: 'Classic', value: 'classic' },
                  ]}
                  value={sidebarMode}
                  onChange={setSidebarMode}
                  icon={SidebarIcon}
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
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                  <h3 className="text-lg font-bold text-white">
                    Global Animations
                  </h3>
                  <CustomToggle
                    id="enable-animations"
                    label={isAnimationEnabled ? 'Enabled' : 'Disabled'}
                    checked={isAnimationEnabled}
                    onChange={toggleAnimation}
                  />
                </div>

                <AnimatePresence>
                  {isAnimationEnabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden"
                    >
                      <CustomToggle
                        id="show-animations-homepage"
                        label="Homepage Motion"
                        checked={showAnimationsHomepage}
                        onChange={toggleShowAnimationsHomepage}
                      />
                      <CustomToggle
                        id="show-animations-inner-pages"
                        label="Interior Page Motion"
                        checked={showAnimationsInnerPages}
                        onChange={toggleShowAnimationsInnerPages}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isAnimationEnabled && (
                  <div className="flex items-center gap-3 text-gray-500 font-mono text-[10px] uppercase tracking-widest">
                    <WarningIcon size={16} />
                    <span>
                      Animation controls are disabled when global animations are
                      off.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* Gamification */}
          <Section title="Achievement System" icon={<TrophyIcon />} delay={0.2}>
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
              />
            </div>
          </Section>

          {/* Visual Effects Grid */}
          <Section title="Visual Matrix" icon={<MagicWandIcon />} delay={0.3}>
            <p className="mb-10 text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">
              Apply experimental filters to the entire application. Combine with caution.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <CustomToggle id="fx-invert" label="Invert Colors" checked={isInverted} onChange={toggleInvert} />
              <CustomToggle id="fx-retro" label="Retro CRT" checked={isRetro} onChange={toggleRetro} />
              <CustomToggle id="fx-party" label="Party Mode" checked={isParty} onChange={toggleParty} />
              <CustomToggle id="fx-mirror" label="Mirror World" checked={isMirror} onChange={toggleMirror} />
              <CustomToggle id="fx-noir" label="Film Noir" checked={isNoir} onChange={toggleNoir} />
              <CustomToggle id="fx-terminal" label="Emerald Term" checked={isTerminal} onChange={toggleTerminal} />
              <CustomToggle id="fx-blueprint" label="Blueprint" checked={isBlueprint} onChange={toggleBlueprint} />
              <CustomToggle id="fx-sepia" label="Vintage Sepia" checked={isSepia} onChange={toggleSepia} />
              <CustomToggle id="fx-vaporwave" label="Vaporwave" checked={isVaporwave} onChange={toggleVaporwave} />
              <CustomToggle id="fx-cyberpunk" label="Cyberpunk" checked={isCyberpunk} onChange={toggleCyberpunk} />
              <CustomToggle id="fx-gameboy" label="Legacy Handheld" checked={isGameboy} onChange={toggleGameboy} />
              <CustomToggle id="fx-comic" label="Comic Array" checked={isComic} onChange={toggleComic} />
              <CustomToggle id="fx-sketchbook" label="Graphite Map" checked={isSketchbook} onChange={toggleSketchbook} />
              <CustomToggle id="fx-hellenic" label="Classical Agora" checked={isHellenic} onChange={toggleHellenic} />
              <CustomToggle id="fx-glitch" label="Data Corruption" checked={isGlitch} onChange={toggleGlitch} />
              <CustomToggle id="fx-garden" label="Flora Protocol" checked={isGarden} onChange={toggleGarden} />
              <CustomToggle id="fx-autumn" label="Seasonal Decay" checked={isAutumn} onChange={toggleAutumn} />
              <CustomToggle id="fx-rain" label="Hydraulic Filter" checked={isRain} onChange={toggleRain} />
            </div>
          </Section>

          {/* DND Experience Settings */}
          <Section title="DND Experience" icon={<FilmStripIcon />} delay={0.32}>
            <p className="mb-10 text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">
              Fine-tune the immersive effects of the "From Serfs and Frauds" archives.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <CustomToggle id="dnd-lightning" label="Lightning Strikes" checked={isLightningEnabled} onChange={toggleLightning} />
              <CustomToggle id="dnd-loot" label="Loot Discovery" checked={isLootDiscoveryEnabled} onChange={toggleLootDiscovery} />
              <CustomToggle id="dnd-fire-overlay" label="Fire Overlay" checked={isFireOverlayEnabled} onChange={toggleFireOverlay} />
              <CustomToggle id="dnd-fire-particles" label="Fire Particles" checked={isFireParticlesEnabled} onChange={toggleFireParticles} />
              <CustomToggle id="dnd-frame" label="Viewport Frame" checked={isViewportFrameEnabled} onChange={toggleViewportFrame} />
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

              <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm flex flex-col justify-between gap-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-1 uppercase tracking-wider">
                    Classic Sidebar Color
                  </h3>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Change the main color of the classic/old style sidebar.
                  </p>
                </div>
                <CustomDropdown
                  variant="brutalist"
                  label="Sidebar Color"
                  options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Salmon Light', value: 'salmon-light' },
                    { label: 'Salmon Medium', value: 'salmon-medium' },
                    { label: 'Blue Transparent', value: 'blue-transparent' },
                    { label: 'Green Transparent', value: 'green-transparent' },
                    {
                      label: 'Purple Transparent',
                      value: 'purple-transparent',
                    },
                    { label: 'Cyan Transparent', value: 'cyan-transparent' },
                  ]}
                  value={sidebarColor}
                  onChange={setSidebarColor}
                  icon={SidebarIcon}
                />
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
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                    Factory Reset
                  </h3>
                  <p className="text-gray-400 font-light max-w-xl">
                    This will clear all your preferences and achievements. This
                    cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleClearStorage}
                  className="w-full md:w-auto px-8 py-4 bg-red-500 text-black hover:bg-red-400 transition-colors font-black uppercase tracking-widest text-sm rounded-sm shadow-[0_0_30px_rgba(239,68,68,0.2)]"
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
