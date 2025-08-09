import { Order, OrderStatus } from '@/models/Order';
import { User } from '@/contexts/AuthContext';

type PaymentMethodType = 'instapay' | 'vodafone-cash' | 'visa';
interface VisaData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolderName: string;
}

export const useOrderPayment = (
  orders: Order[],
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  user: User | null,
  toast: any,
  language: string
) => {
  // Process payment for an order
  const processPayment = async (
    order: Order,
    payFull: boolean,
    paymentMethod: PaymentMethodType,
    visaData?: VisaData
  ): Promise<boolean> => {
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
    if (order.status !== 'seller_approved' && order.status !== 'paid_partial') {
      toast({
        title: language === 'en' ? 'Invalid Order Status' : 'حالة الطلب غير صالحة',
        description: language === 'en' 
          ? 'This order cannot be paid at this time' 
          : 'لا يمكن دفع هذا الطلب في الوقت الحالي',
        variant: 'destructive',
      });
      return false;
    }

    let amountToPay = 0;
    let newStatus: OrderStatus = order.status;

    if (order.products.some(p => p.isReserved)) {
      // Reservation: allow partial payment (deposit)
      if (order.status === 'seller_approved' && order.paidAmount === 0) {
        amountToPay = payFull ? order.total : (order.depositAmount || order.total * 0.5);
        newStatus = payFull ? 'paid_full' : 'paid_partial';
      } else if (order.status === 'paid_partial') {
        amountToPay = order.remainingAmount;
        newStatus = 'paid_full';
      }
    } else {
      // Non-reservation: must pay full
      if (order.status === 'seller_approved') {
        amountToPay = order.total;
        newStatus = 'paid_full';
      }
    }

    if (amountToPay <= 0) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Invalid payment amount' : 'مبلغ الدفع غير صالح',
        variant: 'destructive',
      });
      return false;
    }

    setTimeout(() => {
      setOrders(orders.map(o => {
        if (o.id !== order.id) return o;
        const newPaidAmount = o.paidAmount + amountToPay;
        return {
          ...o,
          paidAmount: newPaidAmount,
          remainingAmount: o.total - newPaidAmount,
          status: newStatus,
          paymentMethod,
          paymentTransactions: [
            ...(o.paymentTransactions || []),
            {
              id: `PAY-${Date.now()}`,
              orderId: o.id,
              amount: amountToPay,
              currency: 'USD',
              paymentMethod,
              status: 'completed',
              createdAt: new Date(),
              updatedAt: new Date(),
              metadata: paymentMethod === 'visa' ? visaData : undefined
            }
          ],
          updatedAt: new Date()
        };
      }));
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

  return { processPayment };
};
