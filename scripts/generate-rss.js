const fs = require('fs');
const RSS = require('rss');
const path = require('path');
const { marked } = require('marked'); // Import marked

const postsDirectory = path.join(__dirname, '../public/posts');
const publicDirectory = path.join(__dirname, '../public');

// Function to strip Markdown
const stripMarkdown = (markdown) => {
  return markdown
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .replace(/#+\s/g, '') // Remove headers
    .replace(/(\*\*|\*|_|__)/g, '') // Remove bold/italic
    .replace(/\`{1,3}[^\`]+\`{1,3}/g, '') // Remove inline code and code blocks
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keeping the text
    .trim();
};

const getPosts = () => {
  const postsJsonPath = path.join(postsDirectory, 'posts.json');
  const postsJson = fs.readFileSync(postsJsonPath, 'utf-8');
  const posts = JSON.parse(postsJson);

  let allPosts = [];

  posts.forEach(post => {
    if (post.series) {
      post.series.posts.forEach(seriesPost => {
        allPosts.push({
          ...seriesPost,
          seriesTitle: post.title,
          filename: seriesPost.filename.startsWith('/') ? seriesPost.filename.substring(1) : seriesPost.filename
        });
      });
    } else {
      allPosts.push(post);
    }
  });

  return allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const generateRssFeed = () => {
  const feed = new RSS({
    title: 'Fezcodex',
    description: 'A personal blog by Ahmed Samil Bulbul',
    feed_url: 'https://fezcode.com/rss.xml',
    site_url: 'https://fezcode.com',
    image_url: 'https://fezcode.com/logo512.png',
    managingEditor: 'samil.bulbul@gmail.com (Ahmed Samil Bulbul)',
    webMaster: 'samil.bulbul@gmail.com (Ahmed Samil Bulbul)',
    copyright: `${new Date().getFullYear()} Ahmed Samil Bulbul`,
    language: 'en',
    pubDate: new Date().toUTCString(),
    ttl: '60',
    custom_namespaces: {
      'content': 'http://purl.org/rss/1.0/modules/content/',
      'dc': 'http://purl.org/dc/elements/1.1/',
      'atom': 'http://www.w3.org/2005/Atom'
    }
  });

  const posts = getPosts();

  posts.forEach(post => {
    if (!post.filename || !post.slug) return; // Skip if essential fields are missing

    const postPath = path.join(publicDirectory, 'posts', post.filename);
    if (!fs.existsSync(postPath)) return; // Skip if file doesn't exist

    const postContent = fs.readFileSync(postPath, 'utf-8');
    // The URL in the feed should be the canonical one, even if the site uses HashRouter
    const url = `https://fezcode.com/#/blog/${post.slug}`;

    const itemDescription = stripMarkdown(post.description || post.title).substring(0, 250);

    // Create a preview for content:encoded (first paragraph or ~250 chars)
    const firstParagraph = postContent.split('\n\n')[0] || postContent.substring(0, 250);
    const contentHtml = marked(firstParagraph) + `<p><a href="${url}">Read more...</a></p>`;

    feed.item({
      title: post.title,
      description: { _cdata: itemDescription + '...' }, // Short, plain-text summary
      url: url,
      guid: url, // Use full URL as guid (isPermaLink defaults to true)
      date: new Date(post.date).toUTCString(),
      author: 'Ahmed Samil Bulbul',
      custom_elements: [
        { 'content:encoded': { _cdata: contentHtml } }
      ]
    });
  });

  const rssXml = feed.xml({ indent: true });

  fs.writeFileSync(path.join(publicDirectory, 'rss.xml'), rssXml);
  console.log('RSS feed generated successfully.');
};

generateRssFeed();
