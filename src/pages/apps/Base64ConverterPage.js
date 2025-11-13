import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from "../../hooks/useSeo";

function Base64ConverterPage() {
  useSeo({
    title: 'Base64 Converter | Fezcodex',
    description: 'Encode and decode Base64 strings with this online tool.',
    keywords: ['Fezcodex', 'Base64 converter', 'encode Base64', 'decode Base64'],
    ogTitle: 'Base64 Converter | Fezcodex',
    ogDescription: 'Encode and decode Base64 strings with this online tool.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Base64 Converter | Fezcodex',
    twitterDescription: 'Encode and decode Base64 strings with this online tool.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { addToast } = useToast();

  const encodeBase64 = () => {
    try {
      setOutputText(btoa(inputText));
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to encode Base64. Invalid characters.',
        duration: 3000,
      });
      setOutputText('');
    }
  };

  const decodeBase64 = () => {
    try {
      setOutputText(atob(inputText));
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to decode Base64. Invalid Base64 string.',
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
          <span className="single-app-color">b64</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
                      <div
                        className="group bg-app-alpha-10 hover:bg-app/15 text-app border-app border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl"
                      >
                        <div
                          className="absolute top-0 left-0 w-full h-full opacity-10"
                          style={{
                            backgroundImage:
                              'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '10px 10px',
                          }}
                        ></div>            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Base64 Converter </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2 text-app">Input Text</label>
                <textarea
                  className="w-full h-32 p-4 bg-gray-900/50 font-mono resize-y border rounded-md border-app-alpha-50 text-app-light"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to encode or decode..."
                />
              </div>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={encodeBase64}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out bg-tb hover:bg-app/30 text-app border-app border"
                >
                  Encode Base64
                </button>
                <button
                  onClick={decodeBase64}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out bg-tb hover:bg-app/30 text-app border-app border"
                >
                  Decode Base64
                </button>
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2 text-app" >Output Text</label>
                <div className="relative">
                  <textarea
                    readOnly
                    className="w-full h-32 p-4 bg-gray-800/50 font-mono resize-y border rounded-md border-app-alpha-50 text-app-light"
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

export default Base64ConverterPage;
