import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
import useSeo from "../../hooks/useSeo";

function HashGeneratorPage() {
  useSeo({
    title: 'Hash Generator | Fezcodex',
    description: 'Generate SHA-1, SHA-256, and SHA-512 hashes from your input text.',
    keywords: ['Fezcodex', 'hash generator', 'SHA-1', 'SHA-256', 'SHA-512', 'cryptography', 'hashing'],
    ogTitle: 'Hash Generator | Fezcodex',
    ogDescription: 'Generate SHA-1, SHA-256, and SHA-512 hashes from your input text.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Hash Generator | Fezcodex',
    twitterDescription: 'Generate SHA-1, SHA-256, and SHA-512 hashes from your input text.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });
  const [inputText, setInputText] = useState('');
  const [hashes, setHashes] = useState({
    sha1: '',
    sha256: '',
    sha512: '',
  });
  const { addToast } = useToast();

  const generateHash = async (algorithm) => {
    if (!inputText) {
      setHashes(prev => ({ ...prev, [algorithm.toLowerCase().replace('sha-','sha')]: '' }));
      return;
    }

    try {
      const textEncoder = new TextEncoder();
      const data = textEncoder.encode(inputText);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHashes(prev => ({ ...prev, [algorithm.toLowerCase().replace('sha-','sha')]: hashHex }));
    } catch (error) {
      addToast({
        title: 'Error',
        message: `Failed to generate ${algorithm} hash.`,
        duration: 3000,
      });
      setHashes(prev => ({ ...prev, [algorithm.toLowerCase().replace('sha-','sha')]: 'Error' }));
    }
  };

  const generateAllHashes = () => {
    generateHash('SHA-1');
    generateHash('SHA-256');
    generateHash('SHA-512');
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
          <span className="single-app-color">hash</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="bg-app-alpha-10 border-app-alpha-50 text-app group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl"
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Hash Generator </h1>
            <hr className="border-gray-700 mb-4" />
            <div className="relative z-10 p-1">
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2 text-app" >Input Text</label>
                <textarea
                  className="w-full h-32 p-4 bg-gray-900/50 font-mono resize-y rounded-md focus:ring-0 border border-app-alpha-50 text-app"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to hash..."
                />
              </div>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={generateAllHashes}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out border bg-tb text-app border-app-alpha-50 hover:bg-app/15"
                >
                  Generate All Hashes
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HashOutput title="SHA-1" value={hashes.sha1} onCopy={copyToClipboard} detailTextColor={detailTextColor} />
                <HashOutput title="SHA-256" value={hashes.sha256} onCopy={copyToClipboard} detailTextColor={detailTextColor} />
                <HashOutput title="SHA-512" value={hashes.sha512} onCopy={copyToClipboard} detailTextColor={detailTextColor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const HashOutput = ({ title, value, onCopy, detailTextColor }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-400 mb-1">{title}</label>
    <div className="relative">
      <textarea
        readOnly
        value={value}
        className="w-full p-2 border rounded-md bg-gray-800/50 font-mono text-sm resize-none"
        style={{ borderColor: colors['app-alpha-50'], color: detailTextColor }}
        rows="3"
      />
      <button
        onClick={() => onCopy(value)}
        className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
      >
        Copy
      </button>
    </div>
  </div>
);

export default HashGeneratorPage;
