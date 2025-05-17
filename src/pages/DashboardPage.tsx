
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertCircle, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Truck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// Mock data structure for orders
interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  sellerId: string;
  sellerName: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  deliveryMethod: 'pickup' | 'shipping';
  status: 'pending_approval' | 'approved' | 'rejected' | 'paid_deposit' | 'paid_full' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingCompanyId?: string;
  createdAt: Date;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock orders data - in a real app, this would come from an API
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customer: { id: '3', name: 'Buyer User' },
      sellerId: '2',
      sellerName: 'Seller User',
      products: [
        { id: 'P1', name: 'Blue Cotton Fabric', price: 24.99, quantity: 2 },
        { id: 'P2', name: 'Sewing Kit', price: 79.99, quantity: 1 }
      ],
      total: 129.97,
      deliveryMethod: 'pickup',
      status: 'pending_approval',
      createdAt: new Date('2023-05-15')
    },
    {
      id: 'ORD-002',
      customer: { id: '3', name: 'Buyer User' },
      sellerId: '2',
      sellerName: 'Seller User',
      products: [
        { id: 'P3', name: 'Silk Fabric', price: 29.99, quantity: 3 }
      ],
      total: 89.97,
      deliveryMethod: 'shipping',
      status: 'approved',
      shippingCompanyId: '4',
      createdAt: new Date('2023-05-16')
    },
    {
      id: 'ORD-003',
      customer: { id: '5', name: 'John User' },
      sellerId: '6',
      sellerName: 'Sarah Seller',
      products: [
        { id: 'P4', name: 'Professional Scissors', price: 59.99, quantity: 1 },
        { id: 'P5', name: 'Wool Yarn Set', price: 49.99, quantity: 2 }
      ],
      total: 159.97,
      deliveryMethod: 'shipping',
      status: 'paid_full',
      shippingCompanyId: '4',
      createdAt: new Date('2023-05-17')
    },
    {
      id: 'ORD-004',
      customer: { id: '5', name: 'John User' },
      sellerId: '6',
      sellerName: 'Sarah Seller',
      products: [
        { id: 'P6', name: 'Leather Thread', price: 24.99, quantity: 1 },
        { id: 'P7', name: 'Measuring Tape Set', price: 19.99, quantity: 1 }
      ],
      total: 44.98,
      deliveryMethod: 'pickup',
      status: 'paid_deposit',
      createdAt: new Date('2023-05-18')
    },
  ]);

  // Filter orders based on user role
  const filteredOrders = orders.filter(order => {
    if (!user) return false;
    
    if (user.role === 'admin') {
      // Admin sees all orders
      return true;
    } else if (user.role === 'seller') {
      // Seller only sees orders for their products
      return order.sellerId === user.id;
    } else if (user.role === 'shipping') {
      // Shipping company only sees orders assigned to them that require shipping
      return order.shippingCompanyId === user.id && 
             order.deliveryMethod === 'shipping' &&
             (order.status === 'paid_full' || 
              order.status === 'processing' || 
              order.status === 'shipped' || 
              order.status === 'delivered');
    } else if (user.role === 'user') {
      // Users only see their own orders
      return order.customer.id === user.id;
    }
    
    return false;
  });
  
  // Redirect if not logged in
  if (!user) {
    navigate('/auth/signin');
    return null;
  }
  
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    
    toast({
      title: language === 'en' ? 'Order Status Updated' : 'تم تحديث حالة الطلب',
      description: language === 'en' 
        ? `Order ${orderId} has been updated to ${getStatusDisplayName(status)}` 
        : `تم تحديث الطلب ${orderId} إلى ${getStatusDisplayName(status)}`,
    });
  };
  
  const getStatusDisplayName = (status: Order['status']) => {
    switch (status) {
      case 'pending_approval': return language === 'en' ? 'Pending Approval' : 'في انتظار الموافقة';
      case 'approved': return language === 'en' ? 'Approved' : 'تمت الموافقة';
      case 'rejected': return language === 'en' ? 'Rejected' : 'تم الرفض';
      case 'paid_deposit': return language === 'en' ? 'Deposit Paid' : 'تم دفع العربون';
      case 'paid_full': return language === 'en' ? 'Paid in Full' : 'تم الدفع بالكامل';
      case 'processing': return language === 'en' ? 'Processing' : 'قيد المعالجة';
      case 'shipped': return language === 'en' ? 'Shipped' : 'تم الشحن';
      case 'delivered': return language === 'en' ? 'Delivered' : 'تم التوصيل';
      case 'cancelled': return language === 'en' ? 'Cancelled' : 'تم الإلغاء';
      default: return status;
    }
  };
  
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending_approval':
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
          <Clock className="h-3 w-3 mr-1" />
          {getStatusDisplayName(status)}
        </Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          {getStatusDisplayName(status)}
        </Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          {getStatusDisplayName(status)}
        </Badge>;
      case 'paid_deposit':
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
          <DollarSign className="h-3 w-3 mr-1" />
          {getStatusDisplayName(status)}
        </Badge>;
      case 'paid_full':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-300">
          <DollarSign className="h-3 w-3 mr-1" />
          {getStatusDisplayName(status)}
        </Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
          <Package className="h-3 w-3 mr-1" />
          {getStatusDisplayName(status)}
        </Badge>;
      case 'shipped':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          <Truck className="h-3 w-3 mr-1" />
          {getStatusDisplayName(status)}
        </Badge>;
      case 'delivered':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          {getStatusDisplayName(status)}
        </Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          {getStatusDisplayName(status)}
        </Badge>;
      default:
        return null;
    }
  };
  
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
         (order.status === 'paid_full' || 
          order.status === 'processing' || 
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
        'cancelled'
      ];
    }
    
    return [order.status]; // Users can't change status
  };
  
  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'seller':
        return renderSellerDashboard();
      case 'shipping':
        return renderShippingDashboard();
      case 'user':
      default:
        return renderUserDashboard();
    }
  };
  
  const renderAdminDashboard = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title={language === 'en' ? 'Total Users' : 'إجمالي المستخدمين'}
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
            value={orders.length.toString()}
            change="+5"
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
        </div>
        
        <Tabs defaultValue="orders">
          <TabsList className="bg-navy-light border border-gold/20 p-1 mb-6">
            <TabsTrigger
              value="orders"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'All Orders' : 'جميع الطلبات'}
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'Analytics' : 'التحليلات'}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'Settings' : 'الإعدادات'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            {renderOrdersTable(filteredOrders)}
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            {renderAnalyticsContent()}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <ComingSoon />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => navigate('/admin/users')} 
            variant="outline" 
            className="border-gold text-gold hover:bg-gold/10"
          >
            <Users className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Manage Users' : 'إدارة المستخدمين'}
          </Button>
        </div>
      </>
    );
  };
  
  const renderSellerDashboard = () => {
    const pendingApprovalCount = filteredOrders.filter(o => o.status === 'pending_approval').length;
    const approvedOrdersCount = filteredOrders.filter(o => 
      ['approved', 'paid_deposit', 'paid_full', 'processing', 'shipped', 'delivered'].includes(o.status)
    ).length;
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Package className="h-6 w-6" />}
            title={language === 'en' ? 'Pending Approval' : 'في انتظار الموافقة'}
            value={pendingApprovalCount.toString()}
            change=""
            positive={true}
            bgClass="from-amber-500/10 to-amber-500/5"
          />
          <StatCard
            icon={<CheckCircle className="h-6 w-6" />}
            title={language === 'en' ? 'Approved Orders' : 'الطلبات المعتمدة'}
            value={approvedOrdersCount.toString()}
            change=""
            positive={true}
            bgClass="from-green-500/10 to-green-500/5"
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title={language === 'en' ? 'Revenue' : 'الإيرادات'}
            value="$5,240"
            change="+8.2%"
            positive={true}
            bgClass="from-gold/10 to-gold/5"
          />
        </div>
        
        <Tabs defaultValue="orders">
          <TabsList className="bg-navy-light border border-gold/20 p-1 mb-6">
            <TabsTrigger
              value="orders"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'Orders' : 'الطلبات'}
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'My Products' : 'منتجاتي'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            {renderOrdersTable(filteredOrders)}
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => navigate('/seller/products')} 
                className="bg-gold text-navy hover:bg-gold/90"
              >
                {language === 'en' ? 'Manage Products' : 'إدارة المنتجات'}
              </Button>
            </div>
            <ComingSoon />
          </TabsContent>
        </Tabs>
      </>
    );
  };
  
  const renderShippingDashboard = () => {
    const processingCount = filteredOrders.filter(o => o.status === 'processing').length;
    const shippedCount = filteredOrders.filter(o => o.status === 'shipped').length;
    const deliveredCount = filteredOrders.filter(o => o.status === 'delivered').length;
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Package className="h-6 w-6" />}
            title={language === 'en' ? 'Processing' : 'قيد المعالجة'}
            value={processingCount.toString()}
            change=""
            positive={true}
            bgClass="from-amber-500/10 to-amber-500/5"
          />
          <StatCard
            icon={<Truck className="h-6 w-6" />}
            title={language === 'en' ? 'Shipped' : 'تم الشحن'}
            value={shippedCount.toString()}
            change=""
            positive={true}
            bgClass="from-blue-500/10 to-blue-500/5"
          />
          <StatCard
            icon={<CheckCircle className="h-6 w-6" />}
            title={language === 'en' ? 'Delivered' : 'تم التوصيل'}
            value={deliveredCount.toString()}
            change=""
            positive={true}
            bgClass="from-green-500/10 to-green-500/5"
          />
        </div>
        
        <Tabs defaultValue="orders">
          <TabsList className="bg-navy-light border border-gold/20 p-1 mb-6">
            <TabsTrigger
              value="orders"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'Shipments' : 'الشحنات'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            {renderOrdersTable(filteredOrders)}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => navigate('/shipping/orders')} 
            variant="outline" 
            className="border-gold text-gold hover:bg-gold/10"
          >
            <Truck className="mr-2 h-4 w-4" />
            {language === 'en' ? 'View All Shipments' : 'عرض جميع الشحنات'}
          </Button>
        </div>
      </>
    );
  };
  
  const renderUserDashboard = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Package className="h-6 w-6" />}
            title={language === 'en' ? 'Total Orders' : 'إجمالي الطلبات'}
            value={filteredOrders.length.toString()}
            change=""
            positive={true}
            bgClass="from-gold/10 to-gold/5"
          />
          <StatCard
            icon={<Clock className="h-6 w-6" />}
            title={language === 'en' ? 'Pending Orders' : 'الطلبات المعلقة'}
            value={filteredOrders.filter(o => 
              ['pending_approval', 'approved', 'paid_deposit', 'paid_full', 'processing', 'shipped'].includes(o.status)
            ).length.toString()}
            change=""
            positive={true}
            bgClass="from-amber-500/10 to-amber-500/5"
          />
          <StatCard
            icon={<CheckCircle className="h-6 w-6" />}
            title={language === 'en' ? 'Completed Orders' : 'الطلبات المكتملة'}
            value={filteredOrders.filter(o => o.status === 'delivered').length.toString()}
            change=""
            positive={true}
            bgClass="from-green-500/10 to-green-500/5"
          />
        </div>
        
        <Tabs defaultValue="orders">
          <TabsList className="bg-navy-light border border-gold/20 p-1 mb-6">
            <TabsTrigger
              value="orders"
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {language === 'en' ? 'My Orders' : 'طلباتي'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            {filteredOrders.length > 0 ? (
              renderOrdersTable(filteredOrders, false)
            ) : (
              <Card className="border-gold/20 bg-navy-light">
                <CardContent className="p-6 text-center">
                  <p className="text-gold/70">
                    {language === 'en' 
                      ? "You haven't placed any orders yet." 
                      : "لم تقم بإجراء أي طلبات حتى الآن."}
                  </p>
                  <Button 
                    onClick={() => navigate('/products')} 
                    className="bg-gold text-navy hover:bg-gold/90 mt-4"
                  >
                    {language === 'en' ? 'Browse Products' : 'تصفح المنتجات'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </>
    );
  };
  
  const renderOrdersTable = (orders: Order[], allowStatusChange = true) => {
    if (orders.length === 0) {
      return (
        <Card className="border-gold/20 bg-navy-light">
          <CardContent className="p-6 text-center">
            <p className="text-gold/70">
              {language === 'en' 
                ? "No orders found." 
                : "لم يتم العثور على أي طلبات."}
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="border-gold/20 bg-navy-light overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gold/10">
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Order ID' : 'رقم الطلب'}
                </TableHead>
                {user?.role === 'admin' && (
                  <TableHead className="text-gold/70">
                    {language === 'en' ? 'Customer' : 'العميل'}
                  </TableHead>
                )}
                {(user?.role === 'admin' || user?.role === 'shipping' || user?.role === 'user') && (
                  <TableHead className="text-gold/70">
                    {language === 'en' ? 'Seller' : 'البائع'}
                  </TableHead>
                )}
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Products' : 'المنتجات'}
                </TableHead>
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Total' : 'المجموع'}
                </TableHead>
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Method' : 'طريقة التسليم'}
                </TableHead>
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Date' : 'التاريخ'}
                </TableHead>
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Status' : 'الحالة'}
                </TableHead>
                {allowStatusChange && (
                  <TableHead className="text-gold/70 text-right">
                    {language === 'en' ? 'Actions' : 'الإجراءات'}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-gold/10">
                  <TableCell className="text-gold font-mono">
                    {order.id}
                  </TableCell>
                  {user?.role === 'admin' && (
                    <TableCell className="text-gold">
                      {order.customer.name}
                    </TableCell>
                  )}
                  {(user?.role === 'admin' || user?.role === 'shipping' || user?.role === 'user') && (
                    <TableCell className="text-gold">
                      {order.sellerName}
                    </TableCell>
                  )}
                  <TableCell className="text-gold">
                    {order.products.map(product => (
                      <div key={product.id} className="text-sm">
                        {product.name} × {product.quantity}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-gold font-medium">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gold">
                    {order.deliveryMethod === 'pickup' ? 
                      (language === 'en' ? 'Pickup' : 'استلام') : 
                      (language === 'en' ? 'Shipping' : 'شحن')}
                  </TableCell>
                  <TableCell className="text-gold text-sm">
                    {order.createdAt.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-gold">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  {allowStatusChange && (
                    <TableCell className="text-right">
                      {getAvailableStatusOptions(order).length > 1 ? (
                        <Select 
                          value={order.status}
                          onValueChange={(value) => handleUpdateOrderStatus(order.id, value as Order['status'])}
                        >
                          <SelectTrigger className="w-[150px] border-gold/20 bg-navy-dark text-gold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-navy-dark border-gold/20">
                            {getAvailableStatusOptions(order).map(status => (
                              <SelectItem key={status} value={status} className="text-gold focus:bg-gold/10 focus:text-gold">
                                {getStatusDisplayName(status as Order['status'])}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-gold/50 text-sm">
                          {language === 'en' ? 'No actions available' : 'لا إجراءات متاحة'}
                        </span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  };
  
  const renderAnalyticsContent = () => {
    if (user?.role !== 'admin') {
      return (
        <Card className="border-gold/20 bg-navy-light">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gold/60 mb-4" />
            <h3 className="text-lg font-medium text-gold mb-2">
              {language === 'en' ? 'Access Restricted' : 'الوصول مقيد'}
            </h3>
            <p className="text-gold/70">
              {language === 'en' 
                ? "You don't have permission to view analytics." 
                : "ليس لديك إذن لعرض التحليلات."}
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <>
        <Card className="border-gold/20 bg-navy-light">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Sales Analytics' : 'تحليلات المبيعات'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gold/70">
                {language === 'en' 
                  ? "Analytics visualization will appear here." 
                  : "ستظهر هنا رسومات التحليلات."}
              </p>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };
  
  return (
    <PageLayout>
      <h1 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
        {user?.role === 'admin'
          ? language === 'en' ? 'Admin Dashboard' : 'لوحة تحكم المدير' 
          : user?.role === 'seller'
            ? language === 'en' ? 'Seller Dashboard' : 'لوحة تحكم البائع'
            : user?.role === 'shipping'
              ? language === 'en' ? 'Shipping Dashboard' : 'لوحة تحكم شركة الشحن'
              : language === 'en' ? 'User Dashboard' : 'لوحة تحكم المستخدم'}
      </h1>
      
      {renderDashboardContent()}
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
        
        {change && (
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
        )}
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
