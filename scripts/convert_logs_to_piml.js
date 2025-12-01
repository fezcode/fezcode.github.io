const fs = require('fs');
const path = require('path');
const piml = require('piml');

const publicLogsDir = path.join(__dirname, '../public/logs');
const categories = [
  'Book',
  'Movie',
  'Game',
  'Article',
  'Music',
  'Series',
  'Food',
  'Websites',
  'Tools',
];

categories.forEach(category => {
  const lowerCat = category.toLowerCase();
  const jsonPath = path.join(publicLogsDir, lowerCat, `${lowerCat}.json`);
  const pimlPath = path.join(publicLogsDir, lowerCat, `${lowerCat}.piml`);

  if (fs.existsSync(jsonPath)) {
    try {
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      // Wrap in an object to match the structure expected by piml parser (if needed) or just consistent with stories
      const pimlData = { logs: jsonData };
      const pimlString = piml.stringify(pimlData);
      fs.writeFileSync(pimlPath, pimlString);
      console.log(`Converted ${jsonPath} to ${pimlPath}`);
    } catch (err) {
      console.error(`Error converting ${jsonPath}:`, err);
    }
  } else {
    console.warn(`File not found: ${jsonPath}`);
  }
});
