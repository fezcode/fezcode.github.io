import React, { useRef, useEffect, useCallback } from 'react';

const CanvasPreview = ({
  text,
  author,
  width,
  height,
  backgroundColor,
  textColor,
  fontFamily,
  fontSize,
  fontWeight,
  textAlign,
  padding,
  lineHeight,
  backgroundImage,
  overlayOpacity,
  overlayColor,
  themeType, // 'standard', 'wordbox', 'outline', 'newspaper'
  onDownload,
  triggerDownload // boolean to trigger download effect
}) => {
  const canvasRef = useRef(null);

  // Helper to wrap text
  const getWrappedLines = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const drawImageCover = useCallback((ctx, img, w, h) => {
      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;
      let renderW, renderH, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
          renderH = h;
          renderW = h * imgRatio;
          offsetX = (w - renderW) / 2;
          offsetY = 0;
      } else {
          renderW = w;
          renderH = w / imgRatio;
          offsetX = 0;
          offsetY = (h - renderH) / 2;
      }
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }, []);

    const drawNewspaperBg = useCallback((ctx, w, h) => {
        // Clear canvas for transparency around torn edges
        ctx.clearRect(0, 0, w, h);

        const pad = 60; // Padding from canvas edge for the paper

        ctx.beginPath();
        ctx.moveTo(pad, pad);

        // Top edge (ragged)
        for (let x = pad; x <= w - pad; x += 5) {
             ctx.lineTo(x, pad + (Math.random() - 0.5) * 8);
        }

        // Right edge (ragged)
        for (let y = pad; y <= h - pad; y += 5) {
             ctx.lineTo(w - pad + (Math.random() - 0.5) * 8, y);
        }

        // Bottom edge (ragged)
        for (let x = w - pad; x >= pad; x -= 5) {
             ctx.lineTo(x, h - pad + (Math.random() - 0.5) * 8);
        }

        // Left edge (ragged)
        for (let y = h - pad; y >= pad; y -= 5) {
             ctx.lineTo(pad + (Math.random() - 0.5) * 8, y);
        }
        ctx.closePath();

        // Shadow for depth (Outer glow)
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 15;
        ctx.fillStyle = backgroundColor;
        ctx.fill();
        ctx.restore();

        // 1. Apply Texture (Noise) to the filled shape
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            // Only apply noise where alpha > 0 (inside the filled shape)
            if (data[i+3] > 0) {
                const noise = (Math.random() - 0.5) * 20;
                data[i] = Math.min(255, Math.max(0, data[i] + noise));
                data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
                data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
            }
        }
        ctx.putImageData(imageData, 0, 0);

        // 2. Aged Vignette
        ctx.save();
        ctx.globalCompositeOperation = 'source-atop'; // Only draw on top of existing paper
        const gradient = ctx.createRadialGradient(w/2, h/2, w/3, w/2, h/2, w*0.8);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(139, 69, 19, 0.2)"); // Sepia tint
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,w,h);
        ctx.restore();
    }, [backgroundColor]);

    const drawContent = useCallback((ctx) => {
      // 3. Text Configuration
      ctx.fillStyle = textColor;
      ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;
      ctx.textBaseline = 'top';

      const maxWidth = width - (padding * 2);
      const lines = getWrappedLines(ctx, text, maxWidth);
      const totalTextHeight = lines.length * (fontSize * lineHeight);

      // Vertical Center Calculation
      let startY = (height - totalTextHeight) / 2;

      // Adjust if there is an author
      if (author) {
          startY -= (fontSize * 0.8);
      }

      // Drawing Text
      lines.forEach((line, index) => {
          const lineWidth = ctx.measureText(line).width;
          let x;
          if (textAlign === 'center') x = (width - lineWidth) / 2;
          else if (textAlign === 'right') x = width - padding - lineWidth;
          else x = padding;

          const y = startY + (index * fontSize * lineHeight);

          if (themeType === 'wordbox') {
              const bgPadding = fontSize * 0.2;
              ctx.save();
              ctx.fillStyle = textColor;
              ctx.fillRect(x - bgPadding, y - bgPadding, lineWidth + (bgPadding*2), (fontSize * lineHeight));

              ctx.fillStyle = backgroundColor;
              ctx.fillText(line, x, y);
              ctx.restore();
          } else {
               ctx.fillText(line, x, y);
          }
      });

      // 4. Draw Author
      if (author) {
          const authorFontSize = fontSize * 0.5;
          ctx.font = `italic ${fontWeight} ${authorFontSize}px "${fontFamily}"`;
          const authorY = startY + totalTextHeight + (fontSize * 1.5);
          const authorWidth = ctx.measureText("- " + author).width;

          let authorX;
          if (textAlign === 'center') authorX = (width - authorWidth) / 2;
          else if (textAlign === 'right') authorX = width - padding - authorWidth;
          else authorX = padding;

          ctx.fillText("- " + author, authorX, authorY);
      }
    }, [textColor, fontWeight, fontSize, fontFamily, width, padding, text, lineHeight, height, author, textAlign, themeType, backgroundColor]);

    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // 1. Setup Canvas
      canvas.width = width;
      canvas.height = height;

      // 2. Background
      if (themeType === 'newspaper') {
          drawNewspaperBg(ctx, width, height);
      } else {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, width, height);
      }

      if (backgroundImage) {
          const img = new Image();
          img.src = backgroundImage;
          if (img.complete) {
               drawImageCover(ctx, img, width, height);
          } else {
              img.onload = () => {
                  drawImageCover(ctx, img, width, height);
                  drawContent(ctx);
              }
          }
      }

      // Overlay
      if (overlayOpacity > 0) {
          ctx.fillStyle = overlayColor || '#000000';
          ctx.globalAlpha = overlayOpacity;
          ctx.fillRect(0, 0, width, height);
          ctx.globalAlpha = 1.0;
      }

      drawContent(ctx);
    }, [width, height, backgroundColor, backgroundImage, overlayOpacity, overlayColor, drawImageCover, drawContent, themeType, drawNewspaperBg]);
  useEffect(() => {
    draw();
    document.fonts.ready.then(draw);
  }, [draw]);

  useEffect(() => {
      if (triggerDownload && onDownload && canvasRef.current) {
          onDownload(canvasRef.current.toDataURL('image/png'));
      }
  }, [triggerDownload, onDownload]);

  return (
    <div className="w-full flex justify-center items-center overflow-hidden bg-[#111] border border-white/10 rounded-lg p-4">
      <canvas
        ref={canvasRef}
        style={{
            maxWidth: '100%',
            height: 'auto',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      />
    </div>
  );
};

export default CanvasPreview;