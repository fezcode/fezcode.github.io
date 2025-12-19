import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TextAaIcon,
  CodeIcon,
  CopySimpleIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';

function CaseConverterPage() {
  const appName = 'Case Converter';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Transform text case into various structural formats.',
    keywords: [
      'Fezcodex',
      'case converter',
      'uppercase',
      'lowercase',
      'camelcase',
    ],
  });

  const [inputText, setInputText] = useState('');
  const { addToast } = useToast();

  const convertToUpperCase = () => inputText.toUpperCase();
  const convertToLowerCase = () => inputText.toLowerCase();
  const convertToTitleCase = () =>
    inputText.replace(/\b\w/g, (char) => char.toUpperCase());
  const convertToCamelCase = () =>
    inputText
      .replace(/(?:^|\s)([a-zA-Z])/g, (_, char) => char.toUpperCase())
      .replace(/\s+/g, '');
  const convertToSnakeCase = () => inputText.toLowerCase().replace(/\s+/g, '_');
  const convertToKebabCase = () => inputText.toLowerCase().replace(/\s+/g, '-');

  const copyToClipboard = (text) => {
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
                Text transformation protocol. Map character strings to specific
                case conventions.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Module */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed="CASE_INPUT" className="w-full h-full" />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <TextAaIcon weight="fill" className="text-emerald-500" />
                Input_Buffer
              </h3>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-64 bg-black/40 border border-white/5 p-6 font-mono text-lg text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
                placeholder="Insert plaintext sequence..."
              />
            </div>
          </div>

          {/* Outputs Column */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <CodeIcon weight="fill" className="text-emerald-500" />
              Transformed_States
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CaseOutput
                title="Uppercase"
                value={convertToUpperCase()}
                onCopy={copyToClipboard}
              />
              <CaseOutput
                title="Lowercase"
                value={convertToLowerCase()}
                onCopy={copyToClipboard}
              />
              <CaseOutput
                title="Title Case"
                value={convertToTitleCase()}
                onCopy={copyToClipboard}
              />
              <CaseOutput
                title="Camel Case"
                value={convertToCamelCase()}
                onCopy={copyToClipboard}
              />
              <CaseOutput
                title="Snake Case"
                value={convertToSnakeCase()}
                onCopy={copyToClipboard}
              />
              <CaseOutput
                title="Kebab Case"
                value={convertToKebabCase()}
                onCopy={copyToClipboard}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CaseOutput = ({ title, value, onCopy }) => (
  <div className="flex flex-col gap-2 p-4 border border-white/10 bg-white/[0.01] rounded-sm group relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/0 group-hover:bg-emerald-500/30 transition-all" />
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-mono font-bold text-gray-600 uppercase tracking-widest">
        {title}
      </span>
      <button
        onClick={() => onCopy(value)}
        className="text-gray-600 hover:text-emerald-400 transition-colors"
        title="Copy Output"
      >
        <CopySimpleIcon size={14} weight="bold" />
      </button>
    </div>
    <div className="font-mono text-sm text-gray-300 break-all line-clamp-2 min-h-[2.5rem]">
      {value || <span className="opacity-10">---</span>}
    </div>
  </div>
);

export default CaseConverterPage;
