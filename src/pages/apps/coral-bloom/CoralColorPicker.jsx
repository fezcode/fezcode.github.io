import React, { useEffect, useId, useRef, useState } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';
import { hexToHsv, hsvToHex, normalizeHex } from './colorUtils';
import './colorPicker.css';

const ROLES = [
  { key: 'pigment', label: 'Petals' },
  { key: 'tip', label: 'Edges' },
  { key: 'fold', label: 'Folds' },
  { key: 'background', label: 'Background' },
];

const clamp = (number, min, max) => Math.max(min, Math.min(max, number));

export default function CoralColorPicker({ colors, onChange }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('pigment');
  const [channels, setChannels] = useState(() =>
    Object.fromEntries(ROLES.map(({ key }) => [key, hexToHsv(colors[key])])),
  );
  const channelsRef = useRef(channels);
  const valuesRef = useRef(
    Object.fromEntries(
      ROLES.map(({ key }) => [key, normalizeHex(colors[key])]),
    ),
  );
  const [draft, setDraft] = useState(colors.pigment.toUpperCase());
  const [error, setError] = useState('');
  const planeRef = useRef(null);
  const draggingRef = useRef(null);
  const hsv = channels[active];
  const role = ROLES.find(({ key }) => key === active);

  // Own edits keep their full HSV precision, including hue at white or black.
  // External preset changes synchronize only the colors that actually changed.
  useEffect(() => {
    const next = { ...channelsRef.current };
    let changed = false;
    let activeChanged = false;
    for (const { key } of ROLES) {
      const hex = normalizeHex(colors[key]);
      if (!hex || hex === valuesRef.current[key]) continue;
      const previous = next[key];
      next[key] = hexToHsv(hex, previous.h);
      if (next[key].v === 0) next[key].s = previous.s;
      valuesRef.current[key] = hex;
      changed = true;
      if (key === active) activeChanged = true;
    }
    if (changed) {
      channelsRef.current = next;
      setChannels(next);
    }
    if (activeChanged) {
      setDraft(colors[active].toUpperCase());
      setError('');
    }
  }, [colors.pigment, colors.tip, colors.fold, colors.background, active]);

  const changeHsv = (patch) => {
    const next = { ...channelsRef.current[active], ...patch };
    next.h = clamp(next.h, 0, 360);
    next.s = clamp(next.s, 0, 100);
    next.v = clamp(next.v, 0, 100);
    const map = { ...channelsRef.current, [active]: next };
    channelsRef.current = map;
    setChannels(map);
    const hex = hsvToHex(next);
    valuesRef.current[active] = hex;
    setDraft(hex.toUpperCase());
    setError('');
    if (hex !== normalizeHex(colors[active])) onChange(active, hex);
  };

  const selectRole = (key) => {
    setActive(key);
    setDraft(colors[key].toUpperCase());
    setError('');
  };

  const commitHex = () => {
    const hex = normalizeHex(draft);
    if (!hex) {
      setError('Use 3 or 6 hex digits, such as #FF8186.');
      return;
    }
    const next = hexToHsv(hex, channelsRef.current[active].h);
    if (next.v === 0) next.s = channelsRef.current[active].s;
    changeHsv(next);
  };

  const mixAtPointer = (event) => {
    const bounds = planeRef.current.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    changeHsv({
      s: clamp(((event.clientX - bounds.left) / bounds.width) * 100, 0, 100),
      v: clamp(
        (1 - (event.clientY - bounds.top) / bounds.height) * 100,
        0,
        100,
      ),
    });
  };

  const stopDrag = (event) => {
    if (draggingRef.current !== event.pointerId) return;
    draggingRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const hueColor = hsvToHex({ h: hsv.h, s: 100, v: 100 });
  const pickedColor = hsvToHex(hsv);

  return (
    <div className="coral-mixer">
      <button
        type="button"
        className="coral-mixer-toggle"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span className="coral-mixer-miniature" aria-hidden="true">
          {ROLES.map(({ key }) => (
            <i key={key} style={{ backgroundColor: colors[key] }} />
          ))}
        </span>
        <span>Mix custom colors</span>
        <CaretDownIcon size={14} weight="bold" aria-hidden="true" />
      </button>

      {open && (
        <div className="coral-mixer-panel" id={`${id}-panel`}>
          <div
            className="coral-mixer-roles"
            role="group"
            aria-label="Color to edit"
          >
            {ROLES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                aria-pressed={active === key}
                onClick={() => selectRole(key)}
              >
                <span
                  style={{ backgroundColor: colors[key] }}
                  aria-hidden="true"
                />
                {label}
              </button>
            ))}
          </div>

          <div className="coral-mixer-heading">
            <span>{role.label}</span>
            <span
              className="coral-mixer-chip"
              style={{ backgroundColor: pickedColor }}
              aria-hidden="true"
            />
          </div>

          <div className="coral-mixer-hex-row">
            <label htmlFor={`${id}-hex`}>Hex color</label>
            <input
              id={`${id}-hex`}
              type="text"
              value={draft}
              maxLength={7}
              placeholder="#FF8186"
              spellCheck="false"
              autoComplete="off"
              aria-label={`${role.label} hex color`}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) => {
                setDraft(event.target.value);
                setError('');
              }}
              onBlur={commitHex}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitHex();
                }
                if (event.key === 'Escape') {
                  event.preventDefault();
                  setDraft(colors[active].toUpperCase());
                  setError('');
                }
              }}
            />
            <button
              type="button"
              aria-label="Apply hex color"
              onClick={commitHex}
            >
              Apply
            </button>
          </div>
          {error && (
            <p id={`${id}-error`} className="coral-mixer-error" role="alert">
              {error}
            </p>
          )}

          <div
            ref={planeRef}
            className="coral-mixer-plane"
            style={{ '--mix-hue': hueColor }}
            role="group"
            tabIndex={0}
            aria-label={`${role.label} saturation and brightness field`}
            aria-describedby={`${id}-instructions`}
            onPointerDown={(event) => {
              if (event.button !== 0 || draggingRef.current !== null) return;
              event.preventDefault();
              event.currentTarget.focus();
              draggingRef.current = event.pointerId;
              event.currentTarget.setPointerCapture(event.pointerId);
              mixAtPointer(event);
            }}
            onPointerMove={(event) => {
              if (draggingRef.current === event.pointerId) mixAtPointer(event);
            }}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onLostPointerCapture={() => {
              draggingRef.current = null;
            }}
            onKeyDown={(event) => {
              const step = event.shiftKey ? 10 : 1;
              const current = channelsRef.current[active];
              const changes = {
                ArrowRight: { s: current.s + step },
                ArrowLeft: { s: current.s - step },
                ArrowUp: { v: current.v + step },
                ArrowDown: { v: current.v - step },
              };
              if (changes[event.key]) {
                event.preventDefault();
                changeHsv(changes[event.key]);
              }
            }}
          >
            <span
              className="coral-mixer-cursor"
              style={{
                left: `${hsv.s}%`,
                top: `${100 - hsv.v}%`,
                backgroundColor: pickedColor,
              }}
            />
          </div>
          <p className="coral-mixer-sr-only" id={`${id}-instructions`}>
            Drag to mix color. Left and right arrows change saturation; up and
            down arrows change brightness. Hold Shift for larger steps. The
            sliders below also adjust these values.
          </p>

          <label
            className="coral-mixer-range coral-mixer-hue"
            htmlFor={`${id}-hue`}
          >
            <span>
              Hue <span>{Math.round(hsv.h)}°</span>
            </span>
            <input
              id={`${id}-hue`}
              type="range"
              min="0"
              max="360"
              value={Math.round(hsv.h)}
              onChange={(event) => changeHsv({ h: Number(event.target.value) })}
              style={{ '--mix-thumb': hueColor }}
            />
          </label>

          <div className="coral-mixer-fine">
            <label className="coral-mixer-range" htmlFor={`${id}-saturation`}>
              <span>
                Saturation <span>{Math.round(hsv.s)}%</span>
              </span>
              <input
                id={`${id}-saturation`}
                type="range"
                min="0"
                max="100"
                value={Math.round(hsv.s)}
                onChange={(event) =>
                  changeHsv({ s: Number(event.target.value) })
                }
                style={{
                  '--mix-track': `linear-gradient(to right, ${hsvToHex({ ...hsv, s: 0 })}, ${hsvToHex({ ...hsv, s: 100 })})`,
                  '--mix-thumb': pickedColor,
                }}
              />
            </label>
            <label className="coral-mixer-range" htmlFor={`${id}-brightness`}>
              <span>
                Brightness <span>{Math.round(hsv.v)}%</span>
              </span>
              <input
                id={`${id}-brightness`}
                type="range"
                min="0"
                max="100"
                value={Math.round(hsv.v)}
                onChange={(event) =>
                  changeHsv({ v: Number(event.target.value) })
                }
                style={{
                  '--mix-track': `linear-gradient(to right, #000, ${hsvToHex({ ...hsv, v: 100 })})`,
                  '--mix-thumb': pickedColor,
                }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
