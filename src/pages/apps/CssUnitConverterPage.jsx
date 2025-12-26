import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  RulerIcon,
  InfoIcon,
  ArrowsLeftRightIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import CustomDropdown from '../../components/CustomDropdown';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const CssUnitConverterPage = () => {
  const appName = 'Unit Converter';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Bilateral translation layer for CSS length units.',
    keywords: [
      'Fezcodex',
      'CSS unit converter',
      'px to rem',
      'em to px',
      'vw to px',
    ],
  });

  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('px');
  const [basePx, setBasePx] = useState(16);

  const convertUnits = (value, unit, base) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue))
      return { px: '', em: '', rem: '', vw: '', vh: '', percent: '' };

    let pxValue;
    switch (unit) {
      case 'px':
        pxValue = numValue;
        break;
      case 'em':
      case 'rem':
        pxValue = numValue * base;
        break;
      case 'vw':
        pxValue = (numValue / 100) * 1920;
        break;
      case 'vh':
        pxValue = (numValue / 100) * 1080;
        break;
      case 'percent':
        pxValue = (numValue / 100) * base;
        break;
      default:
        pxValue = numValue;
    }

    return {
      px: pxValue.toFixed(2),
      em: (pxValue / base).toFixed(2),
      rem: (pxValue / base).toFixed(2),
      vw: ((pxValue / 1920) * 100).toFixed(2),
      vh: ((pxValue / 1080) * 100).toFixed(2),
      percent: ((pxValue / base) * 100).toFixed(2),
    };
  };

  const conversions = convertUnits(inputValue, inputUnit, basePx);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Unit Converter" slug="css" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Bilateral translation layer for CSS length units. Standardize
                your spatial measurements across digital viewpoints.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 rounded-sm group overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt
                  seed="CSS_UNIT_INPUT"
                  className="w-full h-full"
                />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-12 flex items-center gap-2">
                <RulerIcon weight="fill" className="text-emerald-500" />
                Input_Parameters
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Value to Convert
                  </label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-transparent border-b-2 border-white/10 py-4 text-5xl font-mono text-white focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                      Source Unit
                    </label>
                    <CustomDropdown
                      options={[
                        { label: 'PX', value: 'px' },
                        { label: 'EM', value: 'em' },
                        { label: 'REM', value: 'rem' },
                        { label: 'VW', value: 'vw' },
                        { label: 'VH', value: 'vh' },
                        { label: '%', value: 'percent' },
                      ]}
                      value={inputUnit}
                      onChange={setInputUnit}
                      label="Unit"
                      variant="brutalist"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                      Base Pixel (rem/em)
                    </label>
                    <input
                      type="number"
                      value={basePx}
                      onChange={(e) =>
                        setBasePx(parseFloat(e.target.value) || 16)
                      }
                      className="bg-transparent border border-gray-800 rounded-sm p-2 text-sm font-mono text-gray-300 focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
              <div className="flex items-center gap-3 mb-6 text-emerald-500">
                <InfoIcon size={20} weight="bold" />
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  System_Reference
                </h4>
              </div>
              <div className="space-y-4 text-xs font-mono text-gray-500 uppercase tracking-wider leading-relaxed">
                <p>
                  <span className="text-white">REM:</span> Relative to root
                  font-size (base).
                </p>
                <p>
                  <span className="text-white">EM:</span> Relative to parent
                  font-size.
                </p>
                <p>
                  <span className="text-white">VW/VH:</span> Relative to 1% of
                  viewport width/height.
                </p>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <ArrowsLeftRightIcon weight="fill" className="text-emerald-500" />
              Computed_Mappings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(conversions).map(([unit, value]) => (
                <div
                  key={unit}
                  className="p-6 border border-white/10 bg-white/[0.01] rounded-sm group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/0 group-hover:bg-emerald-500/30 transition-all" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono font-bold text-gray-600 uppercase tracking-widest">
                      {unit === 'percent' ? 'Percentage' : unit}
                    </span>
                    <div className="font-mono text-2xl text-emerald-400 group-hover:text-white transition-colors">
                      {value || '0.00'}
                      <span className="text-gray-700 ml-1 text-sm">
                        {unit === 'percent' ? '%' : unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssUnitConverterPage;
