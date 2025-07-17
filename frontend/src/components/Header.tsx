import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import UserDropdown from './ui/UserDropdown';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../admin/components/UI/Modal';
import { useRef } from 'react';
import { FormInput, FormTextarea } from './ui';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

const Header = ({ onSearch, searchValue = '' }: HeaderProps) => {
  const { user, logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');
  const [upgradeSuccess, setUpgradeSuccess] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [comment, setComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: check if user is provider
  const isProvider = user && user.roles.includes('provider');
  // Helper: check if user has a pending upgrade request (optional, can be improved)
  // For now, just disable after submit

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      }
      setShowMobileSearch(false);
    }
  };

  const handleMobileSearchClick = () => {
    setShowMobileSearch(!showMobileSearch);
    setShowMobileMenu(false);
  };

  const handleMobileMenuClick = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowMobileSearch(false);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setShowMobileSearch(false);
  };

  const navigationItems = [
    { label: 'الخدمات', href: '/services' },
    { label: 'للأعمال', href: '/business' },
    { label: 'استكشف', href: '/search' },
  ];

  // Upgrade request submit handler
  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradeLoading(true);
    setUpgradeError('');
    setUpgradeSuccess('');
    try {
      const formData = new FormData();
      attachments.forEach((file) => formData.append('attachments', file));
      formData.append('comment', comment);
      const res = await fetch('/api/admin/upgrade-requests', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken || localStorage.getItem('accessToken')}` },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'فشل إرسال الطلب');
      setUpgradeSuccess('تم إرسال طلب الترقية بنجاح! سيتم مراجعته من قبل الإدارة.');
      setAttachments([]);
      setComment('');
      setShowUpgradeModal(false);
    } catch (err: any) {
      setUpgradeError(err.message || 'حدث خطأ أثناء إرسال الطلب');
    }
    setUpgradeLoading(false);
  };

  // File input change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 3) {
      setUpgradeError('يمكنك رفع 3 ملفات كحد أقصى');
      return;
    }
    setAttachments((prev) => [...prev, ...files].slice(0, 3));
  };
  const handleRemoveFile = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-warm-cream/80 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-20">
            {/* Right Section - Logo and Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                aria-label="تبديل القائمة"
                onClick={handleMobileMenuClick}
              >
                {showMobileMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              
              {/* Logo */}
              <Link 
                to="/" 
                className="flex items-center gap-2 text-xl font-bold text-deep-teal hover:text-deep-teal/90 transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-bright-orange/10 focus:outline-none focus:ring-2 focus:ring-deep-teal/50"
                onClick={closeMobileMenu}
              >
                <img 
                  src="/images/logo-no-bg.png" 
                  alt="شعار نافع" 
                  className="h-10 w-auto"
                />
                <span>نافع</span>
              </Link>
            </div>

            {/* Center Section - Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <ul className="flex items-center gap-6">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <Link 
                      to={item.href} 
                      className="font-medium text-text-primary hover:text-deep-teal/90 transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-bright-orange/10 focus:outline-none focus:ring-2 focus:ring-deep-teal/50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  {user && !isProvider ? (
                    <button
                      type="button"
                      className="font-medium text-text-primary hover:text-deep-teal/90 transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-bright-orange/10 focus:outline-none focus:ring-2 focus:ring-deep-teal/50"
                      onClick={() => setShowUpgradeModal(true)}
                      disabled={upgradeLoading}
                    >
                      كن مقدم خدمات
                    </button>
                  ) : (
                    <Link 
                      to="/post-service"
                      className="font-medium text-text-primary hover:text-deep-teal/90 transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-bright-orange/10 focus:outline-none focus:ring-2 focus:ring-deep-teal/50"
                    >
                      نشر خدمة
                    </Link>
                  )}
                </li>
                <li>
                  <Link 
                    to="/request-service"
                    className="font-medium text-text-primary hover:text-deep-teal/90 transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-bright-orange/10 focus:outline-none focus:ring-2 focus:ring-deep-teal/50"
                  >
                    طلب خدمة
                  </Link>
                </li>
              </ul>
            </nav>
            
            {/* Left Section - Search, Auth */}
            <div className="flex items-center gap-3">
              {/* Desktop Search */}
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                <FormInput
                  type="text"
                  placeholder="البحث عن الخدمات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="البحث عن الخدمات"
                  variant="search"
                  className="min-w-[200px] pr-10"
                  icon={<Search className="h-4 w-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 search-icon" />}
                />
              </form>
              
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                aria-label="البحث عن الخدمات"
                onClick={handleMobileSearchClick}
              >
                <Search className="h-5 w-5 text-text-primary" />
              </Button>
              
              {/* Authentication Section */}
              {user ? (
                // Logged in user - show dropdown
                <UserDropdown user={user} onLogout={logout} />
              ) : (
                // Not logged in - show login/register buttons
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="hidden sm:inline-flex"
                  >
                    تسجيل الدخول
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="hidden sm:inline-flex"
                  >
                    إنشاء حساب
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="pb-4 md:hidden">
              <form onSubmit={handleSearchSubmit} className="relative">
                <FormInput
                  type="text"
                  placeholder="البحث عن الخدمات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="البحث عن الخدمات"
                  variant="search"
                  autoFocus
                  className="w-full pr-10"
                  icon={<Search className="h-4 w-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 search-icon" />}
                />
              </form>
            </div>
          )}

          {/* Mobile Navigation Menu */}
          {showMobileMenu && (
            <div className="lg:hidden pb-4">
              <nav className="bg-white rounded-lg shadow-lg p-4">
                <ul className="flex flex-col gap-2">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <Link 
                        to={item.href} 
                        className="block font-medium text-text-primary hover:text-deep-teal/90 transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-bright-orange/10 focus:outline-none focus:ring-2 focus:ring-deep-teal/50"
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2 border-t border-gray-200 space-y-2">
                    {user && !isProvider ? (
                      <button
                        type="button"
                        className="block font-medium text-text-primary hover:text-deep-teal/90 transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-bright-orange/10 focus:outline-none focus:ring-2 focus:ring-deep-teal/50 w-full text-right"
                        onClick={() => { setShowUpgradeModal(true); closeMobileMenu(); }}
                        disabled={upgradeLoading}
                      >
                        كن مقدم خدمات
                      </button>
                    ) : (
                      <Link 
                        to="/post-service"
                        className="block font-medium text-text-primary hover:text-deep-teal/90 transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-bright-orange/10 focus:outline-none focus:ring-2 focus:ring-deep-teal/50"
                        onClick={closeMobileMenu}
                      >
                        نشر خدمة
                      </Link>
                    )}
                    <Link 
                      to="/request-service"
                      className="block font-medium text-text-primary hover:text-deep-teal/90 transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-bright-orange/10 focus:outline-none focus:ring-2 focus:ring-deep-teal/50"
                      onClick={closeMobileMenu}
                    >
                      طلب خدمة
                    </Link>
                  </li>
                  {/* Mobile Auth Buttons */}
                  {!user && (
                    <li className="pt-2 border-t border-gray-200 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          navigate('/login');
                          closeMobileMenu();
                        }}
                      >
                        تسجيل الدخول
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          navigate('/register');
                          closeMobileMenu();
                        }}
                      >
                        إنشاء حساب
                      </Button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Upgrade Modal */}
      <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title="طلب الترقية إلى مقدم خدمات">
        <form onSubmit={handleUpgradeSubmit} className="space-y-4" dir="rtl">
          <div>
            <label className="block mb-2 font-semibold">سبب الترقية أو نبذة عن خبرتك (اختياري)</label>
            <FormTextarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              placeholder="اكتب سبب طلب الترقية أو خبرتك..."
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">المرفقات (صور أو PDF، حتى 3 ملفات)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="block w-full border border-gray-300 rounded-lg p-2"
              disabled={attachments.length >= 3}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-light-cream px-2 py-1 rounded">
                  <span className="text-xs">{file.name}</span>
                  <button type="button" className="text-red-500 ml-1" onClick={() => handleRemoveFile(idx)}>&times;</button>
                </div>
              ))}
            </div>
          </div>
          {upgradeError && <div className="text-red-600 text-sm">{upgradeError}</div>}
          {upgradeSuccess && <div className="text-green-600 text-sm">{upgradeSuccess}</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowUpgradeModal(false)} disabled={upgradeLoading}>إلغاء</Button>
            <Button type="submit" variant="primary" loading={upgradeLoading} disabled={attachments.length === 0 || upgradeLoading}>إرسال الطلب</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Header;