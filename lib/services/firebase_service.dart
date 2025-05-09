import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class FirebaseService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Assign an order to a shipper (admin only)
  Future<void> assignOrderToShipper({
    required String adminUid,
    required String orderId,
    required String shipperUid,
  }) async {
    final adminDoc = await _db.collection('users').doc(adminUid).get();
    if (adminDoc['role'] != 'admin') {
      throw Exception('Only admins can assign orders to shippers.');
    }
    await _db.collection('orders').doc(orderId).update({
      'shipperId': shipperUid,
      'status': 'in_transit',
    });
  }

  // Admin-only: Create a user with a specific role
  Future<void> adminCreateUser({
    required String adminUid,
    required String email,
    required String password,
    required String name,
    required String role,
    String? location,
    String? profilePhoto,
  }) async {
    final adminDoc = await _db.collection('users').doc(adminUid).get();
    if (adminDoc['role'] != 'admin') {
      throw Exception('Only admins can create users.');
    }
    // Create user in Firebase Auth
    final userCred = await _auth.createUserWithEmailAndPassword(email: email, password: password);
    final uid = userCred.user!.uid;
    // Add user to Firestore
    await _db.collection('users').doc(uid).set({
      'email': email,
      'role': role,
      'name': name,
      'location': location,
      'profilePhoto': profilePhoto,
    });
  }

  // Admin-only: Upgrade user role
  Future<void> upgradeUserRole({
    required String adminUid,
    required String targetUid,
    required String newRole,
  }) async {
    final adminDoc = await _db.collection('users').doc(adminUid).get();
    if (adminDoc['role'] != 'admin') {
      throw Exception('Only admins can upgrade roles.');
    }
    await _db.collection('users').doc(targetUid).update({'role': newRole});
  }

  // Deposit confirmation (with timestamp and verified flag)
  Future<void> confirmDeposit({
    required String orderId,
    required bool isConfirmed,
    required String confirmerUid,
  }) async {
    final now = Timestamp.now();
    await _db.collection('orders').doc(orderId).update({
      'depositPaid': isConfirmed,
      'depositTimestamp': now,
      'depositVerifiedBy': confirmerUid,
    });
  }

  // Secure access: Check if current user is admin
  Future<bool> isAdmin(String uid) async {
    final doc = await _db.collection('users').doc(uid).get();
    return doc.exists && doc['role'] == 'admin';
  }

  // Secure access: Check if current user is seller
  Future<bool> isSeller(String uid) async {
    final doc = await _db.collection('users').doc(uid).get();
    return doc.exists && doc['role'] == 'seller';
  }

  // Secure access: Check if current user is shipper
  Future<bool> isShipper(String uid) async {
    final doc = await _db.collection('users').doc(uid).get();
    return doc.exists && doc['role'] == 'shipper';
  }

  // Secure access: Check if current user is buyer
  Future<bool> isBuyer(String uid) async {
    final doc = await _db.collection('users').doc(uid).get();
    return doc.exists && doc['role'] == 'buyer';
  }
} 