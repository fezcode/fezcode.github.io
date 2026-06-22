/**
 * ReduceStation — the "Reduce" tab. JPEG/WebP quality compression with a live
 * before/after weight comparison, ported from the old ImageCompressor.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadSimpleIcon, ArrowsInLineHorizontalIcon } from '@phosphor-icons/react';
import { useToast } from '../../../hooks/useToast';
import {
  Panel,
  SectionLabel,
  SolidButton,
  RangeSlider,
  SegmentedControl,
  Stat,
  formatBytes,
} from './ui';

const FORMATS = [
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
];

export default function ReduceStation({ image }) {
  const { addToast } = useToast();
  const canvasRef = useRef(null);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState('image/jpeg');
  const [result, setResult] = useState(null); // { url, size }

  const compress = useCallback(() => {
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const url = canvas.toDataURL(format, quality);
        const header = `data:${format};base64,`.length;
        setResult({ url, size: (url.length - header) * 0.75 });
      } catch {
        addToast({
          title: 'Reduce failed',
          message: 'Could not compress this frame.',
          type: 'error',
        });
      }
    };
  }, [image.src, format, quality, addToast]);

  // Auto-compress on load / parameter change so the comparison is always live.
  useEffect(() => {
    setResult(null);
    compress();
  }, [compress]);

  const fmt = FORMATS.find((f) => f.value === format);
  const saved =
    result && image.size
      ? Math.max(0, Math.round((1 - result.size / image.size) * 100))
      : null;

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.download = `${image.name}-reduced.${fmt.ext}`;
    a.href = result.url;
    a.click();
    addToast({ title: 'Reduced', message: `Saved ${fmt.label}.` });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-4">
        <Panel className="space-y-7 p-7">
          <SectionLabel index="01">
            <span className="inline-flex items-center gap-2">
              <ArrowsInLineHorizontalIcon size={12} weight="bold" /> Bit density
            </span>
          </SectionLabel>

          <div className="space-y-3">
            <div
              className="dk-mono text-[9px] uppercase tracking-[0.3em]"
              style={{ color: 'var(--dk-faint)' }}
            >
              Format
            </div>
            <SegmentedControl
              options={FORMATS}
              value={format}
              onChange={setFormat}
              layoutId="reduce-fmt"
            />
          </div>

          <RangeSlider
            label="Quality"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={setQuality}
            format={(v) => `${Math.round(v * 100)}%`}
          />

          <div className="grid grid-cols-2 gap-4 border-t pt-5" style={{ borderColor: 'var(--dk-line)' }}>
            <Stat label="Original" value={formatBytes(image.size)} />
            <Stat
              label="Reduced"
              value={result ? formatBytes(result.size) : '—'}
              accent
            />
          </div>

          <SolidButton
            icon={DownloadSimpleIcon}
            onClick={download}
            disabled={!result}
            className="w-full"
          >
            Save {fmt.label}
          </SolidButton>
        </Panel>

        <p
          className="dk-mono px-2 text-[9px] uppercase leading-relaxed tracking-[0.2em]"
          style={{ color: 'var(--dk-faint)' }}
        >
          All processing stays in your browser — nothing is uploaded.
        </p>
      </div>

      <div className="lg:col-span-8">
        <Panel className="space-y-6 p-6 md:p-8">
          <SectionLabel>Comparison</SectionLabel>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <figure className="space-y-2">
              <figcaption className="flex items-baseline justify-between">
                <span
                  className="dk-mono text-[9px] uppercase tracking-[0.28em]"
                  style={{ color: 'var(--dk-mute)' }}
                >
                  Original
                </span>
                <span className="dk-mono text-[11px]" style={{ color: 'var(--dk-paper)' }}>
                  {formatBytes(image.size)}
                </span>
              </figcaption>
              <div
                className="overflow-hidden rounded-xl border bg-black/40"
                style={{ borderColor: 'var(--dk-line)' }}
              >
                <img src={image.src} alt="original" className="h-auto w-full opacity-80" />
              </div>
            </figure>

            <figure className="space-y-2">
              <figcaption className="flex items-baseline justify-between">
                <span
                  className="dk-mono text-[9px] uppercase tracking-[0.28em]"
                  style={{ color: 'var(--dk-safe)' }}
                >
                  Reduced
                </span>
                <span className="dk-mono text-[11px]" style={{ color: 'var(--dk-safe)' }}>
                  {result ? formatBytes(result.size) : '—'}
                </span>
              </figcaption>
              <div
                className="overflow-hidden rounded-xl border bg-black/40"
                style={{ borderColor: 'rgba(255,90,54,0.25)' }}
              >
                {result && (
                  <img src={result.url} alt="reduced" className="h-auto w-full" />
                )}
              </div>
            </figure>
          </div>

          <AnimatePresence>
            {saved != null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between rounded-xl border px-6 py-4"
                style={{
                  borderColor: 'rgba(255,90,54,0.25)',
                  background: 'rgba(255,90,54,0.06)',
                }}
              >
                <span
                  className="dk-mono text-[10px] uppercase tracking-[0.28em]"
                  style={{ color: 'var(--dk-mute)' }}
                >
                  Footprint reduction
                </span>
                <span
                  className="dk-display text-3xl font-semibold"
                  style={{ color: 'var(--dk-safe)' }}
                >
                  {saved}%
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Panel>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
