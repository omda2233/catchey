
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import DrawerNavigation from './DrawerNavigation';
import NotificationDrawer from '../notifications/NotificationDrawer';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '../LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AppHeader() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const goToSignIn = () => {
    navigate('/auth/signin');
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <DrawerNavigation />
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          {user ? (
            <>
              <NotificationDrawer />
              
              {user.role === 'user' && (
                <Button variant="ghost" size="icon" onClick={goToCart} className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}
              
              <Button variant="ghost" size="icon" onClick={goToProfile}>
                <User className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={goToSignIn}>
              {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
