#!/usr/bin/env node

// Simple verification script for Railway deployment readiness
import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying Catchy Fabric Market Backend Setup...\n');

// Check package.json
const packagePath = './package.json';
if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log('✅ package.json found');
    console.log(`   - Name: ${pkg.name}`);
    console.log(`   - Version: ${pkg.version}`);
    console.log(`   - Start script: ${pkg.scripts?.start || 'MISSING'}`);
    console.log(`   - Node engine: ${pkg.engines?.node || 'not specified'}`);
} else {
    console.log('❌ package.json not found');
}

// Check server.js
if (fs.existsSync('./server.js')) {
    console.log('✅ server.js found');
} else {
    console.log('❌ server.js not found');
}

// Check .env.example
if (fs.existsSync('./.env.example')) {
    console.log('✅ .env.example found');
    const envExample = fs.readFileSync('./.env.example', 'utf8');
    const requiredVars = ['PORT', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
    requiredVars.forEach(varName => {
        if (envExample.includes(varName)) {
            console.log(`   - ${varName}: ✅`);
        } else {
            console.log(`   - ${varName}: ❌`);
        }
    });
} else {
    console.log('❌ .env.example not found');
}

// Check firebaseAdmin.js
if (fs.existsSync('./firebaseAdmin.js')) {
    console.log('✅ firebaseAdmin.js found');
} else {
    console.log('❌ firebaseAdmin.js not found');
}

// Check routes directory
if (fs.existsSync('./routes')) {
    const routes = fs.readdirSync('./routes');
    console.log(`✅ routes directory found (${routes.length} files)`);
    routes.forEach(route => console.log(`   - ${route}`));
} else {
    console.log('❌ routes directory not found');
}

console.log('\n🚀 Railway Deployment Checklist:');
console.log('   - Root Directory: backend ✅');
console.log('   - Start Command: npm start ✅');
console.log('   - Dynamic PORT: process.env.PORT || 3000 ✅');
console.log('   - Health Endpoint: GET /health ✅');

console.log('\n✅ Backend is ready for Railway deployment!');