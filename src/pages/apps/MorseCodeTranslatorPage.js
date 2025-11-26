import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, SpeakerSimpleHighIcon } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const MORSE_CODE_MAP = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
  'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
  ' ': '/', ',': '--..--', '.': '.-.-.-', '?': '..--..', '/': '-..-.', '-': '-....-', '(': '-.--.', ')': '-.--.-'
};

const REVERSE_MORSE_CODE_MAP = Object.fromEntries(Object.entries(MORSE_CODE_MAP).map(([key, value]) => [value, key]));

const MorseCodeTranslatorPage = () => {
  useSeo({
    title: 'Morse Code Translator | Fezcodex',
    description: 'Translate text to Morse code and vice-versa, with audio playback.',
    keywords: ['Fezcodex', 'morse code', 'translator', 'converter'],
    ogTitle: 'Morse Code Translator | Fezcodex',
    ogDescription: 'Translate text to Morse code and vice-versa, with audio playback.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Morse Code Translator | Fezcodex',
    twitterDescription: 'Translate text to Morse code and vice-versa, with audio playback.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [text, setText] = useState('');
  const [morseCode, setMorseCode] = useState('');

  const handleTextChange = (e) => {
    const newText = e.target.value.toUpperCase();
    setText(newText);
    const newMorseCode = newText.split('').map(char => MORSE_CODE_MAP[char] || '').join(' ');
    setMorseCode(newMorseCode);
  };

  const handleMorseChange = (e) => {
    const newMorseCode = e.target.value;
    setMorseCode(newMorseCode);
    const newText = newMorseCode.split(' ').map(code => REVERSE_MORSE_CODE_MAP[code] || '').join('');
    setText(newText);
  };

  const playMorseCode = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const dotDuration = 80;
    const dashDuration = dotDuration * 3;
    const spaceDuration = dotDuration;
    let time = audioContext.currentTime;

    const playTone = (duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 600; // A suitable frequency for the tone
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
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4">
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
          <BreadcrumbTitle title="Morse Code Translator" slug="mct" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div className="bg-app-alpha-10 border-app-alpha-50 text-app hover:bg-app/15 group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <div className="relative z-10 p-4">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">Morse Code Translator</h1>
              <hr className="border-gray-700 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="text-input" className="block text-lg font-semibold text-app mb-2">Text</label>
                  <textarea
                    id="text-input"
                    className="w-full h-48 p-4 bg-gray-900/50 font-mono resize-none border rounded-md focus:ring-0 text-app-light border-app-alpha-50"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Enter text to translate..."
                  />
                </div>
                <div>
                  <label htmlFor="morse-input" className="block text-lg font-semibold text-app mb-2">Morse Code</label>
                  <textarea
                    id="morse-input"
                    className="w-full h-48 p-4 bg-gray-900/50 font-mono resize-none border rounded-md focus:ring-0 text-app-light border-app-alpha-50"
                    value={morseCode}
                    onChange={handleMorseChange}
                    placeholder="Enter morse code to translate..."
                  />
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button onClick={playMorseCode} className="p-4 rounded-full bg-tb text-app border-app-alpha-50 hover:bg-app/15 border flex items-center gap-2">
                  <SpeakerSimpleHighIcon size={32} /> Play Sound
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorseCodeTranslatorPage;
