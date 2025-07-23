import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/ui/BackButton';
import BaseCard from '../components/ui/BaseCard';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import FormTextarea from '../components/ui/FormTextarea';
import UnifiedSelect from '../components/ui/UnifiedSelect';
import { CheckCircle } from 'lucide-react';

interface Provider {
  _id: string;
  name: { first: string; last: string } | string;
  email: string;
  avatarUrl?: string;
  profile?: {
    bio?: string;
    location?: {
      address?: string;
      government?: string;
      city?: string;
    };
  };
  isVerified: boolean;
  isPremium: boolean;
  skills?: string[];
  providerProfile?: {
    rating: number;
    totalJobsCompleted: number;
  };
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  budget: {
    min: string;
    max: string;
  };
  deadline: string;
  location: {
    government: string;
    city: string;
    address: string;
  };
  urgency: 'low' | 'medium' | 'high';
  requirements: string[];
  preferredContactMethod: 'chat' | 'phone' | 'email';
}

const HireProviderPage: React.FC = () => {
  const { id: providerId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    budget: { min: '', max: '' },
    deadline: '',
    location: { government: '', city: '', address: '' },
    urgency: 'medium',
    requirements: [],
    preferredContactMethod: 'chat'
  });

  const [newRequirement, setNewRequirement] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = accessToken || localStorage.getItem('accessToken') || '';
        
        // Fetch provider
        const providerRes = await fetch(`/api/users/${providerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const providerData = await providerRes.json();
        if (providerData.success) {
          setProvider(providerData.data.user);
        }
        
        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data.categories);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('فشل في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId, user, accessToken, navigate]);

  const getProviderName = (provider: Provider): string => {
    if (typeof provider.name === 'string') return provider.name;
    return `${provider.name?.first || ''} ${provider.name?.last || ''}`.trim() || 'مقدم خدمة';
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('يرجى إدخال عنوان المشروع');
      return false;
    }
    if (!formData.description.trim()) {
      setError('يرجى إدخال وصف المشروع');
      return false;
    }
    if (!formData.category) {
      setError('يرجى اختيار فئة الخدمة');
      return false;
    }
    if (!formData.budget.min || !formData.budget.max) {
      setError('يرجى إدخال الميزانية المطلوبة');
      return false;
    }
    if (parseInt(formData.budget.min) > parseInt(formData.budget.max)) {
      setError('الحد الأدنى للميزانية لا يمكن أن يكون أكبر من الحد الأقصى');
      return false;
    }
    if (!formData.deadline) {
      setError('يرجى تحديد الموعد النهائي');
      return false;
    }
    const deadlineDate = new Date(formData.deadline);
    if (deadlineDate <= new Date()) {
      setError('الموعد النهائي يجب أن يكون في المستقبل');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const token = accessToken || localStorage.getItem('accessToken') || '';
      
      const jobRequestData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: {
          min: parseInt(formData.budget.min),
          max: parseInt(formData.budget.max),
          currency: 'EGP'
        },
        deadline: formData.deadline,
        location: {
          address: formData.location.address,
          government: formData.location.government,
          city: formData.location.city
        },
        urgency: formData.urgency,
        requiredSkills: formData.requirements,
        preferredContactMethod: formData.preferredContactMethod,
        preferredProvider: providerId, // Add this field to indicate this is a direct hire
        directHire: true // Flag to indicate this is a direct hire request
      };

      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobRequestData)
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || 'فشل في إنشاء طلب التوظيف');
      }

      // Redirect to the created job request
      navigate(`/request/${data.data._id}`, {
        state: { message: 'تم إنشاء طلب التوظيف بنجاح! سيتم إشعار مقدم الخدمة.' }
      });
      
    } catch (err) {
      console.error('Error submitting hire request:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <Header />
        <div className="pt-20 flex justify-center items-center h-64">
          <div className="text-deep-teal">جاري التحميل...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-warm-cream">
        <Header />
        <div className="pt-20 container mx-auto px-4 py-8">
          <BackButton to={`/provider/${providerId}`} className="mb-4" />
          <BaseCard className="text-center p-8">
            <h2 className="text-xl font-bold text-red-600 mb-2">خطأ</h2>
            <p className="text-text-secondary mb-4">لم يتم العثور على مقدم الخدمة</p>
            <Button onClick={() => navigate('/search/providers')}>العودة للبحث</Button>
          </BaseCard>
        </div>
        <Footer />
      </div>
    );
  }

  const governorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'القليوبية',
    'كفر الشيخ', 'الغربية', 'المنوفية', 'البحيرة', 'الإسماعيلية',
    'بورسعيد', 'السويس', 'المنيا', 'بني سويف', 'الفيوم', 'أسيوط',
    'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد',
    'مطروح', 'شمال سيناء', 'جنوب سيناء'
  ];

  const urgencyOptions = [
    { value: 'low', label: 'عادي' },
    { value: 'medium', label: 'متوسط الأولوية' },
    { value: 'high', label: 'عاجل' }
  ];

  const contactOptions = [
    { value: 'chat', label: 'الدردشة في التطبيق' },
    { value: 'phone', label: 'المكالمات الهاتفية' },
    { value: 'email', label: 'البريد الإلكتروني' }
  ];

  return (
    <div className="min-h-screen bg-warm-cream">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <BackButton to={`/provider/${providerId}`} className="mb-6" />
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-deep-teal mb-4">توظيف مباشر</h1>
            <p className="text-text-secondary text-lg">
              إنشاء مشروع مخصص لـ <span className="font-semibold text-deep-teal">{getProviderName(provider)}</span>
            </p>
          </div>

          {/* Provider Info Card */}
          <BaseCard className="mb-8">
            <div className="flex items-center gap-4 p-4">
              <img
                src={provider.avatarUrl || '/default-avatar.png'}
                alt={getProviderName(provider)}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-deep-teal">{getProviderName(provider)}</h3>
                {provider.profile?.bio && (
                  <p className="text-text-secondary text-sm mt-1">{provider.profile.bio}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                  {provider.isVerified && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>موثق</span>
                    </div>
                  )}
                  {provider.providerProfile && (
                    <span>{provider.providerProfile.totalJobsCompleted} مهمة مكتملة</span>
                  )}
                </div>
              </div>
            </div>
          </BaseCard>

          {/* Form */}
          <BaseCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Details */}
              <div>
                <h2 className="text-xl font-bold text-deep-teal mb-4">تفاصيل المشروع</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormInput
                    label="عنوان المشروع"
                    placeholder="مثل: تصميم موقع إلكتروني للشركة"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                  
                  <UnifiedSelect
                    label="فئة الخدمة"
                    value={formData.category}
                    onChange={(value) => handleInputChange('category', value)}
                    options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                    placeholder="اختر فئة الخدمة"
                    required
                  />
                </div>

                <FormTextarea
                  label="وصف المشروع"
                  placeholder="اشرح تفاصيل المشروع والمهام المطلوبة..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Budget */}
              <div>
                <h3 className="text-lg font-semibold text-deep-teal mb-3">الميزانية</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="الحد الأدنى (جنيه)"
                    type="number"
                    placeholder="100"
                    value={formData.budget.min}
                    onChange={(e) => handleInputChange('budget.min', e.target.value)}
                    min="1"
                    required
                  />
                  <FormInput
                    label="الحد الأقصى (جنيه)"
                    type="number"
                    placeholder="500"
                    value={formData.budget.max}
                    onChange={(e) => handleInputChange('budget.max', e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Timeline & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="الموعد النهائي"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                
                <UnifiedSelect
                  label="أولوية المشروع"
                  value={formData.urgency}
                  onChange={(value) => handleInputChange('urgency', value)}
                  options={urgencyOptions}
                  placeholder="اختر الأولوية"
                />
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-deep-teal mb-3">الموقع</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UnifiedSelect
                    label="المحافظة"
                    value={formData.location.government}
                    onChange={(value) => handleInputChange('location.government', value)}
                    options={governorates.map(gov => ({ value: gov, label: gov }))}
                    placeholder="اختر المحافظة"
                  />
                  
                  <FormInput
                    label="المدينة"
                    placeholder="مثل: مدينة نصر، المعادي..."
                    value={formData.location.city}
                    onChange={(e) => handleInputChange('location.city', e.target.value)}
                  />
                </div>
                
                <FormInput
                  label="العنوان التفصيلي (اختياري)"
                  placeholder="الشارع، رقم المبنى..."
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  className="mt-4"
                />
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-deep-teal mb-3">المتطلبات الخاصة</h3>
                
                <div className="flex gap-2 mb-3">
                  <FormInput
                    placeholder="أضف متطلب جديد..."
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddRequirement}
                    disabled={!newRequirement.trim()}
                  >
                    إضافة
                  </Button>
                </div>
                
                {formData.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="bg-soft-teal/20 text-deep-teal px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {req}
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(index)}
                          className="text-deep-teal hover:text-red-600 font-bold text-lg leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Preference */}
              <UnifiedSelect
                label="طريقة التواصل المفضلة"
                value={formData.preferredContactMethod}
                onChange={(value) => handleInputChange('preferredContactMethod', value)}
                options={contactOptions}
                placeholder="اختر طريقة التواصل"
              />

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/provider/${providerId}`)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? 'جاري الإرسال...' : 'إرسال طلب التوظيف'}
                </Button>
              </div>
            </form>
          </BaseCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HireProviderPage; 