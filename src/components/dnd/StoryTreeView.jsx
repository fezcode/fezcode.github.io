import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaretDown, CaretUp, BookOpen, Scroll } from '@phosphor-icons/react';

const StoryTreeView = ({ books }) => {
  const [expandedBookId, setExpandedBookId] = useState(null);

  const toggleBook = (id) => {
    setExpandedBookId(expandedBookId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {books.map((book) => (
        <div key={book.bookId} className="relative group">
          {/* Side Border Accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-dnd-gold via-dnd-crimson to-dnd-gold opacity-40 group-hover:opacity-100 transition-opacity rounded-full" />

          <div className="ml-4 relative bg-[#120a07]/80 backdrop-blur-xl border border-dnd-gold/20 rounded-sm overflow-hidden shadow-2xl">

            {/* Book Header (Clickable) */}
            <button
              onClick={() => toggleBook(book.bookId)}
              className="w-full p-8 flex items-center justify-between text-left hover:bg-white/[0.03] transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full border border-dnd-gold/30 flex items-center justify-center bg-black/40 text-dnd-gold">
                   <BookOpen size={24} weight="duotone" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-dnd-gold-light uppercase tracking-[0.2em] opacity-70">
                    Volume {String(book.bookId).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-playfairDisplay font-black text-white group-hover:text-dnd-gold transition-colors mt-1">
                    {book.bookTitle}
                  </h3>
                </div>
              </div>

              <div className="text-dnd-gold/30 group-hover:text-dnd-gold transition-all transform group-hover:scale-110">
                {expandedBookId === book.bookId ? <CaretUp size={24} weight="bold" /> : <CaretDown size={24} weight="bold" />}
              </div>
            </button>

            {/* Episodes List (Collapsible) */}
            {expandedBookId === book.bookId && (
              <div className="px-8 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="h-px w-full bg-dnd-gold/10 mb-6" />
                <div className="grid gap-3">
                  {book.episodes && book.episodes.map((episode) => (
                    <Link
                      key={episode.id}
                      to={`/stories/books/${book.bookId}/pages/${episode.id}`}
                      className="flex items-center gap-4 p-4 rounded-sm hover:bg-white/5 border border-transparent hover:border-dnd-gold/20 transition-all group/episode"
                    >
                      <div className="text-dnd-gold opacity-50 group-hover/episode:opacity-100 transition-opacity">
                        <Scroll size={20} weight="duotone" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-arvo font-bold text-gray-300 group-hover/episode:text-white transition-colors">
                          {episode.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                             Episode {episode.id}
                           </span>
                           <span className="text-[10px] font-mono text-white/20">•</span>
                           <span className="text-[10px] font-mono uppercase tracking-widest text-white">
                             {episode.author}
                           </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {(!book.episodes || book.episodes.length === 0) && (
                    <div className="text-white/30 italic font-arvo text-sm p-4">
                      No episodes recorded in this volume yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryTreeView;
