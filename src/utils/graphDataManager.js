import piml from 'piml';
import { loadTagIndex, tagPath } from './tagIndex';
import { normalizeTag } from './tagSlug.mjs';

const TAG_COLOR = '#4b5563'; // Gray for tags
const POST_COLOR = '#f87171'; // Red/Primary for posts
const APP_COLOR = '#34d399'; // Emerald for apps
const PROJECT_COLOR = '#60a5fa'; // Blue for projects
const LOG_COLOR = '#fbbf24'; // Amber for discovery logs

// Pre-index builder: reads tags straight from each source. Used only when
// the generated tag index can't be loaded.
const fetchLegacyGraphData = async () => {
  const nodes = [];
  const links = [];
  const tagMap = new Map(); // Tag -> NodeID
  const linkKeys = new Set();

  // Helper to add tag node and link
  const addTagLink = (itemId, tag) => {
    if (!tag) return;
    const normalizedTag = tag.trim().toLowerCase();
    // If tag node doesn't exist, create it
    if (!tagMap.has(normalizedTag)) {
      const tagNodeId = `tag-${normalizedTag}`;
      tagMap.set(normalizedTag, tagNodeId);
      nodes.push({
        id: tagNodeId,
        name: tag, // Keep original case for display
        group: 'tag',
        color: TAG_COLOR,
        val: 1, // Base size
      });
    }
    // Link item to tag (once, even if a category repeats a tag)
    const linkKey = `${itemId}|${tagMap.get(normalizedTag)}`;
    if (linkKeys.has(linkKey)) return;
    linkKeys.add(linkKey);
    links.push({
      source: itemId,
      target: tagMap.get(normalizedTag),
    });

    // Increase tag node size (popularity)
    const tagNode = nodes.find((n) => n.id === tagMap.get(normalizedTag));
    if (tagNode) {
      tagNode.val += 0.5;
    }
  };

  try {
    // 1. Fetch Posts
    const postsRes = await fetch('/posts/posts.json');
    if (postsRes.ok) {
      const posts = await postsRes.json();
      posts.forEach((post) => {
        const id = `post-${post.slug}`;
        nodes.push({
          id,
          slug: post.slug,
          name: post.title,
          group: 'post',
          color: POST_COLOR,
          val: 2,
          desc: post.description,
        });

        // Link Tags
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag) => addTagLink(id, tag));
        }
        // Link Category
        if (post.category) {
          addTagLink(id, post.category);
        }
      });
    }

    // 2. Fetch Apps
    const appsRes = await fetch('/apps/apps.json');
    if (appsRes.ok) {
      const appsData = await appsRes.json();
      // Apps are grouped by category key
      Object.entries(appsData).forEach(([category, catData]) => {
        if (catData.apps && Array.isArray(catData.apps)) {
          catData.apps.forEach((app) => {
            const id = `app-${app.slug}`;
            nodes.push({
              id,
              slug: app.slug,
              to: app.to, // Some apps might have custom paths
              name: app.title,
              group: 'app',
              color: APP_COLOR,
              val: 2,
              desc: app.description,
            });

            // Link Category as Tag
            addTagLink(id, category);
          });
        }
      });
    }

    // 3. Fetch Projects
    const projectsRes = await fetch('/projects/projects.piml');
    if (projectsRes.ok) {
      const pimlText = await projectsRes.text();
      const parsed = piml.parse(pimlText);

      let projectList = [];
      if (parsed.projects && Array.isArray(parsed.projects)) {
        projectList = parsed.projects;
      } else if (Array.isArray(parsed)) {
        projectList = parsed;
      }

      projectList.forEach((proj) => {
        const id = `project-${proj.slug}`;
        nodes.push({
          id,
          slug: proj.slug,
          name: proj.title,
          group: 'project',
          color: PROJECT_COLOR,
          val: 3, // Projects are big
          desc: proj.description,
        });

        // Technologies -> Tags
        if (proj.technologies) {
          const techs =
            typeof proj.technologies === 'string'
              ? proj.technologies.split(',')
              : proj.technologies;

          if (Array.isArray(techs)) {
            techs.forEach((t) => addTagLink(id, t));
          }
        }
        // Type -> Tag
        if (proj.type) {
          addTagLink(id, proj.type);
        }
      });
    }
  } catch (error) {
    console.error('Failed to build knowledge graph:', error);
  }

  return { nodes, links };
};

const COLOR = {
  post: POST_COLOR,
  log: LOG_COLOR,
  project: PROJECT_COLOR,
  app: APP_COLOR,
  tag: TAG_COLOR,
};
const BASE_VAL = { post: 2, log: 2, project: 3, app: 2 };

/**
 * Builds the graph from the shared tag index (public/tags/index.piml), where
 * tags are already canonical across posts, logs and projects. Apps are not in
 * the index, so they still come from apps.json and link to their category.
 * Tags used by a single item are left out: they add dots without connecting
 * anything.
 */
export const fetchGraphData = async () => {
  let index;
  try {
    index = await loadTagIndex();
  } catch (error) {
    console.warn('Tag index unavailable, building the graph from sources:', error);
    return fetchLegacyGraphData();
  }

  const nodes = [];
  const links = [];
  const tagNodes = new Map(); // slug -> node
  const linkKeys = new Set();

  const tagNode = (slug, label, description) => {
    if (!tagNodes.has(slug)) {
      const node = {
        id: `tag-${slug}`,
        slug,
        name: label || slug,
        group: 'tag',
        color: TAG_COLOR,
        val: 1,
        desc: description || '',
        // app categories aren't in the index, so they have no tag page
        path: index.bySlug.has(slug) ? tagPath(slug) : null,
        count: 0,
      };
      tagNodes.set(slug, node);
    }
    return tagNodes.get(slug);
  };

  const link = (itemId, slug, label, description) => {
    const key = `${itemId}|${slug}`;
    if (linkKeys.has(key)) return;
    linkKeys.add(key);
    const node = tagNode(slug, label, description);
    node.count += 1;
    links.push({ source: itemId, target: node.id });
  };

  index.items.forEach((item) => {
    if (!COLOR[item.type]) return;
    nodes.push({
      id: item.id,
      slug: item.id.split('/').pop(),
      name: item.title,
      group: item.type,
      color: COLOR[item.type],
      val: BASE_VAL[item.type],
      desc: item.description,
      path: item.path,
    });
    item.tags.forEach((slug) => {
      const tag = index.bySlug.get(slug);
      link(item.id, slug, tag?.label, tag?.description);
    });
  });

  try {
    const res = await fetch('/apps/apps.json');
    if (res.ok) {
      const appsData = await res.json();
      Object.entries(appsData).forEach(([category, catData]) => {
        const slug = index.resolve(category) || normalizeTag(category);
        const known = index.bySlug.get(slug);
        (catData.apps || []).forEach((app) => {
          const id = `app/${app.slug}`;
          nodes.push({
            id,
            slug: app.slug,
            name: app.title,
            group: 'app',
            color: APP_COLOR,
            val: BASE_VAL.app,
            desc: app.description,
            path: app.to || `/apps/${app.slug}`,
          });
          link(id, slug, known?.label || catData.name || category, known?.description);
        });
      });
    }
  } catch (error) {
    console.warn('Apps could not be added to the graph:', error);
  }

  // drop one-off tags and their links
  const kept = new Set();
  tagNodes.forEach((node) => {
    if (node.count < 2) return;
    node.val = 1 + node.count * 0.5;
    kept.add(node.id);
    nodes.push(node);
  });
  const keptLinks = links.filter((l) => kept.has(l.target));

  return { nodes, links: keptLinks };
};
