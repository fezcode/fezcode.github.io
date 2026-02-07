import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  TextTIcon,
  UserIcon,
  HeartIcon,
  GlobeIcon,
  TrashIcon,
  PaintBrushIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const TweetCreatorPage = () => {
  const { addToast } = useToast();
  const canvasRef = useRef(null);

  // Identity State
  const [userName, setUserName] = useState('Skylar_99');
  const [userHandle, setUserHandle] = useState('skylar_flux');
  const [tweetText, setTweetText] = useState(
    'Just discovered the ultimate digital architecture protocol. The paradigm is shifting! ✨ #Fezcodex #DigitalArt',
  );

  // Engagement & Metadata State
  const [likeCount, setLikeCount] = useState('1,337');
  const [commentCount, setCommentCount] = useState('42');
  const [dateText, setDateText] = useState('10:24 PM · Dec 25, 2025');
  const [locationText, setLocationText] = useState('Transmission_HQ');
  const [postLink, setPostLink] = useState('fezcode.com/nodes/049');
  const [showCardBg, setShowCardBg] = useState(true);

  const drawTweet = useCallback(
    (ctx, width, height) => {
      const scale = width / 800;

      // 1. Transparent/Clean Background

      ctx.clearRect(0, 0, width, height);

      // 2. Card Dimensions

      const cardW = width;

      const cardH = height;

      const cardX = 0;

      const cardY = 0;

      const radius = 40 * scale;

      // Define Card Path for clipping and filling

      const defineCardPath = (c) => {
        c.beginPath();

        c.moveTo(cardX + radius, cardY);

        c.lineTo(cardX + cardW - radius, cardY);

        c.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);

        c.lineTo(cardX + cardW, cardY + cardH - radius);

        c.quadraticCurveTo(
          cardX + cardW,
          cardY + cardH,
          cardX + cardW - radius,
          cardY + cardH,
        );

        c.lineTo(cardX + radius, cardY + cardH);

        c.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius);

        c.lineTo(cardX, cardY + radius);

        c.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);

        c.closePath();
      };

      ctx.save();

      // Draw Background if enabled

      if (showCardBg) {
        ctx.save();

        defineCardPath(ctx);

        ctx.clip();

        // Background Gradient (Echo Chamber Style)

        const bgGradient = ctx.createLinearGradient(0, 0, width, height);

        bgGradient.addColorStop(0, '#6366f1'); // indigo-500

        bgGradient.addColorStop(0.5, '#a855f7'); // purple-500

        bgGradient.addColorStop(1, '#ec4899'); // pink-500

        ctx.fillStyle = bgGradient;

        ctx.fillRect(0, 0, width, height);

        // Blobs

        const drawBlob = (x, y, r, color) => {
          ctx.save();

          ctx.beginPath();

          ctx.arc(x, y, r, 0, Math.PI * 2);

          ctx.fillStyle = color;

          ctx.filter = 'blur(80px)';

          ctx.globalAlpha = 0.4;

          ctx.fill();

          ctx.restore();
        };

        drawBlob(width * 0.2, height * 0.2, 300 * scale, '#c084fc');

        drawBlob(width * 0.8, height * 0.1, 250 * scale, '#facc15');

        drawBlob(width * 0.5, height * 0.9, 350 * scale, '#f472b6');

        ctx.restore();
      }

      // Glass Fill

      defineCardPath(ctx);

      ctx.fillStyle = showCardBg
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(255, 255, 255, 0.05)';

      ctx.fill();

      // Glass Border

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';

      ctx.lineWidth = 2 * scale;

      ctx.stroke();

      ctx.restore();

      // 3. Content Rendering

      const contentPadding = 50 * scale;

      const innerX = cardX + contentPadding;

      let currentY = cardY + contentPadding;

      // User Info Row

      const avatarSize = 70 * scale;

      ctx.beginPath();

      ctx.arc(
        innerX + avatarSize / 2,
        currentY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2,
      );

      const avatarGrad = ctx.createLinearGradient(
        innerX,
        currentY,
        innerX + avatarSize,
        currentY + avatarSize,
      );

      avatarGrad.addColorStop(0, '#fef08a');

      avatarGrad.addColorStop(1, '#f472b6');

      ctx.fillStyle = avatarGrad;

      ctx.fill();

      ctx.fillStyle = 'white';

      ctx.font = `bold ${30 * scale}px "JetBrains Mono"`;

      ctx.textAlign = 'center';

      ctx.textBaseline = 'middle';

      ctx.fillText('@', innerX + avatarSize / 2, currentY + avatarSize / 2);

      ctx.textAlign = 'left';

      ctx.textBaseline = 'top';

      ctx.font = `bold ${32 * scale}px "Playfair Display"`;

      ctx.fillStyle = 'white';

      ctx.fillText(
        userName,
        innerX + avatarSize + 20 * scale,
        currentY + 5 * scale,
      );

      ctx.font = `${20 * scale}px "JetBrains Mono"`;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

      ctx.fillText(
        `@${userHandle}`,
        innerX + avatarSize + 20 * scale,
        currentY + 40 * scale,
      );

      currentY += avatarSize + 40 * scale;

      // Tweet Text

      ctx.fillStyle = 'white';

      ctx.font = `500 ${36 * scale}px "Arvo"`;

      const maxWidth = cardW - contentPadding * 2;

      const words = tweetText.split(' ');

      let line = '';

      const lineHeight = 50 * scale;

      for (let n = 0; words.length > n; n++) {
        const testLine = line + words[n] + ' ';

        const metrics = ctx.measureText(testLine);

        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, innerX, currentY);

          line = words[n] + ' ';

          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }

      ctx.fillText(line, innerX, currentY);

      currentY += lineHeight + 20 * scale;

      // Meta (Date & Location)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

      ctx.font = `${18 * scale}px "JetBrains Mono"`;

      const metaText = `${dateText} · ${locationText}`;

      ctx.fillText(metaText.toUpperCase(), innerX, currentY);

      currentY += 40 * scale;

      // Stats Row

      ctx.beginPath();

      ctx.moveTo(innerX, currentY);

      ctx.lineTo(cardX + cardW - contentPadding, currentY);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';

      ctx.lineWidth = 1 * scale;

      ctx.stroke();

      currentY += 30 * scale;

      // Icons & Counts

      const iconSize = 24 * scale;

      ctx.textBaseline = 'middle';

      ctx.font = `bold ${24 * scale}px "JetBrains Mono"`;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

      ctx.fillText('💬', innerX, currentY + iconSize / 2);

      ctx.fillStyle = 'white';

      ctx.fillText(commentCount, innerX + 40 * scale, currentY + iconSize / 2);

      const likeX = innerX + 150 * scale;

      ctx.fillStyle = '#f472b6';

      ctx.fillText('❤️', likeX, currentY + iconSize / 2);

      ctx.fillStyle = 'white';

      ctx.fillText(likeCount, likeX + 40 * scale, currentY + iconSize / 2);

      // Link Text at bottom

      ctx.textAlign = 'center';

      ctx.font = `${12 * scale}px "JetBrains Mono"`;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

      ctx.fillText(
        postLink.toUpperCase(),
        cardX + cardW / 2,
        cardY + cardH - 20 * scale,
      );
    },
    [
      userName,
      userHandle,
      tweetText,
      likeCount,
      commentCount,
      dateText,
      locationText,
      postLink,
      showCardBg,
    ],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    const logicalWidth = 800;
    const logicalHeight = 550; // Increased slightly for link text

    canvas.width = rect.width * dpr;
    canvas.height = rect.width * (logicalHeight / logicalWidth) * dpr;
    ctx.scale(
      dpr * (rect.width / logicalWidth),
      dpr * (rect.width / logicalWidth),
    );

    drawTweet(ctx, logicalWidth, logicalHeight);
  }, [drawTweet]);

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const W = 1600;
    const H = 1100;
    canvas.width = W;
    canvas.height = H;

    drawTweet(ctx, W, H);

    const link = document.createElement('a');
    link.download = `tweet-${userHandle}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    addToast({
      title: 'EXPORT_SUCCESS',
      message: 'Tweet snapshot rasterized and saved.',
    });
  };

  const glassCardClass =
    'bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl';
  const glassInputClass =
    'bg-white/5 border border-white/10 rounded-xl p-3 font-sans text-sm text-white focus:border-pink-400/50 outline-none transition-colors w-full placeholder-white/20';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans text-white overflow-hidden relative selection:bg-pink-300 selection:text-pink-900">
      <Seo
        title="Tweet Creator | Fezcodex"
        description="Create high-fidelity tweet snapshots using precise canvas rendering."
        keywords={[
          'tweet creator',
          'canvas',
          'social media',
          'mockup',
          'generator',
          'echo chamber',
          'fezcodex',
        ]}
      />
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 relative z-10">
        <header className="mb-24">
          <Link
            to="/apps"
            className={`${glassCardClass} px-6 py-3 inline-flex items-center gap-2 hover:bg-white/20 transition-all text-xs font-bold font-mono tracking-widest uppercase mb-12`}
          >
            <ArrowLeftIcon weight="bold" />
            <span>Archive</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle
                title="Tweet Creator"
                slug="tweet"
                variant="brutalist"
              />
              <p className="text-xl text-pink-100 max-w-2xl font-light leading-relaxed drop-shadow-md">
                {' '}
                Precise canvas snapshot protocol. Every pixel is calculated for
                perfect alignment and technical fidelity.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Controls Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className={`${glassCardClass} p-8 space-y-6`}>
              {' '}
              <h3 className="font-mono text-[10px] font-bold text-pink-200 uppercase tracking-widest flex items-center gap-2">
                <UserIcon weight="fill" />
                Identity_Matrix
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={glassInputClass}
                  placeholder="User Name"
                />
                <input
                  type="text"
                  value={userHandle}
                  onChange={(e) => setUserHandle(e.target.value)}
                  className={glassInputClass}
                  placeholder="User Handle"
                />
              </div>
            </div>

            <div className={`${glassCardClass} p-8 space-y-6`}>
              <h3 className="font-mono text-[10px] font-bold text-pink-200 uppercase tracking-widest flex items-center gap-2">
                <TextTIcon weight="fill" />
                Transmission_Data
              </h3>
              <div className="space-y-4">
                <textarea
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  rows={4}
                  className={`${glassInputClass} resize-none`}
                  placeholder="Tweet Text"
                />
                <input
                  type="text"
                  value={postLink}
                  onChange={(e) => setPostLink(e.target.value)}
                  className={glassInputClass}
                  placeholder="Origin Link"
                />
              </div>
            </div>

            <div className={`${glassCardClass} p-8 space-y-6`}>
              <h3 className="font-mono text-[10px] font-bold text-pink-200 uppercase tracking-widest flex items-center gap-2">
                <HeartIcon weight="fill" />
                Engagement_Matrix
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={likeCount}
                  onChange={(e) => setLikeCount(e.target.value)}
                  className={glassInputClass}
                  placeholder="Likes"
                />
                <input
                  type="text"
                  value={commentCount}
                  onChange={(e) => setCommentCount(e.target.value)}
                  className={glassInputClass}
                  placeholder="Comments"
                />
              </div>
            </div>

            <div className={`${glassCardClass} p-8 space-y-6`}>
              <h3 className="font-mono text-[10px] font-bold text-pink-200 uppercase tracking-widest flex items-center gap-2">
                <GlobeIcon weight="fill" />
                Temporal_Registry
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={dateText}
                  onChange={(e) => setDateText(e.target.value)}
                  className={glassInputClass}
                  placeholder="Date/Time String"
                />
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className={glassInputClass}
                  placeholder="Location Tag"
                />
              </div>
            </div>

            <div className={`${glassCardClass} p-8 space-y-6`}>
              <h3 className="font-mono text-[10px] font-bold text-pink-200 uppercase tracking-widest flex items-center gap-2">
                <PaintBrushIcon weight="fill" />
                Visual_Aesthetics
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowCardBg(!showCardBg)}
                  className={`w-full py-3 px-4 rounded-xl border transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-between ${
                    showCardBg
                      ? 'bg-pink-500/20 border-pink-500/50 text-pink-200'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  <span>Card Background</span>
                  <span className={showCardBg ? 'text-pink-400' : ''}>
                    {showCardBg ? '[ ENABLED ]' : '[ DISABLED ]'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-9 flex flex-col items-center">
            <div className="lg:sticky lg:top-24 w-full flex flex-col items-center gap-8">
              <div className="relative group w-full flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="w-full object-contain shadow-2xl rounded-sm"
                  style={{ imageRendering: 'pixelated' }}
                />
                <button
                  onClick={() => {
                    setUserName('Skylar_99');
                    setUserHandle('skylar_flux');
                    setTweetText('Default protocol initiated.');
                  }}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-black transition-all rounded-full"
                >
                  <TrashIcon weight="bold" /> Reset
                </button>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleDownload}
                  className={`${glassCardClass} px-12 py-4 flex items-center gap-3 hover:bg-white/20 transition-all font-black uppercase tracking-widest text-xs`}
                >
                  <DownloadSimpleIcon size={20} weight="bold" />
                  <span>Export_Snapshot_PNG</span>
                </button>
                <p className="text-center font-mono text-[10px] text-pink-100/40 uppercase tracking-widest">
                  System using native canvas protocols. Fidelity verified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default TweetCreatorPage;
