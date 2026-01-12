import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  KeyboardIcon,
  ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const sampleTexts = [
  'The quick brown fox jumps over the lazy dog.',
  'Never underestimate the power of a good book.',
  'Coding is like poetry; it should be beautiful and efficient.',
  'The early bird catches the worm, but the second mouse gets the cheese.',
  'Innovation distinguishes between a leader and a follower.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts.',
];

function KeyboardTypingSpeedTesterPage() {
  const appName = 'FezType';

  const [textToType, setTextToType] = useState('');
  const [typedText, setTypedText] = useState('');
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);

  const inputRef = useRef(null);

  const selectNewText = useCallback((currentText) => {
    let newText;
    do {
      newText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    } while (newText === currentText);
    return newText;
  }, []);

  useEffect(() => {
    setTextToType(selectNewText(''));
  }, [selectNewText]);

  const calculateResults = useCallback(() => {
    const timeElapsedMinutes = (60 - timer) / 60;
    const calculatedWpm =
      timeElapsedMinutes === 0 ? 0 : totalCorrectChars / 5 / timeElapsedMinutes;
    const calculatedAccuracy =
      totalTypedChars === 0 ? 0 : (totalCorrectChars / totalTypedChars) * 100;
    setWpm(Math.round(calculatedWpm));
    setAccuracy(calculatedAccuracy.toFixed(2));
  }, [totalCorrectChars, totalTypedChars, timer]);

  useEffect(() => {
    let interval = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && timerActive) {
      setTimerActive(false);
      setTestCompleted(true);
      calculateResults();
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, calculateResults]);

  const handleInputChange = (event) => {
    if (testCompleted) return;
    if (!testStarted) {
      setTestStarted(true);
      setTimerActive(true);
    }

    const newTypedText = event.target.value;
    setTypedText(newTypedText);

    if (newTypedText.length === textToType.length) {
      let segmentCorrectChars = 0;
      for (let i = 0; i < textToType.length; i++) {
        if (newTypedText[i] === textToType[i]) segmentCorrectChars++;
      }
      setTotalCorrectChars((prev) => prev + segmentCorrectChars);
      setTotalTypedChars((prev) => prev + textToType.length);
      setTextToType((prevText) => selectNewText(prevText));
      setTypedText('');
    }
  };

  const resetTest = () => {
    setTestCompleted(false);
    setTestStarted(false);
    setTimerActive(false);
    setTimer(60);
    setWpm(0);
    setAccuracy(0);
    setTotalCorrectChars(0);
    setTotalTypedChars(0);
    setTextToType(selectNewText(''));
    setTypedText('');
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const renderTextToType = () => {
    return textToType.split('').map((char, index) => {
      let colorClass = 'text-gray-600';
      let bgClass = '';
      const isCurrent = index === typedText.length && !testCompleted;

      if (index < typedText.length) {
        if (char === typedText[index]) {
          colorClass = char === ' ' ? '' : 'text-emerald-400';
          bgClass = char === ' ' ? 'bg-emerald-500/20' : '';
        } else {
          colorClass = char === ' ' ? '' : 'text-rose-500';
          bgClass = char === ' ' ? 'bg-rose-500/20' : '';
        }
      }

      return (
        <span
          key={index}
          className={`${colorClass} ${bgClass} ${isCurrent ? 'border-b-2 border-emerald-500 animate-pulse text-white' : ''} transition-colors duration-150`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="FezType | Fezcodex"
        description="Test and improve your typing speed with FezType."
        keywords={[
          'Fezcodex',
          'typing test',
          'wpm',
          'typing speed',
          'keyboard',
          'games',
        ]}
      />
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-12">
        {/* Header Section */}
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
              <BreadcrumbTitle title="FezType" slug="ft" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Keystroke velocity protocol. Benchmark and optimize your manual
                data entry throughput.
              </p>
            </div>
          </div>
        </header>

        {/* Game Container */}
        <div className="relative">
          {/* Decorative Art Background */}
          <div className="absolute -inset-4 opacity-5 pointer-events-none">
            <GenerativeArt seed={appName} className="w-full h-full" />
          </div>

          <div className="relative z-10 border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 md:p-12 rounded-sm overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

            <AnimatePresence mode="wait">
              {!testCompleted ? (
                <motion.div
                  key="typing-area"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-12"
                >
                  <div className="text-2xl md:text-4xl font-mono leading-relaxed tracking-tight break-words min-h-[120px]">
                    {renderTextToType()}
                  </div>

                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      className="w-full bg-transparent border-b-2 border-white/10 py-4 text-3xl font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none transition-colors"
                      value={typedText}
                      onChange={handleInputChange}
                      placeholder="Start typing..."
                      autoFocus
                    />
                    <div className="absolute right-0 bottom-4 text-gray-700 pointer-events-none">
                      <KeyboardIcon size={32} weight="thin" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={resetTest}
                      className="flex items-center gap-2 px-6 py-3 border border-white/10 hover:bg-white hover:text-black transition-all font-mono uppercase tracking-widest text-xs"
                    >
                      <ArrowCounterClockwiseIcon weight="bold" />
                      <span>Reset Test</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results-area"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <h2 className="text-[10vw] font-black uppercase tracking-tighter leading-none mb-12 text-emerald-500 opacity-20 absolute">
                    COMPLETE
                  </h2>

                  <div className="relative z-10 flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-12 border border-white/10 p-12 bg-black">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">
                          Words Per Minute
                        </span>
                        <span className="text-7xl font-black text-white">
                          {wpm}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">
                          Accuracy
                        </span>
                        <span className="text-7xl font-black text-emerald-500">
                          {accuracy}%
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={resetTest}
                      className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-xl"
                    >
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-20 flex flex-col md:flex-row justify-between items-start gap-8 border-t border-white/5 pt-12">
          <div className="max-w-md">
            <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4">
              How it works
            </h3>
            <p className="text-gray-500 text-xs font-mono leading-relaxed uppercase">
              FezType measures your character throughput and accuracy. Start
              typing to begin the test. High precision yields emerald feedback.
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-700 font-mono text-[10px] uppercase">
            <span className="h-1 w-8 bg-gray-800" />
            <span>Active Session</span>
          </div>{' '}
        </div>
      </div>
    </div>
  );
}

export default KeyboardTypingSpeedTesterPage;
