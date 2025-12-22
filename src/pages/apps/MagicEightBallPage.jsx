import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowLeftIcon,
  QuestionIcon,
  ArrowsClockwiseIcon,
  AtomIcon,
  TargetIcon,
  EyeIcon,
} from '@phosphor-icons/react';
import {motion, AnimatePresence} from 'framer-motion';
import useSeo from '../../hooks/useSeo';
import {ToastContext} from '../../context/ToastContext';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import GenerativeArt from '../../components/GenerativeArt';

const magicEightBallAnswers = [
  'IT_IS_CERTAIN',
  'DECIDEDLY_SO',
  'WITHOUT_A_DOUBT',
  'YES_DEFINITELY',
  'RELY_ON_IT',
  'AS_I_SEE_IT_YES',
  'MOST_LIKELY',
  'OUTLOOK_GOOD',
  'YES',
  'SIGNS_POINT_TO_YES',
  'REPLY_HAZY_RETRY',
  'ASK_AGAIN_LATER',
  'BETTER_NOT_TELL',
  'CANNOT_PREDICT',
  'CONCENTRATE_ASK',
  'DONT_COUNT_ON_IT',
  'MY_REPLY_IS_NO',
  'SOURCES_SAY_NO',
  'OUTLOOK_NOT_GOOD',
  'VERY_DOUBTFUL',
];

const MagicEightBallPage = () => {
  const appName = 'Magic 8-Ball';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Ask a yes/no question and let the Magic 8-Ball reveal your fate in this high-tech adaptation.',
    keywords: ['Fezcodex', 'magic 8-ball', 'decision maker', 'fun app', 'random answer', 'brutalist'],
  });

  const {addToast} = useContext(ToastContext);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('AWAITING_QUERY...');
  const [isShaking, setIsShaking] = useState(false);

  const askEightBall = () => {
    if (!question.trim()) {
      addToast({message: 'INPUT_REQUIRED: Question field is null.', type: 'error'});
      setAnswer('QUERY_FIELD_EMPTY');
      return;
    }

    setIsShaking(true);
    setAnswer('PROCESSING_PROBABILITY...');

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * magicEightBallAnswers.length);
      setAnswer(magicEightBallAnswers[randomIndex]);
      setIsShaking(false);
      addToast({message: 'PROBABILITY_MAP_SYNCED', type: 'info'});
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold"/>
            <span>Applications</span>
          </Link>
          <BreadcrumbTitle title={appName} slug="8ball" variant="brutalist" />

          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Probability assessment engine. Formulate a boolean query to{' '}
                <span className="text-emerald-400 font-bold">extract</span> a cosmic response.
              </p>
            </div>

            <div className="flex gap-12 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Process_ID
                </span>
                <span className="text-3xl font-black text-emerald-500">8B_CORE</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Status
                </span>
                <span className={`text-3xl font-black ${isShaking ? 'text-white' : 'text-emerald-500'}`}>
                  {isShaking ? 'CALCULATING' : 'READY'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Interface Column */}
          <div className="lg:col-span-5 space-y-8">
            <div
              className="relative border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName} className="w-full h-full"/>
              </div>
              <div
                className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500"/>

              <h3
                className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-12 flex items-center gap-2">
                <TargetIcon weight="fill"/>
                Query_Input
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Formulate_Question
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askEightBall()}
                    className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl font-mono text-white focus:border-emerald-500 focus:outline-none transition-colors uppercase"
                    placeholder="ENTER_QUERY..."
                  />
                </div>

                <button
                  onClick={askEightBall}
                  disabled={isShaking}
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-3"
                >
                  <QuestionIcon weight="bold" size={18}/>
                  Execute_Extraction
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <AtomIcon size={20} weight="bold"/>
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">
                  Engine_Core
                </h4>
              </div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider leading-relaxed">
                The extraction process utilizes a pseudo-random seed to interface with the local probability matrix. Responses are absolute and non-negotiable.
              </p>
            </div>
          </div>

          {/* Response Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3
              className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <EyeIcon weight="fill" className="text-emerald-500"/>
              Extraction_Output
            </h3>

            <div className="flex-grow border border-white/10 bg-white/[0.01] rounded-sm p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={answer}
                  initial={{opacity: 0, scale: 0.95}}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
                  }}
                  exit={{opacity: 0, scale: 1.05}}
                  transition={{
                    x: isShaking ? {repeat: Infinity, duration: 0.1} : {duration: 0.3},
                    opacity: {duration: 0.2},
                  }}
                  className="text-center space-y-12"
                >
                  <div className="relative">
                    <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-4 flex items-center justify-center bg-black transition-all duration-500 ${isShaking ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'border-white/10'}`}>
                      <span className={`text-6xl font-black font-mono transition-colors ${isShaking ? 'text-emerald-500' : 'text-white/20'}`}>8</span>
                    </div>
                    {isShaking && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ArrowsClockwiseIcon size={120} weight="thin" className="text-emerald-500/20 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="h-px w-12 bg-emerald-500 mx-auto" />
                    <h2 className={`text-3xl md:text-5xl font-black font-mono uppercase tracking-tighter transition-all ${isShaking ? 'text-gray-700' : 'text-emerald-400'}`}>
                      {answer}
                    </h2>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center opacity-20 font-mono text-[8px] uppercase tracking-[0.5em] text-gray-500">
                <span>LOCAL_SYNC_ACTIVE</span>
                <span>8B_v2.0.4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicEightBallPage;