import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import Seo from '../components/Seo';
import { useAchievements } from '../context/AchievementContext';

const NotFoundPage = () => {
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    const visits = parseInt(localStorage.getItem('wrongs') || '0', 10) + 1;
    localStorage.setItem('wrongs', visits.toString());

    if (visits >= 3) {
      unlockAchievement('glitch_in_the_matrix');
    }
  }, [unlockAchievement]);

  return (
    <div className="text-center mt-20 mb-20">
      <Seo
        title="404 - Page Not Found | Fezcodex"
        description="The page you are looking for does not exist."
        keywords={['Fezcodex', '404', 'not found']}
        ogTitle="404 - Page Not Found | Fezcodex"
        ogDescription="The page you are looking for does not exist."
        ogImage="/images/ogtitle.png"
        twitterCard="summary_large_image"
        twitterTitle="404 - Page Not Found | Fezcodex"
        twitterDescription="The page you are looking for does not exist."
        twitterImage="/images/ogtitle.png"
      />
      <h1 className="text-9xl font-bold text-gray-400">404</h1>
      <p className="text-2xl md:text-3xl font-light mb-8 text-white">
        {' '}
        {/* Added text-white class */}
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg"
      >
        {' '}
        {/* Changed styling and text */}
        <ArrowLeftIcon size={24} /> Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
