import piml from 'piml';

const TAG_COLOR = '#4b5563'; // Gray for tags
const POST_COLOR = '#f87171'; // Red/Primary for posts
const APP_COLOR = '#34d399'; // Emerald for apps
const PROJECT_COLOR = '#60a5fa'; // Blue for projects

export const fetchGraphData = async () => {
  const nodes = [];
  const links = [];
  const tagMap = new Map(); // Tag -> NodeID

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
    // Link item to tag
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
            // Apps might not have tags, but we can treat 'App' as a tag
            addTagLink(id, 'App');
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
