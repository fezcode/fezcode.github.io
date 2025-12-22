import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aboutData } from './aboutData';
import {
  Laptop,
  Coffee,
  Books,
  Guitar,
  Plant,
  Lamp,
  Note,
  X,
  CodeBlock,
  MusicNote,
  BookBookmark,
} from '@phosphor-icons/react';

// A simple styled component for desk items
const DeskItem = ({
  icon: Icon,
  label,
  onClick,
  className = '',
  color = 'text-gray-400',
}) => (
  <motion.button
    whileHover={{ scale: 1.1, y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`absolute flex flex-col items-center gap-2 group outline-none ${className}`}
  >
    <div
      className={`p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 transition-colors group-hover:bg-white/20 ${color}`}
    >
      <Icon size={48} weight="duotone" />
    </div>
    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded font-mono pointer-events-none whitespace-nowrap">
      {label}
    </span>
  </motion.button>
);

const DetailModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-[#fffdf5] text-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full relative font-serif"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
            {item.icon && <item.icon size={32} />}
          </div>
          <h2 className="text-2xl font-bold">{item.title}</h2>
        </div>

        <div className="prose prose-stone leading-relaxed">{item.content}</div>
      </motion.div>
    </motion.div>
  );
};

const InteractiveDesk = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const items = {
    laptop: {
      title: 'The Workstation',
      icon: CodeBlock,
      content: (
        <div>
          <p className="mb-4">
            My digital command center. Currently running Arch (btw) or maybe
            just VS Code on Mac.
          </p>
          <h4 className="font-bold mb-2">Core Stack:</h4>
          <ul className="list-disc pl-4 space-y-1">
            {aboutData.skills.slice(0, 4).map((s) => (
              <li key={s.name}>{s.name}</li>
            ))}
          </ul>
        </div>
      ),
    },
    coffee: {
      title: 'Fuel Cell',
      icon: Coffee,
      content: (
        <div>
          <p>Critical infrastructure component.</p>
          <p className="mt-2">
            Consuming{' '}
            <strong>
              {aboutData.stats[2].value} {aboutData.stats[2].unit}
            </strong>{' '}
            daily.
          </p>
        </div>
      ),
    },
    books: {
      title: 'The Library',
      icon: BookBookmark,
      content: (
        <div>
          <p className="mb-4">Knowledge repository.</p>
          {aboutData.experience.map((exp, i) => (
            <div
              key={i}
              className="mb-4 border-b border-gray-200 pb-2 last:border-0"
            >
              <div className="font-bold">{exp.company}</div>
              <div className="text-sm text-gray-500">
                {exp.role} ({exp.period})
              </div>
            </div>
          ))}
        </div>
      ),
    },
    guitar: {
      title: aboutData.traits.hobby.title,
      icon: MusicNote,
      content: <p>{aboutData.traits.hobby.desc}</p>,
    },
    notes: {
      title: 'Sticky Notes',
      icon: Note,
      content: (
        <ul className="space-y-2">
          <li className="bg-yellow-100 p-2 rotate-1 shadow-sm font-handwriting">
            Superpower: {aboutData.traits.superpower.title}
          </li>
          <li className="bg-blue-100 p-2 -rotate-1 shadow-sm font-handwriting">
            Kryptonite: {aboutData.traits.kryptonite.title}
          </li>
        </ul>
      ),
    },
  };

  return (
    <div className="relative min-h-screen bg-[#2d3436] overflow-hidden flex items-center justify-center">
      {/* Room Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2d3436] to-[#1e272e]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-[#353b48] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transform rotate-x-12 perspective-1000">
        {/* Floor/Desk Surface */}
        <div className="absolute bottom-0 w-full h-1/2 bg-[#7f8fa6] rounded-b-xl opacity-20" />
      </div>

      {/* Desk Items Layer */}
      <div className="relative w-full max-w-4xl h-[600px] z-10">
        <h1 className="absolute top-10 left-1/2 -translate-x-1/2 text-white/10 text-6xl font-black uppercase tracking-widest pointer-events-none select-none">
          Workspace
        </h1>

        <DeskItem
          icon={Laptop}
          label="Work"
          onClick={() => setSelectedItem(items.laptop)}
          className="top-[40%] left-[50%] -translate-x-1/2 text-blue-400"
        />

        <DeskItem
          icon={Coffee}
          label="Fuel"
          onClick={() => setSelectedItem(items.coffee)}
          className="top-[55%] left-[65%] text-amber-600"
        />

        <DeskItem
          icon={Books}
          label="Lore"
          onClick={() => setSelectedItem(items.books)}
          className="top-[30%] left-[20%] text-emerald-500"
        />

        <DeskItem
          icon={Guitar}
          label="Vibes"
          onClick={() => setSelectedItem(items.guitar)}
          className="top-[60%] left-[15%] rotate-12 text-pink-500"
        />

        <DeskItem
          icon={Note}
          label="Traits"
          onClick={() => setSelectedItem(items.notes)}
          className="top-[35%] right-[20%] -rotate-6 text-yellow-400"
        />

        <DeskItem
          icon={Plant}
          label="Growth"
          onClick={() => {}} // Just decorative for now
          className="top-[20%] right-[30%] text-green-500 pointer-events-none opacity-50"
        />

        <DeskItem
          icon={Lamp}
          label="Ideas"
          onClick={() => {}}
          className="top-[15%] left-[10%] text-yellow-200 pointer-events-none opacity-50"
        />
      </div>

      <AnimatePresence>
        {selectedItem && (
          <DetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveDesk;
