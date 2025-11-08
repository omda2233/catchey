import admin from '../firebaseAdmin.js';

const createFirestoreTestUsers = async () => {
  const users = [
    { role: 'admin', email: 'admin@test.com', password: '123456', notes: 'System administrator' },
    { role: 'merchant', email: 'merchant@test.com', password: '123456', notes: 'Seller test account' },
    { role: 'delivery', email: 'delivery@test.com', password: '123456', notes: 'Delivery company test' },
    { role: 'buyer', email: 'buyer@test.com', password: '123456', notes: 'Default customer' },
  ];

  const db = admin.firestore();
  const col = db.collection('users');

  for (const user of users) {
    try {
      const docRef = col.doc(user.email);
      const payload = {
        email: user.email,
        role: user.role,
        password: user.password,
        notes: user.notes,
        status: 'active',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await docRef.set(payload, { merge: true });
      console.log(`✅ Created/updated Firestore doc for ${user.email} with role ${user.role}`);
    } catch (err) {
      console.error(`❌ Failed to create Firestore doc for ${user.email}`, err);
    }
  }
};

createFirestoreTestUsers()
  .then(() => {
    console.log('🎉 Firestore test user creation completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });