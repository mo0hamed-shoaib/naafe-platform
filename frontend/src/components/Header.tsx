import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import UserDropdown from './ui/UserDropdown';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../admin/components/UI/Modal';
import { useRef } from 'react';
import { FormInput, FormTextarea } from './ui';

interface UpgradeRequest {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected';
  adminExplanation?: string;
  createdAt: string;
  viewedByUser?: boolean;
}

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
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([]);
  const [hasUnviewedResponse, setHasUnviewedResponse] = useState(false);
  // Add state for uploading images
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: boolean}>({});

  // Helper: check if user is provider
  const isProvider = user && user.roles.includes('provider');

  // Hide dot as soon as modal opens
  useEffect(() => {
    if (showUpgradeModal) setHasUnviewedResponse(false);
  }, [showUpgradeModal]);

  // Fetch upgrade requests on mount/user change for notification dot
  useEffect(() => {
    if (user && !isProvider) {
      fetch('/api/upgrade-requests/me', {
        headers: { Authorization: `Bearer ${accessToken || localStorage.getItem('accessToken')}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data.requests)) {
            const hasUnviewed = data.data.requests.some(
              (r: UpgradeRequest) => !r.viewedByUser && (r.status === 'accepted' || r.status === 'rejected')
            );
            setHasUnviewedResponse(hasUnviewed);
          }
        });
    }
  }, [user, isProvider, accessToken]);

  // Hide dot and mark as viewed as soon as modal opens
  useEffect(() => {
    if (showUpgradeModal && hasUnviewedResponse) {
      setHasUnviewedResponse(false);
      fetch('/api/upgrade-requests/viewed', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken || localStorage.getItem('accessToken')}` },
      });
    }
  }, [showUpgradeModal, hasUnviewedResponse, accessToken]);

  // Fetch all upgrade requests when modal opens
  useEffect(() => {
    if (showUpgradeModal && user && !isProvider) {
      setUpgradeRequests([]);
      setHasUnviewedResponse(false);
      fetch('/api/upgrade-requests/me', {
        headers: { Authorization: `Bearer ${accessToken || localStorage.getItem('accessToken')}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data.requests)) {
            setUpgradeRequests(data.data.requests);
            // Notification dot logic
            const hasUnviewed = data.data.requests.some(
              (r: UpgradeRequest) => !r.viewedByUser && (r.status === 'accepted' || r.status === 'rejected')
            );
            setHasUnviewedResponse(hasUnviewed);
            // Mark as viewed
            if (hasUnviewed) {
              fetch('/api/upgrade-requests/viewed', {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${accessToken || localStorage.getItem('accessToken')}` },
              });
            }
          }
        });
    }
  }, [showUpgradeModal, user, isProvider, accessToken]);

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
      const attachmentUrls = attachments.map(f => f.name || f.toString());
      const payload = {
        attachments: attachmentUrls,
        comment,
      };
      const res = await fetch('/api/admin/upgrade-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken || localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        if (data.error?.message?.includes('قيد الانتظار')) {
          setUpgradeError('لديك طلب ترقية قيد الانتظار بالفعل. يرجى انتظار قرار الإدارة.');
        } else {
          throw new Error(data.error?.message || 'فشل إرسال الطلب');
        }
        return;
      }
      setUpgradeSuccess('تم إرسال طلب الترقية بنجاح! سيتم مراجعته من قبل الإدارة.');
      setAttachments([]);
      setComment('');
      setShowUpgradeModal(false);
    } catch (err: unknown) {
      setUpgradeError(err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الطلب');
    }
    setUpgradeLoading(false);
  };

  // File input change handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 3) {
      setUpgradeError('يمكنك رفع 3 صور كحد أقصى');
      return;
    }
    setUploading(true);
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setUpgradeError('يرجى رفع صور فقط');
        continue;
      }
      setUploadProgress(prev => ({ ...prev, [file.name]: true }));
      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.data && data.data.url) {
          setAttachments((prev) => [...prev, new File([], data.data.url)]);
        } else {
          setUpgradeError('فشل رفع الصورة. يرجى المحاولة مرة أخرى.');
        }
      } catch {
        setUpgradeError('فشل رفع الصورة. يرجى المحاولة مرة أخرى.');
      }
      setUploadProgress(prev => ({ ...prev, [file.name]: false }));
    }
    setUploading(false);
  };
  const handleRemoveFile = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const attemptsLeft = 3 - upgradeRequests.length;

  // Compute modal state
  const allRejected = upgradeRequests.length >= 3 && upgradeRequests.every(r => r.status === 'rejected');
  const latestPending = upgradeRequests[0]?.status === 'pending';
  const maxAttempts = upgradeRequests.length >= 3;

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
                <li className="relative">
                  {user && !isProvider ? (
                    <button
                      type="button"
                      className="font-medium text-text-primary hover:text-deep-teal/90 transition-colors duration-200 rounded-lg px-3 py-2 hover:bg-bright-orange/10 focus:outline-none focus:ring-2 focus:ring-deep-teal/50 relative"
                      onClick={() => setShowUpgradeModal(true)}
                      disabled={upgradeLoading}
                    >
                      كن مقدم خدمات
                      {hasUnviewedResponse && (
                        <span
                          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full z-10"
                          title="لديك رد جديد من الإدارة"
                        />
                      )}
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
        {upgradeRequests.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">سجل طلبات الترقية:</h3>
            <ul className="space-y-2">
              {upgradeRequests.map((req, idx) => (
                <li key={req._id} className="p-2 rounded border bg-light-cream">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{idx + 1}.</span>
                    <span className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="mt-1">
                    <span className="font-semibold">الحالة: </span>
                    {req.status === 'pending' && 'قيد الانتظار'}
                    {req.status === 'accepted' && 'تم القبول'}
                    {req.status === 'rejected' && 'تم الرفض'}
                  </div>
                  {req.adminExplanation && (
                    <div className="text-xs mt-1 text-blue-700">
                      <span className="font-semibold">شرح الإدارة:</span> {req.adminExplanation}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {allRejected ? (
          <div className="text-center py-6">
            <p className="text-text-primary">لقد قمت بطلب الترقية 3 مرات وتم رفض جميع الطلبات. إذا كان لديك اعتراض، يرجى التواصل مع الدعم: <a href="mailto:naafe@support.com" className="text-blue-600 underline">naafe@support.com</a></p>
            <div className="flex justify-end mt-4">
              <Button variant="ghost" onClick={() => setShowUpgradeModal(false)}>إغلاق</Button>
            </div>
          </div>
        ) : latestPending ? (
          <div className="text-center py-6">
            <p className="text-text-primary">طلبك الحالي قيد المراجعة. يرجى الانتظار حتى تراجع الإدارة طلبك.</p>
            <div className="flex justify-end mt-4">
              <Button variant="ghost" onClick={() => setShowUpgradeModal(false)}>إغلاق</Button>
            </div>
          </div>
        ) : maxAttempts ? (
          <div className="text-center py-6">
            <p className="text-text-primary">لقد وصلت إلى الحد الأقصى لعدد محاولات الترقية (3 مرات). لا يمكنك إرسال طلب جديد.</p>
            <div className="flex justify-end mt-4">
              <Button variant="ghost" onClick={() => setShowUpgradeModal(false)}>إغلاق</Button>
            </div>
          </div>
        ) : (
          <>
            {/* Instructions box */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 text-sm">
              <strong>تعليمات هامة:</strong>
              <ul className="list-disc pr-5 mt-2 space-y-1 text-right">
                <li>يرجى رفع صورة شخصية أثناء تقديمك لخدمة أو صورة توضح خبرتك.</li>
                <li>يرجى رفع صورة بطاقة الهوية الخاصة بك.</li>
                <li>كلما زادت التفاصيل، زادت فرص قبول طلبك.</li>
              </ul>
            </div>
            {/* Attempts left */}
            <div className="mb-2 text-sm text-gray-700">المحاولات المتبقية: {attemptsLeft} من 3</div>
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
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="block w-full border border-gray-300 rounded-lg p-2"
                  disabled={attachments.length >= 3}
                  placeholder="اختر صور (حتى 3 صور)"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-light-cream px-2 py-1 rounded">
                      {file.name.startsWith('http') ? (
                        <img src={file.name} alt="مرفق" className="h-10 w-10 rounded object-cover border" />
                      ) : (
                        <span className="text-xs">{file.name}</span>
                      )}
                      {uploadProgress[file.name] && <span className="text-xs text-blue-600 ml-2">جاري رفع الصورة...</span>}
                      <button type="button" className="text-red-500 ml-1" onClick={() => handleRemoveFile(idx)} disabled={uploadProgress[file.name] || uploading}>&times;</button>
                    </div>
                  ))}
                </div>
              </div>
              {upgradeError && <div className="text-red-600 text-sm">{upgradeError}</div>}
              {upgradeSuccess && <div className="text-green-600 text-sm">{upgradeSuccess}</div>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowUpgradeModal(false)} disabled={upgradeLoading}>إلغاء</Button>
                <Button type="submit" variant="primary" loading={upgradeLoading || uploading} disabled={attachments.length === 0 || upgradeLoading || uploading}>إرسال الطلب</Button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </>
  );
};

export default Header;