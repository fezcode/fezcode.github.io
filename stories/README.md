# fezcodex.stories

This directory contains the **stories** content for Fezcodex, structured to be easily consumed by the application.

## Directory Structure

The content is organized as follows:

```
public/stories/
├── authors.piml
├── books_en.piml       # English Books Index
├── books_tr.piml       # Turkish Books Index
├── characters.piml
├── places.piml
├── MarkdownExample.md
├── meta-items/
│   ├── items.piml
│   ├── [item-image].png
│   └── ...
├── vol-1-thornus/      # Volume I Content
│   ├── [story-name]/
│   │   ├── episode1_en.txt
│   │   └── episode1_tr.txt
│   └── ...
├── vol-2-sin/          # Volume II Content
└── ...
```

*   `authors.piml`: This PIML file contains the definitions for all authors.
*   `books_en.piml` / `books_tr.piml`: These PIML files serve as the main index for all story books and their respective episodes, separated by language.
*   `characters.piml`: This PIML file contains the definitions for all characters (Dramatis Personae).
*   `places.piml`: This PIML file contains the definitions for all places and locations (The Atlas).
*   `meta-items/`: Contains item definitions and their respective images.
    *   `items.piml`: Definitions for artifacts and tools (The Armory).
*   `vol-[id]-[slug]/`: Content is organized into "Volumes" (Phases).
    *   `[story-name]/`: Each story arc has its own subdirectory.
    *   `episodeX_[lang].txt`: Plain text files containing the narrative content.

## Episode File Contents

Every file should end with `.txt` format however you can write `markdown` in it (**highly recommended**).

**Important**: Tables are not supported.

[A Markdown Example](./MarkdownExample.md) is added for to show you which elements are supported.

When you don't have to show underline in a `h2` (`##`), use `h3` (`###`) header instead. Do not go under h3. (i.e. do not use h4 and below)

## Book Structure (books_en.piml / books_tr.piml)

The `books_*.piml` files are PIML documents that, when parsed, result in an object containing a `books` array. The application groups these books by their `phase`.

```piml
(books)
  > (book)
    (bookId) 1
    (bookTitle) Volume I: The Streets of Thornus
    (phase) 1
    (phaseTitle) Phase I: The Streets of Thornus
    (episodes)
      > (episode)
        (id) 1
        (filename) vol-1-thornus/the-reflections/en/the-case-of-the-mirror-man.txt
        (title) The Case of the Mirror Man
        (author) Constellation
        (date) 2025-11-23
        (updated) 2025-11-23
    (overlay) dodgerblue
```

### Book Object Properties:

*   `bookId` (Number): A unique identifier for the book (Volume).
*   `bookTitle` (String): The full title of the volume.
*   `phase` (Number): The phase number this book belongs to (used for grouping/sorting).
*   `phaseTitle` (String): The title of the phase.
*   `episodes` (Array): An array of episode objects belonging to this book.
*   `overlay` (String): A color string used for visual styling.

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
    (book) Volume I: The Streets of Thornus
    (description) A cynical detective...
    (status) Alive (Haunted)
```

### Character Object Properties:

*   `name` (String): The name of the character.
*   `role` (String): The occupation or role.
*   `book` (String): Primary book/volume appearance.
*   `description` (String): Brief biography.
*   `status` (String): Current status (e.g., Alive, Deceased).

## Place Structure (places.piml)

```piml
(places)
  > (place)
    (name) Blade's Clinic
    (type) Medical Facility
    (category) Establishments
    (book) Volume III: The RedLink Arc
    (description) A sanctuary of white marble...
    (status) Active
```

### Place Object Properties:

*   `name` (String): The name of the location.
*   `type` (String): The type of place (e.g., Tavern, City).
*   `category` (String): Broad category (Establishments, Locations, Settlements, etc.).
*   `book` (String): The book/volume where it is featured.
*   `description` (String): Description of the atmosphere.
*   `status` (String): Current status (e.g., Active, Destroyed).

## Item Structure (meta-items/items.piml)

```piml
(items)
  > (item)
    (name) Alilberry Extract
    (type) Potion / Poison
    (book) Volume III: The RedLink Arc
    (description) A pearlescent grey mist...
    (owner) Doctor Blade
    (image) /stories/meta-items/alilberry_extract.png
```

### Item Object Properties:

*   `name` (String): The name of the artifact or item.
*   `type` (String): The classification (e.g., Weapon, Tool, Potion).
*   `book` (String): The book/volume where it first appears.
*   `description` (String): Detailed description of the item.
*   `owner` (String): The character or entity that owns the item.
*   `image` (String, Optional): Relative path to the item's image file.
