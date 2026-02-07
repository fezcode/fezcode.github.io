import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UploadSimpleIcon,
  ArrowRightIcon,
  ShuffleIcon,
  ArrowCounterClockwiseIcon,
  CardsIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import LuxeArt from '../../components/LuxeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import { motion } from 'framer-motion';

function CsvFlashcardsPage() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      addToast({
        title: 'Invalid File',
        message: 'Please upload a valid CSV file.',
        type: 'error',
      });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      parseCSV(text);
    };

    reader.readAsText(file);
  };

  const parseCSV = (text) => {
    try {
      // Basic CSV parser
      const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
      if (lines.length < 1) {
        throw new Error('File is empty');
      }

      const parsedCards = lines
        .map((line, index) => {
          // Handle basic comma separation, respecting quotes could be added here if needed
          // For now, simple split, assuming no commas in content or handle simple cases
          const parts = line.split(',');

          // If we have more than 2 parts, join the rest for the answer or question?
          // Let's assume Col 1 = Question, Col 2 = Answer.
          if (parts.length < 2) return null;

          const question = parts[0].trim();
          const answer = parts.slice(1).join(',').trim(); // Re-join rest in case answer had commas

          return { id: index, question, answer };
        })
        .filter((card) => card !== null);

      if (parsedCards.length === 0) {
        throw new Error('No valid cards found');
      }

      setCards(parsedCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      addToast({
        title: 'Success',
        message: `Loaded ${parsedCards.length} cards.`,
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Error',
        message: 'Failed to parse CSV. Ensure format is: Question,Answer',
        type: 'error',
      });
      setCards([]);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 300);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 300);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    addToast({
      title: 'Shuffled',
      message: 'Deck shuffled.',
      duration: 2000,
    });
  };

  const handleReset = () => {
    setCards([]);
    setFileName('');
    setCurrentIndex(0);
    setIsFlipped(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans">
      <Seo
        title="CSV Flashcards | Fezcodex"
        description="Study tool. Load custom flashcards via CSV."
        keywords={['Fezcodex', 'Flashcards', 'CSV', 'Study', 'Memory']}
      />
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-12">
        <header className="mb-12">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle
                title="Flashcard Forge"
                slug="csv-deck"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Memory retention protocol. Upload structured CSV data
                (Question,Answer) to initiate a recall session.
              </p>
            </div>
          </div>
        </header>

        {cards.length === 0 ? (
          <div
            className="border border-dashed border-white/20 bg-white/[0.02] rounded-sm p-12 text-center hover:bg-white/[0.04] transition-colors group cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-indigo-500/10 rounded-full group-hover:bg-indigo-500/20 transition-colors">
                <UploadSimpleIcon size={48} className="text-indigo-400" />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">Upload CSV Deck</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Drag and drop or click to select a file. <br />
              Format:{' '}
              <span className="font-mono text-indigo-300">
                Question,Answer
              </span>{' '}
              (No header required)
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Controls Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
                <CardsIcon size={20} />
                <span>{fileName}</span>
                <span className="w-px h-4 bg-white/10" />
                <span className="text-white">
                  Card {currentIndex + 1}{' '}
                  <span className="text-gray-600">/</span> {cards.length}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShuffle}
                  className="p-2 hover:bg-white/10 rounded-sm text-gray-400 hover:text-white transition-colors"
                  title="Shuffle Deck"
                >
                  <ShuffleIcon size={20} />
                </button>{' '}
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-red-500/10 rounded-sm text-gray-400 hover:text-red-400 transition-colors"
                  title="Unload Deck"
                >
                  <ArrowCounterClockwiseIcon size={20} />
                </button>
              </div>
            </div>

            {/* Card Area */}
            <div
              className="w-full aspect-[3/2] md:aspect-[2/1] relative cursor-pointer group"
              onClick={handleFlip}
              style={{ perspective: '1000px' }}
            >
              <motion.div
                className="w-full h-full relative preserve-3d transition-transform duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 bg-black border border-white/10 flex flex-col items-center justify-center p-8 md:p-16 text-center select-none shadow-2xl overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg) translateZ(1px)',
                  }}
                >
                  {' '}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <GenerativeArt
                      seed={`card-${currentIndex}-front`}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-widest text-indigo-400">
                    Query
                  </div>
                  <h2 className="text-2xl md:text-4xl font-light leading-tight relative z-10">
                    {cards[currentIndex]?.question}
                  </h2>
                  <div className="absolute bottom-6 text-xs text-gray-600 font-mono animate-pulse">
                    Click to Reveal
                  </div>
                </div>

                {/* Back */}

                <div
                  className="absolute inset-0 bg-white text-black flex flex-col items-center justify-center p-8 md:p-16 text-center select-none shadow-2xl overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/20"
                  style={{
                    transform: 'rotateY(180deg) translateZ(1px)',
                    backfaceVisibility: 'hidden',
                    backgroundColor: 'white',
                  }}
                >
                  <div className="absolute inset-0 opacity-60 pointer-events-none">
                    <LuxeArt
                      seed={`card-${currentIndex}-back`}
                      colorful={true}
                      className="w-full h-full mix-blend-multiply"
                    />
                  </div>

                  <div className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-bold">
                    Response
                  </div>

                  <h2 className="text-2xl md:text-4xl font-bold leading-tight relative z-10">
                    {cards[currentIndex]?.answer}
                  </h2>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handlePrev}
                className="flex items-center justify-center gap-3 p-4 border border-white/10 hover:bg-white/5 transition-all active:scale-[0.98] group"
              >
                <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono uppercase tracking-widest text-sm">
                  Previous
                </span>
              </button>
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-3 p-4 bg-white text-black hover:bg-indigo-400 transition-all active:scale-[0.98] group"
              >
                <span className="font-mono uppercase tracking-widest text-sm font-bold">
                  Next
                </span>
                <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CsvFlashcardsPage;
