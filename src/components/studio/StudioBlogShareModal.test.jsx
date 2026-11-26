import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import StudioBlogShareModal from './StudioBlogShareModal';

const copyImage = vi.hoisted(() => vi.fn());
vi.mock('../../pages/wordup/wordupShare', () => ({
  copyWordupImage: copyImage,
}));

describe('Studio blog sharing', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
    };
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(), write: vi.fn() },
    });
    vi.stubGlobal('ClipboardItem', class ClipboardItem {});
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const open = () => {
    render(
      <MemoryRouter initialEntries={['/blog/series/example/episode']}>
        <StudioBlogShareModal title="A good thought" />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Share', exact: true }));
  };

  it('shares the episode in Studio, supports another theme, and restores focus on close', async () => {
    open();
    expect(
      screen.getByRole('dialog', { name: 'Pass a good thought along.' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Studio')).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://fezcode.com/blog/series/example/episode?fezTheme=studio&fezBlogMode=standard',
      ),
    );
    expect(await screen.findByText('Link copied.')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Luxe'));
    expect(screen.getByRole('textbox').value).toContain('fezTheme=luxe');
    fireEvent.click(screen.getByRole('button', { name: 'Close', exact: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Share', exact: true }),
    ).toHaveFocus();
  });

  it('keeps a usable link when the card or clipboard is unavailable', async () => {
    open();
    fireEvent.error(screen.getByAltText('Share card for A good thought'));
    expect(
      screen.getByRole('button', { name: 'Copy share card' }),
    ).toBeDisabled();
    navigator.clipboard.writeText.mockRejectedValue(
      new Error('Permission denied'),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    expect(
      await screen.findByText('Select the link above and copy it.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveFocus();
    expect(screen.getByRole('textbox').value).toContain('fezTheme=studio');
  });
});
