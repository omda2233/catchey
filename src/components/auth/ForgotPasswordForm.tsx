import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { t, language } = useLanguage();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setSent(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="forgot-email" className={`text-sm text-gold-light ${language === 'ar' ? 'font-cairo' : ''}`}>{t('auth.email')}</label>
        <Input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={language === 'en' ? 'yourname@example.com' : 'اسمك@مثال.كوم'}
          className={`bg-navy-dark border-gold/30 text-gold ${language === 'ar' ? 'font-cairo' : ''}`}
        />
      </div>
      <Button type="submit" className="w-full bg-gold text-navy hover:bg-gold-light">
        {t('auth.send_reset_link')}
      </Button>
      {sent && <div className="text-green-500">{t('auth.reset_link_sent')}</div>}
    </form>
  );
};
export default ForgotPasswordForm; 