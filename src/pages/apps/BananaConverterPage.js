import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, PlantIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import CustomDropdown from '../../components/CustomDropdown'; // Import CustomDropdown
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const BANANA_LENGTH_CM = 18; // Average banana length
const BANANA_WEIGHT_G = 120; // Average banana weight

const unitOptions = [
  { label: 'cm', value: 'cm' },
  { label: 'm', value: 'm' },
  { label: 'km', value: 'km' },
  { label: 'in', value: 'in' },
  { label: 'ft', value: 'ft' },
  { label: 'g', value: 'g' },
  { label: 'kg', value: 'kg' },
  { label: 'lb', value: 'lb' },
  { label: 'oz', value: 'oz' },
];

const BananaConverterPage = () => {
  useSeo({
    title: 'Banana for Scale Converter | Fezcodex',
    description: 'Convert measuring units into the internet standard: Bananas.',
    keywords: [
      'Fezcodex',
      'banana for scale',
      'converter',
      'fun',
      'measurement',
    ],
    ogTitle: 'Banana Converter | Fezcodex',
    ogDescription: 'Convert any unit of measurement into bananas.',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Banana Converter | Fezcodex',
    twitterDescription: 'Convert any unit of measurement into bananas.',
  });

  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('cm');
  const [result, setResult] = useState(null);

  const handleConvert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setResult(null);
      return;
    }

    let valInCm = 0;
    let valInG = 0;
    let isLength = true;

    switch (inputUnit) {
      // Lengths
      case 'cm':
        valInCm = val;
        break;
      case 'm':
        valInCm = val * 100;
        break;
      case 'km':
        valInCm = val * 100000;
        break;
      case 'in':
        valInCm = val * 2.54;
        break;
      case 'ft':
        valInCm = val * 30.48;
        break;
      // Weights
      case 'g':
        valInG = val;
        isLength = false;
        break;
      case 'kg':
        valInG = val * 1000;
        isLength = false;
        break;
      case 'lb':
        valInG = val * 453.592;
        isLength = false;
        break;
      case 'oz':
        valInG = val * 28.3495;
        isLength = false;
        break;
      default:
        break;
    }

    if (isLength) {
      setResult(`${(valInCm / BANANA_LENGTH_CM).toFixed(2)} Bananas long`);
    } else {
      setResult(`${(valInG / BANANA_WEIGHT_G).toFixed(2)} Bananas heavy`);
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
        <BreadcrumbTitle title="Banana Converter" slug="banana" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform h-full w-full max-w-2xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10 rounded-lg overflow-hidden"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1 text-center">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app flex items-center justify-center gap-2">
                <PlantIcon size={32} /> Banana Converter
              </h1>
              <hr className="border-gray-700 mb-6" />

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Value"
                    className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                  <CustomDropdown
                    options={unitOptions}
                    value={inputUnit}
                    onChange={setInputUnit}
                    label="Unit"
                  />
                </div>
                <button
                  onClick={handleConvert}
                  className="px-6 py-2 rounded-md font-arvo font-normal border transition-colors duration-300 hover:bg-yellow-500/20 text-yellow-500 border-yellow-500"
                >
                  Scale It!
                </button>
              </div>

              {result && (
                <div className="text-3xl font-bold text-yellow-400 animate-pulse">
                  {result} 🍌
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BananaConverterPage;
