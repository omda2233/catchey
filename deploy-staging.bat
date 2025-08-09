@echo off
echo 🚀 Catchy Fabric Market - Staging Backend Deployment
echo.

echo 📋 Checking prerequisites...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI not found. Please install with: npm install -g firebase-tools
    pause
    exit /b 1
)

echo ✅ Firebase CLI found
echo.

echo 📦 Installing dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install main dependencies
    pause
    exit /b 1
)

cd functions
npm install
if errorlevel 1 (
    echo ❌ Failed to install function dependencies
    pause
    exit /b 1
)
cd ..

echo ✅ Dependencies installed
echo.

echo 🛡️ Deploying Firestore Security Rules...
firebase deploy --only firestore:rules
if errorlevel 1 (
    echo ❌ Failed to deploy Firestore rules
    pause
    exit /b 1
)

echo ✅ Firestore rules deployed
echo.

echo 📁 Deploying Storage Rules...
firebase deploy --only storage
if errorlevel 1 (
    echo ❌ Failed to deploy Storage rules
    pause
    exit /b 1
)

echo ✅ Storage rules deployed
echo.

echo 📊 Deploying Firestore Indexes...
firebase deploy --only firestore:indexes
if errorlevel 1 (
    echo ❌ Failed to deploy Firestore indexes
    pause
    exit /b 1
)

echo ✅ Firestore indexes deployed
echo.

echo 🔧 Building Cloud Functions...
cd functions
npm run build
if errorlevel 1 (
    echo ❌ Failed to build Cloud Functions
    pause
    exit /b 1
)
cd ..

echo ✅ Cloud Functions built
echo.

echo 🚀 Deploying Cloud Functions...
firebase deploy --only functions
if errorlevel 1 (
    echo ❌ Failed to deploy Cloud Functions
    pause
    exit /b 1
)

echo ✅ Cloud Functions deployed
echo.

echo 📊 Setting up sample data...
if exist "scripts\service-account-key.json" (
    node scripts\setupStagingData.js
    if errorlevel 1 (
        echo ⚠️ Sample data setup failed, but deployment completed
    ) else (
        echo ✅ Sample data created
    )
) else (
    echo ⚠️ Service account key not found. Sample data setup skipped.
    echo Please create service-account-key.json in scripts folder to enable sample data.
)

echo.
echo 🎉 Staging Backend Deployment Completed Successfully!
echo.
echo 🔐 Test Credentials:
echo ┌─────────────────┬─────────────────────────┬─────────────┐
echo │ Role            │ Email                   │ Password    │
echo ├─────────────────┼─────────────────────────┼─────────────┤
echo │ Admin           │ admin@catchyfabric.com  │ Admin123!   │
echo │ Buyer           │ buyer@catchyfabric.com  │ Buyer123!   │
echo │ Seller          │ seller@catchyfabric.com │ Seller123!  │
echo │ Delivery        │ delivery@catchyfabric.com│ Delivery123!│
echo └─────────────────┴─────────────────────────┴─────────────┘
echo.
echo 📋 Next Steps:
echo 1. Test authentication with provided credentials
echo 2. Verify all Cloud Functions are working
echo 3. Test security rules in Firebase Console
echo 4. Check logs in Firebase Console ^> Functions ^> Logs
echo 5. Monitor performance in Firebase Console ^> Performance
echo.
echo 🔗 Firebase Console: https://console.firebase.google.com
echo.
echo ✅ Your staging environment is ready for testing!
echo.
pause 