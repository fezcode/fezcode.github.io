// Grid + snapping math (square and pointy-top hex).

export function snapSquare(x, y, size) {
  return { x: Math.round(x / size) * size, y: Math.round(y / size) * size };
}

// Snap to nearest pointy-top hex center; `r` is the hex radius.
export function snapHex(x, y, r) {
  const w = Math.sqrt(3) * r; // horizontal spacing
  const h = 1.5 * r; // vertical spacing
  const row = Math.round(y / h);
  const offset = (((row % 2) + 2) % 2) * (w / 2);
  const col = Math.round((x - offset) / w);
  return { x: col * w + offset, y: row * h };
}

export function snapPoint(grid, x, y) {
  if (!grid || !grid.snap) return { x, y };
  return grid.type === 'hex'
    ? snapHex(x, y, grid.size / 2)
    : snapSquare(x, y, grid.size);
}
