import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useSiteConfig } from '../../context/SiteConfigContext';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_HOMEPAGE_SECTION_ORDER } from '../../utils/LocalStorageManager';
import {
  MistVeil,
  MistOrb,
  MistHorizon,
  MistStrip,
  MistChapter,
  ChapterEm,
  MistSpec,
  MistColophon,
} from '../../components/mist';

/* =========================================================================
   FOG
   ========================================================================= */
const FOG_GRADIENT =
  'radial-gradient(1100px 600px at 80% -10%, #FFFFFF 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #D2DBD8 0%, transparent 50%), radial-gradient(700px 500px at 95% 90%, #E5EBE9 0%, transparent 45%)';

const VEIL_CARD =
  'bg-white/40 backdrop-blur-sm rounded-2xl shadow-[0_18px_50px_rgba(60,72,69,0.10)]';

/* =========================================================================
   HELPERS
   ========================================================================= */
const formatLongDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

const formatDriftDate = (d) =>
  new Date(d)
    .toLocaleDateString('en-GB', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, ' · ');

/* shared reveal idiom — everything surfaces out of the fog */
const reveal = (index = 0, viewport = false) => ({
  initial: { opacity: 0, y: 10, filter: 'blur(6px)' },
  ...(viewport
    ? {
        whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
        viewport: { once: true, margin: '-60px' },
      }
    : { animate: { opacity: 1, y: 0, filter: 'blur(0px)' } }),
  transition: { duration: 0.8, ease: 'easeOut', delay: index * 0.06 },
});

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
   HERO WORDMARK — the orb hangs above the type like a moon at dawn;
   the final period glows drift-blue.
   ========================================================================= */
const HeroWordmark = ({ title = 'Fezcodex' }) => (
  <div className="relative">
    {/* the orb, suspended behind the headline */}
    <motion.div
      aria-hidden="true"
      className="absolute -top-[110px] left-[58%] md:left-[62%] opacity-80"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 0.8, filter: 'blur(0px)' }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      <MistOrb size={170} breathe />
    </motion.div>

    <h1
      aria-label={title}
      className="relative z-10 font-instr-serif font-normal text-[#3C4845] leading-[0.92] tracking-[-0.02em]"
      style={{ fontSize: 'clamp(96px, 15vw, 210px)' }}
    >
      {title}
      <span
        aria-hidden="true"
        className="text-[#8FA8BC]"
        style={{ textShadow: '0 0 22px rgba(143,168,188,0.85)' }}
      >
        .
      </span>
    </h1>
  </div>
);

/* =========================================================================
   HERO BLOCK
   ========================================================================= */
const HeroBlock = ({ config }) => {
  const heroTitle = config?.hero?.title || 'Fezcodex';
  const codename = config?.kernel?.codename;

  return (
    <section
      className="relative grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-20 items-center pt-24 md:pt-32 pb-16 md:pb-24"
      style={{ minHeight: '72vh' }}
    >
      {/* left: kicker + wordmark */}
      <motion.div {...reveal(1)}>
        <div className="flex items-center gap-3.5 mb-10 font-ibm-plex-mono text-[10.5px] tracking-[0.2em] lowercase text-[#5F837B]">
          <span>codex entry</span>
          <span
            aria-hidden="true"
            className="flex-1 max-w-[80px] h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(95,131,123,0.5), transparent)',
            }}
          />
          <span>
            {new Date()
              .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
              .toLowerCase()}
          </span>
        </div>

        <HeroWordmark title={heroTitle} />

        <p className="mt-8 font-instr-serif italic text-[24px] md:text-[30px] leading-[1.3] text-[#5C6B67] max-w-[34ch]">
          a codex, <span className="text-[#5F837B]">half-remembered</span> — it
          keeps what the morning forgets.
        </p>
      </motion.div>

      {/* right: drifting aside */}
      <motion.aside {...reveal(4)} className="flex flex-col gap-7 lg:pl-10">
        <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.18em] lowercase text-[#8A9894]">
          formerly <s className="opacity-60 decoration-[1px]">fezcode.com</s> —
          the fog keeps the rest
        </div>

        <div className={`${VEIL_CARD} p-8 grid grid-cols-2 gap-y-5 gap-x-6`}>
          <MistSpec label="pronunciation" value="/ˈfɛz.koʊ.dɛks/" />
          <MistSpec label="lineage" value="b. 2023" />
          <MistSpec label="kernel" value={codename} />
          <MistSpec label="authored by" value="A. S. Bulbul" />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2.5 font-instr-serif italic text-[19px] text-[#3C4845] hover:text-[#5F837B] transition-colors duration-[250ms]"
          >
            wander the archive
            <span
              aria-hidden="true"
              className="font-ibm-plex-mono text-sm text-[#5F837B] group-hover:translate-x-1 transition-transform duration-[250ms]"
            >
              →
            </span>
          </Link>
          <span
            aria-hidden="true"
            className="font-ibm-plex-mono text-[10px] tracking-[0.2em] lowercase text-[#8A9894]"
          >
            or
          </span>
          <Link
            to="/about"
            className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] lowercase text-[#5C6B67] hover:text-[#5F837B] transition-colors duration-[250ms]"
          >
            about
          </Link>
        </div>

        <div className="font-ibm-plex-mono text-[10px] tracking-[0.16em] lowercase text-[#8A9894]">
          visibility: low — proceed gently
        </div>
      </motion.aside>
    </section>
  );
};

/* =========================================================================
   PROJECT ROW — surfaces from the fog, dissolves to eucalyptus on hover
   ========================================================================= */
const ProjectRow = ({ project, index }) => (
  <motion.article {...reveal(index, true)} className="group">
    <Link
      to={`/projects/${project.slug}`}
      className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[60px_1fr_auto_auto] items-baseline gap-4 md:gap-8 py-8 border-b border-[#3C4845]/10"
    >
      <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] lowercase text-[#5F837B] self-baseline md:self-center">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <h3 className="font-instr-serif font-normal text-[26px] md:text-[36px] leading-[1.05] tracking-[-0.015em] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
          {project.title}
          <span
            aria-hidden="true"
            className="ml-2 text-[#8FA8BC] opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]"
            style={{ textShadow: '0 0 12px rgba(143,168,188,0.8)' }}
          >
            .
          </span>
        </h3>
        {project.shortDescription && (
          <p className="mt-2 font-outfit font-light text-[14.5px] md:text-[15.5px] leading-[1.6] text-[#5C6B67] max-w-[60ch]">
            {project.shortDescription}
          </p>
        )}
      </div>

      <div className="hidden md:flex flex-wrap gap-1.5 max-w-[220px] justify-end">
        {(project.technologies || []).slice(0, 3).map((t) => (
          <span
            key={t}
            className="font-ibm-plex-mono text-[9.5px] tracking-[0.16em] lowercase px-2 py-0.5 rounded-full bg-white/40 text-[#5C6B67]"
          >
            {t.toLowerCase()}
          </span>
        ))}
      </div>

      <span
        aria-hidden="true"
        className="font-ibm-plex-mono text-[#5F837B] text-sm self-baseline md:self-center -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-[250ms]"
      >
        →
      </span>
    </Link>
  </motion.article>
);

/* =========================================================================
   drift i — SELECTED WORKS
   ========================================================================= */
const SelectedWorksChapter = ({ projects }) => {
  const [first, ...rest] = projects;
  if (!first) return null;

  const techsAsValue = (techs) =>
    (techs || [])
      .slice(0, 4)
      .map((t) => t.toLowerCase())
      .join(' · ') || '—';

  return (
    <section className="pt-24 md:pt-32">
      <MistHorizon className="mb-24 md:mb-32" />
      <MistChapter
        numeral="i"
        label="selected works"
        title={
          <>
            half-built, <ChapterEm>fully meant.</ChapterEm>
          </>
        }
        blurb="kept while waking — the work that stayed when the rest dissolved."
      />

      {/* the first project as a veiled cover card */}
      <motion.div
        {...reveal(0, true)}
        className={`${VEIL_CARD} grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-center p-8 md:p-14`}
      >
        <div className="flex justify-center lg:justify-start">
          <MistOrb size={200} breathe title={`${first.title} — cover orb`} />
        </div>

        <div>
          <div className="font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5F837B] mb-3">
            entry 01 — the clearest memory
          </div>
          <Link to={`/projects/${first.slug}`} className="group inline-block">
            <h3 className="font-instr-serif font-normal text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.015em] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
              {first.title}
              <span
                aria-hidden="true"
                className="text-[#8FA8BC]"
                style={{ textShadow: '0 0 16px rgba(143,168,188,0.8)' }}
              >
                .
              </span>
            </h3>
          </Link>
          {first.shortDescription && (
            <p className="mt-4 font-outfit font-light text-[15.5px] leading-[1.7] text-[#5C6B67] max-w-[58ch]">
              {first.shortDescription}
            </p>
          )}

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-8">
            <MistSpec label="stack" value={techsAsValue(first.technologies)} />
            <MistSpec
              label="since"
              value={first.date ? formatLongDate(first.date).toLowerCase() : '—'}
            />
            <MistSpec
              label="access"
              value={
                <Link
                  to={`/projects/${first.slug}`}
                  className="text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
                >
                  /projects/{first.slug} →
                </Link>
              }
            />
          </div>
        </div>
      </motion.div>

      {/* remaining pinned projects — drifting rows */}
      {rest.length > 0 && (
        <div className="mt-20">
          <div className="flex items-baseline justify-between mb-4">
            <span className="font-ibm-plex-mono text-[10px] tracking-[0.2em] lowercase text-[#8A9894]">
              further apparitions
            </span>
            <Link
              to="/projects"
              className="font-ibm-plex-mono text-[10px] tracking-[0.2em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
            >
              full archive →
            </Link>
          </div>
          <MistHorizon />
          <div>
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
   drift ii — FIELD NOTES
   ========================================================================= */
const LogRow = ({ post, index }) => {
  const href = post.isSeries ? `/blog/series/${post.slug}` : `/blog/${post.slug}`;
  const date = new Date(post.updated || post.date);
  const category = (post.category || 'log').toLowerCase();
  return (
    <motion.article {...reveal(index, true)} className="group">
      <Link
        to={href}
        className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[110px_1fr_auto_auto] gap-4 md:gap-8 items-baseline py-6 border-b border-[#3C4845]/10"
      >
        <span className="font-ibm-plex-mono text-[10px] tracking-[0.18em] lowercase text-[#8A9894] self-baseline">
          {formatDriftDate(date)}
        </span>

        <h3 className="font-instr-serif italic font-normal text-[20px] md:text-[25px] leading-[1.25] tracking-[-0.01em] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
          {post.title}
        </h3>

        <span className="hidden md:inline-flex font-ibm-plex-mono text-[9.5px] tracking-[0.2em] lowercase px-2.5 py-0.5 rounded-full bg-white/40 text-[#5C6B67]">
          {post.isSeries ? 'series' : category}
        </span>

        <span
          aria-hidden="true"
          className="font-ibm-plex-mono text-[#5F837B] text-sm self-baseline -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-[250ms]"
        >
          →
        </span>
      </Link>
    </motion.article>
  );
};

const LatestLogsChapter = ({ posts }) => (
  <section className="pt-24 md:pt-32">
    <MistHorizon className="mb-24 md:mb-32" />
    <MistChapter
      numeral="ii"
      label="field notes"
      title={
        <>
          written at the <ChapterEm>threshold.</ChapterEm>
        </>
      }
      blurb="notes taken between waking and sleep — read gently; none of it is rushed."
    />

    <MistHorizon />
    <div>
      {posts.slice(0, 6).map((p, i) => (
        <LogRow key={p.slug} post={p} index={i} />
      ))}
    </div>

    <div className="mt-6 flex items-baseline justify-between">
      <span className="font-ibm-plex-mono text-[10px] tracking-[0.14em] lowercase text-[#8A9894]">
        {posts.length} total · showing {Math.min(posts.length, 6)} — the fog
        keeps the rest
      </span>
      <Link
        to="/blog"
        className="font-ibm-plex-mono text-[10px] tracking-[0.2em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
      >
        read all →
      </Link>
    </div>
  </section>
);

/* =========================================================================
   drift iii — NAVIGATE (doors in the fog)
   ========================================================================= */
const DOORS = [
  {
    to: '/projects',
    suffix: '/projects',
    phrase: 'wander the archive',
    whisper: 'selected, deployed work — the parts that stayed solid.',
  },
  {
    to: '/blog',
    suffix: '/blog',
    phrase: 'read the field notes',
    whisper: 'rants, dev diaries, letters left out overnight.',
  },
  {
    to: '/apps',
    suffix: '/apps',
    phrase: 'run an instrument',
    whisper: 'experimental tools and small honest toys, still warm.',
  },
  {
    to: '/logs',
    suffix: '/logs',
    phrase: 'catalogue a thing',
    whisper: 'books, films, games, meals — rated before they fade.',
  },
  {
    to: '/about',
    suffix: '/about',
    phrase: 'meet the dreamer',
    whisper: 'the person and the method behind the codex.',
  },
  {
    to: '/vocab',
    suffix: '/vocab',
    phrase: 'recall a word',
    whisper: 'a glossary the archive returns to, half-asleep.',
  },
  {
    to: '/commands',
    suffix: '⌘/ctrl + k',
    phrase: 'whisper a command',
    whisper: 'keyboard navigation for the whole of it.',
  },
];

const DoorRow = ({ door, index }) => (
  <motion.div {...reveal(index, true)} className="group">
    <Link
      to={door.to}
      className="grid grid-cols-[auto_1fr_auto] gap-5 md:gap-8 items-baseline py-5 border-b border-[#3C4845]/10"
    >
      <span className="font-ibm-plex-mono text-[10px] tracking-[0.18em] lowercase text-[#8A9894] w-[26px]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <span className="font-instr-serif italic font-normal text-[20px] md:text-[23px] leading-[1.25] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
          {door.phrase}
        </span>
        <p className="mt-1 font-outfit font-light text-[13.5px] leading-[1.6] text-[#8A9894]">
          {door.whisper}
        </p>
      </div>
      <span className="font-ibm-plex-mono text-[10px] tracking-[0.16em] lowercase text-[#5F837B] self-baseline opacity-70 group-hover:opacity-100 transition-opacity duration-[250ms]">
        {door.suffix}
      </span>
    </Link>
  </motion.div>
);

const NavigateChapter = () => (
  <section className="pt-24 md:pt-32">
    <MistHorizon className="mb-24 md:mb-32" />
    <MistChapter
      numeral="iii"
      label="navigate"
      title={
        <>
          seven doors, <ChapterEm>all ajar.</ChapterEm>
        </>
      }
      blurb="every path looks the same in fog — pick one and the codex will meet you there."
    />

    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16">
      {/* left: the doors */}
      <div>
        <MistHorizon />
        {DOORS.map((door, i) => (
          <DoorRow key={door.to} door={door} index={i} />
        ))}
      </div>

      {/* right: sticky "why" */}
      <aside className="lg:sticky lg:top-20 self-start flex flex-col gap-6">
        <h3 className="font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5F837B]">
          the brief, in one breath
        </h3>
        <p className="font-instr-serif font-normal text-[22px] leading-[1.45] text-[#3C4845]">
          A codex is a place to keep what the morning forgets. This one is held
          loosely — half-remembered, half-imagined — and it answers to whoever
          is still gentle enough to ask.
        </p>
        <p className="font-outfit font-light text-[14.5px] leading-[1.8] text-[#5C6B67]">
          "fezcode" described a person, a handle.{' '}
          <span className="font-normal text-[#3C4845]">fezcodex</span> describes
          the <em className="italic">weather</em> of their archive: pale, slow,
          drifting — but everything important condenses here eventually.
        </p>
        <motion.blockquote
          {...reveal(2, true)}
          className={`${VEIL_CARD} mt-2 px-8 py-8`}
        >
          <p className="font-instr-serif italic font-normal text-[21px] md:text-[23px] leading-[1.4] text-[#3C4845]">
            "Between waking and sleep there is a door, and it is never quite
            closed."
          </p>
          <cite className="block mt-4 font-ibm-plex-mono text-[10px] tracking-[0.18em] lowercase not-italic text-[#5F837B]">
            — overheard at dawn, source dissolved
          </cite>
        </motion.blockquote>
      </aside>
    </div>
  </section>
);

/* =========================================================================
   LOADING — the orb breathes while the page condenses
   ========================================================================= */
const LoadingFog = ({ label = 'condensing…' }) => (
  <div
    className="min-h-screen relative"
    style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
  >
    <MistVeil />
    <div className="relative z-10 flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-6">
        <MistOrb size={64} breathe />
        <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.26em] lowercase text-[#8A9894]">
          {label}
        </span>
      </div>
    </div>
  </div>
);

/* =========================================================================
   PAGE
   ========================================================================= */
const MistHomePage = () => {
  const { config } = useSiteConfig();
  const { projects: pinnedProjects, loading: loadingProjects } =
    useProjects(true);
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
        // swallowed — the fog keeps the rest
      } finally {
        if (!cancelled) setLoadingPosts(false);
      }
    };
    fetchPostSlugs();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loadingProjects || loadingPosts) return <LoadingFog />;

  const codename = config?.kernel?.codename;
  const kernelVersion = config?.kernel?.version || '';

  const chapters = {
    projects: <SelectedWorksChapter key="projects" projects={pinnedProjects} />,
    blogposts: <LatestLogsChapter key="blogposts" posts={posts} />,
  };

  return (
    <div
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Fezcodex // Mist"
        description="A codex, half-remembered — experimental software, field notes, and small honest instruments, kept while waking."
        keywords={['Fezcodex', 'mist', 'codex', 'hypnagogia', 'fog']}
      />

      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        {/* whisper strip */}
        <MistStrip
          left={
            <>
              fezcodex · codex {kernelVersion && `${kernelVersion} · `}file 001
            </>
          }
          center="half-remembered, half-imagined"
          right={
            <>
              {time} · {codename}
            </>
          }
        />

        <HeroBlock config={config} />

        {/* Drifts — order honored from persistent prefs */}
        {homepageSectionOrder.map((name) => chapters[name] || null)}

        {/* Navigate always last */}
        <NavigateChapter />

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode / a. s. bulbul</span>
              <span>mist · built at the threshold, identity v1</span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default MistHomePage;
