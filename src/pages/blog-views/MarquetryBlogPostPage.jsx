import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import {
  MarquetryText,
  MarquetryIcon,
  MarquetryBand,
  MarquetryNotice,
  WOOD,
  marquetryDate,
} from '../../components/marquetry';
import '../../styles/Marquetry.css';

const MarquetryCodeBlock = ({ children, onExpand, onCopy }) => {
  const element = React.Children.toArray(children).find(React.isValidElement);
  if (!element) return <pre>{children}</pre>;
  const language =
    /language-([\w-]+)/.exec(element.props.className || '')?.[1] || 'text';
  const content = String(element.props.children ?? '').replace(/\n$/, '');
  if (language === 'mermaid') return <MermaidDiagram chart={content} />;
  return (
    <div className="mqt-code-block">
      <div className="mqt-code-tools">
        <MarquetryText text={language} size="small" fg={WOOD.teal} fit />
        <div className="flex gap-2">
          <button
            type="button"
            className="mqt-btn"
            onClick={() => onCopy(content)}
            aria-label="Copy code"
          >
            <MarquetryIcon name="copy" fg={WOOD.ink} />
            <MarquetryText text="Copy" size="small" fg={WOOD.ink} fit />
          </button>
          <button
            type="button"
            className="mqt-btn"
            onClick={() => onExpand({ content, language })}
            aria-label="Expand code"
          >
            <MarquetryIcon name="expand" fg={WOOD.ink} />
            <MarquetryText text="Expand" size="small" fg={WOOD.ink} fit />
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        style={customTheme}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '20px',
          background: 'transparent',
          fontSize: '14px',
          lineHeight: 1.7,
        }}
        codeTagProps={{
          style: {
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            background: 'transparent',
          },
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

const MarquetryBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
  const currentSlug = episodeSlug || slug;
  const navigate = useNavigate();
  const { addToast } = useToast();
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
        <MarquetryCodeBlock onCopy={copyCode} onExpand={setExpandedCode}>
          {children}
        </MarquetryCodeBlock>
      ),
      code: ({ node, inline, ...props }) => <code {...props} />,
    }),
    [copyCode],
  );

  if (loading)
    return (
      <div className="mqt-root">
        <div className="mqt-page">
          <MarquetryNotice>Opening this thought…</MarquetryNotice>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="mqt-root">
        <div className="mqt-page">
          <MarquetryNotice error>
            This article could not be loaded.{' '}
            <button
              type="button"
              className="mqt-link"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          </MarquetryNotice>
        </div>
      </div>
    );
  if (!post) return null;
  const index = post.chapters.findIndex(
    (chapter) => chapter.slug === currentSlug,
  );
  const previous = post.chapters[index - 1];
  const next = post.chapters[index + 1];
  const content = post.content.replace(/^# [^\r\n]+\r?\n/, '');
  return (
    <div className="mqt-root">
      <Seo
        title={`${post.title} | Fezcodex`}
        description={post.description}
        image={post.ogImage || post.image}
        keywords={post.tags}
      />
      <header className="mqt-wood-moss">
        <MarquetryBand
          pattern={[
            'peerie',
            ['snow', { bg: WOOD.moss, fg: WOOD.ink }],
            'peerie',
          ]}
        />
        <div className="mqt-page mqt-reader !pb-8">
          <Link
            to={post.series ? `/blog/series/${post.series.slug}` : '/blog'}
            className="mqt-btn"
          >
            <MarquetryIcon name="arrowLeft" fg={WOOD.teal} />
            <MarquetryText
              text={post.series ? post.series.title : 'All writing'}
              size="small"
              fg={WOOD.ink}
              fit
              maxLines={1}
            />
          </Link>
          <MarquetryText
            text={`${post.category || 'Writing'} · ${marquetryDate(post.date)} · ${calculateReadingTime(post.content)} min read`}
            size="small"
            fg={getCategoryColor('marquetry', post.category)}
            className="mt-8"
          />
          <MarquetryText
            as="h1"
            text={post.title}
            fg={WOOD.ink}
            className="mt-4"
          />
          {post.updated && post.updated !== post.date && (
            <MarquetryText
              text={`Updated ${marquetryDate(post.updated)}`}
              size="small"
              fg={WOOD.bark}
              className="mt-4"
            />
          )}
        </div>
        <MarquetryBand pattern="peerie" />
      </header>
      <div className="mqt-page">
        <article className="mqt-reader">
          <div className="mqt-patch mqt-reader-patch">
            {post.description && (
              <p className="mqt-reader-deck">{post.description}</p>
            )}
            <MarkdownContent
              content={content}
              components={components}
              className="mqt-prose"
            />
          </div>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?search=${encodeURIComponent(tag)}`}
                  className="mqt-tag"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          {post.series && (
            <nav
              className="grid gap-3 sm:grid-cols-2 mt-8"
              aria-label="Series chapters"
            >
              {previous ? (
                <Link
                  className="mqt-row"
                  to={`/blog/series/${post.series.slug}/${previous.slug}`}
                >
                  <MarquetryIcon name="arrowLeft" fg={WOOD.teal} />
                  <div className="mqt-row-body">
                    <MarquetryText
                      text="Previous"
                      size="small"
                      fg={WOOD.bark}
                    />
                    <MarquetryText
                      text={previous.title}
                      fg={WOOD.ink}
                      maxLines={2}
                      className="mt-2"
                    />
                  </div>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  className="mqt-row"
                  to={`/blog/series/${post.series.slug}/${next.slug}`}
                >
                  <div className="mqt-row-body">
                    <MarquetryText text="Next" size="small" fg={WOOD.bark} />
                    <MarquetryText
                      text={next.title}
                      fg={WOOD.ink}
                      maxLines={2}
                      className="mt-2"
                    />
                  </div>
                  <MarquetryIcon name="arrowRight" fg={WOOD.teal} />
                </Link>
              )}
            </nav>
          )}
          <div className="mqt-section-head mt-10">
            <Link to="/blog" className="mqt-link">
              More writing →
            </Link>
            <Link to="/graph" className="mqt-link">
              Follow another thread ↗
            </Link>
          </div>
        </article>
      </div>
      <CodeModal
        isOpen={!!expandedCode}
        onClose={() => setExpandedCode(null)}
        language={expandedCode?.language}
      >
        {expandedCode?.content}
      </CodeModal>
    </div>
  );
};

export default MarquetryBlogPostPage;
