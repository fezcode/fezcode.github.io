import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useHomepageOrder } from '../../context/HomepageOrderContext';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import { SITE_THEMES } from '../../utils/siteThemes';
import {
  KilimRug,
  KilimText,
  KilimBand,
  KilimStripe,
  KilimBadge,
  KilimNotice,
  KilimProjectCard,
  useKilimIndex,
  kilimApps,
  kilimPosts,
  kilimPostLink,
} from '../../components/kilim';
import '../../styles/Kilim.css';
import './kilim-content.css';

/** A date as an ivory stitched tag: the day large, the month under it. */
const DateTag =({ value }) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime()))
    return (
      <div className="klm-date" aria-hidden="true">
        <b>–</b>
        <span>Undated</span>
      </div>
    );
  return (
    <div className="klm-date" aria-hidden="true">
      <b>{String(date.getDate()).padStart(2, '0')}</b>
      <span>{date.toLocaleDateString('en-GB', { month: 'short' })}</span>
    </div>
  );
};

const yearOf = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : String(date.getFullYear());
};

const SectionHead = ({ title, to, label }) => (
  <div className="klm-section-head">
    <KilimText as="h2" text={title} />
    {to && (
      <Link to={to} className="klm-link shrink-0">
        {label} <span aria-hidden="true">↗</span>
      </Link>
    )}
  </div>
);

/** Between the home page's sections the rug changes border: chain, teeth, chain… */
const BETWEEN = ['chain', 'teeth'];

const KilimHomePage = () => {
  const { config } = useSiteConfig();
  const { fezcodexTheme, setFezcodexTheme } = useVisualSettings();
  const { projects, loading, error } = useProjects(true);
  const blog = useKilimIndex('/posts/posts.json');
  const collection = useKilimIndex('/apps/apps.json');
  const { sectionOrder: order } = useHomepageOrder();
  const posts = kilimPosts(blog.data).slice(0, 3);
  const apps = kilimApps(collection.data);
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
  const otherLooms = SITE_THEMES.filter(
    (theme) => theme.id !== (fezcodexTheme || 'kilim'),
  );

  const sections = {
    projects: (
      <section className="klm-section klm-wrap" key="projects">
        <SectionHead title="Selected works" to="/projects" label="The archive" />
        {loading ? (
          <KilimNotice>Setting up the warp for the projects…</KilimNotice>
        ) : error ? (
          <KilimNotice error>The projects could not be loaded.</KilimNotice>
        ) : (
          <div className="klm-home-grid">
            {featured.map((project) => (
              <KilimProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>
    ),
    blogposts: (
      <div className="klm-section klm-wrap klm-home-split" key="blogposts">
        <section>
          <SectionHead title="Recent writing" to="/blog" label="All writing" />
          {blog.loading ? (
            <KilimNotice>Unrolling the notes…</KilimNotice>
          ) : blog.error ? (
            <KilimNotice error>The writing could not be loaded.</KilimNotice>
          ) : (
            posts.map((post, i) => (
              <Fragment key={post.slug}>
                {i > 0 && <KilimStripe />}
                <Link to={kilimPostLink(post)} className="klm-row">
                  <DateTag value={post.updated || post.date} />
                  <div className="min-w-0">
                    <h3 className="klm-row-title">{post.title}</h3>
                    <div className="klm-row-meta">
                      {post.series ? 'Series' : post.category || 'Writing'}
                      {yearOf(post.updated || post.date)
                        ? ` · ${yearOf(post.updated || post.date)}`
                        : ''}
                    </div>
                  </div>
                  <span className="klm-row-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </Fragment>
            ))
          )}
        </section>
        <section>
          <SectionHead
            title="The workbench"
            to="/apps"
            label={`${apps.length || 'All'} apps`}
          />
          {collection.error ? (
            <KilimNotice error>The app collection could not be loaded.</KilimNotice>
          ) : (
            workbench.map((app, i) => (
              <Fragment key={app.slug}>
                {i > 0 && <KilimStripe />}
                <Link to={app.to} className="klm-row">
                  <KilimBadge seed={app.slug} size={11} />
                  <div className="min-w-0">
                    <h3 className="klm-row-title">{app.title}</h3>
                    <div className="klm-row-meta">
                      {app.kicker || app.tagline || app.categoryName}
                    </div>
                  </div>
                  <span className="klm-row-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </Fragment>
            ))
          )}
          <Link className="klm-link klm-home-more" to="/logs">
            Things worth keeping →
          </Link>
        </section>
      </div>
    ),
  };

  const shown = order.filter((name) => sections[name]);

  return (
    <div className="klm-root">
      <Seo
        title={`${config?.hero?.title || 'Fezcodex'} | Kilim`}
        description={
          config?.hero?.tagline ||
          'Experimental software, field notes, and small instruments for a curious life.'
        }
      />
      <div className="klm-wrap">
        <KilimRug
          className="klm-home-rug"
          eyebrow="The personal codex of Samil"
          title="A mind, in motion."
          seed="hero"
          intro="Experimental software, field notes, and small instruments for a curious life. Woven pass by pass, like a kilim on the loom."
        >
          <div className="klm-actions">
            <Link className="klm-btn" to="/projects">
              Explore the work <span aria-hidden="true">↗</span>
            </Link>
            <Link className="klm-btn klm-btn-ivory" to="/about">
              Meet Samil <span aria-hidden="true">→</span>
            </Link>
          </div>
        </KilimRug>
      </div>

      {shown.map((name, i) => (
        <Fragment key={name}>
          <KilimBand pattern={BETWEEN[i % BETWEEN.length]} />
          {sections[name]}
        </Fragment>
      ))}

      <KilimBand pattern={BETWEEN[shown.length % BETWEEN.length]} />

      <section className="klm-wrap klm-home-looms" aria-labelledby="klm-home-looms">
        <p className="klm-label" id="klm-home-looms">
          Weave the codex another way
        </p>
        <div className="klm-home-looms-list">
          {otherLooms.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className="klm-home-loom"
              onClick={() => setFezcodexTheme(theme.id)}
              title={theme.description}
            >
              <span
                className="klm-home-loom-dye"
                aria-hidden="true"
                style={{ background: theme.background, '--dye-accent': theme.accent }}
              />
              {theme.name}
            </button>
          ))}
          <Link to="/settings" className="klm-link self-center ml-2">
            All settings →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default KilimHomePage;
