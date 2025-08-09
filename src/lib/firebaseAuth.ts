import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserRole } from '@/contexts/AuthContext';

// Firebase Auth Service
export class FirebaseAuthService {
  
  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      console.log('[FirebaseAuthService] signIn: start', { email });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('[FirebaseAuthService] signIn: success', { userId: userCredential.user.uid });
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data();
      const user: User = {
        id: firebaseUser.uid,
        name: userData.name,
        email: firebaseUser.email!,
        role: userData.role,
        avatar: userData.avatar,
        active: userData.active ?? true
      };
      
      return user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('User not found');
        case 'auth/wrong-password':
          throw new Error('Invalid password');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled');
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later');
        default:
          throw new Error('Sign in failed. Please try again');
      }
    }
  }

  // Sign up with email and password
  static async signUp(name: string, email: string, password: string, role?: UserRole): Promise<User> {
    try {
      console.log('[FirebaseAuthService] signUp: start', { email });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[FirebaseAuthService] signUp: success', { userId: userCredential.user.uid });
      const firebaseUser = userCredential.user;
      // Always set role to 'buyer' for public sign up
      const userData = {
        uid: firebaseUser.uid,
        fullName: name,
        email,
        role: 'buyer',
        createdAt: new Date(),
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      await sendEmailVerification(firebaseUser);
      const user: User = {
        id: firebaseUser.uid,
        name,
        email,
        role: 'buyer',
        avatar: undefined,
        active: true
      };
      return user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Email already in use');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/weak-password':
          throw new Error('Password is too weak. Use at least 6 characters');
        default:
          throw new Error('Sign up failed. Please try again');
      }
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Sign out failed');
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    
    if (!firebaseUser) {
      return null;
    }
    
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      const userData = userDoc.data();
      return {
        id: firebaseUser.uid,
        name: userData.name,
        email: firebaseUser.email!,
        role: userData.role,
        avatar: userData.avatar,
        active: userData.active ?? true
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const updateData: any = {
        ...updates,
        updatedAt: new Date()
      };
      
      // Remove fields that shouldn't be in Firestore
      delete updateData.id;
      delete updateData.email; // Email is managed by Firebase Auth
      
      await updateDoc(doc(db, 'users', userId), updateData);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      console.log('[FirebaseAuthService] resetPassword: start', { email });
      await sendPasswordResetEmail(auth, email);
      console.log('[FirebaseAuthService] resetPassword: success', { email });
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('No account found with this email');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        default:
          throw new Error('Failed to send reset email');
      }
    }
  }

  // Change password
  static async changePassword(newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is signed in');
      }
      console.log('[FirebaseAuthService] changePassword: start', { userId: user.uid });
      await updatePassword(user, newPassword);
      console.log('[FirebaseAuthService] changePassword: success', { userId: user.uid });
    } catch (error: any) {
      console.error('Change password error:', error);
      
      switch (error.code) {
        case 'auth/requires-recent-login':
          throw new Error('Please sign in again to change your password');
        case 'auth/weak-password':
          throw new Error('Password is too weak');
        default:
          throw new Error('Failed to change password');
      }
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (!userDoc.exists()) {
          callback(null);
          return;
        }
        
        const userData = userDoc.data();
        const user: User = {
          id: firebaseUser.uid,
          name: userData.name,
          email: firebaseUser.email!,
          role: userData.role,
          avatar: userData.avatar,
          active: userData.active ?? true
        };
        
        callback(user);
      } catch (error) {
        console.error('Auth state change error:', error);
        callback(null);
      }
    });
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  // Get current Firebase user
  static getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Create user as admin (for admin dashboard)
  static async createUserAsAdmin(name: string, email: string, password: string, role: UserRole): Promise<User> {
    try {
      console.log('[FirebaseAuthService] createUserAsAdmin: start', { email, role });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[FirebaseAuthService] createUserAsAdmin: success', { userId: userCredential.user.uid });
      const firebaseUser = userCredential.user;
      
      // Create user profile in Firestore with admin-specified role
      const userData = {
        uid: firebaseUser.uid,
        fullName: name,
        email,
        role,
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      // Send email verification
      console.log('[FirebaseAuthService] sendEmailVerification: start', { userId: firebaseUser.uid });
      await sendEmailVerification(firebaseUser);
      console.log('[FirebaseAuthService] sendEmailVerification: success', { userId: firebaseUser.uid });
      
      const user: User = {
        id: firebaseUser.uid,
        name,
        email,
        role,
        avatar: undefined,
        active: true
      };
      
      return user;
    } catch (error: any) {
      console.error('Admin create user error:', error);
      
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Email already in use');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/weak-password':
          throw new Error('Password is too weak. Use at least 6 characters');
        default:
          throw new Error('Failed to create user. Please try again');
      }
    }
  }
} 