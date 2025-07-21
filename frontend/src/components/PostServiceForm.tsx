import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Button from './ui/Button';
import BaseCard from './ui/BaseCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FormInput, FormTextarea, AIAssistant, PricingGuidance } from './ui';
import UnifiedSelect from './ui/UnifiedSelect';

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
  deliveryTimeDays: string;
  tags: string;
}

interface AddressFields {
  government: string;
  city: string;
  street: string;
  apartmentNumber: string;
  additionalInformation: string;
}

const PostServiceForm: React.FC = () => {
  const { accessToken } = useAuth();
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
    deliveryTimeDays: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [providerSkills, setProviderSkills] = useState<string[]>([]);
  const [profileAddress, setProfileAddress] = useState<AddressFields | null>(null);
  const [showAutofillSuccess, setShowAutofillSuccess] = useState(false);

  useEffect(() => {
    setCategoriesLoading(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data.categories)) {
          setCategories(data.data.categories.map((cat: { name: string }) => cat.name));
        } else {
          setCategoriesError('فشل تحميل الفئات');
        }
      })
      .catch(() => setCategoriesError('فشل تحميل الفئات'))
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Fetch provider skills on mount
  useEffect(() => {
    fetch('/api/users/me/skills', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setProviderSkills(data.data.skills || []);
      });
  }, [accessToken]);

  useEffect(() => {
    fetch('/api/users/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.user?.profile?.location) {
          setProfileAddress(data.data.user.profile.location);
        }
      });
  }, [accessToken]);

  const handleAutofillAddress = () => {
    if (!profileAddress) return;
    setFormData(prev => ({
      ...prev,
      government: profileAddress.government || '',
      city: profileAddress.city || '',
      street: profileAddress.street || '',
      apartmentNumber: profileAddress.apartmentNumber || '',
      additionalInformation: profileAddress.additionalInformation || '',
    }));
    setShowAutofillSuccess(true);
    setTimeout(() => setShowAutofillSuccess(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAISuggestion = (field: string, value: string) => {
    if (field === 'title') {
      setFormData(prev => ({ ...prev, serviceTitle: value }));
    } else if (field === 'description') {
      setFormData(prev => ({ ...prev, serviceDescription: value }));
    } else if (field === 'keywords') {
      setFormData(prev => ({ ...prev, tags: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePricingApply = (min: number, max: number) => {
    setFormData(prev => ({ 
      ...prev, 
      minBudget: min.toString(),
      maxBudget: max.toString()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        title: formData.serviceTitle,
        description: formData.serviceDescription,
        category: formData.category,
        budget: {
          min: Number(formData.minBudget),
          max: Number(formData.maxBudget),
          currency: 'EGP',
        },
        location: {
          government: formData.government,
          city: formData.city,
          street: formData.street,
          apartmentNumber: formData.apartmentNumber,
          address: `${formData.government}, ${formData.city}, ${formData.street}, ${formData.apartmentNumber}`,
          additionalInformation: formData.additionalInformation,
        },
        preferredDateTime: formData.preferredDateTime,
        deliveryTimeDays: Number(formData.deliveryTimeDays),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        attachments: [],
      };
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to post service');
      }
      setSuccess(true);
      setTimeout(() => navigate('/search?category=' + encodeURIComponent(formData.category)), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

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
                  <FormInput
                    type="text"
                    id="serviceTitle"
                    name="serviceTitle"
                    value={formData.serviceTitle}
                    onChange={handleChange}
                    placeholder="عنوان الخدمة"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="category">الفئة</label>
                  <UnifiedSelect
                    value={formData.category}
                    onChange={val => setFormData(prev => ({ ...prev, category: val }))}
                    options={categories.map((cat: string) => ({ value: cat, label: cat }))}
                    placeholder="اختر الفئة"
                    required
                    disabled={categoriesLoading}
                    className="w-full"
                  />
                  {categoriesError && <div className="text-red-600 text-sm text-right bg-red-50 p-2 rounded-lg border border-red-200 mt-2">{categoriesError}</div>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="serviceDescription">وصف الخدمة</label>
                <FormTextarea
                  id="serviceDescription"
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                  placeholder="وصف مفصل للخدمة..."
                  required
                />
              </div>
              {providerSkills.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2">مهاراتك</label>
                  <div className="flex flex-wrap gap-2">
                    {providerSkills.map(skill => (
                      <span key={skill} className="bg-[#F5A623]/10 text-[#F5A623] px-3 py-1 rounded-full text-sm font-cairo border border-[#F5A623]/30">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="my-6">
                <AIAssistant
                  formType="service"
                  category={formData.category}
                  currentFields={formData as unknown as Record<string, unknown>}
                  onSuggestionApply={handleAISuggestion}
                  inputPlaceholder="مثال: أعلن عن خدمة تنظيف منازل باحترافية..."
                  skills={providerSkills}
                />
                <PricingGuidance
                  formType="service"
                  category={formData.category}
                  location={formData.government}
                  userBudget={formData.minBudget && formData.maxBudget ? {
                    min: Number(formData.minBudget),
                    max: Number(formData.maxBudget)
                  } : null}
                  onPricingApply={handlePricingApply}
                  skills={providerSkills}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="minBudget">الحد الأدنى للميزانية (جنيه)</label>
                  <FormInput
                    type="number"
                    id="minBudget"
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleChange}
                    placeholder="مثال: 500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="maxBudget">الحد الأقصى للميزانية (جنيه)</label>
                  <FormInput
                    type="number"
                    id="maxBudget"
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    placeholder="مثال: 1500"
                    min="0"
                    required
                  />
                </div>
              </div>
              {profileAddress && (
                <div className="mb-4 flex items-center gap-4">
                  <button
                    type="button"
                    className="bg-bright-orange text-white font-semibold py-2 px-6 rounded-xl hover:bg-bright-orange/90 transition-all duration-300 shadow"
                    onClick={handleAutofillAddress}
                  >
                    استخدم العنوان المحفوظ
                  </button>
                  {showAutofillSuccess && <span className="text-green-600 font-semibold">تم تعبئة العنوان!</span>}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="government">المحافظة</label>
                  <FormInput
                    type="text"
                    id="government"
                    name="government"
                    value={formData.government}
                    onChange={handleChange}
                    placeholder="مثال: القاهرة، الجيزة، الإسكندرية"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="city">المدينة</label>
                  <FormInput
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="مثال: مدينة نصر، المعادي، الزمالك"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="street">الشارع</label>
                  <FormInput
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="مثال: شارع التحرير، شارع محمد فريد"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="apartmentNumber">رقم الشقة</label>
                  <FormInput
                    type="text"
                    id="apartmentNumber"
                    name="apartmentNumber"
                    value={formData.apartmentNumber}
                    onChange={handleChange}
                    placeholder="مثال: شقة 12، الدور 3"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="additionalInformation">معلومات إضافية</label>
                <FormTextarea
                  id="additionalInformation"
                  name="additionalInformation"
                  value={formData.additionalInformation}
                  onChange={handleChange}
                  placeholder="أي تفاصيل إضافية..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="preferredDateTime">التاريخ والوقت المفضل</label>
                <FormInput
                  type="datetime-local"
                  id="preferredDateTime"
                  name="preferredDateTime"
                  value={formData.preferredDateTime}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="deliveryTimeDays">مدة التسليم (أيام)</label>
                  <FormInput
                    type="number"
                    id="deliveryTimeDays"
                    name="deliveryTimeDays"
                    value={formData.deliveryTimeDays}
                    onChange={handleChange}
                    placeholder="مثال: 3"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="tags">الكلمات المفتاحية (افصل بينها بفاصلة)</label>
                  <FormInput
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="مثال: تنظيف, سباكة, كهرباء"
                  />
                </div>
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