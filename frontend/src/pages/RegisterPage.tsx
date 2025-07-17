import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';
import { FormInput } from "../components/ui";
import ProfileBuilder from '../components/onboarding/ProfileBuilder';
import OnboardingSlider from '../components/onboarding/OnboardingSlider';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

type OnboardingStep = 'register' | 'profile' | 'onboarding' | 'complete';
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('register');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      // Show error via context error
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      // Show error via context error
      return;
    }
    const payload = {
      email: formData.email,
      password: formData.password,
      name: { first: formData.firstName, last: formData.lastName },
      phone: formData.phoneNumber,
      role: 'seeker' as const,
      roles: ['seeker' as const],
    };
    const success = await register(payload);
    if (success) {
      setOnboardingStep('profile');
    }
  };

  const handleProfileComplete = () => {
    setOnboardingStep('onboarding');
  };

  const handleProfileSkip = () => {
    setOnboardingStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    setOnboardingStep('complete');
      navigate('/', { replace: true });
  };

  // Show onboarding components after successful registration
  if (onboardingStep === 'profile') {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4 font-cairo" dir="rtl">
        <ProfileBuilder
          initialValues={{
            government: '',
            city: '',
            street: '',
            apartmentNumber: '',
            additionalInformation: ''
          }}
          onComplete={handleProfileComplete}
          onSkip={handleProfileSkip}
        />
      </div>
    );
  }

  if (onboardingStep === 'onboarding') {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4 font-cairo" dir="rtl">
        <OnboardingSlider onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4 font-cairo" dir="rtl">
      <div className="w-full max-w-md">
        <BaseCard className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#0e1b18] font-jakarta">Naafe'</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="firstName">الاسم الأول</label>
                <FormInput
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="الاسم الأول"
                  className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="lastName">اسم العائلة</label>
                <FormInput
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="اسم العائلة"
                  className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="email">البريد الإلكتروني</label>
              <div className="relative">
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="youremail@example.com"
                  className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="20" fill="none"/><path d="M4 4h12v12H4z" stroke="none"/><path d="M4 4l8 8m0 0l8-8"/></svg>
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="phoneNumber">رقم الهاتف</label>
              <div className="relative">
                <FormInput
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+20 1XX XXX XXXX"
                  className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><rect width="20" height="20" fill="none"/><path d="M4 4h12v12H4z" stroke="none"/><path d="M4 4l8 8m0 0l8-8"/></svg>
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="password">كلمة المرور</label>
                <FormInput
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                <FormInput
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-gray-300 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:border-[#2D5D4F] focus:bg-white focus:outline-none transition-colors duration-200"
                  required
                />
              </div>
            </div>
            {error && <div className="text-red-600 text-sm text-right bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="rounded-xl"
            >
              إنشاء حساب
            </Button>
            <div className="text-center">
              <span className="text-sm text-[#0e1b18]">
                لديك حساب بالفعل؟{' '}
                <Link
                  to="/login"
                  className="font-bold text-[#2D5D4F] hover:text-[#F5A623] transition-colors duration-200 focus:outline-none focus:underline"
                >
                  تسجيل الدخول
                </Link>
              </span>
            </div>
          </form>
        </BaseCard>
      </div>
    </div>
  );
};

export default RegisterPage; 