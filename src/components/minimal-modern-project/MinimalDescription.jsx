import React from 'react';
import ReactMarkdown from 'react-markdown';

const MinimalDescription = ({ content }) => {
  if (!content) return null;

  return (
    <section className="py-32 bg-[#f3f1e9] font-instr-sans">
      <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4 lg:col-start-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30 mb-12">
            Detailed Overview
          </h3>
        </div>
        <div className="lg:col-span-6 lg:col-start-5 prose prose-neutral prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h2: ({ node, children, ...props }) => (
                <h2
                  className="text-4xl font-instr-serif font-medium mb-12 tracking-tight text-black"
                  {...props}
                >
                  {children}
                </h2>
              ),
              p: ({ node, ...props }) => (
                <p
                  className="text-black/70 leading-relaxed mb-8 font-light"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="text-black/70 font-light mb-2" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
};

export default MinimalDescription;
