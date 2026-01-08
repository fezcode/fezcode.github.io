import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext } from '../../context/DndContext';
import DndLayout from '../../components/dnd/DndLayout';
import DndSearchInput from '../../components/dnd/DndSearchInput';
import useSeo from '../../hooks/useSeo';
import piml from 'piml';
import { MapTrifold, X } from '@phosphor-icons/react';

function DndPlacesPage() {
  useSeo({
    title: 'The Atlas | From Serfs and Frauds',
    description: "Explore the locations and landmarks of the Dungeons & Dragons campaign, From Serfs and Frauds.",
    keywords: ['Fezcodex', 'd&d', 'dnd', 'from serfs and frauds', 'places', 'locations', 'maps'],
  });

  const { setBreadcrumbs } = useContext(DndContext);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'S&F', path: '/stories' },
      { label: 'The Lore', path: '/stories/lore' },
      { label: 'The Atlas', path: '/stories/places' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const placesResponse = await fetch(`${process.env.PUBLIC_URL}/stories/places.piml`);

        if (placesResponse.ok) {
          const text = await placesResponse.text();
          const data = piml.parse(text);
          setPlaces(data.places || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const filteredPlaces = places.filter(place => {
    const term = searchQuery.toLowerCase();
    return (
      place.name.toLowerCase().includes(term) ||
      place.type.toLowerCase().includes(term) ||
      place.description.toLowerCase().includes(term)
    );
  });

  return (
    <DndLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="text-center mb-12 relative">
          <div className="flex justify-center mb-6">
             <MapTrifold size={48} className="text-dnd-gold-light drop-shadow-[0_0_8px_rgba(249,224,118,0.4)]" weight="duotone" />
          </div>
          <h1 className="text-5xl md:text-8xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter mb-4 dnd-header-pulse">
            The Atlas
          </h1>
          <p className="text-lg md:text-xl font-arvo text-gray-400 max-w-2xl mx-auto uppercase tracking-widest opacity-60 mb-12">
            Landmarks, cities, and hidden corners of the world.
          </p>

          <DndSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search locations by name, type, or description..."
          />
        </header>

        <section className="space-y-24">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredPlaces.map((place, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   onClick={() => setSelectedPlace(place)}
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
                        <MapTrifold size={48} weight="duotone" />
                     </div>

                     <h3 className="text-3xl font-playfairDisplay italic font-black text-dnd-crimson uppercase tracking-tighter mb-2 relative z-10">
                       {place.name}
                     </h3>
                     <p className="text-xs font-arvo text-black/60 uppercase tracking-widest mb-4 font-bold relative z-10">
                       {place.type}
                     </p>

                     <div className="h-px w-16 bg-dnd-crimson/20 mb-6" />

                     <p className="text-base font-arvo text-black/70 leading-relaxed line-clamp-4 relative z-10 px-4">
                       {place.description}
                     </p>

                     <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-mono text-dnd-crimson uppercase tracking-widest">
                        View Details
                     </div>
                   </div>
                 </motion.div>
               ))}
               {filteredPlaces.length === 0 && (
                 <div className="col-span-full text-center py-12 text-white/60 font-arvo italic">
                   No landmarks found in the atlas.
                 </div>
               )}
             </div>
        </section>

        {/* Place Modal */}
        <AnimatePresence>
          {selectedPlace && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPlace(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-[#fcfaf2] border-2 border-dnd-gold shadow-2xl overflow-hidden dnd-fantasy-card p-8 md:p-12"
              >
                 {/* Close Button */}
                 <button
                   onClick={() => setSelectedPlace(null)}
                   className="absolute top-4 right-4 text-dnd-crimson/60 hover:text-dnd-crimson hover:rotate-90 transition-all duration-300 z-50"
                 >
                   <X size={32} />
                 </button>

                 {/* Modal Content */}
                 <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-8 text-dnd-crimson animate-bounce-slow">
                        <MapTrifold size={64} weight="duotone" />
                     </div>

                    <h2 className="text-4xl md:text-5xl font-playfairDisplay italic font-black text-dnd-crimson uppercase tracking-tighter mb-2">
                      {selectedPlace.name}
                    </h2>
                    <p className="text-sm font-arvo text-dnd-gold-darker uppercase tracking-widest mb-8 font-bold">
                       {selectedPlace.type}
                     </p>

                     <div className="dnd-mystic-divider mb-8 w-full" />

                     <p className="text-lg font-arvo text-black/80 leading-loose mb-12 max-w-lg">
                       {selectedPlace.description}
                     </p>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                       <div className="bg-black/5 p-4 border border-black/10 rounded-sm">
                         <div className="text-xs font-mono text-black/50 uppercase tracking-wider mb-1">Status</div>
                         <div className="text-xl font-playfairDisplay font-bold text-dnd-crimson">{selectedPlace.status}</div>
                       </div>
                       <div className="bg-black/5 p-4 border border-black/10 rounded-sm">
                         <div className="text-xs font-mono text-black/50 uppercase tracking-wider mb-1">First Appearance</div>
                         <div className="text-lg font-playfairDisplay font-bold text-dnd-text truncate" title={selectedPlace.book}>{selectedPlace.book}</div>
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

export default DndPlacesPage;
