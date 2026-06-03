import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArchiveIcon,
  FolderOpenIcon,
  CaretRightIcon,
} from '@phosphor-icons/react';
import SnfLayout from '../../components/snf/SnfLayout';
import {
  SnfPageHeader,
  SnfSearchInput,
  SnfReveal,
  SnfEmpty,
} from '../../components/snf/SnfPrimitives';
import Seo from '../../components/Seo';
import { useSnf } from '../../context/SnfContext';
import { useBooks } from '../../hooks/useStoriesData';

const SnfArchivePage = () => {
  const { language, setBreadcrumbs } = useSnf();
  const { data: books, loading } = useBooks(language);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setBreadcrumbs([{ label: 'ARCHIVE' }]);
  }, [setBreadcrumbs]);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return (books || []).filter((b) => {
      const titleMatch = b.bookTitle?.toLowerCase().includes(term);
      const scribeMatch = b.episodes?.some((e) =>
        e.author?.toLowerCase().includes(term),
      );
      return titleMatch || scribeMatch;
    });
  }, [books, query]);

  const scribesFor = (book) =>
    [...new Set((book.episodes || []).map((e) => e.author))].join(' · ');

  return (
    <SnfLayout>
      <Seo
        title="The Archive | Serfs and Frauds Terminal"
        description="Browse every volume and field report in the From Serfs and Frauds anthology."
        keywords={['serfs and frauds', 'archive', 'volumes', 'noir']}
      />
      <SnfPageHeader
        fileNo="001"
        label="CASE FILES // VOLUMES"
        title={language === 'tr' ? 'ARŞİV' : 'THE ARCHIVE'}
        subtitle={
          language === 'tr'
            ? 'Sınıflandırılmış ciltler ve saha raporları. Bir dosya seçin.'
            : 'Classified volumes and field reports. Select a file to decrypt.'
        }
        icon={<ArchiveIcon size={40} weight="duotone" />}
      />

      <div className="max-w-xl mb-10">
        <SnfSearchInput
          value={query}
          onChange={setQuery}
          placeholder={
            language === 'tr'
              ? 'cilt / kâtip ara…'
              : 'query by volume or scribe…'
          }
        />
      </div>

      {loading && (
        <div className="snf-mono text-sm snf-dim animate-pulse">
          accessing archive…
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((book, i) => (
          <SnfReveal key={book.bookId} delay={Math.min(i * 0.05, 0.3)}>
            <div className="snf-panel snf-panel-bracket overflow-hidden">
              {/* Folder tab header */}
              <Link
                to={`/snf/archive/${book.bookId}`}
                className="group flex items-center gap-4 px-5 py-4 snf-bar hover:bg-[rgba(var(--snf-phos-rgb),0.05)] transition-colors"
              >
                <span className="snf-display text-2xl md:text-3xl font-bold text-[var(--snf-phos)] snf-glow-soft tabular-nums flex-none">
                  {String(book.bookId).padStart(2, '0')}
                </span>
                <span className="flex-grow min-w-0">
                  <span className="block snf-display text-base md:text-xl font-semibold uppercase tracking-wide text-[var(--snf-ink)] group-hover:text-[var(--snf-phos)] transition-colors truncate">
                    {book.bookTitle}
                  </span>
                  {book.phaseTitle && (
                    <span className="block snf-mono text-[10px] tracking-[0.18em] snf-dim mt-0.5 truncate">
                      {book.phaseTitle}
                    </span>
                  )}
                </span>
                <span className="hidden sm:block text-right flex-none">
                  <span className="block snf-display text-lg font-bold text-[var(--snf-phos)] tabular-nums">
                    {String(book.episodes?.length || 0).padStart(2, '0')}
                  </span>
                  <span className="block snf-mono text-[9px] tracking-[0.2em] snf-dim">
                    {language === 'tr' ? 'DOSYA' : 'DOSSIERS'}
                  </span>
                </span>
                <FolderOpenIcon
                  size={22}
                  weight="duotone"
                  className="snf-row-arrow snf-dim flex-none"
                />
              </Link>

              {/* Episode chips */}
              <div className="px-5 py-4">
                <div className="snf-mono text-[10px] tracking-[0.2em] snf-dim mb-3 truncate">
                  SCRIBES :: {scribesFor(book) || '—'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(book.episodes || []).map((ep) => (
                    <Link
                      key={ep.id}
                      to={`/snf/archive/${book.bookId}/${ep.id}`}
                      className="snf-row flex items-center gap-2 px-3 py-1.5 snf-mono text-[11px] text-[var(--snf-ink)] hover:text-[var(--snf-phos)] max-w-full"
                    >
                      <span className="snf-phos-text tabular-nums flex-none">
                        {String(ep.id).padStart(2, '0')}
                      </span>
                      <span className="truncate">{ep.title}</span>
                      <CaretRightIcon
                        size={11}
                        weight="bold"
                        className="snf-row-arrow flex-none"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </SnfReveal>
        ))}

        {!loading && filtered.length === 0 && (
          <SnfEmpty>
            {language === 'tr'
              ? 'Sorgunuzla eşleşen dosya yok.'
              : 'No files match your query.'}
          </SnfEmpty>
        )}
      </div>
    </SnfLayout>
  );
};

export default SnfArchivePage;
