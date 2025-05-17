
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/models/Product';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
  const displayName = language === 'en' ? product.name : (product.nameAr || product.name);
  
  return (
    <Card 
      className={cn(
        "overflow-hidden border-gold/20 bg-navy-light transition-all duration-300 hover:border-gold/50 cursor-pointer group",
        featured ? "lg:flex lg:h-72" : "h-full"
      )}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className={cn(
        "relative overflow-hidden",
        featured ? "lg:w-1/2 h-48 lg:h-auto" : "h-48"
      )}>
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent z-10"></div>
        <img
          src={product.images[0] || product.image}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {(product.featured || product.popular) && (
          <Badge className="absolute top-2 right-2 bg-gold text-navy z-20">
            {product.featured ? "Featured" : "Popular"}
          </Badge>
        )}
      </div>
      
      <div className={cn(
        "flex flex-col",
        featured ? "lg:w-1/2" : ""
      )}>
        <CardContent className="flex flex-col flex-grow p-4">
          <h3 className={cn(
            "font-bold mb-1 line-clamp-2 group-hover:text-gold transition-colors",
            language === 'ar' ? 'font-cairo text-lg' : 'text-lg'
          )}>
            {displayName}
          </h3>
          
          <div className="flex items-center gap-1 text-gold/70 mt-1 mb-2">
            <Star className="h-4 w-4 fill-gold" />
            <span className="text-sm">{product.rating}</span>
            <span className="text-xs text-gold/50">({product.reviewCount || 0})</span>
          </div>
          
          <p className={cn(
            "text-gold/70 text-sm line-clamp-2 mb-2",
            language === 'ar' ? 'font-cairo' : ''
          )}>
            {language === 'en' ? product.description : (product.descriptionAr || product.description)}
          </p>
        </CardContent>
        
        <CardFooter className="pt-0 px-4 pb-4 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gold/50">{t('product.price')}</span>
            <span className="text-gold font-bold">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-xs text-gold/50">{t('product.seller')}</span>
            <span className="text-gold/80 text-sm">{product.sellerName}</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

// Helper for conditional classes
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
