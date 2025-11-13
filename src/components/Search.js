import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

const Search = ({ isVisible }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [data, setData] = useState({ posts: [], projects: [], logs: [], routes: [], apps: [] });
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, projectsRes, logsRes, appsRes] = await Promise.all([
          fetch('/posts/posts.json'),
          fetch('/projects/projects.json'),
          fetch('/logs/logs.json'),
          fetch('/apps/apps.json'),
        ]);

        const posts = await postsRes.json();
        const projects = await projectsRes.json();
        const logs = await logsRes.json();
        const appsData = await appsRes.json();
        const allApps = Object.values(appsData).flatMap(category => category.apps);

        const allPosts = posts.flatMap(item =>
          item.series ? item.series.posts.map(p => ({ ...p, series: item.title })) : item
        );

        // Manually define common routes
        const routes = [
          { title: 'Home', slug: '/', type: 'route' },
          { title: 'Blogs', slug: '/blog', type: 'route' },
          { title: 'Projects', slug: '/projects', type: 'route' },
          { title: 'About Me', slug: '/about', type: 'route' },
          { title: 'Logs', slug: '/logs', type: 'route' },
          { title: 'Settings', slug: '/settings', type: 'route' },
          { title: 'Dungeons and Dragons', slug: '/stories', type: 'route' },
          { title: 'Stories', slug: '/stories', type: 'route' },
          { title: 'Apps', slug: '/apps', type: 'route' },
          { title: 'Random', slug: '/random', type: 'route' },
        ];

        setData({ posts: allPosts, projects: projects, logs: logs, routes: routes, apps: allApps }); // Include routes in data
      } catch (error) {
        console.error('Failed to fetch search data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const posts = data.posts
        .filter(
          (post) =>
            post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            post.tags?.some((tag) => tag.toLowerCase().includes(lowerCaseSearchTerm))
        )
        .map((post) => ({ ...post, type: 'post' }));

      const projects = data.projects
        .filter(
          (project) =>
            project.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            project.technologies?.some((tech) => tech.toLowerCase().includes(lowerCaseSearchTerm))
        )
        .map((project) => ({ ...project, type: 'project' }));

      const logs = data.logs
        .filter(
          (log) =>
            log.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            log.category?.toLowerCase().includes(lowerCaseSearchTerm) ||
            log.tags?.some((tag) => tag.toLowerCase().includes(lowerCaseSearchTerm))
        )
        .map((log) => ({ ...log, type: 'log' }));

      // Filter routes
      const routes = data.routes
        .filter(
          (route) =>
            route.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            route.slug.toLowerCase().includes(lowerCaseSearchTerm)
        )
        .map((route) => ({ ...route, type: 'route' }));

      // Filter apps
      const apps = data.apps
        .filter(
          (app) =>
            app.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            app.slug.toLowerCase().includes(lowerCaseSearchTerm)
        )
        .map((app) => ({ ...app, type: 'app' }));

      setSearchResults([...posts, ...projects, ...logs, ...routes, ...apps]); // Include routes in search results
      setIsDropdownOpen(true);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getResultLink = (result) => {
    switch (result.type) {
      case 'post':
        return `/blog/${result.slug}`;
      case 'project':
        return `/projects/${result.slug}`;
      case 'log':
        return `/logs/${result.slug}`;
      case 'route': // Handle routes
        return result.slug;
      case 'app': // Handle apps
        return `${result.to}`;
      default:
        return '/';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div ref={searchRef} className="w-full bg-gray-900 py-3 px-4 border-b border-gray-700">
      <form onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-md mx-auto">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          className="bg-gray-800 text-white w-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-md"
        />
        <MagnifyingGlassIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute mt-2 w-full max-w-md max-h-96 overflow-y-auto bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 left-1/2 -translate-x-1/2">
            <ul>
              {searchResults.map((result, index) => (
                <li key={index}>
                  <Link
                    to={getResultLink(result)}
                    onClick={() => {
                      setSearchTerm('');
                      setIsDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-white hover:bg-gray-700"
                  >
                    <span className="font-bold">{result.title}</span>
                    <span className="text-sm text-gray-400 ml-2">({result.type})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;
