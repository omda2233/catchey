
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Package, ShoppingBag, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Redirect if not logged in or not authorized
  if (!user || (user.role !== 'seller' && user.role !== 'shipping' && user.role !== 'admin')) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gold/70 mb-4" />
          <h1 className={`text-2xl font-bold mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Access Denied' : 'تم رفض الوصول'}
          </h1>
          <p className={`text-gold/70 mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'You do not have permission to access this page.' 
              : 'ليس لديك الإذن للوصول إلى هذه الصفحة.'}
          </p>
          <Button 
            variant="outline"
            className="border-gold/30 text-gold hover:text-gold hover:border-gold"
            onClick={() => navigate('/')}
          >
            {language === 'en' ? 'Go to Home' : 'الذهاب إلى الصفحة الرئيسية'}
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <h1 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
        {user.role === 'seller'
          ? language === 'en' ? 'Seller Dashboard' : 'لوحة تحكم البائع' 
          : user.role === 'shipping'
            ? language === 'en' ? 'Shipping Company Dashboard' : 'لوحة تحكم شركة الشحن'
            : language === 'en' ? 'Admin Dashboard' : 'لوحة تحكم المدير'}
      </h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {user.role === 'seller' && (
          <>
            <StatCard
              icon={<ShoppingBag className="h-6 w-6" />}
              title={language === 'en' ? 'Products' : 'المنتجات'}
              value="12"
              change="+2"
              positive={true}
              bgClass="from-gold/10 to-gold/5"
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6" />}
              title={language === 'en' ? 'Revenue' : 'الإيرادات'}
              value="$5,240"
              change="+8.2%"
              positive={true}
              bgClass="from-gold/10 to-gold/5"
            />
            <StatCard
              icon={<Package className="h-6 w-6" />}
              title={language === 'en' ? 'Orders' : 'الطلبات'}
              value="38"
              change="+12"
              positive={true}
              bgClass="from-gold/10 to-gold/5"
            />
            <StatCard
              icon={<TrendingUp className="h-6 w-6" />}
              title={language === 'en' ? 'Analytics' : 'التحليلات'}
              value="1.2K"
              change="+24%"
              positive={true}
              bgClass="from-gold/10 to-gold/5"
            />
          </>
        )}
        
        {user.role === 'shipping' && (
          <>
            <StatCard
              icon={<Package className="h-6 w-6" />}
              title={language === 'en' ? 'Active Shipments' : 'الشحنات النشطة'}
              value="24"
              change="+5"
              positive={true}
              bgClass="from-gold/10 to-gold/5"
            />
            <StatCard
              icon={<TrendingUp className="h-6 w-6" />}
              title={language === 'en' ? 'Delivered' : 'تم التوصيل'}
              value="156"
              change="+18"
              positive={true}
              bgClass="from-gold/10 to-gold/5"
            />
          </>
        )}
        
        {user.role === 'admin' && (
          <>
            <StatCard
              icon={<Users className="h-6 w-6" />}
              title={language === 'en' ? 'Users' : 'المستخدمون'}
              value="584"
              change="+12"
              positive={true}
              bgClass="from-gold/10 to-gold/5"
            />
            <StatCard
              icon={<ShoppingBag className="h-6 w-6" />}
              title={language === 'en' ? 'Products' : 'المنتجات'}
              value="342"
              change="+24"
              positive={true}
              bgClass="from-gold/10 to-gold/5"
            />
            <StatCard
              icon={<Package className="h-6 w-6" />}
              title={language === 'en' ? 'Orders' : 'الطلبات'}
              value="286"
              change="+18"
              positive={true}
              bgClass="from-gold/10 to-gold/5"
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6" />}
              title={language === 'en' ? 'Revenue' : 'الإيرادات'}
              value="$42,580"
              change="+12.6%"
              positive={true}
              bgClass="from-gold/10 to-gold/5"
            />
          </>
        )}
      </div>
      
      {/* Dashboard content */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-navy-light border border-gold/20 p-1 mb-6">
          <TabsTrigger
            value="overview"
            className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
          >
            {language === 'en' ? 'Overview' : 'نظرة عامة'}
          </TabsTrigger>
          
          {user.role === 'seller' && (
            <>
              <TabsTrigger
                value="products"
                className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
              >
                {t('dashboard.products')}
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
              >
                {t('dashboard.orders')}
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
              >
                {t('dashboard.analytics')}
              </TabsTrigger>
            </>
          )}
          
          {user.role === 'shipping' && (
            <>
              <TabsTrigger
                value="shipments"
                className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
              >
                {language === 'en' ? 'Shipments' : 'الشحنات'}
              </TabsTrigger>
              <TabsTrigger
                value="delivery"
                className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
              >
                {language === 'en' ? 'Delivery' : 'التوصيل'}
              </TabsTrigger>
            </>
          )}
          
          {user.role === 'admin' && (
            <>
              <TabsTrigger
                value="users"
                className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
              >
                {language === 'en' ? 'Users' : 'المستخدمون'}
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
              >
                {language === 'en' ? 'Products' : 'المنتجات'}
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
              >
                {language === 'en' ? 'Settings' : 'الإعدادات'}
              </TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="border-gold/20 bg-navy-light">
            <CardContent className="p-6">
              <h2 className={`text-xl font-bold mb-4 ${language === 'ar' ? 'font-cairo' : ''}`}>
                {language === 'en' ? 'Welcome to your Dashboard' : 'مرحباً بك في لوحة التحكم'}
              </h2>
              <p className={`text-gold/80 mb-4 ${language === 'ar' ? 'font-cairo' : ''}`}>
                {language === 'en' 
                  ? 'This is a preview of the dashboard interface for the Catchy marketplace. In the full application, you would manage your products, orders, and account settings here.'
                  : 'هذا عرض تجريبي لواجهة لوحة التحكم في سوق كاتشي. في التطبيق الكامل، ستتمكن من إدارة منتجاتك وطلباتك وإعدادات حسابك هنا.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <ComingSoon />
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <ComingSoon />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <ComingSoon />
        </TabsContent>
        
        <TabsContent value="shipments" className="space-y-4">
          <ComingSoon />
        </TabsContent>
        
        <TabsContent value="delivery" className="space-y-4">
          <ComingSoon />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <ComingSoon />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <ComingSoon />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
  bgClass: string;
}

const StatCard = ({ icon, title, value, change, positive, bgClass }: StatCardProps) => {
  const { language } = useLanguage();
  
  return (
    <Card className={`border-gold/20 bg-gradient-to-br ${bgClass} overflow-hidden`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={language === 'ar' ? 'font-cairo' : ''}>
            <p className="text-sm font-medium text-gold/70">{title}</p>
            <p className="text-2xl font-bold text-gold mt-1">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            {icon}
          </div>
        </div>
        
        <div className="mt-4">
          <span 
            className={`text-xs ${positive ? 'text-green-500' : 'text-red-400'} font-medium inline-flex items-center`}
          >
            {change}
          </span>
          <span className="text-xs text-gold/50 ml-2">
            {language === 'en' ? 'since last month' : 'منذ الشهر الماضي'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const ComingSoon = () => {
  const { language } = useLanguage();
  
  return (
    <div className={`text-center py-12 ${language === 'ar' ? 'font-cairo' : ''}`}>
      {language === 'en' 
        ? 'This feature will be available in the full application.' 
        : 'ستكون هذه الميزة متاحة في التطبيق الكامل.'}
    </div>
  );
};
