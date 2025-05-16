
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import TestUserAccounts from './TestUserAccounts';

const SignInForm = () => {
  const { signIn, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}
        >
          {t('auth.email')}
        </label>
        <Input
          id="email"
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
          htmlFor="password" 
          className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}
        >
          {t('auth.password')}
        </label>
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
          t('auth.signin')
        )}
      </Button>
      
      <TestUserAccounts />
    </form>
  );
};

export default SignInForm;
