
import { Order, OrderStatus } from '@/models/Order';
import { User } from '@/contexts/AuthContext';

export const useOrderPayment = (
  orders: Order[],
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  user: User | null,
  toast: any,
  language: string
) => {
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
        newStatus = payFull ? 'paid_full' as OrderStatus : 'paid_deposit';
      } else if (order.status === 'paid_deposit') {
        // Paying remaining balance after deposit
        amountToPay = order.remainingAmount;
        newStatus = 'paid_full' as OrderStatus;
      }
    } else if (order.deliveryMethod === 'shipping' && order.status === 'approved') {
      // Shipping orders must be paid in full
      amountToPay = order.total;
      newStatus = 'paid_full' as OrderStatus;
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
            o.id === order.id ? { ...o, status: 'processing' as OrderStatus, updatedAt: new Date() } : o
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

  return { processPayment };
};
