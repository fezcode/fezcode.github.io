import { useState, useEffect } from 'react';

const useSearchableData = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [postsRes, projectsRes, logsRes, appsRes] = await Promise.all([
          fetch('/posts/posts.json'),
          fetch('/projects/projects.json'),
          fetch('/logs/logs.json'),
          fetch('/apps/apps.json'),
        ]);

        const postsData = await postsRes.json();
        const projectsData = await projectsRes.json();
        const logsData = await logsRes.json();
        const appsData = await appsRes.json();

        // Process Apps
        const allApps = Object.values(appsData)
          .flatMap((category) => category.apps)
          .map(app => ({
            ...app,
            type: 'app',
            path: app.to,
          }));

        // Process Posts
        const allPosts = postsData.flatMap((item) =>
          item.series
            ? item.series.posts.map((p) => ({
                ...p,
                type: 'post',
                title: `${item.title}: ${p.title}`,
                path: `/blog/${p.slug}`,
              }))
            : { ...item, type: 'post', path: `/blog/${item.slug}` },
        );

        // Process Projects
        const allProjects = projectsData.map(p => ({ ...p, type: 'project', path: `/projects/${p.slug}` }));

        // Process Logs
        const allLogs = logsData.map(l => ({ ...l, type: 'log', path: `/logs/${l.slug}` }));

        // Define static routes and custom commands
        const staticRoutes = [
          { title: 'Home', slug: '/', type: 'page', path: '/' },
          { title: 'Blog', slug: '/blog', type: 'page', path: '/blog' },
          { title: 'Projects', slug: '/projects', type: 'page', path: '/projects' },
          { title: 'About Me', slug: '/about', type: 'page', path: '/about' },
          { title: 'Logs', slug: '/logs', type: 'page', path: '/logs' },
          { title: 'Settings', slug: '/settings', type: 'page', path: '/settings' },
          { title: 'Stories', slug: '/stories', type: 'page', path: '/stories' },
          { title: 'Apps', slug: '/apps', type: 'page', path: '/apps' },
          { title: 'Random', slug: '/random', type: 'page', path: '/random' },
        ];

        const customCommands = [
          { title: 'View Source on GitHub', type: 'command', commandId: 'viewSource' },
          { title: 'Navigate to a Random Post', type: 'command', commandId: 'randomPost' },
          { title: 'Toggle Animations', type: 'command', commandId: 'toggleAnimations' },
          { title: 'Reset Sidebar State', type: 'command', commandId: 'resetSidebarState' },
          { title: 'Send Email', type: 'command', commandId: 'sendEmailFezcode' },
          { title: 'Open GitHub Profile', type: 'command', commandId: 'openGitHub' },
          { title: 'Open Twitter Profile', type: 'command', commandId: 'openTwitter' },
          { title: 'Open LinkedIn Profile', type: 'command', commandId: 'openLinkedIn' },
          { title: 'Scroll to Top', type: 'command', commandId: 'scrollToTop' },
          { title: 'Scroll to Bottom', type: 'command', commandId: 'scrollToBottom' },
          { title: 'Show Site Stats', type: 'command', commandId: 'showSiteStats' },
          { title: 'Show Version', type: 'command', commandId: 'showVersion' },
        ];

        setItems([...staticRoutes, ...customCommands, ...allPosts, ...allProjects, ...allLogs, ...allApps]);
      } catch (error) {
        console.error('Failed to fetch search data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { items, isLoading };
};

export default useSearchableData;
