import 'package:cloud_firestore/cloud_firestore.dart';

class NotificationModel {
  final String id;
  final String userId;
  final String title;
  final String body;
  final DateTime sentAt;
  final bool read;

  NotificationModel({
    required this.id,
    required this.userId,
    required this.title,
    required this.body,
    required this.sentAt,
    required this.read,
  });

  factory NotificationModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return NotificationModel(
      id: doc.id,
      userId: data['user_id'] ?? '',
      title: data['title'] ?? '',
      body: data['body'] ?? '',
      sentAt: (data['sent_at'] as Timestamp).toDate(),
      read: data['read'] ?? false,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'user_id': userId,
      'title': title,
      'body': body,
      'sent_at': Timestamp.fromDate(sentAt),
      'read': read,
    };
  }

  NotificationModel copyWith({
    String? id,
    String? userId,
    String? title,
    String? body,
    DateTime? sentAt,
    bool? read,
  }) {
    return NotificationModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      body: body ?? this.body,
      sentAt: sentAt ?? this.sentAt,
      read: read ?? this.read,
    );
  }
}
