# Fezcodex

![Fezcodex Card](public/images/fezcodex-card.jpg)
### What is this?
Imagine you have a giant digital toy box. Inside, you keep the cool things you've built, the stories you've written, and a diary of all the interesting things you've learned. Fezcodex is that toy box. It is a special website that works like a personal museum on the internet. It is not just a boring page; it has moving parts, secret "Easter eggs," and little mini-apps like a sound mixer and a stopwatch.

---

## What can it do?
- Digital Garden: A place where blog posts and "logs" (mini-diaries about books, movies, or games) grow.
- Project Archives: A showcase of all the coding experiments and software I've built.
- Mini-Apps: Built-in tools like an Atmosphere Mixer (for focus sounds), a Typing Tester, and a Stopwatch.
- Visual Magic: You can change how the whole site looks using the "Visual Matrix" in Settings—make it look like an old computer, a blueprint, or even a comic book.
- Achievements: Just like a video game, you get little trophies for exploring the site and finding hidden things.

---

## How is it built? (The Lego Bricks)
- React and Tailwind CSS: These are the main building blocks that make the site work and look professional.
- Framer Motion: This is the tool that makes everything move smoothly and animate.
- Markdown and PIML: These are special ways of writing text so the computer knows how to turn them into beautiful pages.
- Local Storage: The site remembers your settings and trophies right in your own browser, so it does not need a large database.

---

## Where is everything?
- src/components/: The small parts (like buttons and cards) used to build pages.
- src/pages/: The main areas of the house (Home, Blog, Settings, Apps).
- public/: This is the pantry where all the actual content (text files for posts, images, and sounds) is stored.
- scripts/: Helper programs that help build the sitemap and RSS feeds.

---

## For the Grown-ups (Technical Setup)

### Prerequisites
Make sure you have Node.js installed on your computer.

### 1. Get the code
```bash
git clone https://github.com/fezcode/fezcode.github.io.git
cd fezcode.github.io
```

### 2. Install the tools
```bash
npm install
```

### 3. Start the engine
```bash
npm start
```
This will open the site at http://localhost:3000.

## Routing and SEO

This project uses `BrowserRouter` for clean URLs (e.g., `/apps/markdown-table-formatter`) instead of hash-based URLs (`/#/apps/...`).

To support this on GitHub Pages (which is a static file host), we use `react-snap` to pre-render all routes into static HTML files during the build process.

-   **Pre-rendering:** `react-snap` crawls the application and generates a directory structure that matches the routes (e.g., `build/apps/markdown-table-formatter/index.html`). This allows GitHub Pages to serve the correct file for each route directly.
-   **SEO:** This approach ensures that every page has unique, server-side rendered metadata (title, description, open graph tags) for social media previews and search engines.
-   **Fallback:** A `404.html` is generated to handle unknown routes.

### Deployment

The standard `npm run deploy` command handles the build, pre-rendering, and deployment to GitHub Pages automatically.

```bash
npm run deploy
```

---

## Rules of the House
- **Contributing:** Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on commit messages and content updates.
- Styling: We use Tailwind. Keep it Brutalist yet polished.
- Icons: We use @phosphor-icons/react. Always use the ones ending in Icon (for example, CpuIcon).
- Logic: Keep it simple. Use Context for global settings like Visual Effects and Animations.

---
Created by Ahmed Samil Bulbul.
