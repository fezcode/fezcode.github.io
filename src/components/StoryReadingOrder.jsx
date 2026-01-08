import React, { useState, useEffect } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

const StoryReadingOrder = () => {
  const [readingOrder, setReadingOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState(0);

  useEffect(() => {
    const fetchReadingOrder = async () => {
      try {
        const response = await fetch('/stories/reading-order.json');
        if (response.ok) {
          const data = await response.json();
          if (data.readingOrder) {
            setReadingOrder(data.readingOrder);
          }
        } else {
          console.error('Failed to fetch reading-order.json:', response.status);
        }
      } catch (error) {
        console.error('Error fetching reading order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReadingOrder();
  }, []);

  if (loading || readingOrder.length === 0) return null;

  return (
    <section className="py-24 max-w-5xl mx-auto">
      <div className="flex flex-col items-center mb-16">
        <div className="h-px w-32 bg-dnd-gold/40 mb-6" />
        <h2 className="text-4xl md:text-6xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tighter text-center">
          Chronological Order
        </h2>
        <p className="mt-4 font-arvo text-gray-400 italic text-center">
          "The sequence of souls and the path of the mountain."
        </p>
      </div>

      <div className="space-y-6">
        {readingOrder.map((phase, idx) => (
          <div key={phase.id} className="relative group">
            {/* Phase Decorative Border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-dnd-gold/20 via-dnd-crimson/10 to-dnd-gold/20 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000" />

            <div className="relative bg-[#1a0f0a] border-2 border-dnd-gold/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedPhase(expandedPhase === idx ? -1 : idx)}
                className="w-full p-8 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] text-dnd-gold-light uppercase tracking-[0.4em] font-bold">
                    {phase.title.split(':')[0]}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-playfairDisplay italic font-bold text-white group-hover:text-dnd-gold transition-colors">
                    {phase.title.split(':')[1] || phase.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-arvo italic tracking-wide">
                    {phase.description}
                  </p>
                </div>
                <div className="text-dnd-gold/50 group-hover:text-dnd-gold transition-colors">
                  {expandedPhase === idx ? <CaretUp size={28} weight="bold" /> : <CaretDown size={28} weight="bold" />}
                </div>
              </button>

              {expandedPhase === idx && (
                <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  {phase.books.map((book) => (
                    <div key={book.id} className="p-5 border-2 border-dnd-gold/10 bg-black/40 rounded flex items-center gap-5 group/item hover:border-dnd-gold/40 transition-all">
                      <div className="w-10 h-10 flex items-center justify-center border-2 border-dnd-gold/20 rounded-full text-dnd-gold-light group-hover/item:border-dnd-gold group-hover/item:bg-dnd-gold/10 transition-all shrink-0">
                        <span className="font-mono text-xs font-bold">{book.id}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-playfairDisplay font-black uppercase tracking-widest text-white group-hover/item:text-dnd-gold-light transition-colors truncate">
                          {book.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-px w-4 bg-dnd-crimson/40" />
                            <span className="text-[9px] font-arvo text-gray-500 uppercase tracking-[0.2em]">Book Entry</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoryReadingOrder;
