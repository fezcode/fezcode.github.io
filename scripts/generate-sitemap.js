const fs = require('fs');
const path = require('path');

const publicDirectory = path.join(__dirname, '../public');
const baseUrl = 'https://fezcode.com'; // Replace with your actual base URL

const generateSitemap = async () => {
  let urls = [];

  // Add static routes
  const staticRoutes = [
    '/',
    '/about',
    '/blog',
    '/projects',
    '/logs',
    '/dnd',
    '/settings',
    '/apps',
    '/dnd/lore',
  ];

  staticRoutes.forEach(route => {
    urls.push({
      loc: `${baseUrl}${route}`,
      lastmod: new Date().toISOString(), // Use current date for static pages
      changefreq: 'monthly',
      priority: route === '/' ? '1.0' : '0.8',
    });
  });

  // Add dynamic routes from posts.json
  try {
    const postsJsonPath = path.join(publicDirectory, 'posts', 'posts.json');
    const postsJson = fs.readFileSync(postsJsonPath, 'utf-8');
    const postsData = JSON.parse(postsJson);

    postsData.forEach(item => {
      if (item.series) {
        // Add series page
        urls.push({
          loc: `${baseUrl}/#/blog/series/${item.slug}`,
          lastmod: new Date(item.updated || item.date).toISOString(),
          changefreq: 'weekly',
          priority: '0.7',
        });
        // Add individual posts within the series
        item.series.posts.forEach(seriesPost => {
          urls.push({
            loc: `${baseUrl}/#/blog/series/${item.slug}/${seriesPost.slug}`,
            lastmod: new Date(seriesPost.updated || seriesPost.date).toISOString(),
            changefreq: 'weekly',
            priority: '0.6',
          });
        });
      } else {
        // Add individual blog post
        urls.push({
          loc: `${baseUrl}/#/blog/${item.slug}`,
          lastmod: new Date(item.updated || item.date).toISOString(),
          changefreq: 'weekly',
          priority: '0.7',
        });
      }
    });
  } catch (error) {
    console.error('Error reading posts.json:', error);
  }

  // Add dynamic routes from projects.json
  try {
    const projectsJsonPath = path.join(publicDirectory, 'projects', 'projects.json');
    const projectsJson = fs.readFileSync(projectsJsonPath, 'utf-8');
    const projectsData = JSON.parse(projectsJson);

    projectsData.forEach(project => {
      urls.push({
        loc: `${baseUrl}/#/projects/${project.slug}`,
        lastmod: new Date(project.updated || project.date || new Date()).toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
      });
    });
  } catch (error) {
    console.error('Error reading projects.json:', error);
  }

  // Add dynamic routes from logs.json
  try {
    const logsJsonPath = path.join(publicDirectory, 'logs', 'logs.json');
    const logsJson = fs.readFileSync(logsJsonPath, 'utf-8');
    const logsData = JSON.parse(logsJson);

    logsData.forEach(log => {
      urls.push({
        loc: `${baseUrl}/#/logs/${log.slug}`,
        lastmod: new Date(log.updated || log.date).toISOString(),
        changefreq: 'weekly',
        priority: '0.7',
      });
    });
  } catch (error) {
    console.error('Error reading logs.json:', error);
  }

  // Add dynamic routes from dnd/episodes.json
  try {
    const dndEpisodesJsonPath = path.join(publicDirectory, 'dnd', 'episodes.json');
    const dndEpisodesJson = fs.readFileSync(dndEpisodesJsonPath, 'utf-8');
    const dndEpisodesData = JSON.parse(dndEpisodesJson);

    dndEpisodesData.forEach(book => {
      // Add D&D book page
      urls.push({
        loc: `${baseUrl}/#/dnd/books/${book.bookId}`,
        lastmod: new Date().toISOString(), // Assuming book data doesn't have a specific lastmod
        changefreq: 'monthly',
        priority: '0.6',
      });
      // Add individual D&D episodes
      book.episodes.forEach(episode => {
        urls.push({
          loc: `${baseUrl}/#/dnd/books/${book.bookId}/pages/${episode.id}`,
          lastmod: new Date().toISOString(), // Assuming episode data doesn't have a specific lastmod
          changefreq: 'weekly',
          priority: '0.5',
        });
      });
    });
  } catch (error) {
    console.error('Error reading dnd/episodes.json:', error);
  }

  // Construct XML sitemap content
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  urls.forEach(url => {
    sitemapContent += `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  });

  sitemapContent += `
</urlset>`;

  // Write sitemap to file
  const sitemapPath = path.join(publicDirectory, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
  console.log('Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap();
