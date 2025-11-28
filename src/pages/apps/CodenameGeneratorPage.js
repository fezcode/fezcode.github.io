import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, Sparkle, Copy } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import colors from '../../config/colors';
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
];

const nouns = [
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
  useSeo({
    title: 'Codename Generator | Fezcodex',
    description:
      'Generate random codenames for your projects, games, or anything else.',
    keywords: [
      'Fezcodex',
      'codename generator',
      'random name generator',
      'project names',
    ],
    ogTitle: 'Codename Generator | Fezcodex',
    ogDescription:
      'Generate random codenames for your projects, games, or anything else.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Codename Generator | Fezcodex',
    twitterDescription:
      'Generate random codenames for your projects, games, or anything else.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
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
        message: 'Codename is copied to clipboard!',
        duration: 3000,
      });
    } catch (err) {
      addToast({
        title: 'Failure',
        message: 'Failed to copy name!',
        duration: 3000,
      });
      console.error('Failed to copy: ', err);
    }
  };

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Codename Generator" slug="cg" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                {' '}
                Codename Generator{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="flex flex-col items-center gap-8">
                <div className="relative text-4xl text-indigo-100 font-bold text-center h-16 mt-12">
                  <div
                    className="relative underline"
                    style={{
                      fontFamily: 'Playfair Display',
                      textDecorationThickness: '10px',
                    }}
                  >
                    {codename}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={generateCodename}
                    className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-app/50 text-white hover:bg-app/70"
                    style={{ borderColor: colors['app-alpha-50'] }}
                  >
                    <Sparkle size={20} /> Generate
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-app/50 text-white hover:bg-app/70"
                    disabled={!codename}
                    style={{ borderColor: colors['app-alpha-50'] }}
                  >
                    <Copy size={20} /> Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodenameGeneratorPage;
