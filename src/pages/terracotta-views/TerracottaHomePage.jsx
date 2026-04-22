import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useSiteConfig } from '../../context/SiteConfigContext';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_HOMEPAGE_SECTION_ORDER } from '../../utils/LocalStorageManager';
import {
  TerracottaStrip,
  TerracottaChapter,
  ChapterEm,
  TerracottaMark,
  TerracottaMarkStage,
  TerracottaEntry,
  EntryPos,
  EntryItem,
  EntryCounterStyle,
  TerracottaColophon,
  TerracottaSpec,
  TerracottaPlumbLine,
} from '../../components/terracotta';

/* =========================================================================
   PAPER & GRAIN
   ========================================================================= */
const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

const PAPER_GRADIENT =
  'radial-gradient(1100px 600px at 85% -10%, #E8DECE 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #EDE3D3 0%, transparent 50%)';

/* =========================================================================
   HELPERS
   ========================================================================= */
const formatLongDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

const formatCodexDate = (d) =>
  new Date(d)
    .toLocaleDateString('en-GB', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, ' · ');

/* =========================================================================
   CLOCK (live time for strip)
   ========================================================================= */
const useClock = () => {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-GB', { hour12: false }),
  );
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

/* =========================================================================
   HERO WORDMARK — the plumb line dangles above the 'd' of "codex"
   ========================================================================= */
const HeroWordmark = ({ title = 'Fezcodex' }) => {
  // split: "Fezco" + "d" (anchor) + "ex"  +  terra period
  const endsInCodex = title.toLowerCase().endsWith('codex');
  const pre = endsInCodex ? title.slice(0, title.length - 4) : title.slice(0, -1);
  // we want to hang above the 'd' in codex — if title doesn't contain it, we anchor on the last char.
  const anchor = endsInCodex ? 'c' : title.slice(-1);
  const post = endsInCodex ? title.slice(-3) : '';

  return (
    <h1
      aria-label={title}
      className="relative font-fraunces text-[#1A1613] leading-[0.82] tracking-[-0.04em] flex items-end"
      style={{
        fontSize: 'clamp(112px, 17vw, 240px)',
        fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
      }}
    >
      <span>{pre}</span>
      <span className="relative inline-block">
        {anchor}
        <TerracottaPlumbLine height={68} thickness={1.5} color="#1A1613" />
      </span>
      <span>{post}</span>
      <span
        aria-hidden="true"
        className="text-[#C96442]"
        style={{ fontVariationSettings: '"wght" 800, "opsz" 144' }}
      >
        .
      </span>
    </h1>
  );
};

/* =========================================================================
   HERO BLOCK
   ========================================================================= */
const HeroBlock = ({ config }) => {
  const heroTitle = config?.hero?.title || 'Fezcodex';
  const codename = config?.kernel?.codename || 'bonewright';

  return (
    <section
      className="relative grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-20 items-center pt-20 md:pt-28 pb-16 md:pb-24"
      style={{ minHeight: '72vh' }}
    >
      {/* left: kicker + wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      >
        <div className="flex items-center gap-3.5 mb-7 font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F]">
          <span>Codex entry</span>
          <span
            aria-hidden="true"
            className="flex-1 max-w-[80px] h-px bg-[#9E4A2F]/50"
          />
          <span>
            {new Date().toLocaleDateString('en-GB', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        <HeroWordmark title={heroTitle} />
      </motion.div>

      {/* right: editorial aside */}
      <motion.aside
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        className="flex flex-col gap-7 lg:border-l border-[#1A161320] lg:pl-10"
      >
        <div className="font-ibm-plex-mono text-[11px] tracking-[0.18em] uppercase text-[#2E2620]/85">
          Formerly <s className="opacity-60 decoration-[1px]">fezcode.com</s>
        </div>

        <p
          className="font-fraunces italic text-[22px] md:text-[26px] leading-[1.25] tracking-[-0.01em] text-[#1A1613] max-w-[30ch]"
          style={{
            fontVariationSettings: '"opsz" 60, "SOFT" 100, "WONK" 0, "wght" 380',
          }}
        >
          A codex that <span
            className="not-italic text-[#9E4A2F]"
            style={{ fontVariationSettings: '"wght" 560', fontStyle: 'normal' }}
          >holds true</span>
          {' '}— one line, one point, nothing else to prove.
        </p>

        <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-7 border-t border-[#1A161320]">
          <TerracottaSpec label="Pronunciation" value="/ˈfɛz.koʊ.dɛks/" />
          <TerracottaSpec label="Lineage" value="b. 2023" />
          <TerracottaSpec label="Kernel" value={codename} />
          <TerracottaSpec label="Authored by" value="A. S. Bulbul" />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2.5 font-fraunces italic text-[17px] text-[#1A1613] border-b-2 border-[#1A1613] pb-1 hover:text-[#9E4A2F] hover:border-[#9E4A2F] transition-colors"
            style={{ fontVariationSettings: '"opsz" 18, "wght" 420' }}
          >
            Read the archive
            <span aria-hidden="true" className="font-ibm-plex-mono text-sm group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
          <span
            aria-hidden="true"
            className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] uppercase text-[#2E2620]/50"
          >
            or
          </span>
          <Link
            to="/about"
            className="inline-flex items-center gap-2.5 font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#2E2620] hover:text-[#9E4A2F] transition-colors"
          >
            about
          </Link>
        </div>
      </motion.aside>
    </section>
  );
};

/* =========================================================================
   PROJECT ROW — bone-native, no dark tile
   ========================================================================= */
const ProjectRow = ({ project, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay: index * 0.06 }}
    className="group"
  >
    <Link
      to={`/projects/${project.slug}`}
      className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[60px_1fr_auto_auto] items-baseline gap-4 md:gap-8 py-8 border-b border-[#1A161320] hover:border-[#1A1613]/35 transition-colors"
    >
      <span className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] self-baseline md:self-center">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <h3
          className="font-fraunces text-[26px] md:text-[36px] leading-[1.05] tracking-[-0.02em] text-[#1A1613] group-hover:text-[#9E4A2F] transition-colors"
          style={{
            fontVariationSettings: '"opsz" 48, "SOFT" 50, "WONK" 1, "wght" 460',
          }}
        >
          {project.title}
          <span
            aria-hidden="true"
            className="ml-3 text-[#C96442] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ fontVariationSettings: '"wght" 800' }}
          >
            .
          </span>
        </h3>
        {project.shortDescription && (
          <p className="mt-2 font-fraunces italic text-[15px] md:text-[16px] leading-[1.5] text-[#2E2620] max-w-[60ch]"
            style={{ fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 360' }}
          >
            {project.shortDescription}
          </p>
        )}
      </div>

      <div className="hidden md:flex flex-wrap gap-1.5 max-w-[220px] justify-end">
        {(project.technologies || []).slice(0, 3).map((t) => (
          <span
            key={t}
            className="font-ibm-plex-mono text-[9.5px] tracking-[0.15em] uppercase px-1.5 py-0.5 border border-[#1A161320] text-[#2E2620]"
          >
            {t}
          </span>
        ))}
      </div>

      <span
        aria-hidden="true"
        className="font-ibm-plex-mono text-[#9E4A2F] text-sm self-baseline md:self-center -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
      >
        →
      </span>
    </Link>
  </motion.article>
);

/* =========================================================================
   § I — SELECTED WORKS
   ========================================================================= */
const SelectedWorksChapter = ({ projects }) => {
  const [first, ...rest] = projects;
  if (!first) return null;

  const techsAsValue = (techs) =>
    (techs || []).slice(0, 4).join(' · ') || '—';

  return (
    <section className="pt-24 md:pt-32 border-t border-[#1A161320]">
      <TerracottaChapter
        numeral="I"
        label="Selected Works"
        title={
          <>
            A weighted{' '}
            <ChapterEm>archive.</ChapterEm>
          </>
        }
        blurb="Code built to measure, not just to move — a hand-held inventory of the things that held true."
      />

      {/* mark stage: first project as cover */}
      <TerracottaMarkStage
        notesTitle={first.title}
        notes={[
          { label: 'Form', value: first.shortDescription || 'Field-tested build, deployed and maintained.' },
          { label: 'Stack', value: techsAsValue(first.technologies) },
          {
            label: 'Since',
            value: first.date ? formatLongDate(first.date) : '—',
          },
          { label: 'Status', value: 'Live — archive entry 01' },
          {
            label: 'Access',
            value: (
              <Link
                to={`/projects/${first.slug}`}
                className="underline decoration-[#C96442]/60 underline-offset-2 hover:text-[#C96442] transition-colors"
              >
                /projects/{first.slug} →
              </Link>
            ),
          },
        ]}
        caption={
          <>
            The cornerstone of the archive — held to gravity, not to fashion.
          </>
        }
        markSlot={
          <TerracottaMark
            size={220}
            color="#C96442"
            sway
            className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
            title={`${first.title} — cover mark`}
          />
        }
      />

      {/* remaining pinned projects — editorial rows */}
      {rest.length > 0 && (
        <div className="mt-20">
          <div className="flex items-baseline justify-between mb-4">
            <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] uppercase text-[#2E2620]/70">
              Further entries
            </span>
            <Link
              to="/projects"
              className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] uppercase text-[#9E4A2F] hover:text-[#C96442] transition-colors"
            >
              Full archive →
            </Link>
          </div>
          <div className="border-t border-[#1A1613]/30">
            {rest.map((p, i) => (
              <ProjectRow key={p.slug} project={p} index={i + 1} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

/* =========================================================================
   § II — RECENT LOGS (field notes, editorial rows)
   ========================================================================= */
const LogRow = ({ post, index }) => {
  const href = post.isSeries ? `/blog/series/${post.slug}` : `/blog/${post.slug}`;
  const date = new Date(post.updated || post.date);
  const category = (post.category || 'log').toLowerCase();
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link
        to={href}
        className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[110px_1fr_auto_auto] gap-4 md:gap-8 items-baseline py-6 border-b border-dashed border-[#1A161320] hover:border-[#1A1613]/35 transition-colors"
      >
        <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] uppercase text-[#2E2620]/70 self-baseline">
          {formatCodexDate(date)}
        </span>

        <h3
          className="font-fraunces text-[20px] md:text-[24px] leading-[1.2] tracking-[-0.01em] text-[#1A1613] group-hover:text-[#9E4A2F] transition-colors"
          style={{
            fontStyle: 'italic',
            fontVariationSettings: '"opsz" 28, "SOFT" 80, "WONK" 1, "wght" 380',
          }}
        >
          {post.title}
        </h3>

        <span className="hidden md:inline-flex font-ibm-plex-mono text-[9.5px] tracking-[0.2em] uppercase text-[#2E2620] border border-[#1A161320] px-2 py-0.5">
          {post.isSeries ? 'series' : category}
        </span>

        <span
          aria-hidden="true"
          className="font-ibm-plex-mono text-[#9E4A2F] text-sm self-baseline -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
        >
          →
        </span>
      </Link>
    </motion.article>
  );
};

const LatestLogsChapter = ({ posts }) => (
  <section className="pt-24 md:pt-32 border-t border-[#1A161320]">
    <TerracottaChapter
      numeral="II"
      label="Field Notes"
      title={
        <>
          Drafted in <ChapterEm>ink.</ChapterEm>
        </>
      }
      blurb="Recent rants, dev diaries, dossiers — read in order; none of it is rushed."
    />

    <div className="border-t border-[#1A1613]/25">
      {posts.slice(0, 6).map((p, i) => (
        <LogRow key={p.slug} post={p} index={i} />
      ))}
    </div>

    <div className="mt-6 flex items-baseline justify-between">
      <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.14em] uppercase text-[#2E2620]/60">
        {posts.length} total · showing {Math.min(posts.length, 6)}
      </span>
      <Link
        to="/blog"
        className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] uppercase text-[#9E4A2F] hover:text-[#C96442] transition-colors"
      >
        Read all →
      </Link>
    </div>
  </section>
);

/* =========================================================================
   § III — NAVIGATE (dictionary entry)
   ========================================================================= */
const NavigateChapter = () => (
  <section className="pt-24 md:pt-32 border-t border-[#1A161320]">
    <TerracottaChapter
      numeral="III"
      label="Navigate"
      title={
        <>
          Four verbs, <ChapterEm>four doors.</ChapterEm>
        </>
      }
      blurb="An entry in the codex reads itself — headword, pronunciation, a short numbered list of what it does."
    />

    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16">
      {/* left: the entry */}
      <div>
        <EntryCounterStyle />
        <TerracottaEntry
          headword="fezcodex"
          superscript="n. / v."
          pronunciation="/ˈfɛz.koʊ.dɛks/"
          also="the archive · the atlas · the codex"
        >
          <EntryPos label="verb">
            <EntryItem to="/projects" suffix="/projects">
              To <em className="italic text-[#2E2620]">peruse the archive</em> — selected,
              deployed work, built with care.
            </EntryItem>
            <EntryItem to="/blog" suffix="/blog">
              To <em className="italic text-[#2E2620]">read the field notes</em> — rants,
              dev diaries, and letters to future self.
            </EntryItem>
            <EntryItem to="/apps" suffix="/apps">
              To <em className="italic text-[#2E2620]">run an instrument</em> — experimental
              tools, small honest toys, artifacts.
            </EntryItem>
            <EntryItem to="/logs" suffix="/logs">
              To <em className="italic text-[#2E2620]">catalogue a thing</em> — books,
              films, games, meals, all rated plumb.
            </EntryItem>
          </EntryPos>

          <EntryPos label="noun" note="referential">
            <EntryItem to="/about" suffix="/about">
              The <em className="italic text-[#2E2620]">cartographer's kit itself</em> —
              the person and the methodology behind the archive.
            </EntryItem>
            <EntryItem to="/vocab" suffix="/vocab">
              A <em className="italic text-[#2E2620]">glossary of concepts</em> —
              definitions that the archive returns to.
            </EntryItem>
            <EntryItem to="/commands" suffix="⌘/ctrl + K">
              A <em className="italic text-[#2E2620]">command palette</em> — keyboard
              navigation for the whole of it.
            </EntryItem>
          </EntryPos>
        </TerracottaEntry>
      </div>

      {/* right: sticky "why" */}
      <aside className="lg:sticky lg:top-20 self-start flex flex-col gap-6">
        <h3 className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#9E4A2F]">
          The brief, in one line
        </h3>
        <p
          className="font-fraunces text-[20px] leading-[1.5] text-[#1A1613]"
          style={{
            fontVariationSettings: '"opsz" 24, "SOFT" 100, "wght" 400',
          }}
        >
          A codex is a small vertical honesty: this, now, before that. This one
          is held steady — indifferent to fashion. It drops. It holds.
        </p>
        <p className="font-ibm-plex-mono text-[14px] leading-[1.8] text-[#2E2620]">
          "Fezcode" described a person, a handle. <b className="font-medium">Fezcodex</b> describes
          the <em className="italic">behavior</em> of their archive. It is a verb that grades itself
          as it works: either the line is true, or it is not.
        </p>
        <blockquote
          className="mt-2 pl-8 pr-7 py-7 bg-[#E8DECE] border-l-[3px] border-[#C96442]"
        >
          <p
            className="font-fraunces italic text-[20px] md:text-[22px] leading-[1.4] text-[#2E2620]"
            style={{ fontVariationSettings: '"opsz" 32, "SOFT" 100, "wght" 340' }}
          >
            "Give me a plumb line, and I will measure the world."
          </p>
          <cite className="block mt-3.5 font-ibm-plex-mono text-[10px] tracking-[0.18em] uppercase not-italic text-[#9E4A2F]">
            — attributed, anonymous mason
          </cite>
        </blockquote>
      </aside>
    </div>
  </section>
);

/* =========================================================================
   LOADING (bone-native, still on paper)
   ========================================================================= */
const LoadingBone = ({ label = 'Plumbing the archive' }) => (
  <div
    className="min-h-screen relative"
    style={{ background: '#F3ECE0', backgroundImage: PAPER_GRADIENT }}
  >
    <div
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.35] mix-blend-multiply"
      style={{ backgroundImage: PAPER_GRAIN }}
    />
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-5">
        <TerracottaMark size={56} color="#C96442" sway />
        <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.32em] uppercase text-[#2E2620]/80">
          {label}
        </span>
      </div>
    </div>
  </div>
);

/* =========================================================================
   PAGE
   ========================================================================= */
const TerracottaHomePage = () => {
  const { config } = useSiteConfig();
  const { projects: pinnedProjects, loading: loadingProjects } = useProjects(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const time = useClock();

  const [homepageSectionOrder] = usePersistentState(KEY_HOMEPAGE_SECTION_ORDER, [
    'projects',
    'blogposts',
  ]);

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
        const combined = [...Array.from(seriesMap.values()), ...individualPosts];
        combined.sort(
          (a, b) => new Date(b.updated || b.date) - new Date(a.updated || a.date),
        );
        if (!cancelled) setPosts(combined);
      } catch (err) {
        // swallowed — show empty feed
      } finally {
        if (!cancelled) setLoadingPosts(false);
      }
    };
    fetchPostSlugs();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loadingProjects || loadingPosts) return <LoadingBone />;

  const codename = config?.kernel?.codename || 'bonewright';
  const kernelVersion = config?.kernel?.version || '';

  const chapters = {
    projects: <SelectedWorksChapter key="projects" projects={pinnedProjects} />,
    blogposts: <LatestLogsChapter key="blogposts" posts={posts} />,
  };

  return (
    <div
      className="min-h-screen relative text-[#1A1613] font-fraunces selection:bg-[#C96442]/25 selection:text-[#1A1613]"
      style={{
        background: '#F3ECE0',
        backgroundImage: PAPER_GRADIENT,
        fontFeatureSettings: '"ss01", "ss02", "kern"',
      }}
    >
      <Seo
        title="Fezcodex // Terracotta"
        description="A weighted codex of experimental software, field notes, and small honest instruments."
        keywords={['Fezcodex', 'terracotta', 'codex', 'plumb', 'editorial']}
      />

      {/* paper grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.35] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-14 pb-[120px]">
        {/* editorial strip */}
        <TerracottaStrip
          left={
            <>
              Fezcodex · Codex {kernelVersion && `${kernelVersion} · `}file 001
            </>
          }
          center="A weighted line, a single point"
          right={
            <>
              {time} · {codename}
            </>
          }
        />

        <HeroBlock config={config} />

        {/* Chapters — order honored from persistent prefs */}
        {homepageSectionOrder.map((name) => chapters[name] || null)}

        {/* Navigate always last */}
        <NavigateChapter />

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode / A. S. Bulbul</span>
              <span>Terracotta · built on Plumb identity v1</span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default TerracottaHomePage;
