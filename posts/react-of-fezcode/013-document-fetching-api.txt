# 013 - Document Fetching with the `fetch` API

In modern web applications, fetching data from a server is a fundamental operation. The `fetch` API provides a powerful and flexible interface for making network requests, replacing older methods like `XMLHttpRequest`. This project uses `fetch` to retrieve blog post content and metadata.

## The `fetch` API Basics

The `fetch()` method starts the process of fetching a resource from the network, returning a `Promise` that fulfills once the response is available. A `fetch()` call takes one mandatory argument, the path to the resource you want to fetch.

### Basic Usage

```javascript
fetch(url)
  .then(response => response.json()) // or .text(), .blob(), etc.
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

*   **`fetch(url)`**: Initiates the request. Returns a `Promise` that resolves to a `Response` object.
*   **`response.json()` / `response.text()`**: The `Response` object has methods to extract the body content. `json()` parses the response as JSON, while `text()` parses it as plain text. Both return a `Promise`.
*   **`.then()`**: Handles the successful resolution of a Promise.
*   **`.catch()`**: Handles any errors that occur during the fetch operation or in the subsequent `.then()` blocks.

## Example from `src/pages/BlogPostPage.js`

Let's look at how `fetch` is used in `BlogPostPage.js` to get both the blog post's text content and its metadata.

```javascript
// src/pages/BlogPostPage.js - inside the useEffect's fetchPost function
// ...
try {
  const [postContentResponse, shownPostsResponse] = await Promise.all([
    fetch(`/posts/${currentSlug}.txt`),
    fetch('/posts/shownPosts.json'),
  ]);

  // Handling post content response
  let postBody = '';
  if (postContentResponse.ok) { // Check if the HTTP status code is in the 200-299 range
    postBody = await postContentResponse.text(); // Extract response body as text
    // Additional check for HTML fallback content
    if (postBody.trim().startsWith('<!DOCTYPE html>')) {
      console.error('Fetched content is HTML, not expected post content for:', currentSlug);
      navigate('/404');
      return;
    }
  } else {
    console.error('Failed to fetch post content for:', currentSlug);
    navigate('/404');
    return;
  }

  // Handling metadata response
  let postMetadata = null;
  if (shownPostsResponse.ok) { // Check if the HTTP status code is in the 200-299 range
    const allPosts = await shownPostsResponse.json(); // Extract response body as JSON
    postMetadata = allPosts.find((item) => item.slug === currentSlug);
    // ... further processing of series posts
  } else {
    console.error('Failed to fetch shownPosts.json');
  }

  // Final check and state update
  if (postMetadata && postContentResponse.ok) {
    setPost({ attributes: postMetadata, body: postBody, seriesPosts });
  } else {
    setPost({ attributes: { title: 'Post not found' }, body: '' });
  }
} catch (error) {
  console.error('Error fetching post or shownPosts.json:', error);
  setPost({ attributes: { title: 'Error loading post' }, body: '' });
} finally {
  setLoading(false);
}
// ...
```

### Explanation of `fetch` Usage in `BlogPostPage.js`:

1.  **`Promise.all([...])`**: As discussed in `011-javascript-fundamentals.md`, `Promise.all` is used to concurrently fetch two resources:
    *   `fetch("/posts/${currentSlug}.txt")`: Fetches the actual Markdown content of the blog post. The `currentSlug` is dynamically inserted into the URL.
    *   `fetch('/posts/shownPosts.json')`: Fetches a JSON file containing metadata for all blog posts.

2.  **`response.ok` Property**: After a `fetch` call, the `Response` object has an `ok` property. This is a boolean that indicates whether the HTTP response status is in the `200-299` range (inclusive). It's crucial to check `response.ok` because `fetch` does *not* throw an error for HTTP error statuses (like 404 or 500) by default; it only throws an error for network failures.

3.  **`response.text()` and `response.json()`**: These methods are used to parse the response body:
    *   `postContentResponse.text()`: Used for the `.txt` file, as it contains plain text (Markdown).
    *   `shownPostsResponse.json()`: Used for the `.json` file, as it contains structured JSON data.

4.  **Error Handling (HTTP Status)**:
    *   If `postContentResponse.ok` is `false` (meaning the `.txt` file was not found or returned an error status), an error is logged, and the application navigates to the `/404` page using `navigate('/404')`.
    *   A specific check `if (postBody.trim().startsWith('<!DOCTYPE html>'))` was added to handle the scenario where the development server might return the `index.html` (with a 200 status) instead of a 404 for a non-existent file. This ensures that even in such cases, the user is redirected to the 404 page.
    *   If `shownPostsResponse.ok` is `false`, an error is logged, but the application doesn't navigate to 404 directly, as the post content might still be available, just without rich metadata.

5.  **`try...catch` Block**: The entire asynchronous operation is wrapped in a `try...catch` block. This catches any network errors (e.g., server unreachable) or errors that occur during the processing of the Promises (e.g., `json()` parsing error). If an error occurs, it's logged, and the `post` state is set to indicate an error.

6.  **`finally` Block**: The `setLoading(false)` call is placed in a `finally` block. This ensures that the loading state is always turned off, regardless of whether the `fetch` operation succeeded or failed.

## Summary

The `fetch` API is a modern, Promise-based way to make network requests in JavaScript. By understanding how to use `fetch` with `async/await`, handle `Response` objects (especially `response.ok`), and implement robust error handling with `try...catch`, developers can effectively retrieve and process data from various sources, as demonstrated in the Fezcode project's `BlogPostPage.js` component.
