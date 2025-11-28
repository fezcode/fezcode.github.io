import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowLeftIcon,
  MusicNoteIcon,
  Play,
  Pause,
  Faders,
  Waves,
  SpeakerHigh,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import colors from '../../config/colors';

const FezynthPage = () => {
  useSeo({
    title: 'Fezynth | Fezcodex',
    description: 'A client-side web synthesizer built with the Web Audio API.',
    keywords: [
      'Fezcodex',
      'app',
      'synthesizer',
      'web audio',
      'music',
      'keyboard',
    ],
    ogTitle: 'Fezynth | Fezcodex',
    ogDescription:
      'A client-side web synthesizer built with the Web Audio API.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Fezynth | Fezcodex',
    twitterDescription:
      'A client-side web synthesizer built with the Web Audio API.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [audioContext, setAudioContext] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [waveform, setWaveform] = useState('sine');
  const [attack, setAttack] = useState(0.1);
  const [release, setRelease] = useState(0.5);
  const [activeNotes, setActiveNotes] = useState({}); // Map note frequency to oscillator node (for UI)
  const activeNotesRef = useRef({}); // Ref for audio nodes (source of truth for logic)
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null); // Ref for audio context to access inside effect

  // Keyboard mapping (Letter -> Frequency)
  // Basic C Major scale starting from C4
  const keyMap = {
    a: 261.63, // C4
    s: 293.66, // D4
    d: 329.63, // E4
    f: 349.23, // F4
    g: 392.0, // G4
    h: 440.0, // A4
    j: 493.88, // B4
    k: 523.25, // C5
    l: 587.33, // D5
    ';': 659.25, // E5
    w: 277.18, // C#4
    e: 311.13, // D#4
    t: 369.99, // F#4
    y: 415.3, // G#4
    u: 466.16, // A#4
    o: 554.37, // C#5
    p: 622.25, // D#5
  };

  // Initialize Audio Context
  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;
    setAudioContext(ctx);
    audioContextRef.current = ctx;

    return () => {
      if (ctx) ctx.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Visualizer
  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#1f2937'; // Gray-900 bg
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#a78bfa'; // Purple-400 line
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  }, [audioContext]);

  const playNote = (freq) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    // Check Ref instead of State to prevent repeats and stuck keys
    if (activeNotesRef.current[freq]) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope Attack
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);

    oscillator.connect(gainNode);
    gainNode.connect(analyserRef.current);

    oscillator.start();

    // Update Ref immediately
    activeNotesRef.current[freq] = {oscillator, gainNode};
    // Update State for UI
    setActiveNotes((prev) => ({...prev, [freq]: true}));
  };

  const stopNote = (freq) => {
    const ctx = audioContextRef.current;
    if (!ctx || !activeNotesRef.current[freq]) return;

    const {oscillator, gainNode} = activeNotesRef.current[freq];

    // Envelope Release
    gainNode.gain.cancelScheduledValues(ctx.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + release,
    );

    oscillator.stop(ctx.currentTime + release);

    // Cleanup Ref
    delete activeNotesRef.current[freq];

    // Cleanup State for UI immediately (visual feedback)
    setActiveNotes((prev) => {
      const newState = {...prev};
      delete newState[freq];
      return newState;
    });
  };

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (keyMap[key] && !e.repeat) {
        playNote(keyMap[key]);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keyMap[key]) {
        stopNote(keyMap[key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [volume, waveform, attack, release]); // Removed activeNotes dependency

  return (
    <div className="py-8 sm:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center gap-2 text-lg mb-8"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1"/>{' '}
          Back to Apps
        </Link>

        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl flex items-center justify-center gap-4">
            <MusicNoteIcon size={48} weight="fill" className="text-purple-400" />
            Fezynth
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            A web-based synthesizer. Start making some noise!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Faders size={28} className="text-purple-400"/> Controls
            </h2>

            {/* Volume */}
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <SpeakerHigh/> Master Volume
                </span>
                <span>{Math.round(volume * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Waveform */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Waves/> Oscillator Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['sine', 'square', 'sawtooth', 'triangle'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setWaveform(type)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${waveform === type ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Envelope */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Attack (s)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="2"
                  value={attack}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setAttack(Math.max(0, Math.min(2, val)));
                    } else if (e.target.value === '') {
                      setAttack(0);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
                      setAttack(0.1); // Reset to default if invalid
                    }
                  }}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Release (s)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  value={release}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setRelease(Math.max(0, Math.min(5, val)));
                    } else if (e.target.value === '') {
                      setRelease(0);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
                      setRelease(0.5); // Reset to default if invalid
                    }
                  }}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Visualizer & Keyboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visualizer */}
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-inner h-48 relative">
              <canvas
                ref={canvasRef}
                width="800"
                height="200"
                className="w-full h-full"
              />
              <div
                className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-xs text-gray-400 font-mono pointer-events-none">
                Oscilloscope
              </div>
            </div>

            {/* Virtual Keyboard */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl overflow-x-auto">
              <div className="flex justify-center min-w-max select-none">
                {/* White Keys */}
                {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'].map(
                  (key, i) => {
                    const freq = keyMap[key];
                    const isPressed = !!activeNotes[freq];
                    const label = [
                      'C',
                      'D',
                      'E',
                      'F',
                      'G',
                      'A',
                      'B',
                      'C',
                      'D',
                      'E',
                    ][i];

                    return (
                      <div key={key} className="relative">
                        <button
                          onMouseDown={() => playNote(freq)}
                          onMouseUp={() => stopNote(freq)}
                          onMouseLeave={() => stopNote(freq)}
                          className={`w-12 h-40 border border-gray-400 rounded-b-lg mx-0.5 transition-all active:scale-95 flex flex-col justify-end pb-2 items-center shadow-md ${isPressed ? 'bg-purple-200 h-[9.8rem]' : 'bg-white hover:bg-gray-100'}`}
                        >
                          <span className="text-gray-500 font-bold text-lg">
                            {label}
                          </span>
                          <span className="text-xs text-gray-400 font-mono uppercase">
                            {key}
                          </span>
                        </button>
                        {/* Black Keys (Absolute positioned relative to white key container) */}
                        {['w', 'e', null, 't', 'y', 'u', null, 'o', 'p'].map(
                          (bKey, j) => {
                            if (i !== j || !bKey) return null;
                            const bFreq = keyMap[bKey];
                            const bIsPressed = !!activeNotes[bFreq];
                            return (
                              <button
                                key={bKey}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  playNote(bFreq);
                                }}
                                onMouseUp={(e) => {
                                  e.stopPropagation();
                                  stopNote(bFreq);
                                }}
                                onMouseLeave={(e) => {
                                  e.stopPropagation();
                                  stopNote(bFreq);
                                }}
                                className={`absolute -right-4 top-0 w-8 h-24 z-10 border border-black rounded-b-lg transition-all active:scale-95 flex flex-col justify-end pb-2 items-center shadow-lg ${bIsPressed ? 'bg-purple-900' : 'bg-black hover:bg-gray-900'}`}
                              >
                                <span className="text-xs text-gray-500 font-mono uppercase">
                                  {bKey}
                                </span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    );
                  },
                )}
              </div>
              <p className="text-center text-gray-400 text-sm mt-6">
                Play using your keyboard (A-L rows) or click the keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FezynthPage;
