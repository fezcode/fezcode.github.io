export default {
  prerender: {
    partial: true,
  },
  meta: {
    Page: {
      env: { client: true, server: false },
    },
  },
};
