import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon } from '@phosphor-icons/react';
import { aboutData } from './aboutData';
import Seo from '../../components/Seo';
import {
  MarquetryText,
  MarquetryIcon,
  MarquetryHero,
  MarquetryBand,
  MarquetryInlay,
  WOOD,
  useMarquetryTextures,
} from '../../components/marquetry';
import '../../styles/Marquetry.css';

const MarquetryAboutView = ({ viewSwitcher }) => {
  useMarquetryTextures(true);
  const { profile, experience, skills, traits } = aboutData;
  const interests = [traits.hobby, traits.tool, traits.gaming];
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('');
  return (
    <div className="mqt-root mqt-appframe">
      <Seo
        title={`${profile.name} | About | Fezcodex`}
        description={`${profile.role}. ${profile.tagline.replaceAll('~', '')}`}
      />
      <MarquetryHero
        eyebrow="The person behind the codex"
        title={profile.name}
        intro={profile.tagline.replaceAll('~', '')}
      >
        <MarquetryText
          text={profile.role}
          size="small"
          fg={WOOD.teal}
          className="mt-6"
        />
        <p className="mqt-label inline-flex items-center gap-2 mt-4">
          <MapPinIcon size={15} />
          {profile.location}
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-7">
          <a
            className="mqt-btn mqt-btn-primary"
            href={`mailto:${profile.email}`}
          >
            <MarquetryIcon name="mail" fg={WOOD.snow} />
            <MarquetryText text="Say hello" size="small" fg={WOOD.snow} fit />
          </a>
          <Link className="mqt-btn mqt-btn-gold" to="/projects">
            <MarquetryText
              text="Explore my work"
              size="small"
              fg={WOOD.peat}
              fit
            />
            <MarquetryIcon name="arrowUpRight" fg={WOOD.peat} />
          </Link>
          <Link className="mqt-link" to="/">
            ← Back to the codex
          </Link>
        </div>
      </MarquetryHero>

      <div className="mqt-page">
        <section
          className="mqt-section mqt-split items-center"
          aria-label="A little context"
        >
          <div>
            <MarquetryText
              text="01 / A little context"
              size="small"
              fg={WOOD.bark}
            />
            <MarquetryText
              as="h2"
              text="Systems with purpose. Room for curiosity."
              fg={WOOD.ink}
              className="mt-4"
            />
            <div className="mqt-patch mt-6">
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
            <MarquetryInlay
              seed={initials}
              size={320}
              className="mqt-about-inlay"
            />
            <MarquetryText
              text="Engineer · Maker · Explorer"
              size="small"
              fg={WOOD.bark}
              fit
            />
          </div>
        </section>

        <section className="mqt-section" aria-label="Selected experience">
          <div className="mqt-section-head">
            <MarquetryText as="h2" text="Selected experience" fg={WOOD.ink} />
            <MarquetryText
              text="02 / The work so far"
              size="small"
              fg={WOOD.bark}
              fit
            />
          </div>
          <MarquetryBand pattern="zigzag" className="mb-5 rounded" />
          {experience.map((entry) => (
            <article
              className="mqt-row !items-start"
              key={`${entry.company}-${entry.period}`}
            >
              <div className="mqt-row-body">
                <MarquetryText
                  text={`${entry.period} · ${entry.company}`}
                  size="small"
                  fg={WOOD.bark}
                />
                <MarquetryText
                  as="h3"
                  text={entry.role}
                  fg={WOOD.ink}
                  className="mt-3"
                />
                <p className="mqt-patch mqt-patch-tight mt-3 text-base">
                  {entry.desc}
                </p>
              </div>
              <span className="mqt-tag shrink-0">{entry.type}</span>
            </article>
          ))}
        </section>

        <section className="mqt-section mqt-split">
          <div>
            <div className="mqt-section-head">
              <MarquetryText as="h2" text="Tools I think with" fg={WOOD.ink} />
              <MarquetryText
                text="03 / Practice"
                size="small"
                fg={WOOD.bark}
                fit
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(({ name, icon: Icon, type }) => (
                <span key={name} className="mqt-tag !py-1.5" title={type}>
                  <Icon size={15} />
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="mqt-patch">
            <traits.education.icon size={32} weight="light" className="mb-4" />
            <p className="mqt-label mb-2">Education</p>
            <h3 className="text-2xl font-bold">{traits.education.title}</h3>
            <p className="mqt-muted mt-4">{traits.education.desc}</p>
            <Link to="/reading" className="mqt-link mt-5">
              Still learning. Always reading. ↗
            </Link>
          </div>
        </section>

        <section className="mqt-section" aria-label="Outside the terminal">
          <div className="mqt-section-head">
            <MarquetryText as="h2" text="Outside the terminal" fg={WOOD.ink} />
            <MarquetryText
              text="04 / Other interests"
              size="small"
              fg={WOOD.bark}
              fit
            />
          </div>
          <div className="mqt-grid">
            {interests.map(({ title, desc, icon: Icon }) => (
              <article key={title} className="mqt-card">
                <Icon size={28} weight="light" style={{ color: WOOD.teal }} />
                <MarquetryText as="h3" text={title} fg={WOOD.ink} />
                <p className="mqt-patch">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mqt-section mqt-split items-start">
          <div>
            <MarquetryText text="Keep in touch" size="small" fg={WOOD.bark} />
            <MarquetryText
              as="h2"
              text="Good things start with a conversation."
              fg={WOOD.ink}
              className="mt-4"
            />
          </div>
          <nav aria-label="Samil's links">
            {profile.links.map(({ label, url, icon: Icon }) => (
              <a
                key={label}
                href={url}
                className="mqt-row"
                target={url.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                <Icon size={18} style={{ color: 'var(--mqt-gold)' }} />
                <span className="flex-1 font-bold">{label}</span>
                <MarquetryIcon name="arrowUpRight" fg={WOOD.teal} />
              </a>
            ))}
          </nav>
        </section>

        <div className="mqt-section-head mt-10">
          <Link to="/about/friends" className="mqt-link">
            Friends of the show ↗
          </Link>
          <Link to="/logs" className="mqt-link">
            Things worth keeping ↗
          </Link>
        </div>
        <footer className="mqt-section">
          <p className="mqt-label mb-4">Another way to see this page</p>
          {viewSwitcher}
        </footer>
      </div>
      <MarquetryBand
        pattern={['peerie', 'flowers', 'peerie']}
        className="mt-8"
      />
    </div>
  );
};

export default MarquetryAboutView;
