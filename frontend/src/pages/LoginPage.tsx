import { useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';
import { User } from '../types';
import { FormInput } from '../components/ui';
import { validateEmail } from '../utils/validation';

// Field validation type
type FieldValidation = {
  email?: { isValid: boolean; message: string };
  password?: { isValid: boolean; message: string };
  general?: { isValid: boolean; message: string };
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldValidation>({});

  // Real-time validation for email
  const validateEmailField = useCallback((email: string) => {
    const validation = validateEmail(email);
    setFieldErrors(prev => ({
      ...prev,
      email: validation
    }));
  }, []);

  // Real-time validation for password
  const validatePasswordField = useCallback((password: string) => {
    const validation = password.trim() 
      ? { isValid: true, message: '' }
      : { isValid: false, message: 'كلمة المرور مطلوبة' };
    
    setFieldErrors(prev => ({
      ...prev,
      password: validation
    }));
  }, []);

  // Check if form has any errors
  const hasFormErrors = () => {
    return Object.values(fieldErrors).some(error => error && !error.isValid);
  };

  // Check if form is complete (all required fields filled)
  const isFormComplete = () => {
    return formData.email.trim() && formData.password.trim();
  };

  // Check if form is valid and ready for submission
  const isFormValid = () => {
    return isFormComplete() && !hasFormErrors();
  };

  // Helper function to get border color based on field status
  const getBorderColor = (fieldName: keyof typeof fieldErrors) => {
    const error = fieldErrors[fieldName];
    
    if (error && !error.isValid) {
      return 'border-red-500 focus:border-red-500';
    }
    
    // Check if field has value and is valid
    if (formData[fieldName as keyof typeof formData] && !error) {
      return 'border-green-500 focus:border-green-500';
    }
    
    return 'border-gray-300 focus:border-[#2D5D4F]';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear general error when user starts typing
    if (fieldErrors.general && !fieldErrors.general.isValid) {
      setFieldErrors(prev => ({ ...prev, general: { isValid: true, message: '' } }));
    }

    // Real-time validation based on field type
    if (name === 'email') {
      validateEmailField(value);
    } else if (name === 'password') {
      validatePasswordField(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user: User | null = await login(formData.email, formData.password);
    if (user) {
      const redirectTo = searchParams.get('redirect');
      if (user.roles.includes('admin') && redirectTo === '/admin') {
        navigate('/admin', { replace: true });
      } else if (user.roles.includes('admin')) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/categories', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4 font-cairo" dir="rtl">
      <div className="w-full max-w-md">
        <BaseCard className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#0e1b18] font-jakarta">Naafe'</h1>
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="email">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="youremail@example.com"
                  className={`w-full bg-gray-50 border-2 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:bg-white focus:outline-none transition-colors duration-200 ${getBorderColor('email')}`}
                  required
                  autoComplete="email"
                  aria-describedby="email-error"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="20" fill="none"/><path d="M4 4h12v12H4z" stroke="none"/><path d="M4 4l8 8m0 0l8-8"/></svg>
                </span>
                {fieldErrors.email?.message && <p className="text-red-600 text-sm text-right mt-1">{fieldErrors.email.message}</p>}
              </div>
            </div>
            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="password">
                كلمة المرور
              </label>
              <div className="relative">
                <FormInput
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full bg-gray-50 border-2 pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-500 focus:bg-white focus:outline-none transition-colors duration-200 ${getBorderColor('password')}`}
                  required
                  autoComplete="current-password"
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#2D5D4F] transition-colors focus:outline-none"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {fieldErrors.password?.message && <p className="text-red-600 text-sm text-right mt-1">{fieldErrors.password.message}</p>}
              </div>
            </div>
            {/* Error Message */}
            {error && <div className="text-red-600 text-sm text-right bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
            
            {/* Form Status Helper */}
            {!isFormComplete() && (
              <div className="text-amber-600 text-sm text-right bg-amber-50 p-3 rounded-lg border border-amber-200">
                يرجى ملء جميع الحقول المطلوبة
              </div>
            )}
            
            {isFormComplete() && hasFormErrors() && (
              <div className="text-red-600 text-sm text-right bg-red-50 p-3 rounded-lg border border-red-200">
                يرجى تصحيح الأخطاء قبل المتابعة
              </div>
            )}
            
            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="#"
                className="text-sm font-medium text-[#2D5D4F] hover:text-[#F5A623] transition-colors duration-200 focus:outline-none focus:underline"
              >
                هل نسيت كلمة المرور؟
              </Link>
            </div>
            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className={`rounded-xl transition-all duration-200 ${
                !isFormValid() 
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' 
                  : 'hover:bg-[#1a4a3f]'
              }`}
              disabled={!isFormValid()}
            >
              {!isFormComplete() 
                ? 'املأ جميع الحقول' 
                : hasFormErrors() 
                  ? 'صحح الأخطاء' 
                  : 'تسجيل الدخول'
              }
            </Button>
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>
            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-[#0e1b18]">
                ليس لديك حساب؟{' '}
                <Link
                  to="/register"
                  className="font-bold text-[#2D5D4F] hover:text-[#F5A623] transition-colors duration-200 focus:outline-none focus:underline"
                >
                  أنشئ حساب
                </Link>
              </span>
            </div>
          </form>
        </BaseCard>
      </div>
    </div>
  );
};

export default LoginPage; 