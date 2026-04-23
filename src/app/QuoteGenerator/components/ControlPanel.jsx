import React, { useRef } from 'react';
import {
  TextTIcon,
  PaletteIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  QuotesIcon,
  CaretDownIcon,
} from '@phosphor-icons/react';

// ─── Workbench-native widgets ───────────────────────────────────────────
// Reads CSS variables set by the host page (QuoteGeneratorPage) so the
// widgets adapt to the Workbench light theme without cross-file plumbing.

const WB_WIDGETS_CSS = `
  .wb-label {
    font-family: 'JetBrains Mono', 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--wb-ink-soft, #6B6A65);
    text-transform: lowercase;
  }
  .wb-value {
    font-family: 'Instrument Sans', system-ui, sans-serif;
    font-size: 13px;
    color: var(--wb-ink, #1A1918);
    font-variant-numeric: tabular-nums;
  }
  .wb-card {
    background: var(--wb-surface, #FFFFFF);
    border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
    border-radius: 14px;
    padding: 20px;
  }
  .wb-section-head {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--wb-ink-soft, #6B6A65);
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
  }

  /* Slider */
  .wb-slider {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    height: 20px;
    width: 100%;
    outline: none;
    cursor: pointer;
  }
  .wb-slider::-webkit-slider-runnable-track {
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(
      to right,
      var(--wb-accent, #C4643A) var(--wb-pct, 0%),
      rgba(25,23,22,0.12) var(--wb-pct, 0%)
    );
  }
  .wb-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 14px; width: 14px;
    border-radius: 50%;
    background: var(--wb-bg, #FAF7F0);
    border: 2px solid var(--wb-accent, #C4643A);
    margin-top: -5.5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    transition: transform .12s ease;
  }
  .wb-slider::-webkit-slider-thumb:hover { transform: scale(1.18); }
  .wb-slider::-moz-range-track {
    height: 3px;
    background: rgba(25,23,22,0.12);
    border-radius: 2px;
  }
  .wb-slider::-moz-range-progress {
    height: 3px;
    background: var(--wb-accent, #C4643A);
    border-radius: 2px;
  }
  .wb-slider::-moz-range-thumb {
    height: 14px; width: 14px;
    border-radius: 50%;
    background: var(--wb-bg, #FAF7F0);
    border: 2px solid var(--wb-accent, #C4643A);
    cursor: pointer;
  }

  /* Select (dropdown) */
  .wb-select {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    background: var(--wb-surface, #FFFFFF);
    border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
    border-radius: 10px;
    padding: 10px 36px 10px 12px;
    font-family: 'Instrument Sans', system-ui, sans-serif;
    font-size: 14px;
    color: var(--wb-ink, #1A1918);
    outline: none;
    transition: border-color .15s ease, box-shadow .15s ease;
    cursor: pointer;
  }
  .wb-select:hover { border-color: var(--wb-hair-hi, rgba(25,23,22,0.16)); }
  .wb-select:focus {
    border-color: var(--wb-accent, #C4643A);
    box-shadow: 0 0 0 3px var(--wb-accent-ring, rgba(196,100,58,0.22));
  }

  /* Text input + textarea */
  .wb-input, .wb-textarea {
    width: 100%;
    background: var(--wb-surface, #FFFFFF);
    border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
    border-radius: 10px;
    padding: 10px 12px;
    font-family: 'Instrument Sans', system-ui, sans-serif;
    font-size: 14px;
    color: var(--wb-ink, #1A1918);
    outline: none;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .wb-input:focus, .wb-textarea:focus {
    border-color: var(--wb-accent, #C4643A);
    box-shadow: 0 0 0 3px var(--wb-accent-ring, rgba(196,100,58,0.22));
  }
  .wb-textarea { resize: vertical; line-height: 1.5; }

  /* Color picker */
  .wb-swatch {
    width: 40px; height: 40px; border-radius: 10px;
    box-shadow: inset 0 0 0 1px rgba(25,23,22,0.18), 0 1px 2px rgba(0,0,0,0.04);
    cursor: pointer;
    transition: transform .15s ease;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
  }
  .wb-swatch:hover { transform: scale(1.06); }
  .wb-hex {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--wb-ink, #1A1918);
  }

  /* Preset buttons */
  .wb-preset-btn {
    padding: 8px 12px;
    border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
    background: var(--wb-surface, #FFFFFF);
    border-radius: 10px;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    color: var(--wb-ink, #1A1918);
    text-align: left;
    cursor: pointer;
    transition: all .15s ease;
  }
  .wb-preset-btn:hover {
    border-color: var(--wb-accent, #C4643A);
    background: var(--wb-accent-soft, rgba(196,100,58,0.10));
    color: var(--wb-accent, #C4643A);
  }

  /* Icon button (align toggle) */
  .wb-icon-btn {
    flex: 1;
    padding: 9px;
    border: 1px solid var(--wb-hair, rgba(25,23,22,0.08));
    background: var(--wb-surface, #FFFFFF);
    border-radius: 10px;
    color: var(--wb-ink-soft, #6B6A65);
    cursor: pointer;
    transition: all .15s ease;
    display: flex; align-items: center; justify-content: center;
  }
  .wb-icon-btn:hover {
    border-color: var(--wb-hair-hi, rgba(25,23,22,0.16));
    color: var(--wb-ink, #1A1918);
  }
  .wb-icon-btn--active {
    background: var(--wb-accent-soft, rgba(196,100,58,0.10));
    border-color: var(--wb-accent, #C4643A);
    color: var(--wb-accent, #C4643A);
  }
`;

const WbSlider = ({ label, value, min, max, step = 1, onChange, format }) => {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const display =
    format ? format(value)
    : typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2)
    : value;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="wb-label">{label}</span>
        <span className="wb-value">{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="wb-slider"
        style={{ '--wb-pct': `${pct}%` }}
      />
    </div>
  );
};

const WbDropdown = ({ label, options, value, onChange, icon: Icon }) => (
  <div>
    {label && (
      <div className="wb-label mb-2 flex items-center gap-2">
        {Icon && <Icon size={12} />}
        <span>{label}</span>
      </div>
    )}
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="wb-select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <CaretDownIcon
        size={14}
        weight="regular"
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--wb-ink-soft, #6B6A65)' }}
      />
    </div>
  </div>
);

const WbColorPicker = ({ label, value, onChange }) => {
  const ref = useRef(null);
  return (
    <div className="flex items-center gap-3">
      <div
        className="wb-swatch"
        style={{ background: value }}
        onClick={() => ref.current?.click()}
        role="button"
        aria-label={`Pick ${label}`}
      >
        <input
          ref={ref}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="wb-label mb-1">{label}</div>
        <input
          type="text"
          value={(value || '').toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="wb-input wb-hex"
          style={{ padding: '6px 10px', fontSize: 13 }}
        />
      </div>
    </div>
  );
};

// ─── THEME PRESETS ──────────────────────────────────────────────────────
const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern)' },
  { value: 'Space Mono', label: 'Space Mono' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Courier New', label: 'Courier New (Typewriter)' },
  { value: 'Cinzel', label: 'Cinzel (Fantasy)' },
  { value: 'Impact', label: 'Impact (Meme)' },
  { value: 'Caveat', label: 'Caveat (Handwritten)' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'UnifrakturMaguntia', label: 'UnifrakturMaguntia (Old English)' },
];

const THEME_PRESETS = [
  { name: 'Modern',     config: { fontFamily: 'Inter',            backgroundColor: '#ffffff', textColor: '#000000', fontWeight: 800, themeType: 'standard',   textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Typewriter', config: { fontFamily: 'Courier New',      backgroundColor: '#f4f4f0', textColor: '#333333', fontWeight: 400, themeType: 'typewriter', textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Genius',     config: { fontFamily: 'Inter',            backgroundColor: '#000000', textColor: '#ffffff', fontWeight: 900, themeType: 'standard',   textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Pastoral',   config: { fontFamily: 'Playfair Display', backgroundColor: '#e3dcd2', textColor: '#2c3e50', fontWeight: 400, themeType: 'standard',   textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Wordbox',    config: { fontFamily: 'Oswald',           backgroundColor: '#f4f4f0', textColor: '#1a1a1a', fontWeight: 700, themeType: 'wordbox',    textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Newspaper',  config: { fontFamily: 'Playfair Display', backgroundColor: '#eeeae0', textColor: '#1a1a1a', fontWeight: 700, themeType: 'newspaper',  textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Handwritten',config: { fontFamily: 'Caveat',           backgroundColor: '#fdf6e3', textColor: '#444444', fontWeight: 400, themeType: 'standard',   textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Neon',       config: { fontFamily: 'Montserrat',       backgroundColor: '#0a0a0a', textColor: '#00ffff', fontWeight: 700, themeType: 'neon',       textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Polaroid',   config: { fontFamily: 'Caveat',           backgroundColor: '#e8e8e8', textColor: '#2c3e50', fontWeight: 700, themeType: 'polaroid',   textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Brutalist',  config: { fontFamily: 'Impact',           backgroundColor: '#ff0000', textColor: '#ffff00', fontWeight: 900, themeType: 'brutalist',  textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Lana Del Rey', config: { fontFamily: 'Lora',           backgroundColor: '#f5f0ea', textColor: '#8b6e58', fontWeight: 400, themeType: 'standard',   textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Rome',       config: { fontFamily: 'Cinzel',           backgroundColor: '#2c1810', textColor: '#d4af37', fontWeight: 400, themeType: 'rome',       textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Science',    config: { fontFamily: 'Courier New',      backgroundColor: '#f0f4f8', textColor: '#1a3a5c', fontWeight: 400, themeType: 'science',    textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Drama',      config: { fontFamily: 'Playfair Display', backgroundColor: '#1a0f2e', textColor: '#f5e6d3', fontWeight: 700, themeType: 'wordbox',    textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Comedy',     config: { fontFamily: 'Caveat',           backgroundColor: '#fff9e6', textColor: '#e74c3c', fontWeight: 700, themeType: 'standard',   textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Life',       config: { fontFamily: 'Lora',             backgroundColor: '#e8f0e3', textColor: '#2d4a2b', fontWeight: 400, themeType: 'standard',   textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Birds',      config: { fontFamily: 'Caveat',           backgroundColor: '#e3f2fd', textColor: '#1565c0', fontWeight: 400, themeType: 'birds',      textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Kings',      config: { fontFamily: 'Cinzel',           backgroundColor: '#3e2723', textColor: '#d4af37', fontWeight: 700, themeType: 'kings',      textAlign: 'center', overlayOpacity: 0 } },
  { name: 'French Girl',config: { fontFamily: 'Playfair Display', backgroundColor: '#fce4ec', textColor: '#4a148c', fontWeight: 400, themeType: 'french-girl',textAlign: 'center', overlayOpacity: 0 } },
  { name: 'CIA',        config: { fontFamily: 'Courier New',      backgroundColor: '#1a1a1a', textColor: '#ffffff', fontWeight: 700, themeType: 'cia',        textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'FBI',        config: { fontFamily: 'Courier New',      backgroundColor: '#0d1b2a', textColor: '#fca311', fontWeight: 700, themeType: 'fbi',        textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Espionage',  config: { fontFamily: 'Space Mono',       backgroundColor: '#0a0a0a', textColor: '#00ff00', fontWeight: 700, themeType: 'espionage',  textAlign: 'left',   overlayOpacity: 0 } },
  { name: 'Control Panel', config: { fontFamily: 'Space Mono',    backgroundColor: '#1e293b', textColor: '#38bdf8', fontWeight: 700, themeType: 'control-panel', textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Basketball', config: { fontFamily: 'Oswald',           backgroundColor: '#d2691e', textColor: '#ffffff', fontWeight: 700, themeType: 'basketball', textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Football',   config: { fontFamily: 'Oswald',           backgroundColor: '#2d5016', textColor: '#ffffff', fontWeight: 700, themeType: 'football',   textAlign: 'center', overlayOpacity: 0 } },
  { name: 'River',      config: { fontFamily: 'Lora',             backgroundColor: '#4a90a4', textColor: '#ffffff', fontWeight: 400, themeType: 'river',      textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Mountain',   config: { fontFamily: 'Montserrat',       backgroundColor: '#5d6d7e', textColor: '#ffffff', fontWeight: 700, themeType: 'mountain',   textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Cats',       config: { fontFamily: 'Caveat',           backgroundColor: '#ffb6c1', textColor: '#4a148c', fontWeight: 700, themeType: 'cats',       textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Libretto',   config: { fontFamily: 'Playfair Display', backgroundType: 'radial', backgroundColor: '#F0E4C8', gradientColor1: '#F0E4C8', gradientColor2: '#E8D9B5', textColor: '#1A0A0D', fontWeight: 400, themeType: 'libretto',   textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Chalkboard', config: { fontFamily: 'Caveat',           backgroundColor: '#1F3228', textColor: '#F5F1E3', fontWeight: 400, themeType: 'chalkboard', textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Tarot',      config: { fontFamily: 'Cinzel',           backgroundType: 'radial', backgroundColor: '#1A0A2E', gradientColor1: '#2D1B4F', gradientColor2: '#0F0520', textColor: '#E8C878', fontWeight: 700, themeType: 'tarot',      textAlign: 'center', overlayOpacity: 0 } },
  { name: 'Ransom',     config: { fontFamily: 'Impact',           backgroundColor: '#F5E8C9', textColor: '#0A0A0A', fontWeight: 900, themeType: 'ransom',     textAlign: 'center', overlayOpacity: 0 } },
];

const THEME_STYLE_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'wordbox', label: 'Wordbox' },
  { value: 'typewriter', label: 'Typewriter' },
  { value: 'newspaper', label: 'Newspaper' },
  { value: 'neon', label: 'Neon' },
  { value: 'polaroid', label: 'Polaroid' },
  { value: 'brutalist', label: 'Brutalist' },
  { value: 'science', label: 'Science' },
  { value: 'french-girl', label: 'French Girl' },
  { value: 'kings', label: 'Kings' },
  { value: 'birds', label: 'Birds' },
  { value: 'rome', label: 'Rome' },
  { value: 'cia', label: 'CIA' },
  { value: 'fbi', label: 'FBI' },
  { value: 'espionage', label: 'Espionage' },
  { value: 'control-panel', label: 'Control Panel' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'football', label: 'Football' },
  { value: 'river', label: 'River' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'cats', label: 'Cats' },
  { value: 'libretto', label: 'Libretto' },
  { value: 'chalkboard', label: 'Chalkboard' },
  { value: 'tarot', label: 'Tarot' },
  { value: 'ransom', label: 'Ransom' },
];

// ─── Component ──────────────────────────────────────────────────────────
const ControlPanel = ({ state, updateState }) => {
  const handleChange = (key, value) => {
    updateState({ [key]: value });
  };
  const applyPreset = (preset) => {
    updateState({ ...state, ...preset.config });
  };

  return (
    <div className="space-y-4">
      <style>{WB_WIDGETS_CSS}</style>

      {/* Presets */}
      <div className="wb-card">
        <h3 className="wb-section-head">
          <QuotesIcon weight="regular" />
          Presets
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="wb-preset-btn"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="wb-card space-y-4">
        <h3 className="wb-section-head">
          <TextTIcon weight="regular" />
          Content
        </h3>
        <div>
          <div className="wb-label mb-2">Quote</div>
          <textarea
            value={state.text}
            onChange={(e) => handleChange('text', e.target.value)}
            rows={4}
            className="wb-textarea"
            placeholder="Enter your quote here…"
          />
        </div>
        <div>
          <div className="wb-label mb-2">Author</div>
          <input
            type="text"
            value={state.author}
            onChange={(e) => handleChange('author', e.target.value)}
            className="wb-input"
            placeholder="Author name"
          />
        </div>
      </div>

      {/* Typography */}
      <div className="wb-card space-y-4">
        <h3 className="wb-section-head">
          <TextTIcon weight="regular" />
          Typography
        </h3>

        <WbDropdown
          label="Font family"
          options={FONT_OPTIONS}
          value={state.fontFamily}
          onChange={(val) => handleChange('fontFamily', val)}
        />

        <div>
          <div className="wb-label mb-2">Alignment</div>
          <div className="flex gap-2">
            {[
              { v: 'left',   Icon: TextAlignLeftIcon },
              { v: 'center', Icon: TextAlignCenterIcon },
              { v: 'right',  Icon: TextAlignRightIcon },
            ].map(({ v, Icon }) => {
              const active = state.textAlign === v;
              return (
                <button
                  key={v}
                  onClick={() => handleChange('textAlign', v)}
                  className={`wb-icon-btn ${active ? 'wb-icon-btn--active' : ''}`}
                  aria-label={`Align ${v}`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>

        <WbSlider label="Font size"   value={state.fontSize}   min={12}  max={128} onChange={(v) => handleChange('fontSize', v)} />
        <WbSlider label="Line height" value={state.lineHeight} min={0.8} max={3}   step={0.1} onChange={(v) => handleChange('lineHeight', v)} />
        <WbSlider label="Font weight" value={state.fontWeight} min={100} max={900} step={100} onChange={(v) => handleChange('fontWeight', v)} />
      </div>

      {/* Canvas */}
      <div className="wb-card space-y-4">
        <h3 className="wb-section-head">
          <PaletteIcon weight="regular" />
          Canvas
        </h3>
        <WbSlider label="Width"  value={state.width}  min={500} max={2000} step={10} onChange={(v) => handleChange('width', v)} />
        <WbSlider label="Height" value={state.height} min={500} max={2000} step={10} onChange={(v) => handleChange('height', v)} />
      </div>

      {/* Visuals */}
      <div className="wb-card space-y-4">
        <h3 className="wb-section-head">
          <PaletteIcon weight="regular" />
          Visuals
        </h3>

        <WbDropdown
          label="Background type"
          options={[
            { value: 'solid',  label: 'Solid color' },
            { value: 'linear', label: 'Linear gradient' },
            { value: 'radial', label: 'Radial gradient' },
          ]}
          value={state.backgroundType || 'solid'}
          onChange={(val) => handleChange('backgroundType', val)}
        />

        {(!state.backgroundType || state.backgroundType === 'solid') ? (
          <WbColorPicker
            label="Background"
            value={state.backgroundColor}
            onChange={(val) => handleChange('backgroundColor', val)}
          />
        ) : (
          <div className="space-y-4 pt-3" style={{ borderTop: '1px solid var(--wb-hair)' }}>
            <WbColorPicker
              label="Color 1"
              value={state.gradientColor1 || '#ff0000'}
              onChange={(val) => handleChange('gradientColor1', val)}
            />
            <WbColorPicker
              label="Color 2"
              value={state.gradientColor2 || '#0000ff'}
              onChange={(val) => handleChange('gradientColor2', val)}
            />
            {state.backgroundType === 'linear' && (
              <WbSlider
                label="Gradient angle"
                min={0} max={360}
                value={state.gradientAngle || 135}
                onChange={(v) => handleChange('gradientAngle', v)}
              />
            )}
          </div>
        )}

        <WbColorPicker
          label="Text color"
          value={state.textColor}
          onChange={(val) => handleChange('textColor', val)}
        />

        <div className="pt-3" style={{ borderTop: '1px solid var(--wb-hair)' }}>
          <WbSlider
            label="Padding"
            min={0} max={200}
            value={state.padding}
            onChange={(v) => handleChange('padding', v)}
          />
        </div>

        <div className="pt-3" style={{ borderTop: '1px solid var(--wb-hair)' }}>
          <WbDropdown
            label="Theme style"
            options={THEME_STYLE_OPTIONS}
            value={state.themeType}
            onChange={(val) => handleChange('themeType', val)}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
