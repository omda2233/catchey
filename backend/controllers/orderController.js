import admin from '../firebaseAdmin.js';

const db = admin.firestore();

// Place an order (buyer only)
export const placeOrder = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'buyer') {
      return res.status(403).json({ error: 'Only buyers can place orders' });
    }

    const { items, sellerId, deliveryId, totalAmount } = req.body;
    if (!items || !sellerId || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderData = {
      buyer_id: user.uid,
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

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();
    if (orderData.delivery_id !== user.uid) {
      return res.status(403).json({ error: 'Not authorized to update this order delivery status' });
    }

    await orderRef.update({
      deliveryStatus,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
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
    if (user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can update order status' });
    }

    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();
    if (orderData.seller_id !== user.uid) {
      return res.status(403).json({ error: 'Not authorized to update this order status' });
    }

    await orderRef.update({
      status,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
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
