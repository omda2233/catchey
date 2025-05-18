
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart } from "@/components/ui/chart";
import { useOrders } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Order } from "@/models/Order";
import { useNavigate } from "react-router-dom";

export default function SellerDashboard() {
  const { getSellerOrders, updateOrderStatus } = useOrders();
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const sellerOrders = getSellerOrders();

  // Calculate some analytics for the seller
  const totalSales = sellerOrders.reduce((sum, order) => sum + order.paidAmount, 0).toFixed(2);
  const pendingApprovalOrders = sellerOrders.filter(order => order.status === 'pending_approval');
  const approvedOrders = sellerOrders.filter(order => ['approved', 'paid_deposit', 'paid_full', 'processing', 'shipped'].includes(order.status));
  
  // Group orders by status for chart
  const orderStatusCounts = Object.entries(
    sellerOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({ status, count }));

  // Daily sales for the past week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const salesByDay = sellerOrders
    .filter(order => new Date(order.createdAt) >= oneWeekAgo)
    .reduce((acc, order) => {
      const dateStr = new Date(order.createdAt).toLocaleDateString();
      acc[dateStr] = (acc[dateStr] || 0) + order.paidAmount;
      return acc;
    }, {} as Record<string, number>);
  
  const dailySales = Object.entries(salesByDay).map(([date, amount]) => ({
    date,
    amount
  }));

  const handleApproveOrder = async (order: Order) => {
    await updateOrderStatus(order.id, 'approved');
    toast({
      title: language === 'en' ? 'Order Approved' : 'تمت الموافقة على الطلب',
      description: language === 'en' ? 'The order has been approved' : 'تمت الموافقة على الطلب',
    });
  };

  const handleRejectOrder = async (order: Order) => {
    await updateOrderStatus(order.id, 'rejected');
    toast({
      title: language === 'en' ? 'Order Rejected' : 'تم رفض الطلب',
      description: language === 'en' ? 'The order has been rejected' : 'تم رفض الطلب',
    });
  };

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
          <div className="text-2xl font-bold">${totalSales}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "From completed orders" : "من الطلبات المكتملة"}
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
          <div className="text-2xl font-bold">{pendingApprovalOrders.length}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Orders awaiting your approval" : "طلبات تنتظر موافقتك"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === "en" ? "Active Orders" : "الطلبات النشطة"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedOrders.length}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Approved and in-process" : "تمت الموافقة عليها وقيد المعالجة"}
          </p>
        </CardContent>
      </Card>
      
      {/* Orders pending approval */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{language === "en" ? "Orders Pending Approval" : "طلبات بانتظار الموافقة"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Recent orders that need your action" : "الطلبات الحديثة التي تحتاج إلى إجراء منك"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingApprovalOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {language === "en" ? "No orders pending approval" : "لا توجد طلبات بانتظار الموافقة"}
            </p>
          ) : (
            <div className="space-y-4">
              {pendingApprovalOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <div className="p-4 bg-muted/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">Order #{order.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge>
                        {order.deliveryMethod === 'pickup' 
                          ? language === "en" ? 'Pickup' : 'استلام'
                          : language === "en" ? 'Shipping' : 'شحن'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <p className="text-sm font-medium">
                        {language === "en" ? 'Customer:' : 'العميل:'} {order.customer.name}
                      </p>
                      <p className="text-sm">
                        {language === "en" ? 'Total:' : 'المجموع:'} ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-sm font-medium mb-1">
                        {language === "en" ? 'Products:' : 'المنتجات:'}
                      </p>
                      <ul className="text-sm space-y-1">
                        {order.products.map(product => (
                          <li key={product.id}>
                            {product.name} × {product.quantity} (${product.price.toFixed(2)} each)
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRejectOrder(order)}
                      >
                        {language === "en" ? 'Reject' : 'رفض'}
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleApproveOrder(order)}
                      >
                        {language === "en" ? 'Approve' : 'قبول'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {approvedOrders.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate('/orders')}>
                {language === "en" ? 'View All Orders' : 'عرض جميع الطلبات'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Sales chart */}
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>{language === "en" ? "Recent Sales" : "المبيعات الأخيرة"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Sales for the past week" : "المبيعات خلال الأسبوع الماضي"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {dailySales.length > 0 ? (
            <LineChart 
              data={dailySales}
              index="date"
              categories={['amount']}
              colors={['#6366F1']}
              valueFormatter={(value) => `$${value}`}
              className="h-[300px]"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              {language === "en" ? "No sales data available" : "لا توجد بيانات مبيعات متاحة"}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Order status distribution */}
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>{language === "en" ? "Order Status" : "حالة الطلب"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Distribution of your orders" : "توزيع طلباتك"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {orderStatusCounts.length > 0 ? (
            <BarChart
              data={orderStatusCounts}
              index="status"
              categories={['count']}
              colors={['#6366F1']}
              className="h-[300px]"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              {language === "en" ? "No order data available" : "لا توجد بيانات طلبات متاحة"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
