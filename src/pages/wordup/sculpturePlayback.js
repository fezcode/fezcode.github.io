/**
 * Own animation time independently of WebGL and browser observers. Hidden or
 * paused time never advances the form; a new identity holds its pose for 350ms.
 */
export function createSculpturePlayback({
  render,
  requestFrame,
  cancelFrame,
  now,
  maxFps = 30,
  onState,
  visible = false,
  documentVisible = true,
  reducedMotion = false,
  paused = false,
}) {
  const state = { visible, documentVisible, reducedMotion, paused };
  const interval = 1000 / (Number.isFinite(maxFps) && maxFps > 0 ? maxFps : 30);
  let disposed = false;
  let dirty = true;
  let frame = null;
  let generation = 0;
  let activeMs = 0;
  let activeSince = null;
  let nextPaintAt = -Infinity;
  let lastElapsed = null;
  let renderCount = 0;

  const clock = () => now();
  const eligible = () =>
    !disposed && state.visible && state.documentVisible && !state.paused;
  const animating = () => eligible() && !state.reducedMotion;
  const elapsedAt = (time) =>
    Math.max(
      0,
      (activeMs +
        (activeSince === null ? 0 : Math.max(0, time - activeSince)) -
        350) /
        1000,
    );
  const getState = () => ({
    ...state,
    eligible: eligible(),
    animating: animating(),
    dirty,
    disposed,
    pendingFrame: frame !== null,
    elapsedSeconds: elapsedAt(clock()),
    renderCount,
  });
  const notify = () => onState?.(getState());
  const accumulate = (time) => {
    if (activeSince === null) return;
    activeMs += Math.max(0, time - activeSince);
    activeSince = Math.max(activeSince, time);
  };
  const cancel = () => {
    generation += 1;
    if (frame !== null) cancelFrame(frame);
    frame = null;
  };
  const paint = (elapsed) => {
    dirty = false;
    lastElapsed = elapsed;
    renderCount += 1;
    render(elapsed);
    notify();
  };
  const schedule = () => {
    if (!animating() || frame !== null) return;
    const scheduledGeneration = generation;
    frame = requestFrame((timestamp) => {
      // A canceled callback may still be delivered. It must not clear a newer
      // pending frame, draw, or restart the loop after pause/disposal.
      if (disposed || scheduledGeneration !== generation) return;
      frame = null;
      if (!animating()) return;
      const time = Number.isFinite(timestamp) ? timestamp : clock();
      accumulate(time);
      const elapsed = elapsedAt(time);
      if (
        time + 0.000001 >= nextPaintAt &&
        (dirty || elapsed !== lastElapsed)
      ) {
        // Preserve cadence when RAF timing is uneven, without catching up by
        // drawing multiple frames. The 350ms hold needs only one static draw.
        nextPaintAt = Number.isFinite(nextPaintAt)
          ? nextPaintAt +
            (Math.floor(Math.max(0, time - nextPaintAt) / interval) + 1) *
              interval
          : time + interval;
        paint(elapsed);
      }
      schedule();
    });
  };
  const reconcile = () => {
    if (!eligible()) return;
    if (state.reducedMotion) {
      if (dirty) paint(elapsedAt(clock()));
    } else schedule();
  };
  const setFlag = (name, value) => {
    if (disposed || state[name] === Boolean(value)) return;
    const time = clock();
    const wasAnimating = animating();
    accumulate(time);
    state[name] = Boolean(value);
    if (!animating()) {
      activeSince = null;
      cancel();
    } else if (!wasAnimating) {
      activeSince = time;
      nextPaintAt = -Infinity;
    }
    reconcile();
    notify();
  };
  const invalidate = ({ resetTime = false } = {}) => {
    if (disposed) return;
    dirty = true;
    if (resetTime) {
      activeMs = 0;
      activeSince = animating() ? clock() : null;
      lastElapsed = null;
    }
    reconcile();
    notify();
  };
  const dispose = () => {
    if (disposed) return;
    accumulate(clock());
    activeSince = null;
    disposed = true;
    cancel();
    notify();
  };

  if (animating()) activeSince = clock();
  reconcile();
  notify();
  return {
    setVisible: (value) => setFlag('visible', value),
    setDocumentVisible: (value) => setFlag('documentVisible', value),
    setReducedMotion: (value) => setFlag('reducedMotion', value),
    setPaused: (value) => setFlag('paused', value),
    invalidate,
    getState,
    dispose,
  };
}
