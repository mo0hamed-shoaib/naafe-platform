import React from 'react';
import { ThumbsUp, ThumbsDown, AlertTriangle, Shield, Users, MessageSquare, Star } from 'lucide-react';

const PlatformRulesContent: React.FC = () => {
  return (
    <article className="bg-light-cream p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-text-primary mb-4">Platform Rules & Guidelines</h1>
      <p className="text-text-secondary mb-6">Last updated: 1 week ago</p>
      
      <div className="prose max-w-none text-text-primary">
        <p className="mb-6 leading-relaxed">
          Our platform thrives on trust, respect, and professionalism. These rules ensure a safe and 
          positive experience for all users. By using our platform, you agree to follow these guidelines 
          and help maintain our community standards.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h4 className="font-semibold text-lg text-red-800">Important Notice</h4>
          </div>
          <p className="text-red-700">
            Violation of these rules may result in account suspension or permanent ban from the platform. 
            Please read carefully and ensure compliance at all times.
          </p>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">Core Community Guidelines:</h3>
        
        <div className="space-y-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">Respect & Professionalism</h4>
            </div>
            <ul className="text-text-secondary space-y-2">
              <li>• Treat all users with respect and courtesy</li>
              <li>• Use professional language in all communications</li>
              <li>• No harassment, discrimination, or hate speech</li>
              <li>• Respect cultural and religious differences</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">Account Security</h4>
            </div>
            <ul className="text-text-secondary space-y-2">
              <li>• One account per person - no duplicate accounts</li>
              <li>• Provide accurate and truthful information</li>
              <li>• Keep your login credentials secure</li>
              <li>• Report suspicious activity immediately</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">Communication Standards</h4>
            </div>
            <ul className="text-text-secondary space-y-2">
              <li>• Use the platform's messaging system for all communications</li>
              <li>• No sharing of personal contact information in public</li>
              <li>• Respond to messages within 24 hours when possible</li>
              <li>• No spam, promotional content, or unsolicited messages</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">Service Quality</h4>
            </div>
            <ul className="text-text-secondary space-y-2">
              <li>• Deliver services as described and agreed upon</li>
              <li>• Meet deadlines and communicate any delays promptly</li>
              <li>• Provide honest and constructive feedback</li>
              <li>• No fake reviews or rating manipulation</li>
            </ul>
          </div>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">Prohibited Activities:</h3>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
          <ul className="text-red-700 space-y-3">
            <li>• <strong>Fraud or Scams:</strong> Any attempt to deceive or defraud other users</li>
            <li>• <strong>Illegal Activities:</strong> Using the platform for any illegal purposes</li>
            <li>• <strong>Intellectual Property Violation:</strong> Using copyrighted material without permission</li>
            <li>• <strong>Off-Platform Transactions:</strong> Conducting business outside our secure payment system</li>
            <li>• <strong>Account Manipulation:</strong> Creating fake accounts or manipulating ratings</li>
            <li>• <strong>Inappropriate Content:</strong> Sharing offensive, explicit, or harmful content</li>
          </ul>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">Reporting & Enforcement:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 className="font-semibold text-lg mb-3">How to Report Violations</h4>
            <ol className="text-text-secondary space-y-2 list-decimal list-inside">
              <li>Click the "Report" button on the user's profile</li>
              <li>Select the type of violation from the dropdown</li>
              <li>Provide detailed description and evidence</li>
              <li>Submit the report for review</li>
            </ol>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 className="font-semibold text-lg mb-3">Enforcement Actions</h4>
            <ul className="text-text-secondary space-y-2">
              <li>• <strong>Warning:</strong> First-time minor violations</li>
              <li>• <strong>Temporary Suspension:</strong> Repeated violations</li>
              <li>• <strong>Account Restriction:</strong> Limited platform access</li>
              <li>• <strong>Permanent Ban:</strong> Serious or repeated violations</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h4 className="font-semibold text-lg text-blue-800 mb-3">Appeals Process</h4>
          <p className="text-blue-700">
            If you believe your account was unfairly restricted, you can submit an appeal through our 
            support center within 30 days of the action. Include all relevant information and evidence 
            to support your case.
          </p>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">Best Practices:</h3>
        
        <ul className="list-disc list-inside space-y-3 mt-4 text-text-primary">
          <li>Complete your profile with accurate information and a professional photo</li>
          <li>Verify your identity to build trust with other users</li>
          <li>Maintain a high response rate and quality service delivery</li>
          <li>Use clear, detailed service descriptions and fair pricing</li>
          <li>Communicate openly and honestly with clients and service providers</li>
          <li>Leave constructive feedback to help improve the community</li>
        </ul>
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

export default PlatformRulesContent;