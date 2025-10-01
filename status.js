#!/usr/bin/env node

const http = require('http');

console.log('🔍 Checking TCTS Development Status...\n');

// Check frontend
function checkFrontend() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001', (res) => {
      console.log('✅ Frontend: Running on http://localhost:3001');
      resolve(true);
    });
    
    req.on('error', () => {
      console.log('❌ Frontend: Not running on http://localhost:3001');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log('⏰ Frontend: Timeout checking http://localhost:3001');
      resolve(false);
    });
  });
}

// Check backend
function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8888/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          console.log('✅ Backend: Running on http://localhost:8888');
          console.log(`   Status: ${health.message}`);
          console.log(`   Environment: ${health.environment}`);
          resolve(true);
        } catch (e) {
          console.log('⚠️ Backend: Running but health check failed');
          resolve(true);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Backend: Not running on http://localhost:8888');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log('⏰ Backend: Timeout checking http://localhost:8888');
      resolve(false);
    });
  });
}

async function checkStatus() {
  const [frontendOk, backendOk] = await Promise.all([
    checkFrontend(),
    checkBackend()
  ]);
  
  console.log('\n📊 Summary:');
  if (frontendOk && backendOk) {
    console.log('🎉 Both services are running!');
    console.log('\n🌐 Access your application:');
    console.log('   Frontend: http://localhost:3001');
    console.log('   Backend API: http://localhost:8888');
    console.log('\n🔐 Login with:');
    console.log('   admin / Admin123!');
    console.log('   supervisor / Supervisor123!');
    console.log('   technician / Technician123!');
  } else {
    console.log('⚠️ Some services are not running.');
    console.log('\n🔧 Try running: npm run dev');
  }
}

checkStatus();
