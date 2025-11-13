// src/utils/jsonGeneratorData.js

export const meaningfulKeys = [
  "id", "name", "title", "description", "value", "count", "isActive", "isAvailable",
  "price", "currency", "category", "type", "status", "createdAt", "updatedAt",
  "email", "phone", "address", "city", "country", "zipCode", "latitude", "longitude",
  "url", "image", "thumbnail", "tags", "author", "publisher", "version", "rating",
  "startDate", "endDate", "duration", "progress", "priority", "notes", "metadata",
  "settings", "preferences", "permissions", "roles", "items", "products", "orders",
  "users", "comments", "posts", "pages", "sections", "chapters", "episodes", "series"
];

export const meaningfulWords = [
  "apple", "banana", "orange", "grape", "strawberry", "blueberry", "raspberry",
  "car", "truck", "bus", "motorcycle", "bicycle", "plane", "train", "boat",
  "house", "apartment", "condo", "villa", "cabin", "mansion", "cottage",
  "computer", "keyboard", "mouse", "monitor", "laptop", "tablet", "phone",
  "book", "magazine", "newspaper", "journal", "article", "story", "poem",
  "red", "blue", "green", "yellow", "purple", "black", "white", "gray",
  "happy", "sad", "angry", "excited", "calm", "stressed", "tired", "energetic",
  "morning", "afternoon", "evening", "night", "day", "week", "month", "year",
  "north", "south", "east", "west", "up", "down", "left", "right", "center",
  "true", "false", "null", "undefined", "zero", "one", "two", "three", "four",
  "data", "information", "system", "process", "function", "variable", "object",
  "array", "string", "number", "boolean", "developer", "engineer", "designer",
  "manager", "analyst", "consultant", "project", "task", "feature", "bug",
  "success", "failure", "pending", "completed", "active", "inactive", "draft",
  "published", "archived", "deleted", "new", "old", "current", "previous", "next"
];

export const generateMeaningfulString = () => {
  const numWords = Math.floor(Math.random() * 3) + 1; // 1 to 3 words
  let result = [];
  for (let i = 0; i < numWords; i++) {
    result.push(meaningfulWords[Math.floor(Math.random() * meaningfulWords.length)]);
  }
  return result.join(' ');
};

export const generateRandomEmail = () => {
  const domains = ["example.com", "test.org", "mail.net", "domain.io"];
  const username = generateMeaningfulString().replace(/\s/g, '.').toLowerCase();
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
};

export const generateRandomUrl = () => {
  const protocols = ["http", "https"];
  const subdomains = ["www", "app", "api", "blog"];
  const domains = ["example.com", "test.org", "site.net", "service.io"];
  const paths = ["/path/to/resource", "/data", "/users/profile", "/products/item"];

  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  const subdomain = Math.random() > 0.5 ? `${subdomains[Math.floor(Math.random() * subdomains.length)]}.` : '';
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const path = Math.random() > 0.7 ? paths[Math.floor(Math.random() * paths.length)] : '';

  return `${protocol}://${subdomain}${domain}${path}`;
};

export const generateRandomDate = () => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};
