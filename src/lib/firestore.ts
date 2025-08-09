import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
  User,
  Product,
  Order,
  Payment,
  Notification,
  CreateUserData,
  CreateProductData,
  CreateOrderData,
  CreatePaymentData,
  CreateNotificationData,
  UpdateUserData,
  UpdateProductData,
  UpdateOrderData,
  UpdatePaymentData,
  UpdateNotificationData
} from '../models/firestoreSchemas';

// Helper function to convert Firestore Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

// Generic function to convert Firestore document to typed object
const convertFirestoreDoc = <T>(doc: any): T => {
  const data = doc.data();
  const converted: any = { id: doc.id, ...data };
  
  // Convert timestamps to dates
  if (data.createdAt) converted.createdAt = timestampToDate(data.createdAt);
  if (data.updatedAt) converted.updatedAt = timestampToDate(data.updatedAt);
  if (data.paymentDate) converted.paymentDate = timestampToDate(data.paymentDate);
  
  return converted as T;
};

// ==================== USER OPERATIONS ====================

export const userService = {
  // Create user
  async createUser(userData: CreateUserData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertFirestoreDoc<User>(docSnap);
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Get users by role
  async getUsersByRole(role: User['role']): Promise<User[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', role),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<User>(doc));
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId: string, userData: UpdateUserData): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};

// ==================== PRODUCT OPERATIONS ====================

export const productService = {
  // Create product
  async createProduct(productData: CreateProductData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Get product by ID
  async getProductById(productId: string): Promise<Product | null> {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertFirestoreDoc<Product>(docSnap);
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  },

  // Get products by owner
  async getProductsByOwner(ownerId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('ownerId', '==', ownerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Product>(doc));
    } catch (error) {
      console.error('Error getting products by owner:', error);
      throw error;
    }
  },

  // Get all available products
  async getAvailableProducts(limitCount: number = 20): Promise<Product[]> {
    try {
      const q = query(
        collection(db, 'products'),
        where('isAvailable', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Product>(doc));
    } catch (error) {
      console.error('Error getting available products:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(productId: string, productData: UpdateProductData): Promise<void> {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
};

// ==================== ORDER OPERATIONS ====================

export const orderService = {
  // Create order
  async createOrder(orderData: CreateOrderData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertFirestoreDoc<Order>(docSnap);
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  },

  // Get orders by buyer
  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, 'orders'),
        where('buyerId', '==', buyerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Order>(doc));
    } catch (error) {
      console.error('Error getting orders by buyer:', error);
      throw error;
    }
  },

  // Get orders by seller
  async getOrdersBySeller(sellerId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, 'orders'),
        where('sellerId', '==', sellerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Order>(doc));
    } catch (error) {
      console.error('Error getting orders by seller:', error);
      throw error;
    }
  },

  // Update order
  async updateOrder(orderId: string, orderData: UpdateOrderData): Promise<void> {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        ...orderData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }
};

// ==================== PAYMENT OPERATIONS ====================

export const paymentService = {
  // Create payment
  async createPayment(paymentData: CreatePaymentData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'payments'), {
        ...paymentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Get payment by ID
  async getPaymentById(paymentId: string): Promise<Payment | null> {
    try {
      const docRef = doc(db, 'payments', paymentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertFirestoreDoc<Payment>(docSnap);
      }
      return null;
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  },

  // Get payments by order
  async getPaymentsByOrder(orderId: string): Promise<Payment[]> {
    try {
      const q = query(
        collection(db, 'payments'),
        where('orderId', '==', orderId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Payment>(doc));
    } catch (error) {
      console.error('Error getting payments by order:', error);
      throw error;
    }
  },

  // Update payment
  async updatePayment(paymentId: string, paymentData: UpdatePaymentData): Promise<void> {
    try {
      const docRef = doc(db, 'payments', paymentId);
      await updateDoc(docRef, {
        ...paymentData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }
};

// ==================== NOTIFICATION OPERATIONS ====================

export const notificationService = {
  // Create notification
  async createNotification(notificationData: CreateNotificationData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get notifications by user
  async getNotificationsByUser(userId: string, limitCount: number = 50): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Notification>(doc));
    } catch (error) {
      console.error('Error getting notifications by user:', error);
      throw error;
    }
  },

  // Get unread notifications by user
  async getUnreadNotificationsByUser(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertFirestoreDoc<Notification>(doc));
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read for user
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const unreadNotifications = await this.getUnreadNotificationsByUser(userId);
      const batch = writeBatch(db);
      
      unreadNotifications.forEach(notification => {
        const docRef = doc(db, 'notifications', notification.id!);
        batch.update(docRef, { read: true });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};

// ==================== REAL-TIME LISTENERS ====================

export const realtimeService = {
  // Listen to user notifications
  onUserNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => convertFirestoreDoc<Notification>(doc));
      callback(notifications);
    });
  },

  // Listen to user orders
  onUserOrders(userId: string, callback: (orders: Order[]) => void) {
    const q = query(
      collection(db, 'orders'),
      where('buyerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => convertFirestoreDoc<Order>(doc));
      callback(orders);
    });
  },

  // Listen to seller orders
  onSellerOrders(sellerId: string, callback: (orders: Order[]) => void) {
    const q = query(
      collection(db, 'orders'),
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => convertFirestoreDoc<Order>(doc));
      callback(orders);
    });
  }
}; 