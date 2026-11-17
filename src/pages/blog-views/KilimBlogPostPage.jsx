import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../../utils/customTheme';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import { calculateReadingTime } from '../../utils/readingTime';
import Seo from '../../components/Seo';
import TagLink from '../../components/TagLink';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import MermaidDiagram from '../../components/MermaidDiagram';
import CodeModal from '../../components/CodeModal';
import { useToast } from '../../hooks/useToast';
import {
  KilimText,
  KilimIcon,
  KilimBand,
  KilimNotice,
  WOOL,
  kilimDate,
} from '../../components/kilim';
import '../../styles/Kilim.css';
import '../kilim-views/kilim-content.css';

const KilimCodeBlock = ({ children, onExpand, onCopy }) => {
  const element = React.Children.toArray(children).find(React.isValidElement);
  if (!element) return <pre>{children}</pre>;
  const language =
    /language-([\w-]+)/.exec(element.props.className || '')?.[1] || 'text';
  const content = String(element.props.children ?? '').replace(/\n$/, '');
  if (language === 'mermaid') return <MermaidDiagram chart={content} />;
  return (
    <div className="klm-post-code">
      <div className="klm-post-code-tools">
        <span className="klm-label klm-post-code-lang">{language}</span>
        <div className="flex gap-2">
          <button
            type="button"
            className="klm-btn klm-btn-small"
            onClick={() => onCopy(content)}
            aria-label="Copy code"
          >
            <KilimIcon name="copy" fg={WOOL.walnut} />
            Copy
          </button>
          <button
            type="button"
            className="klm-btn klm-btn-small klm-btn-ivory"
            onClick={() => onExpand({ content, language })}
            aria-label="Expand code"
          >
            <KilimIcon name="expand" fg={WOOL.walnut} />
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

const KilimBlogPostPage = () => {
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
        <KilimCodeBlock onCopy={copyCode} onExpand={setExpandedCode}>
          {children}
        </KilimCodeBlock>
      ),
      code: ({ node, inline, ...props }) => <code {...props} />,
    }),
    [copyCode],
  );

  if (loading)
    return (
      <div className="klm-root">
        <div className="klm-page">
          <KilimNotice>Unrolling this thought…</KilimNotice>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="klm-root">
        <div className="klm-page">
          <KilimNotice error>
            This article could not be loaded.
            <button
              type="button"
              className="klm-link klm-btn-link"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          </KilimNotice>
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
    <div className="klm-root">
      <Seo
        title={`${post.title} | Fezcodex`}
        description={post.description}
        image={post.ogImage || post.image}
        keywords={post.tags}
      />
      <div className="klm-page klm-post">
        <article className="klm-post-runner">
          <KilimBand pattern={['end', 'chain']} />
          <header className="klm-post-head">
            <Link
              to={post.series ? `/blog/series/${post.series.slug}` : '/blog'}
              className="klm-btn klm-btn-ivory klm-btn-small"
            >
              <span aria-hidden="true">←</span>
              {post.series ? post.series.title : 'All writing'}
            </Link>
            <div className="klm-post-meta">
              <span className="klm-tag">{post.category || 'Writing'}</span>
              <span className="klm-label">
                {kilimDate(post.date)} · {calculateReadingTime(post.content)} min
                read
              </span>
              {post.updated && post.updated !== post.date && (
                <span className="klm-label">
                  · Updated {kilimDate(post.updated)}
                </span>
              )}
            </div>
            <KilimText as="h1" text={post.title} className="klm-post-title" />
          </header>
          <KilimBand pattern="teeth" />
          <div className="klm-post-body">
            {post.description && (
              <p className="klm-post-deck">{post.description}</p>
            )}
            <MarkdownContent
              content={content}
              components={components}
              className="klm-prose"
            />
          </div>
          <div className="klm-post-foot">
            {post.tags?.length > 0 && (
              <div className="klm-tags">
                {post.tags.map((tag) => (
                  <TagLink key={tag} tag={tag} className="klm-tag">
                    #{tag}
                  </TagLink>
                ))}
              </div>
            )}
            {post.series && (
              <nav className="klm-post-chapters" aria-label="Series chapters">
                {previous ? (
                  <Link
                    className="klm-post-chapter"
                    to={`/blog/series/${post.series.slug}/${previous.slug}`}
                  >
                    <KilimIcon name="arrowLeft" fg={WOOL.saffron} />
                    <div className="min-w-0">
                      <span className="klm-label">Previous</span>
                      <p className="klm-row-title">{previous.title}</p>
                    </div>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link
                    className="klm-post-chapter klm-post-chapter-next"
                    to={`/blog/series/${post.series.slug}/${next.slug}`}
                  >
                    <div className="min-w-0">
                      <span className="klm-label">Next</span>
                      <p className="klm-row-title">{next.title}</p>
                    </div>
                    <KilimIcon name="arrowRight" fg={WOOL.saffron} />
                  </Link>
                )}
              </nav>
            )}
            <div className="klm-post-links">
              <Link to="/blog" className="klm-link">
                More writing →
              </Link>
              <Link to="/graph" className="klm-link">
                Follow another thread ↗
              </Link>
            </div>
          </div>
          <KilimBand pattern={['chain', 'end']} />
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

export default KilimBlogPostPage;
