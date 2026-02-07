import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WarningIcon, ArrowLeftIcon } from '@phosphor-icons/react';
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
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Seo
        title="404 | DATA_NOT_FOUND"
        description="System Error: The requested data segment could not be located."
      />
      {/* Background Noise/Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-2xl w-full border-2 border-white p-8 md:p-12 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-8 text-red-500 animate-pulse">
          <WarningIcon size={32} weight="bold" />
          <span className="text-xl font-bold uppercase tracking-widest">
            System_Error: 404
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
          Data_Not
          <br />
          Found
        </h1>

        <div className="space-y-4 mb-12 text-sm md:text-base text-gray-400">
          <p className="uppercase tracking-wider">
            &gt; Querying database...{' '}
            <span className="text-red-500">FAILED</span>
          </p>
          <p className="uppercase tracking-wider">
            &gt; Locating asset... <span className="text-red-500">NULL</span>
          </p>
          <p className="uppercase tracking-wider">
            &gt; Diagnostic: The requested URL endpoint does not exist in the
            current spacetime coordinate system.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Link
            to="/"
            className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-emerald-400 transition-colors w-full md:w-auto"
          >
            <ArrowLeftIcon
              size={20}
              weight="bold"
              className="group-hover:-translate-x-1 transition-transform"
            />
            Return_To_Base
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
        <span>ERR_CODE: 404_NOT_FOUND</span>
        <span>SYS_STATUS: UNSTABLE</span>
      </div>
    </div>
  );
};

export default NotFoundPage;
