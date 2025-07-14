import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';

const PostServicePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center p-4">
        <BaseCard className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">تسجيل الدخول مطلوب</h1>
          <p className="text-text-secondary mb-6">يجب تسجيل الدخول لنشر الخدمات</p>
          <Button onClick={() => navigate('/login')} variant="primary">
            تسجيل الدخول
          </Button>
        </BaseCard>
      </div>
    );
  }

  if (user.role !== 'provider') {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center p-4">
        <BaseCard className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">تحقق مطلوب</h1>
          <p className="text-text-secondary mb-6">
            يجب أن تكون محترفًا موثقًا لنشر الخدمات. يرجى التواصل مع الدعم للتحقق من حسابك.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/')} variant="outline" fullWidth>
              العودة للرئيسية
            </Button>
            <Button onClick={() => navigate('/contact')} variant="primary" fullWidth>
              التواصل مع الدعم
            </Button>
          </div>
        </BaseCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream p-4">
      <div className="container mx-auto max-w-4xl">
        <BaseCard className="p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-6 text-center">نشر خدمة جديدة</h1>
          <p className="text-text-secondary text-center mb-8">
            قم بنشر خدمتك للوصول إلى عملاء جدد
          </p>
          
          {/* Placeholder form - to be implemented */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                عنوان الخدمة
              </label>
              <input
                type="text"
                placeholder="أدخل عنوان الخدمة"
                className="input input-bordered w-full"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                وصف الخدمة
              </label>
              <textarea
                placeholder="أدخل وصف مفصل للخدمة"
                className="textarea textarea-bordered w-full h-32"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  الفئة
                </label>
                <select className="select select-bordered w-full" disabled>
                  <option>اختر الفئة</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  السعر
                </label>
                <input
                  type="number"
                  placeholder="السعر بالجنيه المصري"
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
            </div>
            
            <div className="text-center">
              <Button variant="primary" size="lg" disabled>
                نشر الخدمة
              </Button>
              <p className="text-sm text-text-secondary mt-2">
                هذه الصفحة قيد التطوير
              </p>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

export default PostServicePage; 