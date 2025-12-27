import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TranslateIcon,
  PenNibIcon,
  NotebookIcon,
  CopyIcon,
  CheckIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const SHORTHAND_MAP = {
  a: 'ᐱ',
  b: 'ᗷ',
  c: 'ᑕ',
  d: 'ᗪ',
  e: 'ᐦ',
  f: 'ᖴ',
  g: 'ᘏ',
  h: 'ᕼ',
  i: 'ᐃ',
  j: 'ᒧ',
  k: 'ᔘ',
  l: 'ᐳ',
  m: 'ᒄ',
  n: 'ᓀ',
  o: 'ᐤ',
  p: 'ᐯ',
  q: 'ᕟ',
  r: 'ᕃ',
  s: 'ᔆ',
  t: 'ᑎ',
  u: 'ᑌ',
  v: 'ᐪ',
  w: 'ᐎ',
  x: 'ᕁ',
  y: 'ᔅ',
  z: 'ᙆ',
  A: 'ᐱ',
  B: 'ᗷ',
  C: 'ᑕ',
  D: 'ᗪ',
  E: 'ᐦ',
  F: 'ᖴ',
  G: 'ᘏ',
  H: 'ᕼ',
  I: 'ᐃ',
  J: 'ᒧ',
  K: 'ᔘ',
  L: 'ᐳ',
  M: 'ᒄ',
  N: 'ᓀ',
  O: 'ᐤ',
  P: 'ᐯ',
  Q: 'ᕟ',
  R: 'ᕃ',
  S: 'ᔆ',
  T: 'ᑎ',
  U: 'ᑌ',
  V: 'ᐪ',
  W: 'ᐎ',
  X: 'ᕁ',
  Y: 'ᔅ',
  Z: 'ᙆ',
  1: 'ᐘ',
  2: 'ᐙ',
  3: 'ᐚ',
  4: 'ᐛ',
  5: 'ᐜ',
  6: 'ᐝ',
  7: 'ᐞ',
  8: 'ᐟ',
  9: 'ᐠ',
  0: 'ᐡ',
  ' ': ' ',
  '.': '᙮',
  ',': 'ᙵ',
  '?': 'ᙶ',
  '!': 'ᙷ',
};

const REVERSE_SHORTHAND_MAP = Object.fromEntries(
  Object.entries(SHORTHAND_MAP).map(([key, value]) => [
    value,
    key.toLowerCase(),
  ]),
);

const FezGlyphPage = () => {
  const appName = 'FezGlyph';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Transform text into the cryptic Fezcodex symbolic cipher.',
    keywords: [
      'Fezcodex',
      'fezglyph',
      'symbols',
      'cipher',
      'converter',
      'runes',
    ],
  });

  const { addToast } = useToast();
  const [text, setText] = useState('');
  const [shorthand, setShorthand] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    const newShorthand = newText
      .split('')
      .map((char) => SHORTHAND_MAP[char] || char)
      .join('');
    setShorthand(newShorthand);
  };

  const handleShorthandChange = (e) => {
    const newShorthand = e.target.value;
    setShorthand(newShorthand);
    const newText = newShorthand
      .split('')
      .map((char) => REVERSE_SHORTHAND_MAP[char] || char)
      .join('');
    setText(newText);
  };

  const handleSymbolClick = (char, symbol) => {
    const newShorthand = shorthand + symbol;
    setShorthand(newShorthand);
    // Find the reverse mapping for the symbol.
    // Note: char passed here is the key from SHORTHAND_MAP (e.g. 'a'), which is what we want.
    // However, we need to respect the reverse logic: symbol -> char.
    // Since we know the pair (char, symbol), we can just append char.
    // But let's stick to the reverse map to be safe and consistent with typing.
    const mappedChar = REVERSE_SHORTHAND_MAP[symbol] || char;
    setText(text + mappedChar);
  };

  const handleCopy = async () => {
    if (!shorthand) return;
    try {
      await navigator.clipboard.writeText(shorthand);
      setIsCopied(true);
      addToast({
        title: 'Success',
        message: 'FezGlyph copied to clipboard',
        type: 'success',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      addToast({
        title: 'Error',
        message: 'Failed to copy',
        type: 'error',
      });
    }
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
              <BreadcrumbTitle
                title="FezGlyph"
                slug="fezglyph"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Proprietary symbolic cipher. Encrypt plaintext into the
                geometric Fezcodex rune system.
              </p>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <GenerativeArt seed="TEXT_INPUT" className="w-full h-full" />
            </div>
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <NotebookIcon weight="fill" className="text-emerald-500" />
              Plaintext_Input
            </h3>
            <textarea
              value={text}
              onChange={handleTextChange}
              className="w-full h-64 bg-black/40 border border-white/5 p-6 font-mono text-xl text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
              placeholder="Type your message here..."
            />
          </div>

          <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <GenerativeArt seed="SYMBOL_OUTPUT" className="w-full h-full" />
            </div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <PenNibIcon weight="fill" className="text-emerald-500" />
                FezGlyph_Output
              </h3>
              <button
                onClick={handleCopy}
                disabled={!shorthand}
                className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCopied ? (
                  <>
                    <CheckIcon weight="bold" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon weight="bold" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              value={shorthand}
              onChange={handleShorthandChange}
              className="w-full h-64 bg-black/40 border border-white/5 p-6 font-mono text-2xl text-emerald-400 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
              placeholder="ᐱᐦᗆᐤᗪ..."
            />
          </div>
        </div>
        {/* Legend */}
        <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
          <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <TranslateIcon weight="fill" className="text-emerald-500" />
            Symbol_Legend
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {Object.entries(SHORTHAND_MAP)
              .filter(([k]) => k.length === 1 && /[a-z0-9]/.test(k))
              .map(([char, symbol]) => (
                <button
                  key={char}
                  onClick={() => handleSymbolClick(char, symbol)}
                  className="flex items-center justify-between p-3 border border-white/5 bg-black/20 rounded-sm hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <span className="font-mono text-gray-400 group-hover:text-emerald-400 transition-colors">
                    {char}
                  </span>
                  <span className="text-emerald-400 text-xl">{symbol}</span>
                </button>
              ))}
          </div>
        </div>
        {/* About Section */}
        <div className="mt-12 border border-white/10 bg-white/[0.02] p-8 rounded-sm">
          <h3 className="font-playfairDisplay text-lg font-bold text-gray-300 mb-6 flex items-center gap-2">
            <NotebookIcon weight="fill" className="text-emerald-500" />
            About FezGlyph
          </h3>
          <div className="prose prose-invert max-w-none font-arvo">
            <p className="text-gray-400 font-light leading-relaxed mb-4">
              The symbols used in <strong>FezGlyph</strong> are technically
              known as <strong>Canadian Aboriginal Syllabics</strong>. Their
              inclusion here is purely for visual and aesthetic purposes within
              this digital art project, and we intend absolutely no disrespect
              toward the Indigenous communities, their histories, or the sacred
              nature of their scripts.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400 font-light">
              <li>
                <strong>Origin:</strong> Developed in the 1840s by James Evans
                in collaboration with Indigenous speakers.
              </li>
              <li>
                <strong>Usage:</strong> A family of writing systems used by
                several Indigenous peoples in Canada (such as the Cree, Ojibwe,
                and Inuit).
              </li>
              <li>
                <strong>Context:</strong> While used here as a simple
                substitution cipher for their geometric aesthetic, in reality,
                they form a syllabary where each symbol represents a specific
                sound combination (like "ma", "ni", "po").
              </li>
            </ul>
          </div>
        </div>{' '}
      </div>
    </div>
  );
};

export default FezGlyphPage;
