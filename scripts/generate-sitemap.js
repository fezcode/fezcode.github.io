const fs = require('fs');
const path = require('path');
const piml = require('piml');

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
    '/stories',
    '/settings',
    '/apps',
    '/stories/lore',
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
          loc: `${baseUrl}/blog/series/${item.slug}`,
          lastmod: new Date(item.updated || item.date).toISOString(),
          changefreq: 'weekly',
          priority: '0.7',
        });
        // Add individual posts within the series
        item.series.posts.forEach(seriesPost => {
          urls.push({
            loc: `${baseUrl}/blog/series/${item.slug}/${seriesPost.slug}`,
            lastmod: new Date(seriesPost.updated || seriesPost.date).toISOString(),
            changefreq: 'weekly',
            priority: '0.6',
          });
        });
      } else {
        // Add individual blog post
        urls.push({
          loc: `${baseUrl}/blog/${item.slug}`,
          lastmod: new Date(item.updated || item.date).toISOString(),
          changefreq: 'weekly',
          priority: '0.7',
        });
      }
    });
  } catch (error) {
    console.error('Error reading posts.json:', error);
  }

  // Add dynamic routes from projects.piml
  try {
    const projectsPimlPath = path.join(publicDirectory, 'projects', 'projects.piml');
    const pimlContent = fs.readFileSync(projectsPimlPath, 'utf-8');
    const parsedData = piml.parse(pimlContent);

    let projectList = [];
    if (parsedData.projects && Array.isArray(parsedData.projects)) {
      projectList = parsedData.projects;
    } else if (parsedData.item && Array.isArray(parsedData.item)) {
      projectList = parsedData.item;
    } else if (Array.isArray(parsedData)) {
      projectList = parsedData;
    } else if (typeof parsedData === 'object') {
      projectList = Object.values(parsedData).find(val => Array.isArray(val)) || [];
    }

    projectList.forEach(project => {
      urls.push({
        loc: `${baseUrl}/projects/${project.slug}`,
        lastmod: new Date(project.updated || project.date || new Date()).toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
      });
    });
  } catch (error) {
    console.error('Error reading projects.piml:', error);
  }

  // Add dynamic routes from logs (category-based)
  try {
    const logsDirectory = path.join(publicDirectory, 'logs');
    const logCategories = fs.readdirSync(logsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const category of logCategories) {
      const categoryPimlPath = path.join(logsDirectory, category, `${category}.piml`);
      if (fs.existsSync(categoryPimlPath)) {
        const pimlContent = fs.readFileSync(categoryPimlPath, 'utf-8');
        const pimlData = piml.parse(pimlContent);
        const logsData = pimlData.logs || [];

        logsData.forEach(log => {
          urls.push({
            loc: `${baseUrl}/logs/${category.toLowerCase()}/${log.slug}`,
            lastmod: new Date(log.updated || log.date || new Date()).toISOString(),
            changefreq: 'weekly',
            priority: '0.7',
          });
        });
      }
    }
  } catch (error) {
    console.error('Error reading log categories or PIML files:', error);
  }

  // Add dynamic routes from stories/books.piml
  try {
    const pimlPath = path.join(publicDirectory, 'stories', 'books.piml');
    const pimlContent = fs.readFileSync(pimlPath, 'utf-8');
    const dndData = piml.parse(pimlContent);

    dndData.books.forEach(book => { // Access dndData.books
      // Add D&D book page
      urls.push({
        loc: `${baseUrl}/stories/books/${book.bookId}`,
        lastmod: new Date().toISOString(), // Assuming book data doesn't have a specific lastmod
        changefreq: 'monthly',
        priority: '0.6',
      });
      // Add individual D&D episodes
      book.episodes.forEach(episode => {
        urls.push({
          loc: `${baseUrl}/stories/books/${book.bookId}/pages/${episode.id}`,
          lastmod: new Date().toISOString(), // Assuming episode data doesn't have a specific lastmod
          changefreq: 'weekly',
          priority: '0.5',
        });
      });
    });
  } catch (error) {
    console.error('Error reading stories/books.piml:', error);
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
