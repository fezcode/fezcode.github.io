import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  TreeStructure,
  Graph,
  Terminal,
  Article,
  Bug,
} from '@phosphor-icons/react';
import CommandPalette from '../components/CommandPalette';
import { useCommandPalette } from '../context/CommandPaletteContext';
import NeuromancerHUD from './about-views/NeuromancerHUD';
import SystemArchitecture from './about-views/SystemArchitecture';
import MindMapConstellation from './about-views/MindMapConstellation';
import ClassifiedDossier from './about-views/ClassifiedDossier';
import Brutalist from './about-views/Brutalist';
import { useAchievements } from '../context/AchievementContext';
import useSeo from "../hooks/useSeo";

const ViewSwitcher = ({ currentView, setView }) => {
  const views = [
    { id: 'dossier', icon: Article, label: 'Dossier' },
    { id: 'hud', icon: Terminal, label: 'Terminal' },
    { id: 'blueprint', icon: TreeStructure, label: 'Blueprint' },
    { id: 'map', icon: Graph, label: 'Mind Map' },
    { id: 'brutalist', icon: Bug, label: 'Brutalist' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-2xl flex gap-2">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => setView(view.id)}
          className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
            currentView === view.id
              ? 'bg-white text-black font-bold shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <view.icon size={20} />
          <span className="text-sm hidden md:inline">{view.label}</span>
          {currentView === view.id && (
            <motion.div
              layoutId="view-pill"
              className="absolute inset-0 bg-white rounded-full mix-blend-difference -z-10"
            />
          )}
        </button>
      ))}
    </div>
  );
};

const AboutPage = () => {
  const [view, setView] = useState('dossier');
  const { unlockAchievement } = useAchievements();
  const { isPaletteOpen, setIsPaletteOpen } = useCommandPalette();

  useSeo({
    title: 'Fezcodex | About',
    description: 'Learn more about the creator of Fezcodex.',
    keywords: ['Fezcodex', 'blog', 'portfolio', 'developer', 'software engineer', 'about'],
  });

  useEffect(() => {
    unlockAchievement('curious_soul');
    // Hide overflow on body when this component is mounted
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [unlockAchievement]);

  const getButtonStyle = (currentView) => {
    switch (currentView) {
      case 'dossier':
        return 'bg-white text-black border-black border-2 font-mono uppercase tracking-widest text-xs hover:bg-[#4a0404] hover:text-white hover:border-[#4a0404] rounded-none shadow-none';
      case 'brutalist':
        return 'bg-black text-white border-white border-2 font-mono uppercase tracking-widest text-xs hover:bg-white hover:text-black rounded-none';
      case 'hud':
        return 'bg-black text-green-500 border-green-500 border font-mono tracking-wider hover:bg-green-500 hover:text-black shadow-[0_0_10px_rgba(0,255,0,0.3)] rounded-sm';
      case 'blueprint':
        return 'bg-[#002b5c]/90 text-cyan-300 border-cyan-400 border-2 font-mono uppercase text-xs tracking-wider hover:bg-cyan-400 hover:text-[#001e40] rounded-none';
      case 'map':
        return 'bg-gray-900/60 text-purple-200 border-purple-500/50 border hover:bg-purple-600 hover:text-white hover:border-purple-600 rounded-full shadow-lg backdrop-blur-xl';
      default:
        return 'bg-black/50 text-white border-white/10 hover:bg-white hover:text-black rounded-full font-bold';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      {/* Global Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          to="/"
          className={`group flex items-center gap-2 px-4 py-2 transition-all duration-300 ${getButtonStyle(view)}`}
        >
          <ArrowLeft weight="bold" className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to Reality</span>
        </Link>
      </motion.div>

      {/* View Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full overflow-y-auto"
        >
          {view === 'hud' && <NeuromancerHUD />}
          {view === 'blueprint' && <SystemArchitecture />}
          {view === 'map' && <MindMapConstellation />}
          {view === 'dossier' && <ClassifiedDossier />}
          {view === 'brutalist' && <Brutalist />}
        </motion.div>
      </AnimatePresence>

      {/* Switcher Controls */}
      <ViewSwitcher currentView={view} setView={setView} />
      <CommandPalette isOpen={isPaletteOpen} setIsOpen={setIsPaletteOpen} />
    </div>
  );
};

export default AboutPage;
