import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  LinkIcon,
  ArrowsLeftRightIcon,
  CopySimpleIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

function UrlConverterPage() {
  const appName = 'URL Encoder';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Protocol for encoding and decoding Uniform Resource Locators.',
    keywords: [
      'Fezcodex',
      'URL encoder',
      'URL decoder',
      'URL converter',
      'web tools',
    ],
  });

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { addToast } = useToast();

  const encodeUrl = () => {
    try {
      setOutputText(encodeURIComponent(inputText));
      addToast({
        title: 'Success',
        message: 'URL string encoded.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to encode sequence.',
        type: 'error',
      });
      setOutputText('');
    }
  };

  const decodeUrl = () => {
    try {
      setOutputText(decodeURIComponent(inputText));
      addToast({
        title: 'Success',
        message: 'URL string decoded.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Invalid URL sequence.',
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

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="URL Encoder" slug="url" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Protocol for encoding and decoding Uniform Resource Locators.
                Map arbitrary data into web-compliant character sequences.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <GenerativeArt seed="URL_INPUT" className="w-full h-full" />
            </div>
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <LinkIcon weight="fill" className="text-emerald-500" />
              Input_Buffer
            </h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-64 bg-black/40 border border-white/5 p-6 font-mono text-sm text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
              placeholder="Insert URL or plaintext sequence..."
            />

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={encodeUrl}
                className="py-4 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all text-xs"
              >
                Encode
              </button>
              <button
                onClick={decodeUrl}
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
              className="flex-grow w-full h-64 bg-black/40 border border-white/5 p-4 font-mono text-sm text-emerald-400 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide mb-6"
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

export default UrlConverterPage;
