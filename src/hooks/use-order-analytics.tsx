
import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/models/Order';

export interface OrderStatusCount {
  status: OrderStatus;
  count: number;
}

export interface DailyOrder {
  date: string;
  count: number;
  amount: number;
}

export interface CategorySales {
  category: string;
  sales: number;
  percentage: number;
}

export interface OrdersAnalytics {
  orderStatusCounts: OrderStatusCount[];
  ordersByDay: DailyOrder[];
  totalSalesAmount: number;
  averageOrderValue: number;
  topSellingCategories: CategorySales[];
}

export function useOrderAnalytics(orders: Order[]): OrdersAnalytics {
  const [analytics, setAnalytics] = useState<OrdersAnalytics>({
    orderStatusCounts: [],
    ordersByDay: [],
    totalSalesAmount: 0,
    averageOrderValue: 0,
    topSellingCategories: []
  });

  useEffect(() => {
    // Status counts
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    const orderStatusCounts: OrderStatusCount[] = Object.keys(statusCounts).map(status => ({
      status: status as OrderStatus,
      count: statusCounts[status]
    }));

    // Orders by day
    const ordersByDayMap = new Map<string, { count: number; amount: number }>();
    const today = new Date();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      ordersByDayMap.set(dateStr, { count: 0, amount: 0 });
    }
    
    // Populate with actual data
    orders.forEach(order => {
      const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
      if (ordersByDayMap.has(dateStr)) {
        const current = ordersByDayMap.get(dateStr)!;
        ordersByDayMap.set(dateStr, {
          count: current.count + 1,
          amount: current.amount + order.total
        });
      }
    });
    
    const ordersByDay: DailyOrder[] = Array.from(ordersByDayMap.entries()).map(([date, data]) => ({
      date,
      count: data.count,
      amount: data.amount
    }));

    // Total sales and average order value
    const totalSalesAmount = orders.reduce((sum, order) => sum + order.paidAmount, 0);
    const averageOrderValue = orders.length > 0 ? totalSalesAmount / orders.length : 0;

    // Top selling categories
    const categorySales: Record<string, number> = {};
    orders.forEach(order => {
      order.products.forEach(product => {
        // Use a default category if none exists
        const category = 'category' in product ? product.category : 'other';
        categorySales[category] = (categorySales[category] || 0) + (product.price * product.quantity);
      });
    });

    const totalSales = Object.values(categorySales).reduce((sum, amount) => sum + amount, 0);
    const topSellingCategories: CategorySales[] = Object.entries(categorySales)
      .map(([category, sales]) => ({
        category,
        sales,
        percentage: totalSales > 0 ? (sales / totalSales) * 100 : 0
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    setAnalytics({
      orderStatusCounts,
      ordersByDay,
      totalSalesAmount,
      averageOrderValue,
      topSellingCategories
    });
  }, [orders]);

  return analytics;
}
