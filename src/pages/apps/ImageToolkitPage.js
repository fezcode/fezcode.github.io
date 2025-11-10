import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { usePalette } from 'color-thief-react';
import colors from '../../config/colors';
import usePageTitle from '../../utils/usePageTitle';
import { useToast } from '../../hooks/useToast';
import { canvasRGBA } from 'stackblur-canvas';
import '../../styles/app-buttons.css';

function Palette({ image }) {
  const { data: palette, loading, error } = usePalette(image, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
  const { addToast } = useToast();

  if (loading) return <p>Loading palette...</p>;
  if (error) return <p>Error generating palette: {error.message}</p>;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        addToast({
          title: 'Success',
          message: `Copied ${text} to clipboard!`,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
      {palette && palette.map((color, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-4 rounded-md cursor-pointer transition-transform duration-200 hover:scale-105"
          style={{ backgroundColor: color }}
          onClick={() => copyToClipboard(color)}
        >
          <span className="text-white font-semibold text-shadow-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{color}</span>
        </div>
      ))}
    </div>
  );
}

function ImageToolkitPage() {
  usePageTitle('Image Toolkit');
  const { addToast } = useToast();
  const [image, setImage] = useState(null);
  const [activeEffect, setActiveEffect] = useState(null);
  const [blurAmount, setBlurAmount] = useState(0);
  const [asciiArtOutput, setAsciiArtOutput] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
      setActiveEffect(null);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const toGrayscale = useCallback((imageData) => {
    const data = new Uint8ClampedArray(imageData.data);
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
    return data;
  }, []);

  const sobel = useCallback((imageData) => {
    const width = imageData.width;
    const height = imageData.height;
    const grayscaleData = toGrayscale(imageData);
    const sobelData = new Uint8ClampedArray(grayscaleData.length);
    const sobelOperatorX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];
    const sobelOperatorY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0;
        let pixelY = 0;
        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            const pixel = grayscaleData[((y + j) * width + (x + i)) * 4];
            pixelX += pixel * sobelOperatorX[j + 1][i + 1];
            pixelY += pixel * sobelOperatorY[j + 1][i + 1];
          }
        }
        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
        const index = (y * width + x) * 4;
        sobelData[index] = magnitude;
        sobelData[index + 1] = magnitude;
        sobelData[index + 2] = magnitude;
        sobelData[index + 3] = 255;
      }
    }
    return new ImageData(sobelData, width, height);
  }, [toGrayscale]);

  const combine = useCallback((quantized, edges) => {
    const quantizedData = quantized.data;
    const edgesData = edges.data;
    const finalData = new Uint8ClampedArray(quantizedData.length);
    for (let i = 0; i < quantizedData.length; i += 4) {
      if (edgesData[i] > 128) { // Edge threshold
        finalData[i] = 0;
        finalData[i + 1] = 0;
        finalData[i + 2] = 0;
        finalData[i + 3] = 255;
      } else {
        finalData[i] = quantizedData[i];
        finalData[i + 1] = quantizedData[i + 1];
        finalData[i + 2] = quantizedData[i + 2];
        finalData[i + 3] = 255;
      }
    }
    return new ImageData(finalData, quantized.width, quantized.height);
  }, []);

  const bayerDither = useCallback((imageData) => {
    const pixels = new Uint8ClampedArray(imageData.data);
    const width = imageData.width;
    const height = imageData.height;
    const bayerMatrix = [
      [1, 9, 3, 11],
      [13, 5, 15, 7],
      [4, 12, 2, 10],
      [16, 8, 14, 6]
    ];
    const matrixSize = 4;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const gray = (r * 0.299 + g * 0.587 + b * 0.114);
        const threshold = bayerMatrix[y % matrixSize][x % matrixSize] * 16;
        const newValue = gray < threshold ? 0 : 255;
        pixels[i] = newValue;
        pixels[i + 1] = newValue;
        pixels[i + 2] = newValue;
      }
    }
    return new ImageData(pixels, width, height);
  }, []);

  const quantizeColors = useCallback((imageData, levels) => {
    const data = new Uint8ClampedArray(imageData.data);
    const factor = 255 / (levels - 1);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(Math.round(data[i] / factor) * factor);
      data[i + 1] = Math.round(Math.round(data[i + 1] / factor) * factor);
      data[i + 2] = Math.round(Math.round(data[i + 2] / factor) * factor);
    }
    return new ImageData(data, imageData.width, imageData.height);
  }, []);

  const halftone = useCallback((imageData, gridSize) => {
    const width = imageData.width;
    const height = imageData.height;
    const grayscaleData = toGrayscale(imageData);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'black';

    for (let y = 0; y < height; y += gridSize) {
      for (let x = 0; x < width; x += gridSize) {
        let totalBrightness = 0;
        let count = 0;
        for (let j = 0; j < gridSize; j++) {
          for (let i = 0; i < gridSize; i++) {
            if (x + i < width && y + j < height) {
              const index = ((y + j) * width + (x + i)) * 4;
              totalBrightness += grayscaleData[index];
              count++;
            }
          }
        }
        const avgBrightness = totalBrightness / count;
        const radius = (gridSize / 2) * (1 - avgBrightness / 255);
        ctx.beginPath();
        ctx.arc(x + gridSize / 2, y + gridSize / 2, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return ctx.getImageData(0, 0, width, height);
  }, [toGrayscale]);

  const posterize = useCallback((imageData, levels) => {
    const data = new Uint8ClampedArray(imageData.data);
    const step = 255 / (levels - 1);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(Math.round(data[i] / step) * step);
      data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step);
      data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step);
    }
    return new ImageData(data, imageData.width, imageData.height);
  }, []);

  const asciiArt = useCallback((imageData, characterRamp) => {
    const data = toGrayscale(imageData);
    const { width, height } = imageData;
    let ascii = '';
    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 4) {
        const i = (y * width + x) * 4;
        const brightness = data[i] / 255;
        const charIndex = Math.floor(brightness * (characterRamp.length - 1));
        ascii += characterRamp[charIndex];
      }
      ascii += '\n';
    }
    return ascii;
  }, [toGrayscale]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      // Always draw the original image first
      ctx.filter = 'none';
      ctx.drawImage(img, 0, 0);

      if (activeEffect === 'monochrome') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (activeEffect === 'blur') {
        canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, blurAmount);
      } else if (activeEffect === 'dithering') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const ditheredImageData = bayerDither(imageData);
        ctx.putImageData(ditheredImageData, 0, 0);
      } else if (activeEffect === 'celShading') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const quantizedData = quantizeColors(imageData, 4);
        const edges = sobel(imageData);
        const finalData = combine(quantizedData, edges);
        ctx.putImageData(finalData, 0, 0);
      } else if (activeEffect === 'halftone') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const halftoneData = halftone(imageData, 10);
        ctx.putImageData(halftoneData, 0, 0);
      } else if (activeEffect === 'solarization') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const threshold = 128;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r < threshold) data[i] = 255 - r;
          if (g < threshold) data[i + 1] = 255 - g;
          if (b < threshold) data[i + 2] = 255 - b;
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (activeEffect === 'posterization') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const posterizedData = posterize(imageData, 4); // 4 levels per channel
        ctx.putImageData(posterizedData, 0, 0);
      } else if (activeEffect === 'sepia') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (activeEffect === 'pixelization') {
        const pixelSize = 10;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let y = 0; y < canvas.height; y += pixelSize) {
          for (let x = 0; x < canvas.width; x += pixelSize) {
            const i = (y * canvas.width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      } else if (activeEffect === 'duotone') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const darkColor = { r: 0, g: 0, b: 100 };
        const lightColor = { r: 255, g: 255, b: 155 };
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const t = avg / 255;
          data[i] = darkColor.r + (lightColor.r - darkColor.r) * t;
          data[i + 1] = darkColor.g + (lightColor.g - darkColor.g) * t;
          data[i + 2] = darkColor.b + (lightColor.b - darkColor.b) * t;
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (activeEffect === 'asciiArt') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const ascii = asciiArt(imageData, '@%#*+=-:. ');
        setAsciiArtOutput(ascii);
      }
    };
  }, [image, activeEffect, blurAmount, asciiArt, bayerDither, combine, halftone, posterize, quantizeColors, sobel]);

  const handleGetColorPalette = () => {
    if (image) {
      setActiveEffect('palette');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handleConvertToMonochrome = () => {
    if (image) {
      setActiveEffect('monochrome');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handleBlurImage = () => {
    if (image) {
      setActiveEffect('blur');
      setBlurAmount(10); // Default blur
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handleApplyDithering = () => {
    if(image) {
      setActiveEffect('dithering');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handleCelShading = () => {
    if (image) {
      setActiveEffect('celShading');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handleHalftone = () => {
    if (image) {
      setActiveEffect('halftone');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handleSolarization = () => {
    if (image) {
      setActiveEffect('solarization');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handlePosterization = () => {
    if (image) {
      setActiveEffect('posterization');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handleSepia = () => {
    if (image) {
      setActiveEffect('sepia');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handlePixelization = () => {
    if (image) {
      setActiveEffect('pixelization');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handleDuotone = () => {
    if (image) {
      setActiveEffect('duotone');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handleAsciiArt = () => {
    if (image) {
      setActiveEffect('asciiArt');
    } else {
      addToast({ title: 'Info', message: 'Please upload an image first.' });
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = 'modified-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleCopyAsciiArt = () => {
    if (asciiArtOutput) {
      navigator.clipboard.writeText(asciiArtOutput)
        .then(() => {
          addToast({
            title: 'Success',
            message: 'Copied ASCII art to clipboard!',
            duration: 2000,
          });
        })
        .catch(() => {
          addToast({
            title: 'Error',
            message: 'Failed to copy ASCII art!',
            duration: 2000,
          });
        });
    }
  };

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
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
          <span className="single-app-color">itk</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden h-full w-full max-w-6xl"
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
            <h1 className="text-3xl font-arvo font-normal mb-4 text-app">Image Toolkit</h1>
            <hr className="border-gray-700 mb-4" />
            <div className="relative z-10 p-1">
              <div className="flex justify-center mb-4">
                <label htmlFor="image-upload" className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-app/50 text-white hover:bg-app/70 cursor-pointer">
                  Select Image
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <hr className="border-gray-700 my-4" />
              <h2 className="text-2xl font-arvo font-normal mb-4 text-app text-center">Filters</h2>
              <div className="flex justify-center gap-4 mb-4 flex-wrap">
                <button onClick={handleGetColorPalette} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Get Color Palette</button>
                <button onClick={handleConvertToMonochrome} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Monochrome</button>
                <button onClick={handleBlurImage} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Blur</button>
                <button onClick={handleApplyDithering} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Dithering</button>
                <button onClick={handleCelShading} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Cel Shading</button>
                <button onClick={handleHalftone} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Halftone</button>
                <button onClick={handleSolarization} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Solarization</button>
                <button onClick={handlePosterization} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Posterization</button>
                <button onClick={handleSepia} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Sepia</button>
                <button onClick={handlePixelization} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Pixelization</button>
                <button onClick={handleDuotone} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Duotone</button>
                <button onClick={handleAsciiArt} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">ASCII Art</button>
              </div>
              {activeEffect === 'blur' && (
                <div className="flex justify-center items-center gap-4 my-4">
                  <label htmlFor="blur-range" className="form-label">Blur Amount: {blurAmount}px</label>
                  <input
                    id="blur-range"
                    type="range"
                    min="0"
                    max="50"
                    value={blurAmount}
                    onChange={(e) => setBlurAmount(e.target.value)}
                    className="w-64"
                  />
                </div>
              )}
              <div className="flex flex-col items-center gap-4 mt-4">
                {image && (
                  <div className="w-full border border-gray-500 p-2 rounded-lg">
                    <h3 className="text-xl font-bold mb-2 text-center">Original</h3>
                    <img ref={imageRef} src={image} alt="Original" className="max-w-full h-auto rounded-lg mx-auto" />
                  </div>
                )}
                {activeEffect && activeEffect !== 'palette' && (
                  <div className="w-full border border-gray-500 p-2 rounded-lg">
                    <h3 className="text-xl font-bold mb-2 text-center">Modified</h3>
                    <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg mx-auto"></canvas>
                  </div>
                )}
              </div>
              {activeEffect === 'palette' && image && (
                <div>
                  <h3 className="text-xl font-bold mb-2 mt-4 text-center">Color Palette</h3>
                  <Palette image={image} />
                </div>
              )}
              {activeEffect === 'asciiArt' && asciiArtOutput && (
                <div className="w-full border border-gray-500 p-2 rounded-lg mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-center ml-4">ASCII Art</h3>
                    <button onClick={handleCopyAsciiArt} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-blue-500/50 text-white hover:bg-blue-500/70">Copy</button>
                  </div>
                  <pre className="text-xs text-white bg-gray-900 p-4 rounded-lg overflow-x-auto whitespace-pre">{asciiArtOutput}</pre>
                </div>
              )}
              {activeEffect && activeEffect !== 'palette' && (
                <div className="flex justify-center mt-4">
                  <button onClick={handleDownload} className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out bg-green-500/50 text-white hover:bg-green-500/70">Download Image</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageToolkitPage;
