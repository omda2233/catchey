import 'package:cloud_firestore/cloud_firestore.dart';

enum PaymentMethod {
  card,
  instapay,
}

enum TransactionStatus {
  pending,
  successful,
  failed,
}

class TransactionModel {
  final String id;
  final String userId;
  final String? orderId;
  final double amount;
  final PaymentMethod paymentMethod;
  final TransactionStatus status;
  final DateTime createdAt;
  final DateTime? updatedAt;

  TransactionModel({
    required this.id,
    required this.userId,
    this.orderId,
    required this.amount,
    required this.paymentMethod,
    required this.status,
    required this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'user_id': userId,
      'order_id': orderId,
      'amount': amount,
      'payment_method': paymentMethod.toString().split('.').last,
      'status': status.toString().split('.').last,
      'created_at': Timestamp.fromDate(createdAt),
      'updated_at': updatedAt != null ? Timestamp.fromDate(updatedAt!) : null,
    };
  }

  factory TransactionModel.fromMap(String id, Map<String, dynamic> map) {
    return TransactionModel(
      id: id,
      userId: map['user_id'] as String,
      orderId: map['order_id'] as String?,
      amount: (map['amount'] as num).toDouble(),
      paymentMethod: PaymentMethod.values.firstWhere(
        (e) => e.toString().split('.').last == map['payment_method'],
        orElse: () => PaymentMethod.card,
      ),
      status: TransactionStatus.values.firstWhere(
        (e) => e.toString().split('.').last == map['status'],
        orElse: () => TransactionStatus.pending,
      ),
      createdAt: (map['created_at'] as Timestamp).toDate(),
      updatedAt: map['updated_at'] != null
          ? (map['updated_at'] as Timestamp).toDate()
          : null,
    );
  }
}
