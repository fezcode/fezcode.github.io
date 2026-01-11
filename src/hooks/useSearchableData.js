import { useState, useEffect, useMemo } from 'react';
import piml from 'piml';

const useSearchableData = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = useMemo(
    () => [
      'Book',
      'Movie',
      'Video',
      'Game',
      'Article',
      'Music',
      'Series',
      'Food',
      'Websites',
      'Tools',
      'Event',
    ],
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchLogPromises = categories.map(async (category) => {
          const response = await fetch(
            `/logs/${category.toLowerCase()}/${category.toLowerCase()}.piml`,
          );
          if (!response.ok) {
            console.warn(
              `Category PIML not found for ${category}: ${response.statusText}`,
            );
            return [];
          }
          const text = await response.text();
          const data = piml.parse(text);
          return data.logs || [];
        });

        const [postsRes, projectsRes, allLogsArrays, appsRes] =
          await Promise.all([
            fetch('/posts/posts.json'),
            fetch('/projects/projects.piml'),
            Promise.all(fetchLogPromises), // Await all log category fetches
            fetch('/apps/apps.json'),
          ]);

        const postsData = await postsRes.json();
        const pimlProjectsText = await projectsRes.text();
        const parsedPimlProjects = piml.parse(pimlProjectsText);

        let projectListRaw = [];
        if (
          parsedPimlProjects.projects &&
          Array.isArray(parsedPimlProjects.projects)
        ) {
          projectListRaw = parsedPimlProjects.projects;
        } else if (
          parsedPimlProjects.item &&
          Array.isArray(parsedPimlProjects.item)
        ) {
          projectListRaw = parsedPimlProjects.item;
        } else if (Array.isArray(parsedPimlProjects)) {
          projectListRaw = parsedPimlProjects;
        } else if (typeof parsedPimlProjects === 'object') {
          projectListRaw =
            Object.values(parsedPimlProjects).find((val) =>
              Array.isArray(val),
            ) || [];
        }

        // Post-process project list to handle types and arrays (consistent with projectParser.js)
        const projectsData = projectListRaw.map((project) => ({
          ...project,
          size: project.size ? parseInt(project.size, 10) : 1,
          pinned: String(project.pinned).toLowerCase() === 'true',
          isActive: String(project.isActive).toLowerCase() === 'true',
          technologies: project.technologies
            ? typeof project.technologies === 'string'
              ? project.technologies.split(',').map((t) => t.trim())
              : project.technologies
            : [],
        }));

        const appsData = await appsRes.json();
        const combinedLogs = allLogsArrays.flat(); // Flatten the array of arrays from logs

        // Process Apps
        const allApps = Object.values(appsData)
          .flatMap((category) => category.apps)
          .map((app) => ({
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
                path: `/blog/series/${item.slug}/${p.slug}`,
              }))
            : { ...item, type: 'post', path: `/blog/${item.slug}` },
        );

        // Process Projects
        const allProjects = projectsData.map((p) => ({
          ...p,
          type: 'project',
          path: `/projects/${p.slug}`,
        }));

        // Process Logs
        const allLogs = combinedLogs.map((l) => ({
          ...l,
          type: 'log',
          path: `/logs/${l.category.toLowerCase()}/${l.slug}`,
        }));

        // Define static routes and custom commands
        const staticRoutes = [
          { title: 'Home', slug: '/', type: 'page', path: '/' },
          { title: 'Blog', slug: '/blog', type: 'page', path: '/blog' },
          {
            title: 'Projects',
            slug: '/projects',
            type: 'page',
            path: '/projects',
          },
          { title: 'About Me', slug: '/about', type: 'page', path: '/about' },
          { title: 'Logs', slug: '/logs', type: 'page', path: '/logs' },
          {
            title: 'Fezzilla Roadmap',
            slug: '/roadmap',
            type: 'page',
            path: '/roadmap',
          },
          {
            title: 'Timeline',
            slug: '/timeline',
            type: 'page',
            path: '/timeline',
          },
          {
            title: 'Settings',
            slug: '/settings',
            type: 'page',
            path: '/settings',
          },
          {
            title: 'Stories',
            slug: '/stories',
            type: 'page',
            path: '/stories',
          },
          { title: 'Apps', slug: '/apps', type: 'page', path: '/apps' },
          { title: 'Random', slug: '/random', type: 'page', path: '/random' },
        ];

        const customCommands = [
          {
            title: 'View Source on GitHub',
            type: 'command',
            commandId: 'viewSource',
          },
          {
            title: 'Navigate to a Random Post',
            type: 'command',
            commandId: 'randomPost',
          },
          {
            title: 'Toggle Animations',
            type: 'command',
            commandId: 'toggleAnimations',
          },
          {
            title: 'Reset Sidebar State',
            type: 'command',
            commandId: 'resetSidebarState',
          },
          {
            title: 'Send Email',
            type: 'command',
            commandId: 'sendEmailFezcode',
          },
          {
            title: 'Open GitHub Profile',
            type: 'command',
            commandId: 'openGitHub',
          },
          {
            title: 'Open Twitter Profile',
            type: 'command',
            commandId: 'openTwitter',
          },
          {
            title: 'Open LinkedIn Profile',
            type: 'command',
            commandId: 'openLinkedIn',
          },
          { title: 'Scroll to Top', type: 'command', commandId: 'scrollToTop' },
          {
            title: 'Scroll to Bottom',
            type: 'command',
            commandId: 'scrollToBottom',
          },
          {
            title: 'Show Site Stats',
            type: 'command',
            commandId: 'showSiteStats',
          },
          { title: 'Show Version', type: 'command', commandId: 'showVersion' },
          {
            title: 'Go to Latest Post',
            type: 'command',
            commandId: 'latestPost',
          },
          {
            title: 'Go to Latest Log',
            type: 'command',
            commandId: 'latestLog',
          },
          {
            title: 'Show Current Time',
            type: 'command',
            commandId: 'showTime',
          },
          {
            title: 'Toggle Digital Rain',
            type: 'command',
            commandId: 'digitalRain',
          },
          { title: 'Generate Art', type: 'command', commandId: 'generateArt' },
          {
            title: 'Leet Speak Transformer',
            type: 'command',
            commandId: 'leetTransformer',
          },
          {
            title: 'Show Quick Stopwatch',
            type: 'command',
            commandId: 'stopwatch',
          },
          {
            title: 'Show User/Browser Information',
            type: 'command',
            commandId: 'showOSInfo',
          },
          {
            title: 'Copy Current URL',
            type: 'command',
            commandId: 'copyCurrentURL',
          },
          {
            title: 'Clear Local Storage',
            type: 'command',
            commandId: 'clearLocalStorage',
          },
          { title: 'Reload Page', type: 'command', commandId: 'reloadPage' },
          {
            title: 'Go to Random App',
            type: 'command',
            commandId: 'randomApp',
          },
          {
            title: 'Toggle Full Screen',
            type: 'command',
            commandId: 'toggleFullScreen',
          },
          {
            title: 'Create Issue for This Page',
            type: 'command',
            commandId: 'openGitHubIssue',
          },
          { title: 'Her Daim', type: 'command', commandId: 'herDaim' },
          {
            title: 'Do a Barrel Roll',
            type: 'command',
            commandId: 'doBarrelRoll',
          },
          {
            title: 'Toggle Invert Colors',
            type: 'command',
            commandId: 'toggleInvertColors',
          },
          { title: 'Party Mode', type: 'command', commandId: 'partyMode' },
          {
            title: 'Toggle Retro Mode',
            type: 'command',
            commandId: 'toggleRetroMode',
          },
          {
            title: 'Toggle Mirror Mode',
            type: 'command',
            commandId: 'toggleMirrorMode',
          },
          {
            title: 'Toggle Noir Mode',
            type: 'command',
            commandId: 'toggleNoirMode',
          },
          {
            title: 'Toggle Terminal Mode',
            type: 'command',
            commandId: 'toggleTerminalMode',
          },
          {
            title: 'Toggle Blueprint Mode',
            type: 'command',
            commandId: 'toggleBlueprintMode',
          },
          {
            title: 'Toggle Sepia Mode',
            type: 'command',
            commandId: 'toggleSepiaMode',
          },
          {
            title: 'Toggle Vaporwave Mode',
            type: 'command',
            commandId: 'toggleVaporwaveMode',
          },
          {
            title: 'Toggle Cyberpunk Mode',
            type: 'command',
            commandId: 'toggleCyberpunkMode',
          },
          {
            title: 'Toggle Game Boy Mode',
            type: 'command',
            commandId: 'toggleGameboyMode',
          },
          {
            title: 'Toggle Comic Book Mode',
            type: 'command',
            commandId: 'toggleComicMode',
          },
          {
            title: 'Toggle Sketchbook Mode',
            type: 'command',
            commandId: 'toggleSketchbookMode',
          },
          {
            title: 'Toggle Hellenic Mode',
            type: 'command',
            commandId: 'toggleHellenicMode',
          },
          {
            title: 'Toggle Dystopian Glitch Mode',
            type: 'command',
            commandId: 'toggleGlitchMode',
          },
          {
            title: 'Toggle Garden Mode',
            type: 'command',
            commandId: 'toggleGardenMode',
          },
          {
            title: 'Toggle Autumn Mode',
            type: 'command',
            commandId: 'toggleAutumnMode',
          },
          {
            title: 'Toggle Rain Mode',
            type: 'command',
            commandId: 'toggleRainMode',
          },
          {
            title: 'Toggle Fallout Overlay',
            type: 'command',
            commandId: 'toggleFalloutMode',
          },
          {
            title: 'Switch Fallout Overlay Color (Amber/Green)',
            type: 'command',
            commandId: 'switchFalloutVariant',
          },
          {
            title: 'Previous Page',
            type: 'command',
            commandId: 'previousPage',
          },
          { title: 'Next Page', type: 'command', commandId: 'nextPage' },
        ];

        setItems([
          ...staticRoutes,
          ...customCommands,
          ...allPosts,
          ...allProjects,
          ...allLogs,
          ...allApps,
        ]);
      } catch (error) {
        console.error('Failed to fetch search data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categories]);

  return { items, isLoading };
};

export default useSearchableData;
