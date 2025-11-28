import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, KeyboardIcon } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const sampleTexts = [
  'The quick brown fox jumps over the lazy dog.',
  'Never underestimate the power of a good book.',
  'Coding is like poetry; it should be beautiful and efficient.',
  'The early bird catches the worm, but the second mouse gets the cheese.',
  'Innovation distinguishes between a leader and a follower.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts.',
];

function KeyboardTypingSpeedTesterPage() {
  const appName = 'FezType'; // Renamed as per user's request
  const appSlug = 'feztype'; // Corresponding slug

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Test and improve your typing speed with FezType.',
    keywords: [
      'Fezcodex',
      'typing test',
      'wpm',
      'typing speed',
      'keyboard',
      'games',
    ],
    ogTitle: `${appName} | Fezcodex`,
    ogDescription: 'Test and improve your typing speed with FezType.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: `${appName} | Fezcodex`,
    twitterDescription: 'Test and improve your typing speed with FezType.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [textToType, setTextToType] = useState('');
  const [typedText, setTypedText] = useState('');
  const [timer, setTimer] = useState(60); // 60 seconds for the test
  const [timerActive, setTimerActive] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [mistakes, setMistakes] = useState(0); // Re-added this line
  // New states for cumulative tracking
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [textsCompletedCount, setTextsCompletedCount] = useState(0);

  const inputRef = useRef(null);

  const selectNewText = useCallback((currentText) => {
    // Takes currentText as argument
    let newRandomIndex;
    let newText;
    do {
      newRandomIndex = Math.floor(Math.random() * sampleTexts.length);
      newText = sampleTexts[newRandomIndex];
    } while (newText === currentText);

    return newText;
  }, []); // No dependencies

  useEffect(() => {
    setTextToType(selectNewText('')); // Initial text selection on mount, no previous text
  }, [selectNewText]);

  const calculateResults = useCallback(() => {
    // Overall WPM: (Total correct characters / 5) / Total time elapsed
    const timeElapsedMinutes = (60 - timer) / 60; // Total time elapsed (fixed at 60s for now)
    const calculatedWpm =
      timeElapsedMinutes === 0 ? 0 : totalCorrectChars / 5 / timeElapsedMinutes;
    // Overall Accuracy: (Total correct characters / Total typed characters) * 100
    const calculatedAccuracy =
      totalTypedChars === 0 ? 0 : (totalCorrectChars / totalTypedChars) * 100;

    setWpm(Math.round(calculatedWpm));
    setAccuracy(calculatedAccuracy.toFixed(2));
  }, [totalCorrectChars, totalTypedChars, timer]); // Dependencies for overall calculation

  useEffect(() => {
    let interval = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && timerActive) {
      setTimerActive(false);
      setTestCompleted(true);
      calculateResults();
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, calculateResults]);

  const handleInputChange = (event) => {
    if (testCompleted) return; // Prevent typing after test is completed

    if (!testStarted) {
      setTestStarted(true);
      setTimerActive(true);
    }

    const newTypedText = event.target.value;

    // Update segment-specific mistake tracking (used for rendering visual feedback)
    let currentSegmentMistakes = 0;
    for (let i = 0; i < newTypedText.length; i++) {
      if (i >= textToType.length || newTypedText[i] !== textToType[i]) {
        currentSegmentMistakes++;
      }
    }
    // Note: this 'mistakes' state is only for current visual feedback, not cumulative
    // The cumulative totalMistakes will be updated when a segment is completed.
    setMistakes(currentSegmentMistakes);
    setTypedText(newTypedText);

    // If typed text length matches the text to type length, process segment completion
    if (newTypedText.length === textToType.length) {
      // Calculate results for the just-completed text segment
      let segmentCorrectChars = 0;
      for (let i = 0; i < textToType.length; i++) {
        if (newTypedText[i] === textToType[i]) {
          segmentCorrectChars++;
        }
      }

      // Update cumulative stats
      setTotalCorrectChars((prev) => prev + segmentCorrectChars);
      setTotalTypedChars((prev) => prev + textToType.length);
      setTotalMistakes(
        (prev) => prev + (textToType.length - segmentCorrectChars),
      );
      setTextsCompletedCount((prev) => prev + 1);

      // Immediately select new text and clear typed input for the next segment
      setTextToType((prevText) => selectNewText(prevText));
      setTypedText(''); // Clear typed input for the new segment
      setMistakes(0); // Reset segment mistakes for the new text
      return; // Exit handleInputChange as this segment is complete
    }
  };

  const resetTest = () => {
    setTestCompleted(false);
    setTestStarted(false);
    setTimerActive(false);
    setTimer(60);
    setWpm(0);
    setAccuracy(0);
    setTotalCorrectChars(0);
    setTotalTypedChars(0);
    setTotalMistakes(0);
    setTextsCompletedCount(0);
    setTextToType((prevText) => {
      return selectNewText(prevText);
    });
    setTypedText('');
    setMistakes(0); // Reset segment mistakes for the new test
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderTextToType = () => {
    return textToType.split('').map((char, index) => {
      let colorClass = 'text-gray-400'; // Default color for untyped characters
      let extraClass = '';

      if (index < typedText.length) {
        // Character has been typed
        if (char === typedText[index]) {
          // Correct character
          if (char === ' ') {
            extraClass = 'bg-green-700 bg-opacity-30 rounded-sm'; // Subtle green for correct space
          } else {
            colorClass = 'text-green-400';
          }
        } else {
          // Incorrect character
          if (char === ' ') {
            extraClass = 'bg-red-700 bg-opacity-30 rounded-sm'; // Subtle red for incorrect space
          } else {
            colorClass = 'text-red-400';
          }
        }
      } else if (index === typedText.length && !testCompleted) {
        // This is the character the user is currently supposed to type
        colorClass = 'text-yellow-400 font-bold'; // Highlight next character to type
      }

      // Add a visual indicator for the cursor if it's at the current typing position
      const isCursorPosition = index === typedText.length && !testCompleted;

      return (
        <span
          key={index}
          className={`${colorClass} ${extraClass} ${isCursorPosition ? 'border-b-2 border-yellow-400' : ''}`}
        >
          {char === ' ' ? '\u00A0' : char}{' '}
          {/* Use non-breaking space for visual representation of space */}
        </span>
      );
    });
  };
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
        <BreadcrumbTitle title={appName} slug={appSlug} />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div className="bg-app-alpha-10 border-app-alpha-50 text-app group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl">
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
                <KeyboardIcon size={32} className="inline-block mr-2" />{' '}
                {appName}
              </h1>
              <hr className="border-gray-700 mb-4" />

              {!testCompleted ? (
                <>
                  <div className="text-xl font-mono p-4 mb-4 border border-app-alpha-50 rounded-md bg-gray-900/50 min-h-[100px] flex flex-wrap content-start">
                    {renderTextToType()}
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full p-4 mb-4 bg-gray-800 border border-app-alpha-50 rounded-md focus:ring-0 text-app-light font-mono"
                    value={typedText}
                    onChange={handleInputChange}
                    placeholder="Start typing here..."
                    disabled={timer === 0 && testStarted}
                    autoFocus
                  />
                  <div className="font-mono flex justify-between items-center text-lg text-app">
                    <span>Time: {timer}s</span>
                    <span>Mistakes: {totalMistakes}</span>
                    <button
                      onClick={resetTest}
                      className="font-mono px-4 py-2 border border-white bg-black/50 hover:bg-white/50 hover:text-black hover:border-black rounded text-white  transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center font-mono">
                  <h2 className="text-4xl font-arvo mb-4 mt-6 text-green-400">
                    Test Complete!
                  </h2>
                  <p className="text-2xl mb-2">
                    WPM: <span className="font-bold text-app">{wpm}</span>
                  </p>
                  <p className="text-2xl mb-4">
                    Accuracy:{' '}
                    <span className="font-bold text-app">{accuracy}%</span>
                  </p>
                  <button
                    onClick={resetTest}
                    className="px-6 py-3 border border-white bg-black/50 hover:bg-white/50 hover:text-black hover:border-black rounded text-white text-xl transition-colors"
                  >
                    Try Again
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

export default KeyboardTypingSpeedTesterPage;
