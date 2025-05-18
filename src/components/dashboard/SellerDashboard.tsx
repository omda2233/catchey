
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Order } from "@/models/Order";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { getSellerOrders, updateOrderStatus } = useOrders();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const sellerOrders = getSellerOrders();
  const pendingOrders = sellerOrders.filter((order) => order.status === "pending_approval");

  const handleApprove = async (order: Order) => {
    await updateOrderStatus(order.id, "approved");
  };

  const handleReject = async (order: Order) => {
    await updateOrderStatus(order.id, "rejected");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {language === "en" ? "Products Management" : "إدارة المنتجات"}
            </CardTitle>
            <Button onClick={() => navigate("/seller/products")}>
              {language === "en" ? "Manage Products" : "إدارة المنتجات"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="default" 
              className="h-auto p-6 flex flex-col items-center justify-center" 
              onClick={() => navigate("/add-product")}
            >
              <span className="text-xl mb-2">+</span>
              <span>{language === "en" ? "Add New Product" : "إضافة منتج جديد"}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col items-center justify-center"
              onClick={() => navigate("/seller/products")}
            >
              <span className="text-xl mb-2">📋</span>
              <span>{language === "en" ? "View My Products" : "عرض منتجاتي"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === "en" ? "Orders Pending Approval" : "طلبات في انتظار الموافقة"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              {language === "en"
                ? "No orders pending approval"
                : "لا توجد طلبات في انتظار الموافقة"}
            </p>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "en" ? "Customer" : "العميل"}: {order.customer.name}
                        </p>
                        <p className="text-sm">
                          {language === "en" ? "Total" : "المجموع"}: ${order.total.toFixed(2)}
                        </p>
                        <p className="text-sm">
                          {language === "en" ? "Delivery" : "التوصيل"}:
                          {order.deliveryMethod === "pickup"
                            ? language === "en"
                              ? " Pickup"
                              : " استلام"
                            : language === "en"
                            ? " Shipping"
                            : " شحن"}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-semibold mb-1">
                            {language === "en" ? "Products:" : "المنتجات:"}
                          </p>
                          {order.products.map((product) => (
                            <div key={product.id} className="text-xs">
                              {product.name} x {product.quantity}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 self-end md:self-center">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleReject(order)}
                        >
                          {language === "en" ? "Reject" : "رفض"}
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApprove(order)}
                        >
                          {language === "en" ? "Approve" : "موافقة"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
