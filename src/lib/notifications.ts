import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { notificationService } from './firestore';
import { Order, Payment, User } from '../models/firestoreSchemas';

// FCM Notification Service
export class NotificationService {
  private static instance: NotificationService;
  private fcmToken: string | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize FCM and request permission
  async initialize(): Promise<void> {
    try {
      // Request permission for notifications
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Get FCM token
        this.fcmToken = await getToken(messaging, {
          vapidKey: 'YOUR_VAPID_KEY' // Replace with your VAPID key
        });
        
        console.log('FCM Token:', this.fcmToken);
        
        // Listen for foreground messages
        this.setupForegroundListener();
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  // Setup listener for foreground messages
  private setupForegroundListener(): void {
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      // Show notification
      this.showNotification(payload);
      
      // Update local notification count
      this.updateNotificationCount();
    });
  }

  // Show browser notification
  private showNotification(payload: any): void {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      const notification = new Notification(payload.notification?.title || 'New Notification', {
        body: payload.notification?.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: payload.data?.type || 'default',
        data: payload.data
      });

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Navigate to relevant page based on notification type
        this.handleNotificationClick(payload.data);
      };
    }
  }

  // Handle notification click
  private handleNotificationClick(data: any): void {
    if (!data) return;

    switch (data.type) {
      case 'order':
        window.location.href = `/orders/${data.orderId}`;
        break;
      case 'payment':
        window.location.href = `/payments/${data.paymentId}`;
        break;
      case 'admin':
        window.location.href = '/admin';
        break;
      default:
        window.location.href = '/dashboard';
    }
  }

  // Update notification count in UI
  private updateNotificationCount(): void {
    // Dispatch custom event to update notification count
    const event = new CustomEvent('notificationReceived');
    window.dispatchEvent(event);
  }

  // Get FCM token
  getFCMToken(): string | null {
    return this.fcmToken;
  }
}

// Notification triggers for different events
export class NotificationTriggers {
  
  // Trigger notification when order is placed
  static async onOrderPlaced(order: Order, seller: User, buyer: User): Promise<void> {
    try {
      // Notify seller about new order
      await notificationService.createNotification({
        userId: seller.id!,
        title: 'New Order Received',
        message: `${buyer.name} has placed an order for ${order.productName}`,
        type: 'order',
        read: false,
        actionUrl: `/orders/${order.id}`,
        data: {
          orderId: order.id,
          buyerId: buyer.id,
          productName: order.productName
        }
      });

      // Notify buyer about order confirmation
      await notificationService.createNotification({
        userId: buyer.id!,
        title: 'Order Placed Successfully',
        message: `Your order for ${order.productName} has been placed and is pending approval`,
        type: 'order',
        read: false,
        actionUrl: `/orders/${order.id}`,
        data: {
          orderId: order.id,
          sellerId: seller.id,
          productName: order.productName
        }
      });

      // Notify admin about new order (if admin exists)
      const adminUsers = await import('./firestore').then(m => m.userService.getUsersByRole('admin'));
      for (const admin of adminUsers) {
        await notificationService.createNotification({
          userId: admin.id!,
          title: 'New Order in System',
          message: `New order placed by ${buyer.name} for ${order.productName}`,
          type: 'admin',
          read: false,
          actionUrl: `/admin/orders/${order.id}`,
          data: {
            orderId: order.id,
            buyerId: buyer.id,
            sellerId: seller.id,
            productName: order.productName
          }
        });
      }

    } catch (error) {
      console.error('Error creating order notifications:', error);
    }
  }

  // Trigger notification when order status is updated
  static async onOrderStatusUpdated(
    order: Order, 
    newStatus: Order['status'], 
    seller: User, 
    buyer: User
  ): Promise<void> {
    try {
      let title = '';
      let message = '';

      switch (newStatus) {
        case 'approved':
          title = 'Order Approved';
          message = `Your order for ${order.productName} has been approved by the seller`;
          break;
        case 'shipped':
          title = 'Order Shipped';
          message = `Your order for ${order.productName} has been shipped`;
          break;
        case 'delivered':
          title = 'Order Delivered';
          message = `Your order for ${order.productName} has been delivered`;
          break;
        case 'cancelled':
          title = 'Order Cancelled';
          message = `Your order for ${order.productName} has been cancelled`;
          break;
        default:
          return;
      }

      // Notify buyer about status update
      await notificationService.createNotification({
        userId: buyer.id!,
        title,
        message,
        type: 'order',
        read: false,
        actionUrl: `/orders/${order.id}`,
        data: {
          orderId: order.id,
          status: newStatus,
          productName: order.productName
        }
      });

    } catch (error) {
      console.error('Error creating status update notification:', error);
    }
  }

  // Trigger notification when payment is successful
  static async onPaymentSuccess(
    payment: Payment, 
    order: Order, 
    buyer: User, 
    seller: User
  ): Promise<void> {
    try {
      // Notify buyer about successful payment
      await notificationService.createNotification({
        userId: buyer.id!,
        title: 'Payment Successful',
        message: `Payment of ${payment.amount} EGP for ${order.productName} was successful`,
        type: 'payment',
        read: false,
        actionUrl: `/orders/${order.id}`,
        data: {
          orderId: order.id,
          paymentId: payment.id,
          amount: payment.amount,
          method: payment.method
        }
      });

      // Notify seller about received payment
      await notificationService.createNotification({
        userId: seller.id!,
        title: 'Payment Received',
        message: `Payment of ${payment.amount} EGP received for ${order.productName}`,
        type: 'payment',
        read: false,
        actionUrl: `/orders/${order.id}`,
        data: {
          orderId: order.id,
          paymentId: payment.id,
          amount: payment.amount,
          buyerName: buyer.name
        }
      });

      // Notify admin about successful payment
      const adminUsers = await import('./firestore').then(m => m.userService.getUsersByRole('admin'));
      for (const admin of adminUsers) {
        await notificationService.createNotification({
          userId: admin.id!,
          title: 'Payment Completed',
          message: `Payment of ${payment.amount} EGP completed for order ${order.id}`,
          type: 'payment',
          read: false,
          actionUrl: `/admin/payments/${payment.id}`,
          data: {
            orderId: order.id,
            paymentId: payment.id,
            amount: payment.amount,
            buyerName: buyer.name,
            sellerName: seller.name
          }
        });
      }

    } catch (error) {
      console.error('Error creating payment notifications:', error);
    }
  }

  // Trigger notification when payment fails
  static async onPaymentFailed(
    payment: Payment, 
    order: Order, 
    buyer: User, 
    errorMessage: string
  ): Promise<void> {
    try {
      await notificationService.createNotification({
        userId: buyer.id!,
        title: 'Payment Failed',
        message: `Payment for ${order.productName} failed: ${errorMessage}`,
        type: 'payment',
        read: false,
        actionUrl: `/orders/${order.id}`,
        data: {
          orderId: order.id,
          paymentId: payment.id,
          error: errorMessage
        }
      });

    } catch (error) {
      console.error('Error creating payment failure notification:', error);
    }
  }

  // Trigger notification for shipping updates
  static async onShippingUpdate(
    order: Order, 
    shippingCompany: User, 
    buyer: User, 
    updateMessage: string
  ): Promise<void> {
    try {
      await notificationService.createNotification({
        userId: buyer.id!,
        title: 'Shipping Update',
        message: updateMessage,
        type: 'order',
        read: false,
        actionUrl: `/orders/${order.id}`,
        data: {
          orderId: order.id,
          shippingCompanyId: shippingCompany.id,
          shippingCompanyName: shippingCompany.companyName
        }
      });

    } catch (error) {
      console.error('Error creating shipping notification:', error);
    }
  }

  // Trigger admin notification for system events
  static async onAdminEvent(
    eventTitle: string, 
    eventMessage: string, 
    eventData?: Record<string, any>
  ): Promise<void> {
    try {
      const adminUsers = await import('./firestore').then(m => m.userService.getUsersByRole('admin'));
      
      for (const admin of adminUsers) {
        await notificationService.createNotification({
          userId: admin.id!,
          title: eventTitle,
          message: eventMessage,
          type: 'admin',
          read: false,
          data: eventData
        });
      }

    } catch (error) {
      console.error('Error creating admin notification:', error);
    }
  }
}

// Export singleton instance
export const notificationServiceInstance = NotificationService.getInstance(); 