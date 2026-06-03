import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserFocusIcon,
  LinkSimpleIcon,
  FolderIcon,
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
import { useAchievements } from '../../context/AchievementContext';
import { useAuthors, useBooks, getBooksByAuthor } from '../../hooks/useStoriesData';

const SnfAgentsPage = () => {
  const { language, setBreadcrumbs } = useSnf();
  const { unlockAchievement } = useAchievements();
  const { data: authors, loading } = useAuthors();
  const { data: books } = useBooks(language);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setBreadcrumbs([{ label: 'OPERATORS' }]);
    unlockAchievement('author_aficionado');
  }, [setBreadcrumbs, unlockAchievement]);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return (authors || []).filter(
      (a) =>
        a.name?.toLowerCase().includes(term) ||
        a.alias?.toLowerCase().includes(term),
    );
  }, [authors, query]);

  return (
    <SnfLayout>
      <Seo
        title="Operators | Serfs and Frauds Terminal"
        description="The field operators and scribes behind From Serfs and Frauds."
        keywords={['serfs and frauds', 'authors', 'operators', 'scribes']}
      />
      <SnfPageHeader
        fileNo="005"
        label="FIELD OPERATORS // SCRIBES"
        title={language === 'tr' ? 'AJANLAR' : 'OPERATORS'}
        subtitle={
          language === 'tr'
            ? 'Bu raporları dosyalayan saha kâtipleri.'
            : 'The field scribes who filed these reports.'
        }
        icon={<UserFocusIcon size={40} weight="duotone" />}
      />

      <div className="max-w-xl mb-10">
        <SnfSearchInput
          value={query}
          onChange={setQuery}
          placeholder={
            language === 'tr' ? 'ajan ara…' : 'query by name or codename…'
          }
        />
      </div>

      {loading && (
        <div className="snf-mono text-sm snf-dim animate-pulse">
          decrypting operator IDs…
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((a, i) => {
          const credits = getBooksByAuthor(books, a.name, a.alias);
          return (
            <SnfReveal key={`${a.alias}-${i}`} delay={Math.min(i * 0.06, 0.3)}>
              <div className="snf-panel snf-panel-bracket h-full p-5 flex flex-col">
                <div className="flex items-center gap-2 snf-mono text-[10px] tracking-[0.2em] snf-dim mb-4">
                  <span className="snf-led" /> OPR-{String(i + 1).padStart(2, '0')}
                  <span className="snf-divider flex-grow" />
                  ACTIVE
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-none">
                    <div className="w-16 h-16 border border-[rgba(var(--snf-phos-rgb),0.5)] overflow-hidden bg-black/40">
                      {a.image ? (
                        <img
                          src={a.image}
                          alt={a.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          style={{
                            filter: 'grayscale(0.4) contrast(1.1) saturate(0.9)',
                          }}
                        />
                      ) : (
                        <UserFocusIcon
                          size={32}
                          weight="duotone"
                          className="snf-phos-text w-full h-full p-3"
                        />
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 snf-led snf-led-blink" />
                  </div>
                  <div className="min-w-0">
                    <div className="snf-display text-xl font-bold uppercase tracking-wide text-[var(--snf-phos)] snf-glow-soft leading-none truncate">
                      {a.alias}
                    </div>
                    <div className="snf-mono text-[11px] snf-dim mt-1 truncate">
                      {language === 'tr' ? 'KİMLİK' : 'ID'}: {a.name}
                    </div>
                  </div>
                </div>

                <div className="snf-divider mb-3" />
                <div className="snf-mono text-[10px] tracking-[0.2em] snf-dim mb-2 flex items-center gap-1.5">
                  <FolderIcon size={12} weight="fill" />
                  {language === 'tr' ? 'KATKILAR' : 'CREDITS'} [
                  {String(credits.length).padStart(2, '0')}]
                </div>
                <div className="flex flex-wrap gap-1.5 flex-grow content-start">
                  {credits.length > 0 ? (
                    credits.map((b) => (
                      <Link
                        key={b.bookId}
                        to={`/snf/archive/${b.bookId}`}
                        className="snf-row px-2 py-1 snf-mono text-[10px] text-[var(--snf-ink)] hover:text-[var(--snf-phos)]"
                        title={b.bookTitle}
                      >
                        VOL_{String(b.bookId).padStart(2, '0')}
                      </Link>
                    ))
                  ) : (
                    <span className="snf-mono text-[10px] snf-dim italic">
                      no filed reports
                    </span>
                  )}
                </div>

                {a.website && (
                  <a
                    href={a.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 snf-mono text-[10px] uppercase tracking-[0.25em] snf-dim hover:text-[var(--snf-phos)] transition-colors flex items-center gap-1.5"
                  >
                    <LinkSimpleIcon size={13} weight="bold" />
                    {language === 'tr' ? 'DIŞ BAĞLANTI' : 'EXTERNAL LINK'}
                  </a>
                )}
              </div>
            </SnfReveal>
          );
        })}
        {!loading && filtered.length === 0 && (
          <SnfEmpty>
            {language === 'tr' ? 'Ajan bulunamadı.' : 'No operators found.'}
          </SnfEmpty>
        )}
      </div>
    </SnfLayout>
  );
};

export default SnfAgentsPage;
