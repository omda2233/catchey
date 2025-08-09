# 🚀 Catchy Fabric Market - Staging Backend Setup

This document provides complete instructions for setting up the staging backend environment for the Catchy Fabric Market app.

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- Git repository cloned

## 🔧 Initial Setup

### 1. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### 2. Firebase Configuration

```bash
# Login to Firebase
firebase login

# Initialize Firebase project (if not already done)
firebase init

# Select your Firebase project
firebase use --add
```

### 3. Enable Firebase Services

In the Firebase Console, enable the following services:

- **Authentication**
  - Email/Password provider
  - Custom claims support

- **Firestore Database**
  - Create database in test mode initially

- **Cloud Functions**
  - Enable billing (required for Cloud Functions)

- **Storage**
  - Create storage bucket

- **Performance Monitoring**
  - Enable for web and mobile

- **Crashlytics**
  - Enable for Android and iOS

## 🏗️ Deploy Backend Components

### 1. Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

### 2. Deploy Storage Rules

```bash
firebase deploy --only storage
```

### 3. Deploy Cloud Functions

```bash
# Build TypeScript functions
cd functions
npm run build
cd ..

# Deploy functions
firebase deploy --only functions
```

### 4. Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

## 📊 Setup Sample Data

### 1. Configure Service Account

Create a service account key in Firebase Console:
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file as `service-account-key.json` in the `scripts/` folder

### 2. Update Sample Data Script

Edit `scripts/setupStagingData.js` and uncomment the admin initialization:

```javascript
admin.initializeApp({
  credential: admin.credential.cert(require('./service-account-key.json'))
});
```

### 3. Run Sample Data Setup

```bash
node scripts/setupStagingData.js
```

## 🔐 Test Credentials

After running the sample data setup, you'll have these test accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@catchyfabric.com | Admin123! |
| **Buyer** | buyer@catchyfabric.com | Buyer123! |
| **Seller** | seller@catchyfabric.com | Seller123! |
| **Delivery** | delivery@catchyfabric.com | Delivery123! |

## 📁 Firestore Collections Structure

### users
```javascript
{
  name: string,
  email: string,
  role: 'admin' | 'buyer' | 'seller' | 'delivery',
  created_at: timestamp
}
```

### products
```javascript
{
  seller_id: string,
  name: string,
  category: string,
  price: number,
  description: string,
  images: string[],
  created_at: timestamp
}
```

### orders
```javascript
{
  buyer_id: string,
  seller_id: string,
  delivery_id: string | null,
  items: Array<{
    product_id: string,
    quantity: number,
    price: number
  }>,
  status: string,
  total_amount: number,
  created_at: timestamp,
  updated_at: timestamp
}
```

### transactions
```javascript
{
  user_id: string,
  order_id: string,
  amount: number,
  method: string,
  type: 'booking' | 'shipping',
  status: string,
  created_at: timestamp
}
```

### requests
```javascript
{
  user_id: string,
  type: 'withdraw' | 'review',
  details: object,
  status: string,
  created_at: timestamp
}
```

### notifications
```javascript
{
  user_id: string,
  title: string,
  body: string,
  sent_at: timestamp,
  read: boolean
}
```

### logs
```javascript
{
  user_id: string,
  action_type: string,
  status: string,
  timestamp: timestamp,
  deviceInfo: object,
  errorMessage: string | null
}
```

## 🛡️ Security Rules Summary

### Users
- Users can read/write their own profile
- Admins can read/write all users
- Role changes restricted to admins only

### Products
- Anyone can read products
- Only sellers and admins can write products

### Orders
- Related users (buyer, seller, delivery) can read/write
- Admins have full access

### Transactions
- Users can read/write their own transactions
- Admins have full access

### Notifications & Logs
- Users can read their own
- Only Cloud Functions can write

## 🔧 Cloud Functions

### Available Functions

1. **onUserCreated** - Triggered when new user signs up
2. **createUserAsAdmin** - Admin function to create users with specific roles
3. **processOrder** - Process order creation with notifications
4. **updateOrderStatus** - Update order status with permission checks
5. **processCardPayment** - Process credit card payments (Visa/MasterCard)
6. **processInstapayPayment** - Process Instapay payments
7. **processPayment** - Legacy payment function (backward compatibility)
8. **getUserLogs** - Admin function to view user logs
9. **getSystemStats** - Admin function to view system statistics
10. **healthCheck** - HTTP endpoint for health monitoring

### Function Permissions

- All functions require authentication
- Admin functions check for admin role
- Order functions check for related user permissions

## 📊 Monitoring & Logging

### View Logs

1. **Firebase Console**
   - Go to Functions > Logs
   - Filter by function name or error type

2. **Cloud Functions Logs**
   ```bash
   firebase functions:log
   ```

3. **Firestore Logs**
   - Check the `logs` collection in Firestore
   - Query by user_id or action_type

### Performance Monitoring

- Monitor function execution times
- Track database read/write operations
- Monitor authentication events

## 🧪 Testing

### 1. Test Authentication

```bash
# Test with curl
curl -X POST "https://your-project.cloudfunctions.net/healthCheck"
```

### 2. Test Cloud Functions

Use the Firebase Console or test locally:

```bash
# Start emulators
firebase emulators:start

# Test functions locally
firebase functions:shell
```

### 3. Test Security Rules

```bash
# Test rules in emulator
firebase emulators:start --only firestore
```

### 4. Test Payment Functions

```bash
# Test card payment
curl -X POST "https://your-project.cloudfunctions.net/processCardPayment" \
  -H "Content-Type: application/json" \
  -d '{
    "cardNumber": "4111 1111 1111 1111",
    "expiryDate": "12/34",
    "cvv": "123",
    "amount": 50.00
  }'

# Test Instapay payment
curl -X POST "https://your-project.cloudfunctions.net/processInstapayPayment" \
  -H "Content-Type: application/json" \
  -d '{
    "instapayNumber": "01112223334",
    "amount": 30.00
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **Functions not deploying**
   - Check billing is enabled
   - Verify Node.js version (18+)
   - Check function logs for errors

2. **Security Rules errors**
   - Test rules in emulator first
   - Check syntax in firestore.rules

3. **Authentication issues**
   - Verify custom claims are set correctly
   - Check user roles in Firebase Auth

4. **Permission denied errors**
   - Verify user has correct role
   - Check security rules match expected behavior

### Debug Commands

```bash
# View function logs
firebase functions:log --only functionName

# Test security rules
firebase emulators:start --only firestore

# Check project status
firebase projects:list
```

## 📞 Support

For issues with the staging backend:

1. Check the logs in Firebase Console
2. Review security rules configuration
3. Verify Cloud Functions deployment
4. Test with provided sample credentials

## ✅ Deployment Checklist

- [ ] Firebase project configured
- [ ] All services enabled (Auth, Firestore, Functions, Storage)
- [ ] Security rules deployed
- [ ] Cloud Functions deployed
- [ ] Sample data created
- [ ] Test credentials working
- [ ] Monitoring enabled
- [ ] Logs accessible
- [ ] All flows tested end-to-end

---

**Staging Environment Ready! 🎉**

Your staging backend is now fully configured and ready for testing. Use the provided test credentials to verify all functionality works as expected. 