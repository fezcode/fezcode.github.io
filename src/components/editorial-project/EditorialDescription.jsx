import React from 'react';
import ReactMarkdown from 'react-markdown';

const EditorialDescription = ({ content }) => {
  if (!content) return null;

  const sections = content.split('## ').filter(Boolean).map(s => {
      const lines = s.trim().split('\n');
      const title = lines[0].trim();
      const body = lines.slice(1).join('\n').trim();
      if (s.trim() === content.trim() && !content.includes('## ')) {
          return { title: 'Overview', body: s };
      }
      return { title, body };
  });

  return (
    <section className="border-t border-white/10">
      <div className="max-w-[2400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 py-24">

        {/* Title - Column 1 */}        <div className="md:col-span-1 flex flex-col gap-3">
          <p className="font-mono uppercase text-xs text-white/50">Details</p>
          <h2 className="text-4xl md:text-5xl font-instr-serif font-normal tracking-tight text-white sticky top-24">
            About <span className="italic text-white/70">the</span> Project
          </h2>
        </div>

        {/* Content Items - Columns 2-4 */}        <div className="md:col-start-2 md:col-span-3 border-l border-white/10 pl-8 flex flex-col">
          {sections.map((section, idx) => (
            <div key={idx} className="group py-8 border-b border-white/10 last:border-b-0 hover:bg-white/5 -mx-8 px-8 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-2 font-mono text-xs uppercase tracking-wider text-white/50 pt-1">
                        {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="md:col-span-10 flex flex-col gap-4">
                        <h3 className="font-instr-serif text-2xl text-white group-hover:text-white/90 transition-colors">
                            {section.title}
                        </h3>
                        <div className="text-base font-nunito text-[#e0e0e0] leading-relaxed max-w-3xl">
                            <ReactMarkdown
                              components={{
                                ul: ({children}) => <ul className="list-disc pl-4 mb-4 space-y-2 marker:text-white/50">{children}</ul>,
                                li: ({children}) => <li className="pl-1">{children}</li>,
                                strong: ({children}) => <span className="font-bold text-white">{children}</span>,
                                p: ({children}) => <p className="mb-4 last:mb-0">{children}</p>
                              }}
                            >
                              {section.body}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EditorialDescription;
