import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../components/layout/PageLayout';
import BaseCard from '../components/ui/BaseCard';
import Button from '../components/ui/Button';
import PaymentModal from '../components/ui/PaymentModal';
import MarkCompletedButton from '../components/ui/MarkCompletedButton';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentData {
  orderId: string;
  iframeUrl: string;
  paymentKey: string;
  amount: number;
  commission: number;
  totalAmount: number;
  currency: string;
}

const PaymentTestPage: React.FC = () => {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const handlePaymentInitiated = (data: PaymentData) => {
    addTestResult('✅ Payment initiated successfully');
    addTestResult(`📋 Order ID: ${data.orderId}`);
    addTestResult(`💰 Amount: ${data.amount} ${data.currency}`);
    addTestResult(`💳 Commission: ${data.commission} ${data.currency}`);
    addTestResult(`💵 Total: ${data.totalAmount} ${data.currency}`);
    addTestResult(`🔗 Iframe URL: ${data.iframeUrl.substring(0, 50)}...`);
    
    setPaymentData(data);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    addTestResult('🎉 Payment completed successfully!');
    setShowPaymentModal(false);
  };

  const handlePaymentFailure = () => {
    addTestResult('❌ Payment failed');
    setShowPaymentModal(false);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'اختبار الدفع', active: true }
  ];

  return (
    <PageLayout
      title="اختبار نظام الدفع"
      subtitle="تجربة تكامل Paymob"
      breadcrumbItems={breadcrumbItems}
      user={user}
      onLogout={() => {}}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Test Information */}
        <BaseCard>
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-deep-teal" />
            <h2 className="text-xl font-semibold text-text-primary">معلومات الاختبار</h2>
          </div>
          <div className="space-y-3 text-sm text-text-secondary">
            <p>• هذا الصفحة لاختبار تكامل Paymob مع النظام</p>
            <p>• سيتم إنشاء طلب دفع تجريبي بقيمة 500 جنيه مصري</p>
            <p>• عمولة المنصة: 50 جنيه مصري (10%)</p>
            <p>• الإجمالي: 550 جنيه مصري</p>
            <p>• سيتم فتح نافذة الدفع في iframe</p>
          </div>
        </BaseCard>

        {/* Test Controls */}
        <BaseCard>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-text-primary">بدء الاختبار</h2>
          </div>
          
          <div className="space-y-4">
            <MarkCompletedButton
              jobRequestId="test_job_request_123"
              offerId="test_offer_456"
              jobTitle="خدمة تجريبية - اختبار الدفع"
              amount={500}
              onPaymentInitiated={handlePaymentInitiated}
            />
            
            <div className="flex gap-3">
              <Button
                onClick={clearTestResults}
                variant="outline"
                size="sm"
              >
                مسح النتائج
              </Button>
              
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                إعادة تحميل الصفحة
              </Button>
            </div>
          </div>
        </BaseCard>

        {/* Test Results */}
        <BaseCard>
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-text-primary">نتائج الاختبار</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-text-secondary text-center py-8">
                لم يتم إجراء أي اختبارات بعد
              </p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </BaseCard>

        {/* Instructions */}
        <BaseCard>
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-text-primary">تعليمات الاختبار</h2>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">خطوات الاختبار:</h4>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>اضغط على زر "إتمام الخدمة والدفع"</li>
                <li>ستظهر نافذة لتأكيد تفاصيل الخدمة</li>
                <li>اضغط على "إتمام والدفع" لإنشاء طلب الدفع</li>
                <li>ستفتح نافذة الدفع مع Paymob iframe</li>
                <li>يمكنك تجربة الدفع باستخدام بيانات الاختبار</li>
                <li>راقب نتائج الاختبار في الأسفل</li>
              </ol>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">بيانات الاختبار:</h4>
              <div className="text-green-700 space-y-1">
                <p>• رقم البطاقة: 4111 1111 1111 1111</p>
                <p>• تاريخ الانتهاء: أي تاريخ مستقبلي</p>
                <p>• رمز الأمان: أي 3 أرقام</p>
                <p>• اسم حامل البطاقة: أي اسم</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && paymentData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          iframeUrl={paymentData.iframeUrl}
          orderId={paymentData.orderId}
          amount={paymentData.amount}
          commission={paymentData.commission}
          totalAmount={paymentData.totalAmount}
          currency={paymentData.currency}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}
    </PageLayout>
  );
};

export default PaymentTestPage; 