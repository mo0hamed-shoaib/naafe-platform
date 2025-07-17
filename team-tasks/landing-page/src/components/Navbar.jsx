import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

// مكون شريط التنقل المحسن
function EnhancedNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  const navItems = [
    { name: 'كيف يعمل', href: '#how-it-works' },
    { name: 'الفئات', href: '#categories' },
    { name: 'كن محترفًا', href: '#become-pro' }
  ];

  return (
    <nav className="relative flex items-center justify-between px-4 py-3 bg-naafe-cream/95 backdrop-blur-md shadow-lg border-b border-naafe-teal/10">
      {/* التنقل للأجهزة المكتبية */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`relative text-gray-700 hover:text-naafe-teal font-semibold text-lg transition-all duration-300 transform hover:scale-105 group ${
              activeLink === item.name ? 'text-naafe-teal' : ''
            }`}
            onClick={() => setActiveLink(item.name)}
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-naafe-teal transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
      </div>

      {/* الأفعال الجانبية اليمنى */}
      <div className="flex items-center gap-6"> {/* زيادة gap من 4 إلى 6 */}       

        {/* قائمة الحساب */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-naafe-teal hover:bg-naafe-cream/50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-naafe-teal/20"
          >
            <span className="font-medium">الحساب</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">حسابي</p>
              </div>
              {['تسجيل الدخول', 'التسجيل', 'الملف الشخصي', 'الإعدادات'].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-naafe-cream hover:text-naafe-teal transition-colors duration-200"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <span>{item}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* تبديل القائمة على الأجهزة المحمولة */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-naafe-teal hover:bg-naafe-cream/50 rounded-lg transition-all duration-200 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* القائمة على الأجهزة المحمولة */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-naafe-cream/98 backdrop-blur-md shadow-xl border-b border-naafe-teal/10 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-gray-700 hover:text-naafe-teal font-semibold text-lg transition-all duration-200 transform hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 border-t border-naafe-teal/10 space-y-3">
              <a
                href="#get-started"
                className="block w-full text-center px-6 py-3 bg-naafe-orange text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                ابدأ الآن
              </a>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-gray-700 hover:text-naafe-teal hover:bg-naafe-cream/50 rounded-lg transition-all duration-200 focus:outline-none"
                >
                  <span className="font-medium">الحساب</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {isProfileOpen && (
                  <div className="mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl py-2 animate-in slide-in-from-top-2 duration-200">
                    {['تسجيل الدخول', 'التسجيل', 'الملف الشخصي', 'الإعدادات'].map((item) => (
                      <a
                        key={item}
                        href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-naafe-cream hover:text-naafe-teal transition-colors duration-200"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        <span>{item}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default EnhancedNavbar;