import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import piml from 'piml';
import { ArrowSquareOut, SealCheck } from '@phosphor-icons/react';
import GrainOverlay from '../../components/GrainOverlay';
import CoffeeStain from '../../components/CoffeeStain';
import CensoredPolaroid from '../../components/CensoredPolaroid';

const LinkRenderer = ({ href, children }) => {
  const isExternal = href.startsWith('http') || href.startsWith('https');
  return (
    <a
      href={href}
      className="inline-block px-1 bg-black/5 hover:bg-black hover:text-white transition-all font-mono text-sm mx-0.5 rounded-sm"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}{' '}
      {isExternal && <ArrowSquareOut className="text-xs inline mb-1" />}
    </a>
  );
};

const ClassifiedDossier = () => {
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
      <div className="h-full bg-[#f3f3f3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin rounded-full" />
          <span className="font-mono text-xs uppercase tracking-widest">
            Retrieving Archive...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#111] selection:bg-black selection:text-white custom-scrollbar font-sans relative">
      <GrainOverlay />
      <CoffeeStain />

      {/* Top Secret Stamp / Decor */}
      <div className="fixed top-0 right-0 p-8 opacity-10 pointer-events-none z-0">
        <div className="border-4 border-black p-4 rounded-sm transform rotate-12">
          <span className="text-6xl font-black uppercase tracking-widest font-mono">
            CONFIDENTIAL
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'circOut' }}
        className="max-w-4xl mx-auto px-6 py-24 md:py-32 relative z-10"
      >
        <CensoredPolaroid imageUrl="/images/herdaim.jpg" censored={true} />
        <header className="mb-20">
          <div className="flex flex-col items-start gap-4 mb-8">
            <span className="bg-black text-white px-3 py-1 font-mono text-xs tracking-[0.3em] uppercase">
              Fezcodex Archive // File #8942
            </span>
            <div className="w-24 h-1 bg-black"></div>
          </div>

          <h1 className="text-6xl md:text-8xl font-playfairDisplay font-medium tracking-tight text-black mb-6">
            {title}
          </h1>

          <p className="font-mono text-sm text-gray-500 uppercase tracking-wide max-w-lg">
            Subject is a Senior Software Engineer specializing in distributed
            systems. Clearance Level: Maximum.
          </p>
        </header>

        <article
          className="prose prose-lg md:prose-xl max-w-none font-mono
          prose-headings:font-playfairDisplay prose-headings:font-normal prose-headings:text-black prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-sm prose-headings:mt-16 prose-headings:mb-6 prose-headings:border-b prose-headings:border-black prose-headings:pb-2
          prose-p:font-mono prose-p:text-[#333] prose-p:leading-8 prose-p:mb-6
          prose-strong:font-bold prose-strong:text-white prose-strong:bg-black prose-strong:px-1
          prose-li:marker:text-black prose-li:font-mono

          /* Table Styling - Clean & Redacted Vibe */
          prose-table:w-full prose-table:border-collapse prose-table:font-mono prose-table:text-sm prose-table:my-8
          prose-thead:bg-black prose-thead:text-white
          prose-th:p-4 prose-th:uppercase prose-th:tracking-wider prose-th:font-normal prose-th:text-left prose-th:text-white
          prose-td:p-4 prose-td:border-b prose-td:border-gray-300 prose-td:text-gray-700

          prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-white prose-blockquote:p-6 prose-blockquote:shadow-sm"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{ a: LinkRenderer }}
          >
            {content}
          </ReactMarkdown>
        </article>

        <footer className="mt-32 pt-12 border-t border-black flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-xs uppercase tracking-widest text-gray-500">
          <div className="flex items-center gap-2">
            <SealCheck size={24} className="text-black" weight="fill" />
            <span>Verified Record</span>
          </div>
          <div>
            <span>Generated: {new Date().toLocaleDateString()}</span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default ClassifiedDossier;
