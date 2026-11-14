import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowsClockwiseIcon,
  DownloadSimpleIcon,
  FlowerIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import {
  DEFAULT_SETTINGS,
  FORMATS,
  PALETTES,
  renderCoralBloom,
  resolvePalette,
} from './coral-bloom/coralBloom';
import CoralColorPicker from './coral-bloom/CoralColorPicker';
import './coral-bloom/coralBloom.css';

function Slider({ label, value, min, max, onChange }) {
  const id = useId();
  return (
    <label className="coral-slider" htmlFor={id}>
      <span>
        {label}
        <output>{value}</output>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default function CoralBloomPage() {
  const canvasRef = useRef(null);
  const { addToast } = useToast();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [renderedSettings, setRenderedSettings] = useState(null);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const format = FORMATS.find((item) => item.id === settings.format);
  const palette = resolvePalette(settings);
  const hasCustomColors = Boolean(
    settings.colors && Object.keys(settings.colors).length,
  );
  const ready = renderedSettings === settings;

  const update = (key, value) => {
    setError('');
    setSettings((previous) => ({ ...previous, [key]: value }));
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const canvas = canvasRef.current;
        // Match export proportions while keeping the live canvas light.
        canvas.width = Math.round(format.width * 0.6);
        canvas.height = Math.round(format.height * 0.6);
        renderCoralBloom(canvas, settings);
        setRenderedSettings(settings);
        setError('');
      } catch (drawError) {
        setError(
          drawError.message ||
            'The drawing could not be created. Try a new seed.',
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [settings, format]);

  const regenerate = () => {
    update('seed', `coral-${Math.random().toString(36).slice(2, 9)}`);
  };

  const download = async () => {
    if (!ready || exporting) return;
    setExporting(true);
    setError('');
    try {
      // Export the same composition at the chosen full resolution.
      const canvas = document.createElement('canvas');
      canvas.width = format.width;
      canvas.height = format.height;
      renderCoralBloom(canvas, settings);
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png'),
      );
      if (!blob)
        throw new Error('The PNG could not be created. Please try again.');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `coral-bloom-${settings.seed.replace(/[^a-z0-9_-]/gi, '-').slice(0, 64) || 'untitled'}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      addToast({
        title: 'PNG saved',
        message: `${format.width} × ${format.height} artwork exported.`,
        duration: 3000,
      });
    } catch (exportError) {
      setError(
        exportError.message || 'The PNG could not be saved. Please try again.',
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="coral-page">
      <Seo
        title="Coral Bloom | Fezcodex"
        description="Create flowing coral fans with sculpted ribs, scalloped edges and deep shadows. A seeded procedural art generator with high-resolution PNG export."
        keywords={[
          'coral',
          'generative art',
          'procedural art',
          'ginkgo',
          'wallpaper',
          'canvas',
        ]}
      />
      <div className="coral-studio">
        <header className="coral-header">
          <Link to="/apps" className="coral-back">
            <ArrowLeftIcon size={16} /> All apps
          </Link>
          <span className="coral-header-mark">
            <FlowerIcon size={20} weight="light" /> An experiment in organic
            form
          </span>
        </header>

        <div className="coral-workspace">
          <div className="coral-intro">
            <h1>Coral Bloom</h1>
            <p>Soft edges. Deep folds. A little ocean, grown from a seed.</p>
          </div>
          <aside className="coral-controls" aria-label="Artwork controls">
            <button
              type="button"
              onClick={regenerate}
              className="coral-button coral-generate"
            >
              <ArrowsClockwiseIcon size={18} /> New composition
            </button>

            <fieldset className="coral-fieldset">
              <legend>Color story</legend>
              <div className="coral-palettes">
                {PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    type="button"
                    aria-label={palette.name}
                    aria-pressed={
                      !hasCustomColors && settings.palette === palette.id
                    }
                    title={palette.name}
                    onClick={() => {
                      setError('');
                      setSettings((previous) => ({
                        ...previous,
                        palette: palette.id,
                        colors: null,
                      }));
                    }}
                    style={{
                      '--swatch': palette.tip,
                      '--swatch-dark': palette.background,
                    }}
                  >
                    <span />
                  </button>
                ))}
              </div>
              <p className="coral-palette-name">
                {hasCustomColors ? 'Your color story' : palette.name}
              </p>
              <CoralColorPicker
                colors={palette}
                onChange={(key, color) => {
                  setError('');
                  setSettings((previous) => ({
                    ...previous,
                    colors: { ...previous.colors, [key]: color },
                  }));
                }}
              />
            </fieldset>

            <fieldset className="coral-fieldset coral-shape-controls">
              <legend>Shape & surface</legend>
              <Slider
                label="Density"
                value={settings.density}
                min={15}
                max={100}
                onChange={(value) => update('density', value)}
              />
              <Slider
                label="Flow & curl"
                value={settings.curl}
                min={0}
                max={100}
                onChange={(value) => update('curl', value)}
              />
              <Slider
                label="Ribs per fan"
                value={settings.ribs}
                min={18}
                max={60}
                onChange={(value) => update('ribs', value)}
              />
              <Slider
                label="Shadow depth"
                value={settings.relief}
                min={0}
                max={100}
                onChange={(value) => update('relief', value)}
              />
              <Slider
                label="Film grain"
                value={settings.grain}
                min={0}
                max={50}
                onChange={(value) => update('grain', value)}
              />
            </fieldset>

            <label className="coral-seed">
              Composition seed
              <input
                type="text"
                value={settings.seed}
                maxLength={80}
                spellCheck="false"
                onChange={(event) => update('seed', event.target.value)}
              />
              <span>The same seed and settings grow the same artwork.</span>
            </label>

            <fieldset className="coral-fieldset">
              <legend>Canvas</legend>
              <div className="coral-formats">
                {FORMATS.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    aria-pressed={settings.format === item.id}
                    onClick={() => update('format', item.id)}
                  >
                    <span
                      style={{ aspectRatio: `${item.width} / ${item.height}` }}
                    />
                    {item.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              className="coral-button coral-download"
              onClick={download}
              disabled={!ready || exporting}
            >
              <DownloadSimpleIcon size={18} />
              {exporting ? 'Saving PNG…' : 'Save PNG'}
            </button>
            <p className="coral-export-size">
              {format.width} × {format.height} px
            </p>
            <button
              type="button"
              className="coral-reset"
              onClick={() => {
                setError('');
                setSettings({ ...DEFAULT_SETTINGS });
              }}
            >
              Reset to original
            </button>
          </aside>

          <section className="coral-artwork" aria-label="Artwork preview">
            <figure>
              <div
                className="coral-canvas-wrap"
                style={{ aspectRatio: `${format.width} / ${format.height}` }}
                aria-busy={!ready}
              >
                <canvas
                  ref={canvasRef}
                  role="img"
                  aria-label="Procedural artwork of overlapping, ribbed sea fans with scalloped edges on a dark background"
                />
              </div>
              <figcaption>
                <span>Every fold begins with a line.</span>
                <span role="status" aria-live="polite">
                  {error
                    ? 'Drawing interrupted'
                    : ready
                      ? 'Ready to save'
                      : 'Growing your composition…'}
                </span>
              </figcaption>
            </figure>
            {error && (
              <p className="coral-error" role="alert">
                {error}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
