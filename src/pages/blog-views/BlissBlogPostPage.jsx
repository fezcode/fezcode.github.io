import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsOutSimpleIcon,
  BooksIcon,
  CopyIcon,
  FileTextIcon,
  InfoIcon,
  ListNumbersIcon,
} from '@phosphor-icons/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../../utils/customTheme';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import { calculateReadingTime } from '../../utils/readingTime';
import { getCategoryColor } from '../../utils/categoryColors';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import MermaidDiagram from '../../components/MermaidDiagram';
import CodeModal from '../../components/CodeModal';
import { useToast } from '../../hooks/useToast';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import {
  BlissWallpaper,
  BlissWindow,
  BlissNotice,
  BlissTitleLink,
  blissDate,
} from '../../components/bliss';
import '../../styles/Bliss.css';

/**
 * The reader is normally drawn inside the Bliss Layout (which supplies the
 * appframe and wallpaper). When it is chosen as the blog mode under another
 * site theme (`fezBlogMode=bliss`, `?theme=bliss`), it brings its own desktop.
 */
const BlissFrame = ({ standalone, children }) =>
  standalone ? (
    <div className="bl-appframe min-h-screen w-full !pb-0">
      <BlissWallpaper />
      <div className="bl-root">{children}</div>
    </div>
  ) : (
    <div className="bl-root">{children}</div>
  );

const BlissCodeBlock = ({ children, onExpand, onCopy }) => {
  const element = React.Children.toArray(children).find(React.isValidElement);
  if (!element) return <pre>{children}</pre>;
  const language =
    /language-([\w-]+)/.exec(element.props.className || '')?.[1] || 'text';
  const content = String(element.props.children ?? '').replace(/\n$/, '');
  if (language === 'mermaid') return <MermaidDiagram chart={content} />;
  return (
    <div className="border border-[#7f9db9] bg-[var(--bl-window)]">
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 border-b border-[var(--bl-line)]">
        <span className="bl-label px-1">{language}</span>
        <div className="flex gap-2">
          <button
            type="button"
            className="bl-btn bl-btn-sm"
            onClick={() => onCopy(content)}
            aria-label="Copy code"
          >
            <CopyIcon size={15} aria-hidden="true" />
            Copy
          </button>
          <button
            type="button"
            className="bl-btn bl-btn-sm"
            onClick={() => onExpand({ content, language })}
            aria-label="Expand code"
          >
            <ArrowsOutSimpleIcon size={15} aria-hidden="true" />
            Expand
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        style={customTheme}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '18px',
          background: '#1f2937',
          fontSize: '14px',
          lineHeight: 1.7,
        }}
        codeTagProps={{
          style: {
            fontFamily: "'Lucida Console', Consolas, ui-monospace, monospace",
            fontSize: 'inherit',
            background: 'transparent',
            border: 0,
            padding: 0,
          },
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

const BlissBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
  const currentSlug = episodeSlug || slug;
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { fezcodexTheme } = useVisualSettings();
  const standalone = fezcodexTheme !== 'bliss';
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedCode, setExpandedCode] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    setPost(null);
    const load = async () => {
      try {
        const { allPostsData, processedPosts } = await fetchAllBlogPosts();
        if (controller.signal.aborted) return;
        if (!processedPosts.length)
          throw new Error('The writing index could not be loaded.');
        const metadata = processedPosts.find(
          (item) => item.slug === currentSlug,
        );
        if (!metadata) {
          navigate('/404', { replace: true });
          return;
        }
        const response = await fetch(`/posts/${metadata.filename}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('The article could not be loaded.');
        const content = await response.text();
        if (controller.signal.aborted) return;
        const series = metadata.series
          ? allPostsData.find((item) => item.slug === metadata.series.slug)
              ?.series.posts || []
          : [];
        setPost({ ...metadata, content, chapters: series });
      } catch (err) {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [currentSlug, navigate, retry]);

  const copyCode = useCallback(
    async (content) => {
      try {
        await navigator.clipboard.writeText(content);
        addToast({
          title: 'Copied',
          message: 'Code copied to clipboard.',
          type: 'success',
        });
      } catch {
        addToast({
          title: 'Could not copy',
          message: 'Select the code to copy it manually.',
          type: 'error',
        });
      }
    },
    [addToast],
  );
  const components = useMemo(
    () => ({
      a: ({ node, ...props }) => <MarkdownLink {...props} />,
      pre: ({ children }) => (
        <BlissCodeBlock onCopy={copyCode} onExpand={setExpandedCode}>
          {children}
        </BlissCodeBlock>
      ),
      code: ({ node, inline, ...props }) => <code {...props} />,
    }),
    [copyCode],
  );

  if (loading)
    return (
      <BlissFrame standalone={standalone}>
        <div className="bl-page">
          <BlissWindow title="Opening…" icon={FileTextIcon} tone="blue">
            <BlissNotice>Unrolling this thought…</BlissNotice>
          </BlissWindow>
        </div>
      </BlissFrame>
    );
  if (error)
    return (
      <BlissFrame standalone={standalone}>
        <div className="bl-page">
          <BlissWindow title="Document error" icon={FileTextIcon} tone="red">
            <BlissNotice error>
              This article could not be loaded.{' '}
              <button
                type="button"
                className="bl-link"
                onClick={() => setRetry((value) => value + 1)}
              >
                Try again
              </button>
            </BlissNotice>
          </BlissWindow>
        </div>
      </BlissFrame>
    );
  if (!post) return null;
  const index = post.chapters.findIndex(
    (chapter) => chapter.slug === currentSlug,
  );
  const previous = post.chapters[index - 1];
  const next = post.chapters[index + 1];
  const content = post.content.replace(/^# [^\r\n]+\r?\n/, '');
  const readingTime = calculateReadingTime(post.content);
  const wordCount = post.content
    .split(/\s+/)
    .filter((word) => word !== '').length;
  const categoryColor = getCategoryColor('bliss', post.category);
  const backTo = post.series ? `/blog/series/${post.series.slug}` : '/blog';
  const backLabel = post.series ? post.series.title : 'All writing';
  const wasUpdated = post.updated && post.updated !== post.date;

  return (
    <BlissFrame standalone={standalone}>
      <Seo
        title={`${post.title} | Fezcodex`}
        description={post.description}
        image={post.ogImage || post.image}
        keywords={post.tags}
      />
      <div className="bl-page">
        <div className="grid gap-[clamp(16px,2.4vw,26px)] items-start lg:grid-cols-[minmax(0,1fr)_300px]">
          <BlissWindow
            as="article"
            title={post.title}
            icon={FileTextIcon}
            tone="blue"
            headingLevel={null}
            actions={
              <BlissTitleLink
                to={backTo}
                className="bl-titlebar-link bl-hide-sm max-w-[220px] truncate"
              >
                ← {backLabel}
              </BlissTitleLink>
            }
            status={
              <>
                <span>
                  {readingTime} min read · {wordCount.toLocaleString('en-GB')}{' '}
                  words
                </span>
                <span>
                  {post.series && index >= 0
                    ? `Chapter ${index + 1} of ${post.chapters.length}`
                    : blissDate(post.date)}
                </span>
              </>
            }
          >
            <header className="mb-5">
              <Link to={backTo} className="bl-btn bl-btn-sm max-w-full">
                <ArrowLeftIcon size={15} weight="bold" aria-hidden="true" />
                <span className="truncate">{backLabel}</span>
              </Link>
              <p className="bl-meta flex flex-wrap items-center gap-2 mt-5 mb-0">
                <span
                  className="inline-flex items-center rounded-sm px-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
                  style={{ background: categoryColor, lineHeight: '18px' }}
                >
                  {post.category || 'Writing'}
                </span>
                <span>{blissDate(post.date)}</span>
                <span aria-hidden="true">·</span>
                <span>{readingTime} min read</span>
              </p>
              <h1 className="bl-display mt-3">{post.title}</h1>
              {wasUpdated && (
                <p className="bl-meta mt-3 mb-0">
                  Updated {blissDate(post.updated)}
                </p>
              )}
            </header>
            <div className="bl-paper">
              {post.description && (
                <p className="mt-0 mb-6 text-lg leading-relaxed text-[var(--bl-muted)] italic">
                  {post.description}
                </p>
              )}
              <MarkdownContent
                content={content}
                components={components}
                className="bl-prose"
              />
            </div>
            <div className="flex flex-wrap justify-between gap-3 mt-5">
              <Link to="/blog" className="bl-link">
                More writing →
              </Link>
              <Link to="/graph" className="bl-link">
                Follow another thread ↗
              </Link>
            </div>
          </BlissWindow>

          <div className="flex flex-col gap-[clamp(16px,2.4vw,26px)] lg:sticky lg:top-16">
            <BlissWindow
              title="Properties"
              icon={InfoIcon}
              tone="teal"
              titleId="bl-post-properties"
              inactive
            >
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 m-0 text-sm">
                <dt className="bl-label">Category</dt>
                <dd className="m-0 font-bold" style={{ color: categoryColor }}>
                  {post.category || 'Writing'}
                </dd>
                <dt className="bl-label">Published</dt>
                <dd className="m-0">{blissDate(post.date)}</dd>
                {wasUpdated && (
                  <>
                    <dt className="bl-label">Updated</dt>
                    <dd className="m-0">{blissDate(post.updated)}</dd>
                  </>
                )}
                <dt className="bl-label">Reading</dt>
                <dd className="m-0">{readingTime} min</dd>
                <dt className="bl-label">Words</dt>
                <dd className="m-0">{wordCount.toLocaleString('en-GB')}</dd>
              </dl>
              {post.tags?.length > 0 && (
                <div className="bl-groupbox mt-5">
                  <span className="bl-groupbox-label">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blog?search=${encodeURIComponent(tag)}`}
                        className="bl-tag"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </BlissWindow>

            {post.series && post.chapters.length > 0 && (
              <BlissWindow
                title={post.series.title || 'Series'}
                icon={ListNumbersIcon}
                tone="pink"
                titleId="bl-post-series"
                flush
                status={<span>{post.chapters.length} chapters</span>}
              >
                <nav aria-label="Chapters in this series" className="bg-white">
                  <ol className="m-0 p-0 list-none max-h-[50vh] overflow-y-auto">
                    {post.chapters.map((chapter, position) => {
                      const current = chapter.slug === currentSlug;
                      return (
                        <li key={chapter.slug}>
                          <Link
                            to={`/blog/series/${post.series.slug}/${chapter.slug}`}
                            className={`bl-row !min-h-[40px] text-sm ${current ? 'bl-row-selected' : ''}`}
                            aria-current={current ? 'page' : undefined}
                          >
                            <span className="bl-meta w-6 shrink-0 text-right">
                              {position + 1}.
                            </span>
                            <span className="flex-1 min-w-0 line-clamp-2">
                              {chapter.title}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              </BlissWindow>
            )}
          </div>
        </div>

        {post.series && (previous || next) && (
          <BlissWindow
            title="Continue the series"
            icon={BooksIcon}
            tone="purple"
            titleId="bl-post-series-nav"
          >
            <nav className="grid gap-3 sm:grid-cols-2" aria-label="Series chapters">
              {previous ? (
                <Link
                  className="bl-row bg-white !border !border-solid !border-[var(--bl-line)] !min-h-[64px]"
                  to={`/blog/series/${post.series.slug}/${previous.slug}`}
                >
                  <ArrowLeftIcon size={20} weight="bold" aria-hidden="true" />
                  <span className="bl-row-body">
                    <span className="bl-meta">Previous</span>
                    <span className="bl-row-title line-clamp-2">
                      {previous.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  className="bl-row bg-white !border !border-solid !border-[var(--bl-line)] !min-h-[64px] text-right"
                  to={`/blog/series/${post.series.slug}/${next.slug}`}
                >
                  <span className="bl-row-body">
                    <span className="bl-meta">Next</span>
                    <span className="bl-row-title line-clamp-2">
                      {next.title}
                    </span>
                  </span>
                  <ArrowRightIcon size={20} weight="bold" aria-hidden="true" />
                </Link>
              )}
            </nav>
          </BlissWindow>
        )}
      </div>
      <CodeModal
        isOpen={!!expandedCode}
        onClose={() => setExpandedCode(null)}
        language={expandedCode?.language}
      >
        {expandedCode?.content}
      </CodeModal>
    </BlissFrame>
  );
};

export default BlissBlogPostPage;
