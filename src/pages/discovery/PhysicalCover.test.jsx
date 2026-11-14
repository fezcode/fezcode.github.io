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
  contexts: [],
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
  gpu.contexts.length = 0;
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
    function (type) {
      if (type !== '2d') return null;
      const context = {
        fillRect: vi.fn(),
        fillText: vi.fn(),
        drawImage: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        measureText: (text) => ({ width: text.length * 16 }),
        createRadialGradient: () => ({ addColorStop: vi.fn() }),
        createLinearGradient: () => ({ addColorStop: vi.fn() }),
      };
      gpu.contexts.push({ canvas: this, context });
      return context;
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

  it.each([
    ['game', 460, 215],
    ['game', 600, 900],
    ['book', 900, 1800],
    ['music', 1200, 1200],
    ['music', 600, 900],
  ])(
    'preserves the complete %s artwork at %i × %i without stretching',
    (category, width, height) => {
      render(<PhysicalCover entry={{ ...entry, category }} />);
      const loaded = gpu.loads[0];
      loaded.texture.image = { width, height };
      act(() => loaded.onLoad(loaded.texture));
      flushFrame();
      expect(gpu.loads).toHaveLength(1);
      const { canvas, context } = gpu.contexts.find(
        ({ context }) => context.drawImage.mock.calls.length,
      );
      const [image, left, top, drawnWidth, drawnHeight] =
        context.drawImage.mock.calls[0];
      // The five-argument draw call uses the entire source, including titles
      // at its edges. Bounds and aspect checks catch cropped or stretched art.
      expect(context.drawImage.mock.calls[0]).toHaveLength(5);
      expect(image).toBe(loaded.texture.image);
      expect(left).toBeGreaterThanOrEqual(-0.001);
      expect(top).toBeGreaterThanOrEqual(-0.001);
      expect(left + drawnWidth).toBeLessThanOrEqual(canvas.width + 0.001);
      expect(top + drawnHeight).toBeLessThanOrEqual(canvas.height + 0.001);
      expect(drawnWidth / drawnHeight).toBeCloseTo(width / height, 5);
      expect(
        Math.min(
          Math.abs(drawnWidth - canvas.width),
          Math.abs(drawnHeight - canvas.height),
        ),
      ).toBeLessThan(0.001);
      expect(gpu.frames.size).toBe(0);
    },
  );

  it('crops artwork only when the entry explicitly requests a filled cover', () => {
    render(
      <PhysicalCover
        entry={{ ...entry, coverFit: 'cover', imagePosition: '0% 50%' }}
      />,
    );
    const loaded = gpu.loads[0];
    loaded.texture.image = { width: 460, height: 215 };
    act(() => loaded.onLoad(loaded.texture));
    const { canvas, context } = gpu.contexts.find(
      ({ context }) => context.drawImage.mock.calls.length,
    );
    const [, left, top, width, height] = context.drawImage.mock.calls[0];
    expect(left).toBeCloseTo(0, 10);
    expect(top).toBeCloseTo(0, 10);
    expect(height).toBe(canvas.height);
    expect(width).toBeGreaterThan(canvas.width);
    expect(width / height).toBeCloseTo(460 / 215, 5);
  });

  it('uses the fallback image if a loaded artwork cannot be painted safely', () => {
    render(<PhysicalCover entry={entry} />);
    const originalGetContext =
      HTMLCanvasElement.prototype.getContext.getMockImplementation();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      function (type) {
        const context = originalGetContext.call(this, type);
        context.drawImage.mockImplementationOnce(() => {
          throw new DOMException('Cross-origin artwork', 'SecurityError');
        });
        return context;
      },
    );
    act(() => gpu.loads[0].onLoad(gpu.loads[0].texture));
    expect(gpu.loads[1].url).toBe(entry.fallbackCover);
    expect(wrapper()).toHaveAttribute('data-renderer', 'webgl');
  });

  it('disposes the fitted artwork with the physical scene', () => {
    const { unmount } = render(<PhysicalCover entry={entry} />);
    act(() => gpu.loads[0].onLoad(gpu.loads[0].texture));
    flushFrame();
    const { canvas } = gpu.contexts.find(
      ({ context }) => context.drawImage.mock.calls.length,
    );
    let fitted;
    gpu.renderers[0].scene.traverse((object) => {
      if (object.material?.map?.image === canvas) fitted = object.material.map;
    });
    expect(fitted).toBeDefined();
    const dispose = vi.spyOn(fitted, 'dispose');
    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it('occludes the disc hub behind the closed lid and reveals it when opened', () => {
    const { rerender } = render(<PhysicalCover entry={entry} reducedMotion />);
    flushFrame();
    const renderer = gpu.renderers[0];
    const [, lid] = renderer.scene.getObjectsByProperty('isGroup', true);
    const front = lid
      .getObjectsByProperty('isMesh', true)
      .find(
        (object) =>
          object.geometry?.type === 'PlaneGeometry' && object.position.z > 0,
      );
    const hub = renderer.scene
      .getObjectsByProperty('isMesh', true)
      .find(
        (object) =>
          object.geometry.type === 'CylinderGeometry' &&
          object.geometry.parameters.radiusTop === 0.068,
      );
    const firstSurface = () => {
      const direction = hub
        .getWorldPosition(new THREE.Vector3())
        .sub(renderer.camera.position)
        .normalize();
      return new THREE.Raycaster(
        renderer.camera.position,
        direction,
      ).intersectObjects([front, hub], false)[0]?.object;
    };
    expect(new THREE.Box3().setFromObject(hub).max.z).toBeLessThan(
      front.getWorldPosition(new THREE.Vector3()).z - 0.001,
    );
    expect(firstSurface()).toBe(front);
    rerender(<PhysicalCover entry={entry} open reducedMotion />);
    flushFrame();
    expect(firstSurface()).toBe(hub);
  });

  it('reuses game artwork for its cover, printed disc and illustrated notes without extra image requests', () => {
    const { unmount } = render(
      <PhysicalCover entry={entry} open reducedMotion />,
    );
    const loaded = gpu.loads[0];
    act(() => loaded.onLoad(loaded.texture));
    flushFrame();
    expect(gpu.loads).toHaveLength(1);
    const scene = gpu.renderers[0].scene;
    const [, lid] = scene.getObjectsByProperty('isGroup', true);
    const front = lid
      .getObjectsByProperty('isMesh', true)
      .find(
        (object) =>
          object.geometry?.type === 'PlaneGeometry' && object.position.z > 0,
      );
    const notes = lid
      .getObjectsByProperty('isMesh', true)
      .find(
        (object) =>
          object.geometry?.type === 'PlaneGeometry' && object.position.z < 0,
      );
    const disc = scene
      .getObjectsByProperty('isMesh', true)
      .find((object) => object.geometry.type === 'RingGeometry');
    const textures = [
      front.material.map,
      notes.material.map,
      disc.material.map,
    ];
    expect(new Set(textures).size).toBe(3);
    for (const texture of textures) {
      const drawing = gpu.contexts.find(
        ({ canvas, context }) =>
          canvas === texture.image && context.drawImage.mock.calls.length,
      );
      expect(drawing).toBeDefined();
      expect(drawing.context.drawImage.mock.calls[0][0]).toBe(
        loaded.texture.image,
      );
      expect(texture.colorSpace).toBe(THREE.SRGBColorSpace);
    }
    const dispose = textures.map((texture) => vi.spyOn(texture, 'dispose'));
    unmount();
    dispose.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
  });

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
