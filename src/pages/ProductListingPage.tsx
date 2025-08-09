
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product as FirestoreProduct } from '@/models/firestoreSchemas';
import { productService } from '@/lib/firestore';
import { MOCK_PRODUCTS, ProductCategory, Product } from '@/models/Product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProductListingPage() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState('newest');

  const categoryParam = searchParams.get('category');
  const featured = searchParams.get('featured') === 'true';
  const popular = searchParams.get('popular') === 'true';

  // Filter and sort products
  useEffect(() => {
    setIsLoading(true);
    productService.getAvailableProducts(100).then(firestoreProducts => {
      setProducts(firestoreProducts.map(fProduct => ({
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
      })));
      setIsLoading(false);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect above
  };

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value as ProductCategory | 'all');
  };

  return (
    <PageLayout>
      <div className="pb-6">
        <h1 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
          {featured 
            ? language === 'en' ? 'Featured Products' : 'المنتجات المميزة'
            : popular
              ? language === 'en' ? 'Popular Products' : 'المنتجات الشائعة'
              : categoryParam
                ? t(`category.${categoryParam as ProductCategory}`)
                : language === 'en' ? 'All Products' : 'جميع المنتجات'}
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search form */}
          <form onSubmit={handleSearch} className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/50" />
            <Input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? "Search products..." : "ابحث عن المنتجات..."}
              className={`pl-9 bg-navy-light border-gold/20 text-gold placeholder:text-gold/50 ${language === 'ar' ? 'font-cairo' : ''}`}
            />
          </form>
          
          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gold" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger 
                className="w-[180px] border-gold/20 bg-navy-light text-gold"
              >
                <SelectValue placeholder={language === 'en' ? "Sort by" : "ترتيب حسب"} />
              </SelectTrigger>
              <SelectContent className="bg-navy-light border-gold/20">
                <SelectItem value="newest" className="text-gold focus:bg-gold/10 focus:text-gold">
                  {t('filter.newest')}
                </SelectItem>
                <SelectItem value="price_asc" className="text-gold focus:bg-gold/10 focus:text-gold">
                  {language === 'en' ? 'Price: Low to High' : 'السعر: من الأقل إلى الأعلى'}
                </SelectItem>
                <SelectItem value="price_desc" className="text-gold focus:bg-gold/10 focus:text-gold">
                  {language === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى إلى الأقل'}
                </SelectItem>
                <SelectItem value="popular" className="text-gold focus:bg-gold/10 focus:text-gold">
                  {t('filter.popular')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Category tabs */}
        <Tabs 
          value={activeCategory} 
          onValueChange={handleCategoryChange}
          className="mb-8"
        >
          <TabsList className="bg-navy-light border border-gold/20 p-1">
            <TabsTrigger 
              value="all" 
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {t('filter.all')}
            </TabsTrigger>
            <TabsTrigger 
              value="fabrics" 
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {t('category.fabrics')}
            </TabsTrigger>
            <TabsTrigger 
              value="accessories" 
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {t('category.accessories')}
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {t('category.tools')}
            </TabsTrigger>
            <TabsTrigger 
              value="threads" 
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {t('category.threads')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-52 w-full rounded-md bg-navy-light" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-navy-light" />
                  <Skeleton className="h-4 w-1/2 bg-navy-light" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className={`text-xl mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'No products found' : 'لم يتم العثور على منتجات'}
            </h3>
            <p className={`text-gold/70 ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' 
                ? 'Try adjusting your search or filter to find what you are looking for.' 
                : 'حاول تعديل البحث أو التصفية للعثور على ما تبحث عنه.'}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
