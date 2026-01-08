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

      <section className="py-24 max-w-6xl mx-auto px-4">

        <div className="flex flex-col items-center mb-20">

          <div className="flex items-center gap-4 mb-4">

              <div className="h-px w-16 bg-dnd-gold/40" />

              <span className="font-mono text-xs text-dnd-gold uppercase tracking-[0.4em]">Chronicle_Sequence</span>

              <div className="h-px w-16 bg-dnd-gold/40" />

          </div>

          <h2 className="text-5xl md:text-7xl font-playfairDisplay italic font-black dnd-gold-gradient-text uppercase tracking-tight text-center">

            Reading Order

          </h2>

          <p className="mt-6 font-arvo text-gray-300 italic text-center text-lg max-w-2xl opacity-80">

            "Step through the tapestry of Thornus in the order the fates intended. From the rain-slicked streets to the roots of the mountain."

          </p>

        </div>

        <div className="space-y-8">

          {readingOrder.map((phase, idx) => (

            <div key={phase.id} className="relative group">

              {/* Elegant Side Border */}

              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-dnd-gold via-dnd-crimson to-dnd-gold opacity-40 group-hover:opacity-100 transition-opacity rounded-full" />

              <div className="ml-4 relative bg-[#120a07]/80 backdrop-blur-xl border border-dnd-gold/20 rounded-sm overflow-hidden shadow-2xl">

                <button

                  onClick={() => setExpandedPhase(expandedPhase === idx ? -1 : idx)}

                  className="w-full p-10 flex items-center justify-between text-left hover:bg-white/[0.03] transition-all"

                >

                  <div className="flex flex-col gap-3">

                    <span className="font-mono text-xs text-dnd-gold-light uppercase tracking-[0.5em] font-bold opacity-70">

                      {phase.title.split(':')[0]}

                    </span>

                    <h3 className="text-3xl md:text-4xl font-playfairDisplay font-black text-white group-hover:text-dnd-gold transition-colors leading-tight">

                      {phase.title.split(':')[1] || phase.title}

                    </h3>

                    <div className="flex items-center gap-3">

                      <div className="h-px w-8 bg-dnd-crimson/60" />

                      <p className="text-base text-gray-400 font-arvo italic">

                          {phase.description}

                      </p>

                    </div>

                  </div>

                  <div className="text-dnd-gold/30 group-hover:text-dnd-gold transition-all transform group-hover:scale-110">

                    {expandedPhase === idx ? <CaretUp size={32} weight="bold" /> : <CaretDown size={32} weight="bold" />}

                  </div>

                </button>

                {expandedPhase === idx && (

                  <div className="px-10 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-left-4 duration-700">

                    {phase.books.map((book) => (

                      <div key={book.id} className="p-6 border border-white/10 bg-black/40 rounded-sm flex items-center gap-6 group/item hover:border-dnd-gold/50 hover:bg-black/60 transition-all cursor-default">

                        <div className="w-12 h-12 flex items-center justify-center border-2 border-dnd-gold/20 rounded-full text-dnd-gold group-hover/item:border-dnd-gold group-hover/item:bg-dnd-gold/10 transition-all shrink-0 shadow-lg">

                          <span className="font-playfairDisplay text-lg font-black">{book.id}</span>

                        </div>

                        <div className="flex flex-col min-w-0">

                          <span className="text-xl font-playfairDisplay font-bold text-gray-100 group-hover/item:text-white transition-colors">

                            {book.title}

                          </span>

                          <div className="flex items-center gap-2 mt-1 opacity-50">

                              <span className="text-[10px] font-arvo text-dnd-gold-light uppercase tracking-widest">Archive Record</span>

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

        <div className="mt-20 flex justify-center">

           <div className="h-px w-64 bg-gradient-to-r from-transparent via-dnd-gold/20 to-transparent" />

        </div>

      </section>

    );
};

export default StoryReadingOrder;
