# fezcodex.stories

This directory contains the stories content for Fezcodex, structured to be easily consumed by the application.

## Directory Structure

The content is organized as follows:

```
public/stories/
├── books.json
└── [book-directory-name]/
    ├── episode1.txt
    └── episode2.txt
    └── ...
```

*   `books.json`: This JSON file serves as the main index for all D&D books and their respective episodes.
*   `[book-directory-name]/`: Each book's individual episode content files are stored in their own dedicated subdirectories. For example, `book-one/` would contain episodes for "Book One".
*   `episodeX.txt`: These are plain text files containing the actual narrative content for each episode.

## Book Structure (books.json)

The `books.json` file is an array of book objects. Each book object defines a collection of episodes and their metadata.

```json
[
  {
    "bookId": 1,
    "bookTitle": "Book One: The Shadowed Path",
    "episodes": [
      {
        "id": 1,
        "filename": "book-one/episode1.txt",
        "title": "Episode 1: The Whispering Woods",
        "author": "fezcode"
      },
      {
        "id": 2,
        "filename": "book-one/episode2.txt",
        "title": "Episode 2: The Goblin Ambush",
        "author": "fezcode"
      }
    ],
    "overlay": "red"
  },
  // ... more book objects
]
```

### Book Object Properties:

*   `bookId` (Number): A unique identifier for the book.
*   `bookTitle` (String): The full title of the book.
*   `episodes` (Array): An array of episode objects belonging to this book.
*   `overlay` (String): A color string (e.g., "red", "blue", "black") used for visual styling in the application.

### Episode Object Properties:

*   `id` (Number): A unique identifier for the episode within its book.
*   `filename` (String): The relative path to the plain text file containing the episode's content. This path is relative to the `public/stories/` directory (e.g., `book-one/episode1.txt`).
*   `title` (String): The title of the episode.
*   `author` (String): The author of the episode.

This structure allows the application to dynamically load and display D&D campaign content, organizing it into books and episodes with associated metadata.
