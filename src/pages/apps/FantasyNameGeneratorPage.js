import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CopySimpleIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import CustomDropdown from '../../components/CustomDropdown';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const FantasyNameGeneratorPage = () => {
  useSeo({
    title: 'Fantasy Name Generator | Fezcodex',
    description:
      'Generate random fantasy names for humans, elves, dwarves, and orcs for your stories and games.',
    keywords: [
      'Fezcodex',
      'fantasy name generator',
      'random name',
      'human names',
      'elf names',
      'dwarf names',
      'orc names',
    ],
    ogTitle: 'Fantasy Name Generator | Fezcodex',
    ogDescription:
      'Generate random fantasy names for humans, elves, dwarves, and orcs for your stories and games.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Fantasy Name Generator | Fezcodex',
    twitterDescription:
      'Generate random fantasy names for humans, elves, dwarves, and orcs for your stories and games.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
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
          message: 'Name copied to clipboard!',
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
    }
  };

  const generateName = () => {
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

    const getRandomElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    const selectedParts = nameParts[nameType];
    if (!selectedParts) {
      setGeneratedName('Invalid name type');
      return;
    }

    let name = getRandomElement(selectedParts.prefixes);
    if (Math.random() > 0.3) {
      // 70% chance to add a middle part
      name += getRandomElement(selectedParts.middles);
    }
    name += getRandomElement(selectedParts.suffixes);

    // Simple capitalization
    setGeneratedName(name.charAt(0).toUpperCase() + name.slice(1));
  };

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4" >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Apps
        </Link>
          <BreadcrumbTitle title="Fantasy Name Generator" slug="fng" />
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
                Fantasy Name Generator{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="mb-6">
                <label
                  htmlFor="nameType"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name Type
                </label>
                <CustomDropdown
                  options={[
                    { label: 'Human', value: 'human' },
                    { label: 'Elf', value: 'elf' },
                    { label: 'Dwarf', value: 'dwarf' },
                    { label: 'Orc', value: 'orc' },
                  ]}
                  value={nameType}
                  onChange={setNameType}
                  label="Name Type"
                />
              </div>
              <button
                onClick={generateName}
                className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out border bg-tb text-app border-app-alpha-50 hover:bg-app/15"
              >
                Generate Name
              </button>
              {generatedName && (
                <div className="mt-6 p-4 bg-gray-700 rounded-md text-center flex items-center justify-center space-x-2">
                  <p className="text-xl font-arvo font-normal text-rose-400">
                    {generatedName}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors duration-200"
                    title="Copy to clipboard"
                  >
                    <CopySimpleIcon size={20} color={colors.app} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyNameGeneratorPage;
