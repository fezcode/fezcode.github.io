import { useEffect, useState } from 'react';

const parseProjectsMarkdown = (markdown) => {
  const projects = [];
  const projectSections = markdown.split('## ').slice(1); // Split by '## ' and remove the first empty element

  projectSections.forEach(section => {
    const lines = section.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return;

    const title = lines[0].trim();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');

    let description = [];
    let link = '';
    let image = '';
    let pinned = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('[Link to')) {
        const match = line.match(/\[Link to .*?\]\((.*?)\)/);
        if (match && match[1]) {
          link = match[1];
        }
      } else if (line.startsWith('![') && line.includes('](')) {
        const match = line.match(/!\[.*?\]\((.*?)\)/);
        if (match && match[1]) {
          image = match[1];
        }
      } else if (line.startsWith('Pinned:')) {
        pinned = line.toLowerCase().includes('true');
      } else {
        description.push(line);
      }
    }

    projects.push({
      slug,
      title,
      description: description.join('\n'),
      link,
      image,
      pinned,
    });
  });

  return projects;
};

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/data/Projects.md');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdown = await response.text();
        const parsedProjects = parseProjectsMarkdown(markdown);
        setProjects(parsedProjects);
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
