import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import '../models/review_model.dart';
import '../models/product_model.dart';

class ReviewService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;
  final String _collection = 'reviews';

  // Add a new review
  Future<ReviewModel> addReview(
    String productId,
    String customerId,
    String customerName,
    String? customerImage,
    double rating,
    String comment,
    List<File>? images,
  ) async {
    try {
      // Check if customer has already reviewed this product
      final existingReview = await _firestore
          .collection(_collection)
          .where('productId', isEqualTo: productId)
          .where('customerId', isEqualTo: customerId)
          .get();

      if (existingReview.docs.isNotEmpty) {
        throw 'You have already reviewed this product';
      }

      // Upload images if provided
      List<String>? imageUrls;
      if (images != null && images.isNotEmpty) {
        imageUrls = await _uploadImages(images);
      }

      // Create review
      final review = ReviewModel(
        id: '', // Will be set by Firestore
        productId: productId,
        customerId: customerId,
        customerName: customerName,
        customerImage: customerImage,
        rating: rating,
        comment: comment,
        images: imageUrls,
        isVerified: false,
        createdAt: DateTime.now(),
      );

      // Add to Firestore
      final docRef = await _firestore.collection(_collection).add(
        review.toFirestore(),
      );

      // Update product rating
      await _updateProductRating(productId);

      return review.copyWith(id: docRef.id);
    } catch (e) {
      print('Error adding review: $e');
      rethrow;
    }
  }

  // Verify review (admin only)
  Future<void> verifyReview(String reviewId) async {
    try {
      await _firestore.collection(_collection).doc(reviewId).update({
        'isVerified': true,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Error verifying review: $e');
      rethrow;
    }
  }

  // Get reviews by product
  Stream<List<ReviewModel>> getReviewsByProduct(String productId) {
    return _firestore
        .collection(_collection)
        .where('productId', isEqualTo: productId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ReviewModel.fromFirestore(doc))
            .toList());
  }

  // Get reviews by customer
  Stream<List<ReviewModel>> getReviewsByCustomer(String customerId) {
    return _firestore
        .collection(_collection)
        .where('customerId', isEqualTo: customerId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ReviewModel.fromFirestore(doc))
            .toList());
  }

  // Get verified reviews
  Stream<List<ReviewModel>> getVerifiedReviews(String productId) {
    return _firestore
        .collection(_collection)
        .where('productId', isEqualTo: productId)
        .where('isVerified', isEqualTo: true)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ReviewModel.fromFirestore(doc))
            .toList());
  }

  // Update product rating
  Future<void> _updateProductRating(String productId) async {
    try {
      final reviews = await _firestore
          .collection(_collection)
          .where('productId', isEqualTo: productId)
          .get();

      if (reviews.docs.isEmpty) return;

      final totalRating = reviews.docs.fold<double>(
        0,
        (sum, doc) => sum + (doc.data()['rating'] as num).toDouble(),
      );
      final averageRating = totalRating / reviews.docs.length;

      await _firestore.collection('products').doc(productId).update({
        'rating': averageRating,
        'reviewCount': reviews.docs.length,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Error updating product rating: $e');
      rethrow;
    }
  }

  // Upload images to Firebase Storage
  Future<List<String>> _uploadImages(List<File> images) async {
    final List<String> imageUrls = [];
    
    for (final image in images) {
      final fileName = 'reviews/${DateTime.now().millisecondsSinceEpoch}_${image.path.split('/').last}';
      final ref = _storage.ref().child(fileName);
      
      try {
        final uploadTask = await ref.putFile(image);
        final downloadUrl = await uploadTask.ref.getDownloadURL();
        imageUrls.add(downloadUrl);
      } catch (e) {
        print('Error uploading image: $e');
        rethrow;
      }
    }
    
    return imageUrls;
  }

  // Delete review
  Future<void> deleteReview(String reviewId, String productId) async {
    try {
      // Get review to delete its images
      final doc = await _firestore.collection(_collection).doc(reviewId).get();
      if (!doc.exists) {
        throw 'Review not found';
      }
      final review = ReviewModel.fromFirestore(doc);

      // Delete images from Storage
      if (review.images != null) {
        for (final imageUrl in review.images!) {
          await _deleteImage(imageUrl);
        }
      }

      // Delete from Firestore
      await _firestore.collection(_collection).doc(reviewId).delete();

      // Update product rating
      await _updateProductRating(productId);
    } catch (e) {
      print('Error deleting review: $e');
      rethrow;
    }
  }

  // Delete image from Firebase Storage
  Future<void> _deleteImage(String imageUrl) async {
    try {
      final ref = _storage.refFromURL(imageUrl);
      await ref.delete();
    } catch (e) {
      print('Error deleting image: $e');
      rethrow;
    }
  }
} 