import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  LockIcon,
  InfoIcon,
  BellSlashIcon,
  FunnelIcon,
  XCircleIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../config/achievements';
import LuxeArt from '../../components/LuxeArt';

const LuxeAchievementsPage = () => {
  const { unlockedAchievements, showAchievementToast } = useAchievements();
  const [selectedCategories, setSelectedCategories] = useState([]);

  const uniqueCategories = [
    'All',
    ...new Set(ACHIEVEMENTS.map((ach) => ach.category)),
  ].sort();

  const unlockedCount = Object.keys(unlockedAchievements).filter(
    (key) => unlockedAchievements[key].unlocked,
  ).length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  const toggleCategory = (category) => {
    if (category === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category],
      );
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  const filteredAchievements = ACHIEVEMENTS.filter((achievement) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(achievement.category);
    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20 overflow-x-hidden">
      <Seo
        title="Fezcodex | Achievements"
        description="Track your milestones and discoveries."
        keywords={['Fezcodex', 'achievements', 'milestones', 'trophies']}
      />

      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0">
         <LuxeArt seed="Achievements" className="w-full h-full mix-blend-multiply" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

                {/* Header */}

                <header className="mb-20 pt-12 border-b border-[#1A1A1A]/10 pb-12">

                   <Link to="/" className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors">

                       <ArrowLeftIcon /> FZCX Index

                   </Link>

                   <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">

               <div>
                   <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
                       Milestones
                   </h1>
                   <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed italic">
                       A chronological record of significant system interactions and discovered anomalies.
                   </p>
               </div>

               <div className="w-full lg:w-96 space-y-4">
                   <div className="flex justify-between items-end font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40">
                       <span>Total Synchronization</span>
                       <span className="text-xl font-playfairDisplay italic text-[#1A1A1A]">{progressPercentage}%</span>
                   </div>
                   <div className="h-1 w-full bg-[#1A1A1A]/5 rounded-full overflow-hidden">
                       <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className="h-full bg-[#8D4004]"
                       />
                   </div>
                   <div className="flex justify-between font-outfit text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A]/30">
                       <span>{unlockedCount} Unlocked</span>
                       <span>{totalCount} Total</span>
                   </div>
               </div>
           </div>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
            <div className="flex items-center gap-2 text-[#1A1A1A]/30 font-outfit text-[10px] uppercase tracking-widest mr-4">
                <FunnelIcon size={14} /> <span>Filter Archives:</span>
            </div>
            {uniqueCategories.map((category) => {
              const isSelected =
                selectedCategories.includes(category) ||
                (category === 'All' && selectedCategories.length === 0);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-6 py-2 rounded-full font-outfit text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white shadow-lg'
                      : 'bg-white/50 text-[#1A1A1A]/40 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
            <AnimatePresence>
                {selectedCategories.length > 0 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={clearFilters}
                        className="flex items-center gap-2 text-[10px] font-outfit uppercase tracking-widest text-rose-600 hover:text-rose-800 transition-colors ml-4"
                    >
                        <XCircleIcon size={16} /> Reset Filters
                    </motion.button>
                )}
            </AnimatePresence>
        </div>

        {/* Toast Status */}
        <div className="mb-20 flex justify-center">
            <div className={`inline-flex items-center gap-6 px-8 py-4 rounded-full border backdrop-blur-sm transition-all duration-500 ${
                showAchievementToast
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 shadow-sm'
                : 'bg-white/50 border-[#1A1A1A]/5 text-[#1A1A1A]/40'
            }`}>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    showAchievementToast ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-[#1A1A1A]/5'
                }`}>
                    {showAchievementToast ? <InfoIcon size={20} weight="fill" /> : <BellSlashIcon size={20} />}
                </div>
                <div className="flex flex-col">
                    <span className="font-outfit text-[9px] uppercase tracking-[0.3em] opacity-50">Discovery Protocol</span>
                    <span className="font-playfairDisplay text-sm italic font-bold">
                        Notifications {showAchievementToast ? 'Active' : 'Muted'}
                    </span>
                </div>
                <Link to="/settings" className="ml-4 font-outfit text-[9px] uppercase tracking-widest underline underline-offset-4 hover:text-[#8D4004] transition-colors">
                    Adjust Configuration
                </Link>
            </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAchievements.map((achievement) => {
                const unlockedData = unlockedAchievements[achievement.id];
                const isUnlocked = unlockedData?.unlocked;
                const unlockedDate = isUnlocked ? new Date(unlockedData.unlockedAt) : null;

                return (
                    <motion.div
                        layout
                        key={achievement.id}
                        className={`group relative bg-white border rounded-sm p-8 flex flex-col items-center text-center transition-all duration-700 ${
                            isUnlocked
                            ? 'border-[#1A1A1A]/5 hover:shadow-2xl hover:border-[#8D4004]/20'
                            : 'border-transparent opacity-40 grayscale hover:opacity-60'
                        }`}
                    >
                        {/* Status Marker */}
                        <div className="absolute top-4 right-4">
                            {isUnlocked ? (
                                <CheckCircleIcon size={16} weight="fill" className="text-emerald-600" />
                            ) : (
                                <LockIcon size={16} weight="light" className="text-[#1A1A1A]/20" />
                            )}
                        </div>

                        {/* Category Label */}
                        <span className={`mb-8 font-outfit text-[9px] uppercase tracking-[0.3em] ${
                            isUnlocked ? 'text-[#8D4004]' : 'text-[#1A1A1A]/30'
                        }`}>
                            {achievement.category}
                        </span>

                        {/* Icon Container */}
                        <div className="relative mb-8">
                            {isUnlocked && (
                                <div className="absolute inset-0 bg-[#8D4004]/10 blur-3xl rounded-full scale-150 animate-pulse-slow" />
                            )}
                            <div className={`w-24 h-24 flex items-center justify-center rounded-full transition-all duration-700 ${
                                isUnlocked
                                ? 'bg-[#F5F5F0] text-[#1A1A1A] shadow-inner group-hover:scale-110 group-hover:bg-white'
                                : 'bg-transparent text-[#1A1A1A]/10 border border-dashed border-[#1A1A1A]/10'
                            }`}>
                                <div className="scale-[1.8]">
                                    {isUnlocked ? achievement.icon : <LockIcon size={20} weight="light" />}
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <h3 className={`font-playfairDisplay text-2xl mb-3 leading-tight transition-all ${
                            isUnlocked ? 'text-[#1A1A1A] group-hover:italic' : 'text-[#1A1A1A]/20'
                        }`}>
                            {achievement.title}
                        </h3>
                        <p className={`font-outfit text-xs leading-relaxed line-clamp-3 italic ${
                            isUnlocked ? 'text-[#1A1A1A]/60' : 'text-[#1A1A1A]/10'
                        }`}>
                            {achievement.description}
                        </p>

                        {/* Unlocked Date Footer */}
                        {isUnlocked && (
                            <div className="mt-8 pt-6 border-t border-[#1A1A1A]/5 w-full flex items-center justify-center gap-2 text-[9px] font-outfit uppercase tracking-widest text-[#1A1A1A]/30">
                                <CalendarBlankIcon size={12} />
                                <span>Synchronized: {unlockedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>

        {filteredAchievements.length === 0 && (
            <div className="py-32 text-center border border-dashed border-[#1A1A1A]/10 rounded-sm">
                <p className="font-playfairDisplay italic text-2xl text-[#1A1A1A]/20">No matching archives found.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default LuxeAchievementsPage;
