import 'package:cloud_firestore/cloud_firestore.dart';

class Order {
  final String id;
  final String productId;
  final String buyerId;
  final String sellerId;
  final String shipperId;
  final String status; // pending, in_transit, delivered, etc.
  final String shippingMethod; // pickup, delivery
  final bool depositPaid;
  final DateTime createdAt;

  Order({
    required this.id,
    required this.productId,
    required this.buyerId,
    required this.sellerId,
    required this.shipperId,
    required this.status,
    required this.shippingMethod,
    required this.depositPaid,
    required this.createdAt,
  });

  factory Order.fromMap(String id, Map<String, dynamic> data) => Order(
    id: id,
    productId: data['productId'],
    buyerId: data['buyerId'],
    sellerId: data['sellerId'],
    shipperId: data['shipperId'],
    status: data['status'],
    shippingMethod: data['shippingMethod'],
    depositPaid: data['depositPaid'] ?? false,
    createdAt: (data['createdAt'] as Timestamp).toDate(),
  );

  Map<String, dynamic> toMap() => {
    'productId': productId,
    'buyerId': buyerId,
    'sellerId': sellerId,
    'shipperId': shipperId,
    'status': status,
    'shippingMethod': shippingMethod,
    'depositPaid': depositPaid,
    'createdAt': createdAt,
  };
} 