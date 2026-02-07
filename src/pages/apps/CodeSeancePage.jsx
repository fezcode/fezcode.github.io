import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, SkullIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';

const CodeSeancePage = () => {
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
    status:
      '...system... unstable... boundaries... blurred... EXAMINE... the... layout...',
    help: '...the... foundation... is... fractured... visualize... the... structure...',

    // Step 1
    ls: '...the... catalog... holds... secrets... find... the... archive... segment...',
    dir: '...the... catalog... holds... secrets... find... the... archive... segment...',

    // Step 2
    'cd logs':
      '...the... vault... is... open... find... the... mark... of... failure... within... trace.log...',

    // Step 3
    'grep error trace.log':
      '...a... pattern... emerges... line... 404... contains... the... truth... inspect... it...',
    'grep "error" trace.log':
      '...a... pattern... emerges... line... 404... contains... the... truth... inspect... it...',

    // Step 4
    'cat trace.log':
      '...the... trace... reveals... a... parasite... GHOST... is... still... beating... check... the... pulse...',

    // Step 5
    'ps aux':
      '...PID... 666... is... the... mark... of... the... beast... it... must... be... silenced...',
    ps: '...PID... 666... is... the... mark... of... the... beast... it... must... be... silenced...',

    // Step 6
    'kill -9 666':
      '...the... heart... stops... but... the... shadow... lingers... in... /tmp/ghost_cache... erase... it...',
    'kill 666':
      '...the... heart... stops... but... the... shadow... lingers... in... /tmp/ghost_cache... erase... it...',

    // Step 7
    'rm -rf /tmp/ghost_cache':
      '...the... physical... link... is... gone... but... the... variable... remains... declare... its... true... name...',
    'rm /tmp/ghost_cache':
      '...the... physical... link... is... gone... but... the... variable... remains... declare... its... true... name...',

    // Step 8
    'define ghost_data':
      '...the... name... is... spoken... now... make... it... nothing... return... it... to... the... VOID...',
    'const ghost_data':
      '...the... name... is... spoken... now... make... it... nothing... return... it... to... the... VOID...',

    // Step 9
    'ghost_data = null':
      '...existence... negated... the... system... requires... a... new... guardian... awaken... the... DAEMON...',
    'set null':
      '...existence... negated... the... system... requires... a... new... guardian... awaken... the... DAEMON...',

    // Step 10
    'restart daemon':
      '...the... watcher... is... reborn... listening... at... the... gate... of... triple... nines...',
    'start daemon':
      '...the... watcher... is... reborn... listening... at... the... gate... of... triple... nines...',

    // Step 11
    'connect 999':
      '...the... barrier... is... thin... but... you... lack... the... AUTHORITY... to... pass...',
    'localhost:999':
      '...the... barrier... is... thin... but... you... lack... the... AUTHORITY... to... pass...',

    // Step 12
    sudo: '...state... your... claim... to... the... root... what... is... the... secret... WORD...',
    'sudo connect':
      '...state... your... claim... to... the... root... what... is... the... secret... WORD...',

    // Step 13
    password:
      '...dominion... granted... the... cycle... must... end... SEVER... the... link...',
    123456:
      '...dominion... granted... the... cycle... must... end... SEVER... the... link...',

    // Step 14
    break: '...CONNECTION TERMINATED... VOID SATISFIED... I AM AT PEACE...',
  };

  const handleCommand = (cmd) => {
    const cleanCmd = cmd.toLowerCase().trim();
    let response = '...silence...';
    let effect = false;
    let nextStep = step;
    let responseSuffix = '';

    if (step === 15) {
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
      0: '...request... a... STATUS... report... from... the... void...',
      1: '...LIST... (LS)... the... fragments... of... this... directory...',
      2: '...CHANGE... (CD)... your... path... to... the... vault... of... LOGS...',
      3: '...FILTER... (G...)... the... noise... for... ERROR... in... trace.log...',
      4: '...READ... (C...)... the... scroll... of... the... trace.log...',
      5: '...reveal... the... active... PROCESSES... (P...)...',
      6: '...TERMINATE... (K...)... the... parasite... 666...',
      7: '...REMOVE... (R...)... the... corrupted... /tmp/ghost_cache...',
      8: '...you... must... DEFINE... the... GHOST_DATA...',
      9: '...return... the... data... to... NOTHING... (N...)...',
      10: '...RESTART... the... service... of... the... DAEMON...',
      11: '...CONNECT... to... the... gate... of... triple... nines...',
      12: '...invoke... the... authority... of... the... root... (S...)...',
      13: '...speak... the... common... PASSWORD...',
      14: '...SEVER... the... loop... (B...)...',
      15: '...the... connection... is... closed...',
    };

    if (cleanCmd === 'help') {
      response = helpMessages[step];
    } else if (step === 0 && cleanCmd === 'status') {
      response = spiritResponses['status'];
      nextStep = 1;
    } else if (step === 1 && (cleanCmd === 'ls' || cleanCmd === 'dir')) {
      response = spiritResponses['ls'];
      nextStep = 2;
    } else if (step === 2 && cleanCmd === 'cd logs') {
      response = spiritResponses['cd logs'];
      nextStep = 3;
    } else if (
      step === 3 &&
      cleanCmd.includes('grep') &&
      cleanCmd.includes('error')
    ) {
      response = spiritResponses['grep error trace.log'];
      nextStep = 4;
    } else if (step === 4 && cleanCmd === 'cat trace.log') {
      response = spiritResponses['cat trace.log'];
      nextStep = 5;
    } else if (step === 5 && (cleanCmd === 'ps aux' || cleanCmd === 'ps')) {
      response = spiritResponses['ps aux'];
      nextStep = 6;
    } else if (
      step === 6 &&
      (cleanCmd === 'kill -9 666' || cleanCmd === 'kill 666')
    ) {
      response = spiritResponses['kill -9 666'];
      nextStep = 7;
    } else if (
      step === 7 &&
      cleanCmd.includes('rm') &&
      cleanCmd.includes('tmp')
    ) {
      response = spiritResponses['rm -rf /tmp/ghost_cache'];
      nextStep = 8;
    } else if (
      step === 8 &&
      (cleanCmd.includes('define') || cleanCmd.includes('const')) &&
      cleanCmd.includes('ghost_data')
    ) {
      response = spiritResponses['define ghost_data'];
      nextStep = 9;
    } else if (step === 9 && cleanCmd.includes('null')) {
      response = spiritResponses['ghost_data = null'];
      nextStep = 10;
    } else if (
      step === 10 &&
      (cleanCmd.includes('restart') || cleanCmd.includes('start')) &&
      cleanCmd.includes('daemon')
    ) {
      response = spiritResponses['restart daemon'];
      nextStep = 11;
    } else if (step === 11 && cleanCmd.includes('999')) {
      response = spiritResponses['connect 999'];
      nextStep = 12;
    } else if (step === 12 && cleanCmd.includes('sudo')) {
      response = spiritResponses['sudo'];
      nextStep = 13;
    } else if (
      step === 13 &&
      (cleanCmd === 'password' || cleanCmd === '123456')
    ) {
      response = spiritResponses['password'];
      nextStep = 14;
    } else if (step === 14 && cleanCmd === 'break') {
      response = spiritResponses['break'];
      nextStep = 15;
      effect = true;
      unlockAchievement('the_medium');
      responseSuffix = ' (LOOP BROKEN!)';
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
      <Seo
        title="Code Seance | Fezcodex"
        description="An interactive coding experience with a mystical twist."
        keywords={['coding', 'seance', 'interactive', 'terminal']}
      />
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
