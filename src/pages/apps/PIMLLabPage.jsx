import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import piml from 'piml';
import {
  ArrowLeftIcon,
  CodeIcon,
  EyeIcon,
  CopySimpleIcon,
  XCircleIcon,
  PlayIcon,
  FileTextIcon,
  CubeIcon,
  ArticleIcon,
  KanbanIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import ProjectCard from '../../components/ProjectCard';
import LogCard from '../../components/LogCard';
import PostTile from '../../components/PostTile';
import RoadmapCard from '../../components/roadmap/RoadmapCard';

const TEMPLATES = {
  project: `(project)
  (id) fez-99
  (slug) my-cool-project
  (title) Quantum Neural Interface
  (description) A next-generation interface for neural data processing.
  (status) Active
  (technologies) React, WebGL, Rust`,
  log: `(log)
  (id) log-42
  (slug) the-great-read
  (title) The Design of Everyday Things
  (category) Book
  (by) Don Norman
  (date) 2025-12-21
  (rating) 5
  (platform) Physical`,
  post: `(post)
  (slug) live-from-piml-lab
  (title) Live Data Stream Protocol
  (date) 2025-12-21
  (description) Testing the new PIML rendering engine in real-time.
  (category) dev
  (tags) PIML, React, Experimental`,
  roadmap: `(issue)
  (id) FEZ-999
  (title) Full System Integration
  (description) Completing the neural bridge between PIML and React.
  (status) Planned
  (priority) High
  (created_at) 2025-12-21T18:00:00Z`,
};

const PIMLLabPage = () => {
  const appName = 'PIML Lab';
  const { addToast } = useToast();
  const [input, setInput] = useState(TEMPLATES.project);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const result = piml.parse(input);
      setParsedData(result);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [input]);

  const loadTemplate = (type) => {
    setInput(TEMPLATES[type]);
    addToast({
      title: 'Template Loaded',
      message: `Applied ${type.toUpperCase()} schema.`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input).then(() => {
      addToast({
        title: 'Copied',
        message: 'PIML sequence stored in memory bank.',
      });
    });
  };

  const renderPreview = () => {
    if (!parsedData) return null;

    // Handle different PIML structures based on templates
    if (parsedData.project) {
      return (
        <div className="max-w-2xl mx-auto py-12">
          <ProjectCard project={parsedData.project} index={0} isActive={true} />
        </div>
      );
    }

    if (parsedData.log) {
      return (
        <div className="max-w-sm mx-auto py-12">
          <LogCard log={parsedData.log} index={0} totalLogs={1} />
        </div>
      );
    }

    if (parsedData.post) {
      return (
        <div className="max-w-md mx-auto py-12">
          <PostTile post={parsedData.post} />
        </div>
      );
    }

    if (parsedData.issue) {
      return (
        <div className="max-w-md mx-auto py-12">
          <RoadmapCard app={parsedData.issue} />
        </div>
      );
    }

    return (
      <div className="p-8 border border-white/5 bg-white/[0.01] rounded-sm h-full flex flex-col">
        <span className="text-[10px] font-mono text-gray-600 uppercase mb-4 tracking-widest">
          Raw_JSON_Output
        </span>
        <pre className="text-emerald-500 font-mono text-xs overflow-auto h-full scrollbar-hide">
          {JSON.stringify(parsedData, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans flex flex-col">
      <Seo
        title="PIML Lab | Fezcodex"
        description="Real-time PIML playground. Write custom markup and see it rendered as Fezcodex components."
        keywords={[
          'PIML',
          'playground',
          'editor',
          'markup',
          'react',
          'fezcodex',
        ]}
      />
      <div className="mx-auto max-w-7xl w-full px-6 py-12 md:px-12 flex-grow flex flex-col">
        <header className="mb-12">
          <Link
            to="/apps"
            className="group mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon
              weight="bold"
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none uppercase flex items-center gap-4 flex-wrap">
                {appName}{' '}
                <span className="text-[10px] border border-emerald-500/50 text-emerald-500 px-2 py-1 rounded-sm shrink-0 whitespace-nowrap tracking-normal">
                  Experimental
                </span>
              </h1>
              <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-4">
                Real-time technical markup visualization protocol.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => loadTemplate('project')}
                className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:bg-white hover:text-black text-[10px] font-bold uppercase transition-all"
              >
                <CubeIcon /> Project
              </button>
              <button
                onClick={() => loadTemplate('log')}
                className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:bg-white hover:text-black text-[10px] font-bold uppercase transition-all"
              >
                <FileTextIcon /> Log
              </button>
              <button
                onClick={() => loadTemplate('post')}
                className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:bg-white hover:text-black text-[10px] font-bold uppercase transition-all"
              >
                <ArticleIcon /> Post
              </button>
              <button
                onClick={() => loadTemplate('roadmap')}
                className="flex items-center gap-2 px-3 py-2 border border-white/10 hover:bg-white hover:text-black text-[10px] font-bold uppercase transition-all"
              >
                <KanbanIcon /> Issue
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 border border-white/10 flex-grow">
          {/* Editor Panel */}
          <div className="bg-[#050505] p-6 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <CodeIcon weight="fill" className="text-emerald-500" />
                Input_PIML_Sequence
              </h3>
              <button
                onClick={copyToClipboard}
                className="text-gray-600 hover:text-white transition-colors"
              >
                <CopySimpleIcon size={18} />
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow w-full bg-black/40 border border-white/5 p-6 font-mono text-sm text-gray-300 focus:border-emerald-500/50 focus:outline-none transition-all resize-none scrollbar-hide"
              spellCheck="false"
            />
          </div>

          {/* Preview Panel */}
          <div className="bg-[#050505] p-6 flex flex-col h-full relative group">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none grayscale group-hover:opacity-[0.04] transition-opacity">
              <GenerativeArt seed="PIML_LAB_VISUAL" className="w-full h-full" />
            </div>

            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <EyeIcon weight="fill" className="text-emerald-500" />
                Live_Render_Buffer
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`}
                />
                <span className="text-[9px] font-mono text-gray-600 uppercase">
                  {error ? 'Sync_Error' : 'Realtime_Sync_Active'}
                </span>
              </div>
            </div>

            <div className="flex-grow relative z-10 border border-dashed border-white/5 p-4 overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 border border-red-500/20 bg-red-500/5 rounded-sm"
                  >
                    <div className="flex items-center gap-3 text-red-500 mb-2">
                      <XCircleIcon size={20} weight="bold" />
                      <span className="text-xs font-black uppercase tracking-widest">
                        Parsing_Failure
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-red-400/80 leading-relaxed break-words uppercase">
                      {error}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={JSON.stringify(parsedData)}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full"
                  >
                    {renderPreview()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center text-gray-600 font-mono text-[9px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-4">
            <PlayIcon weight="fill" className="text-emerald-500" />
            <span>PIML_Visualization_Engine_Enabled</span>
          </div>
          <span>Buffer_Status: Stable</span>
        </footer>
      </div>
    </div>
  );
};

export default PIMLLabPage;
