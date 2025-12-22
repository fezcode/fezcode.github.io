import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import usePersistentState from '../hooks/usePersistentState';
import { useToast } from '../hooks/useToast';
import { ACHIEVEMENTS } from '../config/achievements';
import { TrophyIcon } from '@phosphor-icons/react';

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
  const [, setReadPosts] = usePersistentState('read-posts', []);
  const [showAchievementToast, setShowAchievementToast] = usePersistentState(
    'show-achievement-toasts',
    false,
  );
  const { addToast } = useToast();

  const toggleAchievementToast = () => {
    setShowAchievementToast((prev) => !prev);
  };

  // Helper to unlock an achievement
  const unlockAchievement = useCallback(
    (id) => {
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

      if (showAchievementToast) {
        // Trigger Toast
        addToast({
          title: 'Achievement Unlocked!',
          message: achievement.title,
          duration: 4000,
          icon: <TrophyIcon weight="duotone" className="text-amber-400" />,
          type: 'gold',
          links: [
            { label: 'Settings', to: '/settings' },
            { label: 'Trophy Room', to: '/achievements' },
          ],
        });
      }
    },
    [
      unlockedAchievements,
      setUnlockedAchievements,
      showAchievementToast,
      addToast,
    ],
  );

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
  }, [unlockAchievement]);

  return (
    <AchievementContext.Provider
      value={{
        unlockedAchievements,
        unlockAchievement,
        trackReadingProgress,
        showAchievementToast,
        toggleAchievementToast,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};
