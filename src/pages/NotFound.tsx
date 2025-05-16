
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center navy-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className={`text-6xl font-bold gold-text-gradient mb-4 ${language === 'ar' ? 'font-cairo' : ''}`}>
          404
        </h1>
        <p className={`text-xl text-gold mb-8 ${language === 'ar' ? 'font-cairo' : ''}`}>
          {language === 'en' ? 'Page not found' : 'الصفحة غير موجودة'}
        </p>
        <p className={`text-gold/70 max-w-md mx-auto mb-8 ${language === 'ar' ? 'font-cairo' : ''}`}>
          {language === 'en' 
            ? "We're sorry, the page you requested could not be found. Please check the URL or go back to the homepage." 
            : "نأسف، الصفحة التي طلبتها غير موجودة. يرجى التحقق من العنوان أو العودة إلى الصفحة الرئيسية."}
        </p>
        <Button
          onClick={() => navigate('/')} 
          className="bg-gold text-navy hover:bg-gold-light"
        >
          {language === 'en' ? 'Back to Home' : 'العودة إلى الصفحة الرئيسية'}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
