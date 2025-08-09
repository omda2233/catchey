import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FirebaseAuthService } from '@/lib/firebaseAuth';

// Define user roles
export type UserRole = 'buyer' | 'seller' | 'shipping' | 'admin';

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
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  createUserAsAdmin: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = FirebaseAuthService.onAuthStateChanged((user) => {
      setUser(user);
    });
    
    return unsubscribe;
  }, []);

  // Sign in with Firebase Auth
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await FirebaseAuthService.signIn(email, password);
      setUser(user);
      toast({
        title: 'Signed in successfully',
        description: `Welcome back, ${user.name}!`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with Firebase Auth
  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await FirebaseAuthService.signUp(name, email, password);
      setUser(user);
      toast({
        title: 'Account created',
        description: `Welcome to Catchy, ${user.name}! Please check your email for verification.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Sign up failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out with Firebase Auth
  const signOut = async () => {
    setIsLoading(true);
    try {
      await FirebaseAuthService.signOut();
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

  // Update user profile
  const updateUser = async (updatedUser: User) => {
    setIsLoading(true);
    try {
      await FirebaseAuthService.updateUserProfile(updatedUser.id, updatedUser);
      
      // Update current user if it's the same user
      if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await FirebaseAuthService.resetPassword(email);
      toast({
        title: "Reset email sent",
        description: "Password reset instructions have been sent to your email.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : 'There was a problem sending the reset email.',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password (alias for reset password)
  const forgotPassword = async (email: string) => {
    return resetPassword(email);
  };

  // Create user as admin (admin only)
  const createUserAsAdmin = async (name: string, email: string, password: string, role: UserRole) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Only admins can create users');
    }
    
    setIsLoading(true);
    try {
      const newUser = await FirebaseAuthService.createUserAsAdmin(name, email, password, role);
      toast({
        title: 'User created successfully',
        description: `${newUser.name} (${role}) has been created.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Failed to create user',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
    resetPassword,
    forgotPassword,
    createUserAsAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
