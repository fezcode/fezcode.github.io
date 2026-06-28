import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CursorClickIcon,
  HandIcon,
  PaintBrushIcon,
  PenNibIcon,
  StampIcon,
  TextTIcon,
  EyedropperIcon,
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  DownloadSimpleIcon,
  FloppyDiskIcon,
  FolderOpenIcon,
  FilePlusIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  MapTrifoldIcon,
  GridFourIcon,
  StackIcon,
} from '@phosphor-icons/react';
import Seo from '../../../components/Seo';
import { useToast } from '../../../hooks/useToast';

import { createScene, createObjectLayer, createTerrainLayer } from './state/scene';
import { createHistory } from './state/history';
import { loadLocal, saveLocal, exportJSON, importJSON } from './state/serialize';
import { createEditor } from './editor';
import { render, renderToCanvas } from './engine/renderer';
import { drawOverlay } from './engine/overlay';
import { THEME_LIST } from './themes';
import { TOOLS, TERRAIN_MATERIALS, SHAPE_TYPES, CATEGORIES } from './constants';
import {
  getByCategory,
  search as searchSprites,
  count as spriteCount,
} from './sprites';
import {
  Panel,
  Field,
  Slider,
  Toggle,
  SelectInput,
  Segmented,
  ColorField,
  ToolButton,
  TopButton,
  LayerRow,
  SpriteGrid,
  MONO,
  SANS,
} from './components';

const TOOLDEFS = [
  { id: TOOLS.SELECT, label: 'Select / Move', icon: CursorClickIcon, key: 'V' },
  { id: TOOLS.PAN, label: 'Pan', icon: HandIcon, key: 'H' },
  { id: TOOLS.TERRAIN, label: 'Terrain Brush', icon: PaintBrushIcon, key: 'B' },
  { id: TOOLS.SHAPE, label: 'Shape / Pen', icon: PenNibIcon, key: 'P' },
  { id: TOOLS.STAMP, label: 'Stamp Sprite', icon: StampIcon, key: 'S' },
  { id: TOOLS.TEXT, label: 'Label', icon: TextTIcon, key: 'T' },
  { id: TOOLS.EYEDROPPER, label: 'Eyedropper', icon: EyedropperIcon, key: 'I' },
];

const FONT_OPTIONS = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans', label: 'Sans' },
  { value: 'mono', label: 'Mono' },
];

const isTyping = (t) =>
  t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);

function cursorFor(ed) {
  if (!ed) return 'default';
  if (ed.spaceDown || (ed.drag && ed.drag.kind === 'pan')) return 'grabbing';
  const map = {
    select: 'default',
    pan: 'grab',
    terrain: 'crosshair',
    shape: 'crosshair',
    stamp: 'copy',
    text: 'text',
    eyedropper: 'crosshair',
  };
  return map[ed.tool] || 'default';
}

const MapBuilderPage = () => {
  const { addToast } = useToast();
  const wrapRef = useRef(null);
  const mainRef = useRef(null);
  const overlayRef = useRef(null);
  const fileRef = useRef(null);
  const edRef = useRef(null);
  const viewRef = useRef({ cssW: 900, cssH: 600, dpr: 1 });
  const rafRef = useRef(0);
  const dirtyRef = useRef(false);
  const coordRef = useRef(0);

  const [, setTick] = useState(0);
  const [ready, setReady] = useState(false);
  const [cat, setCat] = useState('nature');
  const [query, setQuery] = useState('');

  const sync = useCallback(() => setTick((t) => (t + 1) % 1000000), []);

  const doRender = useCallback(() => {
    const ed = edRef.current;
    const main = mainRef.current;
    const ov = overlayRef.current;
    if (!ed || !main || !ov) return;
    render(main.getContext('2d'), ed.scene, ed.theme(), viewRef.current);
    drawOverlay(ov.getContext('2d'), ed, viewRef.current);
  }, []);

  const scheduleRender = useCallback(() => {
    dirtyRef.current = true;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      if (dirtyRef.current) {
        dirtyRef.current = false;
        doRender();
      }
    });
  }, [doRender]);

  const sizeCanvases = useCallback(() => {
    const wrap = wrapRef.current;
    const main = mainRef.current;
    const ov = overlayRef.current;
    if (!wrap || !main || !ov) return;
    const r = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const cssW = Math.max(120, r.width);
    const cssH = Math.max(120, r.height);
    viewRef.current = { cssW, cssH, dpr };
    for (const cv of [main, ov]) {
      cv.width = Math.round(cssW * dpr);
      cv.height = Math.round(cssH * dpr);
      cv.style.width = `${cssW}px`;
      cv.style.height = `${cssH}px`;
    }
    scheduleRender();
  }, [scheduleRender]);

  // ---- init once ----
  useEffect(() => {
    const scene = loadLocal() || createScene();
    const history = createHistory(scene);
    const ed = createEditor({
      scene,
      history,
      requestRender: scheduleRender,
      requestSync: sync,
      toast: (message) => addToast({ title: 'Map Builder', message, duration: 2200 }),
    });
    edRef.current = ed;
    setReady(true);

    requestAnimationFrame(() => {
      sizeCanvases();
      ed.fit(viewRef.current.cssW, viewRef.current.cssH);
    });

    const onKey = (e) => edRef.current && edRef.current.onKeyDown(e);
    const onSpace = (e) => {
      if (e.code !== 'Space' || isTyping(e.target)) return;
      const cur = edRef.current;
      if (!cur) return;
      if (e.type === 'keydown') {
        cur.spaceDown = true;
        e.preventDefault();
      } else {
        cur.spaceDown = false;
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keydown', onSpace);
    window.addEventListener('keyup', onSpace);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keydown', onSpace);
      window.removeEventListener('keyup', onSpace);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- resize ----
  useEffect(() => {
    if (!ready) return undefined;
    const wrap = wrapRef.current;
    if (!wrap) return undefined;
    const ro = new ResizeObserver(() => sizeCanvases());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [ready, sizeCanvases]);

  // ---- non-passive wheel ----
  useEffect(() => {
    if (!ready) return undefined;
    const ov = overlayRef.current;
    if (!ov) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const r = ov.getBoundingClientRect();
      edRef.current.onWheel(e.clientX - r.left, e.clientY - r.top, e.deltaY);
    };
    ov.addEventListener('wheel', onWheel, { passive: false });
    return () => ov.removeEventListener('wheel', onWheel);
  }, [ready]);

  const ptr = (e) => {
    const r = overlayRef.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const onPointerDown = (e) => {
    overlayRef.current.setPointerCapture?.(e.pointerId);
    const [x, y] = ptr(e);
    edRef.current.onPointerDown(x, y, e);
  };
  const onPointerMove = (e) => {
    const [x, y] = ptr(e);
    edRef.current.onPointerMove(x, y, e);
    const now = performance.now();
    if (now - coordRef.current > 70) {
      coordRef.current = now;
      sync();
    }
  };
  const onPointerUp = (e) => {
    const [x, y] = ptr(e);
    edRef.current.onPointerUp(x, y, e);
  };
  const onDoubleClick = (e) => {
    const [x, y] = ptr(e);
    edRef.current.onDoubleClick(x, y, e);
  };

  // ---- scene replacement (New / Import) ----
  const installScene = useCallback(
    (scene) => {
      const history = createHistory(scene);
      const ed = createEditor({
        scene,
        history,
        requestRender: scheduleRender,
        requestSync: sync,
        toast: (message) => addToast({ title: 'Map Builder', message, duration: 2200 }),
      });
      ed.spaceDown = false;
      edRef.current = ed;
      ed.fit(viewRef.current.cssW, viewRef.current.cssH);
      sync();
      scheduleRender();
    },
    [scheduleRender, sync, addToast],
  );

  const ed = edRef.current;
  const theme = ed ? ed.theme() : THEME_LIST[0];

  const catalog = useMemo(
    () => (query.trim() ? searchSprites(query) : getByCategory(cat)),
    [cat, query],
  );
  const total = spriteCount();

  // ---- toolbar actions ----
  const doNew = () => {
    if (!window.confirm('Start a new map? Unsaved work in this session is kept in autosave.')) return;
    installScene(createScene());
  };
  const doSave = () => {
    if (ed && saveLocal(ed.scene)) addToast({ title: 'Map Builder', message: 'Saved to this browser.', duration: 1800 });
  };
  const doExportPNG = () => {
    if (!ed) return;
    const cv = renderToCanvas(ed.scene, ed.theme(), 2);
    const a = document.createElement('a');
    a.download = `${(ed.scene.meta.title || 'map').replace(/\s+/g, '_')}.png`;
    a.href = cv.toDataURL('image/png');
    a.click();
    addToast({ title: 'Map Builder', message: 'PNG exported.', duration: 1800 });
  };
  const doExportJSON = () => {
    if (!ed) return;
    const blob = new Blob([exportJSON(ed.scene)], { type: 'application/json' });
    const a = document.createElement('a');
    a.download = `${(ed.scene.meta.title || 'map').replace(/\s+/g, '_')}.json`;
    a.href = URL.createObjectURL(blob);
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const doImport = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        installScene(importJSON(String(reader.result)));
        addToast({ title: 'Map Builder', message: 'Map loaded.', duration: 1800 });
      } catch (err) {
        addToast({ title: 'Map Builder', message: 'Could not read that file.', duration: 2400 });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const set = (path, value) => {
    if (!ed) return;
    const parts = path.split('.');
    let o = ed.settings;
    for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
    o[parts[parts.length - 1]] = value;
    ed.touch();
  };

  const selected = ed ? ed.selectedObjects() : [];
  const one = selected.length === 1 ? selected[0].object : null;

  if (!ed) {
    return <div style={{ height: '100vh', background: '#ece0c2' }} />;
  }

  const ui = theme.ui;

  return (
    <div className="flex flex-col" style={{ height: '100vh', background: ui.bg, color: ui.ink, fontFamily: SANS, overflow: 'hidden' }}>
      <Seo
        title="Map Builder — Cartographer's Atelier | Fezcodex"
        description="A hands-on map builder for modern and medieval worlds. Paint terrain, draw coastlines, roads and walls, and stamp from 1000+ procedural sprites onto an infinite canvas. Export PNG."
        keywords={['map', 'builder', 'editor', 'fantasy', 'city', 'cartography', 'sprites', 'medieval', 'modern']}
      />

      {/* Top bar */}
      <header
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ background: ui.panel, borderBottom: `1px solid ${ui.line}22` }}
      >
        <Link to="/apps" className="flex items-center gap-1.5 pr-2" style={{ color: ui.muted, fontSize: 12 }} title="Back to Library">
          <ArrowLeftIcon /> <span className="hidden sm:inline">Library</span>
        </Link>
        <div className="flex items-center gap-1.5" style={{ color: ui.spot }}>
          <MapTrifoldIcon weight="fill" size={18} />
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Atelier</span>
        </div>
        <div className="w-px h-5 mx-1" style={{ background: ui.line + '22' }} />
        <TopButton theme={ui} onClick={doNew} title="New map"><FilePlusIcon /> <span className="hidden md:inline">New</span></TopButton>
        <TopButton theme={ui} onClick={() => fileRef.current && fileRef.current.click()} title="Open .json"><FolderOpenIcon /> <span className="hidden md:inline">Open</span></TopButton>
        <TopButton theme={ui} onClick={doSave} title="Save to browser"><FloppyDiskIcon /> <span className="hidden md:inline">Save</span></TopButton>
        <div className="w-px h-5 mx-1" style={{ background: ui.line + '22' }} />
        <TopButton theme={ui} onClick={() => ed.undo()} disabled={!ed.canUndo()} title="Undo (Ctrl+Z)"><ArrowUUpLeftIcon /></TopButton>
        <TopButton theme={ui} onClick={() => ed.redo()} disabled={!ed.canRedo()} title="Redo (Ctrl+Shift+Z)"><ArrowUUpRightIcon /></TopButton>

        <div className="flex-1" />

        <select
          value={ed.scene.themeId}
          onChange={(e) => {
            ed.scene.themeId = e.target.value;
            ed.touch();
          }}
          title="Theme"
          style={{ fontFamily: SANS, fontSize: 12, color: ui.ink, background: ui.surface, border: `1px solid ${ui.line}33`, borderRadius: 6, padding: '5px 8px' }}
        >
          {THEME_LIST.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <div className="flex items-center" style={{ border: `1px solid ${ui.line}22`, borderRadius: 6 }}>
          <button onClick={() => ed.setZoom(ed.scene.camera.zoom / 1.2, viewRef.current.cssW, viewRef.current.cssH)} style={{ padding: '4px 8px', color: ui.ink }}>−</button>
          <button onClick={() => ed.fit(viewRef.current.cssW, viewRef.current.cssH)} title="Fit" style={{ padding: '4px 6px', color: ui.muted, fontFamily: MONO, fontSize: 11, minWidth: 46 }}>
            {Math.round(ed.scene.camera.zoom * 100)}%
          </button>
          <button onClick={() => ed.setZoom(ed.scene.camera.zoom * 1.2, viewRef.current.cssW, viewRef.current.cssH)} style={{ padding: '4px 8px', color: ui.ink }}>+</button>
        </div>
        <TopButton theme={ui} onClick={doExportPNG} accent title="Export PNG"><DownloadSimpleIcon /> <span className="hidden md:inline">PNG</span></TopButton>
        <TopButton theme={ui} onClick={doExportJSON} title="Export .json">JSON</TopButton>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={doImport} style={{ display: 'none' }} />
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Tool rail */}
        <nav className="flex flex-col items-center gap-1.5 px-2 py-3 shrink-0" style={{ background: ui.panel, borderRight: `1px solid ${ui.line}22` }}>
          {TOOLDEFS.map((t) => {
            const Icon = t.icon;
            return (
              <ToolButton key={t.id} active={ed.tool === t.id} onClick={() => ed.setTool(t.id)} title={`${t.label} (${t.key})`} theme={ui}>
                <Icon size={19} weight={ed.tool === t.id ? 'fill' : 'regular'} />
              </ToolButton>
            );
          })}
        </nav>

        {/* Context panel */}
        <aside className="flex flex-col shrink-0" style={{ width: 268, background: ui.surface, borderRight: `1px solid ${ui.line}22` }}>
          <ContextPanel ed={ed} theme={theme} set={set} cat={cat} setCat={setCat} query={query} setQuery={setQuery} catalog={catalog} />
        </aside>

        {/* Canvas */}
        <div ref={wrapRef} className="relative flex-1 min-w-0" style={{ background: ui.bg }}>
          <canvas ref={mainRef} className="absolute inset-0" />
          <canvas
            ref={overlayRef}
            className="absolute inset-0"
            style={{ touchAction: 'none', cursor: cursorFor(ed) }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onDoubleClick={onDoubleClick}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        {/* Right panel */}
        <aside className="flex flex-col shrink-0 custom-scroll" style={{ width: 250, background: ui.surface, borderLeft: `1px solid ${ui.line}22`, overflowY: 'auto' }}>
          <RightPanel ed={ed} theme={theme} one={one} selectedCount={selected.length} />
        </aside>
      </div>

      {/* Status bar */}
      <footer className="flex items-center gap-4 px-3 py-1.5 shrink-0" style={{ background: ui.panel, borderTop: `1px solid ${ui.line}22`, fontFamily: MONO, fontSize: 10, letterSpacing: '0.05em', color: ui.muted }}>
        <span style={{ color: ui.spot }}>● {TOOLDEFS.find((t) => t.id === ed.tool)?.label}</span>
        <span>
          {ed.cursorWorld ? `x ${Math.round(ed.cursorWorld.x)}  y ${Math.round(ed.cursorWorld.y)}` : 'x –  y –'}
        </span>
        <span>zoom {Math.round(ed.scene.camera.zoom * 100)}%</span>
        <span>sel {ed.selection.size}</span>
        <span>{total.toLocaleString()} sprites</span>
        <div className="flex-1" />
        <span>{ed.scene.grid.snap ? 'snap on' : 'snap off'} · grid {ed.scene.grid.visible ? 'on' : 'off'}</span>
        <span className="hidden md:inline">space-drag pan · scroll zoom · double-click finishes pen</span>
      </footer>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: ${ui.muted}55; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        input[type="range"] { height: 16px; }
      `}</style>
    </div>
  );
};

// ---------------- Context (left) panel ----------------
function ContextPanel({ ed, theme, set, cat, setCat, query, setQuery, catalog }) {
  const ui = theme.ui;
  const s = ed.settings;
  if (ed.tool === TOOLS.TERRAIN) {
    return (
      <div className="custom-scroll" style={{ overflowY: 'auto' }}>
        <Panel title="Terrain Brush" theme={ui}>
          <SelectInput theme={ui} label="Material" value={s.brush.material} onChange={(v) => set('brush.material', v)} options={TERRAIN_MATERIALS.map((m) => ({ value: m.id, label: m.label }))} />
          <Slider theme={ui} label="Brush size" value={s.brush.size} min={6} max={400} step={2} onChange={(v) => set('brush.size', v)} fmt={(v) => `${v}px`} />
          <Slider theme={ui} label="Opacity" value={s.brush.opacity} min={0.05} max={1} step={0.05} onChange={(v) => set('brush.opacity', v)} fmt={(v) => `${Math.round(v * 100)}%`} />
          <Toggle theme={ui} label="Eraser" value={s.brush.erase} onChange={(v) => set('brush.erase', v)} />
        </Panel>
        <Panel title="Tip" theme={ui}>
          <p className="px-3 py-2" style={{ fontSize: 11, color: ui.muted, fontStyle: 'italic' }}>
            Paint inside the paper sheet. Terrain stays beneath every sprite and shape.
          </p>
        </Panel>
      </div>
    );
  }
  if (ed.tool === TOOLS.SHAPE) {
    return (
      <div className="custom-scroll" style={{ overflowY: 'auto' }}>
        <Panel title="Shape / Pen" theme={ui}>
          <SelectInput theme={ui} label="Shape" value={s.shape.type} onChange={(v) => set('shape.type', v)} options={SHAPE_TYPES.map((t) => ({ value: t.id, label: t.label }))} />
          <Slider theme={ui} label="Stroke width" value={s.shape.width} min={1} max={60} step={1} onChange={(v) => set('shape.width', v)} />
          <ColorField theme={ui} label="Stroke" value={s.shape.stroke} onChange={(v) => set('shape.stroke', v)} allowAuto />
          <Toggle theme={ui} label="Fill" value={s.shape.fillOn} onChange={(v) => set('shape.fillOn', v)} />
          {s.shape.fillOn && <ColorField theme={ui} label="Fill colour" value={s.shape.fill} onChange={(v) => set('shape.fill', v)} allowAuto />}
        </Panel>
        <Panel title="How to draw" theme={ui}>
          <p className="px-3 py-2" style={{ fontSize: 11, color: ui.muted, fontStyle: 'italic' }}>
            Coast, river, road, wall, zone & contour: click to drop points, then double-click or press Enter to finish (click the first point to close a loop). Rectangle, ellipse, line & arrow: click-drag. Freehand: draw.
          </p>
        </Panel>
      </div>
    );
  }
  if (ed.tool === TOOLS.TEXT) {
    return (
      <Panel title="Label" theme={ui}>
        <Field theme={ui} label="Text">
          <input value={s.text.value} onChange={(e) => set('text.value', e.target.value)} placeholder="Place name…" style={{ width: '100%', fontFamily: SANS, fontSize: 13, padding: '6px 8px', color: ui.ink, background: ui.bg, border: `1px solid ${ui.line}33`, borderRadius: 4 }} />
        </Field>
        <SelectInput theme={ui} label="Font" value={s.text.font} onChange={(v) => set('text.font', v)} options={FONT_OPTIONS} />
        <Slider theme={ui} label="Size" value={s.text.fontSize} min={10} max={140} step={1} onChange={(v) => set('text.fontSize', v)} />
        <Toggle theme={ui} label="Italic" value={s.text.italic} onChange={(v) => set('text.italic', v)} />
        <ColorField theme={ui} label="Colour" value={s.text.color} onChange={(v) => set('text.color', v)} allowAuto />
        <p className="px-3 py-2" style={{ fontSize: 11, color: ui.muted, fontStyle: 'italic' }}>Click on the map to drop the label.</p>
      </Panel>
    );
  }
  if (ed.tool === TOOLS.STAMP || ed.tool === TOOLS.SELECT) {
    return (
      <div className="flex flex-col" style={{ height: '100%' }}>
        <Panel title="Sprite Library" theme={ui} />
        <div className="px-3 py-2 flex items-center gap-1.5" style={{ borderBottom: `1px solid ${ui.line}1f` }}>
          <MagnifyingGlassIcon size={14} color={ui.muted} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${spriteCount().toLocaleString()} sprites…`} style={{ flex: 1, fontFamily: SANS, fontSize: 12, padding: '4px 6px', color: ui.ink, background: ui.bg, border: `1px solid ${ui.line}33`, borderRadius: 4 }} />
        </div>
        {!query.trim() && (
          <div className="flex flex-wrap gap-1 px-2 py-2" style={{ borderBottom: `1px solid ${ui.line}1f` }}>
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{ fontFamily: SANS, fontSize: 11, padding: '3px 8px', borderRadius: 999, background: cat === c.id ? ui.spot : 'transparent', color: cat === c.id ? ui.spotInk : ui.muted, border: `1px solid ${cat === c.id ? ui.spot : ui.line + '22'}` }}>
                {c.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ flex: 1, minHeight: 0 }}>
          <SpriteGrid entries={catalog} theme={theme} activeId={ed.settings.stamp.spriteId} onPick={(e) => { ed.settings.stamp.spriteId = e.id; ed.setTool(TOOLS.STAMP); }} />
        </div>
        <StampSettings ed={ed} theme={theme} set={set} />
      </div>
    );
  }
  return (
    <Panel title="Eyedropper" theme={ui}>
      <p className="px-3 py-2" style={{ fontSize: 11, color: ui.muted, fontStyle: 'italic' }}>Click any sprite, shape or label to sample its style into the matching tool.</p>
    </Panel>
  );
}

function StampSettings({ ed, theme, set }) {
  const ui = theme.ui;
  const s = ed.settings.stamp;
  return (
    <div style={{ borderTop: `1px solid ${ui.line}22` }}>
      <Panel title="Stamp" theme={ui}>
        <Slider theme={ui} label="Scale" value={s.scale} min={0.15} max={5} step={0.05} onChange={(v) => set('stamp.scale', v)} fmt={(v) => `${v.toFixed(2)}×`} />
        <Slider theme={ui} label="Rotation" value={s.rotation} min={0} max={Math.PI * 2} step={0.05} onChange={(v) => set('stamp.rotation', v)} fmt={(v) => `${Math.round((v * 180) / Math.PI)}°`} />
        <Toggle theme={ui} label="Scatter (drag to spray)" value={s.scatter} onChange={(v) => set('stamp.scatter', v)} />
        {s.scatter && <Slider theme={ui} label="Density" value={s.density} min={0.1} max={1} step={0.05} onChange={(v) => set('stamp.density', v)} fmt={(v) => `${Math.round(v * 100)}%`} />}
        {s.scatter && <Slider theme={ui} label="Jitter" value={s.jitter} min={0} max={1} step={0.05} onChange={(v) => set('stamp.jitter', v)} />}
        <Toggle theme={ui} label="Random rotation" value={s.randomRotate} onChange={(v) => set('stamp.randomRotate', v)} />
        <Toggle theme={ui} label="Flip horizontally" value={s.flipX} onChange={(v) => set('stamp.flipX', v)} />
        <ColorField theme={ui} label="Tint" value={s.tint} onChange={(v) => set('stamp.tint', v)} allowAuto />
      </Panel>
    </div>
  );
}

// ---------------- Right panel: layers + inspector + doc ----------------
function RightPanel({ ed, theme, one, selectedCount }) {
  const ui = theme.ui;
  const scene = ed.scene;
  return (
    <div>
      <Panel
        title="Layers"
        theme={ui}
        right={
          <div className="flex gap-1">
            <button title="Add object layer" onClick={() => { const l = createObjectLayer('Layer'); scene.layers.push(l); scene.activeLayerId = l.id; ed.commit(); }} style={{ color: ui.muted }}>
              <PlusIcon size={14} />
            </button>
            <button title="Add terrain layer" onClick={() => { const l = createTerrainLayer('Terrain'); scene.layers.push(l); scene.activeLayerId = l.id; ed.commit(); }} style={{ color: ui.muted }}>
              <StackIcon size={14} />
            </button>
          </div>
        }
      >
        <div>
          {[...scene.layers].reverse().map((layer) => (
            <LayerRow
              key={layer.id}
              layer={layer}
              active={scene.activeLayerId === layer.id}
              theme={ui}
              onSelect={() => { scene.activeLayerId = layer.id; ed.sync(); }}
              onToggleVis={() => { layer.visible = !layer.visible; ed.commit(); }}
              onToggleLock={() => { layer.locked = !layer.locked; ed.commit(); }}
              onOpacity={(v) => { layer.opacity = v; ed.touch(); }}
              onDelete={() => { if (scene.layers.length <= 1) return; scene.layers = scene.layers.filter((l) => l.id !== layer.id); if (scene.activeLayerId === layer.id) scene.activeLayerId = scene.layers[scene.layers.length - 1].id; ed.commit(); }}
            />
          ))}
        </div>
      </Panel>

      <Panel title={selectedCount > 1 ? `Inspector · ${selectedCount} selected` : 'Inspector'} theme={ui}>
        {selectedCount === 0 && <p className="px-3 py-2" style={{ fontSize: 11, color: ui.muted, fontStyle: 'italic' }}>Nothing selected. Use the Select tool to pick objects.</p>}
        {selectedCount >= 1 && (
          <div className="flex flex-wrap gap-1 px-3 py-2">
            <SmallBtn theme={ui} onClick={() => ed.duplicateSelection()}>Duplicate</SmallBtn>
            <SmallBtn theme={ui} onClick={() => ed.zorder('front')}>Front</SmallBtn>
            <SmallBtn theme={ui} onClick={() => ed.zorder('back')}>Back</SmallBtn>
            <SmallBtn theme={ui} onClick={() => ed.deleteSelection()} danger><TrashIcon size={12} /></SmallBtn>
          </div>
        )}
        {one && <Inspector ed={ed} theme={theme} obj={one} />}
      </Panel>

      <Panel title="Sheet & Grid" theme={ui}>
        <Field theme={ui} label="Title">
          <input value={scene.meta.title} onChange={(e) => { scene.meta.title = e.target.value; ed.sync(); }} style={{ width: '100%', fontFamily: SANS, fontSize: 12, padding: '5px 7px', color: ui.ink, background: ui.bg, border: `1px solid ${ui.line}33`, borderRadius: 4 }} />
        </Field>
        <div className="grid grid-cols-2 gap-1 px-1">
          <Field theme={ui} label="Width"><NumInput theme={ui} value={scene.size.width} onChange={(v) => { scene.size.width = v; scene.layers.forEach((l) => { if (l.kind === 'terrain') l._dirty = true; }); ed.commit(); }} /></Field>
          <Field theme={ui} label="Height"><NumInput theme={ui} value={scene.size.height} onChange={(v) => { scene.size.height = v; scene.layers.forEach((l) => { if (l.kind === 'terrain') l._dirty = true; }); ed.commit(); }} /></Field>
        </div>
        <div className="flex items-center gap-2 px-3 py-1">
          <GridFourIcon size={14} color={ui.muted} />
          <Segmented theme={ui} value={scene.grid.visible ? scene.grid.type : 'off'} options={[{ value: 'off', label: 'Off' }, { value: 'square', label: 'Square' }, { value: 'hex', label: 'Hex' }]} onChange={(v) => { if (v === 'off') scene.grid.visible = false; else { scene.grid.visible = true; scene.grid.type = v; } ed.touch(); }} />
        </div>
        <Slider theme={ui} label="Grid size" value={scene.grid.size} min={12} max={160} step={4} onChange={(v) => { scene.grid.size = v; ed.touch(); }} />
        <Toggle theme={ui} label="Snap to grid" value={scene.grid.snap} onChange={(v) => { scene.grid.snap = v; ed.touch(); }} />
      </Panel>
    </div>
  );
}

function Inspector({ ed, theme, obj }) {
  const ui = theme.ui;
  const commit = () => ed.commit();
  const live = (patch) => { Object.assign(obj, patch); ed.touch(); };
  if (obj.kind === 'sprite') {
    return (
      <div>
        <LiveSlider theme={ui} label="Scale" value={obj.scale} min={0.1} max={8} step={0.05} onInput={(v) => live({ scale: v })} onDone={commit} fmt={(v) => `${v.toFixed(2)}×`} />
        <LiveSlider theme={ui} label="Rotation" value={obj.rotation || 0} min={0} max={Math.PI * 2} step={0.02} onInput={(v) => live({ rotation: v })} onDone={commit} fmt={(v) => `${Math.round((v * 180) / Math.PI)}°`} />
        <LiveSlider theme={ui} label="Opacity" value={obj.opacity ?? 1} min={0.05} max={1} step={0.05} onInput={(v) => live({ opacity: v })} onDone={commit} fmt={(v) => `${Math.round(v * 100)}%`} />
        <Toggle theme={ui} label="Flip" value={!!obj.flipX} onChange={(v) => { live({ flipX: v }); commit(); }} />
        <ColorField theme={ui} label="Tint" value={obj.tint} onChange={(v) => { live({ tint: v }); commit(); }} allowAuto />
      </div>
    );
  }
  if (obj.kind === 'text') {
    return (
      <div>
        <Field theme={ui} label="Text">
          <input value={obj.text} onChange={(e) => { live({ text: e.target.value }); }} onBlur={commit} style={{ width: '100%', fontFamily: SANS, fontSize: 12, padding: '5px 7px', color: ui.ink, background: ui.bg, border: `1px solid ${ui.line}33`, borderRadius: 4 }} />
        </Field>
        <LiveSlider theme={ui} label="Size" value={obj.fontSize} min={10} max={160} step={1} onInput={(v) => live({ fontSize: v })} onDone={commit} />
        <LiveSlider theme={ui} label="Rotation" value={obj.rotation || 0} min={-Math.PI} max={Math.PI} step={0.02} onInput={(v) => live({ rotation: v })} onDone={commit} fmt={(v) => `${Math.round((v * 180) / Math.PI)}°`} />
        <ColorField theme={ui} label="Colour" value={obj.color} onChange={(v) => { live({ color: v }); commit(); }} />
      </div>
    );
  }
  // shape
  return (
    <div>
      <LiveSlider theme={ui} label="Stroke width" value={obj.style.width} min={1} max={60} step={1} onInput={(v) => { obj.style.width = v; ed.touch(); }} onDone={commit} />
      <LiveSlider theme={ui} label="Opacity" value={obj.opacity ?? 1} min={0.05} max={1} step={0.05} onInput={(v) => live({ opacity: v })} onDone={commit} fmt={(v) => `${Math.round(v * 100)}%`} />
      <ColorField theme={ui} label="Stroke" value={obj.style.stroke} onChange={(v) => { obj.style.stroke = v; commit(); }} allowAuto />
      <ColorField theme={ui} label="Fill" value={obj.style.fill} onChange={(v) => { obj.style.fill = v; commit(); }} allowAuto />
    </div>
  );
}

function LiveSlider({ theme, label, value, min, max, step, onInput, onDone, fmt }) {
  return (
    <Field label={label} theme={theme} hint={fmt ? fmt(value) : Math.round(value * 100) / 100}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onInput(parseFloat(e.target.value))}
        onMouseUp={onDone}
        onTouchEnd={onDone}
        onKeyUp={onDone}
        style={{ width: '100%', accentColor: theme.spot }}
      />
    </Field>
  );
}

function NumInput({ theme, value, onChange }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Math.max(64, parseInt(e.target.value || '0', 10)))}
      style={{ width: '100%', fontFamily: MONO, fontSize: 12, padding: '4px 6px', color: theme.ink, background: theme.bg, border: `1px solid ${theme.line}33`, borderRadius: 4 }}
    />
  );
}

function SmallBtn({ theme, onClick, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ fontFamily: SANS, fontSize: 11, padding: '3px 8px', borderRadius: 5, color: danger ? '#fff' : theme.ink, background: danger ? '#c4452f' : 'transparent', border: `1px solid ${danger ? '#c4452f' : theme.line + '33'}` }}
    >
      {children}
    </button>
  );
}

export default MapBuilderPage;
