import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  ChatsCircleIcon,
  EnvelopeIcon,
  IdentificationCardIcon,
  MapPinIcon,
  PaletteIcon,
  SparkleIcon,
  UserCircleIcon,
  WrenchIcon,
} from '@phosphor-icons/react';
import { aboutData } from './aboutData';
import Seo from '../../components/Seo';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import {
  BlissWallpaper,
  BlissWindow,
  BlissIcon,
} from '../../components/bliss';
import '../../styles/Bliss.css';

/**
 * Under the Bliss site theme the Layout supplies the appframe and wallpaper.
 * Under any other theme /about/bliss renders without the Layout chrome, so the
 * view brings its own desktop.
 */
const BlissFrame = ({ standalone, children }) =>
  standalone ? (
    <div className="bl-appframe min-h-screen w-full !pb-0">
      <BlissWallpaper />
      <div className="bl-root">{children}</div>
    </div>
  ) : (
    <div className="bl-root">{children}</div>
  );

/** A user-account picture: the initials on a framed glossy tile. */
const UserTile = ({ initials }) => (
  <div
    className="relative flex items-center justify-center shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-md border-[3px] border-white overflow-hidden"
    style={{
      background: 'linear-gradient(160deg, #6aa8ff 0%, #1e5fe0 55%, #2f9e1e 100%)',
      boxShadow: '0 2px 8px rgba(0, 20, 80, 0.4)',
    }}
    aria-hidden="true"
  >
    <span
      className="absolute inset-x-[8%] top-[4%] h-[46%] rounded-[40%]"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.05))',
      }}
    />
    <span
      className="relative bl-title-font text-5xl font-bold text-white"
      style={{ textShadow: '1px 2px 0 #0a1f6b' }}
    >
      {initials}
    </span>
  </div>
);

const BlissAboutView = ({ viewSwitcher }) => {
  const { fezcodexTheme } = useVisualSettings();
  const { profile, experience, skills, traits } = aboutData;
  const interests = [traits.hobby, traits.tool, traits.gaming];
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('');
  const EducationIcon = traits.education.icon;
  return (
    <BlissFrame standalone={fezcodexTheme !== 'bliss'}>
      <Seo
        title={`${profile.name} | About | Fezcodex`}
        description={`${profile.role}. ${profile.tagline.replaceAll('~', '')}`}
      />
      <div className="bl-page">
        <BlissWindow
          title="About me"
          icon={UserCircleIcon}
          tone="blue"
          headingLevel={null}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <UserTile initials={initials} />
            <div className="min-w-0">
              <p className="bl-eyebrow m-0">The person behind the codex</p>
              <h1 className="bl-display mt-2">{profile.name}</h1>
              <p className="mt-3 mb-0 max-w-2xl text-base">
                {profile.tagline.replaceAll('~', '')}
              </p>
              <p className="bl-h3 mt-4 mb-0">{profile.role}</p>
              <p className="bl-meta inline-flex items-center gap-2 mt-2 mb-0">
                <MapPinIcon size={15} weight="fill" aria-hidden="true" />
                {profile.location}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <a
              className="bl-btn bl-btn-primary"
              href={`mailto:${profile.email}`}
            >
              <EnvelopeIcon size={18} weight="fill" aria-hidden="true" />
              Say hello
            </a>
            <Link className="bl-btn bl-btn-blue" to="/projects">
              Explore my work
              <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
            </Link>
            <Link className="bl-link" to="/">
              ← Back to the codex
            </Link>
          </div>
        </BlissWindow>

        <BlissWindow
          title="A little context"
          icon={IdentificationCardIcon}
          tone="teal"
          titleId="bl-about-context"
          status={
            <>
              <span>01 / A little context</span>
              <span>Engineer · Maker · Explorer</span>
            </>
          }
        >
          <h3 className="bl-h2">Systems with purpose. Room for curiosity.</h3>
          <div className="bl-paper mt-4 text-base leading-relaxed">
            <p className="m-0">
              I build reliable software, from distributed systems and cloud
              infrastructure to small tools for everyday life. My work has taken
              me through smart cities, critical infrastructure, and security.
            </p>
            <p className="mt-4 mb-0">
              Fezcodex is where that engineering meets everything else:
              independent projects, notes, music, games, and ideas worth
              following.
            </p>
          </div>
        </BlissWindow>

        <BlissWindow
          title="Selected experience"
          icon={BriefcaseIcon}
          tone="orange"
          titleId="bl-about-experience"
          flush
          status={
            <>
              <span>02 / The work so far</span>
              <span>{experience.length} positions</span>
            </>
          }
        >
          <div className="bg-white">
            {experience.map((entry) => (
              <article
                className="bl-row !items-start !py-3"
                key={`${entry.company}-${entry.period}`}
              >
                <BlissIcon icon={BriefcaseIcon} seed={entry.company} size={36} />
                <div className="bl-row-body">
                  <span className="bl-meta">
                    {entry.period} · {entry.company}
                  </span>
                  <h3 className="bl-h3 text-[var(--bl-heading)]">
                    {entry.role}
                  </h3>
                  <p className="m-0 mt-1 text-[15px] leading-relaxed max-w-3xl">
                    {entry.desc}
                  </p>
                </div>
                <span className="bl-tag shrink-0 cursor-default hover:!bg-white hover:!border-[#8a9bc4]">
                  {entry.type}
                </span>
              </article>
            ))}
          </div>
        </BlissWindow>

        <div className="bl-split">
          <BlissWindow
            title="Tools I think with"
            icon={WrenchIcon}
            tone="graphite"
            titleId="bl-about-tools"
            status={<span>03 / Practice</span>}
          >
            <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
              {skills.map(({ name, icon: Icon, type }) => (
                <li key={name}>
                  <span
                    className="bl-tag cursor-default !min-h-[32px]"
                    title={type}
                  >
                    <Icon size={15} weight="bold" aria-hidden="true" />
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </BlissWindow>
          <BlissWindow
            title="Education"
            icon={EducationIcon}
            tone="green"
            titleId="bl-about-education"
          >
            <div className="flex items-start gap-4">
              <BlissIcon icon={EducationIcon} tone="green" size={48} />
              <div className="min-w-0">
                <p className="bl-label m-0">Education</p>
                <h3 className="bl-h2 mt-1">{traits.education.title}</h3>
                <p className="bl-muted mt-3 mb-0">{traits.education.desc}</p>
                <Link to="/reading" className="bl-link mt-4">
                  Still learning. Always reading. ↗
                </Link>
              </div>
            </div>
          </BlissWindow>
        </div>

        <BlissWindow
          title="Outside the terminal"
          icon={SparkleIcon}
          tone="pink"
          titleId="bl-about-interests"
          status={<span>04 / Other yarns</span>}
        >
          <div className="bl-grid">
            {interests.map(({ title, desc, icon: Icon }) => (
              <article key={title} className="bl-card">
                <BlissIcon icon={Icon} seed={title} size={40} />
                <h3 className="bl-card-title">{title}</h3>
                <p className="m-0 text-sm leading-relaxed">{desc}</p>
              </article>
            ))}
          </div>
        </BlissWindow>

        <BlissWindow
          title="Keep in touch"
          icon={ChatsCircleIcon}
          tone="purple"
          titleId="bl-about-contact"
        >
          <div className="bl-split !items-start">
            <div>
              <h3 className="bl-h2">Good things start with a conversation.</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
                <Link to="/about/friends" className="bl-link">
                  Friends of the show ↗
                </Link>
                <Link to="/logs" className="bl-link">
                  Things worth keeping ↗
                </Link>
              </div>
            </div>
            <nav aria-label="Samil's links" className="bl-listview">
              {profile.links.map(({ label, url, icon: Icon }) => (
                <a
                  key={label}
                  href={url}
                  className="bl-row !min-h-[44px]"
                  target={url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                >
                  <BlissIcon icon={Icon} seed={label} size={26} />
                  <span className="flex-1 font-bold">{label}</span>
                  <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
        </BlissWindow>

        <BlissWindow
          as="footer"
          title="Another way to see this page"
          icon={PaletteIcon}
          tone="yellow"
          inactive
        >
          {viewSwitcher}
        </BlissWindow>
      </div>
    </BlissFrame>
  );
};

export default BlissAboutView;
