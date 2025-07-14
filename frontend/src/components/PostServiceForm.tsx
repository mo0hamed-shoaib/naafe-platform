import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Button from './ui/Button';
import BaseCard from './ui/BaseCard';
import { useNavigate } from 'react-router-dom';

interface PostServiceFormData {
  serviceTitle: string;
  category: string;
  serviceDescription: string;
  minBudget: string;
  maxBudget: string;
  government: string;
  city: string;
  street: string;
  apartmentNumber: string;
  additionalInformation: string;
  preferredDateTime: string;
}

const PostServiceForm: React.FC = () => {
  const [formData, setFormData] = useState<PostServiceFormData>({
    serviceTitle: '',
    category: '',
    serviceDescription: '',
    minBudget: '',
    maxBudget: '',
    government: '',
    city: '',
    street: '',
    apartmentNumber: '',
    additionalInformation: '',
    preferredDateTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Backend expects: title, description, category, price, location, etc.
      const payload = {
        title: formData.serviceTitle,
        description: formData.serviceDescription,
        category: formData.category,
        price: {
          amount: Number(formData.maxBudget),
          currency: 'EGP',
        },
        deliveryTimeDays: 1, // Placeholder
        location: {
          type: 'Point',
          coordinates: [0, 0], // Placeholder, should be geocoded
          address: `${formData.government}, ${formData.city}, ${formData.street}, ${formData.apartmentNumber}`,
        },
        features: [],
        requirements: [],
      };
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to post service');
      }
      setSuccess(true);
      setTimeout(() => navigate('/services'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Fetch categories from backend
  const categories = [
    'Home Services',
    'Beauty & Wellness',
    'Events & Photography',
    'Tutoring & Lessons',
    'Technology & IT',
    'Automotive',
    'Health & Fitness',
    'Food & Catering',
  ];

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex flex-col font-cairo" dir="rtl">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <BaseCard className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
            <h1 className="text-3xl font-extrabold text-[#0e1b18] text-center mb-8">نشر خدمة</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="serviceTitle">عنوان الخدمة</label>
                  <input
                    type="text"
                    id="serviceTitle"
                    name="serviceTitle"
                    value={formData.serviceTitle}
                    onChange={handleChange}
                    placeholder="عنوان الخدمة"
                    className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="category">الفئة</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-300 px-4 py-3 rounded-xl text-[#0e1b18] text-right focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                    required
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="serviceDescription">وصف الخدمة</label>
                <textarea
                  id="serviceDescription"
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                  placeholder="وصف مفصل للخدمة..."
                  className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 min-h-[120px] focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200 resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="minBudget">الحد الأدنى للميزانية (جنيه)</label>
                  <input
                    type="number"
                    id="minBudget"
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleChange}
                    placeholder="مثال: 500"
                    className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="maxBudget">الحد الأقصى للميزانية (جنيه)</label>
                  <input
                    type="number"
                    id="maxBudget"
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    placeholder="مثال: 1500"
                    className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="government">المحافظة</label>
                  <input
                    type="text"
                    id="government"
                    name="government"
                    value={formData.government}
                    onChange={handleChange}
                    placeholder="مثال: القاهرة، الجيزة، الإسكندرية"
                    className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="city">المدينة</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="مثال: مدينة نصر، المعادي، الزمالك"
                    className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="street">الشارع</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="مثال: شارع التحرير، شارع محمد فريد"
                    className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="apartmentNumber">رقم الشقة</label>
                  <input
                    type="text"
                    id="apartmentNumber"
                    name="apartmentNumber"
                    value={formData.apartmentNumber}
                    onChange={handleChange}
                    placeholder="مثال: شقة 12، الدور 3"
                    className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="additionalInformation">معلومات إضافية</label>
                <textarea
                  id="additionalInformation"
                  name="additionalInformation"
                  value={formData.additionalInformation}
                  onChange={handleChange}
                  placeholder="أي تفاصيل إضافية..."
                  className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 min-h-[80px] focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="preferredDateTime">التاريخ والوقت المفضل</label>
                <input
                  type="datetime-local"
                  id="preferredDateTime"
                  name="preferredDateTime"
                  value={formData.preferredDateTime}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                />
              </div>
              {error && <div className="text-red-600 text-sm text-right bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
              {success && <div className="text-green-600 text-sm text-right bg-green-50 p-3 rounded-lg border border-green-200">تم إرسال الطلب بنجاح!</div>}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="rounded-xl"
              >
                إرسال الطلب
              </Button>
            </form>
          </BaseCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostServiceForm; 