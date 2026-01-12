import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  MetronomeIcon,
  ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const BpmGuesserPage = () => {
  const appName = 'BPM Guesser';

  const [bpm, setBpm] = useState(0);
  const [taps, setTaps] = useState([]);
  const lastTapTime = useRef(0);
  const { unlockAchievement } = useAchievements();

  const prevBpmRef = useRef(0);
  const streakRef = useRef(0);

  useEffect(() => {
    if (bpm === 90) {
      unlockAchievement('on_the_beat');
    }
  }, [bpm, unlockAchievement]);

  const handleTap = () => {
    const now = performance.now();

    if (lastTapTime.current === 0) {
      lastTapTime.current = now;
      setTaps([]);
      setBpm(0);
      streakRef.current = 0;
      prevBpmRef.current = 0;
      return;
    }

    const diff = now - lastTapTime.current;
    lastTapTime.current = now;

    if (diff > 2000) {
      setTaps([]);
      setBpm(0);
      streakRef.current = 0;
      prevBpmRef.current = 0;
      return;
    }

    const newTaps = [...taps, diff];
    if (newTaps.length > 8) {
      newTaps.shift();
    }
    setTaps(newTaps);

    const averageDiff = newTaps.reduce((a, b) => a + b, 0) / newTaps.length;
    const calculatedBpm = Math.round(60000 / averageDiff);

    if (newTaps.length > 3) {
      if (calculatedBpm === prevBpmRef.current) {
        streakRef.current += 1;
        if (streakRef.current >= 15) {
          unlockAchievement('human_metronome');
        }
      } else {
        streakRef.current = 0;
      }
    }
    prevBpmRef.current = calculatedBpm;
    setBpm(calculatedBpm);
  };

  const reset = () => {
    setTaps([]);
    setBpm(0);
    lastTapTime.current = 0;
    streakRef.current = 0;
    prevBpmRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="BPM Guesser | Fezcodex"
        description="Find the tempo of any song by tapping along to the beat."
        keywords={[
          'Fezcodex',
          'BPM counter',
          'tap tempo',
          'music tools',
          'metronome',
        ]}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-24">
          <Link
            to="/apps"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon
              weight="bold"
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="BPM Guesser" slug="bpm" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Protocol for temporal extraction. Align your input with the
                rhythmic sequence to determine the frequency.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Interaction Area */}
          <div className="lg:col-span-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-12 md:p-24 rounded-sm overflow-hidden group flex flex-col items-center justify-center">
              {/* Generative Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale group-hover:opacity-[0.05] transition-opacity duration-700">
                <GenerativeArt seed={appName + bpm} className="w-full h-full" />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-12">
                <div className="text-center space-y-2">
                  <div className="text-8xl md:text-[12rem] font-black tracking-tighter text-emerald-500 leading-none">
                    {bpm > 0 ? bpm : '00'}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-gray-500">
                    Beats_Per_Minute
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onMouseDown={handleTap}
                  className="w-64 h-64 border-8 border-white bg-white text-black font-black text-4xl uppercase tracking-[0.2em] hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-75 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                >
                  TAP
                </motion.button>
              </div>
            </div>
          </div>

          {/* Controls & Metrics */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <MetronomeIcon weight="fill" />
                Session_Parameters
              </h3>

              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                    Sample_Count
                  </span>
                  <span className="text-xl font-black">{taps.length}</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                    Stability_Streak
                  </span>
                  <span className="text-xl font-black">
                    {streakRef.current}
                  </span>
                </div>
              </div>

              <button
                onClick={reset}
                className="mt-12 w-full py-4 border border-white/10 hover:bg-white hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <ArrowCounterClockwiseIcon weight="bold" size={16} />
                Reset Engine
              </button>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Data extraction improves with consistency. Maintain a stable
                input sequence for higher precision mapping.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Temporal_Module_v0.6.1</span>
          <span className="text-gray-800">SYNC_STATUS // STABLE</span>
        </footer>
      </div>
    </div>
  );
};

export default BpmGuesserPage;
