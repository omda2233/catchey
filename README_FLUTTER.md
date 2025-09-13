# 🎯 Catchy Fabric Market - Flutter Mobile App

A comprehensive Flutter mobile application for a fabric marketplace with role-based access control, Firebase integration, and modern UI design.

## 🚀 Features

### 🔐 Authentication & User Management
- **Firebase Authentication** with email/password
- **Role-based access control**: Buyer, Seller, Delivery, Admin
- **Email verification** and password reset
- **Admin user creation** with specific roles

### 🛒 E-commerce Functionality
- **Product browsing** and search
- **Shopping cart** management
- **Order processing** with real-time status updates
- **Payment integration** (Card & Instapay)
- **Order tracking** for all user types

### 👥 Role-Based Dashboards

#### 🛍️ Buyer Dashboard
- Browse and search products
- Add items to cart
- Place orders
- Track order status
- Payment processing

#### 🏪 Seller Dashboard
- Manage products (add, edit, delete)
- View and process orders
- Update order status
- Sales analytics

#### 🚚 Delivery Dashboard
- View assigned orders
- Update delivery status
- Track delivery progress
- Delivery statistics

#### 👨‍💼 Admin Dashboard
- System overview and statistics
- User management
- Order monitoring
- Create users with specific roles

### 🔔 Notifications
- **Firebase Cloud Messaging** integration
- **Real-time notifications** for order updates
- **Push notifications** for important events

### 🌍 Internationalization
- **Arabic and English** language support
- **RTL (Right-to-Left)** layout support
- **Dynamic language switching**

## 🛠️ Technical Stack

- **Flutter** (Latest stable version)
- **Firebase** (Authentication, Firestore, Cloud Functions, Messaging)
- **Provider** (State management)
- **Material Design** with custom theming
- **Google Fonts** (Cairo & Roboto)

## 📱 Supported Platforms

- ✅ **Android** (API 21+)
- ✅ **iOS** (iOS 11+)

## 🚀 Getting Started

### Prerequisites

1. **Flutter SDK** (3.0.0 or higher)
2. **Dart SDK** (2.17.0 or higher)
3. **Android Studio** / **VS Code**
4. **Firebase project** with the following services enabled:
   - Authentication
   - Firestore Database
   - Cloud Functions
   - Cloud Messaging

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd catchy-fabric-market
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Firebase Configuration**

   #### Android Setup
   - Place your `google-services.json` file in `android/app/`
   - The file should already be present from your existing Firebase project

   #### iOS Setup
   - Place your `GoogleService-Info.plist` file in `ios/Runner/`
   - The file should already be present from your existing Firebase project

4. **Firebase Cloud Functions**
   - Your existing Cloud Functions are already deployed and configured
   - The app will automatically connect to your live Firebase project

### 🏃‍♂️ Running the App

#### Development Mode
```bash
# Run on Android
flutter run

# Run on iOS
flutter run -d ios

# Run on specific device
flutter run -d <device-id>
```

#### Production Builds

##### Android APK
```bash
flutter build apk --release
```

##### Android App Bundle (Recommended for Play Store)
```bash
flutter build appbundle --release
```

##### iOS
```bash
flutter build ios --release
```

## 🔧 Configuration

### Firebase Project Connection

The app is configured to connect to your existing Firebase project:
- **Project ID**: `catchy-fabric-market`
- **Region**: `europe-west3`

### API Endpoints

The app uses your existing Firebase Cloud Functions:
- `processOrder` - Create new orders
- `updateOrderStatus` - Update order status
- `processCardPayment` - Process card payments
- `processInstapayPayment` - Process Instapay payments
- `createUserAsAdmin` - Admin user creation

### Test Credentials

Use these test accounts for development:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@catchyfabric.com | Admin123! |
| **Buyer** | buyer@catchyfabric.com | Buyer123! |
| **Seller** | seller@catchyfabric.com | Seller123! |
| **Delivery** | delivery@catchyfabric.com | Delivery123! |

### Test Payment Data

#### Card Payments
- **Visa**: `4111111111111111`
- **MasterCard**: `5555555555554444`
- **Expiry**: `12/34`
- **CVV**: `123`

#### Instapay
- **Number**: `01112223334`

## 📁 Project Structure

```
lib/
├── models/           # Data models
│   ├── user_model.dart
│   ├── product_model.dart
│   ├── order_model.dart
│   ├── transaction_model.dart
│   └── notification_model.dart
├── services/         # Business logic
│   ├── auth_service.dart
│   ├── order_service.dart
│   ├── payment_service.dart
│   └── notification_service.dart
├── providers/        # State management
│   ├── auth_provider.dart
│   ├── cart_provider.dart
│   └── theme_provider.dart
├── screens/          # UI screens
│   ├── buyer/
│   ├── seller/
│   ├── delivery/
│   ├── admin/
│   └── shared/
├── widgets/          # Reusable components
├── utils/            # Utilities and themes
└── l10n/            # Internationalization
```

## 🔒 Security Features

- **Firebase Security Rules** for data protection
- **Role-based access control** at the API level
- **Input validation** and sanitization
- **Secure payment processing** through Cloud Functions
- **Token-based authentication**

## 🌐 Internationalization

The app supports both Arabic and English:
- **Arabic (ar)**: RTL layout with Cairo font
- **English (en)**: LTR layout with Roboto font
- **Dynamic switching** without app restart

## 📱 UI/UX Features

- **Material Design 3** components
- **Dark/Light theme** support
- **Responsive design** for different screen sizes
- **Loading states** and error handling
- **Smooth animations** and transitions
- **Accessibility** support

## 🚀 Deployment

### Android Play Store
1. Build release APK/AAB
2. Upload to Google Play Console
3. Configure app signing
4. Submit for review

### iOS App Store
1. Build release iOS app
2. Upload to App Store Connect
3. Configure app metadata
4. Submit for review

## 🔧 Troubleshooting

### Common Issues

1. **Firebase connection issues**
   - Verify `google-services.json` and `GoogleService-Info.plist` are in correct locations
   - Check Firebase project configuration

2. **Build errors**
   - Run `flutter clean` and `flutter pub get`
   - Check Flutter and Dart SDK versions

3. **Payment processing errors**
   - Verify Cloud Functions are deployed
   - Check test payment credentials

### Debug Mode
```bash
flutter run --debug
```

## 📞 Support

For technical support or questions:
- Check the existing backend documentation
- Review Firebase console for logs
- Test with provided test credentials

## 🎯 Next Steps

1. **Test the app** with provided credentials
2. **Customize UI** to match your brand
3. **Add more features** as needed
4. **Deploy to app stores**

---

**Built with ❤️ using Flutter and Firebase**
