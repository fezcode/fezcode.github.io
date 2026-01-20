import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useProjects } from '../../utils/projectParser';
import { useProjectContent } from '../../hooks/useProjectContent';
import Seo from '../../components/Seo';
import LuxeArt from '../../components/LuxeArt';
import {
  ArrowLeft,
  ArrowUpRight,
  GithubLogo,
  CalendarBlank,
} from '@phosphor-icons/react';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';

const LuxeProjectDetailPage = () => {
  const { slug } = useParams();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);

  const { projects } = useProjects();
  const { content, loading, error } = useProjectContent(slug);

  const project = projects.find((p) => p.slug === slug);
  const fullProject = project && content ? { ...project, ...content } : null;

  if (loading || !fullProject) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-widest">
        Loading Project...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center font-outfit text-red-500 text-xs uppercase tracking-widest">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] selection:bg-[#C0B298] selection:text-black">
      <Seo
        title={`${fullProject.title} | Fezcodex`}
        description={fullProject.shortDescription}
        image={fullProject.image}
      />

      {/* Hero */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative h-[70vh] w-full flex flex-col justify-end px-6 pb-20 md:px-12"
      >
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
             <LuxeArt seed={fullProject.title} className="w-full h-full mix-blend-multiply filter grayscale contrast-125" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto w-full">
              <Link to="/projects" className="inline-flex items-center gap-2 mb-12 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors">
                  <ArrowLeft /> Back to Works
              </Link>

              <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                  <div className="space-y-6">
                      <div className="flex items-center gap-4 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/50">
                          <span className="flex items-center gap-2"><CalendarBlank size={14} /> {new Date(fullProject.date).getFullYear()}</span>
                          <span>•</span>
                          <span>{fullProject.isActive ? 'Active' : 'Archived'}</span>
                      </div>

                      <h1 className="font-playfairDisplay text-6xl md:text-8xl lg:text-9xl text-[#1A1A1A] leading-[0.85] tracking-tight">
                          {fullProject.title}
                      </h1>
                  </div>

                  <div className="flex gap-4">
                      {fullProject.demo_link && (
                          <a href={fullProject.demo_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 rounded-full font-outfit text-xs uppercase tracking-widest hover:bg-[#8D4004] transition-colors">
                              Live Demo <ArrowUpRight weight="bold" />
                          </a>
                      )}
                      {fullProject.repo_link && (
                          <a href={fullProject.repo_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-[#1A1A1A]/10 px-6 py-3 rounded-full font-outfit text-xs uppercase tracking-widest hover:border-[#1A1A1A] transition-colors">
                              Source <GithubLogo weight="bold" />
                          </a>
                      )}
                  </div>
              </div>
          </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-[1000px] mx-auto px-6 pb-32 relative z-20 bg-[#F5F5F0]">

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-16 pt-12 border-t border-[#1A1A1A]/10">
              {fullProject.technologies?.map(tech => (
                  <span key={tech} className="bg-white border border-[#1A1A1A]/5 px-3 py-1 rounded-sm font-outfit text-xs text-[#1A1A1A]/60 uppercase tracking-wider">
                      {tech}
                  </span>
              ))}
          </div>

          {/* Main Body */}
          <div className="prose prose-stone prose-lg max-w-none
              prose-headings:font-playfairDisplay prose-headings:font-normal prose-headings:text-[#1A1A1A]
              prose-p:font-outfit prose-p:text-[#1A1A1A]/80 prose-p:leading-relaxed
              prose-a:text-[#8D4004] prose-a:no-underline prose-a:border-b prose-a:border-[#8D4004]/30 hover:prose-a:border-[#8D4004] prose-a:transition-colors
              prose-strong:font-medium prose-strong:text-[#1A1A1A]
              prose-li:font-outfit prose-li:text-[#1A1A1A]/80
              prose-blockquote:border-l-[#8D4004] prose-blockquote:bg-[#EBEBEB] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic
              prose-img:rounded-xl prose-img:shadow-xl
          ">
              <MarkdownContent
                content={fullProject.fullContent}
                components={{
                  a: (p) => <MarkdownLink {...p} className="text-[#8D4004] hover:text-black transition-colors" />,
                }}
              />
          </div>

      </div>
    </div>
  );
};

export default LuxeProjectDetailPage;
