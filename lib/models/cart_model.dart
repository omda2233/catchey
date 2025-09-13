import 'package:cloud_firestore/cloud_firestore.dart';
import 'product_model.dart';

class CartItem {
  final ProductModel product;
  final int quantity;

  CartItem({
    required this.product,
    required this.quantity,
  });

  double get total => product.price * quantity;

  CartItem copyWith({
    ProductModel? product,
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



  factory CartItem.fromMap(Map<String, dynamic> map, ProductModel product) {

    return CartItem(

      product: product,

      quantity: map['quantity'] as int,

    );

  }
}

class CartModel {
  final String userId;
  final List<CartItem> items;
  final DateTime updatedAt;

  CartModel({
    required this.userId,
    required this.items,
    required this.updatedAt,
  });

  double get total => items.fold(0, (sum, item) => sum + item.total);

  int get itemCount => items.fold(0, (sum, item) => sum + item.quantity);

  factory CartModel.empty(String userId) {
    return CartModel(
      userId: userId,
      items: [],
      updatedAt: DateTime.now(),
    );
  }

  factory CartModel.fromFirestore(DocumentSnapshot doc, List<ProductModel> products) {
    final data = doc.data() as Map<String, dynamic>;
    final itemsData = data['items'] as List<dynamic>;

    return CartModel(
      userId: doc.id,
      items: itemsData.map((item) {
        final product = products.firstWhere(
          (p) => p.id == item['productId'],
          orElse: () => throw Exception('ProductModel not found'),
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

  CartModel copyWith({
    String? userId,
    List<CartItem>? items,
    DateTime? updatedAt,
  }) {
    return CartModel(
      userId: userId ?? this.userId,
      items: items ?? this.items,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  CartModel addItem(ProductModel product, {int quantity = 1}) {
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

  CartModel removeItem(String productId) {
    return copyWith(
      items: items.where((item) => item.product.id != productId).toList(),
      updatedAt: DateTime.now(),
    );
  }

  CartModel updateQuantity(String productId, int quantity) {
    return copyWith(
      items: items.map((item) {
        if (item.product.id == productId) {
          return item.copyWith(quantity: quantity);
        }
