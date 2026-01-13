import React, { useState, useEffect } from 'react';

const statusData = [
  { symbol: "◈", message: "Debugging..." },
  { symbol: "◓", message: "Analyzing..." },
  { symbol: "✽", message: "Doodling..." },
  { symbol: "◐", message: "Thinking..." },
  { symbol: "◑", message: "Processing..." },
  { symbol: "◒", message: "Computing..." },
  { symbol: "●", message: "Synthesizing..." },
  { symbol: "◯", message: "Optimizing..." },
  { symbol: "◇", message: "Refactoring..." },
  { symbol: "◆", message: "Compiling..." },
  { symbol: "▲", message: "Iterating..." },
  { symbol: "▼", message: "Innovating..." }
];

const TypewriterHeader = ({ words = ["developers", "coders", "hackers", "builders"], prefix = "Built for" }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusIndex, setStatusIndex] = useState(7); // Default "Optimizing..."
  const [symbolIndex, setSymbolIndex] = useState(7);

  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 2000;

  useEffect(() => {
    let timeout;

    const handleTyping = () => {
      const currentFullWord = words[currentWordIndex];

      if (!isDeleting) {
        if (displayText.length < currentFullWord.length) {
          setDisplayText(currentFullWord.substring(0, displayText.length + 1));
          timeout = setTimeout(handleTyping, typingSpeed);
        } else {
          timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentFullWord.substring(0, displayText.length - 1));
          timeout = setTimeout(handleTyping, deletingSpeed);
        } else {
          setIsDeleting(false);
          const nextIndex = (currentWordIndex + 1) % words.length;
          setCurrentWordIndex(nextIndex);
          setStatusIndex(nextIndex % statusData.length);
          timeout = setTimeout(handleTyping, 500);
        }
      }
    };

    timeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex, words]);

  useEffect(() => {
    const symbolInterval = setInterval(() => {
      setSymbolIndex((prev) => (prev + 1) % statusData.length);
    }, 1000);
    return () => clearInterval(symbolInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      {/* Status Tag */}
      <div className="flex items-center space-x-2 mb-6 px-3 py-1 bg-product-card-bg/50 border border-white/5 rounded-full">
        <span className="font-mono text-product-card-icon text-sm">{statusData[symbolIndex].symbol}</span>
        <span className="font-mono text-product-body-text text-xs tracking-tight">
          {statusData[statusIndex].message}
        </span>
      </div>

      {/* Typewriter Heading */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <h1 className="text-5xl md:text-7xl font-instr-serif text-white italic tracking-tight">
          {prefix}
        </h1>
        <div className="flex items-center">
            <div className="text-product-card-icon mx-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64" fill="none" className="w-8 h-8 md:w-12 md:h-12">
                    <path d="M19.2617 9.77173C19.9088 9.07558 20.9191 8.91467 21.7314 9.31665L21.8906 9.40356L21.9355 9.43481L22.1914 9.6311C22.2037 9.64058 22.2161 9.6508 22.2275 9.66138L44.627 30.4622C45.0537 30.8586 45.2997 31.4154 45.2998 32.0002C45.2998 32.4378 45.1632 32.862 44.9141 33.2141C44.9036 33.2289 44.8919 33.2435 44.8799 33.2571L44.6611 33.5032C44.6504 33.5153 44.6388 33.5273 44.627 33.5383L22.2275 54.3381C21.3775 55.127 20.0506 55.0769 19.2617 54.2278H19.2607C18.4721 53.3777 18.5226 52.0508 19.3721 51.262L40.1182 32.0002L19.3721 12.7385C19.3602 12.7275 19.3487 12.7155 19.3379 12.7034L19.1221 12.4592C19.1105 12.4462 19.0999 12.4324 19.0898 12.4182C18.5226 11.6235 18.5712 10.5162 19.2607 9.77271L19.2617 9.77173Z" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
            </div>
            <span className="text-5xl md:text-7xl font-instr-serif text-product-card-icon italic tracking-tight min-w-[200px] text-left">
              {displayText}
              <span className="animate-pulse ml-1">|</span>
            </span>
        </div>
      </div>
    </div>
  );
};

export default TypewriterHeader;
