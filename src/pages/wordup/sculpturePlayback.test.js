import { describe, expect, it, vi } from 'vitest';
import { createSculpturePlayback } from './sculpturePlayback';

const harness = (options = {}) => {
  let time = 0;
  let nextId = 1;
  const callbacks = new Map();
  const render = vi.fn();
  const requestFrame = vi.fn((callback) => {
    const id = nextId++;
    callbacks.set(id, callback);
    return id;
  });
  const cancelFrame = vi.fn((id) => callbacks.delete(id));
  const playback = createSculpturePlayback({
    render,
    requestFrame,
    cancelFrame,
    now: () => time,
    ...options,
  });
  return {
    playback,
    render,
    requestFrame,
    cancelFrame,
    callbacks,
    setTime: (value) => {
      time = value;
    },
    frameAt: (value) => {
      time = value;
      const pending = [...callbacks.values()];
      callbacks.clear();
      pending.forEach((callback) => callback(time));
    },
  };
};

describe('sculpture playback scheduling', () => {
  it('does no work before visibility is confirmed and keeps at most one RAF', () => {
    const h = harness();
    expect(h.callbacks.size).toBe(0);
    expect(h.render).not.toHaveBeenCalled();
    h.playback.invalidate();
    expect(h.callbacks.size).toBe(0);
    h.playback.setVisible(true);
    h.playback.invalidate();
    h.playback.invalidate();
    expect(h.callbacks.size).toBe(1);
    h.frameAt(0);
    expect(h.render).toHaveBeenCalledWith(0);
    expect(h.callbacks.size).toBe(1);
  });

  it('holds a new seeded pose for 350ms of active time without repainting identical frames', () => {
    const h = harness({ visible: true });
    h.frameAt(0);
    h.frameAt(100);
    h.frameAt(349);
    h.frameAt(350);
    expect(h.render).toHaveBeenCalledTimes(1);
    h.frameAt(384);
    expect(h.render).toHaveBeenLastCalledWith(0.034);
    h.playback.invalidate({ resetTime: true });
    h.frameAt(420);
    expect(h.render).toHaveBeenLastCalledWith(0);
    h.frameAt(734);
    expect(h.render).toHaveBeenLastCalledWith(0);
    h.frameAt(768);
    expect(h.render).toHaveBeenLastCalledWith(0.034);
  });

  it('caps slow art at 30fps rather than rendering on every display refresh', () => {
    const h = harness({ visible: true });
    for (let frame = 0; frame <= 120; frame += 1)
      h.frameAt(frame * (1000 / 120));
    const before = h.render.mock.calls.length;
    for (let frame = 121; frame <= 240; frame += 1)
      h.frameAt(frame * (1000 / 120));
    expect(h.render.mock.calls.length - before).toBeLessThanOrEqual(31);
    expect(h.render.mock.calls.length - before).toBeGreaterThanOrEqual(29);
    expect(h.callbacks.size).toBe(1);
  });

  it('freezes active time offscreen and while the document is hidden, resuming without a phase jump', () => {
    const h = harness({ visible: true });
    h.frameAt(0);
    h.frameAt(1000);
    expect(h.render).toHaveBeenLastCalledWith(0.65);
    h.playback.setVisible(false);
    expect(h.callbacks.size).toBe(0);
    h.setTime(61000);
    h.playback.setVisible(true);
    h.frameAt(61000);
    expect(h.render).toHaveBeenLastCalledWith(0.65);
    h.frameAt(61100);
    expect(h.render).toHaveBeenLastCalledWith(0.75);
    h.playback.setDocumentVisible(false);
    expect(h.callbacks.size).toBe(0);
    h.setTime(121100);
    h.playback.setDocumentVisible(true);
    h.frameAt(121100);
    expect(h.render).toHaveBeenLastCalledWith(0.75);
  });

  it('redraws dirty reduced-motion art only while eligible and never queues RAF', () => {
    const h = harness({ reducedMotion: true });
    h.playback.invalidate({ resetTime: true });
    expect(h.render).not.toHaveBeenCalled();
    h.playback.setVisible(true);
    expect(h.render).toHaveBeenCalledTimes(1);
    h.playback.setVisible(false);
    h.playback.invalidate();
    expect(h.render).toHaveBeenCalledTimes(1);
    h.playback.setVisible(true);
    expect(h.render).toHaveBeenCalledTimes(2);
    h.playback.setPaused(true);
    h.playback.invalidate();
    expect(h.render).toHaveBeenCalledTimes(2);
    h.playback.setPaused(false);
    expect(h.render).toHaveBeenCalledTimes(3);
    expect(h.requestFrame).not.toHaveBeenCalled();
  });

  it('freezes reduced-motion phase and keeps paused invalidations dirty until resume', () => {
    const h = harness({ visible: true });
    h.frameAt(0);
    h.frameAt(1000);
    h.playback.setReducedMotion(true);
    expect(h.callbacks.size).toBe(0);
    h.setTime(9000);
    h.playback.invalidate();
    expect(h.render).toHaveBeenLastCalledWith(0.65);
    h.playback.setPaused(true);
    h.playback.invalidate({ resetTime: true });
    expect(h.playback.getState().dirty).toBe(true);
    expect(h.render).toHaveBeenLastCalledWith(0.65);
    h.playback.setPaused(false);
    expect(h.render).toHaveBeenLastCalledWith(0);
    h.playback.setReducedMotion(false);
    expect(h.callbacks.size).toBe(1);
  });

  it('ignores stale callbacks without clearing a newer frame or requeueing after disposal', () => {
    const h = harness({ visible: true });
    const old = [...h.callbacks.values()][0];
    h.playback.setPaused(true);
    h.playback.setPaused(false);
    expect(h.callbacks.size).toBe(1);
    old(1000);
    expect(h.render).not.toHaveBeenCalled();
    expect(h.callbacks.size).toBe(1);
    const current = [...h.callbacks.values()][0];
    h.playback.dispose();
    h.playback.dispose();
    current(2000);
    h.playback.setVisible(true);
    h.playback.invalidate();
    expect(h.callbacks.size).toBe(0);
    expect(h.render).not.toHaveBeenCalled();
    expect(h.playback.getState().disposed).toBe(true);
  });

  it('does not requeue when the render callback pauses playback', () => {
    const h = harness({ visible: true });
    h.render.mockImplementation(() => h.playback.setPaused(true));
    h.frameAt(0);
    expect(h.render).toHaveBeenCalledTimes(1);
    expect(h.callbacks.size).toBe(0);
  });
});
