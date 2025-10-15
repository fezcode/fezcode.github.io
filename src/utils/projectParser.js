import { useEffect, useState } from 'react';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/data/shownProjects.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for shownProjects.json`);
        }
        const projectDataList = await response.json();

        const fetchedProjects = await Promise.all(
          projectDataList.map(async (projectData) => {
            const slug = projectData.slug; // Use slug from shownProjects.json
            const contentResponse = await fetch(`/projects/${slug}.txt`);
            if (!contentResponse.ok) {
              throw new Error(`HTTP error! status: ${contentResponse.status} for ${slug}.txt`);
            }
            const text = await contentResponse.text();

            // Now, the text only contains the body, no front-matter
            const parts = text.split('---'); // Assuming shortDescription is separated by '---'
            const shortDescription = parts[0].trim();
            const fullContent = parts.slice(1).join('---').trim();

            return {
              ...projectData, // All metadata from shownProjects.json
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