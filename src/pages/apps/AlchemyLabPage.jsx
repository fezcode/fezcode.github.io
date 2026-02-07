import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FireIcon,
  WavesIcon,
  WindIcon,
  SkullIcon,
  SwordIcon,
  PersonIcon,
  HeartIcon,
  LightningIcon,
  CloudRainIcon,
  SunIcon,
  MoonIcon,
  AtomIcon,
  PlantIcon,
  TreeIcon,
  BugIcon,
  GlobeIcon,
  HardDriveIcon,
  CodeIcon,
  PlusIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react';
import Fez from '../../components/Fez';
import usePersistentState from '../../hooks/usePersistentState';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import BrutalistDialog from '../../components/BrutalistDialog';

const ITEMS = {
  // Base Elements
  fire: { id: 'fire', name: 'Fire', icon: FireIcon, color: 'text-orange-500' },
  water: {
    id: 'water',
    name: 'Water',
    icon: WavesIcon,
    color: 'text-blue-500',
  },
  air: { id: 'air', name: 'Air', icon: WindIcon, color: 'text-cyan-400' },
  earth: {
    id: 'earth',
    name: 'Earth',
    icon: GlobeIcon,
    color: 'text-amber-700',
  },

  // Tier 1
  lava: { id: 'lava', name: 'Lava', icon: FireIcon, color: 'text-red-600' },
  mud: { id: 'mud', name: 'Mud', icon: GlobeIcon, color: 'text-yellow-900' },
  steam: { id: 'steam', name: 'Steam', icon: WindIcon, color: 'text-gray-300' },
  dust: { id: 'dust', name: 'Dust', icon: WindIcon, color: 'text-yellow-600' },
  rain: {
    id: 'rain',
    name: 'Rain',
    icon: CloudRainIcon,
    color: 'text-blue-300',
  },
  energy: {
    id: 'energy',
    name: 'Energy',
    icon: LightningIcon,
    color: 'text-yellow-400',
  },

  // Tier 2
  stone: {
    id: 'stone',
    name: 'Stone',
    icon: GlobeIcon,
    color: 'text-gray-500',
  },
  life: { id: 'life', name: 'Life', icon: HeartIcon, color: 'text-pink-500' },
  plant: {
    id: 'plant',
    name: 'Plant',
    icon: PlantIcon,
    color: 'text-green-500',
  },
  metal: { id: 'metal', name: 'Metal', icon: AtomIcon, color: 'text-blue-100' },
  sun: { id: 'sun', name: 'Sun', icon: SunIcon, color: 'text-yellow-500' },
  moon: { id: 'moon', name: 'Moon', icon: MoonIcon, color: 'text-blue-100' },

  // Tier 3
  sword: {
    id: 'sword',
    name: 'Sword',
    icon: SwordIcon,
    color: 'text-gray-300',
  },
  organism: {
    id: 'organism',
    name: 'Organism',
    icon: BugIcon,
    color: 'text-green-400',
  },
  tree: { id: 'tree', name: 'Tree', icon: TreeIcon, color: 'text-green-700' },
  electricity: {
    id: 'electricity',
    name: 'Electricity',
    icon: LightningIcon,
    color: 'text-yellow-300',
  },

  // Tier 4
  human: {
    id: 'human',
    name: 'Human',
    icon: PersonIcon,
    color: 'text-orange-200',
  },
  computer: {
    id: 'computer',
    name: 'Computer',
    icon: HardDriveIcon,
    color: 'text-blue-400',
  },
  knight: {
    id: 'knight',
    name: 'Knight',
    icon: SwordIcon,
    color: 'text-indigo-400',
  },

  // Tier 5 (Ultimate)
  code: { id: 'code', name: 'Code', icon: CodeIcon, color: 'text-emerald-500' },
  fezcodex: {
    id: 'fezcodex',
    name: 'Fezcodex',
    icon: Fez,
    color: 'text-emerald-400',
  },
  ghost: {
    id: 'ghost',
    name: 'Ghost',
    icon: SkullIcon,
    color: 'text-purple-300',
  },
};

const RECIPES = [
  { a: 'fire', b: 'earth', result: 'lava' },
  { a: 'water', b: 'earth', result: 'mud' },
  { a: 'fire', b: 'water', result: 'steam' },
  { a: 'air', b: 'earth', result: 'dust' },
  { a: 'air', b: 'water', result: 'rain' },
  { a: 'air', b: 'fire', result: 'energy' },
  { a: 'lava', b: 'air', result: 'stone' },
  { a: 'energy', b: 'mud', result: 'life' },
  { a: 'life', b: 'earth', result: 'plant' },
  { a: 'stone', b: 'fire', result: 'metal' },
  { a: 'energy', b: 'fire', result: 'sun' },
  { a: 'stone', b: 'sun', result: 'moon' },
  { a: 'metal', b: 'fire', result: 'sword' },
  { a: 'life', b: 'water', result: 'organism' },
  { a: 'plant', b: 'earth', result: 'tree' },
  { a: 'metal', b: 'energy', result: 'electricity' },
  { a: 'organism', b: 'earth', result: 'human' },
  { a: 'electricity', b: 'metal', result: 'computer' },
  { a: 'human', b: 'sword', result: 'knight' },
  { a: 'human', b: 'computer', result: 'code' },
  { a: 'code', b: 'life', result: 'fezcodex' },
  { a: 'human', b: 'energy', result: 'ghost' },
];

const AlchemyLabPage = () => {
  const [discovered, setDiscovered] = usePersistentState('alchemy-discovered', [
    'fire',
    'water',
    'air',
    'earth',
  ]);
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { addToast } = useToast();

  const combine = useCallback(() => {
    if (!slot1 || !slot2) return;

    const recipe = RECIPES.find(
      (r) =>
        (r.a === slot1 && r.b === slot2) || (r.a === slot2 && r.b === slot1),
    );

    if (recipe) {
      const result = recipe.result;
      setLastResult(result);
      if (!discovered.includes(result)) {
        setDiscovered([...discovered, result]);
        addToast({
          title: 'Transmutation Success',
          message: `Conceptualized: ${ITEMS[result].name.toUpperCase()}`,
          duration: 3000,
        });
      }
    } else {
      setLastResult('fail');
    }

    // Auto clear slots after attempt
    setTimeout(() => {
      setSlot1(null);
      setSlot2(null);
      setLastResult(null);
    }, 1500);
  }, [slot1, slot2, discovered, setDiscovered, addToast]);

  const handleItemClick = (id) => {
    if (!slot1) setSlot1(id);
    else if (!slot2) setSlot2(id);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      <Seo
        title="Alchemy Lab | Fezcodex"
        description="Combine base elements to discover the secrets of the digital universe in this atmospheric alchemy game."
        keywords={['alchemy', 'game', 'crafting', 'elements', 'fezcodex']}
      />
      {/* Header */}
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
              title="Alchemy Lab"
              slug="al"
              variant="brutalist"
            />
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">
              Transmutation_Protocol_Active
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsResetDialogOpen(true)}
            className="px-3 py-1 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black text-[10px] font-bold uppercase transition-all"
          >
            Purge_Discoveries
          </button>
        </div>
      </div>

      <BrutalistDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={() => {
          setDiscovered(['fire', 'water', 'air', 'earth']);
          setIsResetDialogOpen(false);
          addToast({
            title: 'System Reset',
            message: 'All elemental data has been purged.',
            type: 'info',
          });
        }}
        title="PURGE_DATABASE"
        message="This will reset all your discoveries to the 4 base elements. proceed?"
        confirmText="CONFIRM_PURGE"
        cancelText="ABORT_RESET"
      />

      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Lab Area */}
        <div className="flex-grow flex flex-col items-center justify-center p-8 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px]">
          <div className="flex items-center gap-4 md:gap-12 mb-12">
            {/* Slot 1 */}
            <div
              onClick={() => setSlot1(null)}
              className={`w-24 h-24 md:w-32 md:h-32 border-2 flex items-center justify-center relative transition-all cursor-pointer
                ${slot1 ? 'border-white bg-white/5 scale-110 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-dashed border-white/10 hover:border-white/30'}`}
            >
              {slot1 ? (
                <div className="flex flex-col items-center">
                  {React.createElement(ITEMS[slot1].icon, {
                    size: 48,
                    weight: 'bold',
                    className: ITEMS[slot1].color,
                  })}
                  <span className="text-[9px] mt-2 uppercase font-black tracking-tighter">
                    {ITEMS[slot1].name}
                  </span>
                </div>
              ) : (
                <PlusIcon size={24} className="opacity-10" />
              )}
            </div>

            <div className="text-white/20">
              <PlusIcon size={32} weight="bold" />
            </div>

            {/* Slot 2 */}
            <div
              onClick={() => setSlot2(null)}
              className={`w-24 h-24 md:w-32 md:h-32 border-2 flex items-center justify-center relative transition-all cursor-pointer
                ${slot2 ? 'border-white bg-white/5 scale-110 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-dashed border-white/10 hover:border-white/30'}`}
            >
              {slot2 ? (
                <div className="flex flex-col items-center">
                  {React.createElement(ITEMS[slot2].icon, {
                    size: 48,
                    weight: 'bold',
                    className: ITEMS[slot2].color,
                  })}
                  <span className="text-[9px] mt-2 uppercase font-black tracking-tighter">
                    {ITEMS[slot2].name}
                  </span>
                </div>
              ) : (
                <PlusIcon size={24} className="opacity-10" />
              )}
            </div>
          </div>

          <div className="h-32 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {slot1 && slot2 && !lastResult && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={combine}
                  className="px-12 py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-emerald-400 transition-colors"
                >
                  Transmute
                </motion.button>
              )}

              {lastResult === 'fail' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 font-bold uppercase tracking-widest text-[10px] border border-red-500/20 px-4 py-2"
                >
                  Conceptual_Mismatch: No Reaction
                </motion.div>
              )}

              {lastResult && lastResult !== 'fail' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1.5, rotate: 0 }}
                  exit={{ opacity: 0, scale: 2 }}
                  className="flex flex-col items-center"
                >
                  {React.createElement(ITEMS[lastResult].icon, {
                    size: 64,
                    weight: 'bold',
                    className: ITEMS[lastResult].color,
                  })}
                  <span className="text-[10px] mt-4 uppercase font-black tracking-widest text-emerald-400">
                    {ITEMS[lastResult].name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Inventory Sidebar */}
        <div className="w-full md:w-80 border-l border-white/10 bg-black/30 backdrop-blur-sm flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Inventory
            </span>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {discovered.length} / {Object.keys(ITEMS).length}
            </span>
          </div>
          <div className="flex-grow overflow-y-auto p-4 grid grid-cols-3 gap-2 scrollbar-hide">
            {discovered.map((id) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleItemClick(id)}
                className={`aspect-square border flex flex-col items-center justify-center cursor-pointer transition-all
                  ${slot1 === id || slot2 === id ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 hover:border-white/20 bg-white/[0.02]'}`}
              >
                {React.createElement(ITEMS[id].icon, {
                  size: 24,
                  weight: 'bold',
                  className:
                    slot1 === id || slot2 === id
                      ? 'text-emerald-400'
                      : ITEMS[id].color,
                })}
                <span className="text-[7px] mt-1.5 uppercase font-bold text-center leading-none tracking-tighter opacity-60">
                  {ITEMS[id].name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 bg-black/80 border-t border-white/10 flex justify-between items-center text-[9px] font-mono text-gray-600 uppercase tracking-widest">
        <div className="flex gap-6">
          <span>Alchemy_V1.0</span>
          <span>Buffer_Cleared</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${discovered.length === Object.keys(ITEMS).length ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500'}`}
          />
          <span>
            {discovered.length === Object.keys(ITEMS).length
              ? 'Master_Alchemist_Status'
              : 'Research_In_Progress'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default AlchemyLabPage;
