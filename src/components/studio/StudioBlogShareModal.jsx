import React, { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ShareNetworkIcon,
  XIcon,
  LinkSimpleIcon,
  ImageSquareIcon,
  CopyIcon,
  DownloadSimpleIcon,
  PaperPlaneTiltIcon,
} from '@phosphor-icons/react';
import { SITE_THEMES } from '../../utils/siteThemes';
import { getBlogShareImage, getBlogShareUrl } from '../../utils/blogShare';
import { copyWordupImage } from '../../pages/wordup/wordupShare';
import '../../styles/StudioShare.css';

const THEME_LABELS = {
  brutalist: 'Brutalist',
  luxe: 'Luxe',
};

/**
 * Share a blog post: its share card, a link, and the theme the link opens in.
 * `tone` picks the dialog's palette so it sits well on dark or light readers;
 * `className` styles the trigger to match each reader view.
 */
export default function StudioBlogShareModal({
  title,
  image,
  className = '',
  label = 'Share',
  iconSize = 16,
}) {
  const location = useLocation();
  const id = useId();
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const urlRef = useRef(null);
  const operation = useRef(0);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('studio');
  const [busy, setBusy] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [imageState, setImageState] = useState('loading');

  const url = getBlogShareUrl(location.pathname, theme);
  const imageUrl = getBlogShareImage(location.pathname, image);
  const canCopyImage =
    typeof window !== 'undefined' &&
    Boolean(navigator.clipboard?.write && window.ClipboardItem);
  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const close = () => {
    operation.current += 1;
    setOpen(false);
    setBusy('');
    setFeedback(null);
    if (triggerRef.current?.isConnected)
      triggerRef.current.focus({ preventScroll: true });
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (!open) {
      if (dialog.open) dialog.close();
      return undefined;
    }
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let backdropStart = false;
    const onPointerDown = (event) => {
      backdropStart = event.target === dialog;
    };
    const onBackdropClick = (event) => {
      if (event.target === dialog && backdropStart) dialog.close();
      backdropStart = false;
    };
    dialog.addEventListener('pointerdown', onPointerDown);
    dialog.addEventListener('click', onBackdropClick);
    return () => {
      operation.current += 1;
      document.body.style.overflow = previousOverflow;
      dialog.removeEventListener('pointerdown', onPointerDown);
      dialog.removeEventListener('click', onBackdropClick);
      if (dialog.open) dialog.close();
    };
  }, [open]);

  const selectUrlField = () => {
    urlRef.current?.focus();
    urlRef.current?.select();
  };

  const copyLink = async () => {
    const action = ++operation.current;
    setFeedback(null);
    if (!navigator.clipboard?.writeText) {
      selectUrlField();
      setFeedback({ error: true, text: 'Select the link above and copy it.' });
      return;
    }
    setBusy('link');
    try {
      await navigator.clipboard.writeText(url);
      if (action === operation.current) setFeedback({ text: 'Link copied.' });
    } catch {
      if (action === operation.current) {
        selectUrlField();
        setFeedback({
          error: true,
          text: 'Select the link above and copy it.',
        });
      }
    } finally {
      if (action === operation.current) setBusy('');
    }
  };

  const copyImage = async () => {
    const action = ++operation.current;
    setFeedback(null);
    setBusy('image');
    try {
      // No await before this call: browsers require the click's activation.
      await copyWordupImage(imageUrl);
      if (action === operation.current)
        setFeedback({ text: 'Share card copied.' });
    } catch (error) {
      if (action === operation.current)
        setFeedback({
          error: true,
          text:
            error.code === 'UNSUPPORTED'
              ? 'This browser can’t copy images. Download the card instead.'
              : 'The card couldn’t be copied. Download it instead.',
        });
    } finally {
      if (action === operation.current) setBusy('');
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // Dismissed share sheets reject; nothing to report.
    }
  };

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={className || 'std-share-trigger'}
        aria-haspopup="dialog"
        onClick={() => {
          setFeedback(null);
          setBusy('');
          setImageState('loading');
          setOpen(true);
        }}
      >
        <ShareNetworkIcon size={iconSize} aria-hidden="true" />
        <span>{label}</span>
      </button>
      <dialog
        ref={dialogRef}
        className="std-share-dialog std-share-tone-light"
        aria-labelledby={id + '-title'}
        aria-describedby={id + '-description'}
        onCancel={close}
        onClose={close}
      >
        {open && (
          <div className="std-share-panel">
            <header className="std-share-heading">
              <div>
                <h2 id={id + '-title'}>Pass a good thought along.</h2>
                <p id={id + '-description'}>
                  A story worth sharing. Send a link, save the card, or choose a
                  different look for your reader.
                </p>
              </div>
              <button
                className="std-share-close"
                type="button"
                ref={closeRef}
                aria-label="Close"
                onClick={close}
              >
                <XIcon size={20} aria-hidden="true" />
              </button>
            </header>

            <div
              className="std-share-preview"
              aria-busy={imageState === 'loading'}
            >
              {imageState !== 'error' ? (
                <img
                  src={imageUrl}
                  alt={`Share card for ${title}`}
                  width="1200"
                  height="630"
                  onLoad={() => setImageState('ready')}
                  onError={() => setImageState('error')}
                />
              ) : (
                <p>The share card isn’t available yet. The link still works.</p>
              )}
            </div>

            <fieldset className="std-share-themes">
              <legend>Opens in</legend>
              <div className="std-share-theme-list">
                <label className="std-share-theme">
                  <input
                    type="radio"
                    name={id + '-theme'}
                    value=""
                    checked={theme === ''}
                    onChange={() => setTheme('')}
                  />
                  <span
                    className="std-share-swatch std-share-swatch-any"
                    aria-hidden="true"
                  />
                  <span className="std-share-theme-name">Their own</span>
                </label>
                {SITE_THEMES.map((option) => (
                  <label key={option.id} className="std-share-theme">
                    <input
                      type="radio"
                      name={id + '-theme'}
                      value={option.id}
                      checked={theme === option.id}
                      onChange={() => setTheme(option.id)}
                    />
                    <span
                      className="std-share-swatch"
                      aria-hidden="true"
                      style={{
                        background: `linear-gradient(135deg, ${option.background} 0 55%, ${option.accent} 55% 100%)`,
                      }}
                    />
                    <span className="std-share-theme-name">
                      {THEME_LABELS[option.id] || option.name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="std-share-url" htmlFor={id + '-url'}>
              <span className="std-share-sr-only">Link to share</span>
              <LinkSimpleIcon size={16} aria-hidden="true" />
              <input
                id={id + '-url'}
                ref={urlRef}
                value={url}
                readOnly
                onFocus={(event) => event.currentTarget.select()}
              />
            </label>

            <div className="std-share-actions">
              <button type="button" disabled={Boolean(busy)} onClick={copyLink}>
                <LinkSimpleIcon size={22} aria-hidden="true" />
                <span>{busy === 'link' ? 'Copying…' : 'Copy link'}</span>
                <CopyIcon size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={
                  Boolean(busy) || !canCopyImage || imageState === 'error'
                }
                onClick={copyImage}
              >
                <ImageSquareIcon size={22} aria-hidden="true" />
                <span>{busy === 'image' ? 'Copying…' : 'Copy share card'}</span>
                <CopyIcon size={17} aria-hidden="true" />
              </button>
              {canNativeShare && (
                <button type="button" onClick={nativeShare}>
                  <PaperPlaneTiltIcon size={22} aria-hidden="true" />
                  <span>Share with an app</span>
                  <ShareNetworkIcon size={17} aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              className={
                'std-share-feedback' + (feedback?.error ? ' is-error' : '')
              }
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {feedback?.text || ''}
            </div>
            {imageState !== 'error' && (
              <a
                className="std-share-download"
                href={imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadSimpleIcon size={16} aria-hidden="true" />
                Download the card
              </a>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
