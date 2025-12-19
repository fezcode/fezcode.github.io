import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UploadSimpleIcon,
  FileTextIcon,
  TextAaIcon,
  ParagraphIcon,
  RowsIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';

function WordCounterPage() {
  const appName = 'Word Counter';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Protocol for linguistic decomposition and character mapping.',
    keywords: [
      'Fezcodex',
      'word counter',
      'character counter',
      'line counter',
      'text analysis',
    ],
  });

  const [text, setText] = useState('');
  const [counts, setCounts] = useState({
    words: 0,
    characters: 0,
    lines: 0,
    paragraphs: 0,
  });
  const { addToast } = useToast();

  const handleTextChange = (newText) => {
    setText(newText);
    const lineCount = newText.length === 0 ? 0 : newText.split('\n').length;
    const wordCount = newText.trim().split(/\s+/).filter(Boolean).length;
    const charCount = newText.length;
    const paragraphCount = newText
      .trim()
      .split(/\n\s*\n/)
      .filter(Boolean).length;
    setCounts({
      words: wordCount,
      characters: charCount,
      lines: lineCount,
      paragraphs: paragraphCount,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleTextChange(e.target.result);
        addToast({
          title: 'Success',
          message: `Data stream '${file.name}' integrated successfully.`,
          duration: 3000,
        });
      };
      reader.onerror = () => {
        addToast({
          title: 'Error',
          message: 'Failed to read the file sequence.',
          type: 'error',
          duration: 3000,
        });
      };
      reader.readAsText(file);
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
                Linguistic analysis engine. Map character density, word
                frequency, and structural attributes of your data stream.
              </p>
            </div>

            <label className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm cursor-pointer shrink-0">
              <UploadSimpleIcon weight="bold" size={24} />
              <span>Import Source</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".txt,.md,.html,.js,.css"
              />
            </label>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Editor Area */}
          <div className="lg:col-span-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale group-hover:opacity-[0.05] transition-opacity duration-700">
                <GenerativeArt
                  seed={appName + text.length}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 space-y-6">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="h-px w-4 bg-gray-800" /> Data_Input_Stream
                </label>
                <textarea
                  className="w-full h-96 p-8 bg-black/40 border border-white/5 rounded-sm font-mono text-sm leading-relaxed focus:border-emerald-500/50 focus:ring-0 transition-all resize-none custom-scrollbar-terminal shadow-inner"
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Insert plaintext sequence or import a source file for analysis..."
                />
              </div>
            </div>
          </div>

          {/* Metrics Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <FileTextIcon weight="fill" />
                Structural_Metrics
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <MetricItem
                  icon={TextAaIcon}
                  label="Words"
                  value={counts.words}
                />
                <MetricItem
                  icon={TextAaIcon}
                  label="Characters"
                  value={counts.characters}
                />
                <MetricItem
                  icon={RowsIcon}
                  label="Lines"
                  value={counts.lines}
                />
                <MetricItem
                  icon={ParagraphIcon}
                  label="Paragraphs"
                  value={counts.paragraphs}
                />
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Linguistic mapping provides structural insight into data density
                and complexity. Ideal for calibrating text sequences for optimal
                human processing.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Linguistic_Module_v0.6.1</span>
          <span className="text-gray-800">DATA_CORE // READY</span>
        </footer>
      </div>
    </div>
  );
}

const MetricItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between border-b border-white/5 pb-4 transition-colors hover:border-white/10 group">
    <div className="flex items-center gap-3">
      <Icon
        size={18}
        className="text-gray-600 group-hover:text-emerald-500 transition-colors"
      />
      <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
        {label}
      </span>
    </div>
    <span className="text-2xl font-black text-white">{value}</span>
  </div>
);

export default WordCounterPage;
