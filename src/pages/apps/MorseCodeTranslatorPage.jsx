import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  SpeakerSimpleHighIcon,
  TranslateIcon,
  WaveSineIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useAchievements } from '../../context/AchievementContext';
import GenerativeArt from '../../components/GenerativeArt';

const MORSE_CODE_MAP = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  1: '.----',
  2: '..---',
  3: '...--',
  4: '....-',
  5: '.....',
  6: '-....',
  7: '--...',
  8: '---..',
  9: '----.',
  0: '-----',
  ' ': '/',
  ',': '--..--',
  '.': '.-.-.-',
  '?': '..--..',
  '/': '-..-.',
  '-': '-....-',
  '(': '-.--.',
  ')': '-.--.-',
};

const REVERSE_MORSE_CODE_MAP = Object.fromEntries(
  Object.entries(MORSE_CODE_MAP).map(([key, value]) => [value, key]),
);

const MorseCodeTranslatorPage = () => {
  const appName = 'Morse Translator';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Translate natural language into binary pulses and vice-versa.',
    keywords: ['Fezcodex', 'morse code', 'translator', 'converter'],
  });

  const { unlockAchievement } = useAchievements();
  const [text, setText] = useState('');
  const [morseCode, setMorseCode] = useState('');

  const handleTextChange = (e) => {
    const newText = e.target.value.toUpperCase();
    setText(newText);
    const newMorseCode = newText
      .split('')
      .map((char) => MORSE_CODE_MAP[char] || '')
      .join(' ');
    setMorseCode(newMorseCode);
    if (newText === 'SOS') unlockAchievement('sos_signal');
  };

  const handleMorseChange = (e) => {
    const newMorseCode = e.target.value;
    setMorseCode(newMorseCode);
    const newText = newMorseCode
      .split(' ')
      .map((code) => REVERSE_MORSE_CODE_MAP[code] || '')
      .join('');
    setText(newText);
    if (newText === 'SOS') unlockAchievement('sos_signal');
  };

  const playMorseCode = () => {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const dotDuration = 80;
    const dashDuration = dotDuration * 3;
    const spaceDuration = dotDuration;
    let time = audioContext.currentTime;

    const playTone = (duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(1, time + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, time + duration);
      oscillator.start(time);
      oscillator.stop(time + duration);
    };

    for (const char of morseCode) {
      if (char === '.') {
        playTone(dotDuration / 1000);
        time += (dotDuration + spaceDuration) / 1000;
      } else if (char === '-') {
        playTone(dashDuration / 1000);
        time += (dashDuration + spaceDuration) / 1000;
      } else if (char === ' ') {
        time += (dotDuration * 3) / 1000;
      } else if (char === '/') {
        time += (dotDuration * 7) / 1000;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none uppercase">
                Morse
              </h1>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Binary pulse translation layer. Map natural language to temporal
                patterns.
              </p>
            </div>

            <button
              onClick={playMorseCode}
              disabled={!morseCode}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm disabled:opacity-20"
            >
              <SpeakerSimpleHighIcon weight="bold" size={20} />
              <span>Auditory Feed</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <GenerativeArt seed="MORSE_TEXT" className="w-full h-full" />
            </div>
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TranslateIcon weight="fill" className="text-emerald-500" />
              Language_Input
            </h3>
            <textarea
              value={text}
              onChange={handleTextChange}
              className="w-full h-64 bg-black/40 border border-white/5 p-6 font-mono text-xl text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide uppercase"
              placeholder="Insert plaintext..."
            />
          </div>

          <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <GenerativeArt seed="MORSE_PULSE" className="w-full h-full" />
            </div>
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <WaveSineIcon weight="fill" className="text-emerald-500" />
              Pulse_Sequence
            </h3>
            <textarea
              value={morseCode}
              onChange={handleMorseChange}
              className="w-full h-64 bg-black/40 border border-white/5 p-6 font-mono text-2xl text-emerald-400 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide tracking-[0.2em]"
              placeholder=".... --- .-.. -.."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorseCodeTranslatorPage;
