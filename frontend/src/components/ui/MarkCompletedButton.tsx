import React, { useState } from 'react';
import { CheckCircle, Upload, AlertCircle } from 'lucide-react';
import Button from './Button';
import FormTextarea from './FormTextarea';
import BaseCard from './BaseCard';

interface PaymentData {
  orderId: string;
  iframeUrl: string;
  paymentKey: string;
  amount: number;
  commission: number;
  totalAmount: number;
  currency: string;
}

interface MarkCompletedButtonProps {
  jobRequestId: string;
  offerId: string;
  jobTitle: string;
  amount: number;
  onPaymentInitiated: (paymentData: PaymentData) => void;
  className?: string;
}

const MarkCompletedButton: React.FC<MarkCompletedButtonProps> = ({
  jobRequestId,
  offerId,
  jobTitle,
  amount,
  onPaymentInitiated,
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [proofImages, setProofImages] = useState<File[]>([]);
  const [completionDescription, setCompletionDescription] = useState('');

  const handleMarkCompleted = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Initiating payment...');
      console.log('📋 Request data:', { jobRequestId, offerId });

      // Create payment order
      const response = await fetch('http://localhost:3000/api/paymob/test-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobRequestId,
          offerId
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('📋 Response data:', data);

      if (!data.success) {
        throw new Error(data.error?.message || 'فشل في إنشاء طلب الدفع');
      }

      console.log('✅ Payment initiated successfully!');
      console.log('🔗 Iframe URL:', data.data.iframeUrl.substring(0, 50) + '...');

      // Call the callback with payment data
      onPaymentInitiated(data.data);
      setShowModal(false);

    } catch (error) {
      console.error('❌ Payment initiation error:', error);
      setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProofImages(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setProofImages(prev => prev.filter((_, i) => i !== index));
  };

  const commission = Math.round(amount * 0.10);
  const totalAmount = amount + commission;

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="success"
        size="lg"
        className={`w-full ${className}`}
        leftIcon={<CheckCircle className="w-5 h-5" />}
      >
        إتمام الخدمة والدفع
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl mx-4">
            <BaseCard className="relative">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-text-primary">
                    إتمام الخدمة
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Job Info */}
                <div className="p-4 bg-warm-cream rounded-lg">
                  <h3 className="font-medium text-text-primary mb-2">تفاصيل الخدمة</h3>
                  <p className="text-gray-600">{jobTitle}</p>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">المبلغ المتفق عليه: </span>
                    <span className="font-medium">{amount.toLocaleString()} جنيه مصري</span>
                  </div>
                </div>

                {/* Proof Upload */}
                <div>
                  <h3 className="font-medium text-text-primary mb-3">إثبات إتمام العمل (اختياري)</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">رفع صور لإثبات إتمام العمل</span>
                    </div>
                    
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-deep-teal file:text-white hover:file:bg-deep-teal/90"
                      title="رفع صور لإثبات إتمام العمل"
                      aria-label="رفع صور لإثبات إتمام العمل"
                    />

                    {proofImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {proofImages.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Proof ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Completion Description */}
                <div>
                  <h3 className="font-medium text-text-primary mb-3">ملاحظات إضافية (اختياري)</h3>
                  <FormTextarea
                    value={completionDescription}
                    onChange={(e) => setCompletionDescription(e.target.value)}
                    placeholder="أضف أي ملاحظات حول إتمام العمل..."
                    rows={3}
                  />
                </div>

                {/* Payment Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-text-primary mb-3">ملخص الدفع</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>مبلغ الخدمة:</span>
                      <span>{amount.toLocaleString()} جنيه مصري</span>
                    </div>
                    <div className="flex justify-between">
                      <span>عمولة المنصة (10%):</span>
                      <span>{commission.toLocaleString()} جنيه مصري</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>الإجمالي:</span>
                        <span className="text-deep-teal">{totalAmount.toLocaleString()} جنيه مصري</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleMarkCompleted}
                    variant="success"
                    loading={loading}
                    className="flex-1"
                    leftIcon={<CheckCircle className="w-5 h-5" />}
                  >
                    {loading ? 'جاري إنشاء طلب الدفع...' : 'إتمام والدفع'}
                  </Button>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      )}
    </>
  );
};

export default MarkCompletedButton; 