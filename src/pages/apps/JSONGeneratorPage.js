import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CopySimpleIcon } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from "../../hooks/useSeo";
import {
  meaningfulKeys,
  generateMeaningfulString,
  generateRandomEmail,
  generateRandomUrl,
  generateRandomDate
} from '../../utils/jsonGeneratorData';

const generateRandomNumber = () => Math.floor(Math.random() * 1000);
const generateRandomBoolean = () => Math.random() > 0.5;

function JSONGeneratorPage() {
  useSeo({
    title: 'JSON Generator | Fezcodex',
    description: 'Generate random JSON objects with customizable depth, key count, and data types.',
    keywords: ['Fezcodex', 'JSON generator', 'random JSON', 'JSON tool', 'developer tool'],
    ogTitle: 'JSON Generator | Fezcodex',
    ogDescription: 'Generate random JSON objects with customizable depth, key count, and data types.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'JSON Generator | Fezcodex',
    twitterDescription: 'Generate random JSON objects with customizable depth, key count, and data types.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

  const [jsonOutput, setJsonOutput] = useState('{}');
  const [depth, setDepth] = useState(3); // Max depth
  const [minDepth, setMinDepth] = useState(1); // Min depth
  const [numKeys, setNumKeys] = useState(3);
  const [arrayProbability, setArrayProbability] = useState(0.3); // 30% chance for an array
  const [primitiveProbability, setPrimitiveProbability] = useState(0.2); // 20% chance for a primitive at any level
  const [includeBooleans, setIncludeBooleans] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeStrings, setIncludeStrings] = useState(true);
  const [includeNull, setIncludeNull] = useState(true);
  const [stringType, setStringType] = useState('randomWords'); // 'randomWords', 'email', 'url', 'date'
  const [validationError, setValidationError] = useState('');
  const { addToast } = useToast();

  // Validation function
  const validateDepths = useCallback((min, max) => {
    if (min > max) {
      setValidationError('Min Depth cannot be greater than Max Depth.');
      return false;
    }
    if (max > 10) {
      setValidationError('Max Depth cannot exceed 10 to prevent excessive recursion.');
      return false;
    }
    setValidationError('');
    return true;
  }, []);

  // Effect to run validation when depths change
  React.useEffect(() => {
    validateDepths(minDepth, depth);
  }, [minDepth, depth, validateDepths]);

  const getRandomStringValue = useCallback(() => {
    switch (stringType) {
      case 'email': return generateRandomEmail();
      case 'url': return generateRandomUrl();
      case 'date': return generateRandomDate();
      case 'randomWords':
      default: return generateMeaningfulString();
    }
  }, [stringType]);

  const generateValue = useCallback((currentDepth) => {
    const availableTypes = [];
    if (includeStrings) availableTypes.push('string');
    if (includeNumbers) availableTypes.push('number');
    if (includeBooleans) availableTypes.push('boolean');
    if (includeNull) availableTypes.push('null');

    if (availableTypes.length === 0) {
      return "NO_TYPES_SELECTED"; // Fallback if no types are selected
    }

    // Force complex type if currentDepth is less than minDepth
    const forceComplex = currentDepth < minDepth;

    // Decide if a primitive should be generated at this level
    // Only consider primitiveProbability if not forcing complex and not already at max depth
    const shouldGeneratePrimitive = !forceComplex && (currentDepth >= depth || Math.random() < primitiveProbability);

    if (shouldGeneratePrimitive) {
      const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      switch (type) {
        case 'string': return getRandomStringValue();
        case 'number': return generateRandomNumber();
        case 'boolean': return generateRandomBoolean();
        case 'null': return null;
        default: return 'fallback_primitive';
      }
    }

    // If not generating a primitive (either forced complex or decided not to be primitive),
    // decide between object or array.
    const isArray = Math.random() < arrayProbability;

    if (isArray) {
      const arrLength = Math.floor(Math.random() * 3) + 2; // 2 to 4 elements
      return Array.from({ length: arrLength }).map(() => generateValue(currentDepth + 1));
    } else {
      const obj = {};
      const keysUsed = new Set();
      for (let i = 0; i < numKeys; i++) {
        let key;
        do {
          key = meaningfulKeys[Math.floor(Math.random() * meaningfulKeys.length)];
        } while (keysUsed.has(key)); // Ensure unique keys within the same object
        keysUsed.add(key);
        obj[key] = generateValue(currentDepth + 1);
      }
      return obj;
    }
  }, [depth, minDepth, numKeys, arrayProbability, primitiveProbability, includeBooleans, includeNumbers, includeStrings, includeNull, getRandomStringValue]);

  const handleGenerateJson = useCallback(() => {
    try {
      const generatedObject = generateValue(1);
      setJsonOutput(JSON.stringify(generatedObject, null, 2));
      addToast({
        title: 'Success',
        message: 'JSON generated successfully!',
        duration: 3000,
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: `Failed to generate JSON: ${error.message}`,
        duration: 3000,
      });
      console.error("JSON generation error:", error);
    }
  }, [generateValue, addToast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput)
      .then(() => {
        addToast({
          title: 'Copied!',
          message: 'JSON copied to clipboard.',
          duration: 5000,
        });
      })
      .catch(err => {
        addToast({
          title: 'Error',
          message: 'Failed to copy JSON.',
          duration: 5000,
        });
        console.error('Failed to copy JSON: ', err);
      });
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">json-gen</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="bg-app-alpha-10 border-app-alpha-50 text-app hover:bg-app/10 group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> JSON Generator </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="minDepth" className="block text-sm font-medium text-gray-400">Min Depth:</label>
                  <input
                    type="number"
                    id="minDepth"
                    value={minDepth}
                    onChange={(e) => {
                      const newMinDepth = Math.max(1, parseInt(e.target.value));
                      setMinDepth(newMinDepth);
                    }}
                    min="1"
                    className="mt-1 block w-full rounded-md bg-gray-900/50 border-gray-700 shadow-sm focus:border-app focus:ring-app text-app-light"
                  />
                </div>
                <div>
                  <label htmlFor="depth" className="block text-sm font-medium text-gray-400">Max Depth:</label>
                  <input
                    type="number"
                    id="depth"
                    value={depth}
                    onChange={(e) => {
                      const newDepth = Math.min(10, Math.max(1, parseInt(e.target.value)));
                      setDepth(newDepth);
                    }}
                    min="1"
                    max="10"
                    className="mt-1 block w-full rounded-md bg-gray-900/50 border-gray-700 shadow-sm focus:border-app focus:ring-app text-app-light"
                  />
                </div>
                <div>
                  <label htmlFor="numKeys" className="block text-sm font-medium text-gray-400">Number of Keys per Object:</label>
                  <input
                    type="number"
                    id="numKeys"
                    value={numKeys}
                    onChange={(e) => setNumKeys(Math.max(1, parseInt(e.target.value)))}
                    min="1"
                    className="mt-1 block w-full rounded-md bg-gray-900/50 border-gray-700 shadow-sm focus:border-app focus:ring-app text-app-light"
                  />
                </div>
                <div>
                  <label htmlFor="arrayProbability" className="block text-sm font-medium text-gray-400">Array Probability (0.0 - 1.0):</label>
                  <input
                    type="number"
                    id="arrayProbability"
                    value={arrayProbability}
                    onChange={(e) => setArrayProbability(Math.max(0, Math.min(1, parseFloat(e.target.value))))}
                    min="0"
                    max="1"
                    step="0.1"
                    className="mt-1 block w-full rounded-md bg-gray-900/50 border-gray-700 shadow-sm focus:border-app focus:ring-app text-app-light"
                  />
                </div>
                <div>
                  <label htmlFor="primitiveProbability" className="block text-sm font-medium text-gray-400">Primitive Probability (0.0 - 1.0):</label>
                  <input
                    type="number"
                    id="primitiveProbability"
                    value={primitiveProbability}
                    onChange={(e) => setPrimitiveProbability(Math.max(0, Math.min(1, parseFloat(e.target.value))))}
                    min="0"
                    max="1"
                    step="0.1"
                    className="mt-1 block w-full rounded-md bg-gray-900/50 border-gray-700 shadow-sm focus:border-app focus:ring-app text-app-light"
                  />
                </div>
                <div>
                  <label htmlFor="stringType" className="block text-sm font-medium text-gray-400">String Type:</label>
                  <select
                    id="stringType"
                    value={stringType}
                    onChange={(e) => setStringType(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-900/50 border-gray-700 shadow-sm focus:border-app focus:ring-app text-app-light"
                  >
                    <option value="randomWords">Random Words</option>
                    <option value="email">Email</option>
                    <option value="url">URL</option>
                    <option value="date">Date (YYYY-MM-DD)</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-400 mb-2">Include Data Types:</span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeStrings}
                      onChange={(e) => setIncludeStrings(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-app transition duration-150 ease-in-out rounded border-gray-700 bg-gray-900/50 focus:ring-app"
                    />
                    <span className="ml-2 text-gray-300">Strings</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-app transition duration-150 ease-in-out rounded border-gray-700 bg-gray-900/50 focus:ring-app"
                    />
                    <span className="ml-2 text-gray-300">Numbers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeBooleans}
                      onChange={(e) => setIncludeBooleans(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-app transition duration-150 ease-in-out rounded border-gray-700 bg-gray-900/50 focus:ring-app"
                    />
                    <span className="ml-2 text-gray-300">Booleans</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeNull}
                      onChange={(e) => setIncludeNull(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-app transition duration-150 ease-in-out rounded border-gray-700 bg-gray-900/50 focus:ring-app"
                    />
                    <span className="ml-2 text-gray-300">Null</span>
                  </label>
                </div>
              </div>

              {validationError && (
                <div className="text-red-500 text-sm mb-4">
                  {validationError}
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handleGenerateJson}
                  disabled={!!validationError}
                  className={`flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out ${
                    validationError
                      ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
                      : 'bg-tb text-app border-app-alpha-50 hover:bg-app/15'
                  }`}
                >
                  Generate JSON
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-tb text-app border-app-alpha-50 hover:bg-app/15"
                >
                  <CopySimpleIcon size={24} />
                  Copy to Clipboard
                </button>
              </div>

              <div className="mt-4">
                <label htmlFor="jsonOutput" className="block text-sm font-medium text-gray-400 mb-2">Generated JSON:</label>
                <textarea
                  id="jsonOutput"
                  readOnly
                  value={jsonOutput}
                  className="w-full h-96 p-4 bg-gray-900/50 font-mono resize-y border rounded-md border-gray-700 focus:ring-app text-app-light"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JSONGeneratorPage;
