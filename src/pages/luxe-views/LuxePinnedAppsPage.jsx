import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Star } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { appIcons } from '../../utils/appIcons';
import LuxeArt from '../../components/LuxeArt';

const LuxePinnedAppsPage = () => {
  const [pinnedApps, setPinnedApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/apps/apps.json')
      .then((res) => res.json())
      .then((data) => {
        const allApps = Object.values(data).flatMap((cat) =>
          cat.apps.map((app) => ({ ...app, categoryName: cat.name })),
        );
        const pinned = allApps
          .filter((app) => app.pinned_order)
          .sort((a, b) => a.pinned_order - b.pinned_order);
        setPinnedApps(pinned);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20">
      <Seo title="Fezcodex | Featured Apps" description="Curated Tools." />

      <div className="max-w-[1800px] mx-auto px-6 md:px-12">

        <header className="mb-20 pt-12 border-b border-[#1A1A1A]/10 pb-12">
           <Link to="/apps" className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors">
               <ArrowLeft /> All Applications
           </Link>
           <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
               Featured
           </h1>
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
               <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
                   A curated collection of essential tools and high-performance modules.
               </p>
           </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
                <div className="col-span-full py-32 text-center font-outfit text-[#1A1A1A]/40">Loading Modules...</div>
            ) : (
                pinnedApps.map((app, index) => {
                    const Icon = appIcons[app.icon] || Star;
                    return (
                        <Link key={app.slug} to={app.to} className="group block">
                            <div className="relative aspect-square w-full bg-[#EBEBEB] overflow-hidden mb-8 border border-[#1A1A1A]/5 shadow-sm group-hover:shadow-2xl transition-all duration-700 rounded-sm">
                                 {/* Art/Image */}
                                 <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                                     <LuxeArt seed={app.title} className="w-full h-full opacity-80 mix-blend-multiply" />
                                 </div>

                                 <div className="absolute top-6 left-6 w-16 h-16 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full text-[#1A1A1A] shadow-md border border-[#1A1A1A]/5">
                                     <Icon size={28} weight="light" />
                                 </div>

                                 <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#1A1A1A] text-white p-4 rounded-full">
                                     <ArrowUpRight size={24} />
                                 </div>
                            </div>

                            <div className="space-y-3 px-2">
                                <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/30">
                                    No. {String(index + 1).padStart(2, '0')}
                                </span>
                                <h2 className="font-playfairDisplay text-4xl text-[#1A1A1A] group-hover:italic transition-all leading-tight">
                                    {app.title}
                                </h2>
                                <p className="font-outfit text-sm text-[#1A1A1A]/60 line-clamp-2 leading-relaxed">
                                    {app.description}
                                </p>
                            </div>
                        </Link>
                    );
                })
            )}
        </div>

      </div>
    </div>
  );
};

export default LuxePinnedAppsPage;
