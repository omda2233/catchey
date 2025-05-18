
import { useState } from 'react';
import { Order, OrderStatus } from '@/models/Order';
import { User } from '@/contexts/AuthContext';
import { CartItem } from '../CartContext';
import { ToastAction } from '@/components/ui/toast';

export const useOrderCreation = (
  orders: Order[],
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  user: User | null,
  toast: any,
  language: string
) => {
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

  return {
    calculateDepositAmount,
    placeOrder
  };
};
