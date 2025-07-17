import React from 'react';
import { ThumbsUp, ThumbsDown, User, Shield, CreditCard, MessageCircle } from 'lucide-react';

const GettingStartedContent: React.FC = () => {
  return (
    <article className="bg-light-cream p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-text-primary mb-4">Getting Started Guide</h1>
      <p className="text-text-secondary mb-6">Last updated: 1 day ago</p>
      
      <div className="prose max-w-none text-text-primary">
        <p className="mb-6 leading-relaxed">
          Welcome to our platform! This comprehensive guide will help you get started and make the most 
          of your experience. Follow these steps to set up your account and begin using our services.
        </p>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">Quick Setup Steps:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">1. Complete Your Profile</h4>
            </div>
            <p className="text-text-secondary">
              Add your personal information, profile picture, and contact details to build trust with other users.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">2. Verify Your Identity</h4>
            </div>
            <p className="text-text-secondary">
              Upload a government-issued ID to unlock all platform features and increase your credibility.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">3. Set Up Payments</h4>
            </div>
            <p className="text-text-secondary">
              Add your payment methods and banking information for seamless transactions.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">4. Start Connecting</h4>
            </div>
            <p className="text-text-secondary">
              Browse services, connect with providers, and begin your journey on our platform.
            </p>
          </div>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">Important Tips:</h3>
        
        <ul className="list-disc list-inside space-y-3 mt-4 text-text-primary">
          <li>Keep your profile information up to date for better visibility</li>
          <li>Read our platform rules to understand community guidelines</li>
          <li>Use our messaging system for all communications</li>
          <li>Report any suspicious activity to our support team</li>
          <li>Take advantage of our customer support if you need help</li>
        </ul>
        
        <div className="bg-bright-orange/10 border border-bright-orange/20 rounded-xl p-6 mt-8">
          <h4 className="font-semibold text-lg text-text-primary mb-2">Need Help?</h4>
          <p className="text-text-secondary">
            Our support team is available 24/7 to assist you. Use the chat widget in the bottom right 
            corner or visit our support center for immediate assistance.
          </p>
        </div>
      </div>
      
      <div className="mt-10 border-t border-gray-200 pt-6">
        <p className="text-center text-text-secondary font-medium mb-4">Was this helpful?</p>
        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-sm">
            <ThumbsUp className="w-5 h-5 text-green-500" />
            <span className="font-medium">Yes</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-sm">
            <ThumbsDown className="w-5 h-5 text-red-500" />
            <span className="font-medium">No</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default GettingStartedContent;