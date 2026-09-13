import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowsOutSimpleIcon,
  CopyIcon,
} from '@phosphor-icons/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../../utils/customTheme';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import { calculateReadingTime } from '../../utils/readingTime';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import MermaidDiagram from '../../components/MermaidDiagram';
import CodeModal from '../../components/CodeModal';
import { OrbitNotice } from '../../components/orbit';
import { orbitDate } from '../../components/orbit/useOrbitContent';
import { useToast } from '../../hooks/useToast';
import '../../styles/Orbit.css';

const OrbitCodeBlock = ({ children, onExpand, onCopy }) => {
  const element = React.Children.toArray(children).find(React.isValidElement);
  if (!element) return <pre>{children}</pre>;
  const language =
    /language-([\w-]+)/.exec(element.props.className || '')?.[1] || 'text';
  const content = String(element.props.children ?? '').replace(/\n$/, '');
  if (language === 'mermaid') return <MermaidDiagram chart={content} />;
  return (
    <div className="orb-code-block">
      <div className="orb-code-tools">
        <span className="orb-label">{language}</span>
        <div className="flex gap-2">
          <button
            type="button"
            className="orb-btn"
            onClick={() => onCopy(content)}
            aria-label="Copy code"
          >
            <CopyIcon size={15} />
            Copy
          </button>
          <button
            type="button"
            className="orb-btn"
            onClick={() => onExpand({ content, language })}
            aria-label="Expand code"
          >
            <ArrowsOutSimpleIcon size={15} />
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
          padding: '22px',
          background: 'transparent',
          fontSize: '14px',
          lineHeight: 1.7,
        }}
        codeTagProps={{
          style: {
            fontFamily: "'IBM Plex Mono', monospace",
            background: 'transparent',
          },
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

const OrbitBlogPostPage = () => {
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
      a: ({ node, ...props }) => (
        <MarkdownLink {...props} className="orb-accent" />
      ),
      pre: ({ children }) => (
        <OrbitCodeBlock onCopy={copyCode} onExpand={setExpandedCode}>
          {children}
        </OrbitCodeBlock>
      ),
      code: ({ node, inline, ...props }) => <code {...props} />,
    }),
    [copyCode],
  );

  if (loading)
    return (
      <div className="orb-root">
        <div className="orb-page">
          <OrbitNotice>Opening this thought…</OrbitNotice>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="orb-root">
        <div className="orb-page">
          <OrbitNotice error>
            This article could not be loaded.{' '}
            <button
              type="button"
              className="orb-link"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          </OrbitNotice>
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
    <div className="orb-root">
      <Seo
        title={`${post.title} | Fezcodex`}
        description={post.description}
        image={post.ogImage || post.image}
        keywords={post.tags}
      />
      <div className="orb-page">
        <article className="orb-reader">
          <Link
            to={post.series ? `/blog/series/${post.series.slug}` : '/blog'}
            className="orb-link"
          >
            <ArrowLeftIcon size={16} />
            {post.series ? post.series.title : 'All writing'}
          </Link>
          <header className="mt-10">
            <p className="orb-eyebrow">
              {post.category || 'Writing'} · {orbitDate(post.date)} ·{' '}
              {calculateReadingTime(post.content)} min read
            </p>
            <h1 className="orb-reader-heading">{post.title}</h1>
            {post.description && (
              <p className="orb-reader-deck">{post.description}</p>
            )}
            {post.updated && post.updated !== post.date && (
              <p className="orb-label mt-4">
                Updated {orbitDate(post.updated)}
              </p>
            )}
          </header>
          <MarkdownContent
            content={content}
            components={components}
            className="orb-reading-prose"
          />
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?search=${encodeURIComponent(tag)}`}
                  className="orb-chip"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          {post.series && (
            <nav
              className="flex flex-wrap justify-between gap-5 mt-10 pt-6 border-t"
              style={{ borderColor: 'var(--orb-rule)' }}
              aria-label="Series chapters"
            >
              {previous && (
                <Link
                  className="orb-link"
                  to={`/blog/series/${post.series.slug}/${previous.slug}`}
                >
                  ← {previous.title}
                </Link>
              )}
              {next && (
                <Link
                  className="orb-link"
                  to={`/blog/series/${post.series.slug}/${next.slug}`}
                >
                  {next.title} →
                </Link>
              )}
            </nav>
          )}
          <div
            className="orb-section-head mt-12 pt-6 border-t"
            style={{ borderColor: 'var(--orb-rule)' }}
          >
            <Link to="/blog" className="orb-link">
              More writing →
            </Link>
            <Link to="/graph" className="orb-link">
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

export default OrbitBlogPostPage;
