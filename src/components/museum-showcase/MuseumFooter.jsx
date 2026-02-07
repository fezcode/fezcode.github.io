import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GithubLogoIcon, GlobeIcon, ArrowRightIcon } from '@phosphor-icons/react';

const MuseumFooter = ({ project }) => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#FDFAF5] pt-80 pb-32 px-8 md:px-24 border-t border-black/5 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] border-l border-b border-black/[0.02] -mr-[10vw] -mt-[10vw] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">

        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[10px] font-black uppercase tracking-[0.8em] text-black/20 mb-20 font-ibm-plex-mono"
        >
          Exit Collection
        </motion.span>

        <div className="flex flex-wrap justify-center gap-16 mb-48">
          {project?.repo_link && (
            <a
              href={project.repo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                <GithubLogoIcon size={20} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] font-ibm-plex-mono text-black/30 group-hover:text-black transition-colors">Source Code</span>
            </a>
          )}
          {project?.demo_link && (
            <a
              href={project.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                <GlobeIcon size={20} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] font-ibm-plex-mono text-black/30 group-hover:text-black transition-colors">Live Preview</span>
            </a>
          )}
        </div>

        <motion.button
          onClick={() => navigate('/projects')}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-12 group"
        >
          <div className="flex items-center gap-12">
            <h2 className="text-[10vw] font-medium font-instr-serif italic leading-none tracking-tighter text-[#1a1a1a]">
              Return
            </h2>
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-black/10 flex items-center justify-center group-hover:scale-90 group-hover:bg-black group-hover:text-white transition-all duration-700 ease-[0.16,1,0.3,1]">
              <ArrowRightIcon size={48} weight="light" className="group-hover:translate-x-2 transition-transform duration-700" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-black/20 font-ibm-plex-mono group-hover:text-black/40 transition-colors">
            Back to Archive Index
          </p>
        </motion.button>

      </div>

      <div className="mt-80 pt-16 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 text-[9px] font-bold uppercase tracking-[0.5em] font-ibm-plex-mono">
        <div className="flex gap-8">
          <span>IDENTITY</span>
          <span>SYSTEMS</span>
          <span>EXPERIENCE</span>
        </div>
        <div>FEZCODEX MUSEUM &copy; {new Date().getFullYear()} &mdash; ARCHIVAL RECORD No. {project?.slug?.toUpperCase()}</div>
      </div>
    </footer>
  );
};

export default MuseumFooter;
