
import React, { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Package, 
  Home, 
  Settings, 
  Users, 
  Store, 
  Bell, 
  LogOut, 
  User, 
  LineChart,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Logo } from "@/components/Logo";

export default function DrawerNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const { totalItems } = useCart();

  // Define menu items based on user role
  const menuItems = React.useMemo(() => {
    const items = [];
    
    // Common items for all logged in users
    items.push({
      name: language === 'en' ? 'Home' : 'الرئيسية',
      path: '/',
      icon: <Home className="h-5 w-5" />,
    });
    
    // Role-specific items
    if (user) {
      if (user.role === 'admin') {
        items.push(
          {
            name: language === 'en' ? 'Dashboard' : 'لوحة التحكم',
            path: '/dashboard',
            icon: <LineChart className="h-5 w-5" />,
          },
          {
            name: language === 'en' ? 'Users' : 'المستخدمين',
            path: '/admin/users',
            icon: <Users className="h-5 w-5" />,
          }
        );
      } 
      
      if (user.role === 'seller') {
        items.push(
          {
            name: language === 'en' ? 'Dashboard' : 'لوحة التحكم',
            path: '/dashboard',
            icon: <LineChart className="h-5 w-5" />,
          },
          {
            name: language === 'en' ? 'Products' : 'المنتجات',
            path: '/seller/products',
            icon: <Store className="h-5 w-5" />,
          }
        );
      }
      
      if (user.role === 'shipping') {
        items.push({
          name: language === 'en' ? 'Shipping Orders' : 'طلبات الشحن',
          path: '/shipping/orders',
          icon: <Package className="h-5 w-5" />,
        });
      }
      
      if (user.role === 'buyer' || !user.role) {
        items.push(
          {
            name: language === 'en' ? 'Products' : 'المنتجات',
            path: '/products',
            icon: <Store className="h-5 w-5" />,
          },
          {
            name: language === 'en' ? 'My Orders' : 'طلباتي',
            path: '/orders',
            icon: <Package className="h-5 w-5" />,
          },
          {
            name: language === 'en' ? 'Cart' : 'عربة التسوق',
            path: '/cart',
            icon: <ShoppingCart className="h-5 w-5" />,
            badge: totalItems > 0 ? totalItems : null,
          }
        );
      }
      
      // Add profile for all users
      items.push({
        name: language === 'en' ? 'Profile' : 'الملف الشخصي',
        path: '/profile',
        icon: <User className="h-5 w-5" />,
      });
    } else {
      // For non-logged in users
      items.push({
        name: language === 'en' ? 'Products' : 'المنتجات',
        path: '/products',
        icon: <Store className="h-5 w-5" />,
      });
    }

    return items;
  }, [user, language, totalItems]);

  const handleNavigation = (path: string, closeDrawer: () => void) => {
    navigate(path);
    closeDrawer();
  };

  const handleLogout = (closeDrawer: () => void) => {
    signOut();
    navigate('/auth/signin');
    closeDrawer();
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="border-b">
          <DrawerTitle>
            <Logo showText={true} />
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="py-4 px-2">
          {/* Fixed: Removed the function component that was causing the type error */}
          <div className="grid gap-1">
            {menuItems.map((item) => (
              <DrawerClose asChild key={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleNavigation(item.path, () => {})}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </DrawerClose>
            ))}
            {user && (
              <>
                {user?.role === 'admin' && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gold hover:bg-gold/10"
                    onClick={() => navigate('/admin/users')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Manage Users' : 'إدارة المستخدمين'}
                  </Button>
                )}
                
                {user?.role === 'admin' && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gold hover:bg-gold/10"
                    onClick={() => navigate('/admin/add-user')}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Add User' : 'إضافة مستخدم'}
                  </Button>
                )}
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive"
                    onClick={() => handleLogout(() => {})}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="ml-2">
                      {language === 'en' ? 'Logout' : 'تسجيل خروج'}
                    </span>
                  </Button>
                </DrawerClose>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
