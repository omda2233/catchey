# 🔌 API Documentation - Catchy Fabric Market Staging

## 📋 **Overview**

This document provides comprehensive API documentation for the Catchy Fabric Market staging backend. All APIs are implemented as Firebase Cloud Functions and require proper authentication.

---

## 🔐 **Authentication**

All API calls require Firebase Authentication. Include the user's ID token in the request headers:

```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;
const idToken = await user?.getIdToken();
```

---

## 📡 **Cloud Functions API**

### **1. User Management**

#### **createUserAsAdmin** (Callable)
Creates a new user with specified role (Admin only).

**Request:**
```javascript
const createUserAsAdmin = httpsCallable(functions, 'createUserAsAdmin');

const result = await createUserAsAdmin({
  email: 'user@example.com',
  password: 'password123',
  role: 'buyer', // 'admin' | 'buyer' | 'seller' | 'delivery'
  displayName: 'John Doe',
  phoneNumber: '+201234567890'
});
```

**Response:**
```javascript
{
  success: true,
  userId: 'user_id_here',
  message: 'User created successfully'
}
```

**Error Response:**
```javascript
{
  success: false,
  error: 'Permission denied or validation error'
}
```

---

### **2. Order Management**

#### **processOrder** (Callable)
Creates a new order with products and calculates totals.

**Request:**
```javascript
const processOrder = httpsCallable(functions, 'processOrder');

const result = await processOrder({
  products: [
    {
      productId: 'product_id_here',
      quantity: 2,
      price: 150.00
    }
  ],
  shippingAddress: {
    street: '123 Main St',
    city: 'Cairo',
    postalCode: '12345',
    country: 'Egypt'
  },
  paymentMethod: 'card', // 'card' | 'instapay'
  totalAmount: 300.00
});
```

**Response:**
```javascript
{
  success: true,
  orderId: 'order_id_here',
  totalAmount: 300.00,
  status: 'pending',
  message: 'Order created successfully'
}
```

#### **updateOrderStatus** (Callable)
Updates order status (Seller/Delivery only).

**Request:**
```javascript
const updateOrderStatus = httpsCallable(functions, 'updateOrderStatus');

const result = await updateOrderStatus({
  orderId: 'order_id_here',
  status: 'shipped', // 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  notes: 'Order shipped via express delivery'
});
```

**Response:**
```javascript
{
  success: true,
  orderId: 'order_id_here',
  status: 'shipped',
  message: 'Order status updated successfully'
}
```

---

### **3. Payment Processing**

#### **processCardPayment** (Callable)
Processes credit card payments (Visa/MasterCard).

**Request:**
```javascript
const processCardPayment = httpsCallable(functions, 'processCardPayment');

const result = await processCardPayment({
  cardNumber: '4111 1111 1111 1111',
  expiryDate: '12/34',
  cvv: '123',
  amount: 150.00,
  userId: 'user_id_here',
  orderId: 'order_id_here'
});
```

**Response:**
```javascript
{
  success: true,
  transactionId: 'TXN_1234567890',
  paymentId: 'PAY_1234567890',
  status: 'completed',
  cardType: 'visa',
  method: 'card',
  amount: 150.00,
  message: 'Payment processed successfully'
}
```

#### **processInstapayPayment** (Callable)
Processes Instapay payments.

**Request:**
```javascript
const processInstapayPayment = httpsCallable(functions, 'processInstapayPayment');

const result = await processInstapayPayment({
  instapayNumber: '01112223334',
  amount: 150.00,
  userId: 'user_id_here',
  orderId: 'order_id_here'
});
```

**Response:**
```javascript
{
  success: true,
  transactionId: 'TXN_1234567890',
  paymentId: 'PAY_1234567890',
  status: 'completed',
  method: 'instapay',
  amount: 150.00,
  message: 'Instapay payment processed successfully'
}
```

#### **processPayment** (Callable) - Legacy
Legacy payment processing function for backward compatibility.

**Request:**
```javascript
const processPayment = httpsCallable(functions, 'processPayment');

const result = await processPayment({
  method: 'visa', // 'visa' | 'instapay' | 'vodafoneCash' | 'bankTransfer'
  amount: 150.00,
  paymentData: {
    cardNumber: '4111 1111 1111 1111',
    expiryMonth: '12',
    expiryYear: '34',
    cvv: '123'
  },
  orderId: 'order_id_here',
  userId: 'user_id_here'
});
```

---

### **4. Admin Functions**

#### **getUserLogs** (Callable)
Retrieves user activity logs (Admin only).

**Request:**
```javascript
const getUserLogs = httpsCallable(functions, 'getUserLogs');

const result = await getUserLogs({
  userId: 'user_id_here', // Optional: specific user
  limit: 100, // Optional: number of logs to retrieve
  actionType: 'payment_processing' // Optional: filter by action type
});
```

**Response:**
```javascript
{
  success: true,
  logs: [
    {
      user_id: 'user_id_here',
      action_type: 'payment_processing',
      status: 'success',
      timestamp: '2024-01-15T10:30:00Z',
      details: {
        paymentMethod: 'card',
        amount: 150.00,
        transactionId: 'TXN_1234567890'
      }
    }
  ],
  total: 1
}
```

#### **getSystemStats** (Callable)
Retrieves system statistics (Admin only).

**Request:**
```javascript
const getSystemStats = httpsCallable(functions, 'getSystemStats');

const result = await getSystemStats({
  period: '7d' // '1d' | '7d' | '30d' | 'all'
});
```

**Response:**
```javascript
{
  success: true,
  stats: {
    totalUsers: 150,
    totalOrders: 75,
    totalRevenue: 15000.00,
    activeUsers: 45,
    ordersByStatus: {
      pending: 10,
      confirmed: 15,
      shipped: 25,
      delivered: 20,
      cancelled: 5
    },
    paymentsByMethod: {
      card: 40,
      instapay: 25,
      vodafoneCash: 10
    }
  }
}
```

---

### **5. Health Check**

#### **healthCheck** (HTTP)
Public health check endpoint.

**Request:**
```bash
GET https://your-project.cloudfunctions.net/healthCheck
```

**Response:**
```javascript
{
  status: 'healthy',
  timestamp: '2024-01-15T10:30:00Z',
  version: '1.0.0-staging',
  services: {
    firestore: 'connected',
    auth: 'connected',
    functions: 'running'
  }
}
```

---

## 🔄 **Triggers**

### **onUserCreated** (Trigger)
Automatically triggered when a new user is created in Firebase Auth.

**Event Data:**
```javascript
{
  uid: 'user_id_here',
  email: 'user@example.com',
  displayName: 'John Doe',
  photoURL: null,
  emailVerified: false,
  disabled: false,
  metadata: {
    creationTime: '2024-01-15T10:30:00Z',
    lastSignInTime: '2024-01-15T10:30:00Z'
  }
}
```

**Actions:**
- Creates user document in Firestore
- Sets default role as 'buyer'
- Sends welcome notification
- Logs user creation

---

## 📊 **Data Models**

### **User Document**
```javascript
{
  uid: 'user_id_here',
  email: 'user@example.com',
  displayName: 'John Doe',
  phoneNumber: '+201234567890',
  role: 'buyer', // 'admin' | 'buyer' | 'seller' | 'delivery'
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  isActive: true,
  profile: {
    address: '123 Main St, Cairo',
    preferences: {
      notifications: true,
      language: 'en'
    }
  }
}
```

### **Order Document**
```javascript
{
  id: 'order_id_here',
  userId: 'user_id_here',
  sellerId: 'seller_id_here',
  products: [
    {
      productId: 'product_id_here',
      name: 'Cotton Fabric',
      quantity: 2,
      price: 150.00,
      total: 300.00
    }
  ],
  totalAmount: 300.00,
  status: 'pending', // 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending', // 'pending' | 'partial' | 'paid' | 'failed'
  shippingAddress: {
    street: '123 Main St',
    city: 'Cairo',
    postalCode: '12345',
    country: 'Egypt'
  },
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}
```

### **Transaction Document**
```javascript
{
  id: 'transaction_id_here',
  orderId: 'order_id_here',
  userId: 'user_id_here',
  amount: 150.00,
  method: 'card', // 'card' | 'instapay' | 'vodafoneCash' | 'bankTransfer'
  status: 'completed', // 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId: 'TXN_1234567890',
  cardType: 'visa', // For card payments
  cardLast4: '1111', // For card payments
  paymentDate: '2024-01-15T10:30:00Z',
  createdAt: '2024-01-15T10:30:00Z'
}
```

### **Log Document**
```javascript
{
  id: 'log_id_here',
  user_id: 'user_id_here',
  action_type: 'payment_processing',
  status: 'success', // 'success' | 'error' | 'pending'
  timestamp: '2024-01-15T10:30:00Z',
  deviceInfo: {
    platform: 'android',
    version: '1.0.0-staging',
    userAgent: 'Mozilla/5.0...'
  },
  errorMessage: null, // For error logs
  details: {
    paymentMethod: 'card',
    amount: 150.00,
    transactionId: 'TXN_1234567890',
    debugTrace: 'payment_processing_2024-01-15T10:30:00Z_abc123',
    userRole: 'buyer'
  }
}
```

---

## 🧪 **Test Data**

### **Test User Credentials**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@catchyfabric.com | Admin123! |
| Buyer | buyer@catchyfabric.com | Buyer123! |
| Seller | seller@catchyfabric.com | Seller123! |
| Delivery | delivery@catchyfabric.com | Delivery123! |

### **Test Payment Credentials**
| Type | Number | Expiry | CVV |
|------|--------|--------|-----|
| Visa | 4111 1111 1111 1111 | 12/34 | 123 |
| MasterCard | 5555 5555 5555 4444 | 12/34 | 123 |
| Instapay | 01112223334 | - | - |

---

## 🚨 **Error Handling**

### **Common Error Codes**
- `permission-denied` - User not authorized for the operation
- `unauthenticated` - User not logged in
- `invalid-argument` - Invalid input parameters
- `not-found` - Resource not found
- `already-exists` - Resource already exists
- `resource-exhausted` - Rate limit exceeded
- `internal` - Internal server error

### **Error Response Format**
```javascript
{
  success: false,
  error: {
    code: 'permission-denied',
    message: 'User not authorized for this operation'
  }
}
```

---

## 📈 **Rate Limits**

- **Authentication**: 100 requests per minute per user
- **Payment Processing**: 10 requests per minute per user
- **Order Creation**: 20 requests per minute per user
- **Log Retrieval**: 50 requests per minute per user
- **Admin Functions**: 100 requests per minute per admin

---

## 🔒 **Security**

### **Role-Based Access Control**
- **Admin**: Full access to all functions and data
- **Seller**: Can manage products, view orders, update order status
- **Buyer**: Can browse products, create orders, make payments
- **Delivery**: Can view assigned orders, update delivery status

### **Data Validation**
- All input parameters are validated
- SQL injection protection through Firestore
- XSS protection through input sanitization
- Rate limiting to prevent abuse

---

## 📞 **Support**

For API support and debugging:
1. Check Firebase Console → Functions → Logs
2. Review error messages in function responses
3. Verify user authentication and permissions
4. Check Firestore security rules
5. Monitor rate limits and quotas

---

## 📋 **Postman Collection**

A Postman collection is available at: `docs/postman/Catchy_Fabric_Market_API.postman_collection.json`

**Import Instructions:**
1. Open Postman
2. Click "Import"
3. Select the collection file
4. Set up environment variables for your Firebase project
5. Update authentication tokens as needed

---

**✅ API Documentation Complete**

All endpoints are tested and ready for staging validation. 