import React, { useState } from 'react';
import Button from '../components/ui/Button';

const PaymobDirectTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const testPaymobUrl = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/paymob/test-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobRequestId: 'test_job_123',
          offerId: 'test_offer_456'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setUrl(data.data.iframeUrl);
        console.log('🔗 Paymob URL:', data.data.iframeUrl);
      } else {
        console.error('❌ Failed to get Paymob URL:', data.message);
      }
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPaymobUrl = () => {
    if (url) {
      console.log('🔗 Opening Paymob URL:', url);
      window.open(url, '_blank', 'width=800,height=600');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] to-[#FDF8F0] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-[#2D5D4F] mb-6 text-center">
            اختبار Paymob المباشر
          </h1>
          
          <div className="space-y-4">
            <Button
              onClick={testPaymobUrl}
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {loading ? 'جاري إنشاء رابط الدفع...' : 'إنشاء رابط الدفع'}
            </Button>

            {url && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-[#2D5D4F] mb-2">رابط الدفع:</h3>
                  <p className="text-sm text-gray-600 break-all">{url}</p>
                </div>

                <Button
                  onClick={openPaymobUrl}
                  variant="success"
                  size="lg"
                  className="w-full"
                >
                  فتح صفحة الدفع
                </Button>

                <Button
                  onClick={() => window.location.href = url}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  الانتقال لصفحة الدفع مباشرة
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">تعليمات الاختبار:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• اضغط على "إنشاء رابط الدفع"</li>
              <li>• اضغط على "فتح صفحة الدفع" لفتحها في نافذة جديدة</li>
              <li>• أو اضغط على "الانتقال لصفحة الدفع مباشرة" للانتقال المباشر</li>
              <li>• استخدم بطاقة الاختبار: 4111 1111 1111 1111</li>
              <li>• تحقق من وحدة التحكم للأخطاء</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymobDirectTest; 