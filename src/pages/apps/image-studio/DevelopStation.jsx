/**
 * DevelopStation — the "Develop" tab. Creative filters, palette extraction and
 * ASCII rendering, ported from the old ImageToolkit but driven by the declarative
 * EFFECT_GROUPS catalog and the shared Darkroom UI.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DownloadSimpleIcon,
  CopySimpleIcon,
  EyedropperIcon,
  TextAaIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../../hooks/useToast';
import {
  EFFECT_GROUPS,
  EFFECT_BY_ID,
  DEFAULT_PARAMS,
  renderEffect,
  extractPalette,
} from './imageFilters';
import {
  Panel,
  SectionLabel,
  SolidButton,
  RangeSlider,
  ColorField,
} from './ui';

function PaletteStrip({ src }) {
  const [palette, setPalette] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    extractPalette(src, 5)
      .then((data) => !cancelled && (setPalette(data), setLoading(false)))
      .catch(() => !cancelled && (setPalette(null), setLoading(false)));
    return () => {
      cancelled = true;
    };
  }, [src]);

  const copy = (hex) => {
    navigator.clipboard.writeText(hex);
    addToast({ title: 'Copied', message: `${hex} → clipboard`, duration: 1600 });
  };

  if (loading) {
    return (
      <div
        className="dk-mono animate-pulse text-[10px] uppercase tracking-[0.28em]"
        style={{ color: 'var(--dk-mute)' }}
      >
        Reading emulsion…
      </div>
    );
  }
  if (!palette) return null;

  return (
    <div className="grid grid-cols-5 gap-2">
      {palette.map((hex, i) => (
        <button
          key={`${hex}-${i}`}
          type="button"
          onClick={() => copy(hex)}
          className="group relative h-14 overflow-hidden rounded-lg border transition-transform hover:scale-105"
          style={{ background: hex, borderColor: 'var(--dk-line)' }}
          title={hex}
        >
          <span className="absolute inset-x-0 bottom-0 dk-mono bg-black/55 py-0.5 text-center text-[8px] uppercase tracking-wider text-white opacity-0 transition-opacity group-hover:opacity-100">
            {hex}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function DevelopStation({ image }) {
  const { addToast } = useToast();
  const canvasRef = useRef(null);
  const [effectId, setEffectId] = useState('monochrome');
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [ascii, setAscii] = useState('');

  const effect = EFFECT_BY_ID[effectId];

  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const res = renderEffect(canvasRef.current, img, effectId, params);
        setAscii(res.ascii || '');
      } catch {
        addToast({
          title: 'Develop failed',
          message: 'Could not process this frame.',
          type: 'error',
        });
      }
    };
    img.src = image.src;
  }, [image, effectId, params, addToast]);

  const setParam = useCallback(
    (key, val) => setParams((p) => ({ ...p, [key]: val })),
    [],
  );

  const download = () => {
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `${image.name}-${effectId}.png`;
    a.href = url;
    a.click();
    addToast({ title: 'Developed', message: 'PNG saved to disk.' });
  };

  const copyAscii = () => {
    navigator.clipboard.writeText(ascii);
    addToast({ title: 'Copied', message: 'ASCII frame → clipboard.' });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Controls */}
      <div className="space-y-6 lg:col-span-4">
        <Panel className="space-y-7 p-7">
          <SectionLabel index="01">Process</SectionLabel>
          {EFFECT_GROUPS.map((group) => (
            <div key={group.label} className="space-y-3">
              <div
                className="dk-mono text-[9px] uppercase tracking-[0.3em]"
                style={{ color: 'var(--dk-faint)' }}
              >
                {group.label}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {group.effects.map((e) => {
                  const active = e.id === effectId;
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setEffectId(e.id)}
                      className="rounded-xl border px-3 py-2.5 text-left transition-all duration-200"
                      style={{
                        borderColor: active
                          ? 'var(--dk-safe)'
                          : 'var(--dk-line)',
                        background: active
                          ? 'rgba(255,90,54,0.10)'
                          : 'transparent',
                      }}
                    >
                      <div
                        className="text-[12px] font-semibold"
                        style={{
                          color: active ? 'var(--dk-paper)' : 'var(--dk-ink)',
                        }}
                      >
                        {e.label}
                      </div>
                      <div
                        className="dk-mono text-[8px] uppercase tracking-wider"
                        style={{ color: 'var(--dk-mute)' }}
                      >
                        {e.hint}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Panel>

        {effect?.controls?.length > 0 && (
          <Panel className="space-y-6 p-7">
            <SectionLabel index="02">Tune · {effect.label}</SectionLabel>
            {effect.controls.map((c) =>
              c.type === 'range' ? (
                <RangeSlider
                  key={c.key}
                  label={c.label}
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  unit={c.unit || ''}
                  value={params[c.key]}
                  onChange={(v) => setParam(c.key, v)}
                />
              ) : (
                <ColorField
                  key={c.key}
                  label={c.label}
                  value={params[c.key]}
                  onChange={(v) => setParam(c.key, v)}
                />
              ),
            )}
          </Panel>
        )}

        <Panel className="space-y-5 p-7">
          <SectionLabel index="03">
            <span className="inline-flex items-center gap-2">
              <EyedropperIcon size={12} weight="bold" /> Palette
            </span>
          </SectionLabel>
          <PaletteStrip src={image.src} />
        </Panel>
      </div>

      {/* Preview */}
      <div className="lg:col-span-8">
        <Panel className="space-y-6 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <SectionLabel className="flex-1">Contact Print</SectionLabel>
            {effectId !== 'ascii' && (
              <SolidButton icon={DownloadSimpleIcon} onClick={download}>
                Save PNG
              </SolidButton>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <figure className="space-y-2">
              <figcaption
                className="dk-mono text-[9px] uppercase tracking-[0.28em]"
                style={{ color: 'var(--dk-mute)' }}
              >
                Negative · original
              </figcaption>
              <div
                className="overflow-hidden rounded-xl border bg-black/40"
                style={{ borderColor: 'var(--dk-line)' }}
              >
                <img
                  src={image.src}
                  alt="original"
                  className="h-auto w-full opacity-80"
                />
              </div>
            </figure>
            <figure className="space-y-2">
              <figcaption
                className="dk-mono text-[9px] uppercase tracking-[0.28em]"
                style={{ color: 'var(--dk-safe)' }}
              >
                Print · {effect?.label}
              </figcaption>
              <div
                className="overflow-hidden rounded-xl border bg-black/40"
                style={{ borderColor: 'rgba(255,90,54,0.25)' }}
              >
                <canvas
                  ref={canvasRef}
                  className={`h-auto w-full ${effectId === 'ascii' ? 'opacity-30' : ''}`}
                />
              </div>
            </figure>
          </div>

          <AnimatePresence>
            {effectId === 'ascii' && ascii && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3 border-t pt-5"
                style={{ borderColor: 'var(--dk-line)' }}
              >
                <div className="flex items-center justify-between">
                  <SectionLabel className="flex-1">
                    <span className="inline-flex items-center gap-2">
                      <TextAaIcon size={12} weight="bold" /> ASCII frame
                    </span>
                  </SectionLabel>
                  <button
                    type="button"
                    onClick={copyAscii}
                    className="transition-colors"
                    style={{ color: 'var(--dk-safe)' }}
                  >
                    <CopySimpleIcon size={18} />
                  </button>
                </div>
                <pre
                  className="dk-scroll dk-mono overflow-x-auto whitespace-pre rounded-xl bg-black/50 p-5 text-[7px] leading-[0.85] md:text-[9px]"
                  style={{ color: 'var(--dk-safe-2)' }}
                >
                  {ascii}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </Panel>
      </div>
    </div>
  );
}
