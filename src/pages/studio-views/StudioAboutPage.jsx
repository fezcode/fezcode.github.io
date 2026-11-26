import StudioShapes from '../../components/studio/StudioShapes';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  MapPinIcon,
  EnvelopeSimpleIcon,
} from '@phosphor-icons/react';
import { aboutData } from '../about-views/aboutData';
import { StudioStamp } from '../../components/studio';
import Seo from '../../components/Seo';
import '../../styles/Studio.css';

const StudioAboutView = ({ viewSwitcher }) => {
  const { profile, experience, skills, traits } = aboutData;
  const nameParts = profile.name.split(' ');
  const interests = [traits.hobby, traits.tool, traits.gaming];
  return (
    <div className="std-root std-about">
      <Seo
        title={`${profile.name} | About | Fezcodex`}
        description={`${profile.role}. ${profile.tagline.replaceAll('~', '')}`}
      />
      <div className="std-page">
        <div className="flex items-center justify-between gap-5 mb-12">
          <Link className="std-link" to="/">
            <ArrowLeftIcon size={16} />
            Back to the codex
          </Link>
        </div>
        <header className="std-about-hero">
          <div>
            <p className="std-eyebrow">The person behind the codex</p>
            <h1 className="std-about-name">
              {nameParts.slice(0, -1).join(' ')}
              <br />
              <span>{nameParts.at(-1)}.</span>
            </h1>
            <p className="std-about-role">{profile.role}</p>
            <p className="std-intro">{profile.tagline.replaceAll('~', '')}</p>
            <p className="std-label inline-flex items-center gap-2 mt-5">
              <MapPinIcon size={15} />
              {profile.location}
            </p>
            <div className="flex flex-wrap items-center gap-5 mt-8">
              <a
                className="std-btn std-btn-primary"
                href={`mailto:${profile.email}`}
              >
                <EnvelopeSimpleIcon size={18} />
                Say hello
              </a>
              <Link className="std-link" to="/projects">
                Explore my work
                <ArrowUpRightIcon size={17} />
              </Link>
            </div>
          </div>
          <div className="std-about-insignia" aria-hidden="true">
            <StudioShapes />
            <span className="std-about-monogram">asb.</span>
            <span className="std-label std-about-insignia-caption">
              ENGINEER · MAKER · EXPLORER
            </span>
          </div>
        </header>

        <section
          className="std-section std-about-introduction"
          aria-labelledby="studio-about-intro"
        >
          <div>
            <p className="std-eyebrow mb-3">01 / A LITTLE CONTEXT</p>
            <h2 id="studio-about-intro">
              Systems with purpose.
              <br />
              Room for curiosity.
            </h2>
          </div>
          <div className="std-prose">
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
            <StudioStamp>Always in progress</StudioStamp>
          </div>
        </section>

        <section
          className="std-section"
          aria-labelledby="studio-about-experience"
        >
          <div className="std-section-head">
            <h2 id="studio-about-experience">Selected experience</h2>
            <span className="std-label">02 / THE WORK SO FAR</span>
          </div>
          <div className="std-about-career">
            {experience.map((entry) => (
              <article
                className="std-about-job"
                key={`${entry.company}-${entry.period}`}
              >
                <p className="std-label">{entry.period}</p>
                <div>
                  <p className="std-eyebrow mb-2">{entry.company}</p>
                  <h3>{entry.role}</h3>
                  <p className="std-muted mt-3">{entry.desc}</p>
                </div>
                <span className="std-badge self-start">{entry.type}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="std-about-two-col std-section">
          <div>
            <div className="std-section-head">
              <h2>Tools I think with</h2>
              <span className="std-label">03 / PRACTICE</span>
            </div>
            <div className="std-about-skills">
              {skills.map(({ name, icon: Icon, type }) => (
                <div key={name} className="std-about-skill">
                  <Icon size={19} className="std-accent" />
                  <span>{name}</span>
                  <span className="std-label">{type}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="std-about-education">
            <traits.education.icon
              size={35}
              weight="light"
              className="std-accent mb-6"
            />
            <p className="std-eyebrow mb-3">Education</p>
            <h2>{traits.education.title}</h2>
            <p className="std-muted mt-5">{traits.education.desc}</p>
            <Link to="/reading" className="std-link mt-7">
              Still learning. Always reading.
              <ArrowUpRightIcon size={16} />
            </Link>
          </div>
        </section>

        <section
          className="std-section"
          aria-labelledby="studio-about-interests"
        >
          <div className="std-section-head">
            <h2 id="studio-about-interests">Outside the terminal</h2>
            <span className="std-label">Away from the keyboard</span>
          </div>
          <div className="std-about-interests">
            {interests.map(({ title, desc, icon: Icon }) => (
              <article key={title} className="std-card">
                <Icon size={28} weight="light" className="std-accent mb-5" />
                <h3>{title}</h3>
                <p className="std-muted mt-3">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="std-section std-about-contact">
          <div>
            <p className="std-eyebrow mb-3">Keep in touch</p>
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
                className="std-row-link"
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
        <div className="std-section-head mt-10">
          <Link to="/about/friends" className="std-link">
            Friends of the show ↗
          </Link>
          <Link to="/logs" className="std-link">
            Things worth keeping ↗
          </Link>
        </div>
        <footer
          className="std-section pt-8 border-t"
          style={{ borderColor: 'var(--std-rule)' }}
        >
          <p className="std-label mb-4">Another way to see this page</p>
          {viewSwitcher}
        </footer>
      </div>
    </div>
  );
};

export default StudioAboutView;
