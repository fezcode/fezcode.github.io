import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import StudioSurface from '../../components/studio/StudioSurface';
import StudioShapes from '../../components/studio/StudioShapes';
import StudioFlow from '../../components/studio/StudioFlow';
import { useProjects } from '../../utils/projectParser';
import { useHomepageOrder } from '../../context/HomepageOrderContext';
import {
  useStudioIndex,
  studioPosts,
  studioPostLink,
  studioDate,
  studioApps,
} from '../../components/studio/useStudioContent';

export default function StudioHomePage() {
  const { projects, loading, error } = useProjects(true);
  const blog = useStudioIndex('/posts/posts.json');
  const collection = useStudioIndex('/apps/apps.json');
  const { sectionOrder } = useHomepageOrder();
  const posts = studioPosts(blog.data).slice(0, 3);
  const apps = studioApps(collection.data)
    .filter((app) => app.pinned_order)
    .slice(0, 4);
  const sections = {
    projects: (
      <section
        className="std-section"
        key="projects"
        aria-labelledby="std-projects"
      >
        <div className="std-section-head">
          <h2 id="std-projects">Things I’m building.</h2>
          <Link className="std-chip" to="/projects">
            All projects
          </Link>
        </div>
        {loading ? (
          <p role="status">Loading projects…</p>
        ) : error ? (
          <p role="alert">
            Projects couldn’t load. Please refresh to try again.
          </p>
        ) : (
          <div className="std-project-grid">
            {projects.slice(0, 4).map((project) => (
              <Link
                className="std-project"
                to={`/projects/${project.slug}`}
                key={project.slug}
              >
                {project.image && (
                  <div className="std-project-cover">
                    <img src={project.image} alt="" loading="lazy" />
                  </div>
                )}
                <h3>{project.title}</h3>
                <p>{project.shortDescription}</p>
                <span className="std-meta">
                  {(project.technologies || []).slice(0, 3).join(' / ')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    ),
    blogposts: (
      <section
        className="std-section"
        key="blogposts"
        aria-labelledby="std-writing"
      >
        <div className="std-section-head">
          <h2 id="std-writing">Fresh from the notebook.</h2>
          <Link className="std-chip" to="/blog">
            All writing
          </Link>
        </div>
        {blog.loading ? (
          <p role="status">Loading writing…</p>
        ) : blog.error ? (
          <p role="alert">
            Writing couldn’t load. Please refresh to try again.
          </p>
        ) : (
          <div className="std-writing-grid">
            {posts.map((post) => (
              <Link
                className="std-writing-card"
                key={post.slug}
                to={studioPostLink(post)}
              >
                <span className="std-meta">
                  {studioDate(post.updated || post.date)}
                </span>
                <h3>{post.title}</h3>
                <p>{post.description || post.series?.description}</p>
                <span className="std-text-link">
                  Read {post.series ? 'series' : 'story'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    ),
  };
  return (
    <StudioSurface>
      <Seo
        title="Fezcodex | Studio"
        description="A personal home for software, writing, and things worth discovering."
      />
      <div className="std-page">
        <section className="std-hero std-flow">
          <StudioFlow />
          <StudioShapes />
          <h1>
            A curious mind.
            <br />
            An open studio.
          </h1>
          <p>
            Software, stories, and little discoveries.
            <br />
            Welcome to my corner of the internet.
          </p>
          <div className="std-actions">
            <Link to="/projects" className="std-button">
              Explore the work
            </Link>
            <Link to="/about" className="std-button std-button-light">
              Meet Samil
            </Link>
          </div>
        </section>
        <div className="std-bento">
          <section className="std-tile std-terra">
            <StudioShapes />
            <span className="std-pill">The workbench</span>
            <h2>
              Small tools.
              <br />
              Room to play.
            </h2>
            <p>
              Make a little music. Untangle an idea. Find something useful, or
              just unexpected.
            </p>
            <Link to="/apps" className="std-button">
              Explore apps
            </Link>
            <div className="std-preview">
              <div className="std-preview-bar">
                <span />
                <span />
                <span />
                <span className="std-preview-title">
                  Made for a curious afternoon
                </span>
              </div>
              {collection.loading ? (
                <p role="status">Loading the workbench…</p>
              ) : collection.error ? (
                <p role="alert">
                  Apps couldn’t load.{' '}
                  <Link to="/apps">Try the app collection</Link>.
                </p>
              ) : (
                apps.map((app) => (
                  <Link to={app.to} key={app.slug}>
                    <strong>{app.title}</strong>
                    <span>{app.categoryName}</span>
                  </Link>
                ))
              )}
            </div>
          </section>
          <section className="std-tile std-sage">
            <StudioShapes variant="drops" />
            <span className="std-pill">Discovery logs</span>
            <h2>
              Good things,
              <br />
              worth keeping.
            </h2>
            <p>
              Books, films, games, and the occasional rabbit hole. A collection
              of things that stayed with me.
            </p>
            <Link to="/logs" className="std-button">
              Browse discoveries
            </Link>
            <div className="std-discovery-links">
              <Link to="/logs/book">Books</Link>
              <Link to="/logs/movie">Films</Link>
              <Link to="/logs/game">Games</Link>
              <Link to="/tags">Follow a topic</Link>
            </div>
          </section>
        </div>
        {sectionOrder.map((name) => sections[name] || null)}
        <section className="std-strip">
          <div>
            <h2>Same codex. A different feeling.</h2>
            <p>Make yourself at home. There’s a theme for that.</p>
          </div>
          <Link className="std-button std-button-light" to="/design">
            Find your theme
          </Link>
        </section>
      </div>
    </StudioSurface>
  );
}
