// ─── EBRU :: marbling engine (raster / semi-Lagrangian) ─────────────────
// Ink is a raster surface (RGBA buffer) floating on water. Every tool warps
// the WHOLE field by resampling pixels through a flow, so the paint always
// behaves like a fluid — smooth cusps and feathering, never polygon shards —
// and the cost is fixed by resolution, not by how much you have combed.
//
//   • Dropper — exact, area-preserving expansion. A drop of radius r pushes
//     every existing pixel radially outward (concentric rings); the disk under
//     it becomes the new colour. Done by backward-mapping: the pixel now at
//     distance d sampled the paint that used to be at sqrt(d² − r²).
//   • Needle / Comb — a tine flow drags paint ALONG the stroke, the amount
//     decaying smoothly (exp(−dist/σ)) with distance to the nearest tine. We
//     advect by sampling each destination pixel from (p − flow(p)).

// ── Pure helpers ─────────────────────────────────────────────────────────

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Bilinear sample of an RGBA buffer at (x, y); coordinates are edge-clamped. */
export function sampleBilinear(src, w, h, x, y) {
  if (x < 0) x = 0;
  else if (x > w - 1) x = w - 1;
  if (y < 0) y = 0;
  else if (y > h - 1) y = h - 1;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1 < w ? x0 + 1 : x0;
  const y1 = y0 + 1 < h ? y0 + 1 : y0;
  const fx = x - x0;
  const fy = y - y0;
  const i00 = (y0 * w + x0) * 4;
  const i10 = (y0 * w + x1) * 4;
  const i01 = (y1 * w + x0) * 4;
  const i11 = (y1 * w + x1) * 4;
  const out = [0, 0, 0, 0];
  for (let c = 0; c < 4; c++) {
    const top = src[i00 + c] * (1 - fx) + src[i10 + c] * fx;
    const bot = src[i01 + c] * (1 - fx) + src[i11 + c] * fx;
    out[c] = top * (1 - fy) + bot * fy;
  }
  return out;
}

/**
 * Forward displacement of the tine flow at point (x, y) for a stroke A→(dir u),
 * length `len`. `tines` parallel teeth (gap `spacing`, perpendicular to u);
 * `tines = 1, spacing = 0` is a single needle. Returns [dx, dy].
 */
export function tineDisplacement(x, y, ax, ay, ux, uy, len, tines, spacing, sigma) {
  const px = -uy;
  const py = ux;
  const rx = x - ax;
  const ry = y - ay;
  const along = rx * ux + ry * uy;
  const perp = rx * px + ry * py;
  const mid = (tines - 1) / 2;
  let nearestOff = 0;
  if (tines > 1 && spacing > 0) {
    let i = Math.round(perp / spacing + mid);
    if (i < 0) i = 0;
    else if (i > tines - 1) i = tines - 1;
    nearestOff = (i - mid) * spacing;
  }
  const dPerp = perp - nearestOff;
  let dAlong = 0;
  if (along < 0) dAlong = -along;
  else if (along > len) dAlong = along - len;
  const d = Math.hypot(dPerp, dAlong);
  const f = len * Math.exp(-d / sigma);
  return [ux * f, uy * f];
}

// ── The tray (stateful raster surface used by the UI) ───────────────────

export class MarblingTray {
  constructor({ width, height, water = '#ECE3CD', undoDepth = 10 } = {}) {
    this.width = width;
    this.height = height;
    this.BW = width;
    this.BH = height;
    this.water = hexToRgb(water);
    this.buf = new Uint8ClampedArray(this.BW * this.BH * 4);
    this.tmp = new Uint8ClampedArray(this.BW * this.BH * 4);
    this.history = [];
    this.undoDepth = undoDepth;
    this.opCount = 0;
    this._drops = 0;
    this._fill(this.water);
  }

  get isEmpty() {
    return this._drops === 0;
  }

  _fill([r, g, b]) {
    const { buf } = this;
    for (let i = 0; i < buf.length; i += 4) {
      buf[i] = r;
      buf[i + 1] = g;
      buf[i + 2] = b;
      buf[i + 3] = 255;
    }
  }

  _snapshot() {
    this.history.push({ buf: this.buf.slice(), drops: this._drops, opCount: this.opCount });
    if (this.history.length > this.undoDepth) this.history.shift();
  }

  /** Drop a circle of ink; existing paint is pushed radially outward. */
  drop(c, r, color) {
    this._snapshot();
    const [rr, gg, bb] = Array.isArray(color) ? color : hexToRgb(color);
    const { BW, BH, buf, tmp } = this;
    tmp.set(buf);
    const cx = c.x;
    const cy = c.y;
    for (let y = 0; y < BH; y++) {
      for (let x = 0; x < BW; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * BW + x) * 4;
        if (d <= r) {
          buf[idx] = rr;
          buf[idx + 1] = gg;
          buf[idx + 2] = bb;
          buf[idx + 3] = 255;
        } else {
          const srcD = Math.sqrt(d * d - r * r);
          const s = srcD / d;
          const col = sampleBilinear(tmp, BW, BH, cx + dx * s, cy + dy * s);
          buf[idx] = col[0];
          buf[idx + 1] = col[1];
          buf[idx + 2] = col[2];
          buf[idx + 3] = 255;
        }
      }
    }
    this._drops++;
    this.opCount++;
  }

  /** Call once at the start of a needle/comb drag (one undo per stroke). */
  beginStroke() {
    this._snapshot();
    this.opCount++;
  }

  /** Advect the field for one drag step (from → to). `kind` is 'needle' | 'comb'. */
  stroke(from, to, { kind = 'needle', tines = 14, spacing = 26 } = {}) {
    const ax = from.x;
    const ay = from.y;
    const dx = to.x - ax;
    const dy = to.y - ay;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) return;
    const ux = dx / len;
    const uy = dy / len;

    let nTines;
    let sp;
    let sigma;
    if (kind === 'comb') {
      nTines = Math.max(1, tines);
      sp = spacing;
      sigma = Math.max(6, spacing * 0.5);
    } else {
      nTines = 1;
      sp = 0;
      sigma = 16;
    }

    // Bounding box of the affected band (so cost scales with the stroke, not the tray).
    const mid = (nTines - 1) / 2;
    const halfW = mid * sp + 3 * sigma;
    const margin = 3 * sigma;
    const px = -uy;
    const py = ux;
    const corners = [
      [ax + px * halfW - ux * margin, ay + py * halfW - uy * margin],
      [ax - px * halfW - ux * margin, ay - py * halfW - uy * margin],
      [to.x + px * halfW + ux * margin, to.y + py * halfW + uy * margin],
      [to.x - px * halfW + ux * margin, to.y - py * halfW + uy * margin],
    ];
    let minx = Infinity;
    let miny = Infinity;
    let maxx = -Infinity;
    let maxy = -Infinity;
    for (const [X, Y] of corners) {
      if (X < minx) minx = X;
      if (Y < miny) miny = Y;
      if (X > maxx) maxx = X;
      if (Y > maxy) maxy = Y;
    }
    const { BW, BH, buf, tmp } = this;
    minx = Math.max(0, Math.floor(minx));
    miny = Math.max(0, Math.floor(miny));
    maxx = Math.min(BW - 1, Math.ceil(maxx));
    maxy = Math.min(BH - 1, Math.ceil(maxy));
    if (maxx < minx || maxy < miny) return;

    tmp.set(buf);
    for (let y = miny; y <= maxy; y++) {
      for (let x = minx; x <= maxx; x++) {
        const disp = tineDisplacement(x, y, ax, ay, ux, uy, len, nTines, sp, sigma);
        const col = sampleBilinear(tmp, BW, BH, x - disp[0], y - disp[1]);
        const idx = (y * BW + x) * 4;
        buf[idx] = col[0];
        buf[idx + 1] = col[1];
        buf[idx + 2] = col[2];
        buf[idx + 3] = 255;
      }
    }
  }

  endStroke() {
    // raster advection needs no post-processing
  }

  undo() {
    const s = this.history.pop();
    if (!s) return false;
    this.buf.set(s.buf);
    this._drops = s.drops;
    this.opCount = s.opCount;
    return true;
  }

  clear() {
    this.history = [];
    this._fill(this.water);
    this.opCount = 0;
    this._drops = 0;
  }
}
