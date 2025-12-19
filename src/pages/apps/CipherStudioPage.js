import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CopySimpleIcon, LockKeyIcon, ArrowsClockwiseIcon, InfoIcon, ShieldCheckIcon } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import CustomDropdown from '../../components/CustomDropdown';
import GenerativeArt from '../../components/GenerativeArt';

const CIPHERS = [
  { label: 'Atbash', value: 'atbash' },
  { label: 'Caesar', value: 'caesar' },
  { label: 'Vigenère', value: 'vigenere' },
];

const CipherStudioPage = () => {
  const appName = 'Cipher Studio';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Encode and decode messages using classic cryptographic algorithms like Caesar and Vigenère.',
    keywords: ['Fezcodex', 'cryptography', 'cipher', 'encryption', 'decryption', 'caesar cipher'],
  });

  const { addToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeCipher, setActiveCipher] = useState('atbash');
  const [shift, setShift] = useState(3);
  const [key, setKey] = useState('KEY');
  const [isEncoding, setIsAtbashEncoding] = useState(true); // Toggle doesn't matter for Atbash but used for others

  const applyAtbash = (text) => {
    return text.replace(/[a-z]/gi, (char) => {
      const charCode = char.charCodeAt(0);
      const start = charCode <= 90 ? 65 : 97;
      return String.fromCharCode(start + (25 - (charCode - start)));
    });
  };

  const applyCaesar = (text, s, decode = false) => {
    const actualShift = decode ? (26 - (s % 26)) % 26 : s % 26;
    return text.replace(/[a-z]/gi, (char) => {
      const charCode = char.charCodeAt(0);
      const start = charCode <= 90 ? 65 : 97;
      return String.fromCharCode(start + ((charCode - start + actualShift) % 26));
    });
  };

  const applyVigenere = (text, k, decode = false) => {
    let result = '';
    let j = 0;
    const cleanKey = k.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanKey) return text;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        const charCode = char.charCodeAt(0);
        const start = charCode <= 90 ? 65 : 97;
        const shiftVal = cleanKey.charCodeAt(j % cleanKey.length) - 65;
        const actualShift = decode ? (26 - shiftVal) % 26 : shiftVal;
        result += String.fromCharCode(start + ((charCode - start + actualShift) % 26));
        j++;
      } else {
        result += char;
      }
    }
    return result;
  };

  const processMessage = useCallback(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let result = '';
    switch (activeCipher) {
      case 'caesar':
        result = applyCaesar(inputText, shift, !isEncoding);
        break;
      case 'vigenere':
        result = applyVigenere(inputText, key, !isEncoding);
        break;
      case 'atbash':
      default:
        result = applyAtbash(inputText);
        break;
    }
    setOutputText(result);
  }, [inputText, activeCipher, shift, key, isEncoding]);

  useEffect(() => {
    processMessage();
  }, [processMessage]);

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      addToast({ title: 'Success', message: 'Message stored in clipboard.' });
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                {appName}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Classic message encryption. Choose an algorithm to transform your messages into secure character sequences.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Controls & Configuration */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <LockKeyIcon weight="fill" />
                Settings
              </h3>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest">Selected Algorithm</label>
                  <CustomDropdown
                    variant="brutalist"
                    options={CIPHERS}
                    value={activeCipher}
                    onChange={setActiveCipher}
                    label="Choose Cipher"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setIsAtbashEncoding(true)}
                    className={`flex-1 py-3 border transition-all text-xs font-black uppercase tracking-widest ${isEncoding ? 'bg-white text-black border-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                  >
                    Encode
                  </button>
                  <button
                    onClick={() => setIsAtbashEncoding(false)}
                    className={`flex-1 py-3 border transition-all text-xs font-black uppercase tracking-widest ${!isEncoding ? 'bg-white text-black border-white' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                  >
                    Decode
                  </button>
                </div>

                {activeCipher === 'caesar' && (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-end">
                      <label className="font-mono text-[10px] text-gray-500 uppercase">Shift Amount</label>
                      <span className="text-xl font-black text-emerald-500">{shift}</span>
                    </div>
                    <input
                      type="range" min="1" max="25" value={shift}
                      onChange={(e) => setShift(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}

                {activeCipher === 'vigenere' && (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="block font-mono text-[10px] text-gray-500 uppercase">Secret Key</label>
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => setKey(e.target.value.toUpperCase())}
                      placeholder="Enter word..."
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-4 font-mono text-sm focus:border-emerald-500/50 focus:ring-0 transition-all uppercase"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <InfoIcon size={24} className="text-gray-700 shrink-0" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                These algorithms represent the foundations of cryptography. While visually impactful, they are intended for educational and creative purposes only.
              </p>
            </div>
          </div>

          {/* Input/Output Column */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed={appName + inputText.length + activeCipher} className="w-full h-full" />
              </div>

              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-px w-4 bg-gray-800" /> Your Message
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your text here..."
                    className="w-full h-48 p-8 bg-black/40 border border-white/5 rounded-sm font-mono text-sm leading-relaxed focus:border-emerald-500/50 focus:ring-0 transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="relative group/output">
                  <div className="flex justify-between items-center mb-6">
                    <label className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center gap-2">
                      <span className="h-px w-4 bg-emerald-500/20" /> Result
                    </label>
                    <button
                      onClick={copyToClipboard}
                      disabled={!outputText}
                      className="text-emerald-500 hover:text-white transition-colors disabled:opacity-0"
                    >
                      <CopySimpleIcon size={24} weight="bold" />
                    </button>
                  </div>
                  <div className={`min-h-[12rem] p-8 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-sm font-mono text-lg md:text-xl break-words transition-colors duration-500 ${outputText ? 'text-white' : 'text-gray-800 italic'}`}>
                    {outputText || 'Waiting for message input...'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <ShieldCheckIcon size={32} className="text-emerald-500/50" />
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Integrity Verified: Processed locally</span>
              </div>
              <button
                onClick={() => { setInputText(''); setOutputText(''); }}
                className="text-[10px] font-mono uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                <ArrowsClockwiseIcon weight="bold" /> Clear Data
              </button>
            </div>
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Cipher_Studio_v0.6.1</span>
          <span className="text-gray-800">ENCRYPTION // ACTIVE</span>
        </footer>
      </div>
    </div>
  );
};

export default CipherStudioPage;
