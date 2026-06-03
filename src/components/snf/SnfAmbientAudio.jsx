import { useEffect, useRef } from 'react';
import { useSnf } from '../../context/SnfContext';

/**
 * Asset-free ambient audio for the terminal, synthesised with the Web Audio API.
 *  - hum    : layered low oscillators through a lowpass (electrical drone)
 *  - static : white noise through a highpass (dead-channel hiss)
 *  - rain    : filtered noise with slow amplitude flutter (acid rain)
 *
 * Never autoplays — it only starts once the user enables `audio`, which is a
 * user gesture, satisfying browser autoplay policy.
 */
const SnfAmbientAudio = () => {
  const { settings } = useSnf();
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const nodesRef = useRef([]);

  const teardown = () => {
    nodesRef.current.forEach((n) => {
      try {
        n.stop?.();
        n.disconnect?.();
      } catch {
        /* ignore */
      }
    });
    nodesRef.current = [];
  };

  // Build / rebuild the graph when the master switch or track changes.
  useEffect(() => {
    if (!settings.audio) {
      teardown();
      return undefined;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return undefined;

    if (!ctxRef.current) {
      ctxRef.current = new AudioCtx();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.connect(ctxRef.current.destination);
    }
    const ctx = ctxRef.current;
    const master = masterRef.current;
    master.gain.value = settings.volume;
    ctx.resume?.();

    teardown();
    const made = [];

    const makeNoise = () => {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      return src;
    };

    if (settings.audioTrack === 'hum') {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 220;
      lp.connect(master);
      [55, 82.5, 110].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 2 ? 'sine' : 'triangle';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.value = idx === 0 ? 0.5 : 0.18;
        osc.connect(g);
        g.connect(lp);
        osc.start();
        made.push(osc, g);
      });
      // slow tremolo
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 60;
      lfo.connect(lfoGain);
      lfoGain.connect(lp.frequency);
      lfo.start();
      made.push(lfo, lfoGain, lp);
    } else if (settings.audioTrack === 'static') {
      const noise = makeNoise();
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 1200;
      const g = ctx.createGain();
      g.gain.value = 0.12;
      noise.connect(hp);
      hp.connect(g);
      g.connect(master);
      noise.start();
      made.push(noise, hp, g);
    } else {
      // rain
      const noise = makeNoise();
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1600;
      const g = ctx.createGain();
      g.gain.value = 0.22;
      noise.connect(lp);
      lp.connect(g);
      g.connect(master);
      noise.start();
      // flutter
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.8;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.08;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      lfo.start();
      made.push(noise, lp, g, lfo, lfoGain);
    }

    nodesRef.current = made;
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.audio, settings.audioTrack]);

  // Live volume changes.
  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.value = settings.volume;
  }, [settings.volume]);

  // Cleanup on unmount.
  useEffect(
    () => () => {
      teardown();
      try {
        ctxRef.current?.close();
      } catch {
        /* ignore */
      }
      ctxRef.current = null;
    },
    [],
  );

  return null;
};

export default SnfAmbientAudio;
