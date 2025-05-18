
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  User,
  Mail,
  MapPin,
  CircleCheck,
  ShoppingBag,
} from 'lucide-react';

export default function CheckoutPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalPrice, clearCart, deliveryMethod, setDeliveryMethod, itemsBySeller } = useCart();
  const { placeOrder } = useOrders();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Navigate to cart if empty
  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
  }

  // Navigate to sign in if not authenticated
  if (!user && !orderPlaced) {
    navigate('/auth/signin');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // If shipping is selected, require address
      if (deliveryMethod === 'shipping' && !shippingAddress.trim()) {
        throw new Error(language === 'en' 
          ? 'Shipping address is required' 
          : 'عنوان الشحن مطلوب');
      }
      
      // Place the order
      const newOrders = await placeOrder(items, deliveryMethod, shippingAddress);
      
      if (newOrders.length > 0) {
        // Clear the cart after successful order placement
        clearCart();
        setOrderPlaced(true);

        // If the order requires immediate payment (shipping), redirect to payment
        if (deliveryMethod === 'shipping' && newOrders.length === 1) {
          setTimeout(() => {
            navigate(`/payment/${newOrders[0].id}`);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display order confirmation screen
  if (orderPlaced) {
    return (
      <PageLayout>
        <div className="max-w-md mx-auto py-12 text-center">
          <div className="rounded-full bg-green-500/20 p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <CircleCheck className="h-8 w-8 text-green-500" />
          </div>
          <h1 className={`text-3xl font-bold mb-4 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Order Placed Successfully!' : 'تم وضع الطلب بنجاح!'}
          </h1>
          <p className={`text-gold/70 mb-8 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'Your order has been received and is now pending approval from the seller.' 
              : 'تم استلام طلبك وهو الآن في انتظار موافقة البائع.'}
          </p>
          
          {deliveryMethod === 'pickup' && (
            <p className={`text-gold/70 mb-8 ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' 
                ? 'After the seller approves your order, you will need to pay a deposit or the full amount to confirm it.' 
                : 'بعد موافقة البائع على طلبك، ستحتاج إلى دفع عربون أو المبلغ الكامل لتأكيده.'}
            </p>
          )}
          
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/orders')}
              className="w-full bg-gold text-navy hover:bg-gold/90"
            >
              {language === 'en' ? 'View Your Orders' : 'عرض طلباتك'}
            </Button>
            <Button
              onClick={() => navigate('/products')}
              variant="outline"
              className="w-full border-gold/20 text-gold hover:bg-gold/10"
            >
              {language === 'en' ? 'Continue Shopping' : 'متابعة التسوق'}
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const shippingFee = deliveryMethod === 'shipping' ? 10.00 : 0;
  const finalTotal = totalPrice + shippingFee;

  return (
    <PageLayout>
      <div className="pb-6">
        <Button 
          variant="link" 
          className="text-gold -ml-4 mb-4"
          onClick={() => navigate('/cart')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Back to Cart' : 'العودة إلى السلة'}
        </Button>
        
        <h1 className={`text-3xl font-bold mb-8 ${language === 'ar' ? 'font-cairo' : ''}`}>
          {language === 'en' ? 'Checkout' : 'الدفع'}
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer info */}
              <Card className="border-gold/20 bg-navy-light">
                <CardHeader>
                  <CardTitle className="text-gold">
                    {language === 'en' ? 'Customer Information' : 'معلومات العميل'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3 text-gold">
                      <User className="h-4 w-4 text-gold/60" />
                      <span>{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gold">
                      <Mail className="h-4 w-4 text-gold/60" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery method */}
              <Card className="border-gold/20 bg-navy-light">
                <CardHeader>
                  <CardTitle className="text-gold">
                    {language === 'en' ? 'Delivery Method' : 'طريقة التوصيل'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={deliveryMethod} 
                    onValueChange={(value) => setDeliveryMethod(value as 'pickup' | 'shipping')} 
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label 
                        htmlFor="pickup" 
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Package className="h-4 w-4 text-gold" />
                        <span className="text-gold">
                          {language === 'en' ? 'Pickup from Store' : 'استلام من المتجر'}
                        </span>
                        <span className="text-gold/60 text-sm">
                          {language === 'en' ? '(25% deposit required)' : '(مطلوب عربون 25٪)'}
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shipping" id="shipping" />
                      <Label 
                        htmlFor="shipping" 
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Truck className="h-4 w-4 text-gold" />
                        <span className="text-gold">
                          {language === 'en' ? 'Home Delivery' : 'توصيل للمنزل'}
                        </span>
                        <span className="text-gold/60 text-sm">
                          {language === 'en' ? '(Full payment required)' : '(مطلوب دفع كامل)'}
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Shipping address input (only if shipping is selected) */}
                  {deliveryMethod === 'shipping' && (
                    <div className="mt-6">
                      <Label 
                        htmlFor="shipping-address" 
                        className="block text-gold mb-2 flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        {language === 'en' ? 'Shipping Address' : 'عنوان الشحن'} 
                        <span className="text-red-400 text-xs">*</span>
                      </Label>
                      <Textarea 
                        id="shipping-address"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="border-gold/20 bg-navy-dark text-gold placeholder:text-gold/50 resize-none"
                        placeholder={language === 'en' 
                          ? 'Enter your complete address including city and postal code' 
                          : 'أدخل عنوانك الكامل بما في ذلك المدينة والرمز البريدي'
                        }
                        rows={3}
                        required={deliveryMethod === 'shipping'}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order notes */}
              <Card className="border-gold/20 bg-navy-light">
                <CardHeader>
                  <CardTitle className="text-gold">
                    {language === 'en' ? 'Order Notes' : 'ملاحظات الطلب'}
                  </CardTitle>
                  <CardDescription className="text-gold/60">
                    {language === 'en' ? 'Optional' : 'اختياري'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border-gold/20 bg-navy-dark text-gold placeholder:text-gold/50 resize-none"
                    placeholder={language === 'en' 
                      ? 'Any special instructions for your order...' 
                      : 'أي تعليمات خاصة لطلبك...'
                    }
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Order summary */}
            <div>
              <Card className="border-gold/20 bg-navy-light sticky top-4">
                <CardHeader>
                  <CardTitle className="text-gold">
                    {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                  </CardTitle>
                  <CardDescription className="text-gold/60">
                    {items.length} {language === 'en' ? 'items' : 'عناصر'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {/* Display items grouped by seller */}
                  <div className="space-y-4 mb-4">
                    {Object.entries(itemsBySeller).map(([sellerId, sellerItems]) => {
                      const firstItem = sellerItems[0];
                      const sellerName = firstItem.product.sellerName || 'Unknown Seller';
                      const sellerTotal = sellerItems.reduce(
                        (sum, item) => sum + item.product.price * item.quantity, 
                        0
                      );

                      return (
                        <div key={sellerId} className="space-y-2">
                          <div className="font-medium text-gold">
                            {sellerName}
                          </div>
                          {sellerItems.map((item) => (
                            <div key={item.product.id} className="flex justify-between text-sm">
                              <div className="text-gold">
                                {language === 'en' 
                                  ? item.product.name 
                                  : (item.product.nameAr || item.product.name)} 
                                <span className="text-gold/60 ml-1">× {item.quantity}</span>
                              </div>
                              <div className="text-gold font-medium">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                          <Separator className="border-gold/10 my-2" />
                          <div className="flex justify-between text-sm">
                            <div className="text-gold/80">
                              {language === 'en' ? 'Seller Subtotal' : 'المجموع الفرعي للبائع'}
                            </div>
                            <div className="text-gold font-medium">
                              ${sellerTotal.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Separator className="border-gold/10 my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gold">
                        {language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}
                      </span>
                      <span className="text-gold">${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    {deliveryMethod === 'shipping' && (
                      <div className="flex justify-between">
                        <span className="text-gold">
                          {language === 'en' ? 'Shipping' : 'الشحن'}
                        </span>
                        <span className="text-gold">${shippingFee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2 border-t border-gold/10">
                      <span className="text-lg font-bold text-gold">
                        {language === 'en' ? 'Total' : 'الإجمالي'}
                      </span>
                      <span className="text-lg font-bold text-gold">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                    
                    {deliveryMethod === 'pickup' && (
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gold/70">
                          {language === 'en' ? 'Required Deposit (25%)' : 'العربون المطلوب (25٪)'}
                        </span>
                        <span className="text-gold/70">
                          ${(finalTotal * 0.25).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 text-sm text-gold/60">
                    {deliveryMethod === 'pickup' ? (
                      language === 'en' 
                        ? 'By placing this order, you agree to pay a 25% deposit after seller approval.' 
                        : 'بوضع هذا الطلب، فإنك توافق على دفع عربون بنسبة 25٪ بعد موافقة البائع.'
                    ) : (
                      language === 'en' 
                        ? 'By placing this order, you agree to pay the full amount after seller approval.' 
                        : 'بوضع هذا الطلب، فإنك توافق على دفع المبلغ بالكامل بعد موافقة البائع.'
                    )}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-gold text-navy hover:bg-gold/90"
                    disabled={isSubmitting || items.length === 0}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {language === 'en' ? 'Processing...' : 'جاري المعالجة...'}
                      </div>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Place Order' : 'وضع الطلب'}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
