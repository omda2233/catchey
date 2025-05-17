
import { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Tag,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { MOCK_PRODUCTS, Product, ProductCategory } from '@/models/Product';

export default function SellerProductsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter products to only show those from the current seller
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  
  // Simulate the logged in seller's ID
  const sellerId = user?.id || '';
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameAr: '',
    category: 'fabrics' as ProductCategory,
    price: 0,
    description: '',
    descriptionAr: '',
    inStock: 0,
    images: ['https://placehold.co/800x600/1A1F2C/E6B54A?text=Add+Image']
  });
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    // Filter products to only show those from the current seller
    // In a real app, this would fetch from the backend
    const filteredProducts = MOCK_PRODUCTS.filter(p => p.sellerName === user?.name);
    setSellerProducts(filteredProducts);
  }, [user?.name]);
  
  // Redirect if not logged in or not a seller
  if (!user) {
    navigate('/auth/signin');
    return null;
  }
  
  if (user.role !== 'seller' && user.role !== 'admin') {
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
  
  const handleAddProduct = () => {
    // Validate form
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Name, price, and description are required' 
          : 'الاسم والسعر والوصف مطلوبة',
        variant: 'destructive',
      });
      return;
    }
    
    // Create new product
    const newProductObj: Product = {
      id: `sel-${Date.now()}`,
      name: newProduct.name,
      nameAr: newProduct.nameAr,
      category: newProduct.category,
      price: newProduct.price,
      description: newProduct.description,
      descriptionAr: newProduct.descriptionAr,
      images: newProduct.images,
      inStock: newProduct.inStock,
      rating: 0,
      reviewCount: 0,
      featured: false,
      popular: false,
      sellerName: user.name,
      sellerId: sellerId,
      currency: 'USD',
      createdAt: new Date()
    };
    
    setSellerProducts([...sellerProducts, newProductObj]);
    
    // Reset form
    setNewProduct({
      name: '',
      nameAr: '',
      category: 'fabrics',
      price: 0,
      description: '',
      descriptionAr: '',
      inStock: 0,
      images: ['https://placehold.co/800x600/1A1F2C/E6B54A?text=Add+Image']
    });
    
    toast({
      title: language === 'en' ? 'Success' : 'نجاح',
      description: language === 'en' 
        ? 'Product added successfully' 
        : 'تمت إضافة المنتج بنجاح',
    });
  };
  
  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    setSellerProducts(products => 
      products.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      )
    );
    
    setEditingProduct(null);
    
    toast({
      title: language === 'en' ? 'Success' : 'نجاح',
      description: language === 'en' 
        ? 'Product updated successfully' 
        : 'تم تحديث المنتج بنجاح',
    });
  };
  
  const handleDeleteProduct = (productId: string) => {
    setSellerProducts(products => products.filter(p => p.id !== productId));
    
    toast({
      title: language === 'en' ? 'Success' : 'نجاح',
      description: language === 'en' 
        ? 'Product deleted successfully' 
        : 'تم حذف المنتج بنجاح',
    });
  };
  
  const getCategoryName = (category: ProductCategory) => {
    switch (category) {
      case 'fabrics':
        return language === 'en' ? 'Fabrics' : 'أقمشة';
      case 'accessories':
        return language === 'en' ? 'Accessories' : 'إكسسوارات';
      case 'tools':
        return language === 'en' ? 'Tools' : 'أدوات';
      case 'threads':
        return language === 'en' ? 'Threads' : 'خيوط';
      default:
        return category;
    }
  };
  
  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-cairo' : ''}`}>
          {language === 'en' ? 'My Products' : 'منتجاتي'}
        </h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-navy">
              <Plus className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Add Product' : 'إضافة منتج'}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy-light border-gold/20 text-gold">
            <DialogHeader>
              <DialogTitle className={language === 'ar' ? 'font-cairo' : ''}>
                {language === 'en' ? 'Add New Product' : 'إضافة منتج جديد'}
              </DialogTitle>
              <DialogDescription className="text-gold/70">
                {language === 'en' 
                  ? 'Fill in the details to add a new product.' 
                  : 'املأ التفاصيل لإضافة منتج جديد.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold">
                    {language === 'en' ? 'Product Name (English)' : 'اسم المنتج (بالإنجليزية)'}
                  </label>
                  <Input 
                    placeholder={language === 'en' ? 'Enter product name' : 'أدخل اسم المنتج'}
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold">
                    {language === 'en' ? 'Product Name (Arabic)' : 'اسم المنتج (بالعربية)'}
                  </label>
                  <Input 
                    placeholder={language === 'en' ? 'Enter Arabic product name' : 'أدخل اسم المنتج بالعربية'}
                    value={newProduct.nameAr}
                    onChange={(e) => setNewProduct({...newProduct, nameAr: e.target.value})}
                    className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold">
                    {language === 'en' ? 'Category' : 'الفئة'}
                  </label>
                  <Select 
                    value={newProduct.category}
                    onValueChange={(value: ProductCategory) => setNewProduct({...newProduct, category: value})}
                  >
                    <SelectTrigger className="border-gold/20 bg-navy-dark text-gold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-dark border-gold/20">
                      <SelectItem value="fabrics" className="text-gold focus:bg-gold/10 focus:text-gold">
                        {getCategoryName('fabrics')}
                      </SelectItem>
                      <SelectItem value="accessories" className="text-gold focus:bg-gold/10 focus:text-gold">
                        {getCategoryName('accessories')}
                      </SelectItem>
                      <SelectItem value="tools" className="text-gold focus:bg-gold/10 focus:text-gold">
                        {getCategoryName('tools')}
                      </SelectItem>
                      <SelectItem value="threads" className="text-gold focus:bg-gold/10 focus:text-gold">
                        {getCategoryName('threads')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold">
                    {language === 'en' ? 'Price ($)' : 'السعر ($)'}
                  </label>
                  <Input 
                    type="number"
                    placeholder="0.00"
                    value={newProduct.price.toString()}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold">
                    {language === 'en' ? 'Stock Quantity' : 'كمية المخزون'}
                  </label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={newProduct.inStock.toString()}
                    onChange={(e) => setNewProduct({...newProduct, inStock: parseInt(e.target.value) || 0})}
                    className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold">
                    {language === 'en' ? 'Description (English)' : 'الوصف (بالإنجليزية)'}
                  </label>
                  <Textarea 
                    placeholder={language === 'en' ? 'Enter product description' : 'أدخل وصف المنتج'}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50 min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold">
                    {language === 'en' ? 'Description (Arabic)' : 'الوصف (بالعربية)'}
                  </label>
                  <Textarea 
                    placeholder={language === 'en' ? 'Enter Arabic product description' : 'أدخل وصف المنتج بالعربية'}
                    value={newProduct.descriptionAr}
                    onChange={(e) => setNewProduct({...newProduct, descriptionAr: e.target.value})}
                    className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50 min-h-[100px]"
                  />
                </div>
                
                {/* Image upload placeholder (would be replaced with actual uploader) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gold">
                    {language === 'en' ? 'Product Images' : 'صور المنتج'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {newProduct.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-square bg-navy-dark border border-dashed border-gold/20 rounded-md flex items-center justify-center"
                      >
                        <img 
                          src={image} 
                          alt="Product" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gold/70">
                    {language === 'en' 
                      ? 'Image upload functionality will be available in the full app.' 
                      : 'ستتوفر وظيفة تحميل الصور في التطبيق الكامل.'}
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleAddProduct}
                className="bg-gold hover:bg-gold/90 text-navy"
              >
                {language === 'en' ? 'Add Product' : 'إضافة منتج'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {sellerProducts.length > 0 ? (
        <div className="bg-navy-light border border-gold/10 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gold/10">
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Product' : 'المنتج'}
                </TableHead>
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Category' : 'الفئة'}
                </TableHead>
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Price' : 'السعر'}
                </TableHead>
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Stock' : 'المخزون'}
                </TableHead>
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Rating' : 'التقييم'}
                </TableHead>
                <TableHead className="text-gold/70 text-right">
                  {language === 'en' ? 'Actions' : 'الإجراءات'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellerProducts.map((product) => {
                const displayName = language === 'en' ? product.name : (product.nameAr || product.name);
                
                return (
                  <TableRow key={product.id} className="border-gold/10">
                    <TableCell className="text-gold">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.images[0]} 
                          alt={displayName}
                          className="h-10 w-10 object-cover rounded"
                        />
                        <span>{displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gold">
                      {getCategoryName(product.category)}
                    </TableCell>
                    <TableCell className="text-gold">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-gold">
                      {product.inStock > 0 ? (
                        <span className="flex items-center text-green-500">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          {product.inStock}
                        </span>
                      ) : (
                        <span className="flex items-center text-red-400">
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          {language === 'en' ? 'Out of Stock' : 'نفدت الكمية'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-gold">
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 text-gold/80 fill-gold mr-1" />
                        {product.rating.toFixed(1)} ({product.reviewCount})
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gold/70 hover:text-gold hover:bg-gold/10"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-navy-light border-gold/20 text-gold">
                            <DialogHeader>
                              <DialogTitle className={language === 'ar' ? 'font-cairo' : ''}>
                                {language === 'en' ? 'Edit Product' : 'تعديل المنتج'}
                              </DialogTitle>
                            </DialogHeader>
                            
                            {editingProduct && (
                              <div className="max-h-[60vh] overflow-y-auto pr-2">
                                <div className="space-y-4 py-2">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gold">
                                      {language === 'en' ? 'Product Name (English)' : 'اسم المنتج (بالإنجليزية)'}
                                    </label>
                                    <Input 
                                      value={editingProduct.name}
                                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                      className="bg-navy-dark border-gold/20 text-gold"
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gold">
                                      {language === 'en' ? 'Product Name (Arabic)' : 'اسم المنتج (بالعربية)'}
                                    </label>
                                    <Input 
                                      value={editingProduct.nameAr || ''}
                                      onChange={(e) => setEditingProduct({...editingProduct, nameAr: e.target.value})}
                                      className="bg-navy-dark border-gold/20 text-gold"
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gold">
                                      {language === 'en' ? 'Price ($)' : 'السعر ($)'}
                                    </label>
                                    <Input 
                                      type="number"
                                      value={editingProduct.price}
                                      onChange={(e) => setEditingProduct({
                                        ...editingProduct, 
                                        price: parseFloat(e.target.value) || editingProduct.price
                                      })}
                                      className="bg-navy-dark border-gold/20 text-gold"
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gold">
                                      {language === 'en' ? 'Stock Quantity' : 'كمية المخزون'}
                                    </label>
                                    <Input 
                                      type="number"
                                      value={editingProduct.inStock}
                                      onChange={(e) => setEditingProduct({
                                        ...editingProduct, 
                                        inStock: parseInt(e.target.value) || 0
                                      })}
                                      className="bg-navy-dark border-gold/20 text-gold"
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gold">
                                      {language === 'en' ? 'Description (English)' : 'الوصف (بالإنجليزية)'}
                                    </label>
                                    <Textarea 
                                      value={editingProduct.description}
                                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                      className="bg-navy-dark border-gold/20 text-gold min-h-[100px]"
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gold">
                                      {language === 'en' ? 'Description (Arabic)' : 'الوصف (بالعربية)'}
                                    </label>
                                    <Textarea 
                                      value={editingProduct.descriptionAr || ''}
                                      onChange={(e) => setEditingProduct({...editingProduct, descriptionAr: e.target.value})}
                                      className="bg-navy-dark border-gold/20 text-gold min-h-[100px]"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter>
                              <Button 
                                onClick={handleUpdateProduct}
                                className="bg-gold hover:bg-gold/90 text-navy"
                              >
                                {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gold/70 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-navy-light border border-gold/10 rounded-lg">
          <Tag className="mx-auto h-12 w-12 text-gold/30 mb-4" />
          <h2 className={`text-xl font-bold mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'No Products Yet' : 'لا توجد منتجات بعد'}
          </h2>
          <p className={`text-gold/70 mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'Add your first product to start selling.' 
              : 'أضف منتجك الأول لتبدأ البيع.'}
          </p>
        </div>
      )}
    </PageLayout>
  );
}
