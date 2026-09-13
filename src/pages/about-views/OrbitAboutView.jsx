import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  MapPinIcon,
  EnvelopeSimpleIcon,
} from '@phosphor-icons/react';
import { aboutData } from './aboutData';
import { OrbitRegister, OrbitStamp } from '../../components/orbit';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import Seo from '../../components/Seo';
import '../../styles/Orbit.css';

const OrbitAboutView = ({ viewSwitcher }) => {
  const { profile, experience, skills, traits } = aboutData;
  const nameParts = profile.name.split(' ');
  const { fezcodexTheme } = useVisualSettings();
  const interests = [traits.hobby, traits.tool, traits.gaming];
  return (
    <div className="orb-root orb-about">
      <Seo
        title={`${profile.name} | About | Fezcodex`}
        description={`${profile.role}. ${profile.tagline.replaceAll('~', '')}`}
      />
      <div className="orb-page">
        <div className="flex items-center justify-between gap-5 mb-12">
          <Link className="orb-link" to="/">
            <ArrowLeftIcon size={16} />
            Back to the codex
          </Link>
          {fezcodexTheme !== 'orbit' && <OrbitRegister />}
        </div>
        <header className="orb-about-hero">
          <div>
            <p className="orb-eyebrow">THE PERSON BEHIND THE CODEX</p>
            <h1 className="orb-about-name">
              {nameParts.slice(0, -1).join(' ')}
              <br />
              <span>{nameParts.at(-1)}.</span>
            </h1>
            <p className="orb-about-role">{profile.role}</p>
            <p className="orb-intro">{profile.tagline.replaceAll('~', '')}</p>
            <p className="orb-label inline-flex items-center gap-2 mt-5">
              <MapPinIcon size={15} />
              {profile.location}
            </p>
            <div className="flex flex-wrap items-center gap-5 mt-8">
              <a
                className="orb-btn orb-btn-primary"
                href={`mailto:${profile.email}`}
              >
                <EnvelopeSimpleIcon size={18} />
                Say hello
              </a>
              <Link className="orb-link" to="/projects">
                Explore my work
                <ArrowUpRightIcon size={17} />
              </Link>
            </div>
          </div>
          <div className="orb-about-insignia" aria-hidden="true">
            <svg viewBox="0 0 420 420" fill="none">
              <circle cx="210" cy="210" r="168" stroke="var(--orb-rule)" />
              <circle
                cx="210"
                cy="210"
                r="124"
                stroke="var(--orb-rule)"
                strokeDasharray="3 8"
              />
              <ellipse
                cx="210"
                cy="210"
                rx="200"
                ry="82"
                stroke="var(--orb-accent)"
                transform="rotate(-35 210 210)"
              />
              <path
                d="M210 22V70M210 350V398M22 210H70M350 210H398"
                stroke="var(--orb-rule)"
              />
              <circle cx="342" cy="102" r="8" fill="var(--orb-copper)" />
              <circle cx="67" cy="289" r="5" fill="var(--orb-accent)" />
            </svg>
            <span className="orb-about-monogram">asb.</span>
            <span className="orb-label orb-about-insignia-caption">
              ENGINEER · MAKER · EXPLORER
            </span>
          </div>
        </header>

        <section
          className="orb-section orb-about-introduction"
          aria-labelledby="orbit-about-intro"
        >
          <div>
            <p className="orb-eyebrow mb-3">01 / A LITTLE CONTEXT</p>
            <h2 id="orbit-about-intro">
              Systems with purpose.
              <br />
              Room for curiosity.
            </h2>
          </div>
          <div className="orb-prose">
            <p>
              I build reliable software, from distributed systems and cloud
              infrastructure to small tools for everyday life. My work has taken
              me through smart cities, critical infrastructure, and security.
            </p>
            <p>
              Fezcodex is where that engineering meets everything else:
              independent projects, notes, music, games, and ideas worth
              following.
            </p>
            <OrbitStamp>Always in progress</OrbitStamp>
          </div>
        </section>

        <section
          className="orb-section"
          aria-labelledby="orbit-about-experience"
        >
          <div className="orb-section-head">
            <h2 id="orbit-about-experience">Selected experience</h2>
            <span className="orb-label">02 / THE WORK SO FAR</span>
          </div>
          <div className="orb-about-career">
            {experience.map((entry) => (
              <article
                className="orb-about-job"
                key={`${entry.company}-${entry.period}`}
              >
                <p className="orb-label">{entry.period}</p>
                <div>
                  <p className="orb-eyebrow mb-2">{entry.company}</p>
                  <h3>{entry.role}</h3>
                  <p className="orb-muted mt-3">{entry.desc}</p>
                </div>
                <span className="orb-badge self-start">{entry.type}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="orb-about-two-col orb-section">
          <div>
            <div className="orb-section-head">
              <h2>Tools I think with</h2>
              <span className="orb-label">03 / PRACTICE</span>
            </div>
            <div className="orb-about-skills">
              {skills.map(({ name, icon: Icon, type }) => (
                <div key={name} className="orb-about-skill">
                  <Icon size={19} className="orb-accent" />
                  <span>{name}</span>
                  <span className="orb-label">{type}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="orb-about-education">
            <traits.education.icon
              size={35}
              weight="light"
              className="orb-accent mb-6"
            />
            <p className="orb-eyebrow mb-3">EDUCATION</p>
            <h2>{traits.education.title}</h2>
            <p className="orb-muted mt-5">{traits.education.desc}</p>
            <Link to="/reading" className="orb-link mt-7">
              Still learning. Always reading.
              <ArrowUpRightIcon size={16} />
            </Link>
          </div>
        </section>

        <section
          className="orb-section"
          aria-labelledby="orbit-about-interests"
        >
          <div className="orb-section-head">
            <h2 id="orbit-about-interests">Outside the terminal</h2>
            <span className="orb-label">04 / OTHER ORBITS</span>
          </div>
          <div className="orb-about-interests">
            {interests.map(({ title, desc, icon: Icon }) => (
              <article key={title} className="orb-card">
                <Icon size={28} weight="light" className="orb-accent mb-5" />
                <h3>{title}</h3>
                <p className="orb-muted mt-3">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="orb-section orb-about-contact">
          <div>
            <p className="orb-eyebrow mb-3">KEEP IN TOUCH</p>
            <h2>
              Good things start
              <br />
              with a conversation.
            </h2>
          </div>
          <nav aria-label="Samil's links">
            {profile.links.map(({ label, url, icon: Icon }) => (
              <a
                key={label}
                href={url}
                className="orb-row-link"
                target={url.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                <ArrowUpRightIcon size={16} />
              </a>
            ))}
          </nav>
        </section>
        <div className="orb-section-head mt-10">
          <Link to="/about/friends" className="orb-link">
            Friends of the show ↗
          </Link>
          <Link to="/logs" className="orb-link">
            Things worth keeping ↗
          </Link>
        </div>
        <footer
          className="orb-section pt-8 border-t"
          style={{ borderColor: 'var(--orb-rule)' }}
        >
          <p className="orb-label mb-4">Another way to see this page</p>
          {viewSwitcher}
        </footer>
      </div>
    </div>
  );
};

export default OrbitAboutView;
