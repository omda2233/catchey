import 'package:cloud_firestore/cloud_firestore.dart';
import 'product.dart';

class CartItem {
  final Product product;
  final int quantity;

  CartItem({
    required this.product,
    required this.quantity,
  });

  double get total => product.price * quantity;

  CartItem copyWith({
    Product? product,
    int? quantity,
  }) {
    return CartItem(
      product: product ?? this.product,
      quantity: quantity ?? this.quantity,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'productId': product.id,
      'quantity': quantity,
      'price': product.price,
    };
  }
}

class Cart {
  final String userId;
  final List<CartItem> items;
  final DateTime updatedAt;

  Cart({
    required this.userId,
    required this.items,
    required this.updatedAt,
  });

  double get total => items.fold(0, (sum, item) => sum + item.total);

  int get itemCount => items.fold(0, (sum, item) => sum + item.quantity);

  factory Cart.empty(String userId) {
    return Cart(
      userId: userId,
      items: [],
      updatedAt: DateTime.now(),
    );
  }

  factory Cart.fromFirestore(DocumentSnapshot doc, List<Product> products) {
    final data = doc.data() as Map<String, dynamic>;
    final itemsData = data['items'] as List<dynamic>;

    return Cart(
      userId: doc.id,
      items: itemsData.map((item) {
        final product = products.firstWhere(
          (p) => p.id == item['productId'],
          orElse: () => throw Exception('Product not found'),
        );
        return CartItem(
          product: product,
          quantity: item['quantity'],
        );
      }).toList(),
      updatedAt: (data['updatedAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'items': items.map((item) => item.toFirestore()).toList(),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }

  Cart copyWith({
    String? userId,
    List<CartItem>? items,
    DateTime? updatedAt,
  }) {
    return Cart(
      userId: userId ?? this.userId,
      items: items ?? this.items,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Cart addItem(Product product, {int quantity = 1}) {
    final existingIndex = items.indexWhere((item) => item.product.id == product.id);
    final newItems = List<CartItem>.from(items);

    if (existingIndex >= 0) {
      newItems[existingIndex] = newItems[existingIndex].copyWith(
        quantity: newItems[existingIndex].quantity + quantity,
      );
    } else {
      newItems.add(CartItem(product: product, quantity: quantity));
    }

    return copyWith(
      items: newItems,
      updatedAt: DateTime.now(),
    );
  }

  Cart removeItem(String productId) {
    return copyWith(
      items: items.where((item) => item.product.id != productId).toList(),
      updatedAt: DateTime.now(),
    );
  }

  Cart updateQuantity(String productId, int quantity) {
    return copyWith(
      items: items.map((item) {
        if (item.product.id == productId) {
          return item.copyWith(quantity: quantity);
        }
        return item;
      }).toList(),
      updatedAt: DateTime.now(),
    );
  }

  Cart clear() {
    return copyWith(
      items: [],
      updatedAt: DateTime.now(),
    );
  }
} 