
import React from "react";
import { useOrders } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Order } from "@/models/Order";
import { 
  Truck, 
  PackageCheck,
  PackageOpen
} from "lucide-react";

export default function ShippingDashboard() {
  const { getShippingOrders, updateOrderStatus } = useOrders();
  const { language } = useLanguage();
  const { toast } = useToast();
  const shippingOrders = getShippingOrders();

  // Filter orders by status for easier access
  const processingOrders = shippingOrders.filter(order => order.status === 'processing');
  const shippedOrders = shippingOrders.filter(order => order.status === 'shipped');

  const handleShipOrder = async (order: Order) => {
    await updateOrderStatus(order.id, 'shipped');
    toast({
      title: language === 'en' ? 'Order Shipped' : 'تم شحن الطلب',
      description: language === 'en' ? 'The order has been marked as shipped' : 'تم تعيين الطلب كمشحون',
    });
  };

  const handleDeliverOrder = async (order: Order) => {
    await updateOrderStatus(order.id, 'delivered');
    toast({
      title: language === 'en' ? 'Order Delivered' : 'تم تسليم الطلب',
      description: language === 'en' ? 'The order has been marked as delivered' : 'تم تعيين الطلب كمسلم',
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Summary Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === "en" ? "Processing Orders" : "الطلبات قيد المعالجة"}
          </CardTitle>
          <PackageOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{processingOrders.length}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Orders ready to ship" : "طلبات جاهزة للشحن"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === "en" ? "Shipped Orders" : "الطلبات المشحونة"}
          </CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{shippedOrders.length}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "Orders in transit" : "الطلبات قيد التوصيل"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === "en" ? "Total Orders" : "إجمالي الطلبات"}
          </CardTitle>
          <PackageCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{shippingOrders.length}</div>
          <p className="text-xs text-muted-foreground">
            {language === "en" ? "All assigned orders" : "جميع الطلبات المخصصة"}
          </p>
        </CardContent>
      </Card>
      
      {/* Orders to process */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{language === "en" ? "Orders to Ship" : "طلبات للشحن"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Orders ready to be shipped" : "الطلبات الجاهزة للشحن"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processingOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {language === "en" ? "No orders to ship at the moment" : "لا توجد طلبات للشحن حاليًا"}
            </p>
          ) : (
            <div className="space-y-4">
              {processingOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <div className="p-4 bg-muted/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">Order #{order.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {language === "en" ? 'Processing' : 'قيد المعالجة'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <p className="text-sm font-medium">
                        {language === "en" ? 'Customer:' : 'العميل:'} {order.customer.name}
                      </p>
                      <p className="text-sm">
                        {language === "en" ? 'Shipping Address:' : 'عنوان الشحن:'} {order.shippingAddress}
                      </p>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-sm font-medium mb-1">
                        {language === "en" ? 'Products:' : 'المنتجات:'}
                      </p>
                      <ul className="text-sm space-y-1">
                        {order.products.map(product => (
                          <li key={product.id}>
                            {product.name} × {product.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleShipOrder(order)}
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        {language === "en" ? 'Mark as Shipped' : 'تعيين كمشحون'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Shipped Orders */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>{language === "en" ? "Orders in Transit" : "الطلبات قيد التوصيل"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Orders currently being delivered" : "الطلبات التي يتم توصيلها حاليًا"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shippedOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {language === "en" ? "No orders in transit" : "لا توجد طلبات قيد التوصيل"}
            </p>
          ) : (
            <div className="space-y-4">
              {shippedOrders.map((order) => (
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
                        {language === "en" ? 'In Transit' : 'قيد التوصيل'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <p className="text-sm font-medium">
                        {language === "en" ? 'Customer:' : 'العميل:'} {order.customer.name}
                      </p>
                      <p className="text-sm">
                        {language === "en" ? 'Shipping Address:' : 'عنوان الشحن:'} {order.shippingAddress}
                      </p>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleDeliverOrder(order)}
                      >
                        <PackageCheck className="h-4 w-4 mr-2" />
                        {language === "en" ? 'Mark as Delivered' : 'تعيين كمسلم'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
