/**
 * PrintStation — the "Print" tab. Resize, scale, format-convert and one-click web
 * presets (favicon / social card), with single + bulk output. Ported and unified
 * from the old AssetStudio.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  DownloadSimpleIcon,
  StackIcon,
  GlobeIcon,
  MonitorIcon,
  ArrowsClockwiseIcon,
  ArrowsOutIcon,
  MagnifyingGlassPlusIcon,
  LockIcon,
  LockOpenIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../../hooks/useToast';
import { Panel, SectionLabel, SolidButton, GhostButton, RangeSlider, SegmentedControl } from './ui';

const FORMATS = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
];

const QUALITY = 0.92;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function coverDraw(ctx, img, w, h) {
  const sa = img.width / img.height;
  const ta = w / h;
  let sw, sh, sx, sy;
  if (sa > ta) {
    sh = img.height;
    sw = sh * ta;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / ta;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}

function PresetRow({ label, sub, icon: Icon, onSingle, onBulk, showBulk, busy }) {
  return (
    <div className="flex items-stretch gap-2">
      <button
        type="button"
        onClick={onSingle}
        disabled={busy}
        className="group flex flex-1 items-center justify-between rounded-xl border px-4 py-3 text-left transition-all disabled:opacity-30"
        style={{ borderColor: 'var(--dk-line)' }}
      >
        <span className="flex items-center gap-3">
          <Icon size={17} weight="bold" style={{ color: 'var(--dk-safe)' }} />
          <span>
            <span className="block text-[13px] font-semibold" style={{ color: 'var(--dk-paper)' }}>
              {label}
            </span>
            <span className="dk-mono block text-[8px] uppercase tracking-wider" style={{ color: 'var(--dk-mute)' }}>
              {sub}
            </span>
          </span>
        </span>
        <DownloadSimpleIcon size={15} style={{ color: 'var(--dk-mute)' }} />
      </button>
      {showBulk && (
        <button
          type="button"
          onClick={onBulk}
          disabled={busy}
          title={`Bulk · ${label}`}
          className="flex items-center justify-center rounded-xl border px-4 transition-all disabled:opacity-30"
          style={{ borderColor: 'var(--dk-line)', color: 'var(--dk-safe)' }}
        >
          <StackIcon size={18} weight="bold" />
        </button>
      )}
    </div>
  );
}

export default function PrintStation({ images, currentIndex }) {
  const { addToast } = useToast();
  const current = images[currentIndex];
  const [format, setFormat] = useState('image/webp');
  const [width, setWidth] = useState(current?.width || 800);
  const [height, setHeight] = useState(current?.height || 600);
  const [lock, setLock] = useState(true);
  const [scale, setScale] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (current) {
      setWidth(current.width);
      setHeight(current.height);
    }
  }, [current]);

  const aspect = current ? current.width / current.height : 1;
  const onWidth = (w) => {
    setWidth(w);
    if (lock) setHeight(Math.max(1, Math.round(w / aspect)));
  };
  const onHeight = (h) => {
    setHeight(h);
    if (lock) setWidth(Math.max(1, Math.round(h * aspect)));
  };

  const fmt = FORMATS.find((f) => f.value === format);

  const render = useCallback(
    async (imgObj, op) => {
      const img = new Image();
      img.src = imgObj.src;
      await new Promise((res) => {
        img.onload = res;
      });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let w;
      let h;
      let mime = format;
      let ext = fmt.ext;
      if (op === 'original') {
        w = img.width;
        h = img.height;
      } else if (op === 'favicon') {
        w = 32;
        h = 32;
        mime = 'image/png';
        ext = 'png';
      } else if (op === 'og') {
        w = 1200;
        h = 630;
        mime = 'image/png';
        ext = 'png';
      } else if (op === 'custom') {
        w = width;
        h = height;
      } else if (op === 'scale') {
        w = Math.round(img.width * scale);
        h = Math.round(img.height * scale);
      }
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingQuality = 'high';
      if (op === 'favicon' || op === 'og') coverDraw(ctx, img, w, h);
      else ctx.drawImage(img, 0, 0, w, h);
      return { url: canvas.toDataURL(mime, QUALITY), filename: `${imgObj.name}-${op}.${ext}` };
    },
    [format, fmt, width, height, scale],
  );

  const trigger = ({ url, filename }) => {
    const a = document.createElement('a');
    a.download = filename;
    a.href = url;
    a.click();
  };

  const runSingle = async (op) => {
    if (!current) return;
    setBusy(true);
    try {
      trigger(await render(current, op));
      addToast({ title: 'Printed', message: `${op} asset saved.` });
    } finally {
      setBusy(false);
    }
  };

  const runBulk = async (op) => {
    setBusy(true);
    try {
      for (const im of images) {
        trigger(await render(im, op));
        await delay(140);
      }
      addToast({ title: 'Batch printed', message: `${images.length} assets saved.` });
    } finally {
      setBusy(false);
    }
  };

  const showBulk = images.length > 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Presets */}
      <div className="space-y-6 lg:col-span-5">
        <Panel className="space-y-6 p-7">
          <SectionLabel index="01">Output format</SectionLabel>
          <SegmentedControl options={FORMATS} value={format} onChange={setFormat} layoutId="print-fmt" />
        </Panel>

        <Panel className="space-y-4 p-7">
          <SectionLabel index="02">Presets</SectionLabel>
          <PresetRow
            label="Original size"
            sub={`Re-encode as ${fmt.label}`}
            icon={ArrowsClockwiseIcon}
            onSingle={() => runSingle('original')}
            onBulk={() => runBulk('original')}
            showBulk={showBulk}
            busy={busy}
          />
          <PresetRow
            label="Favicon"
            sub="32 × 32 · PNG"
            icon={GlobeIcon}
            onSingle={() => runSingle('favicon')}
            onBulk={() => runBulk('favicon')}
            showBulk={showBulk}
            busy={busy}
          />
          <PresetRow
            label="Social card"
            sub="1200 × 630 · PNG"
            icon={MonitorIcon}
            onSingle={() => runSingle('og')}
            onBulk={() => runBulk('og')}
            showBulk={showBulk}
            busy={busy}
          />
        </Panel>
      </div>

      {/* Resize + scale + preview */}
      <div className="space-y-6 lg:col-span-7">
        <Panel className="space-y-6 p-7">
          <div className="flex items-center justify-between">
            <SectionLabel className="flex-1">
              <span className="inline-flex items-center gap-2">
                <ArrowsOutIcon size={12} weight="bold" /> Resize
              </span>
            </SectionLabel>
            <GhostButton
              icon={lock ? LockIcon : LockOpenIcon}
              active={lock}
              onClick={() => setLock((v) => !v)}
            >
              {lock ? 'Locked' : 'Free'}
            </GhostButton>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Width', value: width, on: onWidth },
              { label: 'Height', value: height, on: onHeight },
            ].map((f) => (
              <label key={f.label} className="space-y-2">
                <span
                  className="dk-mono block text-[9px] uppercase tracking-[0.28em]"
                  style={{ color: 'var(--dk-mute)' }}
                >
                  {f.label} · px
                </span>
                <input
                  type="number"
                  value={f.value}
                  onChange={(e) => f.on(parseInt(e.target.value, 10) || 0)}
                  className="dk-mono w-full rounded-xl border bg-black/30 px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--dk-safe)]"
                  style={{ borderColor: 'var(--dk-line)', color: 'var(--dk-paper)' }}
                />
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <SolidButton icon={DownloadSimpleIcon} onClick={() => runSingle('custom')} disabled={busy} className="flex-1">
              Apply
            </SolidButton>
            {showBulk && (
              <GhostButton icon={StackIcon} onClick={() => runBulk('custom')} disabled={busy}>
                Bulk
              </GhostButton>
            )}
          </div>
        </Panel>

        <Panel className="space-y-6 p-7">
          <SectionLabel className="flex-1">
            <span className="inline-flex items-center gap-2">
              <MagnifyingGlassPlusIcon size={12} weight="bold" /> Scale
            </span>
          </SectionLabel>
          <RangeSlider
            label="Multiplier"
            min={0.1}
            max={4}
            step={0.1}
            value={scale}
            onChange={setScale}
            format={(v) => `${v.toFixed(1)}×`}
          />
          {current && (
            <p className="dk-mono text-[10px]" style={{ color: 'var(--dk-mute)' }}>
              {current.width} × {current.height} →{' '}
              <span style={{ color: 'var(--dk-safe)' }}>
                {Math.round(current.width * scale)} × {Math.round(current.height * scale)}
              </span>
            </p>
          )}
          <div className="flex gap-3">
            <SolidButton icon={DownloadSimpleIcon} onClick={() => runSingle('scale')} disabled={busy} className="flex-1">
              Apply
            </SolidButton>
            {showBulk && (
              <GhostButton icon={StackIcon} onClick={() => runBulk('scale')} disabled={busy}>
                Bulk
              </GhostButton>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
