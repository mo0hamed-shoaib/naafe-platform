import React, { useState } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: (
      <svg fill="currentColor" className="w-9 h-9" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
      </svg>
    ),
    title: "1. ابحث عن محترف",
    description: "ابحث حسب الخدمة والموقع للعثور على المحترف المناسب لعملك.",
    details: "استخدم فلاتر متقدمة للبحث حسب الموقع، السعر، التقييم، والخدمات المطلوبة. تصفح الملفات الشخصية والمراجعات لاختيار الأفضل.",
    testimonial: "وجدت سباك ممتاز في دقائق! البحث كان سهل جداً."
  },
  {
    icon: (
      <svg fill="currentColor" className="w-9 h-9" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z" />
      </svg>
    ),
    title: "2. ناقش احتياجاتك",
    description: "تواصل مباشرة مع المحترفين لشرح متطلباتك واستلام عرض سعر.",
    details: "تواصل مباشرة عبر الرسائل أو المكالمات. شارك الصور والتفاصيل، واحصل على عروض أسعار مفصلة مع الجدول الزمني.",
    testimonial: "التواصل كان سلس ومريح. حصلت على 3 عروض ممتازة!"
  },
  {
    icon: (
      <svg fill="currentColor" className="w-9 h-9" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
      </svg>
    ),
    title: "3. احصل على الخدمة",
    description: "استأجر المحترف الذي تختاره واستمتع بخدمة عالية الجودة.",
    details: "اختر العرض المناسب، ادفع بأمان، وتابع العمل حتى الانتهاء. احصل على ضمان الجودة وخدمة ما بعد البيع.",
    testimonial: "الخدمة كانت احترافية وممتازة. سأستخدم نافع مرة أخرى!"
  },
];

const HowItWorks: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24 bg-white font-arabic text-text-primary" id="how-it-works">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">كيف يعمل</h2>
          <p className="text-lg text-text-secondary mt-2">خطوات بسيطة لإنجاز الأمور.</p>
        </div>
        
        {/* Progress Bar */}
        <div className="relative mb-12">
          {/* Single horizontal line behind all steps */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 z-0" style={{ transform: 'translateY(-50%)' }} />
          <div className="flex justify-between items-center relative z-10">
            {steps.map((_, index) => (
              <div key={index} className="flex flex-col items-center w-1/3">
                <div className="w-12 h-12 bg-deep-teal text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="card bg-warm-cream shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setExpandedStep(expandedStep === index ? null : index)}
            >
              <div className="card-body items-center text-center p-6">
                <div className="p-4 bg-deep-teal text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-deep-teal/90">
                  {step.icon}
                </div>
                <h3 className="card-title text-xl font-bold group-hover:text-deep-teal transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-text-secondary mb-4">{step.description}</p>
                
                {/* Expandable Details */}
                {expandedStep === index && (
                  <div className="w-full mt-4 p-4 bg-white rounded-lg border border-deep-teal/20">
                    <p className="text-text-primary text-sm leading-relaxed mb-3">
                      {step.details}
                    </p>
                    <div className="flex items-center gap-2 text-accent text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span className="italic">{step.testimonial}</span>
                    </div>
                  </div>
                )}
                
                {/* Expand/Collapse Indicator */}
                <div className="mt-2 flex items-center gap-1 text-deep-teal text-sm">
                  <span>{expandedStep === index ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</span>
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform duration-300 ${expandedStep === index ? 'rotate-90' : ''}`} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Success Statistics */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-deep-teal mb-2">10K+</div>
              <div className="text-text-secondary">خدمة مكتملة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-deep-teal mb-2">5K+</div>
              <div className="text-text-secondary">محترف موثوق</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-deep-teal mb-2">98%</div>
              <div className="text-text-secondary">رضا العملاء</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-deep-teal mb-2">24/7</div>
              <div className="text-text-secondary">دعم متواصل</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 