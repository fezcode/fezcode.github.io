import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WarningIcon, ArrowLeftIcon } from '@phosphor-icons/react';
import Seo from '../components/Seo';
import { useAchievements } from '../context/AchievementContext';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { TerracottaMark } from '../components/terracotta';
import { MistOrb } from '../components/mist';
import { LedgerFolio } from '../components/ledger';
import { OrbitFolio } from '../components/orbit';
import { KnitHero } from '../components/knit';
import { BlissWindow } from '../components/bliss';

const BrutalistNotFound = () => (
  <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />

    <div className="relative z-10 max-w-2xl w-full border-2 border-white p-8 md:p-12 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-8 text-red-500 animate-pulse">
        <WarningIcon size={32} weight="bold" />
        <span className="text-xl font-bold uppercase tracking-widest">
          System_Error: 404
        </span>
      </div>

      <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
        Data_Not
        <br />
        Found
      </h1>

      <div className="space-y-4 mb-12 text-sm md:text-base text-gray-400">
        <p className="uppercase tracking-wider">
          &gt; Querying database... <span className="text-red-500">FAILED</span>
        </p>
        <p className="uppercase tracking-wider">
          &gt; Locating asset... <span className="text-red-500">NULL</span>
        </p>
        <p className="uppercase tracking-wider">
          &gt; Diagnostic: The requested URL endpoint does not exist in the
          current spacetime coordinate system.
        </p>
      </div>

      <Link
        to="/"
        className="group inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-emerald-400 transition-colors w-full md:w-auto"
      >
        <ArrowLeftIcon
          size={20}
          weight="bold"
          className="group-hover:-translate-x-1 transition-transform"
        />
        Return_To_Base
      </Link>
    </div>

    <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
      <span>ERR_CODE: 404_NOT_FOUND</span>
      <span>SYS_STATUS: UNSTABLE</span>
    </div>
  </div>
);

const LuxeNotFound = ({ path }) => (
  <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] flex items-center justify-center px-6 py-24">
    <div className="max-w-2xl w-full text-center">
      <p className="font-outfit text-[11px] uppercase tracking-[0.4em] text-[#8D4004] mb-8">
        Error 404
      </p>
      <h1 className="font-playfairDisplay italic text-5xl md:text-7xl leading-[1.05] mb-8">
        This room is not
        <br />
        part of the exhibition.
      </h1>
      <div className="w-16 h-px bg-[#1A1A1A]/20 mx-auto mb-8" />
      <p className="font-outfit text-[#1A1A1A]/60 text-base md:text-lg mb-2">
        Nothing hangs at this address.
      </p>
      <p className="font-outfit text-xs text-[#1A1A1A]/40 tracking-wide break-all mb-12">
        {path}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-3 border border-[#1A1A1A] px-8 py-4 font-outfit text-xs uppercase tracking-[0.3em] hover:bg-[#1A1A1A] hover:text-[#F5F5F0] transition-colors"
      >
        <ArrowLeftIcon size={16} />
        Return to the entrance
      </Link>
    </div>
  </div>
);

const TerracottaNotFound = ({ path }) => (
  <div className="min-h-screen bg-[#F3ECE0] text-[#1A1613] flex items-center justify-center px-6 py-24">
    <div className="max-w-2xl w-full">
      <TerracottaMark size={64} color="#1A1613" sway className="mb-10" />
      <p className="font-ibm-plex-mono text-[11px] uppercase tracking-[0.3em] text-[#C96442] mb-4">
        Folio 404 · Not filed
      </p>
      <h1 className="font-fraunces text-5xl md:text-7xl leading-[1.02] mb-8">
        The line fell
        <br />
        <em className="text-[#C96442]">through.</em>
      </h1>
      <p className="font-fraunces text-lg md:text-xl text-[#1A1613]/70 max-w-lg mb-3">
        Nothing has been set in type at this address. It may have moved, or it
        may never have been written.
      </p>
      <p className="font-ibm-plex-mono text-xs text-[#1A1613]/45 break-all mb-12">
        {path}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-3 bg-[#1A1613] text-[#F3ECE0] px-7 py-4 font-ibm-plex-mono text-xs uppercase tracking-[0.25em] hover:bg-[#C96442] transition-colors"
      >
        <ArrowLeftIcon size={16} />
        Back to the front page
      </Link>
    </div>
  </div>
);

const MistNotFound = ({ path }) => (
  <div className="min-h-screen bg-[#EEF2F1] text-[#3C4845] flex items-center justify-center px-6 py-24">
    <div className="max-w-xl w-full text-center flex flex-col items-center">
      <MistOrb size={140} className="mb-10" />
      <p className="font-ibm-plex-mono text-[10px] uppercase tracking-[0.35em] text-[#5F837B] mb-5">
        404 · Out of sight
      </p>
      <h1 className="font-instr-serif italic text-5xl md:text-7xl leading-[1.05] mb-6">
        Lost in the fog.
      </h1>
      <p className="font-outfit text-base md:text-lg text-[#3C4845]/70 mb-2">
        The path you followed fades out here. Nothing waits beyond it.
      </p>
      <p className="font-ibm-plex-mono text-xs text-[#3C4845]/45 break-all mb-12">
        {path}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-3 rounded-full border border-[#5F837B]/50 px-7 py-3 font-ibm-plex-mono text-xs uppercase tracking-[0.25em] text-[#3C4845] hover:bg-[#5F837B] hover:text-[#EEF2F1] transition-colors"
      >
        <ArrowLeftIcon size={16} />
        Find the way home
      </Link>
    </div>
  </div>
);

const LedgerNotFound = ({ path }) => (
  <div className="ldg-root min-h-screen">
    <div className="ldg-page">
      <LedgerFolio
        folio="FOLIO NO. 404 — UNFILED"
        title="NO SUCH ENTRY"
        sub="THE REGISTER HOLDS NOTHING AT THIS ADDRESS"
      />
      <div className="ldg-card max-w-2xl p-6">
        <p className="ldg-label mb-1">REQUESTED</p>
        <p className="break-all mb-4">{path}</p>
        <p className="ldg-label mb-1">STATUS</p>
        <p className="mb-6">
          Not on file. Entries are never erased, so this one was never written.
        </p>
        <span className="ldg-stamp">NOT ON FILE</span>
      </div>
      <div className="mt-8">
        <Link to="/" className="ldg-btn ldg-btn-accent">
          RETURN TO THE INDEX
        </Link>
      </div>
    </div>
  </div>
);

const OrbitNotFound = ({ path }) => (
  <div className="orb-root min-h-screen">
    <div className="orb-page">
      <OrbitFolio
        folio
        title="Signal lost"
        sub="Nothing orbits at this address. 404."
      />
      <p className="orb-notice max-w-2xl break-all">{path}</p>
      <div className="mt-8">
        <Link to="/" className="orb-btn orb-btn-primary">
          Return to the observatory
        </Link>
      </div>
    </div>
  </div>
);

const KnitNotFound = ({ path }) => (
  <div className="knt-root min-h-screen">
    <KnitHero
      eyebrow="ERROR 404"
      title="DROPPED STITCH"
      intro="This row was never knitted. The pattern has no stitch at this address."
      wool="rust"
      motif="hearts"
    />
    <div className="knt-page">
      <p className="knt-patch max-w-2xl break-all">
        Requested: <code>{path}</code>
      </p>
      <div className="mt-8">
        <Link to="/" className="knt-btn knt-btn-primary">
          Pick up from the start
        </Link>
      </div>
    </div>
  </div>
);

const BlissNotFound = ({ path }) => (
  <div className="bl-root">
    <div className="bl-page items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-lg">
        <BlissWindow
          title="Page not found"
          icon={WarningIcon}
          headingLevel={1}
          status={<span>Error 404</span>}
        >
          <div className="flex gap-4 items-start">
            <WarningIcon
              size={40}
              weight="fill"
              color="#e0502c"
              aria-hidden="true"
              className="shrink-0"
            />
            <div className="min-w-0">
              <p className="mb-2">Fezcodex can&apos;t find this page:</p>
              <p className="bl-meta break-all mb-3">{path}</p>
              <p className="bl-muted">
                Check the address for typos, or head back to the desktop.
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Link to="/" className="bl-btn bl-btn-primary">
              Back to desktop
            </Link>
          </div>
        </BlissWindow>
      </div>
    </div>
  </div>
);

const VIEWS = {
  luxe: LuxeNotFound,
  terracotta: TerracottaNotFound,
  mist: MistNotFound,
  ledger: LedgerNotFound,
  orbit: OrbitNotFound,
  knit: KnitNotFound,
  bliss: BlissNotFound,
};

const NotFoundPage = () => {
  const { unlockAchievement } = useAchievements();
  const { fezcodexTheme } = useVisualSettings() || {};
  const { pathname } = useLocation();

  useEffect(() => {
    const visits = parseInt(localStorage.getItem('wrongs') || '0', 10) + 1;
    localStorage.setItem('wrongs', visits.toString());

    if (visits >= 3) {
      unlockAchievement('glitch_in_the_matrix');
    }
  }, [unlockAchievement]);

  const View = VIEWS[fezcodexTheme] || BrutalistNotFound;

  return (
    <>
      <Seo
        title="404 | DATA_NOT_FOUND"
        description="System Error: The requested data segment could not be located."
      />
      <View path={pathname} />
    </>
  );
};

export default NotFoundPage;
