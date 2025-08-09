import 'package:cloud_firestore/cloud_firestore.dart';

class ReviewModel {
  final String id;
  final String productId;
  final String customerId;
  final String customerName;
  final String? customerImage;
  final double rating;
  final String comment;
  final List<String>? images;
  final bool isVerified;
  final DateTime createdAt;
  final DateTime? updatedAt;

  ReviewModel({
    required this.id,
    required this.productId,
    required this.customerId,
    required this.customerName,
    this.customerImage,
    required this.rating,
    required this.comment,
    this.images,
    this.isVerified = false,
    required this.createdAt,
    this.updatedAt,
  });

  factory ReviewModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return ReviewModel(
      id: doc.id,
      productId: data['productId'] ?? '',
      customerId: data['customerId'] ?? '',
      customerName: data['customerName'] ?? '',
      customerImage: data['customerImage'],
      rating: (data['rating'] ?? 0.0).toDouble(),
      comment: data['comment'] ?? '',
      images: (data['images'] as List<dynamic>?)?.cast<String>(),
      isVerified: data['isVerified'] ?? false,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      updatedAt: data['updatedAt'] != null
          ? (data['updatedAt'] as Timestamp).toDate()
          : null,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'productId': productId,
      'customerId': customerId,
      'customerName': customerName,
      'customerImage': customerImage,
      'rating': rating,
      'comment': comment,
      'images': images,
      'isVerified': isVerified,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': updatedAt != null ? Timestamp.fromDate(updatedAt!) : null,
    };
  }

  ReviewModel copyWith({
    String? id,
    String? productId,
    String? customerId,
    String? customerName,
    String? customerImage,
    double? rating,
    String? comment,
    List<String>? images,
    bool? isVerified,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ReviewModel(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      customerName: customerName ?? this.customerName,
      customerId: customerId ?? this.customerId,
      customerImage: customerImage ?? this.customerImage,
      rating: rating ?? this.rating,
      comment: comment ?? this.comment,
      images: images ?? this.images,
      isVerified: isVerified ?? this.isVerified,
      createdAt: createdAt ?? this.createdAt,
 