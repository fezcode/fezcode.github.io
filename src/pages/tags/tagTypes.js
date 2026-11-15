// Content types in the tag index, in display order.
export const TAG_TYPES = [
  { key: 'post', plural: 'posts', label: 'Posts', one: 'Post' },
  { key: 'log', plural: 'logs', label: 'Logs', one: 'Log' },
  { key: 'project', plural: 'projects', label: 'Projects', one: 'Project' },
];

export const typeByKey = Object.fromEntries(TAG_TYPES.map((t) => [t.key, t]));

export const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
};
