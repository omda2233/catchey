import 'dart:async';
import 'package:flutter/material.dart';
import '../models/product_model.dart';
import '../services/product_service.dart';

class ProductProvider with ChangeNotifier {
  final ProductService _productService = ProductService();
  List<ProductModel> _products = [];
  StreamSubscription<List<ProductModel>>? _productsSubscription;

  List<ProductModel> get products => _products;

  void fetchProducts(String? sellerId) {
    _productsSubscription?.cancel();
    if (sellerId != null) {
      _productsSubscription = _productService.getProductsBySeller(sellerId).listen((products) {
        _products = products;
        notifyListeners();
      });
    } else {
      _productsSubscription = _productService.getAvailableProducts().listen((products) {
        _products = products;
        notifyListeners();
      });
    }
  }

  @override
  void dispose() {
    _productsSubscription?.cancel();
    super.dispose();
  }
}
