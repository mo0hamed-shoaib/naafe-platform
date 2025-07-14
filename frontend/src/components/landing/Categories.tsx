import React from 'react';

const categories = [
  {
    name: 'تنظيف المنازل',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSTF07ZuEFWQXWOo4suH1swlrnIq1ko1fhEdF1w_vKL_gkj4otGDZnK90wW_e_O8OPSpjHjqtwGkFflVD0GjPZW1Lmsmig87oLHGMu9ln-v0mJeZ6Cgl_MNxZSWiBKxBo5wbSKBhuqvSc0UEqNZ18BrRfSUnsTj8CdoMjB96nEa5GRvTcesCiaacJs88uGdljm9U8G0jKPSHDhxO6yM5bRGH9UGKlpS0NwaqYKBe-ar0gq1QqhJl4rH1Ih4CJe6Mk5bIJClkDrPQ',
  },
  {
    name: 'سباكة',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD10l3-I8SIU17MA5TRX9Afok50HsR37oBN9X6-1N_TFTd0lrj4ah7D9jAoQ2Xh4rJ0BvvOUju7dFhtWkM3QMOk0nyuEugf3RQlIS8b6SjkRoY5ev1trfrfa1fSsClbVrUXsi1kMkukEbBaU63CKsfgUiEPLNwtRjMDhHNoqBtb9ht40WCfHclGIU_ZaaVrUYCsQ1Cg4G3a5hnbEngp7u3sNTLWamo762wJb3A-y-2PFLm104V-YOLSFhopWiItVkQogmN16sFF2w',
  },
  {
    name: 'أعمال كهربائية',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV0WsBHRoWyGSsXnw9c3axsNQJ1Bh2a8xdMinI9b25-jT1Qxa3BNfIM7rmk-93CbvnPUtpTYbdhtZZG8WuCy8_QamE6n586Wwrr-Xd1rbgJJJLPs2qMRgNkH7IFZMFUhodnhJCDeqys4mXTnX4gkDIZnZftWH2GXDIsxG9PhOm2tOt1h3OXAcsbecfmPdcqhLRvKfjMvkeEIMHN7CYFJTonzHkDdPiKs3kSJT3Y5A-fdsF-5GqEKf093Qmp562jPzMMmXrU4dglA',
  },
  {
    name: 'دهان',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9w3rTlnENgGuQIHDTWhOu7e2uqFkNtU1Y92pNzaHkSEIoXvrAmgaSsYo0TLPV0YHpwdMJ9URkY3D5m_2khl02f_Uv-cer0Fd_TO4nDYTgL1j_P-IOFbZoNRXHSG4417Nyq69y0DrvF4P1c4c-S86Y4QZbMpxz_21PZOCVsVi4114pRzhi0J8a-RvyTuL1kolRuMipbcxdk81gbzoKcqa6hmMrldL0uye7jBNl_namQWOp0b1Fbvwxvb1ziHxAX2icGWgSLOPfJw',
  },
  {
    name: 'عامل صيانة',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALAdc7-YUkg0nqvXyr6ImfazYLBs7H4FNwlHoXE16Xl4FNAPwhU6JrzAZGTuXm7LJ4U7EJX2b5HJBTSI6AbcjMHIvI7WEZvlLwdmkQSYvRo6YEp5W9WbfSrlTW-6-WMqTfAEwj0k04cKnP2hNAUANRKzcSTKdMau_O6Zw0hu1dptcMkALiDDi4VKDJkHtKVF6VYsHFq-lm5bDhKHrQh0mHiAD2TVtUzF25py51QCZ-ZSkRKaRnNmGL6JWhxweWN-GiogMbw6Jk-w',
  },
  {
    name: 'تدريس',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIxSqD3W-us2329d8daCwnSQZ-8hYUFfEruRDp_lKz1paBYGgWh7SUhLekw_JGwcvc9wtcsQzZyGODsfP5h8GiaOXFQKXr3F7-l_M2C5NqrzFuPItVIq4ATVdYSO2LoDCGxv2rVe3cyDKNZdh3om7F7jcakPPNThWJ9YaTNNhg7kfK-4zOXF5PuVtnhYmbSwuft2srbmwZzwHB3LNin4yBhW_ppbWgPSE0l56xp1mlqw2PyNqjRB2Bd9AETeNIGoiiyLwK8P1c2Q',
  },
];

const defaultImage = 'https://via.placeholder.com/300x300.png?text=لا يوجد صورة';

const Categories: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-warm-cream font-arabic text-text-primary" id="categories">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-teal">الفئات المميزة</h2>
          <p className="text-lg text-text-secondary mt-2">استكشف الخدمات الشائعة.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <div key={index} className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
              <div className="w-full aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-t-lg"
                  onError={(e) => { (e.target as HTMLImageElement).src = defaultImage; }}
                />
              </div>
              <div className="card-body items-center text-center p-4">
                <p className="text-text-primary text-base md:text-lg font-semibold">{category.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories; 