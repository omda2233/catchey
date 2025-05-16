
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo = ({ size = 'md', className }: LogoProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };

  return (
    <div 
      className={cn("flex items-center gap-2 cursor-pointer", className)}
      onClick={() => navigate('/')}
    >
      <div className={cn('relative', sizeClasses[size])}>
        <img
          src="/lovable-uploads/05d5cc7a-0903-4779-af3e-d855b231fdd8.png"
          alt="Catchy Logo"
          className={cn('aspect-square object-contain', sizeClasses[size])}
        />
      </div>
      <span 
        className={cn(
          "font-cairo font-bold gold-text-gradient",
          {
            'text-lg': size === 'sm',
            'text-2xl': size === 'md',
            'text-3xl': size === 'lg',
          }
        )}
      >
        {t('app.name')}
      </span>
    </div>
  );
};
