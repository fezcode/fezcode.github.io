#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import piml from 'piml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const POSTS_DIR = path.resolve(__dirname, '../../public/posts');
const POSTS_JSON = path.join(POSTS_DIR, 'posts.json');
const LOGS_DIR = path.resolve(__dirname, '../../public/logs');

// Helper functions
async function readPosts() {
  try {
    const data = await fs.readFile(POSTS_JSON, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // Return empty array if file doesn't exist
    }
    throw error;
  }
}

async function writePosts(posts) {
  await fs.writeFile(POSTS_JSON, JSON.stringify(posts, null, 2), 'utf-8');
}

function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}

async function createPost(args) {
  const { title, slug, description, content, tags, category, image } = args;

  // Validate slug
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Slug must contain only lowercase letters, numbers, and hyphens.');
  }

  // Check if post exists
  const posts = await readPosts();
  if (posts.some(p => p.slug === slug)) {
    throw new Error(`Post with slug "${slug}" already exists.`);
  }

  // Create file
  const filename = `${slug}.txt`;
  const filePath = path.join(POSTS_DIR, filename);
  await fs.writeFile(filePath, content, 'utf-8');

  // Add to metadata
  const today = new Date();
  const dateStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  const newPost = {
    slug,
    title,
    date: dateStr,
    updated: dateStr,
    description,
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    category: category || 'dev',
    filename,
    authors: ['fezcode'], // Default author
  };

  if (image) {
    newPost.image = image;
  }

  posts.unshift(newPost); // Add to beginning
  await writePosts(posts);

  return `Blog post "${title}" created successfully at ${filePath}.`;
}

async function createDiscoveryLog(args) {
  const { type, title, slug, rating, description, content, date, link, image, ...otherFields } = args;

  // Validate slug
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Slug must contain only lowercase letters, numbers, and hyphens.');
  }

  const typeLower = type.toLowerCase();
  const categoryDir = path.resolve(LOGS_DIR, typeLower);
  const pimlPath = path.join(categoryDir, `${typeLower}.piml`);

  // Ensure directory exists
  await fs.mkdir(categoryDir, { recursive: true });

  // Read existing PIML
  let logs = [];
  try {
    const pimlString = await fs.readFile(pimlPath, 'utf-8');
    const parsed = piml.parse(pimlString);
    logs = parsed.logs || [];
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  // Check if log exists
  if (logs.some(item => item.slug === slug)) {
    throw new Error(`Log with slug "${slug}" already exists in ${typeLower}.`);
  }

  // Create new item
  const today = new Date();
  const dateStr = date || today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  const newItem = {
    category: type.charAt(0).toUpperCase() + type.slice(1),
    date: dateStr,
    link: link || '',
    rating: parseInt(rating, 10),
    slug,
    title,
    image: image || '',
    description,
    ...otherFields
  };

  // Add to beginning
  logs.unshift(newItem);

  // Write back PIML
  const newPimlString = piml.stringify({ logs });
  await fs.writeFile(pimlPath, newPimlString, 'utf-8');

  // Create detailed content (.txt)
  const txtPath = path.join(categoryDir, `${slug}.txt`);
  let finalContent = content || description;

  const embedUrl = getYoutubeEmbedUrl(link);
  let txtBody = `# ${title}\n\n`;
  if (embedUrl) {
    txtBody += `<iframe width="100%" height="450" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>\n\n`;
  }
  txtBody += `${finalContent}\n\n`;
  txtBody += `Rating: ${rating}/5`;

  await fs.writeFile(txtPath, txtBody, 'utf-8');

  return `Discovery log "${title}" created successfully in ${typeLower} with file ${txtPath}.`;
}

// Server setup
const server = new Server(
  {
    name: "fezcodex-blog-writer",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_blog_post",
        description: "Create a new blog post in Fezcodex. This creates a markdown file and updates the posts.json registry.",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The title of the blog post",
            },
            slug: {
              type: "string",
              description: "The URL-friendly slug for the post (lowercase, hyphens only)",
            },
            description: {
              type: "string",
              description: "A short description/summary of the post",
            },
            content: {
              type: "string",
              description: "The full content of the blog post in Markdown format",
            },
            tags: {
              type: "string",
              description: "Comma-separated list of tags (e.g., 'react, javascript, tutorial')",
            },
            category: {
              type: "string",
              description: "Category of the post (e.g., 'dev', 'rant', 'feat')",
              enum: ["dev", "rant", "feat", "d&d", "gist", "ai"],
              default: "dev"
            },
            image: {
              type: "string",
              description: "Optional URL/path to a cover image",
            }
          },
          required: ["title", "slug", "description", "content"],
        },
      },
      {
        name: "create_discovery_log",
        description: "Add a new log to discovery logs. This updates the .piml file and creates an optional .txt file.",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "Log category (e.g., 'book', 'movie', 'video', 'game', 'article', 'music', 'series', 'food', 'websites', 'tools', 'event')",
              enum: ["book", "movie", "video", "game", "article", "music", "series", "food", "websites", "tools", "event"]
            },
            title: {
              type: "string",
              description: "The title of the log entry",
            },
            slug: {
              type: "string",
              description: "The URL-friendly slug for the log (lowercase, hyphens only)",
            },
            date: {
              type: "string",
              description: "Date of the discovery (YYYY-MM-DD). Defaults to today.",
            },
            rating: {
              type: "number",
              description: "Rating from 1 to 5",
              minimum: 1,
              maximum: 5
            },
            description: {
              type: "string",
              description: "A short description/summary of the discovery",
            },
            content: {
              type: "string",
              description: "Optional detailed thoughts (will be saved in a .txt file)",
            },
            link: {
              type: "string",
              description: "Optional URL link to the item",
            },
            image: {
              type: "string",
              description: "Optional URL/path to a cover image",
            },
            artist: { type: "string", description: "Artist name (for music)" },
            author: { type: "string", description: "Author name (for books/articles)" },
            director: { type: "string", description: "Director name (for movies/series)" },
            platform: { type: "string", description: "Platform name (for games/tools)" },
            album: { type: "string", description: "Album name (for music)" },
          },
          required: ["type", "title", "slug", "rating", "description"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "create_blog_post") {
    try {
      const result = await createPost(request.params.arguments);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating post: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  if (request.params.name === "create_discovery_log") {
    try {
      const result = await createDiscoveryLog(request.params.arguments);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating discovery log: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
  throw new Error("Tool not found");
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
