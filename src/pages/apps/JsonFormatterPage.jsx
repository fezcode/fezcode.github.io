import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BracketsCurlyIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const JsonFormatterPage = () => {
  const appName = 'JSON Formatter';

  const { addToast } = useToast();
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(null);

  const formatJson = useCallback(() => {
    setValidationMessage('');
    setIsValid(null);
    if (!jsonInput.trim()) {
      setJsonOutput('');
      addToast({
        title: 'Info',
        message: 'Insert JSON sequence for processing.',
      });
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setIsValid(true);
      addToast({ title: 'Success', message: 'Data structure optimized.' });
    } catch (error) {
      setJsonOutput('');
      setIsValid(false);
      setValidationMessage(error.message);
      addToast({
        title: 'Error',
        message: 'Structural corruption detected.',
        type: 'error',
      });
    }
  }, [jsonInput, addToast]);

  const validateJson = useCallback(() => {
    setJsonOutput('');
    if (!jsonInput.trim()) {
      setIsValid(null);
      addToast({
        title: 'Info',
        message: 'Insert JSON sequence for validation.',
      });
      return;
    }
    try {
      JSON.parse(jsonInput);
      setIsValid(true);
      setValidationMessage('Sequence verified. No errors found.');
      addToast({ title: 'Verified', message: 'JSON integrity confirmed.' });
    } catch (error) {
      setIsValid(false);
      setValidationMessage(error.message);
      addToast({
        title: 'Error',
        message: 'Validation failed.',
        type: 'error',
      });
    }
  }, [jsonInput, addToast]);

  const copyToClipboard = useCallback(() => {
    const textToCopy = jsonOutput || jsonInput;
    if (textToCopy.trim()) {
      navigator.clipboard.writeText(textToCopy);
      addToast({ title: 'Copied', message: 'Data stored in clipboard.' });
    }
  }, [jsonInput, jsonOutput, addToast]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="JSON Formatter | Fezcodex"
        description="Protocol for structural validation and visual optimization of JSON data sequences."
        keywords={[
          'Fezcodex',
          'JSON formatter',
          'JSON validator',
          'JSON beautifier',
          'JSON tool',
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
              <BreadcrumbTitle title="JSON Formatter" slug="jf" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Structural mapping protocol. Verify data integrity and optimize
                visual hierarchy within JSON sequences.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Editor Column */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={appName + jsonInput.length}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-px w-4 bg-gray-800" /> Data_Input_Stream
                  </label>
                  <textarea
                    rows="12"
                    className="w-full p-8 bg-black/40 border border-white/5 rounded-sm font-mono text-sm leading-relaxed focus:border-emerald-500/50 focus:ring-0 transition-all resize-none shadow-inner"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Enter your JSON sequence here..."
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={formatJson}
                    className="px-8 py-4 bg-white text-black hover:bg-emerald-500 transition-all font-mono uppercase tracking-widest text-xs font-black rounded-sm"
                  >
                    Format Sequence
                  </button>
                  <button
                    onClick={validateJson}
                    className="px-8 py-4 border border-white/10 hover:bg-white/[0.05] transition-all font-mono uppercase tracking-widest text-xs font-bold rounded-sm"
                  >
                    Verify Integrity
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {(jsonOutput || isValid !== null) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-8"
                >
                  {isValid !== null && (
                    <div
                      className={`p-6 border rounded-sm flex items-center gap-4 ${isValid ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                    >
                      {isValid ? (
                        <CheckCircleIcon size={24} weight="fill" />
                      ) : (
                        <XCircleIcon size={24} weight="fill" />
                      )}
                      <span className="font-mono text-xs uppercase tracking-widest font-black">
                        {isValid
                          ? 'Structure Verified'
                          : `Corruption Detected: ${validationMessage}`}
                      </span>
                    </div>
                  )}

                  {jsonOutput && (
                    <div className="relative group border border-emerald-500/20 bg-emerald-500/[0.02] p-8 md:p-12 rounded-sm overflow-hidden">
                      <div className="flex justify-between items-center mb-6">
                        <label className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center gap-2">
                          <span className="h-px w-4 bg-emerald-500/20" />{' '}
                          Optimized_Output
                        </label>
                        <button
                          onClick={copyToClipboard}
                          className="text-emerald-500 hover:text-white transition-colors"
                          title="Copy to Clipboard"
                        >
                          <CopySimpleIcon size={24} weight="bold" />
                        </button>
                      </div>
                      <textarea
                        rows="12"
                        className="w-full p-0 bg-transparent border-none font-mono text-sm leading-relaxed text-emerald-400 focus:ring-0 resize-none"
                        value={jsonOutput}
                        readOnly
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <BracketsCurlyIcon weight="fill" />
                Processing_Notes
              </h3>
              <div className="space-y-6">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                  All structural modifications are executed client-side. No data
                  fragments leave your local environment.
                </p>
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-600 uppercase">
                      Privacy
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 uppercase font-black">
                      Encrypted_Local
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-600 uppercase">
                      Engine
                    </span>
                    <span className="text-[10px] font-mono text-white uppercase font-black">
                      JSON_V8
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Data_Loom_v0.6.1</span>
          <span className="text-gray-800">SCHEMA_VERIFIED // STABLE</span>
        </footer>
      </div>
    </div>
  );
};

export default JsonFormatterPage;
