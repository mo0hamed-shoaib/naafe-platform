import React from 'react';
import {
  Check,
  Percent,
  Star,
  Clock,
  TrendingUp,
  PenTool,
  Shield,
  Crown,
  Eye,
  Search,
  Grid3X3,
  ArrowUp,
  Target,
  Users,
  Calendar
} from 'lucide-react';
import PageLayout from './layout/PageLayout';
import Button from './ui/Button';

// Arabic data
const loyaltyTiers = [
  {
    name: 'برونزي',
    points: '0+',
    color: 'text-[#cd7f32]',
    borderColor: 'border-[#cd7f32]',
    bgColor: 'bg-gradient-to-br from-[#cd7f32]/10 to-[#cd7f32]/5',
    isCurrent: true,
    features: [
      { text: 'الوصول الأساسي للمنصة', included: true },
      { text: 'دعم عبر البريد الإلكتروني', included: true },
      { text: 'إحصائيات أساسية', included: true },
      { text: 'دعم أولوية', included: false },
    ]
  },
  {
    name: 'فضي',
    points: '500+',
    color: 'text-[#c0c0c0]',
    borderColor: 'border-[#c0c0c0]',
    bgColor: 'bg-gradient-to-br from-[#c0c0c0]/10 to-[#c0c0c0]/5',
    isPopular: true,
    features: [
      { text: 'خصم 5% على الإعلانات', included: true },
      { text: 'أولوية في مراجعة العروض', included: true },
      { text: 'دعم معزز', included: true },
      { text: 'إحصائيات متقدمة', included: true },
    ]
  },
  {
    name: 'ذهبي',
    points: '2,000+',
    color: 'text-[#ffd700]',
    borderColor: 'border-[#ffd700]',
    bgColor: 'bg-gradient-to-br from-[#ffd700]/10 to-[#ffd700]/5',
    features: [
      { text: 'خصم 10% على الإعلانات', included: true },
      { text: 'أماكن إعلانات مميزة', included: true },
      { text: 'مدير حساب مخصص', included: true },
      { text: 'دعم في التصميم', included: true },
    ]
  },
  {
    name: 'بلاتينيوم',
    points: '5,000+',
    color: 'text-[#e5e4e2]',
    borderColor: 'border-[#e5e4e2]',
    bgColor: 'bg-gradient-to-br from-[#e5e4e2]/10 to-[#e5e4e2]/5',
    features: [
      { text: 'خصم 15% على الإعلانات', included: true },
      { text: 'عروض حصرية', included: true },
      { text: 'دعم مخصص 24/7', included: true },
      { text: 'الوصول المبكر للميزات', included: true },
    ]
  }
];

const premiumFeatures = [
  {
    icon: <Percent className="w-7 h-7" />, 
    title: 'أسعار مخفضة',
    description: 'استمتع بأسعار أقل على جميع حملاتك الإعلانية، وحقق أقصى استفادة من ميزانيتك.'
  },
  {
    icon: <Star className="w-7 h-7" />,
    title: 'أماكن إعلانات مميزة',
    description: 'إعلاناتك تظهر في أماكن بارزة لجذب المزيد من العملاء.'
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: 'مدة حملات أطول',
    description: 'شغّل حملاتك لفترات أطول للوصول إلى جمهور أوسع.'
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: 'إحصائيات متقدمة',
    description: 'احصل على تحليلات متقدمة لأداء حملاتك الإعلانية.'
  },
  {
    icon: <PenTool className="w-7 h-7" />,
    title: 'دعم في التصميم',
    description: 'فريقنا يساعدك في تصميم إعلانات احترافية وجذابة.'
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: 'وصول حصري',
    description: 'احصل على ميزات جديدة قبل الجميع وشارك في برامج تجريبية.'
  }
];

const adPlacements = [
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'بانر الصفحة الرئيسية',
    description: 'مكان مميز في أعلى الصفحة الرئيسية لظهور أكبر',
    location: 'قسم البطل في الصفحة الرئيسية'
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'نتائج البحث',
    description: 'تظهر في أعلى نتائج البحث والفلاتر',
    location: 'صفحات البحث والفلاتر'
  },
  {
    icon: <Grid3X3 className="w-6 h-6" />,
    title: 'صفحات الفئات',
    description: 'مكان مميز داخل فئات الخدمات',
    location: 'قوائم الفئات'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'تمييز الملف الشخصي',
    description: 'ظهور بارز في قوائم مقدمي الخدمات',
    location: 'قوائم المحترفين'
  }
];

const adBenefits = [
  {
    icon: <ArrowUp className="w-6 h-6" />,
    title: 'الظهور في الأعلى',
    description: 'خدماتك تظهر أولاً في نتائج البحث وصفحات الفئات',
    tierRestriction: 'متاح لجميع المستويات'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'استهداف دقيق',
    description: 'تصل للعملاء الباحثين عن خدماتك تحديداً',
    tierRestriction: 'استهداف معزز للفضي وما فوق'
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'تفاعل أعلى',
    description: 'معدلات نقر وتواصل أعلى من العملاء',
    tierRestriction: 'إحصائيات متقدمة للذهبي وما فوق'
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'شارة مميزة',
    description: 'شارة خاصة لتمييزك عن المنافسين',
    tierRestriction: 'حصري للبلاتينيوم'
  }
];

const Pricing: React.FC = () => {
  return (
    <PageLayout
      title="العضوية المميزة وبرامج الولاء"
      subtitle="انضم للعضوية المميزة وتمتع بمزايا حصرية ودعم موثوق. كلما زاد نشاطك، زادت مكافآتك!"
      breadcrumbItems={[
        { label: 'الرئيسية', href: '/' },
        { label: 'العضوية المميزة', active: true }
      ]}
      showHeader
      showFooter
      showBreadcrumb
      className="font-cairo"
    >
      <div dir="rtl">
        {/* Hero Section */}
        <section className="bg-[#FDF8F0] py-12 md:py-20 lg:py-24 rounded-3xl mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#F5A623]/10 px-4 py-2 rounded-full mb-6">
              <Crown className="w-5 h-5 text-[#F5A623]" />
              <span className="text-sm font-semibold text-[#F5A623] tracking-wide">
                برنامج الولاء
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0E1B18] mb-6">
              اكسب <span className="text-[#2D5D4F]">مزايا حصرية</span> مع نشاطك
            </h1>
            <p className="text-xl text-[#50958A] max-w-3xl mx-auto leading-relaxed">
              كلما زادت إعلاناتك، زادت مكافآتك. ارتقِ في المستويات لتحصل على خصومات ودعم ومزايا إضافية.
            </p>
          </div>
        </section>

        {/* Advertisements Section */}
        <section className="py-12 md:py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#2D5D4F]/10 px-4 py-2 rounded-full mb-6">
              <Target className="w-5 h-5 text-[#2D5D4F]" />
              <span className="text-sm font-semibold text-[#2D5D4F] tracking-wide">
                إعلانات المنصة
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0E1B18] mb-4">
              عزز ظهورك مع <span className="text-[#2D5D4F]">إعلانات استراتيجية</span>
            </h2>
            <p className="text-lg text-[#50958A] max-w-3xl mx-auto">
              اجذب العملاء المناسبين في الوقت المناسب من خلال أماكن إعلانية مختارة بعناية.
            </p>
          </div>

          {/* Ad Placements Grid */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[#0E1B18] text-center mb-8">
              أين تظهر إعلاناتك؟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adPlacements.map((placement, index) => (
                <div
                  key={index}
                  className="bg-[#FDF8F0] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6 border border-[#F5E6D3]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#2D5D4F]/10 flex items-center justify-center mb-4">
                    <span className="text-[#2D5D4F]">
                      {placement.icon}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#0E1B18] mb-2">
                    {placement.title}
                  </h4>
                  <p className="text-[#50958A] text-sm mb-3 leading-relaxed">
                    {placement.description}
                  </p>
                  <div className="inline-flex items-center gap-1 bg-[#F5A623]/10 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-[#F5A623]">
                      {placement.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ad Benefits Grid */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[#0E1B18] text-center mb-8">
              مزايا الإعلانات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {adBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-[#FDF8F0] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-[#F5E6D3]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F5A623]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#F5A623]">
                        {benefit.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-[#0E1B18] mb-2">
                        {benefit.title}
                      </h4>
                      <p className="text-[#50958A] mb-3 leading-relaxed">
                        {benefit.description}
                      </p>
                      <div className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#2D5D4F]"></div>
                        <span className="text-sm font-medium text-[#2D5D4F]">
                          {benefit.tierRestriction}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-gradient-to-r from-[#FDF8F0] to-[#F5E6D3] rounded-3xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-[#0E1B18] mb-4">
                خيارات التسعير المرنة
              </h3>
              <p className="text-lg text-[#50958A] max-w-2xl mx-auto">
                اختر ما يناسب احتياجك وميزانيتك، وادفع فقط مقابل النتائج.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white/50 rounded-2xl border border-white/20">
                <div className="w-12 h-12 rounded-full bg-[#2D5D4F]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#2D5D4F] font-bold">جنيه</span>
                </div>
                <h4 className="font-bold text-[#0E1B18] mb-2">الدفع مقابل النقر</h4>
                <p className="text-[#50958A] text-sm">تدفع فقط عند تفاعل العملاء مع إعلانك</p>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-2xl border border-white/20">
                <div className="w-12 h-12 rounded-full bg-[#F5A623]/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-[#F5A623]" />
                </div>
                <h4 className="font-bold text-[#0E1B18] mb-2">باقات شهرية</h4>
                <p className="text-[#50958A] text-sm">سعر ثابت شهرياً لظهور مستمر</p>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-2xl border border-white/20">
                <div className="w-12 h-12 rounded-full bg-[#2D5D4F]/10 flex items-center justify-center mx-auto mb-4">
                  <Percent className="w-6 h-6 text-[#2D5D4F]" />
                </div>
                <h4 className="font-bold text-[#0E1B18] mb-2">خصومات حسب المستوى</h4>
                <p className="text-[#50958A] text-sm">وفر حتى 15% حسب مستواك في برنامج الولاء</p>
              </div>
            </div>
            <div className="text-center flex flex-col md:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" className="px-8 py-3 text-lg">
                ابدأ الإعلان الآن
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-[#2D5D4F] text-[#2D5D4F] hover:bg-[#2D5D4F] hover:text-white">
                تفاصيل الأسعار
              </Button>
            </div>
          </div>
        </section>

        {/* Loyalty Tiers Section */}
        <section className="py-12 md:py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0E1B18] mb-4">
              اختر مستواك
            </h2>
            <p className="text-lg text-[#50958A] max-w-2xl mx-auto">
              كل مستوى يمنحك مزايا جديدة تساعدك على النجاح
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loyaltyTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-[#FDF8F0] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 ${tier.borderColor} overflow-hidden flex flex-col h-full min-h-[480px]`}
                aria-label={`بطاقة مستوى ${tier.name}`}
              >
                {tier.isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-[#F5A623] text-white text-center py-2 text-sm font-semibold z-10">
                    الأكثر شعبية
                  </div>
                )}
                {tier.isCurrent && (
                  <div className="absolute top-4 right-4 bg-[#2D5D4F] text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                    مستواك الحالي
                  </div>
                )}
                <div className="flex flex-col flex-1 justify-between p-8 pt-8">
                  <div>
                    <div className={`w-16 h-16 rounded-xl ${tier.bgColor} flex items-center justify-center mb-6 mx-auto`}>
                      <Crown className={`w-8 h-8 ${tier.color}`} />
                    </div>
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-[#0E1B18] mb-2">
                        {tier.name}
                      </h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-[#2D5D4F]">{tier.points}</span>
                        <span className="text-[#50958A] text-sm">نقطة</span>
                      </div>
                    </div>
                    <ul className="mb-6">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 mb-2">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-[#2D5D4F]" />
                          ) : (
                            <span className="w-5 h-5 inline-block" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-[#0E1B18]' : 'text-[#50958A]/60 line-through'}`}>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="primary" className="w-full px-6 py-2 text-base mt-4" aria-label={`اختر مستوى ${tier.name}`}>
                    اختر هذا المستوى
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Features Section */}
        <section className="py-12 md:py-20 bg-[#FDF8F0] rounded-3xl mt-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0E1B18] mb-4">
              مزايا العضوية المميزة
            </h2>
            <p className="text-lg text-[#50958A] max-w-2xl mx-auto">
              استمتع بمزايا إضافية مع عضويتك المميزة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-[#F5E6D3] flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-[#2D5D4F]/10 flex items-center justify-center mb-4">
                  <span className="text-[#2D5D4F]">
                    {feature.icon}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-[#0E1B18] mb-2">
                  {feature.title}
                </h4>
                <p className="text-[#50958A] mb-3 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Pricing; 