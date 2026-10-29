import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useHomepageOrder } from '../../context/HomepageOrderContext';
import {
  MarquetryText,
  MarquetryBand,
  MarquetryBadge,
  MarquetryIcon,
  MarquetryInlay,
  MarquetryNotice,
  MarquetryProjectCard,
  WOOD,
  useMarquetryIndex,
  marquetryApps,
  marquetryPosts,
  marquetryDate,
  marquetryPostLink,
} from '../../components/marquetry';
import '../../styles/Marquetry.css';

const SectionHead = ({ number, title, to, label }) => (
  <div className="mqt-section-head">
    {number && <span className="mqt-section-number">{number} —</span>}
    <MarquetryText as="h2" text={title} fg={WOOD.ink} />
    {to && (
      <Link to={to} className="mqt-link shrink-0" aria-label={label}>
        <MarquetryText text={label} size="small" fg={WOOD.ink} fit />
        <MarquetryIcon name="arrowUpRight" fg={WOOD.teal} />
      </Link>
    )}
  </div>
);

const MarquetryHomePage = () => {
  const { config } = useSiteConfig();
  const { projects, loading, error } = useProjects(true);
  const blog = useMarquetryIndex('/posts/posts.json');
  const collection = useMarquetryIndex('/apps/apps.json');
  const { sectionOrder: order } = useHomepageOrder();
  const posts = marquetryPosts(blog.data).slice(0, 3);
  const apps = marquetryApps(collection.data);
  const workbench = ['ebru', 'fezynth', 'logic-architect']
    .map((slug) => apps.find((app) => app.slug === slug))
    .filter(Boolean);
  // Draw after mount so the first three projects agree during hydration.
  const [shuffled, setShuffled] = useState(null);
  useEffect(() => {
    if (!projects.length) return;
    const deck = [...projects];
    for (let i = deck.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setShuffled(deck.slice(0, 3));
  }, [projects]);
  const featured = shuffled || projects.slice(0, 3);

  const sections = {
    projects: (
      <section className="mqt-section" key="projects">
        <SectionHead
          number="01"
          title="Selected works"
          to="/projects"
          label="The archive"
        />
        {loading ? (
          <MarquetryNotice>Loading the project collection…</MarquetryNotice>
        ) : error ? (
          <MarquetryNotice error>
            The projects could not be loaded.
          </MarquetryNotice>
        ) : (
          <div className="mqt-grid mqt-home-projects">
            {featured.map((project) => (
              <MarquetryProjectCard
                key={project.slug}
                project={project}
                decorative
              />
            ))}
          </div>
        )}
      </section>
    ),
    blogposts: (
      <div className="mqt-split mqt-section" key="blogposts">
        <section>
          <SectionHead
            number="02"
            title="Recent writing"
            to="/blog"
            label="All writing"
          />
          {blog.loading ? (
            <MarquetryNotice>Reading the notes…</MarquetryNotice>
          ) : blog.error ? (
            <MarquetryNotice error>
              The writing could not be loaded.
            </MarquetryNotice>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                to={marquetryPostLink(post)}
                className="mqt-row"
              >
                <MarquetryBadge seed={post.slug} size={11} />
                <div className="mqt-row-body">
                  <MarquetryText
                    as="h3"
                    text={post.title}
                    fg={WOOD.ink}
                    maxLines={3}
                  />
                  <MarquetryText
                    text={`${post.series ? 'Series' : post.category || 'Writing'} · ${marquetryDate(post.updated || post.date)}`}
                    size="small"
                    fg={WOOD.bark}
                    className="mt-2"
                  />
                </div>
                <MarquetryIcon name="arrowUpRight" fg={WOOD.teal} />
              </Link>
            ))
          )}
        </section>
        <section className="mqt-workbench">
          <SectionHead title="The workbench" to="/apps" label="Open apps" />
          {collection.loading ? (
            <MarquetryNotice>Laying out the workbench…</MarquetryNotice>
          ) : collection.error ? (
            <MarquetryNotice error>
              The app collection could not be loaded.
            </MarquetryNotice>
          ) : (
            workbench.map((app) => (
              <Link to={app.to} key={app.slug} className="mqt-row">
                <MarquetryBadge seed={app.slug} size={11} />
                <div className="mqt-row-body">
                  <MarquetryText
                    as="h3"
                    text={app.title}
                    fg={WOOD.ink}
                    maxLines={2}
                  />
                  <MarquetryText
                    text={app.categoryName}
                    size="small"
                    fg={WOOD.bark}
                    className="mt-2"
                  />
                </div>
                <MarquetryIcon name="arrowUpRight" fg={WOOD.teal} />
              </Link>
            ))
          )}
          <Link className="mqt-link mt-3" to="/logs">
            Things worth keeping →
          </Link>
        </section>
      </div>
    ),
  };

  return (
    <div className="mqt-root mqt-home">
      <Seo
        title={`${config?.hero?.title || 'Fezcodex'} | Marquetry`}
        description={
          config?.hero?.tagline ||
          'Experimental software, field notes, and small instruments for a curious life.'
        }
      />
      <section className="mqt-home-hero">
        <div className="mqt-page mqt-home-hero-inner">
          <div className="mqt-home-hero-copy">
            <p className="mqt-home-eyebrow">The personal codex of Samil</p>
            <MarquetryText
              as="h1"
              text="A mind, in motion."
              scale={2}
              fg={WOOD.ink}
              className="mqt-home-title"
            />
            <p className="mqt-home-intro">
              Experimental software, field notes, and small instruments for a
              curious life.
            </p>
            <div className="flex flex-wrap gap-3 items-center mt-7">
              <Link className="mqt-btn mqt-btn-primary" to="/projects">
                <MarquetryText
                  text="Explore the work"
                  size="small"
                  fg={WOOD.snow}
                  fit
                />
                <MarquetryIcon name="arrowRight" fg={WOOD.snow} />
              </Link>
              <Link className="mqt-btn mqt-btn-gold" to="/about">
                <MarquetryText
                  text="Meet Samil"
                  size="small"
                  fg={WOOD.peat}
                  fit
                />
                <MarquetryIcon name="arrowRight" fg={WOOD.peat} />
              </Link>
            </div>
          </div>
          <MarquetryInlay
            seed="fezcodex"
            size={300}
            className="mqt-home-inlay"
          />
        </div>
        <MarquetryBand pattern="chevron" />
      </section>
      <div className="mqt-page">
        {order.map((name) => sections[name] || null)}
      </div>
    </div>
  );
};

export default MarquetryHomePage;
