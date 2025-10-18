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
async function logAction(userId: string, actionType: string, status: string, deviceInfo?: Record<string, unknown>, errorMessage?: string) {
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

    console.log('User created successfully:', user.uid);
  } catch (error) {
    console.error('Error creating user:', error);
    await logAction(user.uid, 'user_created', 'error', undefined, error.message);
  }
});

// Admin function to create users with specific roles
export const createUserAsAdmin = functions.https.onCall(async (data, context) => {
  try {
    // Verify admin role
    if (!context.auth || !context.auth.token.role || context.auth.token.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can create users');
    }

    const { email, password, name, role } = data;

    if (!email || !password || !name || !role) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
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
    await db.collection('users').doc(userRecord.uid).set({
      name,
      email,
      role,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // Log the action
    await logAction(context.auth.uid, 'create_user_as_admin', 'success', { targetUserId: userRecord.uid });

    return {
      success: true,
      userId: userRecord.uid,
      message: 'User created successfully'
    };
  } catch (error) {
    console.error('Error creating user as admin:', error);
    await logAction(context.auth?.uid || 'unknown', 'create_user_as_admin', 'error', undefined, error.message);
    throw new functions.https.HttpsError('internal', 'Error creating user');
  }
});

// Process order creation
export const processOrder = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

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

    // Notify seller
    await db.collection('notifications').add({
      user_id: sellerId,
      title: 'New Order Received',
      body: `You have received a new order for ${items.length} items`,
      sent_at: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });

    // Notify delivery if assigned
    if (deliveryId) {
      await db.collection('notifications').add({
        user_id: deliveryId,
        title: 'New Delivery Assignment',
        body: 'You have been assigned a new delivery order',
        sent_at: admin.firestore.FieldValue.serverTimestamp(),
        read: false
      });
    }

    // Log the action
    await logAction(context.auth.uid, 'process_order', 'success', { orderId: orderRef.id });

    return {
      success: true,
      orderId: orderRef.id,
      message: 'Order processed successfully'
    };
  } catch (error) {
    console.error('Error processing order:', error);
    await logAction(context.auth?.uid || 'unknown', 'process_order', 'error', undefined, error.message);
    throw new functions.https.HttpsError('internal', 'Error processing order');
  }
});

// Update order status
export const updateOrderStatus = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

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
    const userRole = context.auth.token.role || 'buyer';

    // Check permissions based on role
    if (userRole === 'seller' && orderData?.seller_id !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to update this order');
    }

    if (userRole === 'delivery' && orderData?.delivery_id !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to update this order');
    }

    await orderRef.update({
      status,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // Log the action
    await logAction(context.auth.uid, 'update_order_status', 'success', { orderId, status });

    return {
      success: true,
      message: 'Order status updated successfully'
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    await logAction(context.auth?.uid || 'unknown', 'update_order_status', 'error', undefined, error.message);
    throw new functions.https.HttpsError('internal', 'Error updating order status');
  }
});

// Process card payment (Visa/MasterCard)
export const processCardPayment = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { cardNumber, expiryDate, cvv, amount, orderId } = data;

    if (!cardNumber || !expiryDate || !cvv || !amount) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    // Test card validation (placeholder logic)
    const cleanCardNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
    const cleanExpiry = expiryDate.replace(/\//g, '');

    let cardType = null;
    if (cleanCardNumber === '4111111111111111' && cleanExpiry === '1234' && cvv === '123') {
      cardType = 'visa';
    } else if (cleanCardNumber === '5555555555554444' && cleanExpiry === '1234' && cvv === '123') {
      cardType = 'mastercard';
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid test card details');
    }

    const transactionId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create transaction record
    const transactionData = {
      user_id: context.auth.uid,
      order_id: orderId || null,
      amount,
      method: 'card',
      card_type: cardType,
      type: orderId ? 'booking' : 'shipping',
      status: 'completed',
      transaction_id: transactionId,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('transactions').add(transactionData);

    // Log the action
    await logAction(context.auth.uid, 'process_card_payment', 'success', { transactionId, amount });

    return {
      success: true,
      transactionId,
      message: 'Card payment processed successfully'
    };
  } catch (error) {
    console.error('Error processing card payment:', error);
    await logAction(context.auth?.uid || 'unknown', 'process_card_payment', 'error', undefined, error.message);
    throw new functions.https.HttpsError('internal', 'Error processing card payment');
  }
});

// Process Instapay payment
export const processInstapayPayment = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { instapayNumber, amount, orderId } = data;

    if (!instapayNumber || !amount) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    // Test Instapay validation (placeholder logic)
    if (instapayNumber !== '01112223334') {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid Instapay number');
    }

    const transactionId = `instapay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create transaction record
    const transactionData = {
      user_id: context.auth.uid,
      order_id: orderId || null,
      amount,
      method: 'instapay',
      instapay_number: instapayNumber,
      type: orderId ? 'booking' : 'shipping',
      status: 'completed',
      transaction_id: transactionId,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('transactions').add(transactionData);

    // Log the action
    await logAction(context.auth.uid, 'process_instapay_payment', 'success', { transactionId, amount });

    return {
      success: true,
      transactionId,
      message: 'Instapay payment processed successfully'
    };
  } catch (error) {
    console.error('Error processing Instapay payment:', error);
    await logAction(context.auth?.uid || 'unknown', 'process_instapay_payment', 'error', undefined, error.message);
    throw new functions.https.HttpsError('internal', 'Error processing Instapay payment');
  }
});

// Process payment (legacy function)
export const processPayment = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { method, amount, orderId } = data;

    if (!method || !amount) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }

    let transactionId = '';
    if (method === 'card') {
      transactionId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    } else if (method === 'instapay') {
      transactionId = `instapay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Create transaction record
    const transactionData = {
      user_id: context.auth.uid,
      order_id: orderId || null,
      amount,
      method,
      type: orderId ? 'booking' : 'shipping',
      status: 'completed',
      transaction_id: transactionId,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('transactions').add(transactionData);

    // Log the action
    await logAction(context.auth.uid, 'process_payment', 'success', { transactionId, method, amount });

    return {
      success: true,
      transactionId,
      message: 'Payment processed successfully'
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    await logAction(context.auth?.uid || 'unknown', 'process_payment', 'error', undefined, error.message);
    throw new functions.https.HttpsError('internal', 'Error processing payment');
  }
});

// Get user logs (admin only)
export const getUserLogs = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth || !context.auth.token.role || context.auth.token.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can access logs');
    }

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

    return {
      success: true,
      logs
    };
  } catch (error) {
    console.error('Error getting user logs:', error);
    throw new functions.https.HttpsError('internal', 'Error getting user logs');
  }
});

// Get system statistics (admin only)
export const getSystemStats = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth || !context.auth.token.role || context.auth.token.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can access system stats');
    }

    // Get user count
    const usersSnapshot = await db.collection('users').get();
    const userCount = usersSnapshot.size;

    // Get order count
    const ordersSnapshot = await db.collection('orders').get();
    const orderCount = ordersSnapshot.size;

    // Get transaction count
    const transactionsSnapshot = await db.collection('transactions').get();
    const transactionCount = transactionsSnapshot.size;

    // Calculate total revenue
    let totalRevenue = 0;
    transactionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.status === 'completed') {
        totalRevenue += data.amount || 0;
      }
    });

    return {
      success: true,
      stats: {
        userCount,
        orderCount,
        transactionCount,
        totalRevenue
      }
    };
  } catch (error) {
    console.error('Error getting system stats:', error);
    throw new functions.https.HttpsError('internal', 'Error getting system stats');
  }
});

// HTTP endpoint for health check
export const healthCheck = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    res.status(200).json({
      status: 'healthy',
      service: 'Catchy Fabric Market Backend',
      timestamp: new Date().toISOString()
    });
  });
});
