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
  MagicWandIcon,
  ArticleIcon,
  CheckCircleIcon,
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
import LuxeArt from '../../components/LuxeArt';
import {
  KEY_SIDEBAR_STATE,
  KEY_APPS_COLLAPSED_CATEGORIES,
  remove as removeLocalStorageItem,
} from '../../utils/LocalStorageManager';

const LuxeSection = ({ title, icon, children, delay = 0, id }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="bg-white/60 backdrop-blur-md border border-black/5 rounded-sm p-8 md:p-12 shadow-sm relative group overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 pointer-events-none">
      {React.cloneElement(icon, { size: 200, weight: 'light' })}
    </div>

    <div className="flex items-center gap-6 mb-12 relative z-10">
      <div className="w-12 h-12 flex items-center justify-center bg-[#8D4004]/5 text-[#8D4004] rounded-full">
        {React.cloneElement(icon, { size: 24, weight: 'light' })}
      </div>
      <h2 className="text-4xl font-playfairDisplay italic text-[#1A1A1A]">
        {title}
      </h2>
      <div className="flex-1 h-px bg-black/5 hidden md:block" />
    </div>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const LuxeSettingsPage = () => {
  const location = useLocation();
  const { addToast } = useToast();
  const { unlockAchievement, showAchievementToast, toggleAchievementToast } = useAchievements();
  const { isLightningEnabled, toggleLightning, isLootDiscoveryEnabled, toggleLootDiscovery, isFireOverlayEnabled, toggleFireOverlay, isFireParticlesEnabled, toggleFireParticles, isViewportFrameEnabled, toggleViewportFrame } = React.useContext(DndContext);
  const { sectionOrder, toggleSectionOrder, resetSectionOrder } = useHomepageOrder();

  const {
    reduceMotion,
    toggleReduceMotion,
  } = useAnimation();

  const {
    isInverted, toggleInvert, isRetro, toggleRetro, isParty, toggleParty,
    isMirror, toggleMirror, isNoir, toggleNoir, isTerminal, toggleTerminal,
    isBlueprint, toggleBlueprint, isSepia, toggleSepia, isVaporwave, toggleVaporwave,
    isCyberpunk, toggleCyberpunk, isGameboy, toggleGameboy, isComic, toggleComic,
    isSketchbook, toggleSketchbook, isHellenic, toggleHellenic, isGlitch, toggleGlitch,
    isGarden, toggleGarden, isAutumn, toggleAutumn, isRain, toggleRain,
    isSplashTextEnabled, toggleSplashText, isAppFullscreen, toggleAppFullscreen,
    fezcodexTheme, setFezcodexTheme, blogPostViewMode, setBlogPostViewMode,
    headerFont, setHeaderFont, bodyFont, setBodyFont, availableFonts,
    isFalloutOverlay, toggleFalloutOverlay, falloutVariant, setFalloutVariant,
    isFalloutNoiseEnabled, toggleFalloutNoise, isFalloutScanlinesEnabled, toggleFalloutScanlines,
    isFalloutVignetteEnabled, toggleFalloutVignette,
  } = useVisualSettings();

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

  useEffect(() => {
    unlockAchievement('power_user');
  }, [unlockAchievement]);

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
    addToast({ title: 'Success', message: 'All local data cleared. Restarting...', duration: 3000 });
    setTimeout(() => window.location.reload(), 3000);
  };

  const toggleClasses = {
    labelColorClass: "text-[#1A1A1A]/70",
    hoverColorClass: "group-hover:text-black",
    fontClass: "font-outfit text-sm uppercase tracking-widest"
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20 overflow-x-hidden">
      <Seo title="Fezcodex | Preferences" description="Customize your digital experience." />

      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0">
         <LuxeArt seed="Settings" className="w-full h-full mix-blend-multiply" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">

        <header className="mb-24 pt-12 border-b border-black/10 pb-12">
           <Link to="/" className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-black/40 hover:text-[#8D4004] transition-colors">
               <ArrowLeftIcon /> Fezcodex Index
           </Link>
           <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
               Preferences
           </h1>
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
               <p className="font-outfit text-sm text-black/60 max-w-lg leading-relaxed">
                   Adjust the system parameters to align with your personal aesthetic and performance requirements.
               </p>
               <div className="flex items-center gap-2 font-outfit text-[10px] uppercase tracking-[0.2em] text-black/30 bg-white/50 px-4 py-2 rounded-full border border-black/5">
                   <DatabaseIcon size={14} /> Local Repository Only
               </div>
           </div>
        </header>

        <div className="space-y-12">

          {/* Interface Layout */}
          <LuxeSection title="Interface" icon={<LayoutIcon />} delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="p-6 border-l-2 border-[#8D4004]/20 bg-white/40 space-y-4">
                        <h3 className="font-playfairDisplay text-xl">Core Theme</h3>
                        <p className="font-outfit text-xs text-black/50 leading-relaxed mb-4">Select the primary visual foundation for the system.</p>
                        <CustomDropdown
                          variant="paper"
                          label="Select Theme"
                          options={[
                            { label: 'Brutalist (Dark)', value: 'brutalist' },
                            { label: 'Luxe (Refined)', value: 'luxe' },
                          ]}
                          value={fezcodexTheme}
                          onChange={setFezcodexTheme}
                          icon={LayoutIcon}
                          fullWidth
                        />
                    </div>

                    <div className="p-6 border-l-2 border-black/5 bg-white/20 space-y-4">
                        <h3 className="font-playfairDisplay text-xl">App Display</h3>
                        <CustomToggle
                          id="app-fullscreen"
                          label="Fullscreen Mode"
                          checked={isAppFullscreen}
                          onChange={toggleAppFullscreen}
                          colorTheme="amber"
                          {...toggleClasses}
                        />
                        <p className="mt-4 font-outfit text-sm text-black/40 italic leading-relaxed">
                            Note: Activating this is recommended for the Fezluxe theme, as all internal applications currently utilize the Brutalist design language.
                        </p>
                    </div>
                </div>

                <div className="p-6 border-l-2 border-black/5 bg-white/20 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-playfairDisplay text-xl">Priority</h3>
                        <button
                            onClick={resetSectionOrder}
                            className="font-outfit text-[10px] uppercase tracking-widest text-[#8D4004] hover:underline"
                        >
                            Reset
                        </button>
                    </div>
                    <CustomToggle
                      id="homepage-section-order"
                      label="Blogposts First"
                      checked={sectionOrder[0] === 'blogposts'}
                      onChange={toggleSectionOrder}
                      colorTheme="amber"
                      {...toggleClasses}
                    />
                    <p className="mt-4 font-outfit text-sm text-black/40 italic leading-relaxed">
                        Note: Homepage section prioritization is currently exclusive to the Brutalist (Brufez) theme architecture.
                    </p>
                </div>
            </div>
          </LuxeSection>

          {/* Reader Experience */}
          <LuxeSection title="Reader" icon={<ArticleIcon />} delay={0.15}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="font-outfit text-[10px] uppercase tracking-[0.3em] text-black/30">Visual Mode</h3>
                    <CustomDropdown
                      variant="paper"
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
                      fullWidth
                    />
                </div>
             </div>
          </LuxeSection>

          {/* Typography */}
          <LuxeSection title="Typography" icon={<LayoutIcon />} delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="font-outfit text-[10px] uppercase tracking-[0.3em] text-black/30">Header Font</h3>
                    <CustomDropdown
                      variant="paper"
                      label="Header Font"
                      options={availableFonts.map(f => ({ label: f.name, value: f.id }))}
                      value={headerFont}
                      onChange={setHeaderFont}
                      fullWidth
                    />
                </div>
                <div className="space-y-6">
                    <h3 className="font-outfit text-[10px] uppercase tracking-[0.3em] text-black/30">Body Font</h3>
                    <CustomDropdown
                      variant="paper"
                      label="Body Font"
                      options={availableFonts.map(f => ({ label: f.name, value: f.id }))}
                      value={bodyFont}
                      onChange={setBodyFont}
                      fullWidth
                    />
                </div>
            </div>
            <p className="mt-8 font-outfit text-sm text-black/40 italic leading-relaxed">
                Note: Global font selection is currently exclusive to the Brutalist (Brufez) theme architecture. Fezluxe utilize fixed high-fidelity typography for structural integrity.
            </p>
          </LuxeSection>

          {/* Motion & Performance */}
          <LuxeSection title="Motion" icon={<FilmStripIcon />} delay={0.25}>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 border-l-2 border-black/5 bg-white/20">
                    <div>
                        <h3 className="font-playfairDisplay text-xl mb-1">Reduce Motion</h3>
                        <p className="font-outfit text-xs text-black/50 max-w-md leading-relaxed">
                            Disables all cinematic animations across the application for a faster, more stable experience.
                        </p>
                    </div>
                    <CustomToggle
                      id="reduce-motion"
                      label={reduceMotion ? "Enabled" : "Disabled"}
                      checked={reduceMotion}
                      onChange={toggleReduceMotion}
                      colorTheme="amber"
                      {...toggleClasses}
                    />
                </div>
            </div>
          </LuxeSection>

          {/* Visual Matrix */}
          <LuxeSection title="Visual Matrix" icon={<MagicWandIcon />} delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
              <CustomToggle id="fx-invert"      colorTheme="amber"  label="Invert Colors"     checked={isInverted}        onChange={toggleInvert}            {...toggleClasses} />
              <CustomToggle id="fx-retro"       colorTheme="amber"  label="Retro CRT"         checked={isRetro}           onChange={toggleRetro}             {...toggleClasses} />
              <CustomToggle id="fx-party"       colorTheme="amber"  label="Party Mode"        checked={isParty}           onChange={toggleParty}             {...toggleClasses} />
              <CustomToggle id="fx-mirror"      colorTheme="amber"  label="Mirror World"      checked={isMirror}          onChange={toggleMirror}            {...toggleClasses} />
              <CustomToggle id="fx-noir"        colorTheme="amber"  label="Film Noir"         checked={isNoir}            onChange={toggleNoir}              {...toggleClasses} />
              <CustomToggle id="fx-terminal"    colorTheme="amber"  label="Emerald Term"      checked={isTerminal}        onChange={toggleTerminal}          {...toggleClasses} />
              <CustomToggle id="fx-blueprint"   colorTheme="amber"  label="Blueprint"         checked={isBlueprint}       onChange={toggleBlueprint}         {...toggleClasses} />
              <CustomToggle id="fx-sepia"       colorTheme="amber"  label="Vintage Sepia"     checked={isSepia}           onChange={toggleSepia}             {...toggleClasses} />
              <CustomToggle id="fx-vaporwave"   colorTheme="amber"  label="Vaporwave"         checked={isVaporwave}       onChange={toggleVaporwave}         {...toggleClasses} />
              <CustomToggle id="fx-cyberpunk"   colorTheme="amber"  label="Cyberpunk"         checked={isCyberpunk}       onChange={toggleCyberpunk}         {...toggleClasses} />
              <CustomToggle id="fx-gameboy"     colorTheme="amber"  label="Legacy Handheld"   checked={isGameboy}         onChange={toggleGameboy}           {...toggleClasses} />
              <CustomToggle id="fx-comic"       colorTheme="amber"  label="Comic Array"       checked={isComic}           onChange={toggleComic}             {...toggleClasses} />
              <CustomToggle id="fx-sketchbook"  colorTheme="amber"  label="Graphite Map"      checked={isSketchbook}      onChange={toggleSketchbook}        {...toggleClasses} />
              <CustomToggle id="fx-hellenic"    colorTheme="amber"  label="Classical Agora"   checked={isHellenic}        onChange={toggleHellenic}          {...toggleClasses} />
              <CustomToggle id="fx-glitch"      colorTheme="amber"  label="Data Corruption"   checked={isGlitch}          onChange={toggleGlitch}            {...toggleClasses} />
              <CustomToggle id="fx-garden"      colorTheme="amber"  label="Flora Protocol"    checked={isGarden}          onChange={toggleGarden}            {...toggleClasses} />
              <CustomToggle id="fx-autumn"      colorTheme="amber"  label="Seasonal Decay"    checked={isAutumn}          onChange={toggleAutumn}            {...toggleClasses} />
              <CustomToggle id="fx-rain"        colorTheme="amber"  label="Hydraulic Filter"  checked={isRain}            onChange={toggleRain}              {...toggleClasses} />
              <CustomToggle id="fx-fallout"     colorTheme="amber"  label="Fallout Overlay"   checked={isFalloutOverlay}  onChange={toggleFalloutOverlay}    {...toggleClasses} />
              <CustomToggle id="fx-splash"      colorTheme="amber"  label="Splash Text"       checked={isSplashTextEnabled} onChange={toggleSplashText}      {...toggleClasses} />
            </div>

            {isFalloutOverlay && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 p-6 bg-white/40 border border-black/5 rounded-sm space-y-8 overflow-hidden"
                >
                    <div className="flex items-center gap-6">
                        <span className="font-outfit text-[10px] uppercase tracking-widest text-black/40">Variant</span>
                        <CustomDropdown
                            variant="paper"
                            label="Variant"
                            options={[
                                { label: 'New Vegas (Amber)', value: 'amber' },
                                { label: 'Fallout 3 (Green)', value: 'green' }
                            ]}
                            value={falloutVariant}
                            onChange={setFalloutVariant}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <CustomToggle id="fallout-noise" label="Signal Noise" checked={isFalloutNoiseEnabled} onChange={toggleFalloutNoise} colorTheme="amber" {...toggleClasses} />
                        <CustomToggle id="fallout-scanlines" label="Scanlines" checked={isFalloutScanlinesEnabled} onChange={toggleFalloutScanlines} colorTheme="amber" {...toggleClasses} />
                        <CustomToggle id="fallout-vignette" label="Vignette" checked={isFalloutVignetteEnabled} onChange={toggleFalloutVignette} colorTheme="amber" {...toggleClasses} />
                    </div>
                </motion.div>
            )}
          </LuxeSection>

          {/* DND Experience */}
          <LuxeSection title="D&D Pages Effects" icon={<FilmStripIcon />} delay={0.35}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CustomToggle id="dnd-lightning" label="Lightning" checked={isLightningEnabled} onChange={toggleLightning} colorTheme="amber" {...toggleClasses} />
              <CustomToggle id="dnd-loot" label="Loot Feedback" checked={isLootDiscoveryEnabled} onChange={toggleLootDiscovery} colorTheme="amber" {...toggleClasses} />
              <CustomToggle id="dnd-fire-overlay" label="Fire Overlay" checked={isFireOverlayEnabled} onChange={toggleFireOverlay} colorTheme="amber" {...toggleClasses} />
              <CustomToggle id="dnd-fire-particles" label="Particles" checked={isFireParticlesEnabled} onChange={toggleFireParticles} colorTheme="amber" {...toggleClasses} />
              <CustomToggle id="dnd-frame" label="UI Frame" checked={isViewportFrameEnabled} onChange={toggleViewportFrame} colorTheme="amber" {...toggleClasses} />
            </div>
          </LuxeSection>

          {/* Achievements */}
          <LuxeSection title="Achievements" icon={<TrophyIcon />} delay={0.4}>
             <CustomToggle
                id="enable-achievement-toasts"
                label="Achievement Toasts"
                checked={showAchievementToast}
                onChange={toggleAchievementToast}
                colorTheme="amber"
                {...toggleClasses}
              />
          </LuxeSection>

          {/* Feedback Verification */}
          <LuxeSection title="Verification" icon={<ArticleIcon />} delay={0.45}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Success', type: 'success', color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Error', type: 'error', color: 'text-rose-600 bg-rose-50' },
                { label: 'Gold', type: 'gold', color: 'text-amber-600 bg-amber-50' },
                { label: 'Techno', type: 'techno', color: 'text-cyan-600 bg-cyan-50' },
              ].map(test => (
                  <button
                    key={test.type}
                    onClick={() => addToast({ title: `${test.label} Signature`, message: `Verifying ${test.label} notification protocol.`, type: test.type })}
                    className={`py-4 rounded-sm font-outfit text-[10px] uppercase tracking-widest border border-black/5 hover:border-black/20 transition-all ${test.color}`}
                  >
                    Test {test.label}
                  </button>
              ))}
            </div>
          </LuxeSection>

          {/* Advanced / Maintenance */}
          <LuxeSection title="Maintenance" icon={<DatabaseIcon />} delay={0.5}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <h3 className="font-playfairDisplay text-xl">Sidebar Cache</h3>
                    <button onClick={handleResetSidebarState} className="w-full py-3 font-outfit text-xs uppercase tracking-widest bg-white border border-black/10 hover:bg-[#8D4004] hover:text-white transition-all">
                        Reset Cache
                    </button>
                </div>
                <div className="space-y-4">
                    <h3 className="font-playfairDisplay text-xl">App Registry</h3>
                    <button onClick={handleResetAppsState} className="w-full py-3 font-outfit text-xs uppercase tracking-widest bg-white border border-black/10 hover:bg-[#8D4004] hover:text-white transition-all">
                        Reset States
                    </button>
                </div>
            </div>
          </LuxeSection>

          {/* Factory Reset */}
          <LuxeSection title="Termination" icon={<TrashIcon />} delay={0.55}>
             <div className="p-8 border border-rose-500/20 bg-rose-500/5 rounded-sm flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 flex items-center justify-center bg-rose-500 text-white rounded-full shrink-0">
                    <WarningIcon size={32} weight="bold" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="font-playfairDisplay text-3xl text-rose-900 mb-2">Factory Reset</h3>
                    <p className="font-outfit text-sm text-rose-900/60 leading-relaxed">
                        This operation will purge all local configurations, preferences, and achievements. This action is irreversible.
                    </p>
                </div>
                <button
                  onClick={handleClearStorage}
                  className="px-12 py-4 bg-rose-600 text-white hover:bg-rose-700 font-outfit text-xs uppercase tracking-[0.2em] rounded-full shadow-lg transition-all"
                >
                  Purge Repository
                </button>
             </div>
          </LuxeSection>

        </div>

        <footer className="mt-32 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6 text-black/40 font-outfit text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
              <CheckCircleIcon size={14} className="text-[#8D4004]" />
              <span>System Integrity Verified</span>
          </div>
          <span>Fezcodex Preferences v2.1.0</span>
        </footer>

      </div>
    </div>
  );
};

export default LuxeSettingsPage;
