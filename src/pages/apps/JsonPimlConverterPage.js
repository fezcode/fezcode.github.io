import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  WarningIcon,
  ArrowsLeftRightIcon,
  CodeIcon,
  XCircleIcon
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import piml from 'piml';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';

function JsonPimlConverterPage() {
  const appName = 'JSON - PIML';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Bilateral conversion protocol between JSON and PIML data formats.',
    keywords: ['Fezcodex', 'JSON', 'PIML', 'converter', 'data format'],
  });

  const { addToast } = useToast();
  const [jsonInput, setJsonInput] = useState('');
  const [pimlInput, setPimlInput] = useState('');
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');

  const handleJsonToPiml = () => {
    setSelectedFormat('PIML');
    try {
      const json = JSON.parse(jsonInput);
      const pimlOutput = piml.stringify(json);
      setOutput(pimlOutput);
      setErrorMsg('');
      addToast({ title: 'Conversion Success', message: 'Data mapped to PIML structure.', type: 'success' });
    } catch (error) {
      addToast({ title: 'Parsing Error', message: 'Input does not conform to JSON standards.', type: 'error' });
      setOutput('');
      setErrorMsg(error.toString());
    }
  };

  const handlePimlToJson = () => {
    setSelectedFormat('JSON');
    try {
      const jsonOutput = piml.parse(pimlInput);
      setOutput(JSON.stringify(jsonOutput, null, 2));
      setErrorMsg('');
      addToast({ title: 'Conversion Success', message: 'Data mapped to JSON structure.', type: 'success' });
    } catch (error) {
      addToast({ title: 'Parsing Error', message: 'Input does not conform to PIML standards.', type: 'error' });
      setOutput('');
      setErrorMsg(error.toString());
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      addToast({ title: 'Copied', message: `${selectedFormat} payload stored in clipboard.`, duration: 2000 });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-20">
          <Link to="/apps" className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none uppercase">
                {appName}
              </h1>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Bilateral translation layer for structural data objects.
              </p>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-sm max-w-xs">
               <div className="flex items-start gap-3">
                  <WarningIcon size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider leading-relaxed">
                     PIML protocol is in active development. Structural parity between JSON and PIML may vary.
                  </p>
               </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Input Section */}
          <div className="space-y-12">
             <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                   <GenerativeArt seed="JSON_INPUT" className="w-full h-full" />
                </div>
                <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <CodeIcon weight="fill" className="text-emerald-500" />
                   JSON_Source
                </h3>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-64 bg-black/40 border border-white/5 p-4 font-mono text-sm text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
                  placeholder="Insert valid JSON payload..."
                />
                <button
                  onClick={handleJsonToPiml}
                  className="mt-6 w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-sm flex items-center justify-center gap-3"
                >
                  <ArrowsLeftRightIcon weight="bold" size={18} />
                  Translate to PIML
                </button>
             </div>

             <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                   <GenerativeArt seed="PIML_INPUT" className="w-full h-full" />
                </div>
                <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <CodeIcon weight="fill" className="text-emerald-500" />
                   PIML_Source
                </h3>
                <textarea
                  value={pimlInput}
                  onChange={(e) => setPimlInput(e.target.value)}
                  className="w-full h-64 bg-black/40 border border-white/5 p-4 font-mono text-sm text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
                  placeholder="Insert PIML character sequence..."
                />
                <button
                  onClick={handlePimlToJson}
                  className="mt-6 w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-sm flex items-center justify-center gap-3"
                >
                  <ArrowsLeftRightIcon weight="bold" size={18} />
                  Translate to JSON
                </button>
             </div>
          </div>

          {/* Results Section */}
          <div className="space-y-12">
             <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />
                <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <CodeIcon weight="fill" className="text-emerald-500" />
                   Output_Buffer {selectedFormat && `:: ${selectedFormat}`}
                </h3>
                <textarea
                  value={output}
                  readOnly
                  className="flex-grow w-full bg-black/40 border border-white/5 p-4 font-mono text-sm text-emerald-400 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide mb-6"
                  placeholder="Transmission output will appear here..."
                />

                <AnimatePresence>
                   {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 p-4 border border-rose-500/20 bg-rose-500/5 text-rose-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-3"
                      >
                         <XCircleIcon size={16} weight="bold" />
                         <span>{errorMsg}</span>
                      </motion.div>
                   )}
                </AnimatePresence>

                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  className="w-full py-4 border border-white/10 text-gray-500 hover:text-white hover:border-white hover:bg-white/5 transition-all font-mono uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <CopySimpleIcon weight="bold" size={18} />
                  Stage to Clipboard
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default JsonPimlConverterPage;
