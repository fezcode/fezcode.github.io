import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  AsteriskIcon,
  CrownIcon,
  SparkleIcon,
  ArrowClockwiseIcon,
  BookOpenIcon,
} from '@phosphor-icons/react';
import {
  useAppConfig,
  useThemeFonts,
  AppLoading,
  AppMissing,
  AppSeo,
} from './app-shell';
import '../../styles/project-showcases/SirWordALotShowcase.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';
const NODE_POSITIONS = [
  { x: 16, y: 23 },
  { x: 81, y: 18 },
  { x: 85, y: 78 },
  { x: 14, y: 81 },
];
const GRADE_FEEDBACK = {
  Again: 'Again → this word returns in the current session.',
  Hard: 'Hard → the app calculates an interval from the current schedule.',
  Good: 'Good → a first SM-2 review returns in 1 day.',
  Easy: 'Easy → a first SM-2 review returns in 4 days.',
};

const Rosette = ({ className = '' }) => (
  <svg
    className={`sw-rosette ${className}`}
    viewBox="0 0 600 600"
    fill="none"
    aria-hidden="true"
  >
    {Array.from({ length: 40 }, (_, index) => (
      <ellipse
        key={index}
        cx="300"
        cy="300"
        rx="245"
        ry="85"
        stroke="currentColor"
        strokeWidth=".65"
        transform={`rotate(${index * 4.5} 300 300)`}
      />
    ))}
    <circle cx="300" cy="300" r="262" stroke="currentColor" strokeWidth=".7" />
    <circle
      cx="300"
      cy="300"
      r="274"
      stroke="currentColor"
      strokeDasharray="1 9"
    />
  </svg>
);

const LexiconConstellation = ({ entries }) => {
  const [word, setWord] = useState(entries[0].word);
  const entry = entries.find((item) => item.word === word) || entries[0];

  return (
    <div className="sw-constellation-block">
      <div
        className="sw-constellation"
        aria-label="Interactive sample word connections"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="currentColor"
            strokeWidth=".12"
            strokeDasharray=".4 1.5"
          />
          {NODE_POSITIONS.map((position, index) => (
            <path
              key={index}
              d={`M50 50 Q${position.x} 50 ${position.x} ${position.y}`}
              stroke="currentColor"
              strokeWidth=".15"
            />
          ))}
        </svg>
        <div className="sw-root-word">
          <span>THE WORD AT THE CENTRE</span>
          <strong>{entry.word}</strong>
          <em>{entry.part}</em>
        </div>
        {entry.relations.map((related, index) => (
          <button
            className="sw-word-node"
            type="button"
            key={related}
            onClick={() => setWord(related)}
            aria-label={`Explore the word ${related}`}
            style={{
              '--node-x': `${NODE_POSITIONS[index].x}%`,
              '--node-y': `${NODE_POSITIONS[index].y}%`,
            }}
          >
            <span>0{index + 1}</span>
            {related}
            <ArrowUpRightIcon size={13} />
          </button>
        ))}
        <span className="sw-constellation-corner sw-corner-one">
          N / SYNONYMS & RELATIONS
        </span>
        <span className="sw-constellation-corner sw-corner-two">
          A LEXICON IS A LIVING THING.
        </span>
      </div>
      <div
        className="sw-word-description"
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <h3>
            {entry.word}
            <span> / {entry.part}</span>
          </h3>
          <p>{entry.definition}</p>
          <blockquote>“{entry.sentence}”</blockquote>
        </div>
        <button
          type="button"
          onClick={() => setWord(entries[0].word)}
          aria-label="Reset word connections to lucid"
        >
          <ArrowClockwiseIcon size={19} />
          <span>Return to lucid</span>
        </button>
      </div>
      <p className="sw-demo-note">
        INTERACTIVE WORD MAP · AUTHORED EXAMPLES · SELECT A CONNECTION TO
        EXPLORE
      </p>
    </div>
  );
};

const RecallStudio = ({ words }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [grade, setGrade] = useState('');
  const word = words[wordIndex];
  const nextWord = () => {
    setWordIndex((wordIndex + 1) % words.length);
    setRevealed(false);
    setGrade('');
  };

  return (
    <div className="sw-recall-studio">
      <div className="sw-recall-card-shell">
        <div className="sw-recall-top">
          <span>RECALL SPECIMEN / 0{wordIndex + 1}</span>
          <AsteriskIcon size={20} />
        </div>
        <button
          className={`sw-recall-card ${revealed ? 'is-revealed' : ''}`}
          type="button"
          aria-expanded={revealed}
          aria-label={
            revealed
              ? `Hide the definition of ${word.word}`
              : `Reveal the definition of ${word.word}`
          }
          onClick={() => {
            setRevealed(!revealed);
            setGrade('');
          }}
        >
          <span className="sw-recall-part">
            {word.part} / {word.pronunciation}
          </span>
          <strong>{word.word}</strong>
          {revealed ? (
            <>
              <span className="sw-recall-definition">{word.definition}</span>
              <span className="sw-recall-sentence">“{word.sentence}”</span>
              <span className="sw-recall-hint">TURN BACK ↗</span>
            </>
          ) : (
            <>
              <span className="sw-recall-question">
                Somewhere in your memory,
                <br />
                this word is waiting.
              </span>
              <span className="sw-recall-hint">
                TURN THE CARD <ArrowUpRightIcon size={17} />
              </span>
            </>
          )}
        </button>
        <div className="sw-recall-bottom">
          <span>SM-2 / FIRST REVIEW</span>
          <span>SPACE OR ENTER TO TURN</span>
        </div>
      </div>
      <div className="sw-recall-controls">
        <div>
          <span className="sw-label">HOW WELL DID YOU REMEMBER?</span>
          <p>Reveal the answer. Then make the call.</p>
        </div>
        <div
          className="sw-grade-options"
          role="group"
          aria-label="Choose a sample recall grade"
        >
          {Object.keys(GRADE_FEEDBACK).map((label, index) => (
            <button
              key={label}
              type="button"
              disabled={!revealed}
              aria-pressed={grade === label}
              onClick={() => setGrade(label)}
            >
              <span>0{index + 1}</span>
              {label}
            </button>
          ))}
        </div>
        <p className="sw-grade-feedback" role="status">
          {grade
            ? GRADE_FEEDBACK[grade]
            : 'A small browser preview. Your real progress lives in the app.'}
        </p>
        <button className="sw-next-word" type="button" onClick={nextWord}>
          Another word, if you please <ArrowRightIcon size={19} />
        </button>
      </div>
    </div>
  );
};

const SirWordALotProjectPage = () => {
  const { cfg, project, loading, failed } = useAppConfig();
  useThemeFonts(FONTS, 'sirword-illuminated');
  if (loading) return <AppLoading />;
  if (failed || !cfg)
    return <AppMissing background="#2034e6" color="#fff1d5" />;
  const version = project?.version || cfg.version;

  return (
    <div className="sirword-showcase" id="sirword-top">
      <AppSeo cfg={cfg} project={project} />
      <a className="sw-skip" href="#sw-word-map">
        Skip to interactive word map
      </a>
      <header className="sw-nav sw-wrap">
        <Link to="/projects" className="sw-brand">
          <CrownIcon size={28} weight="light" />
          <span>
            SIR
            <br />
            WORD-A-LOT
          </span>
        </Link>
        <span className="sw-nav-caption">
          A MOST PERSONAL LEXICON
          <br />
          BY FEZCODE · v{version}
        </span>
        <nav aria-label="Sir Word-a-lot navigation">
          <a href="#sw-recall">Try a word</a>
          <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
            Source <ArrowUpRightIcon size={15} />
          </a>
          <a
            className="sw-nav-download"
            href={cfg.download}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enter the lexicon <ArrowUpRightIcon size={16} />
          </a>
        </nav>
      </header>
      <section className="sw-hero sw-wrap" aria-labelledby="sw-title">
        <div className="sw-hero-topline">
          <span>AN EXERCISE IN KEEPING THE EXTRAORDINARY.</span>
          <span>VOCABULARY / THESAURUS / RECALL</span>
        </div>
        <div className="sw-hero-composition">
          <h1 id="sw-title">
            <span>Words</span>
            <em>worth</em>
            <span>
              keeping<span className="sw-title-period">.</span>
            </span>
          </h1>
          <Rosette className="sw-hero-rosette" />
          <div className="sw-hero-book">
            <img
              src="/images/projects/sir-word-a-lot/lexicon.webp"
              alt="Sir Word-a-lot's purple and gold lexicon, with a knight's helmet and a gilded quill"
              width="1000"
              height="1000"
            />
            <span className="sw-art-label">
              THE PERSONAL LEXICON
              <br />
              VOL. 001 — STILL GROWING
            </span>
          </div>
          <div className="sw-hero-aside">
            <SparkleIcon size={30} weight="thin" />
            <p>
              Meet a word.
              <br />
              Keep its sentence.
              <br />
              <em>Make it yours.</em>
            </p>
          </div>
        </div>
        <div className="sw-hero-bottom">
          <p>{cfg.subtitle}</p>
          <a href="#sw-word-map">
            <span>FOLLOW YOUR CURIOSITY</span>
            <ArrowDownIcon size={22} />
          </a>
          <span className="sw-hero-stamp">
            60 STARTER WORDS
            <br />A LIFETIME OF CONNECTIONS
          </span>
        </div>
      </section>
      <div className="sw-manifesto-band" aria-hidden="true">
        <span>MEET.</span>
        <AsteriskIcon />
        <em>Remember.</em>
        <AsteriskIcon />
        <span>REPEAT.</span>
        <AsteriskIcon />
      </div>
      <section
        className="sw-map-section sw-wrap"
        id="sw-word-map"
        aria-labelledby="sw-map-title"
      >
        <div className="sw-editorial-heading">
          <span className="sw-label">I / FOLLOW THE THREAD</span>
          <h2 id="sw-map-title">
            A word is
            <br />
            <em>a world.</em>
          </h2>
          <p>
            Synonyms. Antonyms. Related words. Rhymes. Follow one idea into the
            next. In the app, a synonym you haven’t collected yet can become a
            new entry in your library.
          </p>
        </div>
        <LexiconConstellation entries={cfg.lexicon} />
      </section>
      <section
        className="sw-recall-section"
        id="sw-recall"
        aria-labelledby="sw-recall-title"
      >
        <div className="sw-wrap">
          <div className="sw-recall-heading">
            <span className="sw-label">II / THE REFINEMENT PROTOCOL</span>
            <h2 id="sw-recall-title">
              You met.
              <br />
              <em>Now remember.</em>
            </h2>
            <p>
              Remembering is a practice. Flip, choose, fill the gap, or type the
              word. SM-2 and Leitner bring it back on a schedule, and you
              confirm every grade.
            </p>
          </div>
          <RecallStudio words={cfg.recall} />
          <div className="sw-scheduling-note">
            <span>SM-2 OR LEITNER</span>
            <p>
              Switch schedulers without resetting progress. Take a free-practice
              session when you want to play without changing your schedule.
            </p>
            <BookOpenIcon size={31} weight="thin" />
          </div>
        </div>
      </section>
      <section
        className="sw-library-section sw-wrap"
        aria-labelledby="sw-library-title"
      >
        <div className="sw-library-heading">
          <span className="sw-label">III / A HOME FOR EVERY DISCOVERY</span>
          <h2 id="sw-library-title">
            Keep the word.
            <br />
            <em>Keep the moment.</em>
          </h2>
          <p>
            A definition is a beginning. Keep the sentence that made it matter,
            the relations that give it shape, and the notes that make it yours.
          </p>
        </div>
        <figure className="sw-app-portrait">
          <div className="sw-portrait-label">
            <CrownIcon size={19} />
            <span>THE ACTUAL APPLICATION / LIBRARY & ENTRY</span>
            <span>01—07</span>
          </div>
          <img
            src="/images/projects/sir-word-a-lot/library.webp"
            width="1180"
            height="760"
            loading="lazy"
            alt="The real Sir Word-a-lot application showing a vocabulary library and detailed entry with definition, translation, relations, and notes"
          />
          <figcaption>
            CREAM CHROME. PETROL SURFACES. AN UNREASONABLY FORMAL APPROACH TO
            WORDS.
          </figcaption>
        </figure>
        <div className="sw-library-notes">
          <article>
            <span>01</span>
            <h3>Sentences with a memory.</h3>
            <p>
              A sentence bank links words automatically, including inflections.
              “Obfuscates” finds “obfuscate.” Your context stays connected.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Collections that keep up.</h3>
            <p>
              Build manual decks or save a library filter as a smart deck.
              Search, sort, tag, and find the words you want to meet again.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>A visible practice.</h3>
            <p>
              Streaks, retention, a review heatmap, and a mastery breakdown make
              the shape of your learning visible over time.
            </p>
          </article>
        </div>
      </section>
      <section className="sw-ownership-section">
        <div className="sw-wrap sw-ownership-grid">
          <div className="sw-ownership-art" aria-hidden="true">
            <Rosette />
            <span>Yours.</span>
            <small>THE LIBRARY BELONGS TO ITS READER.</small>
          </div>
          <div className="sw-ownership-copy">
            <span className="sw-label">IV / YOUR WORDS, UNDER YOUR ROOF</span>
            <h2>
              A private
              <br />
              <em>collection.</em>
            </h2>
            <p>
              Your library lives locally in SQLite. JSON export preserves your
              words, sentences, relations, review history, and schedule.
              Automatic snapshots keep a rolling set of backups.
            </p>
            <p>
              A bundled English–Turkish dictionary supplies offline meanings.
              Online lookup calls Datamuse and dictionaryapi.dev only when you
              ask for it, and you can switch lookup off.
            </p>
            <a
              className="sw-text-link"
              href={`${cfg.repo}#your-data`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the small print <ArrowUpRightIcon size={21} />
            </a>
          </div>
        </div>
      </section>
      <section
        className="sw-invitation sw-wrap"
        aria-labelledby="sw-download-title"
      >
        <span className="sw-label">YOUR NEXT WORD IS WAITING.</span>
        <h2 id="sw-download-title">
          Shall we
          <br />
          <em>begin?</em>
          <AsteriskIcon weight="thin" />
        </h2>
        <div className="sw-invitation-bottom">
          <a
            className="sw-download"
            href={cfg.download}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download for Windows <ArrowUpRightIcon size={26} />
          </a>
          <p>
            Self-contained Windows installer · v{version}
            <br />
            macOS & Linux are source-buildable, unreleased, and not yet tested
            on real machines.
          </p>
        </div>
      </section>
      <footer className="sw-footer sw-wrap">
        <Link to="/projects">← THE FEZCODE COLLECTION</Link>
        <span>SIR WORD-A-LOT / C# / .NET 10 / AVALONIA / SQLITE</span>
        <a href={cfg.repo} target="_blank" rel="noopener noreferrer">
          OPEN SOURCE, MOST CERTAINLY. <ArrowUpRightIcon size={15} />
        </a>
        <a href="#sirword-top">TO THE BEGINNING ↑</a>
      </footer>
    </div>
  );
};

export default SirWordALotProjectPage;
