import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  ImageIcon,
  LockKeyIcon,
  LockKeyOpenIcon,
  EraserIcon,
  MagnifyingGlassIcon,
  FilePlusIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const MAGIC_HEADER = 'FEZ';

function SteganographyPage() {
  const appName = 'Steganography Tool';

  const { addToast } = useToast();
  const [image, setImage] = useState(null);
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [message, setMessage] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [encodedImage, setEncodedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setEncodedImage(null);
        setDecodedMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const stringToBits = (str) => {
    const utf8Encoder = new TextEncoder();
    const bytes = utf8Encoder.encode(str);
    const bits = [];
    for (let i = 0; i < bytes.length; i++) {
      for (let j = 7; j >= 0; j--) {
        bits.push((bytes[i] >> j) & 1);
      }
    }
    return bits;
  };

  const bitsToString = (bits) => {
    const bytes = new Uint8Array(bits.length / 8);
    for (let i = 0; i < bytes.length; i++) {
      let byte = 0;
      for (let j = 0; j < 8; j++) {
        byte = (byte << 1) | bits[i * 8 + j];
      }
      bytes[i] = byte;
    }
    const utf8Decoder = new TextDecoder();
    return utf8Decoder.decode(bytes);
  };

  const encodeMessage = () => {
    if (!image || !message) {
      addToast({
        title: 'Error',
        message: 'Please provide both an image and a message.',
        type: 'error',
      });
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const headerBits = stringToBits(MAGIC_HEADER);
      // Length as 32-bit integer (4 bytes = 32 bits)
      const lengthBits = [];
      const msgBytes = new TextEncoder().encode(message);
      const len = msgBytes.length;
      for (let i = 31; i >= 0; i--) {
        lengthBits.push((len >> i) & 1);
      }

      const msgBits = stringToBits(message);
      const allBits = [...headerBits, ...lengthBits, ...msgBits];

      if (allBits.length > (data.length / 4) * 3) {
        addToast({
          title: 'Error',
          message: 'Message is too long for this image size.',
          type: 'error',
        });
        return;
      }

      let bitIndex = 0;
      for (let i = 0; i < data.length && bitIndex < allBits.length; i += 4) {
        for (let j = 0; j < 3 && bitIndex < allBits.length; j++) {
          // Replace LSB of R, G, or B
          data[i + j] = (data[i + j] & 0xfe) | allBits[bitIndex++];
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setEncodedImage(canvas.toDataURL('image/png'));
      addToast({
        title: 'Success',
        message: 'Message encoded into image.',
      });
    };
  };

  const decodeMessage = () => {
    if (!image) {
      addToast({
        title: 'Error',
        message: 'Please upload an image to decode.',
        type: 'error',
      });
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

            const headerLen = MAGIC_HEADER.length * 8;

            // Extract bits from R, G, B channels
            const allExtractedBits = [];
            for(let i=0; i < data.length; i+=4) {
                allExtractedBits.push(data[i] & 1);
                allExtractedBits.push(data[i+1] & 1);
                allExtractedBits.push(data[i+2] & 1);
            }
      // Magic header check
      const headBits = allExtractedBits.slice(0, headerLen);
      if (bitsToString(headBits) !== MAGIC_HEADER) {
          addToast({ title: 'Error', message: 'No message found.', type: 'error' });
          return;
      }

      // Length extraction
      const extractedLenBits = allExtractedBits.slice(headerLen, headerLen + 32);
      let length = 0;
      for(let i=0; i<32; i++) {
          length = (length << 1) | extractedLenBits[i];
      }

      if (length <= 0 || length > 1000000) {
          addToast({ title: 'Error', message: 'Invalid message length.', type: 'error' });
          return;
      }

      // Content extraction
      const contentBits = allExtractedBits.slice(headerLen + 32, headerLen + 32 + (length * 8));
      try {
          const decoded = bitsToString(contentBits);
          setDecodedMessage(decoded);
          addToast({ title: 'Success', message: 'Message extracted successfully!' });
      } catch (e) {
          addToast({ title: 'Error', message: 'Failed to decode message.', type: 'error' });
      }
    };
  };

  const downloadImage = () => {
    if (encodedImage) {
      const link = document.createElement('a');
      link.download = `stego-${Date.now()}.png`;
      link.href = encodedImage;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Steganography Tool | Fezcodex"
        description="Hide secret messages within images using Least Significant Bit (LSB) steganography."
        keywords={[
          'Fezcodex',
          'steganography',
          'hide message in image',
          'image security',
          'LSB steganography',
        ]}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Steganography" slug="stego" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Hide secret messages within images using Least Significant Bit (LSB) steganography.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <LockKeyIcon weight="fill" />
                Operation Mode
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setMode('encode')}
                  className={`
                    flex items-center justify-between px-4 py-3 border transition-all duration-200 text-[10px] font-mono uppercase tracking-widest
                    ${
                      mode === 'encode'
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-transparent border-white/5 text-gray-500 hover:border-emerald-500/50 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <LockKeyIcon size={16} weight={mode === 'encode' ? 'fill' : 'bold'} />
                    <span>Encode Message</span>
                  </div>
                  {mode === 'encode' && <span>●</span>}
                </button>
                <button
                  onClick={() => setMode('decode')}
                  className={`
                    flex items-center justify-between px-4 py-3 border transition-all duration-200 text-[10px] font-mono uppercase tracking-widest
                    ${
                      mode === 'decode'
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-transparent border-white/5 text-gray-500 hover:border-emerald-500/50 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <LockKeyOpenIcon size={16} weight={mode === 'decode' ? 'fill' : 'bold'} />
                    <span>Decode Message</span>
                  </div>
                  {mode === 'decode' && <span>●</span>}
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <ImageIcon weight="bold" />
                Image Source
              </h3>
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group font-mono text-[10px] uppercase tracking-widest"
              >
                <FilePlusIcon size={20} className="text-gray-500 group-hover:text-emerald-500" />
                <span>{image ? 'Change Image' : 'Select Image'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="mt-4 text-[9px] font-mono text-gray-600 uppercase tracking-tighter leading-tight">
                * PNG IS RECOMMENDED TO PREVENT COMPRESSION ARTIFACTS FROM DESTROYING THE HIDDEN DATA.
              </p>
            </div>

            {mode === 'encode' && (
              <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
                  Secret Message
                </h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter the message you want to hide..."
                  className="w-full h-32 bg-black border border-white/10 p-4 font-mono text-xs text-emerald-500 focus:border-emerald-500/50 outline-none resize-none transition-colors"
                />
                <button
                  onClick={encodeMessage}
                  disabled={!image || !message}
                  className="mt-6 w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Encrypt & Embed
                </button>
              </div>
            )}

            {mode === 'decode' && (
              <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                <button
                  onClick={decodeMessage}
                  disabled={!image}
                  className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MagnifyingGlassIcon size={18} weight="bold" />
                  Extract Message
                </button>
              </div>
            )}
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group min-h-[500px] flex flex-col">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName + mode} className="w-full h-full" />
              </div>

              <div className="relative z-10 flex-1 flex flex-col gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Input Image Preview */}
                  <div className="space-y-4">
                    <span className="font-mono text-[9px] text-gray-600 uppercase tracking-widest flex items-center gap-2">
                      <span className="h-px w-4 bg-gray-800" /> Source View
                    </span>
                    <div className="aspect-square border border-white/5 rounded-sm overflow-hidden bg-black flex items-center justify-center">
                      {image ? (
                        <img src={image} alt="Input" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="font-mono text-[8px] text-gray-800 uppercase tracking-widest">No Image Loaded</span>
                      )}
                    </div>
                  </div>

                  {/* Output/Result View */}
                  <div className="space-y-4">
                    <span className="font-mono text-[9px] text-emerald-500 uppercase tracking-widest flex items-center gap-2 font-black">
                      <span className="h-px w-4 bg-emerald-500/20" /> Result Matrix
                    </span>
                    <div className="aspect-square border border-emerald-500/20 rounded-sm overflow-hidden bg-black flex items-center justify-center relative">
                      {mode === 'encode' ? (
                        encodedImage ? (
                          <img src={encodedImage} alt="Encoded" className="max-w-full max-h-full object-contain shadow-[0_0_40px_rgba(16,185,129,0.1)]" />
                        ) : (
                          <div className="flex flex-col items-center gap-4 opacity-20">
                             <EraserIcon size={32} weight="thin" />
                             <span className="font-mono text-[8px] uppercase tracking-widest">Waiting for process</span>
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full p-6 flex flex-col">
                            {decodedMessage ? (
                                <div className="flex-1 overflow-auto font-mono text-xs text-emerald-400 p-4 bg-emerald-500/5 border border-emerald-500/20 whitespace-pre-wrap">
                                    {decodedMessage}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-20">
                                    <MagnifyingGlassIcon size={32} weight="thin" />
                                    <span className="font-mono text-[8px] uppercase tracking-widest">No message extracted</span>
                                </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex justify-end gap-4">
                  {encodedImage && mode === 'encode' && (
                    <button
                      onClick={downloadImage}
                      className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-xs"
                    >
                      <DownloadSimpleIcon weight="bold" size={18} />
                      <span>Download Encoded PNG</span>
                    </button>
                  )}
                  {decodedMessage && mode === 'decode' && (
                      <button
                        onClick={() => {
                            navigator.clipboard.writeText(decodedMessage);
                            addToast({ title: 'Success', message: 'Message copied to clipboard.' });
                        }}
                        className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-xs"
                      >
                        <span>Copy Message</span>
                      </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SteganographyPage;
