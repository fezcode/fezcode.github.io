import React, { useState, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  QrCodeIcon,
  GearSixIcon,
  ShieldCheckIcon,
  EyeIcon,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import Seo from '../../components/Seo';
import { ToastContext } from '../../context/ToastContext';
import CustomDropdown from '../../components/CustomDropdown';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';

const QrCodeGeneratorPage = () => {
  const appName = 'QR Code Generator';

  const { addToast } = useContext(ToastContext);
  const [text, setText] = useState('https://fezcode.com');
  const [version, setVersion] = useState(7);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M');
  const [qrCodeSize, setQrCodeSize] = useState(256);

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
        message: 'QR Code downloaded successfully.',
        type: 'success',
      });
    } else {
      addToast({
        message: 'Could not find QR Code to download.',
        type: 'error',
      });
    }
  }, [addToast]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="QR Code Generator | Fezcodex"
        description="Generate QR codes from text or URLs with customizable options for version, error correction, and size."
        keywords={[
          'Fezcodex',
          'QR code generator',
          'QR code',
          'generate QR',
          'brutalist',
        ]}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>
          <BreadcrumbTitle title={appName} slug="qr" variant="brutalist" />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Transform any string into a{' '}
                <span className="text-emerald-400 font-bold">visual hash</span>.
                Encoded and rendered entirely on the client-side.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Environment
                </span>
                <span className="text-3xl font-black text-emerald-500">
                  CLIENT_SIDE
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Encryption
                </span>
                <span className="text-3xl font-black text-white">SHA_ZERO</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName} className="w-full h-full" />
              </div>
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <GearSixIcon weight="fill" />
                Config_Interface
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Source Payload
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows="1"
                    className="w-full bg-transparent border-b-2 border-white/10 py-2 text-xl font-mono text-white focus:border-emerald-500 focus:outline-none transition-colors uppercase"
                    placeholder="ENTER_DATA..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      QR Version
                    </label>
                    <CustomDropdown
                      options={Array.from({ length: 40 }, (_, i) => i + 1).map(
                        (v) => ({
                          label: `V_${v.toString().padStart(2, '0')}`,
                          value: v,
                        }),
                      )}
                      value={version}
                      onChange={setVersion}
                      variant="brutalist"
                      fullWidth={true}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      Error Correction
                    </label>
                    <CustomDropdown
                      options={[
                        { label: 'L (LOW ~07%)', value: 'L' },
                        { label: 'M (MED ~15%)', value: 'M' },
                        { label: 'Q (QUA ~25%)', value: 'Q' },
                        { label: 'H (HIG ~30%)', value: 'H' },
                      ]}
                      value={errorCorrectionLevel}
                      onChange={setErrorCorrectionLevel}
                      variant="brutalist"
                      fullWidth={true}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Resolution (Pixels)
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="16"
                    value={qrCodeSize}
                    onChange={(e) => setQrCodeSize(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-white/10"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-gray-500">
                    <span>128PX</span>
                    <span className="text-emerald-400 font-bold">
                      {qrCodeSize}PX
                    </span>
                    <span>512PX</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <ShieldCheckIcon size={20} weight="bold" />
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Privacy_Policy
                </h4>
              </div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider leading-relaxed">
                This utility operates entirely within your local sandbox. No
                telemetry is sent. Data persistence is null.
              </p>
            </div>
          </div>

          {/* Display Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <EyeIcon weight="fill" className="text-emerald-500" />
              Render_Output
            </h3>

            <div className="flex-grow border border-white/10 bg-white/[0.01] rounded-sm p-12 flex flex-col items-center justify-center gap-12">
              {text ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white p-6 rounded-sm shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                >
                  <QRCodeCanvas
                    id="qrCodeCanvas"
                    value={text}
                    size={qrCodeSize}
                    level={errorCorrectionLevel}
                    version={version}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    includeMargin={true}
                  />
                </motion.div>
              ) : (
                <div className="text-center space-y-4">
                  <QrCodeIcon
                    size={64}
                    weight="thin"
                    className="mx-auto text-white/5"
                  />
                  <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                    Waiting_for_payload...
                  </p>
                </div>
              )}

              <button
                onClick={downloadQrCode}
                disabled={!text}
                className="w-full max-w-sm py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-3"
              >
                <DownloadSimpleIcon weight="bold" size={18} />
                Export_Binary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeGeneratorPage;
