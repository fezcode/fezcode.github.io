import React, { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FolderOpenIcon,
  FileTextIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react';
import SnfLayout from '../../components/snf/SnfLayout';
import { SnfPageHeader, SnfReveal, SnfButton } from '../../components/snf/SnfPrimitives';
import Seo from '../../components/Seo';
import { useSnf } from '../../context/SnfContext';
import { useBooks } from '../../hooks/useStoriesData';

const SnfVolumePage = () => {
  const { bookId } = useParams();
  const { language, setBreadcrumbs } = useSnf();
  const { data: books, loading } = useBooks(language);

  const book = useMemo(
    () => (books || []).find((b) => Number(b.bookId) === Number(bookId)),
    [books, bookId],
  );

  useEffect(() => {
    setBreadcrumbs([
      { label: 'ARCHIVE', path: '/snf/archive' },
      { label: book ? book.bookTitle : `VOL ${bookId}` },
    ]);
  }, [setBreadcrumbs, book, bookId]);

  return (
    <SnfLayout>
      <Seo
        title={`${book?.bookTitle || 'Volume'} | Serfs and Frauds Terminal`}
        description={`Field reports filed under ${book?.bookTitle || 'this volume'} of From Serfs and Frauds.`}
        keywords={['serfs and frauds', 'volume', book?.bookTitle]}
      />

      {loading && !book && (
        <div className="snf-mono text-sm snf-dim animate-pulse">
          mounting volume…
        </div>
      )}

      {!loading && !book && (
        <div className="snf-panel snf-panel-bracket p-8 text-center">
          <div className="snf-display text-2xl text-[var(--snf-alert)] mb-3">
            VOLUME NOT FOUND
          </div>
          <p className="snf-mono text-sm snf-dim mb-6">
            Record VOL_{bookId} is missing or corrupted.
          </p>
          <SnfButton to="/snf/archive">RETURN TO ARCHIVE</SnfButton>
        </div>
      )}

      {book && (
        <>
          <SnfPageHeader
            fileNo={`VOL_${String(book.bookId).padStart(2, '0')}`}
            label={book.phaseTitle || 'CASE FILE'}
            title={book.bookTitle}
            subtitle={
              language === 'tr'
                ? `${book.episodes?.length || 0} saha raporu dosyalandı.`
                : `${book.episodes?.length || 0} field reports on file.`
            }
            icon={<FolderOpenIcon size={40} weight="duotone" />}
          />

          <div className="flex items-center gap-3 mb-4">
            <span className="snf-vt snf-phos-text text-lg">
              {language === 'tr' ? 'DOSYALAR' : 'DOSSIERS'}
            </span>
            <span className="snf-divider flex-grow" />
          </div>

          <div className="space-y-2.5">
            {(book.episodes || []).map((ep, i) => (
              <SnfReveal key={ep.id} delay={Math.min(i * 0.05, 0.3)}>
                <Link
                  to={`/snf/archive/${book.bookId}/${ep.id}`}
                  className="snf-row group flex items-center gap-4 px-4 md:px-5 py-4"
                >
                  <span className="snf-display text-xl md:text-2xl font-bold text-[var(--snf-phos)] tabular-nums flex-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <FileTextIcon
                    size={20}
                    weight="duotone"
                    className="snf-dim flex-none hidden sm:block"
                  />
                  <span className="flex-grow min-w-0">
                    <span className="block snf-display text-base md:text-lg font-semibold uppercase tracking-wide text-[var(--snf-ink)] group-hover:text-[var(--snf-phos)] transition-colors truncate">
                      {ep.title}
                    </span>
                    <span className="block snf-mono text-[10px] tracking-[0.16em] snf-dim mt-0.5">
                      {ep.author} · {ep.date}
                    </span>
                  </span>
                  <span className="snf-mono text-[10px] uppercase tracking-[0.25em] snf-dim group-hover:text-[var(--snf-phos)] transition-colors hidden md:flex items-center gap-2 flex-none">
                    {language === 'tr' ? 'ÇÖZ' : 'DECRYPT'}
                    <ArrowRightIcon
                      size={13}
                      weight="bold"
                      className="snf-row-arrow"
                    />
                  </span>
                </Link>
              </SnfReveal>
            ))}
          </div>

          <div className="mt-10">
            <SnfButton to="/snf/archive">
              <span className="flex items-center gap-2">
                <ArrowLeftIcon size={15} weight="bold" />
                {language === 'tr' ? 'ARŞİVE DÖN' : 'BACK TO ARCHIVE'}
              </span>
            </SnfButton>
          </div>
        </>
      )}
    </SnfLayout>
  );
};

export default SnfVolumePage;
