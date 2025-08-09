
// Define order status types
export type OrderStatus = 
  | 'pending_seller_approval' // Initial state when order is placed
  | 'seller_approved' // Seller approved the order
  | 'seller_rejected' // Seller rejected the order
  | 'pending_payment' // Waiting for payment
  | 'paid_partial' // Partial payment made (deposit)
  | 'paid_full' // Full payment made
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
    phoneNumber: string;
  };
  sellerId: string;
  sellerName: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    isReserved: boolean;
    downPaymentRequired: boolean;
  }[];
  total: number;
  depositAmount?: number;
  paidAmount: number;
  remainingAmount: number;
  deliveryMethod: DeliveryMethod;
  status: OrderStatus;
  shippingAddress?: string;
  shippingCompanyId?: string;
  shippingFee?: number;
  notes?: string;
  paymentMethod?: string;
  paymentTransactions?: PaymentTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

import { PaymentTransaction } from './payment';

// Mock orders for initial state
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customer: {
      id: 'CUS-001',
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+1234567890'
    },
    sellerId: 'SEL-001',
    sellerName: 'Fabric Store',
    products: [
      {
        id: 'PROD-001',
        name: 'Cotton Fabric',
        price: 100,
        quantity: 2,
        image: 'cotton-fabric.jpg',
        isReserved: false,
        downPaymentRequired: false
      }
    ],
    total: 200,
    depositAmount: 50,
    paidAmount: 50,
    remainingAmount: 150,
    deliveryMethod: 'pickup',
    status: 'pending_seller_approval',
    shippingAddress: '123 Main St',
    shippingFee: 10,
    notes: 'Needs to be ready by Friday',
    paymentMethod: 'vodafone-cash',
    paymentTransactions: [
      {
        id: 'PAY-001',
        orderId: 'ORD-001',
        amount: 50,
        currency: 'USD',
        paymentMethod: 'vodafone-cash',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ORD-002',
    customer: {
      id: 'CUS-002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phoneNumber: '+0987654321'
    },
    sellerId: 'SEL-002',
    sellerName: 'Thread Shop',
    products: [
      {
        id: 'PROD-002',
        name: 'Embroidery Thread',
        price: 50,
        quantity: 1,
        image: 'thread.jpg',
        isReserved: true,
        downPaymentRequired: true
      }
    ],
    total: 50,
    depositAmount: 25,
    paidAmount: 50,
    remainingAmount: 0,
    deliveryMethod: 'shipping',
    status: 'paid_partial',
    shippingAddress: '456 Elm St',
    shippingFee: 15,
    notes: 'Express shipping required',
    paymentMethod: 'instapay',
    paymentTransactions: [
      {
        id: 'PAY-002',
        orderId: 'ORD-002',
        amount: 50,
        currency: 'USD',
        paymentMethod: 'instapay',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ORD-003',
    customer: { 
      id: 'CUS-003', 
      name: 'John User',
      email: 'user@example.com',
      phoneNumber: '+1234567890'
    },
    sellerId: 'SEL-003',
    sellerName: 'Sarah Seller',
    products: [
      { 
        id: 'PROD-003', 
        name: 'Professional Scissors', 
        price: 59.99, 
        quantity: 1, 
        image: '/placeholder.svg',
        isReserved: false,
        downPaymentRequired: false
      },
      { 
        id: 'PROD-004', 
        name: 'Wool Yarn Set', 
        price: 49.99, 
        quantity: 2, 
        image: '/placeholder.svg',
        isReserved: false,
        downPaymentRequired: false
      }
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
    paymentMethod: 'visa',
    paymentTransactions: [
      {
        id: 'PAY-003',
        orderId: 'ORD-003',
        amount: 159.97,
        currency: 'USD',
        paymentMethod: 'visa',
        status: 'completed',
        createdAt: new Date('2023-05-17'),
        updatedAt: new Date('2023-05-17')
      }
    ],
    createdAt: new Date('2023-05-17'),
    updatedAt: new Date('2023-05-17')
  },
  {
    id: 'ORD-004',
    customer: { 
      id: 'CUS-004', 
      name: 'John User',
      email: 'user@example.com',
      phoneNumber: '+1234567890'
    },
    sellerId: 'SEL-004',
    sellerName: 'Sarah Seller',
    products: [
      { 
        id: 'PROD-005', 
        name: 'Leather Thread', 
        price: 24.99, 
        quantity: 1, 
        image: '/placeholder.svg',
        isReserved: true,
        downPaymentRequired: true
      },
      { 
        id: 'PROD-006', 
        name: 'Measuring Tape Set', 
        price: 19.99, 
        quantity: 1, 
        image: '/placeholder.svg',
        isReserved: false,
        downPaymentRequired: false
      }
    ],
    total: 44.98,
    depositAmount: 15,
    paidAmount: 15,
    remainingAmount: 29.98,
    deliveryMethod: 'pickup',
    status: 'pending_payment',
    paymentMethod: 'instapay',
    paymentTransactions: [
      {
        id: 'PAY-004',
        orderId: 'ORD-004',
        amount: 15,
        currency: 'USD',
        paymentMethod: 'instapay',
        status: 'pending',
        createdAt: new Date('2023-05-18'),
        updatedAt: new Date('2023-05-18')
      }
    ],
    createdAt: new Date('2023-05-18'),
    updatedAt: new Date('2023-05-18')
  },
];
