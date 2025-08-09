export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'shipping' | 'admin';
  avatar?: string;
  active?: boolean;
}

export interface FirestoreUser {
  userId: string;
  fullName: string;
  email: string;
  role: 'buyer' | 'seller' | 'shipping' | 'admin';
  createdAt: Date;
}

export interface Seller extends User {
  businessName?: string;
  businessAddress?: string;
  isVerified: boolean;
}

export interface Buyer extends User {
  shippingAddress?: string;
  preferredPaymentMethod?: string;
}
