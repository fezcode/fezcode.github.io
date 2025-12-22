import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  KeyIcon,
  ArrowsClockwiseIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';

const PasswordGeneratorPage = () => {
  const appName = 'Access Key Gen';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Protocol for generating high-entropy character sequences for secure system access.',
    keywords: [
      'Fezcodex',
      'password generator',
      'random password',
      'strong password',
      'security',
      'password tool',
    ],
  });

  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset.length === 0) {
      setPassword('Select_Type');
      return;
    }

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += charset[array[i] % charset.length];
    }
    setPassword(generatedPassword);
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = () => {
    if (password && password !== 'Select_Type') {
      navigator.clipboard.writeText(password);
      addToast({
        title: 'Success',
        message: 'Access sequence stored in clipboard.',
      });
    }
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
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                {appName}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Entropy extraction protocol. Generate high-density cryptographic
                sequences for secure authentication cycles.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Result Display */}
          <div className="lg:col-span-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed={password} className="w-full h-full" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-4 w-full">
                  <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-[0.3em]">
                    {'//'} ACCESS_SEQUENCE
                  </span>
                  <div className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white break-all bg-black/40 p-8 border border-white/5 rounded-sm">
                    {password}
                  </div>
                </div>

                <div className="flex flex-col gap-4 shrink-0">
                  <button
                    onClick={generatePassword}
                    className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm"
                  >
                    <ArrowsClockwiseIcon
                      weight="bold"
                      size={24}
                      className="group-hover:rotate-180 transition-transform duration-500"
                    />
                    <span>Refresh Map</span>
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="group relative inline-flex items-center gap-4 px-10 py-6 border border-white/10 text-white hover:bg-white/5 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-bold rounded-sm"
                  >
                    <CopySimpleIcon weight="bold" size={24} />
                    <span>Copy Key</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="lg:col-span-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm space-y-12">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <KeyIcon weight="fill" />
                Entropy_Parameters
              </h3>

              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      Sequence_Length
                    </label>
                    <span className="text-2xl font-black text-emerald-500">
                      {length}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    {
                      id: 'upper',
                      label: 'Uppercase_Alpha',
                      checked: includeUppercase,
                      set: setIncludeUppercase,
                    },
                    {
                      id: 'lower',
                      label: 'Lowercase_Alpha',
                      checked: includeLowercase,
                      set: setIncludeLowercase,
                    },
                    {
                      id: 'nums',
                      label: 'Numeric_Values',
                      checked: includeNumbers,
                      set: setIncludeNumbers,
                    },
                    {
                      id: 'syms',
                      label: 'Special_Symbols',
                      checked: includeSymbols,
                      set: setIncludeSymbols,
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => opt.set(!opt.checked)}
                      className={`
                        flex items-center justify-between p-6 border transition-all duration-200
                        ${
                          opt.checked
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                            : 'bg-transparent border-white/5 text-gray-600 hover:border-white/20'
                        }
                      `}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest">
                        {opt.label}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-sm border ${opt.checked ? 'bg-emerald-500 border-emerald-400' : 'border-gray-700'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Box */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <ShieldCheckIcon weight="fill" />
                Security_Audit
              </h3>

              <div className="space-y-6">
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                  <span className="font-mono text-[10px] text-gray-600 uppercase block mb-2">
                    Encryption_Standard
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    CSPRNG RANDOM CORE
                  </p>
                </div>
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                  <span className="font-mono text-[10px] text-gray-600 uppercase block mb-2">
                    Protocol_Context
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    LOCAL ONLY GENERATION (NO SERVERS)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                All identity mapping is executed within the client-side sandbox.
                No sensitive sequences are transmitted across the neural
                network.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Access_Protocol_v0.6.1</span>
          <span className="text-gray-800">ENCRYPTION // VERIFIED</span>
        </footer>
      </div>
    </div>
  );
};

export default PasswordGeneratorPage;
