import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import { diff_match_patch } from 'diff-match-patch';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const dmp = new diff_match_patch();

function TextDiffCheckerPage() {
  useSeo({
    title: 'Text Diff Checker | Fezcodex',
    description:
      'Compare two texts and highlight the differences (additions, deletions, changes).',
    keywords: [
      'Fezcodex',
      'text diff',
      'diff checker',
      'text comparison',
      'code diff',
    ],
    ogTitle: 'Text Diff Checker | Fezcodex',
    ogDescription:
      'Compare two texts and highlight the differences (additions, deletions, changes).',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Text Diff Checker | Fezcodex',
    twitterDescription:
      'Compare two texts and highlight the differences (additions, deletions, changes).',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diffOutput, setDiffOutput] = useState([]);

  const computeDiff = useCallback(() => {
    if (!textA && !textB) {
      setDiffOutput([]);
      return;
    }

    const diffs = dmp.diff_main(textA, textB);
    dmp.diff_cleanupSemantic(diffs); // Optional: improve human readability
    setDiffOutput(diffs);
  }, [textA, textB]);

  useEffect(() => {
    // Automatically compute diff when texts change
    computeDiff();
  }, [textA, textB, computeDiff]);

  const renderDiff = () => {
    return diffOutput.map((part, i) => {
      const [type, text] = part;
      let style = {};
      switch (type) {
        case DIFF_INSERT:
          style = { backgroundColor: '#aaffaa', color: '#000' }; // Green for additions
          break;
        case DIFF_DELETE:
          style = {
            backgroundColor: '#ffaaaa',
            color: '#000',
            textDecoration: 'line-through',
          }; // Red for deletions
          break;
        case DIFF_EQUAL:
        default:
          style = { color: colors['app-light'] }; // Default for unchanged
          break;
      }
      return (
        <span key={i} style={style}>
          {text.split('\n').map((item, key) => {
            return (
              <React.Fragment key={key}>
                {item}
                {key < text.split('\n').length - 1 && <br />}
              </React.Fragment>
            );
          })}
        </span>
      );
    });
  };

  const DIFF_DELETE = -1;
  const DIFF_INSERT = 1;
  const DIFF_EQUAL = 0;

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const textareaStyle = `w-full h-48 p-4 bg-gray-900/50 font-mono resize-y border rounded-md border-app-alpha-50 text-app-light focus:ring-0`;

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
          <BreadcrumbTitle title="Text Diff Checker" slug="tdc" />
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
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
                {' '}
                Text Diff Checker{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="textA"
                    className="block text-lg font-semibold mb-2 text-app"
                  >
                    Original Text (A)
                  </label>
                  <textarea
                    id="textA"
                    value={textA}
                    onChange={(e) => setTextA(e.target.value)}
                    placeholder="Enter original text here..."
                    className={textareaStyle}
                  />
                </div>
                <div>
                  <label
                    htmlFor="textB"
                    className="block text-lg font-semibold mb-2 text-app"
                  >
                    New Text (B)
                  </label>
                  <textarea
                    id="textB"
                    value={textB}
                    onChange={(e) => setTextB(e.target.value)}
                    placeholder="Enter new text here..."
                    className={textareaStyle}
                  />
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <button
                  onClick={computeDiff}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out border bg-tb text-app border-app-alpha-50 hover:bg-app/15"
                >
                  Compare Texts
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-lg font-semibold mb-2 text-app">
                  Differences
                </label>
                <div
                  className="w-full p-4 bg-gray-800/50 font-mono resize-y border rounded-md border-app-alpha-50 text-app-light overflow-auto"
                  style={{ minHeight: '100px' }}
                >
                  {diffOutput.length > 0 ? (
                    renderDiff()
                  ) : (
                    <p className="text-gray-500">
                      No differences or empty input.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextDiffCheckerPage;
