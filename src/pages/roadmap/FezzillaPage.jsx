import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  HouseIcon,
} from '@phosphor-icons/react';
import piml from 'piml';
import Seo from '../../components/Seo';
import CustomDropdown from '../../components/CustomDropdown';
import { useAchievements } from '../../context/AchievementContext';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import './roadmap.css';
import RoadmapIssueContent from '../../components/roadmap/RoadmapIssueContent';
import { stages, flattenIssues, sortIssues } from './roadmapData';

function IssueDetail({ issue, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className="roadmap-detail"
      aria-labelledby="roadmap-detail-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <RoadmapIssueContent issue={issue} onClose={onClose} />
    </dialog>
  );
}

function WorkItem({ issue, onOpen }) {
  const stage = stages.find((entry) => entry.name === issue.status);
  return (
    <button className="roadmap-file" onClick={() => onOpen(issue.id)}>
      <span className="roadmap-file-id">{issue.id}</span>
      <span className="roadmap-file-content">
        <h3>{issue.title}</h3>
        <span>{issue.description}</span>
      </span>
      <span className="roadmap-file-category">
        {issue.category || 'General'}
      </span>
      <span className="roadmap-file-status" data-stage={stage.key}>
        <stage.icon size={16} />
        {stage.label}
      </span>
    </button>
  );
}

export default function FezzillaPage() {
  const { fezcodexTheme: theme } = useVisualSettings();
  const { unlockAchievement } = useAchievements();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [metadataFilters, setMetadataFilters] = useState({
    category: '',
    epic: '',
    assignee: '',
  });
  const filterFields = [
    { key: 'category', label: 'Category', fallback: 'General' },
    { key: 'epic', label: 'Epic', fallback: 'No epic' },
    { key: 'assignee', label: 'Assignee', fallback: 'Unassigned' },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('issue');

  useEffect(() => {
    unlockAchievement('path_finder');
  }, [unlockAchievement]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch('/roadmap/roadmap.piml', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Roadmap unavailable');
        return response.text();
      })
      .then((text) => {
        if (!controller.signal.aborted)
          setIssues(sortIssues(flattenIssues(piml.parse(text).issues)));
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        stages.map((stage) => [
          stage.name,
          issues.filter((issue) => issue.status === stage.name).length,
        ]),
      ),
    [issues],
  );
  const filtered = useMemo(
    () =>
      issues.filter(
        (issue) =>
          (status === 'All' || issue.status === status) &&
          (priority === 'All' || (issue.priority || 'Low') === priority) &&
          Object.entries(metadataFilters).every(
            ([key, value]) =>
              !value ||
              (issue[key] ||
                {
                  category: 'General',
                  epic: 'No epic',
                  assignee: 'Unassigned',
                }[key]) === value,
          ) &&
          [
            issue.id,
            issue.title,
            issue.description,
            issue.category,
            issue.epic,
            issue.notes,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [issues, query, status, priority, metadataFilters],
  );
  const changeIssue = (id) => {
    const params = new URLSearchParams(searchParams);
    if (id) params.set('issue', id);
    else params.delete('issue');
    setSearchParams(params);
  };
  const resetFilters = () => {
    setQuery('');
    setStatus('All');
    setPriority('All');
    setMetadataFilters({ category: '', epic: '', assignee: '' });
  };

  return (
    <main
      className={`roadmap-page ${theme === 'luxe' ? 'roadmap-luxe' : 'roadmap-brutalist'}`}
    >
      <Seo
        title="Roadmap | Fezcodex"
        description="Development issues, plans, and completed work for Fezcodex."
        image="/images/asset/roadmap-page.webp"
      />
      <div className="roadmap-cabinet">
        <aside className="roadmap-index">
          <Link className="roadmap-home" to="/">
            <HouseIcon size={18} /> Fezcodex
          </Link>
          <h1>Roadmap</h1>
          <div className="roadmap-index-total">
            <strong>
              {loading || error ? '—' : String(issues.length).padStart(2, '0')}
            </strong>
            <span>
              development
              <br />
              issues
            </span>
          </div>
          <div
            className="roadmap-folders"
            role="group"
            aria-label="Filter by status"
          >
            <button
              aria-pressed={status === 'All'}
              onClick={() => setStatus('All')}
            >
              <span>All issues</span>
              <span>{issues.length}</span>
            </button>
            {stages
              .filter(
                (stage) => stage.name !== 'Cancelled' || counts.Cancelled > 0,
              )
              .map((stage) => (
                <button
                  key={stage.key}
                  aria-pressed={status === stage.name}
                  onClick={() => setStatus(stage.name)}
                >
                  <stage.icon size={18} />
                  <span>{stage.label}</span>
                  <span>{counts[stage.name]}</span>
                </button>
              ))}
          </div>
          <div
            className="roadmap-index-summary"
            role="img"
            aria-label={
              loading
                ? 'Loading progress'
                : error
                  ? 'Progress unavailable'
                  : `${counts.Completed} of ${issues.length} issues completed`
            }
          >
            <CheckCircleIcon size={20} />
            <span>
              {counts.Completed} completed
              <br />
              <small>
                {counts['In Progress'] + counts.Planned + counts['On Hold']}{' '}
                remaining
              </small>
            </span>
          </div>
        </aside>
        <section className="roadmap-drawer" aria-label="Issue index">
          <div className="roadmap-folder-tab">
            {status === 'All'
              ? 'All issues'
              : stages.find((stage) => stage.name === status)?.label}
            <span>{filtered.length}</span>
          </div>
          <div className="roadmap-paper">
            <header className="roadmap-paper-header">
              <div>
                <span className="roadmap-document-label">
                  Fezcodex / Development
                </span>
                <h2>
                  {status === 'All'
                    ? 'Issue index'
                    : stages.find((stage) => stage.name === status)?.label}
                </h2>
              </div>
              <span className="roadmap-document-mark" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </header>
            <div className="roadmap-tools">
              <label className="roadmap-search">
                <MagnifyingGlassIcon size={20} />
                <span className="sr-only">Search roadmap</span>
                <input
                  type="search"
                  placeholder="Find an issue…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
            </div>
            <div
              className="roadmap-filter-row"
              role="group"
              aria-label="Issue filters"
            >
              <div className="roadmap-filter-field">
                <span>Priority</span>
                <CustomDropdown
                  variant="brutalist"
                  menuClassName={`roadmap-dropdown-menu ${theme === 'luxe' ? 'roadmap-dropdown-luxe' : ''}`}
                  ariaLabel="Priority"
                  value={priority}
                  onChange={setPriority}
                  options={['All', 'High', 'Medium', 'Low'].map((value) => ({
                    value,
                    label: value === 'All' ? 'All priorities' : value,
                  }))}
                  fullWidth
                />
              </div>
              {filterFields.map(({ key, label, fallback }) => (
                <div className="roadmap-filter-field" key={key}>
                  <span>{label}</span>
                  <CustomDropdown
                    variant="brutalist"
                    menuClassName={`roadmap-dropdown-menu ${theme === 'luxe' ? 'roadmap-dropdown-luxe' : ''}`}
                    ariaLabel={label}
                    value={metadataFilters[key]}
                    onChange={(value) =>
                      setMetadataFilters((current) => ({
                        ...current,
                        [key]: value,
                      }))
                    }
                    options={[
                      {
                        value: '',
                        label: `All ${key === 'category' ? 'categories' : key === 'epic' ? 'epics' : 'assignees'}`,
                      },
                      ...[
                        ...new Set(
                          issues.map((issue) => issue[key] || fallback),
                        ),
                      ]
                        .sort((a, b) => a.localeCompare(b))
                        .map((value) => ({ value, label: value })),
                    ]}
                    fullWidth
                  />
                </div>
              ))}
            </div>
            {loading ? (
              <div className="roadmap-state" role="status">
                <h2>Loading issues…</h2>
              </div>
            ) : error ? (
              <div className="roadmap-state" role="alert">
                <h2>The roadmap couldn’t load.</h2>
                <p>Try again to fetch the latest issues.</p>
                <button onClick={() => setAttempt((value) => value + 1)}>
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="roadmap-file-columns" aria-hidden="true">
                  <span>Reference</span>
                  <span>Issue</span>
                  <span>Category</span>
                  <span>Status</span>
                </div>
                {filtered.length ? (
                  <div className="roadmap-files">
                    {filtered.map((issue) => (
                      <WorkItem
                        key={issue.id}
                        issue={issue}
                        onOpen={changeIssue}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="roadmap-state">
                    <h2>No matching issues</h2>
                    <p>Try another search or choose a different folder.</p>
                  </div>
                )}
                <footer className="roadmap-paper-footer">
                  <span role="status">
                    {filtered.length} of {issues.length} issues
                  </span>
                  {(query ||
                    status !== 'All' ||
                    priority !== 'All' ||
                    Object.values(metadataFilters).some(Boolean)) && (
                    <button onClick={resetFilters}>Clear filters</button>
                  )}
                  <span>Select an issue to inspect</span>
                </footer>
              </>
            )}
          </div>
        </section>
      </div>
      {selectedId && !loading && !error && (
        <IssueDetail
          key={selectedId}
          issue={issues.find((issue) => issue.id === selectedId)}
          onClose={() => changeIssue(null)}
        />
      )}
    </main>
  );
}
