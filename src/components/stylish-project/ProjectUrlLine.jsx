import React, { useState } from 'react';
import { CopyIcon, CheckIcon, TerminalIcon } from '@phosphor-icons/react';

const ProjectUrlLine = ({
  command = 'curl -s https://fezcode.com/install.sh | sh',
  label = 'Get the Project',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto my-10">
      <div className="bg-product-card-bg border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <TerminalIcon size={16} className="text-product-body-text" />
            <span className="text-xs font-mono text-product-body-text uppercase tracking-widest">
              {label}
            </span>
          </div>
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between group">
          <code className="font-mono text-product-card-text text-sm md:text-base break-all">
            <span className="text-product-card-icon mr-2">$</span>
            {command}
          </code>
          <button
            onClick={handleCopy}
            className="ml-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-product-body-text hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckIcon size={18} className="text-green-500" />
            ) : (
              <CopyIcon size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectUrlLine;
