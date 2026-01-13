import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../utils/projectParser';
import Loading from '../components/Loading';

const TechnoProjectDetailsPage = () => {
  const { slug } = useParams();
  const { projects, loading } = useProjects();

  if (loading) return <Loading />;

  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-emerald-500 p-8 font-mono">
        <h1 className="text-4xl mb-4">404: PROJECT_NOT_FOUND</h1>
        <p>The requested project slug does not exist in the database.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-emerald-500 p-8 font-mono">
      <div className="max-w-4xl mx-auto border border-emerald-500 p-6 bg-emerald-950/10">
        <div className="flex justify-between items-center mb-6 border-b border-emerald-500 pb-2">
          <h1 className="text-3xl uppercase tracking-tighter font-bold">{project.title}</h1>
          <span className="text-xs bg-emerald-500 text-black px-2 py-1">TECHNO_VARIANT_v1.0</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <img
              src={project.image}
              alt={project.title}
              className="w-full border border-emerald-500 filter grayscale contrast-125 brightness-75 hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xl mb-4 text-emerald-300">SYSTEM_OVERVIEW</h2>
            <p className="mb-6 leading-relaxed">
              {project.shortDescription}
            </p>
            <div className="flex gap-4">
              {project.repo_link && (
                <a
                  href={project.repo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors"
                >
                  ACCESS_REPOSITORY
                </a>
              )}
              {project.demo_link && (
                <a
                  href={project.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
                >
                  RUN_DEMO
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-500 pt-6">
          <h2 className="text-xl mb-4 text-emerald-300">TECHNICAL_SPECIFICATIONS</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech, idx) => (
              <span key={idx} className="px-2 py-1 border border-emerald-500/50 text-xs">
                {tech.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 text-[10px] text-emerald-500/30 font-mono">
          <p>WARNING: THIS PAGE IS UNDER DEVELOPMENT</p>
          <p>FEZCODEX_SECURITY_LEVEL: ALPHA</p>
        </div>
      </div>
    </div>
  );
};

export default TechnoProjectDetailsPage;
