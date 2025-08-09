import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Fingerprint, Eye, EyeOff } from 'lucide-react';
import { biometricAuthService } from '@/lib/biometricAuth';

const SignInForm = (props: { isOnline?: boolean }) => {
  const { signIn, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isOnline = props.isOnline ?? navigator.onLine;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);

  // Check biometric availability and stored credentials on component mount
  useEffect(() => {
    checkBiometricAvailability();
    checkStoredCredentials();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await biometricAuthService.initialize();
      setIsBiometricAvailable(available);
    } catch (error) {
      console.log('Biometric authentication not available:', error);
    }
  };

  const checkStoredCredentials = () => {
    try {
      const creds = (biometricAuthService as any).getStoredCredentials?.();
      setHasStoredCredentials(!!creds);
    } catch (error) {
      setHasStoredCredentials(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      
      // Store credentials for biometric authentication if successful
      if (isBiometricAvailable) {
        await biometricAuthService.storeCredentials(email, password);
      }
      
      navigate('/');
    } catch (error: any) {
      if (error instanceof Error && error.message === 'Password reset required') {
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }
      // Error is handled in the auth context
    }
  };

  const handleBiometricSignIn = async () => {
    setIsBiometricLoading(true);
    try {
      const result = await biometricAuthService.authenticate({
        title: language === 'en' ? 'Sign in to Catchy' : 'تسجيل الدخول إلى Catchy',
        subtitle: language === 'en' ? 'Use biometric authentication' : 'استخدم المصادقة البيومترية',
        description: language === 'en' 
          ? `Use your ${biometricAuthService.getBiometricTypeName().toLowerCase()} to sign in`
          : `استخدم ${biometricAuthService.getBiometricTypeName().toLowerCase()} لتسجيل الدخول`,
        negativeButtonText: language === 'en' ? 'Cancel' : 'إلغاء'
      });
      
      if (result.success && result.credentials) {
        // Sign in with retrieved credentials
        await signIn(result.credentials.email, result.credentials.password);
        navigate('/');
      } else {
        // Show error message
        const errorMessage = result.error || (language === 'en' 
          ? 'Biometric authentication failed' 
          : 'فشلت المصادقة البيومترية');
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      const errorMessage = language === 'en' 
        ? 'Biometric authentication failed' 
        : 'فشلت المصادقة البيومترية';
      alert(errorMessage);
    } finally {
      setIsBiometricLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      {!isOnline && (
        <div className="text-red-500 text-center text-sm bg-red-500/10 p-2 rounded">You are offline. Please connect to the internet to sign in.</div>
      )}
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
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className={`bg-navy-dark border-gold/30 text-gold pr-10 ${language === 'ar' ? 'font-cairo' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold/70 hover:text-gold"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="text-right mt-1">
          <Link to="/auth/forgot-password" className="text-xs text-gold/70 hover:text-gold underline">
            {t('auth.forgot_password')}
          </Link>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gold text-navy hover:bg-gold-light"
        disabled={isLoading || !isOnline}
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

      {/* Biometric Authentication Button */}
      {isBiometricAvailable && hasStoredCredentials && isOnline && (
        <Button
          type="button"
          onClick={handleBiometricSignIn}
          disabled={isBiometricLoading}
          variant="outline"
          className="w-full border-gold/30 text-gold hover:bg-gold/10"
        >
          {isBiometricLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === 'en' ? 'Authenticating...' : 'جاري المصادقة...'}
            </>
          ) : (
            <>
              <Fingerprint className="mr-2 h-4 w-4" />
              {language === 'en' 
                ? `Sign in with ${biometricAuthService.getBiometricTypeName()}`
                : `تسجيل الدخول بـ ${biometricAuthService.getBiometricTypeName()}`
              }
            </>
          )}
        </Button>
      )}
      
      <div className="text-center text-xs text-gold/50">
        {language === 'en' 
          ? "Don't have an account? " 
          : "ليس لديك حساب؟ "
        }
        <Link to="/auth/signup" className="text-gold hover:text-gold-light underline">
          {language === 'en' ? 'Sign up' : 'إنشاء حساب'}
        </Link>
      </div>
    </form>
  );
};

export default SignInForm;
