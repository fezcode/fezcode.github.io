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
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../config/achievements';

const TerracottaAchievementsPage = () => {
  const { unlockedAchievements, showAchievementToast } = useAchievements();
  const [selectedCategories, setSelectedCategories] = useState([]);

  const uniqueCategories = ['All', ...new Set(ACHIEVEMENTS.map((ach) => ach.category))].sort();

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
        prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
      );
    }
  };

  const clearFilters = () => setSelectedCategories([]);

  const filteredAchievements = ACHIEVEMENTS.filter((achievement) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(achievement.category);
    return matchesCategory;
  });

  return (
    <div className="py-16 sm:py-24 bg-[#F3ECE0] min-h-screen">
      <Seo title="Achievements | Fezcodex" description="Track your progress and unlocked secrets." />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          to="/"
          className="group text-[#9E4A2F] hover:text-[#C96442] flex items-center justify-center gap-2 text-lg mb-4 transition-all font-playfairDisplay italic"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Home
        </Link>

        <div className="mx-auto max-w-2xl text-center relative z-10">
          <h1 className="text-4xl font-playfairDisplay italic tracking-tight text-[#1A1613] sm:text-6xl flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#C96442] blur-2xl opacity-20 rounded-full"></div>
              <TrophyIcon
                size={56}
                weight="duotone"
                className="text-[#C96442] relative z-10 drop-shadow-[0_0_15px_rgba(201,100,66,0.4)]"
              />
            </div>
            Achievements
            <TrophyIcon
              size={56}
              weight="duotone"
              className="text-[#C96442] relative z-10 drop-shadow-[0_0_15px_rgba(201,100,66,0.4)]"
            />
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#2E2620]">
            Discover the secrets hidden within Fezcodex.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-2xl mx-auto font-mono">
            <div className="flex items-center gap-2 mr-2 text-[#2E2620]/50 text-sm">
              <FunnelIcon size={16} />
              <span>Filter:</span>
            </div>
            {uniqueCategories.map((category) => {
              const isSelected =
                selectedCategories.includes(category) ||
                (category === 'All' && selectedCategories.length === 0);
              const colorClass = isSelected
                ? 'bg-[#C96442]/15 text-[#9E4A2F] border-[#C96442]/50 shadow-[0_0_10px_rgba(201,100,66,0.15)]'
                : 'bg-[#E8DECE]/60 text-[#2E2620]/60 border-[#1A161320] hover:border-[#1A1613] hover:text-[#1A1613]';
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
                className="ml-2 text-sm text-[#9E4A2F] hover:text-[#C96442] flex items-center gap-1 transition-colors"
              >
                <XCircleIcon size={20} /> Clear
              </button>
            )}
          </div>

          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-[#2E2620] mb-2">
              <span>Progress</span>
              <span>
                {unlockedCount} / {totalCount}
              </span>
            </div>
            <div className="w-full bg-[#E8DECE]/80 rounded-full h-4 overflow-hidden border border-[#1A161320] shadow-inner">
              <div
                className="bg-gradient-to-r from-[#9E4A2F] via-[#C96442] to-[#B88532] h-4 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(201,100,66,0.4)]"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div
              className={`mt-8 flex items-center gap-4 p-4 rounded-sm border backdrop-blur-sm transition-all duration-300 ${
                showAchievementToast
                  ? 'bg-[#C96442]/10 border-[#C96442]/40 text-[#9E4A2F]'
                  : 'bg-[#E8DECE]/40 border-[#1A161320] text-[#2E2620]'
              }`}
            >
              <div
                className={`p-2.5 rounded-full shrink-0 ${
                  showAchievementToast ? 'bg-[#C96442]/20 text-[#C96442]' : 'bg-[#1A161320] text-[#2E2620]/60'
                }`}
              >
                {showAchievementToast ? <InfoIcon size={24} weight="duotone" /> : <BellSlashIcon size={24} weight="duotone" />}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm tracking-wide">
                  NOTIFICATIONS:{' '}
                  <span className="font-bold">{showAchievementToast ? 'ACTIVE' : 'MUTED'}</span>
                </p>
                <p className={`text-xs mt-1 ${showAchievementToast ? 'text-[#9E4A2F]/70' : 'text-[#2E2620]/60'}`}>
                  Manage in{' '}
                  <Link to="/settings" className="underline underline-offset-2 hover:text-[#1A1613] transition-colors">
                    Settings
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedAchievements[achievement.id]?.unlocked;
            const unlockedDate = isUnlocked ? new Date(unlockedAchievements[achievement.id].unlockedAt) : null;

            return (
              <div
                key={achievement.id}
                className={`relative group flex flex-col h-full overflow-hidden rounded-sm border transition-all duration-500 ease-out ${
                  isUnlocked
                    ? 'border-[#C96442]/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(201,100,66,0.35)]'
                    : 'border-[#1A161320] bg-[#E8DECE]/30 grayscale opacity-70 hover:opacity-100 hover:border-[#1A1613]'
                }`}
              >
                <div
                  className={`absolute inset-0 z-0 transition-all duration-500 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-[#C96442]/15 via-[#F3ECE0] to-[#F3ECE0] opacity-100'
                      : 'bg-[#F3ECE0]'
                  }`}
                />

                <div className="relative z-10 flex flex-col items-center text-center p-6 flex-grow">
                  <span
                    className={`mb-6 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${
                      isUnlocked
                        ? 'bg-[#C96442]/10 text-[#9E4A2F] border-[#C96442]/40'
                        : 'bg-[#E8DECE] text-[#2E2620]/50 border-[#1A161320]'
                    }`}
                  >
                    {achievement.category}
                  </span>

                  <div className="relative mb-6 group-hover:scale-105 transition-transform duration-300">
                    {isUnlocked && (
                      <div className="absolute inset-0 bg-[#C96442] blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
                    )}

                    <div
                      className={`relative h-24 w-24 rounded-full flex items-center justify-center border-[3px] shadow-2xl ${
                        isUnlocked
                          ? 'bg-gradient-to-b from-[#F3ECE0] to-[#E8DECE] border-[#C96442]/60 text-[#9E4A2F] ring-4 ring-[#C96442]/10'
                          : 'bg-[#E8DECE]/60 border-[#1A161320] text-[#2E2620]/40'
                      }`}
                    >
                      <div className="scale-[1.4] drop-shadow-lg">
                        {isUnlocked ? achievement.icon : <LockIcon weight="fill" />}
                      </div>
                    </div>
                  </div>

                  <h3
                    className={`text-2xl font-playfairDisplay italic tracking-tight mb-3 ${
                      isUnlocked ? 'text-[#1A1613]' : 'text-[#2E2620]/40'
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isUnlocked ? 'text-[#2E2620]' : 'text-[#2E2620]/40'}`}>
                    {achievement.description}
                  </p>
                </div>

                <div
                  className={`relative z-10 mt-auto p-4 w-full border-t ${
                    isUnlocked ? 'border-[#C96442]/20 bg-[#C96442]/5' : 'border-[#1A161320] bg-[#E8DECE]/20'
                  }`}
                >
                  {isUnlocked ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-[#9E4A2F]/80 font-medium font-mono uppercase tracking-widest">
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
                    <div className="text-center text-xs text-[#2E2620]/40 font-mono uppercase tracking-widest flex items-center justify-center gap-2">
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

export default TerracottaAchievementsPage;
