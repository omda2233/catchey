
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardHeader
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AuthCard = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isSignUp = location.pathname.includes('signup');
  const currentTab = isSignUp ? 'signup' : 'signin';
  const isOnline = navigator.onLine;
  
  const handleTabChange = (value: string) => {
    navigate(value === 'signup' ? '/auth/signup' : '/auth/signin');
  };
  
  return (
    <Card className="border-gold/20 bg-navy-light">
      <CardHeader className="pb-2">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 bg-navy-dark">
            <TabsTrigger 
              value="signin" 
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {t('auth.signin')}
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className={`data-[state=active]:bg-gold data-[state=active]:text-navy ${language === 'ar' ? 'font-cairo' : ''}`}
            >
              {t('auth.signup')}
            </TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-6">
            <TabsContent value="signin">
              <SignInForm isOnline={isOnline} />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignUpForm isOnline={isOnline} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default AuthCard;
