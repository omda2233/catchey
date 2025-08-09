@echo off
echo 🚀 Catchy Fabric Market - Complete Staging Backend Deployment
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
echo 🎉 Complete Staging Backend Deployment Completed Successfully!
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
echo 💳 Test Payment Credentials:
echo ┌─────────────┬──────────────────────┬─────────┬─────┐
echo │ Card Type   │ Number               │ Expiry  │ CVV │
echo ├─────────────┼──────────────────────┼─────────┼─────┤
echo │ Visa        │ 4111 1111 1111 1111  │ 12/34   │ 123 │
echo │ MasterCard  │ 5555 5555 5555 4444  │ 12/34   │ 123 │
echo │ Instapay    │ 01112223334          │ -       │ -   │
echo └─────────────┴──────────────────────┴─────────┴─────┘

echo.
echo 📋 Available Cloud Functions:
echo • onUserCreated (Trigger)
echo • createUserAsAdmin (Callable)
echo • processOrder (Callable)
echo • updateOrderStatus (Callable)
echo • processCardPayment (Callable)
echo • processInstapayPayment (Callable)
echo • processPayment (Callable)
echo • getUserLogs (Callable)
echo • getSystemStats (Callable)
echo • healthCheck (HTTP)

echo.
echo 📊 Collections Deployed:
echo • users
echo • products
echo • orders
echo • transactions
echo • requests
echo • notifications
echo • logs

echo.
echo 🧪 Testing Instructions:
echo 1. Test Authentication with provided credentials
echo 2. Test Payment System with test cards
echo 3. Test Order Flow (create, update, ship)
echo 4. Test Admin Functions (user management, logs)
echo 5. Monitor Logs in Firebase Console

echo.
echo 🔗 Access Links:
echo • Firebase Console: https://console.firebase.google.com
echo • Functions Logs: Firebase Console ^> Functions ^> Logs
echo • Firestore Data: Firebase Console ^> Firestore Database
echo • Authentication: Firebase Console ^> Authentication

echo.
echo 📚 Documentation:
echo • STAGING_SETUP.md - Complete setup instructions
echo • BACKEND_DELIVERABLES.md - Feature summary
echo • PAYMENT_TESTING_GUIDE.md - Payment testing guide
echo • docs/LOGGING_GUIDE.md - Log monitoring guide
echo • STAGING_STATUS.md - Current status document

echo.
echo ✅ Your staging environment is ready for testing!
echo.
echo 🚀 Next Steps:
echo 1. Test all user flows with provided credentials
echo 2. Verify payment functionality works correctly
echo 3. Monitor logs for any issues
echo 4. Report any problems for immediate resolution
echo.
pause 