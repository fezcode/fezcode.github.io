import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  ArrowDownIcon,
  ArrowsOutIcon,
  XIcon,
  GithubLogoIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react';
import { useAppConfig, AppLoading, AppMissing, AppSeo } from './app-shell';
import './gallery-project.css';

const ART = '/images/projects/atelier/current/';
const SHOTS = [
  {
    name: 'The viewer',
    file: 'viewer.webp',
    caption: 'A photograph, given room to breathe.',
    alt: 'Atelier displaying green leaves against a pastel sky',
  },
  {
    name: 'The vector',
    file: 'vector.webp',
    caption: 'Real vectors. All the way in.',
    alt: 'Atelier rendering the blue Look closer vector study',
  },
  {
    name: 'The material',
    file: 'appearance-controls.webp',
    caption: 'Glass, colour, and a little personal preference.',
    alt: 'Atelier appearance controls for material, tint, glassiness, transparency and colour level',
    portrait: true,
  },
];

function ScreenshotGallery() {
  const [active, setActive] = useState(0);
  const dialog = useRef(null);
  const shot = SHOTS[active];
  const move = (direction) =>
    setActive((value) => (value + direction + SHOTS.length) % SHOTS.length);
  return (
    <section
      className="at-gallery at-wrap"
      id="inside"
      aria-labelledby="at-gallery-heading"
    >
      <div className="at-section-heading">
        <h2 id="at-gallery-heading">
          Less interface.
          <br />
          More image.
        </h2>
        <p>
          A quiet viewer for photographs, vectors, and everything in between.
          Open a file. Follow your curiosity.
        </p>
      </div>
      <div className="at-gallery-bar">
        <div className="at-shot-picker" aria-label="Choose an app screenshot">
          {SHOTS.map((item, index) => (
            <button
              key={item.file}
              type="button"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span aria-hidden="true">0{index + 1}</span> {item.name}
            </button>
          ))}
        </div>
        <span className="at-capture-label">From the actual app</span>
      </div>
      <button
        type="button"
        className={`at-shot-stage ${shot.portrait ? 'at-shot-portrait' : ''}`}
        onClick={() => dialog.current?.showModal()}
        aria-label={`Enlarge ${shot.name.toLowerCase()} screenshot`}
      >
        <img
          src={`${ART}${shot.file}`}
          alt={shot.alt}
          width={shot.portrait ? 400 : 2560}
          height={shot.portrait ? 510 : 1294}
          loading="lazy"
        />
        <span className="at-expand">
          <ArrowsOutIcon size={20} /> View full size
        </span>
      </button>
      <div className="at-shot-caption">
        <p aria-live="polite">{shot.caption}</p>
        <span>Captured on Windows</span>
      </div>
      <dialog
        ref={dialog}
        className="at-lightbox"
        aria-label="Atelier screenshot viewer"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="at-lightbox-inner">
          <div className="at-lightbox-top">
            <p aria-live="polite">{shot.name}</p>
            <button
              type="button"
              onClick={() => dialog.current.close()}
              aria-label="Close screenshot viewer"
            >
              <XIcon size={24} />
            </button>
          </div>
          <img src={`${ART}${shot.file}`} alt={shot.alt} />
          <div className="at-lightbox-bottom">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous screenshot"
            >
              <ArrowLeftIcon size={24} />
            </button>
            <p>
              {active + 1} / {SHOTS.length}
            </p>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next screenshot"
            >
              <ArrowRightIcon size={24} />
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

function VectorStudy() {
  const [zoom, setZoom] = useState(1);
  return (
    <section
      className="at-vector"
      id="detail"
      aria-labelledby="at-detail-heading"
    >
      <div className="at-wrap">
        <div className="at-section-heading">
          <h2 id="at-detail-heading">
            Get unreasonably
            <br />
            close.
          </h2>
          <div>
            <p>
              Atelier renders SVGs as vectors. Curves stay curves, even when you
              zoom past the point of reason.
            </p>
            <p className="at-small">
              Try the principle here: one SVG and a 320px bitmap of the same
              artwork, rendered in your browser.
            </p>
          </div>
        </div>
        <div className="at-zoom-controls">
          <label htmlFor="at-zoom">Explore the detail</label>
          <input
            id="at-zoom"
            type="range"
            min="1"
            max="12"
            step="0.1"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            aria-valuetext={`${Math.round(zoom * 100)} percent`}
          />
          <output htmlFor="at-zoom">{Math.round(zoom * 100)}%</output>
          <button type="button" onClick={() => setZoom(1)}>
            Reset
          </button>
        </div>
        <div className="at-comparison">
          {[
            ['vector-study.svg', 'SVG / vector', false],
            ['vector-study-raster.png', 'PNG / 320 pixels', true],
          ].map(([file, label, raster]) => (
            <figure key={file}>
              <div className="at-zoom-pane">
                <img
                  src={`${ART}${file}`}
                  alt={
                    raster
                      ? 'Bitmap version of the blue study'
                      : 'Crisp vector version of the blue study'
                  }
                  loading="lazy"
                  style={{
                    transform: `scale(${zoom})`,
                    imageRendering: raster ? 'pixelated' : 'auto',
                  }}
                />
              </div>
              <figcaption>
                {label}
                <span>{raster ? 'A finite grid.' : 'An exact curve.'}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryProjectPage() {
  const { cfg, failed, project, loading } = useAppConfig();
  if (loading) return <AppLoading />;
  if (failed || !cfg)
    return <AppMissing background="#e9ebed" color="#242628" />;
  return (
    <div className="at-page">
      <AppSeo cfg={cfg} project={project} />
      <a className="at-skip" href="#inside">
        Skip to the app
      </a>
      <header className="at-nav at-wrap">
        <Link to="/projects" className="at-back">
          <ArrowLeftIcon size={18} /> Fezcodex
        </Link>
        <nav aria-label="Atelier page">
          <a href="#inside">Inside the app</a>
          <a href="#detail">Look closer</a>
          <a href={cfg.repo} target="_blank" rel="noreferrer">
            Source <ArrowUpRightIcon size={15} />
          </a>
        </nav>
        <a
          className="at-nav-download"
          href={cfg.download}
          target="_blank"
          rel="noreferrer"
        >
          Get Atelier <ArrowDownIcon size={16} />
        </a>
      </header>
      <main>
        <section className="at-hero at-wrap" aria-labelledby="at-title">
          <div className="at-hero-meta">
            <span>An image viewer. A small creative studio.</span>
            <span>Windows / v{cfg.version}</span>
          </div>
          <h1 id="at-title">
            atelier<span className="at-title-dot">.</span>
          </h1>
          <div className="at-hero-composition">
            <div className="at-hero-note">
              <span className="at-cross" aria-hidden="true">
                ✳
              </span>
              <p>
                For the way
                <br />
                you see things.
              </p>
              <a href="#inside" aria-label="Explore Atelier">
                <ArrowDownIcon size={22} />
              </a>
            </div>
            <figure className="at-hero-image">
              <img
                src={`${ART}viewer.webp`}
                alt="Atelier’s translucent viewer displaying a sunlit botanical photograph"
                width="2560"
                height="1294"
                fetchPriority="high"
              />
              <figcaption>
                <span>A little space for a different perspective.</span>
                <span>Atelier, in use</span>
              </figcaption>
            </figure>
            <a
              className="at-download-disc"
              href={cfg.download}
              target="_blank"
              rel="noreferrer"
            >
              <ArrowDownIcon size={32} />
              <span>
                Make room
                <br />
                for your images.
              </span>
              <span className="at-disc-label">Download for Windows</span>
            </a>
          </div>
          <div className="at-hero-bottom">
            <p>
              See it.
              <br />
              Shape it.
              <br />
              Keep looking.
            </p>
            <div>
              <p>
                Photographs, vectors, stray ideas. A fast, open-source home for
                all of them—with the tools to take an image a little further.
              </p>
              <a
                className="at-text-link"
                href={cfg.repo}
                target="_blank"
                rel="noreferrer"
              >
                <GithubLogoIcon size={18} /> Made by Fezcode. Open to everyone.
              </a>
            </div>
          </div>
        </section>
        <div
          className="at-format-strip"
          aria-label="Selected supported image formats"
        >
          <span>Many ways to see.</span>
          {['JPEG', 'SVG', 'HEIC', 'AVIF', 'WebP', 'PNG', 'GIF'].map(
            (format) => (
              <span key={format}>{format}</span>
            ),
          )}
        </div>
        <ScreenshotGallery />
        <section
          className="at-studio at-wrap"
          id="tools"
          aria-labelledby="at-studio-heading"
        >
          <div className="at-studio-title">
            <span className="at-section-label">
              When looking becomes making
            </span>
            <h2 id="at-studio-heading">
              A viewer.
              <br />
              With a<br />
              creative side.
            </h2>
            <img
              src={`${ART}icon.webp`}
              alt=""
              width="120"
              height="120"
              loading="lazy"
            />
          </div>
          <div className="at-tool-list">
            <article>
              <span className="at-tool-mark" aria-hidden="true">
                ↗
              </span>
              <div>
                <h3>Make your mark.</h3>
                <p>
                  Open Edit Image for a Paint-style workspace. Pencil, brushes,
                  shapes, text, selections, and an eraser. Crop, resize, rotate,
                  and undo until it feels right.
                </p>
                <span className="at-tool-detail">
                  Nine brushes, from calligraphy to watercolour
                </span>
              </div>
            </article>
            <article>
              <span className="at-tool-mark" aria-hidden="true">
                ◐
              </span>
              <div>
                <h3>Find the right feeling.</h3>
                <p>
                  Adjust brightness, contrast, saturation, hue, and blur. Try a
                  filter. Your adjustments stay in the workspace until you save.
                </p>
                <span className="at-tool-detail">
                  Small adjustments. A different atmosphere.
                </span>
              </div>
            </article>
            <article>
              <span className="at-tool-mark" aria-hidden="true">
                ⌘
              </span>
              <div>
                <h3>Keep your hands moving.</h3>
                <p>
                  Arrow through a folder in Explorer order. Rotate with R. Copy
                  an image as pixels, a file, and a path in one go. Stay in the
                  flow.
                </p>
                <span className="at-tool-detail">
                  <kbd>←</kbd>
                  <kbd>→</kbd>
                  <kbd>R</kbd>
                  <kbd>Ctrl C</kbd>
                </span>
              </div>
            </article>
          </div>
        </section>
        <VectorStudy />
        <section
          className="at-material at-wrap"
          aria-labelledby="at-material-heading"
        >
          <div className="at-material-art">
            <span className="at-material-orbit" aria-hidden="true" />
            <img
              src={`${ART}appearance-controls.webp`}
              alt="The actual Atelier appearance panel with material and colour controls"
              width="400"
              height="510"
              loading="lazy"
            />
          </div>
          <div className="at-material-copy">
            <span className="at-section-label">
              A window with a point of view
            </span>
            <h2 id="at-material-heading">
              Your light.
              <br />
              Your glass.
              <br />
              Your Atelier.
            </h2>
            <p>
              Mica, acrylic, blur, or a solid surface. Tune the tint,
              transparency, and edge light to make a space that feels like
              yours.
            </p>
            <p>The image stays the main event.</p>
            <div className="at-material-swatches" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </section>
        <section
          className="at-details at-wrap"
          aria-label="Image information and export"
        >
          <article>
            <span className="at-section-label">Beyond the pixels</span>
            <h2>
              Every image
              <br />
              has a story.
            </h2>
            <p>
              Explore EXIF and C2PA Content Credentials: the camera, the capture
              settings, the declared creator, and the edits along the way.
            </p>
            <p className="at-small">
              Atelier displays content credentials; it does not verify their
              signatures.
            </p>
            <p>
              Sharing a clean copy? Remove metadata while keeping the colour
              profile and orientation. JPEG, PNG, and WebP can be cleaned
              without re-encoding their pixels.
            </p>
          </article>
          <article className="at-export">
            <span className="at-section-label">Take it somewhere new</span>
            <div className="at-export-number">
              30<span>+</span>
            </div>
            <h2>Ways to save.</h2>
            <p>
              From everyday JPEG and PNG to AVIF, JPEG XL, TIFF, PSD, and
              OpenEXR. Choose the format your next step needs.
            </p>
            <a
              href={cfg.repo}
              target="_blank"
              rel="noreferrer"
              className="at-text-link"
            >
              Explore the full format list <ArrowUpRightIcon size={18} />
            </a>
          </article>
        </section>
        <section className="at-shortcuts at-wrap">
          <details>
            <summary>
              <span>Less clicking. More looking.</span>
              <span>
                Keyboard shortcuts{' '}
                <span className="at-plus" aria-hidden="true">
                  +
                </span>
              </span>
            </summary>
            <div className="at-key-grid">
              {(cfg.keys || []).map((item) => (
                <div key={item.a}>
                  <span>{item.a}</span>
                  <span>
                    {item.k.map((key) => (
                      <kbd key={key}>{key}</kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </details>
          <div className="at-companions">
            <p>Better company for your desktop.</p>
            <Link to="/projects/hisashi">
              Hisashi <span>Menus above the window</span>
              <ArrowUpRightIcon size={20} />
            </Link>
            <Link to="/projects/airlift">
              Airlift <span>Install and keep up to date</span>
              <ArrowUpRightIcon size={20} />
            </Link>
          </div>
        </section>
        <section className="at-finale">
          <div className="at-wrap">
            <div className="at-finale-top">
              <span>A different way of looking.</span>
              <span>Free & open source / MIT</span>
            </div>
            <h2>Make space.</h2>
            <div className="at-finale-bottom">
              <p>
                Your next favourite image
                <br />
                is already in a folder somewhere.
              </p>
              <a href={cfg.download} target="_blank" rel="noreferrer">
                Get Atelier <ArrowUpRightIcon size={32} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="at-footer at-wrap">
        <Link to="/projects">
          <ArrowLeftIcon size={16} /> Back to projects
        </Link>
        <span>Atelier {cfg.version} / Made by Fezcode</span>
        <a href={cfg.repo} target="_blank" rel="noreferrer">
          View source <GithubLogoIcon size={17} />
        </a>
      </footer>
    </div>
  );
}
export default GalleryProjectPage;
