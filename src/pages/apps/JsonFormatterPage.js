import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CopySimple } from '@phosphor-icons/react';
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
import useSeo from "../../hooks/useSeo";

const JsonFormatterPage = () => {
  useSeo({
    title: 'JSON Formatter & Validator | Fezcodex',
    description: 'Format and validate your JSON data with this online tool. Ensures proper syntax and readability.',
    keywords: ['Fezcodex', 'JSON formatter', 'JSON validator', 'JSON beautifier', 'JSON tool'],
    ogTitle: 'JSON Formatter & Validator | Fezcodex',
    ogDescription: 'Format and validate your JSON data with this online tool. Ensures proper syntax and readability.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'JSON Formatter & Validator | Fezcodex',
    twitterDescription: 'Format and validate your JSON data with this online tool. Ensures proper syntax and readability.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });

  const { addToast } = useToast();

  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const textareaStyle = `mt-1 block w-full p-3 border rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 border-gray-600 font-mono text-sm`;
  const buttonStyle = `px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out roll-button`;

  const formatJson = useCallback(() => {
    setValidationMessage('');
    if (!jsonInput.trim()) {
      setJsonOutput('');
      addToast({ title: 'Input Empty', message: 'Please enter JSON to format.', duration: 3000, type: 'info' });
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2)); // Pretty print with 2 spaces
      addToast({ title: 'Formatted', message: 'JSON formatted successfully.', duration: 2000 });
    } catch (error) {
      setJsonOutput('');
      setValidationMessage(`Invalid JSON: ${error.message}`);
      addToast({ title: 'Error', message: 'Invalid JSON input.', duration: 3000, type: 'error' });
    }
  }, [jsonInput, addToast]);

  const validateJson = useCallback(() => {
    setJsonOutput('');
    if (!jsonInput.trim()) {
      setValidationMessage('Please enter JSON to validate.');
      addToast({ title: 'Input Empty', message: 'Please enter JSON to validate.', duration: 3000, type: 'info' });
      return;
    }
    try {
      JSON.parse(jsonInput);
      setValidationMessage('Valid JSON!');
      addToast({ title: 'Valid', message: 'JSON is valid.', duration: 2000 });
    } catch (error) {
      setValidationMessage(`Invalid JSON: ${error.message}`);
      addToast({ title: 'Error', message: 'Invalid JSON input.', duration: 3000, type: 'error' });
    }
  }, [jsonInput, addToast]);

  const copyToClipboard = useCallback(() => {
    const textToCopy = jsonOutput || jsonInput; // Copy formatted if available, else raw input
    if (textToCopy.trim()) {
      navigator.clipboard.writeText(textToCopy);
      addToast({ title: 'Copied!', message: 'Content copied to clipboard.', duration: 2000 });
    } else {
      addToast({ title: 'Cannot Copy', message: 'No content to copy.', duration: 2000, type: 'error' });
    }
  }, [jsonInput, jsonOutput, addToast]);

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
          <span className="single-app-color">jf</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-4xl"
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
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> JSON Formatter & Validator </h1>
              <hr className="border-gray-700 mb-4" />

              {/* Client-Side Notification */}
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Client-Side Only:</strong>
                <span className="block sm:inline ml-2">This tool operates entirely within your browser. No JSON data is sent to any server, ensuring maximum privacy.</span>
              </div>

              <div className="mb-6">
                <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-300 mb-2">
                  JSON Input
                </label>
                <textarea
                  id="jsonInput"
                  rows="10"
                  className={textareaStyle}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='Enter your JSON here, e.g., {"name": "John Doe", "age": 30}'
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={formatJson}
                  className={`${buttonStyle} w-full sm:w-1/2`}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    color: cardStyle.color,
                    borderColor: cardStyle.borderColor,
                    border: '1px solid',
                  }}
                >
                  Format JSON
                </button>
                <button
                  onClick={validateJson}
                  className={`${buttonStyle} w-full sm:w-1/2`}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    color: cardStyle.color,
                    borderColor: cardStyle.borderColor,
                    border: '1px solid',
                  }}
                >
                  Validate JSON
                </button>
              </div>

              {validationMessage && (
                <div className={`px-4 py-3 rounded relative mb-6 ${validationMessage.startsWith('Valid') ? 'bg-green-900 bg-opacity-30 border border-green-700 text-green-300' : 'bg-red-900 bg-opacity-30 border border-red-700 text-red-300'}`} role="alert">
                  {validationMessage}
                </div>
              )}

              {jsonOutput && (
                <div className="mb-6">
                  <label htmlFor="jsonOutput" className="block text-sm font-medium text-gray-300 mb-2">
                    Formatted JSON
                  </label>
                  <div className="flex">
                    <textarea
                      id="jsonOutput"
                      rows="10"
                      className={`${textareaStyle} flex-grow`}
                      value={jsonOutput}
                      readOnly
                    ></textarea>
                    <button
                      onClick={copyToClipboard}
                      className="ml-2 px-4 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out roll-button flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        color: cardStyle.color,
                        borderColor: cardStyle.borderColor,
                        border: '1px solid',
                      }}
                      title="Copy to Clipboard"
                    >
                      <CopySimple size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatterPage;
