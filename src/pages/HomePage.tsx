
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product as FirestoreProduct } from '@/models/firestoreSchemas';
import { productService } from '@/lib/firestore';
import { Product, ProductCategory } from '@/models/Product';
import { Button } from '@/components/ui/button';

const categories: {category: ProductCategory; imageUrl: string}[] = [
  { 
    category: 'fabrics', 
    imageUrl: 'https://placehold.co/800x600/1A1F2C/E6B54A?text=Fabrics' 
  },
  { 
    category: 'accessories', 
    imageUrl: 'https://placehold.co/800x600/1A1F2C/E6B54A?text=Accessories' 
  },
  { 
    category: 'tools', 
    imageUrl: 'https://placehold.co/800x600/1A1F2C/E6B54A?text=Tools' 
  },
  { 
    category: 'threads', 
    imageUrl: 'https://placehold.co/800x600/1A1F2C/E6B54A?text=Threads' 
  }
];

export default function HomePage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  useEffect(() => {
    productService.getAvailableProducts(100).then(firestoreProducts => {
      const mapped = firestoreProducts.map(fProduct => ({
        id: fProduct.id!,
        name: fProduct.name,
        nameAr: undefined,
        description: fProduct.description || '',
        descriptionAr: undefined,
        price: fProduct.price,
        category: fProduct.category as ProductCategory,
        image: fProduct.imageUrl,
        images: fProduct.images || [fProduct.imageUrl],
        rating: 5,
        inStock: 1,
        sellerId: fProduct.ownerId,
        sellerName: fProduct.ownerName || '',
        reviewCount: 0,
        featured: false,
        popular: false,
        currency: 'USD',
        createdAt: new Date(fProduct.createdAt),
        isReserved: fProduct.isReserved,
        downPaymentRequired: !!fProduct.reservationPrice,
        manufacturingType: undefined
      }));
      setFeaturedProducts(mapped.slice(0, 1));
      setPopularProducts(mapped.slice(0, 4));
    });
  }, []);
  
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 gold-text-gradient ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Premium Fabrics Marketplace' : 'سوق الأقمشة الفاخرة'}
          </h1>
          <p className={`text-xl text-gold/70 max-w-2xl mx-auto ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'Discover high-quality fabrics from top sellers around the world.' 
              : 'اكتشف أقمشة عالية الجودة من أفضل البائعين حول العالم.'}
          </p>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Browse Categories' : 'تصفح الفئات'}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard 
              key={cat.category} 
              category={cat.category}
              imageUrl={cat.imageUrl}
            />
          ))}
        </div>
      </section>
      
      {/* Featured Product */}
      {featuredProducts.length > 0 && (
        <section className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Featured Product' : 'منتج مميز'}
            </h2>
            <Button 
              variant="link" 
              className="text-gold"
              onClick={() => navigate('/products?featured=true')}
            >
              {language === 'en' ? 'View All' : 'عرض الكل'}
            </Button>
          </div>
          
          <ProductCard product={featuredProducts[0]} featured />
        </section>
      )}
      
      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <section className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Popular Products' : 'منتجات شائعة'}
            </h2>
            <Button 
              variant="link" 
              className="text-gold"
              onClick={() => navigate('/products?popular=true')}
            >
              {language === 'en' ? 'View All' : 'عرض الكل'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
