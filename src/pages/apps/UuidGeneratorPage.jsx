import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  FingerprintIcon,
  ArrowsClockwiseIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

function UuidGeneratorPage() {
  const appName = 'UUID Generator';

  const [uuid, setUuid] = useState('');
  const { addToast } = useToast();

  const generateUuidV4 = () => {
    try {
      const uuidV4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );
      setUuid(uuidV4);
      addToast({ title: 'Generated', message: 'New unique sequence mapped.' });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Entropy generation failed.',
        type: 'error',
      });
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      addToast({ title: 'Success', message: 'Sequence stored in clipboard.' });
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="UUID Generator | Fezcodex"
        description="Generate universally unique identifiers (UUIDs) version 4 for digital identification."
        keywords={[
          'Fezcodex',
          'UUID generator',
          'GUID generator',
          'unique ID',
          'UUID v4',
        ]}
      />
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
              <BreadcrumbTitle
                title="UUID Generator"
                slug="uuid"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Unique identity generator. Extract high-entropy character
                sequences for collision-free digital identification.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Display Area */}
          <div className="lg:col-span-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-12 md:p-24 rounded-sm overflow-hidden group flex flex-col items-center justify-center">
              {/* Generative Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={appName + uuid}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 w-full max-w-2xl space-y-12 text-center">
                <div className="space-y-4">
                  <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-[0.3em]">
                    {'//'} IDENTIFIER_V4
                  </span>
                  <div
                    className={`text-2xl md:text-4xl lg:text-5xl font-black font-mono tracking-tighter break-all transition-all duration-500 ${uuid ? 'text-white' : 'text-gray-800'}`}
                  >
                    {uuid || '00000000-0000-0000-0000-000000000000'}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  <button
                    onClick={generateUuidV4}
                    className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                  >
                    <ArrowsClockwiseIcon
                      weight="bold"
                      size={24}
                      className="group-hover:rotate-180 transition-transform duration-500"
                    />
                    <span>Map New Identity</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(uuid)}
                    disabled={!uuid}
                    className="group relative inline-flex items-center gap-4 px-12 py-6 border border-white/10 text-white hover:bg-white/5 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-bold rounded-sm disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <CopySimpleIcon weight="bold" size={24} />
                    <span>Store Mapping</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <FingerprintIcon weight="fill" />
                Technical_Specifications
              </h3>

              <div className="space-y-6">
                <div className="space-y-2 pb-6 border-b border-white/5">
                  <span className="font-mono text-[10px] text-gray-600 uppercase">
                    Architecture
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    RFC 4122 Version 4
                  </p>
                </div>
                <div className="space-y-2 pb-6 border-b border-white/5">
                  <span className="font-mono text-[10px] text-gray-600 uppercase">
                    Source
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    System CSPRNG
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-gray-600 uppercase">
                    Probability
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    Collision-Free Matrix
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                A UUID v4 is derived from random numbers. The probability of
                finding a duplicate is mathematically negligible within the
                current epoch.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Identity_Core_v0.6.1</span>
          <span className="text-gray-800">ENTROPY_STATUS // OPTIMAL</span>
        </footer>
      </div>
    </div>
  );
}

export default UuidGeneratorPage;
