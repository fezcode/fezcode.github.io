import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';
import Loading from '../../components/Loading';

const TierForge = lazy(() => import('../../app/apps/TierForge/TierForge'));

const TierForgePage = () => {
  const appName = 'Tier Forge';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Protocol for hierarchical data classification and visual ranking generation.',
    keywords: [
      'Fezcodex',
      'Tier List',
      'Ranker',
      'Tier List Maker',
      'Visual Ranking',
    ],
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-24">
          <Link
            to="/apps"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon
              weight="bold"
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Tier Forge" slug="tf" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Hierarchical classification protocol. Construct and visualize ranked data sets with drag-and-drop precision.
              </p>
            </div>
          </div>
        </header>

        <div className="border border-white/10 bg-white/[0.02] p-4 md:p-8 rounded-sm overflow-hidden min-h-[600px] relative">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale z-0">
                <GenerativeArt
                  seed={appName}
                  className="w-full h-full"
                />
            </div>
            <div className="relative z-10">
                <Suspense fallback={<Loading />}>
                    <TierForge />
                </Suspense>
            </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Rank_Protocol_v1.0.0</span>
          <span className="text-gray-800">SYSTEM_READY // AWAITING_INPUT</span>
        </footer>
      </div>
    </div>
  );
};

export default TierForgePage;
