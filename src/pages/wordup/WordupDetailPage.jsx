import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ArrowDownIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useWordupData, useWordupEntry } from '../../hooks/useWordupData';
import LexicalSculpture from './LexicalSculpture';
import WordupShell, { wordLanguage, wordNumber } from './WordupShell';
import { getWordupSections, getRelatedWords } from './wordupReading';
import { calculateReadingTime } from '../../utils/readingTime';
import { getWordupCopy } from './wordupCopy';

export default function WordupDetailPage() {
  const { slug } = useParams();
  const { word, content, loading, error, notFound } = useWordupEntry(slug);
  const { words } = useWordupData();
  const copy = getWordupCopy(word?.contentLanguage);
  const hasTurkishDefinition =
    copy.language === 'tr' && Boolean(word?.translation);
  const primaryDefinition = hasTurkishDefinition
    ? word.translation
    : word?.definition;
  const secondaryDefinition = hasTurkishDefinition
    ? word?.definition
    : word?.translation;
  const sections = useMemo(() => getWordupSections(content), [content]);
  const sectionIds = useMemo(
    () => new Map(sections.map((section) => [section.line, section.id])),
    [sections],
  );
  const related = getRelatedWords(word, words);
  const position = words.findIndex((entry) => entry.slug === slug);
  const number = wordNumber(word?.number || position + 1);
  const canBrowse = position >= 0 && words.length > 1;
  const previous = canBrowse
    ? words[(position + words.length - 1) % words.length]
    : null;
  const next = canBrowse ? words[(position + 1) % words.length] : null;

  return (
    <WordupShell detail language={copy.language}>
      <Seo
        title={word ? `${word.word} — Wordup | Fezcodex` : 'Wordup | Fezcodex'}
        description={
          word?.definition ||
          'Made-up words for very real things. A personal language by fezcode.'
        }
        type="article"
      />
      {loading ? (
        <div className="wf-detail-state" role="status">
          <p>Finding this word…</p>
        </div>
      ) : notFound ? (
        <div className="wf-detail-state">
          <span className="wf-state-label">Not in the collection</span>
          <h1>This one hasn’t been invented. Yet.</h1>
          <p>There’s no entry for “{slug}”.</p>
          <Link to="/wordup">
            <ArrowLeftIcon size={17} aria-hidden="true" /> Back to the words
          </Link>
        </div>
      ) : error ? (
        <div className="wf-detail-state" role="alert">
          <h1>Lost for words.</h1>
          <p>This entry couldn’t be loaded. Give it another try.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Try again
          </button>
          <Link to="/wordup">Back to the words</Link>
        </div>
      ) : (
        word && (
          <article className="wf-entry" lang={copy.language}>
            <section
              className="wf-entry-hero"
              aria-labelledby="word-entry-title"
            >
              <Link to="/wordup" className="wf-entry-return">
                <ArrowLeftIcon size={16} aria-hidden="true" /> {copy.allWords}
              </Link>
              <header className="wf-entry-heading">
                <p className="wf-entry-number">
                  {copy.word} {number}
                  <span aria-hidden="true"> / </span>
                  {wordNumber(words.length)}
                </p>
                <h1
                  className="wf-entry-title"
                  id="word-entry-title"
                  lang={word.language}
                >
                  {word.word}
                </h1>
                <p className="wf-entry-language">
                  <span>{wordLanguage(word.language)}</span>
                  {word.partOfSpeech && (
                    <span>
                      {copy.partsOfSpeech[word.partOfSpeech] ||
                        word.partOfSpeech}
                    </span>
                  )}
                  {word.status === 'draft' && <span>{copy.draft}</span>}
                </p>
                <p
                  className="wf-entry-meaning"
                  lang={
                    hasTurkishDefinition
                      ? 'tr'
                      : word.definition
                        ? 'en'
                        : copy.language
                  }
                >
                  {primaryDefinition || copy.pending}
                </p>
                {secondaryDefinition && (
                  <p
                    className="wf-entry-translation"
                    lang={hasTurkishDefinition ? 'en' : 'tr'}
                  >
                    <span lang={copy.language}>{copy.translationLabel}</span>
                    {secondaryDefinition}
                  </p>
                )}
                <a className="wf-entry-read-link" href="#word-entry-notes">
                  {copy.explore} <ArrowDownIcon size={14} aria-hidden="true" />
                  <span>
                    {copy.readingTime(
                      Math.max(1, calculateReadingTime(content)),
                    )}
                  </span>
                </a>
              </header>
              <div className="wf-entry-art">
                <LexicalSculpture
                  seed={word.word}
                  className="wf-entry-sculpture"
                />
              </div>
              <dl className="wf-entry-spec">
                {word.pronunciation && (
                  <div>
                    <dt>{copy.pronunciation}</dt>
                    <dd>/{word.pronunciation}/</dd>
                  </div>
                )}
                {word.roots && (
                  <div>
                    <dt>{copy.roots}</dt>
                    <dd lang={word.language}>{word.roots}</dd>
                  </div>
                )}
                {word.date && (
                  <div>
                    <dt>{copy.created}</dt>
                    <dd>
                      <time dateTime={word.date}>{word.date}</time>
                    </dd>
                  </div>
                )}
                {word.register && (
                  <div>
                    <dt>{copy.register}</dt>
                    <dd>{word.register}</dd>
                  </div>
                )}
              </dl>
            </section>
            {word.example && (
              <section
                className="wf-entry-snapshot"
                aria-label={copy.usageExample}
              >
                <span>{copy.example}</span>
                <p lang={word.language}>“{word.example}”</p>
                <a href="#word-entry-notes">
                  {copy.context} <ArrowDownIcon size={16} aria-hidden="true" />
                </a>
              </section>
            )}
            <section
              id="word-entry-notes"
              className="wf-entry-reader"
              aria-label={copy.about}
            >
              <aside className="wf-reader-aside">
                <h2>{copy.behind}</h2>
                <p>{copy.behindDescription}</p>
                {sections.length > 0 && (
                  <nav className="wf-entry-contents" aria-label={copy.contents}>
                    {sections.map((section, index) => (
                      <a
                        key={section.id}
                        href={'#' + section.id}
                        lang={word.contentLanguage || 'en'}
                      >
                        <span aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {section.label}
                      </a>
                    ))}
                  </nav>
                )}
                {word.forms && (
                  <dl className="wf-word-forms">
                    <dt>{copy.forms}</dt>
                    <dd>{word.forms}</dd>
                  </dl>
                )}
                <a
                  className="wf-source-link"
                  href={`/wordup/${word.slug}.txt`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.source}{' '}
                  <ArrowUpRightIcon size={15} aria-hidden="true" />
                </a>
              </aside>
              <div className="wf-entry-body">
                <div
                  className="wf-markdown"
                  lang={word.contentLanguage || 'en'}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      blockquote: ({ node, children, ...props }) => (
                        <blockquote {...props} lang={word.language}>
                          {children}
                        </blockquote>
                      ),
                      h2: ({ node, children, ...props }) => (
                        <h2
                          {...props}
                          id={sectionIds.get(node?.position?.start?.line)}
                        >
                          {children}
                        </h2>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            </section>
            {related.length > 0 && (
              <section
                className="wf-related"
                aria-labelledby="word-related-title"
              >
                <div className="wf-related-heading">
                  <span>{copy.relatedDescription}</span>
                  <h2 id="word-related-title">{copy.related}</h2>
                </div>
                <div className="wf-related-links">
                  {related.map((entry) => (
                    <Link key={entry.slug} to={'/wordup/' + entry.slug}>
                      <span>{wordLanguage(entry.language)}</span>
                      <h3 lang={entry.language}>
                        {entry.word}
                        <ArrowUpRightIcon size={21} aria-hidden="true" />
                      </h3>
                      <p lang="en">{entry.definition}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <nav className="wf-entry-navigation" aria-label={copy.moreWords}>
              {previous && (
                <Link
                  to={`/wordup/${previous.slug}`}
                  className="wf-entry-previous"
                >
                  <span>{copy.previous}</span>
                  <strong lang={previous.language}>{previous.word}</strong>
                  <ArrowLeftIcon size={22} aria-hidden="true" />
                </Link>
              )}
              <Link to="/wordup" className="wf-back-index">
                {copy.back}
              </Link>
              {next && (
                <Link to={`/wordup/${next.slug}`} className="wf-entry-next">
                  <span>{copy.next}</span>
                  <strong lang={next.language}>{next.word}</strong>
                  <ArrowRightIcon size={22} aria-hidden="true" />
                </Link>
              )}
            </nav>
          </article>
        )
      )}
    </WordupShell>
  );
}
