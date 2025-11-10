import { db } from '../firebaseAdmin.js';

const collections = ['users', 'products', 'orders', 'deposits', 'notifications'];

async function verifyFirestore() {
  console.log('Starting Firestore validation...');

  for (const collectionName of collections) {
    const docRef = db.collection(collectionName).doc('test-document');
    
    try {
      // Write operation
      await docRef.set({ test: 'data' });
      console.log(`✅ Write successful to ${collectionName}`);

      // Read operation
      const doc = await docRef.get();
      if (doc.exists) {
        console.log(`✅ Read successful from ${collectionName}`);
      } else {
        throw new Error('Test document not found after writing.');
      }

      // Delete operation
      await docRef.delete();
      console.log(`✅ Delete successful from ${collectionName}`);
    } catch (error) {
      console.error(`❌ Error in ${collectionName}:`, error.message);
    }
  }

  console.log('Firestore validation complete.');
}

verifyFirestore();