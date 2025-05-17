
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth, User, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
import { Button } from '@/components/ui/button';
import { AlertCircle, UserPlus, Edit, Trash2, Shield, ShieldCheck, Store, User as UserIcon, Truck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock users list - in a real app, this would come from the backend
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=1A1F2C&color=E6B54A',
    },
    {
      id: '2',
      name: 'Seller User',
      email: 'seller@test.com',
      role: 'seller',
      avatar: 'https://ui-avatars.com/api/?name=Seller+User&background=1A1F2C&color=E6B54A',
    },
    {
      id: '3',
      name: 'Buyer User',
      email: 'buyer@test.com',
      role: 'user',
      avatar: 'https://ui-avatars.com/api/?name=Buyer+User&background=1A1F2C&color=E6B54A',
    },
    {
      id: '4',
      name: 'Transport User',
      email: 'transport@test.com',
      role: 'shipping',
      avatar: 'https://ui-avatars.com/api/?name=Transport+User&background=1A1F2C&color=E6B54A',
    },
  ]);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as UserRole,
  });
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Redirect if not logged in or not admin
  if (!user) {
    navigate('/auth/signin');
    return null;
  }
  
  if (user.role !== 'admin') {
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
  
  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'All fields are required' 
          : 'جميع الحقول مطلوبة',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Email already in use' 
          : 'البريد الإلكتروني قيد الاستخدام بالفعل',
        variant: 'destructive',
      });
      return;
    }
    
    // Create new user
    const newUserObj: User = {
      id: (users.length + 1).toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=1A1F2C&color=E6B54A`,
    };
    
    setUsers([...users, newUserObj]);
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'user',
    });
    
    toast({
      title: language === 'en' ? 'Success' : 'نجاح',
      description: language === 'en' 
        ? 'User added successfully' 
        : 'تمت إضافة المستخدم بنجاح',
    });
  };
  
  const handleUpdateRole = (userId: string, role: UserRole) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role } : u
    ));
    
    toast({
      title: language === 'en' ? 'Success' : 'نجاح',
      description: language === 'en' 
        ? 'User role updated' 
        : 'تم تحديث دور المستخدم',
    });
  };
  
  const handleUpdateUser = () => {
    if (!editingUser || !editingUser.name || !editingUser.email) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'Name and email are required' 
          : 'الاسم والبريد الإلكتروني مطلوبان',
        variant: 'destructive',
      });
      return;
    }
    
    setUsers(users.map(u => 
      u.id === editingUser.id ? editingUser : u
    ));
    
    setEditingUser(null);
    
    toast({
      title: language === 'en' ? 'Success' : 'نجاح',
      description: language === 'en' 
        ? 'User updated successfully' 
        : 'تم تحديث المستخدم بنجاح',
    });
  };
  
  const handleDeleteUser = (userId: string) => {
    // Prevent deleting yourself
    if (userId === user.id) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'You cannot delete your own account' 
          : 'لا يمكنك حذف حسابك الخاص',
        variant: 'destructive',
      });
      return;
    }
    
    setUsers(users.filter(u => u.id !== userId));
    
    toast({
      title: language === 'en' ? 'Success' : 'نجاح',
      description: language === 'en' 
        ? 'User deleted successfully' 
        : 'تم حذف المستخدم بنجاح',
    });
  };
  
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4 text-gold" />;
      case 'seller':
        return <Store className="h-4 w-4 text-gold" />;
      case 'shipping':
        return <Truck className="h-4 w-4 text-gold" />;
      case 'user':
      default:
        return <UserIcon className="h-4 w-4 text-gold" />;
    }
  };
  
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return language === 'en' ? 'Admin' : 'مدير';
      case 'seller':
        return language === 'en' ? 'Seller' : 'بائع';
      case 'shipping':
        return language === 'en' ? 'Shipping' : 'شحن';
      case 'user':
      default:
        return language === 'en' ? 'Buyer' : 'مشتري';
    }
  };

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-cairo' : ''}`}>
          {language === 'en' ? 'User Management' : 'إدارة المستخدمين'}
        </h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-navy">
              <UserPlus className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Add User' : 'إضافة مستخدم'}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-navy-light border-gold/20 text-gold">
            <DialogHeader>
              <DialogTitle className={language === 'ar' ? 'font-cairo' : ''}>
                {language === 'en' ? 'Add New User' : 'إضافة مستخدم جديد'}
              </DialogTitle>
              <DialogDescription className="text-gold/70">
                {language === 'en' 
                  ? 'Fill in the details to add a new user.' 
                  : 'املأ التفاصيل لإضافة مستخدم جديد.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Name' : 'الاسم'}
                </label>
                <Input 
                  placeholder={language === 'en' ? 'Enter name' : 'أدخل الاسم'}
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                </label>
                <Input 
                  type="email"
                  placeholder={language === 'en' ? 'Enter email' : 'أدخل البريد الإلكتروني'}
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </label>
                <Input 
                  type="password"
                  placeholder={language === 'en' ? 'Enter password' : 'أدخل كلمة المرور'}
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Role' : 'الدور'}
                </label>
                <Select 
                  value={newUser.role}
                  onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger className="border-gold/20 bg-navy-dark text-gold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-dark border-gold/20">
                    <SelectItem value="user" className="text-gold focus:bg-gold/10 focus:text-gold">
                      {language === 'en' ? 'Buyer' : 'مشتري'}
                    </SelectItem>
                    <SelectItem value="seller" className="text-gold focus:bg-gold/10 focus:text-gold">
                      {language === 'en' ? 'Seller' : 'بائع'}
                    </SelectItem>
                    <SelectItem value="shipping" className="text-gold focus:bg-gold/10 focus:text-gold">
                      {language === 'en' ? 'Shipping' : 'شحن'}
                    </SelectItem>
                    <SelectItem value="admin" className="text-gold focus:bg-gold/10 focus:text-gold">
                      {language === 'en' ? 'Admin' : 'مدير'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleAddUser}
                className="bg-gold hover:bg-gold/90 text-navy"
              >
                {language === 'en' ? 'Add User' : 'إضافة مستخدم'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-navy-light border border-gold/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gold/10">
              <TableHead className="text-gold/70">
                {language === 'en' ? 'User' : 'المستخدم'}
              </TableHead>
              <TableHead className="text-gold/70">
                {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
              </TableHead>
              <TableHead className="text-gold/70">
                {language === 'en' ? 'Role' : 'الدور'}
              </TableHead>
              <TableHead className="text-gold/70 text-right">
                {language === 'en' ? 'Actions' : 'الإجراءات'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="border-gold/10">
                <TableCell className="text-gold">
                  <div className="flex items-center gap-3">
                    <img 
                      src={u.avatar} 
                      alt={u.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span>{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gold">
                  {u.email}
                </TableCell>
                <TableCell className="text-gold">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(u.role)}
                    <Select 
                      value={u.role}
                      onValueChange={(value: UserRole) => handleUpdateRole(u.id, value)}
                    >
                      <SelectTrigger className="border-none bg-transparent h-8 p-0 text-gold hover:bg-gold/10 focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-dark border-gold/20">
                        <SelectItem value="user" className="text-gold focus:bg-gold/10 focus:text-gold">
                          {language === 'en' ? 'Buyer' : 'مشتري'}
                        </SelectItem>
                        <SelectItem value="seller" className="text-gold focus:bg-gold/10 focus:text-gold">
                          {language === 'en' ? 'Seller' : 'بائع'}
                        </SelectItem>
                        <SelectItem value="shipping" className="text-gold focus:bg-gold/10 focus:text-gold">
                          {language === 'en' ? 'Shipping' : 'شحن'}
                        </SelectItem>
                        <SelectItem value="admin" className="text-gold focus:bg-gold/10 focus:text-gold">
                          {language === 'en' ? 'Admin' : 'مدير'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                          onClick={() => setEditingUser(u)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-navy-light border-gold/20 text-gold">
                        <DialogHeader>
                          <DialogTitle className={language === 'ar' ? 'font-cairo' : ''}>
                            {language === 'en' ? 'Edit User' : 'تعديل المستخدم'}
                          </DialogTitle>
                        </DialogHeader>
                        
                        {editingUser && (
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gold">
                                {language === 'en' ? 'Name' : 'الاسم'}
                              </label>
                              <Input 
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                className="bg-navy-dark border-gold/20 text-gold"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gold">
                                {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                              </label>
                              <Input 
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                className="bg-navy-dark border-gold/20 text-gold"
                              />
                            </div>
                          </div>
                        )}
                        
                        <DialogFooter>
                          <Button 
                            onClick={handleUpdateUser}
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
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageLayout>
  );
}
