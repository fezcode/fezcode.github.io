import React, { useEffect, useRef } from 'react';

// A deep-space backdrop: parallax star layers that follow the graph's pan,
// drifting nebulae and meteors (streaks, fireballs and the odd shower).

const TILE = 1800;

const mulberry32 = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const STAR_COLOURS = ['#ffffff', '#ffffff', '#ffffff', '#cfdcff', '#bcd0ff', '#ffe2b8', '#ffc7ec'];

const LAYERS = [
  { count: 340, depth: 0.04, size: [0.35, 0.9] },
  { count: 150, depth: 0.1, size: [0.7, 1.4] },
  { count: 46, depth: 0.22, size: [1.1, 2.1] },
];

const NEBULAE = [
  { x: 0.18, y: 0.28, r: 0.55, c: [255, 61, 170], a: 0.16, sp: 0.00005 },
  { x: 0.82, y: 0.72, r: 0.6, c: [46, 140, 255], a: 0.18, sp: 0.00004 },
  { x: 0.62, y: 0.18, r: 0.42, c: [124, 92, 255], a: 0.16, sp: 0.00007 },
  { x: 0.3, y: 0.85, r: 0.4, c: [0, 210, 200], a: 0.1, sp: 0.00006 },
];

const SpaceSky = ({ viewRef, reduced }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rand = mulberry32(20270101);
    let w = 0;
    let h = 0;
    let raf = 0;

    const layers = LAYERS.map((layer) => ({
      ...layer,
      stars: Array.from({ length: layer.count }, () => ({
        x: rand() * TILE,
        y: rand() * TILE,
        r: layer.size[0] + rand() * (layer.size[1] - layer.size[0]),
        c: STAR_COLOURS[Math.floor(rand() * STAR_COLOURS.length)],
        phase: rand() * Math.PI * 2,
        speed: 0.0006 + rand() * 0.0024,
      })),
    }));

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(0);
    };

    // ------------------------------------------------------------ meteors
    const meteors = [];
    let nextMeteor = 600;
    const spawn = (now, opts = {}) => {
      const angle = opts.angle ?? 0.35 + rand() * 0.5;
      const fireball = opts.fireball ?? rand() < 0.14;
      const speed = (fireball ? 0.55 : 0.9) + rand() * 0.7;
      meteors.push({
        x: opts.x ?? rand() * w * 1.1 - w * 0.05,
        y: opts.y ?? rand() * h * 0.45 - h * 0.1,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: fireball ? 260 + rand() * 120 : 120 + rand() * 140,
        width: fireball ? 3.2 : 1 + rand() * 1.2,
        born: now,
        life: fireball ? 1700 : 900 + rand() * 700,
        fireball,
        tint: fireball ? [255, 196, 120] : rand() < 0.3 ? [180, 230, 255] : [255, 255, 255],
      });
    };

    const drawMeteors = (now, dt) => {
      if (now > nextMeteor) {
        const roll = rand();
        if (roll < 0.1) {
          // a small shower along one radiant
          const angle = 0.4 + rand() * 0.4;
          const n = 3 + Math.floor(rand() * 4);
          for (let i = 0; i < n; i++)
            spawn(now + i * 120, {
              angle,
              x: rand() * w * 0.7,
              y: rand() * h * 0.3 - 40,
              fireball: false,
            });
        } else spawn(now);
        nextMeteor = now + 700 + rand() * 2600;
      }
      ctx.globalCompositeOperation = 'lighter';
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const age = now - m.born;
        if (age < 0) continue;
        if (age > m.life) {
          meteors.splice(i, 1);
          continue;
        }
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const k = age / m.life;
        const fade = k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85;
        const [r, g, b] = m.tint;
        const sp = Math.hypot(m.vx, m.vy);
        const tx = m.x - (m.vx / sp) * m.len;
        const ty = m.y - (m.vy / sp) * m.len;
        const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`);
        grad.addColorStop(0.2, `rgba(${r},${g},${b},${0.55 * fade})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        // head glow
        const hr = m.fireball ? 16 : 6;
        const hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, hr);
        hg.addColorStop(0, `rgba(255,255,255,${fade})`);
        hg.addColorStop(0.4, `rgba(${r},${g},${b},${0.45 * fade})`);
        hg.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(m.x, m.y, hr, 0, Math.PI * 2);
        ctx.fill();
        // fireballs shed sparks
        if (m.fireball && rand() < 0.5) {
          ctx.fillStyle = `rgba(255,${180 + Math.floor(rand() * 60)},120,${fade * 0.8})`;
          ctx.fillRect(tx + (m.x - tx) * rand(), ty + (m.y - ty) * rand() + (rand() - 0.5) * 6, 1.4, 1.4);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    // ------------------------------------------------------------ frame
    const draw = (now, dt = 16) => {
      const sky = ctx.createLinearGradient(0, 0, w * 0.3, h);
      sky.addColorStop(0, '#0c0b30');
      sky.addColorStop(0.55, '#07071c');
      sky.addColorStop(1, '#030311');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const view = viewRef.current || { x: 0, y: 0, k: 1 };
      const big = Math.max(w, h);

      // nebulae
      ctx.globalCompositeOperation = 'lighter';
      NEBULAE.forEach((n, i) => {
        const drift = now * n.sp;
        const cx = n.x * w + Math.sin(drift + i) * w * 0.05 - view.x * view.k * 0.02;
        const cy = n.y * h + Math.cos(drift * 1.3 + i) * h * 0.05 - view.y * view.k * 0.02;
        const rr = n.r * big * (1 + 0.06 * Math.sin(drift * 2 + i));
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        g.addColorStop(0, `rgba(${n.c.join(',')},${n.a})`);
        g.addColorStop(0.45, `rgba(${n.c.join(',')},${n.a * 0.4})`);
        g.addColorStop(1, `rgba(${n.c.join(',')},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      ctx.globalCompositeOperation = 'source-over';

      // stars
      layers.forEach((layer) => {
        const ox = -view.x * view.k * layer.depth - now * 0.004 * layer.depth;
        const oy = -view.y * view.k * layer.depth;
        layer.stars.forEach((s) => {
          const sx = (((s.x + ox) % TILE) + TILE) % TILE;
          const sy = (((s.y + oy) % TILE) + TILE) % TILE;
          const tw = reduced ? 0.85 : 0.55 + 0.45 * Math.sin(now * s.speed + s.phase);
          for (let x = sx; x < w; x += TILE) {
            for (let y = sy; y < h; y += TILE) {
              ctx.globalAlpha = tw;
              ctx.fillStyle = s.c;
              ctx.beginPath();
              ctx.arc(x, y, s.r, 0, Math.PI * 2);
              ctx.fill();
              if (s.r > 1.6) {
                ctx.globalAlpha = tw * 0.45;
                ctx.fillRect(x - s.r * 3, y - 0.3, s.r * 6, 0.6);
                ctx.fillRect(x - 0.3, y - s.r * 3, 0.6, s.r * 6);
              }
            }
          }
        });
      });
      ctx.globalAlpha = 1;

      if (!reduced) drawMeteors(now, dt);
    };

    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(48, now - last);
      last = now;
      draw(now, dt);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [viewRef, reduced]);

  return <canvas ref={canvasRef} className="kg-sky" aria-hidden="true" />;
};

export default SpaceSky;
