import { describe, expect, it } from 'vitest';
import { getBlogShareImage, getBlogShareUrl } from './blogShare';

describe('getBlogShareUrl', () => {
  it('links to the post on the live site without a theme', () => {
    expect(getBlogShareUrl('/blog/when-pink-was-for-boys', '')).toBe(
      'https://fezcode.com/blog/when-pink-was-for-boys',
    );
  });

  it('carries the theme and makes the reader follow it', () => {
    expect(getBlogShareUrl('/blog/when-pink-was-for-boys', 'knit')).toBe(
      'https://fezcode.com/blog/when-pink-was-for-boys?fezTheme=knit&fezBlogMode=standard',
    );
  });

  it('ignores ids that are not site themes', () => {
    expect(getBlogShareUrl('/blog/x/', 'nope')).toBe(
      'https://fezcode.com/blog/x',
    );
  });
});

describe('getBlogShareImage', () => {
  it("prefers the post's own image", () => {
    expect(getBlogShareImage('/blog/x', '/images/x.webp')).toBe(
      '/images/x.webp',
    );
  });

  it('falls back to the generated card for the route', () => {
    expect(getBlogShareImage('/blog/series/s/ep-1', undefined)).toBe(
      '/images/og/blog/series/s/ep-1.webp',
    );
  });
});
