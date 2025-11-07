import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, UploadSimpleIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import usePageTitle from '../../utils/usePageTitle';
import { useToast } from '../../hooks/useToast';
import '../../styles/app-buttons.css';

function WordCounterPage() {
  usePageTitle('Word Counter');
  const [text, setText] = useState('');
  const [counts, setCounts] = useState({ words: 0, characters: 0, lines: 0, paragraphs: 0 });
  const { addToast } = useToast();

  const handleTextChange = (newText) => {
    setText(newText);
    const lineCount = newText.length === 0 ? 0 : newText.split('\n').length;
    const wordCount = newText.trim().split(/\s+/).filter(Boolean).length;
    const charCount = newText.length;
    const paragraphCount = newText.trim().split(/\n\s*\n/).filter(Boolean).length;
    setCounts({ words: wordCount, characters: charCount, lines: lineCount, paragraphs: paragraphCount });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleTextChange(e.target.result);
        addToast({
          title: 'Success',
          message: `File '${file.name}' loaded successfully!`,
          duration: 3000,
        });
      };
      reader.onerror = () => {
        addToast({
          title: 'Error',
          message: 'Failed to read the file!',
          duration: 3000,
        });
      };
      reader.readAsText(file);
    }
  };

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const detailTextColor = colors['app-light'];

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
          <span className="single-app-color">wc</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl"
            style={cardStyle}
          >
           <div className="absolute top-0 left-0 w-full h-full opacity-10"
                          style={{
                            backgroundImage:
                              'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '10px 10px',
                          }}
           ></div>
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Word Counter </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="w-full h-64 resize-y overflow-auto border rounded-md" style={{ borderColor: cardStyle.borderColor }}>
                <textarea
                  className="w-full h-full p-4 bg-gray-900/50 font-mono resize-none border-none focus:ring-0"
                  style={{ color: detailTextColor }}
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Type or paste your text here, or upload a file..."
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-lg font-semibold" style={{ color: cardStyle.color }}>
                  <p>Words: {counts.words}</p>
                  <p>Characters: {counts.characters}</p>
                  <p>Lines: {counts.lines}</p>
                  <p>Paragraphs: {counts.paragraphs}</p>
                </div>
                <label
                  className="flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out app-button-hover cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    color: cardStyle.color,
                    borderColor: cardStyle.borderColor,
                  }}
                >
                  <UploadSimpleIcon size={24} />
                  Upload File
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".txt,.md,.html,.js,.css" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordCounterPage;
