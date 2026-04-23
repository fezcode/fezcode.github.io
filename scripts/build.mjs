import { spawn } from 'node:child_process';

const flags = new Set(process.argv.slice(2));
const FAST = flags.has('--fast');
const RETRY = flags.has('--retry');

const steps = [
  { name: 'vite build', cmd: 'vite', args: ['build'] },
  { name: 'post-build', cmd: 'node', args: ['scripts/post-build.mjs'] },
];
if (!FAST) {
  steps.push({
    name: 'prerender-crawl',
    cmd: 'node',
    args: ['scripts/prerender-crawl.mjs', ...(RETRY ? ['--retry'] : [])],
  });
}

function run(step) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32';
    const child = spawn(step.cmd, step.args, {
      stdio: 'inherit',
      shell: isWin,
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${step.name} exited with code ${code}`));
    });
    child.on('error', reject);
  });
}

function fmtSec(ms) {
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(2)}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${(s - m * 60).toFixed(1)}s`;
}

const globalStart = Date.now();
const timings = [];

for (const step of steps) {
  const s = Date.now();
  try {
    await run(step);
  } catch (err) {
    const elapsed = Date.now() - s;
    timings.push({ name: step.name, ms: elapsed, failed: true });
    console.error(`\n[build] ${step.name} failed after ${fmtSec(elapsed)}`);
    console.error(`[build] total elapsed: ${fmtSec(Date.now() - globalStart)}`);
    process.exit(1);
  }
  const elapsed = Date.now() - s;
  timings.push({ name: step.name, ms: elapsed });
  console.log(`[build] ${step.name}: ${fmtSec(elapsed)}`);
}

const total = Date.now() - globalStart;
console.log(`\n[build] ── summary ──`);
for (const t of timings) {
  const pct = ((t.ms / total) * 100).toFixed(0);
  console.log(`  ${t.name.padEnd(16)} ${fmtSec(t.ms).padStart(10)}  (${pct}%)`);
}
console.log(`  ${'total'.padEnd(16)} ${fmtSec(total).padStart(10)}`);
