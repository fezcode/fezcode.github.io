import React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import WordupShareButton from './WordupShareButton';
import { copyWordupImage } from './wordupShare';
import {
  WordupActivityProvider,
  useWordupActivity,
} from './WordupActivityContext';

vi.mock('./wordupShare', async (importOriginal) => ({
  ...(await importOriginal()),
  copyWordupImage: vi.fn(),
}));

const word = { slug: 'poskurmek', word: 'pöskürmek' };
const authoredWord = {
  ...word,
  ogImage: '/images/authored/share.webp',
  image: '/images/authored/cover.webp',
};
const dialogPrototype = HTMLDialogElement.prototype;
const originalShowModal = Object.getOwnPropertyDescriptor(
  dialogPrototype,
  'showModal',
);
const originalClose = Object.getOwnPropertyDescriptor(dialogPrototype, 'close');
const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  'clipboard',
);
let clipboard;

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};

const showShare = (props = {}) =>
  render(
    <MemoryRouter>
      <WordupShareButton {...props} />
    </MemoryRouter>,
  );

const openShare = async (props = {}, name = 'Share') => {
  showShare(props);
  const trigger = screen.getByRole('button', { name, exact: true });
  await userEvent.click(trigger);
  return { trigger, dialog: screen.getByRole('dialog') };
};

function ActivityProbe() {
  const { paused } = useWordupActivity();
  return <p>{paused ? 'Sculpture paused' : 'Sculpture active'}</p>;
}

beforeEach(() => {
  // jsdom does not implement the native dialog lifecycle. Keep those browser
  // boundaries small; the component's own open/cancel/close handlers stay real.
  Object.defineProperty(dialogPrototype, 'showModal', {
    configurable: true,
    value: vi.fn(function () {
      this.setAttribute('open', '');
    }),
  });
  Object.defineProperty(dialogPrototype, 'close', {
    configurable: true,
    value: vi.fn(function () {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    }),
  });
  clipboard = {
    writeText: vi.fn().mockResolvedValue(undefined),
    write: vi.fn().mockResolvedValue(undefined),
  };
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  });
  vi.stubGlobal(
    'ClipboardItem',
    class {
      static supports = () => true;
    },
  );
  vi.mocked(copyWordupImage).mockReset();
  vi.mocked(copyWordupImage).mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  for (const [name, descriptor] of [
    ['showModal', originalShowModal],
    ['close', originalClose],
  ]) {
    if (descriptor) Object.defineProperty(dialogPrototype, name, descriptor);
    else delete dialogPrototype[name];
  }
  if (originalClipboard)
    Object.defineProperty(navigator, 'clipboard', originalClipboard);
  else delete navigator.clipboard;
});

describe('Wordup share dialog', () => {
  it('pauses sibling artwork while open and releases it on close, cancel, or unmount', async () => {
    const stage = (showButton = true) => (
      <MemoryRouter>
        <WordupActivityProvider>
          {showButton && <WordupShareButton />}
          <ActivityProbe />
        </WordupActivityProvider>
      </MemoryRouter>
    );
    const view = render(stage());
    expect(screen.getByText('Sculpture active')).toBeVisible();
    await userEvent.click(
      screen.getByRole('button', { name: 'Share', exact: true }),
    );
    expect(screen.getByText('Sculpture paused')).toBeVisible();
    fireEvent(
      screen.getByRole('dialog'),
      new Event('cancel', { cancelable: true }),
    );
    expect(screen.getByText('Sculpture active')).toBeVisible();
    await userEvent.click(
      screen.getByRole('button', { name: 'Share', exact: true }),
    );
    expect(screen.getByText('Sculpture paused')).toBeVisible();
    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' }),
    );
    expect(screen.getByText('Sculpture active')).toBeVisible();
    await userEvent.click(
      screen.getByRole('button', { name: 'Share', exact: true }),
    );
    expect(screen.getByText('Sculpture paused')).toBeVisible();
    view.rerender(stage(false));
    expect(screen.getByText('Sculpture active')).toBeVisible();
  });

  it('opens a labelled dialog and returns focus to its trigger on close', async () => {
    const { dialog, trigger } = await openShare({ word });
    expect(dialog).toHaveAccessibleName('Share this word');
    expect(
      within(dialog).getByRole('heading', {
        name: 'Share this word',
        level: 2,
      }),
    ).toBeVisible();
    expect(dialog).toHaveAttribute('open');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(within(dialog).getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Close' }),
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('closes on the native cancel event used by Escape', async () => {
    const { dialog, trigger } = await openShare();
    expect(dialog).toHaveAccessibleName('Share Wordup');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('keeps inside clicks open and dismisses a click outside the panel', async () => {
    const { dialog } = await openShare();
    const heading = within(dialog).getByRole('heading', {
      name: 'Share Wordup',
    });
    fireEvent.click(heading);
    expect(dialog).toBeVisible();
    fireEvent.pointerDown(heading);
    fireEvent.click(dialog);
    expect(dialog).toBeVisible();
    fireEvent.pointerDown(dialog, { clientX: 5, clientY: 5 });
    fireEvent.click(dialog, { clientX: 5, clientY: 5 });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('copies the canonical word link and announces success only after the clipboard resolves', async () => {
    const result = deferred();
    clipboard.writeText.mockReturnValue(result.promise);
    const { dialog } = await openShare({ word });
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Copy link' }),
    );
    expect(clipboard.writeText).toHaveBeenCalledWith(
      'https://fezcode.com/wordup/poskurmek',
    );
    expect(within(dialog).getByRole('status')).not.toHaveTextContent(/copied/i);
    await act(async () => result.resolve());
    await waitFor(() =>
      expect(within(dialog).getByRole('status')).toHaveTextContent(/copied/i),
    );
  });

  it('copies the existing authored card and waits for image-copy success', async () => {
    const result = deferred();
    vi.mocked(copyWordupImage).mockReturnValue(result.promise);
    const { dialog } = await openShare({ word: authoredWord });
    expect(within(dialog).getByRole('img')).toHaveAttribute(
      'src',
      '/images/authored/share.webp',
    );
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Copy card as image' }),
    );
    expect(copyWordupImage).toHaveBeenCalledWith('/images/authored/share.webp');
    expect(within(dialog).getByRole('status')).not.toHaveTextContent(/copied/i);
    await act(async () => result.resolve());
    await waitFor(() =>
      expect(within(dialog).getByRole('status')).toHaveTextContent(/copied/i),
    );
  });

  it('offers the download fallback when image copying is rejected', async () => {
    const result = deferred();
    vi.mocked(copyWordupImage).mockReturnValue(result.promise);
    const { dialog } = await openShare({ word });
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Copy card as image' }),
    );
    await act(async () =>
      result.reject(
        new DOMException('Clipboard access denied', 'NotAllowedError'),
      ),
    );
    await waitFor(() =>
      expect(within(dialog).getByRole('status')).toHaveTextContent(/download/i),
    );
    expect(within(dialog).getByRole('status')).not.toHaveTextContent(
      /^Card copied/,
    );
    expect(
      within(dialog).getByRole('link', { name: 'Download card' }),
    ).toHaveAttribute('href', '/images/og/wordup/poskurmek.webp');
    expect(
      within(dialog).getByRole('button', { name: 'Copy link' }),
    ).toBeEnabled();
  });

  it('localizes Turkish entry actions and dismissal', async () => {
    const { dialog, trigger } = await openShare(
      { word, language: 'tr' },
      'Paylaş',
    );
    expect(dialog).toHaveAccessibleName('Bu kelimeyi paylaş');
    expect(
      within(dialog).getByRole('button', { name: 'Linki kopyala' }),
    ).toBeVisible();
    expect(
      within(dialog).getByRole('button', {
        name: 'Kartı resim olarak kopyala',
      }),
    ).toBeVisible();
    expect(
      within(dialog).getByRole('link', { name: 'Kartı indir' }),
    ).toBeVisible();
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Kapat' }),
    );
    expect(trigger).toHaveFocus();
  });

  it('keeps canonical link copying available when the preview fails', async () => {
    const result = deferred();
    clipboard.writeText.mockReturnValue(result.promise);
    const { dialog } = await openShare();
    fireEvent.error(within(dialog).getByRole('img'));
    const copy = within(dialog).getByRole('button', { name: 'Copy link' });
    expect(copy).toBeEnabled();
    await userEvent.click(copy);
    expect(clipboard.writeText).toHaveBeenCalledWith(
      'https://fezcode.com/wordup',
    );
    await act(async () => result.resolve());
    await waitFor(() =>
      expect(within(dialog).getByRole('status')).toHaveTextContent(/copied/i),
    );
  });
});
