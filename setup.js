#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Setting up Telecom Cabinet Tracking System...\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this from the project root directory.');
  process.exit(1);
}

// Function to run commands with promise
function runCommand(command, args, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Running: ${command} ${args.join(' ')}`);
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function setup() {
  try {
    // Step 1: Install root dependencies
    console.log('📦 Installing root dependencies...');
    await runCommand('npm', ['install']);

    // Step 2: Install backend dependencies
    console.log('\n📦 Installing backend dependencies...');
    await runCommand('npm', ['install'], path.join(process.cwd(), 'backend'));

    // Step 3: Install frontend dependencies
    console.log('\n📦 Installing frontend dependencies...');
    await runCommand('npm', ['install'], path.join(process.cwd(), 'frontend'));

    // Step 4: Generate Prisma client
    console.log('\n🗄️ Generating Prisma client...');
    await runCommand('npm', ['run', 'db:generate'], path.join(process.cwd(), 'backend'));

    // Step 5: Push database schema
    console.log('\n🗄️ Pushing database schema...');
    await runCommand('npm', ['run', 'db:push'], path.join(process.cwd(), 'backend'));

    // Step 6: Seed database
    console.log('\n🌱 Seeding database...');
    await runCommand('npm', ['run', 'db:seed'], path.join(process.cwd(), 'backend'));

    console.log('\n✅ Setup completed successfully!');
    console.log('\n🚀 You can now start the development servers with:');
    console.log('   npm run dev');
    console.log('\n📱 Frontend will be available at: http://localhost:3001');
    console.log('🔧 Backend API will be available at: http://localhost:8888');
    console.log('\n🔐 Default login credentials:');
    console.log('   Admin: admin / Admin123!');
    console.log('   Supervisor: supervisor / Supervisor123!');
    console.log('   Technician: technician / Technician123!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Please check the error above and try again.');
    console.log('💡 Make sure you have:');
    console.log('   - Node.js 18+ installed');
    console.log('   - PostgreSQL running');
    console.log('   - Database URL configured in backend/.env');
    process.exit(1);
  }
}

setup();
