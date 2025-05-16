
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      className="w-12 h-10 border-gold/30 text-gold hover:text-gold hover:border-gold"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
    >
      {language === 'en' ? 'عربي' : 'EN'}
    </Button>
  );
}
