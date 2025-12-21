import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BaseballHelmetIcon,
  BroomIcon,
  CopySimpleIcon,
  InfoIcon,
  ShieldCheckIcon,
  TaxiIcon,
  FileCodeIcon
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import formatMarkdownTable from '../../utils/markdownUtils';
import { useSidePanel } from '../../context/SidePanelContext';
import GenerativeArt from '../../components/GenerativeArt';

const MarkdownTableFormatterPage = () => {
  const appName = 'Markdown Table Formatter';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Format your markdown tables into clean, readable structures.',
    keywords: ['Fezcodex', 'md', 'markdown', 'table', 'formatter'],
    ogTitle: `${appName} | Fezcodex`,
    ogDescription: 'Format your markdown tables into clean, readable structures.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: `${appName} | Fezcodex`,
    twitterDescription: 'Format your markdown tables into clean, readable structures.',
    twitterImage: '/images/ogtitle.png',
  });

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { addToast } = useToast();
  const { openSidePanel } = useSidePanel();

  const ReasonComponent = () => {
    return (
      <div className="space-y-8 font-mono">
        <div className="flex items-center justify-center gap-4 py-8 border-y border-white/10">
          <TaxiIcon size={32} weight="fill" className="text-yellow-500" />
          <h2 className="text-white text-xl font-black uppercase tracking-widest text-center">
            Origins // Taxi Driver
          </h2>
          <TaxiIcon size={32} weight="fill" className="text-yellow-500" />
        </div>
        <div className="space-y-6">
          <p className="text-sm text-gray-400 leading-relaxed uppercase tracking-wider">
            Created after watching Taxi Driver (1976). While writing a review, I realized that manual Markdown Table creation is an exercise in futility.
          </p>
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-sm">
             <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]">
                System Log: 05:00 AM // Development Complete
             </p>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed uppercase tracking-wider">
            This tool ensures perfectly aligned pipes and consistent spacing, so you can focus on the content, not the syntax.
          </p>
        </div>
      </div>
    );
  };

  const convertMarkdownTable = () => {
    try {
      if (!inputText.trim()) {
        setOutputText('');
        return;
      }
      let formattedTable = formatMarkdownTable(inputText);
      setOutputText(formattedTable);
      addToast({
        title: 'Success',
        message: 'Table formatted successfully.',
        duration: 2000,
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to format given markdown table text.',
        duration: 3000,
      });
      setOutputText('');
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        addToast({
          title: 'Success',
          message: 'Copied to clipboard!',
          duration: 2000,
        });
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
              <BreadcrumbTitle
                title={appName}
                slug="mtf"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Structural integrity for your documentation. Transform messy table syntax into perfectly aligned blocks.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Controls & Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <FileCodeIcon weight="fill" />
                Actions
              </h3>

              <div className="space-y-4">
                <button
                  onClick={convertMarkdownTable}
                  className="w-full py-4 bg-white text-black hover:bg-emerald-500 hover:text-black transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <BaseballHelmetIcon size={20} weight="bold" />
                  Format Table
                </button>

                <button
                  onClick={() => { setInputText(''); setOutputText(''); }}
                  className="w-full py-3 border border-white/10 hover:border-red-500 hover:text-red-500 text-gray-500 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <BroomIcon size={16} weight="bold" />
                  Clear Data
                </button>
              </div>

              <div className="pt-8 border-t border-white/5">
                <button
                  onClick={() =>
                    openSidePanel(
                      'WHY_THIS_TOOL?',
                      <ReasonComponent />,
                      400,
                    )
                  }
                  className="w-full text-left font-mono text-[10px] text-gray-500 hover:text-white uppercase tracking-widest flex items-center justify-between group"
                >
                  <span>View Documentation / History</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">-></span>
                </button>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <InfoIcon size={24} className="text-gray-700 shrink-0" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                The algorithm aligns columns by calculating the maximum character width of each cell across all rows.
              </p>
            </div>
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed="md-formatter" className="w-full h-full" />
              </div>

              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-px w-4 bg-gray-800" /> Input Markdown
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your unformatted markdown table here..."
                    className="w-full h-48 p-8 bg-black/40 border border-white/5 rounded-sm font-mono text-sm leading-relaxed focus:border-emerald-500/50 focus:ring-0 transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="relative group/output">
                  <div className="flex justify-between items-center mb-6">
                    <label className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center gap-2">
                      <span className="h-px w-4 bg-emerald-500/20" /> Result
                    </label>
                    <button
                      onClick={() => copyToClipboard(outputText)}
                      disabled={!outputText}
                      className="text-emerald-500 hover:text-white transition-colors disabled:opacity-0"
                    >
                      <CopySimpleIcon size={24} weight="bold" />
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={outputText}
                    placeholder="Waiting for input..."
                    className={`w-full h-64 p-8 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-sm font-mono text-xs whitespace-pre overflow-x-auto resize-none transition-colors duration-500 focus:outline-none ${outputText ? 'text-white' : 'text-gray-800'}`}
                  />
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <ShieldCheckIcon size={32} className="text-emerald-500/50" />
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Formatting Engine: v2.4.0-STABLE</span>
              </div>
            </div>
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_MD_Table_Formatter_v1.2.4</span>
          <span className="text-gray-800">PIPES // ALIGNED</span>
        </footer>
      </div>
    </div>
  );
};

export default MarkdownTableFormatterPage;
