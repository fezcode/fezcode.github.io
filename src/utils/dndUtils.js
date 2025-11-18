export const parseWallpaperName = (filename) => {
  const nameWithoutExtension = filename.split('.')[0];
  const dashes = nameWithoutExtension.match(/-/g) || [];
  let parsedName = nameWithoutExtension;

  if (dashes.length >= 2) {
    const lastIndex = nameWithoutExtension.lastIndexOf('-');
    const secondLastIndex = nameWithoutExtension.lastIndexOf(
      '-',
      lastIndex - 1,
    );
    parsedName = nameWithoutExtension.substring(0, secondLastIndex);
  }

  if (parsedName.endsWith('-')) {
    parsedName = parsedName.slice(0, -1);
  }

  const withSpaces = parsedName.replace(/-/g, ' ');

  const capitalized = withSpaces
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return capitalized;
};
