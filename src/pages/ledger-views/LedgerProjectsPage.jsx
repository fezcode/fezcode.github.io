import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useAchievements } from '../../context/AchievementContext';
import {
  LedgerFolio,
  LedgerNotice,
  LedgerRule,
} from '../../components/ledger';
import '../../styles/Ledger.css';

/**
 * Ledger theme projects page — the register of deployed work. Every project
 * is a numbered row: rank, name, a dotted leader to its stack and date, and
 * → OPEN. Sifting happens above the rule: a search field and pressed chips,
 * with the running count recorded like a balance.
 */

const formatDate = (d) =>
  new Date(d)
    .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    .toUpperCase();

const ProjectRow = ({ project, index }) => (
  <li>
    <Link
      to={`/projects/${project.slug}`}
      className="ldg-row-link ldg-leader-row"
    >
      <span className="ldg-rank">{String(index + 1).padStart(2, '0')}</span>
      <span className="min-w-0">
        <span
          className="font-bold block truncate"
          style={{ letterSpacing: '1px' }}
        >
          {project.title}
        </span>
        {project.shortDescription && (
          <span
            className="ldg-muted block normal-case truncate"
            style={{ fontSize: '0.76rem', letterSpacing: 0 }}
          >
            {project.shortDescription}
          </span>
        )}
      </span>
      <span className="ldg-leader" aria-hidden="true" />
      <span
        className="ldg-muted hidden lg:inline truncate"
        style={{ fontSize: '0.76rem', maxWidth: '16rem' }}
      >
        {(project.technologies || [])
          .slice(0, 3)
          .map((t) => t.toUpperCase())
          .join(' · ')}
      </span>
      <span
        className="ldg-muted hidden sm:inline"
        style={{ fontSize: '0.76rem' }}
      >
        {project.date ? formatDate(project.date) : '—'}
      </span>
      <span className="ldg-accent font-bold" style={{ fontSize: '0.76rem' }}>
        → OPEN
      </span>
    </Link>
  </li>
);

const LedgerProjectsPage = () => {
  const { projects, loading, error } = useProjects();
  const { unlockAchievement } = useAchievements();
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');

  useEffect(() => {
    unlockAchievement('project_pioneer');
  }, [unlockAchievement]);

  const allTechs = Array.from(
    new Set(
      (projects || []).flatMap((p) =>
        (p.technologies || []).map((t) => t.toLowerCase()),
      ),
    ),
  )
    .sort()
    .slice(0, 12);

  const filtered = (projects || []).filter((p) => {
    if (activeTag !== 'all') {
      const techs = (p.technologies || []).map((t) => t.toLowerCase());
      if (!techs.includes(activeTag)) return false;
    }
    if (query) {
      const q = query.toLowerCase();
      if (
        !p.title?.toLowerCase().includes(q) &&
        !p.shortDescription?.toLowerCase().includes(q) &&
        !(p.technologies || []).some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
    }
    return true;
  });

  const total = (projects || []).length;
  const isFiltering = activeTag !== 'all' || Boolean(query.trim());

  const clearFilters = () => {
    setQuery('');
    setActiveTag('all');
  };

  return (
    <div className="ldg-root">
      <Seo
        title="Projects | Fezcodex"
        description="The register of deployed work — every project ranked, annotated, and filed in the ledger."
      />

      <div className="ldg-page">
        <LedgerFolio
          folio="FOLIO NO. 02"
          title="PROJECTS"
          sub="THE REGISTER OF DEPLOYED WORK"
        />

        {loading && <LedgerNotice>OPENING THE REGISTER…</LedgerNotice>}

        {error && (
          <LedgerNotice error>
            COULD NOT READ THE PROJECT REGISTER
          </LedgerNotice>
        )}

        {!loading && !error && (
          <>
            {/* sift */}
            <div className="flex flex-col gap-3 mb-4">
              <input
                className="ldg-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH THE REGISTER…"
                aria-label="Search projects"
              />
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="ldg-chip"
                  aria-pressed={activeTag === 'all'}
                  onClick={() => setActiveTag('all')}
                >
                  ALL
                </button>
                {allTechs.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="ldg-chip"
                    aria-pressed={activeTag === t}
                    onClick={() => setActiveTag(t)}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <LedgerRule className="mb-3" />

            <p className="ldg-stats mb-3">
              <span>
                <strong>{String(filtered.length).padStart(2, '0')}</strong> OF{' '}
                <strong>{String(total).padStart(2, '0')}</strong> ON RECORD
              </span>
              {isFiltering && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ldg-chip"
                >
                  CLEAR SIFT ×
                </button>
              )}
            </p>

            {filtered.length === 0 ? (
              <LedgerNotice>
                NOTHING ON RECORD MATCHES — CLEAR THE SIFT AND TRY AGAIN
              </LedgerNotice>
            ) : (
              <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
                {filtered.map((p, i) => (
                  <ProjectRow key={p.slug} project={p} index={i} />
                ))}
              </ul>
            )}

            <div className="mt-10">
              <LedgerRule />
              <p className="ldg-label pt-3">
                ORDER IS THE ORDER OF FILING · ENTRIES ARE NEVER ERASED, ONLY
                SUPERSEDED
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LedgerProjectsPage;
