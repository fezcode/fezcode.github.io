import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Desktop,
  Graph,
  Terminal,
  Article,
} from '@phosphor-icons/react';
import NeuromancerHUD from './about-views/NeuromancerHUD';
import InteractiveDesk from './about-views/InteractiveDesk';
import MindMapConstellation from './about-views/MindMapConstellation';
import SimpleText from './about-views/SimpleText';
import { useAchievements } from '../context/AchievementContext';

const ViewSwitcher = ({ currentView, setView }) => {
  const views = [
    { id: 'simple', icon: Article, label: 'Simple' },
    { id: 'hud', icon: Terminal, label: 'Terminal' },
    { id: 'desk', icon: Desktop, label: 'Desk' },
    { id: 'map', icon: Graph, label: 'Mind Map' },
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
  const [view, setView] = useState('simple');
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    unlockAchievement('curious_soul');
    // Hide overflow on body when this component is mounted
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [unlockAchievement]);

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
          className={`group flex items-center gap-2 px-4 py-2 backdrop-blur-md border transition-all ${
            view === 'simple'
              ? 'bg-transparent text-black border-black border-2 font-mono uppercase tracking-widest text-xs hover:bg-[#4a0404] hover:text-white hover:border-[#4a0404] rounded-none'
              : 'bg-black/50 text-white border-white/10 hover:bg-white hover:text-black rounded-full font-bold'
          }`}
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
          className="w-full h-full"
        >
          {view === 'hud' && <NeuromancerHUD />}
          {view === 'desk' && <InteractiveDesk />}
          {view === 'map' && <MindMapConstellation />}
          {view === 'simple' && <SimpleText />}
        </motion.div>
      </AnimatePresence>

      {/* Switcher Controls */}
      <ViewSwitcher currentView={view} setView={setView} />
    </div>
  );
};

export default AboutPage;