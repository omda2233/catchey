import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// CORS middleware
const corsHandler = cors({ origin: true });

// Utility function to log actions
async function logAction(userId: string, actionType: string, status: string, deviceInfo?: any, errorMessage?: string) {
  try {
    await db.collection('logs').add({
      user_id: userId,
      action_type: actionType,
      status: status,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      deviceInfo: deviceInfo || {},
      errorMessage: errorMessage || null
    });
  } catch (error) {
    console.error('Error logging action:', error);
  }
}

// Create user in Firestore after Firebase Auth signup
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  try {
    // Default role is 'buyer' for new signups
    const userData = {
      name: user.displayName || user.email?.split('@')[0] || 'User',
      email: user.email,
      role: 'buyer',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc(user.uid).set(userData);
    
    // Log the user creation
    await logAction(user.uid, 'user_created', 'success');
    
    // Send welcome notification
    await db.collection('notifications').add({
      user_id: user.uid,
      title: 'Welcome to Catchy Fabric Market!',
      body: 'Thank you for joining our marketplace. Start exploring amazing fabrics!',
      sent_at: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });

  } catch (error) {
    console.error('Error creating user document:', error);
    await logAction(user.uid, 'user_created', 'error', {}, error.message);
  }
});

// Admin function to create users with specific roles
export const createUserAsAdmin = functions.https.onCall(async (data, context) => {
  // Verify admin role
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can create users with specific roles');
  }

  try {
    const { email, password, name, role } = data;

    if (!email || !password || !name || !role) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    if (!['buyer', 'seller', 'delivery', 'admin'].includes(role)) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid role');
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    // Set custom claims for role
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Create user document in Firestore
    const userData = {
      name,
      email,
      role,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    // Log the admin action
    await logAction(context.auth.uid, 'admin_create_user', 'success', {}, `Created user ${email} with role ${role}`);

    return { success: true, userId: userRecord.uid };

  } catch (error) {
    console.error('Error creating user as admin:', error);
    await logAction(context.auth.uid, 'admin_create_user', 'error', {}, error.message);
    throw new functions.https.HttpsError('internal', 'Error creating user');
  }
});

// Process order creation
export const processOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { items, sellerId, deliveryId, totalAmount } = data;

    if (!items || !sellerId || !totalAmount) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    const orderData = {
      buyer_id: context.auth.uid,
      seller_id: sellerId,
      delivery_id: deliveryId || null,
      items,
      status: 'pending',
      total_amount: totalAmount,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const orderRef = await db.collection('orders').add(orderData);

    // Create transaction record
    await db.collection('transactions').add({
      user_id: context.auth.uid,
      order_id: orderRef.id,
      amount: totalAmount,
      method: 'card',
      type: 'booking',
      status: 'pending',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send notifications
    await db.collection('notifications').add({
      user_id: sellerId,
      title: 'New Order Received',
      body: `You have received a new order for ${items.length} items`,
      sent_at: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });

    if (deliveryId) {
      await db.collection('notifications').add({
        user_id: deliveryId,
        title: 'New Delivery Assignment',
        body: 'You have been assigned a new delivery order',
        sent_at: admin.firestore.FieldValue.serverTimestamp(),
        read: false
      });
    }

    // Log the order creation
    await logAction(context.auth.uid, 'order_created', 'success', {}, `Order ${orderRef.id} created`);

    return { success: true, orderId: orderRef.id };

  } catch (error) {
    console.error('Error processing order:', error);
    await logAction(context.auth.uid, 'order_created', 'error', {}, error.message);
    throw new functions.https.HttpsError('internal', 'Error processing order');
  }
});

// Update order status
export const updateOrderStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { orderId, status } = data;

    if (!orderId || !status) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Order not found');
    }

    const orderData = orderDoc.data();
    const userRole = context.auth.token.role;

    // Check permissions
    const canUpdate = 
      userRole === 'admin' ||
      context.auth.uid === orderData.buyer_id ||
      context.auth.uid === orderData.seller_id ||
      context.auth.uid === orderData.delivery_id;

    if (!canUpdate) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to update this order');
    }

    await orderRef.update({
      status,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send notification to buyer
    await db.collection('notifications').add({
      user_id: orderData.buyer_id,
      title: 'Order Status Updated',
      body: `Your order status has been updated to: ${status}`,
      sent_at: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });

    // Log the status update
    await logAction(context.auth.uid, 'order_status_updated', 'success', {}, `Order ${orderId} status updated to ${status}`);

    return { success: true };

  } catch (error) {
    console.error('Error updating order status:', error);
    await logAction(context.auth.uid, 'order_status_updated', 'error', {}, error.message);
    throw new functions.https.HttpsError('internal', 'Error updating order status');
  }
});

// Test card data
const TEST_CARDS = {
  visa: {
    number: '4111111111111111',
    expiry: '12/34',
    cvv: '123'
  },
  mastercard: {
    number: '5555555555554444',
    expiry: '12/34',
    cvv: '123'
  }
};

const TEST_INSTAPAY = '01112223334';

// Process card payment (Visa/MasterCard)
export const processCardPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { cardNumber, expiryDate, cvv, userId, amount, orderId } = data;

    // Validate required fields
    if (!cardNumber || !expiryDate || !cvv || !amount) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required payment fields');
    }

    // Clean card number (remove spaces and dashes)
    const cleanCardNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
    const cleanExpiry = expiryDate.replace(/\//g, '');

    // Check if it's a valid test card
    let cardType = null;
    if (cleanCardNumber === TEST_CARDS.visa.number && 
        cleanExpiry === TEST_CARDS.visa.expiry.replace(/\//g, '') && 
        cvv === TEST_CARDS.visa.cvv) {
      cardType = 'Visa';
    } else if (cleanCardNumber === TEST_CARDS.mastercard.number && 
               cleanExpiry === TEST_CARDS.mastercard.expiry.replace(/\//g, '') && 
               cvv === TEST_CARDS.mastercard.cvv) {
      cardType = 'MasterCard';
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid test card details');
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful payment response
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentStatus = 'completed';

    // Create transaction record
    const transactionData = {
      user_id: userId || context.auth.uid,
      order_id: orderId || null,
      amount: parseFloat(amount),
      method: 'card',
      card_type: cardType,
      type: 'booking',
      status: paymentStatus,
      transaction_id: transactionId,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const transactionRef = await db.collection('transactions').add(transactionData);

    // Send payment confirmation notification
    await db.collection('notifications').add({
      user_id: userId || context.auth.uid,
      title: 'Payment Successful',
      body: `Your payment of $${amount} has been processed successfully using ${cardType}. Transaction ID: ${transactionId}`,
      sent_at: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });

    // Log the payment action
    await logAction(
      context.auth.uid, 
      'card_payment_processed', 
      'success', 
      { cardType, amount, transactionId }, 
      `Card payment processed successfully using ${cardType}`
    );

    return {
      success: true,
      transactionId: transactionRef.id,
      paymentId: transactionId,
      status: paymentStatus,
      cardType,
      amount: parseFloat(amount),
      message: `Payment processed successfully using ${cardType}`
    };

  } catch (error) {
    console.error('Error processing card payment:', error);
    await logAction(
      context.auth.uid, 
      'card_payment_processed', 
      'error', 
      {}, 
      error.message
    );
    throw new functions.https.HttpsError('internal', 'Error processing card payment');
  }
});

// Process Instapay payment
export const processInstapayPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { instapayNumber, userId, amount, orderId } = data;

    // Validate required fields
    if (!instapayNumber || !amount) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required payment fields');
    }

    // Check if it's a valid test Instapay number
    if (instapayNumber !== TEST_INSTAPAY) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid test Instapay number');
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock successful payment response
    const transactionId = `instapay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentStatus = 'completed';

    // Create transaction record
    const transactionData = {
      user_id: userId || context.auth.uid,
      order_id: orderId || null,
      amount: parseFloat(amount),
      method: 'instapay',
      instapay_number: instapayNumber,
      type: 'booking',
      status: paymentStatus,
      transaction_id: transactionId,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const transactionRef = await db.collection('transactions').add(transactionData);

    // Send payment confirmation notification
    await db.collection('notifications').add({
      user_id: userId || context.auth.uid,
      title: 'Instapay Payment Successful',
      body: `Your Instapay payment of $${amount} has been processed successfully. Transaction ID: ${transactionId}`,
      sent_at: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });

    // Log the payment action
    await logAction(
      context.auth.uid, 
      'instapay_payment_processed', 
      'success', 
      { instapayNumber, amount, transactionId }, 
      `Instapay payment processed successfully`
    );

    return {
      success: true,
      transactionId: transactionRef.id,
      paymentId: transactionId,
      status: paymentStatus,
      method: 'instapay',
      amount: parseFloat(amount),
      message: 'Instapay payment processed successfully'
    };

  } catch (error) {
    console.error('Error processing Instapay payment:', error);
    await logAction(
      context.auth.uid, 
      'instapay_payment_processed', 
      'error', 
      {}, 
      error.message
    );
    throw new functions.https.HttpsError('internal', 'Error processing Instapay payment');
  }
});

// Process payment (legacy function - kept for backward compatibility)
export const processPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { orderId, amount, method, type } = data;

    if (!orderId || !amount || !method || !type) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    // Mock payment processing (replace with real payment gateway)
    const paymentStatus = 'completed'; // Mock successful payment

    // Create transaction record
    const transactionRef = await db.collection('transactions').add({
      user_id: context.auth.uid,
      order_id: orderId,
      amount,
      method,
      type,
      status: paymentStatus,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update order status if payment is successful
    if (paymentStatus === 'completed') {
      await db.collection('orders').doc(orderId).update({
        status: 'paid',
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Log the payment
    await logAction(context.auth.uid, 'payment_processed', 'success', {}, `Payment ${transactionRef.id} processed`);

    return { success: true, transactionId: transactionRef.id, status: paymentStatus };

  } catch (error) {
    console.error('Error processing payment:', error);
    await logAction(context.auth.uid, 'payment_processed', 'error', {}, error.message);
    throw new functions.https.HttpsError('internal', 'Error processing payment');
  }
});

// Get user logs (admin only)
export const getUserLogs = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can view logs');
  }

  try {
    const { userId, limit = 50 } = data;

    let query = db.collection('logs').orderBy('timestamp', 'desc').limit(limit);

    if (userId) {
      query = query.where('user_id', '==', userId);
    }

    const snapshot = await query.get();
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { logs };

  } catch (error) {
    console.error('Error fetching logs:', error);
    throw new functions.https.HttpsError('internal', 'Error fetching logs');
  }
});

// Get system statistics (admin only)
export const getSystemStats = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can view system stats');
  }

  try {
    const [usersSnapshot, productsSnapshot, ordersSnapshot, transactionsSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('products').get(),
      db.collection('orders').get(),
      db.collection('transactions').get()
    ]);

    const stats = {
      totalUsers: usersSnapshot.size,
      totalProducts: productsSnapshot.size,
      totalOrders: ordersSnapshot.size,
      totalTransactions: transactionsSnapshot.size,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    return { stats };

  } catch (error) {
    console.error('Error fetching system stats:', error);
    throw new functions.https.HttpsError('internal', 'Error fetching system stats');
  }
});

// HTTP endpoint for health check
export const healthCheck = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'Catchy Fabric Market Backend'
    });
  });
}); 