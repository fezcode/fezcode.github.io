import React, { useEffect, useRef, useState } from 'react';
import { CpuIcon, PulseIcon } from '@phosphor-icons/react';

/* ============================================================
 * The brushed-metal "device" panel: the page's centerpiece.
 * Shows an illustrative, live-looking Tarman readout. The data is
 * a seeded random walk generated in the browser; nothing is read
 * from the visitor's machine.
 * ============================================================ */

const HISTORY = 48;
const PROCESSES = [
  { name: 'browser.exe', share: 0.38 },
  { name: 'compiler.exe', share: 0.27 },
  { name: 'editor.exe', share: 0.14 },
  { name: 'system', share: 0.07 },
];

// Deterministic first frame so server and client render the same markup.
const seedHistory = () =>
  Array.from({ length: HISTORY }, (_, i) =>
    Math.round(
      28 +
        14 * Math.abs(Math.sin(i * 0.37)) +
        9 * Math.sin(i * 0.11) +
        26 * Math.exp(-Math.pow((i - 33) / 2.6, 2)),
    ),
  );

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const initial = () => {
  const history = seedHistory();
  return {
    history,
    cpu: history[HISTORY - 1],
    mem: 15.1,
    disk: 9,
    gpu: 6,
    net: 44.2,
    tick: 76,
  };
};

const step = (s) => {
  const prev = s.cpu;
  const burst = Math.random() < 0.06 ? 30 + Math.random() * 25 : 0;
  const cpu = Math.round(
    clamp(
      prev + (Math.random() - 0.5) * 12 + (34 - prev) * 0.12 + burst,
      6,
      97,
    ),
  );
  return {
    history: [...s.history.slice(1), cpu],
    cpu,
    mem:
      Math.round(clamp(s.mem + (Math.random() - 0.48) * 0.25, 12.5, 19) * 10) /
      10,
    disk: Math.round(clamp(s.disk + (Math.random() - 0.5) * 8, 1, 64)),
    gpu: Math.round(clamp(s.gpu + (Math.random() - 0.5) * 5, 2, 48)),
    net:
      Math.round(clamp(s.net + (Math.random() - 0.5) * 14, 4, 180) * 10) / 10,
    tick: s.tick + 1,
  };
};

const pad = (v) => String(v).padStart(2, '0');
const buffered = (tick) => {
  const secs = Math.min(tick, 600);
  return `${Math.floor(secs / 60)}:${pad(secs % 60)}`;
};

const Spark = ({ data, className = '' }) => {
  const max = 100;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 200},${60 - (v / max) * 56}`)
    .join(' ');
  return (
    <svg
      className={`trm-spark ${className}`}
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon points={`0,60 ${pts} 200,60`} className="trm-spark-fill" />
      <polyline points={pts} className="trm-spark-line" />
    </svg>
  );
};

const Bar = ({ label, value, ratio }) => (
  <div className="trm-bar">
    <div className="trm-bar-head">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="trm-bar-track">
      <i style={{ transform: `scaleX(${clamp(ratio, 0.02, 1)})` }} />
    </div>
  </div>
);

const MonitorPanel = ({ version, mode = 'live', className = '' }) => {
  const [s, setS] = useState(initial);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    let timer = 0;
    const run = () => {
      if (!timer) timer = setInterval(() => setS(step), 1000);
    };
    const halt = () => {
      clearInterval(timer);
      timer = 0;
    };
    const el = ref.current;
    const io =
      el && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) =>
            entry.isIntersecting ? run() : halt(),
          )
        : null;
    if (io) io.observe(el);
    else run();
    return () => {
      halt();
      if (io) io.disconnect();
    };
  }, []);

  const strip = (
    <div className="trm-panel-strip">
      <PulseIcon size={20} weight="regular" />
      <span className="trm-panel-strip-name">TARMAN</span>
      <span className="trm-panel-strip-ver">v{version}</span>
    </div>
  );

  if (mode === 'window') {
    return (
      <div
        ref={ref}
        className={`trm-panel trm-panel--window ${className}`}
        aria-hidden="true"
      >
        <div className="trm-panel-body">
          <div className="trm-panel-top">
            <span className="trm-chip">
              <CpuIcon size={18} weight="duotone" />
            </span>
            <span className="trm-panel-rec">
              <i /> REC 1 Hz
            </span>
          </div>
          <Spark data={s.history} className="trm-spark--wide" />
          <div className="trm-panel-figure">
            <span className="trm-panel-label">BUFFERED HISTORY</span>
            <strong>
              {buffered(s.tick)}
              <small> / 10:00</small>
            </strong>
          </div>
        </div>
        {strip}
      </div>
    );
  }

  return (
    <div ref={ref} className={`trm-panel ${className}`} aria-hidden="true">
      <div className="trm-panel-body">
        <div className="trm-panel-top">
          <span className="trm-chip">
            <CpuIcon size={18} weight="duotone" />
          </span>
          <span className="trm-panel-title">PERFORMANCE · DEMO-PC</span>
          <span className="trm-panel-rec">
            <i /> REC
          </span>
        </div>
        <div className="trm-panel-grid">
          <div className="trm-panel-figure">
            <span className="trm-panel-label">CPU UTILISATION</span>
            <strong>
              {s.cpu}
              <small>%</small>
            </strong>
            <Spark data={s.history} />
          </div>
          <div className="trm-panel-bars">
            <Bar
              label="MEM"
              value={`${s.mem.toFixed(1)} GB`}
              ratio={s.mem / 32}
            />
            <Bar label="DISK" value={`${s.disk}%`} ratio={s.disk / 100} />
            <Bar label="GPU" value={`${s.gpu}%`} ratio={s.gpu / 100} />
            <Bar label="NET" value={`${s.net} Kbps`} ratio={s.net / 200} />
          </div>
        </div>
        <div className="trm-panel-procs">
          {PROCESSES.map((p) => (
            <div className="trm-panel-proc" key={p.name}>
              <span>{p.name}</span>
              <span>{(s.cpu * p.share).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
      {strip}
    </div>
  );
};

export default MonitorPanel;
