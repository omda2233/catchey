export interface PaymentMethod {
  id: string;
  name: string;
  nameAr?: string;
  type: 'instapay' | 'vodafone-cash' | 'visa';
  icon: string;
  isActive: boolean;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
  transactionId?: string;
  metadata?: Record<string, any>;
}

export interface TestPaymentData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolderName: string;
}

// Test card numbers for development
export const TEST_VISA_CARDS: TestPaymentData[] = [
  {
    cardNumber: '4111111111111111',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    cardHolderName: 'Test User'
  },
  {
    cardNumber: '4242424242424242',
    expiryMonth: '01',
    expiryYear: '2026',
    cvv: '321',
    cardHolderName: 'Test Buyer'
  }
];
