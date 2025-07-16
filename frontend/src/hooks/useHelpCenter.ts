import { useState, useCallback, useEffect } from 'react';

export type HelpSection = 'Getting Started' | 'Verification' | 'Payments' | 'Platform Rules';

interface HelpCenterState {
  activeSection: HelpSection;
  searchQuery: string;
}

export const useHelpCenter = (initialSection: HelpSection = 'Getting Started') => {
  const [state, setState] = useState<HelpCenterState>({
    activeSection: initialSection,
    searchQuery: ''
  });

  // Update active section when initialSection changes (from URL)
  useEffect(() => {
    if (initialSection && initialSection !== state.activeSection) {
      setState(prev => ({ ...prev, activeSection: initialSection }));
    }
  }, [initialSection]);

  const setActiveSection = useCallback((section: HelpSection) => {
    setState(prev => ({ ...prev, activeSection: section }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const getBreadcrumbItems = useCallback(() => {
    const baseItems = [{ label: 'مركز المساعدة', href: '/help' }];
    
    switch (state.activeSection) {
      case 'Getting Started':
        return [
          ...baseItems,
          { label: 'البداية', href: '/help?section=Getting Started' },
          { label: 'دليل البدء' }
        ];
      case 'Payments':
        return [
          ...baseItems,
          { label: 'المدفوعات', href: '/help?section=Payments' },
          { label: 'طرق الدفع والأمان' }
        ];
      case 'Platform Rules':
        return [
          ...baseItems,
          { label: 'قواعد المنصة', href: '/help?section=Platform Rules' },
          { label: 'القواعد والإرشادات' }
        ];
      default:
        return [
          ...baseItems,
          { label: 'التحقق', href: '/help?section=Verification' },
          { label: 'كيفية التحقق من الهوية' }
        ];
    }
  }, [state.activeSection]);

  const getRelatedArticles = useCallback(() => {
    switch (state.activeSection) {
      case 'Getting Started':
        return [
          {
            title: "كيفية إكمال ملفك الشخصي",
            description: "دليل خطوة بخطوة لإعداد ملفك الشخصي للحصول على أقصى وضوح.",
            href: "/help?section=Verification"
          },
          {
            title: "فهم ميزات منصتنا",
            description: "تعرف على جميع الأدوات والميزات المتاحة لمساعدتك على النجاح.",
            href: "/help?section=Platform Rules"
          }
        ];
      case 'Payments':
        return [
          {
            title: "كيفية سحب أرباحك",
            description: "تعرف على طرق السحب وأوقات المعالجة والرسوم.",
            href: "/help?section=Payments"
          },
          {
            title: "فهم رسوم المعاملات",
            description: "تفصيل شامل لجميع الرسوم المرتبطة بطرق الدفع المختلفة.",
            href: "/help?section=Payments"
          }
        ];
      case 'Platform Rules':
        return [
          {
            title: "كيفية الإبلاغ عن مستخدم",
            description: "دليل خطوة بخطوة للإبلاغ عن الانتهاكات والسلوك غير المناسب.",
            href: "/help?section=Platform Rules"
          },
          {
            title: "عملية الاستئناف لتقييد الحساب",
            description: "تعرف على كيفية استئناف تقييد الحساب وتقديم الأدلة الداعمة.",
            href: "/help?section=Platform Rules"
          }
        ];
      default:
        return [
          {
            title: "ما هي أشكال الهوية المقبولة؟",
            description: "تعرف على أنواع مختلفة من وثائق الهوية التي نقبلها للتحقق.",
            href: "/help?section=Verification"
          },
          {
            title: "لماذا تم رفض التحقق مني؟",
            description: "افهم الأسباب الشائعة لفشل التحقق وكيفية حلها.",
            href: "/help?section=Verification"
          }
        ];
    }
  }, [state.activeSection]);

  return {
    activeSection: state.activeSection,
    searchQuery: state.searchQuery,
    setActiveSection,
    setSearchQuery,
    getBreadcrumbItems,
    getRelatedArticles
  };
}; 