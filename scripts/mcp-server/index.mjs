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
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const POSTS_DIR = path.resolve(__dirname, '../../public/posts');
const POSTS_JSON = path.join(POSTS_DIR, 'posts.json');
const PROJECT_ROOT = path.resolve(__dirname, '../../');

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
  const newPost = {
    slug,
    title,
    date: new Date().toISOString().split('T')[0],
    updated: new Date().toISOString().split('T')[0],
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

  // Generate RSS and Sitemap
  try {
    await execPromise('npm run generate-rss', { cwd: PROJECT_ROOT });
    await execPromise('npm run generate-sitemap', { cwd: PROJECT_ROOT });
  } catch (error) {
    console.error('Error generating RSS/Sitemap:', error);
    // Don't fail the whole operation if generation fails, but log it
    return `Blog post "${title}" created at ${filePath}, but RSS/Sitemap generation failed: ${error.message}`;
  }

  return `Blog post "${title}" created successfully at ${filePath}. RSS and Sitemap updated.`;
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
  throw new Error("Tool not found");
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
