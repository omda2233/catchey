import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/order.dart';

class OrderProvider with ChangeNotifier {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  List<Order> _orders = [];
  bool _isLoading = false;
  String? _error;

  List<Order> get orders => _orders;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchAllOrders() async {
    _isLoading = true;
    notifyListeners();
    try {
      final snapshot = await _db.collection('orders').get();
      _orders = snapshot.docs.map((doc) => Order.fromMap(doc.id, doc.data())).toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchOrdersByBuyer(String buyerId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final snapshot = await _db.collection('orders').where('buyerId', isEqualTo: buyerId).get();
      _orders = snapshot.docs.map((doc) => Order.fromMap(doc.id, doc.data())).toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchOrdersBySeller(String sellerId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final snapshot = await _db.collection('orders').where('sellerId', isEqualTo: sellerId).get();
      _orders = snapshot.docs.map((doc) => Order.fromMap(doc.id, doc.data())).toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchOrdersByShipper(String shipperId) async {
    _isLoading = true;
    notifyListeners();
    try {
      final snapshot = await _db.collection('orders').where('shipperId', isEqualTo: shipperId).get();
      _orders = snapshot.docs.map((doc) => Order.fromMap(doc.id, doc.data())).toList();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> addOrder(Order order) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _db.collection('orders').add(order.toMap());
      await fetchAllOrders();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> updateOrder(Order order) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _db.collection('orders').doc(order.id).update(order.toMap());
      await fetchAllOrders();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> deleteOrder(String orderId) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _db.collection('orders').doc(orderId).delete();
      await fetchAllOrders();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }
    _isLoading = false;
    notifyListeners();
  }
} 