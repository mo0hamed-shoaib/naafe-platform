import React from 'react';
import {
  Check,
  X,
  Crown,
  Shield,
  Target,
  Award
} from 'lucide-react';
import PageLayout from './layout/PageLayout';
import Button from './ui/Button';

// New pricing data for Nafee' platform
const pricingPlans = [
  {
    name: 'الخطة المجانية',
    price: '0',
    currency: 'جنيه',
    period: 'شهرياً',
    description: 'ابدأ مجاناً واستمتع بالخدمات الأساسية',
    features: [
      { text: 'نشر طلبات محدودة (3 شهرياً)', included: true },
      { text: 'عرض الخدمات الأساسية', included: true },
      { text: 'الملف الشخصي الأساسي', included: true },
      { text: 'دعم المجتمع', included: true },
      { text: 'المطابقة بالذكاء الاصطناعي', included: false },
      { text: 'رفع المستندات (اختياري)', included: true },
      { text: 'شارة التحقق', included: false },
      { text: 'خصم رسوم المنصة', included: false },
    ],
    buttonText: 'ابدأ مجاناً',
    buttonVariant: 'outline' as const,
    popular: false
  },
  {
    name: 'الخطة المميزة',
    price: '49',
    currency: 'جنيه',
    period: 'شهرياً',
    description: 'احصل على مزايا متقدمة لتعزيز نشاطك',
    features: [
      { text: 'نشر طلبات غير محدود', included: true },
      { text: 'عرض الخدمات المميزة', included: true },
      { text: 'الملف الشخصي المميز', included: true },
      { text: 'المطابقة بالذكاء الاصطناعي', included: true },
      { text: 'رفع المستندات (مطلوب) + شارة المراجعة', included: true },
      { text: 'دعم ذو أولوية', included: true },
      { text: 'شارة البائع الموثوق', included: true },
      { text: 'خصم 5% رسوم المنصة', included: true },
    ],
    buttonText: 'اشترك الآن',
    buttonVariant: 'primary' as const,
    popular: true
  }
];

const trustFeatures = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'مدعوم بالذكاء الاصطناعي',
    description: 'مطابقة ذكية بين مقدمي الخدمات والعملاء'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'مؤمن بـ Paymob',
    description: 'مدفوعات آمنة ومشفرة لحماية أموالك'
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'مصمم للسوق المصري',
    description: 'منصة محلية تلبي احتياجات المجتمع المصري'
  }
];

const Pricing: React.FC = () => {
  const handleSubscribe = (planName: string) => {
    // TODO: Implement subscription logic
    console.log(`Subscribing to ${planName}`);
    alert(`سيتم توجيهك لصفحة الدفع للخطة: ${planName}`);
  };

  const handleComparePlans = () => {
    // TODO: Implement plan comparison
    console.log('Opening plan comparison');
  };

  return (
    <PageLayout
      title="أسعار عادلة وشفافة - للجميع"
      subtitle="سواء كنت هنا للربح أو للحصول على المساعدة، خططنا مصممة لدعمك"
      breadcrumbItems={[
        { label: 'الرئيسية', href: '/' },
        { label: 'الأسعار', active: true }
      ]}
      showHeader
      showFooter
      showBreadcrumb
      className="font-cairo"
    >
      <div dir="rtl" className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-deep-teal/10 px-4 py-2 rounded-full mb-6">
            <Crown className="w-5 h-5 text-deep-teal" />
            <span className="text-sm font-semibold text-deep-teal">
              خطط الاشتراك
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-teal mb-6">
            أسعار عادلة وشفافة
            <span className="block text-accent">للجميع</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            سواء كنت هنا للربح أو للحصول على المساعدة، خططنا مصممة لدعمك
          </p>
        </section>

        {/* Pricing Plans */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                  plan.popular 
                    ? 'border-accent scale-105' 
                    : 'border-deep-teal/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-accent text-white px-6 py-2 rounded-full text-sm font-semibold">
                      الأكثر شعبية
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-deep-teal mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-deep-teal">
                      {plan.price}
                    </span>
                    <span className="text-lg text-text-secondary">
                      {plan.currency}/{plan.period}
                    </span>
                  </div>
                  <p className="text-text-secondary">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        feature.included ? 'text-text-primary' : 'text-text-secondary line-through'
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.buttonVariant}
                  size="lg"
                  className="w-full"
                  onClick={() => handleSubscribe(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-16">
          <div className="bg-gradient-to-r from-deep-teal/5 to-accent/5 rounded-2xl p-8 border border-deep-teal/20">
            <h2 className="text-2xl font-bold text-deep-teal mb-4">
              ابدأ مجاناً - ارتقِ في أي وقت
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={() => handleSubscribe('الخطة المميزة')}>
                انضم الآن
              </Button>
              <Button variant="outline" size="lg" onClick={handleComparePlans}>
                قارن الخطط
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-deep-teal mb-4">
              لماذا تثق بنا؟
            </h2>
            <p className="text-lg text-text-secondary">
              منصة آمنة وموثوقة مصممة لخدمة المجتمع المصري
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-deep-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-deep-teal">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-deep-teal mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-light-cream rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-deep-teal text-center mb-8">
            الأسئلة الشائعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-deep-teal mb-2">هل يمكنني إلغاء الاشتراك في أي وقت؟</h3>
              <p className="text-text-secondary text-sm">نعم، يمكنك إلغاء اشتراكك في أي وقت من إعدادات الحساب.</p>
            </div>
            <div>
              <h3 className="font-bold text-deep-teal mb-2">هل هناك فترة تجريبية مجانية؟</h3>
              <p className="text-text-secondary text-sm">نعم، يمكنك تجربة الخطة المميزة مجاناً لمدة 7 أيام.</p>
            </div>
            <div>
              <h3 className="font-bold text-deep-teal mb-2">كيف يتم الدفع؟</h3>
              <p className="text-text-secondary text-sm">نقبل جميع البطاقات الائتمانية والمدفوعات الإلكترونية عبر Paymob.</p>
            </div>
            <div>
              <h3 className="font-bold text-deep-teal mb-2">هل يمكنني الترقية أو التخفيض؟</h3>
              <p className="text-text-secondary text-sm">نعم، يمكنك تغيير خطتك في أي وقت من إعدادات الحساب.</p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Pricing; 