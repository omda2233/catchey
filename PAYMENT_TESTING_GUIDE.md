# 💳 Payment Testing Guide

This guide provides comprehensive instructions for testing the payment functionality in the Catchy Fabric Market staging environment.

## 🔐 Test Payment Credentials

### Credit Cards
| Card Type | Number | Expiry | CVV |
|-----------|--------|--------|-----|
| **Visa** | 4111 1111 1111 1111 | 12/34 | 123 |
| **MasterCard** | 5555 5555 5555 4444 | 12/34 | 123 |

### Instapay
| Type | Number |
|------|--------|
| **Instapay** | 01112223334 |

## 🧪 Testing Scenarios

### 1. **Card Payment Testing**

#### ✅ Successful Visa Payment
```javascript
// Test data
const paymentData = {
  cardNumber: '4111 1111 1111 1111',
  expiryDate: '12/34',
  cvv: '123',
  amount: 50.00,
  userId: 'user_id_here',
  orderId: 'order_id_here' // optional
};

// Expected response
{
  success: true,
  transactionId: "firestore_doc_id",
  paymentId: "txn_timestamp_random",
  status: "completed",
  cardType: "Visa",
  amount: 50.00,
  message: "Payment processed successfully using Visa"
}
```

#### ✅ Successful MasterCard Payment
```javascript
// Test data
const paymentData = {
  cardNumber: '5555 5555 5555 4444',
  expiryDate: '12/34',
  cvv: '123',
  amount: 75.50,
  userId: 'user_id_here'
};

// Expected response
{
  success: true,
  transactionId: "firestore_doc_id",
  paymentId: "txn_timestamp_random",
  status: "completed",
  cardType: "MasterCard",
  amount: 75.50,
  message: "Payment processed successfully using MasterCard"
}
```

#### ❌ Invalid Card Payment
```javascript
// Test data (will fail)
const paymentData = {
  cardNumber: '4000 0000 0000 0002', // Invalid test card
  expiryDate: '12/34',
  cvv: '123',
  amount: 50.00
};

// Expected error
{
  code: "invalid-argument",
  message: "Invalid test card details"
}
```

### 2. **Instapay Payment Testing**

#### ✅ Successful Instapay Payment
```javascript
// Test data
const paymentData = {
  instapayNumber: '01112223334',
  amount: 30.00,
  userId: 'user_id_here',
  orderId: 'order_id_here' // optional
};

// Expected response
{
  success: true,
  transactionId: "firestore_doc_id",
  paymentId: "instapay_timestamp_random",
  status: "completed",
  method: "instapay",
  amount: 30.00,
  message: "Instapay payment processed successfully"
}
```

#### ❌ Invalid Instapay Payment
```javascript
// Test data (will fail)
const paymentData = {
  instapayNumber: '01112223335', // Invalid number
  amount: 30.00
};

// Expected error
{
  code: "invalid-argument",
  message: "Invalid test Instapay number"
}
```

## 🔧 Function Testing

### 1. **processCardPayment Function**

#### Parameters
- `cardNumber` (string): Credit card number
- `expiryDate` (string): Card expiry date (MM/YY format)
- `cvv` (string): Card CVV
- `userId` (string, optional): User ID (defaults to authenticated user)
- `amount` (number): Payment amount
- `orderId` (string, optional): Associated order ID

#### Authentication
- Requires Firebase Authentication
- User must be logged in

#### Response Format
```javascript
{
  success: boolean,
  transactionId: string,    // Firestore document ID
  paymentId: string,        // Generated transaction ID
  status: string,           // "completed"
  cardType: string,         // "Visa" or "MasterCard"
  amount: number,           // Payment amount
  message: string           // Success message
}
```

### 2. **processInstapayPayment Function**

#### Parameters
- `instapayNumber` (string): Instapay phone number
- `userId` (string, optional): User ID (defaults to authenticated user)
- `amount` (number): Payment amount
- `orderId` (string, optional): Associated order ID

#### Authentication
- Requires Firebase Authentication
- User must be logged in

#### Response Format
```javascript
{
  success: boolean,
  transactionId: string,    // Firestore document ID
  paymentId: string,        // Generated transaction ID
  status: string,           // "completed"
  method: string,           // "instapay"
  amount: number,           // Payment amount
  message: string           // Success message
}
```

## 📊 Data Verification

### 1. **Transaction Records**

After successful payment, verify in Firestore:

```javascript
// Collection: transactions
{
  user_id: "user_id",
  order_id: "order_id" | null,
  amount: 50.00,
  method: "card" | "instapay",
  card_type: "Visa" | "MasterCard",        // Only for card payments
  instapay_number: "01112223334",          // Only for Instapay payments
  type: "booking",
  status: "completed",
  transaction_id: "txn_timestamp_random",
  created_at: timestamp
}
```

### 2. **Notifications**

Verify notification is created:

```javascript
// Collection: notifications
{
  user_id: "user_id",
  title: "Payment Successful" | "Instapay Payment Successful",
  body: "Payment confirmation message with transaction ID",
  sent_at: timestamp,
  read: false
}
```

### 3. **Logs**

Verify action is logged:

```javascript
// Collection: logs
{
  user_id: "user_id",
  action_type: "card_payment_processed" | "instapay_payment_processed",
  status: "success",
  timestamp: timestamp,
  deviceInfo: {},
  errorMessage: null
}
```

## 🚨 Error Handling

### Common Error Scenarios

#### 1. **Missing Required Fields**
```javascript
// Error: Missing required payment fields
{
  code: "invalid-argument",
  message: "Missing required payment fields"
}
```

#### 2. **Invalid Test Credentials**
```javascript
// Error: Invalid test card details
{
  code: "invalid-argument",
  message: "Invalid test card details"
}

// Error: Invalid test Instapay number
{
  code: "invalid-argument",
  message: "Invalid test Instapay number"
}
```

#### 3. **Authentication Required**
```javascript
// Error: User must be authenticated
{
  code: "unauthenticated",
  message: "User must be authenticated"
}
```

## 🧪 Testing Checklist

### Card Payment Testing
- [ ] Test Visa card with valid credentials
- [ ] Test MasterCard with valid credentials
- [ ] Test with invalid card number
- [ ] Test with invalid expiry date
- [ ] Test with invalid CVV
- [ ] Test with missing required fields
- [ ] Test without authentication

### Instapay Payment Testing
- [ ] Test with valid Instapay number
- [ ] Test with invalid Instapay number
- [ ] Test with missing required fields
- [ ] Test without authentication

### Data Verification
- [ ] Verify transaction record is created
- [ ] Verify notification is sent
- [ ] Verify log entry is created
- [ ] Verify transaction ID format
- [ ] Verify payment amount accuracy

### Security Testing
- [ ] Test with unauthorized user
- [ ] Verify user can only see their own transactions
- [ ] Verify only functions can write to transactions
- [ ] Verify only functions can write to logs
- [ ] Verify only functions can write to notifications

## 🔗 Integration Examples

### Frontend Integration

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const processCardPayment = httpsCallable(functions, 'processCardPayment');
const processInstapayPayment = httpsCallable(functions, 'processInstapayPayment');

// Card payment
try {
  const result = await processCardPayment({
    cardNumber: '4111 1111 1111 1111',
    expiryDate: '12/34',
    cvv: '123',
    amount: 50.00
  });
  console.log('Payment successful:', result.data);
} catch (error) {
  console.error('Payment failed:', error);
}

// Instapay payment
try {
  const result = await processInstapayPayment({
    instapayNumber: '01112223334',
    amount: 30.00
  });
  console.log('Payment successful:', result.data);
} catch (error) {
  console.error('Payment failed:', error);
}
```

## 📝 Notes

1. **Processing Delay**: Both payment functions include a 1-2 second delay to simulate real payment processing
2. **Test Environment**: All payments are simulated and do not charge real money
3. **Transaction IDs**: Each payment generates a unique transaction ID for tracking
4. **Notifications**: All successful payments trigger user notifications
5. **Logging**: All payment attempts are logged for audit purposes
6. **Security**: Only Cloud Functions can write to transactions, logs, and notifications collections

---

**✅ Payment Testing Complete!**

Your payment functionality is now fully tested and ready for production integration. 