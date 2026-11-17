import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import TagLink from '../../components/TagLink';
import { useProjects } from '../../utils/projectParser';
import { useAchievements } from '../../context/AchievementContext';
import {
  KilimRug,
  KilimBand,
  KilimCover,
  KilimNotice,
  KilimProjectCard,
} from '../../components/kilim';
import '../../styles/Kilim.css';
import './kilim-content.css';

const topicsOf = (project) =>
  (Array.isArray(project.tags)
    ? project.tags
    : project.tags
      ? [project.tags]
      : []
  ).slice(0, 4);

/** Topic tags hang under a piece like its fringe. */
const Fringe = ({ topics }) =>
  topics.length > 0 ? (
    <div className="klm-wall-fringe">
      {topics.map((t) => (
        <TagLink key={t} tag={t} className="klm-tag">
          #{t}
        </TagLink>
      ))}
    </div>
  ) : null;

/** The first piece on the wall hangs wide, its panel beside the story. */
const Centrepiece = ({ project }) => {
  const [replay, setReplay] = useState(0);
  return (
    <div className="mb-10">
      <Link
        to={`/projects/${project.slug}`}
        className="klm-wall-centre klm-wall-centre-link"
        onMouseEnter={() => setReplay((n) => n + 1)}
      >
        <KilimCover item={project} replay={replay} />
        <div className="klm-wall-centre-body">
          <span className="klm-label">Hung in the centre</span>
          <h2 className="klm-wall-centre-title">
            {project.title} <span aria-hidden="true">↗</span>
          </h2>
          {project.shortDescription && (
            <p className="klm-wall-centre-text">{project.shortDescription}</p>
          )}
          {(project.technologies || []).length > 0 && (
            <div className="klm-tags mt-auto">
              {project.technologies.map((tech) => (
                <span key={tech} className="klm-tag">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      <Fringe topics={topicsOf(project)} />
    </div>
  );
};

const KilimProjectsPage = () => {
  const { projects, loading, error } = useProjects();
  const { unlockAchievement } = useAchievements();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  useEffect(() => {
    unlockAchievement('project_pioneer');
  }, [unlockAchievement]);
  const tags = [
    ...new Set(projects.flatMap((project) => project.technologies || [])),
  ].sort();
  const filtered = projects.filter(
    (project) =>
      (tag === 'all' || project.technologies?.includes(tag)) &&
      `${project.title} ${project.shortDescription} ${(project.technologies || []).join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const [first, ...rest] = filtered;
  return (
    <div className="klm-root">
      <Seo
        title="Projects | Fezcodex"
        description="Independent software, from native audio to human-readable data."
      />
      <div className="klm-page !pb-0">
        <KilimRug
          eyebrow="Selected software"
          title="Built to be used. Made to be explored."
          intro="Independent software, from native audio to human-readable data."
          seed="projects"
        >
          <div className="klm-controls">
            <div className="klm-controls-row">
              <input
                type="search"
                aria-label="Search projects"
                placeholder="Find a project…"
                className="klm-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <select
                aria-label="Filter projects by technology"
                className="klm-select"
                value={tag}
                onChange={(event) => setTag(event.target.value)}
              >
                <option value="all">All technologies</option>
                {tags.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </KilimRug>
      </div>
      <KilimBand pattern="teeth" />
      <div className="klm-page">
        {loading ? (
          <KilimNotice>Setting up the warp for the collection…</KilimNotice>
        ) : error ? (
          <KilimNotice error>The project collection could not be loaded.</KilimNotice>
        ) : (
          <>
            <p className="klm-label klm-status" role="status">
              {filtered.length} of {projects.length} pieces on the wall
            </p>
            {filtered.length ? (
              <>
                <Centrepiece project={first} />
                {rest.length > 0 && (
                  <div className="klm-wall">
                    {rest.map((project) => (
                      <div key={project.slug} className="klm-wall-piece">
                        <KilimBand pattern="end" className="klm-wall-head" />
                        <KilimProjectCard project={project} />
                        <Fringe topics={topicsOf(project)} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <KilimNotice>
                No projects match this search.
                <button
                  type="button"
                  className="klm-link klm-btn-link"
                  onClick={() => {
                    setQuery('');
                    setTag('all');
                  }}
                >
                  Clear filters
                </button>
              </KilimNotice>
            )}
          </>
        )}
      </div>
      <KilimBand pattern="chain" className="mt-6" />
    </div>
  );
};

export default KilimProjectsPage;
