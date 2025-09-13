#!/bin/bash

# Catchy Fabric Market - Flutter App Setup Script
# This script helps you set up and run the Flutter mobile application

echo "🎯 Catchy Fabric Market - Flutter App Setup"
echo "============================================="

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter first:"
    echo "   https://flutter.dev/docs/get-started/install"
    exit 1
fi

echo "✅ Flutter is installed"

# Check Flutter version
FLUTTER_VERSION=$(flutter --version | head -n 1)
echo "📱 $FLUTTER_VERSION"

# Get dependencies
echo "📦 Installing dependencies..."
flutter pub get

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check Firebase configuration
echo "🔥 Checking Firebase configuration..."

if [ -f "android/app/google-services.json" ]; then
    echo "✅ Android Firebase config found"
else
    echo "❌ android/app/google-services.json not found"
    echo "   Please ensure your Firebase configuration file is in place"
fi

if [ -f "ios/Runner/GoogleService-Info.plist" ]; then
    echo "✅ iOS Firebase config found"
else
    echo "❌ ios/Runner/GoogleService-Info.plist not found"
    echo "   Please ensure your Firebase configuration file is in place"
fi

# Check for connected devices
echo "📱 Checking for connected devices..."
flutter devices

echo ""
echo "🚀 Setup complete! You can now run the app with:"
echo ""
echo "   flutter run                    # Run on connected device"
echo "   flutter run -d android         # Run on Android"
echo "   flutter run -d ios             # Run on iOS"
echo ""
echo "📱 Test Credentials:"
echo "   Admin:  admin@catchyfabric.com / Admin123!"
echo "   Buyer:  buyer@catchyfabric.com / Buyer123!"
echo "   Seller: seller@catchyfabric.com / Seller123!"
echo "   Delivery: delivery@catchyfabric.com / Delivery123!"
echo ""
echo "💳 Test Payment Data:"
echo "   Visa: 4111111111111111"
echo "   MasterCard: 5555555555554444"
echo "   Expiry: 12/34, CVV: 123"
echo "   Instapay: 01112223334"
echo ""
echo "🎯 Happy coding!"
