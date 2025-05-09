import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/cart_model.dart';
import '../models/order_model.dart';
import 'order_service.dart';

class CartService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final OrderService _orderService = OrderService();
  final String _collection = 'carts';

  // Get user's cart
  Future<CartModel> getCart(String userId) async {
    try {
      final doc = await _firestore.collection(_collection).doc(userId).get();
      if (!doc.exists) {
        // Create new cart if doesn't exist
        final newCart = CartModel(
          userId: userId,
          items: [],
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        );
        await _firestore.collection(_collection).doc(userId).set(
          newCart.toFirestore(),
        );
        return newCart;
      }
      return CartModel.fromFirestore(doc);
    } catch (e) {
      print('Error getting cart: $e');
      rethrow;
    }
  }

  // Add item to cart
  Future<void> addToCart(String userId, CartItem item) async {
    try {
      final cart = await getCart(userId);
      final updatedCart = cart.addItem(item);
      await _firestore.collection(_collection).doc(userId).update(
        updatedCart.toFirestore(),
      );
    } catch (e) {
      print('Error adding to cart: $e');
      rethrow;
    }
  }

  // Remove item from cart
  Future<void> removeFromCart(String userId, String productId) async {
    try {
      final cart = await getCart(userId);
      final updatedCart = cart.removeItem(productId);
      await _firestore.collection(_collection).doc(userId).update(
        updatedCart.toFirestore(),
      );
    } catch (e) {
      print('Error removing from cart: $e');
      rethrow;
    }
  }

  // Update item quantity
  Future<void> updateItemQuantity(
    String userId,
    String productId,
    int quantity,
  ) async {
    try {
      final cart = await getCart(userId);
      final updatedCart = cart.updateItemQuantity(productId, quantity);
      await _firestore.collection(_collection).doc(userId).update(
        updatedCart.toFirestore(),
      );
    } catch (e) {
      print('Error updating item quantity: $e');
      rethrow;
    }
  }

  // Clear cart
  Future<void> clearCart(String userId) async {
    try {
      final cart = await getCart(userId);
      final updatedCart = cart.clear();
      await _firestore.collection(_collection).doc(userId).update(
        updatedCart.toFirestore(),
      );
    } catch (e) {
      print('Error clearing cart: $e');
      rethrow;
    }
  }

  // Checkout cart
  Future<OrderModel> checkout(
    String userId,
    String customerName,
    String customerEmail,
    String? customerPhone,
    DeliveryMethod deliveryMethod,
    String? deliveryAddress,
    GeoPoint? deliveryLocation,
    String? notes,
  ) async {
    try {
      final cart = await getCart(userId);
      if (cart.items.isEmpty) {
        throw 'Cart is empty';
      }

      // Group items by seller
      final itemsBySeller = cart.itemsBySeller;
      final orders = <OrderModel>[];

      // Create an order for each seller
      for (final entry in itemsBySeller.entries) {
        final sellerId = entry.key;
        final items = entry.value;

        // Get seller details from first item
        final sellerName = items.first.sellerName;
        final sellerAddress = items.first.sellerAddress;
        final sellerLocation = items.first.sellerLocation;

        // Create order
        final order = await _orderService.createOrder(
          OrderModel(
            id: '', // Will be set by Firestore
            customerId: userId,
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            sellerId: sellerId,
            sellerName: sellerName,
            sellerAddress: sellerAddress,
            sellerLocation: sellerLocation,
            items: items.map((item) => OrderItem(
              productId: item.productId,
              productName: item.productName,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            )).toList(),
            deliveryMethod: deliveryMethod,
            deliveryAddress: deliveryAddress,
            deliveryLocation: deliveryLocation,
            notes: notes,
            requiresDeposit: deliveryMethod == DeliveryMethod.pickup,
            depositAmount: deliveryMethod == DeliveryMethod.pickup
                ? items.fold(0.0, (sum, item) => sum + (item.price * item.quantity)) * 0.2
                : null,
            isDepositPaid: false,
            status: OrderStatus.pending,
            createdAt: DateTime.now(),
          ),
        );

        orders.add(order);
      }

      // Clear cart after successful checkout
      await clearCart(userId);

      // Return the first order (main order)
      return orders.first;
    } catch (e) {
      print('Error during checkout: $e');
      rethrow;
    }
  }

  // Stream cart updates
  Stream<CartModel> streamCart(String userId) {
    return _firestore
        .collection(_collection)
        .doc(userId)
        .snapshots()
        .map((doc) => CartModel.fromFirestore(doc));
  }
} 