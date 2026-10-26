import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useHomepageOrder } from '../../context/HomepageOrderContext';
import KnitProjectCard from '../../components/knit/KnitProjectCard';
import {
  KnitText,
  KnitBand,
  KnitBadge,
  KnitIcon,
  KnitNotice,
  YARN,
  useKnitIndex,
  knitApps,
  knitPosts,
  knitDate,
  knitPostLink,
} from '../../components/knit';
import '../../styles/Knit.css';

const SectionHead = ({ title, to, label }) => (
  <div className="knt-section-head">
    <KnitText as="h2" text={title} fg={YARN.cream} />
    {to && (
      <Link to={to} className="knt-btn shrink-0" aria-label={label}>
        <KnitText text={label} size="small" fg={YARN.cream} fit />
        <KnitIcon name="arrowUpRight" fg={YARN.gold} />
      </Link>
    )}
  </div>
);

const KnitHomePage = () => {
  const { config } = useSiteConfig();
  const { projects, loading, error } = useProjects(true);
  const blog = useKnitIndex('/posts/posts.json');
  const collection = useKnitIndex('/apps/apps.json');
  const { sectionOrder: order } = useHomepageOrder();
  const posts = knitPosts(blog.data).slice(0, 3);
  const apps = knitApps(collection.data);
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

  const sections = {
    projects: (
      <section className="knt-section" key="projects">
        <SectionHead title="Selected works" to="/projects" label="The archive" />
        {loading ? (
          <KnitNotice>Casting on the project collection…</KnitNotice>
        ) : error ? (
          <KnitNotice error>The projects could not be loaded.</KnitNotice>
        ) : (
          <div className="knt-grid">
            {featured.map((project) => (
              <KnitProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>
    ),
    blogposts: (
      <div className="knt-split knt-section" key="blogposts">
        <section>
          <SectionHead title="Recent writing" to="/blog" label="All writing" />
          {blog.loading ? (
            <KnitNotice>Unrolling the notes…</KnitNotice>
          ) : blog.error ? (
            <KnitNotice error>The writing could not be loaded.</KnitNotice>
          ) : (
            posts.map((post) => (
              <Link key={post.slug} to={knitPostLink(post)} className="knt-row">
                <div className="knt-row-body">
                  <KnitText as="h3" text={post.title} fg={YARN.cream} maxLines={3} />
                  <KnitText
                    text={`${post.series ? 'Series' : post.category || 'Writing'} · ${knitDate(post.updated || post.date)}`}
                    size="small"
                    fg={YARN.wheat}
                    className="mt-2"
                  />
                </div>
                <KnitIcon name="arrowUpRight" fg={YARN.gold} />
              </Link>
            ))
          )}
        </section>
        <section>
          <SectionHead
            title="The workbench"
            to="/apps"
            label={`${apps.length || ''} apps`}
          />
          {collection.error ? (
            <KnitNotice error>The app collection could not be loaded.</KnitNotice>
          ) : (
            workbench.map((app) => (
              <Link to={app.to} key={app.slug} className="knt-row">
                <KnitBadge seed={app.slug} size={11} />
                <div className="knt-row-body">
                  <KnitText as="h3" text={app.title} fg={YARN.cream} maxLines={2} />
                  <KnitText
                    text={app.categoryName}
                    size="small"
                    fg={YARN.wheat}
                    className="mt-2"
                  />
                </div>
                <KnitIcon name="arrowUpRight" fg={YARN.gold} />
              </Link>
            ))
          )}
          <Link className="knt-link mt-3" to="/logs">
            Things worth keeping →
          </Link>
        </section>
      </div>
    ),
  };

  return (
    <div className="knt-root">
      <Seo
        title={`${config?.hero?.title || 'Fezcodex'} | Knit`}
        description={
          config?.hero?.tagline ||
          'Experimental software, field notes, and small instruments for a curious life.'
        }
      />
      <section className="knt-wool-moss">
        <KnitBand pattern={['peerie', ['stars', { bg: YARN.moss }], 'peerie']} />
        <div className="knt-page !pb-8">
          <KnitText
            text="The personal codex of Samil"
            size="small"
            fg={YARN.wheat}
          />
          <KnitText
            as="h1"
            text="A mind, in motion."
            scale={2}
            fg={YARN.cream}
            className="mt-4"
          />
          <p className="knt-patch mt-6 max-w-2xl text-lg">
            Experimental software, field notes, and small instruments for a
            curious life — knitted row by row.
          </p>
          <div className="flex flex-wrap gap-3 items-center mt-7">
            <Link className="knt-btn knt-btn-primary" to="/projects">
              <KnitText text="Explore the work" size="small" fg={YARN.snow} fit />
              <KnitIcon name="arrowUpRight" fg={YARN.snow} />
            </Link>
            <Link className="knt-btn knt-btn-gold" to="/about">
              <KnitText text="Meet Samil" size="small" fg={YARN.peat} fit />
              <KnitIcon name="arrowRight" fg={YARN.peat} />
            </Link>
          </div>
        </div>
        <KnitBand pattern={['peerie', 'hens', 'peerie']} />
      </section>
      <div className="knt-page">{order.map((name) => sections[name] || null)}</div>
    </div>
  );
};

export default KnitHomePage;
