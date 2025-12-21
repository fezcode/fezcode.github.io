const fs = require('fs');
const { execSync } = require('child_process');

const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
  console.error('Error: No commit message file argument provided.');
  process.exit(1);
}

try {
  const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();

  // Use the locally installed commitlint
  try {
    execSync(`npx commitlint --edit "${commitMsgFile}"`, { stdio: 'inherit' });
  } catch (error) {
    // commitlint will print its own errors to stdout/stderr
    process.exit(1);
  }
} catch (err) {
  console.error('Error reading commit message file:', err);
  process.exit(1);
}
