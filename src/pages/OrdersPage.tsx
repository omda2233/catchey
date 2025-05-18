
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageLayout } from '@/components/layout/PageLayout';
import { Order, OrderStatus } from '@/models/Order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertCircle,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  DollarSign,
  CalendarDays,
  User,
  MapPin,
  ShoppingBag,
} from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const { 
    getUserOrders, 
    getSellerOrders, 
    getShippingOrders, 
    getAllOrders, 
    updateOrderStatus 
  } = useOrders();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders based on user role and active tab
  useEffect(() => {
    if (!user) {
      navigate('/auth/signin');
      return;
    }

    let roleOrders: Order[] = [];
    
    // Get orders based on user role
    if (user.role === 'admin') {
      roleOrders = getAllOrders();
    } else if (user.role === 'seller') {
      roleOrders = getSellerOrders();
    } else if (user.role === 'shipping') {
      roleOrders = getShippingOrders();
    } else {
      // Regular user
      roleOrders = getUserOrders();
    }

    // Filter by status if a specific tab is selected
    if (activeTab !== 'all') {
      roleOrders = roleOrders.filter(order => {
        if (activeTab === 'pending') {
          return ['pending_approval', 'approved'].includes(order.status);
        } else if (activeTab === 'processing') {
          return ['paid_deposit', 'paid_full', 'processing'].includes(order.status);
        } else if (activeTab === 'shipping') {
          return ['shipped'].includes(order.status);
        } else if (activeTab === 'completed') {
          return ['delivered', 'completed'].includes(order.status);
        } else if (activeTab === 'cancelled') {
          return ['rejected', 'cancelled'].includes(order.status);
        }
        return false;
      });
    }

    // Sort orders by date (newest first)
    roleOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    setOrders(roleOrders);
  }, [user, activeTab, getUserOrders, getSellerOrders, getShippingOrders, getAllOrders, navigate]);

  // Handle order status update
  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
  };

  // Handle payment action
  const handlePayment = (orderId: string) => {
    navigate(`/payment/${orderId}`);
  };

  // Get status badge based on order status
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_approval':
        return (
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
            <Clock className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Pending Approval' : 'في انتظار الموافقة'}
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Approved' : 'تمت الموافقة'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Rejected' : 'تم الرفض'}
          </Badge>
        );
      case 'paid_deposit':
        return (
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
            <DollarSign className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Deposit Paid' : 'تم دفع العربون'}
          </Badge>
        );
      case 'paid_full':
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            <DollarSign className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Paid in Full' : 'تم الدفع بالكامل'}
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            <Package className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Processing' : 'قيد المعالجة'}
          </Badge>
        );
      case 'shipped':
        return (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            <Truck className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Shipped' : 'تم الشحن'}
          </Badge>
        );
      case 'delivered':
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Delivered' : 'تم التوصيل'}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Cancelled' : 'تم الإلغاء'}
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Completed' : 'مكتمل'}
          </Badge>
        );
      default:
        return null;
    }
  };

  // Get available status options based on current status and user role
  const getAvailableStatusOptions = (order: Order) => {
    if (!user) return [];

    if (user.role === 'seller') {
      // Sellers can approve or reject pending orders
      if (order.status === 'pending_approval') {
        return ['approved', 'rejected'];
      }
      return [order.status];
    }

    if (user.role === 'shipping') {
      // Shipping companies can update shipping status
      if (order.deliveryMethod === 'shipping' && 
         (order.status === 'processing' || 
          order.status === 'shipped')) {
        return ['processing', 'shipped', 'delivered'];
      }
      return [order.status];
    }

    if (user.role === 'admin') {
      // Admins can set any status
      return [
        'pending_approval',
        'approved',
        'rejected',
        'paid_deposit',
        'paid_full',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'completed'
      ];
    }

    return [order.status]; // Users can't change status
  };

  // Check if payment button should be shown
  const showPaymentButton = (order: Order): boolean => {
    // Only show payment button for the customer
    if (!user || user.id !== order.customer.id) return false;

    // Show payment button for approved orders or orders with deposit paid
    if (order.status === 'approved' || order.status === 'paid_deposit') {
      return order.remainingAmount > 0;
    }

    return false;
  };

  if (!user) return null;

  return (
    <PageLayout>
      <div className="pb-6">
        <h1 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
          {user.role === 'admin' 
            ? language === 'en' ? 'All Orders' : 'جميع الطلبات'
            : user.role === 'seller' 
              ? language === 'en' ? 'Seller Orders' : 'طلبات البائع'
              : user.role === 'shipping'
                ? language === 'en' ? 'Shipping Orders' : 'طلبات الشحن'
                : language === 'en' ? 'My Orders' : 'طلباتي'
          }
        </h1>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mb-8"
        >
          <TabsList className="bg-navy-light border border-gold/20 p-1">
            <TabsTrigger
              value="all"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'All Orders' : 'جميع الطلبات'}
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'Pending' : 'قيد الانتظار'}
            </TabsTrigger>
            <TabsTrigger
              value="processing"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'Processing' : 'قيد المعالجة'}
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'Shipping' : 'الشحن'}
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'Completed' : 'مكتملة'}
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'Cancelled' : 'ملغاة'}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {orders.length === 0 ? (
          <Card className="border-gold/20 bg-navy-light">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto text-gold/60 mb-4" />
              <h3 className="text-lg font-medium text-gold mb-2">
                {language === 'en' ? 'No Orders Found' : 'لم يتم العثور على طلبات'}
              </h3>
              <p className="text-gold/70">
                {language === 'en' 
                  ? "There are no orders matching your current filter." 
                  : "لا توجد طلبات تطابق المرشح الحالي."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order.id} className="border-gold/20 bg-navy-light overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-gold flex items-center gap-2">
                        <span className="font-mono">{order.id}</span>
                        {getStatusBadge(order.status)}
                      </CardTitle>
                      <CardDescription className="mt-1.5 text-gold/60">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>
                            {order.createdAt.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-bold text-gold">${order.total.toFixed(2)}</div>
                      <div className="text-sm text-gold/60">
                        {order.deliveryMethod === 'pickup' 
                          ? language === 'en' ? 'Store Pickup' : 'استلام من المتجر'
                          : language === 'en' ? 'Shipping' : 'شحن'
                        }
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gold/70 mb-2">
                        {language === 'en' ? 'Products' : 'المنتجات'}
                      </h4>
                      <div className="space-y-2">
                        {order.products.map(product => (
                          <div key={product.id} className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-navy-dark rounded-md shrink-0 overflow-hidden">
                              {product.image && (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gold">{product.name}</div>
                              <div className="text-xs text-gold/60">
                                ${product.price.toFixed(2)} × {product.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      {/* Customer info (for sellers/admin/shipping) */}
                      {(user.role === 'seller' || user.role === 'admin' || user.role === 'shipping') && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gold/70 mb-2">
                            {language === 'en' ? 'Customer' : 'العميل'}
                          </h4>
                          <div className="flex items-center gap-2 text-gold">
                            <User className="h-4 w-4 text-gold/60" />
                            <span>{order.customer.name}</span>
                          </div>
                          <div className="text-xs text-gold/60 mt-1">
                            {order.customer.email}
                          </div>
                        </div>
                      )}
                      
                      {/* Seller info (for customers/admin/shipping) */}
                      {(user.role === 'user' || user.role === 'admin' || user.role === 'shipping') && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gold/70 mb-2">
                            {language === 'en' ? 'Seller' : 'البائع'}
                          </h4>
                          <div className="text-gold">{order.sellerName}</div>
                        </div>
                      )}
                      
                      {/* Shipping info (if applicable) */}
                      {order.deliveryMethod === 'shipping' && order.shippingAddress && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gold/70 mb-2">
                            {language === 'en' ? 'Shipping Address' : 'عنوان الشحن'}
                          </h4>
                          <div className="flex items-start gap-2 text-gold">
                            <MapPin className="h-4 w-4 text-gold/60 mt-0.5" />
                            <span>{order.shippingAddress}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Payment info */}
                      <h4 className="text-sm font-medium text-gold/70 mb-2">
                        {language === 'en' ? 'Payment Details' : 'تفاصيل الدفع'}
                      </h4>
                      <Table>
                        <TableBody>
                          <TableRow className="border-gold/10">
                            <TableCell className="text-gold py-1.5">
                              {language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}
                            </TableCell>
                            <TableCell className="text-gold text-right py-1.5">
                              ${(order.total - (order.shippingFee || 0)).toFixed(2)}
                            </TableCell>
                          </TableRow>
                          
                          {order.shippingFee && order.shippingFee > 0 && (
                            <TableRow className="border-gold/10">
                              <TableCell className="text-gold py-1.5">
                                {language === 'en' ? 'Shipping' : 'الشحن'}
                              </TableCell>
                              <TableCell className="text-gold text-right py-1.5">
                                ${order.shippingFee.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          )}
                          
                          <TableRow className="border-gold/10">
                            <TableCell className="text-gold py-1.5">
                              {language === 'en' ? 'Paid' : 'المدفوع'}
                            </TableCell>
                            <TableCell className="text-gold text-right py-1.5">
                              ${order.paidAmount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                          
                          {order.remainingAmount > 0 && (
                            <TableRow className="border-gold/10">
                              <TableCell className="text-gold font-medium py-1.5">
                                {language === 'en' ? 'Remaining' : 'المتبقي'}
                              </TableCell>
                              <TableCell className="text-gold font-medium text-right py-1.5">
                                ${order.remainingAmount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-wrap justify-between gap-4 pt-4">
                  {/* Order actions based on role */}
                  <div>
                    {(user.role === 'seller' || user.role === 'shipping' || user.role === 'admin') && (
                      getAvailableStatusOptions(order).length > 1 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gold/60">
                            {language === 'en' ? 'Update status:' : 'تحديث الحالة:'}
                          </span>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                          >
                            <SelectTrigger className="w-[180px] border-gold/20 bg-navy-dark text-gold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-navy-dark border-gold/20">
                              {getAvailableStatusOptions(order).map(status => (
                                <SelectItem 
                                  key={status} 
                                  value={status} 
                                  className="text-gold focus:bg-gold/10 focus:text-gold"
                                >
                                  {status === 'pending_approval' ? (language === 'en' ? 'Pending Approval' : 'في انتظار الموافقة') :
                                   status === 'approved' ? (language === 'en' ? 'Approved' : 'تمت الموافقة') :
                                   status === 'rejected' ? (language === 'en' ? 'Rejected' : 'تم الرفض') :
                                   status === 'paid_deposit' ? (language === 'en' ? 'Deposit Paid' : 'تم دفع العربون') :
                                   status === 'paid_full' ? (language === 'en' ? 'Paid in Full' : 'تم الدفع بالكامل') :
                                   status === 'processing' ? (language === 'en' ? 'Processing' : 'قيد المعالجة') :
                                   status === 'shipped' ? (language === 'en' ? 'Shipped' : 'تم الشحن') :
                                   status === 'delivered' ? (language === 'en' ? 'Delivered' : 'تم التوصيل') :
                                   status === 'cancelled' ? (language === 'en' ? 'Cancelled' : 'تم الإلغاء') :
                                   status === 'completed' ? (language === 'en' ? 'Completed' : 'مكتمل') : status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <span className="text-sm text-gold/60">
                          {language === 'en' ? 'No actions available' : 'لا توجد إجراءات متاحة'}
                        </span>
                      )
                    )}
                  </div>
                  
                  {/* Payment button for customers */}
                  {showPaymentButton(order) && (
                    <Button 
                      onClick={() => handlePayment(order.id)}
                      className="bg-gold text-navy hover:bg-gold/90"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      {order.status === 'paid_deposit' 
                        ? language === 'en' ? 'Pay Remaining Balance' : 'دفع الرصيد المتبقي'
                        : language === 'en' ? 'Make Payment' : 'إجراء الدفع'
                      }
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
