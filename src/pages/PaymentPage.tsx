
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody,
  TableCell,
  TableRow 
} from '@/components/ui/table';
import { DollarSign, CreditCard, ArrowLeft, User, Package, MapPin } from 'lucide-react';
import { Order } from '@/models/Order';

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const { orders, processPayment, calculateDepositAmount } = useOrders();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('full');

  // Load order data
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/auth/signin');
      return;
    }
    
    // Find the requested order
    const foundOrder = orders.find(o => o.id === orderId);
    
    if (!foundOrder) {
      // Order not found
      navigate('/orders');
      return;
    }
    
    // Check if this is the customer's order
    if (foundOrder.customer.id !== user.id && user.role !== 'admin') {
      navigate('/orders');
      return;
    }
    
    // Check if the order is in a payable state
    if (foundOrder.status !== 'approved' && foundOrder.status !== 'paid_deposit') {
      navigate('/orders');
      return;
    }
    
    setOrder(foundOrder);
    
    // If already paid deposit, only full payment is available
    if (foundOrder.status === 'paid_deposit') {
      setPaymentOption('full');
    }
    // For pickup orders, set default to deposit unless already paid
    else if (foundOrder.deliveryMethod === 'pickup') {
      setPaymentOption('deposit');
    }
    // For shipping orders, always default to full payment
    else {
      setPaymentOption('full');
    }
  }, [user, orders, orderId, navigate]);

  const handlePayment = async () => {
    if (!order) return;
    
    setIsProcessing(true);
    
    try {
      const success = await processPayment(
        order, 
        paymentOption === 'full' || order.deliveryMethod === 'shipping'
      );
      
      if (success) {
        setTimeout(() => {
          navigate('/orders');
        }, 1000);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  if (!order) return null;

  // Calculate payment amounts
  const isDepositAllowed = order.deliveryMethod === 'pickup' && order.status === 'approved';
  const depositAmount = order.depositAmount || calculateDepositAmount(order.total);
  const remainingAfterDeposit = order.total - depositAmount;

  // Calculate actual payment amount based on selection and previous payments
  const paymentAmount = paymentOption === 'deposit' && isDepositAllowed
    ? depositAmount
    : order.remainingAmount;

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto pb-6">
        <Button 
          variant="link" 
          className="text-gold -ml-4 mb-4"
          onClick={() => navigate('/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Back to Orders' : 'العودة إلى الطلبات'}
        </Button>
        
        <h1 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
          {language === 'en' ? 'Payment' : 'الدفع'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border-gold/20 bg-navy-light">
              <CardHeader>
                <CardTitle className="text-gold">
                  {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                </CardTitle>
                <CardDescription className="text-gold/60 font-mono">
                  {order.id}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Products */}
                  <div>
                    <h3 className="text-sm font-medium text-gold/70 mb-2">
                      {language === 'en' ? 'Products' : 'المنتجات'}
                    </h3>
                    <div className="space-y-2">
                      {order.products.map(product => (
                        <div key={product.id} className="flex items-center gap-3">
                          <Package className="h-4 w-4 text-gold/60" />
                          <span className="text-gold">{product.name}</span>
                          <span className="text-gold/60 ml-auto">
                            ${product.price.toFixed(2)} × {product.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Seller */}
                  <div>
                    <h3 className="text-sm font-medium text-gold/70 mb-2">
                      {language === 'en' ? 'Seller' : 'البائع'}
                    </h3>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gold/60" />
                      <span className="text-gold">{order.sellerName}</span>
                    </div>
                  </div>
                  
                  {/* Delivery Method */}
                  <div>
                    <h3 className="text-sm font-medium text-gold/70 mb-2">
                      {language === 'en' ? 'Delivery Method' : 'طريقة التوصيل'}
                    </h3>
                    <div className="flex items-center gap-3">
                      {order.deliveryMethod === 'shipping' ? (
                        <>
                          <MapPin className="h-4 w-4 text-gold/60" />
                          <span className="text-gold">
                            {language === 'en' ? 'Shipping' : 'الشحن'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Package className="h-4 w-4 text-gold/60" />
                          <span className="text-gold">
                            {language === 'en' ? 'Store Pickup' : 'استلام من المتجر'}
                          </span>
                        </>
                      )}
                    </div>
                    {order.deliveryMethod === 'shipping' && order.shippingAddress && (
                      <div className="mt-1 pl-7 text-gold/60">
                        {order.shippingAddress}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border-gold/20 bg-navy-light sticky top-4">
              <CardHeader>
                <CardTitle className="text-gold">
                  {language === 'en' ? 'Payment Details' : 'تفاصيل الدفع'}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow className="border-gold/10">
                      <TableCell className="text-gold py-1.5">
                        {language === 'en' ? 'Order Total' : 'إجمالي الطلب'}
                      </TableCell>
                      <TableCell className="text-gold text-right py-1.5">
                        ${order.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    
                    {order.paidAmount > 0 && (
                      <TableRow className="border-gold/10">
                        <TableCell className="text-gold py-1.5">
                          {language === 'en' ? 'Already Paid' : 'المدفوع بالفعل'}
                        </TableCell>
                        <TableCell className="text-gold text-right py-1.5">
                          ${order.paidAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {isDepositAllowed && (
                      <TableRow className="border-gold/10">
                        <TableCell className="text-gold py-1.5">
                          {language === 'en' ? 'Required Deposit' : 'العربون المطلوب'}
                        </TableCell>
                        <TableCell className="text-gold text-right py-1.5">
                          ${depositAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                    
                    <TableRow className="border-t border-gold/20">
                      <TableCell className="text-gold font-medium py-3">
                        {language === 'en' ? 'Amount to Pay' : 'المبلغ المطلوب دفعه'}
                      </TableCell>
                      <TableCell className="text-gold font-bold text-right py-3">
                        ${paymentAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                {/* Payment option selector */}
                {isDepositAllowed && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gold/70 mb-2">
                      {language === 'en' ? 'Payment Option' : 'خيار الدفع'}
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant={paymentOption === 'deposit' ? 'default' : 'outline'}
                        className={paymentOption === 'deposit' 
                          ? "w-full bg-gold text-navy hover:bg-gold/90" 
                          : "w-full border-gold/20 text-gold hover:bg-gold/10"}
                        onClick={() => setPaymentOption('deposit')}
                      >
                        {language === 'en' 
                          ? `Pay Deposit (${(depositAmount / order.total * 100).toFixed(0)}%)` 
                          : `دفع العربون (${(depositAmount / order.total * 100).toFixed(0)}%)`
                        }
                      </Button>
                      <Button
                        variant={paymentOption === 'full' ? 'default' : 'outline'}
                        className={paymentOption === 'full' 
                          ? "w-full bg-gold text-navy hover:bg-gold/90" 
                          : "w-full border-gold/20 text-gold hover:bg-gold/10"}
                        onClick={() => setPaymentOption('full')}
                      >
                        {language === 'en' ? 'Pay in Full' : 'الدفع بالكامل'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-gold text-navy hover:bg-gold/90"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {language === 'en' ? 'Processing...' : 'جاري المعالجة...'}
                    </div>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Make Payment' : 'إجراء الدفع'}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
