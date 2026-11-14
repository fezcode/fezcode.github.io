import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRightIcon,
  ArticleIcon,
  BookmarkSimpleIcon,
  CubeIcon,
  HouseIcon,
  ShapesIcon,
  ShuffleIcon,
  WrenchIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useHomepageOrder } from '../../context/HomepageOrderContext';
import { getCategoryColor } from '../../utils/categoryColors';
import {
  BlissWindow,
  BlissIcon,
  BlissNotice,
  BlissDesktopIcon,
  BlissTitleLink,
  BlissProjectCard,
  useBlissIndex,
  blissApps,
  blissPosts,
  blissDate,
  blissPostLink,
} from '../../components/bliss';
import '../../styles/Bliss.css';

const DEFAULT_TAGLINE =
  'Experimental software, field notes, and small instruments for a curious life.';

const BlissHomePage = () => {
  const { config } = useSiteConfig();
  const { projects, loading, error } = useProjects(true);
  const blog = useBlissIndex('/posts/posts.json');
  const collection = useBlissIndex('/apps/apps.json');
  const { sectionOrder: order } = useHomepageOrder();
  const posts = blissPosts(blog.data).slice(0, 3);
  const apps = blissApps(collection.data);
  const workbench = ['ebru', 'fezynth', 'logic-architect']
    .map((slug) => apps.find((app) => app.slug === slug))
    .filter(Boolean);
  // A random four of the pinned projects on each visit. The draw happens after
  // mount so the prerendered HTML (the first four) and hydration agree.
  const [shuffled, setShuffled] = useState(null);
  useEffect(() => {
    if (!projects.length) return;
    const deck = [...projects];
    for (let i = deck.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setShuffled(deck.slice(0, 4));
  }, [projects]);
  const featured = shuffled || projects.slice(0, 4);
  const tagline = config?.hero?.tagline || DEFAULT_TAGLINE;

  const sections = {
    projects: (
      <BlissWindow
        key="projects"
        title="Selected works"
        icon={CubeIcon}
        tone="yellow"
        actions={
          <BlissTitleLink to="/projects" aria-label="The archive">
            The archive →
          </BlissTitleLink>
        }
        status={
          !loading && !error ? (
            <>
              <span>{featured.length} objects</span>
              <span>A random draw from the pinned projects</span>
            </>
          ) : undefined
        }
      >
        {loading ? (
          <BlissNotice>Opening the project collection…</BlissNotice>
        ) : error ? (
          <BlissNotice error>The projects could not be loaded.</BlissNotice>
        ) : (
          <div className="bl-grid">
            {featured.map((project) => (
              <BlissProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </BlissWindow>
    ),
    blogposts: (
      <div className="bl-split" key="blogposts">
        <BlissWindow
          title="Recent writing"
          icon={ArticleIcon}
          tone="blue"
          flush
          actions={
            <BlissTitleLink to="/blog" aria-label="All writing">
              All writing →
            </BlissTitleLink>
          }
        >
          {blog.loading ? (
            <div className="p-4">
              <BlissNotice>Fetching the notes…</BlissNotice>
            </div>
          ) : blog.error ? (
            <div className="p-4">
              <BlissNotice error>The writing could not be loaded.</BlissNotice>
            </div>
          ) : (
            <div className="bl-paper !p-0">
              {posts.map((post) => {
                const label = post.series
                  ? 'Series'
                  : post.category || 'Writing';
                return (
                  <Link
                    key={post.slug}
                    to={blissPostLink(post)}
                    className="bl-row"
                  >
                    <BlissIcon icon={ArticleIcon} seed={post.slug} size={32} />
                    <div className="bl-row-body">
                      <h3 className="bl-row-title m-0 line-clamp-3">
                        {post.title}
                      </h3>
                      <span className="bl-meta inline-flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            background: getCategoryColor(
                              'bliss',
                              post.series ? 'series' : post.category,
                            ),
                          }}
                        />
                        {label} · {blissDate(post.updated || post.date)}
                      </span>
                    </div>
                    <ArrowUpRightIcon
                      size={18}
                      weight="bold"
                      aria-hidden="true"
                      className="shrink-0"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </BlissWindow>
        <BlissWindow
          title="The workbench"
          icon={WrenchIcon}
          tone="orange"
          flush
          actions={
            <BlissTitleLink to="/apps" aria-label={`${apps.length || ''} apps`}>
              {`${apps.length || ''} apps →`}
            </BlissTitleLink>
          }
          status={
            <>
              <span>{workbench.length} objects</span>
              <Link className="bl-link" to="/logs">
                Things worth keeping →
              </Link>
            </>
          }
        >
          {collection.error ? (
            <div className="p-4">
              <BlissNotice error>
                The app collection could not be loaded.
              </BlissNotice>
            </div>
          ) : (
            <div className="bl-paper !p-0">
              {workbench.map((app) => (
                <Link to={app.to} key={app.slug} className="bl-row">
                  <BlissIcon
                    icon={app.icon || 'ShapesIcon'}
                    seed={app.slug}
                    size={32}
                  />
                  <div className="bl-row-body">
                    <h3 className="bl-row-title m-0 line-clamp-2">
                      {app.title}
                    </h3>
                    <span className="bl-meta">{app.categoryName}</span>
                  </div>
                  <ArrowUpRightIcon
                    size={18}
                    weight="bold"
                    aria-hidden="true"
                    className="shrink-0"
                  />
                </Link>
              ))}
            </div>
          )}
        </BlissWindow>
      </div>
    ),
  };

  return (
    <div className="bl-root">
      <Seo
        title={`${config?.hero?.title || 'Fezcodex'} | Bliss`}
        description={tagline}
      />
      <div className="bl-page">
        <nav className="bl-desktop-icons" aria-label="Desktop shortcuts">
          <BlissDesktopIcon
            to="/projects"
            icon={CubeIcon}
            tone="yellow"
            label="Projects"
          />
          <BlissDesktopIcon
            to="/apps"
            icon={ShapesIcon}
            tone="orange"
            label="Apps"
          />
          <BlissDesktopIcon
            to="/blog"
            icon={ArticleIcon}
            tone="blue"
            label="Writing"
          />
          <BlissDesktopIcon
            to="/logs"
            icon={BookmarkSimpleIcon}
            tone="pink"
            label="Logs"
          />
        </nav>
        <BlissWindow
          title="Fezcodex"
          icon={HouseIcon}
          tone="green"
          headingLevel={null}
        >
          <div className="py-2 sm:py-4">
            <p className="bl-eyebrow m-0">Welcome</p>
            <h1 className="bl-display mt-2">A mind, in motion.</h1>
            <p className="mt-4 mb-0 max-w-2xl text-lg leading-relaxed">
              {tagline}
            </p>
            <div className="flex flex-wrap gap-3 items-center mt-6">
              <Link className="bl-btn bl-btn-primary" to="/projects">
                Explore the work
                <ArrowUpRightIcon size={18} weight="bold" aria-hidden="true" />
              </Link>
              <Link className="bl-btn" to="/random">
                <ShuffleIcon size={18} weight="bold" aria-hidden="true" />
                Random discovery
              </Link>
            </div>
          </div>
        </BlissWindow>
        {order.map((name) => sections[name] || null)}
      </div>
    </div>
  );
};

export default BlissHomePage;
