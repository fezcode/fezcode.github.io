import React from 'react';

const MinimalHero = ({ content, title: projectTitle, image }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const tagLine = lines.find(l => l.startsWith('tag:'))?.replace('tag:', '').trim() || 'DEFINE';
  const subtitleLine = lines.find(l => l.startsWith('subtitle:'))?.replace('subtitle:', '').trim() || '';
  const listItems = lines.filter(l => l.startsWith('- ')).map(l => l.replace('- ', '').trim());
  const contentImage = lines.find(l => l.startsWith('image:'))?.replace('image:', '').trim();

  const displayImage = contentImage || image;

  return (
    <section className="min-h-screen flex flex-col pt-32 pb-20 font-instr-sans">
      <div className="max-w-[1400px] mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-x-20 items-start">

        {/* Left Column: Image Area */}
        <div className="lg:col-span-4 relative">
          <div className="flex justify-between items-end mb-4">
             <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
               {tagLine}
             </span>
             <div className="flex gap-1">
                <div className="w-2 h-6 bg-black"></div>
                <div className="w-2 h-6 bg-black"></div>
                <div className="w-2 h-6 bg-black"></div>
             </div>
          </div>
          <div className="w-full bg-[#e8e6de] relative rounded-sm overflow-hidden shadow-sm aspect-[5/8]">
            {displayImage ? (
              <img
                src={displayImage}
                alt={projectTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black/5 font-black text-9xl">
                {projectTitle?.charAt(0)}
              </div>
            )}
          </div>
          <div className="mt-3 flex gap-1.5 items-center">
              <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center text-[7px] font-bold text-black/60">DL</div>
              <div className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center text-[7px] font-bold text-black/60">90</div>
          </div>
        </div>

        {/* Right Column: Content Area */}
        <div className="lg:col-span-8 lg:pl-10">
          <div className="max-w-md">
            <h2 className="text-[28px] font-medium text-black leading-tight mb-40 tracking-tight">
              {subtitleLine}
            </h2>

            <div className="mb-10">
              <button className="bg-[#eef35d] text-black px-4 py-1.5 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                BEISPIEL ANZEIGEN <span className="text-[8px]">↗</span>
              </button>
            </div>

            <div className="space-y-1 relative">
              {/* Click floating tag */}
              <div className="absolute right-[-40px] top-[10px] bg-black text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest rotate-[-5deg] shadow-lg flex items-center gap-2">
                KLICKEN
              </div>

              {listItems.map((item, idx) => (
                <div key={idx} className="group flex items-center gap-3 cursor-pointer py-1">
                  <span className={`text-xl ${idx === 0 ? 'text-black opacity-100' : 'text-black/30'}`}>
                    {idx === 0 ? '✦' : ''}
                  </span>
                  <div className="relative">
                    <span className={`text-[36px] font-medium tracking-tight transition-all ${idx === 0 ? 'text-black' : 'text-black/30 group-hover:text-black/60'}`}>
                      {item}
                    </span>
                    {idx === 0 && (
                        <>
                         <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black" />
                         <div className="absolute left-[-10px] top-[10px] pointer-events-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="text-black">
                                <path fill="currentColor" d="M11.5,1.5L12,5L15.5,4.5L14,8L17.5,9.5L14,11L15.5,14.5L12,13L11.5,16.5L11,13L7.5,14.5L9,11L5.5,9.5L9,8L7.5,4.5L11,5L11.5,1.5Z" className="animate-spin-slow origin-center" />
                            </svg>
                         </div>
                        </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Divider line from image */}
      <div className="max-w-[1400px] mx-auto px-8 w-full mt-24">
        <div className="h-[1px] bg-black/10 w-full" />
      </div>
    </section>
  );
};

export default MinimalHero;
