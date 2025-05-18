
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart, 
  Clock,
  Check
} from "lucide-react";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const userOrders = getUserOrders();
  const activeOrders = userOrders.filter(order => !['completed', 'cancelled'].includes(order.status));
  const recentOrders = [...userOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  // Get status badge variant and label
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return { variant: 'outline', label: language === 'en' ? 'Pending Approval' : 'بانتظار الموافقة' };
      case 'approved':
        return { variant: 'secondary', label: language === 'en' ? 'Approved' : 'تمت الموافقة' };
      case 'rejected':
        return { variant: 'destructive', label: language === 'en' ? 'Rejected' : 'مرفوض' };
      case 'paid_deposit':
        return { variant: 'secondary', label: language === 'en' ? 'Deposit Paid' : 'تم دفع العربون' };
      case 'paid_full':
        return { variant: 'secondary', label: language === 'en' ? 'Fully Paid' : 'مدفوع بالكامل' };
      case 'processing':
        return { variant: 'default', label: language === 'en' ? 'Processing' : 'قيد المعالجة' };
      case 'shipped':
        return { variant: 'default', label: language === 'en' ? 'Shipped' : 'تم الشحن' };
      case 'delivered':
        return { variant: 'success', label: language === 'en' ? 'Delivered' : 'تم التوصيل' };
      case 'cancelled':
        return { variant: 'destructive', label: language === 'en' ? 'Cancelled' : 'ملغي' };
      case 'completed':
        return { variant: 'success', label: language === 'en' ? 'Completed' : 'مكتمل' };
      default:
        return { variant: 'outline', label: status };
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Active Orders" : "الطلبات النشطة"}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {language === "en" ? "Orders in progress" : "الطلبات قيد التنفيذ"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Total Orders" : "إجمالي الطلبات"}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {language === "en" ? "All time orders" : "جميع الطلبات"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Actions" : "الإجراءات"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/products')}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {language === "en" ? "Shop Now" : "تسوق الآن"}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/orders')}
            >
              <Package className="h-4 w-4 mr-2" />
              {language === "en" ? "View Orders" : "عرض الطلبات"}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Recent Orders" : "الطلبات الأخيرة"}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-6 flex flex-col items-center gap-2">
              <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">
                {language === "en" 
                  ? "You haven't placed any orders yet" 
                  : "لم تقم بإضافة أي طلبات بعد"}
              </p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => navigate('/products')}
              >
                {language === "en" ? "Start Shopping" : "ابدأ التسوق"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                
                return (
                  <Card key={order.id} className="overflow-hidden">
                    <div className="p-4 bg-muted/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">
                            {language === "en" ? "Order #" : "طلب #"}{order.id}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={statusBadge.variant as any}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <p className="text-sm font-medium">
                          {language === "en" ? "From: " : "من: "}{order.sellerName}
                        </p>
                        <p className="text-sm">
                          {language === "en" ? "Total: " : "المجموع: "}${order.total.toFixed(2)}
                        </p>
                        <p className="text-sm">
                          {language === "en" ? "Delivery: " : "التوصيل: "}
                          {order.deliveryMethod === 'pickup' 
                            ? (language === "en" ? "Pickup" : "استلام") 
                            : (language === "en" ? "Shipping" : "شحن")}
                        </p>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          {['processing', 'shipped', 'delivered', 'completed'].includes(order.status) ? (
                            <Check className="h-4 w-4 mr-1 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 mr-1" />
                          )}
                          {order.status === 'pending_approval' && (language === "en" ? "Awaiting seller approval" : "بانتظار موافقة البائع")}
                          {order.status === 'approved' && (language === "en" ? "Awaiting payment" : "بانتظار الدفع")}
                          {order.status === 'processing' && (language === "en" ? "Preparing your order" : "جاري تجهيز طلبك")}
                          {order.status === 'shipped' && (language === "en" ? "On its way to you" : "في طريقه إليك")}
                          {order.status === 'delivered' && (language === "en" ? "Delivered" : "تم التوصيل")}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/orders`)}
                        >
                          {language === "en" ? "Details" : "التفاصيل"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {userOrders.length > 3 && (
                <div className="text-center mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/orders')}
                  >
                    {language === "en" ? "View All Orders" : "عرض كافة الطلبات"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
