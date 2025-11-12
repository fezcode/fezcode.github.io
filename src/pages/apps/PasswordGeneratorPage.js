import React, { useState, useCallback } from 'react';
import usePageTitle from '../../utils/usePageTitle';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CopySimple } from '@phosphor-icons/react';
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
 // Assuming general app button styles are here

const PasswordGeneratorPage = () => {
  usePageTitle('Password Generator');
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset.length === 0) {
      setPassword('Select at least one character type.');
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    setPassword(generatedPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Generate password on initial load and whenever options change
  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = () => {
    if (password && password !== 'Select at least one character type.') {
      navigator.clipboard.writeText(password);
      addToast({ title: 'Copied!', message: 'Password copied to clipboard.', duration: 2000 });
    } else {
      addToast({ title: 'Cannot Copy', message: 'No password to copy.', duration: 2000, type: 'error' });
    }
  };

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const inputStyle = `mt-1 block w-full p-2 border rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 border-gray-600`;
  const checkboxStyle = `h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500`;
  const labelStyle = `ml-2 text-sm font-medium text-gray-300`;

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
          <span className="single-app-color">pg</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-4xl"
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
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Password Generator </h1>
              <hr className="border-gray-700 mb-4" />

              {/* Client-Side Notification */}
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Client-Side Only:</strong>
                <span className="block sm:inline ml-2">This password generator operates entirely within your browser. No data is sent to any server, ensuring maximum privacy for your generated passwords.</span>
              </div>

              <div className="mb-6">
                <label htmlFor="passwordOutput" className="block text-sm font-medium text-gray-300 mb-2">
                  Generated Password
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="passwordOutput"
                    className={`${inputStyle} flex-grow`}
                    value={password}
                    readOnly
                  />
                  <button
                    onClick={copyToClipboard}
                    className="ml-2 px-4 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out roll-button flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      color: cardStyle.color,
                      borderColor: cardStyle.borderColor,
                      border: '1px solid',
                    }}
                    title="Copy to Clipboard"
                  >
                    <CopySimple size={20} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="length" className="block text-sm font-medium text-gray-300 mb-2">
                  Password Length: {length}
                </label>
                <input
                  type="range"
                  id="length"
                  min="4"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <input
                    type="checkbox"
                    id="includeUppercase"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className={checkboxStyle}
                  />
                  <label htmlFor="includeUppercase" className={labelStyle}>
                    Include Uppercase (A-Z)
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="includeLowercase"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className={checkboxStyle}
                  />
                  <label htmlFor="includeLowercase" className={labelStyle}>
                    Include Lowercase (a-z)
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="includeNumbers"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className={checkboxStyle}
                  />
                  <label htmlFor="includeNumbers" className={labelStyle}>
                    Include Numbers (0-9)
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="includeSymbols"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className={checkboxStyle}
                  />
                  <label htmlFor="includeSymbols" className={labelStyle}>
                    Include Symbols
                  </label>
                </div>
              </div>

              <button
                onClick={generatePassword}
                className={`px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out roll-button w-full`}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: cardStyle.color,
                  borderColor: cardStyle.borderColor,
                  border: '1px solid',
                }}
              >
                Generate New Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGeneratorPage;
