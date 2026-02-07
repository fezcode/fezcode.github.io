import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TextAaIcon, CodeIcon } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import BrutalistOutputCard from '../../components/BrutalistOutputCard';

function CaseConverterPage() {
  const [inputText, setInputText] = useState('');
  const { addToast } = useToast();

  const convertToUpperCase = () => inputText.toUpperCase();
  const convertToLowerCase = () => inputText.toLowerCase();
  const convertToTitleCase = () =>
    inputText.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  const convertToPascalCase = () =>
    inputText
      .toLowerCase()
      .replace(/(?:^|\s+)([a-z])/g, (_, char) => char.toUpperCase())
      .replace(/\s+/g, '');
  const convertToCamelCase = () => {
    const pascal = convertToPascalCase();
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  };
  const convertToSnakeCase = () => inputText.toLowerCase().replace(/\s+/g, '_');
  const convertToKebabCase = () => inputText.toLowerCase().replace(/\s+/g, '-');
  const convertToSentenceCase = () =>
    inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase();

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
      <Seo
        title="Case Converter | Fezcodex"
        description="Transform text case into various structural formats."
        keywords={[
          'Fezcodex',
          'case converter',
          'uppercase',
          'lowercase',
          'camelcase',
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
                title="Case Converter"
                slug="cc"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
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
              <BrutalistOutputCard
                title="Uppercase"
                description="ALL CHARACTERS CAPITALIZED"
                value={convertToUpperCase()}
                onCopy={copyToClipboard}
              />
              <BrutalistOutputCard
                title="Lowercase"
                description="all characters lowercase"
                value={convertToLowerCase()}
                onCopy={copyToClipboard}
              />
              <BrutalistOutputCard
                title="Title Case"
                description="Capitalize Every Word"
                value={convertToTitleCase()}
                onCopy={copyToClipboard}
              />
              <BrutalistOutputCard
                title="Sentence Case"
                description="Capitalize only the first word"
                value={convertToSentenceCase()}
                onCopy={copyToClipboard}
              />
              <BrutalistOutputCard
                title="Camel Case"
                description="lowerCaseThenCapitalize"
                value={convertToCamelCase()}
                onCopy={copyToClipboard}
              />
              <BrutalistOutputCard
                title="Pascal Case"
                description="CapitalizeEveryWordNoSpaces"
                value={convertToPascalCase()}
                onCopy={copyToClipboard}
              />
              <BrutalistOutputCard
                title="Snake Case"
                description="lowercase_with_underscores"
                value={convertToSnakeCase()}
                onCopy={copyToClipboard}
              />
              <BrutalistOutputCard
                title="Kebab Case"
                description="lowercase-with-hyphens"
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

export default CaseConverterPage;
