import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  FadersIcon,
  RecordIcon,
  DownloadSimpleIcon,
  ActivityIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';

// Keyboard mapping (Letter -> Frequency)
const KEY_MAP = {
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

const FezynthPage = () => {
  useSeo({
    title: 'Fezynth | Fezcodex',
    description: 'A modular, browser-based synthesizer for sound design.',
    keywords: ['synthesizer', 'web audio', 'music', 'generative', 'fezcodex'],
  });

  const { addToast } = useToast();
  const [audioContext, setAudioContext] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [waveform, setWaveform] = useState('sine');
  const [attack, setAttack] = useState(0.1);
  const [release, setRelease] = useState(0.5);
  const [isDistorted, setIsDistorted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeNotes, setActiveNotes] = useState({});

  const activeNotesRef = useRef({});
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const distortionNodeRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Initialize Audio Context and Nodes
  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    const distortion = ctx.createWaveShaper();
    const masterGain = ctx.createGain();

    analyser.fftSize = 1024;

    // Setup Distortion (Bitcrush-like effect via Waveshaper)
    const makeDistortionCurve = (amount) => {
      const k = typeof amount === 'number' ? amount : 50;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    };
    distortion.curve = makeDistortionCurve(400);
    distortion.oversample = '4x';

    // Route: Osc -> Gain -> Distortion (conditional) -> Analyser -> Destination
    masterGain.connect(isDistorted ? distortion : analyser);
    if (isDistorted) {
        distortion.connect(analyser);
    }
    analyser.connect(ctx.destination);

    distortionNodeRef.current = distortion;
    analyserRef.current = analyser;
    setAudioContext(ctx);
    audioContextRef.current = ctx;

    return () => {
      if (ctx) ctx.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isDistorted]);

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

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Lines
      ctx.strokeStyle = '#ffffff05';
      ctx.lineWidth = 1;
      for(let i = 0; i < canvas.width; i += 40) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for(let i = 0; i < canvas.height; i += 40) {
          ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = isDistorted ? '#f87171' : '#10b981'; // Red if distorted, Emerald if clean
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  }, [audioContext, isDistorted]);

  const playNote = useCallback((freq) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (activeNotesRef.current[freq]) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);

    oscillator.connect(gainNode);
    // Connect to whatever is currently feeding the destination
    gainNode.connect(isDistorted ? distortionNodeRef.current : analyserRef.current);

    oscillator.start();
    activeNotesRef.current[freq] = { oscillator, gainNode };
    setActiveNotes((prev) => ({ ...prev, [freq]: true }));
  }, [waveform, volume, attack, isDistorted]);

  const stopNote = useCallback((freq) => {
    const ctx = audioContextRef.current;
    if (!ctx || !activeNotesRef.current[freq]) return;

    const { oscillator, gainNode } = activeNotesRef.current[freq];
    gainNode.gain.cancelScheduledValues(ctx.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + release);

    oscillator.stop(ctx.currentTime + release);
    delete activeNotesRef.current[freq];
    setActiveNotes((prev) => {
      const newState = { ...prev };
      delete newState[freq];
      return newState;
    });
  }, [release]);

  const handleRecording = () => {
    if (!isRecording) {
      const stream = audioContextRef.current.createMediaStreamDestination();
      analyserRef.current.connect(stream);
      const recorder = new MediaRecorder(stream.stream);

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fezynth_sample_${Date.now()}.wav`;
        link.click();
        audioChunksRef.current = [];
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      addToast({ title: 'Recording Protocol Active', message: 'Capturing audio buffer...', type: 'info' });
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      addToast({ title: 'Recording Finalized', message: 'Sample exported to local storage.', type: 'success' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (KEY_MAP[key] && !e.repeat) playNote(KEY_MAP[key]);
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (KEY_MAP[key]) stopNote(KEY_MAP[key]);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playNote, stopNote]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-emerald-500/30 py-24 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/apps"
          className="group inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em] mb-12"
        >
          <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
          <span>Exit_To_Center</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase flex items-center gap-4 flex-wrap">
              Fezynth <span className="text-xs border border-emerald-500 text-emerald-500 px-2 py-1 rounded-sm shrink-0 whitespace-nowrap tracking-normal">v2.0</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-xl font-light">
              Neural audio synthesis engine. Manipulation of Web Audio frequencies via low-level browser protocols.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRecording}
              className={`flex items-center gap-3 px-6 py-3 border-2 transition-all font-bold uppercase tracking-widest text-xs
                ${isRecording ? 'bg-red-500 border-red-400 text-white animate-pulse' : 'bg-transparent border-white/10 hover:border-white'}`}
            >
              {isRecording ? <DownloadSimpleIcon weight="bold" /> : <RecordIcon weight="bold" />}
              {isRecording ? 'Buffer_Export' : 'Record_Sample'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-8">
              <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
                <FadersIcon weight="fill" /> Parameters
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 mb-3">
                    <span>Master_Gain</span>
                    <span className="text-white">{Math.round(volume * 100)}%</span>
                  </label>
                  <input
                    type="range" min="0" max="1" step="0.01" value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-3">Osc_Structure</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['sine', 'square', 'sawtooth', 'triangle'].map((type) => (
                      <button
                        key={type} onClick={() => setWaveform(type)}
                        className={`py-2 text-[10px] font-bold uppercase border transition-all
                          ${waveform === type ? 'bg-white text-black border-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                      <span>Attack</span>
                      <span className="text-white">{attack}s</span>
                    </label>
                    <input
                      type="range" min="0" max="2" step="0.01" value={attack}
                      onChange={(e) => setAttack(parseFloat(e.target.value))}
                      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                      <span>Release</span>
                      <span className="text-white">{release}s</span>
                    </label>
                    <input
                      type="range" min="0" max="5" step="0.01" value={release}
                      onChange={(e) => setRelease(parseFloat(e.target.value))}
                      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <button
                        onClick={() => setIsDistorted(!isDistorted)}
                        className={`w-full py-3 flex items-center justify-center gap-2 border-2 transition-all font-bold text-[10px] uppercase tracking-widest
                            ${isDistorted ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20'}`}
                    >
                        <ActivityIcon weight="bold" />
                        Signal_Interference: {isDistorted ? 'ON' : 'OFF'}
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visualizer & Keyboard */}
          <div className="lg:col-span-8 space-y-8">
            <div className="relative h-64 border-2 border-white/10 bg-black overflow-hidden group">
              <canvas ref={canvasRef} width="1200" height="300" className="w-full h-full" />
              <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-black/80 border border-white/10 rounded-sm">
                <div className={`w-1.5 h-1.5 rounded-full ${isDistorted ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Live_Oscilloscope</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-sm overflow-x-auto select-none">
              <div className="flex justify-center min-w-max">
                {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'].map((key, i) => {
                    const freq = KEY_MAP[key];
                    const isPressed = !!activeNotes[freq];
                    return (
                      <div key={key} className="relative">
                        <button
                          onMouseDown={() => playNote(freq)} onMouseUp={() => stopNote(freq)} onMouseLeave={() => stopNote(freq)}
                          className={`w-14 h-48 border border-white/10 mx-0.5 transition-all flex flex-col justify-end pb-4 items-center
                            ${isPressed ? 'bg-emerald-500 border-emerald-400 text-black translate-y-1 h-[11.5rem]' : 'bg-transparent hover:bg-white/5 text-gray-500'}`}
                        >
                          <span className="font-bold text-xl uppercase">{key}</span>
                        </button>
                        {['w', 'e', null, 't', 'y', 'u', null, 'o', 'p'].map((bKey, j) => {
                            if (i !== j || !bKey) return null;
                            const bFreq = KEY_MAP[bKey];
                            const bIsPressed = !!activeNotes[bFreq];
                            return (
                              <button
                                key={bKey}
                                onMouseDown={(e) => { e.stopPropagation(); playNote(bFreq); }}
                                onMouseUp={(e) => { e.stopPropagation(); stopNote(bFreq); }}
                                onMouseLeave={(e) => { e.stopPropagation(); stopNote(bFreq); }}
                                className={`absolute -right-5 top-0 w-10 h-28 z-10 border transition-all flex flex-col justify-end pb-4 items-center
                                  ${bIsPressed ? 'bg-red-500 border-red-400 text-black translate-y-1 h-[6.8rem]' : 'bg-black border-white/20 text-gray-600 hover:border-white/40'}`}
                              >
                                <span className="text-xs font-bold uppercase">{bKey}</span>
                              </button>
                            );
                        })}
                      </div>
                    );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FezynthPage;
