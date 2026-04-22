import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import {
  ArrowLeftIcon,
  TerminalWindowIcon,
  CommandIcon,
} from '@phosphor-icons/react';
import GenerativeArt from '../../components/GenerativeArt';
import { commands as commandsData } from '../../data/commands';

const CommandListItem = ({ cmd, isActive, onHover, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => onHover(cmd)}
      onClick={onClick}
      className="relative pl-6 md:pl-8 py-3 group cursor-pointer"
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 ${
          isActive ? 'bg-[#C96442] h-full' : 'bg-transparent h-0 group-hover:h-full group-hover:bg-[#1A161320]'
        }`}
      />

      <div className="flex items-baseline justify-between pr-4">
        <h3
          className={`text-lg font-playfairDisplay transition-all duration-300 ${
            isActive
              ? 'text-[#1A1613] italic translate-x-2'
              : 'text-[#2E2620]/60 group-hover:text-[#1A1613]'
          }`}
        >
          {cmd.title}
        </h3>

        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block text-[#C96442]"
          >
            <ArrowLeftIcon className="rotate-180" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

function TerracottaCommandsPage() {
  const { togglePalette, triggerCommand } = useCommandPalette();
  const [activeCommand, setActiveCommand] = useState(null);

  return (
    <div className="flex min-h-screen bg-[#F3ECE0] text-[#1A1613] overflow-hidden relative selection:bg-[#C96442]/25">
      <Seo title="All Commands | Fezcodex" description="All available commands in Fezcodex." />

      <div className="absolute inset-0 xl:hidden opacity-20 pointer-events-none z-0">
        <GenerativeArt seed="Commands" className="w-full h-full filter blur-3xl" />
      </div>

      <div className="w-full xl:pr-[50vw] relative z-10 flex flex-col min-h-screen py-24 px-6 md:pl-20 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300">
        <header className="mb-20 text-center md:text-left">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-[#2E2620]/60 hover:text-[#1A1613] transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-6xl md:text-8xl font-playfairDisplay italic tracking-tight text-[#1A1613] mb-4 leading-none">
            Commands
          </h1>
          <p className="text-[#2E2620]/60 font-mono text-sm max-w-sm uppercase tracking-widest mb-8">
            Available Commands
          </p>

          <button
            onClick={togglePalette}
            className="group relative inline-flex items-center gap-3 px-6 py-3 bg-[#E8DECE]/60 border border-[#1A161320] hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-all duration-300 font-mono uppercase tracking-widest text-xs rounded-sm mb-12"
          >
            <CommandIcon size={18} />
            <span>Open Palette</span>
          </button>
        </header>

        <div className="flex flex-col pb-32 gap-12">
          {commandsData.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="font-mono text-xs text-[#9E4A2F] uppercase tracking-widest mb-6 border-b border-[#1A161320] pb-2">
                {category.category}
              </h2>
              <div className="flex flex-col">
                {category.items.map((cmd) => (
                  <CommandListItem
                    key={cmd.title}
                    cmd={cmd}
                    isActive={activeCommand?.title === cmd.title}
                    onHover={setActiveCommand}
                    onClick={() => triggerCommand(cmd.commandId)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden xl:flex fixed right-0 top-0 h-screen w-1/2 bg-[#1A1613] overflow-hidden border-l border-[#1A161320] z-20 flex-col">
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeCommand ? (
              <motion.div
                key={activeCommand.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col justify-end p-20 pb-8"
              >
                <div className="absolute inset-0 z-0">
                  <GenerativeArt seed={activeCommand.title} className="w-full h-full opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1613] via-[#1A1613]/80 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-full border text-[#C96442] border-[#C96442]/40 bg-[#C96442]/10">
                      {activeCommand.color}
                    </span>
                  </div>

                  <h2 className="text-5xl font-playfairDisplay italic text-[#F3ECE0] mb-6 leading-tight">
                    {activeCommand.title}
                  </h2>

                  <p className="text-xl text-[#F3ECE0]/80 font-light max-w-xl leading-relaxed">
                    {activeCommand.description}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center p-12 text-center"
              >
                <div className="relative z-10 max-w-lg">
                  <TerminalWindowIcon size={64} className="mx-auto mb-8 text-[#C96442]/60" />
                  <h2 className="text-4xl font-playfairDisplay italic text-[#F3ECE0] mb-6">
                    Command Palette
                  </h2>
                  <p className="text-[#F3ECE0]/60 mb-8 leading-relaxed">
                    Access all features and navigations quickly.
                    <br />
                    Hover over the list to see details.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-[#F3ECE0]/10 bg-[#1A1613]/80 backdrop-blur-md z-30 flex items-center justify-between gap-6">
          <div className="hidden xl:flex items-center gap-4 text-sm font-mono text-[#F3ECE0]/70">
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-[#F3ECE0]/10 rounded border border-[#F3ECE0]/20 text-[#F3ECE0]">Ctrl</kbd>
              <span className="self-center">+</span>
              <kbd className="px-2 py-1 bg-[#F3ECE0]/10 rounded border border-[#F3ECE0]/20 text-[#F3ECE0]">K</kbd>
            </div>
            <span>to open anywhere</span>
          </div>

          <button
            onClick={togglePalette}
            className="flex-1 xl:flex-none group relative inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#F3ECE0] text-[#1A1613] hover:bg-[#C96442] hover:text-[#F3ECE0] transition-colors duration-300 font-mono uppercase tracking-widest text-sm"
          >
            <CommandIcon size={20} />
            <span>Open Palette</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TerracottaCommandsPage;
