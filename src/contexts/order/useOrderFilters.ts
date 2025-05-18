
import { Order } from '@/models/Order';
import { User } from '@/contexts/AuthContext';

export const useOrderFilters = (
  orders: Order[],
  user: User | null
) => {
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

  return {
    getUserOrders,
    getSellerOrders,
    getShippingOrders,
    getAllOrders
  };
};
