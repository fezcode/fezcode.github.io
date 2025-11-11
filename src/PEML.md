# PEML (Parenthesis Markup Language) Definition

## 1. Name
PEML stands for Parenthesis Markup Language.

## 2. Data Types

### Core Types:
*   **Key-Value Pairs:** Data is represented as `(key) value`. Keys are enclosed in parentheses.
*   **Nesting:** Achieved through consistent indentation.
*   **Arrays:** A collection of ordered items.
    *   **With items:**
        ```peml
        (my_list)
            - item1
            - item2
            - (nested_item_key) nested_value
        ```
    *   **Empty Array:** Represented by `()`. 
        ```peml
        (empty_list) ()
        ```
*   **Multi-line Strings:** Strings that span multiple lines. The content starts on the next indented line.
    ```peml
    (long_description)
        This is a multi-line string.
        It can contain several lines of text.
        Newlines are preserved.
    ```
*   **Single-line Strings:** Strings that fit on a single line.
    ```peml
    (greeting) Hello, World!
    ```
*   **Integers:** Whole numbers.
    ```peml
    (age) 30
    ```
*   **Floats:** Decimal numbers.
    ```peml
    (price) 99.99
    ```
*   **Booleans:** Logical values.
    ```peml
    (is_active) true
    (is_enabled) false
    ```
*   **Null Value:** Represents the absence of a value.
    ```peml
    (optional_field) nil
    ```
*   **Objects/Maps:** A collection of unordered key-value pairs.
    *   **With content:**
        ```peml
        (user_profile)
            (name) Alice
            (email) alice@example.com
        ```
    *   **Empty Object:** Represented by `()`. 
        ```peml
        (empty_config) ()
        ```

### Suggested Additional Types:
*   **Dates/Times:** Represented as strings in ISO 8601 format.
    *   Example: `(timestamp) 2023-10-27T10:30:00Z`
*   **Binary Data:** Represented as base64-encoded strings.
    *   Example: `(binary_data) SGVsbG8gV29ybGQ=`
*   **Sets:** Collections of unique, unordered items.
    *   Example:
        ```peml
        (unique_tags)
            - tag_a
            - tag_b
            - tag_c
        ```
*   **References/Anchors:** For avoiding data duplication within a document. (More advanced feature, not detailed here)

## 3. Syntax Rules

*   **Keys:** Keys are enclosed in parentheses, e.g., `(my key)`. Keys can contain spaces and most characters, but should not contain `)` or `#` directly unless escaped.
*   **Indentation:** Consistent indentation is crucial for defining structure.
    *   **Recommendation:** Use **2 spaces** for each level of indentation. Mixing tabs and spaces for indentation is **not allowed** to ensure unambiguous parsing.
*   **Comments:** Comments are denoted by `#`. Everything from `#` to the end of the line is considered a comment and is ignored by parsers.
    *   Example: `(key) value # This is a comment about the value`
*   **Escaping Special Characters:** Backslash (`\`) is used for escaping characters within string values.
    *   Common escapes: `\n` (newline), `\t` (tab), `\\` (literal backslash).
    *   If a string value needs to contain a literal `(` or `)` or `#` that would otherwise be interpreted as syntax, it must be escaped (e.g., `(title) My \(Awesome\) Title`).
*   **Empty Collections:** Both empty arrays and empty objects are represented by `()`. 

## 4. Motivation

PEML (Parenthesis Markup Language) is designed as an alternative data serialization format with a strong emphasis on human readability and writability, while maintaining a clear and unambiguous structure for machine parsing. It aims to address certain pain points found in existing popular formats like JSON, YAML, and TOML.

### Comparison with JSON:
*   **JSON Strengths:** Universally adopted, simple data model, highly efficient for machine parsing, strict syntax.
*   **JSON Weaknesses:** Verbose for human writing (requiring extensive quoting, commas, and braces), lacks native support for comments, and multi-line strings require explicit escaping.
*   **PEML Advantages over JSON:**
    *   **Enhanced Human Readability/Writability:** PEML's indentation-based structure, unquoted single-line string values, and native multi-line string support make it significantly easier for humans to read and write, especially for configuration files or data entry.
    *   **Comments:** Direct support for `#` comments allows for better documentation within the data itself.
    *   **Flexible Keys:** Keys can contain spaces, improving natural language readability.

### Comparison with YAML:
*   **YAML Strengths:** Excellent human readability, supports comments, multi-line strings, and advanced features like anchors and aliases.
*   **YAML Weaknesses:** Can be overly complex with many ways to represent the same data, highly sensitive to indentation (leading to subtle errors), and implicit type coercion can sometimes lead to unexpected parsing results. Security concerns exist with some parsers allowing arbitrary code execution.
*   **PEML Advantages over YAML:**
    *   **Simpler Syntax:** PEML aims for a more constrained and explicit syntax, reducing the "many ways to do one thing" complexity of YAML.
    *   **Reduced Ambiguity:** Explicit `nil` for null values and `()` for empty collections (arrays and objects) helps prevent implicit type coercion issues and makes the data structure clearer.
    *   **Distinct Key Visuals:** The `(key)` syntax provides a clear visual cue for keys, which can aid in parsing and readability compared to YAML's more subtle key indicators.
    *   **Consistent Indentation Enforcement:** By recommending a strict indentation rule (e.g., 2 spaces), PEML aims to mitigate common YAML indentation pitfalls.

### Comparison with TOML:
*   **TOML Strengths:** Specifically designed for configuration files, highly human-readable, simple key-value pairs, and clear sectioning with `[table]` and `[[array of tables]]`.
*   **TOML Weaknesses:** Less flexible for representing deeply nested, arbitrary data structures (it's more opinionated towards configuration), and its multi-line string syntax can be less intuitive than YAML or PEML.
*   **PEML Advantages over TOML:**
    *   **Greater Structural Flexibility:** PEML's indentation-based nesting allows for more arbitrary and deeply nested data structures, making it suitable for a wider range of data serialization tasks beyond just configuration.
    *   **Direct Multi-line Strings:** PEML's multi-line string syntax is arguably more intuitive and direct.

In summary, PEML seeks to strike a balance between the machine-friendliness of JSON and the human-friendliness of YAML, while offering a distinct, parenthesis-driven syntax that is both explicit and concise. It prioritizes clear structure, unambiguous data representation, and ease of human interaction for data definition and configuration.

---

## 5. Comprehensive Example

```peml
(document_metadata)
    (title) Project Configuration for My Awesome App
    (version) 1.0.0
    (author) Jane Doe
    (creation_date) 2023-10-27T14:30:00Z # ISO 8601 format
    (is_production_ready) false
    (tags)
        - configuration
        - project
        - example
        - (nested_tag) sub_category # Tags can also be structured if needed
    (description)
        This is a comprehensive example of a PEML document.
        It demonstrates various data types and structural features.
        The goal is to provide a clear illustration of PEML's syntax.
    (contact_info)
        (email) jane.doe@example.com
        (website) https://example.com/jane
    (empty_settings) () # An empty object
    (feature_flags) () # An empty array

(database_config)
    (type) PostgreSQL
    (host) localhost
    (port) 5432
    (username) admin
    (password) \!secureP@ssw0rd # Escaping special characters
    (max_connections) 100
    (connection_timeout_ms) 5000
    (ssl_enabled) true
    (replica_hosts)
        - replica1.db.example.com
        - replica2.db.example.com
        - replica3.db.example.com
    (backup_schedule) nil # No backup schedule defined yet

(application_settings)
    (log_level) INFO
    (max_file_size_mb) 2048
    (allowed_origins)
        - https://app.example.com
        - https://dev.example.com
    (admin_users)
        (primary)
            (id) 101
            (name) SuperAdmin
        (secondary)
            (id) 102
            (name) BackupAdmin
    (secret_key) SGVsbG8gV29ybGQ= # Example binary data (base64 encoded)
    (empty_array_example) ()
    (empty_object_example) ()
```

---

## 6. Example: Keys with Spaces

This example demonstrates the use of keys that contain spaces, enhancing readability for certain contexts.

```peml
(user profile)
    (first name) John
    (last name) Doe
    (date of birth) 1990-05-15
    (favorite colors)
        - red
        - blue
        - green
    (contact info)
        (email address) john.doe@example.com
        (phone number) +1-555-123-4567
    (is active) true
    (last login) 2023-10-27T15:00:00Z
```

---

## 7. Example: JSON to PEML Conversion

This section illustrates how a typical JSON structure would be represented in PEML, highlighting PEML's syntax for various data types and structures.

### Original JSON:

```json
{
  "project": {
    "name": "PEML Converter",
    "version": "1.0.0",
    "active": true,
    "description": "A tool to convert JSON to PEML and vice versa. This description is quite long and spans multiple lines to demonstrate multi-line string handling in PEML.",
    "tags": ["parser", "converter", "data format"],
    "contributors": [
      {
        "id": 1,
        "name": "Alice",
        "role": "Developer"
      },
      {
        "id": 2,
        "name": "Bob",
        "role": "Tester"
      }
    ],
    "settings": {},
    "last_updated": null,
    "release date": "2023-10-27T16:00:00Z"
  }
}
```

### Equivalent PEML:

```peml
(project)
    (name) PEML Converter
    (version) 1.0.0
    (active) true
    (description)
        A tool to convert JSON to PEML and vice versa.
        This description is quite long and spans multiple lines
        to demonstrate multi-line string handling in PEML.
    (tags)
        - parser
        - converter
        - data format
    (contributors)
        - (contributor)
            (id) 1
            (name) Alice
            (role) Developer
        - (contributor)
            (id) 2
            (name) Bob
            (role) Tester
    (settings) ()
    (last_updated) nil
    (release date) 2023-10-27T16:00:00Z
```