import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  copyWordupImage,
  getWordupShareData,
  wordupImageToPng,
} from './wordupShare';

let bitmap;
let drawImage;
let toBlob;
let write;

beforeEach(() => {
  bitmap = { width: 1200, height: 630, close: vi.fn() };
  drawImage = vi.fn();
  toBlob = vi
    .spyOn(HTMLCanvasElement.prototype, 'toBlob')
    .mockImplementation((callback, type) =>
      callback(new Blob(['png pixels'], { type })),
    );
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    drawImage,
  });
  vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(bitmap));
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['existing art'], { type: 'image/webp' }),
    }),
  );
  vi.stubGlobal(
    'ClipboardItem',
    class {
      constructor(data) {
        this.data = data;
      }
    },
  );
  write = vi.fn((items) => items[0].data['image/png'].then(() => undefined));
  vi.stubGlobal('navigator', { clipboard: { write } });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Wordup share metadata', () => {
  it('uses canonical production links and the authored word, independent of the current browser URL', () => {
    window.history.replaceState({}, '', '/wordup?view=index#letter-p');
    expect(
      getWordupShareData({ slug: 'poskurmek', word: 'pöskürmek' }),
    ).toEqual({
      url: 'https://fezcode.com/wordup/poskurmek',
      imageUrl: '/images/og/wordup/poskurmek.webp',
      filename: 'wordup-poskurmek.png',
      title: 'pöskürmek — Wordup',
    });
    expect(getWordupShareData()).toEqual({
      url: 'https://fezcode.com/wordup',
      imageUrl: '/images/og/wordup.webp',
      filename: 'wordup.png',
      title: 'Wordup',
    });
  });

  it('preserves authored image overrides with ogImage taking precedence, including external URLs', () => {
    const word = { slug: 'pufre', word: 'püfre', image: '/images/custom.webp' };
    expect(getWordupShareData(word).imageUrl).toBe('/images/custom.webp');
    expect(
      getWordupShareData({
        ...word,
        ogImage: 'https://images.example.org/art.webp',
      }).imageUrl,
    ).toBe('https://images.example.org/art.webp');
  });
});

describe('copying an existing OG card', () => {
  it('calls clipboard.write immediately with promised PNG data before the fetch resolves', async () => {
    let finishFetch;
    fetch.mockReturnValue(
      new Promise((resolve) => {
        finishFetch = resolve;
      }),
    );
    const copying = copyWordupImage('/images/og/wordup/pufre.webp');
    expect(write).toHaveBeenCalledTimes(1);
    const item = write.mock.calls[0][0][0];
    expect(Object.keys(item.data)).toEqual(['image/png']);
    expect(item.data['image/png']).toBeInstanceOf(Promise);
    finishFetch({
      ok: true,
      blob: async () => new Blob(['webp'], { type: 'image/webp' }),
    });
    const png = await item.data['image/png'];
    expect(png.type).toBe('image/png');
    expect(toBlob.mock.calls[0][1]).toBe('image/png');
    expect(drawImage).toHaveBeenCalledWith(bitmap, 0, 0, 1200, 630);
    await copying;
    expect(bitmap.close).toHaveBeenCalledTimes(1);
  });

  it('reports success only after the clipboard write resolves', async () => {
    let finishWrite;
    write.mockReturnValue(
      new Promise((resolve) => {
        finishWrite = resolve;
      }),
    );
    let succeeded = false;
    const copying = copyWordupImage('/existing.webp').then(() => {
      succeeded = true;
    });
    await write.mock.calls[0][0][0].data['image/png'];
    expect(succeeded).toBe(false);
    finishWrite();
    await copying;
    expect(succeeded).toBe(true);
  });

  it('propagates clipboard refusal instead of reporting a copy', async () => {
    const denied = new DOMException(
      'Clipboard permission denied',
      'NotAllowedError',
    );
    write.mockRejectedValue(denied);
    await expect(copyWordupImage('/existing.webp')).rejects.toBe(denied);
  });

  it('tags unsupported clipboard APIs before loading any asset', async () => {
    vi.stubGlobal('ClipboardItem', undefined);
    await expect(copyWordupImage('/existing.webp')).rejects.toMatchObject({
      code: 'UNSUPPORTED',
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('propagates HTTP and decoder failures', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(wordupImageToPng('/missing.webp')).rejects.toMatchObject({
      code: 'HTTP_ERROR',
      status: 404,
    });
    const decoding = new DOMException('Invalid image bytes', 'EncodingError');
    createImageBitmap.mockRejectedValueOnce(decoding);
    await expect(wordupImageToPng('/broken.webp')).rejects.toBe(decoding);
  });

  it('propagates tainted-canvas errors and releases the decoded bitmap', async () => {
    const security = new DOMException(
      'Canvas is not origin-clean',
      'SecurityError',
    );
    toBlob.mockImplementationOnce(() => {
      throw security;
    });
    await expect(
      wordupImageToPng('https://external.example/art.webp'),
    ).rejects.toBe(security);
    expect(bitmap.close).toHaveBeenCalledTimes(1);
  });

  it('rejects failed PNG conversion even if a browser write promise resolves early', async () => {
    write.mockResolvedValue();
    toBlob.mockImplementationOnce((callback) => callback(null));
    await expect(copyWordupImage('/existing.webp')).rejects.toMatchObject({
      code: 'IMAGE_CONVERSION_FAILED',
    });
  });

  it('decodes through an image element when ImageBitmap is unavailable and revokes its temporary URL', async () => {
    vi.stubGlobal('createImageBitmap', undefined);
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:wordup-art'),
      revokeObjectURL,
    });
    vi.stubGlobal(
      'Image',
      class {
        naturalWidth = 1200;
        naturalHeight = 630;
        decode = vi.fn().mockResolvedValue();
      },
    );
    expect((await wordupImageToPng('/existing.webp')).type).toBe('image/png');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:wordup-art');
  });
});
