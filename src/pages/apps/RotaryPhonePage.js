import React, {useState} from 'react';
import RotaryDial from '../../components/RotaryDial';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import Seo from '../../components/Seo';
import {BackspaceIcon, TrashIcon} from '@phosphor-icons/react';
import {motion, AnimatePresence} from 'framer-motion';

const RotaryPhonePage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [lastDialed, setLastDialed] = useState(null);

  const handleDial = (digit) => {
    setPhoneNumber((prev) => prev + digit);
    setLastDialed(digit);

    // Clear "last dialed" highlight after a moment
    setTimeout(() => setLastDialed(null), 500);
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber('');
  };

  // Format phone number for display (US format style roughly)
  const formatPhoneNumber = (value) => {
    // Just simple grouping for readability if it gets long
    // 123-456-7890
    if (!value) return '';
    return value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  return (
    <div
      className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
      <Seo
        title="Rotary Phone | Fezcodex"
        description="A digital rotary phone. Dial numbers with your mouse or finger."
        keywords="rotary phone, dialer, retro, interactive, web app"
      />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <BreadcrumbTitle title="Rotary Phone" slug="rotary-phone"/>
      </div>

      <div className="z-10 w-full max-w-2xl flex flex-col items-center gap-12 mt-8">

        {/* Display Area */}
        <div className="w-full bg-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-800 relative">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-950 px-4 py-1 rounded-full border border-gray-800 text-gray-500 text-xs uppercase tracking-widest font-mono">
            Display
          </div>

          <div
            className="bg-green-900/20 border border-green-800/50 rounded-xl p-4 h-24 flex items-center justify-end overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={phoneNumber} // Re-render on change for effect
                initial={{opacity: 0.5, y: 5}}
                animate={{opacity: 1, y: 0}}
                className="text-4xl sm:text-5xl font-mono text-green-400 tracking-widest font-bold drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
              >
                {phoneNumber || <span className="opacity-20">...</span>}
              </motion.span>
            </AnimatePresence>

            {/* Cursor/Caret */}
            <motion.div
              animate={{opacity: [0, 1, 0]}}
              transition={{repeat: Infinity, duration: 1}}
              className="w-3 h-10 bg-green-400/50 ml-1"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleBackspace}
              disabled={!phoneNumber}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Backspace"
            >
              <BackspaceIcon size={24}/>
            </button>
            <button
              onClick={handleClear}
              disabled={!phoneNumber}
              className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:text-red-300 hover:bg-red-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear All"
            >
              <TrashIcon size={24}/>
            </button>
          </div>
        </div>

        {/* The Dial */}
        <div className="relative py-8">
          <div className="absolute inset-0 bg-primary-500/5 blur-[100px] rounded-full pointer-events-none"/>
          <RotaryDial onDial={handleDial}/>
        </div>

        {/* Instructions */}
        <div className="text-gray-500 text-center max-w-md space-y-2">
          <p className="text-lg font-medium text-gray-400">How to use:</p>
          <p className="text-sm">
            Click and hold a number hole, drag it clockwise until it hits the metal stop at the bottom right, then
            release.
          </p>
        </div>

      </div>
    </div>
  );
};

export default RotaryPhonePage;
