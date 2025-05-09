import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/order_model.dart';

class OrderService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final String _collection = 'orders';

  // Create a new order
  Future<OrderModel> createOrder(OrderModel order) async {
    try {
      // Validate order data
      if (order.items.isEmpty) {
        throw 'Order must contain at least one item';
      }

      // Calculate totals
      final subtotal = order.items.fold(
        0.0,
        (sum, item) => sum + (item.price * item.quantity),
      );
      final tax = subtotal * 0.15; // 15% tax
      final shipping = order.deliveryMethod == DeliveryMethod.delivery ? 10.0 : 0.0;
      final total = subtotal + tax + shipping;

      // Create order with calculated totals
      final orderWithTotals = order.copyWith(
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        total: total,
        status: OrderStatus.pending,
        createdAt: DateTime.now(),
      );

      // Add to Firestore
      final docRef = await _firestore.collection(_collection).add(
        orderWithTotals.toFirestore(),
      );

      return orderWithTotals.copyWith(id: docRef.id);
    } catch (e) {
      print('Error creating order: $e');
      rethrow;
    }
  }

  // Update order status
  Future<void> updateOrderStatus(
    String orderId,
    OrderStatus status,
  ) async {
    try {
      final updates = {
        'status': status.toString(),
        'updatedAt': FieldValue.serverTimestamp(),
      };

      // Add timestamp based on status
      switch (status) {
        case OrderStatus.accepted:
          updates['acceptedAt'] = FieldValue.serverTimestamp();
          break;
        case OrderStatus.ready:
          updates['readyAt'] = FieldValue.serverTimestamp();
          break;
        case OrderStatus.inTransit:
          updates['inTransitAt'] = FieldValue.serverTimestamp();
          break;
        case OrderStatus.delivered:
          updates['deliveredAt'] = FieldValue.serverTimestamp();
          break;
        case OrderStatus.completed:
          updates['completedAt'] = FieldValue.serverTimestamp();
          break;
        default:
          break;
      }

      await _firestore.collection(_collection).doc(orderId).update(updates);
    } catch (e) {
      print('Error updating order status: $e');
      rethrow;
    }
  }

  // Assign delivery company to order
  Future<void> assignDeliveryCompany(
    String orderId,
    String deliveryCompanyId,
    String deliveryCompanyName,
  ) async {
    try {
      await _firestore.collection(_collection).doc(orderId).update({
        'deliveryCompanyId': deliveryCompanyId,
        'deliveryCompanyName': deliveryCompanyName,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Error assigning delivery company: $e');
      rethrow;
    }
  }

  // Get order by ID
  Future<OrderModel> getOrderById(String orderId) async {
    try {
      final doc = await _firestore.collection(_collection).doc(orderId).get();
      if (!doc.exists) {
        throw 'Order not found';
      }
      return OrderModel.fromFirestore(doc);
    } catch (e) {
      print('Error getting order: $e');
      rethrow;
    }
  }

  // Get orders by customer
  Stream<List<OrderModel>> getOrdersByCustomer(String customerId) {
    return _firestore
        .collection(_collection)
        .where('customerId', isEqualTo: customerId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => OrderModel.fromFirestore(doc))
            .toList());
  }

  // Get orders by seller
  Stream<List<OrderModel>> getOrdersBySeller(String sellerId) {
    return _firestore
        .collection(_collection)
        .where('sellerId', isEqualTo: sellerId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => OrderModel.fromFirestore(doc))
            .toList());
  }

  // Get orders by delivery company
  Stream<List<OrderModel>> getOrdersByDeliveryCompany(String deliveryCompanyId) {
    return _firestore
        .collection(_collection)
        .where('deliveryCompanyId', isEqualTo: deliveryCompanyId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => OrderModel.fromFirestore(doc))
            .toList());
  }

  // Get orders by status
  Stream<List<OrderModel>> getOrdersByStatus(OrderStatus status) {
    return _firestore
        .collection(_collection)
        .where('status', isEqualTo: status.toString())
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => OrderModel.fromFirestore(doc))
            .toList());
  }

  // Update deposit payment status
  Future<void> updateDepositPaymentStatus(
    String orderId,
    bool isDepositPaid,
  ) async {
    try {
      await _firestore.collection(_collection).doc(orderId).update({
        'isDepositPaid': isDepositPaid,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Error updating deposit payment status: $e');
      rethrow;
    }
  }

  // Cancel order
  Future<void> cancelOrder(String orderId) async {
    try {
      await _firestore.collection(_collection).doc(orderId).update({
        'status': OrderStatus.cancelled.toString(),
        'updatedAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print('Error cancelling order: $e');
      rethrow;
    }
  }
} 