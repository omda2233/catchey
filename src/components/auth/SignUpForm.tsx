
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const SignUpForm = (props: { isOnline?: boolean }) => {
  const { signUp, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isOnline = props.isOnline ?? navigator.onLine;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!name.trim()) return t('auth.name_required') || 'Full name is required';
    if (!email.trim()) return t('auth.email_required') || 'Email is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return t('auth.invalid_email') || 'Invalid email';
    if (!password) return t('auth.password_required') || 'Password is required';
    if (password.length < 6) return t('auth.weak_password') || 'Password must be at least 6 characters';
    if (password !== confirmPassword) return t('auth.password_mismatch') || 'Passwords do not match';
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await signUp(name, email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/buyer');
      }, 1200);
    } catch (err: any) {
      // Always show the error message if available
      if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError(t('auth.signup_failed') || 'Sign up failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {!isOnline && (
        <div className="text-red-500 text-center text-sm bg-red-500/10 p-2 rounded">You are offline. Please connect to the internet to sign up.</div>
      )}
      <div className="space-y-2">
        <label htmlFor="name" className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}>{t('auth.name')}</label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={language === 'en' ? 'Your Name' : 'اسمك'}
          className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="signup-email" className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}>{t('auth.email')}</label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={language === 'en' ? 'yourname@example.com' : 'اسمك@مثال.كوم'}
          className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="signup-password" className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}>{t('auth.password')}</label>
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
        <label htmlFor="signup-confirm-password" className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}>{t('auth.confirm_password') || 'Confirm Password'}</label>
        <Input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
          className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
        />
      </div>
      {error && <div className="text-red-500 text-xs text-center">{error}</div>}
      {success && <div className="text-green-500 text-xs text-center">{t('auth.signup_success') || 'Account created! Redirecting...'}</div>}
      <Button type="submit" className="w-full bg-gold text-navy hover:bg-gold-light" disabled={isLoading || !isOnline}>
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
