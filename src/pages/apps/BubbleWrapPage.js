import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CirclesFourIcon,
  ArrowsClockwiseIcon,
  InfoIcon,
  ShieldCheckIcon,
  TrophyIcon
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import { useAchievements } from '../../context/AchievementContext';
import GenerativeArt from '../../components/GenerativeArt';

const BUBBLE_COUNT = 100;

const BubbleWrapPage = () => {
  useSeo({
    title: 'Bubble Wrap | Fezcodex',
    description: 'Pop some virtual bubble wrap to relieve stress.',
    keywords: ['Fezcodex', 'bubble wrap', 'stress relief', 'pop', 'game'],
    ogTitle: 'Bubble Wrap | Fezcodex',
    ogDescription: 'Pop some virtual bubble wrap to relieve stress.',
    ogImage: '/images/asset/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Bubble Wrap | Fezcodex',
    twitterDescription: 'Pop some virtual bubble wrap to relieve stress.',
    twitterImage: '/images/asset/ogtitle.png',
  });

  const { unlockAchievement } = useAchievements();
  const [bubbles, setBubbles] = useState(Array(BUBBLE_COUNT).fill(false));
  const [popCount, setPopCount] = useState(0);
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
  }, []);

  useEffect(() => {
    if (popCount === BUBBLE_COUNT) {
      unlockAchievement('entropy_increaser');
    }
  }, [popCount, unlockAchievement]);

  const playPopSound = () => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.value = 100 + Math.random() * 200;

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    oscillator.start(now);
    oscillator.stop(now + 0.08);
  };

  const popBubble = (index) => {
    if (bubbles[index]) return;

    const newBubbles = [...bubbles];
    newBubbles[index] = true;
    setBubbles(newBubbles);
    setPopCount((prev) => prev + 1);
    playPopSound();
  };

  const resetBubbles = () => {
    setBubbles(Array(BUBBLE_COUNT).fill(false));
    setPopCount(0);
  };

  const progress = Math.round((popCount / BUBBLE_COUNT) * 100);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle
                title="Bubble Wrap"
                slug="pop"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Digital stress relief. Pop virtual cells to satisfy your tactile cravings.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Controls & Configuration */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <CirclesFourIcon weight="fill" />
                Status
              </h3>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Completion</label>
                    <span className="text-xl font-black text-emerald-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1 rounded-sm overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="flex justify-between items-end">
                      <label className="font-mono text-[10px] text-gray-500 uppercase">Popped Cells</label>
                      <span className="text-xl font-black text-white">{popCount} <span className="text-gray-600 text-sm">/ {BUBBLE_COUNT}</span></span>
                    </div>
                </div>

                <button
                    onClick={resetBubbles}
                    className="w-full py-3 border border-white/10 hover:border-white text-gray-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <ArrowsClockwiseIcon size={16} weight="bold" />
                    Reset Sheet
                  </button>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <InfoIcon size={24} className="text-gray-700 shrink-0" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Popping all cells triggers a completion event. Use this tool to reduce anxiety or procrastinate effectively.
              </p>
            </div>
          </div>

          {/* Game Area */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group min-h-[600px] flex items-center justify-center">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed="bubblewrap" className="w-full h-full" />
              </div>

              <div className="relative z-10 w-full max-w-2xl">
                <div className="grid grid-cols-10 gap-2 sm:gap-3 md:gap-4 justify-items-center">
                    {bubbles.map((isPopped, index) => (
                    <button
                        key={index}
                        onClick={() => popBubble(index)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 relative overflow-hidden focus:outline-none group/bubble
                        ${
                            isPopped
                            ? 'bg-transparent border-gray-800 scale-90'
                            : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500 hover:scale-105 cursor-pointer'
                        }`}
                    >
                       {!isPopped && (
                           <>
                             <div className="absolute inset-0 opacity-0 group-hover/bubble:opacity-100 transition-opacity bg-emerald-400/10" />
                             <div className="absolute top-1.5 left-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full opacity-20 blur-[0.5px] pointer-events-none" />
                           </>
                       )}
                       {isPopped && (
                           <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-1 h-1 bg-gray-800 rounded-full" />
                           </div>
                       )}
                    </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <ShieldCheckIcon size={32} className="text-emerald-500/50" />
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Audio Engine: Active</span>
              </div>
               {popCount === BUBBLE_COUNT && (
                 <div className="flex items-center gap-2 text-emerald-500 animate-pulse">
                    <TrophyIcon weight="fill" />
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Sheet Cleared</span>
                 </div>
               )}
            </div>
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Bubble_Wrap_v1.0.0</span>
          <span className="text-gray-800">SIMULATION // ACTIVE</span>
        </footer>
      </div>
    </div>
  );
};

export default BubbleWrapPage;
