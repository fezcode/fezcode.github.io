import { useEffect, useState } from 'react';

export const useOrbitIndex = (url, initialValue = null) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load ${url}`);
        return response.json();
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [url]);
  return { data, loading, error };
};

export const orbitDate = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return 'Undated';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const orbitPostLink = (post) =>
  post.series ? `/blog/series/${post.slug}` : `/blog/${post.slug}`;

export const orbitPosts = (data) =>
  (Array.isArray(data) ? [...data] : []).sort(
    (a, b) => new Date(b.updated || b.date) - new Date(a.updated || a.date),
  );

export const orbitApps = (data) =>
  Object.entries(data || {})
    .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
    .flatMap(([categoryKey, category]) =>
      (category.apps || []).map((app) => ({
        ...app,
        categoryKey,
        categoryName: category.name,
      })),
    );
