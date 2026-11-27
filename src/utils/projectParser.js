import { useEffect, useState } from 'react';
import piml from 'piml';
import {
  isNewer,
  latestFromIndex,
  loadReleaseIndex,
  repoFromLink,
} from './projectReleases';

export const useProjects = (fetchPinnedOnly = false) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = '/projects/projects.piml';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${url}`);
        }
        const pimlText = await response.text();
        const parsedData = piml.parse(pimlText);

        // Robust extraction: handle different possible PIML structures
        let projectList = [];
        if (parsedData.projects && Array.isArray(parsedData.projects)) {
          projectList = parsedData.projects;
        } else if (parsedData.item && Array.isArray(parsedData.item)) {
          // If they are collected under 'item' tag
          projectList = parsedData.item;
        } else if (Array.isArray(parsedData)) {
          projectList = parsedData;
        } else if (typeof parsedData === 'object') {
          // Fallback: look for any array property
          projectList =
            Object.values(parsedData).find((val) => Array.isArray(val)) || [];
        }

        // Post-process project list to handle types and arrays
        projectList = projectList.map((project) => ({
          ...project,
          size: project.size ? parseInt(project.size, 10) : 1,
          pinned: String(project.pinned).toLowerCase() === 'true',
          isActive: String(project.isActive).toLowerCase() === 'true',
          technologies: project.technologies
            ? typeof project.technologies === 'string'
              ? project.technologies.split(',').map((t) => t.trim())
              : project.technologies
            : [],
          tags: Array.isArray(project.tags)
            ? project.tags
            : project.tags
              ? [project.tags]
              : [],
        }));
        if (fetchPinnedOnly) {
          projectList = projectList.filter((p) => p.pinned);
        }

        setProjects(projectList);

        // Then raise stored versions to each repo's latest release, read
        // from Airlift's release index the way Airlift does (one request,
        // cached). Lists render first; a failed lookup changes nothing.
        loadReleaseIndex()
          .then((index) => {
            if (!index) return;
            const updated = projectList.map((project) => {
              if (!project.version || !project.repo_link) return project;
              const latest = latestFromIndex(
                index,
                repoFromLink(project.repo_link),
              );
              return latest && isNewer(latest.version, project.version)
                ? { ...project, version: latest.version }
                : project;
            });
            if (updated.some((p, i) => p !== projectList[i])) {
              setProjects(updated);
            }
          })
          .catch(() => {});
      } catch (e) {
        console.error('Error parsing projects.piml:', e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [fetchPinnedOnly]);

  return { projects, loading, error };
};
