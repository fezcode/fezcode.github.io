import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Monitor,
  CaretRight,
  Palette,
  GameController,
  Eyeglasses,
  Target,
  Cpu,
} from '@phosphor-icons/react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { useAchievements } from '../context/AchievementContext';
import CustomToggle from '../components/CustomToggle';
import CustomDropdown from '../components/CustomDropdown';
import useSeo from '../hooks/useSeo';
import GenerativeArt from '../components/GenerativeArt';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const OptionCard = ({ title, icon: Icon, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white/[0.02] border border-white/10 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 border border-white/10 text-emerald-500">
          <Icon size={20} weight="bold" />
        </div>
        <h3 className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">{title}</h3>
      </div>
    </div>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const WelcomePage = () => {
  useSeo({
    title: 'Initialize | Fezcodex',
    description: 'Setup your Fezcodex experience.',
  });

  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);

  const {
    blogPostViewMode,
    setBlogPostViewMode,
    sidebarColor,
    setSidebarColor,
    isRetro,
    toggleRetro,
  } = useVisualSettings();

  const { showAchievementToast, toggleAchievementToast } = useAchievements();

  const handleFinish = () => {
    setIsLaunching(true);
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay" style={{ backgroundImage: NOISE_BG }} />

      {/* Hero Section */}
      <div className="relative h-[45vh] w-full overflow-hidden border-b border-white/10">
        <GenerativeArt seed="Welcome Initialisation" className="w-full h-full opacity-40 filter brightness-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />

                <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-2 py-1.5 rounded-full bg-emerald-500/5 backdrop-blur-sm flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           Initial Setup
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none max-w-5xl">
                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Traveler.</span>
                    </h1>
                    <p className="mt-6 text-gray-400 font-mono text-sm max-w-xl uppercase tracking-widest">
                       Personalize your experience before exploring the garden.
                    </p>
                </div>
              </div>

              <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24">

                  {/* Configuration Grid */}
                  <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 1. Reading Experience */}
                      <OptionCard
                        title="Reading Mode"
                        icon={Eyeglasses}
                        delay={0.1}
                      >
                        <p className="text-xs font-mono text-gray-500 mb-6 h-8 uppercase leading-relaxed">
                          Choose how blog posts and logs are displayed.
                        </p>
                        <CustomDropdown
                          label="Select Mode"
                          variant="brutalist"
                          options={[
                            { label: 'Standard', value: 'standard' },
                            { label: 'Dossier', value: 'dossier' },
                            { label: 'Terminal', value: 'terminal' },
                          ]}
                          value={blogPostViewMode}
                          onChange={setBlogPostViewMode}
                          className="w-full"
                        />
                      </OptionCard>

                      {/* 2. Gamification */}
                      <OptionCard
                        title="Achievements"
                        icon={GameController}
                        delay={0.2}
                      >
                        <p className="text-xs font-mono text-gray-500 mb-6 h-8 uppercase leading-relaxed">
                          Enable milestone tracking and notifications.
                        </p>
                        <CustomToggle
                          id="gamification-toggle"
                          label={
                            showAchievementToast
                              ? 'Enabled'
                              : 'Muted'
                          }
                          checked={showAchievementToast}
                          onChange={toggleAchievementToast}
                          colorTheme="green"
                        />
                      </OptionCard>

                      {/* 3. Interface Color */}
                      <OptionCard
                        title="Classic Sidebar Color"
                        icon={Palette}
                        delay={0.3}
                      >
                        <p className="text-xs font-mono text-gray-500 mb-6 h-8 uppercase leading-relaxed">
                          Pick a color for the side navigation panel.
                        </p>
                        <CustomDropdown
                          label="Select Color"
                          variant="brutalist"
                          options={[
                            { label: 'Dark', value: 'default' },
                            { label: 'Salmon', value: 'salmon-medium' },
                            { label: 'Cyber Blue', value: 'blue-transparent' },
                            { label: 'Matrix Green', value: 'green-transparent' },
                            { label: 'Neon Purple', value: 'purple-transparent' },
                          ]}
                          value={sidebarColor}
                          onChange={setSidebarColor}
                          className="w-full"
                        />
                      </OptionCard>

                      {/* 4. Visual Processing */}
                      <OptionCard
                        title="Retro Effects"
                        icon={Monitor}
                        delay={0.4}
                      >
                        <p className="text-xs font-mono text-gray-500 mb-6 h-8 uppercase leading-relaxed">
                          Enable classic CRT scanlines and flicker.
                        </p>
                        <CustomToggle
                          id="retro-toggle"
                          label={isRetro ? 'Active' : 'Offline'}
                          checked={isRetro}
                          onChange={toggleRetro}
                          colorTheme="green"
                        />
                      </OptionCard>
                    </div>
                  </div>

                  {/* Action Area */}
                  <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
                       <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                          <Target weight="fill" className="text-emerald-500" />
                          Ready to Start
                       </h3>

                       <button
                        onClick={handleFinish}
                        className={`
                          group relative flex items-center justify-center gap-4 w-full py-6
                          bg-white text-black font-mono font-black text-sm tracking-[0.3em] uppercase
                          transition-all duration-300 rounded-sm
                          hover:bg-emerald-500 hover:text-black
                          ${isLaunching ? 'scale-95 opacity-80' : ''}
                        `}
                      >
                        <span>Enter Garden</span>
                        <CaretRight weight="bold" size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                         <div className="flex items-center gap-3 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                            <Cpu size={14} />
                            <span>Status: Verified</span>
                         </div>
                         <p className="text-[9px] text-gray-700 font-mono uppercase leading-relaxed tracking-wider">
                            * You can change these settings anytime in the Settings menu.
                         </p>
                      </div>
                    </div>

                    <button
                      onClick={handleFinish}
                      className="w-full py-3 border border-white/5 text-gray-600 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest rounded-sm"
                    >
                      Skip Setup
                    </button>
                  </div>        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
