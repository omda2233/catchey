
import { Order, OrderStatus } from '@/models/Order';
import { User } from '@/contexts/AuthContext';

export const useOrderUpdate = (
  orders: Order[],
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  user: User | null,
  toast: any,
  language: string
) => {
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

  return { updateOrderStatus };
};
