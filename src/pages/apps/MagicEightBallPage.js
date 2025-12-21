import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, Question } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import colors from '../../config/colors';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const magicEightBallAnswers = [
  // Positive
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes, definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  // Neutral
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  // Negative
  "Don't count on it.",
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.',
];

function MagicEightBallPage() {
  useSeo({
    title: 'Magic 8-Ball | Fezcodex',
    description:
      'Ask a yes/no question and let the Magic 8-Ball reveal your fate!',
    keywords: [
      'Fezcodex',
      'magic 8-ball',
      'decision maker',
      'fun app',
      'random answer',
    ],
    ogTitle: 'Magic 8-Ball | Fezcodex',
    ogDescription:
      'Ask the Magic 8-Ball any question and get your cosmic answer.',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Magic 8-Ball | Fezcodex',
    twitterDescription:
      'Ask the Magic 8-Ball any question and get your cosmic answer.',
  });

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('Ask the 8-Ball a question!');
  const [isShaking, setIsShaking] = useState(false);

  const askEightBall = () => {
    if (!question.trim()) {
      setAnswer('Please ask a question first!');
      return;
    }

    setIsShaking(true);
    setAnswer('Thinking...'); // Show thinking state

    setTimeout(() => {
      const randomIndex = Math.floor(
        Math.random() * magicEightBallAnswers.length,
      );
      setAnswer(magicEightBallAnswers[randomIndex]);
      setIsShaking(false);
    }, 1500); // Simulate a shake/think time
  };

  const buttonStyle = `px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out border bg-tb text-app border-app-alpha-50 hover:bg-app/15`;

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
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Magic 8-Ball" slug="8ball" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden h-full w-full max-w-md"
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
                Magic 8-Ball{' '}
              </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="mb-6">
                <label
                  htmlFor="question-input"
                  className="block text-lg font-semibold mb-2 text-app"
                >
                  Your Question:
                </label>
                <input
                  id="question-input"
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Will I become a millionaire?"
                  className="mt-1 block w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      askEightBall();
                    }
                  }}
                />
              </div>

              <div
                className={`flex flex-col items-center justify-center mb-6 p-4 bg-gray-800/50 rounded-md min-h-[120px] transition-all duration-300 ${isShaking ? 'animate-shake' : ''}`}
              >
                <p className="text-2xl text-center font-bold text-app-light">
                  {answer}
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={askEightBall}
                  className={`${buttonStyle} flex items-center gap-2`}
                  disabled={isShaking}
                >
                  <Question size={24} /> Ask the 8-Ball
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MagicEightBallPage;
