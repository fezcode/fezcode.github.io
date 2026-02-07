import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import piml from 'piml';
import {
  ArrowSquareOut,
  Cpu,
  HardDrive,
  ShieldCheck,
} from '@phosphor-icons/react';
import GenerativeArt from '../../components/GenerativeArt';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const LinkRenderer = ({ href, children }) => {
  const isExternal = href.startsWith('http') || href.startsWith('https');
  return (
    <a
      href={href}
      className="inline-block font-mono text-sm mx-0.5 border-2 border-white px-2 py-1 text-white hover:bg-white hover:text-black transition-all font-black uppercase tracking-widest"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}{' '}
      {isExternal && <ArrowSquareOut className="text-xs inline mb-1" />}
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
      <div className="h-full bg-black flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-widest text-white animate-pulse">
          Initialising_Brutalist_Core...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-mono relative">
      {/* Visual Background Layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />
      <div className="fixed top-0 left-0 w-full h-full opacity-10 pointer-events-none grayscale contrast-150">
        <GenerativeArt seed="Ahmed Samil Bulbul" className="w-full h-full" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 px-4 sm:px-8 md:px-12 lg:px-24 py-32 md:py-48 max-w-[1600px] mx-auto"
      >
        <header className="mb-32 flex flex-col gap-12 border-l-8 border-white pl-8 md:pl-16">
          <div className="flex flex-col gap-2">
            <span className="text-emerald-500 font-black tracking-[0.3em] text-xs uppercase">
              {'//'} IDENTITY_PRIME
            </span>
            <h1 className="text-6xl md:text-9xl lg:text-[12rem] font-black tracking-tighter text-white uppercase leading-[0.8] mb-4">
              {title.split(' ').map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            <div className="border-4 border-white p-6 bg-white text-black font-black uppercase tracking-widest text-xl">
              Archived_Subject_01
            </div>
            <div className="flex flex-col gap-1 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Cpu size={14} /> Neural_Architecture: v0.6.0
              </span>
              <span className="flex items-center gap-2">
                <HardDrive size={14} /> Data_Density: Optimized
              </span>
              <span className="flex items-center gap-2 text-emerald-500">
                <ShieldCheck size={14} /> Verification: Confirmed
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <div className="lg:col-span-8">
            <article
              className="prose prose-invert max-w-none font-mono
                prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-3xl prose-headings:mt-32 prose-headings:mb-12 prose-headings:p-6 prose-headings:bg-white prose-headings:text-black prose-headings:inline-block
                prose-p:font-mono prose-p:leading-relaxed prose-p:text-xl prose-p:mb-8 prose-p:text-gray-300
                prose-strong:font-black prose-strong:text-white
                prose-li:font-mono prose-li:text-lg prose-li:my-4 prose-li:text-gray-400

                prose-table:w-full prose-table:border-collapse prose-table:border-2 prose-table:border-white prose-table:font-mono prose-table:text-xs md:prose-table:text-sm prose-table:my-12
                prose-thead:bg-white prose-thead:text-black
                prose-th:p-4 prose-th:uppercase prose-th:tracking-widest prose-th:font-black prose-th:text-center prose-th:border prose-th:border-white
                prose-td:p-4 prose-td:border prose-td:border-white prose-td:text-center

                prose-blockquote:border-l-8 prose-blockquote:border-white prose-blockquote:bg-white/5 prose-blockquote:p-12 prose-blockquote:not-italic prose-blockquote:font-black prose-blockquote:text-2xl prose-blockquote:uppercase prose-blockquote:tracking-tighter"
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

          <div className="lg:col-span-4 mt-24 lg:mt-0">
            <div className="sticky top-32 space-y-12">
              <div className="border-8 border-white p-8 bg-white text-black relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-black rotate-45" />
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-none">
                  Status_Log
                </h3>
                <div className="space-y-6 font-black uppercase tracking-widest text-xs">
                  <div className="flex justify-between border-b border-black/10 pb-2">
                    <span>Connection</span>
                    <span className="text-emerald-600">Secure</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10 pb-2">
                    <span>Environment</span>
                    <span>Brutalist_V2</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10 pb-2">
                    <span>Integrity</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="p-8 border-4 border-white/10 bg-white/[0.02] backdrop-blur-md">
                <GenerativeArt
                  seed={'Ahmed Samil Bulbul'}
                  className="w-full h-48 opacity-50 grayscale contrast-125 mb-8"
                />
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                  Digital convergence archival entry. This segment contains
                  curated behavioral patterns and experiential metrics of the
                  subject.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-48 pt-12 border-t-8 border-white flex flex-col md:flex-row justify-between items-center gap-8 font-mono text-xs uppercase tracking-widest text-gray-500">
          <div className="font-black bg-white !text-black px-4 py-2">
            <span>TERMINAL_SESSION_END</span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span>LOG_TIMESTAMP: {new Date().toISOString()}</span>
            <span className="text-white font-black tracking-widest">
              FEZCODEX_PRIME_NODE
            </span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Brutalist;
