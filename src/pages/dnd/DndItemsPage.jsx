import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext } from '../../context/DndContext';
import DndLayout from '../../components/dnd/DndLayout';
import DndSearchInput from '../../components/dnd/DndSearchInput';
import useSeo from '../../hooks/useSeo';
import piml from 'piml';
import { Sword, X, Flask } from '@phosphor-icons/react';

function DndItemsPage() {
  useSeo({
    title: 'The Armory | From Serfs and Frauds',
    description: "Inspect the artifacts and items of the Dungeons & Dragons campaign, From Serfs and Frauds.",
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'items', 'artifacts', 'weapons', 'loot'],
  });

  const { setBreadcrumbs } = useContext(DndContext);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'S&F', path: '/stories' },
      { label: 'The Lore', path: '/stories/lore' },
      { label: 'The Armory', path: '/stories/items' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/stories/_items_/items.piml`);

        if (response.ok) {
          const text = await response.text();
          const data = piml.parse(text);
          setItems(data.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const filteredItems = items.filter(item => {
    const term = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  });

  return (
    <DndLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="text-center mb-12 relative">
          <div className="flex justify-center mb-6">
             <Sword size={48} className="text-dnd-gold-light drop-shadow-[0_0_8px_rgba(249,224,118,0.4)]" weight="duotone" />
          </div>
          <h1 className="text-5xl md:text-8xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-4 dnd-header-pulse">
            The Armory
          </h1>
          <p className="text-lg md:text-xl font-arvo text-gray-400 max-w-2xl mx-auto uppercase tracking-widest opacity-60 mb-12">
            Artifacts, curiosities, and tools of the trade.
          </p>

          <DndSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search artifacts by name, type, or description..."
          />
        </header>

        <section className="space-y-24">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredItems.map((item, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   onClick={() => setSelectedItem(item)}
                   className="cursor-pointer"
                 >
                   <div className="block group relative p-8 dnd-fantasy-card text-center h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-black/20 shadow-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                     {/* Background Runes */}
                     <div className="dnd-card-rune top-8 left-8 -rotate-12">ᚦ</div>
                     <div className="dnd-card-rune bottom-8 right-8 rotate-12">ᛉ</div>

                     {/* Ink Splatters */}
                     <div className="dnd-ink-splatter w-8 h-8 top-1/4 right-8" />
                     <div className="dnd-ink-splatter w-4 h-4 bottom-1/3 left-12" />

                     {/* Ornate corners */}
                     <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-dnd-gold opacity-60 group-hover:opacity-100 transition-all duration-500" />
                     <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-dnd-gold opacity-60 group-hover:opacity-100 transition-all duration-500" />
                     <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-dnd-gold opacity-60 group-hover:opacity-100 transition-all duration-500" />
                     <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-dnd-gold opacity-60 group-hover:opacity-100 transition-all duration-500" />

                     <div className="mb-6 text-dnd-crimson group-hover:scale-110 transition-transform duration-500 relative z-10">
                        {item.type.toLowerCase().includes('potion') ? <Flask size={48} weight="duotone" /> : <Sword size={48} weight="duotone" />}
                     </div>

                     <h3 className="text-3xl font-playfairDisplay italic font-black text-dnd-crimson uppercase tracking-tighter mb-2 relative z-10">
                       {item.name}
                     </h3>
                     <p className="text-xs font-arvo text-black/60 uppercase tracking-widest mb-4 font-bold relative z-10">
                       {item.type}
                     </p>

                     <div className="h-px w-16 bg-dnd-crimson/20 mb-6" />

                     <p className="text-base font-arvo text-black/70 leading-relaxed line-clamp-4 relative z-10 px-4">
                       {item.description}
                     </p>

                     <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-mono text-dnd-crimson uppercase tracking-widest">
                        Inspect Item
                     </div>
                   </div>
                 </motion.div>
               ))}
               {filteredItems.length === 0 && (
                 <div className="col-span-full text-center py-12 text-white/60 font-arvo italic">
                   The armory is empty matching your query.
                 </div>
               )}
             </div>
        </section>

        {/* Item Modal */}
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-[#fcfaf2] border-2 border-dnd-gold shadow-2xl overflow-hidden dnd-fantasy-card p-6 md:p-12"
              >
                 {/* Close Button */}
                 <button
                   onClick={() => setSelectedItem(null)}
                   className="absolute top-4 right-4 text-dnd-crimson/60 hover:text-dnd-crimson hover:rotate-90 transition-all duration-300 z-50"
                 >
                   <X size={32} />
                 </button>

                 {/* Modal Content */}
                 <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-4 text-dnd-crimson opacity-80">
                        {selectedItem.type.toLowerCase().includes('potion') ? <Flask size={48} weight="duotone" /> : <Sword size={48} weight="duotone" />}
                     </div>

                    <h2 className="text-4xl md:text-6xl font-playfairDisplay italic font-black text-dnd-crimson uppercase tracking-tighter mb-2">
                      {selectedItem.name}
                    </h2>
                    <p className="text-sm font-arvo text-dnd-gold-darker uppercase tracking-widest mb-6 font-bold">
                       {selectedItem.type}
                     </p>

                     <div className="dnd-mystic-divider mb-8 w-full" />

                     {selectedItem.image && (
                       <div className="mb-10 p-1 bg-white border border-dnd-gold/20 shadow-2xl w-full">
                          <img
                            src={selectedItem.image}
                            alt={selectedItem.name}
                            className="w-full h-auto object-contain border border-black/5"
                          />
                       </div>
                     )}

                     <p className="text-xl font-arvo text-black/90 leading-relaxed mb-10 max-w-3xl">
                       {selectedItem.description}
                     </p>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
                       <div className="bg-black/5 p-4 border border-black/10 rounded-sm">
                         <div className="text-xs font-mono text-black/50 uppercase tracking-wider mb-1">Current Owner</div>
                         <div className="text-xl font-playfairDisplay font-bold text-dnd-crimson">{selectedItem.owner}</div>
                       </div>
                       <div className="bg-black/5 p-4 border border-black/10 rounded-sm">
                         <div className="text-xs font-mono text-black/50 uppercase tracking-wider mb-1">Origin</div>
                         <div className="text-lg font-playfairDisplay font-bold text-dnd-text truncate" title={selectedItem.book}>{selectedItem.book}</div>
                       </div>
                     </div>
                 </div>

                 {/* Decorative Overlay */}
                 <div className="absolute inset-0 pointer-events-none border-[16px] border-dnd-parchment opacity-50" />
                 <div className="dnd-ornate-corner dnd-ornate-corner-tl" />
                 <div className="dnd-ornate-corner dnd-ornate-corner-tr" />
                 <div className="dnd-ornate-corner dnd-ornate-corner-bl" />
                 <div className="dnd-ornate-corner dnd-ornate-corner-br" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DndLayout>
  );
}

export default DndItemsPage;