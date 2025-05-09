import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/auth_service.dart';
import '../services/cart_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  final CartService _cartService = CartService();
  final FirebaseAuth _auth = FirebaseAuth.instance;
  User? _user;
  UserRole _userRole = UserRole.customer;
  bool _isLoading = false;
  String? _error;

  AuthProvider() {
    _init();
    _auth.authStateChanges().listen((user) {
      _user = user;
      notifyListeners();
    });
  }

  User? get user => _user;
  UserRole get userRole => _userRole;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  bool get isAdmin => _userRole == UserRole.admin;
  bool get isSeller => _userRole == UserRole.seller;
  bool get isDelivery => _userRole == UserRole.delivery;
  bool get isCustomer => _userRole == UserRole.customer;

  Future<void> _init() async {
    _user = _authService.currentUser;
    if (_user != null) {
      _userRole = await _authService.getCurrentUserRole();
    }
    notifyListeners();
  }

  Future<void> signUp(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final userCredential = await _authService.signUpWithEmailAndPassword(
        email,
        password,
      );
      _user = userCredential.user;
      _userRole = UserRole.customer;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signIn(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final userCredential = await _authService.signInWithEmailAndPassword(
        email,
        password,
      );
      _user = userCredential.user;
      _userRole = await _authService.getCurrentUserRole();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signOut() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.signOut();
      _user = null;
      _userRole = UserRole.customer;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> resetPassword(String email) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.resetPassword(email);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> resendVerificationEmail() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.resendVerificationEmail();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateUserRole(String userId, UserRole role) async {
    if (!isAdmin) {
      _error = 'Only admins can update user roles';
      notifyListeners();
      return;
    }

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.updateUserRole(userId, role);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signInWithEmailAndPassword(String email, String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      final credential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (_auth.currentUser?.isAnonymous ?? false) {
        // If there was an anonymous session, merge the carts
        await _cartService.mergeAnonymousCart(
          _auth.currentUser!.uid,
          credential.user!.uid,
        );
      }

      _user = credential.user;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createUserWithEmailAndPassword(
    String email,
    String password,
    String displayName,
  ) async {
    try {
      _isLoading = true;
      notifyListeners();

      final credential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      await credential.user?.updateDisplayName(displayName);

      if (_auth.currentUser?.isAnonymous ?? false) {
        // If there was an anonymous session, merge the carts
        await _cartService.mergeAnonymousCart(
          _auth.currentUser!.uid,
          credential.user!.uid,
        );
      }

      _user = credential.user;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signInAnonymously() async {
    try {
      _isLoading = true;
      notifyListeners();

      final credential = await _auth.signInAnonymously();
      _user = credential.user;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateProfile({String? displayName, String? photoURL}) async {
    try {
      _isLoading = true;
      notifyListeners();

      if (displayName != null) {
        await _user?.updateDisplayName(displayName);
      }
      if (photoURL != null) {
        await _user?.updatePhotoURL(photoURL);
      }

      _user = _auth.currentUser;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateEmail(String email) async {
    try {
      _isLoading = true;
      notifyListeners();

      await _user?.verifyBeforeUpdateEmail(email);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updatePassword(String password) async {
    try {
      _isLoading = true;
      notifyListeners();

      await _user?.updatePassword(password);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    try {
      _isLoading = true;
      notifyListeners();

      await _auth.signOut();
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteAccount() async {
    try {
      _isLoading = true;
      notifyListeners();

      await _user?.delete();
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
} 