
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../AuthContext';
import { Order, OrderStatus, MOCK_ORDERS } from '@/models/Order';
import { useLanguage } from '../LanguageContext';
import { CartItem } from '../CartContext';
import { useOrderCreation } from './useOrderCreation';
import { useOrderUpdate } from './useOrderUpdate';
import { useOrderPayment } from './useOrderPayment';
import { useOrderFilters } from './useOrderFilters';

interface OrderContextType {
  orders: Order[];
  placeOrder: (cartItems: CartItem[], deliveryMethod: 'pickup' | 'shipping', shippingAddress?: string) => Promise<Order[]>;
  getUserOrders: () => Order[];
  getSellerOrders: () => Order[];
  getShippingOrders: () => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  processPayment: (order: Order, payFull: boolean) => Promise<boolean>;
  calculateDepositAmount: (total: number) => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();

  // Import order functionality from custom hooks
  const { calculateDepositAmount, placeOrder } = useOrderCreation(orders, setOrders, user, toast, language);
  const { updateOrderStatus } = useOrderUpdate(orders, setOrders, user, toast, language);
  const { processPayment } = useOrderPayment(orders, setOrders, user, toast, language);
  const { getUserOrders, getSellerOrders, getShippingOrders, getAllOrders } = useOrderFilters(orders, user);

  return (
    <OrderContext.Provider value={{ 
      orders,
      placeOrder,
      getUserOrders,
      getSellerOrders,
      getShippingOrders,
      getAllOrders,
      updateOrderStatus,
      processPayment,
      calculateDepositAmount
    }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
