import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowsOutSimple,
  ClipboardText,
} from '@phosphor-icons/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { galleyTheme } from '../../utils/galleyTheme';
import CodeModal from '../../components/CodeModal';
import Seo from '../../components/Seo';
import { calculateReadingTime } from '../../utils/readingTime';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import { useToast } from '../../hooks/useToast';
import MarkdownLink from '../../components/MarkdownLink';
import MarkdownContent from '../../components/MarkdownContent';
import MermaidDiagram from '../../components/MermaidDiagram';
import TerracottaGenerativeArt from '../../components/TerracottaGenerativeArt';

/*
 * GALLEY reader — a letterpress proof pulled for correction.
 * Conceit: the page is a galley-slip from a 19th-century composing room.
 * Tight measure, running head, drop cap, marginalia, registration crosshairs,
 * and an imprimatur signature line at the foot.
 */

const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0 0.05 0 0 0 0.24 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

const ROMAN = [
  '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
];

const toRoman = (n) => ROMAN[n] || String(n);

const RegistrationCross = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`pointer-events-none ${className}`}
  >
    <circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
    <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="0.6" />
    <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="0.6" />
  </svg>
);

const SlipField = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 leading-none">
    <span className="text-[8.5px] tracking-[0.28em] uppercase text-[#2E2620]/55">
      {label}
    </span>
    <span className="text-[11px] tracking-[0.08em] uppercase text-[#1A1613]">
      {value}
    </span>
  </div>
);

const MarginMark = ({ glyph = '¶', note }) => (
  <aside
    aria-hidden="true"
    className="hidden xl:block absolute left-[-88px] select-none w-[72px]"
  >
    <div className="font-fraunces italic text-[22px] text-[#C96442] leading-none">
      {glyph}
    </div>
    {note && (
      <div className="mt-1 font-ibm-plex-mono text-[9px] tracking-[0.22em] uppercase text-[#2E2620]/55">
        {note}
      </div>
    )}
  </aside>
);

const GalleyBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalLanguage, setModalLanguage] = useState('jsx');
  const { addToast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { allPostsData, processedPosts } = await fetchAllBlogPosts();
        const postMetadata = processedPosts.find((item) => item.slug === currentSlug);
        if (!postMetadata) {
          navigate('/404');
          return;
        }

        const contentPath = `posts/${postMetadata.filename}`;
        const postContentResponse = await fetch(`/${contentPath}`);
        const postBody = await postContentResponse.text();

        let seriesPosts = [];
        if (postMetadata.series) {
          const originalSeries = allPostsData.find(
            (item) => item.series && item.slug === postMetadata.series.slug,
          );
          if (originalSeries) seriesPosts = originalSeries.series.posts;
        }

        setPost({ attributes: postMetadata, body: postBody, seriesPosts });
        setEstimatedReadingTime(calculateReadingTime(postBody));
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [currentSlug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const totalHeight = scrollHeight - clientHeight;
      setReadingProgress(totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (content, language) => {
    setModalContent(content);
    setModalLanguage(language);
    setIsModalOpen(true);
  };

  const components = useMemo(() => {
    const CodeBlock = ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isMermaid = match && match[1] === 'mermaid';

      if (!inline && isMermaid) {
        return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
      }

      const handleCopy = () => {
        const textToCopy = String(children);
        navigator.clipboard.writeText(textToCopy).then(
          () =>
            addToast({
              title: 'Lifted',
              message: 'Slug copied from the tray.',
              duration: 2400,
              type: 'success',
            }),
          () =>
            addToast({
              title: 'Stet',
              message: 'Could not reach the clipboard.',
              duration: 2400,
              type: 'error',
            }),
        );
      };

      if (!inline && (match || /\n/.test(String(children)))) {
        return (
          <div className="relative group my-10 -mx-4 md:-mx-8">
            <div className="absolute -top-3 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openModal(String(children).replace(/\n$/, ''), match[1])}
                className="bg-[#F3ECE0] border border-[#1A161340] px-2 py-1 text-[9px] uppercase font-ibm-plex-mono tracking-[0.22em] text-[#1A1613] hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-colors"
                title="Expand"
              >
                <ArrowsOutSimple size={11} weight="bold" className="inline mr-1" />
                Expand
              </button>
              <button
                onClick={handleCopy}
                className="bg-[#F3ECE0] border border-[#1A161340] px-2 py-1 text-[9px] uppercase font-ibm-plex-mono tracking-[0.22em] text-[#1A1613] hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-colors"
                title="Lift"
              >
                <ClipboardText size={11} weight="bold" className="inline mr-1" />
                Lift
              </button>
            </div>
            <div className="galley-code border border-[#1A161340] bg-[#EDE3D2] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#1A161320] bg-[#E8DECE]">
                <span className="font-ibm-plex-mono text-[8.5px] uppercase tracking-[0.28em] text-[#2E2620]/70">
                  Font tray · {match ? match[1] : 'text'}
                </span>
                <span className="font-ibm-plex-mono text-[8.5px] uppercase tracking-[0.28em] text-[#C96442]">
                  {'//'} composed
                </span>
              </div>
              <SyntaxHighlighter
                style={galleyTheme}
                language={match ? match[1] : 'text'}
                PreTag="div"
                CodeTag="code"
                customStyle={{
                  margin: 0,
                  padding: '1.25rem 1.5rem',
                  fontSize: '0.82rem',
                  lineHeight: '1.65',
                  background: '#EDE3D2',
                }}
                {...props}
                codeTagProps={{ style: { fontFamily: "'IBM Plex Mono', monospace" } }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }

      return (
        <code
          className={`${className} font-ibm-plex-mono text-[#9E4A2F] bg-[#C96442]/10 px-1 py-[1px] text-[0.88em]`}
          {...props}
        >
          {children}
        </code>
      );
    };

    return {
      a: (p) => {
        const isVocab =
          p.href && (p.href.startsWith('/vocab/') || p.href.includes('/#/vocab/'));
        return (
          <MarkdownLink
            {...p}
            className={
              isVocab
                ? 'text-[#9E4A2F] font-bold decoration-[#C96442]/60 underline underline-offset-4'
                : 'text-[#1A1613] underline decoration-[#C96442]/50 decoration-[1.5px] underline-offset-4 hover:decoration-[#C96442]'
            }
          />
        );
      },
      pre: ({ children }) => <>{children}</>,
      code: CodeBlock,
    };
  }, [addToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3ECE0] flex items-center justify-center font-ibm-plex-mono uppercase tracking-[0.28em] text-[10px] text-[#1A1613]">
        <span className="animate-pulse">· galley · loading ·</span>
      </div>
    );
  }

  if (!post) return null;

  const currentPostIndex = post.seriesPosts?.findIndex((item) => item.slug === currentSlug);
  const prevPost = post.seriesPosts?.[currentPostIndex - 1];
  const nextPost = post.seriesPosts?.[currentPostIndex + 1];

  const dateObj = new Date(post.attributes.date);
  const dateMDMY = dateObj.toLocaleDateString('en-GB', {
    year: 'numeric', month: 'short', day: '2-digit',
  }).toUpperCase();
  const year = dateObj.getFullYear();

  const galleyNo = toRoman(((currentSlug || '').length % 20) + 1);
  const signature = String.fromCharCode(65 + (((currentSlug || '').length * 3) % 26));
  const proofNo = String(((currentSlug || '').length % 9) + 1).padStart(2, '0');

  return (
    <div className="min-h-screen bg-[#F3ECE0] text-[#1A1613] selection:bg-[#C96442]/30 relative overflow-hidden">
      <Seo
        title={post ? `${post.attributes.title} | Fezcodex` : null}
        description={post ? post.body.substring(0, 150) : null}
        image={post?.attributes?.ogImage || post?.attributes?.image}
        keywords={post?.attributes?.tags}
      />

      {/* paper grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[5] opacity-30 mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      {/* vertical ruler — left edge, ticks every 4% */}
      <div
        aria-hidden="true"
        className="hidden md:block fixed left-0 top-0 bottom-0 w-[14px] z-30 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 24px, #1A161320 24px, #1A161320 25px)`,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="hidden md:block fixed left-0 top-0 w-[2px] z-30 bg-[#C96442]"
        style={{ height: `${readingProgress}%` }}
      />

      {/* running head */}
      <div className="sticky top-0 z-20 bg-[#F3ECE0]/95 backdrop-blur-[2px] border-b border-[#1A161320]">
        <div className="mx-auto max-w-[780px] px-6 md:px-10 py-2 flex items-center justify-between">
          <span className="font-ibm-plex-mono text-[9px] tracking-[0.28em] uppercase text-[#2E2620]/70">
            Fezcodex · Galley № {galleyNo}
          </span>
          <span className="hidden sm:inline font-fraunces italic text-[12px] text-[#1A1613] truncate max-w-[420px]">
            {post.attributes.title}
          </span>
          <span className="font-ibm-plex-mono text-[9px] tracking-[0.28em] uppercase text-[#2E2620]/70">
            fol. {Math.max(1, Math.round(readingProgress / 20) + 1)}
          </span>
        </div>
      </div>

      {/* registration crosshair corners — around the reading area */}
      <div className="relative mx-auto max-w-[780px] px-6 md:px-10 pt-10 pb-24">
        <div className="absolute top-6 left-2 w-[14px] h-[14px] text-[#1A161340]">
          <RegistrationCross />
        </div>
        <div className="absolute top-6 right-2 w-[14px] h-[14px] text-[#1A161340]">
          <RegistrationCross />
        </div>
        <div className="absolute bottom-10 left-2 w-[14px] h-[14px] text-[#1A161340]">
          <RegistrationCross />
        </div>
        <div className="absolute bottom-10 right-2 w-[14px] h-[14px] text-[#1A161340]">
          <RegistrationCross />
        </div>

        {/* back link */}
        <div className="mb-8">
          <Link
            to={
              post.attributes.series
                ? `/blog/series/${post.attributes.series.slug}`
                : '/blog'
            }
            className="inline-flex items-center gap-2 font-ibm-plex-mono text-[9.5px] uppercase tracking-[0.28em] text-[#1A1613] hover:text-[#9E4A2F] transition-colors"
          >
            <ArrowLeft size={11} weight="bold" />
            <span className="border-b border-[#1A161340]">
              {post.attributes.series ? 'Back to signature' : 'Back to the stone'}
            </span>
          </Link>
        </div>

        {/* galley slip */}
        <div className="border border-[#1A161340] mb-14 relative">
          <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#F3ECE0] px-2 font-ibm-plex-mono text-[9px] tracking-[0.3em] uppercase text-[#C96442]">
            Galley
          </div>
          <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#F3ECE0] px-2 font-ibm-plex-mono text-[9px] tracking-[0.3em] uppercase text-[#1A1613]">
            № {galleyNo}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-5 pt-5 pb-3 font-ibm-plex-mono">
            <SlipField label="Signature" value={signature} />
            <SlipField label="Proof" value={proofNo} />
            <SlipField label="Measure" value="38em · 11/16" />
            <SlipField label="Set" value={dateMDMY} />
          </div>
          <div className="border-t border-dashed border-[#1A161320] px-5 py-2 flex items-center justify-between font-ibm-plex-mono text-[9px] tracking-[0.28em] uppercase">
            <span className="text-[#2E2620]/60">
              Category ·{' '}
              <span className="text-[#9E4A2F]">
                {post.attributes.category || 'Miscellany'}
              </span>
            </span>
            <span className="text-[#2E2620]/60">
              {estimatedReadingTime}′ read · stet ✓
            </span>
          </div>
        </div>

        {/* generative plate — a small woodcut keyed to the title */}
        <div className="mb-12 border border-[#1A161340] relative">
          <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#F3ECE0] px-2 font-ibm-plex-mono text-[9px] tracking-[0.3em] uppercase text-[#2E2620]/70">
            Plate
          </div>
          <div className="w-full aspect-[16/5]">
            <TerracottaGenerativeArt seed={post.attributes.title} className="w-full h-full" />
          </div>
        </div>

        {/* masthead title */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-[42px] bg-[#C96442]" />
            <span className="font-ibm-plex-mono text-[9px] tracking-[0.32em] uppercase text-[#C96442]">
              Intake piece
            </span>
          </div>
          <h1
            className="font-fraunces italic text-[44px] md:text-[66px] leading-[0.98] tracking-tight text-[#1A1613]"
            style={{
              fontVariationSettings:
                '"opsz" 144, "SOFT" 40, "WONK" 1, "wght" 460',
            }}
          >
            {post.attributes.title}
            <span className="text-[#C96442]">.</span>
          </h1>
          <div className="mt-5 flex items-end justify-between gap-6 border-t border-[#1A161320] pt-4">
            <span className="font-ibm-plex-mono text-[10px] tracking-[0.28em] uppercase text-[#2E2620]/70">
              {dateMDMY} · folio one of {Math.max(1, Math.ceil((post.body?.length || 0) / 2400))}
            </span>
            <span className="font-fraunces italic text-[13px] text-[#2E2620]/70">
              — set from the stone, read in order.
            </span>
          </div>
        </header>

        {/* body — narrow measure with drop cap on first paragraph */}
        <article
          className="relative prose prose-lg max-w-none font-fraunces
            prose-p:text-[#2E2620] prose-p:leading-[1.72] prose-p:text-[17px]
            prose-p:first-letter-as-dropcap
            prose-headings:font-fraunces prose-headings:italic prose-headings:text-[#1A1613]
            prose-headings:tracking-tight
            prose-h2:text-[28px] prose-h2:mt-14 prose-h2:mb-4
            prose-h3:text-[22px] prose-h3:mt-10 prose-h3:mb-3
            prose-li:text-[#2E2620] prose-li:leading-[1.68]
            prose-ul:list-none prose-ul:pl-0
            prose-ol:list-none prose-ol:pl-0
            prose-blockquote:border-0 prose-blockquote:p-0 prose-blockquote:relative
            prose-blockquote:font-fraunces prose-blockquote:italic prose-blockquote:text-[20px]
            prose-blockquote:text-[#1A1613] prose-blockquote:mx-4 prose-blockquote:my-8
            prose-hr:border-t prose-hr:border-[#1A161330] prose-hr:my-10
            prose-strong:text-[#1A1613]
            prose-em:text-[#9E4A2F]
            prose-img:border prose-img:border-[#1A161340]
            prose-code:before:content-none prose-code:after:content-none
            prose-code:font-normal
            prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0
            [&_code[class*='language-']]:!text-[#1A1613]
            [&_.token.keyword]:!text-[#5C3A87] [&_.token.keyword]:font-semibold
            [&_.token.string]:!text-[#556B2F]
            [&_.token.function]:!text-[#1F4A78] [&_.token.function]:font-semibold
            [&_.token.number]:!text-[#8A3E1C]
            [&_.token.boolean]:!text-[#8A3E1C]
            [&_.token.comment]:!text-[#8A7C68] [&_.token.comment]:italic
            [&_.token.operator]:!text-[#7A3020]
            [&_.token.punctuation]:!text-[#3A302A]
            [&_.token.class-name]:!text-[#8A4A1B] [&_.token.class-name]:font-semibold
            [&_.token.builtin]:!text-[#1F4A78]
            [&_.token.property]:!text-[#8A4A1B]
            [&_.token.constant]:!text-[#8A3E1C]
            [&_.token.tag]:!text-[#5C3A87]
            [&_.token.attr-name]:!text-[#556B2F]
            [&_.token.attr-value]:!text-[#556B2F]
            [&_.token.regex]:!text-[#5C3A87]
            [&_.token.variable]:!text-[#1A1613]
            [&_.token.symbol]:!text-[#8A3E1C]"
        >
          {/* drop cap via :first-letter on the first paragraph */}
          <style>{`
            .galley-body > p:first-of-type::first-letter {
              font-family: 'Fraunces', 'Times New Roman', serif;
              font-style: italic;
              font-weight: 500;
              float: left;
              font-size: 5.1em;
              line-height: 0.85;
              padding: 0.06em 0.1em 0 0;
              margin-right: 0.06em;
              color: #9E4A2F;
              font-variation-settings: "opsz" 144, "SOFT" 60, "WONK" 1, "wght" 500;
            }
            .galley-body ul > li::before {
              content: "—";
              display: inline-block;
              width: 1.2em;
              margin-left: -1.2em;
              color: #C96442;
              font-weight: 600;
            }
            .galley-body ol {
              counter-reset: galley-item;
            }
            .galley-body ol > li {
              counter-increment: galley-item;
              position: relative;
              padding-left: 0;
            }
            .galley-body ol > li::before {
              content: counter(galley-item, lower-roman) ".";
              color: #9E4A2F;
              font-family: 'IBM Plex Mono', monospace;
              font-size: 0.78em;
              letter-spacing: 0.06em;
              margin-right: 0.6em;
              text-transform: lowercase;
            }
            .galley-body blockquote::before {
              content: "❝";
              position: absolute;
              left: -1.4rem;
              top: -0.4rem;
              color: #C96442;
              font-size: 2.4em;
              line-height: 1;
              font-style: normal;
            }

            /* syntax theme — the syntax-highlighter code element ships with no class,
               so we anchor on the wrapper .galley-code + descendant code/span. */
            .galley-code code,
            .galley-code code span,
            .galley-code code * {
              color: #1A1613 !important;
              text-shadow: none !important;
              background: transparent !important;
            }
            .galley-code .token.comment,
            .galley-code .token.prolog,
            .galley-code .token.doctype,
            .galley-code .token.cdata { color: #8A7C68 !important; font-style: italic; }
            .galley-code .token.punctuation { color: #3A302A !important; }
            .galley-code .token.property,
            .galley-code .token.class-name,
            .galley-code .token.constant,
            .galley-code .token.symbol,
            .galley-code .token.deleted { color: #8A4A1B !important; font-weight: 600; }
            .galley-code .token.number,
            .galley-code .token.boolean { color: #8A3E1C !important; }
            .galley-code .token.selector,
            .galley-code .token.string,
            .galley-code .token.char,
            .galley-code .token.inserted,
            .galley-code .token.attr-name,
            .galley-code .token.attr-value { color: #556B2F !important; }
            .galley-code .token.operator,
            .galley-code .token.entity,
            .galley-code .token.url { color: #7A3020 !important; }
            .galley-code .token.keyword,
            .galley-code .token.atrule,
            .galley-code .token.regex,
            .galley-code .token.tag { color: #5C3A87 !important; font-weight: 600; }
            .galley-code .token.function,
            .galley-code .token.builtin { color: #1F4A78 !important; font-weight: 600; }
            .galley-code .token.important { color: #7A3020 !important; font-weight: bold; }
            .galley-code .token.bold { font-weight: bold; }
            .galley-code .token.italic { font-style: italic; }
          `}</style>

          <MarginMark glyph="¶" note="set" />
          <div className="galley-body">
            <MarkdownContent content={post.body} components={components} />
          </div>
        </article>

        {/* imprimatur signature line */}
        <div className="mt-20 pt-10 border-t border-[#1A161320]">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-[#1A161330]" />
            <span className="font-fraunces italic text-[14px] text-[#2E2620]/70 whitespace-nowrap">
              ◆ imprimatur ◆
            </span>
            <span className="h-px flex-1 bg-[#1A161330]" />
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-5 font-ibm-plex-mono text-[9px] tracking-[0.28em] uppercase text-[#2E2620]/70">
            <div>
              <div className="text-[#2E2620]/50 mb-1">Pressman</div>
              <div className="text-[#1A1613]">Fezcodex · {signature}</div>
            </div>
            <div>
              <div className="text-[#2E2620]/50 mb-1">Stone</div>
              <div className="text-[#1A1613]">Galley № {galleyNo}</div>
            </div>
            <div>
              <div className="text-[#2E2620]/50 mb-1">Ink</div>
              <div className="text-[#9E4A2F]">Terra C·96442</div>
            </div>
            <div>
              <div className="text-[#2E2620]/50 mb-1">Year</div>
              <div className="text-[#1A1613]">{year}</div>
            </div>
          </div>
        </div>

        {/* prev / next — as two more slips */}
        {(prevPost || nextPost) && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-5">
            {prevPost ? (
              <Link
                to={
                  post.attributes.series
                    ? `/blog/series/${post.attributes.series.slug}/${prevPost.slug}`
                    : `/blog/${prevPost.slug}`
                }
                className="group block border border-[#1A161340] p-5 hover:border-[#1A1613] transition-colors bg-[#F3ECE0]"
              >
                <span className="block font-ibm-plex-mono text-[9px] tracking-[0.3em] uppercase text-[#C96442] mb-2">
                  ◂ Prev slip
                </span>
                <span className="block font-fraunces italic text-[20px] leading-tight text-[#1A1613]">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextPost && (
              <Link
                to={
                  post.attributes.series
                    ? `/blog/series/${post.attributes.series.slug}/${nextPost.slug}`
                    : `/blog/${nextPost.slug}`
                }
                className="group block border border-[#1A161340] p-5 text-right hover:border-[#1A1613] transition-colors bg-[#F3ECE0]"
              >
                <span className="block font-ibm-plex-mono text-[9px] tracking-[0.3em] uppercase text-[#C96442] mb-2">
                  Next slip ▸
                </span>
                <span className="block font-fraunces italic text-[20px] leading-tight text-[#1A1613]">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </div>
        )}

        {/* fold-mark rule */}
        <div
          aria-hidden="true"
          className="mt-20 flex items-center justify-center gap-3 text-[#1A161340]"
        >
          <span className="h-px w-24 bg-[#1A161330]" />
          <span className="text-[10px] font-ibm-plex-mono tracking-[0.3em] uppercase">
            fold here
          </span>
          <span className="h-px w-24 bg-[#1A161330]" />
        </div>
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

export default GalleyBlogPostPage;
