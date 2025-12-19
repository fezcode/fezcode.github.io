import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimple,
  Trash,
  CloudRain,
  FloppyDisk,
  FolderOpen,
  ArrowsOutLineVerticalIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import ConfirmationModal from '../../components/ConfirmationModal';
import usePersistentState from '../../hooks/usePersistentState';

const NotepadPage = () => {
  useSeo({
    title: 'Notepad | Fezcodex',
    description: 'A simple, distraction-free notepad for your thoughts.',
    keywords: ['notepad', 'writing', 'text editor', 'simple', 'rain'],
  });

  const [text, setText] = useState('');
  const [isRainy, setIsRainy] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isFixedSize, setIsFixedSize] = usePersistentState(
    'fezcodex-notepad-fixed-size',
    true,
  ); // Default to true for fixed height
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  // Load saved text from local storage on mount
  useEffect(() => {
    const savedText = localStorage.getItem('fezcodex-notepad-content');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  // Save text to local storage whenever it changes (Autosave)
  useEffect(() => {
    localStorage.setItem('fezcodex-notepad-content', text);
  }, [text]);

  // Memoize rain drops to prevent re-calculation on every render
  const rainDrops = React.useMemo(() => {
    return [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `-${Math.random() * 20}%`,
      height: `${Math.random() * 20 + 10}%`,
      duration: `${Math.random() * 1 + 0.5}s`,
      delay: `${Math.random() * 2}s`,
    }));
  }, []);

  const handleSave = () => {
    localStorage.setItem('fezcodex-notepad-content', text);
    addToast({
      title: 'Saved',
      message: 'Note manually saved to local storage.',
      duration: 3000,
    });
  };

  const handleLoad = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target.result);
        addToast({
          title: 'Loaded',
          message: `Loaded content from ${file.name}`,
          duration: 3000,
        });
      };
      reader.readAsText(file);
    }
    // Reset input so the same file can be selected again if needed
    event.target.value = null;
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'note.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast({
      title: 'Downloaded',
      message: 'Your note has been saved.',
      duration: 3000,
    });
  };

  const handleClear = () => {
    setIsClearModalOpen(true);
  };

  const confirmClear = () => {
    setText('');
    setIsClearModalOpen(false);
    addToast({ title: 'Cleared', message: 'Notepad cleared.', duration: 3000 });
  };

  const toggleRain = () => {
    setIsRainy(!isRainy);
    addToast({
      title: isRainy ? 'Sunlight' : 'Rainy Mood',
      message: isRainy ? 'Rain effect disabled.' : 'Rain effect enabled.',
      duration: 2000,
    });
  };

  const toggleFixedSize = () => {
    setIsFixedSize((prev) => !prev);
    addToast({
      title: isFixedSize ? 'Expanded' : 'Fixed Height',
      message: isFixedSize
        ? 'Notepad expanded to fill space.'
        : 'Notepad height is now fixed.',
      duration: 2000,
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${isRainy ? 'bg-gray-900' : 'bg-[#fdfbf7]'}`}
    >
      {/* Rain Effect Overlay */}
      {isRainy && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80"></div>
          {/* Simple CSS Rain */}
          {rainDrops.map((drop, i) => (
            <div
              key={i}
              className="absolute w-px bg-blue-400/30 animate-rain"
              style={{
                left: drop.left,
                top: drop.top,
                height: drop.height,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
              }}
            />
          ))}
        </div>
      )}

      <input
        type="file"
        accept=".txt"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col relative z-10 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6 relative">
          <Link
            to="/apps"
            className={`flex items-center gap-2 hover:underline ${isRainy ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeftIcon /> Back to Apps
          </Link>
          <h1
            className={`absolute left-1/2 -translate-x-1/2 text-2xl font-playfairDisplay font-bold tracking-wide ${isRainy ? 'text-gray-200' : 'text-amber-950'}`}
          >
            Notepad
          </h1>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleSave}
              className={`p-2 rounded-full transition-colors ${isRainy ? 'text-cyan-400 hover:bg-cyan-900/30' : 'text-cyan-600 hover:bg-cyan-100'}`}
              title="Save to Local Storage"
            >
              <FloppyDisk size={20} />
            </button>
            <button
              onClick={handleLoad}
              className={`p-2 rounded-full transition-colors ${isRainy ? 'text-amber-400 hover:bg-amber-900/30' : 'text-amber-600 hover:bg-amber-100'}`}
              title="Load from Text File"
            >
              <FolderOpen size={20} />
            </button>
            <button
              onClick={toggleFixedSize}
              className={`p-2 rounded-full transition-colors ${isFixedSize ? 'text-gray-500 hover:bg-gray-200' : 'text-blue-300 bg-blue-900/30 hover:bg-blue-900/50'}`}
              title={isFixedSize ? 'Expand Notepad' : 'Fix Notepad Height'}
            >
              {isFixedSize ? (
                <ArrowsOutLineVerticalIcon size={20} />
              ) : (
                <ArrowsOutLineVerticalIcon size={20} />
              )}
            </button>
            <button
              onClick={toggleRain}
              className={`p-2 rounded-full transition-colors ${isRainy ? 'text-blue-300 bg-blue-900/30 hover:bg-blue-900/50' : 'text-gray-500 hover:bg-gray-200'}`}
              title="Toggle Rain"
            >
              <CloudRain size={20} weight={isRainy ? 'fill' : 'regular'} />
            </button>
            <button
              onClick={handleClear}
              className={`p-2 rounded-full transition-colors ${isRainy ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-100'}`}
              title="Clear Text"
            >
              <Trash size={20} />
            </button>
            <button
              onClick={handleDownload}
              className={`p-2 rounded-full transition-colors ${isRainy ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-100'}`}
              title="Download Text"
            >
              <DownloadSimple size={20} />
            </button>
          </div>
        </div>

        {/* Notepad Area */}
        <div
          className={`${isFixedSize ? 'h-[80vh]' : 'flex-grow'} rounded-lg shadow-lg relative overflow-hidden flex flex-col transition-all duration-500 ${isRainy ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
        >
          {/* Paper Lines Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage: `linear-gradient(${isRainy ? '#374151' : '#e5e7eb'} 1px, transparent 1px)`,
              backgroundSize: '100% 2rem',
              marginTop: '2rem', // Offset for top padding
            }}
          ></div>

          {/* Red Margin Line */}
          <div
            className={`absolute top-0 bottom-0 left-12 w-px ${isRainy ? 'bg-red-900/50' : 'bg-red-200'} pointer-events-none`}
          ></div>

          <textarea
            ref={textareaRef}
            rows={1}
            className={`w-full p-8 pl-16 text-lg font-mono leading-8 bg-transparent border-none resize-none focus:ring-0 focus:outline-none relative z-10 min-h-0 flex-1 ${isRainy ? 'text-gray-300 placeholder-gray-600' : 'text-gray-800 placeholder-gray-400'}`}
            placeholder="Start typing..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck="false"
          />
        </div>

        <div
          className={`mt-2 text-right text-sm font-mono ${isRainy ? 'text-gray-500' : 'text-gray-400'}`}
        >
          {text.length} chars |{' '}
          {text.split(/\s+/).filter((w) => w.length > 0).length} words
        </div>
      </div>

      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={confirmClear}
        title="Clear Notepad"
        message="Are you sure you want to clear your note? This action cannot be undone."
        confirmText="Clear"
        isDanger={true}
      />

      <style>{`
            @keyframes rain {
                0% { transform: translateY(0); }
                100% { transform: translateY(100vh); }
            }
            .animate-rain {
                animation-name: rain;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        `}</style>
    </div>
  );
};

export default NotepadPage;
