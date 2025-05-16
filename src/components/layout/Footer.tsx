
import { Logo } from '../Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gold/10 bg-navy-dark pb-6 pt-10">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="md:w-1/3">
            <Logo />
            <p className={`mt-4 text-gold/70 text-sm ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? (
                "Catchy is a premier bilingual marketplace connecting fabric sellers, accessory providers, and customers across the Middle East."
              ) : (
                "كاتشي هي سوق ثنائية اللغة رائدة تربط بائعي الأقمشة ومزودي الإكسسوارات والعملاء في جميع أنحاء الشرق الأوسط."
              )}
            </p>
            <div className="mt-6 flex gap-4">
              <a 
                href="#" 
                className="rounded-full bg-gold/10 p-2 text-gold hover:bg-gold/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="rounded-full bg-gold/10 p-2 text-gold hover:bg-gold/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="rounded-full bg-gold/10 p-2 text-gold hover:bg-gold/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`font-bold text-gold mb-4 ${language === 'ar' ? 'font-cairo' : ''}`}>
                {language === 'en' ? 'Products' : 'المنتجات'}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/products?category=fabrics" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {t('category.fabrics')}
                  </a>
                </li>
                <li>
                  <a href="/products?category=accessories" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {t('category.accessories')}
                  </a>
                </li>
                <li>
                  <a href="/products?category=tools" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {t('category.tools')}
                  </a>
                </li>
                <li>
                  <a href="/products?category=threads" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {t('category.threads')}
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className={`font-bold text-gold mb-4 ${language === 'ar' ? 'font-cairo' : ''}`}>
                {language === 'en' ? 'Company' : 'الشركة'}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {language === 'en' ? 'About Us' : 'من نحن'}
                  </a>
                </li>
                <li>
                  <a href="#" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {language === 'en' ? 'Careers' : 'وظائف'}
                  </a>
                </li>
                <li>
                  <a href="#" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {language === 'en' ? 'Contact Us' : 'اتصل بنا'}
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className={`font-bold text-gold mb-4 ${language === 'ar' ? 'font-cairo' : ''}`}>
                {language === 'en' ? 'Support' : 'الدعم'}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {language === 'en' ? 'Help Center' : 'مركز المساعدة'}
                  </a>
                </li>
                <li>
                  <a href="#" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}
                  </a>
                </li>
                <li>
                  <a href="#" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
                  </a>
                </li>
                <li>
                  <a href="#" className={`text-gold/70 text-sm hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
                    {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-4 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between">
          <p className={`text-gold/50 text-xs ${language === 'ar' ? 'font-cairo' : ''}`}>
            © {currentYear} Catchy. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
          </p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <a href="#" className={`text-gold/50 text-xs hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Terms' : 'الشروط'}
            </a>
            <a href="#" className={`text-gold/50 text-xs hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Privacy' : 'الخصوصية'}
            </a>
            <a href="#" className={`text-gold/50 text-xs hover:text-gold ${language === 'ar' ? 'font-cairo' : ''}`}>
              {language === 'en' ? 'Cookies' : 'ملفات تعريف الارتباط'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
