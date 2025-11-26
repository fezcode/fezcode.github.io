import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ClipboardIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
import piml from 'piml'; // Import the piml library
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

function JsonPimlConverterPage() {
  useSeo({
    title: 'JSON - PIML Converter | Fezcodex',
    description: 'Convert JSON to PIML and PIML to JSON with this online tool.',
    keywords: [
      'Fezcodex',
      'JSON',
      'PIML',
      'converter',
      'JSON to PIML',
      'PIML to JSON',
    ],
    ogTitle: 'JSON - PIML Converter | Fezcodex',
    ogDescription:
      'Convert JSON to PIML and PIML to JSON with this online tool.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'JSON - PIML Converter | Fezcodex',
    twitterDescription:
      'Convert JSON to PIML and PIML to JSON with this online tool.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });
  const { addToast } = useToast();

  const [jsonInput, setJsonInput] = useState('');
  const [pimlInput, setPimlInput] = useState('');
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');

  const handleJsonToPiml = () => {
    setSelectedFormat('PIML');
    try {
      const json = JSON.parse(jsonInput);
      const pimlOutput = piml.stringify(json); // Use piml.stringify
      setOutput(pimlOutput);
      setErrorMsg('');
      addToast({
        title: 'Success',
        message: 'JSON converted to PIML!',
        duration: 10000,
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: `Error ${selectedFormat}`,
        message: `Invalid JSON input: ${error.message}`,
        duration: 10000,
        type: 'error',
      });
      console.log(error.message);
      setOutput('');
      setErrorMsg(error.toString());
    }
  };

  const handlePimlToJson = () => {
    setSelectedFormat('JSON');
    try {
      const jsonOutput = piml.parse(pimlInput); // Use piml.parse
      setOutput(JSON.stringify(jsonOutput, null, 2));
      setErrorMsg('');
      addToast({
        title: 'Success',
        message: 'PIML converted to JSON!',
        duration: 10000,
      });
    } catch (error) {
      addToast({
        title: `Error ${selectedFormat}`,
        message: `Invalid PIML input: ${error.message}`,
        duration: 10000,
        type: 'error',
      });
      console.log(error.message);
      setOutput('');
      setErrorMsg(error.toString());
    }
  };

  // Removed custom convertJsonToPiml, convertPimlToJson, and parsePimlValue functions

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      addToast({
        title: 'Copied!',
        message: `${selectedFormat} object is copied to clipboard.`,
        duration: 2000,
      });
    } else {
      addToast({
        title: 'Cannot Copy',
        message: `${selectedFormat} object is cannot be clipboard.`,
        duration: 2000,
        type: 'error',
      });
    }
  };

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const buttonStyle =
    'px-6 py-2 flex items-center gap-2 text-lg font-arvo font-normal px-4 py-2 rounded-md border transition-colors duration-300 ease-in-out  bg-tb text-app border-app-alpha-50 hover:bg-app/15';

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4" >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Apps
        </Link>
          <BreadcrumbTitle title="JSON &lt;&gt; PIML Converter" slug="jpc" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden h-full w-full max-w-6xl"
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
            <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
              JSON &lt;&gt; PIML Converter
            </h1>
            <div
              className="bg-yellow-900 bg-opacity-30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <strong className="font-bold">Beware:</strong>
              <span className="block sm:inline ml-2">
                PIML is in beta. Do not forget that JSON and PIML are not
                completely compatible.
              </span>
            </div>
            <hr className="border-gray-700 mb-4" />
            <div className="relative z-10 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-arvo font-normal mb-2 text-app">
                    JSON Input
                  </h2>
                  <textarea
                    className="w-full h-64 p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Enter JSON here..."
                  ></textarea>
                  <button
                    onClick={handleJsonToPiml}
                    className={`${buttonStyle} mt-6`}
                  >
                    Convert JSON to PIML
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-arvo font-normal mb-2 text-app">
                    PIML Input
                  </h2>
                  <textarea
                    className="w-full h-64 p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                    value={pimlInput}
                    onChange={(e) => setPimlInput(e.target.value)}
                    placeholder="Enter PIML here..."
                  ></textarea>
                  <button
                    onClick={handlePimlToJson}
                    className={`${buttonStyle} mt-6`}
                  >
                    Convert PIML to JSON
                  </button>
                </div>
              </div>
              <hr className="border-gray-700 mt-8 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-arvo font-normal mb-2 text-app">
                    Output
                  </h2>
                  <textarea
                    className="w-full h-64 p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                    value={output}
                    readOnly
                    placeholder="Conversion output..."
                  ></textarea>
                  <button
                    onClick={copyToClipboard}
                    className={`${buttonStyle} mt-6`}
                  >
                    <ClipboardIcon size={24}> </ClipboardIcon>
                    Copy to Clipboard
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-arvo font-normal mb-2 text-app">
                    Error Message
                  </h2>
                  <textarea
                    className="w-full h-64 p-2 rounded-md bg-gray-800 text-white border border-gray-700"
                    value={errorMsg}
                    readOnly
                    placeholder="No error messages..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JsonPimlConverterPage;
