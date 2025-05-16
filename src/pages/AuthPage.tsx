
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AuthPage() {
  const { user, signIn, signUp, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isSignUp = location.pathname.includes('signup');
  const [activeTab, setActiveTab] = useState(isSignUp ? 'signup' : 'signin');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  
  // If user is already logged in, redirect to home
  if (user) {
    navigate('/');
  }
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(name, email, password, role);
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(value === 'signup' ? '/auth/signup' : '/auth/signin');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy navy-gradient p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo size="lg" className="mx-auto mb-6" />
          <h1 className={`text-3xl font-bold gold-text-gradient ${language === 'ar' ? 'font-cairo' : ''}`}>
            {isSignUp 
              ? language === 'en' ? 'Create Your Account' : 'إنشاء حساب جديد'
              : language === 'en' ? 'Welcome Back' : 'مرحباً بعودتك'}
          </h1>
        </div>
        
        <Card className="border-gold/20 bg-navy-light">
          <CardHeader className="pb-2">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                    
                    <div className="text-center">
                      <p className={`text-xs text-gold/50 ${language === 'ar' ? 'font-cairo' : ''}`}>
                        {language === 'en' ? 'Demo accounts:' : 'حسابات تجريبية:'}
                      </p>
                      <p className="text-xs text-gold/50">user@example.com / password</p>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
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
                </TabsContent>
              </CardContent>
            </Tabs>
          </CardHeader>
        </Card>
        
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
