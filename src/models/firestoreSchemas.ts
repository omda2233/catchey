// Firestore Collection Interfaces

export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin' | 'shipping';
  phone?: string;
  address?: string;
  companyName?: string; // For sellers/shipping companies
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id?: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  originalPrice?: number;
  ownerId: string;
  ownerName?: string;
  imageUrl: string;
  images?: string[];
  isReserved?: boolean;
  reservationPrice?: number; // 50% of price
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id?: string;
  buyerId: string;
  buyerName?: string;
  sellerId: string;
  sellerName?: string;
  productId: string;
  productName?: string;
  productImage?: string;
  quantity: number;
  totalAmount: number;
  shippingCompanyId?: string;
  shippingCompanyName?: string;
  shippingAddress?: string;
  paymentId?: string;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'failed';
  isReserved: boolean;
  reservationAmount?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id?: string;
  orderId: string;
  amount: number;
  deposit: number; // For partial payments
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  method: 'instapay' | 'vodafoneCash' | 'visa' | 'bankTransfer';
  transactionId?: string;
  cardLast4?: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'admin' | 'system';
  read: boolean;
  actionUrl?: string; // Deep link to relevant page
  data?: Record<string, any>; // Additional data
  createdAt: Date;
}

// Helper types for creating documents
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateOrderData = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type CreatePaymentData = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateNotificationData = Omit<Notification, 'id' | 'createdAt'>;

// Update types (partial)
export type UpdateUserData = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateProductData = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateOrderData = Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdatePaymentData = Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateNotificationData = Partial<Omit<Notification, 'id' | 'createdAt'>>; 