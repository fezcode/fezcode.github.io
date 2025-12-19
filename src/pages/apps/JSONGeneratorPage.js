import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  DatabaseIcon,
  GearIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import CustomDropdown from '../../components/CustomDropdown';
import GenerativeArt from '../../components/GenerativeArt';
import {
  meaningfulKeys,
  generateMeaningfulString,
  generateRandomEmail,
  generateRandomUrl,
  generateRandomDate,
} from '../../utils/jsonGeneratorData';

const generateRandomNumber = () => Math.floor(Math.random() * 1000);
const generateRandomBoolean = () => Math.random() > 0.5;

function JSONGeneratorPage() {
  const appName = 'JSON Generator';

  useSeo({
    title: `${appName} | Fezcodex`,
    description:
      'Protocol for generating synthetic data structures and mapping complex JSON schemas.',
    keywords: [
      'Fezcodex',
      'JSON generator',
      'random JSON',
      'JSON tool',
      'developer tool',
    ],
  });

  const { addToast } = useToast();
  const [jsonOutput, setJsonOutput] = useState('{}');
  const [depth, setDepth] = useState(3);
  const [minDepth, setMinDepth] = useState(1);
  const [numKeys, setNumKeys] = useState(3);
  const [arrayProbability] = useState(0.3);
  const [primitiveProbability] = useState(0.2);
  const [includeBooleans, setIncludeBooleans] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeStrings, setIncludeStrings] = useState(true);
  const [includeNull, setIncludeNull] = useState(true);
  const [stringType, setStringType] = useState('randomWords');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (minDepth > depth)
      setValidationError('Min Depth cannot exceed Max Depth.');
    else if (depth > 10)
      setValidationError('Max Depth restricted to 10 layers.');
    else setValidationError('');
  }, [minDepth, depth]);

  const getRandomStringValue = useCallback(() => {
    switch (stringType) {
      case 'email':
        return generateRandomEmail();
      case 'url':
        return generateRandomUrl();
      case 'date':
        return generateRandomDate();
      default:
        return generateMeaningfulString();
    }
  }, [stringType]);

  const generateValue = useCallback(
    (currentDepth) => {
      const availableTypes = [];
      if (includeStrings) availableTypes.push('string');
      if (includeNumbers) availableTypes.push('number');
      if (includeBooleans) availableTypes.push('boolean');
      if (includeNull) availableTypes.push('null');

      if (availableTypes.length === 0) return 'NO_TYPES';

      const forceComplex = currentDepth < minDepth;
      const shouldGeneratePrimitive =
        !forceComplex &&
        (currentDepth >= depth || Math.random() < primitiveProbability);

      if (shouldGeneratePrimitive) {
        const type =
          availableTypes[Math.floor(Math.random() * availableTypes.length)];
        switch (type) {
          case 'string':
            return getRandomStringValue();
          case 'number':
            return generateRandomNumber();
          case 'boolean':
            return generateRandomBoolean();
          case 'null':
            return null;
          default:
            return 'fallback';
        }
      }

      const isArray = Math.random() < arrayProbability;
      if (isArray) {
        const arrLength = Math.floor(Math.random() * 3) + 2;
        return Array.from({ length: arrLength }).map(() =>
          generateValue(currentDepth + 1),
        );
      } else {
        const obj = {};
        const keysUsed = new Set();
        for (let i = 0; i < numKeys; i++) {
          let key;
          do {
            key =
              meaningfulKeys[Math.floor(Math.random() * meaningfulKeys.length)];
          } while (keysUsed.has(key));
          keysUsed.add(key);
          obj[key] = generateValue(currentDepth + 1);
        }
        return obj;
      }
    },
    [
      depth,
      minDepth,
      numKeys,
      arrayProbability,
      primitiveProbability,
      includeBooleans,
      includeNumbers,
      includeStrings,
      includeNull,
      getRandomStringValue,
    ],
  );

  const handleGenerateJson = useCallback(() => {
    try {
      const generatedObject = generateValue(1);
      setJsonOutput(JSON.stringify(generatedObject, null, 2));
      addToast({ title: 'Success', message: 'Data structure synthesized.' });
    } catch (error) {
      addToast({ title: 'Error', message: 'Synthesis failed.', type: 'error' });
    }
  }, [generateValue, addToast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      addToast({ title: 'Copied', message: 'Structure stored in clipboard.' });
    });
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
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                {appName}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Synthetic data factory. Map complex hierarchical structures and
                generate high-fidelity JSON objects for system testing.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <GearIcon weight="fill" />
                Schema_Parameters
              </h3>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="font-mono text-[9px] text-gray-500 uppercase">
                      Min_Depth
                    </label>
                    <input
                      type="number"
                      value={minDepth}
                      onChange={(e) => setMinDepth(parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-3 font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="font-mono text-[9px] text-gray-500 uppercase">
                      Max_Depth
                    </label>
                    <input
                      type="number"
                      value={depth}
                      onChange={(e) => setDepth(parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-3 font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="font-mono text-[9px] text-gray-500 uppercase">
                    Keys_Per_Object
                  </label>
                  <input
                    type="number"
                    value={numKeys}
                    onChange={(e) => setNumKeys(parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-sm p-3 font-mono text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-mono text-[9px] text-gray-500 uppercase">
                    String_Type
                  </label>
                  <CustomDropdown
                    variant="brutalist"
                    options={[
                      { label: 'Words', value: 'randomWords' },
                      { label: 'Email', value: 'email' },
                      { label: 'URL', value: 'url' },
                      { label: 'Date', value: 'date' },
                    ]}
                    value={stringType}
                    onChange={setStringType}
                    label="String Type"
                  />
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <label className="font-mono text-[9px] text-gray-500 uppercase block mb-4">
                    Primitive_Types
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: 'Strings',
                        state: includeStrings,
                        set: setIncludeStrings,
                      },
                      {
                        label: 'Numbers',
                        state: includeNumbers,
                        set: setIncludeNumbers,
                      },
                      {
                        label: 'Booleans',
                        state: includeBooleans,
                        set: setIncludeBooleans,
                      },
                      {
                        label: 'Nulls',
                        state: includeNull,
                        set: setIncludeNull,
                      },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => opt.set(!opt.state)}
                        className={`flex items-center justify-between p-3 border transition-all text-[9px] font-mono uppercase ${opt.state ? 'bg-emerald-500/10 border-emerald-500/30 text-white' : 'border-white/5 text-gray-600'}`}
                      >
                        {opt.label}
                        <div
                          className={`w-2 h-2 ${opt.state ? 'bg-emerald-500' : 'bg-gray-800'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {validationError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[10px] uppercase">
                  Error: {validationError}
                </div>
              )}

              <button
                onClick={handleGenerateJson}
                disabled={!!validationError}
                className="w-full py-6 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-emerald-500 transition-all rounded-sm disabled:opacity-20"
              >
                Synthesize Object
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-8">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden min-h-[600px] flex flex-col">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={appName + jsonOutput.length}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 flex-1 flex flex-col space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                  <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <DatabaseIcon weight="fill" />
                    Generated_Structure
                  </h3>
                  <button
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <CopySimpleIcon size={24} weight="bold" />
                  </button>
                </div>

                <textarea
                  readOnly
                  value={jsonOutput}
                  className="flex-1 w-full bg-black/40 border border-white/5 rounded-sm p-8 font-mono text-sm leading-relaxed text-emerald-400 focus:ring-0 resize-none shadow-inner custom-scrollbar-terminal"
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Data_Fabricator_v0.6.1</span>
          <span className="text-gray-800">SCHEMA_LOADED // READY</span>
        </footer>
      </div>
    </div>
  );
}

export default JSONGeneratorPage;
