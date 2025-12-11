import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, MetronomeIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import { useAchievements } from '../../context/AchievementContext';

const BpmGuesserPage = () => {
  useSeo({
    title: 'BPM Guesser | Fezcodex',
    description: 'Tap the beat to guess the BPM (Beats Per Minute) of a song.',
    keywords: [
      'Fezcodex',
      'BPM guesser',
      'tap tempo',
      'music tool',
      'beat counter',
    ],
    ogTitle: 'BPM Guesser | Fezcodex',
    ogDescription:
      'Tap the beat to guess the BPM (Beats Per Minute) of a song.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'BPM Guesser | Fezcodex',
    twitterDescription:
      'Tap the beat to guess the BPM (Beats Per Minute) of a song.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [bpm, setBpm] = useState(0);
  const [taps, setTaps] = useState([]);
  const lastTapTime = useRef(0);
  const { unlockAchievement } = useAchievements();

  // For Human Metronome achievement
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

    // Reset if pause is too long (> 2 seconds)
    if (diff > 2000) {
      setTaps([]);
      setBpm(0);
      streakRef.current = 0;
      prevBpmRef.current = 0;
      return;
    }

    const newTaps = [...taps, diff];
    // Keep only last 8 taps for moving average
    if (newTaps.length > 8) {
      newTaps.shift();
    }
    setTaps(newTaps);

    const averageDiff = newTaps.reduce((a, b) => a + b, 0) / newTaps.length;
    const calculatedBpm = Math.round(60000 / averageDiff);

    // Check consistency for Human Metronome
    // Only check if we have enough samples to be stable (e.g., > 3 taps)
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

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="BPM Guesser" slug="bpm" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-2xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1 text-center">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app flex items-center justify-center gap-2">
                <MetronomeIcon size={32} /> BPM Guesser
              </h1>
              <hr className="border-gray-700 mb-6" />

              <div className="mb-8">
                <div className="text-6xl font-bold text-cyan-400 mb-2">
                  {bpm > 0 ? bpm : '--'}
                </div>
                <div className="text-sm opacity-60 uppercase tracking-wider">
                  Beats Per Minute
                </div>
              </div>

              <button
                onMouseDown={handleTap}
                className="w-48 h-48 rounded-full border-4 border-cyan-500 text-cyan-500 font-bold text-2xl tracking-widest transition-all duration-100 active:scale-95 active:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center mx-auto"
              >
                TAP
              </button>

              <div className="mt-8">
                <button
                  onClick={reset}
                  className="text-sm opacity-50 hover:opacity-100 transition-opacity underline"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BpmGuesserPage;
