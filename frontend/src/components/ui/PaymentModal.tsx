import React, { useEffect, useState } from 'react';
import { X, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import Button from './Button';
import BaseCard from './BaseCard';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  iframeUrl: string;
  orderId: string;
  amount: number;
  commission: number;
  totalAmount: number;
  currency: string;
  onPaymentSuccess?: () => void;
  onPaymentFailure?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  iframeUrl,
  orderId,
  amount,
  commission,
  totalAmount,
  currency,
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('pending');
      setError('');
    }
  }, [isOpen]);

  const handlePaymentSuccess = () => {
    setPaymentStatus('completed');
    onPaymentSuccess?.();
  };

  const handlePaymentFailure = () => {
    setPaymentStatus('failed');
    setError('فشل في إتمام عملية الدفع');
    onPaymentFailure?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <BaseCard className="relative h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-deep-teal" />
              <h2 className="text-xl font-semibold text-text-primary">
                إتمام الدفع
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Payment Status */}
          {paymentStatus !== 'pending' && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {paymentStatus === 'processing' && (
                  <div className="w-5 h-5 border-2 border-deep-teal border-t-transparent rounded-full animate-spin" />
                )}
                {paymentStatus === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {paymentStatus === 'failed' && (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {paymentStatus === 'processing' && 'جاري معالجة الدفع...'}
                  {paymentStatus === 'completed' && 'تم إتمام الدفع بنجاح'}
                  {paymentStatus === 'failed' && 'فشل في إتمام الدفع'}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-6 mt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">تفاصيل الطلب</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>رقم الطلب:</span>
                    <span className="font-medium">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المبلغ:</span>
                    <span className="font-medium">{amount} {currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>عمولة المنصة:</span>
                    <span className="font-medium">{commission} {currency}</span>
                  </div>
                  <div className="flex justify-between text-deep-teal font-semibold">
                    <span>الإجمالي:</span>
                    <span>{totalAmount} {currency}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">معلومات الدفع</h3>
                <div className="text-sm text-gray-600">
                  <p>سيتم توجيهك إلى صفحة الدفع الآمنة</p>
                  <p>يمكنك استخدام البطاقات الائتمانية أو المحافظ الإلكترونية</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="flex-1 p-6">
            {paymentStatus === 'pending' || paymentStatus === 'processing' ? (
              <div className="w-full h-96 border border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-deep-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    جاري تحضير صفحة الدفع...
                  </h3>
                  <p className="text-text-secondary">
                    سيتم فتح صفحة الدفع في نافذة جديدة
                  </p>
                                    <div className="space-y-2">
                    <Button
                      onClick={() => {
                        console.log('🔗 Opening Paymob URL:', iframeUrl);
                        setPaymentStatus('processing');
                        window.open(iframeUrl, '_blank', 'width=800,height=600');
                      }}
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      فتح صفحة الدفع في نافذة جديدة
                    </Button>
                    
                    <Button
                      onClick={() => {
                        console.log('🔗 Redirecting to Paymob URL:', iframeUrl);
                        setPaymentStatus('processing');
                        window.location.href = iframeUrl;
                      }}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      الانتقال لصفحة الدفع مباشرة
                    </Button>
                    
                    {/* Test buttons for development */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={handlePaymentSuccess}
                        variant="success"
                        size="sm"
                      >
                        محاكاة نجاح الدفع
                      </Button>
                      <Button
                        onClick={handlePaymentFailure}
                        variant="outline"
                        size="sm"
                      >
                        محاكاة فشل الدفع
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : paymentStatus === 'completed' ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  تم إتمام الدفع بنجاح
                </h3>
                <p className="text-gray-600 mb-6">
                  شكراً لك! تم إتمام عملية الدفع وسيتم إشعار مقدم الخدمة
                </p>
                <Button onClick={onClose} variant="primary">
                  إغلاق
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle className="w-16 h-16 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  فشل في إتمام الدفع
                </h3>
                <p className="text-gray-600 mb-6">
                  حدث خطأ أثناء عملية الدفع. يرجى المحاولة مرة أخرى
                </p>
                <div className="flex gap-3">
                  <Button onClick={onClose} variant="outline">
                    إغلاق
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="primary">
                    إعادة المحاولة
                  </Button>
                </div>
              </div>
            )}
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

export default PaymentModal; 