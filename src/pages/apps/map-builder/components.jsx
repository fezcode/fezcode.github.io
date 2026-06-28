// Reusable, theme-aware UI controls for the Map Builder, plus the virtualized
// sprite-library grid. All styling is inline + driven by the active theme's `ui`
// palette so panels restyle with the map.

import React, { useEffect, useRef, useState } from 'react';
import { getSpriteBitmap } from './engine/spriteCache';

export const MONO = 'ui-monospace, "SFMono-Regular", Menlo, monospace';
export const SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif';

export function Panel({ title, right, theme, children, scroll }) {
  return (
    <div style={{ borderBottom: `1px solid ${theme.line}22` }}>
      {title && (
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ background: theme.panel }}
        >
          <span
            style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.18em', color: theme.muted, textTransform: 'uppercase' }}
          >
            {title}
          </span>
          {right}
        </div>
      )}
      <div className={scroll ? 'custom-scroll' : ''} style={scroll ? { overflowY: 'auto' } : undefined}>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, theme, children, hint }) {
  return (
    <label className="block px-3 py-1.5">
      {label && (
        <div
          className="mb-1 flex items-center justify-between"
          style={{ fontFamily: SANS, fontSize: 11, color: theme.muted }}
        >
          <span>{label}</span>
          {hint != null && <span style={{ fontFamily: MONO, color: theme.ink }}>{hint}</span>}
        </div>
      )}
      {children}
    </label>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, theme, fmt }) {
  return (
    <Field label={label} theme={theme} hint={fmt ? fmt(value) : value}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: theme.spot }}
      />
    </Field>
  );
}

export function Toggle({ label, value, onChange, theme }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between px-3 py-1.5"
      style={{ fontFamily: SANS, fontSize: 11, color: theme.ink }}
    >
      <span style={{ color: theme.muted }}>{label}</span>
      <span
        style={{
          width: 30,
          height: 16,
          borderRadius: 999,
          background: value ? theme.spot : theme.line + '44',
          position: 'relative',
          transition: 'background 150ms',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: value ? 16 : 2,
            width: 12,
            height: 12,
            borderRadius: 999,
            background: value ? theme.spotInk : theme.surface,
            transition: 'left 150ms',
          }}
        />
      </span>
    </button>
  );
}

export function SelectInput({ label, value, options, onChange, theme }) {
  return (
    <Field label={label} theme={theme}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5"
        style={{
          fontFamily: SANS,
          fontSize: 12,
          color: theme.ink,
          background: theme.surface,
          border: `1px solid ${theme.line}33`,
          borderRadius: 4,
          outline: 'none',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: theme.surface, color: theme.ink }}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Segmented({ value, options, onChange, theme }) {
  return (
    <div
      className="flex"
      style={{ border: `1px solid ${theme.line}33`, borderRadius: 5, overflow: 'hidden' }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className="flex-1 px-2 py-1"
            style={{
              fontFamily: SANS,
              fontSize: 11,
              background: active ? theme.spot : 'transparent',
              color: active ? theme.spotInk : theme.muted,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ColorField({ label, value, onChange, theme, allowAuto }) {
  const auto = value == null;
  return (
    <Field label={label} theme={theme}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={auto ? '#888888' : value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 26, height: 22, border: `1px solid ${theme.line}33`, background: 'none', borderRadius: 4, padding: 0 }}
        />
        {allowAuto && (
          <button
            type="button"
            onClick={() => onChange(auto ? '#888888' : null)}
            className="px-2 py-1"
            style={{
              fontFamily: MONO,
              fontSize: 10,
              borderRadius: 4,
              border: `1px solid ${theme.line}33`,
              background: auto ? theme.spot : 'transparent',
              color: auto ? theme.spotInk : theme.muted,
            }}
          >
            AUTO
          </button>
        )}
      </div>
    </Field>
  );
}

export function ToolButton({ active, onClick, title, children, theme }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex items-center justify-center"
      style={{
        width: 40,
        height: 40,
        borderRadius: 7,
        background: active ? theme.spot : 'transparent',
        color: active ? theme.spotInk : theme.ink,
        border: `1px solid ${active ? theme.spot : theme.line + '22'}`,
        transition: 'all 120ms',
      }}
    >
      {children}
    </button>
  );
}

export function TopButton({ onClick, title, children, theme, disabled, accent }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-2.5 py-1.5"
      style={{
        fontFamily: SANS,
        fontSize: 12,
        borderRadius: 6,
        opacity: disabled ? 0.4 : 1,
        background: accent ? theme.spot : 'transparent',
        color: accent ? theme.spotInk : theme.ink,
        border: `1px solid ${accent ? theme.spot : theme.line + '22'}`,
      }}
    >
      {children}
    </button>
  );
}

export function LayerRow({ layer, active, theme, onSelect, onToggleVis, onToggleLock, onOpacity, onDelete }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1.5"
      style={{
        background: active ? theme.spot + '22' : 'transparent',
        borderLeft: `2px solid ${active ? theme.spot : 'transparent'}`,
        cursor: 'pointer',
      }}
      onClick={onSelect}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVis();
        }}
        title={layer.visible ? 'Hide' : 'Show'}
        style={{ fontFamily: MONO, fontSize: 11, color: layer.visible ? theme.ink : theme.muted, width: 16 }}
      >
        {layer.visible ? '◉' : '◌'}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLock();
        }}
        title={layer.locked ? 'Unlock' : 'Lock'}
        style={{ fontFamily: MONO, fontSize: 11, color: layer.locked ? theme.spot : theme.muted, width: 14 }}
      >
        {layer.locked ? '⊟' : '⊞'}
      </button>
      <span className="flex-1 truncate" style={{ fontFamily: SANS, fontSize: 12, color: theme.ink }}>
        {layer.name}
        <span style={{ color: theme.muted, fontSize: 10 }}> · {layer.kind === 'terrain' ? 'terrain' : (layer.objects ? layer.objects.length : 0)}</span>
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={layer.opacity}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onOpacity(parseFloat(e.target.value))}
        title="Opacity"
        style={{ width: 44, accentColor: theme.spot }}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Delete layer"
        style={{ fontFamily: MONO, fontSize: 12, color: theme.muted, width: 14 }}
      >
        ×
      </button>
    </div>
  );
}

function SpriteThumb({ entry, theme, active, size, onPick }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    const S = size - 8;
    cv.width = S * dpr;
    cv.height = S * dpr;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, S, S);
    const bmp = getSpriteBitmap(entry, theme, Math.round(S * 0.85), null);
    if (bmp) {
      const sc = Math.min((S * 0.9) / bmp.width, (S * 0.9) / bmp.height);
      const dw = bmp.width * sc;
      const dh = bmp.height * sc;
      ctx.drawImage(bmp, (S - dw) / 2, (S - dh) / 2, dw, dh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id, theme.id, size]);
  return (
    <button
      type="button"
      title={entry.name}
      onClick={() => onPick(entry)}
      style={{
        position: 'absolute',
        width: size - 6,
        height: size - 6,
        padding: 3,
        borderRadius: 6,
        background: active ? theme.spot + '33' : theme.surface,
        border: `1px solid ${active ? theme.spot : theme.line + '1f'}`,
      }}
    >
      <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
    </button>
  );
}

export function SpriteGrid({ entries, theme, activeId, onPick, itemSize = 58 }) {
  const ref = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [box, setBox] = useState({ w: 240, h: 320 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setBox({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);
  const cols = Math.max(1, Math.floor(box.w / itemSize));
  const rows = Math.ceil(entries.length / cols);
  const startRow = Math.max(0, Math.floor(scrollTop / itemSize) - 1);
  const endRow = Math.min(rows, Math.ceil((scrollTop + box.h) / itemSize) + 1);
  const items = [];
  for (let r = startRow; r < endRow; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i >= entries.length) break;
      const e = entries[i];
      items.push(
        <div key={e.id} style={{ position: 'absolute', left: c * itemSize, top: r * itemSize }}>
          <SpriteThumb entry={e} theme={theme} active={e.id === activeId} size={itemSize} onPick={onPick} />
        </div>,
      );
    }
  }
  return (
    <div
      ref={ref}
      className="custom-scroll"
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{ position: 'relative', overflowY: 'auto', height: '100%', width: '100%' }}
    >
      <div style={{ height: rows * itemSize, position: 'relative' }}>{items}</div>
    </div>
  );
}
