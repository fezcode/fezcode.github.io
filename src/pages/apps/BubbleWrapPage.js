import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon, CirclesFourIcon} from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import {useAchievements} from '../../context/AchievementContext';

const BUBBLE_COUNT = 100; // Number of bubbles

const BubbleWrapPage = () => {
  useSeo({
    title: 'Bubble Wrap | Fezcodex',
    description: 'Pop some virtual bubble wrap to relieve stress.',
    keywords: ['Fezcodex', 'bubble wrap', 'stress relief', 'pop', 'game'],
    ogTitle: 'Bubble Wrap | Fezcodex',
    ogDescription: 'Pop some virtual bubble wrap to relieve stress.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Bubble Wrap | Fezcodex',
    twitterDescription: 'Pop some virtual bubble wrap to relieve stress.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const {unlockAchievement} = useAchievements();
  const [bubbles, setBubbles] = useState(Array(BUBBLE_COUNT).fill(false));
  const [popCount, setPopCount] = useState(0);

  // Audio context for simple pop sound
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
  }, []);

  useEffect(() => {
    if (popCount === BUBBLE_COUNT) {
      unlockAchievement('entropy_increaser');
    }
  }, [popCount, unlockAchievement]);

  const playPopSound = () => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'square'; // Change to square wave for a harsher sound
    oscillator.frequency.value = 100 + Math.random() * 200; // Lower frequency for more bass

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.5, now); // Start louder
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08); // Faster and shorter decay

    oscillator.start(now);
    oscillator.stop(now + 0.08); // Very short duration
  };

  const popBubble = (index) => {
    if (bubbles[index]) return; // Already popped

    const newBubbles = [...bubbles];
    newBubbles[index] = true;
    setBubbles(newBubbles);
    setPopCount((prev) => prev + 1);
    playPopSound();
  };

  const resetBubbles = () => {
    setBubbles(Array(BUBBLE_COUNT).fill(false));
    setPopCount(0);
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
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1"/>
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Bubble Wrap" slug="pop"/>
        <hr className="border-gray-700"/>
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-3xl"
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
            <div className="relative z-10 p-1 text-center">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app flex items-center justify-center gap-2">
                <CirclesFourIcon size={32}/> Bubble Wrap
              </h1>
              <hr className="border-gray-700 mb-6"/>

              <div className="flex justify-between items-center mb-6 px-4">
                <div className="text-xl font-bold">Popped: {popCount}</div>
                <button
                  onClick={resetBubbles}
                  className="px-4 py-2 rounded-md text-sm font-arvo font-normal border transition-colors duration-300 hover:bg-white/10"
                  style={{
                    borderColor: cardStyle.color,
                    color: cardStyle.color,
                  }}
                >
                  Get a fresh sheet
                </button>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 justify-items-center">
                {bubbles.map((isPopped, index) => (
                  <button
                    key={index}
                    onClick={() => popBubble(index)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-100 relative overflow-hidden focus:outline-none
                      ${
                      isPopped
                        ? 'bg-transparent scale-95 opacity-50 border-gray-600'
                        : 'bg-white/10 hover:bg-white/20 scale-100 cursor-pointer'
                    }`}
                    style={{
                      borderColor: isPopped ? 'gray' : cardStyle.color,
                      boxShadow: isPopped
                        ? 'inset 0 0 5px rgba(0,0,0,0.5)'
                        : '0 4px 6px rgba(0,0,0,0.3)',
                    }}
                  >
                    {!isPopped && (
                      <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-30 blur-[1px]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BubbleWrapPage;
