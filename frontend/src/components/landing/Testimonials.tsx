import React from 'react';

const testimonials = [
  {
    name: 'سارة',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCocCnRvkDdGQOQEU0it_kD2iys2tngpBxkTRokK9OP5VsvZ3CYqReg09SdgdNpBzlWOzB0yRLWX7GRTbWKjFpMQ_hvFpGRCeSgsqV8GuDGiTD_HGXdz41aaWrGmj8No63iXd37gbepcZDz-0uyNvJELixyGK4CqEzUr-P0AfKogs5e8pS9RpItdC9KkKb3OKTrX5MHx6wMyCSbuC0E_R-KNKTzTHkAOp0xLM5kYPLV7dGZq5-jyxE4heC3btnf6b1drZN1W65SrA',
    text: 'وجدت منظفًا رائعًا من خلال نافي. كان الإجراء سهلاً والخدمة ممتازة. محترف وموثوق جدًا!'
  },
  {
    name: 'أحمد',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK9QrS5GKpcDlhsB3OTd3mlW05IRKrZQ9LnbH9f3-cfhjrc-HfAhi7lgYRCpfnZpxa4C4jM4A4uE3oe_MHSBcjJNtDrj2vlwn5d1_3YwMf6F_2N-jL6Vf5b9Rk_uOMt6drluMY1xW1MFbLer1ELMIqHWsXCBz-XljgcTUTarjD7MNETkdUgXNWlU7bGEJ4LCl67YANrDqJ-3WBjPCVTzYbUSpqwZXhhI2nYcQMdzO_-0ErKl-hBpF95yiL28I-cHOG0Vl5kpA9Ew',
    text: 'ساعدني نافي على إيجاد سباك موثوق في دقائق عندما تسرب مغسلتي. نجاة حقيقية! سأستخدمه مرة أخرى بالتأكيد.'
  },
  {
    name: 'فاطمة',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpS_uiQBD_A4KbgeMC2ZFo6pGbjwn6EsfscAPF_mLTt8eBgRAmqNzcl62Kfl8jdn5DHS9I6ndj51468mDe-BffNkodXiWYdlMg-QkThZdgAtydC3dZTdZzBr8Z5BaLhP2wbOfQf5Z7J2CPzEOToeqdaGAL8TYBI8ZHtBCesPvaJ_1FogVzwmRe0T1Vc5A2yDzYVRl3_ZSKojgPBPSbhYTDqjsQsgQbFu49ByL4GMvz7O0uJivnO6rZqX70vDzLbvLz7bDm8arXlg',
    text: 'كنت بحاجة إلى معلم لابنتي ونافي قدم خيارات متعددة ومؤهلة للغاية. وجدنا الخيار المثالي. أوصي به بشدة!'
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white font-arabic text-text-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">ما يقوله الناس</h2>
          <p className="text-lg text-text-secondary mt-2">قصص من مجتمعنا.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card bg-warm-cream shadow-xl">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                  <div>
                    <p className="text-lg font-bold">{testimonial.name}</p>
                    <div className="flex text-bright-orange">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-text-secondary">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 