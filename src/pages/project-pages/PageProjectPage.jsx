import React from 'react';
import {
  useAppConfig,
  useThemeFonts,
  AppLoading,
  AppMissing,
  AppSeo,
  BackLink,
} from './app-shell';

/* ============================================================
 * "page" — Typewriter.
 *
 * One sheet in the carriage. Everything is typed on it in a single
 * monospaced face at a fixed measure, numbered down the margin the way
 * the app numbers lines, with the margin bell at column 80. No chrome
 * and no cards: the paper is the whole interface, which is the entire
 * point of the program.
 * ============================================================ */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap';

const DESK = '#2B2A27';
const PAPER = '#F4EEE0';
const CARBON = '#26241F';
const FADED = '#7C7568';
const RIBBON = '#9E4A38';

const TYPE = { fontFamily: "'Courier Prime', ui-monospace, monospace" };

const MEASURE = 64;

/** Wrap a paragraph to the carriage width, on word boundaries. */
const wrap = (text, width = MEASURE) => {
  const words = String(text).split(/\s+/).filter(Boolean);
  const out = [];
  let line = '';
  for (const w of words) {
    if (line && (line + ' ' + w).length > width) {
      out.push(line);
      line = w;
    } else {
      line = line ? `${line} ${w}` : w;
    }
  }
  if (line) out.push(line);
  return out;
};

/**
 * Build the whole sheet as a flat list of typed lines first, then render.
 * Numbering has to be a pure function of position — deriving it during
 * render produced duplicates and gaps.
 */
const buildDocument = (cfg) => {
  const L = [];
  const push = (text = '', opts = {}) => L.push({ text, ...opts });
  const rule = (ch = '=') => ch.repeat(MEASURE);

  push(cfg.name.toUpperCase(), { bold: true });
  push(rule(), { faded: true });
  push();
  push(cfg.tagline, { bold: true });
  push();
  wrap(cfg.subtitle || '').forEach((l) => push(l));
  push();
  push(
    `v${cfg.version}  |  ${(cfg.platforms || []).join(' / ')}  |  ${(cfg.stack || []).join(' / ')}`,
    { faded: true },
  );
  push();
  push('', { slot: 'actions' });
  push();

  (cfg.summary || []).forEach((para) => {
    wrap(para).forEach((l) => push(l));
    push();
  });

  if ((cfg.panels || []).length) {
    push((cfg.panelsHeading || 'Features').toUpperCase(), { bold: true });
    push(rule('-'), { faded: true });
    push();
    cfg.panels.forEach((p) => {
      push(`* ${p.title}`, { bold: true });
      wrap(p.body, MEASURE - 2).forEach((l) => push(`  ${l}`));
      push();
    });
  }

  if ((cfg.keys || []).length) {
    push((cfg.keysHeading || 'Keyboard').toUpperCase(), { bold: true });
    push(rule('-'), { faded: true });
    push();
    cfg.keys.forEach((k) => push('', { slot: 'key', key: k }));
    push();
  }

  if ((cfg.shots || []).length) {
    push((cfg.shotsHeading || 'On screen').toUpperCase(), { bold: true });
    push(rule('-'), { faded: true });
    push();
    push('', { slot: 'shots' });
    push();
  }

  if (cfg.terminal) {
    push((cfg.terminalHeading || 'Build').toUpperCase(), { bold: true });
    push(rule('-'), { faded: true });
    push();
    (cfg.terminal.lines || []).forEach((l) => push('', { slot: 'cmd', cmd: l }));
    push();
  }

  if ((cfg.colophon || []).length) {
    push(rule(), { faded: true });
    cfg.colophon.forEach(([k, v]) =>
      push(`${String(k).padEnd(16, ' ')}${v}`, { faded: true }),
    );
  }

  push();
  push('— end of file —', { faded: true });
  return L;
};

const PageProjectPage = () => {
  const { cfg, failed, project, loading } = useAppConfig();
  useThemeFonts(FONTS, 'page');

  if (loading) return <AppLoading />;
  if (failed || !cfg) return <AppMissing background={DESK} color={PAPER} />;

  const a = cfg.accent || RIBBON;
  const doc = buildDocument(cfg);

  const Gutter = ({ n }) => (
    <span
      aria-hidden
      className="flex-none text-right select-none text-[12px] pt-[3px]"
      style={{ color: FADED, width: 30 }}
    >
      {n}
    </span>
  );

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: DESK, ...TYPE }}>
      <AppSeo cfg={cfg} project={project} />

      <div className="mx-auto w-full" style={{ maxWidth: 880 }}>
        <div className="mb-5">
          <BackLink color={PAPER} />
        </div>

        <div
          className="relative px-5 sm:px-10 py-10 sm:py-14"
          style={{
            background: PAPER,
            boxShadow: '0 26px 60px -30px rgba(0,0,0,0.9)',
            backgroundImage:
              'repeating-linear-gradient(180deg, rgba(0,0,0,0.028) 0 1px, transparent 1px 28px)',
          }}
        >
          {/* the margin bell, at column 80 */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 hidden sm:block"
            style={{ left: 'calc(100% - 52px)', width: 1, background: 'rgba(158,74,56,0.22)' }}
          />
          <div
            aria-hidden
            className="absolute hidden sm:block text-[10px]"
            style={{ top: 12, left: 'calc(100% - 48px)', color: a }}
          >
            col 80
          </div>

          {doc.map((line, i) => {
            const n = i + 1;

            if (line.slot === 'actions') {
              return (
                <div key={i} className="flex gap-4 sm:gap-6 py-1">
                  <Gutter n={n} />
                  <span className="flex flex-wrap gap-3">
                    {cfg.download && (
                      <a
                        href={cfg.download}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-[13px]"
                        style={{ background: a, color: PAPER }}
                      >
                        {cfg.downloadLabel || 'Download'}
                      </a>
                    )}
                    {cfg.repo && (
                      <a
                        href={cfg.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-[13px]"
                        style={{ border: `1px solid ${CARBON}`, color: CARBON }}
                      >
                        Read the source
                      </a>
                    )}
                  </span>
                </div>
              );
            }

            if (line.slot === 'key') {
              return (
                <div key={i} className="flex gap-4 sm:gap-6">
                  <Gutter n={n} />
                  <span className="text-[14px] sm:text-[15px] leading-[1.85]">
                    <span style={{ color: a, fontWeight: 700 }}>
                      {line.key.k.padEnd(16, ' ')}
                    </span>
                    <span style={{ color: CARBON }}>{line.key.a}</span>
                  </span>
                </div>
              );
            }

            if (line.slot === 'cmd') {
              return (
                <div key={i} className="flex gap-4 sm:gap-6">
                  <Gutter n={n} />
                  <span
                    className="text-[14px] sm:text-[15px] leading-[1.85] break-all"
                    style={{ color: CARBON }}
                  >
                    <span style={{ color: a }}>$</span> {line.cmd}
                  </span>
                </div>
              );
            }

            if (line.slot === 'shots') {
              return (
                <div key={i} className="flex gap-4 sm:gap-6 mb-4">
                  <Gutter n={n} />
                  <div className="flex-1 space-y-6">
                    {(cfg.shots || []).map((s) => (
                      <figure key={s.src}>
                        <img
                          src={s.src}
                          alt={s.caption || cfg.name}
                          loading="lazy"
                          className="w-full h-auto"
                          style={{ border: '1px solid rgba(38,36,31,0.25)' }}
                        />
                        <figcaption className="mt-2 text-[12px]" style={{ color: FADED }}>
                          {s.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div key={i} className="flex gap-4 sm:gap-6">
                <Gutter n={n} />
                <span
                  className="text-[14px] sm:text-[15px] leading-[1.85] whitespace-pre-wrap break-words"
                  style={{
                    color: line.faded ? FADED : CARBON,
                    fontWeight: line.bold ? 700 : 400,
                  }}
                >
                  {line.text || ' '}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PageProjectPage;
