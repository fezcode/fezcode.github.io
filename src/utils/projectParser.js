import { useEffect, useState } from 'react';

export const useProjects = (fetchPinnedOnly = false) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = fetchPinnedOnly
          ? '/projects/pinned_projects.json'
          : '/projects/projects.json';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${url}`);
        }
        const projectDataList = await response.json();
        setProjects(projectDataList);
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
