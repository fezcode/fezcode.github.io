import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {
  Monitor,
  CaretRight,
  Palette,
  GameController,
  Eyeglasses,
} from '@phosphor-icons/react';
import {useVisualSettings} from '../context/VisualSettingsContext';
import {useAchievements} from '../context/AchievementContext';
import CustomToggle from '../components/CustomToggle';
import CustomDropdown from '../components/CustomDropdown';
import useSeo from '../hooks/useSeo';

const OptionCard = ({title, icon: Icon, children, colorClass, delay}) => (
  <motion.div
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5, delay}}
    className="bg-gray-800/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-gray-800/60 hover:border-white/10 transition-all duration-300 group flex flex-col justify-between"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20 text-white`}>
        <Icon size={28} weight="duotone"/>
      </div>
      <div className="text-right">
        <h3 className="font-arvo text-lg text-white font-medium">{title}</h3>
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

  const {showAchievementToast, toggleAchievementToast} = useAchievements();

  const handleFinish = () => {
    setIsLaunching(true);
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-[#0a0a0c] text-gray-100 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-900/10 rounded-full blur-[120px] animate-pulse"/>
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse"
          style={{animationDelay: '2s'}}/>
        <div
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            SYSTEM INITIALIZATION
          </motion.div>

          <h1
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 font-arvo mb-4 tracking-tight">
            Hello, Traveler.
          </h1>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            Configure your terminal environment before accessing the mainframe.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">

          {/* 1. Reading Experience */}
          <OptionCard
            title="Reading Mode"
            icon={Eyeglasses}
            colorClass="bg-blue-500"
            delay={0.1}
          >
            <p className="text-sm text-gray-400 mb-4 h-10">
              Select how data logs and articles should be rendered on your display.
            </p>
            <CustomDropdown
              label="Select View"
              options={[
                {label: 'Standard (Clean)', value: 'standard'},
                {label: 'Dossier (Files)', value: 'dossier'},
                {label: 'Terminal (Retro)', value: 'terminal'},
              ]}
              value={blogPostViewMode}
              onChange={setBlogPostViewMode}
              className="w-full"
            />
          </OptionCard>

          {/* 2. Gamification */}
          <OptionCard
            title="Gamification"
            icon={GameController}
            colorClass="bg-rose-500"
            delay={0.2}
          >
            <p className="text-sm text-gray-400 mb-4 h-10">
              Enable achievement tracking and popup notifications during exploration.
            </p>
            <CustomToggle
              id="gamification-toggle"
              label={showAchievementToast ? "Achievements Active" : "Achievements Muted"}
              checked={showAchievementToast}
              onChange={toggleAchievementToast}
              colorTheme="rose"
            />
          </OptionCard>

          {/* 3. Interface Color */}
          <OptionCard
            title="Sidebar Tint"
            icon={Palette}
            colorClass="bg-purple-500"
            delay={0.3}
          >
            <p className="text-sm text-gray-400 mb-4 h-10">
              Customize the accent color of your primary navigation panel.
            </p>
            <CustomDropdown
              label="Select Color"
              options={[
                {label: 'Default (Dark)', value: 'default'},
                {label: 'Salmon', value: 'salmon-medium'},
                {label: 'Cyber Blue', value: 'blue-transparent'},
                {label: 'Matrix Green', value: 'green-transparent'},
                {label: 'Neon Purple', value: 'purple-transparent'},
              ]}
              value={sidebarColor}
              onChange={setSidebarColor}
              className="w-full"
            />
          </OptionCard>

          {/* 4. Visual Processing */}
          <OptionCard
            title="Retro FX"
            icon={Monitor}
            colorClass="bg-emerald-500"
            delay={0.4}
          >
            <p className="text-sm text-gray-400 mb-4 h-10">
              Engage cathode-ray tube emulation for maximum nostalgia.
            </p>
            <CustomToggle
              id="retro-toggle"
              label={isRetro ? "CRT Effects Online" : "CRT Effects Offline"}
              checked={isRetro}
              onChange={toggleRetro}
              colorTheme="green"
            />
          </OptionCard>
        </div>

        {/* Action Area */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.5}}
          className="flex flex-col items-center"
        >
          <button
            onClick={handleFinish}
            className={`
              group relative flex items-center gap-3 px-8 py-4
              bg-white text-black border-2 border-white
              font-mono font-bold text-sm tracking-widest uppercase
              transition-all duration-300
              hover:bg-emerald-500 hover:border-emerald-500 hover:text-black
              hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]
              ${isLaunching ? 'scale-95 opacity-80' : ''}
            `}
          >
            <span className="relative z-10">Launch Fezcodex</span>
            <CaretRight weight="bold" size={20}
                        className="relative z-10 group-hover:translate-x-1 transition-transform"/>
          </button>

          <p className="text-xs text-gray-500 mt-6 font-mono">
            * Additional configurations available in Settings
          </p>

          <button
            onClick={handleFinish}
            className="mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors font-mono uppercase tracking-wider"
          >
            Skip Configuration
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;
