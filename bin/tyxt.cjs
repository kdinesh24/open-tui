#!/usr/bin/env node

const { spawn } = require('child_process');
const { join } = require('path');
const { platform } = require('os');

// Check if bun is available
function checkBun() {
  return new Promise((resolve) => {
    const bunCmd = platform() === 'win32' ? 'bun.exe' : 'bun';
    const check = spawn(bunCmd, ['--version'], { stdio: 'ignore', shell: true });
    check.on('close', (code) => resolve(code === 0));
    check.on('error', () => resolve(false));
  });
}

async function run() {
  const hasBun = await checkBun();
  
  if (!hasBun) {
    console.error('\n❌ Bun is required to run tyxt');
    console.error('\ntyxt uses @opentui/core which requires Bun runtime.');
    console.error('\n📦 Install Bun from: https://bun.sh');
    console.error('\n   On Unix/macOS:');
    console.error('   curl -fsSL https://bun.sh/install | bash');
    console.error('\n   On Windows (PowerShell):');
    console.error('   powershell -c "irm bun.sh/install.ps1 | iex"');
    console.error('\n   Then run: bunx tyxt\n');
    process.exit(1);
  }

  const appPath = join(__dirname, '..', 'dist', 'index.js');
  const bunCmd = platform() === 'win32' ? 'bun.exe' : 'bun';
  const bunProcess = spawn(bunCmd, ['run', appPath], {
    stdio: 'inherit',
    env: process.env,
    shell: true
  });

  bunProcess.on('exit', (code) => {
    process.exit(code || 0);
  });

  bunProcess.on('error', (err) => {
    console.error('Failed to start tyxt:', err.message);
    process.exit(1);
  });
}

run();
