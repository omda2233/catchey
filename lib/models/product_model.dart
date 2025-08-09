import 'package:cloud_firestore/cloud_firestore.dart';

class ProductModel {
  final String id;
  final String name;
  final String description;
  final double price;
  final String sellerId;
  final String? sellerName;
  final String? sellerAddress;
  final GeoPoint? sellerLocation;
  final List<String> images;
  final bool isAvailable;
  final int stock;
  final List<String> categories;
  final Map<String, dynamic>? attributes;
  final double? rating;
  final int? reviewCount;
  final DateTime createdAt;
  final DateTime? updatedAt;

  ProductModel({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.sellerId,
    this.sellerName,
    this.sellerAddress,
    this.sellerLocation,
    required this.images,
    this.isAvailable = true,
    this.stock = 0,
    required this.categories,
    this.attributes,
    this.rating,
    this.reviewCount,
    required this.createdAt,
    this.updatedAt,
  });

  factory ProductModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ProductModel(
      id: doc.id,
      name: data['name'] ?? '',
      description: data['description'] ?? '',
      price: (data['price'] ?? 0.0).toDouble(),
      sellerId: data['sellerId'] ?? '',
      sellerName: data['sellerName'],
      sellerAddress: data['sellerAddress'],
      sellerLocation: data['sellerLocation'],
      images: List<String>.from(data['images'] ?? []),
      isAvailable: data['isAvailable'] ?? true,
      stock: data['stock'] ?? 0,
      categories: List<String>.from(data['categories'] ?? []),
      attributes: data['attributes'],
      rating: data['rating']?.toDouble(),
      reviewCount: data['reviewCount'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      updatedAt: data['updatedAt'] != null
          ? (data['updatedAt'] as Timestamp).toDate()
          : null,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'name': name,
      'description': description,
      'price': price,
      'sellerId': sellerId,
      'sellerName': sellerName,
      'sellerAddress': sellerAddress,
      'sellerLocation': sellerLocation,
      'images': images,
      'isAvailable': isAvailable,
      'stock': stock,
      'categories': categories,
      'attributes': attributes,
      'rating': rating,
      'reviewCount': reviewCount,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': updatedAt != null ? Timestamp.fromDate(updatedAt!) : null,
    };
  }

  ProductModel copyWith({
    String? id,
    String? name,
    String? description,
    double? price,
    String? sellerId,
    String? sellerName,
    String? sellerAddress,
    GeoPoint? sellerLocation,
    List<String>? images,
    bool? isAvailable,
    int? stock,
    List<String>? categories,
    Map<String, dynamic>? attributes,
    double? rating,
    int? reviewCount,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ProductModel(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      sellerId: sellerId ?? this.sellerId,
      sellerName: sellerName ?? this.sellerName,
      sellerAddress: sellerAddress ?? this.sellerAddress,
      sellerLocation: sellerLocation ?? this.sellerLocation,
      images: images ?? this.images,
      isAvailable: isAvailable ?? this.isAvailable,
      stock: stock ?? this.stock,
      categories: categories ?? this.categories,
      attributes: attributes ?? this.attributes,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
} 