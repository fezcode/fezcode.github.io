import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, DownloadSimple } from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import { QRCodeCanvas } from 'qrcode.react'; // Import the QRCodeCanvas component
import CustomDropdown from '../../components/CustomDropdown';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const QrCodeGeneratorPage = () => {
  useSeo({
    title: 'QR Code Generator | Fezcodex',
    description:
      'Generate QR codes from text or URLs with customizable options for version, error correction, and size.',
    keywords: [
      'Fezcodex',
      'QR code generator',
      'QR code',
      'generate QR',
      'QR code online',
    ],
    ogTitle: 'QR Code Generator | Fezcodex',
    ogDescription: 'Generate custom QR codes for any text or URL.',
    twitterCard: 'summary_large_image',
    twitterTitle: 'QR Code Generator | Fezcodex',
    twitterDescription: 'Generate custom QR codes for any text or URL.',
  });

  const { addToast } = useToast();
  const [text, setText] = useState('https://fezcode.com');
  const [version, setVersion] = useState(7); // Default QR code version
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M'); // L, M, Q, H
  const [qrCodeSize, setQrCodeSize] = useState(256); // Size of the QR code in pixels

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const inputStyle = `mt-1 block w-full p-2 border rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 border-gray-600`;

  const downloadQrCode = useCallback(() => {
    const canvas = document.getElementById('qrCodeCanvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      addToast({
        title: 'Downloaded',
        message: 'QR Code downloaded successfully.',
        duration: 2000,
      });
    } else {
      addToast({
        title: 'Error',
        message: 'Could not find QR Code to download.',
        duration: 3000,
        type: 'error',
      });
    }
  }, [addToast]);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="QR Code Generator" slug="qr" />
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
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                {' '}
                QR Code Generator{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />

              {/* Client-Side Notification */}
              <div
                className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">Client-Side Only:</strong>
                <span className="block sm:inline ml-2">
                  This tool operates entirely within your browser. No data is
                  sent to any server, ensuring maximum privacy.
                </span>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="qrText"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Text or URL to Encode
                </label>
                <textarea
                  id="qrText"
                  rows="3"
                  className={inputStyle}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text or URL here..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="qrVersion"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    QR Version (1-40)
                  </label>
                  <CustomDropdown
                    options={Array.from({ length: 40 }, (_, i) => i + 1).map(
                      (v) => ({ label: `Version ${v}`, value: v }),
                    )}
                    value={version}
                    onChange={setVersion}
                    label="Select Version"
                  />
                </div>
                <div>
                  <label
                    htmlFor="errorCorrection"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Error Correction
                  </label>
                  <CustomDropdown
                    options={[
                      { label: 'L (Low ~7%)', value: 'L' },
                      { label: 'M (Medium ~15%)', value: 'M' },
                      { label: 'Q (Quartile ~25%)', value: 'Q' },
                      { label: 'H (High ~30%)', value: 'H' },
                    ]}
                    value={errorCorrectionLevel}
                    onChange={setErrorCorrectionLevel}
                    label="Error Correction"
                  />
                </div>
                <div>
                  <label
                    htmlFor="qrSize"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Size (px)
                  </label>
                  <input
                    type="number"
                    id="qrSize"
                    className={inputStyle}
                    value={qrCodeSize}
                    onChange={(e) => setQrCodeSize(Number(e.target.value))}
                    min="64"
                    max="768"
                    step="16"
                  />
                </div>
              </div>

              {text && (
                <div className="flex flex-col items-center justify-center mb-6">
                  <QRCodeCanvas
                    id="qrCodeCanvas" // ID for canvas to download
                    value={text}
                    size={qrCodeSize}
                    level={errorCorrectionLevel}
                    version={version}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    includeMargin={true}
                    // renderAs="canvas" is not needed for QRCodeCanvas as it defaults to canvas
                  />
                  <button
                    onClick={downloadQrCode}
                    className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out roll-button mt-4"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      color: cardStyle.color,
                      borderColor: cardStyle.borderColor,
                      border: '1px solid',
                    }}
                  >
                    <DownloadSimple size={20} className="inline-block mr-2" />{' '}
                    Download QR Code
                  </button>
                </div>
              )}
              {!text && (
                <div className="text-center text-gray-500 mb-6">
                  Enter text or URL to generate QR Code.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeGeneratorPage;
