import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  TrashIcon,
  LightningIcon,
  PowerIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import BrutalistDialog from '../../components/BrutalistDialog';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

// ---------------------------------------------------------------------------
// Two skins over one simulation.
//
// "Drafting sheet" is a schematic on vellum: gates drawn as the symbols an
// engineer would actually draw, orthogonal wire routing, live nets in red
// pencil. Drawing lettering is caps because that is how a drawing is lettered.
//
// "Terminal" is the original dark workspace, kept intact so it can be switched
// back to at any time. Both read and write the same nodes and connections.
// ---------------------------------------------------------------------------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@400;500;600&family=Saira:wght@400;500;600&display=swap');

.lga {
  --table:    #2b3138;
  --table-2:  #1e2328;
  --vellum:   #e7e5d8;
  --graphite: #2c3138;
  --graphite-2: #767d84;
  --graphite-3: #a7adb3;
  --live:     #c2482c;
  --annot:    #34557a;

  font-family: 'Saira', system-ui, sans-serif;
  color: var(--vellum);
  min-height: 100vh; width: 100%;
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
  background: var(--table-2);
}

.lga__bar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 20px; flex-wrap: wrap;
  padding: 16px 24px;
  background: var(--table);
  border-bottom: 1px solid #101418;
  box-shadow: 0 2px 10px rgba(0,0,0,0.4);
  z-index: 20;
}
.lga__id { display: flex; align-items: center; gap: 16px; }
.lga__back { color: var(--graphite-3); display: inline-flex; transition: color .15s; }
.lga__back:hover { color: var(--vellum); }
.lga__back:focus-visible { outline: 2px solid var(--live); outline-offset: 3px; }
.lga__back svg { width: 18px; height: 18px; }
.lga__title {
  font-family: 'Saira Condensed', sans-serif;
  font-size: 22px; font-weight: 600; line-height: 1; margin: 0;
}
.lga__desc { font-size: 12.5px; color: var(--graphite-3); margin: 2px 0 0; }

.lga__tools { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.lga__tool {
  font-family: 'Saira Condensed', sans-serif;
  font-size: 13px; font-weight: 500; letter-spacing: 0.04em;
  text-transform: uppercase;
  background: #39414a; color: var(--vellum);
  border: 0; border-radius: 3px; padding: 7px 12px; cursor: pointer;
  transition: background-color .14s, color .14s;
}
.lga__tool:hover { background: var(--vellum); color: var(--table); }
.lga__tool:focus-visible { outline: 2px solid var(--live); outline-offset: 2px; }
.lga__tool--danger { background: transparent; color: #d98c7a; box-shadow: inset 0 0 0 1px #7a4134; margin-left: 8px; }
.lga__tool--danger:hover { background: var(--live); color: #fff; box-shadow: none; }

/* skin switch, shown in both skins */
.lga__skin {
  display: inline-flex; align-items: center; gap: 0;
  border-radius: 3px; overflow: hidden; margin-right: 4px;
  box-shadow: inset 0 0 0 1px #4a525b;
}
.lga__skin button {
  font-family: 'Saira Condensed', sans-serif;
  font-size: 12.5px; font-weight: 500; letter-spacing: 0.04em;
  text-transform: uppercase;
  background: transparent; color: var(--graphite-3);
  border: 0; padding: 7px 11px; cursor: pointer;
  transition: background-color .14s, color .14s;
}
.lga__skin button[aria-pressed='true'] { background: var(--vellum); color: var(--table); }
.lga__skin button:focus-visible { outline: 2px solid var(--live); outline-offset: -2px; }

.lga__sheet {
  flex: 1; position: relative;
  background-color: var(--vellum);
  background-image:
    linear-gradient(rgba(120,140,125,0.20) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,140,125,0.20) 1px, transparent 1px),
    linear-gradient(rgba(120,140,125,0.10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120,140,125,0.10) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  overflow: hidden;
}

.lga__wires { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
.lga__wire { fill: none; stroke: var(--graphite-2); stroke-width: 1.4; }
.lga__wire--live { stroke: var(--live); stroke-width: 2.2; }
.lga__wire-hit { fill: none; stroke: transparent; stroke-width: 14; pointer-events: auto; cursor: pointer; }
.lga__wire-hit:hover + .lga__wire { stroke: var(--live); stroke-dasharray: 4 3; }

.lga__junction { fill: var(--graphite); }
.lga__junction--live { fill: var(--live); }

.lga__part { position: absolute; width: 140px; height: 100px; z-index: 10; cursor: grab; }
.lga__part:active { cursor: grabbing; }
.lga__sym { width: 100%; height: 100%; overflow: visible; }
.lga__sym-body {
  fill: rgba(255,255,255,0.55);
  stroke: var(--graphite); stroke-width: 2.2; stroke-linejoin: round;
}
.lga__sym-body--live { stroke: var(--live); fill: rgba(194,72,44,0.10); }
.lga__sym-lead { stroke: var(--graphite); stroke-width: 1.6; fill: none; }
.lga__sym-lead--live { stroke: var(--live); stroke-width: 2.2; }
.lga__sym-txt {
  font-family: 'Saira Condensed', sans-serif;
  font-size: 15px; font-weight: 600; letter-spacing: 0.06em;
  fill: var(--graphite); text-anchor: middle;
}
.lga__sym-ref {
  font-family: 'Saira Condensed', sans-serif;
  font-size: 10.5px; font-weight: 500; letter-spacing: 0.1em;
  fill: var(--annot); text-anchor: middle;
}

.lga__kill {
  position: absolute; top: -2px; right: -2px;
  width: 20px; height: 20px; border-radius: 3px;
  background: transparent; border: 0; cursor: pointer;
  color: var(--graphite-2); opacity: 0;
  display: grid; place-items: center;
  transition: opacity .14s, color .14s;
}
.lga__part:hover .lga__kill, .lga__kill:focus-visible { opacity: 1; }
.lga__kill:hover { color: var(--live); }
.lga__kill svg { width: 13px; height: 13px; }

.lga__pin {
  position: absolute; width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid var(--graphite); background: var(--vellum);
  padding: 0; cursor: pointer;
  transition: transform .12s, border-color .12s, background-color .12s;
}
.lga__pin:hover { transform: scale(1.25); border-color: var(--live); }
.lga__pin:focus-visible { outline: 2px solid var(--live); outline-offset: 2px; }
.lga__pin--live { background: var(--live); border-color: var(--live); }
.lga__pin--armed { border-color: var(--live); background: var(--live); transform: scale(1.3); }

.lga__lever {
  position: absolute; inset: 0; margin: auto;
  width: 54px; height: 30px;
  background: none; border: 0; padding: 0; cursor: pointer;
}
.lga__lever:focus-visible { outline: 2px solid var(--live); outline-offset: 3px; }

.lga__prompt {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  z-index: 40;
  background: var(--graphite); color: var(--vellum);
  font-size: 13px; padding: 7px 16px; border-radius: 3px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.lga__foot {
  display: flex; justify-content: space-between; align-items: center;
  gap: 16px; flex-wrap: wrap;
  padding: 10px 24px; background: var(--table);
  font-family: 'Saira Condensed', sans-serif;
  font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--graphite-3);
}
.lga__foot b { color: var(--vellum); font-weight: 600; }

.lga__scrim {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(16,20,24,0.66);
  display: grid; place-items: center; padding: 20px;
}
.lga__modal {
  background: var(--vellum); color: var(--graphite);
  max-width: 400px; width: 100%; padding: 24px;
  border-radius: 3px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}
.lga__modal h2 { font-family: 'Saira Condensed', sans-serif; font-size: 21px; font-weight: 600; margin: 0 0 8px; }
.lga__modal p { font-size: 14.5px; line-height: 1.55; color: #4e555c; margin: 0 0 20px; }
.lga__modal-row { display: flex; gap: 10px; justify-content: flex-end; }
.lga__modal-btn {
  font-family: 'Saira', sans-serif; font-size: 14px; font-weight: 500;
  border: 0; border-radius: 3px; padding: 9px 18px; cursor: pointer;
}
.lga__modal-btn--go { background: var(--live); color: #fff; }
.lga__modal-btn--no { background: transparent; color: #4e555c; box-shadow: inset 0 0 0 1px #b4b0a1; }
.lga__modal-btn:focus-visible { outline: 2px solid var(--annot); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  .lga__pin, .lga__part { transition: none; }
}
`;

const GATES_META = {
  and: { label: 'AND', inputs: 2, color: '#10b981' },
  or: { label: 'OR', inputs: 2, color: '#10b981' },
  xor: { label: 'XOR', inputs: 2, color: '#10b981' },
  not: { label: 'NOT', inputs: 1, color: '#10b981' },
  input: { label: 'SOURCE', inputs: 0, color: '#60a5fa' },
  output: { label: 'PROBE', inputs: 1, color: '#f87171' },
};

const TYPES = ['input', 'and', 'or', 'not', 'xor', 'output'];

// Where an input lands on a part, in box coordinates. Parts with a single
// input carry their lead down the centre line; two-input parts split at 32/68.
// The drawn symbol and the wire have to agree on this or the wire ends in air.
const inputY = (type, idx) =>
  GATES_META[type].inputs === 1 ? 50 : idx === 0 ? 32 : 68;

// Gate bodies drawn as the symbols an engineer draws. The box is 140x100; the
// output lead always leaves at (140,50) and inputs land at y=32 / y=68, which
// is what the wire routing assumes.
const Symbol = ({ type, live }) => {
  const bodyCls = `lga__sym-body${live ? ' lga__sym-body--live' : ''}`;
  const leadCls = `lga__sym-lead${live ? ' lga__sym-lead--live' : ''}`;

  if (type === 'input') {
    return (
      <svg className="lga__sym" viewBox="0 0 140 100" aria-hidden="true">
        <line className={leadCls} x1="96" y1="50" x2="140" y2="50" />
        <circle className={bodyCls} cx="44" cy="50" r="5" />
        <circle className={bodyCls} cx="96" cy="50" r="5" />
        <line
          className={leadCls}
          x1="44"
          y1="50"
          x2={live ? 96 : 88}
          y2={live ? 50 : 28}
          strokeWidth="3"
        />
        <text className="lga__sym-ref" x="70" y="84">
          SOURCE
        </text>
      </svg>
    );
  }

  if (type === 'output') {
    return (
      <svg className="lga__sym" viewBox="0 0 140 100" aria-hidden="true">
        <line className={leadCls} x1="0" y1="50" x2="42" y2="50" />
        <circle className={bodyCls} cx="66" cy="50" r="24" />
        <line className={bodyCls} x1="49" y1="33" x2="83" y2="67" />
        <line className={bodyCls} x1="83" y1="33" x2="49" y2="67" />
        <text className="lga__sym-ref" x="70" y="92">
          LAMP
        </text>
      </svg>
    );
  }

  if (type === 'not') {
    return (
      <svg className="lga__sym" viewBox="0 0 140 100" aria-hidden="true">
        <line className={leadCls} x1="0" y1="50" x2="38" y2="50" />
        <line className={leadCls} x1="112" y1="50" x2="140" y2="50" />
        <path className={bodyCls} d="M38 24 L38 76 L100 50 Z" />
        <circle className={bodyCls} cx="106" cy="50" r="6" />
        <text className="lga__sym-ref" x="66" y="92">
          NOT
        </text>
      </svg>
    );
  }

  const leads = (
    <>
      <line className={leadCls} x1="0" y1="32" x2="40" y2="32" />
      <line className={leadCls} x1="0" y1="68" x2="40" y2="68" />
      <line className={leadCls} x1="104" y1="50" x2="140" y2="50" />
    </>
  );

  if (type === 'and') {
    return (
      <svg className="lga__sym" viewBox="0 0 140 100" aria-hidden="true">
        {leads}
        <path className={bodyCls} d="M40 20 H68 A30 30 0 0 1 68 80 H40 Z" />
        <text className="lga__sym-txt" x="66" y="56">
          &amp;
        </text>
        <text className="lga__sym-ref" x="70" y="94">
          AND
        </text>
      </svg>
    );
  }

  const isXor = type === 'xor';
  return (
    <svg className="lga__sym" viewBox="0 0 140 100" aria-hidden="true">
      {leads}
      <path
        className={bodyCls}
        d="M40 20 Q58 50 40 80 Q78 80 104 50 Q78 20 40 20 Z"
      />
      {isXor && (
        <path
          className={bodyCls}
          style={{ fill: 'none' }}
          d="M30 20 Q48 50 30 80"
        />
      )}
      <text className="lga__sym-txt" x="66" y="56">
        ≥1
      </text>
      <text className="lga__sym-ref" x="70" y="94">
        {isXor ? 'XOR' : 'OR'}
      </text>
    </svg>
  );
};

const SkinSwitch = ({ skin, setSkin, variant = 'draft' }) => {
  if (variant === 'classic') {
    const cls = (on) =>
      `px-3 py-1 border text-[10px] font-bold uppercase transition-all ${
        on
          ? 'bg-white text-black border-white'
          : 'border-white/10 text-gray-500 hover:text-white'
      }`;
    return (
      <div className="flex mr-3" role="group" aria-label="Choose a look">
        <button
          type="button"
          className={cls(skin === 'draft')}
          aria-pressed={skin === 'draft'}
          onClick={() => setSkin('draft')}
        >
          Sheet
        </button>
        <button
          type="button"
          className={cls(skin === 'classic')}
          aria-pressed={skin === 'classic'}
          onClick={() => setSkin('classic')}
        >
          Terminal
        </button>
      </div>
    );
  }
  return (
    <div className="lga__skin" role="group" aria-label="Choose a look">
      <button
        type="button"
        aria-pressed={skin === 'draft'}
        onClick={() => setSkin('draft')}
      >
        Drafting sheet
      </button>
      <button
        type="button"
        aria-pressed={skin === 'classic'}
        onClick={() => setSkin('classic')}
      >
        Terminal
      </button>
    </div>
  );
};

const LogicArchitectPage = () => {
  const { addToast } = useToast();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [skin, setSkin] = useState('draft');

  const [nodes, setNodes] = useState([
    { id: 'node-1', type: 'input', x: 100, y: 150, state: false },
    { id: 'node-2', type: 'and', x: 350, y: 200, state: false },
    { id: 'node-3', type: 'output', x: 600, y: 200, state: false },
  ]);

  const [connections, setConnections] = useState([
    { from: 'node-1', to: 'node-2', inputIdx: 0 },
  ]);

  const [activePort, setActivePort] = useState(null);
  const workspaceRef = useRef(null);

  const simulate = useCallback(() => {
    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];
      let changed = false;

      newNodes.forEach((node) => {
        if (node.type === 'input') return;

        const nodeInputs = [];
        connections
          .filter((c) => c.to === node.id)
          .forEach((c) => {
            const sourceNode = newNodes.find((n) => n.id === c.from);
            nodeInputs[c.inputIdx] = sourceNode ? sourceNode.state : false;
          });

        let newState = false;
        if (node.type === 'output') {
          newState = nodeInputs[0] || false;
        } else if (node.type === 'and') {
          newState = nodeInputs[0] === true && nodeInputs[1] === true;
        } else if (node.type === 'or') {
          newState = nodeInputs[0] === true || nodeInputs[1] === true;
        } else if (node.type === 'xor') {
          newState =
            nodeInputs[0] !== nodeInputs[1] &&
            (nodeInputs[0] !== undefined || nodeInputs[1] !== undefined);
        } else if (node.type === 'not') {
          newState = !nodeInputs[0];
        }

        if (newState !== node.state) {
          node.state = newState;
          changed = true;
        }
      });

      return changed ? [...newNodes] : prevNodes;
    });
  }, [connections]);

  useEffect(() => {
    const interval = setInterval(simulate, 50);
    return () => clearInterval(interval);
  }, [simulate]);

  const addNode = (type) => {
    const id = `node-${Date.now()}`;
    setNodes((prev) => [...prev, { id, type, x: 100, y: 100, state: false }]);
    addToast({
      title: `${GATES_META[type].label} added`,
      message: 'Drag it into place, then wire it up.',
    });
  };

  const deleteNode = (id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
  };

  const handlePortClick = (nodeId, type, idx) => {
    if (!activePort) {
      if (type === 'in') return;
      setActivePort({ nodeId, type, idx });
    } else {
      if (activePort.nodeId === nodeId) {
        setActivePort(null);
        return;
      }
      if (type === 'in') {
        const newConn = { from: activePort.nodeId, to: nodeId, inputIdx: idx };
        setConnections((prev) => [
          ...prev.filter((c) => !(c.to === nodeId && c.inputIdx === idx)),
          newConn,
        ]);
        addToast({
          title: 'Wired up',
          message: 'Signal will follow.',
          type: 'success',
        });
      }
      setActivePort(null);
    }
  };

  const toggleInput = (id) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, state: !n.state } : n)),
    );
  };

  const removeConnection = (targetId, inputIdx) => {
    setConnections((prev) =>
      prev.filter((c) => !(c.to === targetId && c.inputIdx === inputIdx)),
    );
    addToast({
      title: 'Wire removed',
      message: 'That input is free again.',
      type: 'info',
    });
  };

  const handlePan = (nodeId, info) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? { ...n, x: n.x + info.delta.x, y: n.y + info.delta.y }
          : n,
      ),
    );
  };

  const clearAll = () => {
    setNodes([]);
    setConnections([]);
    setIsClearDialogOpen(false);
    addToast({
      title: 'Sheet cleared',
      message: 'Start a fresh drawing.',
      type: 'info',
    });
  };

  const liveCount = connections.filter(
    (c) => nodes.find((n) => n.id === c.from)?.state,
  ).length;

  const seo = (
    <Seo
      title="Logic Architect | Fezcodex"
      description="Wire up logic gates and watch the signal propagate."
      keywords={[
        'logic gates',
        'circuit simulator',
        'digital logic',
        'schematic',
        'engineering',
      ]}
    />
  );

  // ---------------------------------------------------------------- classic
  if (skin === 'classic') {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-emerald-500/30 overflow-hidden flex flex-col">
        <style>{CSS}</style>
        {seo}
        <div className="p-6 md:p-12 border-b border-white/10 flex justify-between items-center gap-6 flex-wrap bg-black/50 backdrop-blur-md z-50">
          <div className="flex items-center gap-8">
            <Link
              to="/apps"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeftIcon size={24} weight="bold" />
            </Link>
            <div>
              <BreadcrumbTitle
                title="Logic Architect"
                slug="la"
                variant="brutalist"
              />
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">
                Experimental_Circuit_Lab
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center flex-wrap justify-end">
            <SkinSwitch skin={skin} setSkin={setSkin} variant="classic" />
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => addNode(type)}
                className="px-3 py-1 border border-white/10 hover:bg-white hover:text-black text-[10px] font-bold uppercase transition-all"
              >
                +{type}
              </button>
            ))}
            <button
              onClick={() => setIsClearDialogOpen(true)}
              className="px-3 py-1 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black text-[10px] font-bold uppercase transition-all ml-4"
            >
              Flush_All
            </button>
          </div>
        </div>

        <BrutalistDialog
          isOpen={isClearDialogOpen}
          onClose={() => setIsClearDialogOpen(false)}
          onConfirm={clearAll}
          title="FLUSH_WORKSPACE"
          message="This will permanently delete all logic gates and connections. proceed with protocol?"
          confirmText="CONFIRM_PURGE"
          cancelText="ABORT_FLUSH"
        />

        <div
          className="flex-grow relative bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px]"
          ref={workspaceRef}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {connections.map((conn) => {
              const fromNode = nodes.find((n) => n.id === conn.from);
              const toNode = nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + 140;
              const y1 = fromNode.y + 50;
              const x2 = toNode.x;
              const y2 = toNode.y + (conn.inputIdx === 0 ? 32 : 68);
              const d = `M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`;

              return (
                <g
                  key={`${conn.from}-${conn.to}-${conn.inputIdx}`}
                  className="cursor-pointer pointer-events-auto"
                >
                  <path
                    d={d}
                    stroke="transparent"
                    strokeWidth="15"
                    fill="none"
                    onClick={() => removeConnection(conn.to, conn.inputIdx)}
                  />
                  <motion.path
                    d={d}
                    stroke={fromNode.state ? '#10b981' : '#ffffff15'}
                    strokeWidth="3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    className="hover:stroke-red-500 transition-colors"
                    onClick={() => removeConnection(conn.to, conn.inputIdx)}
                  />
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => (
            <motion.div
              key={node.id}
              onPan={(e, info) => handlePan(node.id, info)}
              style={{ left: node.x, top: node.y }}
              className={`absolute w-[140px] h-[100px] border-2 bg-black/90 p-3 z-10 group cursor-grab active:cursor-grabbing transition-shadow
                ${node.state ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-white/10'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`text-[9px] font-black uppercase tracking-widest ${node.state ? 'text-emerald-500' : 'text-gray-600'}`}
                >
                  {node.type}
                </span>
                <button
                  onClick={() => deleteNode(node.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-500 transition-all"
                >
                  <TrashIcon size={12} />
                </button>
              </div>

              <div className="flex flex-col items-center gap-2 py-2">
                {node.type === 'input' ? (
                  <button
                    onClick={() => toggleInput(node.id)}
                    className={`w-10 h-10 border-2 flex items-center justify-center transition-all ${node.state ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/10 text-gray-700'}`}
                  >
                    {node.state ? <PowerIcon weight="bold" /> : <PowerIcon />}
                  </button>
                ) : node.type === 'output' ? (
                  <div
                    className={`w-10 h-10 border-2 rounded-full flex items-center justify-center transition-all ${node.state ? 'bg-red-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-white/10'}`}
                  >
                    <LightningIcon
                      weight={node.state ? 'fill' : 'regular'}
                      className={node.state ? 'text-white' : 'text-gray-800'}
                    />
                  </div>
                ) : (
                  <div className="text-2xl font-black text-white/20 select-none">
                    {GATES_META[node.type].label}
                  </div>
                )}
              </div>

              {node.type !== 'input' && (
                <>
                  <button
                    onClick={() => handlePortClick(node.id, 'in', 0)}
                    className={`absolute -left-2 top-6 w-4 h-4 border-2 rounded-full bg-black hover:scale-125 transition-transform ${activePort?.nodeId === node.id && activePort.type === 'in' ? 'border-emerald-500' : 'border-white/20'}`}
                  />
                  {GATES_META[node.type].inputs > 1 && (
                    <button
                      onClick={() => handlePortClick(node.id, 'in', 1)}
                      className={`absolute -left-2 bottom-6 w-4 h-4 border-2 rounded-full bg-black hover:scale-125 transition-transform ${activePort?.nodeId === node.id && activePort.type === 'in' ? 'border-emerald-500' : 'border-white/20'}`}
                    />
                  )}
                </>
              )}

              {node.type !== 'output' && (
                <button
                  onClick={() => handlePortClick(node.id, 'out', 0)}
                  className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 border-2 rounded-full bg-black hover:scale-125 transition-transform ${activePort?.nodeId === node.id && activePort.type === 'out' ? 'border-emerald-500' : 'border-white/20'} ${node.state ? 'border-emerald-500 bg-emerald-500' : ''}`}
                />
              )}
            </motion.div>
          ))}

          {activePort && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full z-[100] animate-pulse">
              Select target input port to connect...
            </div>
          )}
        </div>

        <footer className="p-4 bg-black/80 border-t border-white/10 flex justify-between items-center text-[9px] font-mono text-gray-600 uppercase tracking-widest">
          <div className="flex gap-6">
            <span>Nodes: {nodes.length}</span>
            <span>Links: {connections.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time Simulation Active</span>
          </div>
        </footer>
      </div>
    );
  }

  // ------------------------------------------------------------ drafting sheet
  return (
    <div className="lga">
      <style>{CSS}</style>
      {seo}

      <div className="lga__bar">
        <div className="lga__id">
          <Link to="/apps" className="lga__back" aria-label="Back to apps">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M10 3 L5 8 L10 13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div>
            <h1 className="lga__title">Logic Architect</h1>
            <p className="lga__desc">
              Throw a source, wire the pins, watch the signal go through.
            </p>
          </div>
        </div>

        <div className="lga__tools">
          <SkinSwitch skin={skin} setSkin={setSkin} />
          {TYPES.map((type) => (
            <button
              key={type}
              className="lga__tool"
              onClick={() => addNode(type)}
            >
              {GATES_META[type].label}
            </button>
          ))}
          <button
            className="lga__tool lga__tool--danger"
            onClick={() => setIsClearDialogOpen(true)}
          >
            Clear sheet
          </button>
        </div>
      </div>

      <div className="lga__sheet" ref={workspaceRef}>
        <svg className="lga__wires">
          {connections.map((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + 140;
            const y1 = fromNode.y + 50;
            const x2 = toNode.x;
            const y2 = toNode.y + inputY(toNode.type, conn.inputIdx);
            const mid = x2 - 24 > x1 + 24 ? (x1 + x2) / 2 : x1 + 24;
            const d = `M ${x1} ${y1} H ${mid} V ${y2} H ${x2}`;
            const live = fromNode.state;

            return (
              <g key={`${conn.from}-${conn.to}-${conn.inputIdx}`}>
                <path
                  className="lga__wire-hit"
                  d={d}
                  onClick={() => removeConnection(conn.to, conn.inputIdx)}
                />
                <path
                  className={`lga__wire${live ? ' lga__wire--live' : ''}`}
                  d={d}
                />
                <circle
                  className={`lga__junction${live ? ' lga__junction--live' : ''}`}
                  cx={x2}
                  cy={y2}
                  r="3"
                />
              </g>
            );
          })}
        </svg>

        {nodes.map((node) => {
          const meta = GATES_META[node.type];
          return (
            <motion.div
              key={node.id}
              onPan={(e, info) => handlePan(node.id, info)}
              style={{ left: node.x, top: node.y }}
              className="lga__part"
            >
              <Symbol type={node.type} live={node.state} />

              <button
                className="lga__kill"
                onClick={() => deleteNode(node.id)}
                aria-label={`Remove this ${meta.label} part`}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4 L12 12 M12 4 L4 12" strokeLinecap="round" />
                </svg>
              </button>

              {node.type === 'input' && (
                <button
                  className="lga__lever"
                  onClick={() => toggleInput(node.id)}
                  aria-pressed={node.state}
                  aria-label={
                    node.state ? 'Switch source off' : 'Switch source on'
                  }
                />
              )}

              {node.type !== 'input' && (
                <>
                  <button
                    className={`lga__pin${
                      activePort?.nodeId === node.id && activePort.type === 'in'
                        ? ' lga__pin--armed'
                        : ''
                    }`}
                    style={{ left: -7, top: inputY(node.type, 0) - 7 }}
                    onClick={() => handlePortClick(node.id, 'in', 0)}
                    aria-label={
                      meta.inputs > 1 ? 'First input pin' : 'Input pin'
                    }
                  />
                  {meta.inputs > 1 && (
                    <button
                      className="lga__pin"
                      style={{ left: -7, top: 68 - 7 }}
                      onClick={() => handlePortClick(node.id, 'in', 1)}
                      aria-label="Second input pin"
                    />
                  )}
                </>
              )}

              {node.type !== 'output' && (
                <button
                  className={`lga__pin${node.state ? ' lga__pin--live' : ''}${
                    activePort?.nodeId === node.id && activePort.type === 'out'
                      ? ' lga__pin--armed'
                      : ''
                  }`}
                  style={{ right: -7, top: 50 - 7 }}
                  onClick={() => handlePortClick(node.id, 'out', 0)}
                  aria-label="Output pin"
                />
              )}
            </motion.div>
          );
        })}

        {activePort && (
          <div className="lga__prompt" role="status">
            Now click an input pin to land the wire.
          </div>
        )}
      </div>

      <div className="lga__foot">
        <span>
          <b>{nodes.length}</b> parts · <b>{connections.length}</b> wires ·{' '}
          <b>{liveCount}</b> carrying signal
        </span>
        <span>Sheet 1 of 1</span>
      </div>

      {isClearDialogOpen && (
        <div
          className="lga__scrim"
          onClick={(e) =>
            e.target === e.currentTarget && setIsClearDialogOpen(false)
          }
        >
          <div className="lga__modal" role="dialog" aria-modal="true">
            <h2>Clear the sheet?</h2>
            <p>
              Every part and wire on this drawing goes. There is no way back to
              what is here now.
            </p>
            <div className="lga__modal-row">
              <button
                className="lga__modal-btn lga__modal-btn--no"
                onClick={() => setIsClearDialogOpen(false)}
              >
                Keep it
              </button>
              <button
                className="lga__modal-btn lga__modal-btn--go"
                onClick={clearAll}
              >
                Clear it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogicArchitectPage;
