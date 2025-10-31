import dotenv from 'dotenv';
dotenv.config();
import admin from '../firebaseAdmin.js';
import logger from '../utils/logger.js';

async function main() {
  const db = admin.firestore();
  const ts = Date.now();
  const test = {
    buyerId: `test_buyer_${ts}`,
    merchantId: `test_merchant_${ts}`,
    email: `test-buyer-${ts}@example.com`,
    amount: 123.45,
  };

  console.log('=== Running deployment verification ===');

  // 1) Create test Buyer profile (Firestore only)
  await db.collection('users').doc(test.buyerId).set({
    uid: test.buyerId,
    email: test.email,
    role: 'buyer',
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  await logger.info('Verification: Test Buyer Created', { uid: test.buyerId, email: test.email });

  // 2) Create test Order
  const orderRef = await db.collection('orders').add({
    buyerId: test.buyerId,
    merchantId: test.merchantId,
    deliveryId: null,
    items: [{ sku: 'TEST-SKU', qty: 1, price: test.amount }],
    status: 'pending',
    amount: test.amount,
    paymentStatus: 'unpaid',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  await logger.info('Verification: Test Order Created', { orderId: orderRef.id, amount: test.amount });

  // 3) Create test Payment and update order paymentStatus
  const paymentRef = await db.collection('payments').add({
    orderId: orderRef.id,
    amount: test.amount,
    method: 'instapay',
    status: 'success',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    buyerId: test.buyerId,
    transactionId: `verify_${ts}`,
  });
  await db.collection('orders').doc(orderRef.id).set({
    paymentStatus: 'paid',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  await logger.info('Verification: Test Payment Created', { paymentId: paymentRef.id, orderId: orderRef.id });

  // 4) Check logs in Firestore
  const logsSnap = await db.collection('logs').orderBy('createdAt', 'desc').limit(3).get();
  const recentLogs = logsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log('=== Verification Results ===');
  console.log('Test Buyer:', test.buyerId);
  console.log('Test Order:', orderRef.id);
  console.log('Test Payment:', paymentRef.id);
  console.log('Recent Logs:', recentLogs);

  console.log('✅ Verification complete');
}

main().catch((e) => {
  console.error('Verification failed', e);
  process.exitCode = 1;
});
