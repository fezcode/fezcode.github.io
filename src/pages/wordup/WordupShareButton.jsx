import React, { useEffect, useId, useRef, useState } from 'react';
import {
  ShareNetworkIcon,
  XIcon,
  LinkSimpleIcon,
  ImageSquareIcon,
  CopyIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react';
import { getWordupCopy } from './wordupCopy';
import { copyWordupImage, getWordupShareData } from './wordupShare';
import { useWordupActivity } from './WordupActivityContext';

export default function WordupShareButton({ word, language = 'en' }) {
  const copy = getWordupCopy(language).share;
  const data = getWordupShareData(word);
  const { acquirePause } = useWordupActivity();
  const id = useId();
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const urlRef = useRef(null);
  const operation = useRef(0);
  const releasePause = useRef(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [imageState, setImageState] = useState('loading');
  const canCopyImage =
    typeof window !== 'undefined' &&
    Boolean(navigator.clipboard?.write && window.ClipboardItem);

  const close = () => {
    releasePause.current?.();
    releasePause.current = null;
    operation.current += 1;
    setOpen(false);
    setBusy('');
    setFeedback(null);
    if (triggerRef.current?.isConnected)
      triggerRef.current.focus({ preventScroll: true });
  };

  useEffect(
    () => () => {
      releasePause.current?.();
      releasePause.current = null;
    },
    [],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
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

  const copyLink = async () => {
    const action = ++operation.current;
    setFeedback(null);
    if (!navigator.clipboard?.writeText) {
      urlRef.current?.focus();
      urlRef.current?.select();
      setFeedback({ error: true, text: copy.linkManual });
      return;
    }
    setBusy('link');
    try {
      await navigator.clipboard.writeText(data.url);
      if (action === operation.current) setFeedback({ text: copy.linkCopied });
    } catch {
      if (action === operation.current) {
        urlRef.current?.focus();
        urlRef.current?.select();
        setFeedback({ error: true, text: copy.linkManual });
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
      await copyWordupImage(data.imageUrl);
      if (action === operation.current) setFeedback({ text: copy.imageCopied });
    } catch (error) {
      if (action === operation.current)
        setFeedback({
          error: true,
          text:
            error.code === 'UNSUPPORTED'
              ? copy.imageUnsupported
              : copy.imageFailed,
        });
    } finally {
      if (action === operation.current) setBusy('');
    }
  };

  return (
    <>
      <button
        className="wf-share-trigger"
        type="button"
        ref={triggerRef}
        aria-haspopup="dialog"
        onClick={() => {
          releasePause.current ||= acquirePause();
          setFeedback(null);
          setBusy('');
          setImageState('loading');
          setOpen(true);
        }}
      >
        <ShareNetworkIcon size={17} aria-hidden="true" />
        <span>{copy.trigger}</span>
      </button>
      <dialog
        ref={dialogRef}
        className="wf-share-dialog"
        aria-labelledby={id + '-title'}
        aria-describedby={id + '-description'}
        onCancel={close}
        onClose={close}
      >
        {open && (
          <div className="wf-share-panel">
            <header className="wf-share-heading">
              <div>
                <h2 id={id + '-title'}>
                  {word ? copy.wordTitle : copy.collectionTitle}
                </h2>
                <p id={id + '-description'}>{copy.description}</p>
              </div>
              <button
                className="wf-share-close"
                type="button"
                ref={closeRef}
                aria-label={copy.close}
                onClick={close}
              >
                <XIcon size={20} aria-hidden="true" />
              </button>
            </header>
            <div
              className="wf-share-preview"
              aria-busy={imageState === 'loading'}
            >
              {imageState !== 'error' ? (
                <img
                  src={data.imageUrl}
                  alt={copy.imageAlt(data.title)}
                  width="1200"
                  height="630"
                  onLoad={() => setImageState('ready')}
                  onError={() => setImageState('error')}
                />
              ) : (
                <p>{copy.imageUnavailable}</p>
              )}
            </div>
            <label className="wf-share-url" htmlFor={id + '-url'}>
              <span className="wf-sr-only">{copy.linkLabel}</span>
              <LinkSimpleIcon size={16} aria-hidden="true" />
              <input
                id={id + '-url'}
                ref={urlRef}
                value={data.url}
                readOnly
                onFocus={(event) => event.currentTarget.select()}
              />
            </label>
            <div className="wf-share-actions">
              <button type="button" disabled={Boolean(busy)} onClick={copyLink}>
                <LinkSimpleIcon size={22} aria-hidden="true" />
                <span>{busy === 'link' ? copy.copying : copy.copyLink}</span>
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
                <span>{busy === 'image' ? copy.copying : copy.copyImage}</span>
                <CopyIcon size={17} aria-hidden="true" />
              </button>
            </div>
            {!canCopyImage && imageState !== 'error' && (
              <p className="wf-share-help">{copy.imageUnsupported}</p>
            )}
            <div
              className={
                'wf-share-feedback' + (feedback?.error ? ' is-error' : '')
              }
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {feedback?.text || ''}
            </div>
            {imageState !== 'error' && (
              <a
                className="wf-share-download"
                href={data.imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadSimpleIcon size={16} aria-hidden="true" />
                {copy.download}
              </a>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
