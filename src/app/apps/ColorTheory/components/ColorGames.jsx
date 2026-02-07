import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hslToHex } from '../utils/colorUtils';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

const ColorGames = () => {
  const [targetColor, setTargetColor] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const generateColor = () => {
    return {
      h: Math.floor(Math.random() * 360),
      s: 70 + Math.floor(Math.random() * 30), // Keep it vibrant
      l: 40 + Math.floor(Math.random() * 20),
    };
  };

  const startNewRound = useCallback(() => {
    const correct = generateColor();
    setTargetColor(correct);

    // Generate 3 distractors
    const distractors = [1, 2, 3].map(() => {
      const c = generateColor();
      // ensure distinct hues
      return c;
    });

    const allOptions = [correct, ...distractors].sort(
      () => Math.random() - 0.5,
    );
    setOptions(allOptions);
    setFeedback(null);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);
  const handleGuess = (option) => {
    if (feedback) return; // Prevent double guessing

    if (option === targetColor) {
      setScore((s) => s + 10);
      setFeedback('correct');
      setTimeout(startNewRound, 1000);
    } else {
      setScore((s) => Math.max(0, s - 5));
      setFeedback('wrong');
      setTimeout(startNewRound, 1000);
    }
  };

  if (!targetColor) return null;

  return (
    <div className="p-8 min-h-full flex flex-col items-center justify-center font-nunito bg-[#f4f4f0]">
      <div className="w-full max-w-2xl bg-white border-2 border-[#1a1a1a] rounded-3xl p-8 shadow-[12px_12px_0px_0px_#1a1a1a] relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-normal uppercase tracking-tighter font-instr-serif text-[#1a1a1a]">
            Hex Hunter
          </h2>
          <div className="bg-[#1a1a1a] text-white px-6 py-2 rounded-lg font-mono font-bold text-xl border-2 border-transparent">
            SCORE: {score}
          </div>
        </div>
        {/* Game Area */}
        <div className="flex flex-col items-center gap-10">
          <motion.div
            key={hslToHex(targetColor.h, targetColor.s, targetColor.l)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-48 h-48 rounded-full border-4 border-[#1a1a1a] shadow-xl flex items-center justify-center text-white/20 font-black text-6xl select-none"
            style={{
              backgroundColor: hslToHex(
                targetColor.h,
                targetColor.s,
                targetColor.l,
              ),
            }}
          >
            ?
          </motion.div>

          <p className="text-[#666] font-bold uppercase tracking-widest text-sm">
            Which HEX code matches this color?
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            {options.map((opt, i) => {
              const hex = hslToHex(opt.h, opt.s, opt.l);
              const isTarget = opt === targetColor;

              return (
                <button
                  key={i}
                  onClick={() => handleGuess(opt)}
                  disabled={!!feedback}
                  className={`p-6 rounded-xl font-mono text-xl font-bold transition-all transform border-2 border-[#1a1a1a]
                                  ${feedback && isTarget ? 'bg-[#00C896] text-white' : ''}
                                  ${feedback === 'wrong' && !isTarget ? 'opacity-30' : ''}
                                  ${!feedback ? 'bg-white hover:bg-[#1a1a1a] hover:text-white hover:shadow-[4px_4px_0px_0px_#666]' : ''}
                              `}
                >
                  {hex.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className={`p-8 rounded-full ${feedback === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'} text-white shadow-2xl`}
              >
                {feedback === 'correct' ? (
                  <CheckCircle size={64} weight="fill" />
                ) : (
                  <XCircle size={64} weight="fill" />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ColorGames;
