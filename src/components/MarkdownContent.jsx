import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { ImagesIcon } from '@phosphor-icons/react';
import ImageModal from './ImageModal';
import MermaidDiagram from './MermaidDiagram';

const MarkdownContent = ({ content, components = {}, className = '' }) => {
  const [modalData, setModalData] = useState(null);

  const CustomImage = ({ src, alt, ...props }) => {
    return (
      <figure className="my-8 group relative overflow-hidden rounded-lg">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          onClick={() => setModalData({ src, alt })}
          {...props}
        />
        {alt && (
          <figcaption className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-md px-4 py-2 text-xs font-mono text-gray-300 border-t border-white/10 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            {alt}
          </figcaption>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-1.5 rounded-full backdrop-blur-sm border border-white/10 pointer-events-none">
          <ImagesIcon size={16} className="text-white" />
        </div>
      </figure>
    );
  };

  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const isMermaid = match && match[1] === 'mermaid';

    if (!inline && isMermaid) {
      return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  const defaultComponents = {
    img: CustomImage,
    code: CodeBlock,
    ...components,
  };

  return (
    <>
      <div className={className}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={defaultComponents}
        >
          {content}
        </ReactMarkdown>
      </div>

      <ImageModal
        src={modalData?.src}
        alt={modalData?.alt}
        onClose={() => setModalData(null)}
      />
    </>
  );
};
export default MarkdownContent;
