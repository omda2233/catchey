import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import '../models/user_model.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseFunctions _functions = FirebaseFunctions.instance;

  // Get current user
  User? get currentUser => _auth.currentUser;

  // Get current user role
  Future<UserRole> getCurrentUserRole() async {
    if (currentUser == null) return UserRole.buyer;

    final doc = await _firestore
        .collection('users')
        .doc(currentUser!.uid)
        .get();

    if (!doc.exists) return UserRole.buyer;

    return UserRole.values.firstWhere(
      (role) => role.toString().split('.').last == doc.data()?['role'],
      orElse: () => UserRole.buyer,
    );
  }

  // Sign up with email and password
  Future<UserCredential> signUpWithEmailAndPassword(
    String email,
    String password,
    String name,
  ) async {
    try {
      // Check if email already exists
      final list = await _auth.fetchSignInMethodsForEmail(email);
      if (list.isNotEmpty) {
        throw 'Email already exists';
      }

      // Create user
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      // Update display name
      await userCredential.user!.updateDisplayName(name);

      // Create user document with buyer role (default)
      await _firestore.collection('users').doc(userCredential.user!.uid).set({
        'name': name,
        'email': email,
        'role': UserRole.buyer.toString().split('.').last,
        'created_at': FieldValue.serverTimestamp(),
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

  // Admin function to create users with specific roles
  Future<Map<String, dynamic>> createUserAsAdmin({
    required String email,
    required String password,
    required String name,
    required UserRole role,
  }) async {
    try {
      final callable = _functions.httpsCallable('createUserAsAdmin');
      final result = await callable.call({
        'email': email,
        'password': password,
        'name': name,
        'role': role.toString().split('.').last,
      });

      return result.data as Map<String, dynamic>;
    } catch (e) {
      throw 'Error creating user: ${e.toString()}';
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
        'role': role.toString().split('.').last,
        'updated_at': FieldValue.serverTimestamp(),
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

  // Get user data
  Future<UserModel?> getUserData(String userId) async {
    try {
      final doc = await _firestore.collection('users').doc(userId).get();
      if (!doc.exists) return null;
      return UserModel.fromFirestore(doc);
    } catch (e) {
      throw 'Error fetching user data';
    }
  }

  // Update user profile
  Future<void> updateUserProfile({
    String? name,
    String? phone,
    String? address,
    String? companyName,
  }) async {
    try {
      if (currentUser == null) throw 'User not authenticated';

      final updateData = <String, dynamic>{
        'updated_at': FieldValue.serverTimestamp(),
      };

      if (name != null) updateData['name'] = name;
      if (phone != null) updateData['phone'] = phone;
      if (address != null) updateData['address'] = address;
      if (companyName != null) updateData['companyName'] = companyName;

      await _firestore.collection('users').doc(currentUser!.uid).update(updateData);
    } catch (e) {
      throw 'Error updating profile: ${e.toString()}';
    }
  }
}
