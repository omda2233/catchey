# 📊 Logging Guide - Catchy Fabric Market Staging

This guide provides comprehensive instructions for monitoring and debugging the staging backend through logs and real-time tracking.

## 🔍 Log Structure

### Firestore Logs Collection
All system actions are logged in the `logs` collection with the following structure:

```javascript
{
  user_id: string,           // User who performed the action
  action_type: string,       // Type of action performed
  status: string,           // 'success' | 'error' | 'pending'
  timestamp: timestamp,     // When the action occurred
  deviceInfo: object,       // Device/browser information
  errorMessage: string | null, // Error details if failed
  details: object           // Additional action-specific data
}
```

## 📋 Action Types

### Authentication Actions
- `user_created` - New user registration
- `user_login` - User login attempts
- `user_logout` - User logout
- `password_reset` - Password reset requests
- `profile_updated` - User profile updates

### Order Actions
- `order_created` - New order placement
- `order_status_updated` - Order status changes
- `order_cancelled` - Order cancellation
- `order_shipped` - Order shipping updates

### Payment Actions
- `card_payment_processed` - Credit card payment attempts
- `instapay_payment_processed` - Instapay payment attempts
- `payment_failed` - Failed payment attempts
- `refund_processed` - Payment refunds

### Product Actions
- `product_created` - New product added
- `product_updated` - Product information updates
- `product_deleted` - Product removal

### Admin Actions
- `admin_create_user` - Admin user creation
- `admin_update_user` - Admin user updates
- `admin_delete_user` - Admin user deletion
- `system_stats_viewed` - System statistics accessed

### Shipping Actions
- `shipping_assigned` - Delivery person assigned
- `shipping_status_updated` - Shipping status changes
- `shipping_completed` - Delivery completed

## 🔧 Log Viewer Options

### 1. Firebase Console (Recommended)

#### Access Logs:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database**
4. Go to the `logs` collection

#### Filter Logs:
```javascript
// Filter by action type
logs.where('action_type', '==', 'card_payment_processed')

// Filter by user
logs.where('user_id', '==', 'specific_user_id')

// Filter by status
logs.where('status', '==', 'error')

// Filter by date range
logs.where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
```

### 2. Cloud Functions Logs

#### Access Function Logs:
1. Firebase Console → **Functions**
2. Click on **Logs** tab
3. Filter by function name or error type

#### View Real-time Logs:
```bash
# View all function logs
firebase functions:log

# View specific function logs
firebase functions:log --only processCardPayment

# View logs with timestamps
firebase functions:log --only processCardPayment --since 1h
```

### 3. Admin Log Viewer Function

Use the `getUserLogs` Cloud Function for programmatic access:

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const getUserLogs = httpsCallable(functions, 'getUserLogs');

// Get all logs (admin only)
const result = await getUserLogs({
  limit: 100
});

// Get logs for specific user
const result = await getUserLogs({
  userId: 'user_id_here',
  limit: 50
});
```

## 🚨 Debugging Common Issues

### 1. Payment Failures

#### Check Payment Logs:
```javascript
// Filter failed payments
logs.where('action_type', 'in', ['card_payment_processed', 'instapay_payment_processed'])
    .where('status', '==', 'error')
```

#### Common Payment Issues:
- **Invalid test credentials** - Check card number, expiry, CVV
- **Authentication errors** - User not logged in
- **Missing required fields** - Incomplete payment data

#### Debug Steps:
1. Check `errorMessage` field in logs
2. Verify test credentials match exactly
3. Ensure user is authenticated
4. Check function execution logs

### 2. Order Processing Issues

#### Check Order Logs:
```javascript
// Filter order-related actions
logs.where('action_type', 'in', ['order_created', 'order_status_updated'])
    .orderBy('timestamp', 'desc')
```

#### Common Order Issues:
- **Permission denied** - User not authorized
- **Missing product data** - Product not found
- **Invalid order status** - Status transition not allowed

#### Debug Steps:
1. Check user role and permissions
2. Verify product exists in database
3. Check order status flow
4. Review security rules

### 3. Authentication Issues

#### Check Auth Logs:
```javascript
// Filter authentication actions
logs.where('action_type', 'in', ['user_created', 'user_login', 'user_logout'])
    .orderBy('timestamp', 'desc')
```

#### Common Auth Issues:
- **User creation failed** - Email already exists
- **Login failed** - Invalid credentials
- **Role assignment failed** - Custom claims not set

#### Debug Steps:
1. Check Firebase Auth console
2. Verify custom claims are set
3. Check user document in Firestore
4. Review authentication triggers

## 📊 Real-time Monitoring

### 1. Set Up Log Alerts

#### Firebase Console Alerts:
1. Go to **Functions** → **Logs**
2. Set up alerts for error conditions
3. Configure email notifications

#### Custom Monitoring:
```javascript
// Monitor error rates
const errorLogs = logs.where('status', '==', 'error')
                     .where('timestamp', '>=', oneHourAgo);

// Monitor payment success rates
const paymentLogs = logs.where('action_type', 'in', ['card_payment_processed', 'instapay_payment_processed']);
```

### 2. Performance Monitoring

#### Function Execution Times:
- Check **Functions** → **Performance** tab
- Monitor cold start times
- Track memory usage

#### Database Performance:
- Check **Firestore** → **Usage** tab
- Monitor read/write operations
- Track query performance

## 🔍 Log Analysis Examples

### 1. Payment Success Rate Analysis

```javascript
// Get payment logs for last 24 hours
const paymentLogs = logs.where('action_type', 'in', ['card_payment_processed', 'instapay_payment_processed'])
                       .where('timestamp', '>=', yesterday);

// Calculate success rate
const totalPayments = paymentLogs.size;
const successfulPayments = paymentLogs.where('status', '==', 'success').size;
const successRate = (successfulPayments / totalPayments) * 100;
```

### 2. User Activity Tracking

```javascript
// Get user activity for specific user
const userActivity = logs.where('user_id', '==', 'user_id_here')
                        .orderBy('timestamp', 'desc')
                        .limit(50);

// Group by action type
const activitySummary = userActivity.reduce((acc, log) => {
  acc[log.action_type] = (acc[log.action_type] || 0) + 1;
  return acc;
}, {});
```

### 3. Error Pattern Analysis

```javascript
// Get all errors for debugging
const errors = logs.where('status', '==', 'error')
                  .orderBy('timestamp', 'desc')
                  .limit(100);

// Group by action type to identify problematic areas
const errorPatterns = errors.reduce((acc, log) => {
  acc[log.action_type] = (acc[log.action_type] || 0) + 1;
  return acc;
}, {});
```

## 📱 Mobile App Logging

### Device Information Captured:
```javascript
deviceInfo: {
  platform: 'ios' | 'android' | 'web',
  version: 'app_version',
  deviceModel: 'device_model',
  osVersion: 'os_version',
  networkType: 'wifi' | 'cellular' | 'unknown'
}
```

### Offline Logging:
- Logs are queued when offline
- Synced when connection restored
- Timestamp reflects actual action time

## 🔐 Security Considerations

### Log Access Control:
- **Users**: Can only view their own logs
- **Admins**: Can view all logs via `getUserLogs` function
- **Functions**: Can write to logs collection
- **Direct Access**: Blocked by security rules

### Sensitive Data:
- **No PII in logs** - User IDs only, no names/emails
- **No payment details** - Only transaction IDs
- **No passwords** - Authentication events only

## 📋 Logging Checklist

### For Developers:
- [ ] All critical actions are logged
- [ ] Error conditions are captured
- [ ] Logs include relevant context
- [ ] No sensitive data in logs
- [ ] Logs are structured consistently

### For QA Testing:
- [ ] Verify logs are created for test actions
- [ ] Check error logs for failed operations
- [ ] Validate log structure and fields
- [ ] Test log filtering and queries
- [ ] Confirm real-time log updates

### For Production:
- [ ] Set up log retention policies
- [ ] Configure log alerts
- [ ] Monitor log volume and costs
- [ ] Set up log backup procedures
- [ ] Train team on log analysis

---

**✅ Logging System Ready!**

Your staging environment now has comprehensive logging for debugging, monitoring, and analytics. Use this guide to effectively track and troubleshoot all system activities. 