// Test Payment Data Configuration
// These are the test credentials that work with the backend payment functions

export const TEST_PAYMENT_DATA = {
  // Test Credit Cards
  cards: {
    visa: {
      number: '4111 1111 1111 1111',
      expiry: '12/34',
      cvv: '123',
      type: 'Visa'
    },
    mastercard: {
      number: '5555 5555 5555 4444',
      expiry: '12/34',
      cvv: '123',
      type: 'MasterCard'
    }
  },
  
  // Test Instapay
  instapay: {
    number: '01112223334'
  }
};

// Payment method types
export const PAYMENT_METHODS = {
  CARD: 'card',
  INSTAPAY: 'instapay'
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  BOOKING: 'booking',
  SHIPPING: 'shipping'
} as const;

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

// Card types
export const CARD_TYPES = {
  VISA: 'Visa',
  MASTERCARD: 'MasterCard'
} as const;

// Payment validation messages
export const PAYMENT_MESSAGES = {
  SUCCESS: {
    CARD: 'Payment processed successfully using {cardType}',
    INSTAPAY: 'Instapay payment processed successfully'
  },
  ERROR: {
    INVALID_CARD: 'Invalid test card details',
    INVALID_INSTAPAY: 'Invalid test Instapay number',
    MISSING_FIELDS: 'Missing required payment fields',
    UNAUTHORIZED: 'User must be authenticated'
  }
};

// Test payment instructions for developers
export const TEST_PAYMENT_INSTRUCTIONS = {
  title: 'Test Payment Instructions',
  description: 'Use these test credentials to test payment functionality',
  cards: {
    title: 'Test Credit Cards',
    description: 'These cards will always return successful payments',
    visa: {
      label: 'Visa Test Card',
      number: '4111 1111 1111 1111',
      expiry: '12/34',
      cvv: '123'
    },
    mastercard: {
      label: 'MasterCard Test Card',
      number: '5555 5555 5555 4444',
      expiry: '12/34',
      cvv: '123'
    }
  },
  instapay: {
    title: 'Test Instapay',
    description: 'This Instapay number will always return successful payments',
    number: '01112223334'
  },
  notes: [
    'All test payments are simulated and do not charge real money',
    'Payment processing includes a 1-2 second delay to simulate real processing',
    'All successful payments generate transaction records and notifications',
    'Invalid test credentials will return appropriate error messages'
  ]
}; 