/**
 * ImageStudioPage — "Darkroom".
 *
 * A single image studio that merges three former apps (Image Toolkit, Image
 * Compressor, Asset Studio) into one shared workflow: load a roll of frames once,
 * then move between three stations — Develop (filters), Reduce (compress) and
 * Print (resize / convert / presets / bulk). New 2026 darkroom aesthetic.
 */
import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  ApertureIcon,
  PlusIcon,
  TrashIcon,
  FlaskIcon,
  ArrowsInLineHorizontalIcon,
  PrinterIcon,
  ImagesIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { DarkroomStyles, Panel, SegmentedControl, formatBytes } from './image-studio/ui';
import DevelopStation from './image-studio/DevelopStation';
import ReduceStation from './image-studio/ReduceStation';
import PrintStation from './image-studio/PrintStation';

const STATIONS = [
  { value: 'develop', label: 'Develop', icon: FlaskIcon },
  { value: 'reduce', label: 'Reduce', icon: ArrowsInLineHorizontalIcon },
  { value: 'print', label: 'Print', icon: PrinterIcon },
];

const uid = () => Math.random().toString(36).slice(2, 9);
const frameNo = (i) => String(i + 1).padStart(2, '0');

export default function ImageStudioPage() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [station, setStation] = useState('develop');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              id: uid(),
              src: ev.target.result,
              name: file.name.replace(/\.[^.]+$/, '') || 'frame',
              width: img.width,
              height: img.height,
              size: file.size,
            },
          ]);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = (id) => {
    setImages((prev) => {
      const next = prev.filter((im) => im.id !== id);
      setCurrentIndex((ci) => Math.max(0, Math.min(ci, next.length - 1)));
      return next;
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const current = images[currentIndex];
  const hasImages = images.length > 0;

  return (
    <div className="darkroom">
      <DarkroomStyles />
      <Seo
        title="Darkroom — Image Studio | Fezcodex"
        description="A complete in-browser image studio: apply creative filters, compress and optimise file size, resize, scale and convert to WebP/PNG/JPEG, and generate favicons and social cards — all locally, nothing uploaded."
        keywords={[
          'Fezcodex',
          'image studio',
          'image editor',
          'image filters',
          'image compressor',
          'image converter',
          'image resizer',
          'favicon generator',
          'og image',
          'webp converter',
        ]}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-12 md:px-10 md:py-20">
        {/* Header --------------------------------------------------------- */}
        <header className="dk-rise mb-12">
          <Link
            to="/apps"
            className="group inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors"
            style={{ borderColor: 'var(--dk-line)', color: 'var(--dk-mute)' }}
          >
            <ArrowLeftIcon
              size={14}
              weight="bold"
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Index
          </Link>

          <div className="mt-9 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <div
                className="dk-mono flex items-center gap-3 text-[10px] uppercase tracking-[0.4em]"
                style={{ color: 'var(--dk-safe)' }}
              >
                <ApertureIcon size={14} weight="fill" />
                Fezcodex · Image Studio
              </div>
              <h1
                className="dk-display text-6xl font-light leading-[0.9] md:text-8xl"
                style={{ color: 'var(--dk-paper)' }}
              >
                Dark
                <span className="italic" style={{ color: 'var(--dk-safe)' }}>
                  room
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed md:text-lg" style={{ color: 'var(--dk-ink)' }}>
                Load a roll, then work it through three stations — develop with
                filters, reduce the file weight, and print web-ready assets.
                Everything happens locally in your browser.
              </p>
            </div>

            <div
              className="dk-mono flex shrink-0 items-center gap-6 text-[10px] uppercase tracking-[0.2em]"
              style={{ color: 'var(--dk-mute)' }}
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--dk-safe)' }} />
                {images.length} {images.length === 1 ? 'frame' : 'frames'}
              </span>
              <span>local-only</span>
            </div>
          </div>
        </header>

        {/* Film roll ------------------------------------------------------ */}
        <section
          className="dk-rise mb-10"
          style={{ animationDelay: '0.08s' }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <Panel
            className="overflow-hidden p-0 transition-colors"
            glow={dragging}
          >
            {/* sprocket band */}
            <div
              className="h-3 w-full"
              style={{
                background:
                  'repeating-linear-gradient(90deg, transparent 0 10px, var(--dk-void) 10px 18px)',
                opacity: 0.5,
              }}
            />
            <div className="dk-scroll flex items-center gap-3 overflow-x-auto p-4">
              {images.map((im, i) => (
                <button
                  key={im.id}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className="group relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border transition-all"
                  style={{
                    borderColor: i === currentIndex ? 'var(--dk-safe)' : 'var(--dk-line)',
                    boxShadow: i === currentIndex ? '0 0 22px -6px var(--dk-safe)' : 'none',
                  }}
                >
                  <img src={im.src} alt={im.name} className="h-full w-full object-cover" />
                  <span className="dk-mono absolute left-1 top-1 rounded bg-black/60 px-1 text-[8px] text-white">
                    {frameNo(i)}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(im.id);
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <TrashIcon size={18} weight="bold" style={{ color: 'var(--dk-safe)' }} />
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex h-20 w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed transition-colors"
                style={{ borderColor: 'var(--dk-line)', color: 'var(--dk-mute)' }}
              >
                <PlusIcon size={20} weight="bold" />
                <span className="dk-mono text-[8px] uppercase tracking-widest">
                  Load
                </span>
              </button>
            </div>
            <div
              className="h-3 w-full"
              style={{
                background:
                  'repeating-linear-gradient(90deg, transparent 0 10px, var(--dk-void) 10px 18px)',
                opacity: 0.5,
              }}
            />
          </Panel>
        </section>

        {!hasImages ? (
          /* Empty state ------------------------------------------------- */
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className="dk-rise flex w-full flex-col items-center justify-center gap-6 rounded-3xl border border-dashed py-28 text-center transition-colors"
            style={{
              animationDelay: '0.16s',
              borderColor: dragging ? 'var(--dk-safe)' : 'var(--dk-line)',
              background: dragging ? 'rgba(255,90,54,0.05)' : 'transparent',
            }}
          >
            <ImagesIcon size={56} weight="thin" style={{ color: 'var(--dk-faint)' }} />
            <div className="space-y-2">
              <p className="dk-display text-2xl" style={{ color: 'var(--dk-paper)' }}>
                Hang your first frame
              </p>
              <p
                className="dk-mono text-[11px] uppercase tracking-[0.25em]"
                style={{ color: 'var(--dk-mute)' }}
              >
                Drop images here or click to browse
              </p>
            </div>
          </button>
        ) : (
          <>
            {/* Station switch ------------------------------------------- */}
            <div
              className="dk-rise mb-8 flex flex-wrap items-center justify-between gap-4"
              style={{ animationDelay: '0.16s' }}
            >
              <SegmentedControl
                options={STATIONS}
                value={station}
                onChange={setStation}
                layoutId="station"
              />
              {current && (
                <div
                  className="dk-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: 'var(--dk-mute)' }}
                >
                  <span style={{ color: 'var(--dk-paper)' }}>{current.name}</span>
                  {' · '}
                  {current.width}×{current.height}
                  {' · '}
                  {formatBytes(current.size)}
                </div>
              )}
            </div>

            {/* Active station ------------------------------------------- */}
            <AnimatePresence mode="wait">
              <motion.div
                key={station + (current?.id || '')}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {current && station === 'develop' && <DevelopStation image={current} />}
                {current && station === 'reduce' && <ReduceStation image={current} />}
                {current && station === 'print' && (
                  <PrintStation images={images} currentIndex={currentIndex} />
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}

        <footer
          className="dk-mono mt-24 flex items-center justify-between border-t pt-8 text-[9px] uppercase tracking-[0.3em]"
          style={{ borderColor: 'var(--dk-line)', color: 'var(--dk-faint)' }}
        >
          <span>Fezcodex · Darkroom v1.0</span>
          <span>Develop · Reduce · Print</span>
        </footer>
      </div>
    </div>
  );
}
