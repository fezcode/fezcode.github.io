import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import piml from 'piml';
import {
  ArrowUpRightIcon,
  ShieldCheckIcon,
  FingerprintIcon,
  AtomIcon
} from '@phosphor-icons/react';
import ArcaneSigil from '../../components/ArcaneSigil';

const LinkRenderer = ({ href, children }) => {
  const isExternal = href.startsWith('http') || href.startsWith('https');
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-white border-b border-white/20 hover:border-white transition-all mx-1"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
      {isExternal && <ArrowUpRightIcon size={10} className="inline-block" />}
    </a>
  );
};

const Brutalist = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const [metaResponse, contentResponse] = await Promise.all([
          fetch('/about-me/about.piml'),
          fetch('/about-me/about.txt'),
        ]);

        let attributes = {};
        if (metaResponse.ok) {
          const pimlText = await metaResponse.text();
          attributes = piml.parse(pimlText);
        }

        let body = '';
        if (contentResponse.ok) {
          body = await contentResponse.text();
        }

        setTitle(attributes.title || 'About Me');
        setContent(body);
      } catch (err) {
        console.error('Error fetching about page content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  if (loading) {
    return (
      <div className="h-full bg-[#050505] flex items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 animate-pulse">
          Establishing connection...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-outfit relative overflow-hidden">
      {/* Grid Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="fixed top-0 left-0 w-full h-full opacity-5 pointer-events-none mix-blend-screen">
         <ArcaneSigil seed={title || "Identity"} className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4" color="currentColor" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 px-6 sm:px-12 md:px-24 py-32 md:py-48 max-w-[1800px] mx-auto"
      >
        <header className="mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end border-b border-white/10 pb-24">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.4em]">
              Subject Dossier //
            </span>
            <h1 className="text-6xl md:text-9xl lg:text-[11rem] font-instr-serif italic tracking-tighter leading-[0.8] mb-4">
              {title.split(' ').map((word, i) => (
                <span key={i} className="block hover:translate-x-4 transition-transform duration-500">
                  {word}
                </span>
              ))}
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white/5 border border-white/10 p-6 space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4 pb-4 border-b border-white/10">
                 System Telemetry
              </h3>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-white/40">Status</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-500">Active</span>
                </div>
              </div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-white/40">Pattern</span>
                <span>Brufez_V3</span>
              </div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-white/40">Integrity</span>
                <span>Verified</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 md:gap-32">
          <div className="xl:col-span-8">
            <article
              className="prose prose-invert max-w-none
                prose-headings:font-instr-serif prose-headings:italic prose-headings:font-normal prose-headings:tracking-tighter prose-headings:text-white
                prose-h1:text-7xl prose-h1:mb-12 prose-h1:mt-24
                prose-h2:text-5xl prose-h2:mb-10 prose-h2:mt-20 prose-h2:pb-6 prose-h2:border-b prose-h2:border-white/10
                prose-h3:text-3xl prose-h3:mb-8 prose-h3:mt-16

                prose-p:font-outfit prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8 prose-p:text-white/70
                prose-strong:font-bold prose-strong:text-white

                prose-ul:font-outfit prose-ul:text-lg prose-ul:my-8 prose-ul:text-white/70 prose-li:my-2

                prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-white/10 prose-table:font-mono prose-table:text-xs prose-table:my-16
                prose-thead:bg-white/5 prose-thead:text-white
                prose-th:p-4 prose-th:uppercase prose-th:tracking-[0.2em] prose-th:font-normal prose-th:text-left prose-th:border prose-th:border-white/10
                prose-td:p-4 prose-td:border prose-td:border-white/10 prose-td:text-white/60

                prose-blockquote:border-l-0 prose-blockquote:bg-white/5 prose-blockquote:p-12 prose-blockquote:font-instr-serif prose-blockquote:italic prose-blockquote:text-3xl prose-blockquote:tracking-tight prose-blockquote:text-white prose-blockquote:my-16 prose-blockquote:border prose-blockquote:border-white/10"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{ a: LinkRenderer }}
              >
                {content}
              </ReactMarkdown>
            </article>
          </div>

          <aside className="xl:col-span-4 mt-24 xl:mt-0 space-y-12">
            <div className="sticky top-32 space-y-12">
              <div className="p-8 border border-white/10 bg-white/[0.01] relative overflow-hidden group">
                 <div className="flex items-center gap-2 mb-8 font-mono text-[10px] uppercase tracking-widest text-white/40">
                   <AtomIcon /> Visual Resonance
                 </div>
                 <div className="w-full h-64 flex items-center justify-center opacity-30 group-hover:opacity-80 transition-opacity duration-1000">
                    <ArcaneSigil seed="Sovereign" color="currentColor" className="w-full h-full" />
                 </div>
                 <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] leading-relaxed text-white/40">
                      Digital convergence archival entry. This segment contains curated behavioral patterns and experiential metrics of the subject.
                    </p>
                 </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-48 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-12 opacity-30 hover:opacity-100 transition-all duration-700">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <ShieldCheckIcon size={24} />
                 <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Secure Archive</span>
              </div>
              <p className="text-[9px] uppercase tracking-widest leading-relaxed">
                All artifacts are property of the Fezcodex Collective.
                Sovereign digital identity verified.
              </p>
           </div>

           <div className="flex flex-col justify-center items-center gap-3">
              <div className="flex gap-1">
                 {[...Array(12)].map((_, i) => (
                   <div key={i} className={`w-1 h-3 ${i < 9 ? 'bg-white' : 'bg-white/10'}`} />
                 ))}
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.3em]">Protocol Synchronized</span>
           </div>

           <div className="text-right flex flex-col items-end justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end">
                    <span className="text-sm font-instr-serif italic leading-none mb-1">Ahmed Samil Bulbul</span>
                    <span className="font-mono text-[8px] text-white/40 tracking-[0.2em] uppercase">System Architect</span>
                 </div>
                 <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center">
                    <FingerprintIcon size={24} weight="thin" />
                 </div>
              </div>
              <p className="text-[8px] tracking-[0.5em] uppercase mt-8">
                FCX_OS // Archive v0.9.6
              </p>
           </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Brutalist;
