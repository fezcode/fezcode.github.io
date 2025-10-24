# 015 - React: `useRef` Hook

The `useRef` Hook is a fundamental part of React that allows you to create mutable `ref` objects. These `ref` objects can hold a reference to a DOM element or any mutable value that persists across re-renders without causing a re-render when its value changes.

## Why Use `useRef`?

`useRef` serves two primary purposes:

1.  **Accessing the DOM directly**: While React encourages a declarative approach to UI, there are times when you need to interact with the DOM directly (e.g., managing focus, text selection, media playback, or integrating with third-party DOM libraries).
2.  **Storing mutable values that don't trigger re-renders**: `useRef` can hold any mutable value, similar to an instance variable in a class component. Unlike `useState`, updating a `ref`'s `.current` property does not trigger a re-render of the component. This is useful for storing values that need to persist across renders but whose changes don't need to be reflected in the UI immediately.

## How `useRef` Works

`useRef` returns a plain JavaScript object with a single property called `current`. This `current` property can be initialized with an argument passed to `useRef`.

### Syntax

```javascript
const myRef = useRef(initialValue);
```

*   `myRef`: The `ref` object returned by `useRef`.
*   `myRef.current`: The actual mutable value or DOM element reference.
*   `initialValue`: The initial value for `myRef.current`.

## Example: `contentRef` in `src/pages/BlogPostPage.js`

In `BlogPostPage.js`, `useRef` is used to get a direct reference to the main content `div` of the blog post. This reference is then used to calculate the reading progress based on scroll position.

```javascript
// src/pages/BlogPostPage.js
import React, { useState, useEffect, useRef } from 'react';
// ...

const BlogPostPage = () => {
  // ...
  const contentRef = useRef(null); // Initialize contentRef with null
  // ...

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) { // Access the DOM element via .current
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        const totalHeight = scrollHeight - clientHeight;
        const currentProgress = (scrollTop / totalHeight) * 100;
        setReadingProgress(currentProgress);
        setIsAtTop(scrollTop === 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  return (
    // ...
    <div
      ref={contentRef} // Attach the ref to the div element
      className="prose prose-xl prose-dark max-w-none"
    >
      {/* ... Markdown content ... */}
    </div>
    // ...
  );
};
```

**Explanation:**

1.  **`const contentRef = useRef(null);`**: A `ref` object named `contentRef` is created and initialized with `null`. At this point, `contentRef.current` is `null`.
2.  **`<div ref={contentRef}>`**: The `ref` object is attached to the `div` element that contains the blog post's Markdown content. Once the component renders, React will set `contentRef.current` to point to this actual DOM `div` element.
3.  **`if (contentRef.current)`**: Inside the `useEffect`'s `handleScroll` function, `contentRef.current` is checked to ensure that the DOM element is available before attempting to access its properties (like `scrollHeight` or `clientHeight`).
4.  **`document.documentElement`**: While `contentRef.current` gives a reference to the specific content `div`, the scroll calculation here uses `document.documentElement` (the `<html>` element) to get the overall page scroll position and dimensions. This is a common pattern for tracking global scroll progress.

### `useRef` vs. `useState`

It's important to understand when to use `useRef` versus `useState`:

| Feature             | `useState`                                     | `useRef`                                         |
| :------------------ | :--------------------------------------------- | :----------------------------------------------- |
| **Purpose**         | Manages state that triggers re-renders.        | Accesses DOM elements or stores mutable values that *don't* trigger re-renders. |
| **Re-renders**      | Updates to state variables cause component re-renders. | Updates to `ref.current` do *not* cause re-renders. |
| **Value Persistence** | Value persists across re-renders.              | Value persists across re-renders.                |
| **Mutability**      | State is generally treated as immutable (updated via `setState`). | `ref.current` is directly mutable.               |

**When to use `useRef`:**

*   Managing focus, text selection, or media playback.
*   Triggering imperative animations.
*   Integrating with third-party DOM libraries.
*   Storing any mutable value that you don't want to trigger a re-render when it changes (e.g., a timer ID, a previous value of a prop).

## Summary

`useRef` provides a way to "escape" React's declarative paradigm when necessary, offering direct access to the underlying DOM or a persistent mutable storage for values that don't need to be part of the component's reactive state. It's a powerful tool for specific use cases where direct imperative manipulation or persistent non-state values are required.