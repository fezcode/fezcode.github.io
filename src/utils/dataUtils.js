// src/utils/dataUtils.js
import piml from 'piml';

const fetchPiml = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const text = await response.text();
  return piml.parse(text);
};

/**
 * Centralized utility to fetch all blog posts and process series information.
 * Normalizes filenames and attaches series metadata to individual episodes.
 */
export const fetchAllBlogPosts = async () => {
  try {
    const response = await fetch('/posts/posts.json');
    if (!response.ok) throw new Error('Failed to fetch posts.json');
    const allPostsData = await response.json();

    const processedPosts = [];
    allPostsData.forEach((item) => {
      if (item.series) {
        item.series.posts.forEach((seriesPost, index) => {
          processedPosts.push({
            ...seriesPost,
            seriesIndex: index + 1,
            filename: seriesPost.filename.startsWith('/')
              ? seriesPost.filename.substring(1)
              : seriesPost.filename,
            series: {
              slug: item.slug,
              title: item.title,
              date: item.date,
              updated: item.updated,
              authors: item.authors,
              image: item.image,
            },
          });
        });
      } else {
        processedPosts.push({
          ...item,
          filename: item.filename?.startsWith('/')
            ? item.filename.substring(1)
            : item.filename,
        });
      }
    });
    return { allPostsData, processedPosts };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return { allPostsData: [], processedPosts: [] };
  }
};

/**
 * Legacy utility for simple flattened posts (kept for backwards compatibility if needed)
 */
export const getPosts = async () => {
  try {
    const { processedPosts } = await fetchAllBlogPosts();

    // Flatten series posts and individual posts into a single array
    const flattenedPosts = processedPosts.map((post) => ({
      title: post.title,
      // Use updated date if available, otherwise original date
      date: post.updated || post.date,
      slug: post.slug,
      // Create a link based on whether it's a series post or individual
      link: post.series
        ? `/blog/series/${post.series.slug}/${post.slug}`
        : `/blog/${post.slug}`,
      description: post.description || 'A blog post from Fezcodex.',
      image: post.image || '/images/fezcodex-card.jpg',
    }));

    return flattenedPosts;
  } catch (error) {
    console.error('Error in getPosts:', error);
    return [];
  }
};

export const getProjects = async () => {
  try {
    const parsedData = await fetchPiml('/projects/projects.piml');

    let projectList = [];
    if (parsedData.projects && Array.isArray(parsedData.projects)) {
      projectList = parsedData.projects;
    } else if (parsedData.item && Array.isArray(parsedData.item)) {
      projectList = parsedData.item;
    } else if (Array.isArray(parsedData)) {
      projectList = parsedData;
    } else if (typeof parsedData === 'object') {
      projectList =
        Object.values(parsedData).find((val) => Array.isArray(val)) || [];
    }

    const formattedProjects = projectList.map((project) => ({
      title: project.title,
      date: project.date,
      slug: project.slug,
      link: `/projects/${project.slug}`,
      description: project.shortDescription || 'A project by Fezcodex.',
      image: project.image || '/images/fezcodex-card.jpg',
    }));
    return formattedProjects;
  } catch (error) {
    console.error('Error in getProjects:', error);
    return [];
  }
};
