import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CornersOutIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
} from '@phosphor-icons/react';
import { fetchGraphData } from '../utils/graphDataManager';
import { GRAPH_THEMES, radiusOf } from '../components/graph/graphThemes';
import SpaceSky from '../components/graph/SpaceSky';
import ClassicGraph3D from '../components/graph/ClassicGraph3D';
import usePersistentState from '../hooks/usePersistentState';
import Loading from '../components/Loading';
import Seo from '../components/Seo';
import '../styles/knowledge-graph.css';

const KINDS = [
  { id: 'post', plural: 'Posts', single: 'Post' },
  { id: 'log', plural: 'Logs', single: 'Log' },
  { id: 'app', plural: 'Apps', single: 'App' },
  { id: 'project', plural: 'Projects', single: 'Project' },
  { id: 'tag', plural: 'Tags', single: 'Tag' },
];
const SINGLE = Object.fromEntries(KINDS.map((k) => [k.id, k.single]));

const endId = (end) => (typeof end === 'object' ? end.id : end);

const pathFor = (node) => {
  if (node.path) return node.path;
  if (node.group === 'post') return `/blog/${node.slug}`;
  if (node.group === 'app') return node.to || `/apps/${node.slug}`;
  if (node.group === 'project') return `/projects/${node.slug}`;
  return null;
};

// Pulls stray clusters (app categories, lone projects) toward the middle.
const gravity = (k) => {
  let nodes = [];
  const force = (alpha) => {
    for (const n of nodes) {
      n.vx -= n.x * k * alpha;
      n.vy -= n.y * k * alpha;
    }
  };
  force.initialize = (list) => {
    nodes = list;
  };
  return force;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const Swatch = ({ kind, ink }) => (
  <span
    className="kg-swatch"
    data-kind={kind}
    style={{ background: ink[kind] }}
    aria-hidden="true"
  />
);

const GraphExplorer = ({ themeId, switcher }) => {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [shown, setShown] = useState({
    post: true,
    log: true,
    app: true,
    project: true,
    tag: true,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const theme = GRAPH_THEMES[themeId] || GRAPH_THEMES.space;
  const [reduced] = useState(prefersReducedMotion);
  const viewRef = useRef({ x: 0, y: 0, k: 1 });

  const fgRef = useRef();
  const wrapRef = useRef();
  const searchRef = useRef();
  const fittedRef = useRef(false);

  // ------------------------------------------------------------ data
  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    fetchGraphData().then(({ nodes, links }) => {
      if (cancelled) return;
      if (!nodes.length) {
        setFailed(true);
        return;
      }
      const byId = new Map(nodes.map((n) => [n.id, n]));
      const neighbours = new Map(nodes.map((n) => [n.id, new Set()]));
      links.forEach((l) => {
        neighbours.get(l.source)?.add(l.target);
        neighbours.get(l.target)?.add(l.source);
      });
      setData({ nodes, links, byId, neighbours });
    });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // ------------------------------------------------------------ size
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [data]);

  // ------------------------------------------------------------ forces
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg || !data) return;
    fg.d3Force('charge')?.strength(-46).distanceMax(320);
    fg.d3Force('link')?.distance(26);
    fg.d3Force('gravity', gravity(0.05));
  }, [data, size.width]);

  // ------------------------------------------------------------ derived
  const counts = useMemo(() => {
    const c = { post: 0, log: 0, app: 0, project: 0, tag: 0 };
    data?.nodes.forEach((n) => {
      c[n.group] += 1;
    });
    return c;
  }, [data]);

  const graphData = useMemo(() => {
    if (!data) return { nodes: [], links: [] };
    const nodes = data.nodes.filter((n) => shown[n.group]);
    const visible = new Set(nodes.map((n) => n.id));
    const links = data.links.filter(
      (l) => visible.has(endId(l.source)) && visible.has(endId(l.target)),
    );
    return { nodes, links };
  }, [data, shown]);

  const focusId = hoverId || selectedId;
  const lit = useMemo(() => {
    if (!focusId || !data) return null;
    const set = new Set(data.neighbours.get(focusId));
    set.add(focusId);
    return set;
  }, [focusId, data]);

  const selected = selectedId ? data?.byId.get(selectedId) : null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !data) return [];
    return data.nodes
      .filter((n) => shown[n.group] && n.name?.toLowerCase().includes(q))
      .sort((a, b) => {
        const as = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bs = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        return as - bs || a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [query, data, shown]);

  // ------------------------------------------------------------ actions
  const focusNode = useCallback(
    (id) => {
      const node = data?.byId.get(id);
      if (!node) return;
      if (!shown[node.group]) setShown((s) => ({ ...s, [node.group]: true }));
      setSelectedId(id);
      const fg = fgRef.current;
      if (fg && Number.isFinite(node.x)) {
        const ms = prefersReducedMotion() ? 0 : 700;
        fg.centerAt(node.x, node.y, ms);
        if (fg.zoom() < 2.4) fg.zoom(2.4, ms);
      }
    },
    [data, shown],
  );

  const fit = useCallback(() => {
    fgRef.current?.zoomToFit(prefersReducedMotion() ? 0 : 500, 140);
  }, []);

  const zoomBy = useCallback((factor) => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.zoom(fg.zoom() * factor, prefersReducedMotion() ? 0 : 250);
  }, []);

  const pickResult = useCallback(
    (node) => {
      focusNode(node.id);
      setQuery('');
      setSearchOpen(false);
      searchRef.current?.blur();
    },
    [focusNode],
  );

  // keyboard: "/" focuses search, Esc clears
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(
        document.activeElement?.tagName,
      );
      if (e.key === '/' && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (typing) {
          setQuery('');
          searchRef.current?.blur();
        } else {
          setSelectedId(null);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ------------------------------------------------------------ inspector data
  const inspector = useMemo(() => {
    if (!selected || !data) return null;
    const near = [...(data.neighbours.get(selected.id) || [])].map((id) =>
      data.byId.get(id),
    );
    if (selected.group === 'tag') {
      const items = near.sort((a, b) => a.name.localeCompare(b.name));
      return { tags: [], related: items.map((n) => ({ node: n })) };
    }
    const tags = near.filter((n) => n.group === 'tag');
    const shared = new Map();
    tags.forEach((tag) => {
      data.neighbours.get(tag.id).forEach((id) => {
        if (id !== selected.id) shared.set(id, (shared.get(id) || 0) + 1);
      });
    });
    const related = [...shared.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({ node: data.byId.get(id), count }));
    return { tags, related };
  }, [selected, data]);

  // ------------------------------------------------------------ painting
  const paintNode = useCallback(
    (node, ctx, scale) =>
      theme.paint(node, ctx, scale, {
        lit,
        isLit: !lit || lit.has(node.id),
        isFocus: node.id === focusId,
        isSelected: node.id === selectedId,
        t: performance.now(),
        reduced,
      }),
    [theme, lit, focusId, selectedId, reduced],
  );

  const paintPointerArea = useCallback((node, color, ctx) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radiusOf(node) + 3, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const touchesFocus = useCallback(
    (link) =>
      !!focusId &&
      (endId(link.source) === focusId || endId(link.target) === focusId),
    [focusId],
  );

  const linkColor = useCallback(
    (link) => theme.link(touchesFocus(link), !!focusId),
    [theme, touchesFocus, focusId],
  );

  const linkWidth = useCallback(
    (link) => (touchesFocus(link) ? 1.4 : 0.6),
    [touchesFocus],
  );

  const linkParticles = useCallback(
    (link) => (reduced ? 0 : theme.particles(touchesFocus(link), !!focusId, link)),
    [theme, touchesFocus, focusId, reduced],
  );

  // ------------------------------------------------------------ render

  if (failed) {
    return (
      <div className="kg">
        <div className="kg-empty">
          <p>The graph couldn’t load its data. Check your connection, then try again.</p>
          <button type="button" onClick={() => setAttempt((a) => a + 1)}>
            Try again
          </button>
        </div>
      </div>
    );
  }
  if (!data) return <Loading />;

  const activeResult = results[Math.min(cursor, results.length - 1)];

  return (
    <div className="kg" data-theme={theme.id}>

      {theme.id === 'space' && <SpaceSky viewRef={viewRef} reduced={reduced} />}

      <div className="kg-canvas" ref={wrapRef}>
        {size.width > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={size.width}
            height={size.height}
            graphData={graphData}
            backgroundColor="rgba(0,0,0,0)"
            nodeRelSize={4}
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={paintPointerArea}
            nodeLabel={() => ''}
            linkColor={linkColor}
            linkWidth={linkWidth}
            linkDirectionalParticles={linkParticles}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleSpeed={0.006}
            linkDirectionalParticleColor={() => '#ffffff'}
            onZoom={(transform) => {
              viewRef.current = transform;
            }}
            enableNodeDrag
            autoPauseRedraw={theme.id !== 'space'}
            cooldownTicks={140}
            warmupTicks={120}
            minZoom={0.3}
            maxZoom={12}
            onNodeHover={(node) => {
              setHoverId(node ? node.id : null);
              if (wrapRef.current)
                wrapRef.current.style.cursor = node ? 'pointer' : '';
            }}
            onNodeClick={(node) => focusNode(node.id)}
            onBackgroundClick={() => setSelectedId(null)}
            onEngineTick={() => {
              // frame the pre-laid-out graph at once, then again when it settles
              if (!fittedRef.current) {
                fittedRef.current = 'early';
                fgRef.current?.zoomToFit(0, 140);
              }
            }}
            onEngineStop={() => {
              if (fittedRef.current !== 'done') {
                fittedRef.current = 'done';
                fit();
              }
            }}
          />
        )}
      </div>

      <header className="kg-bar">
        <div className="kg-title">
          <Link to="/" className="kg-back">
            <ArrowLeftIcon size={14} weight="bold" aria-hidden="true" />
            Fezcodex
          </Link>
          <h1>Knowledge graph</h1>
          {switcher}
        </div>

        <div className="kg-controls">
          <div className="kg-search">
            <input
              ref={searchRef}
              type="search"
              value={query}
              placeholder="Find a post, log, app, project or tag"
              aria-label="Search the graph"
              role="combobox"
              aria-expanded={searchOpen && query.trim() !== ''}
              aria-controls="kg-results"
              aria-activedescendant={
                activeResult ? `kg-r-${activeResult.id}` : undefined
              }
              onChange={(e) => {
                setQuery(e.target.value);
                setCursor(0);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 120)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setCursor((c) => Math.min(c + 1, results.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setCursor((c) => Math.max(c - 1, 0));
                } else if (e.key === 'Enter' && activeResult) {
                  pickResult(activeResult);
                }
              }}
            />
            {!query && <kbd aria-hidden="true">/</kbd>}
            {searchOpen && query.trim() !== '' && (
              <ul className="kg-results" id="kg-results" role="listbox">
                {results.length === 0 && (
                  <li className="kg-results-empty">
                    Nothing matches “{query.trim()}”.
                  </li>
                )}
                {results.map((node) => (
                  <li
                    key={node.id}
                    id={`kg-r-${node.id}`}
                    role="option"
                    aria-selected={node === activeResult}
                  >
                    <button
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickResult(node)}
                    >
                      <Swatch kind={node.group} ink={theme.ink} />
                      <span>{node.name}</span>
                      <span className="kg-kind">{SINGLE[node.group]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="kg-kinds" role="group" aria-label="Show in graph">
            {KINDS.map((kind) => (
              <button
                key={kind.id}
                type="button"
                className="kg-chip"
                aria-pressed={shown[kind.id]}
                onClick={() =>
                  setShown((s) => ({ ...s, [kind.id]: !s[kind.id] }))
                }
              >
                <Swatch kind={kind.id} ink={theme.ink} />
                {kind.plural}
                <span className="kg-count">{counts[kind.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="kg-zoom" role="group" aria-label="Zoom">
        <button type="button" onClick={() => zoomBy(1.4)} aria-label="Zoom in">
          <PlusIcon size={16} weight="bold" />
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.4)} aria-label="Zoom out">
          <MinusIcon size={16} weight="bold" />
        </button>
        <button type="button" onClick={fit} aria-label="Fit everything in view">
          <CornersOutIcon size={16} weight="bold" />
        </button>
      </div>

      {!selected && (
        <p className="kg-hint">
          Click a dot to see what it connects to. Drag to pan, scroll to zoom.
        </p>
      )}

      {selected && inspector && (
        <aside className="kg-panel" aria-label={`${selected.name} details`} key={selected.id}>
          <div className="kg-panel-head" data-kind={selected.group}>
            <p className="kg-panel-kind">{SINGLE[selected.group]}</p>
            <h2>{selected.name}</h2>
            <button
              type="button"
              className="kg-close"
              onClick={() => setSelectedId(null)}
              aria-label="Close details"
            >
              <XIcon size={16} weight="bold" />
            </button>
          </div>

          <div className="kg-panel-body">
            {selected.desc && <p className="kg-desc">{selected.desc}</p>}
            {pathFor(selected) && (
              <Link to={pathFor(selected)} className="kg-open">
                {selected.group === 'tag'
                  ? 'Browse this tag'
                  : `Open ${SINGLE[selected.group].toLowerCase()}`}
                <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
              </Link>
            )}

            {inspector.tags.length > 0 && (
              <section className="kg-section">
                <h3>Tagged</h3>
                <div className="kg-tags">
                  {inspector.tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      className="kg-tag"
                      onClick={() => focusNode(tag.id)}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {inspector.related.length > 0 && (
              <section className="kg-section">
                <h3>
                  {selected.group === 'tag' ? 'Items with this tag ' : 'Related '}
                  <span>{inspector.related.length}</span>
                </h3>
                <ul className="kg-list">
                  {inspector.related.map(({ node, count }) => (
                    <li key={node.id}>
                      <button type="button" onClick={() => focusNode(node.id)}>
                        <Swatch kind={node.group} ink={theme.ink} />
                        <span>{node.name}</span>
                        {count > 0 && (
                          <span className="kg-shared">
                            {count} shared {count === 1 ? 'tag' : 'tags'}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {selected.group !== 'tag' &&
              inspector.tags.length === 0 &&
              inspector.related.length === 0 && (
                <p className="kg-desc">This one has no tags yet, so it stands alone.</p>
              )}
          </div>
        </aside>
      )}
    </div>
  );
};

const VIEWS = [
  { id: 'classic', label: 'Classic', hint: 'The original 3D view' },
  { id: 'paper', label: 'Paper', hint: 'Flat print look and the lightest view: redraws only when something changes' },
  { id: 'space', label: 'Space', hint: 'Animated star chart with meteors, heaviest to render' },
];

const GraphSwitcher = ({ value, onChange, variant }) => (
  <div
    className={`kg-theme${variant === 'classic' ? ' kg-theme-classic' : ''}`}
    role="radiogroup"
    aria-label="Graph view"
  >
    {VIEWS.map((view) => (
      <button
        key={view.id}
        type="button"
        role="radio"
        aria-checked={value === view.id}
        title={view.hint}
        onClick={() => onChange(view.id)}
      >
        {view.label}
      </button>
    ))}
  </div>
);

const KnowledgeGraphPage = () => {
  const [view, setView] = usePersistentState('fezcodex-graph-view', 'space');
  const current = VIEWS.some((v) => v.id === view) ? view : 'space';
  const switcher = (
    <GraphSwitcher value={current} onChange={setView} variant={current} />
  );
  return (
    <>
      <Seo
        title="Fezcodex | Knowledge Graph"
        description="Every post, app and project on Fezcodex, connected by the tags they share."
        keywords={['graph', 'visualization', 'network', 'knowledge', 'fezcodex']}
      />
      {current === 'classic' ? (
        <ClassicGraph3D switcher={switcher} />
      ) : (
        <GraphExplorer themeId={current} switcher={switcher} />
      )}
    </>
  );
};

export default KnowledgeGraphPage;
