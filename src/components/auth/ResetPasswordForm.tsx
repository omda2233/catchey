import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError(t('auth.passwords_do_not_match'));
      return;
    }
    try {
      await resetPassword(email, password);
      navigate('/auth/signin');
    } catch (err) {
      setError(t('auth.reset_failed'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="reset-password" className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}>{t('auth.new_password')}</label>
        <Input
          id="reset-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="reset-confirm" className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}>{t('auth.confirm_password')}</label>
        <Input
          id="reset-confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          placeholder="••••••••"
          className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit" className="w-full bg-gold text-navy hover:bg-gold-light">
        {t('auth.reset_password')}
      </Button>
    </form>
  );
};
export default ResetPasswordForm; 