import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useSiteConfig } from '../../context/SiteConfigContext';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_HOMEPAGE_SECTION_ORDER } from '../../utils/LocalStorageManager';
import {
  LedgerLeader,
  LedgerNotice,
  LedgerRule,
  LedgerStamp,
} from '../../components/ledger';
import '../../styles/Ledger.css';

/**
 * Ledger theme home page — the opening folio of the book. A masthead entered
 * like a title page (wordmark, tagline, registrar's stamp), a box-drawn
 * ornament, then the ruled sections: the holdings, selected work, latest
 * entries, and the directory of doors — every figure joined to its name by a
 * dotted leader.
 */

const HERO_ART = `┌──────────────────────────────────┐
│   FEZCODEX  ·  GENERAL LEDGER    │
│   ══════════════════════════     │
│   DR ████████████░░░░░░░░ CR     │
│   ENTRIES CARRIED FORWARD  →     │
└──────────────────────────────────┘`;

const formatEntryDate = (d) =>
  new Date(d)
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();

const DOORS = [
  { to: '/projects', label: 'PROJECTS', note: 'DEPLOYED WORK, ON RECORD' },
  { to: '/blog', label: 'BLOG', note: 'RANTS AND DEV DIARIES' },
  { to: '/apps', label: 'APPS', note: 'SMALL HONEST INSTRUMENTS' },
  { to: '/logs', label: 'LOGS', note: 'BOOKS · FILMS · GAMES, RATED' },
  { to: '/vocab', label: 'VOCAB', note: 'THE HOUSE GLOSSARY' },
  { to: '/about', label: 'ABOUT', note: 'THE REGISTRAR' },
  { to: '/commands', label: 'COMMANDS', note: '⌘K FOR THE WHOLE OF IT' },
];

const PostRow = ({ post, index }) => {
  const href = post.isSeries
    ? `/blog/series/${post.slug}`
    : `/blog/${post.slug}`;
  return (
    <li>
      <Link to={href} className="ldg-row-link ldg-leader-row">
        <span className="ldg-rank">{String(index + 1).padStart(2, '0')}</span>
        <span
          className="font-bold truncate"
          style={{ letterSpacing: '1px', maxWidth: '32rem' }}
        >
          {post.title}
        </span>
        <span className="ldg-leader" aria-hidden="true" />
        <span
          className="ldg-muted hidden sm:inline"
          style={{ fontSize: '0.76rem' }}
        >
          {post.isSeries ? 'SERIES' : (post.category || 'POST').toUpperCase()}
        </span>
        <span className="ldg-muted" style={{ fontSize: '0.76rem' }}>
          {formatEntryDate(post.updated || post.date)}
        </span>
      </Link>
    </li>
  );
};

const ProjectRow = ({ project, index }) => (
  <li>
    <Link to={`/projects/${project.slug}`} className="ldg-row-link ldg-leader-row">
      <span className="ldg-rank">{String(index + 1).padStart(2, '0')}</span>
      <span className="font-bold truncate" style={{ letterSpacing: '1px' }}>
        {project.title}
      </span>
      <span className="ldg-leader" aria-hidden="true" />
      <span
        className="ldg-muted hidden md:inline truncate"
        style={{ fontSize: '0.76rem', maxWidth: '18rem' }}
      >
        {(project.technologies || [])
          .slice(0, 3)
          .map((t) => t.toUpperCase())
          .join(' · ')}
      </span>
      <span className="ldg-accent font-bold" style={{ fontSize: '0.76rem' }}>
        → OPEN
      </span>
    </Link>
  </li>
);

const SelectedWorkSection = ({ projects }) => {
  const [first, ...rest] = projects || [];
  if (!first) return null;

  return (
    <section className="mt-12">
      <LedgerRule label="SELECTED WORK" className="mb-4" />

      {/* the first pinned project, framed as the ledger's lead entry */}
      <div className="ldg-card p-5 md:p-6 mb-4">
        <p className="ldg-eyebrow mb-2">ENTRY 01 — LEAD RECORD</p>
        <Link
          to={`/projects/${first.slug}`}
          className="no-underline"
          style={{ color: 'var(--ldg-highlight)' }}
        >
          <h3 className="ldg-title" style={{ fontSize: '1.25rem' }}>
            {first.title}
          </h3>
        </Link>
        {first.shortDescription && (
          <p className="ldg-intro mt-2" style={{ fontSize: '0.85rem' }}>
            {first.shortDescription}
          </p>
        )}
        <div className="mt-4 flex flex-col gap-2" style={{ fontSize: '0.8rem' }}>
          <LedgerLeader
            label="STACK"
            value={
              (first.technologies || [])
                .slice(0, 4)
                .map((t) => t.toUpperCase())
                .join(' · ') || '—'
            }
          />
          <LedgerLeader
            label="SINCE"
            value={first.date ? formatEntryDate(first.date) : '—'}
          />
          <LedgerLeader
            label="STATUS"
            value={(first.status || 'LIVE').toUpperCase()}
          />
        </div>
        <div className="mt-4">
          <Link
            to={`/projects/${first.slug}`}
            className="ldg-btn ldg-btn-accent inline-block"
          >
            OPEN /PROJECTS/{first.slug.toUpperCase()}
          </Link>
        </div>
      </div>

      {rest.length > 0 && (
        <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
          {rest.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i + 1} />
          ))}
        </ul>
      )}

      <div className="mt-3 flex justify-end">
        <Link to="/projects" className="ldg-label no-underline hover:text-[var(--ldg-accent)]">
          FULL REGISTER →
        </Link>
      </div>
    </section>
  );
};

const LatestEntriesSection = ({ posts }) => (
  <section className="mt-12">
    <LedgerRule label="LATEST ENTRIES" className="mb-4" />
    {posts.length === 0 ? (
      <LedgerNotice>NO ENTRIES FILED YET</LedgerNotice>
    ) : (
      <>
        <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
          {posts.slice(0, 6).map((p, i) => (
            <PostRow key={p.slug} post={p} index={i} />
          ))}
        </ul>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <span className="ldg-label">
            {String(posts.length).padStart(2, '0')} ON RECORD · SHOWING{' '}
            {String(Math.min(posts.length, 6)).padStart(2, '0')}
          </span>
          <Link to="/blog" className="ldg-label no-underline hover:text-[var(--ldg-accent)]">
            READ ALL →
          </Link>
        </div>
      </>
    )}
  </section>
);

const LedgerHomePage = () => {
  const { config } = useSiteConfig();
  const { projects: pinnedProjects, loading: loadingProjects } =
    useProjects(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [homepageSectionOrder] = usePersistentState(
    KEY_HOMEPAGE_SECTION_ORDER,
    ['projects', 'blogposts'],
  );

  useEffect(() => {
    let cancelled = false;
    const fetchPostSlugs = async () => {
      try {
        const response = await fetch('/posts/posts.json');
        if (!response.ok) return;
        const allPostsData = await response.json();
        const seriesMap = new Map();
        const individualPosts = [];
        allPostsData.forEach((item) => {
          if (item.series) {
            seriesMap.set(item.slug, {
              ...item,
              isSeries: true,
              posts: item.series.posts,
            });
          } else {
            individualPosts.push(item);
          }
        });
        const combined = [
          ...Array.from(seriesMap.values()),
          ...individualPosts,
        ];
        combined.sort(
          (a, b) =>
            new Date(b.updated || b.date) - new Date(a.updated || a.date),
        );
        if (!cancelled) setPosts(combined);
      } catch (err) {
        // The index stays empty; the notice below records the absence.
      } finally {
        if (!cancelled) setLoadingPosts(false);
      }
    };
    fetchPostSlugs();
    return () => {
      cancelled = true;
    };
  }, []);

  const title = config?.hero?.title || 'Fezcodex';
  const codename = config?.kernel?.codename;
  const year = new Date().getFullYear();

  if (loadingProjects || loadingPosts) {
    return (
      <div className="ldg-root">
        <div className="ldg-page">
          <LedgerNotice>OPENING THE LEDGER…</LedgerNotice>
        </div>
      </div>
    );
  }

  const sections = {
    projects: <SelectedWorkSection key="projects" projects={pinnedProjects} />,
    blogposts: <LatestEntriesSection key="blogposts" posts={posts} />,
  };

  return (
    <div className="ldg-root">
      <Seo
        title="Fezcodex // Ledger"
        description="The whole codex kept in ink — projects, blog entries, apps, and logs, ranked, annotated, and filed. No erasures."
        keywords={['Fezcodex', 'ledger', 'codex', 'archive', 'monospace']}
      />

      <div className="ldg-page">
        {/* opening strip */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3">
          <span className="ldg-eyebrow">CODEX ENTRY · FILE 001</span>
          <span className="ldg-label hidden md:inline">
            RANKED · ANNOTATED · FILED
          </span>
          <span className="ldg-label">
            {new Date()
              .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
              .toUpperCase()}
          </span>
        </div>
        <LedgerRule />

        {/* masthead — the title page */}
        <header className="pt-10 pb-8 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
          <div>
            <h1
              className="ldg-title"
              style={{ fontSize: 'clamp(2.4rem, 7vw, 4.5rem)', lineHeight: 1 }}
            >
              {title}
            </h1>
            <p className="ldg-eyebrow mt-3">THE WHOLE CODEX, KEPT IN INK</p>
            <p className="ldg-intro mt-4">
              Experimental software, field notes, and small instruments —{' '}
              <strong>every entry ranked, annotated, and filed</strong>. Entries
              are never erased, only superseded.
            </p>
            <div className="mt-6">
              <LedgerStamp />
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <pre className="ldg-ascii" aria-hidden="true">{HERO_ART}</pre>
            <div className="flex flex-col gap-2" style={{ fontSize: '0.8rem' }}>
              <LedgerLeader label="PRONUNCIATION" value="/ˈFɛZ.KOʊ.DɛKS/" />
              <LedgerLeader label="LINEAGE" value="B. 2023" />
              {codename && <LedgerLeader label="KERNEL" value={codename.toUpperCase()} />}
              <LedgerLeader label="REGISTRAR" value="A. S. BULBUL" />
            </div>
          </aside>
        </header>

        {/* the holdings */}
        <section>
          <LedgerRule label="THE HOLDINGS" className="mb-4" />
          <p className="ldg-stats">
            <span>
              <strong>{String(posts.length).padStart(2, '0')}</strong> ENTRIES
            </span>
            <span>
              <strong>
                {String((pinnedProjects || []).length).padStart(2, '0')}
              </strong>{' '}
              WORKS PINNED
            </span>
            <span>
              <strong>{String(DOORS.length).padStart(2, '0')}</strong> DOORS
            </span>
          </p>
        </section>

        {/* ordered sections — order honored from persistent prefs */}
        {homepageSectionOrder.map((name) => sections[name] || null)}

        {/* the directory */}
        <section className="mt-12">
          <LedgerRule label="THE DIRECTORY" className="mb-4" />
          <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
            {DOORS.map((door, i) => (
              <li key={door.to}>
                <Link to={door.to} className="ldg-row-link ldg-leader-row">
                  <span className="ldg-rank">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-bold" style={{ letterSpacing: '1px' }}>
                    {door.label}
                  </span>
                  <span className="ldg-leader" aria-hidden="true" />
                  <span
                    className="ldg-muted hidden sm:inline"
                    style={{ fontSize: '0.76rem' }}
                  >
                    {door.note}
                  </span>
                  <span className="ldg-accent" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* closing line */}
        <footer className="mt-14">
          <LedgerRule />
          <div className="pt-4 flex flex-col md:flex-row items-start md:items-baseline justify-between gap-2">
            <span className="ldg-label">
              © {year} · FEZCODE / A. S. BULBUL
            </span>
            <span className="ldg-label">
              LEDGER · BALANCE CARRIED FORWARD
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LedgerHomePage;
