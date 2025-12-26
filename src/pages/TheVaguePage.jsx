import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, FilePdfIcon, SpinnerIcon, FileTextIcon } from '@phosphor-icons/react';
import useSeo from '../hooks/useSeo';
import BreadcrumbTitle from '../components/BreadcrumbTitle';
import piml from 'piml';

const TheVaguePage = () => {
  useSeo({
    title: 'The Vague | Fezcodex',
    description: 'Issues of The Vague. A collection of thoughts and whispers.',
    keywords: ['Fezcodex', 'The Vague', 'PDF', 'zine', 'editorial'],
  });

  const [issues, setIssues] = useState([]);
  const [activeIssue, setActiveIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('/the_vague/issues.piml');
        if (!response.ok) {
          throw new Error('Failed to load issues manifest');
        }
        const text = await response.text();
        const parsed = piml.parse(text);
        const data = parsed.issues || [];
        setIssues(data);
        if (data.length > 0) {
          setActiveIssue(data[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <SpinnerIcon className="animate-spin text-emerald-500" size={32} />
          <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
            LOADING_THE_VAGUE...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505] text-red-500 font-mono">
        ERR: {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-emerald-500/30 font-sans">
       {/* Background Noise/Texture */}
       <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none z-0 mix-blend-overlay"></div>

      {/* LEFT PANEL: The Index */}
      <div className="w-full md:w-1/3 lg:w-1/4 z-10 flex flex-col min-h-screen py-24 px-6 md:pl-10 border-r border-white/10 bg-[#050505]">
        <header className="mb-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Back_to_Root</span>
          </Link>
          <BreadcrumbTitle
            title="The Vague"
            breadcrumbs={['fc', 'archive', 'the_vague']}
            variant="brutalist"
          />
          <p className="text-gray-400 font-mono text-[10px] max-w-sm uppercase tracking-widest mt-4">
            {'//'} ARCHIVE_OF_ISSUES
          </p>
        </header>

        <div className="flex flex-col gap-px border border-white/10 bg-white/5">
          {issues.map((issue) => (
            <button
              key={issue.id}
              onClick={() => setActiveIssue(issue)}
              className={`group flex flex-col gap-2 p-4 text-left transition-all duration-300 ${
                activeIssue?.id === issue.id
                  ? 'bg-emerald-500/10'
                  : 'bg-[#050505] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`font-mono text-[10px] uppercase tracking-wider ${activeIssue?.id === issue.id ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                   {issue.date}
                </span>
                <FilePdfIcon
                    size={16}
                    weight={activeIssue?.id === issue.id ? "fill" : "regular"}
                    className={activeIssue?.id === issue.id ? 'text-emerald-400' : 'text-gray-600 group-hover:text-gray-400'}
                />
              </div>
              <h3 className={`font-bold font-mono text-sm uppercase leading-tight ${activeIssue?.id === issue.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                {issue.title}
              </h3>
              <p className="text-[10px] text-gray-600 line-clamp-2 font-mono uppercase tracking-wide">
                {issue.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: PDF Viewer */}
      <div className="flex-1 relative bg-[#0a0a0a] overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeIssue ? (
            <motion.div
              key={activeIssue.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex flex-col"
            >
                {/* Toolbar / Header for PDF view */}
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#050505]">
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest truncate max-w-md flex items-center gap-2">
                        <FileTextIcon weight="fill" className="text-emerald-500" />
                        READING_BUFFER: <span className="text-white">{activeIssue.title}</span>
                    </span>
                    <a
                        href={`/the_vague/${activeIssue.filename}`}
                        download
                        className="text-[10px] font-mono text-emerald-500 hover:text-black uppercase tracking-widest border border-emerald-500/30 px-4 py-2 hover:bg-emerald-500 transition-all"
                    >
                        DOWNLOAD_ARTIFACT
                    </a>
                </div>

              {/* PDF Embed */}
              <div className="flex-1 w-full bg-[#1a1a1a] relative">
                 <iframe
                    src={`/the_vague/${activeIssue.filename}#view=FitH`}
                    title={activeIssue.title}
                    className="w-full h-full border-none"
                 />
              </div>
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-700">
              <span className="font-mono text-sm uppercase tracking-widest">AWAITING_SELECTION...</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TheVaguePage;
