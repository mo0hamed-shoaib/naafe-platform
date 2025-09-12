import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Button from './ui/Button';
import BaseCard from './ui/BaseCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FormInput, FormTextarea } from './ui';
import UnifiedSelect from './ui/UnifiedSelect';
import { AIAssistant } from './ui';
import api from '../utils/api';
import { PricingGuidance } from './ui';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { EGYPT_GOVERNORATES, EGYPT_CITIES } from '../utils/constants';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import arEG from 'antd/locale/ar_EG';

interface RequestServiceFormData {
  requestTitle: string;
  category: string;
  requestDescription: string;
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
  images: string[]; // Array of image URLs
}

interface AddressFields {
  government: string;
  city: string;
  street: string;
  apartmentNumber: string;
  additionalInformation: string;
}

interface ValidationErrors {
  requestTitle?: string;
  category?: string;
  requestDescription?: string;
  minBudget?: string;
  maxBudget?: string;
  government?: string;
  city?: string;
  street?: string;
  apartmentNumber?: string;
  preferredDateTime?: string;
  deliveryTimeDays?: string;
}

const RequestServiceForm: React.FC = () => {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState<RequestServiceFormData>({
    requestTitle: '',
    category: '',
    requestDescription: '',
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
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [profileAddress, setProfileAddress] = useState<AddressFields | null>(null);
  const [showAutofillSuccess, setShowAutofillSuccess] = useState(false);
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [customCity, setCustomCity] = useState('');

  // Update city list when governorate changes
  const cityOptions = selectedGovernorate
    ? [...(EGYPT_CITIES[selectedGovernorate] || []), 'أخرى']
    : [];

  // Validation function
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Request Title validation
    if (!formData.requestTitle.trim()) {
      errors.requestTitle = 'عنوان الطلب مطلوب';
    } else if (formData.requestTitle.length < 10) {
      errors.requestTitle = 'عنوان الطلب يجب أن يكون 10 أحرف على الأقل';
    } else if (formData.requestTitle.length > 100) {
      errors.requestTitle = 'عنوان الطلب لا يمكن أن يتجاوز 100 حرف';
    }

    // Category validation
    if (!formData.category.trim()) {
      errors.category = 'الفئة مطلوبة';
    }

    // Request Description validation
    if (!formData.requestDescription.trim()) {
      errors.requestDescription = 'وصف الطلب مطلوب';
    } else if (formData.requestDescription.length < 20) {
      errors.requestDescription = 'وصف الطلب يجب أن يكون 20 حرف على الأقل';
    } else if (formData.requestDescription.length > 2000) {
      errors.requestDescription = 'وصف الطلب لا يمكن أن يتجاوز 2000 حرف';
    }

    // Budget validation
    if (!formData.minBudget.trim()) {
      errors.minBudget = 'الميزانية الأدنى مطلوبة';
    } else if (Number(formData.minBudget) < 0) {
      errors.minBudget = 'الميزانية الأدنى يجب أن تكون رقم موجب';
    }

    if (!formData.maxBudget.trim()) {
      errors.maxBudget = 'الميزانية الأقصى مطلوبة';
    } else if (Number(formData.maxBudget) < 0) {
      errors.maxBudget = 'الميزانية الأقصى يجب أن تكون رقم موجب';
    }

    if (formData.minBudget && formData.maxBudget && Number(formData.minBudget) > Number(formData.maxBudget)) {
      errors.maxBudget = 'الميزانية الأقصى يجب أن تكون أكبر من الميزانية الأدنى';
    }

    // Location validation
    if (!formData.government.trim()) {
      errors.government = 'المحافظة مطلوبة';
    }

    if (!formData.city.trim()) {
      errors.city = 'المدينة مطلوبة';
    }

    // Address validation
    if (!formData.street.trim()) {
      errors.street = 'الشارع مطلوب';
    }

    if (!formData.apartmentNumber.trim()) {
      errors.apartmentNumber = 'رقم الشقة مطلوب';
    }

    // Date validation
    if (!formData.preferredDateTime.trim()) {
      errors.preferredDateTime = 'التاريخ المفضل مطلوب';
    }

    // Delivery time validation
    if (!formData.deliveryTimeDays.trim()) {
      errors.deliveryTimeDays = 'مدة التسليم مطلوبة';
    } else if (Number(formData.deliveryTimeDays) < 1) {
      errors.deliveryTimeDays = 'مدة التسليم يجب أن تكون يوم واحد على الأقل';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    // Validate only this specific field when it's blurred
    validateField(name as keyof ValidationErrors);
  };

  const validateField = (fieldName: keyof ValidationErrors) => {
    const errors: ValidationErrors = {};
    
    // Validate only the specific field
    switch (fieldName) {
      case 'requestTitle':
        if (!formData.requestTitle.trim()) {
          errors.requestTitle = 'عنوان الطلب مطلوب';
        } else if (formData.requestTitle.length < 10) {
          errors.requestTitle = 'عنوان الطلب يجب أن يكون 10 أحرف على الأقل';
        } else if (formData.requestTitle.length > 100) {
          errors.requestTitle = 'عنوان الطلب لا يمكن أن يتجاوز 100 حرف';
        }
        break;
      case 'category':
        if (!formData.category.trim()) {
          errors.category = 'الفئة مطلوبة';
        }
        break;
      case 'requestDescription':
        if (!formData.requestDescription.trim()) {
          errors.requestDescription = 'وصف الطلب مطلوب';
        } else if (formData.requestDescription.length < 20) {
          errors.requestDescription = 'وصف الطلب يجب أن يكون 20 حرف على الأقل';
        } else if (formData.requestDescription.length > 2000) {
          errors.requestDescription = 'وصف الطلب لا يمكن أن يتجاوز 2000 حرف';
        }
        break;
      case 'minBudget':
        if (!formData.minBudget.trim()) {
          errors.minBudget = 'الميزانية الأدنى مطلوبة';
        } else if (Number(formData.minBudget) < 0) {
          errors.minBudget = 'الميزانية الأدنى يجب أن تكون رقم موجب';
        }
        break;
      case 'maxBudget':
        if (!formData.maxBudget.trim()) {
          errors.maxBudget = 'الميزانية الأقصى مطلوبة';
        } else if (Number(formData.maxBudget) < 0) {
          errors.maxBudget = 'الميزانية الأقصى يجب أن تكون رقم موجب';
        }
        if (formData.minBudget && formData.maxBudget && Number(formData.minBudget) > Number(formData.maxBudget)) {
          errors.maxBudget = 'الميزانية الأقصى يجب أن تكون أكبر من الميزانية الأدنى';
        }
        break;
      case 'government':
        if (!formData.government.trim()) {
          errors.government = 'المحافظة مطلوبة';
        }
        break;
      case 'city':
        if (!formData.city.trim()) {
          errors.city = 'المدينة مطلوبة';
        }
        break;
      case 'street':
        if (!formData.street.trim()) {
          errors.street = 'الشارع مطلوب';
        }
        break;
      case 'apartmentNumber':
        if (!formData.apartmentNumber.trim()) {
          errors.apartmentNumber = 'رقم الشقة مطلوب';
        }
        break;
      case 'preferredDateTime':
        if (!formData.preferredDateTime.trim()) {
          errors.preferredDateTime = 'التاريخ المفضل مطلوب';
        }
        break;
      case 'deliveryTimeDays':
        if (!formData.deliveryTimeDays.trim()) {
          errors.deliveryTimeDays = 'مدة التسليم مطلوبة';
        } else if (Number(formData.deliveryTimeDays) < 1) {
          errors.deliveryTimeDays = 'مدة التسليم يجب أن تكون يوم واحد على الأقل';
        }
        break;
    }
    
    // Update only the specific field error
    setValidationErrors(prev => ({ ...prev, [fieldName]: errors[fieldName] }));
  };

  // Helper to decide if error should be shown
  const shouldShowError = (field: keyof ValidationErrors) => {
    return (touchedFields[field] || submitAttempted) && validationErrors[field];
  };

  // Helper to check if form is valid for submit button
  const isFormValid = (): boolean => {
    // Check if all required fields are filled
    const hasRequiredFields = 
      formData.requestTitle.trim() &&
      formData.category.trim() &&
      formData.requestDescription.trim() &&
      formData.minBudget.trim() &&
      formData.maxBudget.trim() &&
      formData.government.trim() &&
      formData.city.trim() &&
      formData.street.trim() &&
      formData.apartmentNumber.trim() &&
      formData.preferredDateTime.trim() &&
      formData.deliveryTimeDays.trim();

    // Check if there are no validation errors (filter out undefined values)
    const hasNoErrors = Object.values(validationErrors).every(error => !error || error === undefined);

    // Debug logging
    console.log('🔍 Form validation check:', {
      hasRequiredFields,
      hasNoErrors,
      validationErrors: validationErrors, // Show actual errors, not just keys
      validationErrorsKeys: Object.keys(validationErrors),
      formData: {
        requestTitle: formData.requestTitle,
        category: formData.category,
        requestDescription: formData.requestDescription,
        minBudget: formData.minBudget,
        maxBudget: formData.maxBudget,
        government: formData.government,
        city: formData.city,
        street: formData.street,
        apartmentNumber: formData.apartmentNumber,
        preferredDateTime: formData.preferredDateTime,
        deliveryTimeDays: formData.deliveryTimeDays,
      }
    });
    
    // Extra debug for validation errors
    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ VALIDATION ERRORS:', validationErrors);
      console.log('❌ ERROR FIELDS:', Object.keys(validationErrors));
    }

    return hasRequiredFields && hasNoErrors;
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (formData.images.length + files.length > 5) {
      alert('يمكنك رفع 5 صور كحد أقصى');
      return;
    }

    setUploadingImages(true);

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert('يرجى رفع صور فقط');
        continue;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`الملف ${file.name} كبير جداً. الحد الأقصى 5 ميجابايت`);
        continue;
      }

      try {
        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
        if (!imgbbApiKey) {
          alert('مفتاح رفع الصور غير متوفر. الرجاء المحاولة لاحقاً.');
          continue;
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, data.data.url]
          }));
          setImageUploadProgress(prev => ({ ...prev, [file.name]: true }));
        } else {
          alert(`فشل رفع الصورة ${file.name}`);
        }
      } catch (error) {
        alert(`خطأ في رفع الصورة ${file.name}`);
      }
    }

    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    setCategoriesLoading(true);
    api.categories.getAll()
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

  useEffect(() => {
    api.user.getMe(accessToken)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.user?.profile?.location) {
          setProfileAddress(data.data.user.profile.location);
        }
      });
  }, [accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is changed
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    // Mark all fields as touched ON SUBMIT ONLY
    setTouchedFields({
      requestTitle: true,
      category: true,
      requestDescription: true,
      minBudget: true,
      maxBudget: true,
      government: true,
      city: true,
      street: true,
      apartmentNumber: true,
      preferredDateTime: true,
      deliveryTimeDays: true,
    });
    
    if (!validateForm()) {
      alert('يوجد أخطاء في النموذج. يرجى التأكد من صحة البيانات.');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        title: formData.requestTitle,
        description: formData.requestDescription,
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
        deadline: formData.preferredDateTime ? new Date(formData.preferredDateTime) : undefined,
        deliveryTimeDays: Number(formData.deliveryTimeDays),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        attachments: formData.images.map(url => ({
          url,
          filename: url.split('/').pop() || 'image.jpg',
          fileType: 'image/jpeg',
          fileSize: 0
        })),
      };
      const res = await api.requests.create(payload, accessToken);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to post request');
      }
      setSuccess(true);
      setTimeout(() => navigate('/search/service-requests'), 1500);
    } catch (err) {
      setLoading(false);
      alert(err instanceof Error ? err.message : 'Failed to post request');
    }
  };

  // Add this handler to map AI fields to form fields
  const handleAISuggestion = (field: string, value: string) => {
    if (field === 'title') {
      setFormData(prev => ({ ...prev, requestTitle: value }));
    } else if (field === 'description') {
      // Ensure AI suggestions don't exceed 2000 characters
      const truncatedValue = value.length > 2000 ? value.substring(0, 2000) : value;
      setFormData(prev => ({ ...prev, requestDescription: truncatedValue }));
    } else if (field === 'keywords') {
      setFormData(prev => ({ ...prev, tags: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Add this handler for pricing guidance
  const handlePricingApply = (min: number, max: number) => {
    setFormData(prev => ({
      ...prev,
      minBudget: min.toString(),
      maxBudget: max.toString()
    }));
  };

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
    // Set dropdowns for UnifiedSelect
    const govId = EGYPT_GOVERNORATES.find(g => g.name === profileAddress.government)?.id || '';
    setSelectedGovernorate(govId);
    setSelectedCity(profileAddress.city || '');
    setCustomCity(profileAddress.city && !EGYPT_CITIES[govId]?.includes(profileAddress.city) ? profileAddress.city : '');
    setShowAutofillSuccess(true);
    setTimeout(() => setShowAutofillSuccess(false), 2000);
  };

  // Helper for 12-hour Arabic time format
  const formatArabicTime = (value: dayjs.Dayjs | null): string => {
    if (!value) return '';
    const hour = value.hour();
    const minute = value.minute().toString().padStart(2, '0');
    const isAM = hour < 12;
    let displayHour = hour % 12;
    if (displayHour === 0) displayHour = 12;
    return `${displayHour}:${minute} ${isAM ? 'ص' : 'م'}`;
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex flex-col font-cairo" dir="rtl">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* AI Form Section */}
          <div>
            <BaseCard className="p-6 md:sticky md:top-24">
              <h2 className="text-xl font-bold text-deep-teal mb-4 flex items-center gap-2">
                <span className="text-[#F5A623]">✨</span>
                أدوات الذكاء الاصطناعي
              </h2>
              <AIAssistant
                formType="request"
                category={formData.category}
                currentFields={formData as unknown as Record<string, unknown>}
                onSuggestionApply={handleAISuggestion}
                className="mb-4"
              />
              <PricingGuidance
                formType="request"
                category={formData.category}
                location={formData.government}
                userBudget={formData.minBudget && formData.maxBudget ? {
                  min: Number(formData.minBudget),
                  max: Number(formData.maxBudget)
                } : null}
                onPricingApply={handlePricingApply}
              />
            </BaseCard>
          </div>

          {/* Main Form Section */}
          <div>
            <BaseCard className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
              <h1 className="text-3xl font-extrabold text-[#0e1b18] text-center mb-8">طلب خدمة</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="requestTitle">عنوان الطلب</label>
                    <FormInput
                      type="text"
                      id="requestTitle"
                      name="requestTitle"
                      value={formData.requestTitle}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="عنوان الطلب"
                      required
                      size="md"
                      className={shouldShowError('requestTitle') ? 'border-red-500' : ''}
                    />
                    {shouldShowError('requestTitle') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.requestTitle}</p>}
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
                      size="md"
                      className={shouldShowError('category') ? 'border-red-500' : ''}
                    />
                    {shouldShowError('category') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.category}</p>}
                    {categoriesError && <div className="text-red-600 text-sm text-right bg-red-50 p-2 rounded-lg border border-red-200 mt-2">{categoriesError}</div>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="requestDescription">
                    وصف الطلب
                    <span className="text-gray-500 text-xs mr-2">
                      ({formData.requestDescription.length}/2000)
                    </span>
                  </label>
                  <FormTextarea
                    id="requestDescription"
                    name="requestDescription"
                    value={formData.requestDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="وصف مفصل للخدمة المطلوبة..."
                    required
                    size="md"
                    maxLength={2000}
                    className={shouldShowError('requestDescription') ? 'border-red-500' : ''}
                  />
                  {shouldShowError('requestDescription') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.requestDescription}</p>}
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
                      onBlur={handleBlur}
                      placeholder="مثال: 50"
                      min="0"
                      required
                      size="md"
                      className={shouldShowError('minBudget') ? 'border-red-500' : ''}
                    />
                    {shouldShowError('minBudget') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.minBudget}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="maxBudget">الحد الأقصى للميزانية (جنيه)</label>
                    <FormInput
                      type="number"
                      id="maxBudget"
                      name="maxBudget"
                      value={formData.maxBudget}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="مثال: 200"
                      min="0"
                      required
                      size="md"
                      className={shouldShowError('maxBudget') ? 'border-red-500' : ''}
                    />
                    {shouldShowError('maxBudget') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.maxBudget}</p>}
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
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2">المحافظة</label>
                    <UnifiedSelect
                      value={selectedGovernorate}
                      onChange={val => {
                        setSelectedGovernorate(val);
                        setSelectedCity('');
                        setCustomCity('');
                        setFormData(prev => ({ ...prev, government: EGYPT_GOVERNORATES.find(g => g.id === val)?.name || '' }));
                      }}
                      options={EGYPT_GOVERNORATES.map(g => ({ value: g.id, label: g.name }))}
                      placeholder="اختر المحافظة"
                      isSearchable
                      searchPlaceholder="ابحث عن محافظة..."
                      required
                      size="md"
                      className={shouldShowError('government') ? 'border-red-500' : ''}
                    />
                    {shouldShowError('government') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.government}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2">المدينة</label>
                    <UnifiedSelect
                      value={selectedCity}
                      onChange={val => {
                        setSelectedCity(val);
                        setCustomCity('');
                        setFormData(prev => ({ ...prev, city: val === 'أخرى' ? '' : val }));
                      }}
                      options={cityOptions.map(city => ({ value: city, label: city }))}
                      placeholder="اختر المدينة"
                      isSearchable
                      searchPlaceholder="ابحث عن مدينة..."
                      required
                      size="md"
                      disabled={!selectedGovernorate}
                      className={shouldShowError('city') ? 'border-red-500' : ''}
                    />
                    {shouldShowError('city') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.city}</p>}
                    {selectedCity === 'أخرى' && (
                      <FormInput
                        type="text"
                        value={customCity}
                        onChange={e => {
                          setCustomCity(e.target.value);
                          setFormData(prev => ({ ...prev, city: e.target.value }));
                        }}
                        onBlur={handleBlur}
                        placeholder="أدخل اسم المدينة"
                        size="md"
                        className={`mt-2 ${shouldShowError('city') ? 'border-red-500' : ''}`}
                        required
                      />
                    )}
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
                      onBlur={handleBlur}
                      placeholder="مثال: شارع التحرير، شارع محمد فريد"
                      required
                      size="md"
                      className={shouldShowError('street') ? 'border-red-500' : ''}
                    />
                    {shouldShowError('street') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.street}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="apartmentNumber">رقم الشقة</label>
                    <FormInput
                      type="text"
                      id="apartmentNumber"
                      name="apartmentNumber"
                      value={formData.apartmentNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="مثال: شقة 12، الدور 3"
                      size="md"
                      className={shouldShowError('apartmentNumber') ? 'border-red-500' : ''}
                    />
                    {shouldShowError('apartmentNumber') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.apartmentNumber}</p>}
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
                      size="md"
                    />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="preferredDateTime">التاريخ والوقت المفضل</label>
                  <ConfigProvider locale={arEG}>
                    <DatePicker
                      showTime={{
                        use12Hours: true,
                        showSecond: false,
                        format: formatArabicTime,
                        locale: {
                          ...arEG.TimePicker,
                          meridiem: (hour: number) => (hour < 12 ? 'ص' : 'م')
                        }
                      }}
                      format="YYYY-MM-DD hh:mm A"
                      value={formData.preferredDateTime ? dayjs(formData.preferredDateTime) : null}
                      onChange={val => setFormData(prev => ({
                        ...prev,
                        preferredDateTime: val ? val.toISOString() : ''
                      }))}
                      className="w-full custom-timepicker-placeholder bg-white border-2 border-gray-300 rounded-lg py-2 pr-3 pl-3 focus:ring-2 focus:ring-accent focus:border-accent text-right text-[#0e1b18]"
                      placeholder="اختر التاريخ والوقت"
                      style={{ direction: 'rtl' }}
                      classNames={{ popup: { root: 'rtl custom-datepicker-dropdown' } }}
                      disabledDate={current => current && current < dayjs().startOf('day')}
                    />
                    {shouldShowError('preferredDateTime') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.preferredDateTime}</p>}
                  </ConfigProvider>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="deliveryTimeDays">مدة التنفيذ (أيام)</label>
                    <FormInput
                      type="number"
                      id="deliveryTimeDays"
                      name="deliveryTimeDays"
                      value={formData.deliveryTimeDays}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="مثال: 3"
                      min="1"
                      required
                      size="md"
                      className={shouldShowError('deliveryTimeDays') ? 'border-red-500' : ''}
                    />
                    {shouldShowError('deliveryTimeDays') && <p className="text-red-600 text-sm text-right mt-1">{validationErrors.deliveryTimeDays}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="tags">العلامات (اختياري)</label>
                    <FormInput
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="مثال: تنظيف، منزل، عاجل"
                      size="md"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2">
                    صور توضيحية للخدمة (اختياري)
                  </label>
                  <div className="border-2 border-dashed border-deep-teal/30 rounded-lg p-6 text-center hover:border-deep-teal/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImages || formData.images.length >= 5}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-deep-teal mx-auto mb-2" />
                      <p className="text-deep-teal font-medium mb-1">
                        {uploadingImages ? 'جاري رفع الصور...' : 'اضغط لرفع الصور'}
                      </p>
                      <p className="text-text-secondary text-sm">
                        يمكنك رفع حتى 5 صور (JPG, PNG) - الحد الأقصى 5 ميجابايت لكل صورة
                      </p>
                    </label>
                  </div>

                  {/* Uploaded Images Preview */}
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-deep-teal mb-3">الصور المرفوعة:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {formData.images.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`صورة ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-deep-teal/20"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="حذف الصورة"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {Object.keys(imageUploadProgress).length > 0 && (
                    <div className="mt-3">
                      {Object.entries(imageUploadProgress).map(([fileName, isUploading]) => (
                        <div key={fileName} className="flex items-center gap-2 text-sm text-deep-teal">
                          <ImageIcon className="w-4 h-4" />
                          <span>{fileName}</span>
                          {isUploading && <span>جاري الرفع...</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {success && <div className="text-green-600 text-sm text-right bg-green-50 p-3 rounded-lg border border-green-200">تم إرسال الطلب بنجاح!</div>}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  className="rounded-xl"
                  disabled={!isFormValid()}
                >
                  إرسال الطلب
                </Button>
              </form>
            </BaseCard>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestServiceForm; 