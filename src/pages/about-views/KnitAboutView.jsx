import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon } from '@phosphor-icons/react';
import { aboutData } from './aboutData';
import Seo from '../../components/Seo';
import {
  KnitText,
  KnitIcon,
  KnitHero,
  KnitBand,
  KnitCanvas,
  YARN,
  MOTIFS,
  swatchFor,
  useKnitTextures,
} from '../../components/knit';
import { makeGrid, stamp, setCell } from '../../components/knit/engine';
import '../../styles/Knit.css';

/** A Selbu star yoke as a portrait: the initials knitted under a big star. */
const Monogram = ({ initials }) => (
  <KnitCanvas
    className="knt-swatch max-w-[320px]"
    cols={41}
    build={() => {
      const g = makeGrid(41, 41, YARN.peat);
      stamp(g, MOTIFS.star, 7, 3, { 1: YARN.gold }, 3);
      for (let c = 1; c < 41; c += 4) {
        setCell(g, c, 1, YARN.poppy);
        setCell(g, c, 39, YARN.poppy);
      }
      return g;
    }}
    deps={[initials]}
  />
);

const KnitAboutView = ({ viewSwitcher }) => {
  useKnitTextures(true);
  const { profile, experience, skills, traits } = aboutData;
  const interests = [traits.hobby, traits.tool, traits.gaming];
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('');
  return (
    <div className="knt-root knt-appframe">
      <Seo
        title={`${profile.name} | About | Fezcodex`}
        description={`${profile.role}. ${profile.tagline.replaceAll('~', '')}`}
      />
      <KnitHero
        eyebrow="The person behind the codex"
        title={profile.name}
        intro={profile.tagline.replaceAll('~', '')}
        wool="moss"
        motif="stars"
      >
        <KnitText text={profile.role} size="small" fg={YARN.gold} className="mt-6" />
        <p className="knt-label inline-flex items-center gap-2 mt-4">
          <MapPinIcon size={15} />
          {profile.location}
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-7">
          <a className="knt-btn knt-btn-primary" href={`mailto:${profile.email}`}>
            <KnitIcon name="mail" fg={YARN.snow} />
            <KnitText text="Say hello" size="small" fg={YARN.snow} fit />
          </a>
          <Link className="knt-btn knt-btn-gold" to="/projects">
            <KnitText text="Explore my work" size="small" fg={YARN.peat} fit />
            <KnitIcon name="arrowUpRight" fg={YARN.peat} />
          </Link>
          <Link className="knt-link" to="/">
            ← Back to the codex
          </Link>
        </div>
      </KnitHero>

      <div className="knt-page">
        <section className="knt-section knt-split items-center" aria-label="A little context">
          <div>
            <KnitText text="01 / A little context" size="small" fg={YARN.wheat} />
            <KnitText
              as="h2"
              text="Systems with purpose. Room for curiosity."
              fg={YARN.cream}
              className="mt-4"
            />
            <div className="knt-patch mt-6">
              <p>
                I build reliable software, from distributed systems and cloud
                infrastructure to small tools for everyday life. My work has
                taken me through smart cities, critical infrastructure, and
                security.
              </p>
              <p className="mt-4">
                Fezcodex is where that engineering meets everything else:
                independent projects, notes, music, games, and ideas worth
                following.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Monogram initials={initials} />
            <KnitText
              text="Engineer · Maker · Explorer"
              size="small"
              fg={YARN.wheat}
              fit
            />
          </div>
        </section>

        <section className="knt-section" aria-label="Selected experience">
          <div className="knt-section-head">
            <KnitText as="h2" text="Selected experience" fg={YARN.cream} />
            <KnitText text="02 / The work so far" size="small" fg={YARN.wheat} fit />
          </div>
          <KnitBand pattern="zigzag" className="mb-5 rounded" />
          {experience.map((entry) => (
            <article className="knt-row !items-start" key={`${entry.company}-${entry.period}`}>
              <div className="knt-row-body">
                <KnitText
                  text={`${entry.period} · ${entry.company}`}
                  size="small"
                  fg={YARN.wheat}
                />
                <KnitText as="h3" text={entry.role} fg={YARN.cream} className="mt-3" />
                <p className="knt-patch knt-patch-tight mt-3 text-base">{entry.desc}</p>
              </div>
              <span className="knt-tag shrink-0">{entry.type}</span>
            </article>
          ))}
        </section>

        <section className="knt-section knt-split">
          <div>
            <div className="knt-section-head">
              <KnitText as="h2" text="Tools I think with" fg={YARN.cream} />
              <KnitText text="03 / Practice" size="small" fg={YARN.wheat} fit />
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(({ name, icon: Icon, type }) => (
                <span key={name} className="knt-tag !py-1.5" title={type}>
                  <Icon size={15} />
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="knt-patch">
            <traits.education.icon size={32} weight="light" className="mb-4" />
            <p className="knt-label mb-2">Education</p>
            <h3 className="text-2xl font-bold">{traits.education.title}</h3>
            <p className="knt-muted mt-4">{traits.education.desc}</p>
            <Link to="/reading" className="knt-link mt-5">
              Still learning. Always reading. ↗
            </Link>
          </div>
        </section>

        <section className="knt-section" aria-label="Outside the terminal">
          <div className="knt-section-head">
            <KnitText as="h2" text="Outside the terminal" fg={YARN.cream} />
            <KnitText text="04 / Other yarns" size="small" fg={YARN.wheat} fit />
          </div>
          <div className="knt-grid">
            {interests.map(({ title, desc, icon: Icon }) => {
              const { way, className } = swatchFor(title);
              return (
                <article key={title} className={`knt-card ${className}`}>
                  <Icon size={28} weight="light" style={{ color: way.accent }} />
                  <KnitText as="h3" text={title} fg={way.fg} />
                  <p className="knt-patch">{desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="knt-section knt-split items-start">
          <div>
            <KnitText text="Keep in touch" size="small" fg={YARN.wheat} />
            <KnitText
              as="h2"
              text="Good things start with a conversation."
              fg={YARN.cream}
              className="mt-4"
            />
          </div>
          <nav aria-label="Samil's links">
            {profile.links.map(({ label, url, icon: Icon }) => (
              <a
                key={label}
                href={url}
                className="knt-row"
                target={url.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                <Icon size={18} style={{ color: 'var(--knt-gold)' }} />
                <span className="flex-1 font-bold">{label}</span>
                <KnitIcon name="arrowUpRight" fg={YARN.gold} />
              </a>
            ))}
          </nav>
        </section>

        <div className="knt-section-head mt-10">
          <Link to="/about/friends" className="knt-link">
            Friends of the show ↗
          </Link>
          <Link to="/logs" className="knt-link">
            Things worth keeping ↗
          </Link>
        </div>
        <footer className="knt-section">
          <p className="knt-label mb-4">Another way to see this page</p>
          {viewSwitcher}
        </footer>
      </div>
      <KnitBand pattern={['peerie', 'flowers', 'peerie']} className="mt-8" />
    </div>
  );
};

export default KnitAboutView;
