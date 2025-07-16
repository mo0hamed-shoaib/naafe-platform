import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  HelpCenterSearch,
  HelpCenterBreadcrumb,
  HelpCenterCategories,
  RelatedArticles,
  HelpCenterChat,
  GettingStartedContent,
  VerificationContent,
  PaymentsContent,
  PlatformRulesContent
} from '../components/help-center';
import { useHelpCenter, HelpSection } from '../hooks/useHelpCenter';

const HelpCenterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get('section') as HelpSection;
  
  const {
    activeSection,
    searchQuery,
    setActiveSection,
    setSearchQuery,
    getBreadcrumbItems,
    getRelatedArticles
  } = useHelpCenter(sectionParam || 'Getting Started');

  // Sync URL with active section when it changes
  useEffect(() => {
    if (sectionParam !== activeSection) {
      setSearchParams({ section: activeSection });
    }
  }, [activeSection, setSearchParams]);

  const renderContent = () => {
    switch (activeSection) {
      case 'Getting Started':
        return <GettingStartedContent />;
      case 'Verification':
        return <VerificationContent />;
      case 'Payments':
        return <PaymentsContent />;
      case 'Platform Rules':
        return <PlatformRulesContent />;
      default:
        return <GettingStartedContent />;
    }
  };

  const handleSectionSelect = (section: HelpSection) => {
    setActiveSection(section);
  };

  const breadcrumbItems = getBreadcrumbItems();
  const relatedArticles = getRelatedArticles();

  return (
    <div className="min-h-screen bg-warm-cream" dir="rtl">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex-1 max-w-lg">
                <HelpCenterSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="البحث في مركز المساعدة..."
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Link 
                  to="/" 
                  className="text-text-secondary hover:text-deep-teal transition-colors duration-300 font-medium"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </div>
            
            <HelpCenterBreadcrumb items={breadcrumbItems} />
          </header>

          {/* Content */}
          {activeSection === 'Getting Started' && searchQuery === '' ? (
            <HelpCenterCategories onSectionSelect={handleSectionSelect} />
          ) : (
            <>
              {renderContent()}
              <RelatedArticles articles={relatedArticles} />
            </>
          )}
        </div>
      </main>
      
      <HelpCenterChat />
      <Footer />
    </div>
  );
};

export default HelpCenterPage; 