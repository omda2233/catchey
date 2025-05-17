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
  active?: boolean;
}

// Define auth context shape
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'> & { password: string }) => Promise<void>;
  allUsers: User[];
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test users for different roles
const MOCK_USERS: User[] = [
  // Admin User
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=1A1F2C&color=E6B54A',
    active: true,
  },
  // Seller User
  {
    id: '2',
    name: 'Seller User',
    email: 'seller@test.com',
    role: 'seller',
    avatar: 'https://ui-avatars.com/api/?name=Seller+User&background=1A1F2C&color=E6B54A',
    active: true,
  },
  // Buyer User (Regular User)
  {
    id: '3',
    name: 'Buyer User',
    email: 'buyer@test.com',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Buyer+User&background=1A1F2C&color=E6B54A',
    active: true,
  },
  // Shipping User
  {
    id: '4',
    name: 'Transport User',
    email: 'transport@test.com',
    role: 'shipping',
    avatar: 'https://ui-avatars.com/api/?name=Transport+User&background=1A1F2C&color=E6B54A',
    active: true,
  },
  // Keep existing users for backward compatibility
  {
    id: '5',
    name: 'John User',
    email: 'user@example.com',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=John+User&background=1A1F2C&color=E6B54A',
    active: true,
  },
  {
    id: '6',
    name: 'Sarah Seller',
    email: 'seller@example.com',
    role: 'seller',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Seller&background=1A1F2C&color=E6B54A',
    active: true,
  },
  {
    id: '7',
    name: 'Mike Shipper',
    email: 'shipping@example.com',
    role: 'shipping',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Shipper&background=1A1F2C&color=E6B54A',
    active: true,
  },
  {
    id: '8',
    name: 'Amanda Admin',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Amanda+Admin&background=1A1F2C&color=E6B54A',
    active: true,
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const { toast } = useToast();

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('User not found');
      }

      if (foundUser.active === false) {
        throw new Error('This account has been deactivated');
      }
      
      // Use "test123" as the password for all test users
      if (password === 'test123' || password === 'password') {
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
      
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      const newUser: User = {
        id: (users.length + 1).toString(),
        name,
        email,
        role,
        active: true,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1A1F2C&color=E6B54A`,
      };
      
      // Add user to list
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      // Set current user
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

  // Update user function
  const updateUser = async (updatedUser: User) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update users list
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === updatedUser.id ? updatedUser : u
        )
      );
      
      // Update current user if it's the same user
      if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
      }
      
      toast({
        title: "User updated",
        description: "User information has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating the user.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user function
  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Cannot delete yourself
      if (user && user.id === userId) {
        throw new Error("You cannot delete your own account");
      }
      
      // Remove user from list
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      
      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "There was a problem deleting the user.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add new user function (admin only)
  const addUser = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      const newUser: User = {
        id: (users.length + 1).toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        active: userData.active !== false,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=1A1F2C&color=E6B54A`,
      };
      
      // Add user to list
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      toast({
        title: "User added",
        description: "New user has been added successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Add user failed",
        description: error instanceof Error ? error.message : "There was a problem adding the user.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signIn, 
      signUp, 
      signOut, 
      updateUser, 
      deleteUser, 
      addUser,
      allUsers: users
    }}>
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
