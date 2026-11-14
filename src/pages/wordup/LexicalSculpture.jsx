import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getSculptureFallback, getSculptureParameters } from './sculptureSeed';
import { createSculptureScene } from './sculptureScene';
import { createSculpturePlayback } from './sculpturePlayback';
import { useWordupActivity } from './WordupActivityContext';

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

export default function LexicalSculpture({
  seed = 'wordup',
  className = '',
  onRender,
}) {
  const host = useRef(null);
  const controller = useRef(null);
  const parameters = useMemo(() => getSculptureParameters(seed), [seed]);
  const latestParameters = useRef(parameters);
  latestParameters.current = parameters;
  const renderObserver = useRef(onRender);
  renderObserver.current = onRender;
  const { paused } = useWordupActivity();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const [ready, setReady] = useState(false);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    const container = host.current;
    if (!container) return undefined;
    if (
      typeof window.WebGLRenderingContext === 'undefined' &&
      typeof window.WebGL2RenderingContext === 'undefined'
    )
      return undefined;

    let studio;
    let playback;
    let resizeObserver;
    let intersectionObserver;
    let media;
    let disposed = false;
    let viewportVisible = false;
    let hasSize = false;
    let dimensions;
    let appliedDimensions;
    let desiredIdentity = latestParameters.current.identity;
    let canvasReady = false;
    let lastActive;
    let lastInitialized;
    const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';
    const hasResizeObserver = typeof ResizeObserver !== 'undefined';
    setReady(false);

    const publishActivity = () => {
      const active =
        !disposed &&
        viewportVisible &&
        hasSize &&
        !document.hidden &&
        !pausedRef.current;
      const initialized = !disposed && Boolean(studio);
      if (lastActive !== active) {
        container.dataset.sculptureActive = String(active);
        lastActive = active;
      }
      if (lastInitialized !== initialized) {
        container.dataset.sculptureInitialized = String(initialized);
        lastInitialized = initialized;
      }
    };
    const syncVisible = () => {
      playback.setVisible(viewportVisible && hasSize);
      publishActivity();
    };
    const queueDimensions = (next) => {
      hasSize =
        Number.isFinite(next?.width) &&
        Number.isFinite(next?.height) &&
        next.width > 0 &&
        next.height > 0;
      if (!hasSize) return;
      if (
        dimensions?.width === next.width &&
        dimensions?.height === next.height
      )
        return;
      dimensions = { width: next.width, height: next.height };
      playback.invalidate();
    };
    const measure = () => queueDimensions(container.getBoundingClientRect());
    const fallbackVisibility = () => {
      const bounds = container.getBoundingClientRect();
      viewportVisible =
        bounds.width > 0 &&
        bounds.height > 0 &&
        bounds.bottom > 0 &&
        bounds.right > 0 &&
        bounds.top < window.innerHeight &&
        bounds.left < window.innerWidth;
      // Cancel before a size invalidation when a scroll has moved it away.
      if (!viewportVisible) playback.setVisible(false);
      queueDimensions(bounds);
      syncVisible();
    };
    const onWindowResize = () => {
      if (disposed) return;
      if (!hasIntersectionObserver) fallbackVisibility();
      else {
        measure();
        syncVisible();
      }
    };
    const onDocumentVisibility = () => {
      if (disposed) return;
      if (!document.hidden && viewportVisible) measure();
      playback.setDocumentVisible(!document.hidden);
      publishActivity();
    };
    const onMotionChange = (event) => playback.setReducedMotion(event.matches);
    const release = () => {
      if (disposed) return;
      disposed = true;
      playback?.dispose();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', onDocumentVisibility);
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('scroll', fallbackVisibility, true);
      if (media?.removeEventListener)
        media.removeEventListener('change', onMotionChange);
      else media?.removeListener?.(onMotionChange);
      controller.current = null;
      studio?.dispose();
      studio?.renderer.domElement.remove();
      publishActivity();
    };
    const draw = (elapsed) => {
      if (
        disposed ||
        !viewportVisible ||
        !hasSize ||
        document.hidden ||
        pausedRef.current
      )
        return;
      try {
        if (!studio) {
          studio = createSculptureScene({
            seed: latestParameters.current.identity,
            width: dimensions.width,
            height: dimensions.height,
            pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
            renderOnUpdate: false,
            onRender: renderObserver.current
              ? (stats) => renderObserver.current?.(stats)
              : undefined,
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
          appliedDimensions = dimensions;
        }
        if (studio.parameters.identity !== latestParameters.current.identity) {
          studio.setSeed(latestParameters.current.identity);
        }
        if (
          dimensions.width !== appliedDimensions.width ||
          dimensions.height !== appliedDimensions.height
        ) {
          studio.resize(dimensions.width, dimensions.height);
          appliedDimensions = dimensions;
        }
        studio.render(elapsed);
        if (!canvasReady) {
          canvasReady = true;
          studio.renderer.domElement.style.opacity = '1';
          setReady(true);
          publishActivity();
        }
      } catch {
        release();
        setReady(false);
      }
    };

    try {
      media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
      playback = createSculpturePlayback({
        render: draw,
        requestFrame: (callback) => window.requestAnimationFrame(callback),
        cancelFrame: (frame) => window.cancelAnimationFrame(frame),
        now: () => performance.now(),
        maxFps: 30,
        documentVisible: !document.hidden,
        reducedMotion: media?.matches ?? false,
        paused: pausedRef.current,
      });
      controller.current = {
        setIdentity: (next) => {
          if (disposed || next.identity === desiredIdentity) return;
          desiredIdentity = next.identity;
          if (studio) studio.renderer.domElement.style.opacity = '0';
          if (canvasReady) {
            canvasReady = false;
            setReady(false);
          }
          playback.invalidate({ resetTime: true });
        },
        setPaused: (next) => {
          if (disposed) return;
          if (!next && viewportVisible) measure();
          playback.setPaused(next);
          publishActivity();
        },
      };
      if (hasResizeObserver) {
        resizeObserver = new ResizeObserver((entries) => {
          if (disposed) return;
          const entry = entries?.find((item) => item.target === container);
          if (entry?.contentRect) queueDimensions(entry.contentRect);
          else measure();
          syncVisible();
        });
        resizeObserver.observe(container);
      }
      document.addEventListener('visibilitychange', onDocumentVisibility);
      if (media?.addEventListener)
        media.addEventListener('change', onMotionChange);
      else media?.addListener?.(onMotionChange);
      if (!hasIntersectionObserver || !hasResizeObserver)
        window.addEventListener('resize', onWindowResize, { passive: true });
      if (hasIntersectionObserver) {
        intersectionObserver = new IntersectionObserver(
          (entries) => {
            if (disposed) return;
            const entry = entries.find((item) => item.target === container);
            if (!entry) return;
            viewportVisible =
              entry.isIntersecting && entry.intersectionRatio > 0;
            if (!viewportVisible) playback.setVisible(false);
            else
              queueDimensions(
                entry.boundingClientRect || container.getBoundingClientRect(),
              );
            syncVisible();
          },
          { threshold: [0, 0.001] },
        );
        intersectionObserver.observe(container);
      } else {
        window.addEventListener('scroll', fallbackVisibility, {
          passive: true,
          capture: true,
        });
        fallbackVisibility();
      }
      publishActivity();
    } catch {
      release();
      setReady(false);
    }
    return release;
  }, []);

  // Layout updates hide the previous word's canvas before the browser paints.
  useLayoutEffect(() => {
    controller.current?.setIdentity(parameters);
  }, [parameters]);
  useLayoutEffect(() => {
    controller.current?.setPaused(paused);
  }, [paused]);

  return (
    <div
      ref={host}
      className={`lexical-sculpture ${className}`}
      aria-hidden="true"
      data-sculpture-word={parameters.identity}
      data-sculpture-family={parameters.family}
      data-sculpture-active="false"
      data-sculpture-initialized="false"
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
