const fs = require('fs');
const path = require('path');
const piml = require('piml');

const pimlPath = path.join(__dirname, '../public/logs/music/music.piml');

const newLogEntry = {
  artist: "Gorillaz",
  category: "Music",
  date: "2026-01-08",
  link: "https://www.youtube.com/watch?v=nhPaWIeULKk",
  rating: 5,
  slug: "gorillaz-stylo",
  title: "Stylo",
  album: "Plastic Beach",
  description: "\"Stylo\" by Gorillaz, a track from their 2010 album \"Plastic Beach,\" features a surprising and memorable appearance by Bruce Willis in its music video. His role adds a unique, high-octane chase element to the animated world of Gorillaz, creating a truly shocking and entertaining experience for viewers."
};

try {
  const pimlContent = fs.readFileSync(pimlPath, 'utf8');
  const data = piml.parse(pimlContent);

  // Ensure data.logs exists and is an array
  if (!data.logs) {
    data.logs = [];
  } else if (!Array.isArray(data.logs)) {
    data.logs = [data.logs]; // Convert to array if it's a single object
  }

  // Add the new log entry
  data.logs.push(newLogEntry);

  // Sort logs by date (newest first)
  data.logs.sort((a, b) => new Date(b.date) - new Date(a.date));

  const updatedPimlContent = piml.stringify(data);
  fs.writeFileSync(pimlPath, updatedPimlContent);
  console.log('Successfully updated public/logs/music/music.piml');
} catch (err) {
  console.error('Error updating music.piml:', err);
}
