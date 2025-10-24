# 009 - Routing with `react-router-dom`

`react-router-dom` is the standard library for client-side routing in React applications. It allows you to define different URLs for different views of your application, enabling navigation without full page reloads. This project uses `react-router-dom` to manage its various pages like blog posts, projects, and an about page.

## Core Concepts

### 1. `HashRouter`

As seen in `src/App.js`:

```javascript
// src/App.js
import { HashRouter as Router } from 'react-router-dom';
// ...
function App() {
  return (
    <Router>
      {/* ... all other components are wrapped here */}
    </Router>
  );
}
```

*   **Purpose**: `HashRouter` uses the hash portion of the URL (e.g., `http://localhost:3000/#/blog`) to keep your UI in sync with the URL. This is particularly useful for static site hosting (like GitHub Pages) because it doesn't require any special server-side configuration to handle routing. The server always serves `index.html`, and the React application handles the routing based on the hash.

### 2. `Routes` and `Route`

These components are used to define the mapping between URL paths and the React components that should be rendered for those paths. They are typically found in a central routing component, like `AnimatedRoutes.js` in this project.

### Example from `src/components/AnimatedRoutes.js`

```javascript
// src/components/AnimatedRoutes.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// ... page component imports

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div /* ... */ >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <motion.div /* ... */ >
              <BlogPostPage />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div /* ... */ >
              <NotFoundPage />
            </motion.div>
          }
        />
        {/* ... other routes */}
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
```

*   **`Routes`**: This component is a container for all your `Route` components. It looks at the current URL and renders the first `Route` that matches.
    *   `location={location}` and `key={location.pathname}`: These props are used in conjunction with `framer-motion`'s `AnimatePresence` to enable exit animations when navigating between routes. By providing a `key` that changes with the path, `AnimatePresence` can detect when a component is being removed from the tree.
*   **`Route`**: Defines a single route.
    *   **`path`**: Specifies the URL path pattern. Examples:
        *   `"/"`: Matches the root URL.
        *   `"/blog"`: Matches `/blog`.
        *   `"/blog/:slug"`: Matches `/blog/any-value`. The `:slug` part is a URL parameter, meaning `any-value` will be captured and made available to the component.
        *   `"/blog/series/:seriesSlug/:episodeSlug"`: Matches more complex paths with multiple parameters.
        *   `"*"`: A wildcard route that matches any path not matched by previous routes. This is typically used for a 404 (Not Found) page.
    *   **`element`**: The React element (component) to render when the `path` matches. In this project, each page component is wrapped in a `framer-motion` `motion.div` to apply page transition animations.

### 3. `useLocation` Hook

```javascript
// src/components/AnimatedRoutes.js
import { Routes, Route, useLocation } from 'react-router-dom';
// ...
function AnimatedRoutes() {
  const location = useLocation();
  // ...
}
```

*   **Purpose**: `useLocation` is a hook that returns the current `location` object. This object contains information about the current URL, such as `pathname`, `search` (query parameters), and `hash`. In `AnimatedRoutes.js`, it's used to provide a `key` to `Routes` for animation purposes.

### 4. `useParams` Hook

As seen in `src/pages/BlogPostPage.js`:

```javascript
// src/pages/BlogPostPage.js
import { useParams, Link, useNavigate } from 'react-router-dom';
// ...
const BlogPostPage = () => {
  const { slug, seriesSlug, episodeSlug } = useParams();
  const currentSlug = episodeSlug || slug; // Use episodeSlug if present, otherwise use slug
  // ...
};
```

*   **Purpose**: `useParams` is a hook that returns an object of key/value pairs of URL parameters. For a route like `path="/blog/:slug"`, if the URL is `/blog/my-first-post`, `useParams()` would return `{ slug: 'my-first-post' }`.
*   **Example**: In `BlogPostPage`, it extracts `slug`, `seriesSlug`, and `episodeSlug` from the URL, allowing the component to fetch the correct blog post content.

### 5. `useNavigate` Hook

As seen in `src/pages/BlogPostPage.js`:

```javascript
// src/pages/BlogPostPage.js
import { useParams, Link, useNavigate } from 'react-router-dom';
// ...
const BlogPostPage = () => {
  // ...
  const navigate = useNavigate();
  // ...
  if (postBody.trim().startsWith('<!DOCTYPE html>')) {
    console.error('Fetched content is HTML, not expected post content for:', currentSlug);
    navigate('/404'); // Redirect to 404 page
    return; // Stop further processing
  }
  // ...
};
```

*   **Purpose**: `useNavigate` is a hook that returns a function that lets you navigate programmatically. This is useful for actions like redirecting after a form submission, or in this case, redirecting to a 404 page when content is not found.
*   **Example**: In `BlogPostPage`, if the fetched content is determined to be an `index.html` fallback (indicating the actual post file was not found), `navigate('/404')` is called to redirect the user to the `NotFoundPage`.

### 6. `Link` Component

As seen in `src/pages/BlogPostPage.js`:

```javascript
// src/pages/BlogPostPage.js
// ...
<Link
  to={backLink}
  className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
>
  <ArrowLeft size={24} /> {backLinkText}
</Link>
// ...
```

*   **Purpose**: The `Link` component is used to create navigation links within your application. It prevents a full page reload when clicked, allowing `react-router-dom` to handle the navigation client-side.
*   **`to` prop**: Specifies the destination path. It can be a string or an object.

## Summary

`react-router-dom` provides a powerful and flexible way to manage navigation in React applications. By using `HashRouter`, `Routes`, `Route`, `useParams`, `useNavigate`, and `Link`, the Fezcode project creates a seamless single-page application experience with distinct URLs for different content, including dynamic routing for blog posts and projects, and robust handling for non-existent pages.