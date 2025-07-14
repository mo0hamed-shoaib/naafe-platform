import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  role: '',
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login({
        id: 'demo',
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        avatar: '',
      });
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4 font-cairo" dir="rtl">
      <div className="w-full max-w-md">
        <BaseCard className="bg-[#FDF8F0] rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#0e1b18] font-jakarta">Naafe'</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-1" htmlFor="firstName">الاسم الأول</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="الاسم الأول"
                  className="input input-bordered w-full bg-white pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder:[#50958a] focus:border-[#2D5D4F] focus:ring-2 focus:ring-[#2D5D4F]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-1" htmlFor="lastName">اسم العائلة</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="اسم العائلة"
                  className="input input-bordered w-full bg-white pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder:[#50958a] focus:border-[#2D5D4F] focus:ring-2 focus:ring-[#2D5D4F]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-1" htmlFor="email">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="youremail@example.com"
                  className="input input-bordered w-full bg-white pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder:[#50958a] focus:border-[#2D5D4F] focus:ring-2 focus:ring-[#2D5D4F]"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D5D4F]">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="20" fill="none"/><path d="M4 4h12v12H4z" stroke="none"/><path d="M4 4l8 8m0 0l8-8"/></svg>
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-1" htmlFor="phoneNumber">رقم الهاتف</label>
              <div className="relative">
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+20 1XX XXX XXXX"
                  className="input input-bordered w-full bg-white pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder:[#50958a] focus:border-[#2D5D4F] focus:ring-2 focus:ring-[#2D5D4F]"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D5D4F]">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><rect width="20" height="20" fill="none"/><path d="M4 4h12v12H4z" stroke="none"/><path d="M4 4l8 8m0 0l8-8"/></svg>
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-1" htmlFor="password">كلمة المرور</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input input-bordered w-full bg-white pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder:[#50958a] focus:border-[#2D5D4F] focus:ring-2 focus:ring-[#2D5D4F]"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D5D4F]"></span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-1" htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input input-bordered w-full bg-white pr-4 pl-12 py-3 rounded-xl text-[#0e1b18] text-right placeholder:[#50958a] focus:border-[#2D5D4F] focus:ring-2 focus:ring-[#2D5D4F]"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D5D4F]"></span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-1" htmlFor="role">الدور</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="select select-bordered w-full bg-white px-4 py-3 rounded-xl text-[#0e1b18] text-right focus:border-[#2D5D4F] focus:ring-2 focus:ring-[#2D5D4F]"
                required
              >
                <option value="">اختر الدور</option>
                <option value="seeker">باحث عن خدمة</option>
                <option value="provider">مقدم خدمة</option>
              </select>
            </div>
            {error && <div className="text-error text-sm text-right">{error}</div>}
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