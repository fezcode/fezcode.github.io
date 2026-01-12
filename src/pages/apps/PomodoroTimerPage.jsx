import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  ArrowCounterClockwiseIcon,
  TimerIcon,
  CoffeeIcon,
  BrainIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const PomodoroTimerPage = () => {
  const appName = 'Focus Timer';

  const { addToast } = useToast();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            if (audioRef.current) audioRef.current.play();

            if (mode === 'work') {
              const newPomodoroCount = pomodoroCount + 1;
              setPomodoroCount(newPomodoroCount);
              addToast({
                title: 'Session Complete',
                message: 'Focus interval ended. Initiate recovery.',
              });
              if (newPomodoroCount % 4 === 0) selectMode('longBreak');
              else selectMode('shortBreak');
            } else {
              addToast({
                title: 'Recovery Ended',
                message: 'Rest interval complete. Resume focus protocol.',
              });
              selectMode('work');
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, mode, pomodoroCount, addToast]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') setMinutes(25);
    else if (mode === 'shortBreak') setMinutes(5);
    else setMinutes(15);
    setSeconds(0);
  };

  const selectMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    switch (newMode) {
      case 'work':
        setMinutes(25);
        break;
      case 'shortBreak':
        setMinutes(5);
        break;
      case 'longBreak':
        setMinutes(15);
        break;
      default:
        setMinutes(25);
    }
    setSeconds(0);
  };

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Focus Timer | Fezcodex"
        description="Protocol for temporal optimization and focus calibration using the Pomodoro technique."
        keywords={['Fezcodex', 'pomodoro', 'timer', 'productivity', 'focus']}
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
              <BreadcrumbTitle title="Focus Timer" slug="pomodoro" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Protocol for temporal optimization. Calibrate focus intervals
                and recovery cycles to maximize neural output.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Timer Display */}
          <div className="lg:col-span-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-12 md:p-24 rounded-sm overflow-hidden group flex flex-col items-center justify-center">
              {/* Generative Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={appName + mode + isActive}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-16 w-full">
                {/* Mode Selectors */}
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { id: 'work', label: 'Focus', icon: BrainIcon },
                    { id: 'shortBreak', label: 'Rest', icon: CoffeeIcon },
                    { id: 'longBreak', label: 'Recovery', icon: CoffeeIcon },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => selectMode(m.id)}
                      className={`
                        flex items-center gap-3 px-6 py-3 border transition-all duration-200 text-[10px] font-mono uppercase tracking-widest
                        ${
                          mode === m.id
                            ? 'bg-emerald-500 text-black border-emerald-400 font-black'
                            : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                        }
                      `}
                    >
                      <m.icon weight="bold" size={16} />
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Counter */}
                <div className="text-center">
                  <div
                    className={`text-[8rem] md:text-[15rem] font-black tracking-tighter leading-none transition-colors duration-500 ${isActive ? 'text-emerald-500' : 'text-white'}`}
                  >
                    {formatTime(minutes)}
                    <span className="opacity-20">:</span>
                    {formatTime(seconds)}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-8">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className="w-24 h-24 rounded-sm bg-white text-black flex items-center justify-center hover:bg-emerald-500 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  >
                    {isActive ? (
                      <PauseIcon size={40} weight="fill" />
                    ) : (
                      <PlayIcon size={40} weight="fill" />
                    )}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={resetTimer}
                    className="w-24 h-24 rounded-sm border border-white/10 text-white flex items-center justify-center hover:bg-white/5 transition-colors"
                  >
                    <ArrowCounterClockwiseIcon size={32} weight="bold" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <TimerIcon weight="fill" />
                Session_Metrics
              </h3>

              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                    Completed_Cycles
                  </span>
                  <span className="text-4xl font-black">{pomodoroCount}</span>
                </div>

                <div className="space-y-4">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                    Next_Objective
                  </span>
                  <div className="p-4 bg-white/5 rounded-sm border border-white/5">
                    <p className="text-sm font-bold uppercase text-white">
                      {mode === 'work'
                        ? 'Maintain neural focus'
                        : 'Initiate systemic recovery'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Segmented time mapping improves focus and cognitive durability.
                Synchronize your internal clock with the system intervals for
                peak performance.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Temporal_Focus_v0.6.1</span>
          <span className="text-gray-800">
            TIMER_STATUS // {isActive ? 'EXECUTING' : 'STANDBY'}
          </span>
        </footer>
      </div>
      <audio ref={audioRef} src="/sounds/notification.mp3" />
    </div>
  );
};

export default PomodoroTimerPage;
