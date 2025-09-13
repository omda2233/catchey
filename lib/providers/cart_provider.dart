import 'dart:async';
import 'package:flutter/material.dart';
import '../models/product_model.dart';
import '../models/cart_model.dart';
import '../services/cart_service.dart';

class CartProvider with ChangeNotifier {
  final CartService _cartService = CartService();
  CartModel? _cart;
  StreamSubscription<CartModel>? _cartSubscription;

  CartModel? get cart => _cart;

  void init(String userId) {
    _cartSubscription?.cancel();
    _cartSubscription = _cartService.streamCart(userId).listen((cart) {
      _cart = cart;
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _cartSubscription?.cancel();
    super.dispose();
  }

  Future<void> addItem(String userId, ProductModel product, {int quantity = 1}) async {
    await _cartService.addToCart(userId, product, quantity: quantity);
  }

  Future<void> removeItem(String userId, String productId) async {
    await _cartService.removeFromCart(userId, productId);
  }

  Future<void> updateQuantity(String userId, String productId, int quantity) async {
    await _cartService.updateQuantity(userId, productId, quantity);
  }

  Future<void> clearCart(String userId) async {
    await _cartService.clearCart(userId);
  }
}
