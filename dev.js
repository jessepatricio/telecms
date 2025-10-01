#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Telecom Cabinet Tracking System...\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
const fs = require('fs');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this from the project root directory.');
  process.exit(1);
}

// Start the development servers
const devProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  devProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development servers...');
  devProcess.kill('SIGTERM');
  process.exit(0);
});

devProcess.on('close', (code) => {
  console.log(`\n📊 Development servers stopped with code ${code}`);
  process.exit(code);
});
