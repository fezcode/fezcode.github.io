import React, { useEffect, useState } from 'react';
import { CubeIcon, FolderOpenIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useAchievements } from '../../context/AchievementContext';
import {
  BlissWindow,
  BlissNotice,
  BlissProjectCard,
} from '../../components/bliss';
import '../../styles/Bliss.css';

const BlissProjectsPage = () => {
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
  const clearFilters = () => {
    setQuery('');
    setTag('all');
  };
  const ready = !loading && !error;

  return (
    <div className="bl-root">
      <Seo
        title="Projects | Fezcodex"
        description="Independent software, from native audio to human-readable data."
      />
      <div className="bl-page">
        <BlissWindow
          title="Projects"
          icon={CubeIcon}
          tone="yellow"
          headingLevel={null}
        >
          <div className="py-2 sm:py-3">
            <p className="bl-eyebrow m-0">Selected software</p>
            <h1 className="bl-display mt-2">
              Built to be used. Made to be explored.
            </h1>
            <p className="mt-4 mb-0 max-w-2xl text-lg leading-relaxed">
              Independent software, from native audio to human-readable data.
            </p>
            <div className="bl-groupbox mt-6 max-w-3xl">
              <span className="bl-groupbox-label">Find</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="search"
                  aria-label="Search projects"
                  placeholder="Find a project…"
                  className="bl-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <select
                  aria-label="Filter projects by technology"
                  className="bl-select sm:!w-60"
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
          </div>
        </BlissWindow>
        <BlissWindow
          title="The archive"
          icon={FolderOpenIcon}
          tone="blue"
          status={
            ready ? (
              <>
                <span role="status">
                  {filtered.length} of {projects.length} projects
                </span>
                {tag !== 'all' && <span>Technology: {tag}</span>}
              </>
            ) : undefined
          }
        >
          {loading ? (
            <BlissNotice>Opening the collection…</BlissNotice>
          ) : error ? (
            <BlissNotice error>
              The project collection could not be loaded.
            </BlissNotice>
          ) : filtered.length ? (
            <div className="bl-grid">
              {filtered.map((project) => (
                <BlissProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <BlissNotice>
              No projects match this search.{' '}
              <button type="button" className="bl-link" onClick={clearFilters}>
                Clear filters
              </button>
            </BlissNotice>
          )}
        </BlissWindow>
      </div>
    </div>
  );
};

export default BlissProjectsPage;
