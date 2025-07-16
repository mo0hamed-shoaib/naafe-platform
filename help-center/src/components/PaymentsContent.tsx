import React from 'react';
import { ThumbsUp, ThumbsDown, CreditCard, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const PaymentsContent: React.FC = () => {
  return (
    <article className="bg-light-cream p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-text-primary mb-4">Payment Methods & Security</h1>
      <p className="text-text-secondary mb-6">Last updated: 3 hours ago</p>
      
      <div className="prose max-w-none text-text-primary">
        <p className="mb-6 leading-relaxed">
          Our platform supports multiple secure payment methods to ensure smooth transactions between 
          service providers and clients. All payments are processed through encrypted channels with 
          industry-standard security measures.
        </p>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">Accepted Payment Methods:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">Credit & Debit Cards</h4>
            </div>
            <p className="text-text-secondary mb-3">
              We accept all major credit and debit cards including Visa, Mastercard, and American Express.
            </p>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Instant processing</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">Bank Transfer</h4>
            </div>
            <p className="text-text-secondary mb-3">
              Direct bank transfers for larger transactions with lower processing fees.
            </p>
            <div className="flex items-center gap-2 text-blue-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">1-3 business days</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">Digital Wallets</h4>
            </div>
            <p className="text-text-secondary mb-3">
              PayPal, Apple Pay, Google Pay, and other popular digital wallet services.
            </p>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Secure & fast</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">Cryptocurrency</h4>
            </div>
            <p className="text-text-secondary mb-3">
              Bitcoin, Ethereum, and other major cryptocurrencies for tech-savvy users.
            </p>
            <div className="flex items-center gap-2 text-purple-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Variable processing time</span>
            </div>
          </div>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">How to Add a Payment Method:</h3>
        
        <ol className="list-decimal list-inside space-y-3 mt-4 text-text-primary">
          <li>Go to your <strong>Account Settings</strong> from the user menu</li>
          <li>Select <strong>Payment Methods</strong> from the sidebar</li>
          <li>Click <strong>Add New Payment Method</strong></li>
          <li>Choose your preferred payment type and enter the required information</li>
          <li>Verify your payment method through the confirmation process</li>
          <li>Set it as your default payment method if desired</li>
        </ol>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-green-600" />
            <h4 className="font-semibold text-lg text-green-800">Security Features</h4>
          </div>
          <ul className="text-green-700 space-y-2">
            <li>• 256-bit SSL encryption for all transactions</li>
            <li>• PCI DSS compliant payment processing</li>
            <li>• Two-factor authentication for account access</li>
            <li>• Real-time fraud detection and prevention</li>
            <li>• Secure tokenization of payment information</li>
          </ul>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">Transaction Fees:</h3>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Payment Method</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Processing Fee</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Processing Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Credit/Debit Cards</td>
                <td className="px-6 py-4 text-sm text-gray-600">2.9% + $0.30</td>
                <td className="px-6 py-4 text-sm text-gray-600">Instant</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Bank Transfer</td>
                <td className="px-6 py-4 text-sm text-gray-600">1.5%</td>
                <td className="px-6 py-4 text-sm text-gray-600">1-3 business days</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Digital Wallets</td>
                <td className="px-6 py-4 text-sm text-gray-600">2.5% + $0.25</td>
                <td className="px-6 py-4 text-sm text-gray-600">Instant</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Cryptocurrency</td>
                <td className="px-6 py-4 text-sm text-gray-600">1.0%</td>
                <td className="px-6 py-4 text-sm text-gray-600">10-60 minutes</td>
              </tr>
            </tbody>
          </table>
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

export default PaymentsContent;