import React, { useRef } from 'react';

const EditorialSocial = ({ content }) => {
  const scrollRef = useRef(null);

  if (!content) return null;

  const items = content.split('---').map(block => {
    const lines = block.trim().split('\n');
    const title = lines[0]?.replace('#', '').trim();
    const author = lines[1]?.trim();
    const stats = lines[2]?.trim();
    const imageLine = lines.find(l => l.startsWith('image:'));
    const linkLine = lines.find(l => l.startsWith('link:'));

    return {
      title,
      author,
      stats,
      image: imageLine ? imageLine.replace('image:', '').trim() : null,
      link: linkLine ? linkLine.replace('link:', '').trim() : '#'
    };
  }).filter(item => item.title);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Approx card width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 border-b border-white/10 overflow-hidden">
      <div className="max-w-[2400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="md:col-start-2 md:col-span-3 md:border-l md:border-white/10 md:pl-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pr-4">
             <div>
                <p className="font-mono text-xs uppercase tracking-wider text-white/50">Social</p>
                <h2 className="text-4xl md:text-5xl font-instr-serif text-white">
                  Explore <br/> <span className="italic text-white/70">With</span> Us
                </h2>
             </div>
             {/* Navigation Arrows */}
             <div className="flex gap-2">
                <button
                  onClick={() => scroll('left')}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  aria-label="Scroll right"
                >
                  →
                </button>
             </div>
           </div>

           {/* Horizontal Scroll Container */}
           <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory -ml-4 px-4 scrollbar-hide">
             {items.map((item, idx) => (
               <a
                 key={idx}
                 href={item.link}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="snap-start shrink-0 w-[300px] md:w-[320px] aspect-[3/4] bg-black border border-white/10 rounded-xl overflow-hidden relative group"
               >
                 <div className="absolute inset-0 opacity-20 pointer-events-none">
                    {/* Placeholder for SVG background if no image */}
                    {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : (
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-white">
                            <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="currentColor" strokeWidth="0.5" fill="none" />
                            <path d="M0 60 Q 25 35, 50 60 T 100 60" stroke="currentColor" strokeWidth="0.5" fill="none" />
                            <path d="M0 70 Q 25 45, 50 70 T 100 70" stroke="currentColor" strokeWidth="0.5" fill="none" />
                        </svg>
                    )}
                 </div>

                 <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                   <div>
                     <h3 className="text-2xl font-instr-serif text-white leading-tight mb-2">{item.title}</h3>
                     <div className="flex items-center gap-2 mt-4">
                       <div className="w-5 h-5 rounded-full bg-white/20"></div>
                       <span className="text-sm text-white/70">{item.author}</span>
                     </div>
                   </div>

                   <div className="flex items-center gap-4 text-xs font-mono">
                     {item.stats && item.stats.split(' ').map((stat, sIdx) => (
                        <span key={sIdx} className={`${stat.startsWith('+') ? 'text-green-400' : stat.startsWith('-') ? 'text-red-400' : 'text-yellow-400'}`}>
                            {stat}
                        </span>
                     ))}
                   </div>
                 </div>
               </a>
             ))}
           </div>
        </div>

      </div>
    </section>
  );
};

export default EditorialSocial;