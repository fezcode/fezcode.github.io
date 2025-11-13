import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
import useSeo from "../../hooks/useSeo";

function CaseConverterPage() {
  useSeo({
    title: 'Case Converter | Fezcodex',
    description: 'Convert text to various cases like uppercase, lowercase, title case, camel case, snake case, and kebab case.',
    keywords: ['Fezcodex', 'case converter', 'uppercase', 'lowercase', 'title case', 'camel case', 'snake case', 'kebab case'],
    ogTitle: 'Case Converter | Fezcodex',
    ogDescription: 'Convert text to various cases like uppercase, lowercase, title case, camel case, snake case, and kebab case.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Case Converter | Fezcodex',
    twitterDescription: 'Convert text to various cases like uppercase, lowercase, title case, camel case, snake case, and kebab case.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });
  const [inputText, setInputText] = useState('');
  const { addToast } = useToast();

  const convertToUpperCase = () => inputText.toUpperCase();
  const convertToLowerCase = () => inputText.toLowerCase();
  const convertToTitleCase = () => inputText.replace(/\b\w/g, char => char.toUpperCase());
  const convertToCamelCase = () => inputText.replace(/(?:^|\s)([a-zA-Z])/g, (_, char) => char.toUpperCase()).replace(/\s+/g, '');
  const convertToSnakeCase = () => inputText.toLowerCase().replace(/\s+/g, '_');
  const convertToKebabCase = () => inputText.toLowerCase().replace(/\s+/g, '-');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        addToast({
          title: 'Success',
          message: 'Copied to clipboard!',
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
          <span className="single-app-color">cc</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
                      <div
                        className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl"
                        style={cardStyle}
                      >
                        <div
                          className="absolute top-0 left-0 w-full h-full opacity-10"
                          style={{
                            backgroundImage:
                              'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '10px 10px',
                          }}
                        ></div>            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Case Converter </h1>
              <hr className="border-gray-700 mb-4" />
              <div className="w-full h-48 resize-y overflow-auto border rounded-md" style={{ borderColor: cardStyle.borderColor }}>
                <textarea
                  className="w-full h-full p-4 bg-gray-900/50 font-mono resize-none border-none focus:ring-0"
                  style={{ color: detailTextColor }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text here..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <CaseOutput title="Uppercase" value={convertToUpperCase()} onCopy={copyToClipboard} detailTextColor={detailTextColor} />
                <CaseOutput title="Lowercase" value={convertToLowerCase()} onCopy={copyToClipboard} detailTextColor={detailTextColor} />
                <CaseOutput title="Title Case" value={convertToTitleCase()} onCopy={copyToClipboard} detailTextColor={detailTextColor} />
                <CaseOutput title="Camel Case" value={convertToCamelCase()} onCopy={copyToClipboard} detailTextColor={detailTextColor} />
                <CaseOutput title="Snake Case" value={convertToSnakeCase()} onCopy={copyToClipboard} detailTextColor={detailTextColor} />
                <CaseOutput title="Kebab Case" value={convertToKebabCase()} onCopy={copyToClipboard} detailTextColor={detailTextColor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CaseOutput = ({ title, value, onCopy, detailTextColor }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-400 mb-1">{title}</label>
    <div className="relative">
      <textarea
        readOnly
        value={value}
        className="w-full p-2 border rounded-md bg-gray-800/50 font-mono text-sm resize-none"
        style={{ borderColor: colors['app-alpha-50'], color: detailTextColor }}
        rows="3"
      />
      <button
        onClick={() => onCopy(value)}
        className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
      >
        Copy
      </button>
    </div>
  </div>
);

export default CaseConverterPage;
