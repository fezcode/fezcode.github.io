import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  KeyboardIcon,
  CodeIcon,
  ArrowsLeftRightIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

function AsciiConverterPage() {
  const appName = 'Binary / ASCII';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Protocol for mapping character sequences to ASCII and Binary representations.',
    keywords: [
      'Fezcodex',
      'ASCII converter',
      'text to ASCII',
      'binary converter',
      'text to binary',
    ],
  });

  const [inputText, setInputText] = useState('');
  const [asciiOutput, setAsciiOutput] = useState('');
  const [binaryOutput, setBinaryOutput] = useState('');
  const { addToast } = useToast();

  const textToAscii = () => {
    try {
      const ascii = inputText
        .split('')
        .map((char) => char.charCodeAt(0))
        .join(' ');
      setAsciiOutput(ascii);
      addToast({
        title: 'Success',
        message: 'String mapped to ASCII sequence.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to map to ASCII.',
        type: 'error',
      });
      setAsciiOutput('');
    }
  };

  const asciiToText = () => {
    try {
      const text = inputText
        .split(' ')
        .map((code) => String.fromCharCode(parseInt(code, 10)))
        .join('');
      setAsciiOutput(text);
      addToast({
        title: 'Success',
        message: 'ASCII sequence decoded.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Invalid ASCII sequence.',
        type: 'error',
      });
      setAsciiOutput('');
    }
  };

  const textToBinary = () => {
    try {
      const binary = inputText
        .split('')
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
      setBinaryOutput(binary);
      addToast({
        title: 'Success',
        message: 'String mapped to Binary sequence.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to map to Binary.',
        type: 'error',
      });
      setBinaryOutput('');
    }
  };

  const binaryToText = () => {
    try {
      const text = inputText
        .split(' ')
        .map((bin) => String.fromCharCode(parseInt(bin, 2)))
        .join('');
      setBinaryOutput(text);
      addToast({
        title: 'Success',
        message: 'Binary sequence decoded.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Invalid Binary sequence.',
        type: 'error',
      });
      setBinaryOutput('');
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
              <BreadcrumbTitle title="Binary / ASCII" slug="ascii" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Character mapping protocol. Translate natural language into
                machine-level representations.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed="ASCII_INPUT" className="w-full h-full" />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <KeyboardIcon weight="fill" className="text-emerald-500" />
                Input_Buffer
              </h3>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-64 bg-black/40 border border-white/5 p-6 font-mono text-sm text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
                placeholder="Insert plaintext or sequence..."
              />

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest text-center">
                    ASCII Functions
                  </span>
                  <button
                    onClick={textToAscii}
                    className="py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all"
                  >
                    To ASCII
                  </button>
                  <button
                    onClick={asciiToText}
                    className="py-3 border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                  >
                    From ASCII
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest text-center">
                    Binary Functions
                  </span>
                  <button
                    onClick={textToBinary}
                    className="py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all"
                  >
                    To Binary
                  </button>
                  <button
                    onClick={binaryToText}
                    className="py-3 border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                  >
                    From Binary
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden flex flex-col">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CodeIcon weight="fill" className="text-emerald-500" />
                ASCII_Sequence
              </h3>
              <div className="relative">
                <textarea
                  value={asciiOutput}
                  readOnly
                  className="w-full h-32 bg-black/40 border border-white/5 p-4 font-mono text-sm text-emerald-400 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
                  placeholder="ASCII output..."
                />
                <button
                  onClick={() => copyToClipboard(asciiOutput)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-white transition-colors"
                >
                  <CopySimpleIcon size={16} />
                </button>
              </div>
            </div>

            <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden flex flex-col">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ArrowsLeftRightIcon
                  weight="fill"
                  className="text-emerald-500"
                />
                Binary_Sequence
              </h3>
              <div className="relative">
                <textarea
                  value={binaryOutput}
                  readOnly
                  className="w-full h-32 bg-black/40 border border-white/5 p-4 font-mono text-sm text-emerald-400 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
                  placeholder="Binary output..."
                />
                <button
                  onClick={() => copyToClipboard(binaryOutput)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-white transition-colors"
                >
                  <CopySimpleIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AsciiConverterPage;
