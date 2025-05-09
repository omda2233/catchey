import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/product.dart';

class ProductProvider with ChangeNotifier {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  List<Product> _products = [];
  bool _isLoading = false;
  String? _error;

  List<Product> get products => _products;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchAllProducts() async {
    _isLoading = true;
    notifyListeners();
    try {
      final snapshot = await _db.collection('products').get();
      _products = snapshot.docs.map((doc) => Product.fromMap(doc.id, doc.data())).toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchProductsBySeller(String sellerId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final snapshot = await _db.collection('products').where('sellerId', isEqualTo: sellerId).get();
      _products = snapshot.docs.map((doc) => Product.fromMap(doc.id, doc.data())).toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> addProduct(Product product) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _db.collection('products').add(product.toMap());
      await fetchAllProducts();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> updateProduct(Product product) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _db.collection('products').doc(product.id).update(product.toMap());
      await fetchAllProducts();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> deleteProduct(String productId) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _db.collection('products').doc(productId).delete();
      await fetchAllProducts();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }
} 