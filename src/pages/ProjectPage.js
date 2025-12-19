import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';
import { useProjects } from '../utils/projectParser';
import { useProjectContent } from '../hooks/useProjectContent';
import Seo from '../components/Seo';
import GenerativeArt from '../components/GenerativeArt';
import { ArrowLeft, ArrowUpRight, GithubLogo } from '@phosphor-icons/react';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const ProjectPage = () => {
  const { slug } = useParams();
  const {
    projects,
    loading: loadingProjects,
    error: errorProjects,
  } = useProjects();
  const {
    content,
    loading: loadingContent,
    error: errorContent,
  } = useProjectContent(slug);

  if (loadingProjects || loadingContent) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono uppercase tracking-widest text-xs">
        <span className="animate-pulse">Loading project data...</span>
      </div>
    );
  }

  if (errorProjects || errorContent) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 font-mono uppercase">
        Error: {errorProjects?.message || errorContent?.message}
      </div>
    );
  }

  const project = projects.find((p) => p.slug === slug);

  if (!project || !content) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-500 font-mono uppercase">
        Project not found.
      </div>
    );
  }

  const fullProject = { ...project, ...content };
  const year = new Date(fullProject.date).getFullYear();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <Seo
        title={`${fullProject.title} | Fezcodex`}
        description={fullProject.shortDescription}
        keywords={fullProject.tags ? fullProject.tags.join(', ') : ''}
        ogTitle={`${fullProject.title} | Fezcodex`}
        ogDescription={fullProject.shortDescription}
        ogImage={fullProject.image || '/images/ogtitle.png'}
        twitterCard="summary_large_image"
        twitterTitle={`${fullProject.title} | Fezcodex`}
        twitterDescription={fullProject.shortDescription}
        twitterImage={fullProject.image || '/images/ogtitle.png'}
      />

      {/* Noise Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Hero Image */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <GenerativeArt
          seed={fullProject.title}
          className="w-full h-full opacity-60 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-4"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              <ArrowLeft weight="bold" />
              <span>Back</span>
            </Link>
            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest border border-white/10 px-2 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
              ID: {slug.split('-')[0]}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none max-w-5xl"
          >
            {fullProject.title}
          </motion.h1>
          <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest text-gray-400">
            <span className="border border-white/20 px-3 py-1 rounded-full text-white">
              {year}
            </span>
            {fullProject.technologies?.slice(0, 3).map((tech) => (
              <span key={tech} className="px-2 py-1">
                #{tech}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:grid lg:grid-cols-12 lg:gap-24">
        {/* Left Column: Content */}
        <div className="lg:col-span-8">
          <div className="mb-16">
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed font-sans">
              {fullProject.shortDescription}
            </p>
          </div>

          <div
            className="prose prose-invert prose-lg max-w-none
                prose-headings:font-sans prose-headings:uppercase prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-white
                prose-p:text-gray-400 prose-p:font-sans prose-p:leading-relaxed
                prose-a:text-white prose-a:underline prose-a:decoration-white/30 prose-a:underline-offset-4 hover:prose-a:decoration-white
                prose-code:text-emerald-300 prose-code:font-mono prose-code:bg-white/5 prose-code:px-1 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10
                prose-ul:marker:text-gray-500
                prose-img:rounded-sm prose-img:border prose-img:border-white/10"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {fullProject.fullContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* Right Column: Sticky Tech Specs */}
        <div className="mt-16 lg:col-span-4 lg:mt-0">
          <div className="sticky top-24 space-y-12">
            {/* Actions */}
            <div className="flex flex-col gap-3">
              {fullProject.link && (
                <a
                  href={fullProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full items-center justify-between border border-white/20 bg-white/5 p-4 transition-colors hover:bg-emerald-400 hover:text-black hover:border-emerald-400"
                >
                  <span className="font-mono text-sm font-bold uppercase tracking-widest">
                    Visit Live Site
                  </span>
                  <ArrowUpRight weight="bold" size={20} />
                </a>
              )}
              {/* Assuming GitHub link is available or derived (placeholder logic) */}
              {/* If you have a github link in frontmatter, add it here. Using placeholder for structure */}
              <a
                href={`https://github.com/fezcode/${fullProject.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-between border border-white/20 p-4 transition-colors hover:bg-emerald-400 hover:text-black hover:border-emerald-400"
              >
                <span className="font-mono text-sm font-bold uppercase tracking-widest">
                  Source Code
                </span>
                <GithubLogo weight="bold" size={20} />
              </a>
            </div>

            {/* Specs */}
            <div>
              <h3 className="mb-6 font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
                Project Specifications
              </h3>
              <div className="space-y-4 border-l border-white/10 pl-6">
                <div>
                  <span className="block font-mono text-[10px] text-gray-500 uppercase">
                    Frameworks
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {fullProject.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="bg-zinc-900 px-2 py-1 font-mono text-xs text-emerald-400 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-gray-500 uppercase">
                    Release Date
                  </span>
                  <span className="block mt-1 font-mono text-sm text-white">
                    {fullProject.date}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-gray-500 uppercase">
                    Status
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${fullProject.isActive !== false ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                    />
                    <span className="font-mono text-sm text-white">
                      {fullProject.isActive !== false ? 'Active' : 'Archived'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
