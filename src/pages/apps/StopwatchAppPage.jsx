import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  ArrowCounterClockwiseIcon,
  TimerIcon,
  FlagIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const StopwatchAppPage = () => {
  const appName = 'Stopwatch';

  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const { unlockAchievement } = useAchievements();

  const startTimeRef = useRef(0);

  const timeRef = useRef(time);
  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - timeRef.current;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => {
    setIsRunning(false);
    if (time >= 10000 && time < 10010) unlockAchievement('perfect_timing');
  };
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };
  const handleLap = () => {
    setLaps((prevLaps) => [time, ...prevLaps]);
  };

  const formatTime = (timeValue) => {
    const milliseconds = `0${Math.floor((timeValue % 1000) / 10)}`.slice(-2);
    const seconds = `0${Math.floor(timeValue / 1000) % 60}`.slice(-2);
    const minutes = `0${Math.floor(timeValue / 60000) % 60}`.slice(-2);
    const hours = `0${Math.floor(timeValue / 3600000)}`.slice(-2);
    return { hours, minutes, seconds, milliseconds };
  };

  const t = formatTime(time);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Stopwatch | Fezcodex"
        description="Protocol for high-precision temporal measurement and lap sequence mapping."
        keywords={['stopwatch', 'timer', 'utility', 'time', 'lap timer']}
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
              <BreadcrumbTitle title="Stopwatch" slug="sw" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Precision temporal analyzer. Capture high-frequency time
                intervals and map consecutive performance data.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Interaction Area */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-12 md:p-24 rounded-sm overflow-hidden group flex flex-col items-center justify-center">
              {/* Generative Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={appName + isRunning}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-12 w-full">
                <div className="text-center">
                  <div
                    className={`text-[6rem] md:text-[12rem] font-black tracking-tighter leading-none transition-colors duration-500 ${isRunning ? 'text-emerald-500' : 'text-white'}`}
                  >
                    <span className="opacity-20 text-[0.4em] align-top mr-2">
                      {t.hours}
                    </span>
                    {t.minutes}
                    <span className="opacity-20">:</span>
                    {t.seconds}
                    <span className="text-[0.4em] opacity-40">
                      .{t.milliseconds}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-gray-500 mt-4">
                    Hours_Minutes_Seconds_MS
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  {!isRunning ? (
                    <button
                      onClick={handleStart}
                      className="px-12 py-6 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all text-sm rounded-sm flex items-center gap-3"
                    >
                      <PlayIcon weight="fill" size={20} /> Start_Sequence
                    </button>
                  ) : (
                    <button
                      onClick={handleStop}
                      className="px-12 py-6 bg-red-500 text-black font-black uppercase tracking-[0.2em] hover:bg-red-400 transition-all text-sm rounded-sm flex items-center gap-3"
                    >
                      <PauseIcon weight="fill" size={20} /> Stop_Protocol
                    </button>
                  )}

                  <button
                    onClick={handleLap}
                    disabled={!isRunning}
                    className="px-12 py-6 border border-white/10 text-white font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-sm rounded-sm disabled:opacity-20 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    <FlagIcon weight="bold" size={20} /> Record_Lap
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-8 py-6 text-gray-500 hover:text-white transition-colors"
                  >
                    <ArrowCounterClockwiseIcon weight="bold" size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Laps Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm h-[600px] flex flex-col">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2 shrink-0">
                <TimerIcon weight="fill" />
                Lap_Archives
              </h3>

              <div className="flex-1 overflow-y-auto custom-scrollbar-terminal pr-4">
                <AnimatePresence initial={false}>
                  {laps.length > 0 ? (
                    <div className="space-y-4">
                      {laps.map((lapTime, index) => {
                        const lt = formatTime(lapTime);
                        return (
                          <motion.div
                            key={laps.length - index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between border-b border-white/5 pb-4 group"
                          >
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-[10px] text-gray-600 uppercase">
                                #{String(laps.length - index).padStart(2, '0')}
                              </span>
                              <span className="text-xl font-black text-white group-hover:text-emerald-500 transition-colors">
                                {lt.minutes}:{lt.seconds}.{lt.milliseconds}
                              </span>
                            </div>
                            <span className="font-mono text-[9px] text-gray-700">
                              {lt.hours}H
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-700">
                        No lap data sequences recorded
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                High-precision temporal measurement is critical for calibrating
                systemic performance and mapping operational speed.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Temporal_Tracker_v0.6.1</span>
          <span className="text-gray-800">
            SYNC_STATUS // {isRunning ? 'ACTIVE' : 'STANDBY'}
          </span>
        </footer>
      </div>
    </div>
  );
};

export default StopwatchAppPage;
