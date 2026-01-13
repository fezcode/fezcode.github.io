# Project Showcases

Fezcodex supports different project detail page styles to best present each project. Currently, there are two distinct styles available: "Stylish" and "Techno".

## 1. Activation

To assign a style to a project, set the `(style)` field in `public/projects/projects.piml`:

```piml
> (project)
  (slug) my-cool-project
  (style) stylish  ; or 'techno'
  ...
```

If no style is specified, the default layout will be used.

---

## 2. Stylish Layout

This layout is designed for high-production, landing-page style showcases. It features a rich, component-driven design ideal for web apps and major projects.

### Directory Structure
Content resides in `public/projects/[slug]/` as `.txt` files (previously `.mdx`).

```text
public/projects/my-project/
├── hero.txt          # Hero section
├── partners.txt      # Tech stack/Partners
├── terminal.txt      # Interactive terminal tabs
├── integrations.txt  # Feature showcase grid
├── features.txt      # Icon cards grid
├── technical.txt     # Technical specs
├── details.txt       # Long-form content
└── cta.txt           # Call to action
```

### File Specifications
(Same block parsing rules as before apply, e.g., `:::feature`, `:::tech`)

---

## 3. Editorial Layout

The **Editorial** style (formerly Techno) is a raw, brutalist, developer-focused aesthetic. It uses monospaced fonts, high-contrast dark modes, and terminal-inspired elements. It is perfect for CLIs, system tools, and low-level libraries.

### Directory Structure
Content resides in `public/projects/[slug]/` as `.txt` files.

```text
public/projects/my-cli-tool/
├── hero.txt          # Hero title and description
├── features.txt      # (Not currently used in Editorial layout, but reserved)
├── terminal.txt      # Terminal session preview (supports colors)
├── install.txt       # Installation command(s)
├── social.txt        # Horizontal scrollable "social proof" or "explore" cards
├── description.txt   # Main project description (Overview, Features)
└── footer.txt        # (Reserved for footer links)
```

### File Specifications

#### `hero.txt`
*   **Lines starting with `#`**: Title lines (rendered in large serif font).
*   **image:** tag: (Ignored in Editorial layout as it uses a global background grid, but good to keep for metadata).
*   **Body**: Description text below the title.

```txt
# Engineered
# For The Shell

Dush is the custom terminal shell...
```

#### `terminal.txt`
Raw text that is rendered inside a terminal window component.
*   Supports standard Markdown code blocks.
*   Use `rehype-raw` compatible HTML spans for colors if needed (e.g., `<span class="text-yellow-500">warn</span>`).

```txt
  <span class="text-[#b8bb26]">➜</span> ~ dush
  dush> echo "hello"
```

#### `install.txt`
Contains the raw installation command string.

```txt
go install github.com/fezcode/dush@latest
```

#### `social.txt`
Defines the "Explore With Us" cards. Entries are separated by `---`.
*   **Line 1**: Title (optionally starts with `#`).
*   **Line 2**: Author / Subtitle.
*   **Line 3**: Stats string (e.g., `+10 -2 ~1`).
*   **link:**: URL for the card.
*   **image:**: (Optional) Background image URL.

```txt
# Why I built Dush
fezcode
+10 -2 ~1
link: https://github.com/fezcode/dush
---
# Architecture
...
```

#### `description.txt`
The main content area ("About the Project").
*   Standard Markdown.
*   Supports lists, bolding, and headers.
*   `## Headings` separate the content into different grid rows in the layout.

```txt
## Overview
Dush is a minimalist shell...

## Key Features
- Feature 1
- Feature 2
```

## 4. Assets

*   **Images**: Place images in `public/images/projects/` or `public/images/bg/`.
*   **Icons**: Use Phosphor icons where applicable in code, or SVG assets.

## 5. Adding a New Project Checklist

1.  Create the folder `public/projects/[your-slug]`.
2.  Choose your style: `stylish` or `editorial`.
3.  Create the corresponding `.txt` files based on the chosen style's structure.
4.  Add the project to `public/projects/projects.piml` with the correct `(style)` field.
5.  Run `npm run lint` to ensure code quality.