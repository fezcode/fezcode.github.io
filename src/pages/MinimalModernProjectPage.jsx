import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  GithubLogoIcon,
  GlobeIcon,
  SunIcon,
  MoonIcon,
} from '@phosphor-icons/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '../utils/projectParser';
import Loading from '../components/Loading';
import ReactMarkdown from 'react-markdown';
import Seo from '../components/Seo';

const MinimalModernProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { projects, loading: projectsLoading } = useProjects();
  const [project, setProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [isBlackMode, setIsBlackMode] = useState(false);

  useEffect(() => {
    if (projects.length > 0) {
      const found = projects.find((p) => p.slug === slug);
      if (found) {
        setProject(found);
      }
    }
  }, [projects, slug]);

  useEffect(() => {
    const fetchSections = async () => {
      if (!slug) return;
      setLoadingContent(true);

      const sectionFiles = ['overview', 'features', 'technical', 'access'];
      try {
        const promises = sectionFiles.map((file) =>
          fetch(`/projects/${slug}/${file}.txt`).then((res) =>
            res.ok ? res.text().then((text) => ({ id: file, text })) : null,
          ),
        );

        const results = await Promise.all(promises);
        const validSections = results
          .filter((res) => res !== null)
          .map((res) => {
            const lines = res.text.split('\n');
            let label = res.id.charAt(0).toUpperCase() + res.id.slice(1);
            let subtext = 'Details';
            let image = project?.image || '';
            let contentLines = [];

            lines.forEach((line) => {
              if (line.startsWith('LABEL:')) {
                label = line.replace('LABEL:', '').trim();
              } else if (line.startsWith('SUBTEXT:')) {
                subtext = line.replace('SUBTEXT:', '').trim();
              } else if (line.startsWith('IMAGE:')) {
                image = line.replace('IMAGE:', '').trim();
              } else {
                contentLines.push(line);
              }
            });

            return {
              id: res.id,
              label,
              subtext,
              image,
              content: contentLines.join('\n').trim(),
            };
          });

        setSections(validSections);
        if (validSections.length > 0) {
          setActiveSectionId(validSections[0].id);
        }
      } catch (error) {
        console.error('Error fetching project sections:', error);
      } finally {
        setLoadingContent(false);
      }
    };

    if (slug) {
      fetchSections();
    }
  }, [slug, project]);

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeSectionId) || sections[0],
    [sections, activeSectionId],
  );

  if (projectsLoading || loadingContent || !project) {
    return <Loading />;
  }

  const themeClasses = {
    bg: isBlackMode ? 'bg-[#050505]' : 'bg-[#f3f1e9]',
    text: isBlackMode ? 'text-white' : 'text-black',
    textMuted: isBlackMode ? 'text-zinc-500' : 'text-zinc-400',
    border: isBlackMode ? 'border-white' : 'border-black',
    borderMuted: isBlackMode ? 'border-zinc-800' : 'border-zinc-200',
    shadow: isBlackMode
      ? 'shadow-[30px_30px_0px_0px_rgba(255,255,255,1)]'
      : 'shadow-[30px_30px_0px_0px_rgba(0,0,0,1)]',
    prose: isBlackMode ? 'prose-invert' : 'prose-zinc',
    activeTab: isBlackMode ? 'text-white' : 'text-black',
    inactiveTab: isBlackMode ? 'text-zinc-800' : 'text-zinc-300',
    subtextActive: isBlackMode ? 'text-zinc-400' : 'text-zinc-500',
    subtextInactive: isBlackMode ? 'text-zinc-800' : 'text-zinc-300',
  };

  return (
    <div
      className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} p-8 md:p-16 flex flex-col font-instr-sans overflow-hidden transition-colors duration-500`}
    >
      <Seo
        title={`${project.title} | Fezcodex`}
        description={project.shortDescription}
        image={project.image}
        keywords={project.technologies}
      />
      <div className="flex justify-between items-center mb-16 z-10">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/projects')}
            className={`flex items-center gap-2 ${isBlackMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'} transition-colors group w-fit`}
          >
            <ArrowLeftIcon
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-bold uppercase tracking-widest">
              Back to Projects
            </span>
          </button>

          <button
            onClick={() => setIsBlackMode(!isBlackMode)}
            className={`p-2 rounded-full border-2 ${themeClasses.border} hover:bg-zinc-500/10 transition-all`}
            title={isBlackMode ? 'Switch to Light' : 'Switch to Black'}
          >
            {isBlackMode ? (
              <SunIcon size={20} weight="bold" />
            ) : (
              <MoonIcon size={20} weight="bold" />
            )}
          </button>
        </div>

        <div className="flex gap-12 items-center">
          <div className="hidden md:flex gap-6 items-center border-r-2 border-zinc-200 pr-12 mr-4">
            {project.repo_link && (
              <a
                href={project.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${isBlackMode ? 'hover:text-zinc-400' : 'hover:opacity-50'} transition-opacity`}
                title="Github Repository"
              >
                <GithubLogoIcon size={20} weight="bold" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Source
                </span>
              </a>
            )}
            {project.demo_link && (
              <a
                href={project.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${isBlackMode ? 'hover:text-zinc-400' : 'hover:opacity-50'} transition-opacity`}
                title="Live Demo"
              >
                <GlobeIcon size={20} weight="bold" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Live
                </span>
              </a>
            )}
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span
              className={`text-[10px] ${themeClasses.textMuted} font-bold uppercase tracking-[0.2em]`}
            >
              Project Phase
            </span>
            <span className="text-sm font-black uppercase tracking-widest">
              {activeSection?.id?.toUpperCase()}
            </span>
          </div>
          <div
            className={`w-12 h-12 border-2 ${themeClasses.border} flex items-center justify-center font-black`}
          >
            {activeSectionId
              ? sections.findIndex((s) => s.id === activeSectionId) + 1
              : '0'}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 flex-grow">
        <div className="lg:w-2/5 flex flex-col space-y-12">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              onClick={() =>
                setActiveSectionId(
                  activeSectionId === section.id ? null : section.id,
                )
              }
              className="group cursor-pointer relative"
            >
              <div className="flex items-center gap-6">
                <span
                  className={`text-sm font-black transition-colors ${activeSectionId === section.id ? themeClasses.activeTab : themeClasses.inactiveTab}`}
                >
                  0{idx + 1}
                </span>
                <div className="flex flex-col">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors ${activeSectionId === section.id ? themeClasses.subtextActive : themeClasses.subtextInactive}`}
                  >
                    {section.subtext}
                  </span>
                  <h2
                    className={`text-4xl md:text-6xl font-black uppercase transition-all duration-300 ${
                      activeSectionId === section.id
                        ? themeClasses.activeTab + ' translate-x-2'
                        : themeClasses.inactiveTab +
                          ' group-hover:text-zinc-500'
                    }`}
                  >
                    {section.label}
                  </h2>
                </div>
              </div>

              <AnimatePresence>
                {activeSectionId === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden pl-12"
                  >
                    <div
                      className={`max-w-lg prose prose-sm ${themeClasses.prose} border-l-4 ${themeClasses.border} pl-6`}
                    >
                      <ReactMarkdown
                        components={{
                          img: () => null, // Skip images in text view as they are handled by the hero
                          h1: () => null,
                          h2: () => null,
                          a: ({ node, children, ...props }) => (
                            <a
                              {...props}
                              className={`${isBlackMode ? 'text-white' : 'text-black'} font-black underline`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {section.content}
                      </ReactMarkdown>

                      {section.id === 'access' && (
                        <div className="mt-10 flex flex-col gap-4">
                          {project.repo_link && (
                            <a
                              href={project.repo_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`no-underline inline-flex items-center justify-center gap-3 ${isBlackMode ? 'bg-white text-black' : 'bg-black text-white'} px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-80 transition-colors w-full sm:w-fit`}
                            >
                              <GithubLogoIcon size={20} weight="bold" />
                              Download Source
                            </a>
                          )}
                          {project.demo_link && (
                            <a
                              href={project.demo_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center justify-center gap-3 border-[3px] ${themeClasses.border} ${themeClasses.text} px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] ${isBlackMode ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'} transition-all w-full sm:w-fit`}
                            >
                              <GlobeIcon size={20} weight="bold" />
                              Launch Application
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="lg:w-3/5 relative">
          <div
            className={`w-full aspect-[4/5] lg:h-[70vh] relative overflow-hidden border-[8px] ${themeClasses.border} ${themeClasses.shadow} bg-zinc-200 transition-all duration-500`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${project.slug}-${activeSectionId}`}
                initial={{ opacity: 0, scale: 1.1, filter: 'grayscale(100%)' }}
                animate={{ opacity: 1, scale: 1, filter: 'grayscale(0%)' }}
                exit={{ opacity: 0, scale: 0.9, filter: 'grayscale(100%)' }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={activeSection?.image || project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      '/images/defaults/esma-melike-sezer-YpUj3dD0YzU-unsplash.jpg';
                  }}
                />

                {activeSectionId === 'technical' && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] mix-blend-overlay" />
                )}
                {activeSectionId === 'access' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-black uppercase tracking-[1em] -rotate-90">
                      Deployment
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="absolute top-8 left-8 mix-blend-difference text-white">
              <div className="text-xs font-black uppercase tracking-[0.4em] mb-2">
                Artifact No.
              </div>
              <div className="text-4xl font-black">
                {project.slug.toUpperCase()}
              </div>
            </div>

            <div className="absolute bottom-8 right-8 mix-blend-difference text-white text-right">
              <div className="text-[60px] font-black leading-none opacity-50">
                {idxToLetter(
                  sections.findIndex((s) => s.id === activeSectionId),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-12 flex justify-between items-end border-t-2 ${themeClasses.border} pt-8`}
      >
        <div
          className={`text-[10px] font-black uppercase tracking-[0.5em] ${themeClasses.textMuted}`}
        >
          Digital Archive / {project.title} / {new Date().getFullYear()}
        </div>
        <div className="flex gap-2">
          {sections.map((s, i) => (
            <div
              key={s.id}
              className={`w-8 h-2 ${s.id === activeSectionId ? (isBlackMode ? 'bg-white' : 'bg-black') : isBlackMode ? 'bg-zinc-900' : 'bg-zinc-200'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const idxToLetter = (idx) => {
  return String.fromCharCode(65 + idx);
};

export default MinimalModernProjectPage;
