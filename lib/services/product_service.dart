import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import '../models/product_model.dart';

class ProductService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;
  final String _collection = 'products';

  // Add a new product
  Future<ProductModel> addProduct(ProductModel product, List<File> images) async {
    try {
      // Upload images to Firebase Storage
      final List<String> imageUrls = await _uploadImages(images);
      
      // Create product with image URLs
      final productWithImages = product.copyWith(
        images: imageUrls,
        createdAt: DateTime.now(),
      );

      // Add to Firestore
      final docRef = await _firestore.collection(_collection).add(
        productWithImages.toFirestore(),
      );

      return productWithImages.copyWith(id: docRef.id);
    } catch (e) {
      print('Error adding product: $e');
      rethrow;
    }
  }

  // Update an existing product
  Future<void> updateProduct(
    String productId,
    ProductModel product,
    List<File>? newImages,
  ) async {
    try {
      final List<String> imageUrls = product.images;
      
      // Upload new images if provided
      if (newImages != null && newImages.isNotEmpty) {
        final newImageUrls = await _uploadImages(newImages);
        imageUrls.addAll(newImageUrls);
      }

      // Update product in Firestore
      await _firestore.collection(_collection).doc(productId).update(
        product.copyWith(
          images: imageUrls,
          updatedAt: DateTime.now(),
        ).toFirestore(),
      );
    } catch (e) {
      print('Error updating product: $e');
      rethrow;
    }
  }

  // Delete a product
  Future<void> deleteProduct(String productId) async {
    try {
      // Get product to delete its images
      final product = await getProductById(productId);
      
      // Delete images from Storage
      for (final imageUrl in product.images) {
        await _deleteImage(imageUrl);
      }

      // Delete from Firestore
      await _firestore.collection(_collection).doc(productId).delete();
    } catch (e) {
      print('Error deleting product: $e');
      rethrow;
    }
  }

  // Get product by ID
  Future<ProductModel> getProductById(String productId) async {
    try {
      final doc = await _firestore.collection(_collection).doc(productId).get();
      if (!doc.exists) {
        throw 'Product not found';
      }
      return ProductModel.fromFirestore(doc);
    } catch (e) {
      print('Error getting product: $e');
      rethrow;
    }
  }

  // Get products by category
  Stream<List<ProductModel>> getProductsByCategory(String category) {
    return _firestore
        .collection(_collection)
        .where('category', isEqualTo: category)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ProductModel.fromFirestore(doc))
            .toList());
  }

  // Get products by seller
  Stream<List<ProductModel>> getProductsBySeller(String sellerId) {
    return _firestore
        .collection(_collection)
        .where('seller_id', isEqualTo: sellerId)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ProductModel.fromFirestore(doc))
            .toList());
  }

  // Get all available products
  Stream<List<ProductModel>> getAvailableProducts() {
    return _firestore
        .collection(_collection)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ProductModel.fromFirestore(doc))
            .toList());
  }

  // Search products
  Future<List<ProductModel>> searchProducts(String query) async {
    try {
      final snapshot = await _firestore
          .collection(_collection)
          .orderBy('name')
          .startAt([query])
          .endAt([query + '\uf8ff'])
          .get();
      return snapshot.docs.map((doc) => ProductModel.fromFirestore(doc)).toList();
    } catch (e) {
      print('Error searching products: $e');
      return [];
    }
  }

  // Upload images to Firebase Storage
  Future<List<String>> _uploadImages(List<File> images) async {
    final List<String> imageUrls = [];
    
    for (final image in images) {
      final fileName = 'products/${DateTime.now().millisecondsSinceEpoch}_${image.path.split('/').last}';
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