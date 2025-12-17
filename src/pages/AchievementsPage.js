import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  Trophy,
  Lock,
  Info,
  BellSlash,
  FunnelIcon,
  XCircle,
  CalendarBlank,
} from '@phosphor-icons/react';
import useSeo from '../hooks/useSeo';
import { useAchievements } from '../context/AchievementContext';
import { ACHIEVEMENTS } from '../config/achievements';
// import colors from '../config/colors'; // Unused in this snippet, but kept if you need it elsewhere

const AchievementsPage = () => {
  useSeo({
    title: 'Achievements | Fezcodex',
    description: 'Track your progress and unlocked secrets in Fezcodex.',
    keywords: ['Fezcodex', 'achievements', 'gamification', 'trophies'],
    ogTitle: 'Achievements | Fezcodex',
    ogDescription: 'Track your progress and unlocked secrets in Fezcodex.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Achievements | Fezcodex',
    twitterDescription: 'Track your progress and unlocked secrets in Fezcodex.',
    twitterImage: '/images/ogtitle.png',
  });

  const { unlockedAchievements, showAchievementToast } = useAchievements();
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Extract unique categories for filter pills
  const uniqueCategories = [
    'All',
    ...new Set(ACHIEVEMENTS.map((ach) => ach.category)),
  ].sort();

  // Calculate progress
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
    <div className="py-16 sm:py-24 bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section - Kept mostly the same for consistency */}
        <Link
          to="/"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4 transition-all"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Home
        </Link>
        <div className="mx-auto max-w-2xl text-center relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 rounded-full"></div>
              <Trophy size={56} weight="duotone" className="text-yellow-400 relative z-10 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            </div>
            Achievements
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Discover hidden features and explore the depths of Fezcodex.
          </p>

          {/* Filters & Progress section (Kept identical to your code) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mr-2 text-gray-500 font-mono text-sm">
              <FunnelIcon size={16} />
              <span>Filter:</span>
            </div>
            {uniqueCategories.map((category) => {
              const isSelected = selectedCategories.includes(category) || (category === 'All' && selectedCategories.length === 0);
              const colorClass = isSelected ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200';
              return (
                <button key={category} onClick={() => toggleCategory(category)} className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${colorClass}`}>
                  {category}
                </button>
              );
            })}
            {selectedCategories.length > 0 && (
              <button onClick={clearFilters} className="ml-2 text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                <XCircle size={20} /> Clear
              </button>
            )}
          </div>

          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{unlockedCount} / {totalCount}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700 shadow-inner">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-300 h-4 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            {/* Achievement Toast Status (Kept identical) */}
            <div className={`mt-8 flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 shadow-lg ${showAchievementToast ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-100 shadow-emerald-900/10' : 'bg-rose-900/20 border-rose-500/30 text-rose-100 shadow-rose-900/10'}`}>
              <div className={`p-2.5 rounded-full shrink-0 ${showAchievementToast ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {showAchievementToast ? (<Info size={24} weight="duotone" />) : (<BellSlash size={24} weight="duotone" />)}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm tracking-wide">ACHIEVEMENT NOTIFICATIONS ARE <span className="font-bold">{showAchievementToast ? 'ACTIVE' : 'MUTED'}</span></p>
                <p className={`text-xs mt-1 ${showAchievementToast ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>You can toggle these popups in the <Link to="/settings" className="underline underline-offset-2 hover:text-white transition-colors">Settings</Link>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* NEW CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedAchievements[achievement.id]?.unlocked;
            const unlockedDate = isUnlocked ? new Date(unlockedAchievements[achievement.id].unlockedAt) : null;

            return (
              <div
                key={achievement.id}
                // Container defining shape, height, and base hover movement
                className={`relative group flex flex-col h-full overflow-hidden rounded-2xl border transition-all duration-500 ease-out ${
                  isUnlocked
                    ? 'border-yellow-600/40 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(234,179,8,0.5)]'
                    : 'border-gray-800 bg-gray-900/50 grayscale opacity-70 hover:opacity-100 hover:border-gray-700'
                }`}
              >
                {/* Dynamic Background Layer */}
                <div
                  className={`absolute inset-0 z-0 transition-all duration-500 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-900/30 via-gray-950 to-black opacity-100 group-hover:opacity-100'
                      // Subtle radial glow that follows mouse could go here, but keeping it simple for now
                      : 'bg-gray-950'
                  }`}
                >
                  {/* Subtle decorative pattern for unlocked cards */}
                  {isUnlocked && (
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500 via-transparent to-transparent size-full"></div>
                  )}
                </div>

                {/* Card Content - Flex Column for vertical centering */}
                <div className="relative z-10 flex flex-col items-center text-center p-6 flex-grow font-sans">

                  {/* Category Banner */}
                  <span className={`mb-6 px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full border ${
                    isUnlocked ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}>
                    {achievement.category}
                  </span>

                  {/* Main Icon Container */}
                  <div className="relative mb-6 group-hover:scale-105 transition-transform duration-300">
                    {/* Glowing Ring background for unlocked */}
                    {isUnlocked && <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-30 rounded-full animate-pulse-slow"></div>}

                    <div
                      className={`relative h-24 w-24 rounded-full flex items-center justify-center border-[3px] shadow-2xl ${
                        isUnlocked
                          ? 'bg-gradient-to-b from-yellow-800 to-yellow-950 border-yellow-400 text-yellow-300 shadow-yellow-900/50 ring-4 ring-yellow-500/20'
                          : 'bg-gray-800 border-gray-700 text-gray-500 shadow-black/50'
                      }`}
                    >
                      <div className="scale-[1.4]">
                        {isUnlocked ? achievement.icon : <Lock weight="fill" />}
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`text-xl font-playfairDisplay tracking-tight mb-3 ${
                      isUnlocked ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-gray-400'
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p className={`text-sm font-arvo leading-relaxed ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                </div>

                {/* Footer Section (Date or Locked Status) */}
                <div className={`relative z-10 mt-auto p-4 w-full border-t ${
                  isUnlocked ? 'border-yellow-900/30 bg-yellow-950/30' : 'border-gray-800/50 bg-gray-900/30'
                }`}>
                  {isUnlocked ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-yellow-500/80 font-medium font-mono uppercase tracking-widest">
                      <CalendarBlank weight="duotone" size={16} />
                      <span>Unlocked: {unlockedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  ) : (
                    <div className="text-center text-xs text-gray-600 font-mono uppercase tracking-widest flex items-center justify-center gap-2">
                      <Lock size={14} /> Locked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
