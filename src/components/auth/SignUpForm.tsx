
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const SignUpForm = () => {
  const { signUp, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(name, email, password, role);
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <label 
          htmlFor="name" 
          className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}
        >
          {t('auth.name')}
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={language === 'en' ? "Your Name" : "اسمك"}
          className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
        />
      </div>
      
      <div className="space-y-2">
        <label 
          htmlFor="signup-email" 
          className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}
        >
          {t('auth.email')}
        </label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={language === 'en' ? "yourname@example.com" : "اسمك@مثال.كوم"}
          className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
        />
      </div>
      
      <div className="space-y-2">
        <label 
          htmlFor="signup-password" 
          className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}
        >
          {t('auth.password')}
        </label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
        />
      </div>
      
      <div className="space-y-2">
        <label 
          htmlFor="role" 
          className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}
        >
          {t('auth.role')}
        </label>
        <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
          <SelectTrigger 
            id="role"
            className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
          >
            <SelectValue placeholder={t('role.user')} />
          </SelectTrigger>
          <SelectContent className="bg-navy-light border-gold/30">
            <SelectItem value="user" className="text-gold focus:bg-gold/10 focus:text-gold">
              {t('role.user')}
            </SelectItem>
            <SelectItem value="seller" className="text-gold focus:bg-gold/10 focus:text-gold">
              {t('role.seller')}
            </SelectItem>
            <SelectItem value="shipping" className="text-gold focus:bg-gold/10 focus:text-gold">
              {t('role.shipping')}
            </SelectItem>
            <SelectItem value="admin" className="text-gold focus:bg-gold/10 focus:text-gold">
              {t('role.admin')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gold text-navy hover:bg-gold-light"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {language === 'en' ? 'Please wait' : 'الرجاء الانتظار'}
          </>
        ) : (
          t('auth.signup')
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
