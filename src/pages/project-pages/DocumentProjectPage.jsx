import React, { useState } from 'react';
import {
  useAppConfig,
  useThemeFonts,
  AppLoading,
  AppMissing,
  AppSeo,
  BackLink,
} from './app-shell';
import MarkdownContent from '../../components/MarkdownContent';

/* ============================================================
 * "document" — pidi.
 *
 * A reader is chrome wrapped around a page. Here the page is literally
 * a sheet of paper floating on the reader's dark ground, the sections
 * are its pages, and the sidebar is the outline panel pidi itself puts
 * beside a PDF — so the navigation is the product's own feature.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300..700&family=Source+Sans+3:wght@300;400;600&display=swap';

const READER = '#15171A';
const RAIL = '#1C1F23';
const SHEET = '#FBF9F5';
const INK = '#1A1D21';
const DIM = '#6E7681';
const RULE = '#E1DCD3';
const EDGE = 'rgba(251,249,245,0.12)';

const SERIF = { fontFamily: "'Source Serif 4', Georgia, serif" };
const SANS = { fontFamily: "'Source Sans 3', system-ui, sans-serif" };

const Sheet = ({ children, page, total }) => (
  <div
    className="relative mx-auto w-full"
    style={{
      background: SHEET,
      color: INK,
      maxWidth: 820,
      boxShadow: '0 24px 60px -28px rgba(0,0,0,0.85)',
    }}
  >
    <div className="px-7 sm:px-16 py-12 sm:py-16">{children}</div>
    {page && (
      <div
        className="px-7 sm:px-16 pb-6 text-[12px] flex justify-between"
        style={{ ...SANS, color: DIM, borderTop: `1px solid ${RULE}`, paddingTop: 12 }}
      >
        <span>pidi</span>
        <span>
          {page} / {total}
        </span>
      </div>
    )}
  </div>
);

const DocumentProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'document');
  const [outlineOpen, setOutlineOpen] = useState(true);

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={READER} color={SHEET} />;

  const a = cfg.accent || '#B8763C';

  const outline = [
    { id: 'overview', label: 'Overview' },
    ...((cfg.panels || []).length ? [{ id: 'features', label: cfg.panelsHeading || 'Features' }] : []),
    ...((cfg.shots || []).length ? [{ id: 'shots', label: cfg.shotsHeading || 'On screen' }] : []),
    ...((cfg.keys || []).length ? [{ id: 'keys', label: cfg.keysHeading || 'Keyboard' }] : []),
    ...(cfg.terminal ? [{ id: 'build', label: cfg.terminalHeading || 'Build' }] : []),
    ...(cfg.notes ? [{ id: 'notes', label: cfg.notesTitle || 'Notes' }] : []),
  ];
  const total = outline.length;

  return (
    <div className="min-h-screen" style={{ background: READER, color: SHEET, ...SANS }}>
      <AppSeo cfg={cfg} project={project} />

      {/* reader chrome */}
      <div
        className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 h-12"
        style={{ background: RAIL, borderBottom: `1px solid ${EDGE}` }}
      >
        <BackLink color={SHEET} />
        <button
          type="button"
          onClick={() => setOutlineOpen((v) => !v)}
          className="text-[12.5px] px-2.5 py-1.5"
          style={{ color: outlineOpen ? a : SHEET, border: `1px solid ${EDGE}`, borderRadius: 4 }}
          aria-pressed={outlineOpen}
        >
          Outline
        </button>
        <span className="text-[13px]" style={{ opacity: 0.85 }}>
          {cfg.windowTitle}
        </span>
        <span className="ml-auto text-[12px]" style={{ opacity: 0.6 }}>
          v{cfg.version}
        </span>
      </div>

      <div className="flex">
        {/* the outline panel — pidi's own */}
        {outlineOpen && (
          <nav
            className="hidden md:block flex-none w-60 sticky top-12 self-start py-7 px-5"
            style={{ background: RAIL, borderRight: `1px solid ${EDGE}`, height: 'calc(100vh - 48px)' }}
          >
            <p className="text-[11px] mb-4" style={{ opacity: 0.5, letterSpacing: '0.12em' }}>
              CONTENTS
            </p>
            <ul className="space-y-1">
              {outline.map((o, i) => (
                <li key={o.id}>
                  <a
                    href={`#${o.id}`}
                    className="flex gap-3 py-1.5 text-[13.5px]"
                    style={{ color: SHEET, opacity: 0.82 }}
                  >
                    <span style={{ color: a, minWidth: 16 }}>{i + 1}</span>
                    {o.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <main className="flex-1 min-w-0 px-4 sm:px-8 py-10 space-y-10">
          <section id="overview">
            <Sheet page={1} total={total}>
              <h1
                className="text-[32px] sm:text-[46px] leading-[1.1]"
                style={{ ...SERIF, fontWeight: 600, maxWidth: '18ch', letterSpacing: '-0.015em' }}
              >
                {cfg.tagline}
              </h1>
              <p
                className="mt-6 text-[16.5px] leading-[1.72]"
                style={{ ...SERIF, color: '#3C434B', maxWidth: '62ch' }}
              >
                {cfg.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {cfg.download && (
                  <a
                    href={cfg.download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 text-[14px] font-semibold"
                    style={{ background: a, color: '#fff', borderRadius: 4 }}
                  >
                    {cfg.downloadLabel || 'Download'}
                  </a>
                )}
                {cfg.repo && (
                  <a
                    href={cfg.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 text-[14px]"
                    style={{ border: `1px solid ${RULE}`, color: INK, borderRadius: 4 }}
                  >
                    Read the source
                  </a>
                )}
              </div>
              {(cfg.summary || []).map((p, i) => (
                <p
                  key={i}
                  className="mt-7 text-[16px] leading-[1.78]"
                  style={{ ...SERIF, color: '#434A52', maxWidth: '64ch' }}
                >
                  {p}
                </p>
              ))}
            </Sheet>
          </section>

          {(cfg.panels || []).length > 0 && (
            <section id="features">
              <Sheet page={2} total={total}>
                <h2 className="text-[24px] mb-8" style={{ ...SERIF, fontWeight: 600 }}>
                  {cfg.panelsHeading}
                </h2>
                <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                  {cfg.panels.map((p, i) => (
                    <div key={i}>
                      <h3 className="text-[16px] mb-1.5" style={{ fontWeight: 600 }}>
                        {p.title}
                      </h3>
                      <p className="text-[14.5px] leading-[1.7]" style={{ color: '#535A63', maxWidth: '44ch' }}>
                        {p.body}
                      </p>
                      {p.keys && (
                        <code
                          className="mt-2 inline-block text-[12px] px-2 py-1"
                          style={{ background: '#F0ECE4', color: a, borderRadius: 3 }}
                        >
                          {p.keys}
                        </code>
                      )}
                    </div>
                  ))}
                </div>
              </Sheet>
            </section>
          )}

          {(cfg.shots || []).length > 0 && (
            <section id="shots">
              <Sheet page={3} total={total}>
                <h2 className="text-[24px] mb-7" style={{ ...SERIF, fontWeight: 600 }}>
                  {cfg.shotsHeading}
                </h2>
                <div className="space-y-8">
                  {cfg.shots.map((s, i) => (
                    <figure key={i}>
                      <img src={s.src} alt={s.caption || cfg.name} loading="lazy" className="w-full h-auto" style={{ border: `1px solid ${RULE}` }} />
                      <figcaption className="mt-2.5 text-[13px]" style={{ color: DIM }}>{s.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </Sheet>
            </section>
          )}

          {(cfg.keys || []).length > 0 && (
            <section id="keys">
              <Sheet page={4} total={total}>
                <h2 className="text-[24px] mb-7" style={{ ...SERIF, fontWeight: 600 }}>
                  {cfg.keysHeading}
                </h2>
                <dl>
                  {cfg.keys.map((k, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-baseline gap-x-6 py-2.5"
                      style={{ borderBottom: `1px solid ${RULE}` }}
                    >
                      <dt className="text-[13.5px]" style={{ color: a, minWidth: 150, fontWeight: 600 }}>
                        {k.k}
                      </dt>
                      <dd className="text-[15px]" style={{ color: '#4A515A' }}>
                        {k.a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Sheet>
            </section>
          )}

          {cfg.terminal && (
            <section id="build">
              <Sheet page={5} total={total}>
                <h2 className="text-[24px] mb-6" style={{ ...SERIF, fontWeight: 600 }}>
                  {cfg.terminalHeading}
                </h2>
                <pre
                  className="overflow-x-auto text-[13px] leading-[1.95] px-4 py-4"
                  style={{ margin: 0, background: '#F1EDE5', color: INK, fontFamily: 'ui-monospace, monospace' }}
                >
                  {(cfg.terminal.lines || []).map((l, i) => (
                    <div key={i}>
                      <span style={{ color: a }}>$</span> {l}
                    </div>
                  ))}
                </pre>
              </Sheet>
            </section>
          )}

          {cfg.notes && (
            <section id="notes">
              <Sheet page={total} total={total}>
                <h2 className="text-[24px] mb-6" style={{ ...SERIF, fontWeight: 600 }}>
                  {cfg.notesTitle}
                </h2>
                <div className="text-[16px] leading-[1.78]" style={{ ...SERIF, maxWidth: '66ch' }}>
                  <MarkdownContent content={cfg.notes} />
                </div>
              </Sheet>
            </section>
          )}

          {(cfg.colophon || []).length > 0 && (
            <div
              className="mx-auto grid gap-y-6 gap-x-8 pt-4 pb-16"
              style={{ maxWidth: 820, gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))' }}
            >
              {cfg.colophon.map(([k, v], i) => (
                <div key={i}>
                  <div className="text-[12px] mb-1.5" style={{ opacity: 0.55 }}>{k}</div>
                  <div className="text-[14px] break-words" style={{ opacity: 0.92 }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DocumentProjectPage;
