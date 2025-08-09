// Script to create test users in Firebase Auth and Firestore
// Run this script once to set up test users for the app

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2x_nOR9G460pAXLu5VGD8xPFbyEY-y_Y",
  authDomain: "catchy-fabric-market.firebaseapp.com",
  projectId: "catchy-fabric-market",
  storageBucket: "catchy-fabric-market.firebasestorage.app",
  messagingSenderId: "707075319029",
  appId: "1:707075319029:android:bc5fe10b061ec9029211bc",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Test users configuration
const testUsers = [
  {
    email: 'buyer@catchy.com',
    password: 'Buyer123!',
    name: 'Ahmed Hassan',
    role: 'buyer',
    phone: '+201234567890',
    address: 'Cairo, Egypt',
    companyName: null
  },
  {
    email: 'seller@catchy.com',
    password: 'Seller123!',
    name: 'Fatima Ali',
    role: 'seller',
    phone: '+201234567891',
    companyName: 'Fatima Fabrics',
    address: 'Alexandria, Egypt'
  },
  {
    email: 'admin@catchy.com',
    password: 'Admin123!',
    name: 'Mohamed Admin',
    role: 'admin',
    phone: '+201234567892',
    companyName: 'Catchy Admin',
    address: 'Giza, Egypt'
  },
  {
    email: 'shipping@catchy.com',
    password: 'Shipping123!',
    name: 'Omar Shipping',
    role: 'shipping',
    phone: '+201234567893',
    companyName: 'Fast Delivery Co.',
    address: 'Port Said, Egypt'
  }
];

async function createTestUsers() {
  console.log('Starting to create test users...');
  
  for (const userData of testUsers) {
    try {
      console.log(`Creating user: ${userData.email}`);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const firebaseUser = userCredential.user;
      console.log(`✅ Created Firebase Auth user: ${firebaseUser.uid}`);
      
      // Create user profile in Firestore
      const userProfile = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        address: userData.address,
        companyName: userData.companyName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=1A1F2C&color=E6B54A`,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      console.log(`✅ Created Firestore profile for: ${userData.email}`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User already exists: ${userData.email}`);
      } else {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }
  }
  
  console.log('\n🎉 Test users setup complete!');
  console.log('\n📋 Test User Credentials:');
  console.log('=====================================');
  testUsers.forEach(user => {
    console.log(`\n👤 ${user.name} (${user.role})`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
  });
  console.log('\n=====================================');
  console.log('\n💳 Test Cards for Payment:');
  console.log('=====================================');
  console.log('Card 1: 4242424242424242 | 12/34 | 123');
  console.log('Card 2: 4000056655665556 | 11/33 | 456');
  console.log('=====================================');
}

// Run the setup
createTestUsers().catch(console.error);