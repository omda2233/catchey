import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import '../models/order_model.dart';

class OrderService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseFunctions _functions = FirebaseFunctions.instance;
  final String _collection = 'orders';

  // Process order using Cloud Function
  Future<Map<String, dynamic>> processOrder({
    required List<Map<String, dynamic>> items,
    required String sellerId,
    String? deliveryId,
    required double totalAmount,
  }) async {
    try {
      final callable = _functions.httpsCallable('processOrder');
      final result = await callable.call({
        'items': items,
        'sellerId': sellerId,
        'deliveryId': deliveryId,
        'totalAmount': totalAmount,
      });
      
      return result.data as Map<String, dynamic>;
    } catch (e) {
      throw 'Error processing order: ${e.toString()}';
    }
  }

  // Update order status using Cloud Function
  Future<Map<String, dynamic>> updateOrderStatus({
    required String orderId,
    required String status,
  }) async {
    try {
      final callable = _functions.httpsCallable('updateOrderStatus');
      final result = await callable.call({
        'orderId': orderId,
        'status': status,
      });
      
      return result.data as Map<String, dynamic>;
    } catch (e) {
      throw 'Error updating order status: ${e.toString()}';
    }
  }

  // Get a single order by ID
  Future<OrderModel?> getOrder(String orderId) async {
    final doc = await _firestore.collection(_collection).doc(orderId).get();
    if (!doc.exists) return null;
    return OrderModel.fromMap(doc.id, doc.data()!);
  }

  // Stream orders for a seller
  Stream<List<OrderModel>> streamSellerOrders(String sellerId) {
    return _firestore
        .collection(_collection)
        .where('seller_id', isEqualTo: sellerId)
        .orderBy('created_at', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => OrderModel.fromMap(doc.id, doc.data()))
          .toList();
    });
  }

  // Stream orders for a buyer
  Stream<List<OrderModel>> streamBuyerOrders(String buyerId) {
    return _firestore
        .collection(_collection)
        .where('buyer_id', isEqualTo: buyerId)
        .orderBy('created_at', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => OrderModel.fromMap(doc.id, doc.data()))
          .toList();
    });
  }

  // Stream orders for delivery person
  Stream<List<OrderModel>> streamDeliveryOrders(String deliveryId) {
    return _firestore
        .collection(_collection)
        .where('delivery_id', isEqualTo: deliveryId)
        .orderBy('created_at', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => OrderModel.fromMap(doc.id, doc.data()))
          .toList();
    });
  }

  // Get orders by status
  Stream<List<OrderModel>> getOrdersByStatus(
    String sellerId,
    OrderStatus status,
  ) {
    return _firestore
        .collection(_collection)
        .where('seller_id', isEqualTo: sellerId)
        .where('status', isEqualTo: status.toString().split('.').last)
        .orderBy('created_at', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => OrderModel.fromMap(doc.id, doc.data()))
          .toList();
    });
  }

  // Get orders count by status
  Future<int> getOrdersCountByStatus(
    String sellerId,
    OrderStatus status,
  ) async {
    final snapshot = await _firestore
        .collection(_collection)
        .where('seller_id', isEqualTo: sellerId)
        .where('status', isEqualTo: status.toString().split('.').last)
        .count()
        .get();
    return snapshot.count ?? 0;
  }

  // Get total sales for a seller
  Future<double> getTotalSales(String sellerId) async {
    final snapshot = await _firestore
        .collection(_collection)
        .where('seller_id', isEqualTo: sellerId)
        .where('status', whereIn: [
          OrderStatus.delivered.toString().split('.').last,
          OrderStatus.shipped.toString().split('.').last,
        ])
        .get();

    return snapshot.docs.fold<double>(
      0,
      (sum, doc) => sum + (doc.data()['total_amount'] as num).toDouble(),
    );
  }

  // Get all orders (admin only)
  Stream<List<OrderModel>> getAllOrders() {
    return _firestore
        .collection(_collection)
        .orderBy('created_at', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => OrderModel.fromMap(doc.id, doc.data()))
          .toList();
    });
  }
} 