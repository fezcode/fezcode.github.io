# Contributing to Fezcodex

We follow the **Conventional Commits** specification to keep our history clean and meaningful. This also helps in generating changelogs and understanding the scope of changes at a glance.

## Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**. The header has a special format that includes a **type**, a **scope**, and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Types

Must be one of the following:

- **feat**: A new feature (e.g., `feat: add new achievements system`)
- **fix**: A bug fix (e.g., `fix: correct layout on mobile`)
- **docs**: Documentation only changes (e.g., `docs: update readme`)
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation
- **content**: **(Project Specific)** Adding or updating content such as:
    - Blog posts (`content(blog): add new post about react`)
    - Logs (`content(log): add review for new movie`)
    - Projects (`content(project): add details for new app`)
    - Music/Sounds (`content(audio): add new ambient track`)
    - Assets (`content(assets): update avatar image`)

### Scope (Optional)

The scope provides additional context to the type. For `content` types, the scope is highly recommended (e.g., `blog`, `log`, `project`).

### Subject

The subject contains a succinct description of the change:
- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end

### Body (Optional)

Just as in the **subject**, use the imperative, present tense. The body should include the motivation for the change and contrast this with previous behavior.

### Footer (Optional)

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit closes.

## Example

```
content(log): add corrupted blood incident rant

- Added new text file for the post
- Updated posts.json with metadata
- Added unique category color for 'rant'
```

## Git Hooks

This project uses **Native Git Hooks** to automatically enforce the commit message format.

### How it Works
When you run `npm install`, a script sets your git configuration `core.hooksPath` to the local `git-hooks/` directory.
Inside this directory is a `commit-msg` script. Whenever you run `git commit`, Git triggers this script.
The script runs `commitlint` to check your message against our rules.

### Troubleshooting
If you are unable to commit because of a "stuck" hook or an error, ensure you have run `npm install`.
In an emergency (if the hook is broken), you can bypass verification:
```bash
git commit --no-verify -m "your message"
```
**Note:** Please use this sparingly and only if you are sure your message format is correct.