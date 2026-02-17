# Fezcodex

![Fezcodex Card](public/images/fezcodex-card.png)

### What is this?
Imagine you have a giant digital toy box. Inside, you keep the cool things you've built, the stories you've written, and a diary of all the interesting things you've learned. Fezcodex is that toy box. It is a special website that works like a personal museum on the internet. It is not just a boring page; it has moving parts, secret "Easter eggs," and little mini-apps like a sound mixer and a knowledge graph.

---

## Key Features
- **Digital Garden**: A space where blog posts and "logs" (mini-diaries about books, movies, or games) grow.
- **Knowledge Graph**: A 3D interactive visualization of how all content on the site is interconnected.
- **Project Archives**: A showcase of all the coding experiments and software I've built.
- **Mini-Apps**: Built-in tools like an Atmosphere Mixer, Cloud Music Player, Typing Tester, and a digital Rotary Phone.
- **Visual Magic**: Change how the whole site looks using the "Visual Matrix"—make it look like an old computer (CRT), a blueprint, or even a comic book.
- **Achievements**: Just like a video game, you get little trophies for exploring the site and finding hidden things.

---

## Tech Stack (The Lego Bricks)
- **Frontend**: React 19, Tailwind CSS, and Framer Motion for smooth animations.
- **3D & Graphics**: Three.js and react-force-graph-3d for the knowledge graph.
- **Content**: Markdown and **PIML** (Plain Old Markup Language) for structured content.
- **Build Tools**: Craco (CRA Configuration Override) for custom build pipelines.
- **Persistence**: Local Storage for settings, achievements, and persistent state.
- **AI Tooling**: **Model Context Protocol (MCP)** server for automated content management.

---

## Model Context Protocol (MCP)
Fezcodex includes a custom MCP server to assist AI agents (like Gemini) in managing content.

### Tools Provided:
- `create_blog_post`: Automates the creation of blog posts, including file generation, metadata registry updates, and RSS/Sitemap regeneration.

### Integration with Gemini CLI:
To use this server with your Gemini CLI, run:
```bash
gemini mcp add fezcodex-blog-writer --command "node scripts/mcp-server/index.mjs"
# or
gemini mcp add --scope project fezcodex npm run mcp
```
Once added, the AI can create blog posts directly through its toolset.

## Project Structure
- `src/app/`: Domain logic, core features, and views (Achievements, OS, Command Palette, etc.).
- `src/components/`: Reusable UI components (Buttons, Modals, Cards).
- `src/context/`: Global state management (Visual Settings, Toast, Animation).
- `public/`: The "pantry" where all actual content (PIML files, text, images, sounds) is stored.
- `scripts/`: Helper programs for generating RSS, sitemaps, and wallpapers.

---

## Technical Setup

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

---

## Routing and SEO
This project uses `BrowserRouter` for clean URLs. To support this on static hosts like GitHub Pages, we use `react-snap` to pre-render routes into static HTML files during the build process.

### Deployment
The standard `npm run deploy` command handles the build, pre-rendering, and deployment to GitHub Pages automatically.
```bash
npm run deploy
```

### Content Syncing
Stories are managed via git subtrees. Because subtree remotes are not tracked by git, you must initialize the remote once after cloning:
- `npm run init-stories`: Initialize the stories remote URL (only needed once).
- `npm run pull-stories`: Sync stories from the remote repository.
- `npm run push-stories`: Push local story changes to the remote repository.

---

## Rules of the House
- **Contributing:** Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on commit messages and content updates.
- **Styling**: We use Tailwind. Keep it **Brutalist** yet polished.
- **Components**: Always use `CustomDropdown`, `BrutalistDialog`, and `CustomSlider` for UI consistency.
- **Icons**: We use `@phosphor-icons/react`. Always use the ones ending in `Icon` (e.g., `CpuIcon`).
- **Logic**: Use Context for global settings like Visual Effects and Achievements.

---

## Developer Guide: How to Update Things

If you are modifying or expanding the functionality of Fezcodex, follow these specific architectural patterns:

### 1. Adding or Updating Commands
Commands are used in the **Commands Page** and the **Command Palette**. To update them, you must touch three places:
- **`src/data/commands.js`**: Update the UI data (title, description, icon color) for the `/commands` page.
- **`src/hooks/useCommandRegistry.js`**: Implement the actual logic/handler for what the command does.
- **`src/hooks/useSearchableData.js`**: Update the `customCommands` list so the Command Palette (`Ctrl + K`) can "find" the command.

### 2. Updating Search Data
The site-wide search (Command Palette and Search bar) is powered by a unified registry:
- **Automatic:** Blog posts, Projects, and Logs are automatically indexed from their respective `.json` and `.piml` files in the `public/` directory.
- **Manual:** Static pages and custom commands must be manually added to the `staticRoutes` or `customCommands` lists in `src/hooks/useSearchableData.js`.

### 3. Modifying Visual Themes (Brutalist vs. Luxe)
Every core component should be **Theme-Aware**:
- **Switcher Components:** Components like `CommandPalette.jsx`, `SidePanel.jsx`, and `GenericModal.jsx` act as controllers. They detect `fezcodexTheme` and render either a `BrutalistX` or `LuxeX` variant.
- **Universal Styles:** Prefer the `variant="brutalist"` or `variant="paper"` props for shared components like `CustomDropdown` to maintain consistency.

### 4. Global State & Persistence
- Use `VisualSettingsContext.jsx` for any UI state that needs to survive a page refresh (Invert mode, Theme selection, etc.).
- Use `usePersistentState` hook to automatically sync your context variables with `localStorage`.

### 5. AI-Assisted Content Creation (MCP)
If you are using an AI agent with MCP support:
- **Blog Posts:** Use the `create_blog_post` tool provided by the local MCP server. It handles file creation, metadata indexing, and build script execution in one step.
- **Verification:** Always run `npm run lint` after AI-generated changes to ensure style compliance.

---

## Github Pages Configuration

1. Deploy from a branch.
2. Select the `gh-pages` branch
3. Add `fezcode.com` as the custom domain.

---

Created by [Ahmed Samil Bulbul](https://fezcode.com).
