import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useHomepageOrder } from '../../context/HomepageOrderContext';
import OrbitConstellation from '../../components/orbit/OrbitConstellation';
import OrbitProjectCard from '../../components/orbit/OrbitProjectCard';
import OrbitArt from '../../components/orbit/OrbitArt';
import { OrbitNotice } from '../../components/orbit';
import {
  useOrbitIndex,
  orbitApps,
  orbitPosts,
  orbitDate,
  orbitPostLink,
} from '../../components/orbit/useOrbitContent';
import '../../styles/Orbit.css';

const OrbitHomePage = () => {
  const { config } = useSiteConfig();
  const { projects, loading, error } = useProjects(true);
  const blog = useOrbitIndex('/posts/posts.json');
  const collection = useOrbitIndex('/apps/apps.json');
  const { sectionOrder: order } = useHomepageOrder();
  const posts = orbitPosts(blog.data).slice(0, 3);
  const apps = orbitApps(collection.data);
  const workbench = ['ebru', 'fezynth', 'logic-architect']
    .map((slug) => apps.find((app) => app.slug === slug))
    .filter(Boolean);
  const preferred = ['piml', 'timp']
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter(Boolean);
  const featured = [
    ...preferred,
    ...projects.filter((project) => !preferred.includes(project)),
  ].slice(0, 4);
  const sections = {
    projects: (
      <section className="orb-section" key="projects">
        <div className="orb-section-head">
          <h2>Selected works</h2>
          <Link to="/projects" className="orb-link">
            The project archive <ArrowUpRightIcon size={16} />
          </Link>
        </div>
        {loading ? (
          <OrbitNotice>Opening the project collection…</OrbitNotice>
        ) : error ? (
          <OrbitNotice error>The projects could not be loaded.</OrbitNotice>
        ) : (
          <div className="orb-project-grid">
            {featured.map((project) => (
              <OrbitProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>
    ),
    blogposts: (
      <div className="orb-lower-grid" key="blogposts">
        <section className="orb-section">
          <div className="orb-section-head">
            <h2>Recent writing</h2>
            <Link to="/blog" className="orb-link" aria-label="All writing">
              <ArrowUpRightIcon size={20} />
            </Link>
          </div>
          {blog.loading ? (
            <OrbitNotice>Opening the notes…</OrbitNotice>
          ) : blog.error ? (
            <OrbitNotice error>The writing could not be loaded.</OrbitNotice>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                to={orbitPostLink(post)}
                className="orb-writing-row"
              >
                <div>
                  <h3>{post.title}</h3>
                  <p className="orb-label">
                    {post.series ? 'Series' : post.category || 'Writing'} ·{' '}
                    {orbitDate(post.updated || post.date)}
                  </p>
                </div>
                <ArrowUpRightIcon size={16} className="shrink-0" />
              </Link>
            ))
          )}
        </section>
        <section className="orb-section">
          <div className="orb-section-head">
            <h2>The workbench</h2>
            <Link to="/apps" className="orb-link">
              {apps.length || ''} apps ↗
            </Link>
          </div>
          {collection.error ? (
            <OrbitNotice error>
              The app collection could not be loaded.
            </OrbitNotice>
          ) : (
            workbench.map((app) => (
              <Link to={app.to} key={app.slug} className="orb-tool-row">
                <OrbitArt item={app} compact />
                <div className="flex-1 min-w-0">
                  <h3>{app.title}</h3>
                  <p className="orb-label">{app.categoryName}</p>
                </div>
                <ArrowUpRightIcon size={17} />
              </Link>
            ))
          )}
          <Link className="orb-link mt-6" to="/logs">
            Things worth keeping →
          </Link>
        </section>
      </div>
    ),
  };
  return (
    <div className="orb-root">
      <Seo
        title={`${config?.hero?.title || 'Fezcodex'} | Orbit`}
        description={
          config?.hero?.tagline ||
          'Experimental software, field notes, and small instruments for a curious life.'
        }
      />
      <div className="orb-page">
        <section className="orb-hero">
          <div>
            <span className="orb-eyebrow">THE PERSONAL CODEX OF SAMIL</span>
            <h1 className="orb-display">
              A mind,
              <br />
              <span>in motion.</span>
            </h1>
            <p>
              Experimental software, field notes, and small instruments for a
              curious life.
            </p>
            <div className="flex flex-wrap gap-6 items-center mt-7">
              <Link className="orb-btn orb-btn-primary" to="/projects">
                Explore the work <ArrowUpRightIcon size={18} />
              </Link>
              <Link className="orb-link" to="/about">
                Meet Samil →
              </Link>
            </div>
          </div>
          <OrbitConstellation />
        </section>
        {order.map((name) => sections[name] || null)}
      </div>
    </div>
  );
};

export default OrbitHomePage;
