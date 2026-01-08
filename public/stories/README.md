# fezcodex.stories

This directory contains the **stories** content for Fezcodex, structured to be easily consumed by the application.

## Directory Structure

The content is organized as follows:

```
public/stories/
├── authors.piml
├── books.piml
├── characters.piml
├── places.piml
├── MarkdownExample.md
├── meta-items/
│   ├── items.piml
│   ├── [item-image].png
│   └── ...
└── [book-directory-name]/
    ├── episode1.txt
    └── episode2.txt
    └── ...
```

*   `authors.piml`: This PIML file contains the definitions for all authors.
*   `books.piml`: This PIML file serves as the main index for all story books and their respective episodes.
*   `characters.piml`: This PIML file contains the definitions for all characters (Dramatis Personae).
*   `places.piml`: This PIML file contains the definitions for all places and locations (The Atlas).
*   `meta-items/`: Contains item definitions and their respective images.
    *   `items.piml`: Definitions for artifacts and tools (The Armory).
*   `[book-directory-name]/`: Each book's individual episode content files are stored in their own dedicated subdirectories.
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
    (overlay) red
```

### Book Object Properties:

*   `bookId` (Number): A unique identifier for the book.
*   `bookTitle` (String): The full title of the book.
*   `episodes` (Array): An array of episode objects belonging to this book.
*   `overlay` (String): A color string (e.g., "red", "blue", "black") used for visual styling in the application.

### Episode Object Properties:

*   `id` (Number): A unique identifier for the episode within its book.
*   `filename` (String): The relative path to the plain text file. Relative to the `public/stories/` directory.
*   `title` (String): The title of the episode.
*   `author` (String): The alias of the author, matching an `alias` in `authors.piml`.
*   `date` (String): Original release date.
*   `updated` (String): Last update date.

## Author Structure (authors.piml)

```piml
(authors)
  > (author)
    (name) Samil
    (alias) fezcode
    (website) https://fezcode.com
    (image) https://avatars.githubusercontent.com/u/49845895?v=4
```

### Author Object Properties:

*   `name` (String): The name of the author.
*   `alias` (String): A unique alias for the author.
*   `website` (String, Optional): The website URL.
*   `image` (String): A URL to the author's profile picture.

## Character Structure (characters.piml)

```piml
(characters)
  > (character)
    (name) Corrigan
    (role) Private Investigator
    (book) The Broken Path
    (description) A cynical detective...
    (status) Alive (Haunted)
```

### Character Object Properties:

*   `name` (String): The name of the character.
*   `role` (String): The occupation or role.
*   `book` (String): Primary book appearance.
*   `description` (String): Brief biography.
*   `status` (String): Current status (e.g., Alive, Deceased).

## Place Structure (places.piml)

```piml
(places)
  > (place)
    (name) Blade's Clinic
    (type) Medical Facility
    (book) The Tales of Doctor Blade
    (description) A sanctuary of white marble...
    (status) Active
```

### Place Object Properties:

*   `name` (String): The name of the location.
*   `type` (String): The type of place (e.g., Tavern, City).
*   `book` (String): The book where it is featured.
*   `description` (String): Description of the atmosphere.
*   `status` (String): Current status (e.g., Active, Destroyed).

## Item Structure (meta-items/items.piml)

```piml
(items)
  > (item)
    (name) Alilberry Extract
    (type) Potion / Poison
    (book) The Tales of Doctor Blade
    (description) A pearlescent grey mist...
    (owner) Doctor Blade
    (image) /stories/meta-items/alilberry_extract.png
```

### Item Object Properties:

*   `name` (String): The name of the artifact or item.
*   `type` (String): The classification (e.g., Weapon, Tool, Potion).
*   `book` (String): The book where it first appears.
*   `description` (String): Detailed description of the item.
*   `owner` (String): The character or entity that owns the item.
*   `image` (String, Optional): Relative path to the item's image file.