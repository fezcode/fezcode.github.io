import { useCallback, useEffect, useRef, useState } from 'react';
import { findPreview } from './trackPreview';

/** Seconds of a clip to play. */
export const WINDOW_SECONDS = 10;

/**
 * Plays a ten-second excerpt of a track.
 *
 * Source order: the track's catalogue preview, then the genre's local sample if
 * it has one, then a chord synthesised from the genre's own spectrum. The
 * synth exists because most genres have neither a preview match nor a file, and
 * silence on press reads as a broken button.
 *
 * One <audio> element is reused, and playback state comes from real media
 * events so the UI stays truthful if a clip stalls or the reader pauses from OS
 * media keys.
 */
const useAudioSample = ({ enabled = true } = {}) => {
  // status: idle | resolving | playing | synth
  const [state, setState] = useState({ id: null, status: 'idle' });

  const elementRef = useRef(null);
  const audioCtxRef = useRef(null);
  const requestRef = useRef(null);
  // Guards against a slow lookup applying after the reader moved on.
  const tokenRef = useRef(0);

  const playSynth = useCallback((entry) => {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const freqs = entry?.freqs?.length ? entry.freqs : [220, 330, 440];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startAt = ctx.currentTime + idx * 0.08;
        const stopAt = startAt + 0.7;

        osc.type = entry?.synthType || 'sawtooth';
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

  const clear = useCallback(() => {
    requestRef.current = null;
    setState({ id: null, status: 'idle' });
  }, []);

  const getElement = useCallback(() => {
    if (elementRef.current) return elementRef.current;

    const element = new Audio();
    element.preload = 'metadata';
    element.crossOrigin = 'anonymous';

    // Seek to the window start once the clip's duration is known.
    element.addEventListener('loadedmetadata', () => {
      const request = requestRef.current;
      if (!request) return;
      const duration = Number.isFinite(element.duration) ? element.duration : 0;
      const explicit = request.startAt;
      const centred = Math.max(0, duration / 2 - WINDOW_SECONDS / 2);
      const start =
        explicit === null || explicit === undefined
          ? centred
          : Math.min(Math.max(0, explicit), Math.max(0, duration - 1));
      request.stopAt = duration
        ? Math.min(duration, start + WINDOW_SECONDS)
        : start + WINDOW_SECONDS;
      try {
        element.currentTime = start;
      } catch {
        // Some browsers refuse a seek before the clip is seekable; the window
        // then simply starts at zero.
      }
    });

    // Enforce the ten-second window.
    element.addEventListener('timeupdate', () => {
      const request = requestRef.current;
      if (!request?.stopAt) return;
      if (element.currentTime >= request.stopAt) {
        element.pause();
        element.currentTime = 0;
        clear();
      }
    });

    element.addEventListener('playing', () => {
      const request = requestRef.current;
      if (request) setState({ id: request.id, status: 'playing' });
    });
    element.addEventListener('ended', clear);
    element.addEventListener('pause', () => {
      // A pause driven by our own window stop has already cleared the request.
      if (requestRef.current) clear();
    });
    element.addEventListener('error', () => {
      const request = requestRef.current;
      requestRef.current = null;
      if (!request) return;
      setState({ id: request.id, status: 'synth' });
      playSynth(request.entry);
    });

    elementRef.current = element;
    return element;
  }, [clear, playSynth]);

  const stop = useCallback(() => {
    tokenRef.current += 1;
    requestRef.current = null;
    setState({ id: null, status: 'idle' });
    const element = elementRef.current;
    if (!element) return;
    element.pause();
    try {
      element.currentTime = 0;
    } catch {
      /* nothing to rewind */
    }
  }, []);

  /**
   * @param {{id: string, track?: object, entry?: object}} target
   */
  const play = useCallback(
    async (target) => {
      const { id, track, entry } = target || {};
      if (!enabled || !id) return;

      // Pressing the control that is already sounding stops it.
      if (state.id === id && state.status === 'playing') {
        stop();
        return;
      }

      stop();
      const token = tokenRef.current;
      setState({ id, status: 'resolving' });

      let src = null;
      let startAt = null;

      if (track?.title) {
        try {
          const preview = await findPreview(track);
          if (preview) {
            src = preview.url;
            startAt = track.start;
          }
        } catch {
          // Fall through to the local sample or the synth.
        }
      }

      if (tokenRef.current !== token) return; // superseded while resolving

      if (!src && entry?.audio) {
        src = entry.audio;
        startAt = 0;
      }

      if (!src) {
        setState({ id, status: 'synth' });
        playSynth(entry);
        return;
      }

      const element = getElement();
      requestRef.current = { id, startAt, stopAt: null, entry };
      element.src = src;

      const attempt = element.play();
      if (attempt?.catch) {
        attempt.catch(() => {
          // Autoplay rejections do not raise the `error` event.
          if (requestRef.current?.id !== id) return;
          requestRef.current = null;
          setState({ id, status: 'synth' });
          playSynth(entry);
        });
      }
    },
    [enabled, getElement, playSynth, state.id, state.status, stop],
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

  return {
    play,
    stop,
    activeId: state.id,
    status: state.status,
    playingId: state.status === 'playing' ? state.id : null,
  };
};

export default useAudioSample;
