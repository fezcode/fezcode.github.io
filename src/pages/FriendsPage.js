import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Broadcast,
  BookOpen,
  Users,
} from '@phosphor-icons/react';
import piml from 'piml';
import useSeo from '../hooks/useSeo';
import GenerativeArt from '../components/GenerativeArt';
import BrutalistModal from '../components/BrutalistModal';
import TransmissionTile from '../components/TransmissionTile';

const FriendsPage = () => {
  const [data, setData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useSeo({
    title: 'Friends of the Show | Fezcodex',
    description: 'A curated list of signals, portals, and archives from the digital garden.',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/about-me/transmissions.piml');
        if (response.ok) {
          const text = await response.text();
          const parsed = piml.parse(text);
          setData(parsed);
        }
      } catch (error) {
        console.error('Failed to load links:', error);
      }
    };
    fetchData();
  }, []);

  const handleTileClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const getCategoryIcon = (key) => {
    switch (key) {
      case 'friends': return <Users size={32} weight="duotone" className="text-emerald-500" />;
      case 'books': return <BookOpen size={32} weight="duotone" className="text-cyan-500" />;
      default: return <Broadcast size={32} weight="duotone" className="text-rose-500" />;
    }
  };

  const getCategoryLabel = (key) => {
    switch (key) {
      case 'friends': return 'Parallel Realities';
      case 'books': return 'Archive Access';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-white p-8 md:p-24 selection:bg-emerald-500/30 relative overflow-x-hidden">
      {/* Structural Grid Background */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }}
      />

      {/* Decorative Art Background - Increased visibility */}
      <div className="fixed inset-0 opacity-[0.08] pointer-events-none">
        <GenerativeArt seed="Friends of the Show 2" className="w-full h-full" />
      </div>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-20">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: '100vh' }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-full h-24 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent"
        />
      </div>

      <BrutalistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />

      <div className="relative z-10">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16 flex items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all duration-300 font-mono text-xs uppercase tracking-[0.3em] bg-white/5 px-4 py-2 border border-white/10 hover:border-emerald-500/50"
          >
            <ArrowLeft weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Archive</span>
          </button>
          <div className="h-px flex-grow bg-white/10" />
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <header className="mb-32 relative">
            <div className="absolute -left-12 top-0 bottom-0 w-1 bg-emerald-500 hidden xl:block" />
            <h1 className="text-7xl md:text-9xl font-black font-playfairDisplay italic uppercase tracking-tighter mb-6 leading-none">
              <span className="text-emerald-500">Friends</span> of the <span className="text-lime-500">Show</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-arvo max-w-2xl leading-relaxed border-l-2 border-white/10 pl-6">
              Signals from parallel realities and archived transmissions from the digital garden.
            </p>
          </header>

          <div className="space-y-48">
            {Object.entries(data).map(([key, content], idx) => {
              let items = [];
              if (Array.isArray(content)) {
                items = content;
              } else if (content && typeof content === 'object' && content.item) {
                items = Array.isArray(content.item) ? content.item : [content.item];
              }

              if (items.length === 0) return null;

              return (
                <motion.section
                  key={key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="space-y-16"
                >
                  <div className="flex items-center gap-8">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-sm relative group overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors" />
                        {getCategoryIcon(key)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-4xl md:text-6xl font-normal font-playfairDisplay uppercase tracking-tighter">{getCategoryLabel(key)}</h2>
                        <div className="h-px flex-grow bg-white/10" />
                        <span className="font-mono text-[10px] text-emerald-500/50 uppercase tracking-[0.2em]">Section_{idx + 1}</span>
                      </div>
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-[0.4em]">
                        Transmissions detected in the {key} sector.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-16">
                    {items.map((item, iIdx) => (
                      <TransmissionTile
                        key={iIdx}
                        item={item}
                        categoryKey={key}
                        onClick={handleTileClick}
                      />
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>
        </div>

        <footer className="mt-64 pt-24 border-t border-white/10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 bg-[#050505]">
             <Broadcast size={32} className="text-emerald-500 animate-pulse" />
          </div>
          <p className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.5em] text-center mb-4">
            End of Line // Transmission Terminated
          </p>
          <div className="flex justify-center gap-12 opacity-20">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="w-1 h-1 bg-white rounded-full" />
             ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FriendsPage;
