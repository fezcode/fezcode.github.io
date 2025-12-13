function formatMarkdownTable(markdownTable) {
  // 1. Split into lines and filter empty strings
  const lines = markdownTable
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // 2. Parse rows into cells
  const rows = lines.map(line => {
    // Remove leading/trailing pipes if present to avoid empty first/last cells
    const content = line.replace(/^\||\|$/g, '');
    return content.split('|').map(cell => cell.trim());
  });

  if (rows.length === 0) return '';

  const colCount = rows[0].length;
  const colWidths = new Array(colCount).fill(0);

  // 3. Calculate max width for each column
  rows.forEach(row => {
    row.forEach((cell, i) => {
      // Ensure we don't exceed the column count defined by the header
      if (i < colCount) {
        // Minimum width of 3 is standard for markdown (e.g., "---")
        colWidths[i] = Math.max(colWidths[i], cell.length, 3);
      }
    });
  });

  // 4. Reconstruct the table
  const formattedLines = rows.map((row, rowIndex) => {
    // Detect if this is the separator row (usually index 1, contains only dashes/colons)
    const isSeparator = rowIndex === 1 && /^[:\s-]*$/.test(row.join(''));

    const formattedCells = row.map((cell, i) => {
      if (i >= colCount) return null; // Skip extra cells if row is too long

      const targetWidth = colWidths[i];

      if (isSeparator) {
        // Handle alignment markers (e.g., :---, ---:, :---:)
        const hasLeftColon = cell.startsWith(':');
        const hasRightColon = cell.endsWith(':');

        // Build the separator line
        const start = hasLeftColon ? ':' : '-';
        const end = hasRightColon ? ':' : '-';
        const dashes = '-'.repeat(targetWidth - 2);

        return start + dashes + end;
      } else {
        // Standard data cell: Pad with spaces on the right
        return cell.padEnd(targetWidth, ' ');
      }
    }).filter(c => c !== null); // Remove skipped cells

    return `| ${formattedCells.join(' | ')} |`;
  });

  return formattedLines.join('\n');
}

export default formatMarkdownTable;
