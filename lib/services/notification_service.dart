import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/notification_model.dart';

class NotificationService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final String _collection = 'notifications';

  // Initialize Firebase Cloud Messaging
  Future<void> initialize() async {
    // Request permission for iOS
    await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // Get FCM token
    final token = await _messaging.getToken();
    print('FCM Token: $token');

    // Listen to token refresh
    _messaging.onTokenRefresh.listen((newToken) {
      print('New FCM Token: $newToken');
      // Update token in user document
      _updateUserFCMToken(newToken);
    });

    // Handle background messages
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  }

  // Update user's FCM token
  Future<void> _updateUserFCMToken(String token) async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        await _firestore.collection('users').doc(user.uid).update({
          'fcm_token': token,
          'updated_at': FieldValue.serverTimestamp(),
        });
      }
    } catch (e) {
      print('Error updating FCM token: $e');
    }
  }

  // Get notifications for a user
  Stream<List<NotificationModel>> getUserNotifications(String userId) {
    return _firestore
        .collection(_collection)
        .where('user_id', isEqualTo: userId)
        .orderBy('sent_at', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => NotificationModel.fromFirestore(doc))
          .toList();
    });
  }

  // Mark notification as read
  Future<void> markAsRead(String notificationId) async {
    await _firestore.collection(_collection).doc(notificationId).update({
      'read': true,
    });
  }

  // Mark all notifications as read for a user
  Future<void> markAllAsRead(String userId) async {
    final batch = _firestore.batch();
    final notifications = await _firestore
        .collection(_collection)
        .where('user_id', isEqualTo: userId)
        .where('read', isEqualTo: false)
        .get();

    for (final doc in notifications.docs) {
      batch.update(doc.reference, {'read': true});
    }

    await batch.commit();
  }

  // Get unread notifications count
  Stream<int> getUnreadCount(String userId) {
    return _firestore
        .collection(_collection)
        .where('user_id', isEqualTo: userId)
        .where('read', isEqualTo: false)
        .snapshots()
        .map((snapshot) => snapshot.docs.length);
  }

  // Delete notification
  Future<void> deleteNotification(String notificationId) async {
    await _firestore.collection(_collection).doc(notificationId).delete();
  }

  // Setup foreground message handling
  void setupForegroundMessageHandler() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Got a message whilst in the foreground!');
      print('Message data: ${message.data}');

      if (message.notification != null) {
        print('Message also contained a notification: ${message.notification}');
        // Show local notification or update UI
        _showLocalNotification(message);
      }
    });
  }

  // Show local notification
  void _showLocalNotification(RemoteMessage message) {
    // This would typically use flutter_local_notifications
    // For now, we'll just print the notification
    print('Local notification: ${message.notification?.title}');
    print('Body: ${message.notification?.body}');
  }

  // Setup notification tap handling
  void setupNotificationTapHandler() {
    // Handle notification tap when app is in background
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('A new onMessageOpenedApp event was published!');
      _handleNotificationTap(message);
    });

    // Handle notification tap when app is terminated
    _messaging.getInitialMessage().then((RemoteMessage? message) {
      if (message != null) {
        print('App opened from notification: ${message.notification?.title}');
        _handleNotificationTap(message);
      }
    });
  }

  // Handle notification tap
  void _handleNotificationTap(RemoteMessage message) {
    // Navigate to appropriate screen based on notification data
    final data = message.data;
    if (data.containsKey('order_id')) {
      // Navigate to order details
      print('Navigate to order: ${data['order_id']}');
    } else if (data.containsKey('type')) {
      // Navigate based on notification type
      print('Navigate based on type: ${data['type']}');
    }
  }
}

// Background message handler (must be top-level function)
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print('Handling a background message: ${message.messageId}');
  print('Message data: ${message.data}');
  print('Message notification: ${message.notification?.title}');
}
