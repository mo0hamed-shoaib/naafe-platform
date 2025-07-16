import React from 'react';
import { Lightbulb, Shield, CreditCard, Sun } from 'lucide-react';
import { HelpSection } from '../../hooks/useHelpCenter';
import HelpCenterCard from './HelpCenterCard';

interface HelpCenterCategoriesProps {
  onSectionSelect: (section: HelpSection) => void;
  className?: string;
}

const HelpCenterCategories: React.FC<HelpCenterCategoriesProps> = ({
  onSectionSelect,
  className
}) => {
  const categories = [
    {
      title: 'البداية',
      description: 'دليل شامل للبدء في استخدام منصتنا والاستفادة من جميع الميزات المتاحة',
      icon: Lightbulb,
      section: 'Getting Started' as HelpSection
    },
    {
      title: 'التحقق',
      description: 'تعرف على كيفية التحقق من هويتك وبناء الثقة مع المستخدمين الآخرين',
      icon: Shield,
      section: 'Verification' as HelpSection
    },
    {
      title: 'المدفوعات',
      description: 'طرق الدفع الآمنة وكيفية إدارة المعاملات المالية على المنصة',
      icon: CreditCard,
      section: 'Payments' as HelpSection
    },
    {
      title: 'قواعد المنصة',
      description: 'إرشادات المجتمع والقواعد المهمة لضمان تجربة آمنة وإيجابية',
      icon: Sun,
      section: 'Platform Rules' as HelpSection
    }
  ];

  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
          كيف يمكننا مساعدتك؟
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          اختر الموضوع الذي تريد معرفة المزيد عنه أو استخدم البحث للعثور على إجابات سريعة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <HelpCenterCard
            key={category.section}
            title={category.title}
            description={category.description}
            icon={category.icon}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSectionSelect(category.section);
            }}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-text-secondary mb-4">
          لا تجد ما تبحث عنه؟
        </p>
        <button
          className="inline-flex items-center gap-2 px-6 py-3 bg-deep-teal text-white rounded-full hover:bg-deep-teal/90 transition-colors duration-300 font-medium"
          onClick={() => onSectionSelect('Getting Started')}
        >
          تواصل مع الدعم
        </button>
      </div>
    </section>
  );
};

export default HelpCenterCategories; 