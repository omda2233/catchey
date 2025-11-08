import admin from '../firebaseAdmin.js';

const createTestUsers = async () => {
  const users = [
    {
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    },
    {
      email: 'buyer@test.com',
      password: 'password123',
      role: 'buyer',
    },
    {
      email: 'seller@test.com',
      password: 'password123',
      role: 'seller',
    },
    {
      email: 'shipping@test.com',
      password: 'password123',
      role: 'shipping',
    },
  ];

  for (const userData of users) {
    try {
      let userRecord;
      try {
        userRecord = await admin.auth().getUserByEmail(userData.email);
        console.log(`User ${userData.email} already exists.`);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          userRecord = await admin.auth().createUser({
            email: userData.email,
            password: userData.password,
          });
          console.log(`Successfully created new user: ${userData.email}`);
        } else {
          throw error;
        }
      }

      await admin.auth().setCustomUserClaims(userRecord.uid, { role: userData.role });

      const userDoc = {
        uid: userRecord.uid,
        email: userData.email,
        role: userData.role,
        status: 'active',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await admin.firestore().collection('users').doc(userRecord.uid).set(userDoc, { merge: true });

      console.log(`Set custom claim and Firestore role for ${userData.email} to ${userData.role}`);
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
    }
  }
};

createTestUsers().then(() => {
  console.log('Test user creation process finished.');
  process.exit(0);
}).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});