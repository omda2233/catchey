
import { useMemo } from 'react';
import { Order } from '@/models/Order';

interface OrdersAnalytics {
  totalOrders: number;
  totalRevenue: number;
  pendingApproval: number;
  inProgress: number;
  completed: number;
  pendingPayment: number;
  shippingOrders: number;
  pickupOrders: number;
  cancelledOrders: number;
  topSellingProducts: { name: string; quantity: number; revenue: number }[];
  revenueByDate: { date: string; value: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export function useOrderAnalytics(orders: Order[]): OrdersAnalytics {
  return useMemo(() => {
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.paidAmount, 0);
    
    // Count orders by status
    const pendingApproval = orders.filter(o => o.status === 'pending_approval').length;
    const inProgress = orders.filter(o => ['approved', 'paid_deposit', 'paid_full', 'processing', 'shipped'].includes(o.status)).length;
    const completed = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
    const pendingPayment = orders.filter(o => 
      (o.status === 'approved' || o.status === 'paid_deposit') && o.remainingAmount > 0
    ).length;
    const cancelledOrders = orders.filter(o => o.status === 'rejected' || o.status === 'cancelled').length;

    // Count by delivery method
    const shippingOrders = orders.filter(o => o.deliveryMethod === 'shipping').length;
    const pickupOrders = orders.filter(o => o.deliveryMethod === 'pickup').length;
    
    // Get top selling products
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    
    orders.forEach(order => {
      order.products.forEach(product => {
        if (!productSales[product.id]) {
          productSales[product.id] = {
            name: product.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[product.id].quantity += product.quantity;
        productSales[product.id].revenue += product.price * product.quantity;
      });
    });
    
    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    // Calculate revenue by date
    const revByDate: Record<string, number> = {};
    
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!revByDate[date]) {
        revByDate[date] = 0;
      }
      revByDate[date] += order.paidAmount;
    });
    
    const revenueByDate = Object.entries(revByDate)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Status breakdown
    const statusCounts: Record<string, number> = {};
    
    orders.forEach(order => {
      if (!statusCounts[order.status]) {
        statusCounts[order.status] = 0;
      }
      statusCounts[order.status]++;
    });
    
    const statusBreakdown = Object.entries(statusCounts)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingApproval,
      inProgress,
      completed,
      pendingPayment,
      shippingOrders,
      pickupOrders,
      cancelledOrders,
      topSellingProducts,
      revenueByDate,
      statusBreakdown
    };
  }, [orders]);
}
