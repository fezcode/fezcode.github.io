import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays a collection entry's audio sample, falling back to a short synthesised
 * chord built from the entry's own `freqs` / `synthType` when the file is
 * missing or the browser refuses to decode it.
 *
 * One <audio> element is reused for every entry and the "now playing" state is
 * driven by real media events, so the UI stays truthful if playback stalls,
 * fails, or the reader pauses from OS media keys.
 */
const useAudioSample = ({ enabled = true } = {}) => {
  const [playingId, setPlayingId] = useState(null);
  const elementRef = useRef(null);
  const audioCtxRef = useRef(null);
  const requestRef = useRef(null);

  const playSynth = useCallback((entry) => {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const freqs = entry.freqs?.length ? entry.freqs : [220, 330, 440];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startAt = ctx.currentTime + idx * 0.08;
        const stopAt = startAt + 0.7;

        osc.type = entry.synthType || 'sawtooth';
        osc.frequency.setValueAtTime(freq, startAt);
        gain.gain.setValueAtTime(0.14, startAt);
        gain.gain.exponentialRampToValueAtTime(0.001, stopAt);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAt);
        osc.stop(stopAt);
      });
    } catch {
      // A blocked or unavailable AudioContext is not worth surfacing.
    }
  }, []);

  const getElement = useCallback(() => {
    if (elementRef.current) return elementRef.current;

    const element = new Audio();
    element.preload = 'none';

    const clear = () => {
      requestRef.current = null;
      setPlayingId(null);
    };

    element.addEventListener('playing', () => {
      setPlayingId(requestRef.current?.id ?? null);
    });
    element.addEventListener('ended', clear);
    element.addEventListener('pause', clear);
    element.addEventListener('error', () => {
      const request = requestRef.current;
      clear();
      if (request) playSynth(request.entry);
    });

    elementRef.current = element;
    return element;
  }, [playSynth]);

  const stop = useCallback(() => {
    const element = elementRef.current;
    requestRef.current = null;
    setPlayingId(null);
    if (!element) return;
    element.pause();
    element.currentTime = 0;
  }, []);

  const play = useCallback(
    (entry) => {
      if (!enabled || !entry?.id) return;

      // Second click on the entry that is already sounding stops it.
      if (playingId === entry.id) {
        stop();
        return;
      }

      // Most genres have no recorded sample — go straight to the chord derived
      // from their spectrum rather than firing a request that will 404.
      if (!entry.audio) {
        playSynth(entry);
        return;
      }

      const element = getElement();
      const src = entry.audio;

      element.pause();
      element.currentTime = 0;
      requestRef.current = { id: entry.id, entry };
      element.src = src;

      const attempt = element.play();
      if (attempt?.catch) {
        attempt.catch(() => {
          // Autoplay rejections and decode failures both land here; the `error`
          // event does not fire for the former, so cover it explicitly.
          if (requestRef.current?.id !== entry.id) return;
          requestRef.current = null;
          setPlayingId(null);
          playSynth(entry);
        });
      }
    },
    [enabled, getElement, playSynth, playingId, stop],
  );

  useEffect(
    () => () => {
      const element = elementRef.current;
      if (element) {
        element.pause();
        element.removeAttribute('src');
        element.load();
      }
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state !== 'closed') ctx.close();
      elementRef.current = null;
      audioCtxRef.current = null;
    },
    [],
  );

  // Muting mid-playback should silence what is already sounding.
  useEffect(() => {
    if (!enabled) stop();
  }, [enabled, stop]);

  return { play, stop, playingId };
};

export default useAudioSample;
