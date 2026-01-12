import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  SkullIcon,
  CopySimpleIcon,
  AnchorIcon,
  ArrowsClockwiseIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const pirateDictionary = {
  hello: 'ahoy',
  hi: 'ahoy',
  hey: 'ahoy',
  my: 'me',
  friend: 'matey',
  friends: 'hearties',
  is: 'be',
  are: 'be',
  am: 'be',
  you: 'ye',
  your: 'yer',
  yours: 'yers',
  where: 'whar',
  to: "t'",
  the: "th'",
  of: "o'",
  for: 'fer',
  stop: 'avast',
  yes: 'aye',
  no: 'nay',
  girl: 'lass',
  girls: 'lassies',
  boy: 'lad',
  boys: 'laddies',
  guy: 'lubber',
  man: 'scallywag',
  woman: 'wench',
  money: 'booty',
  cash: 'doubloons',
  quickly: 'smartly',
  fast: 'smartly',
  captain: "cap'n",
  beer: 'grog',
  alcohol: 'rum',
  water: 'brine',
  wine: 'grog',
  drink: 'swig',
  happy: 'jolly',
  good: 'grand',
  bad: 'scurvy',
  very: 'mighty',
  wow: 'blimey',
  there: 'thar',
  mad: 'addled',
  crazy: 'mad as a hatter',
  boss: 'admiral',
  food: 'grub',
  hotel: 'inn',
  house: 'shack',
  home: 'port',
  kill: 'keelhaul',
  died: 'walked the plank',
  dead: 'feeding the fish',
  old: 'barnacle-covered',
  bathroom: 'head',
  restroom: 'head',
  toilet: 'head',
  wife: 'ball and chain',
  husband: 'old man',
  song: 'shanty',
  music: 'shanty',
  cheat: 'hornswaggle',
  rob: 'pillage',
  steal: 'plunder',
  take: 'seize',
  gun: 'pistol',
  sword: 'cutlass',
  knife: 'dagger',
  ship: 'vessel',
  boat: 'dinghy',
  sea: 'big blue wet thing',
  ocean: 'seven seas',
  treasure: 'treasure',
  chest: 'coffer',
  talk: 'parley',
  speak: 'parley',
  look: 'spy',
  saw: 'spied',
  find: 'come across',
  run: 'scamper',
  leave: 'weigh anchor',
  after: 'aft',
  forward: 'fore',
};

const piratePhrases = [
  ' Arrr!',
  ' Shiver me timbers!',
  ' Walk the plank!',
  ' Yo ho ho!',
  ' Avast ye!',
  ' Dead men tell no tales.',
  " By Blackbeard's ghost!",
  ' Blow me down!',
  ' Savvy?',
  ' ...and a bottle of rum!',
  ' Weigh anchor!',
  ' Batten down the hatches!',
];

const PirateTranslatorPage = () => {
  const appName = 'Pirate Gen';

  const { addToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const translate = () => {
    if (!inputText.trim()) return;
    let text = inputText.toLowerCase();
    Object.keys(pirateDictionary).forEach((key) => {
      const regex = new RegExp(`\b${key}\b`, 'g');
      text = text.replace(regex, pirateDictionary[key]);
    });
    text = text.replace(/ing\b/g, "in'");
    text = text.replace(/(^\w|\.\s\w)/g, (c) => c.toUpperCase());
    if (text.length > 0) {
      const randomPhrase =
        piratePhrases[Math.floor(Math.random() * piratePhrases.length)];
      text += randomPhrase;
    }
    setTranslatedText(text);
    addToast({ title: 'Success', message: 'Linguistic mapping complete.' });
  };

  const copyToClipboard = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText).then(() => {
      addToast({ title: 'Copied', message: 'Vernacular stored in clipboard.' });
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Pirate Gen | Fezcodex"
        description="Protocol for semantic remapping. Convert standard data streams into maritime vernacular."
        keywords={[
          'Fezcodex',
          'pirate translator',
          'pirate speak',
          'fun',
          'converter',
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
              <BreadcrumbTitle title={appName} slug="pirate" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Linguistic remapping protocol. Translate standard data streams
                into high-seas vernacular through semantic substitution.
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
                  seed={appName + inputText.length}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-px w-4 bg-gray-800" /> Source_Vernacular
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Insert message for maritime conversion..."
                    className="w-full h-48 p-8 bg-black/40 border border-white/5 rounded-sm font-mono text-sm leading-relaxed focus:border-emerald-500/50 focus:ring-0 transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={translate}
                    className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm"
                  >
                    <ArrowsClockwiseIcon
                      weight="bold"
                      size={24}
                      className="group-hover:rotate-180 transition-transform duration-500"
                    />
                    <span>Map Vernacular</span>
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {translatedText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="relative group border border-emerald-500/20 bg-emerald-500/[0.02] p-8 md:p-12 rounded-sm overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-6 border-b border-emerald-500/10 pb-6">
                    <label className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center gap-2">
                      <span className="h-px w-4 bg-emerald-500/20" />{' '}
                      Remapped_Output
                    </label>
                    <button
                      onClick={copyToClipboard}
                      className="text-emerald-500 hover:text-white transition-colors"
                    >
                      <CopySimpleIcon size={24} weight="bold" />
                    </button>
                  </div>
                  <div className="font-mono text-lg md:text-2xl font-black text-white leading-relaxed italic">
                    "{translatedText}"
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <SkullIcon weight="fill" />
                Linguistic_Matrix
              </h3>

              <div className="space-y-6">
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                  <span className="font-mono text-[10px] text-gray-600 uppercase block mb-2">
                    Algorithm
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    Regex_Pattern_Substitution
                  </p>
                </div>
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm">
                  <span className="font-mono text-[10px] text-gray-600 uppercase block mb-2">
                    Dataset
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    Golden_Age_Dictionary_V1
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <AnchorIcon size={24} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Maritime remapping involves replacing standard identifiers with
                archaic naval equivalents. The output sequence reflects
                17th-century linguistic patterns.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Vernacular_Engine_v0.6.1</span>
          <span className="text-gray-800">VOYAGE_STATUS // ACTIVE</span>
        </footer>
      </div>
    </div>
  );
};

export default PirateTranslatorPage;
