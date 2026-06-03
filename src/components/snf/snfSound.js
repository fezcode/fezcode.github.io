/**
 * Tiny UI blip for the terminal, synthesised on a shared AudioContext.
 * Used when the `beeps` setting is enabled. No-ops gracefully if Web Audio
 * is unavailable or before any user gesture.
 */
let ctx = null;

export function playBeep(volume = 0.3, freq = 660) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    const v = Math.max(0, Math.min(0.3, volume * 0.4));
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(v, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    /* ignore */
  }
}
