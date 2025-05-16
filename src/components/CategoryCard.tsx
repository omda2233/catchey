
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCategory } from '@/models/Product';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryCardProps {
  category: ProductCategory;
  imageUrl: string;
}

export function CategoryCard({ category, imageUrl }: CategoryCardProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <Card
      className="overflow-hidden border-gold/20 bg-navy-light cursor-pointer relative group h-36 w-full"
      onClick={() => navigate(`/products?category=${category}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy-dark/80 to-transparent z-10"></div>
      <img
        src={imageUrl}
        alt={t(`category.${category}`)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <CardContent className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="font-bold text-xl text-gold">{t(`category.${category}`)}</h3>
      </CardContent>
    </Card>
  );
}
