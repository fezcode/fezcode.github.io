import React, { useState } from 'react';
import RotaryDial from '../../components/RotaryDial';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import Seo from '../../components/Seo';
import DigitalDisplay from '../../components/DigitalDisplay';
import {BackspaceIcon, TrashIcon, PhoneIcon} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../../context/AchievementContext';
import { useToast } from '../../hooks/useToast';

const RotaryPhonePage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [lastDialed, setLastDialed] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const { unlockAchievement } = useAchievements();

  const handleDial = (digit) => {
    if (isCalling) return;
    setPhoneNumber((prev) => prev + digit);
    setLastDialed(digit);
    // Clear "last dialed" highlight after a moment
    setTimeout(() => setLastDialed(null), 500);
  };

  const handleBackspace = () => {
    if (isCalling) return;
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isCalling) return;
    setPhoneNumber('');
  };

  const achievements = {
    '911': 'the_emergency',
    '0': 'operator',
    '123': 'speaking_clock',
    '1905': 'galatasaray',
    '6': 'm_for_murder',
    '5550690': 'trinity_calling',
    '0451': 'immersive_sim_door_code',
    '555': 'call_me_generic',
    '117': 'mr_halo_himself',
    '47': 'barcode_man',
    '111111': 'skyrim',
    '52': 'new_dc_universe',
    '824': 'kobe',
    '42': 'the_answer',
    '80085': 'dealing_with_a_kid',
    '1984': 'dystopian_are_we',
    '404': 'not_found',
    '666': 'devil',
    '007': 'the_worst_agent',
    '314': 'pie',
    '12': 'the_number_of_monkeys',
  }

  const handleCall = () => {
    if (!phoneNumber || isCalling) return;
    setIsCalling(true);
    setStatusMessage('Calling...');
    setTimeout(() => {
      let res = achievements[phoneNumber]

      if (res) {
        setStatusMessage('Connected');
        unlockAchievement(res);
      } else {
        setStatusMessage('Dial Failed');
      }

      setTimeout(() => {
        setStatusMessage(null);
        setIsCalling(false);
      }, 2000);
    }, 2000);
  };

  // Format phone number for display (US format style roughly)

  const formatPhoneNumber = (value) => {
    // Just simple grouping for readability if it gets long
    // 123-456-7890
    if (!value) return '';
    return value.replace(/(\d{3})(\d{3})(\d{4})/, '-$2-$3');
  };

  const getDisplayText = () => {
    if (statusMessage) return statusMessage;
    return phoneNumber || <span className="opacity-20">...</span>;
  };

  const getDisplayColor = () => {
    if (statusMessage === 'Dial Failed')
      return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]';

    if (statusMessage === 'Connected')
      return 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]';

    return 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]';
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
      <Seo
        title="Rotary Phone | Fezcodex"
        description="A digital rotary phone. Dial numbers with your mouse or finger."
        keywords="rotary phone, dialer, retro, interactive, web app"
      />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <BreadcrumbTitle title="Rotary Phone" slug="phone" />
      </div>

      <div className="z-10 w-full max-w-2xl flex flex-col items-center gap-12 mt-8">
        {/* Display Area */}
        <div className="w-full bg-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-800 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-950 px-4 py-1 rounded-full border border-gray-800 text-gray-500 text-xs uppercase tracking-widest font-mono">
                        Display
          </div>
          <DigitalDisplay
            text={getDisplayText()}
            colorClass={getDisplayColor()}
            showCursor={!isCalling}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleCall}
              disabled={!phoneNumber || isCalling}
              className="p-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mr-auto"
              title="Call"
            >
              <PhoneIcon size={24} weight="fill" />
              <span className="font-bold font-mono">CALL</span>
            </button>

            <button
              onClick={handleBackspace}
              disabled={!phoneNumber || isCalling}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Backspace"
            >
              <BackspaceIcon size={24} />
            </button>

            <button
              onClick={handleClear}
              disabled={!phoneNumber || isCalling}
              className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:text-red-300 hover:bg-red-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear All"
            >
              <TrashIcon size={24} />
            </button>
          </div>
        </div>

        {/* The Dial */}

        <div className="relative py-8">
          <div className="absolute inset-0 bg-primary-500/5 blur-[100px] rounded-full pointer-events-none" />

          <RotaryDial onDial={handleDial} />
        </div>

        {/* Instructions */}

        <div className="text-gray-500 text-center max-w-md space-y-2">
          <p className="text-lg font-medium text-gray-400">How to use:</p>

          <p className="text-sm">
            Click and hold a number hole, drag it clockwise until it hits the
            metal stop at the bottom right, then release.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RotaryPhonePage;
