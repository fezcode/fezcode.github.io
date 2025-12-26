import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopyIcon,
  ArrowsClockwiseIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const prefixes = [
  'Operation',
  'Project',
  'Protocol',
  'Directive',
  'Initiative',
  'Task Force',
  'Unit',
  'Division',
  'Cell',
  'Asset',
  'Red',
  'Blue',
  'Green',
  'Black',
  'White',
  'Gold',
  'Silver',
  'Bronze',
  'Neural'
];

const nouns = [
  'Nexus',
  'Viper',
  'Phoenix',
  'Shadow',
  'Ghost',
  'Spectre',
  'Wraith',
  'Raven',
  'Crow',
  'Jackal',
  'Cobra',
  'Hydra',
  'Cerberus',
  'Aegis',
  'Shield',
  'Sword',
  'Dagger',
  'Arrow',
  'Spear',
  'Javelin',
  'Trident',
  'Hammer',
  'Anvil',
  'Crucible',
  'Avalanche',
  'Blizzard',
  'Cyclone',
  'Hurricane',
  'Tornado',
  'Typhoon',
  'Earthquake',
  'Volcano',
  'Tsunami',
  'Genesis',
  'Exodus',
  'Leviathan',
  'Behemoth',
  'Goliath',
  'Titan',
  'Colossus',
  'Gargantua',
  'Prometheus',
  'Icarus',
  'Daedalus',
  'Orpheus',
  'Morpheus',
  'Nyx',
  'Erebus',
  'Hades',
  'Styx',
  'Charon',
  'Thanatos',
  'Valkyrie',
  'Ragnarok',
  'Valhalla',
  'Asgard',
  'Midgard',
  'Jotunheim',
  'Fenrir',
  'Jormungandr',
  'Sleipnir',
  'Paperclip',
  'Viking',
  'Survival',
  'Overlord',
  'Neptune',
  'Barbarossa',
  'Stalingrad',
  'Kursk',
  'Midway',
  'Normandy',
  'Market Garden',
  'Watchtower',
  'Downfall',
  'Unthinkable',
  'Crossbow',
  'Mincemeat',
  'Fortitude',
  'Dragon',
  'Wyvern',
  'Griffin',
  'Chimera',
  'Manticore',
  'Basilisk',
  'Kraken',
  'Scylla',
  'Charybdis',
  'Sun',
  'Moon',
  'Star',
  'Comet',
  'Nebula',
  'Galaxy',
  'Quasar',
  'Pulsar',
  'Supernova',
  'Storm',
  'Tempest',
  'Maelstrom',
  'Vortex',
  'Singularity',
  'Event Horizon',
  'Black Hole',
  'Nomad',
  'Wanderer',
  'Ronin',
  'Samurai',
  'Ninja',
  'Shinobi',
  'Kunoichi',
  'Gladiator',
  'Centurion',
  'Legionnaire',
  'Spartan',
  'Hoplite',
  'Phalanx',
  'Crusader',
  'Paladin',
  'Templar',
  'Inquisitor',
  'Exorcist',
  'Warlock',
  'Sorcerer',
  'Mage',
  'Wizard',
  'Archmage',
  'Necromancer',
  'Druid',
  'Shaman',
  'Witch Doctor',
  'Oracle',
  'Seer',
  'Prophet',
  'Bard',
  'Skald',
  'Troubadour',
  'Minstrel',
  'Thief',
  'Rogue',
  'Assassin',
  'Cutthroat',
  'Bandit',
  'Outlaw',
  'Pirate',
  'Corsair',
  'Privateer',
  'Buccaneer',
  'Freebooter',
  'Rebel',
  'Insurgent',
  'Guerrilla',
  'Freedom Fighter',
  'Revolutionary',
  'Anarchist',
  'Nihilist',
  'Terrorist',
  'Extremist',
  'Cyborg',
  'Android',
  'Robot',
  'Mech',
  'Drone',
  'Mutant',
  'Chimera',
  'Hybrid',
  'Abomination',
  'Vampire',
  'Werewolf',
  'Lich',
  'Ghoul',
  'Zombie',
  'Angel',
  'Demon',
  'Devil',
  'Archon',
  'Seraph',
  'Nephilim',
  'God',
  'Goddess',
  'Deity',
  'Avatar',
  'Primordial',
  'Serpent',
  'Owl',
  'Hawk',
  'Viper',
  'Hunter',
  'Orchid',
  'Fox',
  'Mamba',
  'Phoenix',
  'Wind',
];

const CodenameGeneratorPage = () => {
  const appName = 'Codename Gen';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Protocol for generating unique operation identifiers and strategic nomenclature.',
    keywords: [
      'Fezcodex',
      'codename generator',
      'random name generator',
      'project names',
    ],
  });

  const [codename, setCodename] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    generateCodename();
  }, []);

  const generateCodename = () => {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    setCodename(`${prefix} ${noun}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codename);
      addToast({
        title: 'Success',
        message: 'Identifier stored in clipboard.',
      });
    } catch (err) {
      addToast({
        title: 'Failure',
        message: 'Failed to copy name.',
        type: 'error',
      });
    }
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
              <BreadcrumbTitle title="Operation Gen" slug="cg" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Strategic identifier protocol. Generate unique nomenclature for
                classified operations, system assets, and neural modules.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Interaction Area */}
          <div className="lg:col-span-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-12 md:p-24 rounded-sm overflow-hidden group flex flex-col items-center justify-center">
              {/* Generative Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed={codename} className="w-full h-full" />
              </div>

              <div className="relative z-10 w-full flex flex-col items-center gap-16">
                <div className="text-center space-y-4">
                  <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-[0.5em]">
                    {'//'} ASSIGNED_IDENTIFIER
                  </span>
                  <div className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none border-b-8 border-white pb-4">
                    {codename}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  <button
                    onClick={generateCodename}
                    className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                  >
                    <ArrowsClockwiseIcon
                      weight="bold"
                      size={24}
                      className="group-hover:rotate-180 transition-transform duration-500"
                    />
                    <span>Map New Alias</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!codename}
                    className="group relative inline-flex items-center gap-4 px-12 py-6 border border-white/10 text-white hover:bg-white/5 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-bold rounded-sm disabled:opacity-20"
                  >
                    <CopyIcon weight="bold" size={24} />
                    <span>Store Mapping</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Module */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <ShieldCheckIcon weight="fill" />
                Assignment_Parameters
              </h3>

              <div className="space-y-6">
                <div className="space-y-2 pb-6 border-b border-white/5">
                  <span className="font-mono text-[10px] text-gray-600 uppercase">
                    Context
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    Classified_Operational
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-gray-600 uppercase">
                    Source
                  </span>
                  <p className="text-white font-black uppercase tracking-tight">
                    Linguistic_Matrix_V2
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Identifiers are generated through a semantic pairing algorithm.
                This ensures distinct nomenclature for tracking and security
                purposes.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Alias_Engine_v0.6.1</span>
          <span className="text-gray-800">ASSIGNMENT_STATUS // CONFIRMED</span>
        </footer>
      </div>
    </div>
  );
};

export default CodenameGeneratorPage;
