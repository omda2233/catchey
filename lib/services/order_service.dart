import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/order_model.dart';

class OrderService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final String _collection = 'orders';

  // Create a new order
  Future<String> createOrder(OrderModel order) async {
    final docRef = await _firestore.collection(_collection).add(order.toMap());
    return docRef.id;
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
        .where('sellerId', isEqualTo: sellerId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => OrderModel.fromMap(doc.id, doc.data()))
          .toList();
    });
  }

  // Stream orders for a customer
  Stream<List<OrderModel>> streamCustomerOrders(String customerId) {
    return _firestore
        .collection(_collection)
        .where('customerId', isEqualTo: customerId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => OrderModel.fromMap(doc.id, doc.data()))
          .toList();
    });
  }

  // Update order status
  Future<void> updateOrderStatus(String orderId, OrderStatus status) async {
    await _firestore.collection(_collection).doc(orderId).update({
      'status': status.toString().split('.').last,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // Delete an order
  Future<void> deleteOrder(String orderId) async {
    await _firestore.collection(_collection).doc(orderId).delete();
  }

  // Get orders by status
  Stream<List<OrderModel>> getOrdersByStatus(
    String sellerId,
    OrderStatus status,
  ) {
    return _firestore
        .collection(_collection)
        .where('sellerId', isEqualTo: sellerId)
        .where('status', isEqualTo: status.toString().split('.').last)
        .orderBy('createdAt', descending: true)
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
        .where('sellerId', isEqualTo: sellerId)
        .where('status', isEqualTo: status.toString().split('.').last)
        .count()
        .get();
    return snapshot.count ?? 0;
  }

  // Get total sales for a seller
  Future<double> getTotalSales(String sellerId) async {
    final snapshot = await _firestore
        .collection(_collection)
        .where('sellerId', isEqualTo: sellerId)
        .where('status', whereIn: [
          OrderStatus.delivered.toString().split('.').last,
          OrderStatus.shipped.toString().split('.').last,
        ])
        .get();

    return snapshot.docs.fold<double>(
      0,
      (sum, doc) => sum + (doc.data()['total'] as num).toDouble(),
    );
  }
} 