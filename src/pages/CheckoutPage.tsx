
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
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Group cart items by seller
const groupItemsBySeller = (items: any[]) => {
  const grouped: Record<string, any[]> = {};
  
  items.forEach(item => {
    // Assuming each product has a sellerId property
    const sellerId = item.product.sellerId || 'unknown';
    if (!grouped[sellerId]) {
      grouped[sellerId] = [];
    }
    grouped[sellerId].push(item);
  });
  
  return grouped;
};

// Calculate total for a group of items
const calculateGroupTotal = (items: any[]) => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, deliveryMethod, setDeliveryMethod } = useCart();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Group items by seller
  const itemsBySeller = groupItemsBySeller(items);
  
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
    
    // Calculate payment amount based on delivery method
    const paymentAmount = deliveryMethod === 'pickup' 
      ? totalPrice * 0.2 // 20% deposit for pickup
      : totalPrice;      // Full amount for shipping
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // In a real implementation, we would:
      // 1. Create separate orders for each seller
      // 2. Set status to pending_approval
      // 3. Notify sellers
      // 4. Process payment (deposit or full amount)
      
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
          <p className={`text-gold/70 mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {deliveryMethod === 'pickup'
              ? language === 'en' 
                ? 'Your deposit has been paid. Waiting for seller approval.' 
                : 'تم دفع العربون. في انتظار موافقة البائع.'
              : language === 'en' 
                ? 'Your payment has been completed. Waiting for seller approval.' 
                : 'تم إكمال الدفع. في انتظار موافقة البائع.'
            }
          </p>
          <p className={`text-gold/70 mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'You will receive a confirmation once your order is approved.' 
              : 'ستتلقى تأكيدًا بمجرد الموافقة على طلبك.'}
          </p>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gold hover:bg-gold/90 text-navy mr-2"
          >
            {language === 'en' ? 'View My Orders' : 'عرض طلباتي'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
            className="border-gold/30 text-gold hover:text-gold hover:border-gold"
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-2 h-4 w-4 text-gold/50 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-navy-dark text-gold border-gold/20">
                          {language === 'en' 
                            ? 'Only 20% deposit required for pickup orders' 
                            : 'مطلوب فقط 20٪ عربون للطلبات التي سيتم استلامها'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-2 h-4 w-4 text-gold/50 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-navy-dark text-gold border-gold/20">
                          {language === 'en' 
                            ? 'Full payment required for shipping orders' 
                            : 'الدفع الكامل مطلوب لطلبات الشحن'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
              <CardDescription className="text-gold/60">
                {language === 'en' 
                  ? 'All payments are processed through the Admin\'s InstaPay account'
                  : 'تتم معالجة جميع المدفوعات من خلال حساب InstaPay الخاص بالمسؤول'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem checked value="instapay" id="instapay" className="border-gold/50 text-gold" />
                <Label 
                  htmlFor="instapay" 
                  className="flex items-center cursor-pointer text-gold"
                >
                  <CreditCard className="mr-2 h-4 w-4 text-gold/70" />
                  {language === 'en' ? 'InstaPay' : 'انستاباي'}
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
              {Object.keys(itemsBySeller).length > 1 && (
                <CardDescription className="text-gold/60">
                  <AlertCircle className="inline-block mr-1 h-4 w-4" />
                  {language === 'en' 
                    ? 'This order contains items from multiple sellers'
                    : 'يحتوي هذا الطلب على عناصر من بائعين متعددين'}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {Object.entries(itemsBySeller).map(([sellerId, sellerItems], index) => (
                <div key={sellerId} className={index > 0 ? "mt-4 pt-4 border-t border-gold/10" : ""}>
                  <div className="text-sm text-gold/70 mb-2">
                    {language === 'en' ? 'Seller' : 'البائع'}: {sellerItems[0]?.product.sellerName || 'Unknown Seller'}
                  </div>
                  <div className="space-y-2">
                    {sellerItems.map(item => {
                      const displayName = language === 'en' ? item.product.name : (item.product.nameAr || item.product.name);
                      return (
                        <div key={item.product.id} className="flex justify-between text-gold text-sm">
                          <span>{displayName} × {item.quantity}</span>
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between text-gold text-sm font-semibold">
                      <span>{language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                      <span>${calculateGroupTotal(sellerItems).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Separator className="my-4 bg-gold/10" />
              
              <div className="flex justify-between text-gold text-sm mb-2">
                <span>{language === 'en' ? 'Total' : 'المجموع'}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              {deliveryMethod === 'pickup' && (
                <>
                  <div className="flex justify-between text-gold/70 text-sm mb-2">
                    <span>{language === 'en' ? 'Required Deposit (20%)' : 'العربون المطلوب (20٪)'}</span>
                    <span>${(totalPrice * 0.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gold/70 text-sm">
                    <span>{language === 'en' ? 'Remaining Balance' : 'الرصيد المتبقي'}</span>
                    <span>${(totalPrice * 0.8).toFixed(2)}</span>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <Button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-gold hover:bg-gold/90 text-navy"
                >
                  {isProcessing 
                    ? language === 'en' ? 'Processing...' : 'جاري المعالجة...'
                    : deliveryMethod === 'pickup'
                      ? language === 'en' ? 'Pay Deposit' : 'دفع العربون'
                      : language === 'en' ? 'Pay Full Amount' : 'دفع المبلغ كاملاً'
                  }
                </Button>
                <p className="text-xs text-gold/60 text-center mt-2">
                  {language === 'en' 
                    ? 'Your order will await seller approval after payment'
                    : 'سينتظر طلبك موافقة البائع بعد الدفع'}
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
