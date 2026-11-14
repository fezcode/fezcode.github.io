import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as THREE from 'three';
import LexicalSculpture from './LexicalSculpture';
import { createSculptureScene } from './sculptureScene';
import { WordupActivityProvider } from './WordupActivityContext';

const tracked = vi.hoisted(() => ({
  renderers: [],
  environments: [],
  intersections: [],
  resizes: [],
  frames: new Map(),
  nextFrame: 0,
  now: 0,
  hidden: false,
  reduced: false,
  motionListeners: new Set(),
  bounds: {},
  media: null,
}));
vi.mock('three', async (original) => {
  const actual = await original();
  return {
    ...actual,
    WebGLRenderer: class {
      constructor(options = {}) {
        this.options = options;
        this.domElement = options.canvas || document.createElement('canvas');
        this.pixelRatio = 1;
        this.setPixelRatio = vi.fn((ratio) => {
          this.pixelRatio = ratio;
        });
        this.setSize = vi.fn((width, height) => {
          this.domElement.width = Math.round(width * this.pixelRatio);
          this.domElement.height = Math.round(height * this.pixelRatio);
        });
        this.render = vi.fn();
        this.info = { render: { calls: 4, triangles: 20160 } };
        this.dispose = vi.fn();
        tracked.renderers.push(this);
      }
    },
    PMREMGenerator: class {
      fromEquirectangular() {
        const environment = { texture: new actual.Texture(), dispose: vi.fn() };
        tracked.environments.push(environment);
        return environment;
      }
      dispose() {}
    },
  };
});

beforeEach(() => {
  tracked.renderers.length = 0;
  tracked.environments.length = 0;
  tracked.intersections.length = 0;
  tracked.resizes.length = 0;
  tracked.frames.clear();
  tracked.nextFrame = 0;
  tracked.now = 0;
  tracked.hidden = false;
  tracked.reduced = false;
  tracked.motionListeners.clear();
  tracked.bounds = {
    width: 750,
    height: 700,
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 750,
    bottom: 700,
  };
  vi.stubGlobal('WebGLRenderingContext', function WebGLRenderingContext() {});
  vi.stubGlobal('devicePixelRatio', 1);
  vi.stubGlobal('innerWidth', 1000);
  vi.stubGlobal('innerHeight', 800);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    const frame = ++tracked.nextFrame;
    tracked.frames.set(frame, callback);
    return frame;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((frame) =>
    tracked.frames.delete(frame),
  );
  vi.spyOn(performance, 'now').mockImplementation(() => tracked.now);
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => tracked.hidden);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => ({ ...tracked.bounds }),
  );
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.observe = vi.fn((target) => {
          this.target = target;
        });
        this.disconnect = vi.fn();
        tracked.intersections.push(this);
      }
    },
  );
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback) {
        this.callback = callback;
        this.observe = vi.fn((target) => {
          this.target = target;
        });
        this.disconnect = vi.fn();
        tracked.resizes.push(this);
      }
    },
  );
  tracked.media = {
    get matches() {
      return tracked.reduced;
    },
    addEventListener: vi.fn((_, callback) =>
      tracked.motionListeners.add(callback),
    ),
    removeEventListener: vi.fn((_, callback) =>
      tracked.motionListeners.delete(callback),
    ),
  };
  vi.stubGlobal('matchMedia', () => tracked.media);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect() {},
    createLinearGradient: () => ({ addColorStop() {} }),
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// This aria-hidden, noninteractive artwork has no semantic query targets.
// Keep SVG geometry inspection local to this renderer lifecycle test helper.
/* eslint-disable testing-library/no-node-access */
const inspectDecorativeSculpture = (root) => ({
  path: root.querySelector('svg path').getAttribute('d'),
  svg: root.querySelector('svg'),
  sculpture: root.querySelector('[data-sculpture-word]'),
});
/* eslint-enable testing-library/no-node-access */

const intersect = (
  isIntersecting,
  intersectionRatio = isIntersecting ? 1 : 0,
) => {
  const observer = tracked.intersections[0];
  act(() =>
    observer.callback([
      {
        target: observer.target,
        isIntersecting,
        intersectionRatio,
        boundingClientRect: { ...tracked.bounds },
      },
    ]),
  );
};

const frameAt = (time) => {
  tracked.now = time;
  const callbacks = [...tracked.frames.values()];
  tracked.frames.clear();
  act(() => callbacks.forEach((callback) => callback(time)));
};

const resizeTo = (width, height) => {
  Object.assign(tracked.bounds, {
    width,
    height,
    right: tracked.bounds.left + width,
    bottom: tracked.bounds.top + height,
  });
  const observer = tracked.resizes[0];
  act(() =>
    observer.callback([
      { target: observer.target, contentRect: { width, height } },
    ]),
  );
};

const hideDocument = (hidden) => {
  tracked.hidden = hidden;
  fireEvent(document, new Event('visibilitychange'));
};

describe('seeded sculpture lifecycle', () => {
  it('reuses its WebGL context when the word changes and releases replaced GPU resources', () => {
    const disposeGeometry = vi.spyOn(THREE.BufferGeometry.prototype, 'dispose');
    const view = render(<LexicalSculpture seed="pöskürmek" activeIndex={0} />);
    expect(tracked.renderers).toHaveLength(0);
    intersect(true);
    frameAt(0);
    expect(tracked.renderers).toHaveLength(1);
    expect(tracked.environments).toHaveLength(1);
    const firstCanvas = tracked.renderers[0].domElement;
    const firstFallback = inspectDecorativeSculpture(view.container).path;
    expect(firstCanvas).toBeInTheDocument();

    view.rerender(<LexicalSculpture seed="another word" activeIndex={7} />);
    expect(firstCanvas).toHaveStyle({ opacity: '0' });
    expect(inspectDecorativeSculpture(view.container).svg).toHaveStyle({
      opacity: '1',
    });
    frameAt(50);
    expect(tracked.renderers).toHaveLength(1);
    expect(tracked.environments).toHaveLength(1);
    expect(tracked.renderers[0].domElement).toBe(firstCanvas);
    expect(firstCanvas).toBeInTheDocument();
    expect(
      inspectDecorativeSculpture(view.container).sculpture,
    ).toHaveAttribute('data-sculpture-word', 'another word');
    expect(inspectDecorativeSculpture(view.container).path).not.toBe(
      firstFallback,
    );
    expect(disposeGeometry.mock.calls.length).toBeGreaterThanOrEqual(2);

    view.rerender(<LexicalSculpture seed="PÖSKÜRMEK" activeIndex={99} />);
    frameAt(100);
    expect(inspectDecorativeSculpture(view.container).path).toBe(firstFallback);
    const drawCount = tracked.renderers[0].render.mock.calls.length;
    view.rerender(<LexicalSculpture seed="PÖSKÜRMEK" activeIndex={1} />);
    expect(tracked.renderers[0].render).toHaveBeenCalledTimes(drawCount);

    view.unmount();
    expect(tracked.renderers[0].dispose).toHaveBeenCalledTimes(1);
    expect(tracked.environments[0].dispose).toHaveBeenCalledTimes(1);
    expect(firstCanvas).not.toBeInTheDocument();
    expect(disposeGeometry.mock.calls.length).toBeGreaterThanOrEqual(6);
    expect(tracked.intersections[0].disconnect).toHaveBeenCalledTimes(1);
    expect(tracked.resizes[0].disconnect).toHaveBeenCalledTimes(1);
    expect(tracked.media.removeEventListener).toHaveBeenCalledTimes(1);
    expect(tracked.frames.size).toBe(0);
  });

  it('waits for a positive intersection and defers hidden word and size updates', () => {
    const view = render(<LexicalSculpture seed="pöskürmek" />);
    expect(tracked.intersections[0].options.threshold).toEqual([0, 0.001]);
    intersect(true, 0);
    expect(tracked.renderers).toHaveLength(0);
    expect(tracked.frames.size).toBe(0);
    intersect(true, 0.001);
    expect(tracked.renderers).toHaveLength(0);
    expect(tracked.frames.size).toBe(1);
    frameAt(0);
    const renderer = tracked.renderers[0];
    expect(renderer.render).toHaveBeenCalledTimes(1);

    intersect(false);
    view.rerender(<LexicalSculpture seed="cancıl" />);
    resizeTo(800, 600);
    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(renderer.setSize).toHaveBeenCalledTimes(1);
    expect(renderer.domElement).toHaveStyle({ opacity: '0' });
    expect(inspectDecorativeSculpture(view.container).svg).toHaveStyle({
      opacity: '1',
    });
    expect(tracked.frames.size).toBe(0);

    tracked.now = 10000;
    intersect(true);
    frameAt(10000);
    expect(tracked.renderers).toHaveLength(1);
    expect(renderer.setSize).toHaveBeenLastCalledWith(800, 600, false);
    expect(renderer.render).toHaveBeenCalledTimes(2);
    expect(renderer.domElement).toHaveStyle({ opacity: '1' });
  });

  it('suspends document-hidden work and resumes the accumulated animation phase', () => {
    const view = render(<LexicalSculpture seed="pöskürmek" />);
    intersect(true);
    frameAt(0);
    frameAt(400);
    const renderer = tracked.renderers[0];
    const sculpture = renderer.render.mock.lastCall[0].getObjectByProperty(
      'isGroup',
      true,
    );
    const before = sculpture.rotation.y;
    const renders = renderer.render.mock.calls.length;
    hideDocument(true);
    expect(tracked.frames.size).toBe(0);
    expect(
      inspectDecorativeSculpture(view.container).sculpture,
    ).toHaveAttribute('data-sculpture-active', 'false');
    tracked.now = 10000;
    resizeTo(900, 700);
    expect(renderer.render).toHaveBeenCalledTimes(renders);
    expect(renderer.setSize).toHaveBeenCalledTimes(1);
    hideDocument(false);
    frameAt(10010);
    expect(renderer.render).toHaveBeenCalledTimes(renders + 1);
    expect(Math.abs(sculpture.rotation.y - before)).toBeLessThan(0.01);
    expect(renderer.setSize).toHaveBeenLastCalledWith(900, 700, false);
    expect(tracked.renderers).toHaveLength(1);
  });

  it('defers initialization while hidden and while the activity provider is paused', () => {
    tracked.hidden = true;
    const stage = (paused, seed = 'pöskürmek') => (
      <WordupActivityProvider paused={paused}>
        <LexicalSculpture seed={seed} />
      </WordupActivityProvider>
    );
    const view = render(stage(true));
    intersect(true);
    hideDocument(false);
    expect(tracked.renderers).toHaveLength(0);
    expect(tracked.frames.size).toBe(0);
    view.rerender(stage(false));
    frameAt(0);
    const renderer = tracked.renderers[0];
    expect(renderer.render).toHaveBeenCalledTimes(1);
    view.rerender(stage(true));
    view.rerender(stage(true, 'cancıl'));
    resizeTo(800, 600);
    expect(tracked.frames.size).toBe(0);
    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(renderer.setSize).toHaveBeenCalledTimes(1);
    expect(renderer.domElement).toHaveStyle({ opacity: '0' });
    tracked.now = 10000;
    view.rerender(stage(false, 'cancıl'));
    frameAt(10000);
    expect(renderer.render).toHaveBeenCalledTimes(2);
    expect(tracked.renderers).toHaveLength(1);
    expect(renderer.setSize).toHaveBeenLastCalledWith(800, 600, false);
  });

  it('draws reduced-motion updates once without RAF or redundant size paints', () => {
    tracked.reduced = true;
    const view = render(<LexicalSculpture seed="pöskürmek" />);
    intersect(true);
    const renderer = tracked.renderers[0];
    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(tracked.frames.size).toBe(0);
    resizeTo(750, 700);
    resizeTo(0, 0);
    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(
      inspectDecorativeSculpture(view.container).sculpture,
    ).toHaveAttribute('data-sculpture-active', 'false');
    resizeTo(750, 700);
    expect(renderer.render).toHaveBeenCalledTimes(1);
    expect(
      inspectDecorativeSculpture(view.container).sculpture,
    ).toHaveAttribute('data-sculpture-active', 'true');
    resizeTo(800, 600);
    expect(renderer.render).toHaveBeenCalledTimes(2);
    view.rerender(<LexicalSculpture seed="cancıl" />);
    expect(renderer.render).toHaveBeenCalledTimes(3);
    hideDocument(true);
    view.rerender(<LexicalSculpture seed="püfre" />);
    expect(renderer.render).toHaveBeenCalledTimes(3);
    hideDocument(false);
    expect(renderer.render).toHaveBeenCalledTimes(4);
    expect(tracked.frames.size).toBe(0);
    act(() => {
      tracked.reduced = false;
      tracked.motionListeners.forEach((listener) =>
        listener({ matches: false }),
      );
    });
    expect(tracked.frames.size).toBe(1);
  });

  it('uses event-driven viewport checks when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const view = render(<LexicalSculpture seed="pöskürmek" />);
    frameAt(0);
    const renderer = tracked.renderers[0];
    Object.assign(tracked.bounds, { top: 1000, bottom: 1700 });
    fireEvent.scroll(window);
    expect(tracked.frames.size).toBe(0);
    view.rerender(<LexicalSculpture seed="cancıl" />);
    expect(renderer.render).toHaveBeenCalledTimes(1);
    tracked.now = 10000;
    Object.assign(tracked.bounds, { top: 0, bottom: 700 });
    fireEvent.scroll(window);
    frameAt(10000);
    expect(renderer.render).toHaveBeenCalledTimes(2);
    expect(tracked.renderers).toHaveLength(1);
    view.unmount();
    fireEvent.scroll(window);
    fireEvent.resize(window);
    expect(tracked.frames.size).toBe(0);
  });

  it('caps drawing on a high-refresh display and forwards the latest profiling callback', () => {
    const first = vi.fn();
    const second = vi.fn();
    const view = render(<LexicalSculpture seed="pöskürmek" onRender={first} />);
    intersect(true);
    frameAt(0);
    expect(first).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenLastCalledWith(
      expect.objectContaining({
        calls: 4,
        triangles: 20160,
        width: 750,
        height: 700,
      }),
    );
    view.rerender(<LexicalSculpture seed="pöskürmek" onRender={second} />);
    for (let frame = 1; frame <= 120; frame += 1) frameAt((frame * 1000) / 120);
    const calls = tracked.renderers[0].render.mock.calls.length;
    expect(calls).toBeGreaterThan(15);
    expect(calls).toBeLessThanOrEqual(31);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(calls - 1);
    expect(tracked.renderers).toHaveLength(1);
  });

  it('keeps the vector fallback and releases observers after live setup fails', () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null);
    const view = render(<LexicalSculpture seed="pöskürmek" />);
    intersect(true);
    frameAt(0);
    expect(tracked.renderers[0].dispose).toHaveBeenCalledTimes(1);
    expect(tracked.intersections[0].disconnect).toHaveBeenCalledTimes(1);
    expect(tracked.resizes[0].disconnect).toHaveBeenCalledTimes(1);
    expect(tracked.frames.size).toBe(0);
    expect(inspectDecorativeSculpture(view.container).svg).toHaveStyle({
      opacity: '1',
    });
  });

  it('uses the word-specific vector geometry when WebGL is unavailable', () => {
    vi.stubGlobal('WebGLRenderingContext', undefined);
    vi.stubGlobal('WebGL2RenderingContext', undefined);
    const view = render(<LexicalSculpture seed="pöskürmek" />);
    const first = inspectDecorativeSculpture(view.container).path;
    expect(tracked.renderers).toHaveLength(0);
    expect(inspectDecorativeSculpture(view.container).svg).toHaveStyle({
      opacity: '1',
    });
    view.rerender(<LexicalSculpture seed="a different word" />);
    expect(inspectDecorativeSculpture(view.container).path).not.toBe(first);
    expect(tracked.renderers).toHaveLength(0);
  });

  it('renders a supplied export canvas at the exact seeded pose and disposes once', () => {
    const canvas = document.createElement('canvas');
    const studio = createSculptureScene({
      seed: 'pöskürmek',
      canvas,
      width: 700,
      height: 630,
      pixelRatio: 2,
      preserveDrawingBuffer: true,
    });
    expect(studio.renderer.domElement).toBe(canvas);
    expect(studio.renderer.options.preserveDrawingBuffer).toBe(true);
    expect(studio.renderer.setPixelRatio).toHaveBeenCalledWith(2);
    expect(studio.renderer.setSize).toHaveBeenLastCalledWith(700, 630, false);
    expect(studio.camera.aspect).toBe(700 / 630);
    expect(studio.camera.position.z).toBe(6.7);

    studio.render(4);
    expect(studio.sculpture.rotation.y).not.toBe(studio.parameters.pose[1]);
    studio.render(0);
    expect(studio.sculpture.rotation.toArray().slice(0, 3)).toEqual(
      studio.parameters.pose,
    );
    expect(studio.sculpture.position.y).toBe(0.04);
    expect(studio.setSeed('PÖSKÜRMEK')).toBe(false);
    studio.resize(400, 630);
    expect(studio.camera.position.z).toBe(8.2);

    studio.dispose();
    studio.dispose();
    expect(studio.renderer.dispose).toHaveBeenCalledTimes(1);
    expect(tracked.environments[0].dispose).toHaveBeenCalledTimes(1);
    expect(
      studio.sculpture.getObjectByProperty('isMesh', true),
    ).toBeUndefined();
  });

  it('propagates export setup failures and releases the partial renderer', () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null);
    expect(() => createSculptureScene({ seed: 'pöskürmek' })).toThrow(
      'Studio environment unavailable',
    );
    expect(tracked.renderers).toHaveLength(1);
    expect(tracked.renderers[0].dispose).toHaveBeenCalledTimes(1);
  });

  it('can batch scene updates without drawing and rejects identical resize work', () => {
    const studio = createSculptureScene({
      seed: 'pöskürmek',
      width: 700,
      height: 630,
      renderOnUpdate: false,
    });
    const { renderer } = studio;
    const material = studio.sculpture.getObjectByProperty(
      'isMesh',
      true,
    ).material;
    expect(renderer.render).not.toHaveBeenCalled();
    expect(studio.setSeed('cancıl')).toBe(true);
    expect(studio.sculpture.getObjectByProperty('isMesh', true).material).toBe(
      material,
    );
    const projection = vi.spyOn(studio.camera, 'updateProjectionMatrix');
    expect(studio.resize(700, 630)).toBe(false);
    expect(renderer.setSize).toHaveBeenCalledTimes(1);
    expect(projection).not.toHaveBeenCalled();
    expect(studio.resize(400, 630)).toBe(true);
    expect(renderer.setSize).toHaveBeenCalledTimes(2);
    expect(projection).toHaveBeenCalledTimes(1);
    expect(renderer.render).not.toHaveBeenCalled();
    studio.render(0);
    expect(renderer.render).toHaveBeenCalledTimes(1);
    studio.dispose();
  });
});
