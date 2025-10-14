import { useEffect, useState } from 'react';
import fm from 'front-matter';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch the list of project markdown files
        // In a real app, you might have an API endpoint that lists these files
        // For now, we'll assume a fixed list or glob for them if possible
        const projectSlugs = ['project-one', 'project-two', 'project-three']; // Manually list for now

        const fetchedProjects = await Promise.all(
          projectSlugs.map(async (slug) => {
            const response = await fetch(`/projects/${slug}.md`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status} for ${slug}.md`);
            }
            const text = await response.text();
            const content = fm(text);

            const parts = content.body.split('---');
            const shortDescription = parts[0].trim();
            const fullContent = parts.slice(1).join('---').trim();

            return {
              slug,
              ...content.attributes,
              shortDescription,
              fullContent,
            };
          })
        );
        setProjects(fetchedProjects);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};