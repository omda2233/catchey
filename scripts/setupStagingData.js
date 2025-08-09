const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to add your service account key)
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   // or use service account key file
//   // credential: admin.credential.cert(require('./path-to-service-account.json'))
// });

const db = admin.firestore();

// Sample data for staging environment
const sampleUsers = [
  {
    email: 'admin@catchyfabric.com',
    password: 'Admin123!',
    name: 'Admin User',
    role: 'admin'
  },
  {
    email: 'buyer@catchyfabric.com',
    password: 'Buyer123!',
    name: 'Test Buyer',
    role: 'buyer'
  },
  {
    email: 'seller@catchyfabric.com',
    password: 'Seller123!',
    name: 'Test Seller',
    role: 'seller'
  },
  {
    email: 'delivery@catchyfabric.com',
    password: 'Delivery123!',
    name: 'Test Delivery',
    role: 'delivery'
  }
];

const sampleProducts = [
  {
    name: 'Premium Cotton Fabric',
    category: 'cotton',
    price: 25.99,
    description: 'High-quality cotton fabric perfect for summer clothing',
    images: ['cotton1.jpg', 'cotton2.jpg'],
    seller_id: 'seller_uid_here', // Will be replaced with actual seller UID
    created_at: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Silk Blend Material',
    category: 'silk',
    price: 45.50,
    description: 'Luxurious silk blend for elegant garments',
    images: ['silk1.jpg', 'silk2.jpg'],
    seller_id: 'seller_uid_here',
    created_at: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Denim Fabric',
    category: 'denim',
    price: 32.75,
    description: 'Durable denim fabric for jeans and jackets',
    images: ['denim1.jpg'],
    seller_id: 'seller_uid_here',
    created_at: admin.firestore.FieldValue.serverTimestamp()
  }
];

const sampleOrders = [
  {
    buyer_id: 'buyer_uid_here',
    seller_id: 'seller_uid_here',
    delivery_id: 'delivery_uid_here',
    items: [
      {
        product_id: 'product1',
        quantity: 2,
        price: 25.99
      }
    ],
    status: 'pending',
    total_amount: 51.98,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  }
];

const sampleTransactions = [
  {
    user_id: 'buyer_uid_here',
    order_id: 'order1',
    amount: 51.98,
    method: 'card',
    card_type: 'Visa',
    type: 'booking',
    status: 'completed',
    transaction_id: 'txn_test_visa_001',
    created_at: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    user_id: 'buyer_uid_here',
    order_id: null,
    amount: 25.50,
    method: 'instapay',
    instapay_number: '01112223334',
    type: 'booking',
    status: 'completed',
    transaction_id: 'instapay_test_001',
    created_at: admin.firestore.FieldValue.serverTimestamp()
  }
];

const sampleNotifications = [
  {
    user_id: 'buyer_uid_here',
    title: 'Welcome to Catchy Fabric Market!',
    body: 'Thank you for joining our marketplace. Start exploring amazing fabrics!',
    sent_at: admin.firestore.FieldValue.serverTimestamp(),
    read: false
  }
];

async function createSampleUsers() {
  console.log('Creating sample users...');
  
  for (const userData of sampleUsers) {
    try {
      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.name
      });

      // Set custom claims for role
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: userData.role });

      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`Created user: ${userData.email} (${userData.role}) - UID: ${userRecord.uid}`);
      
      // Store UID for use in other collections
      userData.uid = userRecord.uid;
      
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error.message);
    }
  }
}

async function createSampleProducts() {
  console.log('Creating sample products...');
  
  const sellerUser = sampleUsers.find(u => u.role === 'seller');
  if (!sellerUser || !sellerUser.uid) {
    console.error('No seller user found. Cannot create products.');
    return;
  }

  for (let i = 0; i < sampleProducts.length; i++) {
    try {
      const productData = {
        ...sampleProducts[i],
        seller_id: sellerUser.uid
      };

      const docRef = await db.collection('products').add(productData);
      console.log(`Created product: ${productData.name} - ID: ${docRef.id}`);
      
      // Store product ID for use in orders
      sampleProducts[i].id = docRef.id;
      
    } catch (error) {
      console.error(`Error creating product ${sampleProducts[i].name}:`, error.message);
    }
  }
}

async function createSampleOrders() {
  console.log('Creating sample orders...');
  
  const buyerUser = sampleUsers.find(u => u.role === 'buyer');
  const sellerUser = sampleUsers.find(u => u.role === 'seller');
  const deliveryUser = sampleUsers.find(u => u.role === 'delivery');
  
  if (!buyerUser || !sellerUser || !deliveryUser) {
    console.error('Missing required users for orders. Cannot create orders.');
    return;
  }

  for (let i = 0; i < sampleOrders.length; i++) {
    try {
      const orderData = {
        ...sampleOrders[i],
        buyer_id: buyerUser.uid,
        seller_id: sellerUser.uid,
        delivery_id: deliveryUser.uid,
        items: [
          {
            product_id: sampleProducts[0]?.id || 'product1',
            quantity: 2,
            price: 25.99
          }
        ]
      };

      const docRef = await db.collection('orders').add(orderData);
      console.log(`Created order: ${docRef.id}`);
      
      // Store order ID for use in transactions
      sampleOrders[i].id = docRef.id;
      
    } catch (error) {
      console.error(`Error creating order:`, error.message);
    }
  }
}

async function createSampleTransactions() {
  console.log('Creating sample transactions...');
  
  const buyerUser = sampleUsers.find(u => u.role === 'buyer');
  if (!buyerUser || !sampleOrders[0]?.id) {
    console.error('Missing required data for transactions. Cannot create transactions.');
    return;
  }

  for (let i = 0; i < sampleTransactions.length; i++) {
    try {
      const transactionData = {
        ...sampleTransactions[i],
        user_id: buyerUser.uid,
        order_id: sampleOrders[0].id
      };

      const docRef = await db.collection('transactions').add(transactionData);
      console.log(`Created transaction: ${docRef.id}`);
      
    } catch (error) {
      console.error(`Error creating transaction:`, error.message);
    }
  }
}

async function createSampleNotifications() {
  console.log('Creating sample notifications...');
  
  const buyerUser = sampleUsers.find(u => u.role === 'buyer');
  if (!buyerUser) {
    console.error('No buyer user found. Cannot create notifications.');
    return;
  }

  for (let i = 0; i < sampleNotifications.length; i++) {
    try {
      const notificationData = {
        ...sampleNotifications[i],
        user_id: buyerUser.uid
      };

      const docRef = await db.collection('notifications').add(notificationData);
      console.log(`Created notification: ${docRef.id}`);
      
    } catch (error) {
      console.error(`Error creating notification:`, error.message);
    }
  }
}

async function setupStagingData() {
  console.log('Setting up staging data...');
  
  try {
    await createSampleUsers();
    await createSampleProducts();
    await createSampleOrders();
    await createSampleTransactions();
    await createSampleNotifications();
    
    console.log('\n✅ Staging data setup completed!');
    console.log('\n📋 Test Credentials:');
    sampleUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });
    
  } catch (error) {
    console.error('Error setting up staging data:', error);
  }
}

// Export for use in other scripts
module.exports = {
  setupStagingData,
  sampleUsers,
  sampleProducts,
  sampleOrders,
  sampleTransactions,
  sampleNotifications
};

// Run if called directly
if (require.main === module) {
  setupStagingData();
} 