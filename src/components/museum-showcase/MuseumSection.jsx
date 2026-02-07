import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { motion } from 'framer-motion';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import FeatureCard from '../stylish-project/FeatureCard';

// A high-end, gallery-themed prism style
const museumCodeTheme = {
  'code[class*="language-"]': {
    color: '#1a1a1a',
    background: 'none',
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '0.85em',
    lineHeight: '1.8',
  },
  'pre[class*="language-"]': {
    background: '#ffffff',
    padding: '3rem 2.5rem 2.5rem 2.5rem',
    margin: '0',
    overflow: 'auto',
    border: '1px solid rgba(0,0,0,0.05)',
    boxShadow: '0 30px 60px -20px rgba(0,0,0,0.05)',
  },
  keyword: { color: '#000', fontWeight: '900' },
  string: { color: '#059669' },
  comment: { color: '#9ca3af', fontStyle: 'italic' },
  punctuation: { color: '#d1d5db' },
  'attr-name': { color: '#6366f1' },
  function: { color: '#2563eb' },
  operator: { color: '#9ca3af' },
  'class-name': { color: '#1a1a1a', fontWeight: 'bold' },
};

const MuseumSection = ({
  title,
  content,
  subtext,
  reverse = false,
  isSpecial = false,
  type = 'markdown',
  data = null,
}) => {
  const hasCodeBlock = content.includes('```');
  const isSyntaxSection =
    content.includes('syntax-grid') ||
    isSpecial ||
    hasCodeBlock ||
    type === 'features';

  return (
    <section
      className={`${isSpecial ? 'bg-[#121212] text-[#e5e5e5]' : 'bg-[#FDFAF5] text-[#1a1a1a]'} py-60 px-8 md:px-24 relative overflow-hidden transition-colors duration-700`}
    >
      {isSpecial && (
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      )}

      <div
        className={`${isSyntaxSection ? 'max-w-full' : 'max-w-screen-2xl'} mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start`}
      >
        {/* Descriptive Sticky Header */}
        <div
          className={`lg:col-span-3 ${reverse ? 'lg:order-2' : ''} ${isSpecial ? 'lg:col-span-12 mb-20 sticky-none' : 'sticky top-40'}`}
        >
          <motion.div
            initial={{ opacity: 0, x: reverse ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-6 mb-10">
              <div
                className={`w-8 h-px ${isSpecial ? 'bg-white/20' : 'bg-black/20'}`}
              />
              <span
                className={`text-[10px] font-black uppercase tracking-[0.5em] font-ibm-plex-mono ${isSpecial ? 'text-white/40' : 'text-black/30'}`}
              >
                {subtext || 'Detail'}
              </span>
            </div>
            <h2
              className={`text-5xl md:text-7xl font-instr-serif italic mb-12 leading-[1.1] tracking-tighter ${isSpecial ? 'text-white' : 'text-[#1a1a1a]'}`}
            >
              {title}
            </h2>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
            </div>
          </motion.div>
        </div>

        {/* Narrative Content */}
        <div
          className={`${isSyntaxSection ? 'lg:col-span-12' : 'lg:col-span-9'} ${reverse ? 'lg:order-1' : isSyntaxSection && !isSpecial ? 'lg:col-start-4' : ''}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={`prose prose-neutral max-w-none prose-p:font-instr-serif prose-p:text-2xl prose-p:leading-[1.6] prose-p:mb-12 prose-li:font-instr-serif prose-li:text-xl prose-li:mb-0 prose-strong:font-black prose-pre:max-w-none ${isSpecial ? 'prose-invert prose-p:text-white/70 prose-li:text-white/60 prose-strong:text-white' : 'prose-p:text-black/60 prose-li:text-black/50 prose-strong:text-black'}`}
          >
            {type === 'features' && data ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 not-prose">
                {data.map((feature, idx) => (
                  <FeatureCard
                    key={idx}
                    title={feature.title}
                    description={feature.description}
                    iconName={feature.icon}
                  />
                ))}
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <p className="mb-12">{children}</p>,
                  ul: ({ children }) => (
                    <ul className="list-none p-0 m-0 w-full">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li
                      className={`list-none border-l-2 ${isSpecial ? 'border-white/10' : 'border-black/10'} pl-10 pb-12 last:pb-0 -ml-[2px] transition-colors relative m-0 w-full`}
                    >
                      <div
                        className={`absolute top-0 left-[-2px] w-[2px] h-full ${isSpecial ? 'bg-white/10' : 'bg-black/10'}`}
                      />
                      {children}
                    </li>
                  ),
                  h3: ({ children }) => (
                    <h3
                      className={`text-2xl font-instr-serif italic mb-10 mt-24 tracking-tight ${isSpecial ? 'text-white/90' : 'text-black/80'}`}
                    >
                      {children}
                    </h3>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${isSpecial ? 'text-white border-b border-white/20 hover:border-white' : 'text-black underline underline-offset-8 decoration-black/10 hover:decoration-black'} transition-all`}
                    >
                      {children}
                    </a>
                  ),
                  div: ({ node, children, className, ...props }) => {
                    if (className?.includes('syntax-grid')) {
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 mb-24 w-full items-start">
                          {children}
                        </div>
                      );
                    }
                    return (
                      <div className={`w-full ${className || ''}`} {...props}>
                        {children}
                      </div>
                    );
                  },
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-16 relative group w-full block clear-both">
                        {/* Posh Metadata Tag - Now Serif */}
                        <div
                          className={`absolute -top-4 left-8 ${isSpecial ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-black/5'} border px-6 py-3 shadow-sm z-10 flex items-center gap-4`}
                        >
                          <div className="w-1 h-1 rounded-full bg-emerald-500" />
                          <span
                            className={`text-[11px] font-medium font-instr-serif italic ${isSpecial ? 'text-white/60' : 'text-black/60'} whitespace-nowrap tracking-tight`}
                          >
                            Exhibition Node // {match[1].toUpperCase()}
                          </span>
                        </div>

                        {/* Frame */}
                        <div
                          className={`relative border ${isSpecial ? 'border-white/5 bg-white/5' : 'border-black/[0.03] bg-[#fcfcfc]'} p-1 w-full block`}
                        >
                          <SyntaxHighlighter
                            style={museumCodeTheme}
                            language={match[1]}
                            PreTag="div"
                            className="!w-full !m-0 !block"
                            customStyle={{
                              width: '100%',
                              margin: 0,
                              display: 'block',
                              backgroundColor: isSpecial
                                ? 'transparent'
                                : '#ffffff',
                              color: isSpecial ? '#e5e5e5' : '#1a1a1a',
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>

                        {/* Footer Metadata */}
                        <div className="mt-4 flex justify-between items-center px-4 opacity-20 pointer-events-none">
                          <span
                            className={`text-[8px] font-bold font-ibm-plex-mono uppercase tracking-widest ${isSpecial ? 'text-white' : 'text-black'}`}
                          >
                            Digital Sample Ref.{' '}
                            {Math.random()
                              .toString(36)
                              .substring(7)
                              .toUpperCase()}
                          </span>
                          <div className="flex gap-1">
                            <div
                              className={`w-4 h-px ${isSpecial ? 'bg-white' : 'bg-black'}`}
                            />
                            <div
                              className={`w-1 h-px ${isSpecial ? 'bg-white' : 'bg-black'}`}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <code
                        className={`font-ibm-plex-mono text-sm ${isSpecial ? 'bg-white/10 text-white/80' : 'bg-black/5 text-black/80'} px-2 py-0.5 rounded-sm`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default MuseumSection;
