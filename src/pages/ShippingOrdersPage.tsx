
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertCircle, 
  Package,
  Clock,
  Truck,
  CheckCircle,
  MapPin,
  User,
  CalendarDays,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

// Define order status type
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Define order interface
interface Order {
  id: string;
  customer: string;
  address: string;
  date: Date;
  total: number;
  status: OrderStatus;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export default function ShippingOrdersPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock orders for the shipping company
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      address: '123 Main St, New York, NY 10001',
      date: new Date('2023-05-15'),
      total: 129.99,
      status: 'pending',
      items: [
        {
          productId: 'P1',
          productName: 'Blue Cotton Fabric',
          quantity: 2,
          price: 24.99
        },
        {
          productId: 'P2',
          productName: 'Sewing Kit',
          quantity: 1,
          price: 79.99
        }
      ]
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      date: new Date('2023-05-16'),
      total: 89.97,
      status: 'processing',
      items: [
        {
          productId: 'P3',
          productName: 'Silk Fabric',
          quantity: 3,
          price: 29.99
        }
      ]
    },
    {
      id: 'ORD-003',
      customer: 'Robert Johnson',
      address: '789 Pine St, Chicago, IL 60007',
      date: new Date('2023-05-17'),
      total: 159.99,
      status: 'shipped',
      items: [
        {
          productId: 'P4',
          productName: 'Professional Scissors',
          quantity: 1,
          price: 59.99
        },
        {
          productId: 'P5',
          productName: 'Wool Yarn Set',
          quantity: 2,
          price: 49.99
        }
      ]
    },
    {
      id: 'ORD-004',
      customer: 'Emily Davis',
      address: '101 Cedar Dr, Miami, FL 33101',
      date: new Date('2023-05-18'),
      total: 74.99,
      status: 'delivered',
      items: [
        {
          productId: 'P6',
          productName: 'Leather Thread',
          quantity: 1,
          price: 24.99
        },
        {
          productId: 'P7',
          productName: 'Measuring Tape Set',
          quantity: 1,
          price: 19.99
        },
        {
          productId: 'P8',
          productName: 'Buttons Assortment',
          quantity: 1,
          price: 29.99
        }
      ]
    }
  ]);
  
  // Redirect if not logged in or not a shipping company
  if (!user) {
    navigate('/auth/signin');
    return null;
  }
  
  if (user.role !== 'shipping' && user.role !== 'admin') {
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
            onClick={() => navigate('/dashboard')}
          >
            {language === 'en' ? 'Go to Dashboard' : 'الذهاب إلى لوحة التحكم'}
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    
    toast({
      title: language === 'en' ? 'Status Updated' : 'تم تحديث الحالة',
      description: language === 'en' 
        ? `Order ${orderId} is now ${status}` 
        : `الطلب ${orderId} الآن ${getStatusNameArabic(status)}`,
    });
  };
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-300">
          <Clock className="h-3 w-3 mr-1" />
          {language === 'en' ? 'Pending' : 'قيد الانتظار'}
        </Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          <Package className="h-3 w-3 mr-1" />
          {language === 'en' ? 'Processing' : 'قيد المعالجة'}
        </Badge>;
      case 'shipped':
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
          <Truck className="h-3 w-3 mr-1" />
          {language === 'en' ? 'Shipped' : 'تم الشحن'}
        </Badge>;
      case 'delivered':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          {language === 'en' ? 'Delivered' : 'تم التوصيل'}
        </Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-300">
          <AlertCircle className="h-3 w-3 mr-1" />
          {language === 'en' ? 'Cancelled' : 'ملغي'}
        </Badge>;
      default:
        return null;
    }
  };
  
  const getStatusNameArabic = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'processing': return 'قيد المعالجة';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التوصيل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  return (
    <PageLayout>
      <h1 className={`text-3xl font-bold mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
        {language === 'en' ? 'Shipping Orders' : 'طلبات الشحن'}
      </h1>
      
      <div className="bg-navy-light border border-gold/10 rounded-lg overflow-hidden mb-8">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-navy-dark/50 rounded-lg p-4 border border-gold/10">
            <h3 className={`text-lg font-medium mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Pending Orders' : 'الطلبات قيد الانتظار'}
            </h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gold">
                {orders.filter(o => o.status === 'pending').length}
              </span>
              <Clock className="h-8 w-8 text-gold/30" />
            </div>
          </div>
          
          <div className="bg-navy-dark/50 rounded-lg p-4 border border-gold/10">
            <h3 className={`text-lg font-medium mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Processing Orders' : 'الطلبات قيد المعالجة'}
            </h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gold">
                {orders.filter(o => o.status === 'processing').length}
              </span>
              <Package className="h-8 w-8 text-gold/30" />
            </div>
          </div>
          
          <div className="bg-navy-dark/50 rounded-lg p-4 border border-gold/10">
            <h3 className={`text-lg font-medium mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Shipped Orders' : 'الطلبات التي تم شحنها'}
            </h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gold">
                {orders.filter(o => o.status === 'shipped').length}
              </span>
              <Truck className="h-8 w-8 text-gold/30" />
            </div>
          </div>
          
          <div className="bg-navy-dark/50 rounded-lg p-4 border border-gold/10">
            <h3 className={`text-lg font-medium mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Delivered Orders' : 'الطلبات التي تم توصيلها'}
            </h3>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gold">
                {orders.filter(o => o.status === 'delivered').length}
              </span>
              <CheckCircle className="h-8 w-8 text-gold/30" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-navy-light border border-gold/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gold/10">
              <TableHead className="text-gold/70">
                {language === 'en' ? 'Order ID' : 'رقم الطلب'}
              </TableHead>
              <TableHead className="text-gold/70">
                {language === 'en' ? 'Customer' : 'العميل'}
              </TableHead>
              <TableHead className="text-gold/70">
                {language === 'en' ? 'Date' : 'التاريخ'}
              </TableHead>
              <TableHead className="text-gold/70">
                {language === 'en' ? 'Items' : 'العناصر'}
              </TableHead>
              <TableHead className="text-gold/70">
                {language === 'en' ? 'Total' : 'المجموع'}
              </TableHead>
              <TableHead className="text-gold/70">
                {language === 'en' ? 'Status' : 'الحالة'}
              </TableHead>
              <TableHead className="text-gold/70 text-right">
                {language === 'en' ? 'Actions' : 'الإجراءات'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border-gold/10">
                <TableCell className="text-gold font-mono">
                  {order.id}
                </TableCell>
                <TableCell className="text-gold">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gold/60" />
                    <span>{order.customer}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gold/60">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">{order.address}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gold">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gold/60" />
                    <span>
                      {order.date.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gold">
                  <span className="font-medium">{order.items.length}</span>
                  <span className="text-gold/60 ml-1">
                    {language === 'en' ? 'items' : 'عناصر'}
                  </span>
                </TableCell>
                <TableCell className="text-gold font-medium">
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-gold">
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell className="text-right">
                  <Select 
                    value={order.status}
                    onValueChange={(value: OrderStatus) => handleUpdateStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-[150px] border-gold/20 bg-navy-dark text-gold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-dark border-gold/20">
                      <SelectItem value="pending" className="text-gold focus:bg-gold/10 focus:text-gold">
                        {language === 'en' ? 'Pending' : 'قيد الانتظار'}
                      </SelectItem>
                      <SelectItem value="processing" className="text-gold focus:bg-gold/10 focus:text-gold">
                        {language === 'en' ? 'Processing' : 'قيد المعالجة'}
                      </SelectItem>
                      <SelectItem value="shipped" className="text-gold focus:bg-gold/10 focus:text-gold">
                        {language === 'en' ? 'Shipped' : 'تم الشحن'}
                      </SelectItem>
                      <SelectItem value="delivered" className="text-gold focus:bg-gold/10 focus:text-gold">
                        {language === 'en' ? 'Delivered' : 'تم التوصيل'}
                      </SelectItem>
                      <SelectItem value="cancelled" className="text-gold focus:bg-gold/10 focus:text-gold">
                        {language === 'en' ? 'Cancelled' : 'ملغي'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageLayout>
  );
}
