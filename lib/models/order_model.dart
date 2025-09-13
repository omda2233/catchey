import 'package:cloud_firestore/cloud_firestore.dart';

enum OrderStatus {
  pending,
  paid,
  processing,
  shipped,
  delivered,
  cancelled,
}

class OrderItem {
  final String productId;
  final int quantity;
  final double price;

  OrderItem({
    required this.productId,
    required this.quantity,
    required this.price,
  });

  Map<String, dynamic> toMap() {
    return {
      'product_id': productId,
      'quantity': quantity,
      'price': price,
    };
  }

  factory OrderItem.fromMap(Map<String, dynamic> map) {
    return OrderItem(
      productId: map['product_id'] as String,
      quantity: map['quantity'] as int,
      price: (map['price'] as num).toDouble(),
    );
  }
}

class OrderModel {
  final String id;
  final String buyerId;
  final String sellerId;
  final String? deliveryId;
  final List<OrderItem> items;
  final double totalAmount;
  final OrderStatus status;
  final DateTime createdAt;
  final DateTime? updatedAt;

  OrderModel({
    required this.id,
    required this.buyerId,
    required this.sellerId,
    this.deliveryId,
    required this.items,
    required this.totalAmount,
    required this.status,
    required this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'buyer_id': buyerId,
      'seller_id': sellerId,
      'delivery_id': deliveryId,
      'items': items.map((item) => item.toMap()).toList(),
      'total_amount': totalAmount,
      'status': status.toString().split('.').last,
      'created_at': Timestamp.fromDate(createdAt),
      'updated_at': updatedAt != null ? Timestamp.fromDate(updatedAt!) : null,
    };
  }

  factory OrderModel.fromMap(String id, Map<String, dynamic> map) {
    return OrderModel(
      id: id,
      buyerId: map['buyer_id'] as String,
      sellerId: map['seller_id'] as String,
      deliveryId: map['delivery_id'] as String?,
      items: (map['items'] as List)
          .map((item) => OrderItem.fromMap(item as Map<String, dynamic>))
          .toList(),
      totalAmount: (map['total_amount'] as num).toDouble(),
      status: OrderStatus.values.firstWhere(
        (e) => e.toString().split('.').last == map['status'],
        orElse: () => OrderStatus.pending,
      ),
      createdAt: (map['created_at'] as Timestamp).toDate(),
      updatedAt: map['updated_at'] != null
          ? (map['updated_at'] as Timestamp).toDate()
          : null,
    );
  }

  OrderModel copyWith({
    String? id,
    String? buyerId,
    String? sellerId,
    String? deliveryId,
    List<OrderItem>? items,
    double? totalAmount,
    OrderStatus? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return OrderModel(
      id: id ?? this.id,
      buyerId: buyerId ?? this.buyerId,
      sellerId: sellerId ?? this.sellerId,
      deliveryId: deliveryId ?? this.deliveryId,
      items: items ?? this.items,
      totalAmount: totalAmount ?? this.totalAmount,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
} 