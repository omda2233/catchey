// Sample users for testing - DO NOT use in production!
// These users will be created in Firebase Auth and Firestore for testing purposes.

export interface SampleUser {
  email: string;
  password: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin' | 'shipping';
  phone?: string;
  companyName?: string;
  address?: string;
}

export const SAMPLE_USERS: SampleUser[] = [
  // Buyer
  {
    email: 'buyer@catchy.com',
    password: 'Buyer123!',
    name: 'Ahmed Hassan',
    role: 'buyer',
    phone: '+201234567890',
    address: 'Cairo, Egypt'
  },
  
  // Seller
  {
    email: 'seller@catchy.com',
    password: 'Seller123!',
    name: 'Fatima Ali',
    role: 'seller',
    phone: '+201234567891',
    companyName: 'Fatima Fabrics',
    address: 'Alexandria, Egypt'
  },
  
  // Admin
  {
    email: 'admin@catchy.com',
    password: 'Admin123!',
    name: 'Mohamed Admin',
    role: 'admin',
    phone: '+201234567892',
    companyName: 'Catchy Admin',
    address: 'Giza, Egypt'
  },
  
  // Shipping
  {
    email: 'shipping@catchy.com',
    password: 'Shipping123!',
    name: 'Omar Shipping',
    role: 'shipping',
    phone: '+201234567893',
    companyName: 'Fast Delivery Co.',
    address: 'Port Said, Egypt'
  }
];

// Helper function to get users by role
export const getUsersByRole = (role: SampleUser['role']): SampleUser[] => {
  return SAMPLE_USERS.filter(user => user.role === role);
};

// Helper function to get user by email
export const getUserByEmail = (email: string): SampleUser | undefined => {
  return SAMPLE_USERS.find(user => user.email === email);
};

// Helper function to validate sample user credentials
export const validateSampleUser = (email: string, password: string): SampleUser | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}; 