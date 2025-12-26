import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  UserFocusIcon,
  ArrowsClockwiseIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import CustomDropdown from '../../components/CustomDropdown';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const FantasyNameGeneratorPage = () => {
  const appName = 'Identity Gen';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Protocol for archetypal nomenclature. Generate names for humans, elves, dwarves, and orcs.',
    keywords: [
      'Fezcodex',
      'fantasy name generator',
      'random name',
      'human names',
      'elf names',
      'dwarf names',
      'orc names',
    ],
  });

  const [nameType, setNameType] = useState('human');
  const [generatedName, setGeneratedName] = useState('');
  const { addToast } = useToast();

  const handleCopy = async () => {
    if (generatedName) {
      try {
        await navigator.clipboard.writeText(generatedName);
        addToast({
          title: 'Success',
          message: 'Identity mapped to clipboard.',
        });
      } catch (err) {
        addToast({
          title: 'Failure',
          message: 'Mapping failed.',
          type: 'error',
        });
      }
    }
  };

  const nameParts = {
    human: {
      prefixes: [
        'Ael',
        'Bor',
        'Cael',
        'Dra',
        'El',
        'Fen',
        'Gor',
        'Hal',
        'Isol',
        'Jor',
        'Kal',
        'Lor',
        'Mor',
        'Nor',
        'Orin',
        'Per',
        'Quinn',
        'Roric',
        'Ser',
        'Thorn',
        'Ulric',
        'Val',
        'Wyn',
        'Ald',
        'Bran',
        'Cor',
        'Dain',
        'Ed',
        'Finn',
        'Gareth',
        'Haldor',
        'Ivar',
        'Kaelen',
        'Leif',
        'Magnus',
        'Niall',
        'Odin',
        'Perrin',
        'Ragnar',
        'Sten',
        'Torvin',
        'Ulf',
        'Vance',
        'Wulf',
      ],
      middles: [
        'an',
        'den',
        'ric',
        'wyn',
        'gar',
        'lin',
        'dor',
        'mar',
        'van',
        'thar',
        'mond',
        'bert',
        'fred',
        'gorn',
        'hald',
        'kiel',
        'land',
        'morn',
        'niel',
        'rath',
        'sian',
        'tian',
        'vyn',
        'ard',
        'ast',
        'ber',
        'dal',
        'dred',
        'eon',
        'fyn',
        'glen',
        'hark',
        'ing',
        'kyn',
        'lar',
        'mond',
        'nys',
        'oth',
        'pyr',
        'quen',
        'ryn',
        'syl',
        'tav',
        'und',
        'ver',
        'wynn',
      ],
      suffixes: [
        'us',
        'a',
        'on',
        'en',
        'or',
        'yn',
        'ia',
        'eth',
        'an',
        'ar',
        'da',
        'el',
        'is',
        'ra',
        'os',
        'er',
        'in',
        'of',
        'um',
        'ald',
        'ard',
        'bert',
        'mond',
        'red',
        'son',
        'ton',
        'born',
        'brook',
        'field',
        'ford',
        'ham',
        'hurst',
        'ley',
        'mont',
        'ridge',
        'shire',
        'stead',
        'ton',
        'vale',
        'wood',
        'wick',
        'worth',
        'stone',
        'shield',
        'blade',
        'heart',
      ],
    },
    elf: {
      prefixes: [
        'Aer',
        'Ael',
        'El',
        'Fael',
        'Lae',
        'Lir',
        'Sil',
        'Thran',
        'Val',
        'Xyl',
        'Yl',
        'Zyl',
        'Aen',
        'Alat',
        'Aran',
        'Bael',
        'Caelen',
        'Dae',
        'Eil',
        'Fin',
        'Gael',
        'Hael',
        'Ili',
        'Jor',
        'Kael',
        'Loth',
        'Mael',
        'Nym',
        'Olen',
        'Pael',
        'Quen',
        'Riel',
        'Sael',
        'Tael',
        'Ulen',
        'Ven',
        'Wyl',
      ],
      middles: [
        'an',
        'ara',
        'en',
        'iel',
        'ion',
        'ith',
        'or',
        'wen',
        'yn',
        'dor',
        'mar',
        'van',
        'thal',
        'rion',
        'syl',
        'tir',
        'aen',
        'al',
        'ath',
        'dar',
        'dran',
        'eon',
        'fiel',
        'glen',
        'hian',
        'ian',
        'ith',
        'lan',
        'lin',
        'mir',
        'nys',
        'oth',
        'phyr',
        'quel',
        'ryn',
        'sian',
        'tian',
        'und',
        'vyn',
        'wen',
      ],
      suffixes: [
        'as',
        'a',
        'el',
        'en',
        'ia',
        'ion',
        'is',
        'or',
        'os',
        'ra',
        'us',
        'wyn',
        'ys',
        'eth',
        'iel',
        'in',
        'on',
        'ril',
        'wen',
        'dore',
        'fiel',
        'las',
        'mar',
        'nys',
        'ore',
        'riel',
        'sil',
        'thas',
        'van',
        'wen',
        'wyn',
        'ys',
        'aen',
        'dar',
        'ion',
        'ith',
        'lan',
        'lin',
        'mir',
      ],
    },
    dwarf: {
      prefixes: [
        'Bor',
        'Dur',
        'Gim',
        'Kael',
        'Thrain',
        'Bal',
        'Dwal',
        'Fili',
        'Kili',
        'Oin',
        'Gloin',
        'Thor',
        'Bif',
        'Bof',
        'Bomb',
        'Bard',
        'Brok',
        'Dori',
        'Farin',
        'Flint',
        'Gror',
        'Haldor',
        'Iron',
        'Khard',
        'Lodur',
        'Mordin',
        'Nain',
        'Orik',
        'Roric',
        'Stone',
        'Throk',
        'Ulfgar',
        'Volk',
      ],
      middles: [
        'in',
        'grim',
        'li',
        'son',
        'gar',
        'rek',
        'und',
        'orn',
        'rak',
        'dal',
        'mar',
        'stone',
        'beard',
        'hammer',
        'axe',
        'axe',
        'beard',
        'braid',
        'breaker',
        'delver',
        'fist',
        'forge',
        'hand',
        'heart',
        'helm',
        'hide',
        'iron',
        'rock',
        'shield',
        'stone',
        'stride',
        'tamer',
        'thane',
        'hammer',
      ],
      suffixes: [
        'son',
        'in',
        'grim',
        'li',
        'rek',
        'und',
        'orn',
        'rak',
        'dal',
        'mar',
        'stone',
        'beard',
        'hammer',
        'axe',
        'foot',
        'hand',
        'shield',
        'born',
        'brook',
        'delver',
        'dottir',
        'fist',
        'forge',
        'hand',
        'heart',
        'helm',
        'hide',
        'iron',
        'rock',
        'shield',
        'son',
        'stone',
        'stride',
        'tamer',
        'thane',
        'hammer',
      ],
    },
    orc: {
      prefixes: [
        'Grak',
        'Thorg',
        'Ur',
        'Morg',
        'Grish',
        'Azog',
        'Bolg',
        'Drog',
        'Grog',
        'Karg',
        'Maug',
        'Snag',
        'Blud',
        'Drak',
        'Frak',
        'Gnar',
        'Harg',
        'Krag',
        'Lurg',
        'Mulg',
        'Oog',
        'Ragn',
        'Skarg',
        'Trog',
        'Vorg',
        'Zog',
      ],
      middles: [
        'ash',
        'uk',
        'og',
        'nar',
        'gul',
        'rak',
        'oth',
        'fang',
        'skull',
        'blood',
        'hide',
        'tooth',
        'bash',
        'bone',
        'gut',
        'head',
        'jaw',
        'maul',
        'rend',
        'rip',
        'snarl',
        'smash',
        'spike',
        'tusk',
        'gore',
        'flesh',
      ],
      suffixes: [
        'ak',
        'ug',
        'osh',
        'uk',
        'a',
        'ar',
        'da',
        'er',
        'ish',
        'ok',
        'or',
        'oth',
        'ra',
        'rag',
        'rot',
        'ruk',
        'um',
        'un',
        'ur',
        'blood',
        'fang',
        'fist',
        'hide',
        'killer',
        'maul',
        'ripper',
        'scar',
        'skull',
        'smasher',
        'tooth',
        'axe',
        'blade',
        'gut',
        'jaw',
      ],
    },
  };

  const generateName = () => {
    const getRandomElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];
    const selectedParts = nameParts[nameType];
    if (!selectedParts) return;

    let name = getRandomElement(selectedParts.prefixes);
    if (Math.random() > 0.3) name += getRandomElement(selectedParts.middles);
    name += getRandomElement(selectedParts.suffixes);
    setGeneratedName(name.charAt(0).toUpperCase() + name.slice(1));
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
              <BreadcrumbTitle title="Identity Gen" slug="fng" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Identity synthesis protocol. Generate archetypal nomenclature
                for diverse neural profiles and systemic entities.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Interaction Area */}
          <div className="lg:col-span-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-12 md:p-24 rounded-sm overflow-hidden group flex flex-col items-center justify-center">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={generatedName || appName}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 w-full flex flex-col items-center gap-16">
                <div className="text-center space-y-4">
                  <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-[0.5em]">
                    {'//'} SYNTHESIZED_NAME
                  </span>
                  <div
                    className={`text-5xl md:text-[8rem] font-black tracking-tighter uppercase leading-none transition-all duration-500 ${generatedName ? 'text-white' : 'text-gray-800'}`}
                  >
                    {generatedName || 'Identity'}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  <button
                    onClick={generateName}
                    className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                  >
                    <ArrowsClockwiseIcon
                      weight="bold"
                      size={24}
                      className="group-hover:rotate-180 transition-transform duration-500"
                    />
                    <span>Synthesize New</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!generatedName}
                    className="group relative inline-flex items-center gap-4 px-12 py-6 border border-white/10 text-white hover:bg-white/5 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-bold rounded-sm disabled:opacity-20"
                  >
                    <CopySimpleIcon weight="bold" size={24} />
                    <span>Store Identity</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Config Module */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <UserFocusIcon weight="fill" />
                Origin_Parameters
              </h3>

              <div className="space-y-6">
                <label className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  Selected_Archetype
                </label>
                <CustomDropdown
                  variant="brutalist"
                  options={[
                    { label: 'Human', value: 'human' },
                    { label: 'Elf', value: 'elf' },
                    { label: 'Dwarf', value: 'dwarf' },
                    { label: 'Orc', value: 'orc' },
                  ]}
                  value={nameType}
                  onChange={setNameType}
                  label="Archetype"
                />
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                  Nomenclature is derived from linguistic datasets mapped to
                  specific historical and cultural matrices.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Identity_Loom_v0.6.1</span>
          <span className="text-gray-800">MAPPING_ENGINE // ACTIVE</span>
        </footer>
      </div>
    </div>
  );
};

export default FantasyNameGeneratorPage;
