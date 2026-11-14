import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { getCategoryTheme } from './discoveryData';

const PLASTIC_MEDIA = new Set(['game', 'movie', 'series', 'video']);
const PAPER_MEDIA = new Set(['book', 'article', 'quote']);

function profileFor(category) {
  if (category === 'music')
    return {
      width: 1.9,
      height: 1.9,
      depth: 0.065,
      paper: true,
      disc: true,
      vinyl: true,
    };
  return {
    width: 1.52,
    height: 2.18,
    depth: PAPER_MEDIA.has(category) ? 0.19 : 0.125,
    paper: !PLASTIC_MEDIA.has(category),
    disc: PLASTIC_MEDIA.has(category),
    vinyl: false,
  };
}

function wrapText(
  context,
  value,
  x,
  y,
  width,
  lineHeight,
  maxLines = Infinity,
) {
  const words = String(value || '')
    .replace(/\s+/g, ' ')
    .split(' ');
  let line = '';
  let lineCount = 0;
  for (let index = 0; index < words.length; index += 1) {
    const candidate = line ? `${line} ${words[index]}` : words[index];
    if (context.measureText(candidate).width > width && line) {
      const lastLine = lineCount === maxLines - 1;
      context.fillText(
        lastLine ? `${line.replace(/[.,;:]$/, '')}…` : line,
        x,
        y,
      );
      y += lineHeight;
      lineCount += 1;
      if (lastLine) return y;
      line = words[index];
    } else line = candidate;
  }
  if (line && lineCount < maxLines) context.fillText(line, x, y);
  return y + lineHeight;
}

function printedTexture(entry, theme, profile) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = profile.vinyl ? 1024 : 1460;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Printed cover texture unavailable.');
  context.fillStyle = theme.paper;
  context.fillRect(0, 0, canvas.width, canvas.height);
  // Fine fibres stay subdued under the physical material's diffuse lighting.
  context.fillStyle = 'rgba(75, 59, 39, 0.025)';
  for (let index = 0; index < 1800; index += 1) {
    context.fillRect((index * 257) % 1024, (index * 461) % canvas.height, 1, 2);
  }
  context.fillStyle = theme.ink;
  context.font = '500 25px Arial, sans-serif';
  context.fillText(entry.categoryLabel || theme.label, 100, 108);
  context.fillRect(100, 145, 824, 2);
  context.font = '600 66px Georgia, serif';
  const titleEnd = wrapText(context, entry.title, 100, 250, 810, 78, 4);
  context.font = '400 29px Arial, sans-serif';
  const creditEnd = entry.credit
    ? wrapText(context, entry.credit, 100, titleEnd + 23, 800, 40, 2)
    : titleEnd;
  context.font = '400 33px Georgia, serif';
  wrapText(
    context,
    entry.description,
    100,
    creditEnd + 80,
    805,
    49,
    profile.vinyl ? 6 : 13,
  );
  context.font = '500 25px Arial, sans-serif';
  context.fillText(
    entry.rating ? `${entry.rating} / 5` : 'A discovery worth keeping',
    100,
    canvas.height - 105,
  );
  context.textAlign = 'right';
  context.fillText(entry.date || '', 924, canvas.height - 105);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function discTexture(entry, theme, vinyl) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Disc texture unavailable.');
  context.fillStyle = vinyl ? '#171919' : '#c4c9cf';
  context.fillRect(0, 0, 1024, 1024);
  for (let radius = 205; radius < 505; radius += vinyl ? 5 : 9) {
    context.beginPath();
    context.arc(512, 512, radius, 0, Math.PI * 2);
    context.strokeStyle = vinyl
      ? 'rgba(210, 224, 231, 0.10)'
      : 'rgba(255, 255, 255, 0.15)';
    context.lineWidth = 1;
    context.stroke();
  }
  context.beginPath();
  context.arc(512, 512, vinyl ? 190 : 370, 0, Math.PI * 2);
  context.fillStyle = theme.ink;
  context.fill();
  context.fillStyle = theme.paper;
  context.textAlign = 'center';
  context.font = '600 36px Georgia, serif';
  wrapText(context, entry.title, 512, 455, vinyl ? 295 : 550, 44, 3);
  context.font = '400 18px Arial, sans-serif';
  context.fillText(entry.categoryLabel || theme.label, 512, vinyl ? 625 : 710);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function contactTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Contact texture unavailable.');
  const gradient = context.createRadialGradient(128, 128, 8, 128, 128, 124);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
  gradient.addColorStop(0.45, 'rgba(0, 0, 0, 0.22)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function cropArtwork(texture, profile, imagePosition) {
  const image = texture.image;
  if (!image?.width || !image?.height) return;
  const sourceAspect = image.width / image.height;
  const targetAspect = profile.width / profile.height;
  const positions = String(imagePosition || '').match(/([\d.]+)%/g) || [];
  const x = positions[0]
    ? Math.min(1, Math.max(0, parseFloat(positions[0]) / 100))
    : 0.5;
  const y = positions[1]
    ? Math.min(1, Math.max(0, parseFloat(positions[1]) / 100))
    : 0.5;
  if (sourceAspect > targetAspect) {
    texture.repeat.set(targetAspect / sourceAspect, 1);
    texture.offset.set((1 - texture.repeat.x) * x, 0);
  } else {
    texture.repeat.set(1, sourceAspect / targetAspect);
    texture.offset.set(0, (1 - texture.repeat.y) * (1 - y));
  }
}

function createPhysicalScene(canvas, host, entry, onFailure) {
  let renderer;
  let environmentTarget;
  let generator;
  let room;
  let observer;
  let disposed = false;
  let frame = 0;
  let animation = null;
  const resources = new Set();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 40);
  const profile = profileFor(entry.category);
  const theme = getCategoryTheme(entry.category);
  const w = profile.width;
  const h = profile.height;
  const d = profile.depth;
  const object = new THREE.Group();
  const lid = new THREE.Group();

  const remember = (resource) => {
    if (disposed) resource.dispose?.();
    else resources.add(resource);
    return resource;
  };
  const mesh = (geometry, material, parent = object) => {
    remember(geometry);
    remember(material);
    const result = new THREE.Mesh(geometry, material);
    result.castShadow = true;
    result.receiveShadow = true;
    parent.add(result);
    return result;
  };

  const renderFrame = (now) => {
    frame = 0;
    if (disposed || document.hidden) return;
    if (animation) {
      const progress = animation.duration
        ? Math.min(1, Math.max(0, (now - animation.start) / animation.duration))
        : 1;
      const ease = 1 - Math.pow(1 - progress, 3);
      lid.rotation.y = animation.from + (animation.to - animation.from) * ease;
      if (progress === 1) animation = null;
    }
    try {
      renderer.render(scene, camera);
    } catch {
      onFailure();
      dispose();
      return;
    }
    if (animation) frame = requestAnimationFrame(renderFrame);
  };
  const invalidate = () => {
    if (!disposed && !frame && !document.hidden)
      frame = requestAnimationFrame(renderFrame);
  };
  const resize = () => {
    if (disposed) return;
    const hostBounds = host.getBoundingClientRect();
    const width = Math.max(1, hostBounds.width || host.clientWidth || 440);
    const height = Math.max(1, hostBounds.height || host.clientHeight || 480);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Frame both hinge positions, rather than a fixed camera distance that
    // leaves the case small on wide screens or clips it on narrow screens.
    const currentAngle = lid.rotation.y;
    lid.rotation.y = 0;
    object.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(object);
    lid.rotation.y = -1.88;
    object.updateMatrixWorld(true);
    bounds.union(new THREE.Box3().setFromObject(object));
    lid.rotation.y = currentAngle;
    object.updateMatrixWorld(true);
    const center = bounds.getCenter(new THREE.Vector3());
    const direction = new THREE.Vector3(3.3, 1.15, 6.2).normalize();
    const right = new THREE.Vector3()
      .crossVectors(new THREE.Vector3(0, 1, 0), direction)
      .normalize();
    const up = new THREE.Vector3().crossVectors(direction, right).normalize();
    const halfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const framing = 0.86;
    let distance = 0;
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          const corner = new THREE.Vector3(x, y, z).sub(center);
          const depth = corner.dot(direction);
          distance = Math.max(
            distance,
            depth +
              Math.abs(corner.dot(right)) / (halfFov * camera.aspect * framing),
            depth + Math.abs(corner.dot(up)) / (halfFov * framing),
          );
        }
      }
    }
    camera.position.copy(center).addScaledVector(direction, distance + 0.04);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    invalidate();
  };
  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else invalidate();
  };
  const onContextLost = (event) => {
    event.preventDefault();
    onFailure();
    dispose(false);
  };

  function dispose(loseContext = true) {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    observer?.disconnect();
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    resources.forEach((resource) => resource.dispose?.());
    resources.clear();
    room?.dispose();
    environmentTarget?.dispose();
    generator?.dispose();
    renderer?.dispose();
    if (loseContext) renderer?.forceContextLoss();
  }

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    RectAreaLightUniformsLib.init();
    generator = new THREE.PMREMGenerator(renderer);
    room = new RoomEnvironment();
    environmentTarget = generator.fromScene(room, 0.04);
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = 0.58;
    room.dispose();
    room = null;
    scene.add(object);
    object.position.set(0.25, 0.02, 0);
    object.rotation.z = -0.025;

    const caseMaterial = remember(
      new THREE.MeshPhysicalMaterial({
        color: profile.paper
          ? '#d5cfbd'
          : entry.category === 'game'
            ? '#20332b'
            : '#242a30',
        roughness: profile.paper ? 0.72 : 0.26,
        metalness: 0,
        clearcoat: profile.paper ? 0.08 : 1,
        clearcoatRoughness: profile.paper ? 0.65 : 0.12,
        ior: 1.46,
      }),
    );
    mesh(new RoundedBoxGeometry(w, h, d, 4, 0.035), caseMaterial);
    const print = remember(printedTexture(entry, theme, profile));
    const insertMaterial = remember(
      new THREE.MeshPhysicalMaterial({
        map: print,
        roughness: 0.82,
        clearcoat: 0.035,
      }),
    );
    const outerMaterial = remember(
      new THREE.MeshPhysicalMaterial({
        color: '#f3eee3',
        roughness: profile.paper ? 0.68 : 0.32,
        clearcoat: profile.paper ? 0.12 : 0.94,
        clearcoatRoughness: profile.paper ? 0.42 : 0.13,
      }),
    );

    if (profile.paper && !profile.vinyl) {
      const pages = remember(
        new THREE.MeshStandardMaterial({ color: '#ded7c6', roughness: 0.98 }),
      );
      for (let index = 0; index < 18; index += 1) {
        const page = mesh(
          new THREE.BoxGeometry(w - 0.045, h - 0.065, 0.003),
          pages,
        );
        page.position.set(0, 0, -d / 2 + 0.018 + (index * (d - 0.05)) / 18);
      }
    }

    if (profile.disc || profile.vinyl) {
      const trayMaterial = remember(
        new THREE.MeshPhysicalMaterial({
          color: '#15191b',
          roughness: 0.38,
          clearcoat: 0.8,
        }),
      );
      const tray = mesh(
        new RoundedBoxGeometry(w - 0.1, h - 0.1, 0.025, 3, 0.025),
        trayMaterial,
      );
      tray.position.z = d / 2 + 0.005;
      const record = remember(discTexture(entry, theme, profile.vinyl));
      const discMaterial = remember(
        new THREE.MeshPhysicalMaterial({
          map: record,
          roughness: profile.vinyl ? 0.3 : 0.24,
          metalness: profile.vinyl ? 0.08 : 0.64,
          clearcoat: 1,
          clearcoatRoughness: 0.13,
          iridescence: profile.vinyl ? 0 : 0.9,
          iridescenceIOR: 1.35,
        }),
      );
      const disc = mesh(
        new THREE.RingGeometry(0.07, profile.vinyl ? 0.79 : 0.64, 96),
        discMaterial,
      );
      disc.position.set(0, profile.vinyl ? 0 : -0.04, d / 2 + 0.045);
      const hub = mesh(
        new THREE.CylinderGeometry(0.068, 0.068, 0.035, 32),
        trayMaterial,
      );
      hub.rotation.x = Math.PI / 2;
      hub.position.copy(disc.position);
      hub.position.z += 0.012;
      for (const side of [-1, 1]) {
        const clip = mesh(
          new THREE.BoxGeometry(0.07, 0.14, 0.035),
          trayMaterial,
        );
        clip.position.set(side * (w / 2 - 0.075), h / 2 - 0.19, d / 2 + 0.022);
      }
    } else {
      const page = mesh(
        new THREE.PlaneGeometry(w - 0.1, h - 0.13),
        insertMaterial,
      );
      page.position.z = d / 2 + 0.009;
    }

    lid.position.set(-w / 2, 0, d / 2 + 0.026);
    object.add(lid);
    const lidShell = mesh(
      new RoundedBoxGeometry(w, h, 0.035, 4, 0.016),
      caseMaterial,
      lid,
    );
    lidShell.position.x = w / 2;
    const cover = mesh(
      new THREE.PlaneGeometry(w - 0.03, h - 0.035),
      outerMaterial,
      lid,
    );
    cover.position.set(w / 2, 0, 0.02);
    cover.castShadow = false;
    const inside = mesh(
      new THREE.PlaneGeometry(w - 0.09, h - 0.11),
      insertMaterial,
      lid,
    );
    inside.position.set(w / 2, 0, -0.02);
    inside.rotation.y = Math.PI;
    const hinge = mesh(
      new THREE.CylinderGeometry(0.022, 0.022, h - 0.05, 24),
      caseMaterial,
    );
    hinge.position.copy(lid.position);

    const ground = mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.24 }),
      scene,
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -h / 2 - 0.05;
    ground.castShadow = false;
    const contact = mesh(
      new THREE.PlaneGeometry(3.8, 2.0),
      new THREE.MeshBasicMaterial({
        map: remember(contactTexture()),
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      }),
      scene,
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.set(0.12, ground.position.y + 0.002, 0.2);
    contact.castShadow = false;

    scene.add(new THREE.HemisphereLight(0xe0ebff, 0x453626, 1.2));
    const key = new THREE.DirectionalLight(0xfff4e2, 3.8);
    key.position.set(-3.8, 5.2, 4.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, {
      left: -4,
      right: 4,
      top: 4,
      bottom: -4,
      near: 0.5,
      far: 20,
    });
    key.shadow.normalBias = 0.025;
    remember(key.shadow);
    scene.add(key);
    const fill = new THREE.RectAreaLight(0xcddfff, 4.5, 3, 5);
    fill.position.set(3.8, 2.2, 4);
    fill.lookAt(0, 0, 0);
    scene.add(fill);
    const rim = new THREE.RectAreaLight(0xffd9ac, 3.5, 1.5, 4);
    rim.position.set(-3, 1.5, -2);
    rim.lookAt(0, 0, 0);
    scene.add(rim);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const candidates = [
      ...new Set([entry.cover, entry.fallbackCover].filter(Boolean)),
    ];
    const loadArtwork = (index) => {
      if (disposed) return;
      if (!candidates[index]) {
        onFailure();
        dispose();
        return;
      }
      const pending = loader.load(
        candidates[index],
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(
            8,
            renderer.capabilities?.getMaxAnisotropy?.() || 4,
          );
          cropArtwork(texture, profile, entry.imagePosition);
          outerMaterial.map = texture;
          outerMaterial.needsUpdate = true;
          invalidate();
        },
        undefined,
        () => loadArtwork(index + 1),
      );
      remember(pending);
    };
    loadArtwork(0);
    if (disposed) return null;
    canvas.addEventListener('webglcontextlost', onContextLost);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', resize);
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(resize);
      observer.observe(host);
    }
    resize();
  } catch {
    dispose();
    return null;
  }

  return {
    setOpen(open, reducedMotion) {
      if (disposed) return;
      animation = {
        from: lid.rotation.y,
        to: open ? -1.88 : 0,
        start: performance.now(),
        duration: reducedMotion ? 0 : open ? 950 : 300,
      };
      invalidate();
    },
    dispose,
  };
}

/** One demand-rendered PBR object, mounted only while its showcase is open. */
export default function PhysicalCover({
  entry,
  open = false,
  reducedMotion = false,
  fallback,
}) {
  const host = useRef(null);
  const canvas = useRef(null);
  const engine = useRef(null);
  const latestOpen = useRef(open);
  const latestReducedMotion = useRef(reducedMotion);
  const [ready, setReady] = useState(false);
  const [poster, setPoster] = useState(
    entry.cover || entry.fallbackCover || '',
  );
  latestOpen.current = open;
  latestReducedMotion.current = reducedMotion;
  const theme = getCategoryTheme(entry.category);

  useEffect(() => {
    setReady(false);
    setPoster(entry.cover || entry.fallbackCover || '');
    if (
      typeof WebGL2RenderingContext === 'undefined' ||
      !canvas.current ||
      !host.current
    )
      return undefined;
    const physical = createPhysicalScene(
      canvas.current,
      host.current,
      entry,
      () => setReady(false),
    );
    if (!physical) return undefined;
    engine.current = physical;
    physical.setOpen(latestOpen.current, latestReducedMotion.current);
    setReady(true);
    return () => {
      engine.current = null;
      physical.dispose();
    };
  }, [
    entry.id,
    entry.category,
    entry.cover,
    entry.fallbackCover,
    entry.title,
    entry.description,
    entry.credit,
    entry.rating,
    entry.date,
    entry.imagePosition,
  ]);

  useEffect(() => {
    engine.current?.setOpen(open, reducedMotion);
  }, [open, reducedMotion]);

  return (
    <div
      ref={host}
      className="dc-physical-cover"
      data-renderer={ready ? 'webgl' : 'static'}
      data-open={open}
      role="img"
      aria-label={`${entry.title}, ${entry.categoryLabel || theme.label} cover${open ? ', open to its contents' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(340px, 58svh, 620px)',
        isolation: 'isolate',
      }}
    >
      {fallback ? (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: ready ? 'none' : 'block',
          }}
        >
          {fallback}
        </div>
      ) : (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '8% 22% 8% 26%',
            perspective: 1100,
            display: ready ? 'none' : 'block',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: theme.paper,
              color: theme.ink,
              padding: '10% 9%',
              borderRadius: 7,
              boxShadow: '5px 13px 28px #0006',
              overflow: 'hidden',
              border: '5px solid #262c2c',
              fontFamily: 'Georgia, serif',
            }}
          >
            <strong
              style={{
                display: 'block',
                fontSize: 'clamp(15px, 2vw, 27px)',
                lineHeight: 1.15,
              }}
            >
              {entry.title}
            </strong>
            <p
              style={{ fontSize: 'clamp(10px, 1.05vw, 14px)', lineHeight: 1.5 }}
            >
              {entry.description}
            </p>
            {entry.rating > 0 && (
              <span style={{ font: '12px Arial, sans-serif' }}>
                {entry.rating} / 5
              </span>
            )}
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'left center',
              transform: `rotateY(${open ? -108 : 0}deg)`,
              transition: reducedMotion
                ? 'none'
                : `transform ${open ? 0.95 : 0.3}s cubic-bezier(.2,.7,.2,1)`,
              borderRadius: 7,
              border: '5px solid #262c2c',
              background: theme.ink,
              boxShadow: 'inset 1px 0 1px #ffffff70, 4px 6px 15px #0005',
              backfaceVisibility: 'hidden',
              overflow: 'hidden',
            }}
          >
            {poster ? (
              <img
                src={poster}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: entry.imagePosition || 'center',
                  display: 'block',
                }}
                onError={() =>
                  setPoster(
                    poster === entry.fallbackCover
                      ? ''
                      : entry.fallbackCover || '',
                  )
                }
              />
            ) : (
              <strong
                style={{
                  display: 'block',
                  padding: 20,
                  color: theme.paper,
                  font: '600 28px Georgia, serif',
                }}
              >
                {entry.title}
              </strong>
            )}
          </div>
        </div>
      )}
      <canvas
        ref={canvas}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: ready ? 'block' : 'none',
        }}
      />
    </div>
  );
}
