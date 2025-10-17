# Fezcode

## Deployment to GitHub Pages

To deploy updates to GitHub Pages after each commit, follow these steps:

1.  **Commit your changes**: Ensure all your desired changes are committed to your main branch (e.g., `main` or `master`).
2.  **Run the deploy script**: Execute the following command in your terminal:
    ```bash
    npm run deploy
    ```
    This script will:
    *   Build your React application for production.
    *   Push the built files to the `gh-pages` branch of your repository.

After the script completes, your updated application should be live at `https://fezcode.github.io` within a few minutes.

## About Log Card Fields

The `About Log` card displays the following fields:

*   `title`
*   `category`
*   `tags`
*   `author`
*   `director`
*   `platform`
*   `source`
*   `artist`
*   `year`
*   `creator`
*   `date`
*   `rating`
*   `link`