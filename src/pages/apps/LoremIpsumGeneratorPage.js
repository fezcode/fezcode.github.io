import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon, ArticleIcon} from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import {useToast} from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut',
  'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris',
  'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor',
  'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat',
  'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt',
  'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

const LoremIpsumGeneratorPage = () => {
  useSeo({
    title: 'Lorem Ipsum Generator | Fezcodex',
    description: 'Generate random placeholder text for your projects.',
    keywords: ['Fezcodex', 'lorem ipsum', 'text generator', 'placeholder text', 'dummy text'],
    ogTitle: 'Lorem Ipsum Generator | Fezcodex',
    ogDescription: 'Generate random placeholder text for your projects.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Lorem Ipsum Generator | Fezcodex',
    twitterDescription: 'Generate random placeholder text for your projects.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const {addToast} = useToast();
  const [paragraphs, setParagraphs] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');

  const generateText = () => {
    let text = [];
    for (let i = 0; i < paragraphs; i++) {
      const numSentences = Math.floor(Math.random() * 5) + 3; // 3 to 7 sentences
      let paragraph = [];

      for (let j = 0; j < numSentences; j++) {
        const numWords = Math.floor(Math.random() * 10) + 5; // 5 to 14 words
        let sentence = [];
        for (let k = 0; k < numWords; k++) {
          const word = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
          sentence.push(word);
        }
        // Capitalize first letter
        sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
        paragraph.push(sentence.join(' ') + '.');
      }
      text.push(paragraph.join(' '));
    }

    let finalResult = text.join('\n\n');

    if (startWithLorem) {
      const prefix = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
      // Simple check to avoid double generating if random chance made it similar
      if (!finalResult.startsWith("Lorem")) {
        finalResult = prefix + finalResult;
      }
    }

    setGeneratedText(finalResult);
  };

  // Initial generation
  React.useEffect(() => {
    generateText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
      addToast({title: 'Copied!', message: 'Text copied to clipboard.', duration: 2000});
    });
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
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24}/> Back to Apps
        </Link>
          <BreadcrumbTitle title="Lorem Ipsum Generator" slug="lorem" />
        <hr className="border-gray-700"/>
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
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app flex items-center gap-2">
                <ArticleIcon size={32}/> Lorem Ipsum Generator
              </h1>
              <hr className="border-gray-700 mb-6"/>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Paragraphs</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={paragraphs}
                    onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
                    className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-3 cursor-pointer mt-6">
                    <input
                      type="checkbox"
                      checked={startWithLorem}
                      onChange={(e) => setStartWithLorem(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded bg-black/20 border-gray-600"
                    />
                    <span>Start with "Lorem ipsum..."</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mb-6">
                <button
                  onClick={generateText}
                  className="px-6 py-2 rounded-md font-arvo font-normal border transition-colors duration-300 hover:bg-white/10"
                  style={{borderColor: cardStyle.color, color: cardStyle.color}}
                >
                  Generate
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-2 rounded-md font-arvo font-normal border transition-colors duration-300 text-blue-500 hover:bg-blue-500 hover:text-white border-blue-500"
                >
                  Copy
                </button>
              </div>

              <div
                className="bg-black/30 rounded-lg p-4 min-h-[200px] max-h-[500px] overflow-y-auto font-serif leading-relaxed whitespace-pre-wrap border border-gray-700">
                {generatedText}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoremIpsumGeneratorPage;
