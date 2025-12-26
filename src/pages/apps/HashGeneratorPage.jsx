import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  ArrowsClockwiseIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

function HashGeneratorPage() {
  const appName = 'Hash Engine';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Protocol for generating cryptographic digests and data integrity signatures.',
    keywords: [
      'Fezcodex',
      'hash generator',
      'SHA-1',
      'SHA-256',
      'SHA-512',
      'cryptography',
      'hashing',
    ],
  });

  const [inputText, setInputText] = useState('');
  const [hashes, setHashes] = useState({
    sha1: '',
    sha256: '',
    sha512: '',
  });
  const { addToast } = useToast();

  const generateHash = async (algorithm) => {
    if (!inputText) return '';
    try {
      const textEncoder = new TextEncoder();
      const data = textEncoder.encode(inputText);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      return 'ERROR_GEN_FAILED';
    }
  };

  const generateAllHashes = async () => {
    if (!inputText) {
      addToast({ title: 'Info', message: 'Insert data stream first.' });
      return;
    }
    const [s1, s256, s512] = await Promise.all([
      generateHash('SHA-1'),
      generateHash('SHA-256'),
      generateHash('SHA-512'),
    ]);
    setHashes({ sha1: s1, sha256: s256, sha512: s512 });
    addToast({ title: 'Verified', message: 'Digest generation complete.' });
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      addToast({ title: 'Success', message: 'Digest stored in clipboard.' });
    });
  };

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
              <BreadcrumbTitle title="Hash Engine" slug="hash" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Cryptographic digest protocol. Generate unique mathematical
                signatures to verify data integrity and authenticity.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Area */}
          <div className="lg:col-span-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={appName + inputText.length}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-px w-4 bg-gray-800" /> Source_Data_Stream
                  </label>
                  <textarea
                    className="w-full h-48 p-8 bg-black/40 border border-white/5 rounded-sm font-mono text-sm leading-relaxed focus:border-emerald-500/50 focus:ring-0 transition-all resize-none shadow-inner"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Insert plaintext sequence for digest generation..."
                  />
                </div>

                <button
                  onClick={generateAllHashes}
                  className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm"
                >
                  <ArrowsClockwiseIcon
                    weight="bold"
                    size={24}
                    className="group-hover:rotate-180 transition-transform duration-500"
                  />
                  <span>Map digests</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-8 space-y-8">
            <HashOutputRow
              title="SHA-1"
              value={hashes.sha1}
              onCopy={copyToClipboard}
            />
            <HashOutputRow
              title="SHA-256"
              value={hashes.sha256}
              onCopy={copyToClipboard}
            />
            <HashOutputRow
              title="SHA-512"
              value={hashes.sha512}
              onCopy={copyToClipboard}
            />
          </div>

          {/* Side Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <ShieldCheckIcon weight="fill" />
                Integrity_Audit
              </h3>

              <div className="space-y-6 text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                <p>
                  A hash is a one-way mathematical function. Any variation in
                  the source data stream will result in a complete
                  reconstruction of the digest sequence.
                </p>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <span>Engine</span>
                  <span className="text-white font-black">
                    Subtle_Crypto_API
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Protocol recommendation: Use SHA-256 or higher for sensitive
                data verification. SHA-1 is preserved for legacy compatibility.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Digest_Module_v0.6.1</span>
          <span className="text-gray-800">HASH_STATE // STABLE</span>
        </footer>
      </div>
    </div>
  );
}

const HashOutputRow = ({ title, value, onCopy }) => (
  <div className="relative group border border-white/10 bg-white/[0.02] p-8 rounded-sm overflow-hidden transition-all hover:border-emerald-500/30">
    <div className="flex justify-between items-center mb-4">
      <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
        {title}
      </span>
      <button
        onClick={() => onCopy(value)}
        disabled={!value}
        className="text-gray-500 hover:text-white transition-colors disabled:opacity-0"
      >
        <CopySimpleIcon size={20} weight="bold" />
      </button>
    </div>
    <div
      className={`font-mono text-sm break-all transition-colors duration-500 ${value ? 'text-white' : 'text-gray-800'}`}
    >
      {value || 'WAITING_FOR_DATA_INPUT...'}
    </div>
  </div>
);

export default HashGeneratorPage;
