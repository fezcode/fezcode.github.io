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
  KnitText,
  KnitIcon,
  KnitBand,
  KnitNotice,
  YARN,
  knitDate,
} from '../../components/knit';
import '../../styles/Knit.css';

const KnitCodeBlock = ({ children, onExpand, onCopy }) => {
  const element = React.Children.toArray(children).find(React.isValidElement);
  if (!element) return <pre>{children}</pre>;
  const language =
    /language-([\w-]+)/.exec(element.props.className || '')?.[1] || 'text';
  const content = String(element.props.children ?? '').replace(/\n$/, '');
  if (language === 'mermaid') return <MermaidDiagram chart={content} />;
  return (
    <div className="knt-code-block">
      <div className="knt-code-tools">
        <KnitText text={language} size="small" fg={YARN.gold} fit />
        <div className="flex gap-2">
          <button
            type="button"
            className="knt-btn"
            onClick={() => onCopy(content)}
            aria-label="Copy code"
          >
            <KnitIcon name="copy" fg={YARN.cream} />
            <KnitText text="Copy" size="small" fg={YARN.cream} fit />
          </button>
          <button
            type="button"
            className="knt-btn"
            onClick={() => onExpand({ content, language })}
            aria-label="Expand code"
          >
            <KnitIcon name="expand" fg={YARN.cream} />
            <KnitText text="Expand" size="small" fg={YARN.cream} fit />
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

const KnitBlogPostPage = () => {
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
        <KnitCodeBlock onCopy={copyCode} onExpand={setExpandedCode}>
          {children}
        </KnitCodeBlock>
      ),
      code: ({ node, inline, ...props }) => <code {...props} />,
    }),
    [copyCode],
  );

  if (loading)
    return (
      <div className="knt-root">
        <div className="knt-page">
          <KnitNotice>Unrolling this thought…</KnitNotice>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="knt-root">
        <div className="knt-page">
          <KnitNotice error>
            This article could not be loaded.{' '}
            <button
              type="button"
              className="knt-link"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          </KnitNotice>
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
    <div className="knt-root">
      <Seo
        title={`${post.title} | Fezcodex`}
        description={post.description}
        image={post.ogImage || post.image}
        keywords={post.tags}
      />
      <header className="knt-wool-moss">
        <KnitBand
          pattern={['peerie', ['snow', { bg: YARN.moss, fg: YARN.cream }], 'peerie']}
        />
        <div className="knt-page knt-reader !pb-8">
          <Link
            to={post.series ? `/blog/series/${post.series.slug}` : '/blog'}
            className="knt-btn"
          >
            <KnitIcon name="arrowLeft" fg={YARN.gold} />
            <KnitText
              text={post.series ? post.series.title : 'All writing'}
              size="small"
              fg={YARN.cream}
              fit
              maxLines={1}
            />
          </Link>
          <KnitText
            text={`${post.category || 'Writing'} · ${knitDate(post.date)} · ${calculateReadingTime(post.content)} min read`}
            size="small"
            fg={getCategoryColor('knit', post.category)}
            className="mt-8"
          />
          <KnitText as="h1" text={post.title} fg={YARN.cream} className="mt-4" />
          {post.updated && post.updated !== post.date && (
            <KnitText
              text={`Updated ${knitDate(post.updated)}`}
              size="small"
              fg={YARN.wheat}
              className="mt-4"
            />
          )}
        </div>
        <KnitBand pattern="peerie" />
      </header>
      <div className="knt-page">
        <article className="knt-reader">
          <div className="knt-patch knt-reader-patch">
            {post.description && (
              <p className="knt-reader-deck">{post.description}</p>
            )}
            <MarkdownContent
              content={content}
              components={components}
              className="knt-prose"
            />
          </div>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?search=${encodeURIComponent(tag)}`}
                  className="knt-tag"
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
                  className="knt-row"
                  to={`/blog/series/${post.series.slug}/${previous.slug}`}
                >
                  <KnitIcon name="arrowLeft" fg={YARN.gold} />
                  <div className="knt-row-body">
                    <KnitText text="Previous" size="small" fg={YARN.wheat} />
                    <KnitText
                      text={previous.title}
                      fg={YARN.cream}
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
                  className="knt-row"
                  to={`/blog/series/${post.series.slug}/${next.slug}`}
                >
                  <div className="knt-row-body">
                    <KnitText text="Next" size="small" fg={YARN.wheat} />
                    <KnitText
                      text={next.title}
                      fg={YARN.cream}
                      maxLines={2}
                      className="mt-2"
                    />
                  </div>
                  <KnitIcon name="arrowRight" fg={YARN.gold} />
                </Link>
              )}
            </nav>
          )}
          <div className="knt-section-head mt-10">
            <Link to="/blog" className="knt-link">
              More writing →
            </Link>
            <Link to="/graph" className="knt-link">
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

export default KnitBlogPostPage;
