import admin from '../firebaseAdmin.js';
import logger from '../utils/logger.js';

const db = admin.firestore();

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

// Record a payment (buyer only)
export const recordPayment = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'buyer') {
      return res.status(403).json({ error: 'Only buyers can record payments' });
    }

    const { method, amount, orderId, cardNumber, expiryDate, cvv, instapayNumber } = req.body;

    // Temporary log for STEP 5
    try { console.log('💰 Payment received:', req.body); } catch (_) {}

    if (!method || !amount || !orderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let paymentData = {
      orderId,
      amount,
      method,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      buyerId: user.uid,
      transactionId: ''
    };

    if (method === 'instapay') {
      if (!instapayNumber || instapayNumber !== TEST_INSTAPAY) {
        return res.status(400).json({ error: 'Invalid Instapay number' });
      }
      paymentData.transactionId = `instapay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      paymentData.status = 'success';
    } else if (method === 'card') {
      if (!cardNumber || !expiryDate || !cvv) {
        return res.status(400).json({ error: 'Missing card details' });
      }

      const cleanCardNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
      const cleanExpiry = expiryDate.replace(/\//g, '');

      let cardType = null;
      if (cleanCardNumber === TEST_CARDS.visa.number && cleanExpiry === TEST_CARDS.visa.expiry.replace(/\//g, '') && cvv === TEST_CARDS.visa.cvv) {
        cardType = 'visa';
      } else if (cleanCardNumber === TEST_CARDS.mastercard.number && cleanExpiry === TEST_CARDS.mastercard.expiry.replace(/\//g, '') && cvv === TEST_CARDS.mastercard.cvv) {
        cardType = 'mastercard';
      } else {
        return res.status(400).json({ error: 'Invalid test card details' });
      }

      paymentData.transactionId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      paymentData.status = 'success';
      paymentData.cardType = cardType;
    } else {
      return res.status(400).json({ error: 'Unsupported payment method' });
    }

    const paymentRef = await db.collection('payments').add(paymentData);

    // Update order payment status
    try {
      await db.collection('orders').doc(orderId).set({
        paymentStatus: 'paid',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error('Failed to update order paymentStatus', e);
    }

    // Send notification
    await db.collection('notifications').add({
      userId: user.uid,
      title: 'Payment Recorded',
      body: `Your payment of $${amount} via ${method} has been recorded.`,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });

    try { await logger.info('Payment Received', { paymentId: paymentRef.id, orderId, amount, method }, user.uid); } catch (_) {}

    return res.status(201).json({ success: true, paymentId: paymentRef.id });
  } catch (error) {
    console.error('Error recording payment:', error);
    return res.status(500).json({ error: 'Error recording payment' });
  }
};

export default {
  recordPayment
};
