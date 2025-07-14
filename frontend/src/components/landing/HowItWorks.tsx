import React from 'react';

const steps = [
  {
    icon: (
      <svg fill="currentColor" className="w-9 h-9" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
      </svg>
    ),
    title: "1. ابحث عن محترف",
    description: "ابحث حسب الخدمة والموقع للعثور على المحترف المناسب لعملك.",
  },
  {
    icon: (
      <svg fill="currentColor" className="w-9 h-9" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z" />
      </svg>
    ),
    title: "2. ناقش احتياجاتك",
    description: "تواصل مباشرة مع المحترفين لشرح متطلباتك واستلام عرض سعر.",
  },
  {
    icon: (
      <svg fill="currentColor" className="w-9 h-9" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
      </svg>
    ),
    title: "3. احصل على الخدمة",
    description: "استأجر المحترف الذي تختاره واستمتع بخدمة عالية الجودة.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white font-arabic text-text-primary" id="how-it-works">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">كيف يعمل</h2>
          <p className="text-lg text-text-secondary mt-2">خطوات بسيطة لإنجاز الأمور.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="card bg-warm-cream shadow-xl hover:scale-105 transition-transform">
              <div className="card-body items-center text-center">
                <div className="p-4 bg-deep-teal text-white rounded-full mb-4">{step.icon}</div>
                <h3 className="card-title text-xl font-bold">{step.title}</h3>
                <p className="text-text-secondary">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 