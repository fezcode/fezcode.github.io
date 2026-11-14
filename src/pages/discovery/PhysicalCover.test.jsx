import React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import PhysicalCover from './PhysicalCover';

const gpu = vi.hoisted(() => ({
  renderers: [],
  loads: [],
  observers: [],
  frames: new Map(),
  nextFrame: 0,
  rendererFails: false,
  width: 650,
  height: 418,
}));

// Keep geometry, materials, camera projection and resource ownership real.
// Only the hardware boundary is replaced; jsdom has no WebGL context.
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal();
  class Renderer {
    constructor({ canvas }) {
      if (gpu.rendererFails) throw new Error('WebGL context unavailable');
      this.domElement = canvas;
      this.shadowMap = {};
      this.capabilities = { getMaxAnisotropy: () => 8 };
      this.setPixelRatio = vi.fn();
      this.setClearColor = vi.fn();
      this.setSize = vi.fn();
      this.dispose = vi.fn();
      this.forceContextLoss = vi.fn();
      this.render = vi.fn((scene, camera) => {
        scene.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        this.scene = scene;
        this.camera = camera;
      });
      gpu.renderers.push(this);
    }
  }
  class EnvironmentGenerator {
    fromScene() {
      return { texture: new actual.Texture(), dispose: vi.fn() };
    }
    dispose = vi.fn();
  }
  class ArtworkLoader {
    setCrossOrigin() {}
    load(url, onLoad, _, onError) {
      const texture = new actual.Texture({ width: 600, height: 900 });
      vi.spyOn(texture, 'dispose');
      gpu.loads.push({ url, onLoad, onError, texture });
      return texture;
    }
  }
  return {
    ...actual,
    WebGLRenderer: Renderer,
    PMREMGenerator: EnvironmentGenerator,
    TextureLoader: ArtworkLoader,
  };
});
vi.mock('three/examples/jsm/environments/RoomEnvironment.js', () => ({
  RoomEnvironment: class {
    dispose = vi.fn();
  },
}));
vi.mock('three/examples/jsm/lights/RectAreaLightUniformsLib.js', () => ({
  RectAreaLightUniformsLib: { init: vi.fn() },
}));

const entry = {
  id: 'game/example',
  title: 'A physical case',
  category: 'game',
  categoryLabel: 'Game',
  cover: '/actual-art.webp',
  fallbackCover: '/fallback.svg',
  description: 'A printed note about this discovery.',
  rating: 4,
  date: '2026-11-14',
};
const wrapper = () =>
  screen.getByRole('img', { name: /A physical case, Game cover/ });
const fallback = <div>Static case fallback</div>;

function flushFrame(time = 2000) {
  const callbacks = [...gpu.frames.values()];
  gpu.frames.clear();
  act(() => callbacks.forEach((callback) => callback(time)));
}

beforeEach(() => {
  gpu.renderers.length = 0;
  gpu.loads.length = 0;
  gpu.observers.length = 0;
  gpu.frames.clear();
  gpu.nextFrame = 0;
  gpu.rendererFails = false;
  gpu.width = 650;
  gpu.height = 418;
  vi.stubGlobal('WebGL2RenderingContext', class {});
  vi.stubGlobal('requestAnimationFrame', (callback) => {
    const id = ++gpu.nextFrame;
    gpu.frames.set(id, callback);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id) => gpu.frames.delete(id));
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback) {
        this.callback = callback;
        this.observe = vi.fn();
        this.disconnect = vi.fn();
        gpu.observers.push(this);
      }
    },
  );
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  vi.spyOn(performance, 'now').mockReturnValue(0);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => ({
      width: gpu.width,
      height: gpu.height,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: gpu.width,
      bottom: gpu.height,
    }),
  );
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    (type) => {
      if (type !== '2d') return null;
      return {
        fillRect: vi.fn(),
        fillText: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        measureText: (text) => ({ width: text.length * 16 }),
        createRadialGradient: () => ({ addColorStop: vi.fn() }),
      };
    },
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('physical discovery covers', () => {
  it('keeps a readable supplied case when WebGL is unavailable', () => {
    vi.stubGlobal('WebGL2RenderingContext', undefined);
    render(<PhysicalCover entry={entry} open fallback={fallback} />);
    expect(wrapper()).toHaveAttribute('data-renderer', 'static');
    expect(wrapper()).toHaveAccessibleName(/open to its contents/);
    expect(screen.getByText('Static case fallback')).toBeVisible();
    expect(gpu.renderers).toHaveLength(0);
    expect(gpu.frames.size).toBe(0);
  });

  it('falls back when a browser advertises WebGL but cannot create a context', () => {
    gpu.rendererFails = true;
    render(<PhysicalCover entry={entry} fallback={fallback} />);
    expect(wrapper()).toHaveAttribute('data-renderer', 'static');
    expect(screen.getByText('Static case fallback')).toBeVisible();
    expect(gpu.frames.size).toBe(0);
    expect(gpu.observers).toHaveLength(0);
  });

  it('renders only while invalidated and reuses the renderer for hinge changes', () => {
    const { rerender } = render(
      <PhysicalCover entry={entry} open fallback={fallback} />,
    );
    expect(wrapper()).toHaveAttribute('data-renderer', 'webgl');
    expect(gpu.frames.size).toBe(1);
    flushFrame();
    expect(gpu.renderers[0].render).toHaveBeenCalledTimes(1);
    expect(gpu.frames.size).toBe(0);
    rerender(<PhysicalCover entry={entry} open={false} fallback={fallback} />);
    expect(gpu.renderers).toHaveLength(1);
    expect(gpu.frames.size).toBe(1);
    flushFrame();
    expect(gpu.renderers[0].render).toHaveBeenCalledTimes(2);
    expect(gpu.frames.size).toBe(0);
    const [, lid] = gpu.renderers[0].scene.getObjectsByProperty(
      'isGroup',
      true,
    );
    expect(lid.rotation.y).toBe(0);
  });

  it.each(['game', 'book', 'music'])(
    'keeps the opened %s case inside wide and narrow stage bounds',
    (category) => {
      render(
        <PhysicalCover
          entry={{ ...entry, category }}
          open
          reducedMotion
          fallback={fallback}
        />,
      );
      flushFrame();
      const renderer = gpu.renderers[0];
      const assertFraming = () => {
        const object = renderer.scene.getObjectByProperty('isGroup', true);
        const box = new THREE.Box3().setFromObject(object);
        let largestVertical = 0;
        for (const x of [box.min.x, box.max.x])
          for (const y of [box.min.y, box.max.y])
            for (const z of [box.min.z, box.max.z]) {
              const point = new THREE.Vector3(x, y, z).project(renderer.camera);
              expect(Math.abs(point.x)).toBeLessThan(0.91);
              expect(Math.abs(point.y)).toBeLessThan(0.91);
              largestVertical = Math.max(largestVertical, Math.abs(point.y));
            }
        return largestVertical;
      };
      expect(assertFraming()).toBeGreaterThan(0.5);
      gpu.width = 390;
      gpu.height = 490;
      act(() => gpu.observers[0].callback());
      flushFrame();
      assertFraming();
      expect(renderer.setSize).toHaveBeenLastCalledWith(390, 490, false);
    },
  );

  it('tries local fallback artwork and releases the scene if both sources fail', () => {
    const { unmount } = render(
      <PhysicalCover entry={entry} fallback={fallback} />,
    );
    expect(gpu.loads[0].url).toBe('/actual-art.webp');
    act(() => gpu.loads[0].onError());
    expect(gpu.loads[1].url).toBe('/fallback.svg');
    act(() => gpu.loads[1].onError());
    expect(wrapper()).toHaveAttribute('data-renderer', 'static');
    expect(gpu.renderers[0].dispose).toHaveBeenCalledTimes(1);
    expect(gpu.frames.size).toBe(0);
    unmount();
    expect(gpu.renderers[0].dispose).toHaveBeenCalledTimes(1);
  });

  it('recovers from context loss without keeping animation or resize work alive', () => {
    const { unmount } = render(
      <PhysicalCover entry={entry} open fallback={fallback} />,
    );
    const event = new Event('webglcontextlost', { cancelable: true });
    fireEvent(gpu.renderers[0].domElement, event);
    expect(event.defaultPrevented).toBe(true);
    expect(wrapper()).toHaveAttribute('data-renderer', 'static');
    expect(screen.getByText('Static case fallback')).toBeVisible();
    expect(gpu.renderers[0].dispose).toHaveBeenCalledTimes(1);
    expect(gpu.renderers[0].forceContextLoss).not.toHaveBeenCalled();
    expect(gpu.observers[0].disconnect).toHaveBeenCalledTimes(1);
    expect(gpu.frames.size).toBe(0);
    unmount();
    expect(gpu.renderers[0].dispose).toHaveBeenCalledTimes(1);
  });

  it('disposes the old renderer and pending artwork when the entry changes', () => {
    const { rerender, unmount } = render(
      <PhysicalCover entry={entry} fallback={fallback} />,
    );
    rerender(
      <PhysicalCover
        entry={{
          ...entry,
          id: 'book/other',
          category: 'book',
          title: 'Another cover',
        }}
        fallback={fallback}
      />,
    );
    expect(gpu.renderers).toHaveLength(2);
    expect(gpu.renderers[0].dispose).toHaveBeenCalledTimes(1);
    expect(gpu.loads[0].texture.dispose).toHaveBeenCalled();
    act(() => gpu.loads[0].onLoad(gpu.loads[0].texture));
    expect(gpu.loads[0].texture.dispose.mock.calls.length).toBeGreaterThan(1);
    unmount();
    expect(gpu.renderers[1].dispose).toHaveBeenCalledTimes(1);
    expect(gpu.frames.size).toBe(0);
  });
});
