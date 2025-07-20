import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Star, TrendingUp } from 'lucide-react';

const categories = [
  {
    name: 'تنظيف المنازل',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSTF07ZuEFWQXWOo4suH1swlrnIq1ko1fhEdF1w_vKL_gkj4otGDZnK90wW_e_O8OPSpjHjqtwGkFflVD0GjPZW1Lmsmig87oLHGMu9ln-v0mJeZ6Cgl_MNxZSWiBKxBo5wbSKBhuqvSc0UEqNZ18BrRfSUnsTj8CdoMjB96nEa5GRvTcesCiaacJs88uGdljm9U8G0jKPSHDhxO6yM5bRGH9UGKlpS0NwaqYKBe-ar0gq1QqhJl4rH1Ih4CJe6Mk5bIJClkDrPQ',
    description: 'خدمات تنظيف شاملة للمنازل والمكاتب',
    serviceCount: 1250,
    rating: 4.8,
    tags: ['تنظيف عميق', 'تنظيف أسبوعي', 'تنظيف بعد السكن']
  },
  {
    name: 'سباكة',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD10l3-I8SIU17MA5TRX9Afok50HsR37oBN9X6-1N_TFTd0lrj4ah7D9jAoQ2Xh4rJ0BvvOUju7dFhtWkM3QMOk0nyuEugf3RQlIS8b6SjkRoY5ev1trfrfa1fSsClbVrUXsi1kMkukEbBaU63CKsfgUiEPLNwtRjMDhHNoqBtb9ht40WCfHclGIU_ZaaVrUYCsQ1Cg4G3a5hnbEngp7u3sNTLWamo762wJb3A-y-2PFLm104V-YOLSFhopWiItVkQogmN16sFF2w',
    description: 'إصلاح وصيانة جميع أعمال السباكة',
    serviceCount: 890,
    rating: 4.9,
    tags: ['إصلاح تسريبات', 'تركيب سخانات', 'صيانة دورية']
  },
  {
    name: 'أعمال كهربائية',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV0WsBHRoWyGSsXnw9c3axsNQJ1Bh2a8xdMinI9b25-jT1Qxa3BNfIM7rmk-93CbvnPUtpTYbdhtZZG8WuCy8_QamE6n586Wwrr-Xd1rbgJJJLPs2qMRgNkH7IFZMFUhodnhJCDeqys4mXTnX4gkDIZnZftWH2GXDIsxG9PhOm2tOt1h3OXAcsbecfmPdcqhLRvKfjMvkeEIMHN7CYFJTonzHkDdPiKs3kSJT3Y5A-fdsF-5GqEKf093Qmp562jPzMMmXrU4dglA',
    description: 'تركيب وإصلاح جميع الأعمال الكهربائية',
    serviceCount: 720,
    rating: 4.7,
    tags: ['تركيب إنارة', 'إصلاح دوائر', 'صيانة أجهزة']
  },
  {
    name: 'دهان',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9w3rTlnENgGuQIHDTWhOu7e2uqFkNtU1Y92pNzaHkSEIoXvrAmgaSsYo0TLPV0YHpwdMJ9URkY3D5m_2khl02f_Uv-cer0Fd_TO4nDYTgL1j_P-IOFbZoNRXHSG4417Nyq69y0DrvF4P1c4c-S86Y4QZbMpxz_21PZOCVsVi4114pRzhi0J8a-RvyTuL1kolRuMipbcxdk81gbzoKcqa6hmMrldL0uye7jBNl_namQWOp0b1Fbvwxvb1ziHxAX2icGWgSLOPfJw',
    description: 'دهان داخلي وخارجي بجودة عالية',
    serviceCount: 650,
    rating: 4.6,
    tags: ['دهان داخلي', 'دهان خارجي', 'دهان ديكورات']
  },
  {
    name: 'عامل صيانة',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALAdc7-YUkg0nqvXyr6ImfazYLBs7H4FNwlHoXE16Xl4FNAPwhU6JrzAZGTuXm7LJ4U7EJX2b5HJBTSI6AbcjMHIvI7WEZvlLwdmkQSYvRo6YEp5W9WbfSrlTW-6-WMqTfAEwj0k04cKnP2hNAUANRKzcSTKdMau_O6Zw0hu1dptcMkALiDDi4VKDJkHtKVF6VYsHFq-lm5bDhKHrQh0mHiAD2TVtUzF25py51QCZ-ZSkRKaRnNmGL6JWhxweWN-GiogMbw6Jk-w',
    description: 'صيانة شاملة لجميع الأجهزة والمعدات',
    serviceCount: 580,
    rating: 4.8,
    tags: ['صيانة أجهزة', 'إصلاح معدات', 'صيانة دورية']
  },
  {
    name: 'تدريس',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIxSqD3W-us2329d8daCwnSQZ-8hYUFfEruRDp_lKz1paBYGgWh7SUhLekw_JGwcvc9wtcsQzZyGODsfP5h8GiaOXFQKXr3F7-l_M2C5NqrzFuPItVIq4ATVdYSO2LoDCGxv2rVe3cyDKNZdh3om7F7jcakPPNThWJ9YaTNNhg7kfK-4zOXF5PuVtnhYmbSwuft2srbmwZzwHB3LNin4yBhW_ppbWgPSE0l56xp1mlqw2PyNqjRB2Bd9AETeNIGoiiyLwK8P1c2Q',
    description: 'دروس خصوصية في جميع المواد الدراسية',
    serviceCount: 950,
    rating: 4.9,
    tags: ['رياضيات', 'لغة عربية', 'لغة إنجليزية']
  },
];

const defaultImage = 'https://via.placeholder.com/300x300.png?text=لا يوجد صورة';

const Categories: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24 bg-warm-cream font-arabic text-text-primary" id="categories">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-teal">الفئات المميزة</h2>
          <p className="text-lg text-text-secondary mt-2">استكشف الخدمات الشائعة.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-12">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden group cursor-pointer transform hover:scale-105"
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="w-full aspect-square relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).src = defaultImage; }}
                />
                {/* Overlay with description */}
                {hoveredCategory === index && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
                    <p className="text-white text-sm text-center leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="card-body items-center text-center p-4">
                <h3 className="text-text-primary text-base md:text-lg font-semibold mb-2 group-hover:text-deep-teal transition-colors duration-300">
                  {category.name}
                </h3>
                
                {/* Service Count and Rating */}
                <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{category.serviceCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-accent" />
                    <span>{category.rating}</span>
                  </div>
                </div>
                
                {/* Popular Tags */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {category.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {category.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{category.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Categories Button */}
        <div className="text-center">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-8 py-3 bg-deep-teal text-white rounded-full hover:bg-deep-teal/90 transition-colors duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <TrendingUp className="w-5 h-5" />
            استكشف جميع الفئات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Category Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-deep-teal mb-2">50+</div>
            <div className="text-text-secondary">فئة خدمية</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-deep-teal mb-2">5K+</div>
            <div className="text-text-secondary">خدمة نشطة</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-deep-teal mb-2">98%</div>
            <div className="text-text-secondary">رضا العملاء</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories; 