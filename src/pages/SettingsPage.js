import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  Trophy,
  Layout,
  DatabaseIcon,
  FilmStrip,
  Warning,
  Trash,
  ArrowCounterClockwise,
  MagicWand,
  Sidebar,
  AppWindow
} from '@phosphor-icons/react';
import { useAnimation } from '../context/AnimationContext';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { useAchievements } from '../context/AchievementContext';
import CustomToggle from '../components/CustomToggle';
import useSeo from '../hooks/useSeo';
import { useToast } from '../hooks/useToast';
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
    className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden relative group"
  >
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
      {React.cloneElement(icon, { size: 120, weight: "duotone" })}
    </div>

    <div className="flex items-center gap-3 mb-6 relative z-10">
      <div className="p-2 bg-primary-500/20 rounded-lg text-rose-500">
        {React.cloneElement(icon, { size: 24, weight: "duotone" })}
      </div>
      <h2 className="text-2xl font-arvo text-white tracking-wide">{title}</h2>
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

const SettingsPage = () => {
  useSeo({
    title: 'Settings | Fezcodex',
    description: 'Manage your application preferences for Fezcodex.',
    keywords: ['Fezcodex', 'settings', 'preferences', 'animation'],
  });

  const { unlockAchievement, showAchievementToast, toggleAchievementToast } = useAchievements();

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
  } = useVisualSettings();

  const { addToast } = useToast();

  const handleResetSidebarState = () => {
    removeLocalStorageItem(KEY_SIDEBAR_STATE);
    addToast({
      title: 'Success',
      message: 'Sidebar state has been reset. The page will now reload.',
      duration: 3000,
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const handleResetAppsState = () => {
    removeLocalStorageItem(KEY_APPS_COLLAPSED_CATEGORIES);
    addToast({
      title: 'Success',
      message: 'App categories state has been reset. The page will now reload.',
      duration: 3000,
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const handleClearStorage = () => {
    localStorage.clear();
    addToast({
      title: 'Success',
      message: 'All local storage data has been cleared. The page will now reload.',
      duration: 3000,
    });

    setTimeout(() => {
      // Manually set the achievement to avoid restoring old state via context
      const now = new Date().toISOString();
      const cleanSlateData = {
        clean_slate: { unlocked: true, unlockedAt: now }
      };
      // We use the raw key 'unlocked-achievements' as defined in AchievementContext
      localStorage.setItem('unlocked-achievements', JSON.stringify(cleanSlateData));

      addToast({
        title: 'Achievement Unlocked!',
        message: 'Clean Slate',
        duration: 4000,
        icon: <Trophy size={24} weight="duotone" />,
        type: 'gold',
      });
    }, 500);

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-6 text-lg font-medium"
          >
            <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                Settings
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl">
                Customize your experience, manage preferences, and tweak the visual engine.
              </p>
            </div>

            {/* Client-Side Badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-xs font-mono text-gray-400">
               <DatabaseIcon size={14} />
               <span>CLIENT-SIDE STORAGE ONLY</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">

          {/* Animation & Performance */}
          <Section title="Animation & Performance" icon={<FilmStrip />} delay={0.1}>
            <div className="space-y-6">
              <div className="bg-gray-800/30 rounded-xl p-4 border border-white/5">
                <CustomToggle
                  id="enable-animations"
                  label="Enable System Animations"
                  checked={isAnimationEnabled}
                  onChange={toggleAnimation}
                  colorTheme="blue"
                />

                <motion.div
                  animate={{
                    height: isAnimationEnabled ? 'auto' : 0,
                    opacity: isAnimationEnabled ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="my-4 border-t border-white/5"></div>
                  <div className="space-y-4 pl-2">
                    <CustomToggle
                      id="show-animations-homepage"
                      label="Show animations on Homepage"
                      checked={showAnimationsHomepage}
                      onChange={toggleShowAnimationsHomepage}
                      disabled={!isAnimationEnabled}
                      colorTheme="blue"
                    />
                    <CustomToggle
                      id="show-animations-inner-pages"
                      label="Show animations on Inner Pages"
                      checked={showAnimationsInnerPages}
                      onChange={toggleShowAnimationsInnerPages}
                      disabled={!isAnimationEnabled}
                      colorTheme="blue"
                    />
                  </div>
                </motion.div>
              </div>

              {!isAnimationEnabled && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-900/20 border border-red-500/20 text-red-200 text-sm">
                  <Warning size={20} className="shrink-0 mt-0.5" />
                  <p>Detailed animation settings are disabled because the main switch is off.</p>
                </div>
              )}
            </div>
          </Section>

          {/* Achievements */}
          <Section title="Gamification" icon={<Trophy />} delay={0.2}>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-white/5">
              <CustomToggle
                id="enable-achievement-toasts"
                label="Show Achievement Popups"
                checked={showAchievementToast}
                onChange={toggleAchievementToast}
                colorTheme="rose"
              />
              <p className="mt-2 text-sm text-gray-400 ml-1">
                When enabled, you'll receive a toast notification whenever you unlock a new achievement.
              </p>
            </div>
          </Section>

          {/* Visual Effects Grid */}
          <Section title="Visual Effects Engine" icon={<MagicWand />} delay={0.3}>
            <p className="mb-6 text-gray-400 text-sm">
              Apply experimental visual filters to the entire application. Combine them at your own risk!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <CustomToggle id="fx-invert" label="Invert Colors" checked={isInverted} onChange={toggleInvert} colorTheme="purple" />
              <CustomToggle id="fx-retro" label="Retro CRT" checked={isRetro} onChange={toggleRetro} colorTheme="amber" />
              <CustomToggle id="fx-party" label="Party Mode" checked={isParty} onChange={toggleParty} colorTheme="rose" />
              <CustomToggle id="fx-mirror" label="Mirror World" checked={isMirror} onChange={toggleMirror} colorTheme="cyan" />
              <CustomToggle id="fx-noir" label="Film Noir" checked={isNoir} onChange={toggleNoir} colorTheme="indigo" />
              <CustomToggle id="fx-terminal" label="Terminal Green" checked={isTerminal} onChange={toggleTerminal} colorTheme="green" />
              <CustomToggle id="fx-blueprint" label="Blueprint" checked={isBlueprint} onChange={toggleBlueprint} colorTheme="blue" />
              <CustomToggle id="fx-sepia" label="Sepia Tone" checked={isSepia} onChange={toggleSepia} colorTheme="amber" />
              <CustomToggle id="fx-vaporwave" label="Vaporwave" checked={isVaporwave} onChange={toggleVaporwave} colorTheme="cyan" />
              <CustomToggle id="fx-cyberpunk" label="Cyberpunk" checked={isCyberpunk} onChange={toggleCyberpunk} colorTheme="purple" />
              <CustomToggle id="fx-gameboy" label="Game Boy" checked={isGameboy} onChange={toggleGameboy} colorTheme="green" />
              <CustomToggle id="fx-comic" label="Comic Book" checked={isComic} onChange={toggleComic} colorTheme="amber" />
              <CustomToggle id="fx-sketchbook" label="Sketchbook" checked={isSketchbook} onChange={toggleSketchbook} colorTheme="indigo" />
              <CustomToggle id="fx-hellenic" label="Hellenic Statue" checked={isHellenic} onChange={toggleHellenic} colorTheme="blue" />
              <CustomToggle id="fx-glitch" label="System Glitch" checked={isGlitch} onChange={toggleGlitch} colorTheme="rose" />
            </div>
          </Section>

          {/* Interface & Layout */}
          <Section title="Interface & Layout" icon={<Layout />} delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/30 rounded-xl p-6 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-rose-500">
                    <Sidebar size={20} weight="duotone" />
                    <h3 className="font-medium text-white">Sidebar State</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">
                    Reset the expansion state of all sidebar sections to their defaults.
                  </p>
                </div>
                <button
                  onClick={handleResetSidebarState}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors text-sm font-medium"
                >
                  <ArrowCounterClockwise size={18} />
                  Reset Sidebar
                </button>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-rose-500">
                    <AppWindow size={20} weight="duotone" />
                    <h3 className="font-medium text-white">App Categories</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">
                    Reset the collapsed/expanded state of application categories.
                  </p>
                </div>
                <button
                  onClick={handleResetAppsState}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors text-sm font-medium"
                >
                   <ArrowCounterClockwise size={18} />
                  Reset App States
                </button>
              </div>
            </div>
          </Section>

          {/* Data Zone */}
          <Section title="Data Management" icon={<DatabaseIcon />} delay={0.5}>
            <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 rounded-full text-red-400 shrink-0">
                  <Trash size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-2">Clear Local Data</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    This will wipe all locally stored preferences, achievements, and cached states for this site.
                    This action cannot be undone.
                  </p>
                  <button
                    onClick={handleClearStorage}
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 transition-colors text-sm font-medium"
                  >
                    <Trash size={18} />
                    Clear All Local Storage
                  </button>
                </div>
              </div>
            </div>
          </Section>

        </div>

        <div className="mt-12 text-center text-gray-600 text-sm font-mono">
          Fezcodex Preferences Engine v2.0
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
