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

const GATES_META = {
  and: { label: 'AND', inputs: 2, color: '#10b981' },
  or: { label: 'OR', inputs: 2, color: '#10b981' },
  xor: { label: 'XOR', inputs: 2, color: '#10b981' },
  not: { label: 'NOT', inputs: 1, color: '#10b981' },
  input: { label: 'SOURCE', inputs: 0, color: '#60a5fa' },
  output: { label: 'PROBE', inputs: 1, color: '#f87171' },
};

const LogicArchitectPage = () => {
  const { addToast } = useToast();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const [nodes, setNodes] = useState([
    { id: 'node-1', type: 'input', x: 100, y: 150, state: false },
    { id: 'node-2', type: 'and', x: 350, y: 200, state: false },
    { id: 'node-3', type: 'output', x: 600, y: 200, state: false },
  ]);

  const [connections, setConnections] = useState([
    { from: 'node-1', to: 'node-2', inputIdx: 0 },
  ]);

  const [activePort, setActivePort] = useState(null); // { nodeId, type: 'in' | 'out', idx }
  const workspaceRef = useRef(null);

  // --- Simulation Logic ---
  const simulate = useCallback(() => {
    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];
      let changed = false;

      newNodes.forEach((node) => {
        if (node.type === 'input') return;

        // Get inputs for this node, correctly mapped to indices
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

  // --- Actions ---
  const addNode = (type) => {
    const id = `node-${Date.now()}`;
    // Position near top-left of visible area
    setNodes((prev) => [...prev, { id, type, x: 100, y: 100, state: false }]);
    addToast({
      title: 'Module Initialized',
      message: `${type.toUpperCase()} gate added to workspace.`,
    });
  };

  const deleteNode = (id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
  };

  const handlePortClick = (nodeId, type, idx) => {
    if (!activePort) {
      if (type === 'in') return; // Must start from output
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
          title: 'Pathway Established',
          message: 'Nodes synchronized.',
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
      title: 'Pathway Severed',
      message: 'Connection removed.',
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

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      <Seo
        title="Logic Architect | Fezcodex"
        description="Construct complex digital circuits and simulate logical pathways in real-time."
        keywords={[
          'logic gates',
          'circuit simulator',
          'digital logic',
          'brutalist',
          'engineering',
        ]}
      />
      <div className="p-6 md:p-12 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md z-50">
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

        <div className="flex gap-2">
          {['input', 'and', 'or', 'not', 'xor', 'output'].map((type) => (
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
        onConfirm={() => {
          setNodes([]);
          setConnections([]);
          setIsClearDialogOpen(false);
          addToast({
            title: 'Workspace Flushed',
            message: 'All modules and pathways have been purged.',
            type: 'info',
          });
        }}
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
          {connections.map((conn, i) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            // precise line calculation
            const x1 = fromNode.x + 140;
            const y1 = fromNode.y + 50;
            const x2 = toNode.x;
            const y2 = toNode.y + (conn.inputIdx === 0 ? 32 : 68);

            return (
              <g
                key={`${conn.from}-${conn.to}-${conn.inputIdx}`}
                className="cursor-pointer pointer-events-auto"
              >
                {/* Wider invisible path for easier clicking */}
                <path
                  d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
                  stroke="transparent"
                  strokeWidth="15"
                  fill="none"
                  onClick={() => removeConnection(conn.to, conn.inputIdx)}
                />
                <motion.path
                  d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
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

            {/* Ports */}
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
};

export default LogicArchitectPage;
