import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  TranslateIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const latinToGokturkMap = {
  A: '𐰀',
  E: '𐰀',
  I: '𐰃',
  İ: '𐰃',
  O: '𐰆',
  U: '𐰆',
  Ö: '𐰇',
  Ü: '𐰇',
  B: '𐰉',
  C: '𐰲',
  Ç: '𐰲',
  D: '𐰑',
  F: '𐰯', // Approx
  G: '𐰍',
  Ğ: '𐰍',
  H: '𐰴', // Approx
  J: '𐰲', // Approx
  K: '𐰴',
  L: '𐰞',
  M: '𐰢',
  N: '𐰣',
  P: '𐰯',
  R: '𐰺',
  S: '𐰽',
  Ş: '𐱁',
  T: '𐱃',
  V: '𐰉', // Approx
  Y: '𐰖',
  Z: '𐰕',
  ' ': ':', // Word separator
  '.': '',
  ',': '',
};

const gokturkToLatinMap = Object.entries(latinToGokturkMap).reduce(
  (acc, [key, value]) => {
    if (!acc[value] && key !== '.' && key !== ',') {
      acc[value] = key;
    }
    return acc;
  },
  {},
);
// Manual overrides for better reverse mapping if needed
gokturkToLatinMap[':'] = ' ';

function GokturkishConverterPage() {
  const [inputText, setInputText] = useState('');
  const [gokturkOutput, setGokturkOutput] = useState('');
  const { addToast } = useToast();

  const toGokturk = () => {
    try {
      const converted = inputText
        .toUpperCase()
        .split('')
        .map((char) => latinToGokturkMap[char] || char)
        .join('');
      // Göktürk is written right-to-left, but usually rendered left-to-right in modern contexts unless handled by font/renderer.
      // Standard Unicode Göktürk is Right-to-Left.
      // Let's reverse the string to simulate RTL writing if rendered LTR
      // But actually, let's keep it simple LTR mapping first, or check if we should reverse.
      // Usually simple converters just map chars. Let's stick to map.
      // However, traditionally it's written Right to Left.
      // Let's add an option or just reverse it by default?
      // Let's just map for now.

      setGokturkOutput(converted);
      addToast({
        title: 'Success',
        message: 'Text converted to Göktürk script.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to convert.',
        type: 'error',
      });
    }
  };

  const toLatin = () => {
    try {
      const converted = inputText
        .split('')
        .map((char) => gokturkToLatinMap[char] || char)
        .join('');
      setGokturkOutput(converted);
      addToast({
        title: 'Success',
        message: 'Göktürk script converted to Latin.',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to convert.',
        type: 'error',
      });
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      addToast({
        title: 'Copied',
        message: 'Text stored in clipboard.',
        duration: 2000,
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Göktürk Converter | Fezcodex"
        description="Convert text between Latin and Göktürk (Orkhon) script."
        keywords={[
          'Fezcodex',
          'Göktürk converter',
          'Orkhon script',
          'Old Turkic',
          'Turkish converter',
        ]}
      />
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
              <BreadcrumbTitle
                title="Göktürk Converter"
                slug="gokturk"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Ancient script protocol. Translate modern text into the runic
                alphabet of the Göktürks.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed="GOKTURK_INPUT" className="w-full h-full" />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <TranslateIcon weight="fill" className="text-emerald-500" />
                Input_Buffer
              </h3>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-64 bg-black/40 border border-white/5 p-6 font-mono text-sm text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
                placeholder="Insert text..."
              />

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={toGokturk}
                  className="py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all"
                >
                  To Göktürk
                </button>
                <button
                  onClick={toLatin}
                  className="py-3 border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                >
                  To Latin
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden flex flex-col h-full">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <TranslateIcon weight="fill" className="text-emerald-500" />
                Output_Sequence
              </h3>
              <div className="relative flex-grow">
                <textarea
                  value={gokturkOutput}
                  readOnly
                  className="w-full h-full min-h-[300px] bg-black/40 border border-white/5 p-4 font-mono text-lg text-emerald-400 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
                  placeholder="Output..."
                  style={{ fontFamily: 'sans-serif' }} // Ensure unicode chars render if font supports
                />
                <button
                  onClick={() => copyToClipboard(gokturkOutput)}
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

export default GokturkishConverterPage;
