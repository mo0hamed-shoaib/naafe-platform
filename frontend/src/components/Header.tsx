import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import UserDropdown from './ui/UserDropdown';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

const Header = ({ onSearch, searchValue = '' }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  const handlePostService = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'provider') {
      // Show verification message
      alert('يجب أن تكون محترفًا موثقًا لنشر الخدمات. يرجى التواصل مع الدعم للتحقق من حسابك.');
      return;
    }
    
    // Navigate to post service page (to be implemented)
    navigate('/post-service');
  };

  const handleRequestService = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Navigate to request service page (to be implemented)
    navigate('/request-service');
  };

  const navigationItems = [
    { label: 'الخدمات', href: '/services' },
    { label: 'للأعمال', href: '/business' },
    { label: 'استكشف', href: '/explore' },
  ];

  return (
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePostService}
                  className="font-medium"
                >
                  نشر خدمة
                </Button>
              </li>
              <li>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRequestService}
                  className="font-medium"
                >
                  طلب خدمة
                </Button>
              </li>
            </ul>
          </nav>
          
          {/* Left Section - Search, Auth */}
          <div className="flex items-center gap-3">
            {/* Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary h-4 w-4 search-icon" />
              <input
                className="pr-10 pl-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-teal focus:border-deep-teal transition-colors bg-white text-text-primary min-w-[200px] search-input"
                placeholder="البحث عن الخدمات..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="البحث عن الخدمات"
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
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary h-4 w-4 search-icon" />
              <input
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-teal focus:border-deep-teal transition-colors bg-white text-text-primary search-input"
                placeholder="البحث عن الخدمات..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                aria-label="البحث عن الخدمات"
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
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      handlePostService();
                      closeMobileMenu();
                    }}
                  >
                    نشر خدمة
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      handleRequestService();
                      closeMobileMenu();
                    }}
                  >
                    طلب خدمة
                  </Button>
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
  );
};

export default Header;