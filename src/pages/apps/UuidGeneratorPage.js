import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import usePageTitle from '../../utils/usePageTitle';
import { useToast } from '../../hooks/useToast';
import '../../styles/app-buttons.css';

function UuidGeneratorPage() {
  usePageTitle('UUID Generator');
  const [uuid, setUuid] = useState('');
  const { addToast } = useToast();

  const generateUuidV4 = () => {
    try {
      // RFC 4122 v4 UUID generation
      const uuidV4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16; // Use crypto.getRandomValues for better randomness
        // eslint-disable-next-line no-mixed-operators
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
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
          <span className="single-app-color">uuid</span>
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
                <label className="block text-lg font-semibold mb-2" style={{ color: cardStyle.color }}>Generated UUID v4</label>
                <div className="relative">
                  <textarea
                    readOnly
                    className="w-full h-24 p-4 bg-gray-800/50 font-mono resize-y border rounded-md"
                    style={{ borderColor: cardStyle.borderColor, color: detailTextColor }}
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
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out app-button-hover"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    color: cardStyle.color,
                    borderColor: cardStyle.borderColor,
                    border: '1px solid',
                  }}
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
