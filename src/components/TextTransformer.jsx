import React, { useState } from 'react';
import {
  TranslateIcon,
  CodeIcon,
  CopySimpleIcon,
} from '@phosphor-icons/react';
import { useToast } from '../hooks/useToast';

const TextTransformer = () => {
  const [inputText, setInputText] = useState('');
  const { addToast } = useToast();

  const toLeet = (text) => {
    const leetMap = {
      a: '4',
      b: '8',
      e: '3',
      g: '6',
      l: '1',
      o: '0',
      s: '5',
      t: '7',
      z: '2',
      A: '4',
      B: '8',
      E: '3',
      G: '6',
      L: '1',
      O: '0',
      S: '5',
      T: '7',
      Z: '2',
    };
    return text
      .split('')
      .map((char) => leetMap[char] || char)
      .join('');
  };

  const transformedText = toLeet(inputText);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      addToast({
        title: 'Copied',
        message: 'Payload stored in clipboard.',
        duration: 2000,
      });
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="space-y-2">
        <label className="flex items-center gap-2 font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
          <TranslateIcon weight="fill" className="text-emerald-500" />
          Input_Sequence
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-sm pointer-events-none" />
          <textarea
            className="relative w-full h-32 bg-black/40 border border-white/10 p-4 font-mono text-sm text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm resize-none scrollbar-hide"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Insert plaintext sequence..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <CodeIcon weight="fill" className="text-emerald-500" />
            1337_0utput
          </label>
          <button
            onClick={() => copyToClipboard(transformedText)}
            disabled={!transformedText}
            className="text-gray-500 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
            title="Copy Output"
          >
            <CopySimpleIcon size={16} weight="bold" />
          </button>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-20 rounded-sm pointer-events-none" />
          <div className="relative w-full h-32 bg-black/60 border border-white/10 p-4 font-mono text-sm text-emerald-500/80 rounded-sm overflow-auto scrollbar-hide break-all whitespace-pre-wrap">
            {transformedText || <span className="opacity-20 italic uppercase tracking-tighter">--- awaiting_signal ---</span>}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
          Protocol: numeric_substitution
        </span>
        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
          Status: {inputText ? 'Processing' : 'Standby'}
        </span>
      </div>
    </div>
  );
};

export default TextTransformer;