import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const ArticleContent: React.FC = () => {
  return (
    <article className="bg-light-cream p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-text-primary mb-4">How to verify identity</h1>
      <p className="text-text-secondary mb-6">Last updated: 2 days ago</p>
      
      <div className="prose max-w-none text-text-primary">
        <p className="mb-6 leading-relaxed">
          Verifying your identity is a crucial step to ensure the security and trustworthiness of our
          marketplace. It helps us protect your account from unauthorized access and enables features that
          require a higher level of trust.
        </p>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">Steps to verify your identity:</h3>
        
        <ol className="list-decimal list-inside space-y-3 mt-4 text-text-primary">
          <li>Navigate to your <strong>Profile Settings</strong>.</li>
          <li>Click on the <strong>Verification</strong> tab.</li>
          <li>Follow the on-screen instructions to upload a clear image of a valid government-issued ID
              (e.g., passport, national ID card, driver's license).</li>
          <li>You may also be asked to take a selfie to match with your ID photo.</li>
        </ol>
        
        <p className="mt-6 text-text-primary leading-relaxed">
          Our team will review your submission, which typically takes between 5-10 minutes.
          You will receive an email notification once the process is complete.
        </p>
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

export default ArticleContent;