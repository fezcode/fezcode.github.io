import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { getSculptureFallback, getSculptureParameters } from './sculptureSeed';
import { createSculptureScene } from './sculptureScene';

function SculptureFallback({ id, hidden, parameters }) {
  const segments = useMemo(
    () => getSculptureFallback(parameters),
    [parameters],
  );
  return (
    <svg
      viewBox="0 0 640 560"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: hidden ? 0 : 1,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <linearGradient
          id={`${id}-metal`}
          x1="90"
          y1="90"
          x2="520"
          y2="390"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#172136" />
          <stop offset=".2" stopColor={parameters.pearl} />
          <stop offset=".35" stopColor="#f7f9ff" />
          <stop offset=".51" stopColor={parameters.accent} />
          <stop offset=".68" stopColor="#eef4ff" />
          <stop offset=".84" stopColor={parameters.pearl} />
          <stop offset="1" stopColor="#253047" />
        </linearGradient>
        <filter
          id={`${id}-shadow`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="17" />
        </filter>
      </defs>
      <ellipse
        cx="320"
        cy="448"
        rx="132"
        ry="18"
        fill={parameters.accent}
        opacity=".16"
        filter={`url(#${id}-shadow)`}
      />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {segments.map((segment, index) => (
          <g key={index}>
            <path
              d={segment.path}
              stroke="#263049"
              strokeWidth={segment.width + 3}
            />
            <path
              d={segment.path}
              stroke={`url(#${id}-metal)`}
              strokeWidth={segment.width}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function LexicalSculpture({ seed = 'wordup', className = '' }) {
  const host = useRef(null);
  const controller = useRef(null);
  const parameters = useMemo(() => getSculptureParameters(seed), [seed]);
  const latestParameters = useRef(parameters);
  latestParameters.current = parameters;
  const [ready, setReady] = useState(false);
  const id = useId().replace(/:/g, '');

  // The shared studio owns WebGL resources; React owns its canvas placement
  // and animation, including the brief hold on each exact seeded pose.
  useEffect(() => {
    const container = host.current;
    if (!container) return undefined;
    if (
      typeof window.WebGLRenderingContext === 'undefined' &&
      typeof window.WebGL2RenderingContext === 'undefined'
    )
      return undefined;
    let studio;
    let observer;
    let frame = 0;
    let disposed = false;
    let resize;
    let media;
    let motionChange;
    let identityStarted = performance.now();
    setReady(false);
    const release = () => {
      if (disposed) return;
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      if (resize) window.removeEventListener('resize', resize);
      if (media && motionChange)
        media.removeEventListener('change', motionChange);
      controller.current = null;
      studio?.dispose();
      studio?.renderer.domElement.remove();
    };
    try {
      const { width, height } = container.getBoundingClientRect();
      studio = createSculptureScene({
        seed: latestParameters.current.identity,
        width: width || 1,
        height: height || 1,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      });
      Object.assign(studio.renderer.domElement.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      });
      container.appendChild(studio.renderer.domElement);
      identityStarted = performance.now();
      media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
      let reduceMotion = media?.matches ?? false;
      const draw = (now) => {
        if (disposed) return;
        studio.render(
          reduceMotion ? 0 : Math.max(0, (now - identityStarted - 350) / 1000),
        );
      };
      controller.current = {
        setIdentity: (next) => {
          try {
            if (!studio.setSeed(next.identity)) return;
            identityStarted = performance.now();
            studio.renderer.domElement.style.opacity = '1';
            draw(identityStarted);
            setReady(true);
          } catch {
            studio.renderer.domElement.style.opacity = '0';
            setReady(false);
          }
        },
      };
      const tick = (now) => {
        draw(now);
        if (!disposed && !reduceMotion)
          frame = window.requestAnimationFrame(tick);
      };
      resize = () => {
        const dimensions = container.getBoundingClientRect();
        if (!dimensions.width || !dimensions.height || disposed) return;
        studio.resize(dimensions.width, dimensions.height);
        draw(performance.now());
      };
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(resize);
        observer.observe(container);
      } else window.addEventListener('resize', resize);
      motionChange = (event) => {
        reduceMotion = event.matches;
        window.cancelAnimationFrame(frame);
        draw(performance.now());
        if (!reduceMotion) frame = window.requestAnimationFrame(tick);
      };
      media?.addEventListener('change', motionChange);
      resize();
      if (!reduceMotion) frame = window.requestAnimationFrame(tick);
      setReady(true);
    } catch {
      release();
      setReady(false);
    }
    return release;
  }, []);

  useEffect(() => {
    controller.current?.setIdentity(parameters);
  }, [parameters]);

  return (
    <div
      ref={host}
      className={`lexical-sculpture ${className}`}
      aria-hidden="true"
      data-sculpture-word={parameters.identity}
      data-sculpture-family={parameters.family}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <SculptureFallback id={id} hidden={ready} parameters={parameters} />
    </div>
  );
}
