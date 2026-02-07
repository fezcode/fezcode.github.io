import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArticleIcon,
  ArrowsClockwiseIcon,
  CopySimpleIcon,
  TextTIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';

const LOREM_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'ut',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'ut',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'dolor',
  'in',
  'reprehenderit',
  'in',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'dolore',
  'eu',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'in',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
];

const LoremIpsumGeneratorPage = () => {
  const appName = 'Lorem Ipsum Generator';

  const { addToast } = useToast();
  const [paragraphs, setParagraphs] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');

  const generateText = () => {
    let text = [];
    for (let i = 0; i < paragraphs; i++) {
      const numSentences = Math.floor(Math.random() * 5) + 3; // 3 to 7 sentences
      let paragraph = [];

      for (let j = 0; j < numSentences; j++) {
        const numWords = Math.floor(Math.random() * 10) + 5; // 5 to 14 words
        let sentence = [];
        for (let k = 0; k < numWords; k++) {
          const word =
            LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
          sentence.push(word);
        }
        // Capitalize first letter
        sentence[0] =
          sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
        paragraph.push(sentence.join(' ') + '.');
      }
      text.push(paragraph.join(' '));
    }

    let finalResult = text.join('\n\n');

    if (startWithLorem) {
      const prefix =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
      // Simple check to avoid double generating if random chance made it similar
      if (!finalResult.startsWith('Lorem')) {
        finalResult = prefix + finalResult;
      }
    }

    setGeneratedText(finalResult);
  };

  // Initial generation
  React.useEffect(() => {
    generateText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
      addToast({
        title: 'Copied',
        message: 'Placeholder text stored in clipboard.',
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Lorem Ipsum Generator | Fezcodex"
        description="Generate random placeholder text for your projects."
        keywords={[
          'Fezcodex',
          'lorem ipsum',
          'text generator',
          'placeholder text',
          'dummy text',
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
                title={appName}
                slug="lorem"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Standardized filler protocol. Generate pseudo-Latin data blocks
                for structural layout verification.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Interaction Area */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={appName + paragraphs}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <TextTIcon weight="fill" /> Paragraph_Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={paragraphs}
                      onChange={(e) =>
                        setParagraphs(parseInt(e.target.value) || 1)
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-4 font-mono text-xl text-white focus:border-emerald-500/50 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      Standard_Prefix
                    </label>
                    <button
                      onClick={() => setStartWithLorem(!startWithLorem)}
                      className={`w-full p-4 border rounded-sm flex items-center justify-between transition-all ${
                        startWithLorem
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                          : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <span className="font-mono text-xs uppercase tracking-wider">
                        Start with "Lorem ipsum..."
                      </span>
                      {startWithLorem ? (
                        <ToggleRightIcon size={24} weight="fill" />
                      ) : (
                        <ToggleLeftIcon size={24} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={generateText}
                  className="w-full group relative inline-flex items-center justify-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm"
                >
                  <ArrowsClockwiseIcon
                    weight="bold"
                    size={20}
                    className="group-hover:rotate-180 transition-transform duration-500"
                  />
                  <span>Generate Sequence</span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {generatedText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="relative group border border-emerald-500/20 bg-emerald-500/[0.02] p-8 md:p-12 rounded-sm overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-6 border-b border-emerald-500/10 pb-6">
                    <label className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center gap-2">
                      <span className="h-px w-4 bg-emerald-500/20" />{' '}
                      Output_Stream
                    </label>
                    <button
                      onClick={copyToClipboard}
                      className="text-emerald-500 hover:text-white transition-colors"
                    >
                      <CopySimpleIcon size={24} weight="bold" />
                    </button>
                  </div>
                  <div className="font-serif text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
                    {generatedText}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <ArticleIcon weight="fill" />
                Generator_Specs
              </h3>

              <div className="space-y-6">
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                  <span className="font-mono text-[10px] text-gray-600 uppercase block mb-2">
                    Source_Dialect
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    Pseudo-Latin_V1
                  </p>
                </div>
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                  <span className="font-mono text-[10px] text-gray-600 uppercase block mb-2">
                    Word_Bank_Size
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    {LOREM_WORDS.length} Units
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <TextTIcon size={24} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Lorem Ipsum is industry-standard dummy text used to demonstrate
                the visual form of a document without the distraction of
                meaningful content.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Text_Synthesizer_v2.0</span>
          <span className="text-gray-800">STREAM_STATUS // NOMINAL</span>
        </footer>
      </div>
    </div>
  );
};

export default LoremIpsumGeneratorPage;
