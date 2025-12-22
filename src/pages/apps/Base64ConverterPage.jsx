import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CodeIcon,
  ArrowsLeftRightIcon,
  CopySimpleIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';

function Base64ConverterPage() {
  const appName = 'Base64';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Binary-to-text encoding and decoding protocol.',
    keywords: [
      'Fezcodex',
      'Base64 converter',
      'encode Base64',
      'decode Base64',
    ],
  });

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { addToast } = useToast();

  const encodeBase64 = () => {
    try {
      setOutputText(btoa(inputText));
      addToast({
        title: 'Success',
        message: 'String encoded to Base64.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Encoding Error',
        message: 'Invalid character set detected.',
        type: 'error',
      });
      setOutputText('');
    }
  };

  const decodeBase64 = () => {
    try {
      setOutputText(atob(inputText));
      addToast({
        title: 'Success',
        message: 'Base64 sequence decoded.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Decoding Error',
        message: 'Sequence is not a valid Base64 string.',
        type: 'error',
      });
      setOutputText('');
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      addToast({
        title: 'Copied',
        message: 'Payload stored in clipboard.',
        duration: 2000,
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none uppercase">
                {appName}
              </h1>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Binary-to-text translation layer. Map character sequences to
                Base64 encoding.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <GenerativeArt seed="B64_INPUT" className="w-full h-full" />
            </div>
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <CodeIcon weight="fill" className="text-emerald-500" />
              Input_Buffer
            </h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-64 bg-black/40 border border-white/5 p-6 font-mono text-sm text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
              placeholder="Insert string or Base64 sequence..."
            />

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={encodeBase64}
                className="py-4 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all text-xs"
              >
                Encode
              </button>
              <button
                onClick={decodeBase64}
                className="py-4 bg-transparent border border-white text-white font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all text-xs"
              >
                Decode
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ArrowsLeftRightIcon weight="fill" className="text-emerald-500" />
              Output_Stream
            </h3>
            <textarea
              value={outputText}
              readOnly
              className="flex-grow w-full h-64 bg-black/40 border border-white/5 p-6 font-mono text-sm text-emerald-400 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide mb-6"
              placeholder="Translation will appear here..."
            />

            <button
              onClick={() => copyToClipboard(outputText)}
              disabled={!outputText}
              className="w-full py-4 border border-white/10 text-gray-500 hover:text-white hover:border-white hover:bg-white/5 transition-all font-mono uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-20"
            >
              <CopySimpleIcon weight="bold" size={18} />
              Stage to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Base64ConverterPage;
