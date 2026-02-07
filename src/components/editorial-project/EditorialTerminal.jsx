import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const EditorialTerminal = ({ content }) => {
  if (!content) return null;

  return (
    <section className="py-24 border-b border-white/10">
      <div className="max-w-[2400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-start-2 md:col-span-2 border-l border-white/10 pl-8 mb-8">
          <p className="font-mono text-xs uppercase tracking-wider text-white/50 mb-2">
            Install
          </p>
          <h2 className="text-4xl md:text-5xl font-instr-serif text-white leading-tight">
            Available in the <br />{' '}
            <span className="italic text-white/70">terminal</span>
          </h2>
        </div>

        <div className="md:col-start-2 md:col-span-3">
          {/* Fake Terminal Window */}
          <div className="bg-[#1d2021] rounded-lg overflow-hidden border border-white/10 shadow-2xl font-mono text-sm">
            {/* Terminal Header */}
            <div className="bg-[#282828] px-4 py-2 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#cc241d]"></div>
                <div className="w-3 h-3 rounded-full bg-[#98971a]"></div>
                <div className="w-3 h-3 rounded-full bg-[#d79921]"></div>
              </div>
              <div className="text-white/30 text-xs">dush</div>
              <div></div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 text-[#ebdbb2] overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code: ({ children }) => (
                      <span className="text-[#83a598]">{children}</span>
                    ),
                    p: ({ children }) => <div className="mb-2">{children}</div>,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </pre>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[#b8bb26]">➜</span>
                <span className="text-[#fabd2f]">~</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialTerminal;
