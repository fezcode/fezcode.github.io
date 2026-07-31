import React, { useState, useEffect, useRef } from 'react';
import Seo from '../components/Seo';
import '../styles/DemystifiedGenre.css';

// Parser for master genres list (genres.txt)
const parseGenresIndex = (text) => {
  if (!text) return [];
  const blocks = text.split(/^===$/m).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block) => {
    const item = {
      id: '',
      rank: '',
      name: '',
      years: '',
      tag: '',
      origin: '',
      audio: '',
    };
    const lines = block.split('\n');
    lines.forEach((line) => {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.substring(0, colonIdx).trim();
        const val = line.substring(colonIdx + 1).trim();
        if (key in item) item[key] = val;
      }
    });
    return item;
  });
};

// Parser for individual genre detail file (public/demystify/genre/[id].txt)
const parseGenreDetail = (text) => {
  if (!text) return null;
  const item = {
    id: '',
    rank: '',
    name: '',
    years: '',
    tag: '',
    origin: '',
    signature: '',
    keyGear: '',
    audio: '',
    freqs: [220, 330, 440],
    synthType: 'sawtooth',
    breakdown: '',
    ascii: '',
    examples: [],
  };

  const lines = text.split('\n');
  let currentMode = null;
  const asciiLines = [];
  const breakdownLines = [];

  lines.forEach((line) => {
    if (line.startsWith('breakdown:')) {
      currentMode = 'breakdown';
      return;
    }
    if (line.startsWith('ascii:')) {
      currentMode = 'ascii';
      return;
    }
    if (line.startsWith('examples:')) {
      currentMode = 'examples';
      return;
    }

    if (currentMode === 'breakdown') {
      if (line.trim()) breakdownLines.push(line.trim());
      return;
    }

    if (currentMode === 'ascii') {
      asciiLines.push(line);
      return;
    }

    if (currentMode === 'examples') {
      if (line.trim().startsWith('-')) {
        const content = line.trim().substring(1).trim();
        const pipeIdx = content.indexOf('|');
        if (pipeIdx !== -1) {
          item.examples.push({
            title: content.substring(0, pipeIdx).trim(),
            notes: content.substring(pipeIdx + 1).trim(),
          });
        } else {
          item.examples.push({ title: content, notes: '' });
        }
      }
      return;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.substring(0, colonIdx).trim();
      const val = line.substring(colonIdx + 1).trim();
      if (key === 'freqs') {
        const parsedFreqs = val.split(',').map((n) => parseFloat(n.trim())).filter((n) => !isNaN(n));
        if (parsedFreqs.length > 0) item.freqs = parsedFreqs;
      } else if (key in item) {
        item[key] = val;
      }
    }
  });

  item.breakdown = breakdownLines.join(' ');
  item.ascii = asciiLines.join('\n');
  return item;
};

const DemystifiedGenrePage = () => {
  const [genresIndex, setGenresIndex] = useState([]);
  const [activeGenreId, setActiveGenreId] = useState(null);
  const [activeGenreDetail, setActiveGenreDetail] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [themeMode, setThemeMode] = useState('3'); // Theme 1: Light, 2: Slate, 3: Dark, 4: Matrix
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePlayingId, setActivePlayingId] = useState(null);

  // Audio Refs
  const audioCtxRef = useRef(null);
  const currentAudioRef = useRef(null);

  // Fetch master index (public/demystify/genre/genres.txt or genre.txt)
  useEffect(() => {
    const loadIndex = async () => {
      try {
        let res = await fetch('/demystify/genre/genres.txt');
        if (!res.ok) res = await fetch('/demystify/genre/genre.txt');
        if (!res.ok) res = await fetch('/demystify/genre.txt');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rawText = await res.text();
        const parsed = parseGenresIndex(rawText);
        setGenresIndex(parsed);
      } catch (err) {
        console.error('Failed to load genres index:', err);
      } finally {
        setLoadingIndex(false);
      }
    };
    loadIndex();
  }, []);

  // Fetch individual genre detail file when activeGenreId changes
  useEffect(() => {
    if (!activeGenreId) {
      setActiveGenreDetail(null);
      return;
    }
    const loadDetail = async () => {
      setLoadingDetail(true);
      try {
        const res = await fetch(`/demystify/genre/${activeGenreId}.txt`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const detail = parseGenreDetail(text);
        setActiveGenreDetail(detail);
      } catch (err) {
        console.error(`Failed to load /demystify/genre/${activeGenreId}.txt:`, err);
      } finally {
        setLoadingDetail(false);
      }
    };
    loadDetail();
  }, [activeGenreId]);

  useEffect(() => {
    document.documentElement.setAttribute('data-demystify-theme', themeMode);
    return () => {
      document.documentElement.removeAttribute('data-demystify-theme');
    };
  }, [themeMode]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Web Audio Synth Fallback
  const playRetroTone = (freqs = [220, 330, 440], synthType = 'sawtooth') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = synthType;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6 + idx * 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + 0.7 + idx * 0.1);
      });
    } catch (err) {
      console.warn('Web Audio synthesis error:', err);
    }
  };

  // Play Playable MP3 under public/demystify/genre/
  const playGenreAudio = (genre) => {
    if (!soundEnabled || typeof window === 'undefined') return;

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    const audioUrl = genre.audio || `/demystify/genre/${genre.id}.mp3`;
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;

    audio.play().catch((err) => {
      console.warn(`HTML5 audio play failed for ${audioUrl}, falling back to synth:`, err);
      playRetroTone(genre.freqs || [220, 330, 440], genre.synthType || 'sawtooth');
    });
  };

  const handleSelectGenre = (genreId) => {
    setActiveGenreId(genreId);
  };

  const handlePlayAudio = (genre, e) => {
    if (e) e.stopPropagation();
    setActivePlayingId(genre.id);
    playGenreAudio(genre);
    setTimeout(() => setActivePlayingId(null), 1500);
  };

  const toggleTheme = () => {
    const next = themeMode === '1' ? '2' : themeMode === '2' ? '3' : themeMode === '3' ? '4' : '1';
    setThemeMode(next);
  };

  return (
    <div className="demystify-pcv-root">
      <Seo
        title={activeGenreDetail ? `Demystify / ${activeGenreDetail.name}` : 'Demystify / Genres - The World\'s Best Music Genres'}
        description="A minimal, dynamic curation of the world's best music genres demystified with dedicated genre text files."
        keywords={[
          'demystify genre',
          'p.cv minimalist',
          'world best music genres',
          'grunge',
          'eurodance',
          'shoegaze',
          'trip hop',
          'synthwave',
        ]}
      />

      <div className="pcv-outer-container">
        {/* Minimalist Header */}
        <header className="pcv-header">
          <div>
            <h1 className="pcv-brand">
              {activeGenreDetail ? `DEMYSTIFY / ${activeGenreDetail.name}` : 'DEMYSTIFY / GENRES'}
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
              OFFICIAL CURATION
            </p>
          </div>
          <div className="pcv-subbrand">
            TRUST ME BRO<sup>TM</sup>
          </div>
        </header>

        {/* PAGE VIEW 1: Main Genres Index List */}
        {!activeGenreId && (
          loadingIndex ? (
            <div style={{ padding: '2rem 0', fontFamily: 'monospace' }}>
              LOADING GENRES INDEX FROM /demystify/genre/genres.txt...
            </div>
          ) : (
            <div className="pcv-list">
              {genresIndex.map((genre) => {
                const isPlaying = activePlayingId === genre.id;
                return (
                  <button
                    key={genre.id || genre.rank}
                    className="pcv-row"
                    onClick={() => handleSelectGenre(genre.id)}
                  >
                    <span className="pcv-row-num">{genre.rank}</span>
                    <span className="pcv-row-title">{genre.name}</span>
                    <span className="pcv-row-years">{genre.years}</span>
                    <button
                      className="pcv-btn-audition"
                      disabled={!soundEnabled}
                      onClick={(e) => handlePlayAudio(genre, e)}
                      title={soundEnabled ? 'Play MP3 audio sample' : 'Audio is currently disabled'}
                    >
                      {!soundEnabled ? '[MUTED]' : isPlaying ? '[PLAYING]' : '[► AUDIO MP3]'}
                    </button>
                    <span className="pcv-row-arrow" style={{ marginLeft: '10px' }}>[→ OPEN PAGE]</span>
                  </button>
                );
              })}
            </div>
          )
        )}

        {/* PAGE VIEW 2: Dedicated Full-Page View (Replacing the List View) */}
        {activeGenreId && (
          loadingDetail ? (
            <div style={{ padding: '2rem 0', fontFamily: 'monospace' }}>
              LOADING /demystify/genre/{activeGenreId}.txt...
            </div>
          ) : activeGenreDetail && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Navigation Back Button */}
              <div>
                <button
                  className="pcv-btn-close"
                  onClick={() => setActiveGenreId(null)}
                >
                  [← BACK TO ALL GENRES]
                </button>
              </div>

              {/* Title & Metadata Header */}
              <div style={{ borderBottom: '1px solid var(--pcv-muted)', paddingBottom: '1rem' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--pcv-highlight)' }}>
                  [{activeGenreDetail.rank}] {activeGenreDetail.name}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--pcv-accent)', marginTop: '4px' }}>
                  {`${activeGenreDetail.tag} // ${activeGenreDetail.years} // ${activeGenreDetail.origin}`}
                </div>
              </div>

              {/* Strict Monospace ASCII Waveform Display Box */}
              <div className="pcv-ascii-box">
                {activeGenreDetail.ascii}
              </div>

              {/* Key Metadata Table */}
              <div className="pcv-meta-group">
                <div className="pcv-meta-row">
                  <span className="pcv-meta-label">SONIC SIGNATURE :</span>
                  <span className="pcv-meta-value" style={{ color: 'var(--pcv-accent)' }}>
                    &quot;{activeGenreDetail.signature}&quot;
                  </span>
                </div>
                <div className="pcv-meta-row">
                  <span className="pcv-meta-label">KEY GEAR & HARDWARE:</span>
                  <span className="pcv-meta-value">{activeGenreDetail.keyGear}</span>
                </div>
                <div className="pcv-meta-row">
                  <span className="pcv-meta-label">AUDIO FILE:</span>
                  <span className="pcv-meta-value" style={{ color: 'var(--pcv-accent)' }}>
                    {activeGenreDetail.audio || `/demystify/genre/${activeGenreDetail.id}.mp3`}
                  </span>
                </div>
              </div>

              {/* Demystified Rationale Breakdown */}
              <div className="pcv-breakdown">
                <span style={{ fontWeight: 700, color: 'var(--pcv-accent)', display: 'block', marginBottom: '6px' }}>
                  DEMYSTIFIED RATIONALE & PRODUCTION TECHNIQUES:
                </span>
                {activeGenreDetail.breakdown}
              </div>

              {/* Benchmark Track Examples List */}
              {activeGenreDetail.examples && activeGenreDetail.examples.length > 0 && (
                <div className="pcv-examples-list">
                  <span style={{ fontWeight: 700, color: 'var(--pcv-highlight)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    BENCHMARK TRACK EXAMPLES & PRODUCTION NOTES:
                  </span>
                  {activeGenreDetail.examples.map((ex, idx) => (
                    <div className="pcv-example-item" key={idx}>
                      <div>
                        <div className="pcv-example-title">{ex.title}</div>
                        {ex.notes && <div className="pcv-example-notes">{ex.notes}</div>}
                      </div>
                      <button
                        className="pcv-btn-audition"
                        disabled={!soundEnabled}
                        onClick={(e) => handlePlayAudio(activeGenreDetail, e)}
                        title="Audition audio sample"
                      >
                        {!soundEnabled ? '[MUTED]' : '[► AUDIO MP3]'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Return Control */}
              <div style={{ marginTop: '1rem' }}>
                <button
                  className="pcv-btn-close"
                  onClick={() => setActiveGenreId(null)}
                >
                  [← RETURN TO GENRES INDEX]
                </button>
              </div>
            </div>
          )
        )}

        {/* Minimalist Footer Bar */}
        <footer className="pcv-footer">
          <div>
            <span>DEMYSTIFY / GENRES</span>
            <span style={{ opacity: 0.5, margin: '0 8px' }}>•</span>
            <span>MINIMALIST ARCHIVE</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="pcv-theme-btn" onClick={() => setSoundEnabled(!soundEnabled)}>
              AUDIO [{soundEnabled ? 'ON' : 'OFF'}]
            </button>

            <button className="pcv-theme-btn" onClick={toggleTheme}>
              THEME [{themeMode === '1' ? 'LIGHT' : themeMode === '2' ? 'SLATE' : themeMode === '3' ? 'DARK' : 'MATRIX'}]
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DemystifiedGenrePage;
