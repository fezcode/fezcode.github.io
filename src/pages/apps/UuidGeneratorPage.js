import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';

function UuidGeneratorPage() {
  useSeo({
    title: 'UUID Generator | Fezcodex',
    description:
      'Generate universally unique identifiers (UUIDs) of version 4 for your development needs.',
    keywords: [
      'Fezcodex',
      'UUID generator',
      'GUID generator',
      'unique ID',
      'UUID v4',
    ],
    ogTitle: 'UUID Generator | Fezcodex',
    ogDescription:
      'Generate universally unique identifiers (UUIDs) of version 4 for your development needs.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'UUID Generator | Fezcodex',
    twitterDescription:
      'Generate universally unique identifiers (UUIDs) of version 4 for your development needs.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });
  const [uuid, setUuid] = useState('');
  const { addToast } = useToast();

  const generateUuidV4 = () => {
    try {
      // RFC 4122 v4 UUID generation
      const uuidV4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16; // Use crypto.getRandomValues for better randomness
          // eslint-disable-next-line no-mixed-operators
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );
      setUuid(uuidV4);
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'Failed to generate UUID.',
        duration: 3000,
      });
      setUuid('');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
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
          <span className="single-app-color">uuid</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div className="bg-app-alpha-10 border-app-alpha-50 text-app hover:bg-app/15 group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl">
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
              {' '}
              UUID Generator{' '}
            </h1>
            <hr className="border-gray-700 mb-4" />
            <div className="relative z-10 p-1">
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2 text-app">
                  Generated UUID v4
                </label>
                <div className="relative">
                  <textarea
                    readOnly
                    className="w-full h-24 p-4 bg-gray-800/50 font-mono resize-y border rounded-md border-app-alpha-50 text-app"
                    value={uuid}
                    placeholder="Click 'Generate UUID' to create one..."
                  />
                  <button
                    onClick={() => copyToClipboard(uuid)}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={generateUuidV4}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out border bg-tb text-app border-app-alpha-50 hover:bg-app/15"
                >
                  Generate UUID v4
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UuidGeneratorPage;
