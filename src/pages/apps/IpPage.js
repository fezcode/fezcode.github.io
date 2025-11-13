import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, Clipboard as ClipboardIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from "../../hooks/useSeo";
import { useToast } from '../../hooks/useToast';

function IpPage() {
  useSeo({
    title: 'Show my IP | Fezcodex',
    description: 'Quickly find and display your public IP address.',
    keywords: ['Fezcodex', 'show my IP', 'what is my IP', 'IP address', 'public IP'],
    ogTitle: 'Show my IP | Fezcodex',
    ogDescription: 'Quickly find and display your public IP address.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Show my IP | Fezcodex',
    twitterDescription: 'Quickly find and display your public IP address.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });
  const [ip, setIp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetch('/api/show-my-ip?format=json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK!');
        }
        return response.json();
      })
      .then(data => {
        setIp(data.ip);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleCopy = () => {
    if (ip) {
      navigator.clipboard.writeText(ip).then(() => {
        addToast({
          title: 'Success',
          message: 'IP address copied to clipboard!',
          duration: 3000,
        });
      }, () => {
        addToast({
          title: 'Error',
          message: 'Failed to copy IP address!',
          duration: 3000,
        });
      });
    }
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
          className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">ip</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-8">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-md"
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
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-normal" style={{ color: cardStyle.color }}>Your Public IP Address</h2>
              <div className="mt-4 text-3xl font-mono select-text" style={{ color: detailTextColor }}>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {ip && <p>{ip}</p>}
              </div>
              {ip && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleCopy}
                    className="bg-tb text-app border-app-alpha-50 hover:bg-app/15 flex items-center gap-2 text-lg font-semibold px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out"
                  >
                    <ClipboardIcon size={24} />
                    Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IpPage;
