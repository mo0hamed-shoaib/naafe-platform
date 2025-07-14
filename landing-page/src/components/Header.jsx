import React, { useState } from 'react';
import EnhancedNavbar from './Navbar';

// مكون الرأس المحسن
function EnhancedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  // محاكاة تأثير التمرير
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-naafe-cream/95 backdrop-blur-md shadow-lg' : 'bg-naafe-cream/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* قسم الشعار */}
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-14 h-14 bg-naafe-teal rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-naafe-cream font-bold text-xl">ن</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-naafe-orange rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-naafe-teal group-hover:text-naafe-teal/80 transition-colors duration-300">
              نافع
              </h1>
              <p className="text-sm text-gray-600 -mt-1">خدمات احترافية</p>
            </div>
          </div>

          {/* التنقل */}
          <EnhancedNavbar />
        </div>
      </div>
    </header>
  );
}

export default EnhancedHeader;