import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useCart, DeliveryMethod } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Truck, 
  MapPin, 
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, deliveryMethod, setDeliveryMethod } = useCart();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // If cart is empty or not logged in, redirect
  if (items.length === 0 && !isComplete) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    navigate('/auth/signin');
    return null;
  }

  const handleCheckout = () => {
    if (deliveryMethod === 'shipping' && !shippingAddress.trim()) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Please enter a shipping address' 
          : 'الرجاء إدخال عنوان الشحن',
        variant: 'destructive'
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      clearCart();
    }, 1500);
  };
  
  if (isComplete) {
    return (
      <PageLayout>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Order Complete!' : 'تم إكمال الطلب!'}
          </h1>
          <p className={`text-gold/70 mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'Thank you for your purchase. Your order has been received.' 
              : 'شكراً لك على الشراء. تم استلام طلبك.'}
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gold hover:bg-gold/90 text-navy"
          >
            {language === 'en' ? 'Back to Home' : 'العودة إلى الصفحة الرئيسية'}
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
        {language === 'en' ? 'Checkout' : 'الدفع'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Method */}
          <Card className="border-gold/20 bg-navy-light">
            <CardHeader>
              <CardTitle className={language === 'ar' ? 'font-cairo' : ''}>
                {language === 'en' ? 'Delivery Method' : 'طريقة التسليم'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={deliveryMethod} 
                onValueChange={(value) => setDeliveryMethod(value as DeliveryMethod)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" className="border-gold/50 text-gold" />
                  <Label 
                    htmlFor="pickup" 
                    className="flex items-center cursor-pointer text-gold"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-gold/70" />
                    {language === 'en' ? 'Pickup (Reservation)' : 'استلام (حجز)'}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="shipping" id="shipping" className="border-gold/50 text-gold" />
                  <Label 
                    htmlFor="shipping" 
                    className="flex items-center cursor-pointer text-gold"
                  >
                    <Truck className="mr-2 h-4 w-4 text-gold/70" />
                    {language === 'en' ? 'Shipping' : 'شحن'}
                  </Label>
                </div>
              </RadioGroup>
              
              {deliveryMethod === 'shipping' && (
                <div className="mt-4 space-y-3">
                  <Label htmlFor="address" className="text-gold">
                    {language === 'en' ? 'Shipping Address' : 'عنوان الشحن'}
                  </Label>
                  <Input 
                    id="address" 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder={language === 'en' ? 'Enter your full address' : 'أدخل عنوانك الكامل'}
                    className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/40"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Payment Method - Simplified */}
          <Card className="border-gold/20 bg-navy-light">
            <CardHeader>
              <CardTitle className={language === 'ar' ? 'font-cairo' : ''}>
                {language === 'en' ? 'Payment Method' : 'طريقة الدفع'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit-card" id="credit-card" className="border-gold/50 text-gold" />
                <Label 
                  htmlFor="credit-card" 
                  className="flex items-center cursor-pointer text-gold"
                >
                  <CreditCard className="mr-2 h-4 w-4 text-gold/70" />
                  {language === 'en' ? 'Credit Card' : 'بطاقة الائتمان'}
                </Label>
              </div>
              <p className="text-gold/60 text-xs mt-2">
                {language === 'en' 
                  ? '(Demo mode - no actual payment will be processed)' 
                  : '(وضع العرض التوضيحي - لن تتم معالجة الدفع الفعلي)'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border-gold/20 bg-navy-light">
            <CardHeader>
              <CardTitle className={language === 'ar' ? 'font-cairo' : ''}>
                {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {items.map(item => {
                  const displayName = language === 'en' ? item.product.name : (item.product.nameAr || item.product.name);
                  return (
                    <div key={item.product.id} className="flex justify-between text-gold text-sm">
                      <span>{displayName} × {item.quantity}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              
              <Separator className="my-4 bg-gold/10" />
              
              <div className="flex justify-between text-gold font-bold my-4">
                <span>{language === 'en' ? 'Total' : 'المجموع الكلي'}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-gold hover:bg-gold/90 text-navy"
              >
                {isProcessing 
                  ? language === 'en' ? 'Processing...' : 'جاري المعالجة...'
                  : language === 'en' ? 'Complete Order' : 'إكمال الطلب'
                }
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
