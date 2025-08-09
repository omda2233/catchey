import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);

// Connect to emulators only in development and when explicitly enabled
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (error) {
    console.log('Emulators already connected or not available');
  }
}

export default app; 