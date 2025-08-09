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
import { useNotifications } from '../NotificationContext';
import { orderService } from '@/lib/firestore';
import { useEffect } from 'react';
import { realtimeService } from '@/lib/firestore';
import { Order as FirestoreOrder } from '@/models/firestoreSchemas';

interface OrderContextType {
  orders: Order[];
  placeOrder: (cartItems: CartItem[], deliveryMethod: 'pickup' | 'shipping', shippingAddress?: string) => Promise<Order[]>;
  getUserOrders: () => Order[];
  getSellerOrders: () => Order[];
  getShippingOrders: () => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  processPayment: (order: Order, payFull: boolean, paymentMethod: string, visaData?: any) => Promise<boolean>;
  calculateDepositAmount: (total: number) => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const { addNotification } = useNotifications();

  // Helper: Map Firestore Order to App Order
  function mapFirestoreOrderToAppOrder(fOrder: FirestoreOrder): Order {
    return {
      id: fOrder.id!,
      customer: {
        id: fOrder.buyerId,
        name: fOrder.buyerName || '',
        email: '', // Email not stored in Firestore order, can be fetched if needed
        phoneNumber: '', // Not stored, can be fetched if needed
      },
      sellerId: fOrder.sellerId,
      sellerName: fOrder.sellerName || '',
      products: [
        {
          id: fOrder.productId,
          name: fOrder.productName || '',
          price: fOrder.totalAmount, // If you have per-product price, adjust here
          quantity: fOrder.quantity,
          image: fOrder.productImage,
          isReserved: fOrder.isReserved,
          downPaymentRequired: !!fOrder.reservationAmount,
        }
      ],
      total: fOrder.totalAmount,
      depositAmount: fOrder.reservationAmount,
      paidAmount: fOrder.paymentStatus === 'paid' ? fOrder.totalAmount : 0, // Simplified
      remainingAmount: fOrder.paymentStatus === 'paid' ? 0 : fOrder.totalAmount,
      deliveryMethod: fOrder.shippingAddress ? 'shipping' : 'pickup',
      status: fOrder.status as OrderStatus,
      shippingAddress: fOrder.shippingAddress,
      shippingCompanyId: fOrder.shippingCompanyId,
      shippingFee: undefined, // Not present in Firestore order
      notes: fOrder.notes,
      paymentMethod: undefined, // Not present in Firestore order
      paymentTransactions: [], // Not present in Firestore order
      createdAt: new Date(fOrder.createdAt),
      updatedAt: new Date(fOrder.updatedAt),
    };
  }

  // Fetch orders in real-time from Firestore
  useEffect(() => {
    if (!user) return;
    // Listen to all orders relevant to the user (buyer, seller, shipping, admin)
    const unsubscribe = realtimeService.onUserOrders(user.id, (firestoreOrders) => {
      setOrders(firestoreOrders.map(mapFirestoreOrderToAppOrder));
    });
    return () => unsubscribe && unsubscribe();
  }, [user]);

  // Import order functionality from custom hooks
  const { calculateDepositAmount, placeOrder } = useOrderCreation(orders, setOrders, user, toast, language);
  const { updateOrderStatus: baseUpdateOrderStatus } = useOrderUpdate(orders, setOrders, user, toast, language);
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await baseUpdateOrderStatus(orderId, status);
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    if (status === 'seller_approved') {
      addNotification({
        userId: order.customer.id,
        title: language === 'en' ? 'Order Approved' : 'تمت الموافقة على الطلب',
        message: language === 'en' ? `Your order #${order.id} has been approved by the seller.` : `تمت الموافقة على طلبك رقم ${order.id} من قبل البائع.`,
        type: 'order',
        relatedId: order.id
      });
    }
    if (status === 'seller_rejected') {
      addNotification({
        userId: order.customer.id,
        title: language === 'en' ? 'Order Rejected' : 'تم رفض الطلب',
        message: language === 'en' ? `Your order #${order.id} was rejected by the seller.` : `تم رفض طلبك رقم ${order.id} من قبل البائع.`,
        type: 'order',
        relatedId: order.id
      });
    }
  };
  const { processPayment: baseProcessPayment } = useOrderPayment(orders, setOrders, user, toast, language);
  const processPayment = async (order, payFull, paymentMethod, visaData) => {
    const result = await baseProcessPayment(order, payFull, paymentMethod, visaData);
    if (result) {
      // Notify seller
      addNotification({
        userId: order.sellerId,
        title: language === 'en' ? 'Payment Received' : 'تم استلام الدفعة',
        message: language === 'en' ? `Payment received for order #${order.id}.` : `تم استلام دفعة للطلب رقم ${order.id}.`,
        type: 'payment',
        relatedId: order.id
      });
    }
    return result;
  };
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
