
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderAnalytics } from "@/hooks/use-order-analytics";

export default function AdminDashboard() {
  const { getAllOrders } = useOrders();
  const { language } = useLanguage();
  const allOrders = getAllOrders();
  
  // Use the custom hook for analytics data
  const { 
    orderStatusCounts,
    ordersByDay,
    totalSalesAmount,
    averageOrderValue,
    topSellingCategories 
  } = useOrderAnalytics(allOrders);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Summary Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === "en" ? "Total Sales" : "إجمالي المبيعات"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalSalesAmount}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Across all orders" : "عبر جميع الطلبات"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === "en" ? "Average Order" : "متوسط الطلب"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${averageOrderValue}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Per order value" : "قيمة كل طلب"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === "en" ? "Total Orders" : "إجمالي الطلبات"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{allOrders.length}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Processed orders" : "الطلبات التي تمت معالجتها"}
          </p>
        </CardContent>
      </Card>
      
      {/* Charts - Sales Overview */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{language === "en" ? "Sales Overview" : "نظرة عامة على المبيعات"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Daily sales for the past week" : "المبيعات اليومية للأسبوع الماضي"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart visualization coming soon
          </div>
        </CardContent>
      </Card>
      
      {/* Order Status Distribution */}
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>{language === "en" ? "Order Status" : "حالة الطلب"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Distribution of order statuses" : "توزيع حالات الطلب"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart visualization coming soon
          </div>
        </CardContent>
      </Card>
      
      {/* Top Categories */}
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>{language === "en" ? "Top Categories" : "أفضل الفئات"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Best selling product categories" : "أفضل فئات المنتجات مبيعاً"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart visualization coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
