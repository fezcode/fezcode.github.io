import { useEffect, useState } from 'react';

export const useProjectContent = (slug) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        const response = await fetch(`/projects/${slug}.txt`);
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} for ${slug}.txt`,
          );
        }
        const text = await response.text();

        // After removing the leading '---' from the .txt files,
        // the full content is simply the entire text of the file.
        const fullContent = text.trim();

        // shortDescription is now provided by projects.json, so we don't extract it here.
        setContent({ fullContent });
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug]);

  return { content, loading, error };
};
