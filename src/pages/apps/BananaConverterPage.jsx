import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlantIcon,
  ArrowsClockwiseIcon,
  RulerIcon,
  ScalesIcon,
  CalculatorIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';

const BANANA_LENGTH_CM = 18; // Average banana length
const BANANA_WEIGHT_G = 120; // Average banana weight

const unitOptions = [
  { label: 'CM', value: 'cm' },
  { label: 'M', value: 'm' },
  { label: 'KM', value: 'km' },
  { label: 'IN', value: 'in' },
  { label: 'FT', value: 'ft' },
  { label: 'G', value: 'g' },
  { label: 'KG', value: 'kg' },
  { label: 'LB', value: 'lb' },
  { label: 'OZ', value: 'oz' },
];

const BananaConverterPage = () => {
  const appName = 'Banana Converter';
  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Convert measuring units into the internet standard: Bananas.',
    keywords: [
      'Fezcodex',
      'banana for scale',
      'converter',
      'fun',
      'measurement',
    ],
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
      setResult(`${(valInCm / BANANA_LENGTH_CM).toFixed(2)} BANANAS_LONG`);
    } else {
      setResult(`${(valInG / BANANA_WEIGHT_G).toFixed(2)} BANANAS_HEAVY`);
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
              <BreadcrumbTitle
                title={appName}
                slug="banana"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Standardization protocol. Convert arbitrary metric and imperial
                units into the universal banana constant.
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
                  seed={appName + inputValue}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <RulerIcon weight="fill" /> Input_Value
                    </label>
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-4 font-mono text-xl text-white focus:border-emerald-500/50 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <ScalesIcon weight="fill" /> Unit_Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {unitOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setInputUnit(opt.value)}
                          className={`py-2 text-[10px] font-mono uppercase tracking-wider border transition-all ${
                            inputUnit === opt.value
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                              : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConvert}
                  className="w-full group relative inline-flex items-center justify-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm"
                >
                  <ArrowsClockwiseIcon
                    weight="bold"
                    size={20}
                    className="group-hover:rotate-180 transition-transform duration-500"
                  />
                  <span>Compute Scale</span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="relative group border border-emerald-500/20 bg-emerald-500/[0.02] p-8 md:p-12 rounded-sm overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-6 border-b border-emerald-500/10 pb-6">
                    <label className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center gap-2">
                      <span className="h-px w-4 bg-emerald-500/20" />{' '}
                      Calculated_Output
                    </label>
                    <PlantIcon
                      size={24}
                      weight="fill"
                      className="text-yellow-500"
                    />
                  </div>
                  <div className="font-mono text-4xl md:text-5xl font-black text-white leading-none tracking-tighter">
                    {result} 🍌
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <CalculatorIcon weight="fill" />
                Conversion_Constants
              </h3>

              <div className="space-y-6">
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm flex justify-between items-center">
                  <span className="font-mono text-[10px] text-gray-600 uppercase">
                    Length_Ref
                  </span>
                  <p className="text-white font-mono text-xs font-bold uppercase tracking-tight">
                    {BANANA_LENGTH_CM} CM
                  </p>
                </div>
                <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm flex justify-between items-center">
                  <span className="font-mono text-[10px] text-gray-600 uppercase">
                    Mass_Ref
                  </span>
                  <p className="text-white font-mono text-xs font-bold uppercase tracking-tight">
                    {BANANA_WEIGHT_G} G
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <PlantIcon size={24} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                The Banana Standard is the only universally accepted measurement
                system for internet-scale visual verification. All calculations
                assume a standard cavendish curve topology.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Scale_Engine_v0.9.4</span>
          <span className="text-gray-800">SYSTEM_STATUS // CALIBRATED</span>
        </footer>
      </div>
    </div>
  );
};

export default BananaConverterPage;
