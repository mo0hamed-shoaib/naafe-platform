import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';

const RequestServicePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center p-4">
        <BaseCard className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">تسجيل الدخول مطلوب</h1>
          <p className="text-text-secondary mb-6">يجب تسجيل الدخول لطلب الخدمات</p>
          <Button onClick={() => navigate('/login', { replace: true })} variant="primary">
            تسجيل الدخول
          </Button>
        </BaseCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream p-4">
      <div className="container mx-auto max-w-4xl">
        <BaseCard className="p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-6 text-center">طلب خدمة جديدة</h1>
          <p className="text-text-secondary text-center mb-8">
            اكتب تفاصيل الخدمة التي تحتاجها وسيقوم المحترفون بتقديم عروضهم
          </p>
          
          {/* Placeholder form - to be implemented */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                عنوان الطلب
              </label>
              <input
                type="text"
                placeholder="أدخل عنوان الطلب"
                className="input input-bordered w-full"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                وصف الطلب
              </label>
              <textarea
                placeholder="أدخل وصف مفصل للخدمة المطلوبة"
                className="textarea textarea-bordered w-full h-32"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  الفئة
                </label>
                <select className="select select-bordered w-full" disabled aria-label="اختر الفئة">
                  <option>اختر الفئة</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  الميزانية الدنيا
                </label>
                <input
                  type="number"
                  placeholder="الحد الأدنى"
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  الميزانية القصوى
                </label>
                <input
                  type="number"
                  placeholder="الحد الأقصى"
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                الموقع
              </label>
              <input
                type="text"
                placeholder="أدخل العنوان أو المنطقة"
                className="input input-bordered w-full"
                disabled
              />
            </div>
            
            <div className="text-center">
              <Button variant="primary" size="lg" disabled>
                نشر الطلب
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

export default RequestServicePage; 