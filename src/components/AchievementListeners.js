import {useEffect, useState} from 'react';
import {useAchievements} from '../context/AchievementContext';

const AchievementListeners = () => {
  const {unlockAchievement} = useAchievements();
  const [konamiIndex, setKonamiIndex] = useState(0);

  const [cheaterIndex, setCheaterIndex] = useState(0);
  // Night Owl Check

  useEffect(() => {
    const checkNightOwl = () => {
      const now = new Date();
      const hour = now.getHours();
      // Between 3 AM (03:00) and 5 AM (05:00)
      if (hour >= 3 && hour < 5) {
        unlockAchievement('night_owl');
      }
    };

    checkNightOwl();
  }, [unlockAchievement]);
  // Konami Code Listener
  useEffect(() => {
    // Konami Code Sequence: Up, Up, Down, Down, Left, Right, Left, Right, B, A
    const konamiCode = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];

    const handleKeyDown = (e) => {
      // Check if the key matches the current step in the sequence
      if (e.key === konamiCode[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        // If the sequence is complete
        if (nextIndex === konamiCode.length) {
          unlockAchievement('konami_code');
          setKonamiIndex(0); // Reset
        } else {
          setKonamiIndex(nextIndex); // Advance
        }
      } else {
        setKonamiIndex(0); // Mistake, reset
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, unlockAchievement]);

  // Cheater Code Listener

  useEffect(() => {
    const cheaterCode = ['c', 'h', 'e', 'a', 't', 'e', 'r'];
    const handleKeyDown = (e) => {
      // Check if the key matches the current step in the sequence (case insensitive)
      if (e.key.toLowerCase() === cheaterCode[cheaterIndex]) {
        const nextIndex = cheaterIndex + 1;
        // If the sequence is complete
        if (nextIndex === cheaterCode.length) {
          unlockAchievement('cheater');
          setCheaterIndex(0); // Reset
        } else {
          setCheaterIndex(nextIndex); // Advance
        }
      } else {
        setCheaterIndex(0); // Mistake, reset
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cheaterIndex, unlockAchievement]);

  return null; // This component renders nothing
};
export default AchievementListeners;
