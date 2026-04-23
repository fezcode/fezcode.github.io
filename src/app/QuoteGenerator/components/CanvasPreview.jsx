import React, { useRef, useEffect, useCallback } from 'react';

const CanvasPreview = ({
  text,
  author,
  width,
  height,
  backgroundType,
  backgroundColor,
  gradientColor1,
  gradientColor2,
  gradientAngle,
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
  triggerDownload, // boolean to trigger download effect
}) => {
  const canvasRef = useRef(null);

  // Helper to wrap text
  const getWrappedLines = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
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

  const drawNewspaperBg = useCallback(
    (ctx, w, h) => {
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
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
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
        if (data[i + 3] > 0) {
          const noise = (Math.random() - 0.5) * 20;
          data[i] = Math.min(255, Math.max(0, data[i] + noise));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
      }
      ctx.putImageData(imageData, 0, 0);

      // 2. Aged Vignette
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop'; // Only draw on top of existing paper
      const gradient = ctx.createRadialGradient(
        w / 2,
        h / 2,
        w / 3,
        w / 2,
        h / 2,
        w * 0.8,
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(139, 69, 19, 0.2)'); // Sepia tint
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    },
    [backgroundColor],
  );

  const drawContent = useCallback(
  (ctx) => {
    // 3. Text Configuration
    ctx.fillStyle = textColor;
    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;
    ctx.textBaseline = 'top';

    if (themeType === 'neon') {
      ctx.shadowColor = textColor;
      ctx.shadowBlur = fontSize * 0.4;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    const maxWidth = width - padding * 2;
    const lines = getWrappedLines(ctx, text, maxWidth);
    const totalTextHeight = lines.length * (fontSize * lineHeight);

    // Vertical Center Calculation
    let startY = (height - totalTextHeight) / 2;

    // Adjust if there is an author
    if (author) {
      startY -= fontSize * 0.8;
    }

    if (themeType === 'polaroid') {
       startY = height - padding - totalTextHeight - (author ? fontSize * 1.5 : 0);
    }

    // Drawing Text
    lines.forEach((line, index) => {
      const lineWidth = ctx.measureText(line).width;
      let x;
      if (textAlign === 'center') x = (width - lineWidth) / 2;
      else if (textAlign === 'right') x = width - padding - lineWidth;
      else x = padding;

      const y = startY + index * fontSize * lineHeight;

      if (themeType === 'wordbox') {
        const bgPadding = fontSize * 0.2;
        ctx.save();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.fillStyle = textColor;
        ctx.fillRect(
          x - bgPadding,
          y - bgPadding,
          lineWidth + bgPadding * 2,
          fontSize * lineHeight,
        );

        ctx.fillStyle = backgroundColor;
        ctx.fillText(line, x, y);
        ctx.restore();
      } else if (themeType === 'brutalist') {
         const offset = fontSize * 0.1;
         ctx.save();
         ctx.shadowColor = 'transparent';
         ctx.shadowBlur = 0;
         ctx.fillStyle = textColor;
         ctx.fillText(line, x - offset, y - offset);
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
      const authorY = startY + totalTextHeight + fontSize * 1.5;
      const authorWidth = ctx.measureText('- ' + author).width;

      let authorX;
      if (textAlign === 'center') authorX = (width - authorWidth) / 2;
      else if (textAlign === 'right') authorX = width - padding - authorWidth;
      else authorX = padding;

      if (themeType === 'brutalist') {
         const offset = authorFontSize * 0.1;
         ctx.save();
         ctx.shadowColor = 'transparent';
         ctx.shadowBlur = 0;
         ctx.fillStyle = textColor;
         ctx.fillText('- ' + author, authorX - offset, authorY - offset);
         ctx.fillStyle = backgroundColor;
         ctx.fillText('- ' + author, authorX, authorY);
         ctx.restore();
      } else {
         ctx.fillText('- ' + author, authorX, authorY);
      }
    }
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  },
  [
    textColor,
    fontWeight,
    fontSize,
    fontFamily,
    width,
    padding,
    text,
    lineHeight,
    height,
    author,
    textAlign,
    themeType,
    backgroundColor,
  ],
  );
  const getBackgroundFillStyle = useCallback((ctx, w, h) => {
    if (backgroundType === 'linear') {
      const rad = (gradientAngle * Math.PI) / 180;
      const r = Math.sqrt(w*w + h*h) / 2;
      const x1 = w / 2 - Math.cos(rad) * r;
      const y1 = h / 2 - Math.sin(rad) * r;
      const x2 = w / 2 + Math.cos(rad) * r;
      const y2 = h / 2 + Math.sin(rad) * r;
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, gradientColor1);
      gradient.addColorStop(1, gradientColor2);
      return gradient;
    } else if (backgroundType === 'radial') {
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.max(w, h) / 1.2;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      gradient.addColorStop(0, gradientColor1);
      gradient.addColorStop(1, gradientColor2);
      return gradient;
    }
    return backgroundColor;
  }, [backgroundType, backgroundColor, gradientColor1, gradientColor2, gradientAngle]);

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
      ctx.fillStyle = getBackgroundFillStyle(ctx, width, height);
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
        };
      }
    }

    if (themeType === 'polaroid') {
      // Draw white polaroid frame
      const framePadding = width * 0.05;
      const bottomPadding = height * 0.25;

      ctx.fillStyle = '#ffffff';
      // Fill the entire canvas with white first (this is the polaroid frame)
      ctx.fillRect(0, 0, width, height);

      // Then draw the background image or color inside the "photo" area
      ctx.fillStyle = getBackgroundFillStyle(ctx, width, height);
      ctx.fillRect(framePadding, framePadding, width - (framePadding * 2), height - framePadding - bottomPadding);

      if (backgroundImage) {
        const img = new Image();
        img.src = backgroundImage;
        if (img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(framePadding, framePadding, width - (framePadding * 2), height - framePadding - bottomPadding);
          ctx.clip();
          drawImageCover(ctx, img, width, height);
          ctx.restore();
        }
      }
    }

    // Overlay
    if (overlayOpacity > 0) {
      if (themeType === 'polaroid') {
        const framePadding = width * 0.05;
        const bottomPadding = height * 0.25;
        ctx.save();
        ctx.beginPath();
        ctx.rect(framePadding, framePadding, width - (framePadding * 2), height - framePadding - bottomPadding);
        ctx.clip();
        ctx.fillStyle = overlayColor || '#000000';
        ctx.globalAlpha = overlayOpacity;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      } else {
        ctx.fillStyle = overlayColor || '#000000';
        ctx.globalAlpha = overlayOpacity;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1.0;
      }
    }

    // Thematic Enhancements
    if (themeType === 'science') {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }
      ctx.restore();
    } else if (themeType === 'kings') {
      ctx.save();
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, width - 60, height - 60);
      ctx.lineWidth = 2;
      ctx.strokeRect(45, 45, width - 90, height - 90);
      ctx.restore();
    } else if (themeType === 'birds') {
      ctx.save();
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      for(let i=0; i<7; i++) {
        const bx = Math.random() * width;
        const by = Math.random() * height * 0.5;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(bx + 10, by - 10, bx + 20, by);
        ctx.quadraticCurveTo(bx + 30, by - 10, bx + 40, by);
        ctx.stroke();
      }
      ctx.restore();
    } else if (themeType === 'rome') {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(20, 0, 40, height);
      ctx.fillRect(width - 60, 0, 40, height);
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      for(let i=25; i<=55; i+=10) {
         ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
         ctx.beginPath(); ctx.moveTo(width - 80 + i, 0); ctx.lineTo(width - 80 + i, height); ctx.stroke();
      }
      ctx.restore();
    } else if (themeType === 'french-girl') {
      // Charcoal sketch effect / noise
      const imgData = ctx.getImageData(0,0,width,height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
         const noise = (Math.random() - 0.5) * 30;
         data[i] = Math.min(255, Math.max(0, data[i] + noise));
         data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
         data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (themeType === 'cia' || themeType === 'fbi' || themeType === 'espionage') {
      ctx.save();

      if (themeType === 'cia' || themeType === 'fbi') {
        // Red stamp
        ctx.translate(width / 2, height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillStyle = 'rgba(200, 0, 0, 0.6)';
        ctx.strokeStyle = 'rgba(200, 0, 0, 0.6)';
        ctx.lineWidth = 10;
        const stampText = themeType === 'cia' ? 'TOP SECRET' : 'CONFIDENTIAL';
        ctx.font = `bold ${width * 0.15}px Impact`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        const tw = ctx.measureText(stampText).width;
        ctx.strokeRect(-tw/2 - 20, -width*0.075 - 20, tw + 40, width*0.15 + 40);
        ctx.fillText(stampText, 0, 0);
        ctx.rotate(Math.PI / 6);
        ctx.translate(-width / 2, -height / 2);
      }

      if (themeType === 'espionage') {
        // Radar/Crosshair
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, height/2); ctx.lineTo(width, height/2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(width/2, 0); ctx.lineTo(width/2, height); ctx.stroke();

        ctx.beginPath(); ctx.arc(width/2, height/2, width*0.2, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(width/2, height/2, width*0.4, 0, Math.PI*2); ctx.stroke();
      }

      ctx.restore();
    } else if (themeType === 'control-panel') {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 3;

      // Top LEDs
      for(let i=0; i<5; i++) {
        ctx.beginPath(); ctx.arc(50 + i*40, 50, 10, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      }
      // Dials bottom
      for(let i=0; i<3; i++) {
        const cx = width - 80 - i*80;
        const cy = height - 80;
        ctx.beginPath(); ctx.arc(cx, cy, 25, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(Math.PI/4 + i)*20, cy + Math.sin(Math.PI/4 + i)*20); ctx.stroke();
      }
      ctx.restore();
    } else if (themeType === 'basketball') {
      ctx.save();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 15;

      // Court lines
      ctx.beginPath(); ctx.moveTo(0, height/2); ctx.lineTo(width, height/2); ctx.stroke();
      ctx.beginPath(); ctx.arc(width/2, height/2, width*0.2, 0, Math.PI*2); ctx.stroke();

      // Arc lines like a ball
      ctx.beginPath(); ctx.moveTo(width*0.2, 0); ctx.quadraticCurveTo(width*0.8, height/2, width*0.2, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(width*0.8, 0); ctx.quadraticCurveTo(width*0.2, height/2, width*0.8, height); ctx.stroke();

      ctx.restore();
    } else if (themeType === 'football') {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 4;

      // Yard lines
      for(let i=100; i<width; i+=100) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
        // hash marks
        ctx.beginPath(); ctx.moveTo(i-10, height*0.3); ctx.lineTo(i+10, height*0.3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(i-10, height*0.7); ctx.lineTo(i+10, height*0.7); ctx.stroke();
      }
      ctx.restore();
    } else if (themeType === 'river') {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';

      for(let i=0; i<5; i++) {
        ctx.beginPath();
        ctx.moveTo(-100, height * (0.2 + i*0.15));
        ctx.bezierCurveTo(
          width * 0.3, height * (0.1 + i*0.2),
          width * 0.7, height * (0.4 + i*0.1),
          width + 100, height * (0.2 + i*0.15)
        );
        ctx.stroke();
      }
      ctx.restore();
    } else if (themeType === 'mountain') {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height*0.7);
      ctx.lineTo(width*0.2, height*0.5);
      ctx.lineTo(width*0.4, height*0.8);
      ctx.lineTo(width*0.7, height*0.4);
      ctx.lineTo(width*0.9, height*0.6);
      ctx.lineTo(width, height*0.5);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.moveTo(0, height*0.7);
      ctx.lineTo(width*0.1, height*0.75);
      ctx.lineTo(width*0.2, height*0.5);
      ctx.fill();

      ctx.restore();
    } else if (themeType === 'cats') {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      const drawPaw = (x, y, angle, scale) => {
         ctx.save();
         ctx.translate(x,y);
         ctx.rotate(angle);
         ctx.scale(scale, scale);
         // Main pad
         ctx.beginPath(); ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI*2); ctx.fill();
         // Toes
         ctx.beginPath(); ctx.arc(-15, -15, 6, 0, Math.PI*2); ctx.fill();
         ctx.beginPath(); ctx.arc(-5, -22, 6, 0, Math.PI*2); ctx.fill();
         ctx.beginPath(); ctx.arc(5, -22, 6, 0, Math.PI*2); ctx.fill();
         ctx.beginPath(); ctx.arc(15, -15, 6, 0, Math.PI*2); ctx.fill();
         ctx.restore();
      };

      drawPaw(width*0.1, height*0.2, Math.PI/4, 2);
      drawPaw(width*0.8, height*0.8, -Math.PI/3, 1.5);
      drawPaw(width*0.85, height*0.15, Math.PI/6, 1);
      drawPaw(width*0.15, height*0.85, -Math.PI/6, 3);
      drawPaw(width*0.5, height*0.9, Math.PI/12, 1.2);

      ctx.restore();
    } else if (themeType === 'libretto') {
      // Opera program — velvet curtain top, gilt fleuron, parchment center
      ctx.save();
      // Gilt hairline double frame
      const inset = Math.min(width, height) * 0.035;
      ctx.strokeStyle = '#C8A255';
      ctx.lineWidth = 2;
      ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);
      ctx.lineWidth = 0.8;
      ctx.strokeRect(inset + 6, inset + 6, width - inset * 2 - 12, height - inset * 2 - 12);

      // Top curtain swag — crimson
      const cH = height * 0.08;
      const curtainGrad = ctx.createLinearGradient(0, inset, 0, inset + cH);
      curtainGrad.addColorStop(0, '#7E1A24');
      curtainGrad.addColorStop(1, '#5A0F18');
      ctx.fillStyle = curtainGrad;
      for (let i = 0; i < 8; i++) {
        const segW = (width - inset * 2) / 8;
        const x = inset + i * segW;
        ctx.beginPath();
        ctx.moveTo(x, inset);
        ctx.quadraticCurveTo(x + segW / 2, inset + cH * (0.8 + (i % 2) * 0.2), x + segW, inset);
        ctx.closePath();
        ctx.fill();
        // gilt tassel
        ctx.fillStyle = '#C8A255';
        ctx.beginPath();
        ctx.arc(x + segW / 2, inset + cH * (0.8 + (i % 2) * 0.2) - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = curtainGrad;
      }

      // Gilt filigree corners (quarter-circle flourish)
      ctx.strokeStyle = '#C8A255';
      ctx.lineWidth = 1.5;
      const drawFlourish = (cx, cy, flip) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(flip, 1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(30, 0, 36, 30);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(0, 30, 30, 36);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(14, 14, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#C8A255';
        ctx.fill();
        ctx.restore();
      };
      drawFlourish(inset + 14, inset + cH + 14, 1);
      drawFlourish(width - inset - 14, inset + cH + 14, -1);
      drawFlourish(inset + 14, height - inset - 14, 1);
      drawFlourish(width - inset - 14, height - inset - 14, -1);

      // Fleuron centered near top, just below curtain
      const fY = inset + cH + 22;
      ctx.fillStyle = '#C8A255';
      ctx.beginPath();
      ctx.moveTo(width / 2, fY - 8);
      ctx.quadraticCurveTo(width / 2 - 12, fY, width / 2 - 18, fY);
      ctx.quadraticCurveTo(width / 2 - 12, fY, width / 2, fY + 8);
      ctx.quadraticCurveTo(width / 2 + 12, fY, width / 2 + 18, fY);
      ctx.quadraticCurveTo(width / 2 + 12, fY, width / 2, fY - 8);
      ctx.fill();

      ctx.restore();
    } else if (themeType === 'chalkboard') {
      // Green chalkboard — slate texture + chalk dust
      ctx.save();
      // Chalk dust speckles
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 900; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = Math.random() * 1.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // Chalk border
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 6]);
      ctx.strokeRect(40, 40, width - 80, height - 80);
      ctx.setLineDash([]);
      // Chalk corner doodle — a star
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      const drawStar = (cx, cy, r) => {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a1 = -Math.PI / 2 + (i * Math.PI * 2) / 5;
          const a2 = a1 + Math.PI / 5;
          ctx.lineTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
          ctx.lineTo(cx + Math.cos(a2) * (r * 0.45), cy + Math.sin(a2) * (r * 0.45));
        }
        ctx.closePath();
        ctx.stroke();
      };
      drawStar(width - 100, 100, 30);
      // Underline scribble near bottom center
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height - 100);
      ctx.quadraticCurveTo(width * 0.5, height - 90, width * 0.7, height - 100);
      ctx.stroke();
      ctx.restore();
    } else if (themeType === 'tarot') {
      // Tarot card — gold ornate border, sun/moon symbols, mystic dots
      ctx.save();
      // Double gold border
      ctx.strokeStyle = '#D4A94A';
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, width - 60, height - 60);
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, width - 96, height - 96);
      // Corner rosettes
      const rosette = (cx, cy) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.fillStyle = '#D4A94A';
        for (let i = 0; i < 8; i++) {
          ctx.rotate((Math.PI * 2) / 8);
          ctx.beginPath();
          ctx.ellipse(0, -12, 3, 8, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      rosette(70, 70);
      rosette(width - 70, 70);
      rosette(70, height - 70);
      rosette(width - 70, height - 70);

      // Sun top-center
      ctx.fillStyle = '#E8C878';
      ctx.beginPath();
      ctx.arc(width / 2, 100, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E8C878';
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI * 2) / 12;
        ctx.beginPath();
        ctx.moveTo(width / 2 + Math.cos(a) * 24, 100 + Math.sin(a) * 24);
        ctx.lineTo(width / 2 + Math.cos(a) * 34, 100 + Math.sin(a) * 34);
        ctx.stroke();
      }
      // Moon bottom-center (crescent)
      ctx.fillStyle = '#E8C878';
      ctx.beginPath();
      ctx.arc(width / 2, height - 100, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = backgroundColor;
      ctx.beginPath();
      ctx.arc(width / 2 - 6, height - 100, 14, 0, Math.PI * 2);
      ctx.fill();
      // Mystic dots scattered
      ctx.fillStyle = 'rgba(232,200,120,0.35)';
      for (let i = 0; i < 40; i++) {
        const x = 60 + Math.random() * (width - 120);
        const y = 140 + Math.random() * (height - 280);
        const r = Math.random() * 1.8;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (themeType === 'ransom') {
      // Ransom note — torn paper rects with different text colors and rotations
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#000';
      for (let i = 0; i < 1600; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillRect(x, y, 1.2, 1.2);
      }
      ctx.globalAlpha = 1;
      // Random torn paper strips behind
      const colors = ['#F5E8C9', '#E8D5B0', '#F0E0C0', '#D9C79E'];
      for (let i = 0; i < 18; i++) {
        const w = 70 + Math.random() * 140;
        const h = 50 + Math.random() * 90;
        const x = Math.random() * (width - w);
        const y = Math.random() * (height - h);
        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate((Math.random() - 0.5) * 0.4);
        ctx.fillStyle = colors[i % colors.length];
        ctx.globalAlpha = 0.25;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.restore();
      }
      ctx.restore();
    }

    drawContent(ctx);
  }, [
    width,
    height,
    getBackgroundFillStyle,
    backgroundImage,
    overlayOpacity,
    overlayColor,
    drawImageCover,
    drawContent,
    themeType,
    drawNewspaperBg,
    textColor,
  ]);
  useEffect(() => {
    draw();
    document.fonts.ready.then(draw);
  }, [draw]);

  useEffect(() => {
    if (triggerDownload && onDownload && canvasRef.current) {
      let mimeType = 'image/png';
      if (triggerDownload === 'jpeg' || triggerDownload === 'jpg') mimeType = 'image/jpeg';
      else if (triggerDownload === 'webp') mimeType = 'image/webp';

      onDownload(canvasRef.current.toDataURL(mimeType, 0.9), triggerDownload);
    }
  }, [triggerDownload, onDownload]);

  return (
    <div className="w-full flex justify-center items-center overflow-hidden bg-[#111] border border-white/10 rounded-lg p-4">
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          height: 'auto',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      />
    </div>
  );
};

export default CanvasPreview;
