import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

enum UserRole {
  customer,
  seller,
  delivery,
  admin,
}

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Get current user
  User? get currentUser => _auth.currentUser;

  // Get current user role
  Future<UserRole> getCurrentUserRole() async {
    if (currentUser == null) return UserRole.customer;
    
    final doc = await _firestore
        .collection('users')
        .doc(currentUser!.uid)
        .get();
    
    if (!doc.exists) return UserRole.customer;
    
    return UserRole.values.firstWhere(
      (role) => role.toString() == doc.data()?['role'],
      orElse: () => UserRole.customer,
    );
  }

  // Sign up with email and password
  Future<UserCredential> signUpWithEmailAndPassword(
    String email,
    String password,
  ) async {
    try {
      // Check if email already exists
      final methods = await _auth.fetchSignInMethodsForEmail(email);
      if (methods.isNotEmpty) {
        throw 'Email already exists';
      }

      // Create user
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      // Create user document with customer role
      await _firestore.collection('users').doc(userCredential.user!.uid).set({
        'email': email,
        'role': UserRole.customer.toString(),
        'createdAt': FieldValue.serverTimestamp(),
      });

      // Send email verification
      await userCredential.user!.sendEmailVerification();

      return userCredential;
    } on FirebaseAuthException catch (e) {
      throw e.message ?? 'An error occurred during sign up';
    }
  }

  // Sign in with email and password
  Future<UserCredential> signInWithEmailAndPassword(
    String email,
    String password,
  ) async {
    try {
      final userCredential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (!userCredential.user!.emailVerified) {
        await _auth.signOut();
        throw 'Please verify your email first';
      }

      return userCredential;
    } on FirebaseAuthException catch (e) {
      throw e.message ?? 'An error occurred during sign in';
    }
  }

  // Sign out
  Future<void> signOut() async {
    await _auth.signOut();
  }

  // Reset password
  Future<void> resetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      throw e.message ?? 'An error occurred while resetting password';
    }
  }

  // Update user role (admin only)
  Future<void> updateUserRole(String userId, UserRole role) async {
    try {
      await _firestore.collection('users').doc(userId).update({
        'role': role.toString(),
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      throw 'An error occurred while updating user role';
    }
  }

  // Resend verification email
  Future<void> resendVerificationEmail() async {
    try {
      await currentUser?.sendEmailVerification();
    } on FirebaseAuthException catch (e) {
      throw e.message ?? 'An error occurred while sending verification email';
    }
  }
} 