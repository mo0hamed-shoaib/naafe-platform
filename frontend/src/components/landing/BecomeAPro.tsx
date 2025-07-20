import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, Users, DollarSign, Clock, Shield, Star, ChevronDown } from 'lucide-react';

const BecomeAPro: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Helper: check if user is provider
  const isProvider = user && user.roles.includes('provider');
  
  const handleProviderAction = () => {
    if (!user) {
      navigate('/register');
    } else if (isProvider) {
      navigate('/post-service');
    } else {
      // Open upgrade modal - this will be handled by the Header component
      // We'll use a custom event to trigger the modal
      window.dispatchEvent(new CustomEvent('openUpgradeModal'));
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: 'زيادة الدخل',
      description: 'احصل على عملاء جدد وزد دخلك الشهري'
    },
    {
      icon: Users,
      title: 'عملاء موثوقين',
      description: 'عملاء محليين يبحثون عن خدماتك'
    },
    {
      icon: Clock,
      title: 'مرونة في العمل',
      description: 'اختر أوقاتك وأماكن عملك'
    },
    {
      icon: Shield,
      title: 'حماية كاملة',
      description: 'تأمين على العمل وضمان الجودة'
    }
  ];

  const successStories = [
    {
      name: 'أحمد محمد',
      service: 'سباكة',
      story: 'بدأت مع نافع منذ 6 أشهر، والآن أحصل على 15-20 طلب شهرياً. الدخل زاد بنسبة 300%!',
      rating: 5,
      earnings: '15,000 جنيه شهرياً'
    },
    {
      name: 'فاطمة علي',
      service: 'تنظيف',
      story: 'من خلال نافع، وجدت عملاء دائمين وأصبحت أعمل لحسابي الخاص. أحب المرونة في العمل!',
      rating: 5,
      earnings: '8,000 جنيه شهرياً'
    }
  ];

  const faqs = [
    {
      question: 'كيف يمكنني الانضمام كمحترف؟',
      answer: 'سجل حساب جديد، ثم اطلب الترقية إلى مقدم خدمات. سنراجع طلبك خلال 24-48 ساعة.'
    },
    {
      question: 'ما هي الرسوم المطلوبة؟',
      answer: 'الانضمام مجاني تماماً! نحصل على عمولة صغيرة فقط من كل خدمة مكتملة.'
    },
    {
      question: 'كيف أحصل على العملاء؟',
      answer: 'نحن نروج لخدماتك في منطقتك، ويمكنك أيضاً تحسين ملفك الشخصي لجذب المزيد من العملاء.'
    },
    {
      question: 'هل هناك ضمان على العمل؟',
      answer: 'نعم! نقدم ضمان الجودة ويمكن للعملاء طلب إصلاح مجاني إذا لم تكن راضين عن الخدمة.'
    }
  ];

  return (
    <section className="bg-deep-teal text-white font-arabic text-text-primary" id="become-a-pro">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل أنت محترف متميز؟
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            انضم إلى نافع للتواصل مع عملاء جدد في منطقتك وتنمية أعمالك.
          </p>
          <button
            onClick={handleProviderAction}
            className="btn btn-primary bg-bright-orange border-bright-orange hover:bg-bright-orange/90 hover:border-bright-orange/90 text-white text-lg font-bold h-14 px-8 mx-auto mb-8"
          >
            {isProvider ? "اعرض خدماتك" : "كن محترفًا اليوم"}
          </button>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="text-center bg-white/10 rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-bold mb-2">5K+</div>
            <div className="text-white/80">محترف نشط</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
            <div className="text-white/80">خدمة مكتملة</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-bold mb-2">4.8</div>
            <div className="text-white/80">متوسط التقييم</div>
          </div>
          <div className="text-center bg-white/10 rounded-xl p-6">
            <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
            <div className="text-white/80">رضا العملاء</div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-center mb-6">مزايا الانضمام</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-6 text-center hover:bg-white/20 transition-colors duration-300">
                <benefit.icon className="w-12 h-12 mx-auto mb-4 text-bright-orange" />
                <h4 className="text-lg font-semibold mb-2">{benefit.title}</h4>
                <p className="text-white/80 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-center mb-6">أسئلة شائعة</h3>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/10 rounded-xl overflow-hidden">
                <button
                  className="w-full p-6 text-right flex items-center justify-between hover:bg-white/20 transition-colors duration-300"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`} 
                  />
                  <span className="font-semibold">{faq.question}</span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-white/80">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Final CTA - always centered below the grid */}
        <div className="text-center mt-12">
          <div className="bg-white/10 rounded-2xl p-6 max-w-xl mx-auto">
            <h3 className="text-xl font-bold mb-2">ابدأ رحلتك مع نافع اليوم</h3>
            <p className="text-white/80 mb-4 text-sm">
              انضم إلى آلاف المحترفين الذين يحققون أحلامهم من خلال منصتنا
            </p>
            <button
              onClick={handleProviderAction}
              className="btn btn-primary bg-bright-orange border-bright-orange hover:bg-bright-orange/90 hover:border-bright-orange/90 text-white text-base font-bold px-6 py-2"
            >
              {isProvider ? "اعرض خدماتك الآن" : "انضم كمحترف"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeAPro; 