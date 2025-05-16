
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCarousel } from '@/components/ProductCarousel';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_PRODUCTS } from '@/models/Product';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const featuredProducts = MOCK_PRODUCTS.filter(product => product.featured);
  const popularProducts = MOCK_PRODUCTS.filter(product => product.popular);
  
  const categories = [
    { 
      category: 'fabrics' as const, 
      imageUrl: 'https://images.unsplash.com/photo-1585051118204-764ba4b434f5?q=80&w=1974&auto=format&fit=crop' 
    },
    { 
      category: 'accessories' as const, 
      imageUrl: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=1974&auto=format&fit=crop' 
    },
    { 
      category: 'tools' as const, 
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1974&auto=format&fit=crop' 
    },
    { 
      category: 'threads' as const, 
      imageUrl: 'https://images.unsplash.com/photo-1597484662317-c93a1140151f?q=80&w=1974&auto=format&fit=crop'
    },
  ];
  
  return (
    <PageLayout>
      {/* Hero section */}
      <section className="relative -mx-6 md:mx-0 md:rounded-xl overflow-hidden h-96 mb-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark to-navy-dark/40 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1590244943446-9e8c8d0b5617?q=80&w=2069&auto=format&fit=crop"
            alt="Fabric collection"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 h-full flex flex-col items-start justify-center px-6 md:px-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 gold-text-gradient ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Quality Fabrics & Accessories' : 'أقمشة وإكسسوارات عالية الجودة'}
          </h1>
          <p className={`text-gold-light text-lg mb-6 max-w-lg ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'Discover premium fabrics, accessories, and crafting supplies from trusted sellers across the Middle East.' 
              : 'اكتشف الأقمشة والإكسسوارات ومستلزمات الحرف اليدوية من بائعين موثوقين في جميع أنحاء الشرق الأوسط.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full max-w-lg">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/50" />
              <Input 
                type="text"
                placeholder={language === 'en' ? "Search for fabrics, accessories..." : "ابحث عن الأقمشة والإكسسوارات..."}
                className={`pl-9 bg-navy-dark/80 border-gold/20 text-gold placeholder:text-gold/50 ${language === 'ar' ? 'font-cairo' : ''}`}
              />
            </div>
            <Button 
              className="bg-gold hover:bg-gold-light text-navy font-semibold"
              onClick={() => navigate('/products')}
            >
              {language === 'en' ? 'Explore' : 'استكشف'}
              {language === 'ar' ? <ArrowLeft className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories section */}
      <section className="mb-12">
        <h2 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
          {t('home.categories')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.category} 
              category={category.category} 
              imageUrl={category.imageUrl} 
            />
          ))}
        </div>
      </section>
      
      {/* Featured products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${language === 'ar' ? 'font-cairo' : ''}`}>
            {t('home.featured')}
          </h2>
          <Button 
            variant="link" 
            className="text-gold hover:text-gold-light"
            onClick={() => navigate('/products?featured=true')}
          >
            {language === 'en' ? 'View All' : 'عرض الكل'}
            {language === 'ar' ? <ArrowLeft className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredProducts.slice(0, 2).map((product) => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>
      
      {/* Popular products */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${language === 'ar' ? 'font-cairo' : ''}`}>
            {t('home.popular')}
          </h2>
          <Button 
            variant="link" 
            className="text-gold hover:text-gold-light"
            onClick={() => navigate('/products?popular=true')}
          >
            {language === 'en' ? 'View All' : 'عرض الكل'}
            {language === 'ar' ? <ArrowLeft className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
