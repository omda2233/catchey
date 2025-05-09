import 'package:cloud_firestore/cloud_firestore.dart';

class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final String category;
  final bool inStock;
  final DateTime createdAt;
  final String sellerId;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.category,
    required this.inStock,
    required this.createdAt,
    required this.sellerId,
  });

  factory Product.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Product(
      id: doc.id,
      name: data['name'] ?? '',
      description: data['description'] ?? '',
      price: (data['price'] ?? 0.0).toDouble(),
      imageUrl: data['imageUrl'] ?? '',
      category: data['category'] ?? 'all',
      inStock: data['inStock'] ?? false,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      sellerId: data['sellerId'] ?? '',
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'name': name,
      'description': description,
      'price': price,
      'imageUrl': imageUrl,
      'category': category,
      'inStock': inStock,
      'createdAt': Timestamp.fromDate(createdAt),
      'sellerId': sellerId,
    };
  }

  Product copyWith({
    String? id,
    String? name,
    String? description,
    double? price,
    String? imageUrl,
    String? category,
    bool? inStock,
    DateTime? createdAt,
    String? sellerId,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      imageUrl: imageUrl ?? this.imageUrl,
      category: category ?? this.category,
      inStock: inStock ?? this.inStock,
      createdAt: createdAt ?? this.createdAt,
      sellerId: sellerId ?? this.sellerId,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Product &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          description == other.description &&
          price == other.price &&
          imageUrl == other.imageUrl &&
          category == other.category &&
          inStock == other.inStock &&
          createdAt == other.createdAt &&
          sellerId == other.sellerId;

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      description.hashCode ^
      price.hashCode ^
      imageUrl.hashCode ^
      category.hashCode ^
      inStock.hashCode ^
      createdAt.hashCode ^
      sellerId.hashCode;
} 