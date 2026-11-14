import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as THREE from 'three';
import LexicalSculpture from './LexicalSculpture';

const tracked = vi.hoisted(() => ({ renderers: [], environments: [] }));
vi.mock('three', async (original) => {
  const actual = await original();
  return {
    ...actual,
    WebGLRenderer: class {
      constructor() {
        this.domElement = document.createElement('canvas');
        this.setPixelRatio = vi.fn();
        this.setSize = vi.fn();
        this.render = vi.fn();
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
  vi.stubGlobal('WebGLRenderingContext', function WebGLRenderingContext() {});
  vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
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

describe('seeded sculpture lifecycle', () => {
  it('reuses its WebGL context when the word changes and releases replaced GPU resources', () => {
    const disposeGeometry = vi.spyOn(THREE.BufferGeometry.prototype, 'dispose');
    const view = render(<LexicalSculpture seed="pöskürmek" activeIndex={0} />);
    expect(tracked.renderers).toHaveLength(1);
    expect(tracked.environments).toHaveLength(1);
    const firstCanvas = tracked.renderers[0].domElement;
    const firstFallback = inspectDecorativeSculpture(view.container).path;
    expect(firstCanvas).toBeInTheDocument();

    view.rerender(<LexicalSculpture seed="another word" activeIndex={7} />);
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
    expect(inspectDecorativeSculpture(view.container).path).toBe(firstFallback);
    const drawCount = tracked.renderers[0].render.mock.calls.length;
    view.rerender(<LexicalSculpture seed="PÖSKÜRMEK" activeIndex={1} />);
    expect(tracked.renderers[0].render).toHaveBeenCalledTimes(drawCount);

    view.unmount();
    expect(tracked.renderers[0].dispose).toHaveBeenCalledTimes(1);
    expect(tracked.environments[0].dispose).toHaveBeenCalledTimes(1);
    expect(firstCanvas).not.toBeInTheDocument();
    expect(disposeGeometry.mock.calls.length).toBeGreaterThanOrEqual(6);
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
});
