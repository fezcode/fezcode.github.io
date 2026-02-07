import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  DiceFiveIcon,
  MaskHappyIcon,
  GearSixIcon,
  EyeIcon,
  ClipboardIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { ToastContext } from '../../context/ToastContext';
import CustomDropdown from '../../components/CustomDropdown';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';

const excuses = {
  late: [
    'My cat achieved sentience and demanded a philosophical debate on the nature of time.',
    'I was abducted by aliens, but they returned me after realizing I had no marketable skills.',
    'A rogue squirrel declared war on my shoelaces.',
    'I got stuck in a time loop and had to relive the same 5 minutes until I found the perfect outfit.',
    'My coffee machine staged a protest against early mornings.',
    "I accidentally joined a flash mob and couldn't find my way out.",
    'The traffic was unusually heavy due to a parade of very slow snails.',
    'I was helping a lost unicorn find its way back to its dimension.',
    'My alarm clock started playing interpretive dance music instead of ringing.',
    'I had to wrestle a giant rubber duck for control of the bathtub.',
    'I was momentarily trapped in a parallel dimension where socks only have one match.',
    'My pet rock needed emotional support after a bad dream.',
    'I overslept because my dreams were in 4K and I wanted to see the ending.',
    'A flock of geese stole my car keys and demanded a ransom of artisanal bread.',
    'I was busy perfecting my invisibility cloak, and it worked a little too well.',
    "My reflection challenged me to a dance-off, and I couldn't back down.",
    'I encountered a philosophical paradox while tying my shoes.',
    'My house spontaneously decided to redecorate itself, and I had to supervise.',
    'I was performing an emergency rescue of a tiny ant from a puddle.',
    "My internal clock is currently set to 'island time'.",
  ],
  work: [
    'My computer developed a personality and refused to cooperate.',
    'I was busy training a team of highly intelligent pigeons to deliver urgent messages.',
    'The internet went down because a rogue AI decided to play hide-and-seek with the servers.',
    'I spent all morning trying to teach my goldfish to code.',
    'My keyboard spontaneously combusted due to excessive typing of brilliant ideas.',
    'I was caught in a philosophical discussion with my stapler about its existential purpose.',
    'A flock of geese mistook my office for their annual migration stop.',
    "My monitor started displaying only cat memes, and I couldn't look away.",
    'I accidentally formatted my brain instead of my hard drive.',
    'I was performing emergency surgery on a broken coffee mug.',
    'My mouse ran away to join the circus, and I had to track it down.',
    'I was debugging a quantum entanglement issue in my coffee maker.',
    'My office plant started giving me unsolicited life advice, and I had to listen.',
    'I got into a staring contest with a blank document and lost.',
    'My productivity was severely hampered by a sudden urge to reorganize my sock drawer.',
    'I was busy translating ancient hieroglyphs found on my whiteboard.',
    'My chair achieved sentience and demanded a union contract.',
    'I was trapped in a spreadsheet vortex, unable to escape.',
    'My brain decided to take an unscheduled coffee break without me.',
    'I was trying to communicate with my printer using interpretive dance.',
  ],
  school: [
    'My dog ate my homework, then asked for seconds.',
    'I was busy conducting a scientific experiment on the optimal napping position.',
    'My textbook spontaneously transformed into a graphic novel, and I got engrossed.',
    'I accidentally joined a secret society dedicated to the preservation of forgotten memes.',
    'My pen ran out of ink because it was writing a novel in my dreams.',
    'I was helping a group of sentient dust bunnies unionize.',
    'The school Wi-Fi was so slow, I aged three years waiting for a page to load.',
    'My backpack declared independence and ran away with my assignments.',
    'I was trying to prove the existence of parallel universes using only a calculator and a rubber band.',
    'My brain decided to major in procrastination today.',
  ],
  partner: [
    'I was busy fighting a dragon in my dreams, and I needed my beauty sleep to recover.',
    'My pet hamster started a cryptocurrency mining operation, and I had to supervise.',
    'I got lost in the labyrinth of your amazingness.',
    'My phone ran out of battery because it was trying to calculate how much I love you.',
    'I was abducted by a rogue pillow and forced into a cuddle marathon.',
    "I was trying to teach the cat to fetch, and it's a very demanding student.",
    'My brain cells were too busy thinking about you to remember anything else.',
    'I was performing an archaeological dig for the remote control.',
    'I accidentally ordered a lifetime supply of compliments for you, and they just arrived.',
    "I was busy practicing my 'surprise romantic gesture' for you, but it's a secret!",
  ],
  general: [
    "I'm currently in a witness protection program for my embarrassing dance moves.",
    "My spirit animal is a sloth, and it's having a particularly strong influence today.",
    "I'm allergic to responsibilities.",
    "I'm operating on a different timezone, specifically 'whenever-I-feel-like-it' time.",
    'My inner child threw a tantrum and demanded ice cream.',
    "I'm conducting a very important experiment on the gravitational pull of my couch.",
    "I'm currently in a staring contest with my reflection, and I'm losing.",
    'My brain cells are on strike for better working conditions.',
    "I'm pretty sure I left my motivation in another dimension.",
    "I'm practicing my invisibility skills, and I'm getting really good at it.",
    "I was abducted by a rogue thought and couldn't find my way back.",
    'My imaginary friend needed urgent emotional support.',
    "I'm currently in a deep philosophical debate with my toaster.",
    'I accidentally swapped bodies with a squirrel, and it took a while to switch back.',
    "My pet rock is going through an existential crisis, and I'm its therapist.",
    "I'm training for the 'Extreme Couch Potato' Olympics.",
    "I'm pretty sure my socks are plotting against me.",
    'I was busy deciphering the secret language of dust bunnies.',
    'My attention span is currently on vacation in the Bahamas.',
    "I'm in a committed relationship with my bed, and it's very demanding.",
  ],
};

const ExcuseGeneratorPage = () => {
  const appName = 'Excuse Generator';

  const { addToast } = useContext(ToastContext);
  const [currentExcuse, setCurrentExcuse] = useState(
    'SYSTEM_IDLE: Awaiting generation sequence.',
  );
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExcuse = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const categoryExcuses = excuses[selectedCategory];
      const randomIndex = Math.floor(Math.random() * categoryExcuses.length);
      setCurrentExcuse(categoryExcuses[randomIndex]);
      setIsGenerating(false);
      addToast({ message: 'LOGIC_BYPASS_SUCCESSFUL', type: 'success' });
    }, 400);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(currentExcuse)
      .then(() => {
        addToast({ message: 'PAYLOAD_COPIED_TO_CLIPBOARD', type: 'info' });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        addToast({ message: 'CLIPBOARD_ACCESS_DENIED', type: 'error' });
      });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Excuse Generator | Fezcodex"
        description="Generate funny and absurd excuses for any situation in a brutalist workspace."
        keywords={[
          'Fezcodex',
          'excuse generator',
          'funny excuses',
          'absurd excuses',
          'humor',
          'brutalist',
        ]}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>
          <BreadcrumbTitle title={appName} slug="excuse" variant="brutalist" />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Automated responsibility avoidance engine. Synthesize{' '}
                <span className="text-emerald-400 font-bold">
                  absurd justifications
                </span>{' '}
                for any systemic failure.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Category
                </span>
                <span className="text-3xl font-black text-emerald-500 uppercase">
                  {selectedCategory}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Engine_State
                </span>
                <span
                  className={`text-3xl font-black ${isGenerating ? 'text-white' : 'text-emerald-500'}`}
                >
                  {isGenerating ? 'SYNTHESIZING' : 'STABLE'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName} className="w-full h-full" />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <GearSixIcon weight="fill" />
                Synthesis_Parameters
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Context_Domain
                  </label>
                  <CustomDropdown
                    fullWidth
                    options={Object.keys(excuses).map((category) => ({
                      label: category.toUpperCase(),
                      value: category,
                    }))}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    variant="brutalist"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={generateExcuse}
                    disabled={isGenerating}
                    className="flex-1 py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-xs flex items-center justify-center gap-3"
                  >
                    <DiceFiveIcon weight="bold" size={18} />
                    Generate
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 py-4 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <CopySimpleIcon weight="bold" size={16} />
                    Copy_String
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <MaskHappyIcon size={20} weight="bold" />
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Ethical_Override
                </h4>
              </div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider leading-relaxed">
                This utility provides non-linear explanations for temporal
                discrepancies. Use with extreme caution in high-stakes social
                environments.
              </p>
            </div>
          </div>

          {/* Output Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <EyeIcon weight="fill" className="text-emerald-500" />
              Generated_Output
            </h3>

            <div className="flex-grow border border-white/10 bg-white/[0.01] rounded-sm p-12 flex items-center justify-center relative overflow-hidden min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentExcuse}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full text-center space-y-8"
                >
                  <div className="h-px w-12 bg-emerald-500 mx-auto" />
                  <p className="text-2xl md:text-4xl font-light italic text-white leading-tight">
                    "{currentExcuse}"
                  </p>
                  <div className="h-px w-12 bg-emerald-500 mx-auto" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center opacity-20 font-mono text-[8px] uppercase tracking-[0.5em] text-gray-500">
                <span className="flex items-center gap-2">
                  <ClipboardIcon /> LOCAL_BUFFER_SYNCED
                </span>
                <span>EG_v1.2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcuseGeneratorPage;
