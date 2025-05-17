
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/models/Product';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from './LanguageContext';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryMethod = 'pickup' | 'shipping';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  itemsBySeller: Record<string, CartItem[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const { toast } = useToast();
  const { language } = useLanguage();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Group items by seller
  const itemsBySeller = items.reduce((grouped, item) => {
    const sellerId = item.product.sellerId || 'unknown';
    if (!grouped[sellerId]) {
      grouped[sellerId] = [];
    }
    grouped[sellerId].push(item);
    return grouped;
  }, {} as Record<string, CartItem[]>);

  const addToCart = (product: Product, quantity: number) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if already in cart
        return currentItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item to cart
        return [...currentItems, { product, quantity }];
      }
    });
    
    toast({
      title: language === 'en' ? 'Added to cart' : 'تمت الإضافة إلى السلة',
      description: language === 'en' 
        ? `${product.name} × ${quantity} added to your cart` 
        : `تمت إضافة ${product.nameAr || product.name} × ${quantity} إلى سلة التسوق`,
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate totals
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        totalItems, 
        totalPrice,
        deliveryMethod,
        setDeliveryMethod,
        itemsBySeller
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
