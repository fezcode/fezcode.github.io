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
} from '@phosphor-icons/react';
import useSeo from '../hooks/useSeo';
import { useAchievements } from '../context/AchievementContext';
import { ACHIEVEMENTS } from '../config/achievements';
import colors from '../config/colors';

const AchievementsPage = () => {
  useSeo({
    title: 'Achievements | Fezcodex',
    description: 'Track your progress and unlocked secrets in Fezcodex.',
    keywords: ['Fezcodex', 'achievements', 'gamification', 'trophies'],
    ogTitle: 'Achievements | Fezcodex',
    ogDescription: 'Track your progress and unlocked secrets in Fezcodex.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Achievements | Fezcodex',
    twitterDescription: 'Track your progress and unlocked secrets in Fezcodex.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { unlockedAchievements, showAchievementToast } = useAchievements();
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Extract unique categories for filter pills
  const uniqueCategories = [
    'All', // Add 'All' category to display all achievements
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
      selectedCategories.length === 0 || // If no categories selected, show all
      selectedCategories.includes(achievement.category);
    return matchesCategory;
  });

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          to="/"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Home
        </Link>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl flex items-center justify-center gap-4">
            <Trophy size={48} weight="duotone" className="text-yellow-400" />
            Achievements
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Discover hidden features and explore the depths of Fezcodex.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mr-2 text-gray-500 font-mono text-sm">
              <FunnelIcon size={16} />
              <span>Filter:</span>
            </div>
            {uniqueCategories.map((category) => {
              const isSelected = selectedCategories.includes(category) || (category === 'All' && selectedCategories.length === 0);
              const colorClass = isSelected ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200';
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
                <XCircle size={20} /> Clear
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>
                {unlockedCount} / {totalCount}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden border border-gray-600">
              <div
                className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            {/* Achievement Toast Status */}
            <div
              className={`mt-8 flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 shadow-lg ${
                showAchievementToast
                  ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-100 shadow-emerald-900/10'
                  : 'bg-rose-900/20 border-rose-500/30 text-rose-100 shadow-rose-900/10'
              }`}
            >
              <div
                className={`p-2.5 rounded-full shrink-0 ${
                  showAchievementToast
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {showAchievementToast ? (
                  <Info size={24} weight="duotone" />
                ) : (
                  <BellSlash size={24} weight="duotone" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm tracking-wide">
                  ACHIEVEMENT NOTIFICATIONS ARE{' '}
                  <span className="font-bold">
                    {showAchievementToast ? 'ACTIVE' : 'MUTED'}
                  </span>
                </p>
                <p
                  className={`text-xs mt-1 ${
                    showAchievementToast
                      ? 'text-emerald-400/80'
                      : 'text-rose-400/80'
                  }`}
                >
                  You can toggle these popups in the{' '}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedAchievements[achievement.id]?.unlocked;

            return (
              <div
                key={achievement.id}
                className={`relative overflow-hidden rounded-xl border p-6 transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-amber-900/40 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-gray-900/40 border-gray-800 opacity-70 grayscale'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-lg ${isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-500'}`}
                  >
                    {isUnlocked ? (
                      achievement.icon
                    ) : (
                      <Lock size={32} weight="fill" />
                    )}
                  </div>
                  {isUnlocked && (
                    <span className="text-xs font-mono text-amber-400 bg-amber-900/30 px-2 py-1 rounded border border-amber-800">
                      UNLOCKED
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3
                    className={`text-xl font-bold ${isUnlocked ? 'text-amber-100' : 'text-gray-500'}`}
                  >
                    {achievement.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {achievement.description}
                  </p>
                </div>

                {isUnlocked && (
                  <div className="mt-4 text-xs text-gray-600 font-mono">
                    Unlocked on:{' '}
                    {new Date(
                      unlockedAchievements[achievement.id].unlockedAt,
                    ).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
