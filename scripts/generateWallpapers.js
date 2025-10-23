const fs = require('fs');
const path = require('path');

const wallpapersDir = path.join(__dirname, '..' , 'public', 'images', 'dnd', 'wallies');
const outputFile = path.join(__dirname, '..' , 'src', 'utils', 'dndWallpapers.js');

fs.readdir(wallpapersDir, (err, files) => {
  if (err) {
    console.error('Error reading wallpapers directory:', err);
    return;
  }

  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.jpg' || ext === '.png' || ext === '.jpeg' || ext === '.gif';
  });

  const wallpaperPaths = imageFiles.map(file => `'/images/dnd/wallies/${file}'`);

  const content = `const dndWallpapers = [
  ${wallpaperPaths.join(',
  ')}
];

export default dndWallpapers;
`;

  fs.writeFile(outputFile, content, err => {
    if (err) {
      console.error('Error writing dndWallpapers.js:', err);
      return;
    }
    console.log('dndWallpapers.js generated successfully!');
  });
});
