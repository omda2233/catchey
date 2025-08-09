
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrders } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderAnalytics } from "@/hooks/use-order-analytics"; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { orders, getAllOrders } = useOrders();
  const allOrders = getAllOrders();
  const navigate = useNavigate();
  
  const analytics = useOrderAnalytics(allOrders);
  const { orderStatusCounts, ordersByDay, totalSalesAmount, averageOrderValue, topSellingCategories } = analytics;

  // Color scheme
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Header with Add User button */}
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${language === 'ar' ? 'font-cairo' : ''}`}>
          {language === 'en' ? 'Admin Dashboard' : 'لوحة تحكم المدير'}
        </h2>
        <Button
          onClick={() => navigate('/admin/add-user')}
          className="bg-gold text-navy hover:bg-gold-light"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Add User' : 'إضافة مستخدم'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Total Sales" : "إجمالي المبيعات"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSalesAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Total Orders" : "إجمالي الطلبات"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allOrders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Average Order Value" : "متوسط قيمة الطلب"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Pending Orders" : "الطلبات المعلقة"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allOrders.filter(order => order.status === 'pending_seller_approval').length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sales">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 md:max-w-[600px]">
          <TabsTrigger value="sales">
            {language === "en" ? "Sales" : "المبيعات"}
          </TabsTrigger>
          <TabsTrigger value="orders">
            {language === "en" ? "Orders" : "الطلبات"}
          </TabsTrigger>
          <TabsTrigger value="products">
            {language === "en" ? "Products" : "المنتجات"}
          </TabsTrigger>
          <TabsTrigger value="users">
            {language === "en" ? "Users" : "المستخدمين"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Sales Over Time" : "المبيعات عبر الزمن"}
              </CardTitle>
              <CardDescription>
                {language === "en" 
                  ? "Daily sales for the past week" 
                  : "المبيعات اليومية للأسبوع الماضي"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', { 
                        month: 'short', 
                        day: 'numeric' 
                      });
                    }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" name={language === 'en' ? 'Sales ($)' : 'المبيعات ($)'} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Top Categories" : "أفضل الفئات"}
              </CardTitle>
              <CardDescription>
                {language === "en" 
                  ? "Sales by product category" 
                  : "المبيعات حسب فئة المنتج"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-sm">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={topSellingCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="sales"
                      nameKey="category"
                    >
                      {topSellingCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Orders by Status" : "الطلبات حسب الحالة"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderStatusCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name={language === 'en' ? 'Orders' : 'الطلبات'} fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Product Analytics" : "تحليلات المنتجات"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "Product analytics coming soon" 
                  : "تحليلات المنتجات قادمة قريبا"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "User Analytics" : "تحليلات المستخدمين"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "User analytics coming soon" 
                  : "تحليلات المستخدمين قادمة قريبا"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
