import React from 'react';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  MapPinIcon,
  ArrowUpRightIcon,
} from '@phosphor-icons/react';
import { aboutData } from './aboutData';
import {
  TerracottaStrip,
  TerracottaChapter,
  ChapterEm,
  TerracottaMark,
  TerracottaColophon,
  TerracottaSpec,
  TerracottaPlumbLine,
} from '../../components/terracotta';

const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;
const PAPER_GRADIENT =
  'radial-gradient(1100px 600px at 85% -10%, #E8DECE 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #EDE3D3 0%, transparent 50%)';

const firstName = (fullName) => fullName.split(' ')[0];
const lastName = (fullName) => fullName.split(' ').slice(-1)[0];

/* -----------------------------------------------------------
 * Skill bar — hairline ruler with a terra fill, Fraunces label
 * ----------------------------------------------------------- */
const SkillRow = ({ skill, index }) => (
  <motion.li
    initial={{ opacity: 0, y: 6 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: Math.min(index, 10) * 0.03 }}
    className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 md:gap-6 py-4 border-b border-dashed border-[#1A161320]"
  >
    <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#9E4A2F] w-[32px]">
      {String(index + 1).padStart(2, '0')}
    </span>
    <div>
      <div
        className="font-fraunces text-[18px] tracking-[-0.01em] text-[#1A1613]"
        style={{
          fontVariationSettings: '"opsz" 22, "SOFT" 50, "WONK" 1, "wght" 440',
        }}
      >
        {skill.name}
        <span className="ml-2 font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#2E2620]/60">
          {skill.type}
        </span>
      </div>
      <div className="mt-2 relative h-[2px] w-full bg-[#1A161320]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 + Math.min(index, 10) * 0.03 }}
          className="absolute inset-y-0 left-0 bg-[#C96442]"
        />
      </div>
    </div>
    <span className="font-ibm-plex-mono text-[11px] tracking-[0.14em] uppercase text-[#2E2620]/75 w-[44px] text-right">
      {skill.level}
    </span>
  </motion.li>
);

/* -----------------------------------------------------------
 * Experience row — numbered dossier entry
 * ----------------------------------------------------------- */
const ExperienceRow = ({ role, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, delay: Math.min(index, 4) * 0.04 }}
    className="relative py-10 pl-[52px] border-b border-[#1A161320]"
  >
    <span
      aria-hidden="true"
      className="absolute left-0 top-10 font-ibm-plex-mono text-[11px] tracking-[0.08em] text-[#9E4A2F]"
    >
      {String(index + 1).padStart(2, '0')}
    </span>
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-baseline">
      <div>
        <h3
          className="font-fraunces text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.02em] text-[#1A1613]"
          style={{
            fontVariationSettings:
              '"opsz" 48, "SOFT" 40, "WONK" 1, "wght" 450',
          }}
        >
          {role.role}
          <span
            className="ml-3 font-fraunces italic text-[22px] text-[#9E4A2F]"
            style={{
              fontStyle: 'italic',
              fontVariationSettings:
                '"opsz" 28, "SOFT" 100, "wght" 380',
            }}
          >
            @ {role.company}
          </span>
        </h3>
        <p className="mt-2 font-fraunces italic text-[16px] leading-[1.55] text-[#2E2620] max-w-[70ch]"
          style={{ fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 360' }}
        >
          {role.desc}
        </p>
      </div>
      <div className="flex flex-col md:items-end gap-1 shrink-0">
        <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/75">
          {role.period}
        </span>
        <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase px-1.5 py-0.5 border border-[#1A161320] text-[#9E4A2F]">
          {role.type}
        </span>
      </div>
    </div>
  </motion.article>
);

const TraitCard = ({ trait, index }) => {
  const Icon = trait.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      className="relative border border-[#1A161320] bg-[#F3ECE0] hover:border-[#1A1613]/40 hover:bg-[#E8DECE]/30 transition-colors p-6"
    >
      <div className="flex items-start justify-between pb-4 border-b border-dashed border-[#1A161320] font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#9E4A2F]">
        <span>§ {String(index + 1).padStart(2, '0')}</span>
        <Icon size={14} weight="regular" className="text-[#C96442]" />
      </div>
      <h4
        className="mt-5 font-fraunces text-[22px] leading-[1.1] tracking-[-0.015em] text-[#1A1613]"
        style={{
          fontVariationSettings:
            '"opsz" 32, "SOFT" 40, "WONK" 1, "wght" 460',
        }}
      >
        {trait.title}
      </h4>
      <p className="mt-2 font-fraunces italic text-[14.5px] leading-[1.5] text-[#2E2620]"
        style={{ fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 360' }}
      >
        {trait.desc}
      </p>
    </motion.div>
  );
};

const Terracotta = () => {
  const { profile, stats, skills, experience, traits } = aboutData;
  const traitList = Object.values(traits);
  const fn = firstName(profile.name);
  const ln = lastName(profile.name);
  const yearNow = new Date().getFullYear();

  return (
    <div
      className="min-h-screen relative text-[#1A1613] font-fraunces selection:bg-[#C96442]/25"
      style={{
        background: '#F3ECE0',
        backgroundImage: PAPER_GRADIENT,
        fontFeatureSettings: '"ss01", "ss02", "kern"',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-14 pt-20 pb-[120px]">
        <TerracottaStrip
          left="Folio I · the author"
          center={`Cartographer of the codex · ${yearNow}`}
          right={profile.location}
        />

        {/* HERO — dictionary headword */}
        <section className="pt-20 md:pt-32 pb-16 border-b border-[#1A161320]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-center">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-7 flex items-center gap-3">
                <span>Headword · §</span>
                <span aria-hidden="true" className="h-px flex-1 max-w-[80px] bg-[#9E4A2F]/50" />
                <span>I</span>
              </div>

              {/* giant first name with plumb line above the tallest letter */}
              <h1
                aria-label={profile.name}
                className="relative font-fraunces text-[#1A1613] leading-[0.82] tracking-[-0.04em] flex flex-wrap items-end"
                style={{
                  fontSize: 'clamp(88px, 14vw, 200px)',
                  fontVariationSettings:
                    '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
                }}
              >
                <span className="relative inline-block">
                  {fn.slice(0, 1)}
                  <TerracottaPlumbLine height={72} thickness={1.5} color="#1A1613" />
                </span>
                <span>{fn.slice(1)}</span>
              </h1>
              <div
                className="mt-3 font-fraunces italic text-[#2E2620]"
                style={{
                  fontSize: 'clamp(28px, 3.5vw, 44px)',
                  fontVariationSettings:
                    '"opsz" 48, "SOFT" 100, "WONK" 0, "wght" 380',
                }}
              >
                {profile.name.slice(fn.length)}
              </div>

              {/* superscript-style role */}
              <div className="mt-6 flex items-baseline gap-3 flex-wrap font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#2E2620]">
                <span className="text-[#9E4A2F]">n./v.</span>
                <span aria-hidden="true" className="h-px w-6 bg-[#1A161320]" />
                <span>{profile.role}</span>
                <span aria-hidden="true" className="text-[#2E2620]/30">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon size={11} /> {profile.location}
                </span>
              </div>

              <p
                className="mt-8 font-fraunces italic text-[22px] md:text-[26px] leading-[1.3] tracking-[-0.01em] text-[#1A1613] max-w-[36ch]"
                style={{
                  fontVariationSettings:
                    '"opsz" 60, "SOFT" 100, "WONK" 0, "wght" 400',
                }}
              >
                {profile.tagline.split('~').map((part, i, arr) =>
                  i === 1 ? (
                    <span
                      key={i}
                      className="text-[#9E4A2F] not-italic"
                      style={{
                        fontStyle: 'normal',
                        fontVariationSettings: '"wght" 560',
                      }}
                    >
                      {' '}
                      {part}{' '}
                    </span>
                  ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                  ),
                )}
              </p>

              {/* cta row */}
              <div className="mt-10 flex items-baseline gap-6 flex-wrap">
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex items-center gap-3 bg-[#1A1613] text-[#F3ECE0] px-6 py-3 hover:bg-[#C96442] transition-colors"
                >
                  <EnvelopeIcon size={14} weight="regular" />
                  <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase">
                    Write a letter
                  </span>
                </a>
                <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/60">
                  or
                </span>
                <a
                  href="https://github.com/fezcode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#1A1613] hover:text-[#9E4A2F] transition-colors inline-flex items-center gap-2"
                >
                  View the atlas on github
                  <ArrowUpRightIcon
                    size={12}
                    weight="bold"
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
              </div>
            </div>

            {/* Right aside — stats + links */}
            <aside className="flex flex-col gap-8 lg:border-l border-[#1A161320] lg:pl-10">
              <div>
                <h3 className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] uppercase text-[#9E4A2F] mb-4">
                  The brief
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s) => (
                    <TerracottaSpec
                      key={s.label}
                      label={s.label}
                      value={
                        <>
                          {s.value}
                          {s.unit && (
                            <span className="ml-1.5 font-ibm-plex-mono text-[10px] tracking-[0.14em] uppercase text-[#2E2620]/60 normal-case">
                              {s.unit}
                            </span>
                          )}
                        </>
                      }
                    />
                  ))}
                  <TerracottaSpec label="Surname" value={ln} />
                  <TerracottaSpec label="Kit" value="Mechanical keys" />
                </div>
              </div>

              <div>
                <h3 className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] uppercase text-[#9E4A2F] mb-4">
                  Elsewhere
                </h3>
                <div className="flex flex-col">
                  {profile.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-4 py-2.5 border-b border-dashed border-[#1A161320]"
                    >
                      <span
                        className="font-fraunces text-[17px] text-[#1A1613] group-hover:text-[#9E4A2F] group-hover:italic transition-colors"
                        style={{
                          fontVariationSettings:
                            '"opsz" 18, "SOFT" 30, "WONK" 0, "wght" 420',
                        }}
                      >
                        {link.label}
                      </span>
                      <span className="font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase text-[#2E2620]/60 group-hover:text-[#9E4A2F] transition-colors">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* §II — EXPERIENCE */}
        <section className="pt-20">
          <TerracottaChapter
            numeral="II"
            label="Experience"
            title={<>Roles <ChapterEm>held.</ChapterEm></>}
            blurb="In reverse order. Each entry is a small true thing, shipped."
          />
          <div className="border-t border-[#1A161320]">
            {experience.map((role, i) => (
              <ExperienceRow key={role.company} role={role} index={i} />
            ))}
          </div>
        </section>

        {/* §III — SKILLS */}
        <section className="pt-20">
          <TerracottaChapter
            numeral="III"
            label="Instruments"
            title={<>What the <ChapterEm>hands</ChapterEm> know.</>}
            blurb="A calibration of tools — measured by use, not by novelty."
          />
          <ol className="border-t border-[#1A161320]">
            {skills.map((s, i) => (
              <SkillRow key={s.name} skill={s} index={i} />
            ))}
          </ol>
        </section>

        {/* §IV — TRAITS */}
        <section className="pt-20">
          <TerracottaChapter
            numeral="IV"
            label="Margins"
            title={<>The <ChapterEm>person</ChapterEm> behind the work.</>}
            blurb="Edges, hobbies, small prides, small flaws."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {traitList.map((t, i) => (
              <TraitCard key={t.title} trait={t} index={i} />
            ))}
          </div>
        </section>

        {/* closing quotation */}
        <section className="pt-24 pb-4">
          <blockquote
            className="pl-10 pr-8 py-8 bg-[#E8DECE] border-l-[3px] border-[#C96442] max-w-[52ch]"
          >
            <p
              className="font-fraunces italic text-[22px] md:text-[26px] leading-[1.4] text-[#2E2620]"
              style={{
                fontVariationSettings:
                  '"opsz" 32, "SOFT" 100, "WONK" 0, "wght" 340',
              }}
            >
              "Attention is the rarest and purest form of generosity."
            </p>
            <cite className="block mt-4 font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase not-italic text-[#9E4A2F]">
              — Simone Weil, pinned above the desk
            </cite>
          </blockquote>
        </section>

        <TerracottaColophon
          signature={
            <>
              <span>© {yearNow} · Ahmed Samil Bulbul</span>
              <span>About · terracotta · {profile.role.toLowerCase()}</span>
            </>
          }
        />

        <div className="fixed bottom-6 right-6 opacity-40 pointer-events-none z-20 hidden md:block">
          <TerracottaMark size={18} color="#C96442" />
        </div>
      </div>
    </div>
  );
};

export default Terracotta;
