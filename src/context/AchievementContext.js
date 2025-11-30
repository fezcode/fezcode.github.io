import React, { createContext, useContext, useEffect, useState } from 'react';
import usePersistentState from '../hooks/usePersistentState';
import { useToast } from '../hooks/useToast';
import { ACHIEVEMENTS } from '../config/achievements';
import {TrophyIcon} from "@phosphor-icons/react";

const AchievementContext = createContext();

export const useAchievements = () => {
  return useContext(AchievementContext);
};

export const AchievementProvider = ({ children }) => {
  // Store achievements as { [id]: { unlocked: boolean, unlockedAt: string } }
  const [unlockedAchievements, setUnlockedAchievements] = usePersistentState(
    'unlocked-achievements',
    {},
  );
  const [readPosts, setReadPosts] = usePersistentState('read-posts', []);
  const { addToast } = useToast();

  // Helper to unlock an achievement
  const unlockAchievement = (id) => {
    // Check if valid achievement ID
    const achievement = ACHIEVEMENTS.find((a) => a.id === id);
    if (!achievement) return;

    // Check if already unlocked
    if (unlockedAchievements[id]?.unlocked) return;

    const now = new Date().toISOString();

    setUnlockedAchievements((prev) => ({
      ...prev,
      [id]: { unlocked: true, unlockedAt: now },
    }));

    // Trigger Toast
    addToast({
      title: 'Achievement Unlocked!',
      message: achievement.title,
      duration: 4000,
      icon: <TrophyIcon weight="duotone"/>,
      type: 'gold'
      // You might want to add a specific type or icon here later for styling
    });
  };

  const trackReadingProgress = (slug) => {
    if (!slug) return;

    setReadPosts((prev) => {
      if (prev.includes(slug)) return prev; // Already read

      const newReadPosts = [...prev, slug];
      const count = newReadPosts.length;

      if (count >= 1) unlockAchievement('novice_reader');
      if (count >= 5) unlockAchievement('avid_reader');
      if (count >= 10) unlockAchievement('bookworm');
      if (count >= 20) unlockAchievement('scholar');
      if (count >= 30) unlockAchievement('milord');

      return newReadPosts;
    });
  };

  // Automatically unlock 'hello_world' on mount if not already
  useEffect(() => {
    unlockAchievement('hello_world');
  }, []);

  return (
    <AchievementContext.Provider
      value={{ unlockedAchievements, unlockAchievement, trackReadingProgress }}
    >
      {children}
    </AchievementContext.Provider>
  );
};
