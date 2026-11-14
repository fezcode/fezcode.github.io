const SITE = 'https://fezcode.com';
const PNG = 'image/png';

const shareError = (message, code) =>
  Object.assign(new Error(message), { code });

export function getWordupShareData(word) {
  const slug = word?.slug ? encodeURIComponent(String(word.slug)) : '';
  return {
    url: SITE + '/wordup' + (slug ? '/' + slug : ''),
    imageUrl:
      word?.ogImage ||
      word?.image ||
      (slug ? `/images/og/wordup/${slug}.webp` : '/images/og/wordup.webp'),
    filename: slug ? `wordup-${slug}.png` : 'wordup.png',
    title: word?.word ? `${word.word} — Wordup` : 'Wordup',
  };
}

async function decodeImage(blob) {
  if (typeof createImageBitmap === 'function') {
    const image = await createImageBitmap(blob);
    return {
      image,
      width: image.width,
      height: image.height,
      release: () => image.close(),
    };
  }
  if (
    typeof Image !== 'function' ||
    typeof URL.createObjectURL !== 'function'
  ) {
    throw shareError(
      'Image decoding is unavailable in this browser.',
      'UNSUPPORTED',
    );
  }
  const url = URL.createObjectURL(blob);
  const image = new Image();
  try {
    if (typeof image.decode === 'function') {
      image.src = url;
      await image.decode();
    } else {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () =>
          reject(
            shareError(
              'The share image could not be decoded.',
              'IMAGE_DECODE_FAILED',
            ),
          );
        image.src = url;
      });
    }
    return {
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

/** Convert the existing OG asset's pixels to PNG; never regenerate its art. */
export async function wordupImageToPng(sourceUrl) {
  const response = await fetch(sourceUrl, { mode: 'cors' });
  if (!response.ok) {
    throw Object.assign(
      shareError(
        `The share image could not be loaded (${response.status}).`,
        'HTTP_ERROR',
      ),
      { status: response.status },
    );
  }
  const decoded = await decodeImage(await response.blob());
  try {
    if (!(decoded.width > 0 && decoded.height > 0)) {
      throw shareError(
        'The share image has no usable dimensions.',
        'IMAGE_DECODE_FAILED',
      );
    }
    const canvas = document.createElement('canvas');
    canvas.width = decoded.width;
    canvas.height = decoded.height;
    const context = canvas.getContext('2d');
    if (!context || typeof canvas.toBlob !== 'function') {
      throw shareError(
        'PNG conversion is unavailable in this browser.',
        'UNSUPPORTED',
      );
    }
    context.drawImage(decoded.image, 0, 0, decoded.width, decoded.height);
    return await new Promise((resolve, reject) => {
      // A tainted canvas can throw synchronously; Promise propagates that
      // SecurityError unchanged so the UI can offer its download fallback.
      canvas.toBlob((blob) => {
        if (!blob || blob.type !== PNG) {
          reject(
            shareError(
              'The share image could not be converted to PNG.',
              'IMAGE_CONVERSION_FAILED',
            ),
          );
          return;
        }
        resolve(blob);
      }, PNG);
    });
  } finally {
    decoded.release();
  }
}

/** Call directly from the click handler: do not await before clipboard.write. */
export function copyWordupImage(sourceUrl) {
  if (
    typeof ClipboardItem !== 'function' ||
    typeof navigator === 'undefined' ||
    typeof navigator.clipboard?.write !== 'function' ||
    (typeof ClipboardItem.supports === 'function' &&
      !ClipboardItem.supports(PNG))
  ) {
    return Promise.reject(
      shareError(
        'Image clipboard copying is unavailable in this browser.',
        'UNSUPPORTED',
      ),
    );
  }
  const png = wordupImageToPng(sourceUrl);
  // Handle conversion rejection even if the browser refuses the write before
  // reading its item. The original promise still rejects for ClipboardItem.
  png.catch(() => {});
  try {
    // Promise-valued data keeps Safari's transient user activation intact.
    // https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/ClipboardItem
    const item = new ClipboardItem({ [PNG]: png });
    const write = navigator.clipboard.write([item]);
    return Promise.all([write, png]).then(() => undefined);
  } catch (error) {
    return Promise.reject(error);
  }
}
