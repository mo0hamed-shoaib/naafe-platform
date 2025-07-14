import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login(formData.email, formData.password);
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/categories');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4 font-cairo" dir="rtl">
      <div className="w-full max-w-md">
        <BaseCard className="bg-[#FDF8F0] rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#0e1b18] font-jakarta">Naafe'</h1>
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-1" htmlFor="email">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="youremail@example.com"
                  className="input input-bordered w-full bg-white pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-[#50958a] focus:border-[#2D5D4F] focus:ring-2 focus:ring-[#2D5D4F]"
                  required
                  autoComplete="email"
                  aria-describedby="email-error"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#50958a]">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="20" fill="none"/><path d="M4 4h12v12H4z" stroke="none"/><path d="M4 4l8 8m0 0l8-8"/></svg>
                </span>
              </div>
            </div>
            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-1" htmlFor="password">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input input-bordered w-full bg-white pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder-[#50958a] focus:border-[#2D5D4F] focus:ring-2 focus:ring-[#2D5D4F]"
                  required
                  autoComplete="current-password"
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#50958a] hover:text-[#2D5D4F] transition-colors focus:outline-none"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {/* Error Message */}
            {error && <div className="text-error text-sm text-right">{error}</div>}
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
              className="rounded-xl"
            >
              تسجيل الدخول
            </Button>
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2D5D4F]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#FDF8F0] text-[#50958a]">أو</span>
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