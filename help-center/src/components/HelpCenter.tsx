import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import ArticleContent from './ArticleContent';
import GettingStartedContent from './GettingStartedContent';
import PaymentsContent from './PaymentsContent';
import PlatformRulesContent from './PlatformRulesContent';
import RelatedArticles from './RelatedArticles';
import ChatBot from './ChatBot';

interface HelpCenterProps {
  activeSection?: string;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ activeSection: initialActiveSection = 'Verification' }) => {
  const [activeSection, setActiveSection] = useState(initialActiveSection);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const getBreadcrumbItems = () => {
    const baseItems = [{ label: 'Help Center', href: '#' }];
    
    switch (activeSection) {
      case 'Getting Started':
        return [
          ...baseItems,
          { label: 'Getting Started', href: '#' },
          { label: 'Getting Started Guide' }
        ];
      case 'Payments':
        return [
          ...baseItems,
          { label: 'Payments', href: '#' },
          { label: 'Payment Methods & Security' }
        ];
      case 'Platform Rules':
        return [
          ...baseItems,
          { label: 'Platform Rules', href: '#' },
          { label: 'Platform Rules & Guidelines' }
        ];
      default:
        return [
          ...baseItems,
          { label: 'Verification', href: '#' },
          { label: 'How to verify identity' }
        ];
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Getting Started':
        return <GettingStartedContent />;
      case 'Payments':
        return <PaymentsContent />;
      case 'Platform Rules':
        return <PlatformRulesContent />;
      default:
        return <ArticleContent />;
    }
  };

  const getRelatedArticles = () => {
    switch (activeSection) {
      case 'Getting Started':
        return [
          {
            title: "How to complete your profile",
            description: "Step-by-step guide to setting up your profile for maximum visibility.",
            href: "#"
          },
          {
            title: "Understanding our platform features",
            description: "Learn about all the tools and features available to help you succeed.",
            href: "#"
          }
        ];
      case 'Payments':
        return [
          {
            title: "How to withdraw your earnings",
            description: "Learn about withdrawal methods, processing times, and fees.",
            href: "#"
          },
          {
            title: "Understanding transaction fees",
            description: "Detailed breakdown of all fees associated with different payment methods.",
            href: "#"
          }
        ];
      case 'Platform Rules':
        return [
          {
            title: "How to report a user",
            description: "Step-by-step guide on reporting violations and inappropriate behavior.",
            href: "#"
          },
          {
            title: "Appeal process for account restrictions",
            description: "Learn how to appeal account restrictions and provide supporting evidence.",
            href: "#"
          }
        ];
      default:
        return [
          {
            title: "What are accepted forms of ID?",
            description: "Learn about the different types of identification documents we accept for verification.",
            href: "#"
          },
          {
            title: "Why was my verification rejected?",
            description: "Understand common reasons for verification failure and how to resolve them.",
            href: "#"
          }
        ];
    }
  };

  const breadcrumbItems = getBreadcrumbItems();
  const relatedArticles = getRelatedArticles();

  return (
    <div className="flex h-screen bg-warm-cream">
      <Sidebar activeItem={activeSection} onItemClick={handleSectionChange} />
      
      <main className="flex-1 lg:ml-64 p-8 overflow-y-auto">
        <Header />
        
        <Breadcrumb items={breadcrumbItems} />
        
        {renderContent()}
        
        <RelatedArticles articles={relatedArticles} />
      </main>
      
      <ChatBot />
    </div>
  );
};

export default HelpCenter;