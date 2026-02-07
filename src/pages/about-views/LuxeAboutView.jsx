import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import piml from 'piml';
import {
  ArrowUpRight,
  Globe,
  Feather,
  Sparkle,
  Compass,
} from '@phosphor-icons/react';
import LuxeArt from '../../components/LuxeArt';

const LuxeLinkRenderer = ({ href, children }) => {
  const isExternal = href.startsWith('http') || href.startsWith('https');
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 font-outfit text-[#8D4004] hover:text-black transition-colors border-b border-[#8D4004]/20 hover:border-black"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
      {isExternal && <ArrowUpRight size={12} />}
    </a>
  );
};

const LuxeAboutView = () => {
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

        setTitle(attributes.title || 'Ahmed Samil Bulbul');
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
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-widest">
        Opening The Archive...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20 overflow-x-hidden">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0">
        <LuxeArt
          seed="Ahmed Samil Bulbul"
          className="w-full h-full mix-blend-multiply"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Decorative Header */}
        <header className="mb-32 pt-12 border-b border-black/10 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 border border-black/10 rounded-full bg-white/40 mb-8"
          >
            <Globe size={16} className="text-[#8D4004] animate-spin-slow" />
            <span className="font-outfit text-[10px] uppercase tracking-[0.3em] text-black/60">
              Subject Identification: Core
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="font-playfairDisplay text-7xl md:text-9xl lg:text-[10rem] text-[#1A1A1A] leading-[0.8] mb-12 tracking-tighter"
          >
            {title.split(' ').map((word, i) => (
              <span
                key={i}
                className={i % 2 === 1 ? 'italic text-black/40 block' : 'block'}
              >
                {word}
              </span>
            ))}
          </motion.h1>

          <div className="flex justify-center gap-12 text-[10px] font-outfit uppercase tracking-[0.4em] text-black/30">
            <span className="flex items-center gap-2">
              <Feather size={14} /> Engineer
            </span>
            <span className="flex items-center gap-2">
              <Sparkle size={14} /> Creator
            </span>
            <span className="flex items-center gap-2">
              <Compass size={14} /> Explorer
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32">
          {/* Content Column */}
          <div className="lg:col-span-7">
            <article
              className="prose prose-stone prose-lg max-w-none
                    prose-headings:font-playfairDisplay prose-headings:font-normal prose-headings:text-[#1A1A1A]
                    prose-p:font-outfit prose-p:text-[#1A1A1A]/80 prose-p:leading-relaxed prose-p:mb-10
                    prose-strong:font-medium prose-strong:text-[#1A1A1A]
                    prose-blockquote:border-l-[#8D4004] prose-blockquote:bg-white/40 prose-blockquote:backdrop-blur-sm prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:not-italic prose-blockquote:font-playfairDisplay prose-blockquote:text-2xl prose-blockquote:italic
                    prose-li:font-outfit prose-li:text-[#1A1A1A]/80
                "
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{ a: LuxeLinkRenderer }}
              >
                {content}
              </ReactMarkdown>
            </article>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-5">
            <aside className="sticky top-32 space-y-16">
              {/* Portrait Card */}
              <div className="relative aspect-[4/5] bg-white rounded-sm overflow-hidden border border-black/5 shadow-2xl p-4 group">
                <div className="absolute inset-0 bg-[#EBEBEB] opacity-50 group-hover:opacity-30 transition-opacity duration-1000" />
                <LuxeArt
                  seed="Portrait"
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="font-outfit text-[9px] uppercase tracking-[0.5em] text-black/40 mb-2 block">
                    Archive Specimen
                  </span>
                  <h3 className="font-playfairDisplay text-3xl italic text-black">
                    A. S. Bulbul
                  </h3>
                </div>
              </div>

              {/* Status Info */}
              <div className="space-y-8 p-10 border border-black/5 bg-white/40 backdrop-blur-md rounded-sm">
                <h4 className="font-outfit text-[10px] uppercase tracking-[0.3em] text-black/30 border-b border-black/5 pb-4 mb-8">
                  System Metrics
                </h4>

                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="font-outfit text-xs text-black/40 uppercase tracking-widest">
                      Protocol
                    </span>
                    <span className="font-playfairDisplay text-xl italic">
                      Luxe_Interface_v1
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-outfit text-xs text-black/40 uppercase tracking-widest">
                      Integrity
                    </span>
                    <span className="font-playfairDisplay text-xl italic text-emerald-700">
                      Verified
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-outfit text-xs text-black/40 uppercase tracking-widest">
                      Origin
                    </span>
                    <span className="font-playfairDisplay text-xl italic">
                      Digital_Expanse
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer-ish quote */}
              <div className="pt-8 border-t border-black/5">
                <p className="font-outfit text-[10px] uppercase tracking-[0.2em] leading-relaxed text-black/30 text-center italic">
                  "Every line of code is a brushstroke on the canvas of
                  reality."
                </p>
              </div>
            </aside>
          </div>
        </div>

        <footer className="mt-48 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-8 font-outfit text-[10px] uppercase tracking-[0.3em] text-black/30">
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Synchronized with Mainframe</span>
          </div>
          <div className="text-right flex flex-col gap-2">
            <span>
              Access Timestamp:{' '}
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="text-black font-medium tracking-[0.5em]">
              FEZCODEX_PRIME
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LuxeAboutView;
