
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '../Logo';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, User, LogOut, ShoppingCart, Store, Package, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  roles?: UserRole[];
}

export const Header = () => {
  const { user, signOut } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'nav.home', path: '/' },
    { label: 'nav.products', path: '/products' },
    { 
      label: 'nav.dashboard', 
      path: '/dashboard',
      roles: ['seller', 'shipping', 'admin'],
      icon: user?.role === 'seller' ? <Store className="w-4 h-4" /> : 
             user?.role === 'shipping' ? <Package className="w-4 h-4" /> : 
             <BarChart3 className="w-4 h-4" />
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(
    item => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gold/10 bg-navy navy-gradient backdrop-blur supports-[backdrop-filter]:bg-navy/80">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {filteredNavItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gold",
                  {
                    "text-gold": location.pathname === item.path,
                    "text-gold/70": location.pathname !== item.path,
                    "font-cairo": language === 'ar',
                  }
                )}
              >
                {t(item.label)}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-gold/30">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-navy-light text-gold">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="w-[200px] truncate text-xs text-gold/70">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('nav.profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('nav.signout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              className="border-gold/30 text-gold hover:text-gold hover:border-gold"
              onClick={() => navigate('/auth/signin')}
            >
              {t('auth.signin')}
            </Button>
          )}

          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-gold" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side={language === 'ar' ? "right" : "left"}
              className="border-gold/20 bg-navy-dark pt-10"
            >
              <div className="mb-8 mt-4">
                <Logo />
              </div>
              <nav className="flex flex-col gap-4">
                {filteredNavItems.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                      location.pathname === item.path
                        ? "bg-gold/10 text-gold"
                        : "text-gold/70 hover:bg-gold/10 hover:text-gold",
                      {
                        "font-cairo": language === 'ar',
                      }
                    )}
                  >
                    {item.icon}
                    {t(item.label)}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
