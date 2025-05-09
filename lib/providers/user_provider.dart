import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user.dart';

class UserProvider with ChangeNotifier {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  List<AppUser> _users = [];
  bool _isLoading = false;
  String? _error;

  List<AppUser> get users => _users;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchAllUsers() async {
    _isLoading = true;
    notifyListeners();
    try {
      final snapshot = await _db.collection('users').get();
      _users = snapshot.docs.map((doc) => AppUser.fromMap(doc.id, doc.data())).toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchUsersByRole(String role) async {
    _isLoading = true;
    notifyListeners();
    try {
      final snapshot = await _db.collection('users').where('role', isEqualTo: role).get();
      _users = snapshot.docs.map((doc) => AppUser.fromMap(doc.id, doc.data())).toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> addUser(AppUser user) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _db.collection('users').doc(user.uid).set(user.toMap());
      await fetchAllUsers();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> updateUser(AppUser user) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _db.collection('users').doc(user.uid).update(user.toMap());
      await fetchAllUsers();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> deleteUser(String uid) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _db.collection('users').doc(uid).delete();
      await fetchAllUsers();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }
} 