# 001 - Project Overview: Fezcode

This document provides a high-level overview of the "Fezcode" project, a React-based web application designed to serve as a personal blog or portfolio site.

## Purpose

The primary purpose of this project is to display blog posts, projects, and other content in a structured and visually appealing manner. It leverages modern web technologies to create a dynamic and responsive user experience.

## Key Technologies

The project is built using the following core technologies:

*   **React:** A JavaScript library for building user interfaces. It allows for the creation of reusable UI components and manages the state of the application efficiently.
*   **Create React App (CRA) with Craco:** The project was likely bootstrapped using Create React App, which provides a solid foundation for React development. Craco (Create React App Configuration Override) is used to customize the Webpack and Babel configurations without ejecting from CRA, enabling features like Tailwind CSS integration.
*   **Tailwind CSS:** A utility-first CSS framework that allows for rapid UI development by composing pre-defined CSS classes directly in the markup.
*   **React Router DOM:** A library for handling client-side routing in React applications, enabling navigation between different pages without full page reloads.
*   **Framer Motion:** A production-ready motion library for React, used for animations and interactive elements.
*   **Phosphor Icons / React Icons:** Libraries providing a collection of customizable SVG icons.
*   **Markdown:** Blog post content is written in Markdown and rendered using `react-markdown`.
*   **Syntax Highlighting:** Code blocks within Markdown are highlighted using `react-syntax-highlighter`.
*   **GitHub Pages:** The application is deployed to GitHub Pages, a static site hosting service.

## Project Structure Highlights

The project follows a typical React application structure, with key directories including:

*   **`public/`**: Contains static assets like `index.html`, images, and the raw content for blog posts (`posts/`), logs (`logs/`), and projects (`projects/`).
*   **`src/`**: Contains the main application source code, organized into:
    *   **`components/`**: Reusable UI components (e.g., `Navbar`, `Footer`, `Toast`).
    *   **`pages/`**: Page-level components that represent different views of the application (e.g., `HomePage`, `BlogPostPage`, `NotFoundPage`).
    *   **`hooks/`**: Custom React hooks for encapsulating reusable logic (e.g., `useToast`).
    *   **`utils/`**: Utility functions and helpers.
    *   **`styles/`**: Custom CSS files.
    *   **`config/`**: Configuration files (e.g., colors, fonts).
*   **`scripts/`**: Contains utility scripts, such as `generateWallpapers.js`.

## How it Works (High-Level)

1.  **Entry Point (`src/index.js`):** The application starts by rendering the main `App` component into the `index.html` file.
2.  **Main Application (`src/App.js`):** The `App` component sets up client-side routing using `HashRouter`, defines the overall layout, and manages global contexts like the `ToastProvider`.
3.  **Routing (`react-router-dom`):** `AnimatedRoutes` (likely a component that uses `react-router-dom`'s `Routes` and `Route` components) handles mapping URLs to specific page components.
4.  **Content Fetching:** Blog posts and other dynamic content are fetched from `.txt` files located in the `public/` directory. Metadata for these posts is often stored in corresponding `.json` files (e.g., `public/posts/shownPosts.json`).
5.  **Styling (`Tailwind CSS`):** The UI is styled primarily using Tailwind CSS utility classes, with some custom CSS if needed.
6.  **Deployment:** The application is built into static assets and deployed to GitHub Pages using the `gh-pages` package.

This overview provides a foundational understanding of the Fezcode project. Subsequent documents will delve into more specific details of each component and concept.