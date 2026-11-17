import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { aboutData } from './aboutData';
import Seo from '../../components/Seo';
import {
  KilimRug,
  KilimText,
  KilimIcon,
  KilimBand,
  KilimStripe,
  KilimBadge,
  KilimPanel,
  KilimCanvas,
  WOOL,
  COLOURWAYS,
  medallion,
  headingGrid,
  useKilimTextures,
} from '../../components/kilim';
import { makeGrid, setCell, getCell } from '../../components/kilim/engine';
import '../../styles/Kilim.css';
import '../kilim-views/kilim-content.css';

/**
 * A weaver's signature as a portrait: one göl in the field and the initials
 * woven beneath it, inside a plain border.
 */
const Signature = ({ initials }) => (
  <KilimCanvas
    cols={41}
    seed={`signature-${initials}`}
    animate
    build={() => {
      const g = makeGrid(41, 51, WOOL.madder);
      for (let c = 0; c < 41; c += 1) {
        setCell(g, c, 0, WOOL.walnut);
        setCell(g, c, 50, WOOL.walnut);
        setCell(g, c, 1, c % 2 ? WOOL.saffron : WOOL.walnut);
        setCell(g, c, 49, c % 2 ? WOOL.saffron : WOOL.walnut);
      }
      for (let r = 0; r < 51; r += 1) {
        setCell(g, 0, r, WOOL.walnut);
        setCell(g, 40, r, WOOL.walnut);
      }
      medallion(g, 20, 21, 14, COLOURWAYS[1]);
      const text = headingGrid({
        text: initials,
        scale: 1,
        edge: 'contour',
        align: 'center',
      });
      const tx = Math.floor((41 - text.cols) / 2);
      const ty = 40;
      for (let r = 0; r < text.rows; r += 1)
        for (let c = 0; c < text.cols; c += 1) {
          const hex = getCell(text, c, r);
          if (hex) setCell(g, tx + c, ty + r, hex);
        }
      return g;
    }}
    deps={[initials]}
  />
);

/** Each job is a weft band dyed its own colour, stacked edge to edge. */
const BAND_GROUNDS = ['klm-wool-indigo', 'klm-wool-teal', 'klm-wool-aubergine', 'klm-wool-walnut'];

const LINK_ICONS = {
  GitHub: 'code',
  LinkedIn: 'user',
  Email: 'mail',
  'X (Twitter)': 'bolt',
  Fezcode: 'globe',
};

const KilimAboutView = ({ viewSwitcher }) => {
  useKilimTextures(true);
  const { profile, experience, skills, traits } = aboutData;
  const interests = [traits.hobby, traits.tool, traits.gaming];
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('');
  return (
    <div className="klm-root klm-appframe">
      <Seo
        title={`${profile.name} | About | Fezcodex`}
        description={`${profile.role}. ${profile.tagline.replaceAll('~', '')}`}
      />
      <div className="klm-page !pb-0">
        <KilimRug
          eyebrow="The person behind the codex"
          title={profile.name}
          intro={profile.tagline.replaceAll('~', '')}
          seed="about"
        >
          <p className="klm-label klm-about-where">
            <KilimIcon name="pin" fg={WOOL.saffron} />
            {profile.role} · {profile.location}
          </p>
          <div className="klm-actions">
            <a className="klm-btn" href={`mailto:${profile.email}`}>
              <KilimIcon name="mail" fg={WOOL.walnut} />
              Say hello
            </a>
            <Link className="klm-btn klm-btn-ivory" to="/projects">
              Explore my work <span aria-hidden="true">↗</span>
            </Link>
            <Link className="klm-link" to="/">
              ← Back to the codex
            </Link>
          </div>
        </KilimRug>
      </div>

      <KilimBand pattern="chain" />

      <div className="klm-page">
        <section className="klm-section klm-about-split" aria-label="A little context">
          <div>
            <p className="klm-eyebrow">01 / A little context</p>
            <KilimText as="h2" text="Systems with purpose. Room for curiosity." />
            <div className="klm-about-copy mt-6">
              <p>
                I build reliable software, from distributed systems and cloud
                infrastructure to small tools for everyday life. My work has
                taken me through smart cities, critical infrastructure, and
                security.
              </p>
              <p>
                Fezcodex is where that engineering meets everything else:
                independent projects, notes, music, games, and ideas worth
                following.
              </p>
            </div>
          </div>
          <div className="klm-about-portrait">
            <Signature initials={initials} />
            <span className="klm-label">Engineer · Maker · Explorer</span>
          </div>
        </section>

        <section className="klm-section" aria-label="Selected experience">
          <div className="klm-section-head">
            <KilimText as="h2" text="Selected experience" />
            <span className="klm-label">02 / The work so far</span>
          </div>
          <div className="klm-about-bands">
            {experience.map((entry, i) => (
              <article
                className={`klm-about-band ${BAND_GROUNDS[i % BAND_GROUNDS.length]}`}
                key={`${entry.company}-${entry.period}`}
              >
                <span className="klm-about-period">{entry.period}</span>
                <div className="min-w-0">
                  <p className="klm-label">{entry.company}</p>
                  <h3 className="klm-about-role">{entry.role}</h3>
                  <p className="klm-about-desc">{entry.desc}</p>
                </div>
                <span className="klm-tag self-start">{entry.type}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="klm-section klm-about-split !items-start">
          <div>
            <div className="klm-section-head">
              <KilimText as="h2" text="Tools I think with" />
              <span className="klm-label">03 / Practice</span>
            </div>
            <div className="klm-about-skills">
              {skills.map(({ name, type }) => (
                <span key={name} className="klm-about-skill" title={type}>
                  <KilimBadge seed={name} size={7} />
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="klm-about-edu">
            <KilimIcon name="book" fg={WOOL.madder} />
            <p className="klm-label mt-3">Education</p>
            <h3>{traits.education.title}</h3>
            <p>{traits.education.desc}</p>
            <Link to="/reading" className="klm-link">
              Still learning. Always reading. ↗
            </Link>
          </div>
        </section>

        <section className="klm-section" aria-label="Outside the terminal">
          <div className="klm-section-head">
            <KilimText as="h2" text="Outside the terminal" />
            <span className="klm-label">04 / Other threads</span>
          </div>
          <div className="klm-grid">
            {interests.map(({ title, desc }) => (
              <article key={title} className="klm-card">
                <div className="klm-cover" aria-hidden="true">
                  <KilimPanel seed={title} rows={30} />
                </div>
                <div className="klm-card-body">
                  <h3 className="klm-card-title">{title}</h3>
                  <p className="klm-card-text">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="klm-section klm-about-split !items-start">
          <div>
            <p className="klm-eyebrow">Keep in touch</p>
            <KilimText as="h2" text="Good things start with a conversation." />
          </div>
          <nav aria-label="Samil's links" className="klm-about-links">
            {profile.links.map(({ label, url }, i) => (
              <Fragment key={label}>
                {i > 0 && <KilimStripe />}
                <a
                  href={url}
                  className="klm-about-link"
                  target={url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                >
                  <KilimIcon name={LINK_ICONS[label] || 'link'} fg={WOOL.saffron} />
                  <span>{label}</span>
                  <KilimIcon name="arrowUpRight" fg={WOOL.saffron} />
                </a>
              </Fragment>
            ))}
          </nav>
        </section>

        <div className="klm-about-footer-links">
          <Link to="/about/friends" className="klm-link">
            Friends of the show ↗
          </Link>
          <Link to="/logs" className="klm-link">
            Things worth keeping ↗
          </Link>
        </div>
        <footer className="klm-section">
          <p className="klm-label mb-4">Another way to see this page</p>
          {viewSwitcher}
        </footer>
      </div>
      <KilimBand pattern={['teeth', 'end']} />
    </div>
  );
};

export default KilimAboutView;
