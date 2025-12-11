import React, { useEffect } from 'react';
import { useAchievements } from '../context/AchievementContext';

const SitemapPage = () => {
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    unlockAchievement('the_cartographer');
    window.location.href = '/sitemap.xml';
  }, [unlockAchievement]);

  return (
    <div className="p-10 text-center text-white text-xl">
      <h1>Redirecting to Sitemap...</h1>
    </div>
  );
};

export default SitemapPage;
