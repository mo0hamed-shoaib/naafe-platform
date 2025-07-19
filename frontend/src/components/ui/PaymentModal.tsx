import React, { useState } from 'react';
import Modal from '../../admin/components/UI/Modal';
import Button from './Button';
import FormInput from './FormInput';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  serviceTitle: string;
  providerName: string;
  loading?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  serviceTitle,
  providerName,
  loading = false
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
      setError('');
    }
  };

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount <= 0) {
      setError('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (numAmount < 1) {
      setError('الحد الأدنى للمبلغ هو 1 جنيه');
      return;
    }

    onConfirm(numAmount);
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="إتمام الدفع">
      <div className="space-y-6">
        {/* Service Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-text-primary">تفاصيل الخدمة</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">الخدمة:</span> {serviceTitle}</p>
            <p><span className="font-medium">مقدم الخدمة:</span> {providerName}</p>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-primary">
            مبلغ الدفع (جنيه مصري)
          </label>
          <p className="text-xs text-text-secondary">
            سيتم تحويل المبلغ إلى الدولار الأمريكي عند الدفع
          </p>
          <div className="relative">
            <FormInput
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="أدخل المبلغ"
              className="pl-10"
              disabled={loading}
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">ملاحظة مهمة:</p>
              <ul className="space-y-1 text-xs">
                <li>• سيتم توجيهك إلى صفحة دفع آمنة من Stripe</li>
                <li>• يمكنك استخدام بطاقة ائتمان تجريبية للاختبار</li>
                <li>• لن يتم خصم أي مبالغ حقيقية في وضع الاختبار</li>
                <li>• المبالغ بالجنيه المصري ستظهر بالدولار الأمريكي في صفحة الدفع</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={loading || !amount}
            className="flex-1"
          >
            {loading ? 'جاري التحميل...' : 'المتابعة للدفع'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal; 