import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function AuthPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  if (user) return null; // Prevent flash of content before redirect
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy navy-gradient p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo size="lg" className="mx-auto mb-6" />
          <h1 className={`text-3xl font-bold gold-text-gradient ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Welcome to Catchy' : 'مرحباً بك في كاتشي'}
          </h1>
        </div>
        
        <AuthCard />
        
        <div className="mt-6 text-center">
          <Button
            variant="link"
            className="text-gold/70 hover:text-gold"
            onClick={() => navigate('/')}
          >
            {language === 'ar' ? <ChevronRight className="mr-2 h-4 w-4" /> : <ChevronLeft className="mr-2 h-4 w-4" />}
            {language === 'en' ? 'Back to Home' : 'العودة إلى الصفحة الرئيسية'}
          </Button>
        </div>
      </div>
    </div>
  );
}
