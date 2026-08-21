import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';
import piml from 'piml';
import { version } from '../version';
import Loading from '../components/Loading';
import '../styles/Dashboard.css';

/**
 * FZX Control Surface — the dashboard as a piece of hardware on the bench.
 * Recessed phosphor LCDs carry the numbers, segmented LED meters carry the
 * distributions, a 12-month oscillogram is computed from the real dates of
 * posts, apps, logs and issues, the tape log is a date-merged feed across
 * all sources, and the rotary knob physically pulls a random entry from
 * the archive.
 */

const MONTH_LETTERS = 'JFMAMJJASOND';

const Screw = ({ className = '' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    aria-hidden="true"
    className={`absolute ${className}`}
  >
    <circle
      cx="8"
      cy="8"
      r="6.5"
      fill="var(--fzx-panel-deep)"
      stroke="rgba(51,50,44,0.45)"
    />
    <circle cx="8" cy="8" r="6.5" fill="rgba(0,0,0,0.06)" />
    <line
      x1="4"
      y1="10.5"
      x2="12"
      y2="5.5"
      stroke="rgba(51,50,44,0.7)"
      strokeWidth="1.4"
    />
  </svg>
);

const Keycap = ({ to, glyph, label, cap }) => (
  <Link to={to} className="fzx-key">
    <span className="fzx-keycap" style={{ '--fzx-cap': cap }}>
      {glyph}
    </span>
    <span className="fzx-silk is-soft">{label}</span>
  </Link>
);

const Knob = ({ onPull }) => {
  const [turns, setTurns] = useState(0);

  const handle = () => {
    setTurns((t) => t + 1);
    onPull();
  };

  return (
    <button
      type="button"
      className="fzx-knob"
      onClick={handle}
      aria-label="Pull a random entry from the archive"
    >
      <svg
        width="104"
        height="104"
        viewBox="0 0 104 104"
        className="fzx-knob-face"
        style={{ transform: `rotate(${turns * 137}deg)` }}
      >
        <circle
          cx="52"
          cy="52"
          r="50"
          fill="none"
          stroke="rgba(51,50,44,0.35)"
          strokeWidth="2"
          strokeDasharray="2 6"
        />
        <circle
          cx="52"
          cy="52"
          r="42"
          fill="var(--fzx-panel-deep)"
          stroke="rgba(51,50,44,0.5)"
          strokeWidth="1.5"
        />
        <circle cx="52" cy="52" r="42" fill="rgba(255,255,255,0.18)" />
        <circle
          cx="52"
          cy="52"
          r="30"
          fill="var(--fzx-panel)"
          stroke="rgba(51,50,44,0.35)"
        />
        <line
          x1="52"
          y1="12"
          x2="52"
          y2="30"
          stroke="var(--fzx-orange)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
      <span className="fzx-silk">Pull</span>
    </button>
  );
};

const Meter = ({ label, value, max, color }) => {
  const SEGMENTS = 14;
  const lit = Math.max(
    value > 0 ? 1 : 0,
    Math.round((value / Math.max(1, max)) * SEGMENTS),
  );
  return (
    <div className="grid grid-cols-[92px_1fr_34px] items-center gap-3">
      <span className="fzx-silk is-soft truncate" title={label}>
        {label}
      </span>
      <div
        className="fzx-meter"
        role="img"
        aria-label={`${label}: ${value} of ${max}`}
      >
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <span
            key={i}
            className={`fzx-seg ${i < lit ? 'is-lit' : ''}`}
            style={{ color }}
          />
        ))}
      </div>
      <span
        className="fzx-silk text-right"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </span>
    </div>
  );
};

const CounterScreen = ({ label, value, to }) => (
  <Link to={to} className="block no-underline group">
    <div className="fzx-screen px-4 py-3">
      <div className="fzx-screen-label">{label}</div>
      <div className="fzx-digits font-mono font-bold text-3xl mt-1.5">
        {String(value).padStart(3, '0')}
      </div>
      <div className="fzx-screen-label mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        open →
      </div>
    </div>
  </Link>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    counts: { posts: 0, apps: 0, projects: 0, logs: 0, vague: 0 },
    postsByCategory: {},
    appsByCategory: {},
    projectStatus: { active: 0, archived: 0 },
    months: [],
    feed: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [postsRes, appsRes, projectsRes, vagueRes] = await Promise.all([
          fetch('/posts/posts.json'),
          fetch('/apps/apps.json'),
          fetch('/projects/projects.piml'),
          fetch('/the_vague/issues.piml'),
        ]);

        const posts = await postsRes.json();
        const apps = await appsRes.json();
        const projects = piml.parse(await projectsRes.text()).projects || [];
        const vague = piml.parse(await vagueRes.text()).issues || [];

        const logCategories = [
          'article',
          'book',
          'event',
          'food',
          'game',
          'movie',
          'music',
          'reading',
          'series',
          'tools',
          'video',
          'websites',
          'quote',
        ];
        let logCount = 0;
        const logDates = [];
        await Promise.all(
          logCategories.map(async (cat) => {
            try {
              const res = await fetch(`/logs/${cat}/${cat}.piml`);
              if (!res.ok) return;
              const parsed = piml.parse(await res.text());
              const items = parsed.logs || parsed.items || [];
              logCount += items.length;
              items.forEach((i) => i.date && logDates.push(i.date));
            } catch (e) {
              console.error(`Error fetching logs for ${cat}:`, e);
            }
          }),
        );

        const allApps = Object.values(apps).flatMap((c) => c.apps || []);

        // 12-month oscillogram from every dated thing on the site.
        const buckets = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          buckets.push({
            key: `${d.getFullYear()}-${d.getMonth()}`,
            letter: MONTH_LETTERS[d.getMonth()],
            count: 0,
          });
        }
        const bucketMap = Object.fromEntries(buckets.map((b) => [b.key, b]));
        const tally = (raw) => {
          const d = new Date(raw);
          if (Number.isNaN(d.getTime())) return;
          const b = bucketMap[`${d.getFullYear()}-${d.getMonth()}`];
          if (b) b.count += 1;
        };
        posts.forEach((p) => p.date && tally(p.date));
        allApps.forEach((a) => a.created_at && tally(a.created_at));
        vague.forEach((v) => v.date && tally(v.date));
        logDates.forEach(tally);

        // Tape log: one feed, merged by date across sources.
        const feed = [
          ...posts.slice(0, 10).map((p) => ({
            kind: 'PST',
            title: p.title,
            date: p.date,
            to: `/blog/${p.slug}`,
          })),
          ...allApps
            .filter((a) => a.created_at)
            .map((a) => ({
              kind: 'APP',
              title: a.title,
              date: a.created_at,
              to: a.to,
            })),
          ...vague.map((v) => ({
            kind: 'VGE',
            title: v.title,
            date: v.date,
            to: '/the-vague',
          })),
        ]
          .filter((f) => f.date && !Number.isNaN(new Date(f.date).getTime()))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7);

        setState({
          counts: {
            posts: posts.length,
            apps: allApps.length,
            projects: projects.length,
            logs: logCount,
            vague: vague.length,
          },
          postsByCategory: posts.reduce((acc, p) => {
            const c = p.category || 'other';
            acc[c] = (acc[c] || 0) + 1;
            return acc;
          }, {}),
          appsByCategory: Object.fromEntries(
            Object.values(apps).map((c) => [c.name, (c.apps || []).length]),
          ),
          projectStatus: {
            active: projects.filter(
              (p) => p.isActive === true || p.isActive === 'true',
            ).length,
            archived: projects.filter(
              (p) => p.isActive !== true && p.isActive !== 'true',
            ).length,
          },
          months: buckets,
          feed,
        });
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Loading />;

  const { counts, postsByCategory, appsByCategory, projectStatus, months, feed } =
    state;
  const total =
    counts.posts + counts.apps + counts.projects + counts.logs + counts.vague;
  const monthMax = Math.max(1, ...months.map((m) => m.count));
  const dutyPct = Math.round(
    (projectStatus.active /
      Math.max(1, projectStatus.active + projectStatus.archived)) *
      100,
  );
  const today = new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll('-', '.');

  const pull = () => {
    setTimeout(() => navigate('/random'), 300);
  };

  const fmtFeedDate = (raw) => {
    const d = new Date(raw);
    return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(
      d.getDate(),
    ).padStart(2, '0')}`;
  };

  return (
    <div className="fzx-bench font-mono pt-24 pb-14 px-4 md:px-8">
      <Seo
        title="Dashboard | Fezcodex"
        description="The FZX Control Surface — fezcodex metrics on phosphor LCDs, LED meters, and a knob that pulls random entries from the archive."
        keywords={['dashboard', 'metrics', 'stats', 'fezcodex', 'control surface']}
      />

      <div className="fzx-panel relative max-w-6xl mx-auto px-5 md:px-10 py-8">
        <Screw className="top-3 left-3" />
        <Screw className="top-3 right-3" />
        <Screw className="bottom-3 left-3" />
        <Screw className="bottom-3 right-3" />

        {/* top rail */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="fzx-led is-green" aria-hidden="true" />
            <span className="fzx-engrave font-outfit font-extrabold text-2xl tracking-tight">
              FEZCODEX
            </span>
            <span className="fzx-silk is-soft">Control Surface</span>
          </div>
          <span
            className="fzx-silk is-soft"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            Model FZX-33 · v{version} · Inkwright
          </span>
        </div>

        <hr className="fzx-divider my-6" />

        {/* row 1: main display · signal · access */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5">
            <div className="fzx-silk mb-2">Archive Total</div>
            <div className="fzx-screen px-6 py-5 h-[calc(100%-24px)] flex flex-col justify-between gap-4">
              <div className="fzx-screen-label">Items on file</div>
              <div
                className="fzx-digits font-mono font-bold"
                style={{ fontSize: 'clamp(4rem, 8vw, 6.5rem)' }}
              >
                {total}
              </div>
              <div
                className="fzx-screen-line"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {today} · ALL SYSTEMS NOMINAL
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="fzx-silk mb-2">Signal · 12 mo activity</div>
            <div className="fzx-screen px-5 py-4 h-[calc(100%-24px)] flex flex-col justify-end">
              <div
                className="flex items-end gap-2 h-32"
                role="img"
                aria-label={`New entries per month, last twelve months: ${months
                  .map((m) => m.count)
                  .join(', ')}`}
              >
                {months.map((m, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col justify-end gap-[3px]"
                  >
                    {Array.from({
                      length: Math.max(
                        m.count > 0 ? 1 : 0,
                        Math.round((m.count / monthMax) * 8),
                      ),
                    }).map((_, s) => (
                      <span
                        key={s}
                        className="block h-[9px] rounded-[2px]"
                        style={{
                          background: 'var(--fzx-phosphor)',
                          boxShadow: '0 0 5px rgba(167,236,191,0.5)',
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {months.map((m, i) => (
                  <span
                    key={i}
                    className="flex-1 text-center fzx-screen-label"
                  >
                    {m.letter}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="fzx-silk mb-2">Archive Access</div>
            <div className="fzx-module h-[calc(100%-24px)] flex flex-col items-center justify-between gap-4 py-5">
              <Knob onPull={pull} />
              <p className="fzx-silk is-soft text-center leading-relaxed px-2">
                Press to pull one random entry
              </p>
              <div className="flex flex-wrap justify-center gap-3 w-full px-2">
                <Keycap
                  to="/graph"
                  glyph="G"
                  label="Graph"
                  cap="var(--fzx-teal)"
                />
                <Keycap
                  to="/logs"
                  glyph="L"
                  label="Logs"
                  cap="var(--fzx-yellow)"
                />
                <Keycap
                  to="/settings"
                  glyph="S"
                  label="Setup"
                  cap="var(--fzx-orange)"
                />
                <Keycap
                  to="/about/skills"
                  glyph="A"
                  label="About"
                  cap="var(--fzx-panel-deep)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* row 2: counters */}
        <div className="fzx-silk mt-8 mb-2">Counters</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <CounterScreen label="Posts" value={counts.posts} to="/blog" />
          <CounterScreen label="Apps" value={counts.apps} to="/apps" />
          <CounterScreen
            label="Projects"
            value={counts.projects}
            to="/projects"
          />
          <CounterScreen label="Logs" value={counts.logs} to="/logs" />
          <CounterScreen label="Vague" value={counts.vague} to="/the-vague" />
        </div>

        {/* row 3: mix + project duty */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-8">
          <div className="lg:col-span-8">
            <div className="fzx-silk mb-2">Mix · composition</div>
            <div className="fzx-module grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex flex-col gap-3">
                <span className="fzx-silk">Posts</span>
                {Object.entries(postsByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([cat, n]) => (
                    <Meter
                      key={cat}
                      label={cat}
                      value={n}
                      max={counts.posts}
                      color="var(--fzx-orange)"
                    />
                  ))}
              </div>
              <div className="flex flex-col gap-3">
                <span className="fzx-silk">Apps</span>
                {Object.entries(appsByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([cat, n]) => (
                    <Meter
                      key={cat}
                      label={cat}
                      value={n}
                      max={counts.apps}
                      color="var(--fzx-teal)"
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="fzx-silk mb-2">Projects · duty cycle</div>
            <div className="fzx-module h-[calc(100%-24px)] flex flex-col justify-between gap-4">
              <div className="fzx-screen px-4 py-3 flex items-baseline justify-between">
                <span className="fzx-screen-label">Duty</span>
                <span className="fzx-digits font-mono font-bold text-3xl">
                  {dutyPct}%
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="fzx-silk is-soft">Run</span>
                  <span className="fzx-silk">{projectStatus.active}</span>
                </div>
                <div
                  className="flex flex-wrap gap-1.5"
                  aria-label={`${projectStatus.active} active projects`}
                >
                  {Array.from({ length: projectStatus.active }).map((_, i) => (
                    <span key={i} className="fzx-led is-green" />
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="fzx-silk is-soft">Hold</span>
                  <span className="fzx-silk">{projectStatus.archived}</span>
                </div>
                <div
                  className="flex flex-wrap gap-1.5"
                  aria-label={`${projectStatus.archived} archived projects`}
                >
                  {Array.from({ length: projectStatus.archived }).map(
                    (_, i) => (
                      <span key={i} className="fzx-led" />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* row 4: tape log */}
        <div className="fzx-silk mt-8 mb-2">Tape Log · merged feed</div>
        <div className="fzx-screen px-5 py-4">
          <div className="fzx-screen-label mb-2">
            Date · SRC · Entry — newest first
          </div>
          <div className="flex flex-col gap-1.5">
            {feed.map((f, i) => (
              <Link
                key={i}
                to={f.to || '/'}
                className={`fzx-screen-line no-underline hover:opacity-70 ${
                  i === feed.length - 1 ? 'fzx-cursor' : ''
                }`}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {fmtFeedDate(f.date)} {f.kind} {String(f.title).toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        <hr className="fzx-divider mt-8 mb-4" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <span className="fzx-silk is-soft">
            Designed at fezcode · no user-serviceable parts inside
          </span>
          <span className="fzx-silk is-soft">
            Recounted on every power-on
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
