
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProductCarousel } from '@/components/ProductCarousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_PRODUCTS, Product } from '@/models/Product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Store, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/ProductCard';
import { useToast } from '@/components/ui/use-toast';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    
    // Simulate API request delay
    setTimeout(() => {
      const foundProduct = MOCK_PRODUCTS.find(p => p.id === productId);
      setProduct(foundProduct || null);
      
      // Find related products (same category)
      if (foundProduct) {
        const related = MOCK_PRODUCTS.filter(
          p => p.category === foundProduct.category && p.id !== foundProduct.id
        ).slice(0, 4);
        setRelatedProducts(related);
      }
      
      setIsLoading(false);
    }, 800);
  }, [productId]);
  
  const handleAddToCart = () => {
    if (!user) {
      navigate('/auth/signin');
      return;
    }
    
    toast({
      title: language === 'en' ? 'Added to cart' : 'تمت الإضافة إلى السلة',
      description: language === 'en' 
        ? `${product?.name} x${quantity} added to your cart` 
        : `تمت إضافة ${product?.nameAr || product?.name} x${quantity} إلى سلة التسوق`,
    });
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-md bg-navy-light" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 bg-navy-light" />
            <Skeleton className="h-6 w-1/4 bg-navy-light" />
            <Skeleton className="h-4 w-1/2 bg-navy-light" />
            <Skeleton className="h-32 w-full bg-navy-light" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-24 bg-navy-light" />
              <Skeleton className="h-12 flex-grow bg-navy-light" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!product) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gold/70 mb-4" />
          <h1 className={`text-2xl font-bold mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Product Not Found' : 'المنتج غير موجود'}
          </h1>
          <p className={`text-gold/70 mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'The product you are looking for does not exist or has been removed.' 
              : 'المنتج الذي تبحث عنه غير موجود أو تمت إزالته.'}
          </p>
          <Button 
            variant="outline"
            className="border-gold/30 text-gold hover:text-gold hover:border-gold"
            onClick={() => navigate('/products')}
          >
            {language === 'ar' ? <ChevronRight className="mr-2 h-4 w-4" /> : <ChevronLeft className="mr-2 h-4 w-4" />}
            {language === 'en' ? 'Back to Products' : 'العودة إلى المنتجات'}
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  const displayName = language === 'en' ? product.name : (product.nameAr || product.name);
  const displayDescription = language === 'en' ? product.description : (product.descriptionAr || product.description);
  
  return (
    <PageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ProductCarousel images={product.images} productName={displayName} />
        </div>
        
        <div className="flex flex-col">
          <div className="mb-4">
            {product.category && (
              <Badge variant="outline" className="mb-2 text-gold/70 border-gold/30">
                {t(`category.${product.category}`)}
              </Badge>
            )}
            
            <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-cairo' : ''}`}>
              {displayName}
            </h1>
            
            <div className="flex items-center gap-2 my-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-gold/30'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gold/70">
                ({product.reviewCount} {language === 'en' ? 'reviews' : 'تقييمات'})
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-gold">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gold/50">
                {product.currency}
              </span>
            </div>
          </div>
          
          <Separator className="my-4 bg-gold/10" />
          
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <h3 className={`font-semibold mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
                {language === 'en' ? 'Description' : 'الوصف'}
              </h3>
              <p className={`text-gold/80 ${language === 'ar' ? 'font-cairo' : ''}`}>
                {displayDescription}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <span className={`text-sm text-gold/50 block mb-1 ${language === 'ar' ? 'font-cairo' : ''}`}>
                  {language === 'en' ? 'Seller' : 'البائع'}
                </span>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-gold/70" />
                  <span>{product.sellerName}</span>
                </div>
              </div>
              
              <div>
                <span className={`text-sm text-gold/50 block mb-1 ${language === 'ar' ? 'font-cairo' : ''}`}>
                  {language === 'en' ? 'Availability' : 'التوفر'}
                </span>
                <Badge variant={product.inStock > 0 ? "secondary" : "destructive"} className="font-normal">
                  {product.inStock > 0 
                    ? `${language === 'en' ? 'In Stock' : 'متوفر'} (${product.inStock})` 
                    : language === 'en' ? 'Out of Stock' : 'غير متوفر'}
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator className="my-4 bg-gold/10" />
          
          <div className="flex items-center gap-4 mt-auto">
            <div className="flex items-center border border-gold/30 rounded-md">
              <button
                type="button"
                className="px-3 py-2 text-gold hover:bg-gold/10 transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 py-2 text-gold border-x border-gold/30 min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                className="px-3 py-2 text-gold hover:bg-gold/10 transition-colors"
                onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            
            <Button
              className="flex-grow bg-gold text-navy hover:bg-gold-light"
              disabled={product.inStock <= 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t('product.addToCart')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product details tabs */}
      <Tabs defaultValue="details" className="mt-12">
        <TabsList className="bg-navy-light border border-gold/20 p-1">
          <TabsTrigger 
            value="details" 
            className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
          >
            {language === 'en' ? 'Details' : 'التفاصيل'}
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
          >
            {language === 'en' ? 'Reviews' : 'التقييمات'}
          </TabsTrigger>
          <TabsTrigger 
            value="shipping" 
            className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
          >
            {language === 'en' ? 'Shipping' : 'الشحن'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className={`font-bold mb-3 ${language === 'ar' ? 'font-cairo' : ''}`}>
                {language === 'en' ? 'Product Specifications' : 'مواصفات المنتج'}
              </h3>
              <ul className={`space-y-2 text-gold/80 ${language === 'ar' ? 'font-cairo' : ''}`}>
                <li>• {language === 'en' ? 'Category: ' : 'الفئة: '} {t(`category.${product.category}`)}</li>
                <li>• {language === 'en' ? 'Material: Premium Quality' : 'المادة: جودة ممتازة'}</li>
                <li>• {language === 'en' ? 'Origin: Imported' : 'المنشأ: مستورد'}</li>
                <li>• {language === 'en' ? 'Care Instructions: Hand wash only' : 'تعليمات العناية: غسيل يدوي فقط'}</li>
              </ul>
            </div>
            <div>
              <h3 className={`font-bold mb-3 ${language === 'ar' ? 'font-cairo' : ''}`}>
                {language === 'en' ? 'Product Features' : 'ميزات المنتج'}
              </h3>
              <ul className={`space-y-2 text-gold/80 ${language === 'ar' ? 'font-cairo' : ''}`}>
                <li>• {language === 'en' ? 'High-quality materials' : 'مواد عالية الجودة'}</li>
                <li>• {language === 'en' ? 'Durable and long-lasting' : 'متين وطويل الأمد'}</li>
                <li>• {language === 'en' ? 'Versatile for multiple uses' : 'متعدد الاستخدامات'}</li>
                <li>• {language === 'en' ? 'Authentic design' : 'تصميم أصيل'}</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="py-4">
          <div className={`text-center py-8 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'Customer reviews will be available soon.' 
              : 'ستتوفر تقييمات العملاء قريباً.'}
          </div>
        </TabsContent>
        <TabsContent value="shipping" className="py-4">
          <div className={`text-center py-8 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'Shipping information will be calculated at checkout.' 
              : 'سيتم احتساب معلومات الشحن عند الدفع.'}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Related Products' : 'منتجات ذات صلة'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
