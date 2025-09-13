import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/product_model.dart';
import '../models/cart_model.dart';

class CartService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final String _collection = 'carts';

  // Stream cart from Firestore
  Stream<CartModel> streamCart(String userId) {
    return _firestore.collection(_collection).doc(userId).snapshots().asyncMap((doc) async {
      if (!doc.exists) {
        return CartModel.empty(userId);
      }
      final data = doc.data() as Map<String, dynamic>;
      final itemsData = data['items'] as List<dynamic>? ?? [];
      final productIds = itemsData.map((item) => item['productId'] as String).toList();

      if (productIds.isEmpty) {
        return CartModel.fromFirestore(doc, []);
      }

      final productsSnapshot = await _firestore
          .collection('products')
          .where(FieldPath.documentId, whereIn: productIds)
          .get();

      final products = productsSnapshot.docs.map((doc) => ProductModel.fromFirestore(doc)).toList();
      return CartModel.fromFirestore(doc, products);
    });
  }

  // Add to cart
  Future<void> addToCart(String userId, ProductModel product, {int quantity = 1}) async {
    final docRef = _firestore.collection(_collection).doc(userId);
    await _firestore.runTransaction((transaction) async {
      final doc = await transaction.get(docRef);
      if (!doc.exists) {
        transaction.set(docRef, {
          'items': [CartItem(product: product, quantity: quantity).toFirestore()],
          'updatedAt': FieldValue.serverTimestamp(),
        });
      } else {
        final data = doc.data() as Map<String, dynamic>;
        final items = (data['items'] as List<dynamic>)
            .map((item) {
              final product = ProductModel.fromFirestore(item['product']);
              return CartItem.fromMap(item as Map<String, dynamic>, product);
            })
            .toList();

        final existingIndex = items.indexWhere((item) => item.product.id == product.id);
        if (existingIndex >= 0) {
          items[existingIndex] = items[existingIndex].copyWith(
            quantity: items[existingIndex].quantity + quantity,
          );
        } else {
          items.add(CartItem(product: product, quantity: quantity));
        }

        transaction.update(docRef, {
          'items': items.map((item) => item.toFirestore()).toList(),
          'updatedAt': FieldValue.serverTimestamp(),
        });
      }
    });
  }

  // Remove from cart
  Future<void> removeFromCart(String userId, String productId) async {
    final docRef = _firestore.collection(_collection).doc(userId);
    await docRef.update({
      'items': FieldValue.arrayRemove([{'productId': productId}]),
    });
  }

  // Update quantity
  Future<void> updateQuantity(String userId, String productId, int quantity) async {
    if (quantity <= 0) {
      await removeFromCart(userId, productId);
      return;
    }

    final docRef = _firestore.collection(_collection).doc(userId);
    await _firestore.runTransaction((transaction) async {
      final doc = await transaction.get(docRef);
      if (doc.exists) {
        final data = doc.data() as Map<String, dynamic>;
        final items = (data['items'] as List<dynamic>)
            .map((item) {
              final product = ProductModel.fromFirestore(item['product']);
              return CartItem.fromMap(item as Map<String, dynamic>, product);
            })
            .toList();

        final existingIndex = items.indexWhere((item) => item.product.id == productId);
        if (existingIndex >= 0) {
          items[existingIndex] = items[existingIndex].copyWith(quantity: quantity);
          transaction.update(docRef, {
            'items': items.map((item) => item.toFirestore()).toList(),
            'updatedAt': FieldValue.serverTimestamp(),
          });
        }
      }
    });
  }

  // Merge anonymous cart with user cart
  Future<void> mergeAnonymousCart(String anonymousUserId, String userId) async {
    try {
      final anonymousCartSnapshot = await _firestore.collection(_collection).doc(anonymousUserId).get();
      final userCartSnapshot = await _firestore.collection(_collection).doc(userId).get();

      if (!anonymousCartSnapshot.exists) return;

      final products = <ProductModel>[];
      final anonymousCart = CartModel.fromFirestore(anonymousCartSnapshot, products);
      final userCart = userCartSnapshot.exists
          ? CartModel.fromFirestore(userCartSnapshot, products)
          : CartModel.empty(userId);

      final mergedItems = <String, CartItem>{};

      for (final item in userCart.items) {
        mergedItems[item.product.id] = item;
      }

      for (final item in anonymousCart.items) {
        if (mergedItems.containsKey(item.product.id)) {
          mergedItems[item.product.id] = mergedItems[item.product.id]!.copyWith(
            quantity: mergedItems[item.product.id]!.quantity + item.quantity,
          );
        } else {
          mergedItems[item.product.id] = item;
        }
      }

      await _firestore.collection(_collection).doc(userId).set({
        'items': mergedItems.values.map((item) => item.toFirestore()).toList(),
        'updatedAt': FieldValue.serverTimestamp(),
      });

      await _firestore.collection(_collection).doc(anonymousUserId).delete();
    } catch (e) {
      print('Error merging cart: $e');
    }
  }

  // Clear cart
  Future<void> clearCart(String userId) async {
    try {
      await _firestore.collection(_collection).doc(userId).delete();
    } catch (e) {
      print('Error clearing cart: $e');
    }
  }
}
