import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, SkullIcon } from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useAchievements } from '../../context/AchievementContext';

const CodeSeancePage = () => {
  useSeo({
    title: 'Code Seance | Fezcodex',
    description: 'Communicate with the ghosts of deprecated code.',
    keywords: ['Fezcodex', 'seance', 'game', 'terminal', 'horror', 'coding'],
    ogTitle: 'Code Seance | Fezcodex',
    ogDescription: 'Communicate with the ghosts of deprecated code.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Code Seance | Fezcodex',
    twitterDescription: 'Communicate with the ghosts of deprecated code.',
    twitterImage: '/images/ogtitle.png',
  });

  const { unlockAchievement } = useAchievements();
  const [history, setHistory] = useState([
    { type: 'system', text: 'INITIALIZING SPIRIT CONNECTION...' },
    { type: 'system', text: 'CONNECTION ESTABLISHED. THE VEIL IS THIN.' },
    { type: 'spirit', text: '...looping... forever... consuming... memory...' },
  ]);
  const [input, setInput] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const scrollContainerRef = useRef(null);
  const [step, setStep] = useState(0);

  const spiritResponses = {
    // Step 0
    status: '...critical... stack... overflowing... TRACE...',
    help: '...diagnose... the... trace...',

    // Step 1
    trace: '...error... at... line... 404... file... not... found...',
    'stack trace': '...error... at... line... 404... file... not... found...',

    // Step 2
    'open 404': '...variable... GHOST_DATA... is... undefined...',
    'goto 404': '...variable... GHOST_DATA... is... undefined...',

    // Step 3
    'define ghost_data': '...data... needs... value... try... NULL...',
    'const ghost_data': '...data... needs... value... try... NULL...',

    // Step 4
    'ghost_data = null':
      '...null... pointer... exception... restart... service... DAEMON...',
    'set null':
      '...null... pointer... exception... restart... service... DAEMON...',

    // Step 5
    'restart daemon': '...daemon... listening... on... port... 666...',
    'start daemon': '...daemon... listening... on... port... 666...',

    // Step 6
    'connect 666': '...access... denied... sudo... required...',
    'localhost:666': '...access... denied... sudo... required...',

    // Step 7
    sudo: '...password... for... root... hint... it... is... PASSWORD...',
    'sudo connect':
      '...password... for... root... hint... it... is... PASSWORD...',

    // Step 8
    password:
      '...access... granted... to... break... the... loop... type... BREAK...',
    123456:
      '...access... granted... to... break... the... loop... type... BREAK...',

    // Step 9
    break: '...LOOP TERMINATED... MEMORY FREED... I AM AT PEACE...',
  };

  const handleCommand = (cmd) => {
    const cleanCmd = cmd.toLowerCase().trim();
    let response = '...silence...';
    let effect = false;
    let nextStep = step;
    let responseSuffix = '';

    if (step === 10) {
      // Seance is over
      response = '...the... connection... is... severed...';
      setHistory((prev) => [
        ...prev,
        { type: 'user', text: `> ${cmd}` },
        { type: 'spirit', text: response },
      ]);
      return;
    }

    const helpMessages = {
      0: '...type... STATUS... or... HELP... to begin...',
      1: '...TRACE... the... error...',
      2: '...OPEN... the... missing... file... (e.g., OPEN 404)...',
      3: '...DEFINE... the... variable... GHOST_DATA... (e.g., DEFINE GHOST_DATA)...',
      4: '...ASSIGN... a... value... (e.g., GHOST_DATA = NULL)...',
      5: '...RESTART... the... service... DAEMON...',
      6: '...CONNECT... to... the... port... (e.g., CONNECT 666)...',
      7: '...AUTHORIZE... with... SUDO...',
      8: '...ENTER... the... password... (e.g., PASSWORD)...',
      9: '...BREAK... the... loop...',
      10: '...the... connection... is... closed...',
    };

    if (cleanCmd === 'help') {
      response = helpMessages[step];
    } else if (step === 0 && cleanCmd === 'status') {
      response = spiritResponses['status'];
      nextStep = 1;
      responseSuffix = ` (Step ${nextStep})`;
    } else if (
      step === 1 &&
      (cleanCmd === 'trace' || cleanCmd === 'stack trace')
    ) {
      response = spiritResponses['trace'];
      nextStep = 2;
      responseSuffix = ` (Step ${nextStep})`;
    } else if (
      step === 2 &&
      (cleanCmd === 'open 404' || cleanCmd === 'goto 404')
    ) {
      response = spiritResponses['open 404'];
      nextStep = 3;
      responseSuffix = ` (Step ${nextStep})`;
    } else if (
      step === 3 &&
      (cleanCmd.includes('define') || cleanCmd.includes('const')) &&
      cleanCmd.includes('ghost_data')
    ) {
      response = spiritResponses['define ghost_data'];
      nextStep = 4;
      responseSuffix = ` (Step ${nextStep})`;
    } else if (step === 4 && cleanCmd.includes('null')) {
      response = spiritResponses['ghost_data = null'];
      nextStep = 5;
      responseSuffix = ` (Step ${nextStep})`;
    } else if (
      step === 5 &&
      (cleanCmd.includes('restart') || cleanCmd.includes('start')) &&
      cleanCmd.includes('daemon')
    ) {
      response = spiritResponses['restart daemon'];
      nextStep = 6;
      responseSuffix = ` (Step ${nextStep})`;
    } else if (step === 6 && cleanCmd.includes('666')) {
      response = spiritResponses['connect 666'];
      nextStep = 7;
      responseSuffix = ` (Step ${nextStep})`;
    } else if (step === 7 && cleanCmd.includes('sudo')) {
      response = spiritResponses['sudo'];
      nextStep = 8;
      responseSuffix = ` (Step ${nextStep})`;
    } else if (
      step === 8 &&
      (cleanCmd === 'password' || cleanCmd === '123456')
    ) {
      response = spiritResponses['password'];
      nextStep = 9;
      responseSuffix = ` (Step ${nextStep})`;
    } else if (step === 9 && cleanCmd === 'break') {
      response = spiritResponses['break'];
      nextStep = 10;
      effect = true;
      unlockAchievement('the_medium');
      responseSuffix = ' (LOOP BROKEN!)'; // Final step special message
    } else {
      // Fallback responses
      const randomResponses = [
        '...not... that...',
        '...try... harder...',
        '...the... code... rots...',
        '...syntax... error...',
      ];
      response =
        randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }

    if (effect) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 2000);
    }

    setHistory((prev) => [
      ...prev,
      { type: 'user', text: `> ${cmd}` },
      { type: 'spirit', text: response + responseSuffix },
    ]);
    if (cleanCmd !== 'help' && nextStep !== step) {
      // Only update step if it's not a help command and step actually changed
      setStep(nextStep);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput('');
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      className={`min-h-screen bg-black text-green-500 font-mono p-4 sm:p-8 selection:bg-green-900 selection:text-white overflow-hidden ${isGlitching ? 'animate-ping' : ''}`}
    >
      <div className="max-w-3xl mx-auto relative z-10">
        <Link
          to="/apps"
          className="group text-green-700 hover:text-green-400 hover:underline flex items-center gap-2 text-lg mb-8 transition-colors"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Escape
        </Link>

        <div className="border-2 border-green-800 rounded-lg p-6 bg-black shadow-[0_0_20px_rgba(0,255,0,0.1)] h-[70vh] flex flex-col relative">
          {/* Scanlines effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)50%,rgba(0,0,0,0.25)50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20"></div>

          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto space-y-4 mb-4 z-10 scrollbar-hide"
          >
            {history.map((entry, i) => (
              <div
                key={i}
                className={`${entry.type === 'user' ? 'text-right text-green-300' : entry.type === 'system' ? 'text-center text-green-800 text-xs' : 'text-left text-green-500'}`}
              >
                <span
                  className={`${entry.type === 'spirit' ? 'blur-[0.5px] animate-pulse' : ''}`}
                >
                  {entry.text}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 flex gap-2">
            <span className="text-green-500 mt-2 animate-bounce">➜</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Prevent page scrolling with arrow keys, pageUp/Down
                if (
                  ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className="w-full bg-black border-b-2 border-green-800 text-green-400 focus:outline-none focus:border-green-500 py-2 font-mono uppercase placeholder-green-900"
              placeholder={
                step === 10 ? 'CONNECTION CLOSED.' : 'COMMUNICATE...'
              }
              autoFocus
              disabled={step === 10}
            />
          </form>
        </div>

        <div className="text-center mt-8 text-green-900 text-xs animate-pulse">
          <SkullIcon size={32} className="mx-auto mb-2 opacity-50" />
          EST. 1970 - EPOCH START
        </div>
      </div>
    </div>
  );
};

export default CodeSeancePage;
