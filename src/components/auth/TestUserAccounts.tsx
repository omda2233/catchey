
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, Store, User, Truck } from 'lucide-react';

interface TestUserInfo {
  email: string;
  icon: React.FC<{ className?: string }>;
}

const TestUserAccounts = () => {
  const { language } = useLanguage();
  
  const testAccounts: TestUserInfo[] = [
    { email: 'admin@test.com', icon: ShieldCheck },
    { email: 'seller@test.com', icon: Store },
    { email: 'buyer@test.com', icon: User },
    { email: 'transport@test.com', icon: Truck },
  ];
  
  return (
    <div className="text-center">
      <p className={`text-sm font-medium text-gold/70 mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
        {language === 'en' ? 'Test Accounts:' : 'حسابات تجريبية:'}
      </p>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        {testAccounts.map((account) => (
          <div key={account.email} className="flex items-center space-x-1 bg-navy-dark p-1.5 rounded border border-gold/10">
            <account.icon className="h-3.5 w-3.5 text-gold/60" />
            <span className="text-gold/80">{account.email}</span>
          </div>
        ))}
      </div>
      
      <p className="mt-2 text-xs text-gold/60">
        {language === 'en' ? 'Password for all test accounts:' : 'كلمة المرور لجميع الحسابات التجريبية:'} 
        <span className="font-mono bg-navy-dark px-1.5 py-0.5 rounded ml-1">test123</span>
      </p>
    </div>
  );
};

export default TestUserAccounts;
