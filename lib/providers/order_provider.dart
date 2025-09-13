import 'dart:async';
import 'package:flutter/material.dart';
import '../models/order_model.dart';
import '../services/order_service.dart';

class OrderProvider with ChangeNotifier {
  final OrderService _orderService = OrderService();
  List<OrderModel> _orders = [];
  StreamSubscription<List<OrderModel>>? _ordersSubscription;

  List<OrderModel> get orders => _orders;

  void fetchOrders(String userId, UserRole userRole) {
    _ordersSubscription?.cancel();
    switch (userRole) {
      case UserRole.admin:
        _ordersSubscription = _orderService.getAllOrders().listen((orders) {
          _orders = orders;
          notifyListeners();
        });
        break;
      case UserRole.seller:
        _ordersSubscription = _orderService.streamSellerOrders(userId).listen((orders) {
          _orders = orders;
          notifyListeners();
        });
        break;
      case UserRole.buyer:
        _ordersSubscription = _orderService.streamBuyerOrders(userId).listen((orders) {
          _orders = orders;
          notifyListeners();
        });
        break;
      case UserRole.delivery:
        _ordersSubscription = _orderService.streamDeliveryOrders(userId).listen((orders) {
          _orders = orders;
          notifyListeners();
        });
        break;
      default:
        _orders = [];
        notifyListeners();
    }
  }

  @override
  void dispose() {
    _ordersSubscription?.cancel();
    super.dispose();
  }
}
