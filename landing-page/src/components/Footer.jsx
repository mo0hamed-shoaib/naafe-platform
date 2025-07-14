import React, { useState } from 'react';
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';

// مكون تذييل الصفحة المحسن
function EnhancedFooter() {
  const [email, setEmail] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(true);

  const footerLinks = {
    'الخدمات': ['تنظيف المنازل', 'سباكة', 'كهرباء', 'حدائق'],
    'الشركة': ['من نحن', 'وظائف', 'اتصل بنا', 'سياسة الخصوصية'],
    'الدعم': ['مركز المساعدة', 'شروط الخدمة', 'السلامة']
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'فيسبوك' },
    { icon: Twitter, href: '#', label: 'تويتر' },
    { icon: Instagram, href: '#', label: 'إنستغرام' },
    { icon: Linkedin, href: '#', label: 'لينكدإن' }
  ];

  const handleNewsletterSubmit = () => {
    // معالجة التسجيل في النشرة الإخبارية
    console.log('تسجيل النشرة الإخبارية:', email);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-naafe-teal text-naafe-cream">
      {/* محتوى تذييل الصفحة الرئيسي */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* قسم العلامة التجارية */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-naafe-cream rounded-lg flex items-center justify-center">
                <span className="text-naafe-teal font-bold text-lg">ن</span>
              </div>
              <h3 className="text-xl font-bold">نافي</h3>
            </div>
            <p className="text-naafe-cream/80 mb-4 text-sm leading-relaxed">
              تربطك نافي بالمحترفين الموثوقين لجميع احتياجاتك في خدمات المنزل.
            </p>
            
            {/* معلومات الاتصال */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-naafe-orange" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-naafe-orange" />
                <span className="text-sm">hello@naafe.com</span>
              </div>
            </div>
          </div>

          {/* أقسام الروابط */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-base mb-3 text-naafe-cream">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-naafe-cream/80 hover:text-naafe-orange transition-colors duration-200 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* شريط الأسفل */}
        <div className="mt-8 pt-6 border-t border-naafe-cream/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-naafe-cream/80 text-sm">
              © {new Date().getFullYear()} نافع. جميع الحقوق محفوظة.
            </p>
            
            {/* الروابط الاجتماعية */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-8 h-8 bg-naafe-cream/10 rounded-full flex items-center justify-center hover:bg-naafe-orange hover:scale-110 transition-all duration-200 group"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 text-naafe-cream group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* زر العودة إلى الأعلى */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-naafe-orange text-white rounded-full shadow-lg hover:bg-naafe-orange/90 hover:scale-110 transition-all duration-200 flex items-center justify-center z-50"
          aria-label="العودة إلى الأعلى"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
}

export default EnhancedFooter;