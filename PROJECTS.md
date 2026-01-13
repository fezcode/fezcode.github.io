# Stylish Project Showcases

Fezcodex supports a "Stylish" project details page variant. This layout is designed for high-production, landing-page style showcases that are isolated from the main site's global layout.

## 1. Activation

To enable the stylish layout for a project, you must set the `(stylish)` flag to `true` in `public/projects/projects.piml`:

```piml
> (project)
  (slug) my-cool-project
  (stylish) true
  ...
```

When this flag is detected, the site will automatically bypass the global sidebar/navbar and render the project using the `StylishProjectDetailsPage` component.

## 2. Directory Structure

All content for a stylish project must be placed in a dedicated folder under `public/projects/[slug]/`.

```text
public/projects/my-cool-project/
├── hero.txt          # Hero title, typewriter words, and main image
├── partners.txt      # Tech stack or "Trusted by" list
├── terminal.txt      # Interactive terminal tabs
├── integrations.txt  # Feature showcase with images (Exploration Modes)
├── features.txt      # Grid of feature cards
├── technical.txt     # Technical architecture overview
├── details.txt       # Long-form markdown (Philosophy/Deep Dive)
└── cta.txt           # Call to action and install command
```

## 3. MDX File Specifications

### `hero.txt`
The hero section expects a specific header format:
*   **Line 1**: The prefix (e.g., `# Built for`)
*   **Line 2**: Comma-separated words for the typewriter effect.
*   **image:** tag: Path to the main hero image.
*   **Body**: The main description paragraph.

```mdx
# Built for
explorers, hackers, builders

image: /images/projects/my-hero.webp

This is the main description of the project.
```

### `partners.txt`
Used to show a list of technologies or partners.
*   **label**: The small header text.
*   **logos**: Comma-separated list of items to display.

```mdx
label: Built with
logos: REACT, TAILWIND, RUST
```

### `terminal.txt`
Defines the interactive terminal component. Uses `:::tab` blocks.
*   **id**: Unique identifier for the tab.
*   **label**: Text displayed on the tab button.
*   **command**: The "input" command shown after the `$`.
*   **output**: The response text.

```mdx
:::tab
id: scan
label: Scan
command: project --scan
output: Scanning system... Done.
:::
```

### `integrations.txt`
Renders as a 3-column grid with images at the top. Uses `:::integration` blocks.
*   **title**, **description**, **image**, **link** (optional).

```mdx
# Navigation Modes
:::integration
title: Mobile App
description: Access on the go.
image: /images/projects/mobile.webp
link: /download
:::
```

### `features.txt`
Renders as a 4-column grid of icon cards. Uses `:::feature` blocks.
*   **icon**: Phosphor icon name (without 'Icon' suffix, e.g., `Cpu`, `Command`, `Globe`).
*   **title**, **description**.

```mdx
:::feature
icon: Lightning
title: Fast
description: Blazing fast execution.
:::
```

### `technical.txt`
Renders as a grid of architectural cards. Uses `:::tech` blocks.
*   **Bold text** inside the block becomes the card title (Instrument Serif font).

```mdx
:::tech
**Frontend:** Built with React 19.
:::
```

### `details.txt`
Standard markdown for the "Philosophy" section.
*   Supports `image: /path/to/img` for auto-styled image containers.
*   Supports `## Headings` for section titles.
*   Links are automatically rendered as stylized buttons.

### `cta.txt`
The final section.
*   The first `# Heading` is the title.
*   A code block (e.g., ` ```bash `) is rendered inside a terminal-style `ProjectUrlLine` component.

## 4. Assets

*   **Images**: Place images in `public/images/projects/` or `public/images/asset/`.
*   **Icons**: Use any icon name from `@phosphor-icons/react` (e.g., `User`, `Gear`, `ShieldCheck`).

## 5. Adding a New Project Checklist

1.  Create the folder `public/projects/[your-slug]`.
2.  Copy existing `.txt` files from `fezcodex` as templates.
3.  Fill in the content.
4.  Add the project to `public/projects/projects.piml` with `(stylish) true`.
5.  Run `npm run lint` to ensure everything is correct.
