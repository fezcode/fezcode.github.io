import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, BugIcon, ArrowsClockwiseIcon, TargetIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const HOLE_COUNT = 9;
const GAME_DURATION = 30;

const WhackABugPage = () => {
  const appName = 'Debugger';

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeHole, setActiveHole] = useState(null);
  const [gameActive, setGameActive] = useState(false);

  const timerRef = useRef(null);
  const bugTimerRef = useRef(null);
  const lastHoleRef = useRef(null);

  const endGame = useCallback(() => {
    setGameActive(false);
    clearInterval(timerRef.current);
    clearTimeout(bugTimerRef.current);
    setActiveHole(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(true);
    lastHoleRef.current = null;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const spawnBug = useCallback(() => {
    if (!gameActive) return;

    let nextHole;
    do {
      nextHole = Math.floor(Math.random() * HOLE_COUNT);
    } while (nextHole === lastHoleRef.current);

    lastHoleRef.current = nextHole;
    setActiveHole(nextHole);

    const time = Math.random() * (1000 - 600) + 600;
    bugTimerRef.current = setTimeout(() => {
      setActiveHole(null);
      // Wait a bit before spawning next
      setTimeout(spawnBug, Math.random() * 400 + 200);
    }, time);
  }, [gameActive]);

  useEffect(() => {
    if (gameActive) {
      spawnBug();
    }
    return () => {
      clearTimeout(bugTimerRef.current);
    };
  }, [gameActive, spawnBug]);

  const handleWhack = (index) => {
    if (!gameActive || index !== activeHole) return;
    setScore((prev) => prev + 1);
    setActiveHole(null);
    clearTimeout(bugTimerRef.current);
    // Spawn next one faster if whacked
    setTimeout(spawnBug, 100);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(bugTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Debugger | Fezcodex"
        description="Protocol for real-time bug remediation and latency testing."
        keywords={['Fezcodex', 'whack a bug', 'game', 'reflexes', 'fun']}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Debugger" slug="wab" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                System remediation protocol. Identify and neutralize structural anomalies within the neural grid before system stability is compromised.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Dashboard */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <TargetIcon weight="fill" />
                Session_Stats
              </h3>

              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Bugs_Neutralized</span>
                  <span className="text-4xl font-black text-emerald-500">{score}</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Temporal_Remaining</span>
                  <span className={`text-4xl font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
                </div>
              </div>

              {!gameActive ? (
                <button
                  onClick={startGame}
                  className="w-full py-6 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-emerald-500 transition-all rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center justify-center gap-3"
                >
                  <ArrowsClockwiseIcon weight="bold" size={20} />
                  {timeLeft === 0 ? 'Restart Session' : 'Initialize Protocol'}
                </button>
              ) : (
                <div className="py-6 border border-emerald-500/20 bg-emerald-500/5 rounded-sm flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="font-mono text-[10px] text-emerald-500 font-black uppercase tracking-widest">System_Remediation_Active</span>
                </div>
              )}
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Operational speed is critical. Bugs mutate rapidly within the local environment. Failure to neutralize within the temporal window results in system-wide latency.
              </p>
            </div>
          </div>

          {/* Grid Area */}
          <div className="lg:col-span-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden min-h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed={appName + gameActive + timeLeft} className="w-full h-full" />
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl w-full">
                {Array.from({ length: HOLE_COUNT }).map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleWhack(index)}
                    className={`
                      aspect-square border-4 transition-all duration-200 flex items-center justify-center relative overflow-hidden
                      ${activeHole === index ? 'border-emerald-500 bg-emerald-500/10 cursor-pointer shadow-[inset_0_0_30px_rgba(16,185,129,0.1)]' : 'border-white/5 bg-black/20 cursor-default'}
                    `}
                  >
                    <AnimatePresence>
                      {activeHole === index && (
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 50, opacity: 0 }}
                          transition={{ type: "spring", damping: 12 }}
                          className="text-red-500"
                        >
                          <BugIcon size={64} weight="fill" className="drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Grid Pattern Background for Holes */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                  </div>
                ))}
              </div>

              {!gameActive && timeLeft === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="space-y-6">
                    <span className="font-mono text-xs text-red-500 font-bold uppercase tracking-[0.5em]">{'//'} SESSION_TERMINATED</span>
                    <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter">Overload</h2>
                    <div className="p-8 border border-white/10 bg-white/5 inline-block rounded-sm">
                      <p className="font-mono text-gray-500 uppercase tracking-widest text-xs mb-2">Final_Mitigation_Count</p>
                      <p className="text-5xl font-black text-emerald-500">{score}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Mitigation_Module_v0.6.1</span>
          <span className="text-gray-800">REMEDIATION_STATUS // {gameActive ? 'IN_PROGRESS' : 'STANDBY'}</span>
        </footer>
      </div>
    </div>
  );
};

export default WhackABugPage;