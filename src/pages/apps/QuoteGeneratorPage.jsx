import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import QuoteGeneratorApp from '../../app/QuoteGenerator/QuoteGeneratorApp';
import CloudMusicPlayer from '../../app/apps/CloudMusicPlayer/CloudMusicPlayer';

const QuoteGeneratorPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-red-900/50 selection:text-white pb-24">
      <Seo
        title="Quote Generator | Fezcodex"
        description="Create beautiful quote images with customizable themes, fonts, and colors."
        keywords={[
          'quote',
          'generator',
          'image',
          'maker',
          'typography',
          'design',
        ]}
      />

      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header */}
        <header className="mb-12">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="space-y-4">
            <BreadcrumbTitle
              title="Quote Generator"
              slug="quote-gen"
              variant="brutalist"
            />
            <p className="text-xl text-gray-400 max-w-2xl font-serif italic">
              "Words are, in my not-so-humble opinion, our most inexhaustible
              source of magic."
            </p>
            <p className="text-xs text-gray-600 max-w-2xl font-mono uppercase tracking-widest mt-4">
              Now featuring Art, Music, Science, Rome, Drama, Comedy, Life, Birds, Kings, Queens, and French Girls.
            </p>
          </div>
        </header>

        <QuoteGeneratorApp />

        <div className="mt-24 pt-12 border-t border-white/5">
          <h2 className="text-xl font-bold font-serif mb-8 flex items-center gap-4">
             <span className="bg-red-500 w-2 h-2 rounded-full"></span>
             Atmospheric Soundtrack
          </h2>
          <CloudMusicPlayer />
        </div>
      </div>
    </div>
  );
};

export default QuoteGeneratorPage;
