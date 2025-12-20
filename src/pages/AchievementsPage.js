import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TrophyIcon,
  LockIcon,
  InfoIcon,
  BellSlashIcon,
  FunnelIcon,
  XCircleIcon,
  CalendarBlankIcon,
} from '@phosphor-icons/react';
import useSeo from '../hooks/useSeo';
import { useAchievements } from '../context/AchievementContext';
import { ACHIEVEMENTS } from '../config/achievements';

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
    // Changed main background to stone-950 for an earthy dark feel
    <div className="py-16 sm:py-24 bg-stone-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Navigation */}
        <Link
          to="/"
          className="group text-emerald-500 hover:text-emerald-400 flex items-center justify-center gap-2 text-lg mb-4 transition-all font-playfairDisplay"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Home
        </Link>

        {/* Title Section */}
        <div className="mx-auto max-w-2xl text-center relative z-10">
          <h1 className="text-4xl font-bold font-playfairDisplay tracking-tight text-stone-100 sm:text-6xl flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative">
              {/* Nature Glow behind Trophy */}
              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full"></div>
              <TrophyIcon
                size={56}
                weight="duotone"
                className="text-emerald-400 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]"
              />
            </div>
            Achievements
            <TrophyIcon
              size={56}
              weight="duotone"
              className="text-emerald-400 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]"
            />
          </h1>
          <p className="mt-6 text-lg leading-8 text-stone-400 font-arvo">
            Discover the wild secrets hidden within Fezcodex.
          </p>

          {/* Filter Pills - Nature Themed */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-2xl mx-auto font-arvo">
            <div className="flex items-center gap-2 mr-2 text-stone-500 font-mono text-sm">
              <FunnelIcon size={16} />
              <span>Filter:</span>
            </div>
            {uniqueCategories.map((category) => {
              const isSelected =
                selectedCategories.includes(category) ||
                (category === 'All' && selectedCategories.length === 0);
              // Stone/Emerald Logic for pills
              const colorClass = isSelected
                ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-stone-900/50 text-stone-500 border-stone-800 hover:border-stone-600 hover:text-stone-300';
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${colorClass}`}
                >
                  {category}
                </button>
              );
            })}

            {selectedCategories.length > 0 && (
              <button
                onClick={clearFilters}
                className="ml-2 text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
              >
                <XCircleIcon size={20} /> Clear
              </button>
            )}
          </div>

          {/* Progress Bar - Nature Themed */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-stone-400 mb-2">
              <span>Nature's Progress</span>
              <span>
                {unlockedCount} / {totalCount}
              </span>
            </div>
            <div className="w-full bg-stone-900 rounded-full h-4 overflow-hidden border border-stone-800 shadow-inner">
              <div
                // Gradient from deep green to bright teal
                className="bg-gradient-to-r from-emerald-700 via-teal-500 to-emerald-400 h-4 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Notification Toast Status - Keeping colors functional but tweaking background */}
            <div
              className={`mt-8 flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 shadow-lg ${
                showAchievementToast
                  ? 'bg-teal-950/30 border-teal-500/30 text-teal-100 shadow-teal-900/10'
                  : 'bg-stone-800/20 border-stone-700/30 text-stone-300 shadow-stone-900/10'
              }`}
            >
              <div
                className={`p-2.5 rounded-full shrink-0 ${
                  showAchievementToast
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'bg-stone-500/20 text-stone-400'
                }`}
              >
                {showAchievementToast ? (
                  <InfoIcon size={24} weight="duotone" />
                ) : (
                  <BellSlashIcon size={24} weight="duotone" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm tracking-wide">
                  NOTIFICATIONS:{' '}
                  <span className="font-bold">
                    {showAchievementToast ? 'ACTIVE' : 'MUTED'}
                  </span>
                </p>
                <p
                  className={`text-xs mt-1 ${showAchievementToast ? 'text-teal-400/70' : 'text-stone-500'}`}
                >
                  Manage in{' '}
                  <Link
                    to="/settings"
                    className="underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Settings
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedAchievements[achievement.id]?.unlocked;
            const unlockedDate = isUnlocked
              ? new Date(unlockedAchievements[achievement.id].unlockedAt)
              : null;

            return (
              <div
                key={achievement.id}
                className={`relative group flex flex-col h-full overflow-hidden rounded-2xl border transition-all duration-500 ease-out ${
                  isUnlocked
                    ? 'border-emerald-500/30 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(16,185,129,0.3)]'
                    : 'border-stone-800 bg-stone-900/50 grayscale opacity-70 hover:opacity-100 hover:border-stone-700'
                }`}
              >
                {/* Card Background */}
                <div
                  className={`absolute inset-0 z-0 transition-all duration-500 ${
                    isUnlocked
                      ? // A deep forest gradient
                        'bg-gradient-to-br from-emerald-950/80 via-stone-950 to-stone-950 opacity-100'
                      : 'bg-stone-950'
                  }`}
                >
                  {/* Unlocked "Magical Spores" overlay pattern */}
                  {isUnlocked && (
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/40 via-transparent to-transparent size-full"></div>
                  )}
                </div>

                <div className="relative z-10 flex flex-col items-center text-center p-6 flex-grow font-sans">
                  {/* Category Pill */}
                  <span
                    className={`mb-6 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${
                      isUnlocked
                        ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/30'
                        : 'bg-stone-800 text-stone-500 border-stone-700'
                    }`}
                  >
                    {achievement.category}
                  </span>

                  {/* Icon Container */}
                  <div className="relative mb-6 group-hover:scale-105 transition-transform duration-300">
                    {/* Magical Glow */}
                    {isUnlocked && (
                      <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
                    )}

                    <div
                      className={`relative h-24 w-24 rounded-full flex items-center justify-center border-[3px] shadow-2xl ${
                        isUnlocked
                          ? // Emerald to Teal gradient for the ring
                            'bg-gradient-to-b from-stone-900 to-emerald-950 border-emerald-500/50 text-emerald-300 shadow-emerald-900/50 ring-4 ring-emerald-500/10'
                          : 'bg-stone-900 border-stone-800 text-stone-600 shadow-black/50'
                      }`}
                    >
                      <div className="scale-[1.4] drop-shadow-lg">
                        {isUnlocked ? (
                          achievement.icon
                        ) : (
                          <LockIcon weight="fill" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <h3
                    className={`text-2xl font-playfairDisplay tracking-tight mb-3 ${
                      isUnlocked
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-100'
                        : 'text-stone-600'
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p
                    className={`text-sm font-arvo leading-relaxed ${isUnlocked ? 'text-stone-300' : 'text-stone-600'}`}
                  >
                    {achievement.description}
                  </p>
                </div>

                {/* Footer / Date */}
                <div
                  className={`relative z-10 mt-auto p-4 w-full border-t ${
                    isUnlocked
                      ? 'border-emerald-500/10 bg-emerald-950/20'
                      : 'border-stone-800/50 bg-stone-900/30'
                  }`}
                >
                  {isUnlocked ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-emerald-400/70 font-medium font-mono uppercase tracking-widest">
                      <CalendarBlankIcon weight="duotone" size={16} />
                      <span>
                        Unlocked:{' '}
                        {unlockedDate.toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center text-xs text-stone-600 font-mono uppercase tracking-widest flex items-center justify-center gap-2">
                      <LockIcon size={14} /> Locked
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
