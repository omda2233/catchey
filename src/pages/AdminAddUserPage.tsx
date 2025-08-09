import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageLayout } from '@/components/layout/PageLayout';
import AddUserForm from '@/components/auth/AddUserForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function AdminAddUserPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Redirect if not logged in or not admin
  if (!user) {
    navigate('/auth/signin');
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h1 className={`text-2xl font-bold mb-2 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' ? 'Access Denied' : 'تم رفض الوصول'}
          </h1>
          <p className={`text-gold/70 mb-6 ${language === 'ar' ? 'font-cairo' : ''}`}>
            {language === 'en' 
              ? 'You do not have permission to access this page.' 
              : 'ليس لديك الإذن للوصول إلى هذه الصفحة.'}
          </p>
          <Button 
            variant="outline"
            className="border-gold/30 text-gold hover:text-gold hover:border-gold"
            onClick={() => navigate('/dashboard')}
          >
            {language === 'en' ? 'Go to Dashboard' : 'الذهاب إلى لوحة التحكم'}
          </Button>
        </div>
      </PageLayout>
    );
  }

  const handleSuccess = () => {
    // Optionally navigate back to admin dashboard or users list
    navigate('/admin/users');
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/users')}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Back' : 'رجوع'}
            </Button>
            
            <div className="flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-gold" />
              <h1 className={`text-2xl font-bold ${language === 'ar' ? 'font-cairo' : ''}`}>
                {language === 'en' ? 'Add New User' : 'إضافة مستخدم جديد'}
              </h1>
            </div>
          </div>

          {/* Form */}
          <AddUserForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </PageLayout>
  );
} 