const fs = require('fs');
const path = require('path');
const piml = require('piml');

const publicDirectory = path.join(__dirname, '../public');
const baseUrl = 'https://fezcode.com'; // Replace with your actual base URL

const generateSitemap = async () => {
  let urls = [];

  // The static routes are the ones the build prerenders, read from the list the
  // prerender crawl itself uses. A sitemap entry that is not prerendered falls
  // through to 404.html, which GitHub Pages serves with a 404 status, so
  // advertising a route the build does not produce is worse than omitting it.
  // Keeping one list means the two cannot drift, which is how the hand-written
  // version here ended up ten routes long against forty real pages.
  //
  // /apps/* is dropped here and re-added from apps.json below, which carries
  // real dates for lastmod.
  const NOT_INDEXABLE = [
    '/pinned-apps', // per-visitor localStorage; a crawler sees an empty page
    '/random', // redirects somewhere different every time
  ];

  const { staticRoutes: builtRoutes } = await import('../pages/routes.js');
  const staticRoutes = builtRoutes.filter(
    route => !route.startsWith('/apps/') && !NOT_INDEXABLE.includes(route),
  );

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

  // Add every app. Only probability-cabinet used to be listed, so 110 app
  // pages were absent from the sitemap entirely.
  try {
    const appsJsonPath = path.join(publicDirectory, 'apps', 'apps.json');
    const appsData = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));

    Object.values(appsData)
      .flatMap(category => category.apps || [])
      .filter(app => app.to)
      .forEach(app => {
        urls.push({
          loc: `${baseUrl}${app.to}`,
          lastmod: new Date(app.updated_at || app.created_at || new Date()).toISOString(),
          changefreq: 'monthly',
          priority: '0.7',
        });
      });
  } catch (error) {
    console.error('Error reading apps.json:', error);
  }

  // Add every vocabulary entry. The registry is an ES module the build bundles
  // rather than a data file this CommonJS script can require, so the top-level
  // keys are read off it — they are the slugs /vocab/:term routes on.
  try {
    const vocabularyPath = path.join(__dirname, '..', 'src', 'data', 'vocabulary.js');
    const source = fs.readFileSync(vocabularyPath, 'utf-8');
    const terms = [...source.matchAll(/^ {2}'?([a-zA-Z0-9-]+)'?:\s*\{/gm)].map(
      match => match[1],
    );

    terms.forEach(term => {
      urls.push({
        loc: `${baseUrl}/vocab/${term}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.6',
      });
    });
  } catch (error) {
    console.error('Error reading vocabulary.js:', error);
  }

  // Add dynamic routes from logs (category-based)
  try {
    const logsDirectory = path.join(publicDirectory, 'logs');
    // Same list the site reads, written by generate-logs-manifest a step
    // earlier. Reading the directory directly picked up `reading`, which is a
    // reading list rather than a log category — its items have no slug, so it
    // put four /logs/reading/undefined URLs in the sitemap.
    const { categories: logCategories } = JSON.parse(
      fs.readFileSync(path.join(logsDirectory, 'index.json'), 'utf-8'),
    );

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

  // Add dynamic routes from stories/books_*.piml
  const languages = ['en', 'tr'];
  for (const lang of languages) {
    try {
      const pimlPath = path.join(publicDirectory, 'stories', `books_${lang}.piml`);
      if (fs.existsSync(pimlPath)) {
        const pimlContent = fs.readFileSync(pimlPath, 'utf-8');
        const dndData = piml.parse(pimlContent);

        if (dndData.books) {
          dndData.books.forEach(book => {
            // Add D&D book page
            urls.push({
              loc: `${baseUrl}/stories/books/${book.bookId}`,
              lastmod: new Date().toISOString(),
              changefreq: 'monthly',
              priority: '0.6',
            });
            // Add individual D&D episodes
            book.episodes.forEach(episode => {
              urls.push({
                loc: `${baseUrl}/stories/books/${book.bookId}/pages/${episode.id}`,
                lastmod: new Date().toISOString(),
                changefreq: 'weekly',
                priority: '0.5',
              });
            });
          });
        }
      }
    } catch (error) {
      console.error(`Error reading stories/books_${lang}.piml:`, error);
    }
  }

  // Add /demystify: the collection registry and each collection's entry index
  // are plain text files, so the hub, every collection and every entry are
  // discovered here rather than listed by hand.
  try {
    const demystifyRoot = path.join(publicDirectory, 'demystify');
    const registry = path.join(demystifyRoot, 'index.txt');

    if (fs.existsSync(registry)) {
      const idsIn = (file) =>
        fs
          .readFileSync(file, 'utf-8')
          .split(/\r?\n/)
          .map(line => line.match(/^id:\s*(\S+)/))
          .filter(Boolean)
          .map(match => match[1]);

      urls.push({
        loc: `${baseUrl}/demystify`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.8',
      });

      idsIn(registry).forEach(collection => {
        const collectionIndex = path.join(demystifyRoot, collection, 'index.txt');
        if (!fs.existsSync(collectionIndex)) return;

        urls.push({
          loc: `${baseUrl}/demystify/${collection}`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: '0.7',
        });

        idsIn(collectionIndex).forEach(entry => {
          urls.push({
            loc: `${baseUrl}/demystify/${collection}/${entry}`,
            lastmod: new Date().toISOString(),
            changefreq: 'monthly',
            priority: '0.6',
          });
        });
      });
    }
  } catch (error) {
    console.error('Error reading demystify index files:', error);
  }

  // Several sections legitimately reach the same URL — the story books are
  // listed once per language, and /demystify is both a prerendered page and the
  // root of its own section — so the first entry for a location wins.
  const seen = new Set();
  const uniqueUrls = urls.filter(url => {
    if (seen.has(url.loc)) return false;
    seen.add(url.loc);
    return true;
  });

  // Construct XML sitemap content
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  uniqueUrls.forEach(url => {
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
