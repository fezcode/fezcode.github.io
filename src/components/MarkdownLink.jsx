import React from 'react';
import { useSidePanel } from '../context/SidePanelContext';
import { vocabulary } from '../data/vocabulary';
import { ArrowSquareOut } from '@phosphor-icons/react';
import vocabPanelContent from './vocabPanelContent';

const MarkdownLink = ({ href, children, width = 450, className, ...props }) => {
  const { openSidePanel } = useSidePanel();
  const isExternal = href?.startsWith('http') || href?.startsWith('https');
  const isVocab =
    href && (href.startsWith('/vocab/') || href.includes('/#/vocab/'));

  if (isVocab) {
    const parts = href.split('/vocab/');
    const term = parts[1];
    const entry = vocabulary[term];

    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          if (entry && entry.loader) {
            openSidePanel(entry.title, vocabPanelContent(entry), width);
          } else {
            console.warn(`Vocabulary term or loader not found: ${term}`);
          }
        }}
        className={
          className ||
          'text-pink-400 hover:text-pink-300 transition-colors inline-flex items-center gap-1 border-b border-pink-500/30 border-dashed hover:border-solid cursor-help'
        }
        title="Click for definition"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`${className || 'text-primary-400 hover:text-primary-300'} inline-flex items-center gap-1`}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children} {isExternal && <ArrowSquareOut className="text-xs" />}
    </a>
  );
};

export default MarkdownLink;
