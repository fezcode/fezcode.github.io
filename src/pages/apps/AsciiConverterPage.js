import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
import useSeo from "../../hooks/useSeo";

function AsciiConverterPage() {
  useSeo({
    title: 'Text to ASCII Converter | Fezcodex',
    description: 'Convert text to ASCII, ASCII to text, text to binary, and binary to text with this online tool.',
    keywords: ['Fezcodex', 'ASCII converter', 'text to ASCII', 'binary converter', 'text to binary'],
    ogTitle: 'Text to ASCII Converter | Fezcodex',
    ogDescription: 'Convert text to ASCII, ASCII to text, text to binary, and binary to text with this online tool.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Text to ASCII Converter | Fezcodex',
    twitterDescription: 'Convert text to ASCII, ASCII to text, text to binary, and binary to text with this online tool.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });
  const [inputText, setInputText] = useState('');
  const [asciiOutput, setAsciiOutput] = useState('');
  const [binaryOutput, setBinaryOutput] = useState('');
  const { addToast } = useToast();

  const textToAscii = () => {
    try {
      const ascii = inputText.split('').map(char => char.charCodeAt(0)).join(' ');
      setAsciiOutput(ascii);
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to convert text to ASCII.',
        duration: 3000,
      });
      setAsciiOutput('');
    }
  };

  const asciiToText = () => {
    try {
      const text = inputText.split(' ').map(code => String.fromCharCode(parseInt(code, 10))).join('');
      setAsciiOutput(text);
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to convert ASCII to text. Invalid ASCII string.',
        duration: 3000,
      });
      setAsciiOutput('');
    }
  };

  const textToBinary = () => {
    try {
      const binary = inputText.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      setBinaryOutput(binary);
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to convert text to Binary.',
        duration: 3000,
      });
      setBinaryOutput('');
    }
  };

  const binaryToText = () => {
    try {
      const text = inputText.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
      setBinaryOutput(text);
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to convert Binary to text. Invalid Binary string.',
        duration: 3000,
      });
      setBinaryOutput('');
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
          <span className="single-app-color">ascii</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl bg-app-alpha-10 hover:bg-app/15 text-app border-app"
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> ASCII Converter </h1>
            <hr className="border-gray-700 mb-4" />
            <div className="relative z-10 p-1">
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2 text-app" >Input Text</label>
                <textarea
                  className="w-full h-32 p-4 bg-gray-900/50 font-mono resize-y focus:ring-0 border rounded-md border-app"
                  style={{ color: detailTextColor }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text or ASCII codes (space-separated) to convert..."
                />
              </div>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={textToAscii}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out bg-tb hover:bg-app/30 text-app border-app border"
                >
                  Text to ASCII
                </button>
                <button
                  onClick={asciiToText}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out bg-tb hover:bg-app/30 text-app border-app border"
                >
                  ASCII to Text
                </button>
              </div>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={textToBinary}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out bg-tb hover:bg-app/30 text-app border-app border"
                >
                  Text to Binary
                </button>
                <button
                  onClick={binaryToText}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out bg-tb hover:bg-app/30 text-app border-app border"
                >
                  Binary to Text
                </button>
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2 text-app" >ASCII Output</label>
                <div className="relative">
                  <textarea
                    readOnly
                    className="w-full h-32 p-4 bg-gray-800/50 font-mono resize-y border rounded-md mb-4 border-app"
                    style={{ color: detailTextColor }}
                    value={asciiOutput}
                    placeholder="Converted ASCII will appear here..."
                  />
                  <button
                    onClick={() => copyToClipboard(asciiOutput)}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2 text-app" >Binary Output</label>
                <div className="relative">
                  <textarea
                    readOnly
                    className="w-full h-32 p-4 bg-gray-800/50 font-mono resize-y border rounded-md border-app"
                    style={{ color: detailTextColor }}
                    value={binaryOutput}
                    placeholder="Converted Binary will appear here..."
                  />
                  <button
                    onClick={() => copyToClipboard(binaryOutput)}
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

export default AsciiConverterPage;
