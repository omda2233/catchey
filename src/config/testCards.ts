// Test Visa cards for development/testing only. DO NOT use in production!
// These are accepted only in dev builds for mock payment validation.

export interface TestCard {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  description: string;
}

export const ALLOWED_TEST_VISA_CARDS: TestCard[] = [
  {
    cardNumber: '4242424242424242',
    expiryMonth: '12',
    expiryYear: '34',
    cvv: '123',
    description: 'Test Card 1 - Always succeeds'
  },
  {
    cardNumber: '4000056655665556',
    expiryMonth: '11',
    expiryYear: '33',
    cvv: '456',
    description: 'Test Card 2 - Always succeeds'
  }
];

// Helper function to validate test card
export const validateTestCard = (
  cardNumber: string,
  expiryMonth: string,
  expiryYear: string,
  cvv: string
): boolean => {
  const cleanCardNumber = cardNumber.replace(/\s/g, '');
  
  return ALLOWED_TEST_VISA_CARDS.some(card => 
    card.cardNumber === cleanCardNumber &&
    card.expiryMonth === expiryMonth &&
    card.expiryYear === expiryYear &&
    card.cvv === cvv
  );
};

// Helper function to get test card info
export const getTestCardInfo = (cardNumber: string): TestCard | null => {
  const cleanCardNumber = cardNumber.replace(/\s/g, '');
  
  return ALLOWED_TEST_VISA_CARDS.find(card => 
    card.cardNumber === cleanCardNumber
  ) || null;
}; 