
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/models/Order";

export default function SellerDashboard() {
  const { getAllOrders } = useOrders();
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const allOrders = getAllOrders();
  
  // Filter orders for this seller
  const sellerOrders = React.useMemo(() => {
    return allOrders.filter(order => 
      order.items.some(item => item.product.sellerId === user?.id)
    );
  }, [allOrders, user?.id]);
  
  // Calculate analytics
  const pendingApproval = sellerOrders.filter(o => o.status === 'pending_approval').length;
  const totalSales = sellerOrders
    .filter(o => ['completed', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, order) => {
      const sellerItems = order.items.filter(item => item.product.sellerId === user?.id);
      return sum + sellerItems.reduce((itemSum, item) => itemSum + (item.product.price * item.quantity), 0);
    }, 0);
  
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
          <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "From your products" : "من منتجاتك"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === "en" ? "Orders" : "الطلبات"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sellerOrders.length}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Total orders" : "إجمالي الطلبات"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === "en" ? "Pending Approval" : "بانتظار الموافقة"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingApproval}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Requires your action" : "تتطلب إجراء منك"}
          </p>
        </CardContent>
      </Card>
      
      {/* Orders awaiting approval */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{language === "en" ? "Orders Awaiting Approval" : "الطلبات في انتظار الموافقة"}</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApproval === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {language === "en" ? "No orders awaiting approval" : "لا توجد طلبات في انتظار الموافقة"}
            </div>
          ) : (
            <div className="space-y-4">
              {sellerOrders
                .filter(o => o.status === 'pending_approval')
                .map(order => (
                  <div key={order.id} className="border rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <p className="text-sm">
                          {order.deliveryMethod === 'pickup' ? 
                            (language === "en" ? "Pickup" : "استلام") : 
                            (language === "en" ? "Delivery" : "توصيل")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Sales Overview */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{language === "en" ? "Sales Overview" : "نظرة عامة على المبيعات"}</CardTitle>
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
