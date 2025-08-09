import React, { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess, onCancel }) => {
  const { createUserAsAdmin, isLoading } = useAuth();
  const { t, language } = useLanguage();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!fullName.trim()) return 'Full name is required';
    if (!email.trim()) return 'Email is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Invalid email format';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    if (!role) return 'Role is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await createUserAsAdmin(fullName, email, password, role);
      setSuccess(true);
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('buyer');
      
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create user. Please try again.');
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className={`text-xl font-bold ${language === 'ar' ? 'font-cairo' : ''}`}>
          {language === 'en' ? 'Add New User' : 'إضافة مستخدم جديد'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className={`text-sm ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
            </Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder={language === 'en' ? 'Enter full name' : 'أدخل الاسم الكامل'}
              className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className={`text-sm ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={language === 'en' ? 'Enter email address' : 'أدخل البريد الإلكتروني'}
              className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className={`text-sm ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Password' : 'كلمة المرور'}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={`text-sm ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className={`text-sm ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Role' : 'الدور'}
            </Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger 
                id="role"
                className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
              >
                <SelectValue placeholder={language === 'en' ? 'Select role' : 'اختر الدور'} />
              </SelectTrigger>
              <SelectContent className="bg-navy-light border-gold/30">
                <SelectItem value="buyer" className="text-gold focus:bg-gold/10 focus:text-gold">
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
          
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-500 text-sm text-center bg-green-500/10 p-2 rounded">
              {language === 'en' ? 'User created successfully!' : 'تم إنشاء المستخدم بنجاح!'}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1 bg-gold text-navy hover:bg-gold-light"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? 'Creating...' : 'جاري الإنشاء...'}
                </>
              ) : (
                language === 'en' ? 'Create User' : 'إنشاء المستخدم'
              )}
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddUserForm; 