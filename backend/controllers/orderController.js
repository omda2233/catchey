import admin from '../firebaseAdmin.js';

const db = admin.firestore();

// Place an order (buyer only)
export const placeOrder = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'buyer') {
      return res.status(403).json({ error: 'Only buyers can place orders' });
    }

    const { items, merchantId, deliveryId, totalAmount } = req.body;
    if (!items || !merchantId || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Temporary log for STEP 5
    try { console.log('🔥 New order:', req.body); } catch (_) {}

    const orderData = {
      buyerId: user.uid,
      sellerId: merchantId,
      deliveryId: deliveryId || null,
      items,
      status: 'pending',
      total: totalAmount,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const orderRef = await db.collection('orders').add(orderData);

    // Notify seller
    await db.collection('notifications').add({
      userId: merchantId,
      title: 'New Order Received',
      body: `You have received a new order for ${items.length} items`,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });

    // Notify delivery if assigned
    if (deliveryId) {
      await db.collection('notifications').add({
        userId: deliveryId,
        title: 'New Delivery Assignment',
        body: 'You have been assigned a new delivery order',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false
      });
    }

    return res.status(201).json({ success: true, orderId: orderRef.id });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ error: 'Error placing order' });
  }
};

// Update delivery status (delivery only)
export const updateDeliveryStatus = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'delivery') {
      return res.status(403).json({ error: 'Only delivery role can update delivery status' });
    }

    const { orderId, deliveryStatus } = req.body;
    if (!orderId || !deliveryStatus) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Temporary log for STEP 5
    try { console.log('📦 Order delivery status updated:', deliveryStatus); } catch (_) {}

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();
    if (orderData.deliveryId !== user.uid) {
      return res.status(403).json({ error: 'Not authorized to update this order delivery status' });
    }

    await orderRef.update({
      deliveryStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return res.status(500).json({ error: 'Error updating delivery status' });
  }
};

// Update order status (seller only)
export const updateOrderStatus = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'merchant' && user.role !== 'admin') {
      return res.status(403).json({ error: 'Only merchants can update order status' });
    }

    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Temporary log for STEP 5
    try { console.log('📦 Order status updated:', status); } catch (_) {}

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();
    if (user.role !== 'admin' && orderData.sellerId !== user.uid) {
      return res.status(403).json({ error: 'Not authorized to update this order status' });
    }

    await orderRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'Error updating order status' });
  }
};

export default {
  placeOrder,
  updateDeliveryStatus,
  updateOrderStatus
};
