
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Define user roles
export type UserRole = 'user' | 'seller' | 'shipping' | 'admin';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Define auth context shape
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John User',
    email: 'user@example.com',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=John+User&background=1A1F2C&color=E6B54A',
  },
  {
    id: '2',
    name: 'Sarah Seller',
    email: 'seller@example.com',
    role: 'seller',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Seller&background=1A1F2C&color=E6B54A',
  },
  {
    id: '3',
    name: 'Mike Shipper',
    email: 'shipping@example.com',
    role: 'shipping',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Shipper&background=1A1F2C&color=E6B54A',
  },
  {
    id: '4',
    name: 'Amanda Admin',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Amanda+Admin&background=1A1F2C&color=E6B54A',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${foundUser.name}!`,
          variant: "default",
        });
        return;
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock sign up function
  const signUp = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      const newUser: User = {
        id: (MOCK_USERS.length + 1).toString(),
        name,
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1A1F2C&color=E6B54A`,
      };
      
      // In a real app, we would save this user to the database
      // For this mock, we'll just set the current user
      setUser(newUser);
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock sign out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
