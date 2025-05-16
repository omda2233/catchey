
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define supported languages
export type Language = 'en' | 'ar';

// Define language context shape
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.name': 'Catchy',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.name': 'Full Name',
    'auth.role': 'Account Type',
    'role.user': 'Customer',
    'role.seller': 'Seller',
    'role.shipping': 'Shipping Company',
    'role.admin': 'Administrator',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.signout': 'Sign Out',
    'home.featured': 'Featured Products',
    'home.categories': 'Categories',
    'home.popular': 'Popular Items',
    'product.price': 'Price',
    'product.seller': 'Seller',
    'product.addToCart': 'Add to Cart',
    'dashboard.products': 'My Products',
    'dashboard.sales': 'Sales',
    'dashboard.orders': 'Orders',
    'dashboard.analytics': 'Analytics',
    'category.fabrics': 'Fabrics',
    'category.accessories': 'Accessories',
    'category.tools': 'Tools',
    'category.threads': 'Threads',
    'filter.all': 'All',
    'filter.price': 'Price',
    'filter.newest': 'Newest',
    'filter.popular': 'Popular',
  },
  ar: {
    'app.name': 'كاتشي',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.signin': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.name': 'الاسم الكامل',
    'auth.role': 'نوع الحساب',
    'role.user': 'عميل',
    'role.seller': 'بائع',
    'role.shipping': 'شركة شحن',
    'role.admin': 'مدير النظام',
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.dashboard': 'لوحة التحكم',
    'nav.profile': 'الملف الشخصي',
    'nav.signout': 'تسجيل الخروج',
    'home.featured': 'منتجات مميزة',
    'home.categories': 'التصنيفات',
    'home.popular': 'الأكثر مبيعاً',
    'product.price': 'السعر',
    'product.seller': 'البائع',
    'product.addToCart': 'إضافة إلى السلة',
    'dashboard.products': 'منتجاتي',
    'dashboard.sales': 'المبيعات',
    'dashboard.orders': 'الطلبات',
    'dashboard.analytics': 'التحليلات',
    'category.fabrics': 'الأقمشة',
    'category.accessories': 'الإكسسوارات',
    'category.tools': 'الأدوات',
    'category.threads': 'الخيوط',
    'filter.all': 'الكل',
    'filter.price': 'السعر',
    'filter.newest': 'الأحدث',
    'filter.popular': 'الأكثر شعبية',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Set language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // In real app, save to localStorage
  };

  // Translate function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
