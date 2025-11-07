import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import usePageTitle from '../../utils/usePageTitle';
import { useToast } from '../../hooks/useToast';
import '../../styles/app-buttons.css';

function UrlConverterPage() {
  usePageTitle('URL Encoder/Decoder');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { addToast } = useToast();

  const encodeUrl = () => {
    try {
      setOutputText(encodeURIComponent(inputText));
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to encode URL.',
        duration: 3000,
      });
      setOutputText('');
    }
  };

  const decodeUrl = () => {
    try {
      setOutputText(decodeURIComponent(inputText));
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to decode URL. Invalid URL string.',
        duration: 3000,
      });
      setOutputText('');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        addToast({
          title: 'Success',
          message: 'Copied to clipboard!',
          duration: 2000,
        });
      })
      .catch(() => {
        addToast({
          title: 'Error',
          message: 'Failed to copy!',
          duration: 2000,
        });
      });
  };

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const detailTextColor = colors['app-light'];

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
          <span className="single-app-color">url</span>
        </h1>
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
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2" style={{ color: cardStyle.color }}>Input Text</label>
                <textarea
                  className="w-full h-32 p-4 bg-gray-900/50 font-mono resize-y border rounded-md focus:ring-0"
                  style={{ borderColor: cardStyle.borderColor, color: detailTextColor }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter URL or text to encode/decode..."
                />
              </div>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={encodeUrl}
                  className="px-6 py-2 rounded-md text-lg font-semibold transition-colors duration-300 ease-in-out app-button-hover"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    color: cardStyle.color,
                    borderColor: cardStyle.borderColor,
                    border: '1px solid',
                  }}
                >
                  Encode URL
                </button>
                <button
                  onClick={decodeUrl}
                  className="px-6 py-2 rounded-md text-lg font-semibold transition-colors duration-300 ease-in-out app-button-hover"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    color: cardStyle.color,
                    borderColor: cardStyle.borderColor,
                    border: '1px solid',
                  }}
                >
                  Decode URL
                </button>
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2" style={{ color: cardStyle.color }}>Output Text</label>
                <div className="relative">
                  <textarea
                    readOnly
                    className="w-full h-32 p-4 bg-gray-800/50 font-mono resize-y border rounded-md"
                    style={{ borderColor: cardStyle.borderColor, color: detailTextColor }}
                    value={outputText}
                    placeholder="Converted text will appear here..."
                  />
                  <button
                    onClick={() => copyToClipboard(outputText)}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrlConverterPage;
