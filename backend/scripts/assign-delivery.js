import admin from '../firebaseAdmin.js';

const db = admin.firestore();

const [, , orderId, deliveryUid] = process.argv;

if (!orderId || !deliveryUid) {
  console.error('Usage: node backend/scripts/assign-delivery.js <orderId> <deliveryUid>');
  process.exit(1);
}

try {
  await db
    .collection('orders')
    .doc(orderId)
    .set(
      {
        deliveryId: deliveryUid,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  console.log(JSON.stringify({ success: true, orderId, deliveryUid }));
  process.exit(0);
} catch (err) {
  console.error('Failed to assign delivery to order:', err?.message || err);
  process.exit(2);
}