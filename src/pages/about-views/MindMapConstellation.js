import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aboutData } from './aboutData';
import { X, Sparkle, Buildings } from '@phosphor-icons/react';

const NODE_COLORS = {
  core: '#a78bfa', // purple
  language: '#60a5fa', // blue
  frontend: '#f472b6', // pink
  devops: '#34d399', // green
  experience: '#ffb703', // yellow
  trait: '#fb923c', // orange
};

const ConstellationNode = ({
  x,
  y,
  size = 40,
  label,
  color,
  icon: Icon,
  onClick,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: delay * 0.1,
      }}
      className="absolute cursor-pointer group"
      style={{ left: x, top: y, translateX: '-50%', translateY: '-50%' }}
      onClick={onClick}
    >
      {/* Pulse Effect */}
      <div
        className="absolute inset-0 rounded-full animate-ping opacity-20"
        style={{ backgroundColor: color }}
      />

      {/* Node Body */}
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="relative z-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 backdrop-blur-md"
        style={{
          width: size,
          height: size,
          backgroundColor: `${color}40`,
          borderColor: color,
        }}
      >
        {Icon ? (
          <Icon size={size * 0.5} color="white" />
        ) : (
          <div className="w-2 h-2 bg-white rounded-full" />
        )}
      </motion.div>

      {/* Label */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
        {label}
      </div>
    </motion.div>
  );
};

const InfoPanel = ({ data, onClose }) => (
  <motion.div
    initial={{ x: '100%', opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: '100%', opacity: 0 }}
    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-gray-900/90 backdrop-blur-xl border-l border-gray-700 p-8 shadow-2xl z-50 text-white overflow-y-auto"
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
    >
      <X size={24} />
    </button>

    <div className="mt-8">
      <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-700 shadow-inner">
        {data.icon && <data.icon size={32} color={data.color} />}
      </div>
      <h2 className="text-3xl font-bold mb-2" style={{ color: data.color }}>
        {data.label}
      </h2>
      <p className="text-gray-400 text-sm font-mono mb-6 uppercase tracking-widest">
        {data.type}
      </p>

      <div className="prose prose-invert">
        {data.description || <p>No detailed data available for this node.</p>}
        {data.stats && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {Object.entries(data.stats).map(([k, v]) => (
              <div key={k} className="bg-white/5 p-3 rounded">
                <div className="text-xs text-gray-500 uppercase">{k}</div>
                <div className="text-lg font-bold">{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const MindMapConstellation = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const containerRef = useRef(null);

  // Generating node positions
  // In a real implementation, we might use d3-force or similar
  // Here we hardcode a nice layout for the 'constellation'

  const nodes = [
    // Center
    {
      id: 'me',
      x: '50%',
      y: '50%',
      size: 80,
      label: 'Me',
      color: '#fff',
      icon: Sparkle,
      type: 'root',
      description: aboutData.profile.tagline,
    },

    // Skills Cluster (Wide Arc Top-Left to Left)
    ...aboutData.skills.map((s, i) => {
      const angle = Math.PI * 1.2 + i * (Math.PI / 4); // Spread from top-left downwards
      const radius = 35; // % distance from center
      return {
        id: `skill-${i}`,
        x: `${50 + Math.cos(angle) * radius}%`,
        y: `${50 + Math.sin(angle) * radius}%`,
        label: s.name,
        color: NODE_COLORS[s.type] || '#fff',
        icon: s.icon,
        type: 'Skill',
        description: `Proficiency Level: ${s.level}%`,
        stats: { level: s.level },
      };
    }),

    // Experience Cluster (Wide Arc Bottom-Right to Right)
    ...aboutData.experience.map((e, i) => {
      const angle = Math.PI * 0.2 + i * (Math.PI / 5); // Spread from bottom-right upwards
      const radius = 35;
      return {
        id: `exp-${i}`,
        x: `${50 + Math.cos(angle) * radius}%`,
        y: `${50 + Math.sin(angle) * radius}%`,
        label: e.company,
        color: NODE_COLORS.experience,
        type: 'Experience',
        icon: Buildings, // Added default icon
        description: e.desc,
        stats: { role: e.role, period: e.period },
      };
    }),

    // Traits (Outliers)
    {
      id: 'superpower',
      x: '80%',
      y: '15%',
      label: 'Superpower',
      color: NODE_COLORS.trait,
      icon: aboutData.traits.superpower.icon,
      description: aboutData.traits.superpower.desc,
      type: 'Trait',
    },
    {
      id: 'hobby',
      x: '20%',
      y: '85%',
      label: 'Hobby',
      color: NODE_COLORS.trait,
      icon: aboutData.traits.hobby.icon,
      description: aboutData.traits.hobby.desc,
      type: 'Trait',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#0f172a] overflow-hidden"
    >
      {/* Background Stars */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
        }}
      >
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Background Planets */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full bg-purple-500 blur-3xl opacity-20" />
        <div className="absolute top-[80%] left-[20%] w-48 h-48 rounded-full bg-blue-600 blur-3xl opacity-10" />
        <div className="absolute top-[30%] right-[15%] w-24 h-24 rounded-full bg-cyan-400 blur-2xl opacity-20" />
        <div className="absolute bottom-[10%] right-[10%] w-64 h-64 rounded-full bg-indigo-900 blur-3xl opacity-30" />
      </div>

      {/* SVG Layer for lines (simplified connection to center) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {nodes.map((node, i) => {
          if (node.id === 'me') return null;
          return (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2={node.x}
              y2={node.y}
              stroke="white"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <ConstellationNode
          key={node.id}
          {...node}
          delay={i}
          onClick={() => setSelectedNode(node)}
        />
      ))}

      <AnimatePresence>
        {selectedNode && (
          <InfoPanel
            data={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 left-8 text-white/30 text-sm pointer-events-none">
        Drag to pan (Coming Soon) • Click nodes to explore
      </div>
    </div>
  );
};

export default MindMapConstellation;
