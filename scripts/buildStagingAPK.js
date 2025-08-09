const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Catchy Fabric Market - Staging APK Build\n');

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

function checkPrerequisites() {
  log('🔍 Checking build prerequisites...', 'blue');
  
  // Check Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' });
    log(`✅ Node.js version: ${nodeVersion.trim()}`, 'green');
  } catch (error) {
    log('❌ Node.js not found', 'red');
    return false;
  }
  
  // Check npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' });
    log(`✅ npm version: ${npmVersion.trim()}`, 'green');
  } catch (error) {
    log('❌ npm not found', 'red');
    return false;
  }
  
  // Check Capacitor CLI
  try {
    const capacitorVersion = execSync('npx cap --version', { encoding: 'utf8' });
    log(`✅ Capacitor version: ${capacitorVersion.trim()}`, 'green');
  } catch (error) {
    log('❌ Capacitor CLI not found', 'red');
    return false;
  }
  
  // Check Android SDK
  try {
    const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
    if (!androidHome) {
      log('⚠️  ANDROID_HOME not set', 'yellow');
    } else {
      log(`✅ Android SDK found at: ${androidHome}`, 'green');
    }
  } catch (error) {
    log('⚠️  Android SDK not configured', 'yellow');
  }
  
  return true;
}

function installDependencies() {
  log('📦 Installing project dependencies...', 'blue');
  
  if (!runCommand('npm install', 'Installing main dependencies')) {
    return false;
  }
  
  return true;
}

function buildWebApp() {
  log('🌐 Building web application...', 'blue');
  
  // Set environment variables for staging
  process.env.NODE_ENV = 'staging';
  process.env.VITE_APP_ENV = 'staging';
  
  if (!runCommand('npm run build', 'Building web app')) {
    return false;
  }
  
  return true;
}

function syncCapacitor() {
  log('📱 Syncing with Capacitor...', 'blue');
  
  if (!runCommand('npx cap sync', 'Syncing Capacitor')) {
    return false;
  }
  
  return true;
}

function buildAndroidAPK() {
  log('🤖 Building Android APK...', 'blue');
  
  // Navigate to android directory
  const androidDir = path.join(__dirname, '..', 'android');
  
  if (!fs.existsSync(androidDir)) {
    log('❌ Android directory not found', 'red');
    return false;
  }
  
  // Change to android directory
  process.chdir(androidDir);
  
  // Clean previous builds
  if (!runCommand('./gradlew clean', 'Cleaning previous builds', true)) {
    log('⚠️  Clean failed, continuing...', 'yellow');
  }
  
  // Build debug APK
  if (!runCommand('./gradlew assembleDebug', 'Building debug APK')) {
    return false;
  }
  
  // Build release APK
  if (!runCommand('./gradlew assembleRelease', 'Building release APK')) {
    log('⚠️  Release build failed, debug APK available', 'yellow');
  }
  
  // Return to project root
  process.chdir(path.join(__dirname, '..'));
  
  return true;
}

function copyAPKFiles() {
  log('📁 Copying APK files...', 'blue');
  
  const androidDir = path.join(__dirname, '..', 'android');
  const outputDir = path.join(__dirname, '..', 'build', 'apk');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Copy debug APK
  const debugAPK = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  const releaseAPK = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
  
  if (fs.existsSync(debugAPK)) {
    const debugDest = path.join(outputDir, 'catchy-fabric-market-staging-debug.apk');
    fs.copyFileSync(debugAPK, debugDest);
    log(`✅ Debug APK copied: ${debugDest}`, 'green');
  }
  
  if (fs.existsSync(releaseAPK)) {
    const releaseDest = path.join(outputDir, 'catchy-fabric-market-staging-release.apk');
    fs.copyFileSync(releaseAPK, releaseDest);
    log(`✅ Release APK copied: ${releaseDest}`, 'green');
  }
  
  return true;
}

function createFirebaseConfig() {
  log('🔥 Creating Firebase configuration...', 'blue');
  
  const firebaseConfigPath = path.join(__dirname, '..', 'android', 'app', 'google-services.json');
  const stagingConfigPath = path.join(__dirname, '..', 'build', 'google-services-staging.json');
  
  if (fs.existsSync(firebaseConfigPath)) {
    // Copy existing config
    fs.copyFileSync(firebaseConfigPath, stagingConfigPath);
    log(`✅ Firebase config copied: ${stagingConfigPath}`, 'green');
  } else {
    log('⚠️  No google-services.json found. Please add your Firebase config.', 'yellow');
    log('   Expected location: android/app/google-services.json', 'yellow');
  }
  
  return true;
}

function createBuildInfo() {
  log('📝 Creating build information...', 'blue');
  
  const buildInfo = {
    buildDate: new Date().toISOString(),
    version: '1.0.0-staging',
    environment: 'staging',
    features: [
      'Authentication with role-based access',
      'Product catalog management',
      'Order processing',
      'Payment system (test mode)',
      'Real-time notifications',
      'Comprehensive logging',
      'Admin dashboard',
      'Shipping management'
    ],
    testCredentials: {
      admin: 'admin@catchyfabric.com / Admin123!',
      buyer: 'buyer@catchyfabric.com / Buyer123!',
      seller: 'seller@catchyfabric.com / Seller123!',
      delivery: 'delivery@catchyfabric.com / Delivery123!'
    },
    paymentTestData: {
      visa: '4111 1111 1111 1111 / 12/34 / 123',
      mastercard: '5555 5555 5555 4444 / 12/34 / 123',
      instapay: '01112223334'
    },
    cloudFunctions: [
      'onUserCreated',
      'createUserAsAdmin',
      'processOrder',
      'updateOrderStatus',
      'processCardPayment',
      'processInstapayPayment',
      'processPayment',
      'getUserLogs',
      'getSystemStats',
      'healthCheck'
    ]
  };
  
  const buildInfoPath = path.join(__dirname, '..', 'build', 'build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  log(`✅ Build info created: ${buildInfoPath}`, 'green');
  
  return true;
}

function displayBuildResults() {
  log('\n🎉 Staging APK Build Completed Successfully!', 'green');
  
  const buildDir = path.join(__dirname, '..', 'build');
  const apkDir = path.join(buildDir, 'apk');
  
  log('\n📱 Generated APK Files:', 'cyan');
  if (fs.existsSync(apkDir)) {
    const files = fs.readdirSync(apkDir);
    files.forEach(file => {
      if (file.endsWith('.apk')) {
        const filePath = path.join(apkDir, file);
        const stats = fs.statSync(filePath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        log(`• ${file} (${sizeMB} MB)`, 'yellow');
      }
    });
  }
  
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
  
  log('\n📋 Available Features:', 'cyan');
  log('• User authentication with role-based access', 'yellow');
  log('• Product catalog browsing and management', 'yellow');
  log('• Order creation and management', 'yellow');
  log('• Payment processing (test mode)', 'yellow');
  log('• Real-time notifications', 'yellow');
  log('• Admin dashboard and user management', 'yellow');
  log('• Shipping and delivery tracking', 'yellow');
  log('• Comprehensive logging and monitoring', 'yellow');
  
  log('\n🧪 Testing Instructions:', 'magenta');
  log('1. Install the APK on an Android device', 'yellow');
  log('2. Use provided test credentials to login', 'yellow');
  log('3. Test all user flows (buyer, seller, admin, delivery)', 'yellow');
  log('4. Verify payment functionality with test cards', 'yellow');
  log('5. Check real-time notifications and updates', 'yellow');
  log('6. Monitor logs in Firebase Console', 'yellow');
  
  log('\n📊 Monitoring:', 'magenta');
  log('• Firebase Console: https://console.firebase.google.com', 'yellow');
  log('• Functions Logs: Console → Functions → Logs', 'yellow');
  log('• Firestore Data: Console → Firestore Database', 'yellow');
  log('• Authentication: Console → Authentication', 'yellow');
  
  log('\n✅ Your staging APK is ready for testing!', 'green');
}

function main() {
  log('🎯 Catchy Fabric Market - Staging APK Build\n', 'green');
  
  try {
    // Check prerequisites
    if (!checkPrerequisites()) {
      log('\n❌ Prerequisites check failed.', 'red');
      process.exit(1);
    }
    
    // Install dependencies
    if (!installDependencies()) {
      log('\n❌ Dependency installation failed.', 'red');
      process.exit(1);
    }
    
    // Build web app
    if (!buildWebApp()) {
      log('\n❌ Web app build failed.', 'red');
      process.exit(1);
    }
    
    // Sync Capacitor
    if (!syncCapacitor()) {
      log('\n❌ Capacitor sync failed.', 'red');
      process.exit(1);
    }
    
    // Build Android APK
    if (!buildAndroidAPK()) {
      log('\n❌ Android APK build failed.', 'red');
      process.exit(1);
    }
    
    // Copy APK files
    if (!copyAPKFiles()) {
      log('\n❌ APK file copying failed.', 'red');
      process.exit(1);
    }
    
    // Create Firebase config
    if (!createFirebaseConfig()) {
      log('\n⚠️  Firebase config creation failed.', 'yellow');
    }
    
    // Create build info
    if (!createBuildInfo()) {
      log('\n⚠️  Build info creation failed.', 'yellow');
    }
    
    // Display results
    displayBuildResults();
    
  } catch (error) {
    log(`\n❌ Build failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the build
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkPrerequisites,
  installDependencies,
  buildWebApp,
  syncCapacitor,
  buildAndroidAPK,
  copyAPKFiles,
  createFirebaseConfig,
  createBuildInfo
}; 