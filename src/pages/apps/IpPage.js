import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, Clipboard as ClipboardIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import usePageTitle from '../../utils/usePageTitle';
import { useToast } from '../../hooks/useToast';

function IpPage() {
  usePageTitle('Show my IP');
  const [ip, setIp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetch('/api?format=json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
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
    backgroundColor: colors['article-alpha-10'],
    borderColor: colors['article-alpha-50'],
    color: colors.article,
  };

  const detailTextColor = colors['article-light'];

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
          <span className="codex-color">codex</span>
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
                    className="flex items-center gap-2 text-lg font-semibold px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      color: cardStyle.color,
                      borderColor: cardStyle.borderColor,
                      '--hover-bg-color': colors['article-alpha-50'],
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg-color)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'}
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
