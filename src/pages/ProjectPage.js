import React from 'react';
import {useParams, Link} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {useProjects} from '../utils/projectParser';
import {useProjectContent} from '../hooks/useProjectContent';
import ProjectMetadata from '../components/metadata-cards/ProjectMetadata';
import Seo from '../components/Seo';

import {ArrowLeftIcon} from '@phosphor-icons/react';

const ProjectPage = () => {
  const {slug} = useParams();
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
      <div className="min-h-screen bg-[#020617] py-24 px-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="font-mono text-cyan-500 animate-pulse">
            LOADING DATA STREAM...
          </p>
        </div>
      </div>
    );
  }

  if (errorProjects || errorContent) {
    return (
      <div className="min-h-screen bg-[#020617] py-24 px-6 flex items-center justify-center text-red-500 font-mono">
        ERROR: {errorProjects?.message || errorContent?.message}
      </div>
    );
  }

  const project = projects.find((p) => p.slug === slug);

  if (!project || !content) {
    return (
      <div className="min-h-screen bg-[#020617] py-24 px-6 flex items-center justify-center text-gray-400 font-mono">
        Project not found in archives.
      </div>
    );
  }

  // Combine project metadata with fetched content
  const fullProject = {...project, ...content};

  return (
    <div className="min-h-screen bg-[#020617] pb-24 relative overflow-hidden">
      <Seo
        title={`${fullProject.title} | Fezcodex`}
        description={fullProject.shortDescription}
        keywords={fullProject.tags ? fullProject.tags.join(', ') : ''}
        ogTitle={`${fullProject.title} | Fezcodex`}
        ogDescription={fullProject.shortDescription}
        ogImage={fullProject.image || 'https://fezcode.github.io/logo512.png'}
        twitterCard="summary_large_image"
        twitterTitle={`${fullProject.title} | Fezcodex`}
        twitterDescription={fullProject.shortDescription}
        twitterImage={
          fullProject.image || 'https://fezcode.github.io/logo512.png'
        }
      />

      {/* Header Background */}
      <div
        className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-gray-900 to-[#020617] -z-10 border-b border-gray-800/50">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"/>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 font-mono text-sm tracking-widest uppercase hover:underline decoration-cyan-500/50 underline-offset-4 transition-all"
            >
              <ArrowLeftIcon size={16}/> Back to Projects
            </Link>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-mono mb-6">
              {fullProject.title}
              <span className="text-cyan-500 animate-pulse">_</span>
            </h1>

            <div className="mt-8 p-8 bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm">
              <div
                className="prose prose-invert prose-lg max-w-none
                    prose-headings:font-mono prose-headings:text-gray-100
                    prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                    prose-code:text-cyan-300 prose-code:bg-gray-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800
                    prose-strong:text-white
                    text-gray-300"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {fullProject.fullContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="hidden lg:block mt-24 space-y-6">
            <div className="sticky top-24">
              <ProjectMetadata project={fullProject}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
