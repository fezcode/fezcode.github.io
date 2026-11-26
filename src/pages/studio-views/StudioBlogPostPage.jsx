import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowsOutSimpleIcon,
  CopyIcon,
} from '@phosphor-icons/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { studioSyntaxTheme } from '../../components/studio/studioSyntaxTheme';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import { calculateReadingTime } from '../../utils/readingTime';
import { getCategoryColor } from '../../utils/categoryColors';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import MermaidDiagram from '../../components/MermaidDiagram';
import CodeModal from '../../components/CodeModal';
import TagLink from '../../components/TagLink';
import StudioBlogShareModal from '../../components/studio/StudioBlogShareModal';
import { StudioNotice } from '../../components/studio';
import { studioDate } from '../../components/studio/useStudioContent';
import { useToast } from '../../hooks/useToast';
import '../../styles/Studio.css';

const StudioCodeBlock = ({ children, onExpand, onCopy }) => {
  const element = React.Children.toArray(children).find(React.isValidElement);
  if (!element) return <pre>{children}</pre>;
  const language =
    /language-([\w-]+)/.exec(element.props.className || '')?.[1] || 'text';
  const content = String(element.props.children ?? '').replace(/\n$/, '');
  if (language === 'mermaid') return <MermaidDiagram chart={content} />;
  return (
    <div className="std-code-block">
      <div className="std-code-tools">
        <span className="std-label">{language}</span>
        <div className="flex gap-2">
          <button
            type="button"
            className="std-btn"
            onClick={() => onCopy(content)}
            aria-label="Copy code"
          >
            <CopyIcon size={15} />
            Copy
          </button>
          <button
            type="button"
            className="std-btn"
            onClick={() => onExpand({ content, language })}
            aria-label="Expand code"
          >
            <ArrowsOutSimpleIcon size={15} />
            Expand
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        style={studioSyntaxTheme}
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

const StudioBlogPostPage = () => {
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
        <MarkdownLink {...props} className="std-accent" />
      ),
      pre: ({ children }) => (
        <StudioCodeBlock onCopy={copyCode} onExpand={setExpandedCode}>
          {children}
        </StudioCodeBlock>
      ),
      code: ({ node, inline, ...props }) => <code {...props} />,
    }),
    [copyCode],
  );

  if (loading)
    return (
      <div className="std-root">
        <div className="std-page">
          <StudioNotice>Opening this thought…</StudioNotice>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="std-root">
        <div className="std-page">
          <StudioNotice error>
            This article could not be loaded.{' '}
            <button
              type="button"
              className="std-link"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          </StudioNotice>
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
    <div className="std-root">
      <Seo
        title={`${post.title} | Fezcodex`}
        description={post.description}
        image={post.ogImage || post.image}
        keywords={post.tags}
      />
      <div className="std-page">
        <article className="std-reader">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to={post.series ? `/blog/series/${post.series.slug}` : '/blog'}
              className="std-link"
            >
              <ArrowLeftIcon size={16} />
              {post.series ? post.series.title : 'All writing'}
            </Link>
            <StudioBlogShareModal
              title={post.title}
              image={post.ogImage || post.image}
              className="std-btn"
              iconSize={15}
            />
          </div>
          <header className="mt-10">
            <p className="std-eyebrow">
              <span
                style={{
                  color: getCategoryColor('studio', post.category),
                  fontWeight: 500,
                }}
              >
                {post.category || 'Writing'}
              </span>{' '}
              · {studioDate(post.date)} · {calculateReadingTime(post.content)}{' '}
              min read
            </p>
            <h1 className="std-reader-heading">{post.title}</h1>
            {post.description && (
              <p className="std-reader-deck">{post.description}</p>
            )}
            {post.updated && post.updated !== post.date && (
              <p className="std-label mt-4">
                Updated {studioDate(post.updated)}
              </p>
            )}
          </header>
          <MarkdownContent
            content={content}
            components={components}
            className="std-reading-prose"
          />
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10">
              {post.tags.map((tag) => (
                <TagLink key={tag} tag={tag} className="std-chip">
                  {tag}
                </TagLink>
              ))}
            </div>
          )}
          {post.series && (
            <nav
              className="flex flex-wrap justify-between gap-5 mt-10 pt-6 border-t"
              style={{ borderColor: 'var(--std-rule)' }}
              aria-label="Series chapters"
            >
              {previous && (
                <Link
                  className="std-link"
                  to={`/blog/series/${post.series.slug}/${previous.slug}`}
                >
                  ← {previous.title}
                </Link>
              )}
              {next && (
                <Link
                  className="std-link"
                  to={`/blog/series/${post.series.slug}/${next.slug}`}
                >
                  {next.title} →
                </Link>
              )}
            </nav>
          )}
          <div
            className="std-section-head mt-12 pt-6 border-t"
            style={{ borderColor: 'var(--std-rule)' }}
          >
            <Link to="/blog" className="std-link">
              More writing →
            </Link>
            <Link to="/graph" className="std-link">
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

export default StudioBlogPostPage;
