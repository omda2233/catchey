const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Catchy Fabric Market Staging Deployment...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`📋 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return false;
  }
}

function checkPrerequisites() {
  log('🔍 Checking prerequisites...', 'blue');
  
  // Check if Firebase CLI is installed
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    log('✅ Firebase CLI is installed', 'green');
  } catch (error) {
    log('❌ Firebase CLI not found. Please install with: npm install -g firebase-tools', 'red');
    return false;
  }
  
  // Check if firebase.json exists
  if (!fs.existsSync('firebase.json')) {
    log('❌ firebase.json not found. Please run firebase init first', 'red');
    return false;
  }
  
  // Check if functions directory exists
  if (!fs.existsSync('functions')) {
    log('❌ functions directory not found', 'red');
    return false;
  }
  
  log('✅ All prerequisites met', 'green');
  return true;
}

function installDependencies() {
  log('📦 Installing dependencies...', 'blue');
  
  // Install main project dependencies
  if (!runCommand('npm install', 'Installing main project dependencies')) {
    return false;
  }
  
  // Install functions dependencies
  if (!runCommand('cd functions && npm install && cd ..', 'Installing Cloud Functions dependencies')) {
    return false;
  }
  
  return true;
}

function deployFirestoreRules() {
  log('🛡️ Deploying Firestore Security Rules...', 'blue');
  return runCommand('firebase deploy --only firestore:rules', 'Deploying Firestore rules');
}

function deployStorageRules() {
  log('📁 Deploying Storage Rules...', 'blue');
  return runCommand('firebase deploy --only storage', 'Deploying Storage rules');
}

function deployFirestoreIndexes() {
  log('📊 Deploying Firestore Indexes...', 'blue');
  return runCommand('firebase deploy --only firestore:indexes', 'Deploying Firestore indexes');
}

function buildAndDeployFunctions() {
  log('🔧 Building and Deploying Cloud Functions...', 'blue');
  
  // Build TypeScript functions
  if (!runCommand('cd functions && npm run build && cd ..', 'Building Cloud Functions')) {
    return false;
  }
  
  // Deploy functions
  if (!runCommand('firebase deploy --only functions', 'Deploying Cloud Functions')) {
    return false;
  }
  
  return true;
}

function setupSampleData() {
  log('📊 Setting up sample data...', 'blue');
  
  // Check if service account key exists
  const serviceAccountPath = path.join(__dirname, 'service-account-key.json');
  if (!fs.existsSync(serviceAccountPath)) {
    log('⚠️  Service account key not found. Please create one in Firebase Console:', 'yellow');
    log('   1. Go to Project Settings > Service Accounts', 'yellow');
    log('   2. Click "Generate new private key"', 'yellow');
    log('   3. Save as scripts/service-account-key.json', 'yellow');
    log('   4. Run this script again', 'yellow');
    return false;
  }
  
  // Run sample data setup
  if (!runCommand('node scripts/setupStagingData.js', 'Setting up sample data')) {
    return false;
  }
  
  return true;
}

function displayTestCredentials() {
  log('\n🔐 Test Credentials:', 'blue');
  log('┌─────────────────┬─────────────────────────┬─────────────┐', 'blue');
  log('│ Role            │ Email                   │ Password    │', 'blue');
  log('├─────────────────┼─────────────────────────┼─────────────┤', 'blue');
  log('│ Admin           │ admin@catchyfabric.com  │ Admin123!   │', 'blue');
  log('│ Buyer           │ buyer@catchyfabric.com  │ Buyer123!   │', 'blue');
  log('│ Seller          │ seller@catchyfabric.com │ Seller123!  │', 'blue');
  log('│ Delivery        │ delivery@catchyfabric.com│ Delivery123!│', 'blue');
  log('└─────────────────┴─────────────────────────┴─────────────┘', 'blue');
}

function displayNextSteps() {
  log('\n📋 Next Steps:', 'blue');
  log('1. Test authentication with provided credentials', 'yellow');
  log('2. Verify all Cloud Functions are working', 'yellow');
  log('3. Test security rules in Firebase Console', 'yellow');
  log('4. Check logs in Firebase Console > Functions > Logs', 'yellow');
  log('5. Monitor performance in Firebase Console > Performance', 'yellow');
  
  log('\n🔗 Useful Links:', 'blue');
  log('- Firebase Console: https://console.firebase.google.com', 'yellow');
  log('- Functions Logs: Firebase Console > Functions > Logs', 'yellow');
  log('- Firestore Data: Firebase Console > Firestore Database', 'yellow');
  log('- Authentication: Firebase Console > Authentication', 'yellow');
}

function main() {
  log('🎯 Catchy Fabric Market - Staging Backend Deployment\n', 'green');
  
  // Check prerequisites
  if (!checkPrerequisites()) {
    log('\n❌ Prerequisites check failed. Please fix the issues above and try again.', 'red');
    process.exit(1);
  }
  
  // Install dependencies
  if (!installDependencies()) {
    log('\n❌ Dependency installation failed.', 'red');
    process.exit(1);
  }
  
  // Deploy Firestore rules
  if (!deployFirestoreRules()) {
    log('\n❌ Firestore rules deployment failed.', 'red');
    process.exit(1);
  }
  
  // Deploy Storage rules
  if (!deployStorageRules()) {
    log('\n❌ Storage rules deployment failed.', 'red');
    process.exit(1);
  }
  
  // Deploy Firestore indexes
  if (!deployFirestoreIndexes()) {
    log('\n❌ Firestore indexes deployment failed.', 'red');
    process.exit(1);
  }
  
  // Build and deploy functions
  if (!buildAndDeployFunctions()) {
    log('\n❌ Cloud Functions deployment failed.', 'red');
    process.exit(1);
  }
  
  // Setup sample data
  if (!setupSampleData()) {
    log('\n⚠️  Sample data setup failed. You can run it manually later.', 'yellow');
  }
  
  // Display results
  log('\n🎉 Staging Backend Deployment Completed Successfully!', 'green');
  
  displayTestCredentials();
  displayNextSteps();
  
  log('\n✅ Your staging environment is ready for testing!', 'green');
}

// Run the deployment
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkPrerequisites,
  installDependencies,
  deployFirestoreRules,
  deployStorageRules,
  deployFirestoreIndexes,
  buildAndDeployFunctions,
  setupSampleData
}; 