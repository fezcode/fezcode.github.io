// src/utils/dataUtils.js

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
};

export const getPosts = async () => {
  try {
    const allPostsData = await fetchJson('/posts/posts.json');

    const processedPosts = [];
    allPostsData.forEach((item) => {
      if (item.series) {
        item.series.posts.forEach((seriesPost) => {
          processedPosts.push({
            ...seriesPost,
            series: {
              slug: item.slug,
              title: item.title,
              date: item.date,
              updated: item.updated,
              authors: item.authors,
            },
          });
        });
      } else {
        processedPosts.push(item);
      }
    });

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
      image: post.image || '/images/placeholder-blog.svg',
    }));

    return flattenedPosts;
  } catch (error) {
    console.error('Error in getPosts:', error);
    return [];
  }
};

export const getProjects = async () => {
  try {
    const allProjectsData = await fetchJson('/projects/projects.json');
    // Assuming projects.json directly contains an array of project objects
    // Each project object should ideally have title, date, and slug properties
    const formattedProjects = allProjectsData.map((project) => ({
      title: project.title,
      date: project.date, // Assuming projects have a 'date' field
      slug: project.slug,
      link: `/projects/${project.slug}`,
      description: project.description || 'A project by Fezcodex.',
      image: project.image || '/images/placeholder-project.svg',
    }));
    return formattedProjects;
  } catch (error) {
    console.error('Error in getProjects:', error);
    return [];
  }
};

export const getLogs = async () => {
  try {
    const allLogsData = await fetchJson('/logs/logs.json');
    // Assuming logs.json directly contains an array of log objects
    // Each log object should ideally have title, date, and slug properties
    return allLogsData.map((log) => ({
      title: log.title,
      date: log.date, // Assuming logs have a 'date' field
      slug: log.slug,
      link: `/logs/${log.slug}`,
      description: log.description || 'A log entry from Fezcodex.',
      image: log.image || '/images/placeholder-log.svg',
    }));
  } catch (error) {
    console.error('Error in getLogs:', error);
    return [];
  }
};
