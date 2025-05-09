import 'package:cloud_firestore/cloud_firestore.dart';

enum OrderStatus {
  pending,
  accepted,
  rejected,
  shipped,
  delivered,
  cancelled,
}

class OrderItem {
  final String productId;
  final String productName;
  final String image;
  final double price;
  final int quantity;

  OrderItem({
    required this.productId,
    required this.productName,
    required this.image,
    required this.price,
    required this.quantity,
  });

  Map<String, dynamic> toMap() {
    return {
      'productId': productId,
      'productName': productName,
      'image': image,
      'price': price,
      'quantity': quantity,
    };
  }

  factory OrderItem.fromMap(Map<String, dynamic> map) {
    return OrderItem(
      productId: map['productId'] as String,
      productName: map['productName'] as String,
      image: map['image'] as String,
      price: (map['price'] as num).toDouble(),
      quantity: map['quantity'] as int,
    );
  }
}

class OrderModel {
  final String id;
  final String sellerId;
  final String customerId;
  final String customerName;
  final String customerEmail;
  final String? customerPhone;
  final List<OrderItem> items;
  final double total;
  final OrderStatus status;
  final DateTime createdAt;
  final DateTime? updatedAt;

  OrderModel({
    required this.id,
    required this.sellerId,
    required this.customerId,
    required this.customerName,
    required this.customerEmail,
    this.customerPhone,
    required this.items,
    required this.total,
    required this.status,
    required this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'sellerId': sellerId,
      'customerId': customerId,
      'customerName': customerName,
      'customerEmail': customerEmail,
      'customerPhone': customerPhone,
      'items': items.map((item) => item.toMap()).toList(),
      'total': total,
      'status': status.toString().split('.').last,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': updatedAt != null ? Timestamp.fromDate(updatedAt!) : null,
    };
  }

  factory OrderModel.fromMap(String id, Map<String, dynamic> map) {
    return OrderModel(
      id: id,
      sellerId: map['sellerId'] as String,
      customerId: map['customerId'] as String,
      customerName: map['customerName'] as String,
      customerEmail: map['customerEmail'] as String,
      customerPhone: map['customerPhone'] as String?,
      items: (map['items'] as List)
          .map((item) => OrderItem.fromMap(item as Map<String, dynamic>))
          .toList(),
      total: (map['total'] as num).toDouble(),
      status: OrderStatus.values.firstWhere(
        (e) => e.toString().split('.').last == map['status'],
      ),
      createdAt: (map['createdAt'] as Timestamp).toDate(),
      updatedAt: map['updatedAt'] != null
          ? (map['updatedAt'] as Timestamp).toDate()
          : null,
    );
  }

  OrderModel copyWith({
    String? id,
    String? sellerId,
    String? customerId,
    String? customerName,
    String? customerEmail,
    String? customerPhone,
    List<OrderItem>? items,
    double? total,
    OrderStatus? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return OrderModel(
      id: id ?? this.id,
      sellerId: sellerId ?? this.sellerId,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      customerEmail: customerEmail ?? this.customerEmail,
      customerPhone: customerPhone ?? this.customerPhone,
      items: items ?? this.items,
      total: total ?? this.total,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
} 