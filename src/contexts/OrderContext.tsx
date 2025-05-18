
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { Order, OrderStatus, MOCK_ORDERS } from '@/models/Order';
import { Product } from '@/models/Product';
import { CartItem } from './CartContext';
import { useLanguage } from './LanguageContext';

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

  // Helper to calculate deposit amount (25% of total)
  const calculateDepositAmount = (total: number): number => {
    return Math.round((total * 0.25) * 100) / 100;
  };

  // Create a new order from cart items
  const placeOrder = async (
    cartItems: CartItem[], 
    deliveryMethod: 'pickup' | 'shipping',
    shippingAddress?: string
  ): Promise<Order[]> => {
    if (!user) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'You must be logged in to place an order' : 'يجب أن تكون مسجلاً لوضع طلب',
        variant: 'destructive',
      });
      return [];
    }

    // Group cart items by seller
    const itemsBySeller = cartItems.reduce((acc, item) => {
      const sellerId = item.product.sellerId || 'unknown';
      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }
      acc[sellerId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    const newOrders: Order[] = [];

    // Create an order for each seller
    for (const [sellerId, items] of Object.entries(itemsBySeller)) {
      const sellerName = items[0].product.sellerName || 'Unknown Seller';
      const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const shippingFee = deliveryMethod === 'shipping' ? 10.00 : 0; // Default shipping fee
      const orderTotal = total + shippingFee;
      
      const orderProducts = items.map(item => ({
        id: item.product.id,
        name: language === 'en' ? item.product.name : (item.product.nameAr || item.product.name),
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || '/placeholder.svg'
      }));

      // Calculate deposit amount for pickup orders
      const depositAmount = deliveryMethod === 'pickup' ? calculateDepositAmount(orderTotal) : 0;

      const newOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        customer: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        sellerId,
        sellerName,
        products: orderProducts,
        total: orderTotal,
        depositAmount,
        paidAmount: 0, // Initially nothing is paid
        remainingAmount: orderTotal,
        deliveryMethod,
        status: 'pending_approval',
        shippingAddress: deliveryMethod === 'shipping' ? shippingAddress : undefined,
        shippingCompanyId: deliveryMethod === 'shipping' ? '4' : undefined, // Default to our mock shipping company
        shippingFee,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      newOrders.push(newOrder);
    }

    // Add new orders to state
    setOrders(prevOrders => [...prevOrders, ...newOrders]);

    toast({
      title: language === 'en' ? 'Order Placed' : 'تم وضع الطلب',
      description: language === 'en' 
        ? `Your order${newOrders.length > 1 ? 's have' : ' has'} been placed successfully` 
        : `تم تقديم طلبك بنجاح`,
      variant: 'default',
    });

    return newOrders;
  };

  // Get orders for the current user based on their role
  const getUserOrders = (): Order[] => {
    if (!user) return [];
    return orders.filter(order => order.customer.id === user.id);
  };

  const getSellerOrders = (): Order[] => {
    if (!user) return [];
    return orders.filter(order => order.sellerId === user.id);
  };

  const getShippingOrders = (): Order[] => {
    if (!user) return [];
    return orders.filter(order => 
      order.shippingCompanyId === user.id && 
      order.deliveryMethod === 'shipping'
    );
  };

  const getAllOrders = (): Order[] => {
    if (!user || user.role !== 'admin') return [];
    return orders;
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    // Check permissions based on role
    if (!user) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'You must be logged in' : 'يجب أن تكون مسجلاً',
        variant: 'destructive',
      });
      return;
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Order not found' : 'لم يتم العثور على الطلب',
        variant: 'destructive',
      });
      return;
    }

    // Check role-based permissions
    if (user.role === 'seller' && order.sellerId !== user.id) {
      toast({
        title: language === 'en' ? 'Permission Denied' : 'تم رفض الإذن',
        description: language === 'en' ? 'You can only update your own orders' : 'يمكنك فقط تحديث طلباتك',
        variant: 'destructive',
      });
      return;
    }

    if (user.role === 'shipping' && order.shippingCompanyId !== user.id) {
      toast({
        title: language === 'en' ? 'Permission Denied' : 'تم رفض الإذن',
        description: language === 'en' ? 'You can only update orders assigned to you' : 'يمكنك فقط تحديث الطلبات المخصصة لك',
        variant: 'destructive',
      });
      return;
    }

    // Update order status
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status, updatedAt: new Date() } : o
    ));

    toast({
      title: language === 'en' ? 'Order Updated' : 'تم تحديث الطلب',
      description: language === 'en' 
        ? `Order ${orderId} status updated to ${status}` 
        : `تم تحديث حالة الطلب ${orderId}`,
      variant: 'default',
    });
  };

  // Process payment for an order
  const processPayment = async (order: Order, payFull: boolean): Promise<boolean> => {
    if (!user) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'You must be logged in to make a payment' : 'يجب أن تكون مسجلاً لإجراء الدفع',
        variant: 'destructive',
      });
      return false;
    }

    if (order.customer.id !== user.id && user.role !== 'admin') {
      toast({
        title: language === 'en' ? 'Permission Denied' : 'تم رفض الإذن',
        description: language === 'en' ? 'You can only pay for your own orders' : 'يمكنك فقط الدفع مقابل طلباتك',
        variant: 'destructive',
      });
      return false;
    }

    // Check if order is in a valid state for payment
    if (order.status !== 'pending_approval' && 
        order.status !== 'approved' && 
        order.status !== 'paid_deposit') {
      toast({
        title: language === 'en' ? 'Invalid Order Status' : 'حالة الطلب غير صالحة',
        description: language === 'en' 
          ? 'This order cannot be paid at this time' 
          : 'لا يمكن دفع هذا الطلب في الوقت الحالي',
        variant: 'destructive',
      });
      return false;
    }

    // For pickup orders:
    // - If approved and no payment yet: can pay deposit or full
    // - If already paid deposit: can only pay remaining (full - deposit)
    
    // For shipping orders:
    // - If approved: must pay full amount

    let amountToPay = 0;
    let newStatus: OrderStatus = order.status;
    
    if (order.deliveryMethod === 'pickup') {
      if (order.status === 'approved' && order.paidAmount === 0) {
        // Paying for approved pickup order
        amountToPay = payFull ? order.total : (order.depositAmount || 0);
        newStatus = payFull ? 'paid_full' : 'paid_deposit';
      } else if (order.status === 'paid_deposit') {
        // Paying remaining balance after deposit
        amountToPay = order.remainingAmount;
        newStatus = 'paid_full';
      }
    } else if (order.deliveryMethod === 'shipping' && order.status === 'approved') {
      // Shipping orders must be paid in full
      amountToPay = order.total;
      newStatus = 'paid_full';
    }

    if (amountToPay <= 0) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Invalid payment amount' : 'مبلغ الدفع غير صالح',
        variant: 'destructive',
      });
      return false;
    }

    // Simulate payment processing
    // In a real app, this would integrate with a payment gateway
    setTimeout(() => {
      // Update order with new payment info
      setOrders(orders.map(o => {
        if (o.id !== order.id) return o;
        
        const newPaidAmount = o.paidAmount + amountToPay;
        return {
          ...o,
          paidAmount: newPaidAmount,
          remainingAmount: o.total - newPaidAmount,
          status: newStatus,
          updatedAt: new Date()
        };
      }));

      // Move order to processing if fully paid
      if (newStatus === 'paid_full') {
        setTimeout(() => {
          setOrders(orders.map(o => 
            o.id === order.id ? { ...o, status: 'processing', updatedAt: new Date() } : o
          ));
        }, 2000);
      }
    }, 1000);

    toast({
      title: language === 'en' ? 'Payment Successful' : 'تم الدفع بنجاح',
      description: language === 'en' 
        ? `Your payment of $${amountToPay.toFixed(2)} has been processed` 
        : `تمت معالجة دفعتك بقيمة $${amountToPay.toFixed(2)}`,
      variant: 'default',
    });

    return true;
  };

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
