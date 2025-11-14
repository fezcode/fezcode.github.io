# fezcodex.stories

This directory contains the **stories** content for Fezcodex, structured to be easily consumed by the application.

## Directory Structure

The content is organized as follows:

```
public/stories/
├── authors.piml
├── books.piml
└── [book-directory-name]/
    ├── episode1.txt
    └── episode2.txt
    └── ...
```

*   `authors.piml`: This PIML file contains the definitions for all authors.
*   `books.piml`: This PIML file serves as the main index for all story books and their respective episodes.
*   `[book-directory-name]/`: Each book's individual episode content files are stored in their own dedicated subdirectories. For example, `book-one/` would contain episodes for "Book One".
*   `episodeX.txt`: These are plain text files containing the actual narrative content for each episode.

## Episode File Contents

Every file should end with `.txt` format however you can write `markdown` in it (**highly recommended**).

**Important**: Tables are not supported.

[A Markdown Example](./MarkdownExample.md) is added for to show you which elements are supported.

When you don't have to show underline in a `h2` (`##`), use `h3` (`###`) header instead. Do not go under h3. (i.e. do not use h4 and below)

## Book Structure (books.piml)

The `books.piml` file is a PIML document that, when parsed, results in an object containing a `books` array.

```piml
(books)
  > (book)
    (bookId) 1
    (bookTitle) Book One: The Shadowed Path
    (episodes)
      > (episode)
        (id) 1
        (filename) book-one/episode1.txt
        (title) Episode 1: The Whispering Woods
        (author) fezcode
        (date) 2025-11-14
        (updated) 2025-11-14
      > (episode)
        (id) 2
        (filename) book-one/episode2.txt
        (title) Episode 2: The Goblin Ambush
        (author) fezcode
        (date) 2025-11-14
        (updated) 2025-11-14
    (overlay) red

  > (book)
  # ... more book objects
```

### Root Object Properties:

*   `books` (Array): An array of book objects.

## Author Structure (authors.piml)

The `authors.piml` file is a PIML document that, when parsed, results in an object containing an `authors` array.

```piml
(authors)
  > (author)
    (name) Samil
    (alias) fezcode
    (website) https://fezcode.com
    (image) https://avatars.githubusercontent.com/u/49845895?v=4
  > (author)
    (name) Sabri
    (alias) TheLastRoadRunner
    (website) https://github.com/TheLastRoadRunner
    (image) https://avatars.githubusercontent.com/u/99679216?v=4
  # more authors.
```

### Author Object Properties:

*   `name` (String): The name of the author.
*   `alias` (String): A unique alias for the author, used to link episodes to this author.
*   `website` (String, Optional): The website or URL associated with the author.
*   `image` (String): A URL to the author's profile picture.

### Book Object Properties:

*   `bookId` (Number): A unique identifier for the book.
*   `bookTitle` (String): The full title of the book.
*   `episodes` (Array): An array of episode objects belonging to this book.
*   `overlay` (String): A color string (e.g., "red", "blue", "black") used for visual styling in the application.

### Episode Object Properties:

*   `id` (Number): A unique identifier for the episode within its book.
*   `filename` (String): The relative path to the plain text file containing the episode's content. This path is relative to the `public/stories/` directory (e.g., `book-one/episode1.txt`).
*   `title` (String): The title of the episode.
*   `author` (String): The alias of the author of the episode, matching an `alias` in the `authors` section.
*   `date` (String): The original release date of the episode.
*   `updated` (String): The last update date of the episode.

This structure allows the application to dynamically load and display story content, organizing it into books and episodes with associated metadata, and also provides a central place for author information.
