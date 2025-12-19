import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import piml from 'piml';
import {ArrowSquareOut} from '@phosphor-icons/react';

const LinkRenderer = ({href, children}) => {
  const isExternal = href.startsWith('http') || href.startsWith('https');
  return (
    <a
      href={href}
      className="inline-block font-mono text-sm mx-0.5 border-2 border-white px-2 py-1 text-white hover:bg-white hover:text-black transition-all"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children} {isExternal && <ArrowSquareOut className="text-xs inline mb-1"/>}
    </a>
  );
};

const Brutalist = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const [metaResponse, contentResponse] = await Promise.all([
          fetch('/about-me/about.piml'),
          fetch('/about-me/about.txt'),
        ]);

        let attributes = {};
        if (metaResponse.ok) {
          const pimlText = await metaResponse.text();
          attributes = piml.parse(pimlText);
        }

        let body = '';
        if (contentResponse.ok) {
          body = await contentResponse.text();
        }

        setTitle(attributes.title || 'About Me');
        setContent(body);
      } catch (err) {
        console.error('Error fetching about page content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  if (loading) {
    return (
      <div className="h-full bg-black flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-widest text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="h-full bg-black text-white overflow-y-auto selection:bg-white selection:text-black font-mono">

      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.2}}
        className="px-4 sm:px-8 md:px-12 lg:px-24 py-16 md:py-24"
      >
        <header className="mb-16 border-8 border-white p-8">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white uppercase break-words">
            {title}
          </h1>
        </header>

        <article className="prose prose-lg md:prose-xl max-w-none font-mono prose-invert
          prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wider prose-headings:text-4xl prose-headings:mt-24 prose-headings:mb-8 prose-headings:p-4 prose-headings:bg-white prose-headings:text-black
          prose-p:font-mono prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
          prose-strong:font-black
          prose-li:font-mono prose-li:text-lg prose-li:my-2

          prose-table:w-full prose-table:border-collapse prose-table:border-4 prose-table:border-white prose-table:font-mono prose-table:text-base prose-table:my-12
          prose-thead:bg-white prose-thead:text-black
          prose-th:p-4 prose-th:uppercase prose-th:tracking-widest prose-th:font-black prose-th:text-left prose-th:border-2 prose-th:border-white
          prose-td:p-4 prose-td:border-2 prose-td:border-white

          prose-blockquote:border-4 prose-blockquote:border-white prose-blockquote:pl-8 prose-blockquote:bg-gray-900 prose-blockquote:p-8 prose-blockquote:not-italic prose-blockquote:font-bold prose-blockquote:text-xl"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{a: LinkRenderer}}
          >
            {content}
          </ReactMarkdown>
        </article>

        <footer
          className="mt-24 pt-8 border-t-8 border-white flex flex-col md:flex-row justify-between items-start gap-6 font-mono text-sm uppercase tracking-widest text-gray-400">
          <div className="font-black text-white">
            <span>END</span>
          </div>
          <div>
            <span>{new Date().toISOString()}</span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Brutalist;
