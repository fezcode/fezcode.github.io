import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ColumnsIcon,
  FileSearchIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { diff_match_patch } from 'diff-match-patch';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const dmp = new diff_match_patch();

function TextDiffCheckerPage() {
  const appName = 'Diff Checker';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Protocol for comparing data sequences and identifying structural variations.',
    keywords: [
      'Fezcodex',
      'text diff',
      'diff checker',
      'text comparison',
      'code diff',
    ],
  });

  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diffOutput, setDiffOutput] = useState([]);

  const computeDiff = useCallback(() => {
    if (!textA && !textB) {
      setDiffOutput([]);
      return;
    }
    const diffs = dmp.diff_main(textA, textB);
    dmp.diff_cleanupSemantic(diffs);
    setDiffOutput(diffs);
  }, [textA, textB]);

  useEffect(() => {
    computeDiff();
  }, [textA, textB, computeDiff]);

  const DIFF_DELETE = -1;
  const DIFF_INSERT = 1;

  const renderDiff = () => {
    return diffOutput.map((part, i) => {
      const [type, text] = part;
      let className = 'transition-all duration-300 ';

      switch (type) {
        case DIFF_INSERT:
          className +=
            'bg-emerald-500/20 text-emerald-400 border-b border-emerald-500/30 font-bold';
          break;
        case DIFF_DELETE:
          className += 'bg-red-500/20 text-red-400 line-through opacity-60';
          break;
        default:
          className += 'text-gray-400';
          break;
      }

      return (
        <span key={i} className={className}>
          {text.split('\n').map((item, key) => (
            <React.Fragment key={key}>
              {item}
              {key < text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    });
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
              <BreadcrumbTitle title="Diff Checker" slug="tdc" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Structural variance analyzer. Compare two data streams to
                identify deletions, insertions, and modifications.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Areas */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <span className="h-px w-4 bg-gray-800" /> Source_A :: Original
              </label>
              <textarea
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                placeholder="Insert baseline sequence..."
                className="w-full h-64 p-8 bg-white/[0.02] border border-white/10 rounded-sm font-mono text-sm focus:border-emerald-500/50 focus:ring-0 transition-all resize-none"
              />
            </div>
            <div className="space-y-4">
              <label className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest flex items-center gap-2 font-black">
                <span className="h-px w-4 bg-emerald-500/20" /> Source_B ::
                Modified
              </label>
              <textarea
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                placeholder="Insert comparison sequence..."
                className="w-full h-64 p-8 bg-white/[0.02] border border-white/10 rounded-sm font-mono text-sm focus:border-emerald-500/50 focus:ring-0 transition-all resize-none"
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={appName + textA.length + textB.length}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <FileSearchIcon weight="fill" />
                    Structural_Variance_Map
                  </h3>
                  <div className="flex items-center gap-6 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500/40" /> Insertion
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500/40" /> Deletion
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 p-8 rounded-sm font-mono text-sm leading-relaxed min-h-[200px] border border-white/5 shadow-inner">
                  {diffOutput.length > 0 ? (
                    renderDiff()
                  ) : (
                    <span className="text-gray-700 uppercase tracking-widest text-xs">
                      Waiting for data comparison...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12">
            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-6">
              <ColumnsIcon size={32} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-sm font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500 max-w-4xl">
                The analysis engine uses Google's Diff-Match-Patch algorithm to
                map character-level variations between sequences. This protocol
                ensures high precision identification of semantic changes.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Variance_Engine_v0.6.1</span>
          <span className="text-gray-800">ANALYSIS_CORE // ACTIVE</span>
        </footer>
      </div>
    </div>
  );
}

export default TextDiffCheckerPage;
