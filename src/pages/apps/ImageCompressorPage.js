import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowsInLineHorizontalIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const ImageCompressorPage = () => {
  useSeo({
    title: 'Image Compressor | Fezcodex',
    description: 'Compress images to reduce file size while maintaining quality.',
    keywords: ['Fezcodex', 'image compressor', 'compress image', 'reduce image size', 'optimize image'],
    ogTitle: 'Image Compressor | Fezcodex',
    ogDescription: 'Compress images to reduce file size while maintaining quality.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Image Compressor | Fezcodex',
    twitterDescription: 'Compress images to reduce file size while maintaining quality.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const { addToast } = useToast();
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.7); // Default compression quality
  const [shouldCompress, setShouldCompress] = useState(false); // New state to control manual compression
  const canvasRef = useRef(null);

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const buttonStyle = `px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out roll-button`;
  const appButtonStyle =
    'border-app/100 bg-app/20 hover:bg-app/40 cursor-pointer text-app hover:text-white';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      console.log('Original image loaded into FileReader. Setting originalImage state.');
      setOriginalImage(event.target.result);
      // Reset compressed image and size when a new image is uploaded
      setCompressedImage(null);
      setCompressedSize(0);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = useCallback(() => {
    if (!originalImage) {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
      return;
    }
    if (!canvasRef.current) {
      console.warn("Canvas ref is not current. Skipping image compression.");
      return;
    }

    const img = new Image();
    img.src = originalImage;
    img.onload = () => {
      console.log('Image loaded, attempting to compress...');
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        setCompressedImage(compressedDataUrl);

        const base64Length = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
        const sizeInBytes = base64Length * 0.75;
        setCompressedSize(sizeInBytes);

        addToast({ title: 'Success', message: 'Image compressed successfully.' });
        console.log('Image compressed and state updated.');
      } catch (error) {
        console.error('Error during image compression:', error);
        addToast({ title: 'Error', message: 'Failed to compress image. Check console for details.', type: 'error' });
        setCompressedImage(null); // Ensure compressedImage is null on error
        setCompressedSize(0);
      }
    };
    img.onerror = () => {
      console.error('Error loading image into Image object.');
      addToast({ title: 'Error', message: 'Failed to load image. Please try another file.', type: 'error' });
      setOriginalImage(null);
      setCompressedImage(null);
      setOriginalSize(0);
      setCompressedSize(0);
    };
  }, [originalImage, quality, addToast, setCompressedImage, setCompressedSize, setOriginalImage, setOriginalSize]);

  const handleDownload = () => {
    if (compressedImage) {
      const link = document.createElement('a');
      link.download = `compressed_image_${(quality * 100).toFixed(0)}.jpeg`;
      link.href = compressedImage;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      addToast({ title: 'Info', message: 'No compressed image to download.' });
    }
  };

 // Added compressImage to dependencies

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4" >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Apps
        </Link>
          <BreadcrumbTitle title="Image Compressor" slug="imc" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden h-full w-full max-w-4xl"
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
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app flex items-center gap-2">
                <ArrowsInLineHorizontalIcon size={32} /> Image Compressor
              </h1>
              <hr className="border-gray-700 mb-4" />

              {/* Client-Side Notification */}
              <div
                className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">Client-Side Only:</strong>
                <span className="block sm:inline ml-2">
                  All image processing happens directly in your browser using canvas API. No data is uploaded to any server.
                </span>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="image-upload"
                  className={`${buttonStyle} ${appButtonStyle} cursor-pointer inline-flex items-center justify-center`}
                >
                  Upload Image
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {originalImage && (
                <div className="mb-4">
                  <label
                    htmlFor="quality-slider"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Compression Quality: {(quality * 100).toFixed(0)}%
                  </label>
                  <input
                    id="quality-slider"
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <button
                    onClick={compressImage}
                    className={`${buttonStyle} ${appButtonStyle} mt-4`}
                  >
                    Compress Image
                  </button>
                </div>
              )}

              {originalImage && <p>Original Image State: <span className="text-green-400">Set</span></p>}
              {compressedImage && <p>Compressed Image State: <span className="text-green-400">Set</span></p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {originalImage && (
                  <div className="border border-gray-500 p-2 rounded-lg">
                    <h3 className="text-xl font-bold mb-2 text-center">Original Image</h3>
                    <img src={originalImage} alt="Original" className="max-w-full h-auto rounded-lg mx-auto" />
                    <p className="text-center mt-2">Size: {formatBytes(originalSize)}</p>
                  </div>
                )}
                {/* Always render canvas if original image is present to make canvasRef available */}
                {originalImage && (
                  <div className="hidden"> {/* Hidden as it's for off-screen processing */}
                    <canvas ref={canvasRef}></canvas>
                  </div>
                )}

                {compressedImage && (
                  <div className="border border-gray-500 p-2 rounded-lg">
                    <h3 className="text-xl font-bold mb-2 text-center">Compressed Image</h3>
                    <img src={compressedImage} alt="Compressed" className="max-w-full h-auto rounded-lg mx-auto" />
                    <p className="text-center mt-2">Size: {formatBytes(compressedSize)}</p>
                    {originalSize > 0 && compressedSize > 0 && (
                      <>
                        {originalSize >= compressedSize ? (
                          <p className="text-center text-green-400">
                            Saved: {formatBytes(originalSize - compressedSize)} (
                            {(((originalSize - compressedSize) / originalSize) * 100).toFixed(2)}%)
                          </p>
                        ) : (
                          <p className="text-center text-red-400">
                            Expanded: {formatBytes(compressedSize - originalSize)} (
                            {(((compressedSize - originalSize) / originalSize) * 100).toFixed(2)}%)
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {compressedImage && (
                <div className="flex justify-center mt-4">
                  <button onClick={handleDownload} className={`${buttonStyle} ${appButtonStyle}`}>
                    Download{' '}
                    <span className={compressedSize < originalSize ? 'text-green-400' : 'text-red-600'}>
                      {compressedSize < originalSize ? 'Compressed' : 'Expanded'}
                    </span>{' '}
                    Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressorPage;
