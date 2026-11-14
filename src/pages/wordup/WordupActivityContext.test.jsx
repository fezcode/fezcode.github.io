import React, { useRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import {
  WordupActivityProvider,
  useWordupActivity,
} from './WordupActivityContext';

function OverlayControls() {
  const { paused, acquirePause } = useWordupActivity();
  const shareRelease = useRef(null);
  const detailsRelease = useRef(null);
  return (
    <>
      <p role="status">{paused ? 'Playback paused' : 'Playback active'}</p>
      <button
        type="button"
        onClick={() => {
          shareRelease.current = acquirePause();
        }}
      >
        Open share
      </button>
      <button type="button" onClick={() => shareRelease.current?.()}>
        Close share
      </button>
      <button
        type="button"
        onClick={() => {
          detailsRelease.current = acquirePause();
        }}
      >
        Open details
      </button>
      <button type="button" onClick={() => detailsRelease.current?.()}>
        Close details
      </button>
      <button
        type="button"
        onClick={() => {
          shareRelease.current = acquirePause();
          detailsRelease.current = acquirePause();
        }}
      >
        Open both overlays
      </button>
    </>
  );
}

const activity = (paused = false) => (
  <WordupActivityProvider paused={paused}>
    <OverlayControls />
  </WordupActivityProvider>
);

afterEach(cleanup);

describe('Wordup overlay pause ownership', () => {
  it('keeps playback paused until every overlapping overlay closes', async () => {
    render(activity());
    expect(screen.getByRole('status')).toHaveTextContent('Playback active');
    await userEvent.click(screen.getByRole('button', { name: 'Open share' }));
    expect(screen.getByRole('status')).toHaveTextContent('Playback paused');
    await userEvent.click(screen.getByRole('button', { name: 'Open details' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close share' }));
    expect(screen.getByRole('status')).toHaveTextContent('Playback paused');
    await userEvent.click(
      screen.getByRole('button', { name: 'Close details' }),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Playback active');
  });

  it('supports batched acquisitions and ignores repeated release of the same lease', async () => {
    render(activity());
    await userEvent.click(
      screen.getByRole('button', { name: 'Open both overlays' }),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Playback paused');
    await userEvent.click(screen.getByRole('button', { name: 'Close share' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close share' }));
    expect(screen.getByRole('status')).toHaveTextContent('Playback paused');
    await userEvent.click(
      screen.getByRole('button', { name: 'Close details' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Close details' }),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Playback active');
  });

  it('combines an external pause with overlay ownership in either release order', async () => {
    const view = render(activity(true));
    expect(screen.getByRole('status')).toHaveTextContent('Playback paused');
    await userEvent.click(screen.getByRole('button', { name: 'Open share' }));
    view.rerender(activity(false));
    expect(screen.getByRole('status')).toHaveTextContent('Playback paused');
    await userEvent.click(screen.getByRole('button', { name: 'Close share' }));
    expect(screen.getByRole('status')).toHaveTextContent('Playback active');

    view.rerender(activity(true));
    await userEvent.click(screen.getByRole('button', { name: 'Open details' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Close details' }),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Playback paused');
    view.rerender(activity(false));
    expect(screen.getByRole('status')).toHaveTextContent('Playback active');
  });
});
