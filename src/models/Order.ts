
// Define order status types
export type OrderStatus = 
  | 'pending_approval' // Initial state when order is placed
  | 'approved' // Seller approved the order
  | 'rejected' // Seller rejected the order
  | 'paid_deposit' // User paid deposit (for pickup orders)
  | 'paid_full' // User paid full amount (for shipping orders or remaining balance)
  | 'processing' // Order is being prepared
  | 'shipped' // Order has been shipped
  | 'delivered' // Order has been delivered
  | 'cancelled' // Order was cancelled
  | 'completed'; // Order is complete

export type DeliveryMethod = 'pickup' | 'shipping';

// Order model
export interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  sellerId: string;
  sellerName: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  total: number;
  depositAmount?: number; // Amount required for deposit (if pickup)
  paidAmount: number; // Amount already paid
  remainingAmount: number; // Amount still due
  deliveryMethod: DeliveryMethod;
  status: OrderStatus;
  shippingAddress?: string;
  shippingCompanyId?: string;
  shippingFee?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock orders for initial state
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customer: { 
      id: '3', 
      name: 'Buyer User',
      email: 'buyer@test.com'
    },
    sellerId: '2',
    sellerName: 'Seller User',
    products: [
      { id: 'P1', name: 'Blue Cotton Fabric', price: 24.99, quantity: 2, image: '/placeholder.svg' },
      { id: 'P2', name: 'Sewing Kit', price: 79.99, quantity: 1, image: '/placeholder.svg' }
    ],
    total: 129.97,
    depositAmount: 30,
    paidAmount: 0,
    remainingAmount: 129.97,
    deliveryMethod: 'pickup',
    status: 'pending_approval',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15')
  },
  {
    id: 'ORD-002',
    customer: { 
      id: '3', 
      name: 'Buyer User',
      email: 'buyer@test.com'
    },
    sellerId: '2',
    sellerName: 'Seller User',
    products: [
      { id: 'P3', name: 'Silk Fabric', price: 29.99, quantity: 3, image: '/placeholder.svg' }
    ],
    total: 89.97,
    depositAmount: 0, // No deposit for shipping
    paidAmount: 89.97,
    remainingAmount: 0,
    deliveryMethod: 'shipping',
    status: 'processing',
    shippingAddress: '123 Main St, New York, NY',
    shippingCompanyId: '4',
    shippingFee: 10.00,
    createdAt: new Date('2023-05-16'),
    updatedAt: new Date('2023-05-16')
  },
  {
    id: 'ORD-003',
    customer: { 
      id: '5', 
      name: 'John User',
      email: 'user@example.com'
    },
    sellerId: '6',
    sellerName: 'Sarah Seller',
    products: [
      { id: 'P4', name: 'Professional Scissors', price: 59.99, quantity: 1, image: '/placeholder.svg' },
      { id: 'P5', name: 'Wool Yarn Set', price: 49.99, quantity: 2, image: '/placeholder.svg' }
    ],
    total: 159.97,
    depositAmount: 0, // No deposit for shipping
    paidAmount: 159.97,
    remainingAmount: 0,
    deliveryMethod: 'shipping',
    status: 'shipped',
    shippingAddress: '456 Oak St, San Francisco, CA',
    shippingCompanyId: '4',
    shippingFee: 12.50,
    createdAt: new Date('2023-05-17'),
    updatedAt: new Date('2023-05-17')
  },
  {
    id: 'ORD-004',
    customer: { 
      id: '5', 
      name: 'John User',
      email: 'user@example.com'
    },
    sellerId: '6',
    sellerName: 'Sarah Seller',
    products: [
      { id: 'P6', name: 'Leather Thread', price: 24.99, quantity: 1, image: '/placeholder.svg' },
      { id: 'P7', name: 'Measuring Tape Set', price: 19.99, quantity: 1, image: '/placeholder.svg' }
    ],
    total: 44.98,
    depositAmount: 15,
    paidAmount: 15, // Deposit paid
    remainingAmount: 29.98,
    deliveryMethod: 'pickup',
    status: 'paid_deposit',
    createdAt: new Date('2023-05-18'),
    updatedAt: new Date('2023-05-18')
  },
];
