# 🚀 Catchy Fabric Market - Production Credentials

## 📋 Test User Accounts

### 👤 Buyer Account
- **Email**: `buyer@catchy.com`
- **Password**: `Buyer123!`
- **Role**: Buyer (user)
- **Name**: Ahmed Hassan
- **Phone**: +201234567890
- **Address**: Cairo, Egypt

### 🏪 Seller Account
- **Email**: `seller@catchy.com`
- **Password**: `Seller123!`
- **Role**: Seller
- **Name**: Fatima Ali
- **Phone**: +201234567891
- **Company**: Fatima Fabrics
- **Address**: Alexandria, Egypt

### 👨‍💼 Admin Account
- **Email**: `admin@catchy.com`
- **Password**: `Admin123!`
- **Role**: Admin
- **Name**: Mohamed Admin
- **Phone**: +201234567892
- **Company**: Catchy Admin
- **Address**: Giza, Egypt

### 🚚 Shipping Account
- **Email**: `shipping@catchy.com`
- **Password**: `Shipping123!`
- **Role**: Shipping
- **Name**: Omar Shipping
- **Phone**: +201234567893
- **Company**: Fast Delivery Co.
- **Address**: Port Said, Egypt

## 💳 Test Payment Cards

### Visa Card 1
- **Card Number**: `4242424242424242`
- **Expiry**: `12/34`
- **CVV**: `123`
- **Description**: Always succeeds

### Visa Card 2
- **Card Number**: `4000056655665556`
- **Expiry**: `11/33`
- **CVV**: `456`
- **Description**: Always succeeds

## 🔧 Setup Instructions

### 1. Create Test Users
Run the setup script to create test users in Firebase:
```bash
node scripts/setupTestUsers.js
```

### 2. Firebase Configuration
The app is configured to use the production Firebase project:
- **Project ID**: `catchy-fabric-market`
- **Auth Domain**: `catchy-fabric-market.firebaseapp.com`
- **Storage Bucket**: `catchy-fabric-market.firebasestorage.app`

### 3. Security Rules
Firebase security rules ensure:
- Users can only access their own data
- Role-based access control is enforced
- All data is tied to Firebase Auth UID

## 🛡️ Security Features

### Authentication
- ✅ Firebase Auth integration
- ✅ Email verification
- ✅ Password reset functionality
- ✅ Biometric authentication (Android/iOS)
- ✅ Secure session management

### Data Protection
- ✅ UID-based data isolation
- ✅ Role-based access control
- ✅ Firestore security rules
- ✅ No mock/static data in production

### Payment Security
- ✅ Test card validation
- ✅ Secure payment processing
- ✅ Transaction logging
- ✅ Payment status tracking

## 📱 App Features

### Core Functionality
- ✅ User registration and login
- ✅ Product browsing and search
- ✅ Shopping cart management
- ✅ Order placement and tracking
- ✅ Payment processing
- ✅ Real-time notifications
- ✅ Multi-language support (EN/AR)

### Role-Based Features
- **Buyer**: Browse products, place orders, make payments
- **Seller**: Manage products, view orders, track sales
- **Admin**: User management, system oversight
- **Shipping**: Order fulfillment, delivery tracking

## 🚀 Production Build

### Android APK
1. Build the production version:
   ```bash
   npm run build
   npx cap sync android
   ```

2. Open Android Studio and build the APK:
   - Open `android/` folder in Android Studio
   - Build → Build Bundle(s) / APK(s) → Build APK(s)

### iOS App
1. Build for iOS:
   ```bash
   npm run build
   npx cap sync ios
   ```

2. Open Xcode and build:
   - Open `ios/App.xcworkspace` in Xcode
   - Product → Archive

## 🔍 Testing Checklist

### Authentication
- [ ] Login with all test accounts
- [ ] Biometric authentication
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Logout functionality

### Core Features
- [ ] Product browsing
- [ ] Shopping cart
- [ ] Order placement
- [ ] Payment processing
- [ ] Real-time notifications

### Role-Based Access
- [ ] Buyer dashboard
- [ ] Seller product management
- [ ] Admin user management
- [ ] Shipping order fulfillment

### Payment Testing
- [ ] Test card validation
- [ ] Deposit payments
- [ ] Full payments
- [ ] Payment confirmation
- [ ] Order status updates

## 📞 Support

For any issues or questions:
1. Check Firebase Console for errors
2. Verify test user credentials
3. Ensure Firebase services are enabled
4. Test with provided test cards

---

**⚠️ Important**: These are test credentials for development and testing purposes only. Do not use in production with real payment information. 