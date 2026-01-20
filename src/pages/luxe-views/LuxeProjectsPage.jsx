import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '@phosphor-icons/react';
import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import LuxeArt from '../../components/LuxeArt';

const LuxeProjectsPage = () => {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-widest">
        Loading Archive...
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
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20">
      <Seo
        title="Fezcodex | Works"
        description="A curated collection of digital experiments."
        keywords={['Fezcodex', 'projects', 'portfolio', 'developer']}
      />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12">

        {/* Header */}
        <header className="mb-20 pt-12 border-b border-[#1A1A1A]/10 pb-12">
           <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
               Selected Works
           </h1>
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
               <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
                   Explorations in code, design, and user interaction. A catalogue of shipped products and experimental prototypes.
               </p>
               <span className="font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 border border-[#1A1A1A]/10 px-4 py-2 rounded-full">
                   Total Entries: {projects.length}
               </span>
           </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {projects.map((project, index) => (
                <div key={project.slug} className={`group ${index % 2 === 1 ? 'md:translate-y-20' : ''}`}>
                    <Link to={`/projects/${project.slug}`} className="block">
                        <div className="relative aspect-[4/3] w-full bg-[#EBEBEB] overflow-hidden mb-8 border border-[#1A1A1A]/5 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                             {/* Art/Image */}
                             <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                                 <LuxeArt seed={project.title} className="w-full h-full opacity-90" />
                             </div>

                             {/* Overlay */}
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                             <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white text-black p-4 rounded-full">
                                 <ArrowUpRightIcon size={24} />
                             </div>
                        </div>

                        <div className="flex justify-between items-start border-t border-[#1A1A1A]/10 pt-6">
                            <div className="space-y-2 max-w-xl">
                                <h2 className="font-playfairDisplay text-4xl text-[#1A1A1A] group-hover:italic transition-all leading-tight">
                                    {project.title}
                                </h2>
                                <p className="font-outfit text-sm text-[#1A1A1A]/60 line-clamp-2">
                                    {project.shortDescription}
                                </p>
                            </div>
                            <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/30">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </Link>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default LuxeProjectsPage;
