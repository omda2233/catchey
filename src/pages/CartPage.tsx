
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <ShoppingCart className="h-16 w-16 text-gold/30 mb-4" />
          <h1 className={`text-2xl font-bold mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Your Cart is Empty' : 'سلة التسوق فارغة'}
          </h1>
          <p className={`text-gold/70 mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'Add some products to your cart and they will appear here.' 
              : 'أضف بعض المنتجات إلى سلة التسوق وستظهر هنا.'}
          </p>
          <Button 
            onClick={() => navigate('/products')}
            className="bg-gold hover:bg-gold/90 text-navy"
          >
            {language === 'en' ? 'Browse Products' : 'تصفح المنتجات'}
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
        {language === 'en' ? 'Shopping Cart' : 'سلة التسوق'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-navy-light border border-gold/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gold/10">
                  <TableHead className="text-gold/70">
                    {language === 'en' ? 'Product' : 'المنتج'}
                  </TableHead>
                  <TableHead className="text-gold/70 text-center">
                    {language === 'en' ? 'Quantity' : 'الكمية'}
                  </TableHead>
                  <TableHead className="text-gold/70 text-right">
                    {language === 'en' ? 'Price' : 'السعر'}
                  </TableHead>
                  <TableHead className="text-gold/70 text-right w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const displayName = language === 'en' ? item.product.name : (item.product.nameAr || item.product.name);
                  
                  return (
                    <TableRow key={item.product.id} className="border-gold/10">
                      <TableCell className="text-gold">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.product.images?.[0] || item.product.image} 
                            alt={displayName}
                            className="h-16 w-16 object-cover rounded"
                          />
                          <div>
                            <p className={`font-medium ${language === 'ar' ? 'font-cairo' : ''}`}>{displayName}</p>
                            <p className="text-sm text-gold/60">${item.product.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gold">
                        <div className="flex items-center justify-center border border-gold/30 rounded-md max-w-[100px] mx-auto">
                          <button
                            type="button"
                            className="px-3 py-1 text-gold hover:bg-gold/10 transition-colors"
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gold border-x border-gold/30 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="px-3 py-1 text-gold hover:bg-gold/10 transition-colors"
                            onClick={() => updateQuantity(item.product.id, Math.min(item.product.inStock as number, item.quantity + 1))}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-gold text-right">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gold/70 hover:text-gold hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow className="border-gold/10 bg-navy-dark">
                  <TableCell colSpan={2} className="text-right font-medium text-gold">
                    {language === 'en' ? 'Total' : 'المجموع'}
                  </TableCell>
                  <TableCell className="text-right text-gold font-bold">
                    ${totalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
        
        <div>
          <div className="bg-navy-light border border-gold/10 rounded-lg p-6">
            <h3 className={`text-lg font-bold mb-4 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
            </h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gold">
                <span>{language === 'en' ? 'Items' : 'المنتجات'}</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-gold">
                <span>{language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <Separator className="my-4 bg-gold/10" />
            
            <div className="flex justify-between text-gold font-bold my-4">
              <span>{language === 'en' ? 'Total' : 'المجموع الكلي'}</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <Button 
              onClick={() => {
                if (user) {
                  navigate('/checkout');
                } else {
                  navigate('/auth/signin');
                }
              }}
              className="w-full bg-gold hover:bg-gold/90 text-navy flex items-center justify-center gap-2 mt-4"
            >
              {language === 'en' ? 'Proceed to Checkout' : 'متابعة الدفع'}
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/products')}
              className="w-full mt-4 border-gold/30 text-gold hover:text-gold hover:border-gold"
            >
              {language === 'en' ? 'Continue Shopping' : 'متابعة التسوق'}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
