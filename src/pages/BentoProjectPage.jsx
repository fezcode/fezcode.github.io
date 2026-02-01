import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../utils/projectParser';
import { useProjectContent } from '../hooks/useProjectContent';
import Loading from '../components/Loading';
import Seo from '../components/Seo';
import MarkdownContent from '../components/MarkdownContent';
import {
  GithubLogo as GithubIcon,
  Globe as GlobeIcon,
  ArrowLeft as ArrowLeftIcon,
  CalendarBlank as CalendarIcon,
  Tag as TagIcon,
  CheckCircle as CheckCircleIcon,
  WarningCircle as WarningCircleIcon,
} from '@phosphor-icons/react';

const BentoProjectPage = () => {
  const { slug } = useParams();
  const { projects, loading: projectsLoading } = useProjects();
  const { content } = useProjectContent(slug);

  const project = projects.find((p) => p.slug === slug);
  const [extraSections, setExtraSections] = useState([]);

  useEffect(() => {
    const fetchExtraContent = async () => {
      if (!slug) return;
      const files = [
        'overview',
        'features',
        'installation',
        'usage',
        'technical',
        'see_also',
      ];
      try {
        const promises = files.map((file) =>
          fetch(`/projects/${slug}/${file}.txt`).then((res) =>
            res.ok ? res.text().then((text) => ({ id: file, text })) : null,
          ),
        );
        const results = await Promise.all(promises);
        setExtraSections(results.filter((r) => r !== null));
      } catch (error) {
        console.error('Error fetching extra bento content:', error);
      }
    };
    fetchExtraContent();
  }, [slug]);

  if (projectsLoading || !project) {
    return <Loading />;
  }

  const fullProject = { ...project, ...(content || {}) };

  const mainOverview =
    extraSections.find((s) => s.id === 'overview')?.text ||
    fullProject.fullContent ||
    '';

  const seeAlsoSection = extraSections.find((s) => s.id === 'see_also');

  const bentoMarkdownComponents = {
    pre: ({ children }) => (
      <div className="relative my-8 group w-full">
        {/* Brutalist Shadow Effect */}

        <div className="absolute top-0 left-0 w-full h-full bg-[#e5e5de] translate-x-1.5 translate-y-1.5 rounded-sm -z-10" />

        <pre className="bg-[#1a1a1a] text-[#e5e5de] p-6 rounded-sm overflow-x-auto border-2 border-[#e5e5de]/20 font-mono text-sm shadow-sm leading-relaxed w-full">
          {children}
        </pre>
      </div>
    ),

    code: ({ className, children, ...props }) => {
      const isBlock = /language-(\w+)/.test(className || '');

      if (!isBlock) {
        return (
          <code
            className="bg-[#1a1a1a] text-[#e5e5de] px-1.5 py-0.5 rounded font-mono text-sm font-bold mx-0.5 border border-[#e5e5de]/10"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-instr-sans selection:bg-white selection:text-black">
      <Seo
        title={`${fullProject.title} | Fezcodex`}
        description={fullProject.shortDescription}
        image={fullProject.image}
        keywords={fullProject.technologies}
      />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-0 border border-white/10 overflow-hidden rounded-2xl">
        {/* Top Navigation Bar - Full Width */}
        <div className="col-span-full border-b border-white/10 p-6 flex justify-between items-center bg-[#111]">
          <Link
            to="/projects"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeftIcon
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Archive
          </Link>
          <div className="flex gap-4">
            {fullProject.repo_link && (
              <a
                href={fullProject.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all"
              >
                <GithubIcon size={20} weight="bold" />
              </a>
            )}
            {fullProject.demo_link && (
              <a
                href={fullProject.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all"
              >
                <GlobeIcon size={20} weight="bold" />
              </a>
            )}
          </div>
        </div>

        {/* Hero Section - Center Title */}
        <div className="col-span-full md:col-span-4 lg:col-span-4 h-[400px] md:h-[600px] flex flex-col items-center justify-center p-12 border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden bg-[#0a0a0a]">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
            {fullProject.image && !fullProject.image.includes('defaults') && (
              <img
                src={fullProject.image}
                alt=""
                className="w-full h-full object-cover blur-3xl scale-150"
              />
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center z-10"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-instr-serif italic leading-none mb-4 uppercase">
              {fullProject.title}
            </h1>
            <p className="text-lg md:text-2xl font-instr-sans uppercase tracking-[0.2em] opacity-40 max-w-2xl mx-auto">
              {fullProject.shortDescription}
            </p>
          </motion.div>
        </div>

        {/* Sidebar Info - Right Top */}
        <div className="col-span-full md:col-span-2 lg:col-span-2 grid grid-cols-1 border-b md:border-b-0 border-white/10">
          <div className="p-8 border-b border-white/10 flex flex-col justify-center bg-[#111]">
            <div className="flex items-center gap-3 mb-4 opacity-40">
              <CalendarIcon size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Release Date
              </span>
            </div>
            <div className="text-3xl font-instr-serif italic">
              {fullProject.date}
            </div>
          </div>
          <div className="p-8 border-b border-white/10 flex flex-col justify-center bg-[#0a0a0a]">
            <div className="flex items-center gap-3 mb-4 opacity-40">
              <TagIcon size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Status
              </span>
            </div>
            <div className="flex items-center gap-3">
              {fullProject.isActive ? (
                <CheckCircleIcon size={24} className="text-emerald-500" />
              ) : (
                <WarningCircleIcon size={24} className="text-amber-500" />
              )}
              <span className="text-2xl font-instr-sans font-bold uppercase tracking-tighter">
                {fullProject.isActive ? 'Active' : 'Archived'}
              </span>
            </div>
          </div>
          <div className="p-8 flex flex-col justify-center bg-[#111]">
            <div className="flex items-center gap-3 mb-6 opacity-40">
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Technologies
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {fullProject.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Column - Overview + See Also */}
        <div className="col-span-full md:col-span-4 lg:col-span-4 border-b md:border-b-0 md:border-r border-white/10 bg-[#0a0a0a] flex flex-col">
          {/* Main Content Area - Overview */}
          <div className="p-8 md:p-12 border-b border-white/10 flex-grow">
            <div
              className="prose prose-invert max-w-none
                          prose-headings:font-instr-serif prose-headings:italic prose-headings:font-normal
                          prose-p:font-instr-sans prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-lg
                          prose-a:text-white prose-a:underline prose-a:decoration-white/20 hover:prose-a:decoration-white"
            >
              <MarkdownContent
                content={mainOverview}
                components={bentoMarkdownComponents}
              />
            </div>
          </div>
          {/* See Also Section - Below Overview */}
          {seeAlsoSection && (
            <div className="p-8 bg-[#111] border-t border-white/5">
              <div className="flex flex-col mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 mb-1">
                  {seeAlsoSection.text
                    .split('\n')
                    .find((l) => l.trim().startsWith('SUBTEXT:'))
                    ?.replace('SUBTEXT:', '')
                    .trim() || 'SEE ALSO'}
                </span>
                <h3 className="text-xl font-instr-serif italic text-white/90 uppercase">
                  {seeAlsoSection.text
                    .split('\n')
                    .find((l) => l.trim().startsWith('LABEL:'))
                    ?.replace('LABEL:', '')
                    .trim() || 'RELATED'}
                </h3>
              </div>
              <div
                className="prose prose-invert prose-sm max-w-none
                    prose-ul:flex prose-ul:flex-wrap prose-ul:gap-x-8 prose-ul:gap-y-2 prose-ul:p-0 prose-ul:list-none
                    prose-li:p-0
                    prose-a:text-white/60 hover:prose-a:text-white prose-a:no-underline prose-a:font-instr-sans prose-a:text-[11px] prose-a:uppercase prose-a:tracking-widest prose-a:transition-colors"
              >
                <MarkdownContent
                  content={seeAlsoSection.text
                    .split('\n')
                    .filter(
                      (l) =>
                        !l.trim().startsWith('LABEL:') &&
                        !l.trim().startsWith('SUBTEXT:'),
                    )
                    .join('\n')
                    .trim()}
                />
              </div>
            </div>
          )}
        </div>

        {/* Extra Sections - Right Column */}
        <div className="col-span-full md:col-span-2 lg:col-span-2 grid grid-cols-1">
          {extraSections
            .filter((s) => s.id !== 'overview' && s.id !== 'see_also')
            .map((section, idx) => {
              const lines = section.text.split('\n');
              let label = section.id.replace('_', ' ');
              let subtext = '';
              let contentLines = [];

              lines.forEach((line) => {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('LABEL:')) {
                  label = trimmedLine.replace('LABEL:', '').trim();
                } else if (trimmedLine.startsWith('SUBTEXT:')) {
                  subtext = trimmedLine.replace('SUBTEXT:', '').trim();
                } else {
                  contentLines.push(line);
                }
              });

              const cleanContent = contentLines.join('\n').trim();

              return (
                <div
                  key={section.id}
                  className={`p-8 border-b border-white/10 last:border-b-0 ${idx % 2 === 0 ? 'bg-[#111]' : 'bg-[#0a0a0a]'}`}
                >
                  <div className="flex flex-col mb-6">
                    {subtext && (
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 mb-1">
                        {subtext}
                      </span>
                    )}
                    <h3 className="text-xl font-instr-serif italic text-white/90 uppercase">
                      {label}
                    </h3>
                  </div>
                  <div
                    className="prose prose-invert prose-sm max-w-none
                                      prose-headings:font-instr-serif prose-headings:italic prose-headings:text-lg
                                      prose-p:font-instr-sans prose-p:text-white/60 prose-p:leading-relaxed"
                  >
                    <MarkdownContent
                      content={cleanContent}
                      components={bentoMarkdownComponents}
                    />
                  </div>
                </div>
              );
            })}

          {/* Default call to action if no extra sections fill up the space */}
          {extraSections.length < 2 && (
            <div className="p-8 flex flex-col justify-center bg-[#050505] relative group overflow-hidden">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-4xl font-instr-serif italic mb-6 z-10">
                Interested in this artifact?
              </h3>
              <div className="flex flex-col gap-4 z-10">
                {fullProject.repo_link && (
                  <a
                    href={fullProject.repo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 w-fit hover:border-white transition-all"
                  >
                    Clone Repository →
                  </a>
                )}
                {fullProject.demo_link && (
                  <a
                    href={fullProject.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 w-fit hover:border-white transition-all"
                  >
                    Launch Artifact →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-[1600px] mx-auto mt-8 flex justify-between items-center px-4 opacity-20 text-[10px] font-bold uppercase tracking-[0.5em]">
        <span>Digital Core / {fullProject.slug}</span>
        <span>© {new Date().getFullYear()} Fezcodex</span>
      </div>
    </div>
  );
};

export default BentoProjectPage;
