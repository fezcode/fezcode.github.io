import { isSiteTheme } from './siteThemes';

export const SHARE_SITE = 'https://fezcode.com';

/**
 * The share card for a blog route: a post's own image when it has one,
 * otherwise the generated codex card at /images/og/<route>.webp.
 */
export function getBlogShareImage(pathname, image) {
  if (image) return image;
  const path = String(pathname || '/blog').replace(/\/+$/, '') || '/blog';
  return `/images/og${path}.webp`;
}

/**
 * The link to share. With a theme, the link carries ?fezTheme so the codex
 * opens in it, and ?fezBlogMode=standard so the reader follows that theme
 * instead of a reader view saved on the recipient's device.
 */
export function getBlogShareUrl(pathname, theme) {
  const path = String(pathname || '/blog').replace(/\/+$/, '') || '/blog';
  const url = SHARE_SITE + path;
  if (!theme || !isSiteTheme(theme)) return url;
  const params = new URLSearchParams({
    fezTheme: theme,
    fezBlogMode: 'standard',
  });
  return `${url}?${params.toString()}`;
}
