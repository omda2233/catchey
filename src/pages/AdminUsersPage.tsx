
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, UserPlus, Edit, Trash2, Shield, ShieldCheck, Store, User as UserIcon, Truck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function AdminUsersPage() {
  const { user, allUsers, updateUser, deleteUser, addUser } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as UserRole,
    active: true
  });
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
  
  const handleAddUser = async () => {
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
    
    try {
      await addUser(newUser);
      setIsDialogOpen(false);
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'user',
        active: true
      });
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };
  
  const handleUpdateRole = async (userId: string, role: UserRole) => {
    const userToUpdate = allUsers.find(u => u.id === userId);
    if (!userToUpdate) return;
    
    try {
      await updateUser({
        ...userToUpdate,
        role
      });
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };
  
  const handleToggleActive = async (userId: string, active: boolean) => {
    const userToUpdate = allUsers.find(u => u.id === userId);
    if (!userToUpdate) return;
    
    try {
      await updateUser({
        ...userToUpdate,
        active
      });
      
      toast({
        title: language === 'en' ? 'Success' : 'نجاح',
        description: language === 'en' 
          ? `User ${active ? 'activated' : 'deactivated'} successfully` 
          : `تم ${active ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح`,
      });
    } catch (error) {
      console.error('Failed to toggle active status:', error);
    }
  };
  
  const handleUpdateUser = async () => {
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
    
    try {
      await updateUser(editingUser);
      setIsEditDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
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
        
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-gold hover:bg-gold/90 text-navy"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Add User' : 'إضافة مستخدم'}
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Label htmlFor="name" className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Name' : 'الاسم'}
                </Label>
                <Input 
                  id="name"
                  placeholder={language === 'en' ? 'Enter name' : 'أدخل الاسم'}
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                </Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder={language === 'en' ? 'Enter email' : 'أدخل البريد الإلكتروني'}
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder={language === 'en' ? 'Enter password' : 'أدخل كلمة المرور'}
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="bg-navy-dark border-gold/20 text-gold placeholder:text-gold/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Role' : 'الدور'}
                </Label>
                <Select 
                  value={newUser.role}
                  onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger id="role" className="border-gold/20 bg-navy-dark text-gold">
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
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="active" 
                  checked={newUser.active}
                  onCheckedChange={(checked) => setNewUser({...newUser, active: checked})}
                  className="data-[state=checked]:bg-gold"
                />
                <Label htmlFor="active" className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Active Account' : 'حساب نشط'}
                </Label>
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
        <div className="overflow-x-auto">
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
                <TableHead className="text-gold/70">
                  {language === 'en' ? 'Status' : 'الحالة'}
                </TableHead>
                <TableHead className="text-gold/70 text-right">
                  {language === 'en' ? 'Actions' : 'الإجراءات'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((u) => (
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
                  <TableCell className="text-gold">
                    <div className="flex items-center gap-2">
                      {u.active !== false ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/20">
                          {language === 'en' ? 'Active' : 'نشط'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-300 border-red-500/20">
                          {language === 'en' ? 'Inactive' : 'غير نشط'}
                        </Badge>
                      )}
                      <Switch 
                        checked={u.active !== false}
                        onCheckedChange={(checked) => handleToggleActive(u.id, checked)}
                        className="data-[state=checked]:bg-gold"
                        disabled={u.id === user.id} // Can't deactivate yourself
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gold/70 hover:text-gold hover:bg-gold/10"
                        onClick={() => {
                          setEditingUser(u);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gold/70 hover:text-red-500 hover:bg-red-500/10"
                        disabled={u.id === user.id} // Can't delete yourself
                        onClick={() => {
                          setUserToDelete(u.id);
                          setIsDeleteDialogOpen(true);
                        }}
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
      </div>
      
      {/* Edit user dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-navy-light border-gold/20 text-gold">
          <DialogHeader>
            <DialogTitle className={language === 'ar' ? 'font-cairo' : ''}>
              {language === 'en' ? 'Edit User' : 'تعديل المستخدم'}
            </DialogTitle>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Name' : 'الاسم'}
                </Label>
                <Input 
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="bg-navy-dark border-gold/20 text-gold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                </Label>
                <Input 
                  id="edit-email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="bg-navy-dark border-gold/20 text-gold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Role' : 'الدور'}
                </Label>
                <Select 
                  value={editingUser.role}
                  onValueChange={(value: UserRole) => setEditingUser({...editingUser, role: value})}
                >
                  <SelectTrigger id="edit-role" className="border-gold/20 bg-navy-dark text-gold">
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
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="edit-active" 
                  checked={editingUser.active !== false}
                  onCheckedChange={(checked) => setEditingUser({...editingUser, active: checked})}
                  className="data-[state=checked]:bg-gold"
                  disabled={editingUser.id === user.id} // Can't deactivate yourself
                />
                <Label htmlFor="edit-active" className="text-sm font-medium text-gold">
                  {language === 'en' ? 'Active Account' : 'حساب نشط'}
                </Label>
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
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-navy-light border-gold/20 text-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className={language === 'ar' ? 'font-cairo' : ''}>
              {language === 'en' ? 'Delete User' : 'حذف المستخدم'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gold/70">
              {language === 'en' 
                ? 'Are you sure you want to delete this user? This action cannot be undone.' 
                : 'هل أنت متأكد من أنك تريد حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gold/30 text-gold hover:bg-gold/10 hover:text-gold">
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {language === 'en' ? 'Delete' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
}
