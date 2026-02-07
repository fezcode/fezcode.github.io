import React, { useState } from 'react';
import MarkdownContent from '../../../components/MarkdownContent';
import Quiz from './Quiz';
import {
  CaretRight,
  Flask,
  ArrowsOutSimple,
  ClipboardText,
} from '@phosphor-icons/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../../../utils/customTheme';
import CodeModal from '../../../components/CodeModal';
import { useToast } from '../../../hooks/useToast';

const LessonView = ({ lesson, onComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalLanguage, setModalLanguage] = useState('javascript');
  const { addToast } = useToast();

  const openModal = (content, language) => {
    setModalContent(content);
    setModalLanguage(language);
    setIsModalOpen(true);
  };

  const CodeBlock = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');

    const handleCopy = () => {
      const textToCopy = String(children);
      navigator.clipboard.writeText(textToCopy).then(
        () =>
          addToast({
            title: 'INTEL COPIED',
            message: 'Code block synchronized to clipboard.',
            duration: 3000,
            type: 'success',
          }),
        () =>
          addToast({
            title: 'ERROR',
            message: 'Failed to access clipboard.',
            duration: 3000,
            type: 'error',
          }),
      );
    };

    if (!inline && match) {
      return (
        <div className="relative group my-8">
          <div className="absolute -top-3 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() =>
                openModal(String(children).replace(/\n$/, ''), match[1])
              }
              className="bg-zinc-900 border border-white/10 px-2 py-1 text-[10px] uppercase font-mono font-bold tracking-widest text-gray-400 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all rounded-sm"
              title="Enlarge Intel"
            >
              <ArrowsOutSimple size={12} weight="bold" /> EXPAND
            </button>
            <button
              onClick={handleCopy}
              className="bg-zinc-900 border border-white/10 px-2 py-1 text-[10px] uppercase font-mono font-bold tracking-widest text-gray-400 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all rounded-sm"
              title="Copy to Clipboard"
            >
              <ClipboardText size={12} weight="bold" /> COPY
            </button>
          </div>
          <div className="border border-white/10 rounded-sm overflow-hidden shadow-2xl bg-zinc-950">
            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500">
                DATA_NODE: {match[1]}
              </span>
            </div>
            <SyntaxHighlighter
              style={customTheme}
              language={match[1]}
              PreTag="div"
              CodeTag="code"
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                background: 'transparent',
              }}
              {...props}
              codeTagProps={{
                style: { fontFamily: "'JetBrains Mono', monospace" },
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }

    return (
      <code
        className={`${className} font-mono bg-white/5 text-emerald-400 px-1.5 py-0.5 rounded-sm text-sm`}
        {...props}
      >
        {children}
      </code>
    );
  };

  if (!lesson)
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 font-mono text-[10px] uppercase tracking-widest space-y-4">
        <div className="w-8 h-8 border border-t-emerald-500 border-r-emerald-500/50 border-b-emerald-500/20 border-l-emerald-500/10 animate-spin rounded-full"></div>
        <p>Loading_Matrix_Data...</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {/* Lesson Header */}
      <div className="mb-16 border-b border-white/10 pb-12">
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 uppercase tracking-[0.2em] mb-6">
          <span>Module_0{lesson.id.split('-')[0] || '1'}</span>
          <CaretRight size={10} />
          <span>Unit_Protocol</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-playfairDisplay font-light text-white mb-8 leading-none tracking-tight uppercase">
          {lesson.title}
        </h1>
        <div className="flex gap-4">
          <div className="h-1 w-24 bg-emerald-500"></div>
          <div className="h-1 w-12 bg-white/20"></div>
          <div className="h-1 w-4 bg-white/10"></div>
        </div>
      </div>

      {/* Content */}
      <div
        className="prose prose-invert prose-lg max-w-none
        prose-headings:font-playfairDisplay prose-headings:font-light prose-headings:uppercase prose-headings:tracking-wide prose-headings:text-white
        prose-p:text-gray-400 prose-p:font-light prose-p:leading-relaxed prose-p:font-mono
        prose-strong:text-white prose-strong:font-bold
        prose-pre:bg-transparent prose-pre:border-none prose-pre:p-0
        prose-blockquote:border-l-2 prose-blockquote:border-emerald-500 prose-blockquote:bg-white/[0.02] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-gray-500
        prose-li:text-gray-400 prose-li:font-mono prose-li:marker:text-emerald-500
        prose-img:rounded-none prose-img:border prose-img:border-white/10 prose-img:grayscale hover:prose-img:grayscale-0 prose-img:transition-all
        "
      >
        <MarkdownContent
          content={lesson.content}
          components={{ code: CodeBlock }}
        />
      </div>

      {/* Footer / Quiz Section */}
      <div className="mt-24 pt-12 border-t border-white/10">
        {lesson.quiz && lesson.quiz.length > 0 ? (
          <Quiz
            questions={lesson.quiz}
            onComplete={() => onComplete(lesson.id)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 p-16 text-center group hover:border-emerald-500/30 transition-all">
            <div className="mb-6 p-4 bg-white/5 rounded-full text-gray-500 group-hover:text-emerald-500 transition-colors">
              <Flask size={32} weight="duotone" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2 font-mono">
              Protocol_End
            </h3>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-8">
              No assessment required for this unit.
            </p>
            <button
              onClick={() => onComplete(lesson.id)}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] text-black bg-white hover:bg-emerald-500 transition-all"
            >
              <span>MARK_COMPLETE</span>
              <CaretRight
                className="ml-3 transition-transform duration-200 group-hover:translate-x-1"
                weight="bold"
              />
            </button>
          </div>
        )}
      </div>

      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={modalLanguage}
      >
        {modalContent}
      </CodeModal>
    </div>
  );
};

export default LessonView;
