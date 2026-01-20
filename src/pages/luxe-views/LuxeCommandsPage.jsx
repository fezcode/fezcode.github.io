import React, { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  TerminalIcon,
  CommandIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { commands as commandsData } from '../../data/commands';
import { useCommandPalette } from '../../context/CommandPaletteContext';

const LuxeCommandsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { triggerCommand } = useCommandPalette();

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return commandsData
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20">
      <Seo
        title="Fezcodex | Commands"
        description="System Command Reference."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <header className="mb-20 pt-12 border-b border-[#1A1A1A]/10 pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors"
          >
            <ArrowLeftIcon /> Home
          </Link>
          <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
            Terminal
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4 max-w-lg">
              <p className="font-outfit text-sm text-[#1A1A1A]/60 leading-relaxed">
                Reference manual for the integrated command line interface.
                Every function of the system exposed via cryptographic keywords.
              </p>
              <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                <kbd className="bg-white px-2 py-1 border border-[#1A1A1A]/10 rounded-sm shadow-sm">
                  CMD
                </kbd>
                <span>+</span>
                <kbd className="bg-white px-2 py-1 border border-[#1A1A1A]/10 rounded-sm shadow-sm">
                  K
                </kbd>
                <span className="ml-2">to activate anywhere</span>
              </div>
            </div>

            <div className="relative group border-b border-[#1A1A1A]/20 focus-within:border-[#1A1A1A] transition-colors min-w-[300px]">
              <input
                type="text"
                placeholder="Search Commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2 outline-none font-outfit text-sm placeholder-[#1A1A1A]/30"
              />
              <MagnifyingGlassIcon className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" />
            </div>
          </div>
        </header>

        <div className="space-y-24">
          {filteredData.map((category) => (
            <section key={category.category}>
              <div className="flex items-center gap-6 mb-12">
                <h2 className="font-playfairDisplay text-4xl md:text-5xl italic text-[#1A1A1A]">
                  {category.category}
                </h2>
                <div className="flex-1 h-px bg-[#1A1A1A]/5" />
                <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/30">
                  {category.items.length} Functions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((cmd) => (
                  <button
                    key={cmd.commandId}
                    onClick={() => triggerCommand(cmd.commandId)}
                    className="group relative bg-white border border-[#1A1A1A]/5 p-8 text-left hover:shadow-xl hover:border-[#1A1A1A]/10 transition-all duration-500 rounded-sm overflow-hidden"
                  >
                    {/* Decorative Command Icon Background */}
                    <CommandIcon
                      size={120}
                      weight="thin"
                      className="absolute -right-8 -bottom-8 text-[#1A1A1A]/[0.02] group-hover:text-[#8D4004]/[0.05] transition-colors duration-700"
                    />

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="px-3 py-1 bg-[#1A1A1A]/5 rounded-sm border border-[#1A1A1A]/5">
                          <span className="font-mono text-xs text-[#8D4004]">
                            {cmd.commandId}
                          </span>
                        </div>
                        <TerminalIcon
                          size={18}
                          className="text-[#1A1A1A]/20 group-hover:text-[#1A1A1A] transition-colors"
                        />
                      </div>

                      <h3 className="font-playfairDisplay text-2xl text-[#1A1A1A] leading-tight group-hover:italic transition-all">
                        {cmd.title}
                      </h3>

                      <p className="font-outfit text-xs text-[#1A1A1A]/50 leading-relaxed min-h-[3em]">
                        {cmd.description}
                      </p>

                      <div className="pt-4 flex items-center gap-2 text-[10px] font-outfit uppercase tracking-[0.3em] text-[#1A1A1A]/30 group-hover:text-[#8D4004] transition-colors">
                        Execute{' '}
                        <ArrowRightIcon
                          size={12}
                          className="group-hover:translate-x-2 transition-transform"
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}

          {filteredData.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-playfairDisplay italic text-2xl text-[#1A1A1A]/40">
                No commands found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LuxeCommandsPage;
