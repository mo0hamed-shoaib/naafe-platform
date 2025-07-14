import React from 'react';

const BecomeAPro: React.FC = () => {
  return (
    <section className="bg-deep-teal text-white font-arabic text-text-primary" id="become-a-pro">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          هل أنت محترف متميز؟
        </h2>
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          انضم إلى نافع للتواصل مع عملاء جدد في منطقتك وتنمية أعمالك.
        </p>
        <a
          href="#"
          className="btn btn-primary bg-bright-orange border-bright-orange hover:bg-bright-orange/90 hover:border-bright-orange/90 text-white text-lg font-bold h-14 px-8 mx-auto"
        >
          كن محترفًا اليوم
        </a>
      </div>
    </section>
  );
};

export default BecomeAPro; 