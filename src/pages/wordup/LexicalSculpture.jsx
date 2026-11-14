import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createSculptureGeometry,
  getSculptureFallback,
  getSculptureParameters,
} from './sculptureSeed';

// Broad studio softboxes and a narrow cobalt strip produce real metal
// reflections without downloading an environment image.
function makeEnvironment(renderer) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Studio environment unavailable');
  context.fillStyle = '#141d30';
  context.fillRect(0, 0, 1024, 512);
  const wash = context.createLinearGradient(0, 0, 0, 512);
  wash.addColorStop(0, '#9da9bc');
  wash.addColorStop(0.42, '#293141');
  wash.addColorStop(1, '#e7e9ef');
  context.fillStyle = wash;
  context.fillRect(0, 0, 1024, 512);
  context.fillStyle = '#ffffff';
  context.fillRect(72, 60, 105, 345);
  context.fillRect(610, 40, 210, 130);
  context.fillStyle = '#c6d4ff';
  context.fillRect(873, 140, 38, 275);
  context.fillStyle = '#536ce8';
  context.fillRect(432, 80, 23, 340);
  context.fillStyle = '#101724';
  context.fillRect(195, 100, 75, 330);
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  const generator = new THREE.PMREMGenerator(renderer);
  try {
    return generator.fromEquirectangular(texture);
  } finally {
    texture.dispose();
    generator.dispose();
  }
}

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

  // The scene and environment belong to the component lifetime. Switching
  // words replaces only geometry and material uniforms, never the context.
  useEffect(() => {
    const container = host.current;
    if (!container) return undefined;
    if (
      typeof window.WebGLRenderingContext === 'undefined' &&
      typeof window.WebGL2RenderingContext === 'undefined'
    )
      return undefined;

    let renderer;
    let environment;
    let observer;
    let frame = 0;
    let disposed = false;
    let resize;
    let media;
    let motionChange;
    let geometries = [];
    const materials = [];
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
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      environment?.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.22;
      Object.assign(renderer.domElement.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      });
      container.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
      camera.position.set(0, 0.05, 6.7);
      environment = makeEnvironment(renderer);
      scene.environment = environment.texture;
      scene.add(new THREE.HemisphereLight(0xf3f5ff, 0x27364f, 2.3));
      const key = new THREE.DirectionalLight(0xffffff, 4);
      key.position.set(-4, 5, 5);
      scene.add(key);
      const edgeLight = new THREE.DirectionalLight(0x99aaff, 3.2);
      edgeLight.position.set(4, -1, -3);
      scene.add(edgeLight);
      const metal = new THREE.MeshPhysicalMaterial({
        color: 0xdde3f4,
        metalness: 0.76,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        iridescence: 0.8,
        iridescenceIOR: 1.46,
        iridescenceThicknessRange: [150, 440],
        transmission: 0.12,
        thickness: 0.35,
        envMapIntensity: 1.3,
        side: THREE.DoubleSide,
      });
      const seamMaterial = new THREE.MeshStandardMaterial({
        color: 0x798ed5,
        metalness: 0.75,
        roughness: 0.22,
      });
      materials.push(metal, seamMaterial);
      const sculpture = new THREE.Group();
      scene.add(sculpture);
      let identity = null;
      let identityStarted = performance.now();
      media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
      let reduceMotion = media?.matches ?? false;
      const draw = (now) => {
        if (disposed || !identity) return;
        // Hold the exact seeded pose briefly before motion begins. Entry and
        // index previews therefore start from the same visual identity.
        const elapsed = reduceMotion
          ? 0
          : Math.max(0, (now - identityStarted - 350) / 1000);
        sculpture.rotation.set(
          identity.pose[0] + Math.sin(elapsed * 0.23) * 0.12,
          identity.pose[1] + elapsed * 0.075,
          identity.pose[2] + Math.sin(elapsed * 0.16) * 0.06,
        );
        sculpture.position.y = 0.04 + Math.sin(elapsed * 0.4) * 0.055;
        renderer.render(scene, camera);
      };
      const applyIdentity = (next) => {
        if (disposed || identity?.identity === next.identity) return;
        const built = createSculptureGeometry(next);
        const nextGeometries = [built.geometry];
        try {
          for (const edge of built.edges) {
            nextGeometries.push(
              new THREE.TubeGeometry(
                new THREE.CatmullRomCurve3(edge, true),
                240,
                0.007,
                5,
                true,
              ),
            );
          }
        } catch (error) {
          nextGeometries.forEach((geometry) => geometry.dispose());
          throw error;
        }
        sculpture.clear();
        geometries.forEach((geometry) => geometry.dispose());
        geometries = nextGeometries;
        sculpture.add(new THREE.Mesh(built.geometry, metal));
        nextGeometries
          .slice(1)
          .forEach((geometry) =>
            sculpture.add(new THREE.Mesh(geometry, seamMaterial)),
          );
        metal.color.set(next.pearl);
        metal.roughness = next.roughness;
        metal.iridescence = next.iridescence;
        metal.iridescenceThicknessRange = [...next.film];
        seamMaterial.color.set(next.accent);
        identity = next;
        identityStarted = performance.now();
        renderer.domElement.style.opacity = '1';
        draw(identityStarted);
        setReady(true);
      };
      controller.current = {
        setIdentity: (next) => {
          try {
            applyIdentity(next);
          } catch {
            renderer.domElement.style.opacity = '0';
            setReady(false);
          }
        },
      };
      applyIdentity(latestParameters.current);
      const tick = (now) => {
        draw(now);
        if (!disposed && !reduceMotion)
          frame = window.requestAnimationFrame(tick);
      };
      resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height || disposed) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = camera.aspect < 0.85 ? 8.2 : 6.7;
        camera.updateProjectionMatrix();
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
