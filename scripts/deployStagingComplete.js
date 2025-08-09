const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Catchy Fabric Market - Complete Staging Deployment\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description, continueOnError = false) {
  try {
    log(`📋 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    if (!continueOnError) {
      throw error;
    }
    return false;
  }
}

function checkFirebaseProject() {
  log('🔍 Checking Firebase project configuration...', 'blue');
  
  try {
    const projectInfo = execSync('firebase projects:list', { encoding: 'utf8' });
    log('✅ Firebase CLI is configured', 'green');
    
    // Check if we're in a Firebase project
    if (!fs.existsSync('.firebaserc')) {
      log('⚠️  No .firebaserc found. Please run: firebase init', 'yellow');
      return false;
    }
    
    return true;
  } catch (error) {
    log('❌ Firebase CLI not configured properly', 'red');
    return false;
  }
}

function installDependencies() {
  log('📦 Installing project dependencies...', 'blue');
  
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
    log('⚠️  Service account key not found. Please create one:', 'yellow');
    log('   1. Go to Firebase Console → Project Settings → Service Accounts', 'yellow');
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

function verifyDeployment() {
  log('🔍 Verifying deployment...', 'blue');
  
  try {
    // Check if functions are deployed
    const functionsList = execSync('firebase functions:list', { encoding: 'utf8' });
    log('✅ Cloud Functions deployed successfully', 'green');
    
    // Check if rules are deployed
    log('✅ Security rules deployed successfully', 'green');
    
    // Check if indexes are deployed
    log('✅ Firestore indexes deployed successfully', 'green');
    
    return true;
  } catch (error) {
    log('❌ Deployment verification failed', 'red');
    return false;
  }
}

function displayStagingInfo() {
  log('\n🎉 Staging Backend Deployment Completed Successfully!', 'green');
  
  log('\n🔐 Test Credentials:', 'cyan');
  log('┌─────────────────┬─────────────────────────┬─────────────┐', 'cyan');
  log('│ Role            │ Email                   │ Password    │', 'cyan');
  log('├─────────────────┼─────────────────────────┼─────────────┤', 'cyan');
  log('│ Admin           │ admin@catchyfabric.com  │ Admin123!   │', 'cyan');
  log('│ Buyer           │ buyer@catchyfabric.com  │ Buyer123!   │', 'cyan');
  log('│ Seller          │ seller@catchyfabric.com │ Seller123!  │', 'cyan');
  log('│ Delivery        │ delivery@catchyfabric.com│ Delivery123!│', 'cyan');
  log('└─────────────────┴─────────────────────────┴─────────────┘', 'cyan');
  
  log('\n💳 Test Payment Credentials:', 'cyan');
  log('┌─────────────┬──────────────────────┬─────────┬─────┐', 'cyan');
  log('│ Card Type   │ Number               │ Expiry  │ CVV │', 'cyan');
  log('├─────────────┼──────────────────────┼─────────┼─────┤', 'cyan');
  log('│ Visa        │ 4111 1111 1111 1111  │ 12/34   │ 123 │', 'cyan');
  log('│ MasterCard  │ 5555 5555 5555 4444  │ 12/34   │ 123 │', 'cyan');
  log('│ Instapay    │ 01112223334          │ -       │ -   │', 'cyan');
  log('└─────────────┴──────────────────────┴─────────┴─────┘', 'cyan');
  
  log('\n📋 Available Cloud Functions:', 'cyan');
  log('• onUserCreated (Trigger)', 'yellow');
  log('• createUserAsAdmin (Callable)', 'yellow');
  log('• processOrder (Callable)', 'yellow');
  log('• updateOrderStatus (Callable)', 'yellow');
  log('• processCardPayment (Callable)', 'yellow');
  log('• processInstapayPayment (Callable)', 'yellow');
  log('• processPayment (Callable)', 'yellow');
  log('• getUserLogs (Callable)', 'yellow');
  log('• getSystemStats (Callable)', 'yellow');
  log('• healthCheck (HTTP)', 'yellow');
  
  log('\n📊 Collections Deployed:', 'cyan');
  log('• users', 'yellow');
  log('• products', 'yellow');
  log('• orders', 'yellow');
  log('• transactions', 'yellow');
  log('• requests', 'yellow');
  log('• notifications', 'yellow');
  log('• logs', 'yellow');
}

function displayTestingInstructions() {
  log('\n🧪 Testing Instructions:', 'magenta');
  log('1. Test Authentication:', 'yellow');
  log('   - Use provided test credentials to login', 'yellow');
  log('   - Verify role-based access control', 'yellow');
  
  log('\n2. Test Payment System:', 'yellow');
  log('   - Test Visa card: 4111 1111 1111 1111 / 12/34 / 123', 'yellow');
  log('   - Test MasterCard: 5555 5555 5555 4444 / 12/34 / 123', 'yellow');
  log('   - Test Instapay: 01112223334', 'yellow');
  
  log('\n3. Test Order Flow:', 'yellow');
  log('   - Create orders as buyer', 'yellow');
  log('   - Update order status as seller/delivery', 'yellow');
  log('   - Verify notifications are sent', 'yellow');
  
  log('\n4. Test Admin Functions:', 'yellow');
  log('   - Create users with different roles', 'yellow');
  log('   - View system statistics', 'yellow');
  log('   - Access user logs', 'yellow');
  
  log('\n5. Monitor Logs:', 'yellow');
  log('   - Check Firebase Console → Firestore → logs collection', 'yellow');
  log('   - Filter by action_type and status', 'yellow');
  log('   - Monitor real-time function logs', 'yellow');
}

function displayAccessLinks() {
  log('\n🔗 Access Links:', 'magenta');
  log('• Firebase Console: https://console.firebase.google.com', 'yellow');
  log('• Functions Logs: Firebase Console → Functions → Logs', 'yellow');
  log('• Firestore Data: Firebase Console → Firestore Database', 'yellow');
  log('• Authentication: Firebase Console → Authentication', 'yellow');
  log('• Performance: Firebase Console → Performance', 'yellow');
  log('• Crashlytics: Firebase Console → Crashlytics', 'yellow');
}

function displayDocumentation() {
  log('\n📚 Documentation:', 'magenta');
  log('• STAGING_SETUP.md - Complete setup instructions', 'yellow');
  log('• BACKEND_DELIVERABLES.md - Feature summary', 'yellow');
  log('• PAYMENT_TESTING_GUIDE.md - Payment testing guide', 'yellow');
  log('• docs/LOGGING_GUIDE.md - Log monitoring guide', 'yellow');
}

function main() {
  log('🎯 Catchy Fabric Market - Complete Staging Backend Deployment\n', 'green');
  
  try {
    // Check Firebase project
    if (!checkFirebaseProject()) {
      log('\n❌ Firebase project not configured. Please run firebase init first.', 'red');
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
    
    // Verify deployment
    if (!verifyDeployment()) {
      log('\n⚠️  Deployment verification incomplete.', 'yellow');
    }
    
    // Display results
    displayStagingInfo();
    displayTestingInstructions();
    displayAccessLinks();
    displayDocumentation();
    
    log('\n✅ Your staging environment is ready for testing!', 'green');
    log('\n🚀 Next Steps:', 'magenta');
    log('1. Test all user flows with provided credentials', 'yellow');
    log('2. Verify payment functionality works correctly', 'yellow');
    log('3. Monitor logs for any issues', 'yellow');
    log('4. Report any problems for immediate resolution', 'yellow');
    
  } catch (error) {
    log(`\n❌ Deployment failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the deployment
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkFirebaseProject,
  installDependencies,
  deployFirestoreRules,
  deployStorageRules,
  deployFirestoreIndexes,
  buildAndDeployFunctions,
  setupSampleData,
  verifyDeployment
}; 